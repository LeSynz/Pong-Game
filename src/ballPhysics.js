class BallPhysics {
	constructor(gameElements) {
		this.elements = gameElements;
		// Fixed ball speeds in pixels per frame instead of random ranges
		this.dx = 5; // Fixed horizontal speed
		this.dy = 4; // Fixed vertical speed
		this.dxd = Math.floor(Math.random() * 2);
		this.dyd = Math.floor(Math.random() * 2);
		this.paddlePhysics = null;
		this.gameController = null;

		// Speed limits for consistent gameplay
		this.minSpeed = 3;
		this.maxSpeed = 12;
	}

	setPaddlePhysics(paddlePhysics) {
		this.paddlePhysics = paddlePhysics;
	}

	setGameController(gameController) {
		this.gameController = gameController;
	}

	randomizeBall() {
		// Fixed speed ranges for consistent gameplay
		this.dx = Math.floor(Math.random() * 3) + 4; // 4-6 px/frame
		this.dy = Math.floor(Math.random() * 3) + 3; // 3-5 px/frame
		this.dxd = Math.floor(Math.random() * 2);
		this.dyd = Math.floor(Math.random() * 2);
	}

	move(gameState, raycastSystem) {
		if (this.elements.ball_coord.top <= this.elements.board_coord.top) {
			this.dyd = 1;
		}
		if (
			this.elements.ball_coord.bottom >= this.elements.board_coord.bottom
		) {
			this.dyd = 0;
		}

		this.elements.updatePaddleCoordinates();

		if (
			this.elements.ball_coord.left <=
				this.elements.paddle_1_coord.right &&
			this.elements.ball_coord.top >= this.elements.paddle_1_coord.top &&
			this.elements.ball_coord.bottom <=
				this.elements.paddle_1_coord.bottom
		) {
			this.dxd = 1;

			if (this.paddlePhysics) {
				const currentVelocity = this.getVelocity();
				const frictionResult = this.paddlePhysics.applyFrictionToBall(
					currentVelocity,
					null,
					1
				);
				this.dx = Math.max(
					this.minSpeed,
					Math.min(this.maxSpeed, frictionResult.dx)
				);
				this.dy = Math.max(
					this.minSpeed,
					Math.min(this.maxSpeed, frictionResult.dy)
				);
				this.dyd = frictionResult.dyd;
			} else {
				// Fixed speed ranges instead of random
				this.dx = Math.floor(Math.random() * 3) + 4; // 4-6 px/frame
				this.dy = Math.floor(Math.random() * 3) + 3; // 3-5 px/frame
			}
		}
		if (
			this.elements.ball_coord.right >=
				this.elements.paddle_2_coord.left &&
			this.elements.ball_coord.top >= this.elements.paddle_2_coord.top &&
			this.elements.ball_coord.bottom <=
				this.elements.paddle_2_coord.bottom
		) {
			this.dxd = 0;

			if (this.paddlePhysics) {
				const currentVelocity = this.getVelocity();
				const frictionResult = this.paddlePhysics.applyFrictionToBall(
					currentVelocity,
					null,
					2
				);
				this.dx = Math.max(
					this.minSpeed,
					Math.min(this.maxSpeed, frictionResult.dx)
				);
				this.dy = Math.max(
					this.minSpeed,
					Math.min(this.maxSpeed, frictionResult.dy)
				);
				this.dyd = frictionResult.dyd;
			} else {
				// Fixed speed ranges instead of random
				this.dx = Math.floor(Math.random() * 3) + 4; // 4-6 px/frame
				this.dy = Math.floor(Math.random() * 3) + 3; // 3-5 px/frame
			}
		}

		if (
			this.elements.ball_coord.left <= this.elements.board_coord.left ||
			this.elements.ball_coord.right >= this.elements.board_coord.right
		) {
			let scoringPlayer;
			if (
				this.elements.ball_coord.left <= this.elements.board_coord.left
			) {
				scoringPlayer = 2;
			} else {
				scoringPlayer = 1;
			}

			this.elements.updateScore(scoringPlayer);

			const winner = this.elements.checkWinCondition(
				gameState.getWinningScore()
			);
			if (winner) {
				gameState.setGameOver(winner);
				this.elements.resetBall();

				if (this.gameController) {
					this.gameController.showWinScreen(winner);
				} else {
					if (winner === 1) {
						this.elements.setMessage(
							'YOU WIN! Press Enter to Play Again',
							32
						);
					} else {
						this.elements.setMessage(
							'AI WINS! Press Enter to Play Again',
							32
						);
					}
				}

				if (raycastSystem) {
					raycastSystem.clear();
				}
				return;
			}

			gameState.state = 'start';
			this.elements.resetBall();
			this.elements.setMessage('Press Enter to Play Pong', 38);

			if (raycastSystem) {
				raycastSystem.clear();
			}

			return;
		}

		this.elements.ball.style.top =
			this.elements.ball_coord.top +
			this.dy * (this.dyd == 0 ? -1 : 1) +
			'px';
		this.elements.ball.style.left =
			this.elements.ball_coord.left +
			this.dx * (this.dxd == 0 ? -1 : 1) +
			'px';
		this.elements.updateBallCoordinates();

		requestAnimationFrame(() => {
			this.move(gameState, raycastSystem);
		});
	}

	getVelocity() {
		return {
			dx: this.dx,
			dy: this.dy,
			dxd: this.dxd,
			dyd: this.dyd,
		};
	}
}
