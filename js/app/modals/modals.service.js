(function() {
    'use strict';

    angular
        .module('molkkyscore')
        .factory('modalsService', modalsService);

    modalsService.$inject = ['TEMPLATES_ROOT',
                                '$rootScope',
                                '$ionicModal',
                                '$translate',
                                'gameService',
                                'playersService',
                                'toast',
                                'loadingService'];

    function modalsService(TEMPLATES_ROOT,
                            $rootScope,
                            $ionicModal,
                            $translate,
                            gameService,
                            playersService,
                            toast,
                            loadingService) {
        /*  Service for creating modals that are used in more than one controller
            ====================================================================== */
        var toastMessages = toast.getMessages().start;

        var service = {
            getAddPlayersToGameModal: getAddPlayersToGameModal,
            initScoreDetailsModal: initScoreDetailsModal,
            initGameRulesModal: initGameRulesModal
        };

        /*  LISTENERS
            ======================================================================================== */
        $rootScope.$on('$translateChangeSuccess', function () {
            toastMessages = toast.getMessages().start;
        });

        return service;

        ////////////////

        function getAddPlayersToGameModal($scope, modalConfirmFunction) {
            /*  ==================================================================
            This modal gets a shallow copy of players from playersService as input,
            and outputs a shallow copy of participants to gameService
            ====================================================================== */
            var addPlayersToGameModal = {};
            var modalScope = $scope.$new(true);
            var guestColors = getGuestColors();

            modalScope.$on('modal.hidden', function() {
                angular.element(document).find('body').removeClass('modal-open');
            });

            return $ionicModal.fromTemplateUrl(TEMPLATES_ROOT + '/modals/modal-start-players.html', {
                scope: modalScope,
                animation: 'slide-in-up'
            })
            .then(function(modal) {
                addPlayersToGameModal = modal;

                /*  ==================================================================
                - modal template should reference 'viewModel' as its scope
                - viewModel data is initialized (reset) each time modal is shown
                ====================================================================== */
                modalScope.viewModel = {
                    isTeamMode: false,
                    showReorder: false,
                    guestColors: guestColors,
                    playersInDatabase: playersService.all().slice(), // modal input
                    teamsInDatabase: playersService.allTeams().slice(), // modal input
                    participants: [], // modal output
                    toggleTeamMode: toggleTeamMode,
                    addPlayerToParticipants: addPlayerToParticipants,
                    addTeamToParticipants: addTeamToParticipants,
                    addGuestParticipant: addGuestParticipant,
                    removeFromParticipants: removeFromParticipants,
                    reorderParticipant: reorderParticipant,
                    cancelAddPlayersToGame: cancelAddPlayersToGame,
                    startGame: startGame
                };

                /*  LISTENERS
                ======================================================================================== */
                modalScope.$on('modal.hidden', function() {
                    resetAddPlayersToGameModal();
                });

                return addPlayersToGameModal;
            });

            /*  FUNCTIONS
                ======================================================================================== */
            function toggleTeamMode() {
                for (var i = modalScope.viewModel.participants.length - 1; i >= 0; i--) {
                    removeFromParticipants(i);
                }

                modalScope.viewModel.isTeamMode = !modalScope.viewModel.isTeamMode;
            }

            function addPlayerToParticipants(newParticipant) {
                if (modalScope.viewModel.participants.length === 8) {
                    toast.show(toastMessages.maxParticipants);
                    return;
                }

                var playerIndex = _.findIndex(modalScope.viewModel.playersInDatabase, function(player) {
                    return player.id === newParticipant.id;
                });
                var playerFromDatabase = modalScope.viewModel.playersInDatabase.splice(playerIndex, 1)[0];
                modalScope.viewModel.participants.push(playerFromDatabase);
            }

            function addTeamToParticipants(newParticipant) {
                if (modalScope.viewModel.participants.length === 8) {
                    toast.show(toastMessages.maxParticipants);
                    return;
                }

                var teamIndex = _.findIndex(modalScope.viewModel.teamsInDatabase, function(team) {
                    return team.id === newParticipant.id;
                });
                var teamFromDatabase = modalScope.viewModel.teamsInDatabase.splice(teamIndex, 1)[0];
                modalScope.viewModel.participants.push(teamFromDatabase);
            }

            function addGuestParticipant() {
                if (modalScope.viewModel.participants.length === 8) {
                    toast.show(toastMessages.maxParticipants);
                    return;
                }
                var guestPlayer = {};
                var guestColor = pickRandomGuestColor();

                if (modalScope.viewModel.isTeamMode) {
                    guestPlayer = {
                        name: 'Mr. ' + capitalizeFirstLetter(guestColor),
                        tagline: $translate.instant('HOME.GAME.GUEST.TAGLINE'),
                        guestColor: guestColor
                    }
                } else {
                    guestPlayer = {
                        firstName: 'Mr.',
                        lastName: capitalizeFirstLetter(guestColor),
                        tagline: $translate.instant('HOME.GAME.GUEST.TAGLINE'),
                        guestColor: guestColor
                    }
                }
                modalScope.viewModel.participants.push(guestPlayer);
            }

            function removeFromParticipants(index) {
                var removedParticipant = modalScope.viewModel.participants.splice(index, 1)[0];

                if (removedParticipant.guestColor) {
                    modalScope.viewModel.guestColors.push(removedParticipant.guestColor);
                } else if (!modalScope.viewModel.isTeamMode) {
                    modalScope.viewModel.playersInDatabase.push(removedParticipant);
                } else if (modalScope.viewModel.isTeamMode) {
                    modalScope.viewModel.teamsInDatabase.push(removedParticipant);
                }
            }

            function reorderParticipant(item, fromIndex, toIndex) {
                modalScope.viewModel.participants.splice(fromIndex, 1);
                modalScope.viewModel.participants.splice(toIndex, 0, item);
            }

            function cancelAddPlayersToGame() {
                addPlayersToGameModal.hide();
            }

            function startGame() {
                gameService.setParticipants(modalScope.viewModel.participants.slice());
                gameService.setTeamMode(modalScope.viewModel.isTeamMode);

                loadingService.show('STARTING-GAME');

                addPlayersToGameModal.hide()
                .then(function() {
                    modalConfirmFunction();
                });
            }

            /*  Helper functions
            ======================================================================================== */
            function resetAddPlayersToGameModal() {
                modalScope.viewModel.isTeamMode = false;
                modalScope.viewModel.showReorder = false;
                modalScope.viewModel.guestColors = getGuestColors();
                modalScope.viewModel.playersInDatabase = playersService.all().slice();
                modalScope.viewModel.teamsInDatabase = playersService.allTeams().slice();
                modalScope.viewModel.participants = [];
            }

            function pickRandomGuestColor() {
                var colorIndex = Math.floor(Math.random() * modalScope.viewModel.guestColors.length);

                return modalScope.viewModel.guestColors.splice(colorIndex, 1)[0];
            }

            function capitalizeFirstLetter(string) {
                return string.charAt(0).toUpperCase() + string.slice(1);
            }
        }

        function initScoreDetailsModal($scope) {
            $scope.$on('modal.hidden', function() {
                angular.element(document).find('body').removeClass('modal-open');
            });

            return $ionicModal.fromTemplateUrl(TEMPLATES_ROOT + '/game/modal-score-details.html', {
                scope: $scope,
                animation: 'slide-in-up'
            });
        }

        function initGameRulesModal($scope) {
            $scope.$on('modal.hidden', function() {
                angular.element(document).find('body').removeClass('modal-open');
            });

            return $ionicModal.fromTemplateUrl(TEMPLATES_ROOT + '/game/modal-game-rules.html', {
                scope: $scope,
                animation: 'slide-in-up'
            });
        }

        function getGuestColors() {
            return ['blonde', 'orange', 'pink', 'white', 'brown', 'blue', 'green', 'purple'];
        }
    }
})();
