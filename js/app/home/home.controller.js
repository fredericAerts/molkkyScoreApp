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
            vm.potentialPlayers.push(vm.participants.splice(index, 1)[0]);
        }

        function reorderParticipant(player, fromIndex, toIndex) {
            vm.participants.splice(fromIndex, 1);
            vm.participants.splice(toIndex, 0, player);
        };
    }
})();
