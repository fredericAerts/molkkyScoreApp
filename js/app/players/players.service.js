(function() {
    'use strict';

    angular
        .module('molkkyscore')
        .factory('playersService', playersService);

    playersService.$inject = ['dataService'];

    function playersService(dataService) {
        // Some fake testing data
        var players = dataService.getAllPlayers();

        var service = {
            all: all,
            get: get,
            remove: remove,
            updatePlayer: updatePlayer
        };
        return service;

        ////////////////

        function all() {
            return players;
        }

        function get(playerId) {
            for (var i = 0; i < players.length; i++) {
                if (players[i].id === parseInt(playerId)) {
                    return players[i];
                }
            }
            return null;
        }

        function remove(player) {
            players.splice(players.indexOf(player), 1);
        }

        function updatePlayer(updatedPlayer) {
            var player = get(updatedPlayer.id);
            player = updatedPlayer;
        }

        /*  Helper functions
            ======================================================================================== */
    }
})();
