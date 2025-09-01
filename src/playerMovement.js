class PlayerMovement {
	constructor(gameElements) {
		this.elements = gameElements;
		// Fixed speed in pixels per frame instead of viewport-relative
		this.paddle1Speed = 8; // Consistent 8px per frame movement
		this.previousY = this.elements.paddle_1_coord.top;
		this.velocity = 0;
		this.velocityHistory = [];
		this.maxVelocityHistory = 5;
	}

	update(keysPressed) {
		const currentY = this.elements.paddle_1_coord.top;
		let newY = currentY;

		if (keysPressed.w) {
			newY = Math.max(
				this.elements.board_coord.top,
				this.elements.paddle_1_coord.top - this.paddle1Speed
			);
			this.elements.paddle_1.style.top = newY + 'px';
			this.elements.paddle_1_coord =
				this.elements.paddle_1.getBoundingClientRect();
		}
		if (keysPressed.s) {
			newY = Math.min(
				this.elements.board_coord.bottom -
					this.elements.paddle_common.height,
				this.elements.paddle_1_coord.top + this.paddle1Speed
			);
			this.elements.paddle_1.style.top = newY + 'px';
			this.elements.paddle_1_coord =
				this.elements.paddle_1.getBoundingClientRect();
		}

		this.velocity = newY - this.previousY;
		this.previousY = newY;

		this.velocityHistory.push(this.velocity);
		if (this.velocityHistory.length > this.maxVelocityHistory) {
			this.velocityHistory.shift();
		}
	}

	getVelocity() {
		return this.velocity;
	}

	getAverageVelocity() {
		if (this.velocityHistory.length === 0) return 0;
		const sum = this.velocityHistory.reduce((a, b) => a + b, 0);
		return sum / this.velocityHistory.length;
	}

	getMaxRecentVelocity() {
		if (this.velocityHistory.length === 0) return 0;
		return Math.max(...this.velocityHistory.map(Math.abs));
	}
}
