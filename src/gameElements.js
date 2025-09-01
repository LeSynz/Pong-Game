class GameElements {
	constructor() {
		this.paddle_1 = document.querySelector('.paddle_1');
		this.paddle_2 = document.querySelector('.paddle_2');
		this.board = document.querySelector('.board');
		this.initial_ball = document.querySelector('.ball');
		this.ball = document.querySelector('.ball');
		this.score_1 = document.querySelector('.score_1');
		this.score_2 = document.querySelector('.score_2');
		this.message = document.querySelector('.message');

		this.updateCoordinates();
	}

	updateCoordinates() {
		this.paddle_1_coord = this.paddle_1.getBoundingClientRect();
		this.paddle_2_coord = this.paddle_2.getBoundingClientRect();
		this.initial_ball_coord = this.ball.getBoundingClientRect();
		this.ball_coord = this.initial_ball_coord;
		this.board_coord = this.board.getBoundingClientRect();
		this.paddle_common = document
			.querySelector('.paddle')
			.getBoundingClientRect();
	}

	updatePaddleCoordinates() {
		this.paddle_1_coord = this.paddle_1.getBoundingClientRect();
		this.paddle_2_coord = this.paddle_2.getBoundingClientRect();
	}

	updateBallCoordinates() {
		this.ball_coord = this.ball.getBoundingClientRect();
	}

	resetBall() {
		this.ball_coord = this.initial_ball_coord;
		this.ball.style = this.initial_ball.style;
	}

	updateScore(player) {
		if (player === 1) {
			this.score_1.innerHTML = +this.score_1.innerHTML + 1;
		} else {
			this.score_2.innerHTML = +this.score_2.innerHTML + 1;
		}
		return this.getScores();
	}

	getScores() {
		return {
			player1: +this.score_1.innerHTML,
			player2: +this.score_2.innerHTML,
		};
	}

	resetScores() {
		this.score_1.innerHTML = '0';
		this.score_2.innerHTML = '0';
	}

	checkWinCondition(winningScore) {
		const scores = this.getScores();
		if (scores.player1 >= winningScore) {
			return 1;
		} else if (scores.player2 >= winningScore) {
			return 2;
		}
		return null;
	}

	setMessage(text, leftPosition) {
		this.message.innerHTML = text;
		if (leftPosition) {
			this.message.style.left = leftPosition + 'vw';
		}
	}
}
