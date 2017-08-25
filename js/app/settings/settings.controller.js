(function() {
    'use strict';

    angular
        .module('molkkyscore')
        .controller('SettingsCtrl', SettingsCtrl);

    SettingsCtrl.$inject = ['$scope',
                            '$rootScope',
                            '$ionicPopup',
                            '$translate',
                            'settingsService',
                            'toast'];

    function SettingsCtrl($scope,
                            $rootScope,
                            $ionicPopup,
                            $translate,
                            settingsService,
                            toast) {
        /* jshint validthis: true */
        var vm = this;

        var toastMessages = toast.getMessages().settings;

        vm.activeTabIndex = 0;

        vm.options = settingsService.getOptions();
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
                return vm.parameters.game.isCustom;
            },
            function handleCustomSettingChange(newValue, oldValue) {
                if (newValue !== oldValue && newValue && !vm.parameters.game.enableCustomStatistics) {
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
                    updateParameters(newValue, oldValue);
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
                template: $translate.instant('HOME.SETTINGS.TABS.GAME.CUSTOM-TOGGLE.POPUP.TEXT'),
                okText: $translate.instant('HOME.GENERAL.CONFIRM.OK')
            });

            alertPopup.then(function(res) {
            });
        }

        function updateParameters(newParameters, oldParameters) {
            var diffApp = _.omit(newParameters.app, isPropertySameIn(oldParameters.app));
            var diffGame = _.omit(newParameters.game, isPropertySameIn(oldParameters.game));

            if (!_.isEmpty(diffApp)) {
                var updatedKeys = Object.keys(diffApp);
                updatedKeys.forEach(function(key) {
                    settingsService.updateAppParameter(key, vm.parameters.app[key]);
                });
            }

            if (!_.isEmpty(diffGame)) {
                settingsService.updateGameParameter();
            }
        }

        function isPropertySameIn(otherObject) {
            return function(value, key) {
                return otherObject[key] === value;
            };
        }
    }
})();
