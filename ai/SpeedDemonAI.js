/**
 * Speed Demon AI - based on Advanced AI but focuses on making the ball go as fast as possible
 * Uses raycast prediction but aims for extreme edge hits to maximize ball acceleration
 */
class SpeedDemonAI extends AdvancedAI {
	constructor(paddle, board, paddleCommon) {
		super(paddle, board, paddleCommon);
		this.speed = 12; // Very fast - 12px per frame
		this.deadZone = 0.1; // Almost perfect precision
		this.speedBoostMultiplier = 2.5; // Much higher speed amplification
		this.extremeEdgeRatio = 0.85; // 85% toward paddle edges - very extreme
		this.speedAmplificationFactor = 0.8; // Much higher speed-based positioning
		this.minSpeedMultiplier = 2.0; // Minimum speed boost
		this.maxSpeedMultiplier = 4.0; // Maximum speed boost when very close
	}

	move(ball, dx, dy, dxd, dyd) {
		this.updateCoordinates(ball);

		const paddleCenter = this.getPaddleCenter();
		const targetY = this.raycastBallTrajectory(ball, dx, dy, dxd, dyd);

		if (targetY === null) {
			const ballCenter = this.getBallCenter();
			const ballVelocityY = dy * (dyd == 0 ? -1 : 1);
			const currentBallSpeed = Math.sqrt(dx * dx + dy * dy);

			const speedBasedAnticipation = Math.max(12, currentBallSpeed * 2);
			const anticipatedY =
				ballCenter + ballVelocityY * speedBasedAnticipation;
			this.movePaddleTo(anticipatedY);
		} else {
			const ballVelocityY = dy * (dyd == 0 ? -1 : 1);
			const currentBallSpeed = Math.sqrt(dx * dx + dy * dy);
			const ballDistanceFromPaddle = Math.abs(
				this.ballCoord.right - this.paddleCoord.left
			);

			let speedTargetY = targetY;
			const paddleHalfHeight = this.paddleCommon.height / 2;
			const extremeOffset = paddleHalfHeight * this.extremeEdgeRatio;

			if (ballVelocityY > 0) {
				speedTargetY = targetY + extremeOffset;
			} else {
				speedTargetY = targetY - extremeOffset;
			}

			const speedAmplification =
				currentBallSpeed * this.speedAmplificationFactor;
			if (ballVelocityY > 0) {
				speedTargetY += speedAmplification;
			} else {
				speedTargetY -= speedAmplification;
			}

			if (currentBallSpeed > 8) {
				const extremeSpeedOffset = (currentBallSpeed - 8) * 3;
				if (ballVelocityY > 0) {
					speedTargetY += extremeSpeedOffset;
				} else {
					speedTargetY -= extremeSpeedOffset;
				}
			}

			if (ballDistanceFromPaddle < 100) {
				const proximityOffset = (100 - ballDistanceFromPaddle) * 0.5;
				if (ballVelocityY > 0) {
					speedTargetY += proximityOffset;
				} else {
					speedTargetY -= proximityOffset;
				}
			}

			const distance = speedTargetY - paddleCenter;

			if (Math.abs(distance) > this.deadZone) {
				let speedMultiplier = this.minSpeedMultiplier;

				if (ballDistanceFromPaddle < 60) {
					speedMultiplier = this.maxSpeedMultiplier;
				} else if (ballDistanceFromPaddle < 120) {
					speedMultiplier = 3.0;
				} else if (ballDistanceFromPaddle < 200) {
					speedMultiplier = 2.5;
				}

				const ballSpeedBonus = Math.min(1.5, currentBallSpeed * 0.1);
				speedMultiplier += ballSpeedBonus;

				const ultraSpeed = this.speed * speedMultiplier;

				if (distance > 0) {
					this.paddle.style.top =
						Math.min(
							this.boardCoord.bottom - this.paddleCommon.height,
							this.paddleCoord.top + ultraSpeed
						) + 'px';
				} else {
					this.paddle.style.top =
						Math.max(
							this.boardCoord.top,
							this.paddleCoord.top - ultraSpeed
						) + 'px';
				}
			}
		}
	}

	shouldShowRaycast() {
		return true;
	}

	getSpeedFocusedTrajectory(ball, dx, dy, dxd, dyd) {
		const trajectory = this.raycastBallTrajectory(ball, dx, dy, dxd, dyd);

		if (this.lastTrajectory) {
			this.lastTrajectory.forEach((point) => {
				point.speedFocused = true;
			});
		}

		return trajectory;
	}
}
