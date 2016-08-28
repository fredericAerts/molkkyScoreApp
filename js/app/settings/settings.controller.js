(function() {
    'use strict';

    angular
        .module('molkkyscore')
        .controller('SettingsCtrl', SettingsCtrl);

    SettingsCtrl.$inject = ['$scope', '$rootScope', '$ionicPopup', '$translate', 'settingsService', 'toast'];

    function SettingsCtrl($scope, $rootScope, $ionicPopup, $translate, settingsService, toast) {
        /* jshint validthis: true */
        var vm = this;

        var toastMessages = toast.getMessages().settings;

        vm.activeTabIndex = 0;

        vm.options = settingsService.getOptions();
        vm.customSetting = settingsService.isCustomSetting();
        vm.parameters = settingsService.getParameters();

        activate();

        ////////////////

        /*  Listeners
            ======================================================================== */
        $rootScope.$on('$translateChangeSuccess', function() {
            toastMessages = toast.getMessages().settings;
        });

        $scope.$watch(
            function watchCustomSetting() {
                return vm.customSetting;
            },
            function handleCustomSettingChange(newValue, oldValue) {
                if (newValue !== oldValue && newValue) {
                    showAlert();
                }
            }
        );

        $scope.$watch(
            function watchParameters() {
                return vm.parameters;
            },
            function handleParametersChange(newValue, oldValue) {
                if (!_.isEqual(newValue, oldValue)) {
                    toast.show(toastMessages.update);
                }
            }, true
        );

        function activate() {
        }

        /*  Helper functions
            ======================================================================== */
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
