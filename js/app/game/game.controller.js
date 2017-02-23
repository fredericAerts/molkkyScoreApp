(function() {
    'use strict';

    angular
        .module('molkkyscore')
        .controller('GameCtrl', GameCtrl);

    GameCtrl.$inject = ['$scope',
                            '$rootScope',
                            '$state',
                            '$translate',
                            'TEMPLATES_ROOT',
                            'gameService',
                            'gameUtilities',
                            'settingsService',
                            'statisticsService',
                            'modalsService',
                            'gameActionSheetService',
                            'loadingService',
                            'toast',
                            '$ionicPopup',
                            'tutorialService'];

    function GameCtrl($scope,
                        $rootScope,
                        $state,
                        $translate,
                        TEMPLATES_ROOT,
                        gameService,
                        gameUtilities,
                        settingsService,
                        statisticsService,
                        modalsService,
                        gameActionSheetService,
                        loadingService,
                        toast,
                        $ionicPopup,
                        tutorialService) {
        /* jshint validthis: true */
        var vm = this;
        var addPlayersToGameModal = {}; // opened from actionSheet
        var settings = {};
        var actionSheetActions = {};
        var toastMessages = toast.getMessages().game;

        vm.participants = [];
        vm.scoreboard = {};
        vm.activatedScore = {};
        vm.activePlayer = {};
        vm.gameEnded = false;
        vm.gameRulesModal = {};
        vm.gameRulesModalVariables = {};
        vm.scoreDetailsModal = {};
        vm.scoreDetailsModalActiveTabIndex = 0;
        vm.isDetailsScoreListSorted = false;
        vm.scoreListSortPredicate = '';
        vm.toggleScoreListSortPredicate = toggleScoreListSortPredicate;
        vm.activateScore = activateScore;
        vm.processThrow = processThrow;
        vm.getScoreboardDetailsRowIterator = getScoreboardDetailsRowIterator;
        vm.showScoreDetailsModal = showScoreDetailsModal;
        vm.showActionSheet = showActionSheet;
        vm.showExitGamePopup = showExitGamePopup;
        vm.showNewGamePopup = showNewGamePopup;

        activate();

        ////////////////

        function activate() {
            initParticipants();
            initScoreboard();
            initGameSettings();
            initGame();

            initScoreDetailsModal();
            initGameRulesModal();
            initAddPlayersToGameModal();
            initActionSheetActions();

            if (gameService.getTutorial().showInvite) {
                showTutorialInvite();
            }
        }

        /*  LISTENERS
            ======================================================================================== */
        $rootScope.$on('$translateChangeSuccess', function () {
            gameActionSheetService.translateActionSheetData();
            toastMessages = toast.getMessages().game;
        });

        $scope.$on('tutorial:finished', function(event) {
            resetActivatedScore(); // untap number
            event.stopPropagation();
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

        function initGameSettings() {
            settings = _.clone(settingsService.getParameters().game);
            if (!settings.isCustom) {
                settingsService.assignDefaultGameParameters(settings);
            }
        }

        function initScoreDetailsModal() {
            return modalsService.initScoreDetailsModal($scope).then(function(modal) {
                vm.scoreDetailsModal = modal;
                return vm.scoreDetailsModal;
            });
        }

        function initGameRulesModal() {
            initGameRulesModalVariables();
            return modalsService.initGameRulesModal($scope).then(function(modal) {
                vm.gameRulesModal = modal;
                return vm.gameRulesModal;
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

        function activateScore($event, score) { // user touched a number
            if (tutorialCheckPoint($event)) {
                return;
            }

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

            if (vm.activatedScore.value > -1) {
                var activatedScore = vm.activatedScore.value;
                var avatarStatus = gameUtilities.getActivatedAvatarStatus(activatedScore, vm.activePlayer, settings);
                vm.activePlayer.activatedAvatarStatus = avatarStatus;
            }
        }

        function processThrow($event) {
            if (tutorialCheckPoint($event) || vm.activatedScore.value < 0) {
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

        function showScoreDetailsModal($event) {
            if (tutorialCheckPoint($event)) {
                return;
            }

            vm.scoreDetailsModal.show();
        }

        function showExitGamePopup() {
            gameActionSheetService.showExitPopup(exitGame, gameUtilities.isGameEnded(vm.participants));
        }

        function showNewGamePopup() {
            gameActionSheetService.showNewPopup(newGame);
        }

        /*  ACTION SHEET FUNCTIONS
            ====================================================================================== */
        function initActionSheetActions() {
            actionSheetActions.showSettingsModal = showSettingsModal;
            actionSheetActions.restart = restartGame;
            actionSheetActions.new = newGame;
            actionSheetActions.undo = undoLast;
            actionSheetActions.exit = exitGame;

            return actionSheetActions;
        }

        function showActionSheet($event) {
            if (tutorialCheckPoint($event)) {
                return;
            }

            var isGameStarted = gameUtilities.isGameStarted(vm.participants);
            var isGameEnded = gameUtilities.isGameEnded(vm.participants);

            vm.settingsAnimation = true;
            gameActionSheetService.showActionSheet(actionSheetActions, isGameStarted, isGameEnded, vm);
        }

        function showSettingsModal() {
            vm.gameRulesModal.show();
        }

        function restartGame() {
            if (!gameUtilities.isGameStarted(vm.participants)) {
                return;
            }

            loadingService.show('RESTARTING-GAME');

            vm.participants = gameService.initParticipants();
            initScoreboard();
            initGame();
        }

        function newGame(isNewPlayers) {

            if (isNewPlayers) {
                addPlayersToGameModal.show();
            }
            else {
                loadingService.show('STARTING-NEW-GAME');

                gameService.sortParticipantsOnScore(); // TODO: Implement this function
                vm.participants = gameService.initParticipants();
                initScoreboard();
                initGame();
            }
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
            if (vm.activatedScore.singlePin || vm.activatedScore.value === 1) {
                // need to be executed before 'playerThrow' event for proper metric 'accuracy' calculation
                statisticsService.updateStatistics('playerThrowsSinglePin', vm.activePlayer, false);
            }
            vm.activePlayer.scoreHistory.unshift(_.clone(vm.activatedScore));
            statisticsService.updateStatistics('playerThrow', vm.activePlayer, false);
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
                statisticsService.updateStatistics('playerReachedMaxScore', vm.activePlayer, false);

                if (vm.activePlayer.endPosition === 1) { // game has winner
                    vm.scoreDetailsModal.show();
                    toast.show(vm.activePlayer.firstName + ' ' + toastMessages.winner);
                    statisticsService.updateStatistics('playerWonGame', vm.activePlayer, false);
                }
            }

            vm.activePlayer.accumulatedScoreHistory.push(vm.activePlayer.disqualified ? 'X' : vm.activePlayer.score);
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
            undoLastStatistics(player);
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

        function undoLastStatistics(player) {
            statisticsService.updateStatistics('playerThrow', vm.activePlayer, true);

            if (player.scoreHistory[0].singlePin) {
                statisticsService.updateStatistics('playerThrowsSinglePin', vm.activePlayer, true);
            }

            if (player.finishedGame) {
                statisticsService.updateStatistics('playerReachedMaxScore', vm.activePlayer, true);
            }

            if (player.endPosition === 1) {
                statisticsService.updateStatistics('playerWonGame', vm.activePlayer, true);
            }
        }

        function resetActivatedScore() {
            vm.activatedScore.value = -1;
            vm.activatedScore.singlePin = false;

            return vm.activatedScore;
        }

        function initGameRulesModalVariables() {
            var settingsOptions = settingsService.getOptions().game;
            var winningScoreExceededValue = settings.winningScoreExceeded;
            var indexWinningScoreExceeded = settingsOptions.winningScoreExceeded.indexOf(winningScoreExceededValue) + 1;
            var winningScoreExceeded = $translate.instant('HOME.SETTINGS.TABS.GAME.WINNING-SCORE-EXCEEDED.OPTION-' +
                                        indexWinningScoreExceeded);
            var indexThreeMisses = settingsOptions.threeMisses.indexOf(settings.threeMisses) + 1;
            var threeMisses = $translate.instant('HOME.SETTINGS.TABS.GAME.THREE-MISSES.OPTION-' + indexThreeMisses);

            vm.gameRulesModalVariables.isCustom = settings.isCustom;
            vm.gameRulesModalVariables.winningScore = settings.winningScore;
            vm.gameRulesModalVariables.winningScoreExceeded = winningScoreExceeded;
            vm.gameRulesModalVariables.threeMisses = threeMisses;
        }

        function showTutorialInvite() {
            // variables only used in popop template
            vm.tutorialTranslationId = 'HOME.TUTORIAL.INVITE-POPUP.TEXT';
            vm.tutorialNeverAskAgain = false;

            var options = {
                title: $translate.instant('HOME.TUTORIAL.INVITE-POPUP.TITLE'),
                templateUrl: TEMPLATES_ROOT + '/game/popup-tutorial.html',
                scope: $scope,
                buttons: [
                    {
                        text: $translate.instant('HOME.GENERAL.CONFIRM.NO')
                    },
                    {
                        text: '<b>' + $translate.instant('HOME.GENERAL.CONFIRM.YES') + '</b>',
                        type: 'button-positive',
                        onTap: function(event) {
                            return true;
                        }
                    }
                ]
            };

            $ionicPopup.show(options)
            .then(function(confirmed) {
                if (confirmed) {
                    tutorialService.startTutorial($scope.$new(true));
                }
                if (vm.tutorialNeverAskAgain) {
                    gameService.getTutorial().showInvite = false;
                    gameService.updateTutorial();
                }
            });
        }

        function tutorialCheckPoint($event) {
            if (tutorialService.isTutorialOngoing()) {
                tutorialService.proceedTutorial($event);

                if (tutorialService.isPreventClickHandler()) {
                    return true;
                }
            }
        }
    }
})();
