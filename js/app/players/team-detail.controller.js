(function() {
    'use strict';

    angular
        .module('molkkyscore')
        .controller('TeamDetailCtrl', TeamDetailCtrl);

    TeamDetailCtrl.$inject = ['$scope',
                                '$rootScope',
                                '$stateParams',
                                'TEMPLATES_ROOT',
                                'playersService',
                                'statisticsService',
                                '$translate'];

    function TeamDetailCtrl($scope,
                                $rootScope,
                                $stateParams,
                                TEMPLATES_ROOT,
                                playersService,
                                statisticsService,
                                $translate) {
        /* jshint validthis: true */
        var vm = this;

        vm.team = playersService.getTeam($stateParams.teamId);
        vm.metricDonuts = [];
        vm.profileData = {};

        activate();

        ////////////////

        function activate() {
            initMetricDonuts();
            initProfileData();
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
                    value: vm.team.statistics.metrics[key],
                    unit: metric.unit
                });
            });

            return vm.metricDonuts;
        }

        function initProfileData() {
            var statisticsItems = [// raw data
                item($translate.instant('HOME.PLAYERS.DETAIL.PROFILE-DATA-LABELS.GAMES-PLAYED'), vm.team.statistics.rawData.gamesPlayed),
                item($translate.instant('HOME.PLAYERS.DETAIL.PROFILE-DATA-LABELS.GAMES-WON'), vm.team.statistics.rawData.gamesWon),
                item($translate.instant('HOME.PLAYERS.DETAIL.PROFILE-DATA-LABELS.GAMES-REACHED-MAX-SCORE'), vm.team.statistics.rawData.gamesReachedMaxScore),
                item($translate.instant('HOME.PLAYERS.DETAIL.PROFILE-DATA-LABELS.THROWS'), vm.team.statistics.rawData.throws),
                item($translate.instant('HOME.PLAYERS.DETAIL.PROFILE-DATA-LABELS.THROWS-SINGLE-PIN'), vm.team.statistics.rawData.throwsSinglePin),
                item($translate.instant('HOME.PLAYERS.DETAIL.PROFILE-DATA-LABELS.THROWS-REACHED-MAX-SCORE'), vm.team.statistics.rawData.throwsInGamesReachedMaxScore)
            ];

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
    }
})();
