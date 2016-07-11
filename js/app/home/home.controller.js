(function() {
    'use strict';

    angular
        .module('molkkyscore')
        .controller('HomeCtrl', HomeCtrl);

    HomeCtrl.$inject = ['$translate'];

    function HomeCtrl($translate) {
        /* jshint validthis: true */
        var vm = this;

        vm.changeLanguage = function(key) {
            $translate.use(key);
        };

        activate();

        ////////////////

        function activate() {
        }
    }
})();
