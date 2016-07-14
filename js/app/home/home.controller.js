(function() {
    'use strict';

    angular
        .module('molkkyscore')
        .controller('HomeCtrl', HomeCtrl);

    HomeCtrl.$inject = ['$scope', '$state', 'playersService', 'gameService', 'TEMPLATES_ROOT','$ionicModal'];

    function HomeCtrl($scope, $state, playersService, gameService, TEMPLATES_ROOT, $ionicModal) {
        /* jshint validthis: true */
        var vm = this;

        vm.addPlayersToGameModal = {};
        vm.cancelAddPlayersToGame = cancelAddPlayersToGame;
        vm.playersInDatabase = playersService.all();
        vm.participants = [];
        vm.showReorder = false;
        vm.addPlayerToParticipants = addPlayerToParticipants;
        vm.removePlayerFromParticipants = removePlayerFromParticipants;
        vm.reorderParticipant = reorderParticipant;
        vm.guestColors = ['blonde', 'orange', 'pink', 'white', 'brown', 'blue'];
        vm.addGuestParticipant = addGuestParticipant;
        vm.startGame = startGame;

        activate();

        ////////////////

        function activate() {
            initAddPlayersToGameModal();
        }

        /*  LISTENERS
            ======================================================================================== */
        // Cleanup the modal when we're done with it!
        $scope.$on('$destroy', function() {
            $scope.modal.remove();
        });

        /*  FUNCTIONS
            ======================================================================================== */
        function initAddPlayersToGameModal() {
            $ionicModal.fromTemplateUrl(TEMPLATES_ROOT + '/home/modal-start-players.html', {
                scope: $scope,
                animation: 'slide-in-up'
            })
            .then(function(modal) {
                vm.addPlayersToGameModal = modal;
            });
        }

        function cancelAddPlayersToGame() {
            vm.showReorder = false;

            // empty participants array
            for (var i = vm.participants.length - 1; i >= 0; --i) { // backwards loop
                if (vm.participants[i].guestColor) {
                    vm.guestColors.push(vm.participants.pop().guestColor);
                }
                else {
                    vm.playersInDatabase.push(vm.participants.pop());
                }
            }

            vm.addPlayersToGameModal.hide();
        }

        function addPlayerToParticipants(newParticipant) {
            var playerIndex = _.findIndex(vm.playersInDatabase, function(player) {
                return player.name === newParticipant.name;
            });
            vm.participants.push(vm.playersInDatabase.splice(playerIndex, 1)[0]);
        }

        function removePlayerFromParticipants(index) {
            var removedPlayer = vm.participants.splice(index, 1)[0];

            if (removedPlayer.guestColor) {
                vm.guestColors.push(removedPlayer.guestColor);
            }
            else {
                vm.playersInDatabase.push(removedPlayer);
            }
        }

        function reorderParticipant(player, fromIndex, toIndex) {
            vm.participants.splice(fromIndex, 1);
            vm.participants.splice(toIndex, 0, player);
        }

        function addGuestParticipant() {
            var guestColor = pickRandomGuestColor();

            vm.participants.push({
                name: 'Mr. ' + capitalizeFirstLetter(guestColor),
                face: '',
                guestColor: guestColor
            });
        }

        function startGame() {
            gameService.setParticipants(vm.participants);

            $state.go('game');

            vm.addPlayersToGameModal.hide();
        }

        /*  Helper functions
            ======================================================================================== */
        function pickRandomGuestColor() {
            var colorIndex = Math.floor(Math.random() * vm.guestColors.length);

            return vm.guestColors.splice(colorIndex, 1)[0];
        }

        function capitalizeFirstLetter(string) {
            return string.charAt(0).toUpperCase() + string.slice(1);
        }
    }
})();
