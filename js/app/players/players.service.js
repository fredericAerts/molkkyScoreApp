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
            },
            {
                id: 3,
                firstName: 'Perry',
                lastName: 'Governor',
                tagline: 'Look at my mukluks!',
                face: 'img/perry.png'
            },
            {
                id: 4,
                firstName: 'Mike',
                lastName: 'Harrington',
                tagline: 'This is wicked good ice cream.',
                face: 'img/mike.png'
            },
            {
                id: 5,
                firstName: 'Dummy',
                lastName: 'player',
                tagline: 'I have a grey avatar.',
                face: ''
            },
            {
                id: 6,
                firstName: 'Mr.',
                lastName: 'Pink',
                guestColor: 'pink'
            },
            {
                id: 7,
                firstName: 'Dummy2',
                lastName: 'player2',
                tagline: 'I have a grey avatar2.',
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
