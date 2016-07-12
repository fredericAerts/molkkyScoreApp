(function() {
    'use strict';

    angular
        .module('molkkyscore')
        .controller('SettingsCtrl', SettingsCtrl);

    SettingsCtrl.$inject = ['$ionicPopup', '$translate', 'settingsService'];

    function SettingsCtrl($ionicPopup, $translate, settingsService) {
        /* jshint validthis: true */
        var vm = this;

        vm.activeTabIndex = 0;
        vm.activateTab = activateTab;

        vm.gameCustomSetting = settingsService.isGameCustomSetting();
        vm.toggleGameCustomSetting = toggleGameCustomSetting;
        vm.winningScoreOptions = settingsService.getWinningScoreOptions();
        vm.winningScore = vm.winningScoreOptions.filter(function(option) { return option.active; })[0].value;
        vm.setWinningScore = settingsService.setWinningScore;
        vm.winningScoreExceededOptions = settingsService.getWinningScoreExceededOptions();
        vm.winningScoreExceeded = vm.winningScoreExceededOptions.filter(function(option) { return option.active; })[0].value;
        vm.setWinningScoreExceeded = settingsService.setWinningScoreExceeded;
        vm.threeMissesOptions = settingsService.getThreeMissesOptions();
        vm.threeMisses = vm.threeMissesOptions.filter(function(option) { return option.active; })[0].value;
        vm.setThreeMisses = settingsService.setThreeMisses;

        vm.languageOtions = settingsService.getLanguageOtions();
        vm.activeLanguageKey = settingsService.getActiveLanguageKey();
        vm.setLanguageKey = settingsService.setLanguageKey;

        activate();

        ////////////////

        function activate() {
        }

        function activateTab(index) {
            vm.activeTabIndex = index;
        }

        function toggleGameCustomSetting() {
            vm.gameCustomSetting = settingsService.toggleGameCustomSetting();
            if (vm.gameCustomSetting) {
                showAlert();
            }
        }

        // An alert dialog
        function showAlert() {
            var alertPopup = $ionicPopup.alert({
                title: $translate.instant('HOME.SETTINGS.TABS.GAME.CUSTOM-TOGGLE.POPUP.TITLE'),
                template: $translate.instant('HOME.SETTINGS.TABS.GAME.CUSTOM-TOGGLE.POPUP.TEXT')
            });

            alertPopup.then(function(res) {
            });
        }
    }
})();
