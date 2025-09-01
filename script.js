let gameState = 'start';
let paddle_1 = document.querySelector('.paddle_1');
let paddle_2 = document.querySelector('.paddle_2');
let board = document.querySelector('.board');
let initial_ball = document.querySelector('.ball');
let ball = document.querySelector('.ball');
let score_1 = document.querySelector('.score_1');
let score_2 = document.querySelector('.score_2');
let message = document.querySelector('.message');
let paddle_1_coord = paddle_1.getBoundingClientRect();
let paddle_2_coord = paddle_2.getBoundingClientRect();
let initial_ball_coord = ball.getBoundingClientRect();
let ball_coord = initial_ball_coord;
let board_coord = board.getBoundingClientRect();
let paddle_common = document.querySelector('.paddle').getBoundingClientRect();

let dx = Math.floor(Math.random() * 4) + 3;
let dy = Math.floor(Math.random() * 4) + 3;
let dxd = Math.floor(Math.random() * 2);
let dyd = Math.floor(Math.random() * 2);

let keysPressed = {
	w: false,
	s: false,
};

let paddle1Speed = window.innerHeight * 0.015;
let paddle2Speed = window.innerHeight * 0.016; // AI now faster than player
let isMoving = false;

let aiManager = null;

let showRaycast = true; // Enable by default
let raycastLine = null;

let lastEnterPress = 0;
let enterCooldown = 500; // 500ms cooldown between Enter presses

function updateAIStatus() {
	const aiStatusElement = document.getElementById('current-ai');
	if (aiManager && aiStatusElement) {
		const aiType = aiManager.getCurrentAIType();
		aiStatusElement.textContent = aiType;

		aiStatusElement.style.backgroundColor = '#ff6600';
		aiStatusElement.style.transform = 'scale(1.1)';
		setTimeout(() => {
			aiStatusElement.style.backgroundColor = 'rgba(0, 0, 0, 0.3)';
			aiStatusElement.style.transform = 'scale(1)';
		}, 300);

		showAIChangeMessage(aiType);
	}
}

function showAIChangeMessage(aiType) {
	let notification = document.getElementById('ai-notification');
	if (!notification) {
		notification = document.createElement('div');
		notification.id = 'ai-notification';
		notification.style.position = 'absolute';
		notification.style.top = '50%';
		notification.style.left = '50%';
		notification.style.transform = 'translate(-50%, -50%)';
		notification.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
		notification.style.color = '#00ff88';
		notification.style.padding = '20px 40px';
		notification.style.borderRadius = '10px';
		notification.style.fontSize = '24px';
		notification.style.fontWeight = 'bold';
		notification.style.zIndex = '2000';
		notification.style.textAlign = 'center';
		notification.style.border = '2px solid #00ff88';
		document.body.appendChild(notification);
	}

	notification.textContent = `AI: ${aiType.toUpperCase()}`;
	notification.style.display = 'block';
	notification.style.opacity = '1';

	setTimeout(() => {
		notification.style.opacity = '0';
		setTimeout(() => {
			notification.style.display = 'none';
		}, 300);
	}, 1500);
}

document.addEventListener('keydown', (e) => {
	if (!aiManager) {
		aiManager = new AIManager(paddle_2, board, paddle_common);
		updateAIStatus();
	}

	if (e.key == 'Enter') {
		let currentTime = Date.now();
		if (currentTime - lastEnterPress < enterCooldown) {
			return; // Ignore rapid Enter presses
		}
		lastEnterPress = currentTime;

		gameState = gameState == 'start' ? 'play' : 'start';
		if (gameState == 'play') {
			message.innerHTML = 'Game Started';
			message.style.left = 42 + 'vw';
			isMoving = true;
			smoothMovement();

			requestAnimationFrame(() => {
				dx = Math.floor(Math.random() * 4) + 3;
				dy = Math.floor(Math.random() * 4) + 3;
				dxd = Math.floor(Math.random() * 2);
				dyd = Math.floor(Math.random() * 2);
				moveBall(dx, dy, dxd, dyd);
			});
		} else {
			message.innerHTML = 'Press Enter to Play Pong';
			message.style.left = 38 + 'vw';
			if (raycastLine) {
				raycastLine.remove();
				raycastLine = null;
			}
		}
	}

	if (gameState == 'play') {
		if (e.key == 'w') {
			keysPressed.w = true;
		}
		if (e.key == 's') {
			keysPressed.s = true;
		}

		if (!isMoving) {
			isMoving = true;
			smoothMovement();
		}
	}

	if (e.key == 'r' || e.key == 'R') {
		showRaycast = !showRaycast;
		if (!showRaycast && raycastLine) {
			raycastLine.remove();
			raycastLine = null;
		}
	}

	if (e.key == '1') {
		if (aiManager) {
			aiManager.switchAI('simple');
			updateAIStatus();
		}
	}
	if (e.key == '2') {
		if (aiManager) {
			aiManager.switchAI('medium');
			updateAIStatus();
		}
	}
	if (e.key == '3') {
		if (aiManager) {
			aiManager.switchAI('advanced');
			updateAIStatus();
		}
	}
	if (e.key == '4') {
		if (aiManager) {
			aiManager.switchAI('aggressive');
			updateAIStatus();
		}
	}
	if (e.key == '5') {
		if (aiManager) {
			aiManager.switchAI('speed');
			updateAIStatus();
		}
	}
});

document.addEventListener('keyup', (e) => {
	if (e.key == 'w') {
		keysPressed.w = false;
	}
	if (e.key == 's') {
		keysPressed.s = false;
	}
});

