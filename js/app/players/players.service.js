(function() {
    'use strict';

    angular
        .module('molkkyscore')
        .factory('playersService', playersService);

    playersService.$inject = ['dataService'];

    function playersService(dataService) {
        // Some fake testing data
        var players = {};

        var service = {
            all: all,
            get: get,
            remove: remove,
            updatePlayer: updatePlayer
        };
        return service;

        ////////////////

        function all() {
            if (_.isEmpty(players)) {
                players = dataService.getAllPlayers();
            }

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
            dataService.updatePlayerProfile(updatedPlayer);
        }

        /*  Helper functions
            ======================================================================================== */
    }
})();
