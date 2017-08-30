(function() {
    'use strict';

    angular
        .module('molkkyscore')
        .controller('SettingsCtrl', SettingsCtrl);

    SettingsCtrl.$inject = ['$scope',
                            '$rootScope',
                            'TEMPLATES_ROOT',
                            '$ionicPopup',
                            '$ionicPopover',
                            '$translate',
                            'settingsService',
                            'toast',
                            '$ionicScrollDelegate'];

    function SettingsCtrl($scope,
                            $rootScope,
                            TEMPLATES_ROOT,
                            $ionicPopup,
                            $ionicPopover,
                            $translate,
                            settingsService,
                            toast,
                            $ionicScrollDelegate) {
        /* jshint validthis: true */
        var vm = this;
        var zapInfoPopoverScope = $scope.$new(true);

        var toastMessages = toast.getMessages().settings;

        vm.activeTabIndex = 0;
        vm.setTabIndex = setTabIndex;

        vm.options = settingsService.getOptions();
        vm.parameters = settingsService.getParameters();
        vm.showZapInfo = showZapInfo;
        vm.zapInfoPopover = {};

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
            initZapInfoPopover();
        }

        function showZapInfo($event) {
            vm.zapInfoPopover.show($event);

            $event.stopPropagation();
            $event.preventDefault();
        }

        function setTabIndex(index) {
            vm.activeTabIndex = index;
            $ionicScrollDelegate.scrollTop();
        }

        /*  Helper functions
            ======================================================================== */
        function initZapInfoPopover() {
            zapInfoPopoverScope.$on('popover.hidden', function() {
                angular.element(document).find('body').removeClass('popover-open');
            });

            $ionicPopover.fromTemplateUrl(TEMPLATES_ROOT + '/settings/popover-zap-info.html', {
                scope: zapInfoPopoverScope
            }).then(function(popover) {
                vm.zapInfoPopover = popover;
            });

            /*  ==================================================================
                - popover template should reference 'viewModel' as its scope
                - viewModel data is initialized (reset) each time popover is shown
                ================================================================== */
            zapInfoPopoverScope.viewModel = {};
        }

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
