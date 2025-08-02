// Game configuration
const BOARD_SIZE = 25;
const CELL_SIZE = 20;

// Game state
let gameState = {
    score: 0,
    lives: 3,
    highScore: localStorage.getItem('pacman-high-score') || 0,
    gameRunning: false,
    gameWon: false,
    gameOver: false,
    invulnerable: false // Add invulnerability period after losing a life
};

// Game entities
let pacman = {
    x: 12,
    y: 12,
    direction: 'right',
    nextDirection: 'right'
};

let ghost = {
    x: 12,
    y: 10,
    direction: 'up',
    moveCounter: 0
};

// Multiple ghosts with different colors and starting positions
let ghosts = [
    {
        x: 12,
        y: 10,
        direction: 'up',
        moveCounter: 0,
        color: 'red',
        lastDirection: 'up'
    },
    {
        x: 11,
        y: 10,
        direction: 'left',
        moveCounter: 0,
        color: 'pink',
        lastDirection: 'left'
    },
    {
        x: 13,
        y: 10,
        direction: 'right',
        moveCounter: 0,
        color: 'cyan',
        lastDirection: 'right'
    }
];

// Game board - 1 = wall, 0 = empty, 2 = dot, 3 = power dot
const gameBoard = [
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
    [1,2,2,2,2,2,2,2,2,2,2,2,1,2,2,2,2,2,2,2,2,2,2,2,1],
    [1,3,1,1,1,2,1,1,1,1,1,2,1,2,1,1,1,1,1,2,1,1,1,3,1],
    [1,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,1],
    [1,2,1,1,1,2,1,2,1,1,1,1,1,1,1,1,1,2,1,2,1,1,1,2,1],
    [1,2,2,2,2,2,1,2,2,2,2,2,1,2,2,2,2,2,1,2,2,2,2,2,1],
    [1,1,1,1,1,2,1,1,1,1,1,0,1,0,1,1,1,1,1,2,1,1,1,1,1],
    [1,1,1,1,1,2,1,0,0,0,0,0,0,0,0,0,0,0,1,2,1,1,1,1,1],
    [1,1,1,1,1,2,1,0,1,1,0,0,0,0,0,1,1,0,1,2,1,1,1,1,1],
    [0,0,0,0,0,2,0,0,1,0,0,0,0,0,0,0,1,0,0,2,0,0,0,0,0],
    [1,1,1,1,1,2,1,0,1,0,0,0,0,0,0,0,1,0,1,2,1,1,1,1,1],
    [1,1,1,1,1,2,1,0,1,1,1,1,1,1,1,1,1,0,1,2,1,1,1,1,1],
    [1,1,1,1,1,2,1,0,0,0,0,0,0,0,0,0,0,0,1,2,1,1,1,1,1],
    [1,1,1,1,1,2,1,1,1,1,1,0,1,0,1,1,1,1,1,2,1,1,1,1,1],
    [1,2,2,2,2,2,2,2,2,2,2,2,1,2,2,2,2,2,2,2,2,2,2,2,1],
    [1,2,1,1,1,2,1,1,1,1,1,2,1,2,1,1,1,1,1,2,1,1,1,2,1],
    [1,3,2,2,1,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,1,2,2,3,1],
    [1,1,1,2,1,2,1,2,1,1,1,1,1,1,1,1,1,2,1,2,1,2,1,1,1],
    [1,2,2,2,2,2,1,2,2,2,2,2,1,2,2,2,2,2,1,2,2,2,2,2,1],
    [1,2,1,1,1,1,1,1,1,1,1,2,1,2,1,1,1,1,1,1,1,1,1,2,1],
    [1,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,1],
    [1,2,1,1,1,2,1,1,1,1,1,2,1,2,1,1,1,1,1,2,1,1,1,2,1],
    [1,2,2,2,2,2,2,2,2,2,2,2,1,2,2,2,2,2,2,2,2,2,2,2,1],
    [1,3,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,3,1],
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]
];

let totalDots = 0;
let dotsEaten = 0;

// DOM elements
let gameBoardElement;
let scoreElement;
let livesElement;
let highScoreElement;
let messageElement;
let startButton;
let restartButton;

