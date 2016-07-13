(function() {
    'use strict';

    angular
        .module('molkkyscore')
        .controller('GameCtrl', GameCtrl);

    GameCtrl.$inject = ['$scope', 'playersService', '$translate'];

    function GameCtrl($scope, playersService, $translate) {
        /* jshint validthis: true */
        var vm = this;

        vm.potentialPlayers = playersService.all();


        activate();

        ////////////////

        function activate() {

        }
    }
})();
