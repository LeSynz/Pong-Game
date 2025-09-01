class UIController {
	constructor() {
		this.aiStatusElement = document.getElementById('current-ai');
	}

	updateAIStatus(aiManager) {
		if (aiManager && this.aiStatusElement) {
			const aiType = aiManager.getCurrentAIType();
			this.aiStatusElement.textContent = aiType;

			this.aiStatusElement.style.backgroundColor = '#ff6600';
			this.aiStatusElement.style.transform = 'scale(1.1)';
			setTimeout(() => {
				this.aiStatusElement.style.backgroundColor =
					'rgba(0, 0, 0, 0.3)';
				this.aiStatusElement.style.transform = 'scale(1)';
			}, 300);

			this.showAIChangeMessage(aiType);
		}
	}

	showAIChangeMessage(aiType) {
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
}
