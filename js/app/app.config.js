(function() {
    angular
        .module('molkkyscore')
        .config(configure)
        .run(runBlock);

    configure.$inject = ['$provide', '$translateProvider', '$ionicConfigProvider', 'LANGUAGES_ROOT'];
    runBlock.$inject = ['$rootScope',
                        'IMAGES_ROOT',
                        '$ionicPlatform',
                        'dataService',
                        '$translate',
                        '$q',
                        'statisticsService',
                        'loadingService'];

    function configure($provide, $translateProvider, $ionicConfigProvider, LANGUAGES_ROOT) {
        // extend default exceptionHandler
        $provide.decorator('$exceptionHandler', extendExceptionHandler);

        $translateProvider.useStaticFilesLoader({
            prefix: LANGUAGES_ROOT + '/',
            suffix: '.json'
        }).preferredLanguage('english'); // TODO: get from Database

        $ionicConfigProvider.tabs.style('standard');
        $ionicConfigProvider.tabs.position('bottom');
    }

    function runBlock($rootScope,
                        IMAGES_ROOT,
                        $ionicPlatform,
                        dataService,
                        $translate,
                        $q,
                        statisticsService,
                        loadingService) {
        $rootScope.imagesRoot = IMAGES_ROOT;

        if (!window.cordova) {
            dataService.initBrowserDev();
        }

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
                // loadingService.showIndefinite('LOADING-APP');
                dataService.initDatabase().then(function() {
                    var statisticsPromises = [];
                    dataService.initPlayers().then(function(players) {
                        dataService.initTeams(players).then(function(teams) {
                            players.forEach(function(player) {
                                statisticsPromises.push(dataService.initPlayerStatistics(player));
                            });
                            teams.forEach(function(team) {
                                statisticsPromises.push(dataService.initTeamStatistics(team));
                            });
                            $q.all([statisticsPromises]).then(function() {
                                $rootScope.$broadcast('appInitialized'); // caught in home.controller.js
                                // loadingService.hide();
                            });
                        });
                    });
                    dataService.initOverallStatistics();
                    dataService.initGameSettings();
                    dataService.initAppSettings().then(function(appSettings) {
                        $translate.use(appSettings.language);
                    });

                    // requested features that were added after initial launch
                    dataService.initGameTutorial();
                    dataService.initGameSettingsEnableCustomStatistics();
                    dataService.initGameSettingsEnableZap();

                }, function(err) {
                    console.log(err.message);
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
