(function() {
    'use strict';

    angular
        .module('molkkyscore')
        .factory('statisticsProcessor', statisticsProcessor);

    statisticsProcessor.$inject = ['playersService'];

    function statisticsProcessor(playersService) {

        var service = {
            process: process
        };
        return service;

        ////////////////

        function process(event, player, overallStatistics) {
            switch (event) {
                case 'gameWon': processGameWon(player.statistics, overallStatistics); break;
                case 'gameReachedMaxScore': processGameReachedMaxScore(player.statistics, player.scoreHistory.length); break;
            }
        }

        /*  Helper functions
            ================================================================================= */
        function processGameWon(playerStatistics, overallStatistics) {
            playerStatistics.rawData.gamesWon = playerStatistics.rawData.gamesWon + 1;

            // non player specific updates
            overallStatistics.totalGamesPlayed = overallStatistics.totalGamesPlayed + 1;
            playersService.all().forEach(function(player) {
                player.statistics.rawData.gamesPlayed = player.statistics.rawData.gamesPlayed + 1;
            });
        }

        function processGameReachedMaxScore(playerStatistics, throws) {
            playerStatistics.rawData.gamesReachedMaxScore += playerStatistics.rawData.gamesReachedMaxScore + 1;
            playerStatistics.rawData.throwsInGamesReachedMaxScore = playerStatistics.rawData.throwsInGamesReachedMaxScore + throws;
        }
    }
})();
