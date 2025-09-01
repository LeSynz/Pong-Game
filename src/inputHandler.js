class InputHandler {
	constructor() {
		this.keysPressed = {
			w: false,
			s: false,
		};
	}

	init(gameController) {
		document.addEventListener('keydown', (e) =>
			this.handleKeyDown(e, gameController)
		);
		document.addEventListener('keyup', (e) =>
			this.handleKeyUp(e, gameController)
		);
	}

	handleKeyDown(e, gameController) {
		if (e.key === 'Enter') {
			gameController.handleEnterKey();
		}

		if (gameController.gameState.isPlaying()) {
			if (e.key === 'w') {
				this.keysPressed.w = true;
			}
			if (e.key === 's') {
				this.keysPressed.s = true;
			}

			if (!gameController.gameState.getMoving()) {
				gameController.gameState.setMoving(true);
				gameController.startMovement();
			}
		}

		if (e.key === 'r' || e.key === 'R') {
			gameController.toggleRaycast();
		}

		if (e.key >= '1' && e.key <= '5') {
			gameController.switchAI(e.key);
		}
	}

	handleKeyUp(e, gameController) {
		if (e.key === 'w') {
			this.keysPressed.w = false;
		}
		if (e.key === 's') {
			this.keysPressed.s = false;
		}
	}

	getKeysPressed() {
		return this.keysPressed;
	}
}