// Initialize the game
function init() {
    gameBoardElement = document.getElementById('gameBoard');
    scoreElement = document.getElementById('score');
    livesElement = document.getElementById('lives');
    highScoreElement = document.getElementById('high-score');
    messageElement = document.getElementById('message');
    startButton = document.getElementById('startButton');
    restartButton = document.getElementById('restartButton');

    // Set high score
    highScoreElement.textContent = gameState.highScore;

    // Count total dots
    totalDots = 0;
    for (let y = 0; y < BOARD_SIZE; y++) {
        for (let x = 0; x < BOARD_SIZE; x++) {
            if (gameBoard[y][x] === 2 || gameBoard[y][x] === 3) {
                totalDots++;
            }
        }
    }

    createBoard();
    setupEventListeners();
    updateDisplay();
}

// Create the game board
function createBoard() {
    gameBoardElement.innerHTML = '';
    
    for (let y = 0; y < BOARD_SIZE; y++) {
        for (let x = 0; x < BOARD_SIZE; x++) {
            const cell = document.createElement('div');
            cell.className = 'cell';
            cell.id = `cell-${x}-${y}`;
            
            switch (gameBoard[y][x]) {
                case 1:
                    cell.classList.add('wall');
                    break;
                case 2:
                    cell.classList.add('dot');
                    break;
                case 3:
                    cell.classList.add('power-dot');
                    break;
                default:
                    // Empty cell - just keep basic cell class
                    break;
            }
            
            gameBoardElement.appendChild(cell);
        }
    }
    
    // Add Pac-Man
    updatePacmanPosition();
    
    // Add Ghosts
    updateGhostsPosition();
}

// Update Pac-Man position on board
function updatePacmanPosition() {
    // Remove old Pac-Man
    const oldPacman = document.querySelector('.pacman');
    if (oldPacman) {
        oldPacman.remove();
    }
    
    // Add new Pac-Man
    const cell = document.getElementById(`cell-${pacman.x}-${pacman.y}`);
    if (cell) {
        const pacmanElement = document.createElement('div');
        pacmanElement.className = `pacman ${pacman.direction}`;
        cell.appendChild(pacmanElement);
    }
}

// Update Ghost position on board
function updateGhostPosition() {
    // Remove old ghost
    const oldGhost = document.querySelector('.ghost');
    if (oldGhost) {
        oldGhost.remove();
    }
    
    // Add new ghost
    const cell = document.getElementById(`cell-${ghost.x}-${ghost.y}`);
    if (cell) {
        const ghostElement = document.createElement('div');
        ghostElement.className = 'ghost';
        
        const eyesElement = document.createElement('div');
        eyesElement.className = 'ghost-eyes';
        ghostElement.appendChild(eyesElement);
        
        cell.appendChild(ghostElement);
    }
}

// Update all ghosts positions
function updateGhostsPosition() {
    // Remove old ghosts
    const oldGhosts = document.querySelectorAll('.ghost, .ghost-pink, .ghost-cyan');
    oldGhosts.forEach(ghost => ghost.remove());
    
    // Add new ghosts
    ghosts.forEach(ghost => {
        const cell = document.getElementById(`cell-${ghost.x}-${ghost.y}`);
        if (cell) {
            const ghostElement = document.createElement('div');
            ghostElement.className = `ghost ghost-${ghost.color}`;
            
            const eyesElement = document.createElement('div');
            eyesElement.className = 'ghost-eyes';
            ghostElement.appendChild(eyesElement);
            
            cell.appendChild(ghostElement);
        }
    });
}

// Setup event listeners
function setupEventListeners() {
    document.addEventListener('keydown', handleKeyPress);
}

// Handle keyboard input
function handleKeyPress(event) {
    if (!gameState.gameRunning) return;
    
    switch (event.key) {
        case 'ArrowUp':
            pacman.nextDirection = 'up';
            event.preventDefault();
            break;
        case 'ArrowDown':
            pacman.nextDirection = 'down';
            event.preventDefault();
            break;
        case 'ArrowLeft':
            pacman.nextDirection = 'left';
            event.preventDefault();
            break;
        case 'ArrowRight':
            pacman.nextDirection = 'right';
            event.preventDefault();
            break;
    }
}

