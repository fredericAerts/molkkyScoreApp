(function() {
    'use strict';

    angular
        .module('molkkyscore')
        .controller('StatisticsListingCtrl', StatisticsListing);

    StatisticsListing.$inject = ['$stateParams', 'statisticsService'];

    function StatisticsListing($stateParams, statisticsService) {
        /* jshint validthis: true */
        var vm = this;

        vm.metric = statisticsService.getMetric($stateParams.metricId);

        activate();

        ////////////////

        function activate() {
        }
    }
})();
