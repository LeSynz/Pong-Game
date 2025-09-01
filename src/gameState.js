class GameState {
	constructor() {
		this.state = 'start';
		this.lastEnterPress = 0;
		this.enterCooldown = 500;
		this.isMoving = false;
		this.winningScore = 5;
		this.winner = null;
	}

	get current() {
		return this.state;
	}

	toggle() {
		if (this.state === 'gameOver') {
			this.resetGame();
			this.state = 'start';
		} else {
			this.state = this.state === 'start' ? 'play' : 'start';
		}
		return this.state;
	}

	isPlaying() {
		return this.state === 'play';
	}

	isGameOver() {
		return this.state === 'gameOver';
	}

	setGameOver(winner) {
		this.state = 'gameOver';
		this.winner = winner;
	}

	resetGame() {
		this.winner = null;
		this.state = 'start';
	}

	getWinner() {
		return this.winner;
	}

	getWinningScore() {
		return this.winningScore;
	}

	canToggle() {
		const currentTime = Date.now();
		if (currentTime - this.lastEnterPress < this.enterCooldown) {
			return false;
		}
		this.lastEnterPress = currentTime;
		return true;
	}

	setMoving(moving) {
		this.isMoving = moving;
	}

	getMoving() {
		return this.isMoving;
	}
}
