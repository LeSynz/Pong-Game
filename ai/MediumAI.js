/**
 * Medium difficulty AI with delayed reaction
 * Provides a balanced challenge
 */
class MediumAI extends BaseAI {
	constructor(paddle, board, paddleCommon) {
		super(paddle, board, paddleCommon);
		this.speed = 6; // Medium speed - 6px per frame
		this.deadZone = 8; // Medium precision
		this.reactionDelay = 12; // Noticeable delay
		this.reactionTimer = 0;
		this.targetY = null;
		this.missChance = 0.15; // 15% chance to "miss" the ball occasionally
	}

	move(ball, dx, dy, dxd, dyd) {
		this.updateCoordinates(ball);

		const paddleCenter = this.getPaddleCenter();
		const ballCenter = this.getBallCenter();

		this.reactionTimer++;
		if (this.reactionTimer >= this.reactionDelay) {
			if (Math.random() < this.missChance) {
				const error = (Math.random() - 0.5) * 60;
				this.targetY = ballCenter + error;
			} else {
				this.targetY = ballCenter;
			}
			this.reactionTimer = 0;
		}

		if (this.targetY !== null) {
			this.movePaddleTo(this.targetY);
		}
	}
}
