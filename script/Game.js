document.addEventListener('DOMContentLoaded', function() {
    var playerForm = document.getElementById('player-form');
    var playerNameInput = document.getElementById('player-name');
    var gameBoard = document.getElementById('game-board');
    var timerElement = document.getElementById('timer');
    var scoreElement = document.getElementById('score');
    var currentWordElement = document.getElementById('current-word');
    var wordListElement = document.getElementById('word-list');
    var endGameButton = document.getElementById('end-game');
    var boardElement = document.getElementById('board');
    var deleteWordButton = document.getElementById('delete-word');
    var validateWordButton = document.getElementById('validate-word');

    var game = {
        timer: null,
        timeLeft: 180,
        score: 0,
        currentWord: '',
        currentWordPath: [], // Para rastrear las celdas seleccionadas
        wordsFound: [],
        playerName: '',
        board: generateBoard()
    };

    function generateBoard() {
        var letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        var board = [];
        for (var i = 0; i < 16; i++) { // Tablero de 4x4
            board.push(letters.charAt(Math.floor(Math.random() * letters.length)));
        }
        return board;
    }

    function startGame() {
        game.playerName = playerNameInput.value;
        if (game.playerName.length < 3) {
            alert('El nombre debe tener al menos 3 letras.');
            return;
        }

        playerForm.classList.add('hidden');
        gameBoard.classList.remove('hidden');
        game.timeLeft = 180;
        game.score = 0;
        game.currentWord = '';
        game.currentWordPath = [];
        game.wordsFound = [];
        game.board = generateBoard(); // Generar un nuevo tablero cada vez que se inicia el juego
        updateBoard();
        updateTimer();
        game.timer = setInterval(updateTimer, 1000);
    }

    function updateBoard() {
        boardElement.innerHTML = '';
        game.board.forEach(function(letter, index) {
            var cell = document.createElement('div');
            cell.textContent = letter;
            cell.dataset.index = index;
            cell.classList.add('board-cell'); // Añadir la clase board-cell
            cell.addEventListener('click', function() {
                selectLetter(letter, index);
            });
            boardElement.appendChild(cell);
        });
    }

    function selectLetter(letter, index) {
        if (game.currentWordPath.length === 0 || isValidSelection(index)) {
            game.currentWord += letter;
            game.currentWordPath.push(index);
            currentWordElement.textContent = game.currentWord;
            document.querySelector(`[data-index='${index}']`).classList.add('selected');
        }
    }

    function isValidSelection(index) {
        var lastIndex = game.currentWordPath[game.currentWordPath.length - 1];
        var validMoves = [
            lastIndex - 5, lastIndex - 4, lastIndex - 3, // Fila anterior
            lastIndex - 1, lastIndex + 1,               // Misma fila
            lastIndex + 3, lastIndex + 4, lastIndex + 5 // Siguiente fila
        ];
        return validMoves.includes(index) && !game.currentWordPath.includes(index);
    }

    function validateWord(word) {
        if (word.length < 3) {
            alert('La palabra debe tener al menos 3 letras.');
            deleteWordButton.click();
            return;
        }

        if (game.wordsFound.includes(word)) {
            alert('Esta palabra ya ha sido encontrada.');
            deleteWordButton.click(); // Eliminar la palabra si ya ha sido encontrada
            return;
        }

        fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`)
            .then(response => response.json())
            .then(data => {
                if (data.title !== 'No Definitions Found') {
                    game.wordsFound.push(word);
                    game.score += word.length;
                    scoreElement.textContent = 'Puntaje: ' + game.score;
                    wordListElement.innerHTML += `<li>${word}</li>`;
                    game.currentWord = '';
                    game.currentWordPath = [];
                    currentWordElement.textContent = '';
                    clearSelectedCells();
                } else {
                    alert('Palabra no válida');
                    deleteWordButton.click(); // Eliminar la palabra si no es válida
                }
            })
            .catch(error => {
                console.error('Error al validar la palabra:', error);
                alert('Error al validar la palabra. Inténtalo de nuevo.');
            });
    }

    function clearSelectedCells() {
        document.querySelectorAll('.selected').forEach(function(cell) {
            cell.classList.remove('selected');
        });
    }

    function updateTimer() {
        if (game.timeLeft <= 0) {
            clearInterval(game.timer);
            alert('El tiempo ha terminado. Tu puntaje es: ' + game.score);
            resetGame();
            return;
        }
        game.timeLeft--;
        timerElement.textContent = 'Tiempo: ' + game.timeLeft;
    }

    playerForm.addEventListener('submit', function(event) {
        event.preventDefault();
        startGame();
    });

    endGameButton.addEventListener('click', function() {
        clearInterval(game.timer);
        alert('Juego terminado. Tu puntaje es: ' + game.score);
        resetGame(); // Reiniciar el juego al finalizar temporizador
    });

    deleteWordButton.addEventListener('click', function() {
        game.currentWord = '';
        game.currentWordPath = [];
        currentWordElement.textContent = '';
        clearSelectedCells();
    });

    validateWordButton.addEventListener('click', function() {
        if (game.currentWord.length > 0) {
            validateWord(game.currentWord);
        }
    });

    function resetGame() {
        game.playerName = '';
        game.timeLeft = 180;
        game.score = 0;
        game.currentWord = '';
        game.currentWordPath = [];
        game.wordsFound = [];
        game.board = generateBoard();
        updateBoard();
        scoreElement.textContent = 'Puntaje: 0';
        wordListElement.innerHTML = '';
        currentWordElement.textContent = '';
        playerForm.classList.remove('hidden');
        gameBoard.classList.add('hidden');
    }
});
