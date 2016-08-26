(function() {
    'use strict';

    angular
        .module('molkkyscore')
        .factory('statisticsService', statisticsService);

    statisticsService.$inject = ['$translate'];

    function statisticsService($translate) {
        var metrics = [{
                id: 0,
                category: 'OVERALL',
                propertyName: 'TOTAL-GAMES-PLAYED'
            },
            {
                id: 1,
                category: 'PLAYERS',
                propertyName: 'HALL-OF-FAME'
            },
            {
                id: 2,
                category: 'PLAYERS',
                propertyName: 'WINNING-RATIO'
            },
            {
                id: 3,
                category: 'PLAYERS',
                propertyName: 'VERSATILITY'
            },
            {
                id: 4,
                category: 'PLAYERS',
                propertyName: 'ACCURACY'
            },
            {
                id: 5,
                category: 'PLAYERS',
                propertyName: 'EFFICIENCY'
            },
            {
                id: 6,
                category: 'PLAYERS',
                propertyName: 'EFFECTIVENESS'
            }
        ];

        var service = {
            getMetrics: getMetrics,
            getMetric: getMetric,
            translateMetrics: translateMetrics
        };
        return service;

        ////////////////

        function getMetrics() {
            return metrics;
        }

        function getMetric(metricId) {
            return _.findWhere(metrics, {id: metricId});
        }

        function translateMetrics() {
            metrics.forEach(function(metric) {
                var viewTitle = 'HOME.STATISTICS.METRICS.' + metric.category + '.' + metric.propertyName + '.VIEW-TITLE';
                var infoSummary = 'HOME.STATISTICS.METRICS.' + metric.category + '.' + metric.propertyName + '.INFO.SUMMARY';
                var infoRecorded = 'HOME.STATISTICS.METRICS.' + metric.category + '.' + metric.propertyName + '.INFO.RECORDED';
                var infoCalculation = 'HOME.STATISTICS.METRICS.' + metric.category + '.' + metric.propertyName + '.INFO.CALCULATION';

                metric.viewTitle = $translate.instant(viewTitle);
                metric.info = {
                    summary: $translate.instant(infoSummary),
                    recorded: $translate.instant(infoRecorded),
                    calculation: $translate.instant(infoCalculation)
                }
            });
        }
    }
})();
