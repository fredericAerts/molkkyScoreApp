(function() {
    'use strict';

    angular
        .module('molkkyscore')
        .factory('loadingService', loadingService);

    loadingService.$inject = ['$rootScope', 'TEMPLATES_ROOT', '$ionicLoading'];

    function loadingService($rootScope, TEMPLATES_ROOT, $ionicLoading) {
        var service = {
            show: show,
            showIndefinite: showIndefinite,
            hide: hide
        };
        return service;

        ////////////////

        function show (message) {
            $rootScope.loadingMessage = message;

            $ionicLoading.show({
                templateUrl: TEMPLATES_ROOT + '/loading/loading.html',
                noBackdrop: true,
                duration: 1000
            });
        }

        function showIndefinite(message) {
            $rootScope.loadingMessage = message;

            $ionicLoading.show({
                templateUrl: TEMPLATES_ROOT + '/loading/loading.html',
                noBackdrop: true
            });
        }

        function hide() {
            $ionicLoading.hide();
        }
    }
})();
