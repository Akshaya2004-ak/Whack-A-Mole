document.addEventListener('DOMContentLoaded', () => {
    // Game elements
    const gameBoard = document.getElementById('game-board');
    const scoreDisplay = document.getElementById('score');
    const timerDisplay = document.getElementById('timer');
    const highScoreDisplay = document.getElementById('high-score');
    const startButton = document.getElementById('start-btn');
    const resetButton = document.getElementById('reset-btn');
    const gameOverScreen = document.getElementById('game-over');
    const finalScoreDisplay = document.getElementById('final-score');
    const playAgainButton = document.getElementById('play-again-btn');
    
    // Game state
    let score = 0;
    let timeLeft = 30;
    let gameActive = false;
    let timerId = null;
    let moleTimerId = null;
    let holes = [];
    let highScore = localStorage.getItem('whackMoleHighScore') || 0;
    
    // Initialize high score display
    highScoreDisplay.textContent = highScore;
    
    // Create the game board with 9 holes
    function createBoard() {
        gameBoard.innerHTML = '';
        holes = [];
        
        for (let i = 0; i < 9; i++) {
            const hole = document.createElement('div');
            hole.classList.add('hole');
            hole.dataset.index = i;
            
            const mole = document.createElement('div');
            mole.classList.add('mole');
            
            hole.appendChild(mole);
            gameBoard.appendChild(hole);
            holes.push(hole);
            
            // Add click event to each hole
            hole.addEventListener('click', () => {
                if (!gameActive) return;
                
                if (hole.classList.contains('active')) {
                    // Mole was whacked!
                    score += 10;
                    scoreDisplay.textContent = score;
                    
                    // Visual feedback for hit
                    const mole = hole.querySelector('.mole');
                    mole.classList.add('hit');
                    
                    // Remove active class and hit effect after a delay
                    setTimeout(() => {
                        hole.classList.remove('active');
                        mole.classList.remove('hit');
                        mole.classList.remove('up');
                    }, 300);
                }
            });
        }
    }
    
    // Start the game
    function startGame() {
        if (gameActive) return;
        
        score = 0;
        timeLeft = 30;
        gameActive = true;
        
        scoreDisplay.textContent = score;
        timerDisplay.textContent = timeLeft;
        
        startButton.disabled = true;
        resetButton.disabled = false;
        
        // Start the timer
        timerId = setInterval(() => {
            timeLeft--;
            timerDisplay.textContent = timeLeft;
            
            if (timeLeft <= 0) {
                endGame();
            }
        }, 1000);
        
        // Start popping up moles
        popUpMole();
    }
    
    // End the game
    function endGame() {
        gameActive = false;
        clearInterval(timerId);
        clearTimeout(moleTimerId);
        
        // Update high score if needed
        if (score > highScore) {
            highScore = score;
            highScoreDisplay.textContent = highScore;
            localStorage.setItem('whackMoleHighScore', highScore);
        }
        
        // Show game over screen
        finalScoreDisplay.textContent = score;
        gameOverScreen.style.display = 'flex';
    }
    
    // Make a mole pop up from a random hole
    function popUpMole() {
        if (!gameActive) return;
        
        // Clear any active moles
        holes.forEach(hole => {
            hole.classList.remove('active');
            const mole = hole.querySelector('.mole');
            mole.classList.remove('up');
        });
        
        // Get a random hole
        const randomIndex = Math.floor(Math.random() * holes.length);
        const hole = holes[randomIndex];
        
        // Make the mole appear
        hole.classList.add('active');
        const mole = hole.querySelector('.mole');
        mole.classList.add('up');
        
        // Make the mole hide after a random time
        const hideDelay = Math.random() * 1000 + 500; // 500ms to 1500ms
        setTimeout(() => {
            if (hole.classList.contains('active')) {
                hole.classList.remove('active');
                mole.classList.remove('up');
            }
        }, hideDelay);
        
        // Schedule next mole appearance
        const nextMoleDelay = Math.random() * 1000 + 500; // 500ms to 1500ms
        moleTimerId = setTimeout(popUpMole, nextMoleDelay);
    }
    
    // Reset the game
    function resetGame() {
        // Clear any active timers
        clearInterval(timerId);
        clearTimeout(moleTimerId);
        
        // Reset game state
        gameActive = false;
        score = 0;
        timeLeft = 30;
        
        // Update UI
        scoreDisplay.textContent = score;
        timerDisplay.textContent = timeLeft;
        
        // Enable/disable buttons
        startButton.disabled = false;
        resetButton.disabled = true;
        
        // Clear any active moles
        holes.forEach(hole => {
            hole.classList.remove('active');
            const mole = hole.querySelector('.mole');
            mole.classList.remove('up');
            mole.classList.remove('hit');
        });
        
        // Hide game over screen if visible
        gameOverScreen.style.display = 'none';
    }
    
    // Event listeners for buttons
    startButton.addEventListener('click', startGame);
    resetButton.addEventListener('click', resetGame);
    playAgainButton.addEventListener('click', () => {
        gameOverScreen.style.display = 'none';
        resetGame();
        startGame();
    });
    
    // Initialize the game board
    createBoard();
});