(function() {
    'use strict';

    angular
        .module('molkkyscore')
        .controller('StatisticsCtrl', StatisticsCtrl);

    StatisticsCtrl.$inject = ['$rootScope',
                                '$scope',
                                'statisticsService',
                                'TEMPLATES_ROOT',
                                '$ionicPopover',
                                '$ionicModal'];

    function StatisticsCtrl($rootScope, $scope, statisticsService, TEMPLATES_ROOT, $ionicPopover, $ionicModal) {
        /* jshint validthis: true */
        var vm = this;
        var statisticsInfoModalScope = $scope.$new(true);
        var statsItemsInfoPopoverScope = $scope.$new(true);

        vm.metrics = statisticsService.getMetrics();
        vm.statisticsInfoModal = {};
        vm.statsItemsInfoPopover = {};
        vm.showItemInfo = showItemInfo;

        activate();

        ////////////////

        function activate() {
            statisticsService.translateMetrics();
            initStatisticsInfoModal();
            initStatsItemsInfoPopover();
        }

        /*  LISTENERS
            ======================================================================================== */
        $rootScope.$on('$translateChangeSuccess', function () {
            statisticsService.translateMetrics();

        });

        /*  FUNCTIONS
            ======================================================================================== */
        function initStatisticsInfoModal() {
            $ionicModal.fromTemplateUrl(TEMPLATES_ROOT + '/statistics/modal-statistics-info.html', {
                scope: statisticsInfoModalScope,
                animation: 'slide-in-up'
            })
            .then(function(modal) {
                vm.statisticsInfoModal = modal;

                /*  ==================================================================
                - modal template should reference 'viewModel' as its scope
                ================================================================== */
                statisticsInfoModalScope.viewModel = {
                    modal: vm.statisticsInfoModal
                };
            });
        }

        function initStatsItemsInfoPopover() {
            $ionicPopover.fromTemplateUrl(TEMPLATES_ROOT + '/statistics/popover-statistics-item-info.html', {
                scope: statsItemsInfoPopoverScope
            }).then(function(popover) {
                vm.statsItemsInfoPopover = popover;
            });

            /*  ==================================================================
                - popover template should reference 'viewModel' as its scope
                - viewModel data is initialized (reset) each time popover is shown
                ================================================================== */
            statsItemsInfoPopoverScope.viewModel = {
                metric: {}
            };
        }

        function showItemInfo($event, metric) {
            statsItemsInfoPopoverScope.viewModel.metric = metric;

            vm.statsItemsInfoPopover.show($event);

            $event.stopPropagation();
            $event.preventDefault();
        }
    }
})();
