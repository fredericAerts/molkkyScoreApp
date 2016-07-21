(function() {
    'use strict';

    angular
        .module('molkkyscore')
        .controller('GameCtrl', GameCtrl);

    GameCtrl.$inject = ['$scope',
                            'gameService',
                            'settingsService',
                            'modalsService',
                            'TEMPLATES_ROOT',
                            '$ionicModal',
                            '$ionicActionSheet'];

    function GameCtrl($scope,
                        gameService,
                        settingsService,
                        modalsService,
                        TEMPLATES_ROOT,
                        $ionicModal,
                        $ionicActionSheet) {
        /* jshint validthis: true */
        var vm = this;
        var addPlayersToGameModal = {}; // opened from actionSheet
        var settings = settingsService.getSettings();

        vm.participants = [];
        vm.scoreboard = {};
        vm.activatedScore = -1;
        vm.activePlayer = {};
        vm.scoreDetailsModal = {};
        vm.scoreDetailsModalActiveTabIndex = 0;
        vm.activateScore = activateScore;
        vm.processThrow = processThrow;
        vm.getScoreboardDetailsRowIterator = getScoreboardDetailsRowIterator;
        vm.showActionSheet = showActionSheet;

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
            // vm.participants = gameService.getParticipants();
            vm.participants = [
                {
                    id: 0,
                    firstName: 'Ben',
                    lastName: 'Sparrow',
                    tagline: 'You on your way?',
                    face: 'img/ben.png'
                },
                {
                    id: 1,
                    firstName: 'Max',
                    lastName: 'Lynx',
                    tagline: 'Hey, it\'s me',
                    face: 'img/max.png'
                },
                {
                    id: 2,
                    firstName: 'Adam',
                    lastName: 'Bradleyson',
                    tagline: 'I should buy a boat',
                    face: 'img/adam.jpg'
                },
                {
                    id: 3,
                    firstName: 'Perry',
                    lastName: 'Governor',
                    tagline: 'Look at my mukluks!',
                    face: 'img/perry.png'
                },
                {
                    id: 4,
                    firstName: 'Mike',
                    lastName: 'Harrington',
                    tagline: 'This is wicked good ice cream.',
                    face: 'img/mike.png'
                },
                {
                    id: 5,
                    firstName: 'Dummy',
                    lastName: 'player',
                    tagline: 'I have a grey avatar.',
                    face: ''
                },
                {
                    id: 6,
                    firstName: 'Mr.',
                    lastName: 'Pink',
                    guestColor: 'pink'
                },
                {
                    id: 7,
                    firstName: 'Dummy2',
                    lastName: 'player2',
                    tagline: 'I have a grey avatar2.',
                    face: ''
                }
            ];

            vm.participants.forEach(function(participant) {
                participant.score = 0;
                participant.scoreHistory = [];
                participant.accumulatedScoreHistory = [];
                participant.missesInARow = 0;
                participant.finishedGame = false;
                participant.disqualified = false;
                participant.endPosition = -1;
                participant.activedAvatarStatus = '';
            });
        }

        function initGame() {
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

        function showActionSheet() {
            // Show the action sheet
            var hideSheet = $ionicActionSheet.show({
                buttons: [
                    {text: 'Restart game'},
                    {text: 'New game'},
                    {text: 'Undo last'},
                    {text: 'Exit game'},
                ],
                titleText: 'Options',
                cancelText: 'Continue',
                cancel: function() {
                    // add cancel code..
                },
                buttonClicked: function(index) {
                    switch (index) {
                        case 1: addPlayersToGameModal.show();
                    }
                    return true;
                }
            });
        }

        function activateScore(score) { // user touched a number
            vm.activatedScore = vm.activatedScore !== score ? score : -1;

            if (vm.activatedScore > -1) {
                vm.activePlayer.activedAvatarStatus = getActivedAvatarStatus();
            }
            else {
                vm.activePlayer.activedAvatarStatus = ''; // reset
            }
        }

        function processThrow() {
            if (vm.activatedScore < 0) {
                return;
            }

            vm.activePlayer.activedAvatarStatus = ''; // reset
            processScore();

            if (!isGameEnded()) {
                moveToNextPlayer();
            }
            else {
                console.log('game has ended');
            }
        }

        function getScoreboardDetailsRowIterator() {
            return new Array(vm.participants[0].accumulatedScoreHistory.length);
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
                vm.activePlayer.missesInARow = 0; // reset
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

        function getActivedAvatarStatus() {
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
    }
})();
