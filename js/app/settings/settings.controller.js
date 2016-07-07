(function() {
    'use strict';

    angular
        .module('molkkyscore')
        .controller('SettingsCtrl', SettingsCtrl);

    SettingsCtrl.$inject = ['$ionicNavBarDelegate', '$ionicHistory', '$timeout'];

    function SettingsCtrl($ionicNavBarDelegate, $ionicHistory, $timeout) {
        /* jshint validthis: true */
        var vm = this;

        vm.activateTab = activateTab;

        vm.activeTabIndex = 0;

        activate();

        ////////////////

        function activate() {
        }

        function activateTab(index) {;
            vm.activeTabIndex = index;

        }
    }
})();
