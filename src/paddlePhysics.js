class PaddlePhysics {
	constructor(gameElements) {
		this.elements = gameElements;

		this.paddle1PrevY = this.elements.paddle_1_coord.top;
		this.paddle2PrevY = this.elements.paddle_2_coord.top;

		this.paddle1Velocity = 0;
		this.paddle2Velocity = 0;

		this.paddle1VelocityHistory = [];
		this.paddle2VelocityHistory = [];
		this.maxVelocityHistory = 3;

		this.frictionCoefficient = 0.8;
		this.maxSpeedBonus = 3;
		this.velocityThreshold = 2;
	}

	updatePaddle1Velocity() {
		const currentY = this.elements.paddle_1_coord.top;
		this.paddle1Velocity = currentY - this.paddle1PrevY;
		this.paddle1PrevY = currentY;

		this.paddle1VelocityHistory.push(this.paddle1Velocity);
		if (this.paddle1VelocityHistory.length > this.maxVelocityHistory) {
			this.paddle1VelocityHistory.shift();
		}
	}

	updatePaddle2Velocity() {
		const currentY = this.elements.paddle_2_coord.top;
		this.paddle2Velocity = currentY - this.paddle2PrevY;
		this.paddle2PrevY = currentY;

		this.paddle2VelocityHistory.push(this.paddle2Velocity);
		if (this.paddle2VelocityHistory.length > this.maxVelocityHistory) {
			this.paddle2VelocityHistory.shift();
		}
	}

	getPaddle1Velocity() {
		if (this.paddle1VelocityHistory.length === 0) return 0;
		const sum = this.paddle1VelocityHistory.reduce((a, b) => a + b, 0);
		return sum / this.paddle1VelocityHistory.length;
	}

	getPaddle2Velocity() {
		if (this.paddle2VelocityHistory.length === 0) return 0;
		const sum = this.paddle2VelocityHistory.reduce((a, b) => a + b, 0);
		return sum / this.paddle2VelocityHistory.length;
	}

	applyFrictionToBall(ballVelocity, paddleVelocity, paddleNumber) {
		const avgPaddleVel =
			paddleNumber === 1
				? this.getPaddle1Velocity()
				: this.getPaddle2Velocity();

		if (Math.abs(avgPaddleVel) < this.velocityThreshold) {
			return ballVelocity;
		}

		let newDx = ballVelocity.dx;
		let newDy = ballVelocity.dy;

		const velocityTransfer = avgPaddleVel * this.frictionCoefficient;
		const speedBonus = Math.min(
			Math.abs(avgPaddleVel) * 0.3,
			this.maxSpeedBonus
		);

		newDy += velocityTransfer;

		if (Math.abs(avgPaddleVel) > this.velocityThreshold * 2) {
			newDx += speedBonus * 0.5;
		}

		newDx = Math.max(3, Math.min(12, Math.abs(newDx)));
		newDy = Math.max(3, Math.min(12, Math.abs(newDy)));

		const newDyd = newDy + velocityTransfer > 0 ? 1 : 0;

		return {
			dx: newDx,
			dy: newDy,
			dxd: ballVelocity.dxd,
			dyd: newDyd,
		};
	}

	updateBoth() {
		this.updatePaddle1Velocity();
		this.updatePaddle2Velocity();
	}
}
