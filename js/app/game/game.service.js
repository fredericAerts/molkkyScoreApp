(function() {
    'use strict';

    angular
        .module('molkkyscore')
        .factory('gameService', gameService);

    gameService.$inject = ['playersService'];

    function gameService(playersService) {
        // var participants = [];
        var participants = playersService.all();

        var service = {
            setParticipants: setParticipants,
            getParticipants: getParticipants,
            initParticipants: initParticipants,
            sortParticipantsOnScore: sortParticipantsOnScore
        };
        return service;

        ////////////////

        function setParticipants(newParticipants) {
            participants = newParticipants;
        }

        function getParticipants() {
            return participants;
        }

        function initParticipants() {
            participants.forEach(function(participant) {
                participant.score = 0;
                participant.scoreHistory = [];
                participant.accumulatedScoreHistory = [];
                participant.missesInARow = 0;
                participant.finishedGame = false;
                participant.disqualified = false;
                participant.endPosition = -1;
                participant.activedAvatarStatus = '';
            });

            return participants;
        }

        function sortParticipantsOnScore() {
            console.log('sort');
            return participants;
        }
    }
})();
