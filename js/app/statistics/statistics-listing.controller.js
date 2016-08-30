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

        activate();

        ////////////////

        function activate() {
        }
    }
})();
