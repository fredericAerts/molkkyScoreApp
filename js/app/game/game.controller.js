(function() {
    'use strict';

    angular
        .module('molkkyscore')
        .controller('GameCtrl', GameCtrl);

    GameCtrl.$inject = ['$scope',
                            '$rootScope',
                            '$state',
                            'gameService',
                            'gameUtilities',
                            'settingsService',
                            'statisticsService',
                            'modalsService',
                            'gameActionSheetService',
                            'loadingService',
                            'toast'];

    function GameCtrl($scope,
                        $rootScope,
                        $state,
                        gameService,
                        gameUtilities,
                        settingsService,
                        statisticsService,
                        modalsService,
                        gameActionSheetService,
                        loadingService,
                        toast) {
        /* jshint validthis: true */
        var vm = this;
        var addPlayersToGameModal = {}; // opened from actionSheet
        var settings = settingsService.getParameters().game;
        var actionSheetActions = getActionSheetActions();
        var toastMessages = toast.getMessages().game;

        vm.participants = [];
        vm.scoreboard = {};
        vm.activatedScore = {};
        vm.activePlayer = {};
        vm.gameEnded = false;
        vm.scoreDetailsModal = {};
        vm.scoreDetailsModalActiveTabIndex = 0;
        vm.isDetailsScoreListSorted = false;
        vm.scoreListSortPredicate = '';
        vm.toggleScoreListSortPredicate = toggleScoreListSortPredicate;
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
            toastMessages = toast.getMessages().game;
        });

        // Cleanup the modal when we're done with it!
        $scope.$on('$destroy', function() {
            addPlayersToGameModal.remove();
            vm.scoreDetailsModal.remove();
        });

        /*  FUNCTIONS
            ======================================================================================== */
        function initParticipants() {
            vm.participants = gameService.initParticipants();
        }

        function initScoreboard() {
            vm.scoreboard = gameService.initScoreboard(vm.scoreboard);
        }

        function initGame() {
            vm.gameEnded = false;
            resetActivatedScore();
            vm.activePlayer = vm.participants[0];
        }

        function initScoreDetailsModal() {
            return modalsService.initScoreDetailsModal($scope).then(function(modal) {
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
            if (score === 0 || score === 1) {
                vm.activatedScore.value = vm.activatedScore.value === score ? resetActivatedScore().value : score;
            }
            else if (vm.activatedScore.singlePin && vm.activatedScore.value === score) {
                vm.activatedScore.singlePin = false;
            }
            else if (vm.activatedScore.value === score) {
                resetActivatedScore();
                vm.activePlayer.activatedAvatarStatus = ''; // reset
            }
            else {
                vm.activatedScore.value = score;
                vm.activatedScore.singlePin = true;
            }

            if (vm.activatedScore.value.value > -1) {
                vm.activePlayer.activatedAvatarStatus = gameUtilities.getActivatedAvatarStatus(vm.activatedScore.value, vm.activePlayer, settings);
            }
        }

        function processThrow() {
            if (vm.activatedScore.value < 0) {
                return;
            }

            vm.activePlayer.activatedAvatarStatus = ''; // reset
            processScore();

            if (!gameUtilities.isGameEnded(vm.participants)) {
                moveToNextPlayer();
            }
            else {
                vm.gameEnded = true;
                vm.scoreDetailsModal.show();
            }
        }

        function toggleScoreListSortPredicate() {
            vm.scoreListSortPredicate = vm.isDetailsScoreListSorted ? ['-score', 'endPosition'] : '';
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
            gameActionSheetService.showExitPopup(exitGame, gameUtilities.isGameEnded(vm.participants));
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
            var isGameStarted = gameUtilities.isGameStarted(vm.participants);
            var isGameEnded = gameUtilities.isGameEnded(vm.participants);

            vm.settingsAnimation = true;
            gameActionSheetService.showActionSheet(actionSheetActions, isGameStarted, isGameEnded, vm);
        }

        function restartGame() {
            if (!gameUtilities.isGameStarted(vm.participants)) {
                return;
            }

            loadingService.show('restarting game');

            vm.participants = gameService.initParticipants();
            initScoreboard();
            initGame();
        }

        function newGame(isNewPlayers) {
            if (isNewPlayers) {
                addPlayersToGameModal.show();
            }
            else {
                loadingService.show('starting new game');

                gameService.sortParticipantsOnScore(); // TODO: Implement this function
                vm.participants = gameService.initParticipants();
                initScoreboard();
                initGame();
            }

            vm.scoreDetailsModal.hide();
        }

        function undoLast() {
            if (!gameUtilities.isGameStarted(vm.participants)) {
                return;
            }

            var activePlayerIndex = gameUtilities.getActivePlayerIndex(vm.activePlayer, vm.participants);

            moveToPreviousPlayer(vm.activePlayer.scoreHistory.length + 1, activePlayerIndex);
            undoLastThrow(vm.activePlayer);
            toast.show(toastMessages.undoLast);
        }

        function exitGame() {
            $state.go('tab.home');
        }

        /*  Helper functions
            ======================================================================================== */
        function processScore() {
            vm.activePlayer.scoreHistory.unshift(vm.activatedScore.value);
            statisticsService.updateStatistics('playerThrow', vm.activePlayer);
            if (vm.activatedScore.singlePin || vm.activatedScore.value === 1) {
                statisticsService.updateStatistics('playerThrowsSinglePin', vm.activePlayer);
            }
            vm.activePlayer.score += vm.activatedScore.value;
            vm.activePlayer.missesInARow = vm.activatedScore.value ? 0 : vm.activePlayer.missesInARow + 1;
            resetActivatedScore();

            if (vm.activePlayer.missesInARow > 2) {
                gameUtilities.processThreeMisses(vm.activePlayer, settings);
                toast.show(vm.activePlayer.firstName + ' ' + toastMessages.threeMisses);
            }
            else if (vm.activePlayer.score > settings.winningScore) {
                gameUtilities.processWinningScoreExceeded(vm.activePlayer, settings);
                toast.show(vm.activePlayer.firstName + ' ' + toastMessages.maxScoreExceeded);
            }
            else if (vm.activePlayer.score === settings.winningScore) { // player finished
                vm.activePlayer.finishedGame = true;
                vm.activePlayer.endPosition = gameUtilities.getEndPosition(vm.participants);
                statisticsService.updateStatistics('playerReachedMaxScore', vm.activePlayer);

                if (vm.activePlayer.endPosition === 1) { // game has winner
                    vm.scoreDetailsModal.show();
                    toast.show(vm.activePlayer.firstName + ' ' + toastMessages.winner);
                    statisticsService.updateStatistics('playerWonGame', vm.activePlayer);
                }
            }

            vm.activePlayer.accumulatedScoreHistory.push(vm.activePlayer.score);

            if (vm.activePlayer.disqualified) {
                vm.activePlayer.score = 0;
            }
        }

        function moveToNextPlayer() {
            var activePlayerIndex = gameUtilities.getActivePlayerIndex(vm.activePlayer, vm.participants);
            var endOfRound = activePlayerIndex >= vm.participants.length - 1;
            vm.activePlayer = endOfRound ? vm.participants[0] : vm.participants[activePlayerIndex + 1];

            if (vm.activePlayer.finishedGame || vm.activePlayer.disqualified) {
                moveToNextPlayer();
            }
        }

        function moveToPreviousPlayer(currentThrowNumber, throwingPlayerIndex) {
            var activePlayerIndex = gameUtilities.getActivePlayerIndex(vm.activePlayer, vm.participants);
            var firstOfRound = activePlayerIndex === 0;

            if (firstOfRound) {
                vm.activePlayer = vm.participants[vm.participants.length - 1];
            }
            else {
                vm.activePlayer = vm.participants[activePlayerIndex - 1];
            }

            activePlayerIndex = gameUtilities.getActivePlayerIndex(vm.activePlayer, vm.participants);
            var isInSameRound = throwingPlayerIndex > activePlayerIndex;

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

        function undoLastThrow(player) {
            var isFirstThrow = player.accumulatedScoreHistory.length < 2;
            resetActivatedScore();
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

        function resetActivatedScore() {
            vm.activatedScore.value = -1;
            vm.activatedScore.singlePin = false;

            return vm.activatedScore;
        }
    }
})();
