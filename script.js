

let currentTurn = 'X';
let scoreX = 0;
let scoreO = 0;
let scoreDraw = 0;
let gameMode = 'pvp'; // default mode

const cells = document.querySelectorAll('.cell');
const turnText = document.querySelector('#turn-indicator');
const winnerText = document.querySelector('#winner-indicator');
const resetBtn = document.querySelector('#reset-btn');
const pvpBtn = document.querySelector('#pvp-btn');
const easyBtn = document.querySelector('#easy-btn');
const mediumBtn = document.querySelector('#medium-btn');
const hardBtn = document.querySelector('#hard-btn');
const modeIndicator = document.querySelector('#mode-indicator');
const scoreXEl = document.querySelector('#score-x');
const scoreOEl = document.querySelector('#score-o');
const scoreDrawEl = document.querySelector('#score-draw');

pvpBtn.addEventListener('click', () => setMode('pvp'));
easyBtn.addEventListener('click', () => setMode('easy'));
mediumBtn.addEventListener('click', () => setMode('medium'));
hardBtn.addEventListener('click', () => setMode('hard'));
resetBtn.addEventListener('click', resetBoard);

function setMode(mode) {
    gameMode = mode;
    resetBoard();
    highlightSelectedMode();

    if (mode === 'pvp') {
        modeIndicator.textContent = 'PvP Mode';
    } else if (mode === 'easy') {
        modeIndicator.textContent = 'Easy AI Mode';
    } else if (mode === 'medium') {
        modeIndicator.textContent = 'Medium AI Mode';
    } else if (mode === 'hard') {
        modeIndicator.textContent = 'Hard AI Mode';
    }
}

function highlightSelectedMode() {
    [pvpBtn, easyBtn, mediumBtn, hardBtn].forEach(btn => btn.classList.remove('active'));
    document.querySelector(`#${gameMode}-btn`).classList.add('active');
}

function aiMove() {
    if (gameMode === 'easy') {
        aiRandomMove();
    } else if (gameMode === 'medium') {
        aiMediumMove();
    } else if (gameMode === 'hard') {
        aiHardMove();
    }
}

function aiRandomMove() {
    const emptyCells = Array.from(cells).filter(
        (cell) => cell.textContent === ''
    );

    if (emptyCells.length === 0) return;

    const randomIndex = Math.floor(Math.random() * emptyCells.length);
    const chosen = emptyCells[randomIndex];

    chosen.textContent = 'O';

    if (checkWinner()) {
        turnText.textContent = '';
        winnerText.textContent = 'Player O Wins!';
        winnerText.classList.add('show');

        updateScore('O');
        disableBoard();
        return;
  }

  if (checkDraw()) {
        winnerText.textContent = "It's a Draw!";
        winnerText.classList.add('show');
        turnText.textContent = '';
        updateScore('draw');
        return;
    }

    currentTurn = 'X';
    turnText.textContent = 'Turn: X';
}

function aiMediumMove() {
    let move = findWinningMove('O');
    if (!move) move = findWinningMove('X');
    if (!move) move = getRandomEmptyCell();

    move.textContent = 'O';

    if (checkWinner()) {
        winnerText.textContent = 'Player O Wins!';
        winnerText.classList.add('show');
        turnText.textContent = '';

        updateScore('O');
        disableBoard();
        return;
    }

    if (checkDraw()) {
        winnerText.textContent = "It's a Draw!";
        winnerText.classList.add('show');
        turnText.textContent = '';
        updateScore('draw');
        return;
    }

    currentTurn = 'X';
    turnText.textContent = 'Turn: X';
}

function findWinningMove(player) { //I found this algorithm online and decided to use it because it does exactly what is asked 
    const combos = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6],
    ];

    for (const [a, b, c] of combos) {
        const grid = [cells[a], cells[b], cells[c]];
        const marks = grid.map((cell) => cell.textContent);
        const countPlayer = marks.filter((m) => m === player).length;
        const countEmpty = marks.filter((m) => m === '').length;
        if (countPlayer === 2 && countEmpty === 1) {
        return grid.find((cell) => cell.textContent === '');
        }
    }

    return null;
}

function getRandomEmptyCell() {
    const emptyCells = Array.from(cells).filter(
        (cell) => cell.textContent === ''
    );
    return emptyCells[Math.floor(Math.random() * emptyCells.length)];
}

