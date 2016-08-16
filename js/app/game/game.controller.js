(function() {
    'use strict';

    angular
        .module('molkkyscore')
        .controller('GameCtrl', GameCtrl);

    GameCtrl.$inject = ['$scope',
                            '$rootScope',
                            '$state',
                            'gameService',
                            'settingsService',
                            'modalsService',
                            'gameActionSheetService',
                            'TEMPLATES_ROOT',
                            '$ionicModal'];

    function GameCtrl($scope,
                        $rootScope,
                        $state,
                        gameService,
                        settingsService,
                        modalsService,
                        gameActionSheetService,
                        TEMPLATES_ROOT,
                        $ionicModal) {
        /* jshint validthis: true */
        var vm = this;
        var addPlayersToGameModal = {}; // opened from actionSheet
        var settings = settingsService.getSettings();
        var actionSheetActions = getActionSheetActions();

        vm.participants = [];
        vm.scoreboard = {};
        vm.activatedScore = -1;
        vm.activePlayer = {};
        vm.gameEnded = false;
        vm.scoreDetailsModal = {};
        vm.scoreDetailsModalActiveTabIndex = 0;
        vm.activateScore = activateScore;
        vm.processThrow = processThrow;
        vm.getScoreboardDetailsRowIterator = getScoreboardDetailsRowIterator;
        vm.showActionSheet = showActionSheet;
        vm.showExitGamePopup = showExitGamePopup;
        vm.showNewGamePopup = showNewGamePopup;

        activate();

        ////////////////

        function activate() {
            initParticipants();
            initScoreboard();
            initGame();

            initScoreDetailsModal();
            initAddPlayersToGameModal();
        }

        /*  LISTENERS
            ======================================================================================== */
        $rootScope.$on('$translateChangeSuccess', function () {
            gameActionSheetService.translateActionSheetData();
        });

        // Cleanup the modal when we're done with it!
        $scope.$on('$destroy', function() {
            addPlayersToGameModal.remove();
            vm.scoreDetailsModal.remove();
        });

        /*  FUNCTIONS
            ======================================================================================== */
        function initScoreboard() {
            vm.scoreboard.rowOne = vm.participants.slice(0, 4);
            vm.scoreboard.rowTwo = vm.participants.slice(4, 8);

            switch (vm.participants.length) {
                case 2: vm.scoreboard.colWidthPercentage = 50; break;
                case 3: vm.scoreboard.colWidthPercentage = 33; break;
                default: vm.scoreboard.colWidthPercentage = 25;
            }
        }

        function initParticipants() {
            vm.participants = gameService.initParticipants();
        }

        function initGame() {
            vm.gameEnded = false;
            vm.activatedScore = -1;
            vm.activePlayer = vm.participants[0];
        }

        function initScoreDetailsModal() {
            return $ionicModal.fromTemplateUrl(TEMPLATES_ROOT + '/game/modal-score-details.html', {
                scope: $scope,
                animation: 'slide-in-up'
            })
            .then(function(modal) {
                vm.scoreDetailsModal = modal;
                return vm.scoreDetailsModal;
            });
        }

        function initAddPlayersToGameModal() {
            return modalsService.getAddPlayersToGameModal($scope, addPlayersToGameModalConfirmFunction)
            .then(function(modal) {
                addPlayersToGameModal = modal;
                return addPlayersToGameModal;
            });

            function addPlayersToGameModalConfirmFunction() {
                initParticipants();
                initScoreboard();
                initGame();
            }
        }

        function activateScore(score) { // user touched a number
            vm.activatedScore = vm.activatedScore !== score ? score : -1;

            if (vm.activatedScore > -1) {
                vm.activePlayer.activatedAvatarStatus = getActivatedAvatarStatus();
            }
            else {
                vm.activePlayer.activatedAvatarStatus = ''; // reset
            }
        }

        function processThrow() {
            if (vm.activatedScore < 0) {
                return;
            }

            vm.activePlayer.activatedAvatarStatus = ''; // reset
            processScore();

            if (!isGameEnded()) {
                moveToNextPlayer();
            }
            else {
                vm.gameEnded = true;
                vm.scoreDetailsModal.show();
            }
        }

        function getScoreboardDetailsRowIterator() {
            if (vm.participants[0]) {
                return new Array(vm.activePlayer.scoreHistory.length + 1);
            }
            else {
                return [];
            }
        }

        function showExitGamePopup() {
            gameActionSheetService.showExitPopup(exitGame, isGameEnded());
        }

        function showNewGamePopup() {
            gameActionSheetService.showNewPopup(newGame);
        }

        /*  ACTION SHEET FUNCTIONS
            ====================================================================================== */
        function getActionSheetActions() {
            return {
                restart: restartGame,
                new: newGame,
                undo: undoLast,
                exit: exitGame
            };
        }

        function showActionSheet() {
            vm.settingsAnimation = true;
            gameActionSheetService.showActionSheet(actionSheetActions, isGameStarted(), isGameEnded(), vm);
        }

        function restartGame() {
            if (!isGameStarted()) {
                return;
            }

            vm.participants = gameService.initParticipants();
            initScoreboard();
            initGame();
        }

        function newGame(isNewPlayers) {
            if (isNewPlayers) {
                addPlayersToGameModal.show();
            }
            else {
                gameService.sortParticipantsOnScore(); // TODO: Implement this function
                vm.participants = gameService.initParticipants();
                initScoreboard();
                initGame();
            }

            vm.scoreDetailsModal.hide();
        }

        function undoLast() {
            if (!isGameStarted()) {
                return;
            }

            moveToPreviousPlayer(vm.activePlayer.scoreHistory.length + 1, getActivePlayerIndex());
            undoLastThrow(vm.activePlayer);
        }

        function exitGame() {
            $state.go('tab.home');
        }

        /*  Helper functions
            ======================================================================================== */
        function processScore() {
            vm.activePlayer.scoreHistory.unshift(vm.activatedScore);
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

            vm.activePlayer.accumulatedScoreHistory.push(vm.activePlayer.score);
        }

        function processThreeMisses() {
            switch (settings.threeMisses) {
                case 'to zero':
                    vm.activePlayer.score = 0;
                    vm.activePlayer.missesInARow = 0; // reset
                    break;
                case 'halved':
                    vm.activePlayer.score = Math.floor(vm.activePlayer.score / 2);
                    vm.activePlayer.missesInARow = 0; // reset
                    break;
                case 'disqualified':
                    vm.activePlayer.disqualified = true;
                    break;
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

            if (vm.activePlayer.endPosition === 1) {
                vm.scoreDetailsModal.show();
            }
        }

        function moveToNextPlayer() {
            var activePlayerIndex = getActivePlayerIndex();
            var endOfRound = activePlayerIndex >= vm.participants.length - 1;
            vm.activePlayer = endOfRound ? vm.participants[0] : vm.participants[activePlayerIndex + 1];

            if (vm.activePlayer.finishedGame || vm.activePlayer.disqualified) {
                moveToNextPlayer();
            }
        }

        function moveToPreviousPlayer(currentThrowNumber, throwingPlayerIndex) {
            var activePlayerIndex = getActivePlayerIndex();
            var firstOfRound = activePlayerIndex === 0;

            vm.activePlayer = firstOfRound ? vm.participants[vm.participants.length - 1] : vm.participants[activePlayerIndex - 1];

            var isInSameRound = throwingPlayerIndex > getActivePlayerIndex();

            if (isInSameRound) {
                if (currentThrowNumber !== vm.activePlayer.scoreHistory.length) {
                    moveToPreviousPlayer(currentThrowNumber, throwingPlayerIndex);
                }
            }
            else {
                if (currentThrowNumber !== vm.activePlayer.scoreHistory.length + 1) {
                    moveToPreviousPlayer(currentThrowNumber, throwingPlayerIndex);
                }
            }
        }

        function getActivePlayerIndex() {
            var activePlayerIndex = _.findIndex(vm.participants, function(participant) {
                return vm.activePlayer === participant;
            });

            return activePlayerIndex;
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

        function undoLastThrow(player) {
            var isFirstThrow = player.accumulatedScoreHistory.length < 2;
            vm.activatedScore = -1;
            player.scoreHistory.shift();
            player.accumulatedScoreHistory.pop();
            player.score = isFirstThrow ? 0 : player.accumulatedScoreHistory[player.accumulatedScoreHistory.length - 1];
            if (player.missesInARow) {
                player.missesInARow = player.missesInARow - 1;
            }
            player.finishedGame = false;
            player.disqualified = false;
            player.endPosition = -1;
            player.activatedAvatarStatus = '';
        }

        function getActivatedAvatarStatus() {
            var status = '';
            var potentialScore = vm.activePlayer.score + vm.activatedScore;

            if (vm.activatedScore === 0 && vm.activePlayer.missesInARow === 2) {
                status = settings.threeMisses === 'disqualified' ? 'error' : 'warning';
            }
            else if (potentialScore > settings.winningScore) {
                status = 'warning';
            }
            else if (potentialScore === settings.winningScore) {
                status = 'success';
            }

            return status;
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

        function isGameStarted() {
            return vm.participants[0].scoreHistory.length;
        }
    }
})();
