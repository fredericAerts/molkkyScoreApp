(function() {
    'use strict';

    angular
        .module('molkkyscore')
        .controller('PlayersCtrl', PlayersCtrl);

    PlayersCtrl.$inject = ['$scope',
                            '$rootScope',
                            'playersService',
                            'TEMPLATES_ROOT',
                            '$ionicPopup',
                            '$ionicModal',
                            '$translate',
                            'toast'];

    function PlayersCtrl($scope,
                            $rootScope,
                            playersService,
                            TEMPLATES_ROOT,
                            $ionicPopup,
                            $ionicModal,
                            $translate,
                            toast) {
        /* jshint validthis: true */
        var vm = this;
        var addPlayerModalScope = $scope.$new(true);
        var toastMessages = toast.getMessages().players;

        vm.players = playersService.all();
        console.log(vm.players);
        vm.removeVisible = false;
        vm.showRemoveConfirmPopup = showRemoveConfirmPopup;
        vm.addPlayerModal = {};
        vm.showPlayerModal = showPlayerModal;

        activate();

        ////////////////

        function activate() {
            initAddPlayerModal();
        }

        /*  LISTENERS
            ======================================================================================== */
        $rootScope.$on('$translateChangeSuccess', function () {
            toastMessages = toast.getMessages().players;
        });

        // Cleanup the modal when we're done with it!
        $scope.$on('$destroy', function() {
            vm.addPlayerModal.remove();
        });

        /*  FUNCTIONS
            ======================================================================================== */
        function initAddPlayerModal() {
            $ionicModal.fromTemplateUrl(TEMPLATES_ROOT + '/players/modal-add-player.html', {
                scope: addPlayerModalScope,
                animation: 'slide-in-up'
            })
            .then(function(modal) {
                vm.addPlayerModal = modal;

                /*  ==================================================================
                - modal template should reference 'viewModel' as its scope
                - viewModel data is initialized (reset) each time modal is shown
                ================================================================== */
                addPlayerModalScope.viewModel = {
                    player: {},
                    cancelPlayer: cancelPlayer,
                    confirmPlayer: confirmPlayer

                };
            });
        }

        function showPlayerModal() {
            initializeAddPlayerModalData();

            vm.addPlayerModal.show();
        }

        function initializeAddPlayerModalData() {
            addPlayerModalScope.viewModel.player.id = vm.players.length; // TODO: make unique
            addPlayerModalScope.viewModel.player.firstName = '';
            addPlayerModalScope.viewModel.player.lastName = '';
            addPlayerModalScope.viewModel.player.tagline = '';
            addPlayerModalScope.viewModel.player.face = '';
        }

        function cancelPlayer() {
            vm.addPlayerModal.hide();
        }

        function confirmPlayer() {
            vm.players.push(addPlayerModalScope.viewModel.player);
            toast.show(addPlayerModalScope.viewModel.player.firstName + ' ' + toastMessages.addPlayer);

            vm.addPlayerModal.hide();
        }

        function showRemoveConfirmPopup(player) {
            var templateTranslationId = 'HOME.PLAYERS.REMOVE-POPUP.TEXT';
            var templateTranslationVariable = {playerName: player.firstName + ' ' + player.lastName};

            $ionicPopup.confirm({
                title: $translate.instant('HOME.PLAYERS.REMOVE-POPUP.TITLE'),
                template: $translate.instant(templateTranslationId, templateTranslationVariable)
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
            toast.show(player.firstName + ' ' + toastMessages.removePlayer);
        }
    }
})();
