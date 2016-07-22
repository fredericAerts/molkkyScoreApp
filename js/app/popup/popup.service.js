(function() {
    'use strict';

    angular
        .module('molkkyscore')
        .factory('popupService', popupService);

    popupService.$inject = ['$ionicPopup'];

    function popupService($ionicPopup) {
        /*  Service for creating modals that are used in more than one controller
            ====================================================================== */

        var service = {
            showConfirmPopup: showConfirmPopup
        };
        return service;

        ////////////////

        function showConfirmPopup(popupOptions, callback) {
            $ionicPopup.show(popupOptions)
            .then(function(confirmed) {
                if (confirmed) {
                    callback();
                }
            });
        }
    }
})();
