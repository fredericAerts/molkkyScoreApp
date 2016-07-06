(function() {
    'use strict';

    angular
        .module('molkkyscore')
        .controller('SettingsCtrl', SettingsCtrl);

    SettingsCtrl.$inject = ['$ionicTabsDelegate'];

    function SettingsCtrl($ionicTabsDelegate) {
        /* jshint validthis: true */
        var vm = this;

        activate();

        ////////////////

        function activate() {
        }
    }
})();
