class WinScreen {
	constructor() {
		this.winScreenElement = null;
		this.isVisible = false;
		this.gameController = null;
	}

	init(gameController) {
		this.gameController = gameController;
		// Listen for custom events
		window.addEventListener('playAgain', () => {
			if (this.gameController) {
				this.gameController.resetGame();
				this.gameController.handleEnterKey();
			}
		});

		window.addEventListener('changeAI', (event) => {
			if (this.gameController && event.detail && event.detail.aiType) {
				this.gameController.switchAI(parseInt(event.detail.aiType));
			}
		});
	}

	show(winner, playerScore, aiScore) {
		this.remove(); // Remove existing screen if any

		this.winScreenElement = document.createElement('div');
		this.winScreenElement.id = 'win-screen';
		this.winScreenElement.className = 'win-screen';

		const isPlayerWin = winner === 1;

		this.winScreenElement.innerHTML = `
            <div class="win-screen-background"></div>
            <div class="win-screen-content">
                <div class="win-title ${isPlayerWin ? 'player-win' : 'ai-win'}">
                    ${isPlayerWin ? 'VICTORY!' : 'DEFEAT!'}
                </div>
                
                <div class="win-subtitle">
                    ${
						isPlayerWin
							? 'You defeated the AI!'
							: 'AI has won this round!'
					}
                </div>
                
                <div class="final-score">
                    <div class="score-display">
                        <div class="score-item">
                            <span class="score-label">Player</span>
                            <span class="score-value ${
								isPlayerWin ? 'winner-score' : ''
							}">${playerScore}</span>
                        </div>
                        <div class="score-separator">-</div>
                        <div class="score-item">
                            <span class="score-label">AI</span>
                            <span class="score-value ${
								!isPlayerWin ? 'winner-score' : ''
							}">${aiScore}</span>
                        </div>
                    </div>
                </div>
                
                <div class="win-menu">
                    <button class="menu-button primary" id="play-again-btn">
                        <span class="button-icon">🔄</span>
                        Play Again
                        <span class="button-hint">[Enter]</span>
                    </button>
                    
                    <button class="menu-button secondary" id="change-ai-btn">
                        <span class="button-icon">🤖</span>
                        Change AI Difficulty
                        <span class="button-hint">[1-5]</span>
                    </button>
                    
                    <div class="ai-selector" id="ai-selector" style="display: none;">
                        <div class="ai-options">
                            <button class="ai-option" data-ai="1">1. Simple</button>
                            <button class="ai-option" data-ai="2">2. Medium</button>
                            <button class="ai-option" data-ai="3">3. Advanced</button>
                            <button class="ai-option" data-ai="4">4. Aggressive</button>
                            <button class="ai-option" data-ai="5">5. Speed Demon</button>
                        </div>
                    </div>
                </div>
                
                <div class="game-stats">
                    <div class="stat-item">
                        <span class="stat-label">Game Duration</span>
                        <span class="stat-value" id="game-duration">--:--</span>
                    </div>
                </div>
            </div>
        `;

		document.body.appendChild(this.winScreenElement);
		this.isVisible = true;

		// Add event listeners
		this.setupEventListeners();

		// Animate in
		setTimeout(() => {
			this.winScreenElement.classList.add('visible');
		}, 50);
	}

	setupEventListeners() {
		const playAgainBtn = document.getElementById('play-again-btn');
		const changeAiBtn = document.getElementById('change-ai-btn');
		const aiSelector = document.getElementById('ai-selector');
		const aiOptions = document.querySelectorAll('.ai-option');

		if (playAgainBtn) {
			playAgainBtn.addEventListener('click', () => {
				this.triggerPlayAgain();
			});
		}

		if (changeAiBtn) {
			changeAiBtn.addEventListener('click', () => {
				const isVisible = aiSelector.style.display !== 'none';
				aiSelector.style.display = isVisible ? 'none' : 'block';
				changeAiBtn.classList.toggle('active', !isVisible);
			});
		}

		aiOptions.forEach((option) => {
			option.addEventListener('click', () => {
				const aiType = option.getAttribute('data-ai');
				this.triggerAIChange(aiType);
				aiSelector.style.display = 'none';
				changeAiBtn.classList.remove('active');
			});
		});

		// Close on background click
		const background = this.winScreenElement.querySelector(
			'.win-screen-background'
		);
		if (background) {
			background.addEventListener('click', () => {
				this.triggerPlayAgain();
			});
		}
	}

	triggerPlayAgain() {
		// Hide the win screen first
		this.hide();
		// Dispatch custom event for game controller to handle
		window.dispatchEvent(new CustomEvent('playAgain'));
	}

	triggerAIChange(aiType) {
		// Dispatch custom event for AI change
		window.dispatchEvent(
			new CustomEvent('changeAI', { detail: { aiType } })
		);
	}

	updateGameDuration(duration) {
		const durationElement = document.getElementById('game-duration');
		if (durationElement) {
			const minutes = Math.floor(duration / 60);
			const seconds = duration % 60;
			durationElement.textContent = `${minutes
				.toString()
				.padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
		}
	}

	remove() {
		if (this.winScreenElement) {
			this.winScreenElement.classList.remove('visible');
			setTimeout(() => {
				if (this.winScreenElement && this.winScreenElement.parentNode) {
					this.winScreenElement.parentNode.removeChild(
						this.winScreenElement
					);
				}
				this.winScreenElement = null;
				this.isVisible = false;
			}, 300);
		}
	}

	hide() {
		this.remove();
	}

	isShowing() {
		return this.isVisible;
	}
}
