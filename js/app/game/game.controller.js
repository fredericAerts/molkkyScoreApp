(function() {
    'use strict';

    angular
        .module('molkkyscore')
        .controller('GameCtrl', GameCtrl);

    GameCtrl.$inject = ['gameService', 'playersService'];

    function GameCtrl(gameService, playersService) {
        /* jshint validthis: true */
        var vm = this;

        vm.participants = gameService.getParticipants();
        vm.participants = playersService.all();
        vm.scoreboard = {};

        activate();

        ////////////////

        function activate() {
            initScoreboard();
        }

        function initScoreboard() {
            vm.scoreboard.rowOne = vm.participants.slice(0, 4);
            vm.scoreboard.rowTwo = vm.participants.slice(4, 8);

            vm.scoreboard.colWidthPercentage = 25;
            if (vm.participants.length < 4) {
                vm.scoreboard.colWidthPercentage = vm.participants.length === 3 ? 33 : 50;
            }
        }
    }
})();
