class GameController {
	constructor() {
		this.gameState = new GameState();
		this.gameElements = new GameElements();
		this.ballPhysics = new BallPhysics(this.gameElements);
		this.inputHandler = new InputHandler();
		this.playerMovement = new PlayerMovement(this.gameElements);
		this.paddlePhysics = new PaddlePhysics(this.gameElements);
		this.raycastSystem = new RaycastSystem();
		this.uiController = new UIController();
		this.winScreen = new WinScreen();
		this.aiManager = null;

		this.ballPhysics.setPaddlePhysics(this.paddlePhysics);
		this.ballPhysics.setGameController(this);
	}

	init() {
		this.initAI();
		this.inputHandler.init(this);
		this.winScreen.init(this);
	}

	initAI() {
		this.aiManager = new AIManager(
			this.gameElements.paddle_2,
			this.gameElements.board,
			this.gameElements.paddle_common
		);
		this.uiController.updateAIStatus(this.aiManager);
	}

	handleEnterKey() {
		if (!this.gameState.canToggle()) {
			return;
		}

		if (this.gameState.isGameOver()) {
			this.resetGame();
			return;
		}

		this.gameState.toggle();
		if (this.gameState.isPlaying()) {
			this.gameElements.setMessage('Game Started', 42);
			this.gameState.setMoving(true);
			this.startMovement();

			requestAnimationFrame(() => {
				this.ballPhysics.randomizeBall();
				this.ballPhysics.move(this.gameState, this.raycastSystem);
			});
		} else {
			this.gameElements.setMessage('Press Enter to Play Pong', 38);
			this.raycastSystem.clear();
		}
	}

	resetGame() {
		this.gameState.resetGame();
		this.gameElements.resetScores();
		this.gameElements.resetBall();
		this.gameElements.setMessage('Press Enter to Play Pong', 38);
		this.raycastSystem.clear();
		this.winScreen.hide();
	}

	showWinScreen(winner) {
		const playerScore = parseInt(this.gameElements.score_1.innerText);
		const aiScore = parseInt(this.gameElements.score_2.innerText);
		this.winScreen.show(winner, playerScore, aiScore);
	}

	startMovement() {
		this.smoothMovement();
	}

	smoothMovement() {
		if (!this.gameState.isPlaying()) {
			this.gameState.setMoving(false);
			this.raycastSystem.hide();
			return;
		}

		if (this.gameState.isGameOver()) {
			this.gameState.setMoving(false);
			this.raycastSystem.hide();
			return;
		}

		this.updateAI();
		this.playerMovement.update(this.inputHandler.getKeysPressed());

		this.paddlePhysics.updateBoth();

		requestAnimationFrame(() => this.smoothMovement());
	}

	updateAI() {
		if (!this.aiManager) return;

		const velocity = this.ballPhysics.getVelocity();
		this.aiManager.move(
			this.gameElements.ball,
			velocity.dx,
			velocity.dy,
			velocity.dxd,
			velocity.dyd
		);
	}

	toggleRaycast() {
		this.raycastSystem.toggle();
	}

	switchAI(keyNumber) {
		if (!this.aiManager) return;

		const aiTypes = {
			1: 'simple',
			2: 'medium',
			3: 'advanced',
			4: 'aggressive',
			5: 'speed',
		};

		const aiType = aiTypes[keyNumber];
		if (aiType) {
			this.aiManager.switchAI(aiType);
			this.uiController.updateAIStatus(this.aiManager);
		}
	}
}
