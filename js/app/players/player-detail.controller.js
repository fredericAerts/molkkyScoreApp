(function() {
    'use strict';

    angular
        .module('molkkyscore')
        .controller('PlayerDetailCtrl', PlayerDetailCtrl);

    PlayerDetailCtrl.$inject = ['$scope', '$stateParams', 'TEMPLATES_ROOT', 'playersService', '$ionicModal', 'toast'];

    function PlayerDetailCtrl($scope, $stateParams, TEMPLATES_ROOT, playersService, $ionicModal, toast) {
        /* jshint validthis: true */
        var vm = this;
        var editPlayerModalScope = $scope.$new(true);

        vm.player = playersService.get($stateParams.playerId);
        vm.editPlayerModal = {};
        vm.showPlayerModal = showPlayerModal;

        activate();

        ////////////////

        function activate() {
            initEditPlayerModal();
        }

        /*  FUNCTIONS
            ======================================================================================== */
        function initEditPlayerModal() {
            $ionicModal.fromTemplateUrl(TEMPLATES_ROOT + '/players/modal-edit-player.html', {
                scope: editPlayerModalScope,
                animation: 'slide-in-up'
            })
            .then(function(modal) {
                vm.editPlayerModal = modal;

                /*  ==================================================================
                - modal template should reference 'viewModel' as its scope
                - viewModel data is initialized (reset) each time modal is shown
                ================================================================== */
                editPlayerModalScope.viewModel = {
                    player: {},
                    cancelPlayer: cancelPlayer,
                    confirmPlayer: confirmPlayer

                };
            });
        }

        function showPlayerModal(player) {
            editPlayerModalScope.viewModel.player = player;
            vm.editPlayerModal.show();
        }

        function cancelPlayer() {
            vm.editPlayerModal.hide();
        }

        function confirmPlayer() {
            vm.editPlayerModal.hide();
            toast.show('Update to player profile saved');
        }
    }
})();
