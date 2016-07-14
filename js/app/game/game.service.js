(function() {
    'use strict';

    angular
        .module('molkkyscore')
        .factory('gameService', gameService);

    gameService.$inject = [];

    function gameService() {
        var participants = [];

        var service = {
            setParticipants: setParticipants,
            getParticipants: getParticipants
        };
        return service;

        ////////////////

        function setParticipants(newParticipants) {
            participants = newParticipants;
        }

        function getParticipants() {
            return participants;
        }
    }
})();
