(function() {
    'use strict';

    angular
        .module('molkkyscore')
        .controller('StatisticsCtrl', StatisticsCtrl);

    StatisticsCtrl.$inject = ['$rootScope', 'statisticsService', '$translate'];

    function StatisticsCtrl($rootScope, statisticsService, $translate) {
        /* jshint validthis: true */
        var vm = this;

        vm.metrics = statisticsService.getMetrics();

        activate();

        ////////////////

        function activate() {
            translateMetricListingTitles();
        }

        /*  LISTENERS
            ======================================================================================== */
        $rootScope.$on('$translateChangeSuccess', function () {
            translateMetricListingTitles();
        });

        /*  FUNCTIONS
            ======================================================================================== */
        function translateMetricListingTitles() {
            vm.metrics.forEach(function(metric) {
                metric.listingTitle = $translate.instant('HOME.STATISTICS.METRICS.' + metric.propertyName.toUpperCase() + '.TITLE');
            });
        }
    }
})();
