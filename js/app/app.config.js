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
                var database = initDatabase();
                initDatabaseTables(database);
                testDatabase(database);
            }

            function initDatabaseTables(database) {
                var addPlayersTable = 'CREATE TABLE IF NOT EXISTS players' +
                    ' (id integer primary key auto_increment, firstname text, lastname text, tagline text,' +
                    ' face text, statistics_raw_data_id integer, statistics_metrics_id integer)';
                var addStatisticsPlayerRawDataTable = 'CREATE TABLE IF NOT EXISTS statistics_player_raw_data' +
                    ' (id integer primary key auto_increment, throws integer, throws_single_pin integer,' +
                    ' throws_in_games_reached_max_score integer, gamesPlayed integer,' +
                    ' games_reached_max_score integer, games_won integer)';
                var addStatisticsPlayerMetricsTable = 'CREATE TABLE IF NOT EXISTS statistics_player_metrics' +
                    ' (id integer primary key auto_increment, total_wins integer, versatility decimal(5,4),' +
                    ' winning_ratio decimal(5,4), accuracy decimal(5,4), efficiency decimal(5,4))';
                var addStatisticsOverallMetricsTable = 'CREATE TABLE IF NOT EXISTS statistics_overall_metrics' +
                    ' (id integer primary key auto_increment, total_games_played integer)';
                var addGameSettingsTable = 'CREATE TABLE IF NOT EXISTS game_settings' +
                    ' (id integer primary key auto_increment, is_custom tinyint(1), winning_score integer, winning_score_exceeded text,' +
                    ' three_misses text)';
                var addAppSettingsTable = 'CREATE TABLE IF NOT EXISTS app_settings' +
                    ' (id integer primary key auto_increment, language text)';

                var queries = [
                    addPlayersTable,
                    addStatisticsPlayerRawDataTable,
                    addStatisticsPlayerMetricsTable,
                    addStatisticsOverallMetricsTable,
                    addGameSettingsTable,
                    addAppSettingsTable
                ];
                queries.forEach(function(query) {
                    $cordovaSQLite.execute(database, query);
                });
            }

            function initDatabase() {
                var databes = $cordovaSQLite.openDB({
                    name: 'my.db', location: 'default'
                });

                return databes;
            }

            function testDatabase() {
                // var insertPlayerQuery = 'INSERT INTO players (firstname, lastname, tagline, face, statistics_raw_data_id, statistics_metrics_id) VALUES (?,?,?,?,?,?)';
                // $cordovaSQLite.execute(database, insertPlayerQuery, ['Frederic', 'Aerts', 'Hello hello', 'img/me.png', 10, 11]).then(function(res) {
                //     console.log('INSERT -> ' + res);
                // }, function (err) {
                //     console.error(err.message);
                // });

                var selectPlayersQuery = 'SELECT * FROM players';
                $cordovaSQLite.execute(database, selectPlayersQuery).then(function(res) {
                    var rows = [];
                    for (var i = 0; i < res.rows.length; i++) {
                        rows.push(res.rows.item(i));
                    }
                    rows.forEach(function(row) {
                        console.log('SELECT -> ' + row.firstname);
                        console.log('SELECT -> ' + row.id);
                    });
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