// Check if movement is valid
function isValidMove(x, y) {
    if (x < 0 || x >= BOARD_SIZE || y < 0 || y >= BOARD_SIZE) {
        return false;
    }
    return gameBoard[y][x] !== 1;
}

// Move Pac-Man
function movePacman() {
    // Try to change direction if possible
    const nextX = pacman.x + getDirectionOffset(pacman.nextDirection).x;
    const nextY = pacman.y + getDirectionOffset(pacman.nextDirection).y;
    
    if (isValidMove(nextX, nextY)) {
        pacman.direction = pacman.nextDirection;
    }
    
    // Move in current direction
    const offset = getDirectionOffset(pacman.direction);
    const newX = pacman.x + offset.x;
    const newY = pacman.y + offset.y;
    
    if (isValidMove(newX, newY)) {
        pacman.x = newX;
        pacman.y = newY;
        
        // Handle tunnel effect (teleport to other side)
        if (pacman.x < 0) pacman.x = BOARD_SIZE - 1;
        if (pacman.x >= BOARD_SIZE) pacman.x = 0;
        
        // Check for dot collection
        checkDotCollection();
        
        updatePacmanPosition();
    }
}

// Get direction offset
function getDirectionOffset(direction) {
    switch (direction) {
        case 'up': return { x: 0, y: -1 };
        case 'down': return { x: 0, y: 1 };
        case 'left': return { x: -1, y: 0 };
        case 'right': return { x: 1, y: 0 };
        default: return { x: 0, y: 0 };
    }
}

// Check if Pac-Man collected a dot
function checkDotCollection() {
    const cellType = gameBoard[pacman.y][pacman.x];
    
    if (cellType === 2 || cellType === 3) {
        // Remove dot from board
        gameBoard[pacman.y][pacman.x] = 0;
        
        // Update dot display
        const cell = document.getElementById(`cell-${pacman.x}-${pacman.y}`);
        cell.className = 'cell';
        
        // Update score
        gameState.score += cellType === 3 ? 50 : 10;
        dotsEaten++;
        
        updateDisplay();
        
        // Check win condition
        if (dotsEaten >= totalDots) {
            winGame();
        }
    }
}

// Move Ghost (simple AI)
function moveGhost() {
    ghost.moveCounter++;
    
    // Ghost moves every other frame to be slower than Pac-Man
    if (ghost.moveCounter % 2 !== 0) return;
    
    const directions = ['up', 'down', 'left', 'right'];
    const validMoves = [];
    
    // Find valid moves
    for (const dir of directions) {
        const offset = getDirectionOffset(dir);
        const newX = ghost.x + offset.x;
        const newY = ghost.y + offset.y;
        
        if (isValidMove(newX, newY)) {
            validMoves.push({ direction: dir, x: newX, y: newY });
        }
    }
    
    if (validMoves.length === 0) return;
    
    // Choose direction towards Pac-Man (simple AI)
    let bestMove = validMoves[0];
    let bestDistance = getDistance(bestMove.x, bestMove.y, pacman.x, pacman.y);
    
    for (const move of validMoves) {
        const distance = getDistance(move.x, move.y, pacman.x, pacman.y);
        if (distance < bestDistance) {
            bestDistance = distance;
            bestMove = move;
        }
    }
    
    // Add some randomness (30% chance of random move)
    if (Math.random() < 0.3) {
        bestMove = validMoves[Math.floor(Math.random() * validMoves.length)];
    }
    
    ghost.x = bestMove.x;
    ghost.y = bestMove.y;
    ghost.direction = bestMove.direction;
    
    updateGhostPosition();
}

