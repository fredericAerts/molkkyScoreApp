(function() {
    'use strict';

    angular
        .module('molkkyscore')
        .controller('GameCtrl', GameCtrl);

    GameCtrl.$inject = ['gameService'];

    function GameCtrl(gameService) {
        /* jshint validthis: true */
        var vm = this;

        vm.participants = gameService.getParticipants();

        activate();

        ////////////////

        function activate() {
        }
    }
})();
