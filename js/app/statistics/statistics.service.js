(function() {
    'use strict';

    angular
        .module('molkkyscore')
        .factory('statisticsService', statisticsService);

    statisticsService.$inject = ['$translate', 'statisticsProcessor'];

    function statisticsService($translate, statisticsProcessor) {
        var metrics = [
            metric(0, 'totalGamesPlayed', 'overall', 'OVERALL.TOTAL-GAMES-PLAYED', ''),
            metric(1, 'totalWins', 'players', 'PLAYERS.TOTAL-WINS', ''),
            metric(2, 'winningRatio', 'players', 'PLAYERS.WINNING-RATIO', '%'),
            metric(3, 'versatility', 'players', 'PLAYERS.VERSATILITY', '%'),
            metric(4, 'accuracy', 'players', 'PLAYERS.ACCURACY', '%'),
            metric(5, 'efficiency', 'players', 'PLAYERS.EFFICIENCY', '%'),
            metric(6, 'effectiveness', 'players', 'PLAYERS.EFFECTIVENESS', '%')
        ];
        var overallStatistics = {};

        var service = {
            getMetrics: getMetrics,
            getMetric: getMetric,
            initOverallStatistics: initOverallStatistics,
            getOverallStatistics: getOverallStatistics,
            initPlayerStatistics: initPlayerStatistics,
            updateStatistics: updateStatistics
        };
        return service;

        ////////////////

        function getMetrics() {
            return metrics;
        }

        function getMetric(metricId) {
            return _.findWhere(metrics, {id: metricId});
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

        function initPlayerStatistics(player) { // cached on player object
            /*  ==============================================================================
                RAW DATA
                ----------
                - throws: total throws of player
                - throwsOnePin: total throws of player that hit only one pin
                - throwsInGamesReachedMaxScore: total throws of player in games in which player
                                                reached max score
                - gamesPlayed: total games played that had a winner
                - gamesReachedMaxScore: total games in which player reached max score
                - gamesWon: total games won
                ============================================================================== */
            player.statistics = {
                rawData: {
                    throws: 0,
                    throwsOnePin: 0,
                    throwsInGamesReachedMaxScore: 0,
                    gamesPlayed: 0,
                    gamesReachedMaxScore: 0,
                    gamesWon: 0
                }
            };

            getMetrics().forEach(function(metric) {
                if (metric.category === 'players') {
                    player.statistics[metric.keyName] = 0; // TODO: fetch from DB
                }
            });

            return player;
        }

        function updateStatistics(event, activePlayer, undo) {
            statisticsProcessor.update(event, activePlayer, overallStatistics, undo);
        }

        /*  Helper functions
            ================================================================================= */
        /* metric factory */
        function metric(id, keyName, category, translationId, unit) {
            return {
                id: id,
                keyName: keyName,
                category: category,
                translationId: translationId,
                unit: unit
            };
        }

        function processGameWon() {

        }
    }
})();