// Move all ghosts with improved AI
function moveGhosts() {
    ghosts.forEach((ghost, index) => {
        ghost.moveCounter++;
        
        // Different ghosts move at slightly different speeds
        const moveInterval = index === 0 ? 2 : (index === 1 ? 3 : 2);
        if (ghost.moveCounter % moveInterval !== 0) return;
        
        const directions = ['up', 'down', 'left', 'right'];
        const validMoves = [];
        
        // Find valid moves
        for (const dir of directions) {
            const offset = getDirectionOffset(dir);
            const newX = ghost.x + offset.x;
            const newY = ghost.y + offset.y;
            
            if (isValidMove(newX, newY)) {
                validMoves.push({ direction: dir, x: newX, y: newY });
            }
        }
        
        if (validMoves.length === 0) return;
        
        // Prevent immediate backtracking (getting stuck)
        const oppositeDirection = getOppositeDirection(ghost.lastDirection);
        const nonBacktrackMoves = validMoves.filter(move => 
            move.direction !== oppositeDirection || validMoves.length === 1
        );
        
        const movesToConsider = nonBacktrackMoves.length > 0 ? nonBacktrackMoves : validMoves;
        
        let chosenMove;
        
        // Different AI behavior for each ghost
        if (index === 0) {
            // Red ghost: aggressive chaser
            chosenMove = movesToConsider[0];
            let bestDistance = getDistance(chosenMove.x, chosenMove.y, pacman.x, pacman.y);
            
            for (const move of movesToConsider) {
                const distance = getDistance(move.x, move.y, pacman.x, pacman.y);
                if (distance < bestDistance) {
                    bestDistance = distance;
                    chosenMove = move;
                }
            }
            
            // 20% randomness to avoid getting completely stuck
            if (Math.random() < 0.2) {
                chosenMove = movesToConsider[Math.floor(Math.random() * movesToConsider.length)];
            }
        } else if (index === 1) {
            // Pink ghost: tries to ambush (moves towards where Pac-Man is heading)
            const pacmanOffset = getDirectionOffset(pacman.direction);
            const targetX = pacman.x + pacmanOffset.x * 4;
            const targetY = pacman.y + pacmanOffset.y * 4;
            
            chosenMove = movesToConsider[0];
            let bestDistance = getDistance(chosenMove.x, chosenMove.y, targetX, targetY);
            
            for (const move of movesToConsider) {
                const distance = getDistance(move.x, move.y, targetX, targetY);
                if (distance < bestDistance) {
                    bestDistance = distance;
                    chosenMove = move;
                }
            }
            
            // 30% randomness
            if (Math.random() < 0.3) {
                chosenMove = movesToConsider[Math.floor(Math.random() * movesToConsider.length)];
            }
        } else {
            // Cyan ghost: patrol behavior (more random movement)
            if (Math.random() < 0.6) {
                chosenMove = movesToConsider[Math.floor(Math.random() * movesToConsider.length)];
            } else {
                // Sometimes chase Pac-Man
                chosenMove = movesToConsider[0];
                let bestDistance = getDistance(chosenMove.x, chosenMove.y, pacman.x, pacman.y);
                
                for (const move of movesToConsider) {
                    const distance = getDistance(move.x, move.y, pacman.x, pacman.y);
                    if (distance < bestDistance) {
                        bestDistance = distance;
                        chosenMove = move;
                    }
                }
            }
        }
        
        ghost.x = chosenMove.x;
        ghost.y = chosenMove.y;
        ghost.lastDirection = chosenMove.direction;
        ghost.direction = chosenMove.direction;
    });
    
    updateGhostsPosition();
}

// Get opposite direction
function getOppositeDirection(direction) {
    const opposites = {
        'up': 'down',
        'down': 'up',
        'left': 'right',
        'right': 'left'
    };
    return opposites[direction] || direction;
}

// Calculate distance between two points
function getDistance(x1, y1, x2, y2) {
    return Math.abs(x1 - x2) + Math.abs(y1 - y2);
}

// Check collision between Pac-Man and Ghost
function checkCollision() {
    if (pacman.x === ghost.x && pacman.y === ghost.y) {
        loseLife();
    }
}

// Check collision between Pac-Man and any Ghost
function checkCollisions() {
    // Don't check collisions during invulnerability period
    if (gameState.invulnerable) return;
    
    for (const ghost of ghosts) {
        if (pacman.x === ghost.x && pacman.y === ghost.y) {
            loseLife();
            break; // Only lose one life per frame
        }
    }
}

