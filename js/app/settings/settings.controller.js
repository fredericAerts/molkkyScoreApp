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
        vm.languageOtions = settingsService.getLanguageOtions();
        vm.activeLanguageKey = settingsService.getActiveLanguageKey();
        vm.setLanguageKey = settingsService.setLanguageKey;
        vm.maxScoreOptions = settingsService.getMaxScoreOptions();
        vm.maxScore = vm.maxScoreOptions.filter(function(option) { return option.active; })[0].value;
        vm.setMaxScore = settingsService.setMaxScore

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
