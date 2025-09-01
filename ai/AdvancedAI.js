/**
 * Advanced AI with raycast trajectory prediction
 * This is the current AI implementation from your game
 */
class AdvancedAI extends BaseAI {
	constructor(paddle, board, paddleCommon) {
		super(paddle, board, paddleCommon);
		this.speed = window.innerHeight * 0.016;
		this.deadZone = 1; // Near-perfect precision
		this.raycastLine = null;
	}

	move(ball, dx, dy, dxd, dyd) {
		this.updateCoordinates(ball);

		const paddleCenter = this.getPaddleCenter();
		const targetY = this.raycastBallTrajectory(ball, dx, dy, dxd, dyd);

		if (targetY === null) {
			const ballCenter = this.getBallCenter();
			const distanceToball = ballCenter - paddleCenter;

			if (Math.abs(distanceToball) > this.deadZone * 10) {
				const positioningSpeed = this.speed * 0.5;
				if (distanceToball > 0) {
					this.paddle.style.top =
						Math.min(
							this.boardCoord.bottom - this.paddleCommon.height,
							this.paddleCoord.top + positioningSpeed
						) + 'px';
				} else {
					this.paddle.style.top =
						Math.max(
							this.boardCoord.top,
							this.paddleCoord.top - positioningSpeed
						) + 'px';
				}
			}
		} else {
			const distance = targetY - paddleCenter;

			if (Math.abs(distance) > this.deadZone) {
				const ballDistanceFromPaddle = Math.abs(
					this.ballCoord.right - this.paddleCoord.left
				);

				let speedMultiplier = 1.0;
				if (ballDistanceFromPaddle < 100) {
					speedMultiplier = 1.8;
				} else if (ballDistanceFromPaddle < 200) {
					speedMultiplier = 1.4;
				}

				const adaptiveSpeed = this.speed * speedMultiplier;

				if (distance > 0) {
					this.paddle.style.top =
						Math.min(
							this.boardCoord.bottom - this.paddleCommon.height,
							this.paddleCoord.top + adaptiveSpeed
						) + 'px';
				} else {
					this.paddle.style.top =
						Math.max(
							this.boardCoord.top,
							this.paddleCoord.top - adaptiveSpeed
						) + 'px';
				}
			}
		}
	}

	shouldShowRaycast() {
		return true;
	}

	getRaycastTrajectory(ball, dx, dy, dxd, dyd) {
		return this.raycastBallTrajectory(ball, dx, dy, dxd, dyd);
	}

	raycastBallTrajectory(ball, dx, dy, dxd, dyd) {
		const currentBallCoord = ball.getBoundingClientRect();

		if (!currentBallCoord || currentBallCoord.width === 0) {
			return null;
		}

		const ballHorizontalDirection = dxd == 0 ? -1 : 1;
		if (ballHorizontalDirection <= 0) {
			return null;
		}

		const ballRadius = currentBallCoord.width / 2;
		const currentX = currentBallCoord.left + ballRadius;
		const currentY = currentBallCoord.top + ballRadius;
		const velocityX = dx * ballHorizontalDirection;
		const velocityY = dy * (dyd == 0 ? -1 : 1);

		const targetX = this.paddleCoord.left - ballRadius;

		const trajectoryPoints = [{ x: currentX, y: currentY }];

		let simX = currentX;
		let simY = currentY;
		let simVelY = velocityY;

		const maxIterations = 1000;
		let iterations = 0;

		while (simX < targetX && iterations < maxIterations) {
			simX += velocityX;
			simY += simVelY;

			if (simY - ballRadius <= this.boardCoord.top) {
				simY = this.boardCoord.top + ballRadius;
				simVelY = Math.abs(simVelY); // Bounce down
				trajectoryPoints.push({ x: simX, y: simY, bounce: true });
			} else if (simY + ballRadius >= this.boardCoord.bottom) {
				simY = this.boardCoord.bottom - ballRadius;
				simVelY = -Math.abs(simVelY); // Bounce up
				trajectoryPoints.push({ x: simX, y: simY, bounce: true });
			}

			if (iterations % 5 === 0) {
				trajectoryPoints.push({ x: simX, y: simY });
			}

			iterations++;
		}

		trajectoryPoints.push({ x: simX, y: simY, final: true });

		this.lastTrajectory = trajectoryPoints;

		return simY;
	}
}
