class RaycastSystem {
	constructor() {
		this.showRaycast = true;
		this.raycastLine = null;
	}

	toggle() {
		this.showRaycast = !this.showRaycast;
		if (!this.showRaycast && this.raycastLine) {
			this.raycastLine.remove();
			this.raycastLine = null;
		}
	}

	clear() {
		if (this.raycastLine) {
			this.raycastLine.remove();
			this.raycastLine = null;
		}
	}

	hide() {
		if (this.raycastLine) {
			this.raycastLine.style.display = 'none';
		}
	}

	update(aiManager, ballPhysics) {
		if (!aiManager || !aiManager.shouldShowRaycast()) {
			if (this.showRaycast && this.raycastLine) {
				this.raycastLine.style.display = 'none';
			}
			return null;
		}

		let trajectoryPoints = aiManager.getLastTrajectory();

		if (!trajectoryPoints) {
			return null;
		}

		const velocity = ballPhysics.getVelocity();
		let ballHorizontalDirection = velocity.dxd == 0 ? -1 : 1;
		if (ballHorizontalDirection <= 0) {
			if (this.showRaycast && this.raycastLine) {
				this.raycastLine.style.display = 'none';
			}
			return null;
		}

		if (this.showRaycast && this.raycastLine) {
			this.raycastLine.style.display = 'block';
		}

		if (this.showRaycast) {
			this.updateVisualization(trajectoryPoints);
		}

		return trajectoryPoints[trajectoryPoints.length - 1].y;
	}

	updateVisualization(trajectoryPoints) {
		if (this.raycastLine) {
			this.raycastLine.remove();
		}

		this.raycastLine = document.createElementNS(
			'http://www.w3.org/2000/svg',
			'svg'
		);
		this.raycastLine.style.position = 'absolute';
		this.raycastLine.style.top = '0';
		this.raycastLine.style.left = '0';
		this.raycastLine.style.width = '100%';
		this.raycastLine.style.height = '100%';
		this.raycastLine.style.pointerEvents = 'none';
		this.raycastLine.style.zIndex = '1000';
		this.raycastLine.style.opacity = '0.5';

		let path = document.createElementNS(
			'http://www.w3.org/2000/svg',
			'path'
		);
		let pathData = '';

		trajectoryPoints.forEach((point, index) => {
			if (index === 0) {
				pathData += `M ${point.x} ${point.y}`;
			} else {
				pathData += ` L ${point.x} ${point.y}`;
			}
		});

		path.setAttribute('d', pathData);
		path.setAttribute('stroke', '#00ff00');
		path.setAttribute('stroke-width', '2');
		path.setAttribute('fill', 'none');
		path.setAttribute('stroke-dasharray', '5,5');

		this.raycastLine.appendChild(path);

		trajectoryPoints.forEach((point) => {
			if (point.bounce) {
				let circle = document.createElementNS(
					'http://www.w3.org/2000/svg',
					'circle'
				);
				circle.setAttribute('cx', point.x);
				circle.setAttribute('cy', point.y);
				circle.setAttribute('r', '3');
				circle.setAttribute('fill', '#ff0000');
				circle.setAttribute('opacity', '0.7');
				this.raycastLine.appendChild(circle);
			}
		});

		let finalPoint = trajectoryPoints[trajectoryPoints.length - 1];
		if (finalPoint) {
			let target = document.createElementNS(
				'http://www.w3.org/2000/svg',
				'circle'
			);
			target.setAttribute('cx', finalPoint.x);
			target.setAttribute('cy', finalPoint.y);
			target.setAttribute('r', '5');
			target.setAttribute('fill', '#0000ff');
			target.setAttribute('opacity', '0.8');
			this.raycastLine.appendChild(target);
		}

		document.body.appendChild(this.raycastLine);
	}
}
