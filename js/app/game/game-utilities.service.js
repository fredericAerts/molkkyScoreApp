(function() {
    'use strict';

    angular
        .module('molkkyscore')
        .factory('gameUtilities', gameUtilities);

    gameUtilities.$inject = [];

    function gameUtilities() {
        var service = {
            getActivePlayerIndex: getActivePlayerIndex,
            getEndPosition: getEndPosition,
            getActivatedAvatarStatus: getActivatedAvatarStatus,
            isGameEnded: isGameEnded,
            isGameStarted: isGameStarted
        };
        return service;

        ////////////////

        function getActivePlayerIndex(activePlayer, participants) {
            var activePlayerIndex = _.findIndex(participants, function(participant) {
                return activePlayer === participant;
            });

            return activePlayerIndex;
        }

        function getEndPosition(participants) {
            var numberOfPlayersThatFinishedGame = 0;

            participants.forEach(function(participant) {
                if (participant.finishedGame) {
                    numberOfPlayersThatFinishedGame += 1;
                }
            });

            return numberOfPlayersThatFinishedGame;
        }

        function getActivatedAvatarStatus(activatedScore, activePlayer, settings) {
            var status = '';
            var potentialScore = activePlayer.score + activatedScore;

            if (activatedScore === 0 && activePlayer.missesInARow === 2) {
                status = settings.threeMisses === 'disqualified' ? 'error' : 'warning';
            }
            else if (potentialScore > settings.winningScore) {
                status = 'warning';
            }
            else if (potentialScore === settings.winningScore) {
                status = 'success';
            }

            return status;
        }

        function isGameEnded(participants) {
            var playersStillParticipating = participants.length;

            participants.forEach(function(participant) {
                if (participant.finishedGame || participant.disqualified) {
                    playersStillParticipating -= 1;
                }
            });

            return playersStillParticipating < 2;
        }

        function isGameStarted(participants) {
            return participants[0].scoreHistory.length;
        }
    }
})();
