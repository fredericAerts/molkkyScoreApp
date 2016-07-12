(function() {
    'use strict';

    angular
        .module('molkkyscore')
        .controller('PlayersCtrl', PlayersCtrl);

    PlayersCtrl.$inject = ['playersService'];

    function PlayersCtrl(playersService) {
        /* jshint validthis: true */
        var vm = this;

        vm.players = playersService.all();
        vm.remove = remove;
        vm.removeVisible = false;

        activate();

        ////////////////

        function activate() {
        }

        function remove(player) {
            playersService.remove(player);
        }
    }
})();
