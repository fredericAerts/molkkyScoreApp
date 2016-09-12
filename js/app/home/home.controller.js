
(function() {
    'use strict';

    angular
        .module('molkkyscore')
        .controller('HomeCtrl', HomeCtrl);

    HomeCtrl.$inject = ['$rootScope', '$scope', '$state', 'modalsService'];

    function HomeCtrl($rootScope, $scope, $state, modalsService) {
        /* jshint validthis: true */
        var vm = this;

        vm.addPlayersToGameModal = {};

        activate();

        ////////////////

        function activate() {
            initAddPlayersToGameModal();
        }

        /*  LISTENERS
            ======================================================================================== */
        $scope.$on('appInitialized', function () {
            vm.addPlayersToGameModal.remove();
            initAddPlayersToGameModal();
        });

        // Cleanup the modal when we're done with it!
        $scope.$on('$destroy', function() {
            vm.addPlayersToGameModal.remove();
        });

        /*  FUNCTIONS
            ======================================================================================== */
        function initAddPlayersToGameModal() {
            return modalsService.getAddPlayersToGameModal($scope, addPlayersToGameModalConfirmFunction)
            .then(function(modal) {
                vm.addPlayersToGameModal = modal;
                return vm.addPlayersToGameModal;
            });

            function addPlayersToGameModalConfirmFunction() {
                $state.go('game');
            }
        }
    }
})();
