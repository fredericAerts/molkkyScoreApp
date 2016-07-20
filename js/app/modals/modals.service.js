(function() {
    'use strict';

    angular
        .module('molkkyscore')
        .factory('modalsService', modalsService);

    modalsService.$inject = ['$state', 'TEMPLATES_ROOT','$ionicModal', 'gameService', 'playersService'];

    function modalsService($state, TEMPLATES_ROOT, $ionicModal, gameService, playersService) {

        var service = {
            getAddPlayersToGameModal: getAddPlayersToGameModal
        };
        return service;

        ////////////////

        function getAddPlayersToGameModal($scope) {
            /*  ==================================================================
            This modal gets a shallow copy of players from playersService as input,
            and outputs a shallow copy of participants to gameService
            ====================================================================== */
            var addPlayersToGameModal = {};
            var modalScope = $scope.$new(true);

            return $ionicModal.fromTemplateUrl(TEMPLATES_ROOT + '/modals/modal-start-players.html', {
                scope: modalScope,
                animation: 'slide-in-up'
            })
            .then(function(modal) {
                /*  ==================================================================
                - modal template should reference 'viewModel' as its scope
                - viewModel data is initialized (reset) each time modal is shown
                ====================================================================== */
                modalScope.viewModel = {
                    showReorder: false,
                    guestColors: ['blonde', 'orange', 'pink', 'white', 'brown', 'blue'],
                    playersInDatabase: playersService.all().slice(), // modal input
                    participants: [], // modal output
                    addPlayerToParticipants: addPlayerToParticipants,
                    addGuestParticipant: addGuestParticipant,
                    removePlayerFromParticipants: removePlayerFromParticipants,
                    reorderParticipant: reorderParticipant,
                    cancelAddPlayersToGame: cancelAddPlayersToGame,
                    startGame: startGame
                };

                addPlayersToGameModal = modal;

                return addPlayersToGameModal;
            });

            function addPlayerToParticipants(newParticipant) {
                var playerIndex = _.findIndex(modalScope.viewModel.playersInDatabase, function(player) {
                    return player.id === newParticipant.id;
                });
                var playerFromDatabase = modalScope.viewModel.playersInDatabase.splice(playerIndex, 1)[0];
                modalScope.viewModel.participants.push(playerFromDatabase);
            }

            function addGuestParticipant() {
                var guestColor = pickRandomGuestColor();

                modalScope.viewModel.participants.push({
                    firstName: 'Mr.',
                    lastName: capitalizeFirstLetter(guestColor),
                    guestColor: guestColor
                });
            }

            function removePlayerFromParticipants(index) {
                var removedPlayer = modalScope.viewModel.participants.splice(index, 1)[0];

                if (removedPlayer.guestColor) {
                    modalScope.viewModel.guestColors.push(removedPlayer.guestColor);
                }
                else {
                    modalScope.viewModel.playersInDatabase.push(removedPlayer);
                }
            }

            function reorderParticipant(player, fromIndex, toIndex) {
                modalScope.viewModel.participants.splice(fromIndex, 1);
                modalScope.viewModel.participants.splice(toIndex, 0, player);
            }

            function cancelAddPlayersToGame() {
                addPlayersToGameModal.hide();
            }

            function startGame() {
                gameService.setParticipants(modalScope.viewModel.participants.slice());

                $state.go('game');

                addPlayersToGameModal.hide();
            }

            /*  Helper functions
            ======================================================================================== */
            function pickRandomGuestColor() {
                var colorIndex = Math.floor(Math.random() * modalScope.viewModel.guestColors.length);

                return modalScope.viewModel.guestColors.splice(colorIndex, 1)[0];
            }

            function capitalizeFirstLetter(string) {
                return string.charAt(0).toUpperCase() + string.slice(1);
            }
        }
    }
})();