function aiHardMove() { //had help from AI in implimenting the Minimax algorithim in with the structure of my code
    // Get current board as an array of strings
    const board = Array.from(cells).map((cell) => cell.textContent);

    // Run minimax to find the best move for O
    let bestScore = -Infinity;
    let move;

    for (let i = 0; i < board.length; i++) {
        if (board[i] === '') {
        board[i] = 'O';
        let score = minimax(board, 0, false);
        board[i] = '';
        if (score > bestScore) {
            bestScore = score;
            move = i;
        }
        }
    }

    // Make the chosen move on the board
    cells[move].textContent = 'O';

    // Check game end conditions
    if (checkWinner()) {
        turnText.textContent = '';
        winnerText.textContent = 'Player O Wins!';
        winnerText.classList.add('show');

        updateScore('O');
        disableBoard();
        return;
    }

    if (checkDraw()) {
        winnerText.textContent = "It's a Draw!";
        winnerText.classList.add('show');
        turnText.textContent = '';
        updateScore('draw');
        return;
    }

    // Switch back to player X
    currentTurn = 'X';
    turnText.textContent = 'Turn: X';
}

function minimax(board, depth, isMaximizing) {
    // Base cases: check game over states
    if (checkWinFor(board, 'O')) return 1;
    if (checkWinFor(board, 'X')) return -1;
    if (board.every((cell) => cell !== '')) return 0; // draw

    if (isMaximizing) {
        let bestScore = -Infinity;
        for (let i = 0; i < board.length; i++) {
        if (board[i] === '') {
            board[i] = 'O'; // AI move
            let score = minimax(board, depth + 1, false);
            board[i] = '';
            bestScore = Math.max(score, bestScore);
        }
        }
        return bestScore;
    } else {
        let bestScore = Infinity;
        for (let i = 0; i < board.length; i++) {
        if (board[i] === '') {
            board[i] = 'X'; // human move
            let score = minimax(board, depth + 1, true);
            board[i] = '';
            bestScore = Math.min(score, bestScore);
        }
        }
        return bestScore;
    }
}

function checkWinFor(board, player) {
    const combos = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6],
    ];

    return combos.some(([a, b, c]) => {
        return board[a] === player && board[a] === board[b] && board[a] === board[c];
    });
}


function onCellClick(event) {

    const clickedCell = event.target;

    if (clickedCell.textContent !== '') return;
    clickedCell.textContent = currentTurn;

    if (checkWinner()) {
        turnText.textContent = '';
        winnerText.classList.add('show');
        winnerText.textContent = 'Player ' + currentTurn + ' Wins!';

        updateScore(currentTurn);
        disableBoard();
        return;
    }

    if (checkDraw()) {
        winnerText.textContent = "It's a Draw!";
        winnerText.classList.add('show');
        turnText.textContent = '';

        updateScore('draw');

        return;
    }

    if(currentTurn === 'X'){
        currentTurn = 'O';
    } else {
        currentTurn = 'X';
    }
    turnText.textContent = 'Turn: ' + currentTurn;

    if (currentTurn === 'O' && gameMode !== 'pvp') {
    setTimeout(aiMove, 500);
    }
}

function checkWinner() {
    const grid = [
        [cells[0].textContent, cells[1].textContent, cells[2].textContent],
        [cells[3].textContent, cells[4].textContent, cells[5].textContent],
        [cells[6].textContent, cells[7].textContent, cells[8].textContent],
    ];

    // rows
    for (let i = 0; i < 3; i++) {
        if (grid[i][0] && grid[i][0] === grid[i][1] && grid[i][1] === grid[i][2]) {
        return true;
        }
    }

    // columns
    for (let i = 0; i < 3; i++) {
        if (grid[0][i] && grid[0][i] === grid[1][i] && grid[1][i] === grid[2][i]) {
        return true;
        }
    }

    // diagonals
    if (
        (grid[0][0] && grid[0][0] === grid[1][1] && grid[1][1] === grid[2][2]) ||
        (grid[0][2] && grid[0][2] === grid[1][1] && grid[1][1] === grid[2][0])) {
        return true;
    }

    return false;
}

function checkDraw() {
    return Array.from(cells).every((cell) => cell.textContent !== '');
}

function resetBoard() {
    cells.forEach((cell) => {
    cell.textContent = '';
    cell.style.pointerEvents = 'auto';
});

    currentTurn = 'X';
    turnText.textContent = 'Turn: X';
    winnerText.textContent = '';
    winnerText.classList.remove('show');
}

function disableBoard() {
    cells.forEach((cell) => (cell.style.pointerEvents = 'none'));
}

function updateScore(winner) {
    if (winner === 'X') {
        scoreX++;
        scoreXEl.textContent = scoreX;
    } else if (winner === 'O') {
        scoreO++;
        scoreOEl.textContent = scoreO;
    } else {
        scoreDraw++;
        scoreDrawEl.textContent = scoreDraw;
    }
}

cells.forEach((cell) => cell.addEventListener('click', onCellClick));
pvpBtn.addEventListener('click', () => setMode('pvp'));
easyBtn.addEventListener('click', () => setMode('easy'));
mediumBtn.addEventListener('click', () => setMode('medium'));
hardBtn.addEventListener('click', () => setMode('hard'));