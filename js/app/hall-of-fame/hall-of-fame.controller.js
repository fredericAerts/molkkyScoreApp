(function() {
    'use strict';

    angular
        .module('molkkyscore')
        .controller('HallOfFameCtrl', HallOfFameCtrl);

    HallOfFameCtrl.$inject = [];

    function HallOfFameCtrl() {
        /* jshint validthis: true */
        var vm = this;

        vm.test = 'test hall of fame';

        activate();

        ////////////////

        function activate() {
        }
    }
})();
