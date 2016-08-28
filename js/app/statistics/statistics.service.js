(function() {
    'use strict';

    angular
        .module('molkkyscore')
        .factory('statisticsService', statisticsService);

    statisticsService.$inject = ['$translate'];

    function statisticsService($translate) {
        var metrics = [
            metric(0, 'OVERALL', 'TOTAL-GAMES-PLAYED'),
            metric(1, 'PLAYERS', 'HALL-OF-FAME'),
            metric(2, 'PLAYERS', 'WINNING-RATIO'),
            metric(3, 'PLAYERS', 'VERSATILITY'),
            metric(4, 'PLAYERS', 'ACCURACY'),
            metric(5, 'PLAYERS', 'EFFICIENCY'),
            metric(6, 'PLAYERS', 'EFFECTIVENESS')
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
            var viewTitle, summary, recorded, calculation;
            var prefix = 'HOME.STATISTICS.METRICS.';

            metrics.forEach(function(metric) {
                viewTitle = prefix + metric.category + '.' + metric.propertyName + '.VIEW-TITLE';
                summary = prefix + metric.category + '.' + metric.propertyName + '.INFO.SUMMARY';
                recorded = prefix + metric.category + '.' + metric.propertyName + '.INFO.RECORDED';
                calculation = prefix + metric.category + '.' + metric.propertyName + '.INFO.CALCULATION';

                metric.viewTitle = $translate.instant(viewTitle);
                metric.info = {
                    summary: $translate.instant(summary),
                    recorded: $translate.instant(recorded),
                    calculation: $translate.instant(calculation)
                };
            });
        }

        /*  Helper classes
            ================================================================================= */
        /* metric factory */
        function metric(id, category, propertyName) {
            return {
                id: id,
                category: category,
                propertyName: propertyName,
                viewTitle: '',
                info: {
                    summary: '',
                    recorded: '',
                    calculation: ''
                }
            };
        }
    }
})();
