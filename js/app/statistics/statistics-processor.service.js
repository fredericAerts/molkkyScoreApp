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
                case 'playerWonGame': processPlayerWonGame(player, overallStatistics); break;
                case 'playerReachedMaxScore': processPlayerReachedMaxScore(player, player.scoreHistory.length); break;
                case 'playerThrow': processPlayerThrow(player, player.scoreHistory.length); break;
                case 'playerThrowsSinglePin': processPlayerThrowsSinglePin(player); break;
            }
        }

        /*  Helper functions
            ================================================================================= */
        function processPlayerWonGame(player, overallStatistics) {
            player.statistics.rawData.gamesWon = player.statistics.rawData.gamesWon + 1;

            // non player specific updates
            overallStatistics.totalGamesPlayed = overallStatistics.totalGamesPlayed + 1;
            playersService.all().forEach(function(player) {
                player.statistics.rawData.gamesPlayed = player.statistics.rawData.gamesPlayed + 1;
            });
        }

        function processPlayerReachedMaxScore(player, throws) {
            player.statistics.rawData.gamesReachedMaxScore = player.statistics.rawData.gamesReachedMaxScore + 1;
            player.statistics.rawData.throwsInGamesReachedMaxScore = player.statistics.rawData.throwsInGamesReachedMaxScore + throws;
        }

        function processPlayerThrow(player, throws) {
            player.statistics.rawData.throws = player.statistics.rawData.throws + 1;
        }

        function processPlayerThrowsSinglePin(player) {
            player.statistics.rawData.throwsOnePin = player.statistics.rawData.throwsOnePin + 1;
            console.log('one pin');
        }
    }
})();
