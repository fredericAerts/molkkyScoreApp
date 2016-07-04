(function() {
    angular
        .module('molkkyscore')
        .config(configure)
        .run(runBlock);

    configure.$inject = ['$provide'];
    runBlock.$inject = ['$rootScope', 'IMAGES_ROOT', '$ionicPlatform'];

    function configure($provide) {
        // extend default exceptionHandler
        $provide.decorator('$exceptionHandler', extendExceptionHandler);
    }

    function runBlock($rootScope, IMAGES_ROOT, $ionicPlatform) {
        $rootScope.imagesRoot = IMAGES_ROOT;

        $ionicPlatform.ready(function() {
            // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
            // for form inputs)
            if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
                cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
                cordova.plugins.Keyboard.disableScroll(true);

            }
            if (window.StatusBar) {
                // org.apache.cordova.statusbar required
                StatusBar.styleDefault();
            }
        });
    }

    /*  FUNCTIONS
    ============================================================ */
    extendExceptionHandler.$inject = ['$delegate'];
    function extendExceptionHandler($delegate) {
        return function(exception, cause) {
            $delegate(exception, cause);
            var errorData = {
                exception: exception,
                cause: cause
            };
            /**
             * Could add the error to a service's collection,
             * add errors to $rootScope, log errors to remote web server,
             * or log locally. Or throw hard. It is entirely up to you.
             * throw exception;
             */
        };
    }
})();