function smoothMovement() {
	if (gameState !== 'play') {
		isMoving = false;
		if (raycastLine) {
			raycastLine.style.display = 'none';
		}
		return;
	}

	let anyKeyPressed = keysPressed.w || keysPressed.s;

	aiMovement();

	if (keysPressed.w) {
		paddle_1.style.top =
			Math.max(board_coord.top, paddle_1_coord.top - paddle1Speed) + 'px';
		paddle_1_coord = paddle_1.getBoundingClientRect();
	}
	if (keysPressed.s) {
		paddle_1.style.top =
			Math.min(
				board_coord.bottom - paddle_common.height,
				paddle_1_coord.top + paddle1Speed
			) + 'px';
		paddle_1_coord = paddle_1.getBoundingClientRect();
	}

	requestAnimationFrame(smoothMovement);
}

function aiMovement() {
	if (!aiManager) return;

	aiManager.move(ball, dx, dy, dxd, dyd);
}

function raycastBallTrajectory() {
	if (!aiManager || !aiManager.shouldShowRaycast()) {
		if (showRaycast && raycastLine) {
			raycastLine.style.display = 'none';
		}
		return null;
	}

	let trajectoryPoints = aiManager.getLastTrajectory();

	if (!trajectoryPoints) {
		return null;
	}

	let ballHorizontalDirection = dxd == 0 ? -1 : 1;
	if (ballHorizontalDirection <= 0) {
		if (showRaycast && raycastLine) {
			raycastLine.style.display = 'none';
		}
		return null;
	}

	if (showRaycast && raycastLine) {
		raycastLine.style.display = 'block';
	}

	if (showRaycast) {
		updateRaycastVisualization(trajectoryPoints);
	}

	return trajectoryPoints[trajectoryPoints.length - 1].y;
}

function updateRaycastVisualization(trajectoryPoints) {
	if (raycastLine) {
		raycastLine.remove();
	}

	raycastLine = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
	raycastLine.style.position = 'absolute';
	raycastLine.style.top = '0';
	raycastLine.style.left = '0';
	raycastLine.style.width = '100%';
	raycastLine.style.height = '100%';
	raycastLine.style.pointerEvents = 'none';
	raycastLine.style.zIndex = '1000';
	raycastLine.style.opacity = '0.5';

	let path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
	let pathData = '';

	trajectoryPoints.forEach((point, index) => {
		if (index === 0) {
			pathData += `M ${point.x} ${point.y}`;
		} else {
			pathData += ` L ${point.x} ${point.y}`;
		}
	});

	path.setAttribute('d', pathData);
	path.setAttribute('stroke', '#00ff00');
	path.setAttribute('stroke-width', '2');
	path.setAttribute('fill', 'none');
	path.setAttribute('stroke-dasharray', '5,5');

	raycastLine.appendChild(path);

	trajectoryPoints.forEach((point) => {
		if (point.bounce) {
			let circle = document.createElementNS(
				'http://www.w3.org/2000/svg',
				'circle'
			);
			circle.setAttribute('cx', point.x);
			circle.setAttribute('cy', point.y);
			circle.setAttribute('r', '3');
			circle.setAttribute('fill', '#ff0000');
			circle.setAttribute('opacity', '0.7');
			raycastLine.appendChild(circle);
		}
	});

	let finalPoint = trajectoryPoints[trajectoryPoints.length - 1];
	if (finalPoint) {
		let target = document.createElementNS(
			'http://www.w3.org/2000/svg',
			'circle'
		);
		target.setAttribute('cx', finalPoint.x);
		target.setAttribute('cy', finalPoint.y);
		target.setAttribute('r', '5');
		target.setAttribute('fill', '#0000ff');
		target.setAttribute('opacity', '0.8');
		raycastLine.appendChild(target);
	}

	document.body.appendChild(raycastLine);
}

function moveBall(dx, dy, dxd, dyd) {
	if (ball_coord.top <= board_coord.top) {
		dyd = 1;
	}
	if (ball_coord.bottom >= board_coord.bottom) {
		dyd = 0;
	}

	paddle_1_coord = paddle_1.getBoundingClientRect();
	paddle_2_coord = paddle_2.getBoundingClientRect();

	if (
		ball_coord.left <= paddle_1_coord.right &&
		ball_coord.top >= paddle_1_coord.top &&
		ball_coord.bottom <= paddle_1_coord.bottom
	) {
		dxd = 1;
		dx = Math.floor(Math.random() * 4) + 3;
		dy = Math.floor(Math.random() * 4) + 3;
	}
	if (
		ball_coord.right >= paddle_2_coord.left &&
		ball_coord.top >= paddle_2_coord.top &&
		ball_coord.bottom <= paddle_2_coord.bottom
	) {
		dxd = 0;
		dx = Math.floor(Math.random() * 4) + 3;
		dy = Math.floor(Math.random() * 4) + 3;
	}
	if (
		ball_coord.left <= board_coord.left ||
		ball_coord.right >= board_coord.right
	) {
		if (ball_coord.left <= board_coord.left) {
			score_2.innerHTML = +score_2.innerHTML + 1;
		} else {
			score_1.innerHTML = +score_1.innerHTML + 1;
		}
		gameState = 'start';

		ball_coord = initial_ball_coord;
		ball.style = initial_ball.style;
		message.innerHTML = 'Press Enter to Play Pong';
		message.style.left = 38 + 'vw';

		if (raycastLine) {
			raycastLine.remove();
			raycastLine = null;
		}

		return;
	}
	ball.style.top = ball_coord.top + dy * (dyd == 0 ? -1 : 1) + 'px';
	ball.style.left = ball_coord.left + dx * (dxd == 0 ? -1 : 1) + 'px';
	ball_coord = ball.getBoundingClientRect();
	requestAnimationFrame(() => {
		moveBall(dx, dy, dxd, dyd);
	});
}
