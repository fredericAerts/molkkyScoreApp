
(function() {
    'use strict';

    angular
        .module('molkkyscore')
        .controller('HomeCtrl', HomeCtrl);

    HomeCtrl.$inject = ['$rootScope', '$scope', '$state', '$translate', 'modalsService'];

    function HomeCtrl($rootScope, $scope, $state, $translate, modalsService) {
        /* jshint validthis: true */
        var vm = this;

        vm.addPlayersToGameModal = {};
        vm.visitWebsite = visitWebsite;

        activate();

        ////////////////

        function activate() {
            initAddPlayersToGameModal();
        }

        /*  LISTENERS
            ======================================================================================== */
        $scope.$on('appInitialized', function () {
            if (!_.isEmpty(vm.addPlayersToGameModal)) {
                vm.addPlayersToGameModal.remove();
            }
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

        function visitWebsite() {
            switch ($translate.use()) {
                case 'english': window.open('http://www.molkky.world', '_system', 'location=yes');
                    break;
                case 'french': window.open('http://www.molkkyworld.fr', '_system', 'location=yes');
                    break;
                default: window.open('http://www.molkky.world', '_system', 'location=yes');
            }
        }
    }
})();
