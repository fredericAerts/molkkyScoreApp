(function() {
    angular
        .module('molkkyscore')
        .config(configure)
        .run(runBlock);

    configure.$inject = ['$provide', '$translateProvider', '$ionicConfigProvider', 'LANGUAGES_ROOT'];
    runBlock.$inject = ['$rootScope',
                        'IMAGES_ROOT',
                        '$ionicPlatform',
                        '$cordovaSQLite',
                        'playersService',
                        'statisticsService'];

    function configure($provide, $translateProvider, $ionicConfigProvider, LANGUAGES_ROOT) {
        // extend default exceptionHandler
        $provide.decorator('$exceptionHandler', extendExceptionHandler);

        $translateProvider.useStaticFilesLoader({
            prefix: LANGUAGES_ROOT + '/',
            suffix: '.json'
        }).preferredLanguage('english'); // TODO: get from DB

        $ionicConfigProvider.tabs.style('standard');
        $ionicConfigProvider.tabs.position('bottom');
    }

    function runBlock($rootScope,
                        IMAGES_ROOT,
                        $ionicPlatform,
                        $cordovaSQLite,
                        playersService,
                        statisticsService) {
        $rootScope.imagesRoot = IMAGES_ROOT;

        initStatistics(playersService.all(), statisticsService);

        $ionicPlatform.ready(function() {
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

            if (window.cordova) {
                testDb();
            }

            function testDb() {
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

    function initStatistics(players, statisticsService) {
        // game statistics
        statisticsService.initOverallStatistics();

        // player statistics
        players.forEach(function(player) {
            statisticsService.initPlayerStatistics(player);
        });
    }
})();
