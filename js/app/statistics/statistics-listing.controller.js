(function() {
    'use strict';

    angular
        .module('molkkyscore')
        .controller('StatisticsListingCtrl', StatisticsListing);

    StatisticsListing.$inject = ['$stateParams', 'statisticsService', 'playersService'];

    function StatisticsListing($stateParams, statisticsService, playersService) {
        /* jshint validthis: true */
        var vm = this;

        vm.metric = statisticsService.getMetric(parseInt($stateParams.metricId, 10));
        vm.players = playersService.all();
        vm.minGamesFilter = minGamesFilter;

        activate();

        ////////////////

        function activate() {
        }

        /*  FUNCTIONS
            ======================================================================================== */
        function minGamesFilter(player) {
            if (!vm.metric.unit) {
                return true;
            }

            return player.statistics.rawData.gamesPlayed >= 5;
        }
    }
})();
