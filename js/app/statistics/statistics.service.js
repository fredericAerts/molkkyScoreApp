(function() {
    'use strict';

    angular
        .module('molkkyscore')
        .factory('statisticsService', statisticsService);

    statisticsService.$inject = ['$translate'];

    function statisticsService($translate) {
        var metrics = [
            metric(0, 'totalGamesPlayed', 'overall', 'TOTAL-GAMES-PLAYED'),
            metric(1, 'totalWins', 'players', 'TOTAL-WINS'),
            metric(2, 'winningRatio', 'players', 'WINNING-RATIO'),
            metric(3, 'versatility', 'players', 'VERSATILITY'),
            metric(4, 'accuracy', 'players', 'ACCURACY'),
            metric(5, 'efficiency', 'players', 'EFFICIENCY'),
            metric(6, 'effectiveness', 'players', 'EFFECTIVENESS')
        ];
        var overallStatistics = {};

        var service = {
            getMetrics: getMetrics,
            getMetric: getMetric,
            translateMetrics: translateMetrics,
            initOverallStatistics: initOverallStatistics,
            getOverallStatistics: getOverallStatistics,
            updateOverallStatistics: updateOverallStatistics,
            initPlayerStatistics: initPlayerStatistics,
            updatePlayerStatistics: updatePlayerStatistics
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
                viewTitle = prefix + metric.category.toUpperCase() + '.' + metric.translationId + '.VIEW-TITLE';
                summary = prefix + metric.category.toUpperCase() + '.' + metric.translationId + '.INFO.SUMMARY';
                recorded = prefix + metric.category.toUpperCase() + '.' + metric.translationId + '.INFO.RECORDED';
                calculation = prefix + metric.category.toUpperCase() + '.' + metric.translationId + '.INFO.CALCULATION';

                metric.viewTitle = $translate.instant(viewTitle);
                metric.info = {
                    summary: $translate.instant(summary),
                    recorded: $translate.instant(recorded),
                    calculation: $translate.instant(calculation)
                };
            });
        }

        function initOverallStatistics() { // cached on statistics service
            getMetrics().forEach(function(metric) {
                if (metric.category === 'overall') {
                    overallStatistics[metric.keyName] = 0; // TODO: fetch from DB
                }
            });

            return overallStatistics;
        }

        function getOverallStatistics() {
            return overallStatistics;
        }

        function updateOverallStatistics(key, value) {
            overallStatistics[key] = value; // TODO: write to DB
        }

        function initPlayerStatistics(player) { // cached on player object
            player.statistics = {};

            getMetrics().forEach(function(metric) {
                if (metric.category === 'players') {
                    player.statistics[metric.keyName] = 0; // TODO: fetch from DB
                }
            });

            return player;
        }

        function updatePlayerStatistics(key, value, player) {
            player.statistics[key] = value; // TODO: write to DB

            return player;
        }

        /*  Helper functions
            ================================================================================= */
        /* metric factory */
        function metric(id, keyName, category, translationId) {
            return {
                id: id,
                keyName: keyName,
                category: category,
                translationId: translationId,
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
