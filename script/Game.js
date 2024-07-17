'use strict';

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

    var game = {
        timer: null,
        timeLeft: 180,
        score: 0,
        currentWord: '',
        wordsFound: [],
        playerName: '',
        board: generateBoard()
    };

    function generateBoard() {
        var letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        var board = [];
        for (var i = 0; i < 16; i++) {
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
        game.wordsFound = [];
        updateBoard();
        updateTimer();
        game.timer = setInterval(updateTimer, 1000);
    }

    function updateBoard() {
        boardElement.innerHTML = '';
        game.board.forEach(function(letter, index) {
            var cell = document.createElement('div');
            cell.textContent = letter;
            cell.addEventListener('click', function() {
                selectLetter(index);
            });
            boardElement.appendChild(cell);
        });
    }

    function selectLetter(index) {
        // Lógica para seleccionar letras
    }

    function updateTimer() {
        if (game.timeLeft <= 0) {
            clearInterval(game.timer);
            alert('El tiempo ha terminado. Tu puntaje es: ' + game.score);
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
    });
});
