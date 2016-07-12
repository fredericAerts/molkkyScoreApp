(function() {
    'use strict';

    angular
        .module('molkkyscore')
        .controller('SettingsCtrl', SettingsCtrl);

    SettingsCtrl.$inject = ['$ionicPopup', '$translate', 'settingsService'];

    function SettingsCtrl($ionicPopup, $translate, settingsService) {
        /* jshint validthis: true */
        var vm = this;

        // TODO: add toasts confirming saving of settings (http://ngcordova.com/docs/plugins/toast/)

        vm.activeTabIndex = 0;
        vm.activateTab = activateTab;

        vm.gameCustomSetting = settingsService.isGameCustomSetting();
        vm.toggleGameCustomSetting = toggleGameCustomSetting;
        vm.winningScoreOptions = settingsService.getWinningScoreOptions();
        vm.winningScore = filterOutActiveItem(vm.winningScoreOptions);
        vm.setWinningScore = settingsService.setWinningScore;
        vm.winningScoreExceededOptions = settingsService.getWinningScoreExceededOptions();
        vm.winningScoreExceeded = filterOutActiveItem(vm.winningScoreExceededOptions);
        vm.setWinningScoreExceeded = settingsService.setWinningScoreExceeded;
        vm.threeMissesOptions = settingsService.getThreeMissesOptions();
        vm.threeMisses = filterOutActiveItem(vm.threeMissesOptions);
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

        function filterOutActiveItem(array) {
            return array.filter(function(option) {
                return option.active;
            })[0].value;
        }
    }
})();
