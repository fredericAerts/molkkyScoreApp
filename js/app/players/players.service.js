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
                name: 'Ben Sparrow',
                lastText: 'You on your way?',
                face: 'img/ben.png'
            },
            {
                name: 'Max Lynx',
                lastText: 'Hey, it\'s me',
                face: 'img/max.png'
            },
            {
                name: 'Adam Bradleyson',
                lastText: 'I should buy a boat',
                face: 'img/adam.jpg'
            },
            {
                name: 'Perry Governor',
                lastText: 'Look at my mukluks!',
                face: 'img/perry.png'
            },
            {
                name: 'Mike Harrington',
                lastText: 'This is wicked good ice cream.',
                face: 'img/mike.png'
            },
            {
                name: 'Dummy player',
                lastText: 'I have a grey avatar.',
                face: ''
            }
        ];

        var service = {
            all: all,
            get: get,
            remove: remove
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
    }
})();
