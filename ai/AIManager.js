/**
 * AI Manager - handles switching between different AI types
 */
class AIManager {
	constructor(paddle, board, paddleCommon) {
		this.paddle = paddle;
		this.board = board;
		this.paddleCommon = paddleCommon;

		// Available AI types
		this.aiTypes = {
			simple: SimpleAI,
			medium: MediumAI,
			advanced: AdvancedAI,
			aggressive: AggressiveAI,
			speed: SpeedDemonAI,
		};

		// Default to advanced AI (current behavior)
		this.currentAIType = 'advanced';
		this.currentAI = new AdvancedAI(paddle, board, paddleCommon);
	}

	// Switch to a different AI type
	switchAI(aiType) {
		if (this.aiTypes[aiType]) {
			this.currentAIType = aiType;
			this.currentAI = new this.aiTypes[aiType](
				this.paddle,
				this.board,
				this.paddleCommon
			);
			console.log(`Switched to ${aiType} AI`);
			return true;
		} else {
			console.warn(`Unknown AI type: ${aiType}`);
			return false;
		}
	}

	// Get current AI type
	getCurrentAIType() {
		return this.currentAIType;
	}

	// Get list of available AI types
	getAvailableAITypes() {
		return Object.keys(this.aiTypes);
	}

	// Move the AI (delegates to current AI)
	move(ball, dx, dy, dxd, dyd) {
		this.currentAI.move(ball, dx, dy, dxd, dyd);
	}

	// Check if current AI supports raycast visualization
	shouldShowRaycast() {
		return this.currentAI.shouldShowRaycast();
	}

	// Get raycast trajectory from current AI
	getRaycastTrajectory(ball, dx, dy, dxd, dyd) {
		return this.currentAI.getRaycastTrajectory(ball, dx, dy, dxd, dyd);
	}

	// Get trajectory points for visualization (for advanced AI)
	getLastTrajectory() {
		return this.currentAI.lastTrajectory || null;
	}
}
