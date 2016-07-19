(function() {
    'use strict';

    angular
        .module('molkkyscore')
        .controller('GameCtrl', GameCtrl);

    GameCtrl.$inject = ['gameService', 'playersService', 'settingsService'];

    function GameCtrl(gameService, playersService, settingsService) {
        /* jshint validthis: true */
        var vm = this;

        // vm.participants = gameService.getParticipants();
        vm.participants = playersService.all();
        vm.scoreboard = {};
        vm.activatedScore = -1;
        vm.activePlayer = vm.participants[0];
        vm.activateScore = activateScore;
        vm.processThrow = processThrow;

        var settings = settingsService.getSettings();

        activate();

        ////////////////

        function activate() {
            initScoreboard();
            initParticipants();
        }

        function initScoreboard() {
            vm.scoreboard.rowOne = vm.participants.slice(0, 4);
            vm.scoreboard.rowTwo = vm.participants.slice(4, 8);

            vm.scoreboard.colWidthPercentage = 25;
            if (!vm.scoreboard.rowTwo.length) {
                vm.scoreboard.colWidthPercentage = vm.participants.length === 3 ? 33 : 50;
            }
        }

        function initParticipants() {
            vm.participants.forEach(function(participant) {
                participant.score = 0;
                participant.missesInARow = 0;
                participant.finishedGame = false;
                participant.disqualified = false;
                participant.endPosition = -1;
            });
        }

        function activateScore(score) {
            vm.activatedScore = vm.activatedScore !== score ? score : -1;
        }

        function processThrow() {
            if (vm.activatedScore < 0) {
                return;
            }

            processScore();

            if (!isGameEnded()) {
                moveToNextPlayer();
            }
            else {
                console.log('game has ended');
            }
        }

        /*  Helper functions
            ======================================================================================== */
        function processScore() {
            vm.activePlayer.score += vm.activatedScore;
            vm.activePlayer.missesInARow = vm.activatedScore ? 0 : vm.activePlayer.missesInARow + 1;
            vm.activatedScore = -1; // reset

            if (vm.activePlayer.missesInARow > 2) {
                processThreeMisses();
            }
            else if (vm.activePlayer.score > settings.winningScore) {
                processWinningScoreExceeded();
            }
            else if (vm.activePlayer.score === settings.winningScore) {
                processPlayerFinishedGame();
            }
        }

        function processThreeMisses() {
            switch (settings.threeMisses) {
                case 'to zero': vm.activePlayer.score = 0; break;
                case 'halved': vm.activePlayer.score = Math.floor(vm.activePlayer.score / 2); break;
                case 'disqualified': vm.activePlayer.disqualified = true; break;
            }
        }

        function processWinningScoreExceeded() {
            switch (settings.winningScoreExceeded) {
                case 'to zero': vm.activePlayer.score = 0; break;
                case 'halved': vm.activePlayer.score = Math.floor(vm.activePlayer.score / 2); break;
                case 'half of winning score': vm.activePlayer.score = Math.floor(settings.winningScore / 2); break;
            }
        }

        function processPlayerFinishedGame() {
            vm.activePlayer.finishedGame = true;
            vm.activePlayer.endPosition = getEndPosition();
        }

        function moveToNextPlayer() {
            var activePlayerIndex = _.findIndex(vm.participants, function(participant) {
                return vm.activePlayer === participant;
            });
            var endOfRound = activePlayerIndex >= vm.participants.length - 1;
            vm.activePlayer = endOfRound ? vm.participants[0] : vm.participants[activePlayerIndex + 1];

            if (vm.activePlayer.finishedGame || vm.activePlayer.disqualified) {
                moveToNextPlayer();
            }
        }

        function getEndPosition() {
            var numberOfPlayersThatFinishedGame = 0;

            vm.participants.forEach(function(participant) {
                if (participant.finishedGame) {
                    numberOfPlayersThatFinishedGame += 1;
                }
            });

            return numberOfPlayersThatFinishedGame;
        }

        function isGameEnded() {
            var playersStillParticipating = vm.participants.length;

            vm.participants.forEach(function(participant) {
                if (participant.finishedGame || participant.disqualified) {
                    playersStillParticipating -= 1;
                }
            });

            return playersStillParticipating < 2;
        }
    }
})();
