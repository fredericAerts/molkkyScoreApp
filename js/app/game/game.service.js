(function() {
    'use strict';

    angular
        .module('molkkyscore')
        .factory('gameService', gameService);

    gameService.$inject = ['playersService'];

    function gameService(playersService) {
        var participants = [];

        var service = {
            setParticipants: setParticipants,
            getParticipants: getParticipants,
            initParticipants: initParticipants,
            sortParticipantsOnScore: sortParticipantsOnScore,
            initScoreboard: initScoreboard
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
            participants.sort(function(participantOne, participantTwo) {
                if (participantOne.score < participantTwo.score) {
                    return 1;
                }
                else if (participantOne.score > participantTwo.score) {
                    return -1;
                } // score is equal
                else if (participantOne.endPosition > participantTwo.endPosition) {
                    return 1;
                }
                else if (participantOne.endPosition < participantTwo.endPosition) {
                    return -1;
                }
                else {
                    return 0; // both score and andPosition are equal
                }
            });

            return participants;
        }

        function initScoreboard(scoreboard) {
            scoreboard.rowOne = participants.slice(0, 4);
            scoreboard.rowTwo = participants.slice(4, 8);

            switch (participants.length) {
                case 2: scoreboard.colWidthPercentage = 50; break;
                case 3: scoreboard.colWidthPercentage = 33; break;
                default: scoreboard.colWidthPercentage = 25;
            }

            return scoreboard;
        }
    }
})();
