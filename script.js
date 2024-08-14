const Gameboard = (() => {
    let board = Array(9).fill('');  

    const getBoard = () => board;

    const resetBoard = () => {
        board = Array(9).fill('');
    };

    const makeMove = (index, marker) => {
        if (board[index] === '' && !GameController.gameOver) {
            board[index] = marker;
            return true;
        }
        return false;
    };

    return { getBoard, resetBoard, makeMove };
})();

const Player = (name, marker) => {
    return { name, marker };
};

const GameController = (() => {
    let player1;
    let player2;
    let currentPlayer;
    let gameOver = false;

    const startGame = (name1, name2) => {
        player1 = Player(name1, 'X');
        player2 = Player(name2, 'O');
        currentPlayer = player1;
        gameOver = false;
        Gameboard.resetBoard();
        UIController.updateBoard(Gameboard.getBoard());
        UIController.updateMessage(`${currentPlayer.name}'s turn`);
    };

    const switchPlayer = () => {
        currentPlayer = currentPlayer === player1 ? player2 : player1;
    };

    const playRound = (index) => {
        if (gameOver) return;

        if (Gameboard.makeMove(index, currentPlayer.marker)) {
            UIController.updateBoard(Gameboard.getBoard());
            if (checkWin()) {
                UIController.updateMessage(`${currentPlayer.name} wins!`);
                gameOver = true;
            } else if (Gameboard.getBoard().every(cell => cell !== '')) {
                UIController.updateMessage('Draw!');
                gameOver = true;
            } else {
                switchPlayer();
                UIController.updateMessage(`${currentPlayer.name}'s turn`);
            }
        } else {
            UIController.updateMessage('Invalid move. Try again.');
        }
    };

    const checkWin = () => {
        const board = Gameboard.getBoard();
        const winPatterns = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
            [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
            [0, 4, 8], [2, 4, 6]             // Diagonals
        ];

        return winPatterns.some(pattern => {
            const [a, b, c] = pattern;
            return board[a] && board[a] === board[b] && board[a] === board[c];
        });
    };

    return { startGame, playRound, gameOver };
})();

const UIController = (() => {
    const cells = document.querySelectorAll('.cell');
    const messageElement = document.querySelector('#message');
    const startButton = document.querySelector('#startButton');
    const resetButton = document.querySelector('#resetButton');

    startButton.addEventListener('click', () => {
        const player1Name = document.querySelector('#player1Name').value || 'Player 1';
        const player2Name = document.querySelector('#player2Name').value || 'Player 2';
        GameController.startGame(player1Name, player2Name);
    });

    cells.forEach((cell, index) => {
        cell.addEventListener('click', () => {
            GameController.playRound(index);
        });
    });

    resetButton.addEventListener('click', () => {
        GameController.startGame(document.querySelector('#player1Name').value || 'Player 1', document.querySelector('#player2Name').value || 'Player 2');
    });

    const updateBoard = (board) => {
        cells.forEach((cell, index) => {
            cell.textContent = board[index];
            cell.className = 'cell'; // Reset class
            if (board[index] === 'X') {
                cell.classList.add('x');
            } else if (board[index] === 'O') {
                cell.classList.add('o');
            }
        });
    };

    const updateMessage = (message) => {
        messageElement.textContent = message;
    };

    return { updateBoard, updateMessage };
})();

document.addEventListener('DOMContentLoaded', () => {
    GameController.startGame('Player 1', 'Player 2');
});
