(function() {
    'use strict';

    angular
        .module('molkkyscore')
        .controller('StatisticsListingCtrl', StatisticsListing);

    StatisticsListing.$inject = [];

    function StatisticsListing() {
        /* jshint validthis: true */
        var vm = this;

        vm.test = 'test listing';

        activate();

        ////////////////

        function activate() {
        }
    }
})();
