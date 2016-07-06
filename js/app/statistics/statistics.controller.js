(function() {
    'use strict';

    angular
        .module('molkkyscore')
        .controller('StatisticsCtrl', StatisticsCtrl);

    StatisticsCtrl.$inject = [];

    function StatisticsCtrl() {
        /* jshint validthis: true */
        var vm = this;

        vm.test = 'test statistics';

        activate();

        ////////////////

        function activate() {
        }
    }
})();
