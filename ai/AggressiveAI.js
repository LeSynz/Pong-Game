/**
 * Aggressive AI that tries to hit the ball at angles
 * More challenging opponent
 */
class AggressiveAI extends BaseAI {
	constructor(paddle, board, paddleCommon) {
		super(paddle, board, paddleCommon);
		this.speed = window.innerHeight * 0.022; // Very fast
		this.deadZone = 1; // Very precise
		this.anticipationDistance = 200; // How far ahead to anticipate
	}

	move(ball, dx, dy, dxd, dyd) {
		this.updateCoordinates(ball);

		const paddleCenter = this.getPaddleCenter();
		const ballCenter = this.getBallCenter();

		// Check if ball is coming toward AI
		const ballHorizontalDirection = dxd == 0 ? -1 : 1;

		if (ballHorizontalDirection > 0) {
			// Ball coming toward AI - be very aggressive
			const ballDistanceFromPaddle = Math.abs(
				this.ballCoord.right - this.paddleCoord.left
			);

			// Always try to hit at strategic angles
			const ballVelocityY = dy * (dyd == 0 ? -1 : 1);
			let strategicOffset = 0;

			if (ballDistanceFromPaddle < this.anticipationDistance) {
				// Close enough - aim for extreme edge hits
				if (ballVelocityY > 0) {
					// Ball moving down, hit with bottom edge for sharp angle
					strategicOffset = this.paddleCommon.height * 0.4;
				} else {
					// Ball moving up, hit with top edge for sharp angle
					strategicOffset = -this.paddleCommon.height * 0.4;
				}

				// Add some prediction based on ball speed
				const ballSpeed = Math.abs(dy);
				const extraOffset = ballSpeed * 0.5;
				strategicOffset +=
					ballVelocityY > 0 ? extraOffset : -extraOffset;

				this.movePaddleTo(ballCenter + strategicOffset);
			} else {
				// Far away - move to intercept with some anticipation
				const anticipatedY = ballCenter + ballVelocityY * 3;
				this.movePaddleTo(anticipatedY);
			}
		} else {
			// Ball moving away - position aggressively for next return
			const boardCenter =
				this.boardCoord.top + this.boardCoord.height / 2;
			// Move slightly off-center to create pressure
			const pressureOffset = Math.sin(Date.now() * 0.002) * 30; // Slight movement
			this.movePaddleTo(boardCenter + pressureOffset);
		}
	}
}
