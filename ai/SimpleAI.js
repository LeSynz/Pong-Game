/**
 * Simple AI that just follows the ball
 * Good for beginners or testing
 */
class SimpleAI extends BaseAI {
	constructor(paddle, board, paddleCommon) {
		super(paddle, board, paddleCommon);
		this.speed = window.innerHeight * 0.008;
		this.deadZone = 15;
		this.reactionDelay = 15;
		this.reactionTimer = 0;
		this.targetY = null;
	}

	move(ball, dx, dy, dxd, dyd) {
		this.updateCoordinates(ball);

		const paddleCenter = this.getPaddleCenter();
		const ballCenter = this.getBallCenter();

		this.reactionTimer++;
		if (this.reactionTimer >= this.reactionDelay) {
			this.targetY = ballCenter;
			this.reactionTimer = 0;
		}

		if (this.targetY !== null) {
			this.movePaddleTo(this.targetY);
		}
	}
}
