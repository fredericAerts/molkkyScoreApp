(function() {
    'use strict';

    angular
        .module('molkkyscore')
        .controller('HomeCtrl', HomeCtrl);

    HomeCtrl.$inject = ['$ionicTabsDelegate'];

    function HomeCtrl($ionicTabsDelegate) {
        /* jshint validthis: true */
        var vm = this;

        vm.hideBar = hideBar;

        activate();

        ////////////////

        function activate() {
        }

        function hideBar() {
            $ionicTabsDelegate.showBar(!$ionicTabsDelegate.showBar());
        }
    }
})();