// Lose a life
function loseLife() {
    // Prevent multiple rapid life losses
    if (gameState.invulnerable) return;
    
    gameState.lives--;
    gameState.invulnerable = true; // Set invulnerability
    updateDisplay();
    
    if (gameState.lives <= 0) {
        gameOver();
    } else {
        // Reset positions
        pacman.x = 12;
        pacman.y = 12;
        pacman.direction = 'right';
        pacman.nextDirection = 'right';
        
        // Reset all ghosts to their starting positions with proper properties
        ghosts[0].x = 12;
        ghosts[0].y = 10;
        ghosts[0].direction = 'up';
        ghosts[0].lastDirection = 'up';
        ghosts[0].moveCounter = 0;
        
        ghosts[1].x = 11;
        ghosts[1].y = 10;
        ghosts[1].direction = 'left';
        ghosts[1].lastDirection = 'left';
        ghosts[1].moveCounter = 0;
        
        ghosts[2].x = 13;
        ghosts[2].y = 10;
        ghosts[2].direction = 'right';
        ghosts[2].lastDirection = 'right';
        ghosts[2].moveCounter = 0;
        
        updatePacmanPosition();
        updateGhostsPosition();
        
        // Pause briefly and show message
        gameState.gameRunning = false;
        showMessage('Life lost! Get ready...');
        
        setTimeout(() => {
            if (!gameState.gameOver && !gameState.gameWon) {
                showMessage('');
                gameState.gameRunning = true;
                gameState.invulnerable = false; // Remove invulnerability
                // Restart the game loop to ensure it continues
                gameLoop();
            }
        }, 2000); // Increased pause time to 2 seconds for better UX
    }
}

// Game over
function gameOver() {
    gameState.gameRunning = false;
    gameState.gameOver = true;
    
    // Check for high score
    if (gameState.score > gameState.highScore) {
        gameState.highScore = gameState.score;
        localStorage.setItem('pacman-high-score', gameState.highScore);
        highScoreElement.textContent = gameState.highScore;
        showMessage('Game Over! New High Score!');
    } else {
        showMessage('Game Over!');
    }
    
    gameBoardElement.classList.add('game-over');
    startButton.style.display = 'none';
    restartButton.style.display = 'inline-block';
}

// Win game
function winGame() {
    gameState.gameRunning = false;
    gameState.gameWon = true;
    
    // Bonus points for remaining lives
    gameState.score += gameState.lives * 100;
    updateDisplay();
    
    // Check for high score
    if (gameState.score > gameState.highScore) {
        gameState.highScore = gameState.score;
        localStorage.setItem('pacman-high-score', gameState.highScore);
        highScoreElement.textContent = gameState.highScore;
        showMessage('You Won! New High Score!');
    } else {
        showMessage('You Won! All dots collected!');
    }
    
    gameBoardElement.classList.add('win');
    startButton.style.display = 'none';
    restartButton.style.display = 'inline-block';
}

// Update display
function updateDisplay() {
    scoreElement.textContent = gameState.score;
    livesElement.textContent = gameState.lives;
}

// Show message
function showMessage(message) {
    messageElement.textContent = message;
}

// Start game
function startGame() {
    gameState.gameRunning = true;
    gameState.gameOver = false;
    gameState.gameWon = false;
    
    startButton.style.display = 'none';
    restartButton.style.display = 'none';
    showMessage('');
    
    gameBoardElement.classList.remove('game-over', 'win');
    
    // Start game loop
    gameLoop();
}

