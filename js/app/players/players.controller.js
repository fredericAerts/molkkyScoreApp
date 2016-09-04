(function() {
    'use strict';

    angular
        .module('molkkyscore')
        .controller('PlayersCtrl', PlayersCtrl);

    PlayersCtrl.$inject = ['$scope',
                            '$rootScope',
                            'playersService',
                            'statisticsService',
                            'TEMPLATES_ROOT',
                            '$ionicPopup',
                            '$ionicModal',
                            '$translate',
                            '$ionicHistory',
                            'toast'];

    function PlayersCtrl($scope,
                            $rootScope,
                            playersService,
                            statisticsService,
                            TEMPLATES_ROOT,
                            $ionicPopup,
                            $ionicModal,
                            $translate,
                            $ionicHistory,
                            toast) {
        /* jshint validthis: true */
        var vm = this;
        var addPlayerModalScope = $scope.$new(true);
        var toastMessages = toast.getMessages().players;

        vm.players = playersService.all();
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
            addPlayerModalScope.viewModel.player = getNewPlayerTemplate();

            vm.addPlayerModal.show();
        }

        function cancelPlayer() {
            addPlayerModalScope.viewModel.player = {};

            vm.addPlayerModal.hide();
        }

        function confirmPlayer() {
            initNewPlayer(addPlayerModalScope.viewModel.player);

            vm.players.push(addPlayerModalScope.viewModel.player);
            $ionicHistory.clearCache();
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
                    playersService.remove(player);
                    toast.show(player.firstName + ' ' + toastMessages.removePlayer);
                }
                vm.removeVisible = false;
            });
        }

        /*  Helper functions
            ======================================================================================== */
        function getNewPlayerTemplate() {
            var playerId = _.max(vm.players, function(player) { return player.id; }).id + 1;
            var player = {
                id: playerId,
                firstName: '',
                lastName: '',
                tagline: '',
                face: ''
            };

            return player;
        }

        function initNewPlayer(player) {
            if (!player.tagline) {
                player.tagline = 'No tagline provided';
            }
            statisticsService.initPlayerStatistics(player);

            return player;
        }
    }
})();
