(function() {
    'use strict';

    angular
        .module('molkkyscore')
        .factory('statisticsProcessor', statisticsProcessor);

    statisticsProcessor.$inject = ['playersService'];

    function statisticsProcessor(playersService) {

        var service = {
            update: update
        };
        return service;

        ////////////////

        function update(event, player, overallStatistics, undo) {
            var throws = player.scoreHistory.length;

            switch (event) {
                case 'playerWonGame': updatePlayerWonGame(player, overallStatistics, undo); break;
                case 'playerReachedMaxScore': updatePlayerReachedMaxScore(player, throws, undo); break;
                case 'playerThrow': updatePlayerThrow(player, throws, undo); break;
                case 'playerThrowsSinglePin': updatePlayerThrowsSinglePin(player, undo); break;
            }
        }

        /*  Helper functions
            ================================================================================= */
        function updatePlayerWonGame(player, overallStatistics, undo) {
            var increment = undo ? -1 : 1;
            player.statistics.rawData.gamesWon += increment;

            // non player specific updates
            overallStatistics.totalGamesPlayed += increment;
            playersService.all().forEach(function(player) {
                player.statistics.rawData.gamesPlayed += increment;
            });
        }

        function updatePlayerReachedMaxScore(player, throws, undo) {
            var increment = undo ? -1 : 1;
            player.statistics.rawData.gamesReachedMaxScore += increment;
            player.statistics.rawData.throwsInGamesReachedMaxScore += (throws * increment);
        }

        function updatePlayerThrow(player, throws, undo) {
            var increment = undo ? -1 : 1;
            player.statistics.rawData.throws += increment;
        }

        function updatePlayerThrowsSinglePin(player, undo) {
            var increment = undo ? -1 : 1;
            player.statistics.rawData.throwsOnePin += increment;
        }
    }
})();
