/**
 * Base AI class that all AI variants should extend
 * Provides common functionality and interface
 */
class BaseAI {
	constructor(paddle, board, paddleCommon) {
		this.paddle = paddle;
		this.board = board;
		this.paddleCommon = paddleCommon;
		this.speed = window.innerHeight * 0.016;
		this.reactionDelay = 0;
		this.deadZone = 1;
	}

	// Get fresh coordinates - called before each movement calculation
	updateCoordinates(ball) {
		this.paddleCoord = this.paddle.getBoundingClientRect();
		this.ballCoord = ball.getBoundingClientRect();
		this.boardCoord = this.board.getBoundingClientRect();
	}

	// Get paddle center position
	getPaddleCenter() {
		return this.paddleCoord.top + this.paddleCommon.height / 2;
	}

	// Get ball center position
	getBallCenter() {
		return this.ballCoord.top + this.ballCoord.height / 2;
	}

	// Move paddle to a target Y position
	movePaddleTo(targetY) {
		const paddleCenter = this.getPaddleCenter();
		const distance = targetY - paddleCenter;

		if (Math.abs(distance) > this.deadZone) {
			if (distance > 0) {
				this.paddle.style.top =
					Math.min(
						this.boardCoord.bottom - this.paddleCommon.height,
						this.paddleCoord.top + this.speed
					) + 'px';
			} else {
				this.paddle.style.top =
					Math.max(
						this.boardCoord.top,
						this.paddleCoord.top - this.speed
					) + 'px';
			}
		}
	}

	// Abstract method - must be implemented by subclasses
	move(ball, dx, dy, dxd, dyd) {
		throw new Error('move() method must be implemented by AI subclass');
	}

	// Optional: AI-specific raycast visualization
	shouldShowRaycast() {
		return false; // Override in subclasses that support raycast
	}

	// Optional: Get raycast trajectory (for AIs that support it)
	getRaycastTrajectory(ball, dx, dy, dxd, dyd) {
		return null; // Override in subclasses that support raycast
	}
}
