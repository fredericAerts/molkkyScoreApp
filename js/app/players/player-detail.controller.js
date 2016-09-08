(function() {
    'use strict';

    angular
        .module('molkkyscore')
        .controller('PlayerDetailCtrl', PlayerDetailCtrl);

    PlayerDetailCtrl.$inject = ['$scope',
                                '$stateParams',
                                'TEMPLATES_ROOT',
                                'playersService',
                                'statisticsService',
                                '$ionicModal',
                                'toast'];

    function PlayerDetailCtrl($scope,
                                $stateParams,
                                TEMPLATES_ROOT,
                                playersService,
                                statisticsService,
                                $ionicModal,
                                toast) {
        /* jshint validthis: true */
        var vm = this;
        var editPlayerModalScope = $scope.$new(true);

        vm.player = playersService.get($stateParams.playerId);
        vm.editPlayerModal = {};
        vm.showPlayerModal = showPlayerModal;
        vm.metricDonuts = [];
        vm.profileData = {};

        activate();

        ////////////////

        function activate() {
            initMetricDonuts();
            initProfileData();
            initEditPlayerModal();
        }

        /*  FUNCTIONS
            ======================================================================================== */
        function initMetricDonuts() {
            var metricKeys = ['versatility', 'winningRatio', 'accuracy', 'efficiency'];
            var metric = {};

            metricKeys.forEach(function(key) {
                metric = statisticsService.getMetricByKey(key);
                vm.metricDonuts.push({
                    translationId: metric.translationId,
                    value: vm.player.statistics.metrics[key],
                    unit: metric.unit
                });
            });

            return vm.metricDonuts;
        }

        function initProfileData() {
            var profileItems = [
                item('First name', vm.player.firstName),
                item('Last name', vm.player.lastName),
                item('Tagline', vm.player.tagline)
            ];
            var statisticsItems = [// raw data
                item('Games played', vm.player.statistics.rawData.gamesPlayed),
                item('Games won', vm.player.statistics.rawData.gamesWon),
                item('Games reached max score', vm.player.statistics.rawData.gamesReachedMaxScore),
                item('Throws', vm.player.statistics.rawData.throws),
                item('Throws single pin', vm.player.statistics.rawData.throwsSinglePin),
                item('Throws when reached max score', vm.player.statistics.rawData.throwsInGamesReachedMaxScore)
            ];

            vm.profileData.profile = profileItems;
            vm.profileData.statistics = statisticsItems;

            return vm.profileData;

            function item(title, value, unit) {
                var item = {};
                item.title = title;
                item.value = value;
                item.unit = unit ? unit : '';
                return item;
            }
        }

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
                    confirmPlayer: confirmPlayer
                };
            });
        }

        function showPlayerModal(player) {
            editPlayerModalScope.viewModel.player = player;
            vm.editPlayerModal.show();
        }

        function confirmPlayer() {
            if (!editPlayerModalScope.viewModel.player.tagline) {
                editPlayerModalScope.viewModel.player.tagline = 'No tagline provided';
            }

            initProfileData();
            toast.show('Update to player profile saved');

            vm.editPlayerModal.hide();
        }
    }
})();
