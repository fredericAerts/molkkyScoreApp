(function() {
    'use strict';

    angular
        .module('molkkyscore')
        .controller('PlayerDetailCtrl', PlayerDetailCtrl);

    PlayerDetailCtrl.$inject = ['$stateParams', 'playersService'];

    function PlayerDetailCtrl($stateParams, playersService) {
        /* jshint validthis: true */
        var vm = this;

        vm.player = playersService.get($stateParams.playerId);

        activate();

        ////////////////

        function activate() {
        }
    }
})();
