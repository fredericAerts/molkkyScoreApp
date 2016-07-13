(function() {
    'use strict';

    angular
        .module('molkkyscore')
        .controller('HomeCtrl', HomeCtrl);

    HomeCtrl.$inject = ['$scope', 'playersService', 'TEMPLATES_ROOT','$ionicModal'];

    function HomeCtrl($scope, playersService, TEMPLATES_ROOT, $ionicModal) {
        /* jshint validthis: true */
        var vm = this;

        vm.addPlayersToGameModal = {};
        vm.potentialPlayers = playersService.all();
        vm.participants = [];
        vm.showReorder = false;
        vm.addPlayerToParticipants = addPlayerToParticipants;
        vm.removePlayerFromParticipants = removePlayerFromParticipants;
        vm.reorderParticipant = reorderParticipant;
        vm.guestColors = ['blonde', 'orange', 'pink', 'white', 'brown', 'blue'];
        vm.addGuestParticipant = addGuestParticipant;

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

        function addPlayerToParticipants(index) {
            vm.participants.push(vm.potentialPlayers.splice(index, 1)[0]);
        }

        function removePlayerFromParticipants(index) {
            var removedPlayer = vm.participants.splice(index, 1)[0];

            if (removedPlayer.guestColor) {
                vm.guestColors.push(removedPlayer.guestColor);
            }
            else {
                vm.potentialPlayers.push(removedPlayer);
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

        function pickRandomGuestColor() {
            var colorIndex = Math.floor(Math.random() * vm.guestColors.length);

            return vm.guestColors.splice(colorIndex, 1)[0];
        }

        function capitalizeFirstLetter(string) {
            return string.charAt(0).toUpperCase() + string.slice(1);
        }
    }
})();
