(function() {
    angular
        .module('molkkyscore')
        .config(configure)
        .run(runBlock);

    configure.$inject = ['$provide'];
    runBlock.$inject = ['$rootScope', 'IMAGES_ROOT', '$ionicPlatform', '$cordovaSQLite'];

    function configure($provide) {
        // extend default exceptionHandler
        $provide.decorator('$exceptionHandler', extendExceptionHandler);
    }

    function runBlock($rootScope, IMAGES_ROOT, $ionicPlatform, $cordovaSQLite) {
        $rootScope.imagesRoot = IMAGES_ROOT;

        $ionicPlatform.ready(function() {
            // console.log('test');
            // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
            // for form inputs)
            if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
                cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
                cordova.plugins.Keyboard.disableScroll(true);

            }
            if (window.StatusBar) {
                // org.apache.cordova.statusbar required
                window.StatusBar.styleDefault();
            }
            testDb();

            function testDb() {
                console.log('tester');
                var db = $cordovaSQLite.openDB({
                    name: 'my.db', location: 'default'
                });
                $cordovaSQLite.execute(db, 'CREATE TABLE IF NOT EXISTS people' +
                    ' (id integer primary key, firstname text, lastname text)');

                var query = 'INSERT INTO people (firstname, lastname) VALUES (?,?)';
                $cordovaSQLite.execute(db, query, ['firstname', 'firstname']).then(function(res) {
                    console.log('INSERT ID -> ' + res.insertId);
                }, function (err) {
                    console.error(err.message);
                });
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
