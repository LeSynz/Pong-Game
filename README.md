# Pong Game with Modular AI

A classic Pong game with multiple AI difficulty levels and raycast visualization.

## Controls

- **Enter**: Start/Pause game
- **W/S**: Move left paddle (Player 1)
- **R**: Toggle raycast visualization (for Advanced AI)
- **1-4**: Switch AI types

## AI Types

### 1. Simple AI (`SimpleAI.js`)
- **Difficulty**: Beginner
- **Behavior**: Simply follows the ball's Y position
- **Speed**: Slower than player
- **Features**: Basic tracking, larger dead zone for less precision

### 2. Medium AI (`MediumAI.js`)
- **Difficulty**: Intermediate
- **Behavior**: Follows ball with reaction delay
- **Speed**: Medium speed
- **Features**: Simulated human-like reaction time (8 frame delay)

### 3. Advanced AI (`AdvancedAI.js`) - *Default*
- **Difficulty**: Hard
- **Behavior**: Predicts ball trajectory using raycast simulation
- **Speed**: Fast with adaptive speed based on urgency
- **Features**: 
  - Raycast trajectory prediction
  - Visual trajectory display (toggle with R)
  - Adaptive speed (faster when ball is close)
  - Strategic positioning when ball is moving away

### 4. Aggressive AI (`AggressiveAI.js`)
- **Difficulty**: Expert
- **Behavior**: Tries to hit ball at angles for strategic returns
- **Speed**: Fastest
- **Features**: 
  - Strategic edge hits to create difficult angles
  - Anticipatory positioning
  - Centers itself when ball is moving away

## File Structure

```
pong/
├── index.html          # Main HTML file
├── script.js           # Main game logic
├── styles.css          # Game styling
└── ai/                 # AI modules
    ├── BaseAI.js       # Base class for all AI types
    ├── SimpleAI.js     # Simple ball-following AI
    ├── MediumAI.js     # Medium difficulty with reaction delay
    ├── AdvancedAI.js   # Advanced AI with raycast prediction
    ├── AggressiveAI.js # Aggressive AI with strategic hits
    └── AIManager.js    # Manages switching between AI types
```

## Creating New AI Types

To create a new AI variant:

1. Create a new file in the `ai/` folder (e.g., `CustomAI.js`)
2. Extend the `BaseAI` class:

```javascript
class CustomAI extends BaseAI {
    constructor(paddle, board, paddleCommon) {
        super(paddle, board, paddleCommon);
        // Set custom properties
        this.speed = window.innerHeight * 0.015;
        this.deadZone = 3;
    }

    move(ball, dx, dy, dxd, dyd) {
        this.updateCoordinates(ball);
        
        // Implement your AI logic here
        const paddleCenter = this.getPaddleCenter();
        const ballCenter = this.getBallCenter();
        
        // Example: Follow ball with custom behavior
        this.movePaddleTo(ballCenter);
    }
}
```

3. Add your AI to the `AIManager.js`:

```javascript
this.aiTypes = {
    'simple': SimpleAI,
    'medium': MediumAI,
    'advanced': AdvancedAI,
    'aggressive': AggressiveAI,
    'custom': CustomAI  // Add your new AI here
};
```

4. Add a hotkey in `script.js` if desired
5. Include the script in `index.html`

## Base AI Methods

The `BaseAI` class provides these helpful methods:

- `updateCoordinates(ball)`: Refresh paddle, ball, and board positions
- `getPaddleCenter()`: Get Y position of paddle center
- `getBallCenter()`: Get Y position of ball center
- `movePaddleTo(targetY)`: Move paddle toward a target Y position
- `shouldShowRaycast()`: Return true if AI supports raycast visualization
- `getRaycastTrajectory()`: Return trajectory points for visualization

## Raycast Visualization

The Advanced AI includes a trajectory prediction system that:
- Simulates ball physics including wall bounces
- Shows predicted ball path with a green dashed line
- Displays red dots at bounce points
- Shows blue dot at predicted intercept point
- Can be toggled on/off with the R key
