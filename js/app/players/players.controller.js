(function() {
    'use strict';

    angular
        .module('molkkyscore')
        .controller('PlayersCtrl', PlayersCtrl);

    PlayersCtrl.$inject = ['$scope', 'playersService', 'TEMPLATES_ROOT', '$ionicPopup', '$ionicModal', '$translate'];

    function PlayersCtrl($scope, playersService, TEMPLATES_ROOT, $ionicPopup, $ionicModal, $translate) {
        /* jshint validthis: true */
        var vm = this;

        vm.players = playersService.all();
        vm.removeVisible = false;
        vm.showRemoveConfirmPopup = showRemoveConfirmPopup;
        vm.addPlayerModal = {};

        activate();

        ////////////////

        function activate() {
            initAddPlayerModal();
        }

        /*  LISTENERS
            ======================================================================================== */
        // Cleanup the modal when we're done with it!
        $scope.$on('$destroy', function() {
            $scope.modal.remove();
        });

        /*  FUNCTIONS
            ======================================================================================== */
        function showRemoveConfirmPopup(player) {
            $ionicPopup.confirm({
                title: $translate.instant('HOME.PLAYERS.REMOVE-POPUP.TITLE'),
                template: $translate.instant('HOME.PLAYERS.REMOVE-POPUP.TEXT', {playerName: player.name})
            })
            .then(function(confirmed) {
                if (confirmed) {
                    remove(player);
                }
                vm.removeVisible = false;
            });
        }

        function remove(player) {
            playersService.remove(player);
        }

        function initAddPlayerModal() {
            $ionicModal.fromTemplateUrl(TEMPLATES_ROOT + '/players/modal-add-player.html', {
                scope: $scope,
                animation: 'slide-in-up'
            })
            .then(function(modal) {
                vm.addPlayerModal = modal;
            });
        }
    }
})();
