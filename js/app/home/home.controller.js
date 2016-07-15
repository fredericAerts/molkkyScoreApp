(function() {
    'use strict';

    angular
        .module('molkkyscore')
        .controller('HomeCtrl', HomeCtrl);

    HomeCtrl.$inject = ['$scope', '$state', 'playersService', 'gameService', 'TEMPLATES_ROOT','$ionicModal'];

    function HomeCtrl($scope, $state, playersService, gameService, TEMPLATES_ROOT, $ionicModal) {
        /* jshint validthis: true */
        var vm = this;
        var addPlayersToGameModalScope = $scope.$new(true);

        vm.addPlayersToGameModal = {};
        vm.openAddPlayersToGameModal = openAddPlayersToGameModal;

        activate();

        ////////////////

        function activate() {
            initAddPlayersToGameModal();
        }

        /*  LISTENERS
            ======================================================================================== */
        // Cleanup the modal when we're done with it!
        $scope.$on('$destroy', function() {
            vm.addPlayersToGameModal.remove();
        });

        /*  FUNCTIONS
            ======================================================================================== */
        function initAddPlayersToGameModal() {
            /*  This modal gets a shallow copy of players from playersService as input,
                and outputs a shallow copy of participants to gameService
                ============================================================================*/
            $ionicModal.fromTemplateUrl(TEMPLATES_ROOT + '/home/modal-start-players.html', {
                scope: addPlayersToGameModalScope,
                animation: 'slide-in-up'
            })
            .then(function(modal) {
                vm.addPlayersToGameModal = modal;

                /*  ==================================================================
                - modal template should reference 'viewModel' as its scope
                - viewModel data is initialized (reset) each time modal is shown
                ================================================================== */
                addPlayersToGameModalScope.viewModel = {
                    showReorder: false,
                    guestColors: [],
                    playersInDatabase: [], // modal input
                    participants: [], // modal output
                    addPlayerToParticipants: addPlayerToParticipants,
                    addGuestParticipant: addGuestParticipant,
                    removePlayerFromParticipants: removePlayerFromParticipants,
                    reorderParticipant: reorderParticipant,
                    cancelAddPlayersToGame: cancelAddPlayersToGame,
                    startGame: startGame
                };
            });
        }

        function openAddPlayersToGameModal() {
            initializeAddPlayersToGameModalData();

            vm.addPlayersToGameModal.show();
        }

        function initializeAddPlayersToGameModalData() {
            addPlayersToGameModalScope.viewModel.showReorder = false;
            addPlayersToGameModalScope.viewModel.guestColors = ['blonde', 'orange', 'pink', 'white', 'brown', 'blue'];
            addPlayersToGameModalScope.viewModel.playersInDatabase = playersService.all().slice();
            addPlayersToGameModalScope.viewModel.participants = [];
        }

        function addPlayerToParticipants(newParticipant) {
            var playerIndex = _.findIndex(addPlayersToGameModalScope.viewModel.playersInDatabase, function(player) {
                return player.id === newParticipant.id;
            });
            var playerFromDatabase = addPlayersToGameModalScope.viewModel.playersInDatabase.splice(playerIndex, 1)[0];
            addPlayersToGameModalScope.viewModel.participants.push(playerFromDatabase);
        }

        function removePlayerFromParticipants(index) {
            var removedPlayer = addPlayersToGameModalScope.viewModel.participants.splice(index, 1)[0];

            if (removedPlayer.guestColor) {
                addPlayersToGameModalScope.viewModel.guestColors.push(removedPlayer.guestColor);
            }
            else {
                addPlayersToGameModalScope.viewModel.playersInDatabase.push(removedPlayer);
            }
        }

        function reorderParticipant(player, fromIndex, toIndex) {
            addPlayersToGameModalScope.viewModel.participants.splice(fromIndex, 1);
            addPlayersToGameModalScope.viewModel.participants.splice(toIndex, 0, player);
        }

        function addGuestParticipant() {
            var guestColor = pickRandomGuestColor();

            addPlayersToGameModalScope.viewModel.participants.push({
                firstName: 'Mr.',
                lastName: capitalizeFirstLetter(guestColor),
                guestColor: guestColor
            });
        }

        function cancelAddPlayersToGame() {
            vm.addPlayersToGameModal.hide();
        }

        function startGame() {
            gameService.setParticipants(addPlayersToGameModalScope.viewModel.participants.slice());

            $state.go('game');

            vm.addPlayersToGameModal.hide();
        }

        /*  Helper functions
            ======================================================================================== */
        function pickRandomGuestColor() {
            var colorIndex = Math.floor(Math.random() * addPlayersToGameModalScope.viewModel.guestColors.length);

            return addPlayersToGameModalScope.viewModel.guestColors.splice(colorIndex, 1)[0];
        }

        function capitalizeFirstLetter(string) {
            return string.charAt(0).toUpperCase() + string.slice(1);
        }
    }
})();