// Restart game
function restartGame() {
    // Reset game state
    gameState.score = 0;
    gameState.lives = 3;
    gameState.gameRunning = false;
    gameState.gameOver = false;
    gameState.gameWon = false;
    gameState.invulnerable = false;
    dotsEaten = 0;
    
    // Reset positions
    pacman.x = 12;
    pacman.y = 12;
    pacman.direction = 'right';
    pacman.nextDirection = 'right';
    
    // Reset all ghosts
    ghosts[0].x = 12;
    ghosts[0].y = 10;
    ghosts[0].direction = 'up';
    ghosts[0].lastDirection = 'up';
    ghosts[0].moveCounter = 0;
    
    ghosts[1].x = 11;
    ghosts[1].y = 10;
    ghosts[1].direction = 'left';
    ghosts[1].lastDirection = 'left';
    ghosts[1].moveCounter = 0;
    
    ghosts[2].x = 13;
    ghosts[2].y = 10;
    ghosts[2].direction = 'right';
    ghosts[2].lastDirection = 'right';
    ghosts[2].moveCounter = 0;
    
    // Reset board to original state
    const originalBoard = [
        [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
        [1,2,2,2,2,2,2,2,2,2,2,2,1,2,2,2,2,2,2,2,2,2,2,2,1],
        [1,3,1,1,1,2,1,1,1,1,1,2,1,2,1,1,1,1,1,2,1,1,1,3,1],
        [1,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,1],
        [1,2,1,1,1,2,1,2,1,1,1,1,1,1,1,1,1,2,1,2,1,1,1,2,1],
        [1,2,2,2,2,2,1,2,2,2,2,2,1,2,2,2,2,2,1,2,2,2,2,2,1],
        [1,1,1,1,1,2,1,1,1,1,1,0,1,0,1,1,1,1,1,2,1,1,1,1,1],
        [1,1,1,1,1,2,1,0,0,0,0,0,0,0,0,0,0,0,1,2,1,1,1,1,1],
        [1,1,1,1,1,2,1,0,1,1,0,0,0,0,0,1,1,0,1,2,1,1,1,1,1],
        [0,0,0,0,0,2,0,0,1,0,0,0,0,0,0,0,1,0,0,2,0,0,0,0,0],
        [1,1,1,1,1,2,1,0,1,0,0,0,0,0,0,0,1,0,1,2,1,1,1,1,1],
        [1,1,1,1,1,2,1,0,1,1,1,1,1,1,1,1,1,0,1,2,1,1,1,1,1],
        [1,1,1,1,1,2,1,0,0,0,0,0,0,0,0,0,0,0,1,2,1,1,1,1,1],
        [1,1,1,1,1,2,1,1,1,1,1,0,1,0,1,1,1,1,1,2,1,1,1,1,1],
        [1,2,2,2,2,2,2,2,2,2,2,2,1,2,2,2,2,2,2,2,2,2,2,2,1],
        [1,2,1,1,1,2,1,1,1,1,1,2,1,2,1,1,1,1,1,2,1,1,1,2,1],
        [1,3,2,2,1,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,1,2,2,3,1],
        [1,1,1,2,1,2,1,2,1,1,1,1,1,1,1,1,1,2,1,2,1,2,1,1,1],
        [1,2,2,2,2,2,1,2,2,2,2,2,1,2,2,2,2,2,1,2,2,2,2,2,1],
        [1,2,1,1,1,1,1,1,1,1,1,2,1,2,1,1,1,1,1,1,1,1,1,2,1],
        [1,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,1],
        [1,2,1,1,1,2,1,1,1,1,1,2,1,2,1,1,1,1,1,2,1,1,1,2,1],
        [1,2,2,2,2,2,2,2,2,2,2,2,1,2,2,2,2,2,2,2,2,2,2,2,1],
        [1,3,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,3,1],
        [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]
    ];
    
    // Copy the original board back to gameBoard
    for (let y = 0; y < BOARD_SIZE; y++) {
        for (let x = 0; x < BOARD_SIZE; x++) {
            gameBoard[y][x] = originalBoard[y][x];
        }
    }
    
    updateDisplay();
    createBoard();
    showMessage('Use arrow keys to move Pac-Man!');
    startButton.style.display = 'inline-block';
    restartButton.style.display = 'none';
    
    gameBoardElement.classList.remove('game-over', 'win');
}

// Game loop
function gameLoop() {
    if (!gameState.gameRunning) return;
    
    movePacman();
    moveGhosts();
    checkCollisions();
    
    // Continue loop
    setTimeout(gameLoop, 150);
}

// Initialize game when page loads
document.addEventListener('DOMContentLoaded', init);
