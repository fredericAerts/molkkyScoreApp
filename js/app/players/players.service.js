(function() {
    'use strict';

    angular
        .module('molkkyscore')
        .factory('playersService', playersService);

    playersService.$inject = ['dataService'];

    function playersService(dataService) {
        var players = [];
        var teams = [];

        var service = {
            all: all,
            get: get,
            remove: remove,
            updatePlayer: updatePlayer,
            allTeams:allTeams,
            getTeam: getTeam,
            removeTeam: removeTeam,
            getTeamsFromPlayer: getTeamsFromPlayer
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

        function allTeams() {
            if (_.isEmpty(teams)) {
                teams = dataService.getAllTeams();
            }

            return teams;
        }

        function getTeam(teamId) {
            for (var i = 0; i < teams.length; i++) {
                if (teams[i].id === parseInt(teamId)) {
                    return teams[i];
                }
            }
            return null;
        }

        function removeTeam(team) {
            teams.splice(teams.indexOf(team), 1);
        }

        function getTeamsFromPlayer(playerId) {
            return teams.filter(function(team) {
                return _.contains(_.pluck(team.players, 'id'), playerId);
            });
        }

        /*  Helper functions
            ======================================================================================== */
    }
})();
