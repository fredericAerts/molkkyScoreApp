(function() {
    'use strict';

    angular
        .module('molkkyscore')
        .factory('playersService', playersService);

    playersService.$inject = [];

    function playersService() {
        // Some fake testing data
        var players = [
            {
                id: 0,
                firstName: 'Ben',
                lastName: 'Sparrow',
                tagline: 'You on your way?',
                face: 'img/ben.png'
            },
            {
                id: 1,
                firstName: 'Max',
                lastName: 'Lynx',
                tagline: 'Hey, it\'s me',
                face: 'img/max.png'
            },
            {
                id: 2,
                firstName: 'Adam',
                lastName: 'Bradleyson',
                tagline: 'I should buy a boat',
                face: 'img/adam.jpg'
            }
        ];

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
    }
})();
