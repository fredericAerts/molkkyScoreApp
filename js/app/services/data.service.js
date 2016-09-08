(function() {
    'use strict';

    angular
        .module('molkkyscore')
        .factory('dataService', dataService);

    dataService.$inject = ['$cordovaSQLite'];

    function dataService($cordovaSQLite) {
        var database = {};
        var players = [];
        var overallStatistics = {};
        var gameSettings = {};
        var appSettings = {};
        // var players = [
        //     {
        //         id: 0,
        //         firstName: 'Ben',
        //         lastName: 'Sparrow',
        //         tagline: 'You on your way?',
        //         face: 'img/ben.png'
        //     },
        //     {
        //         id: 1,
        //         firstName: 'Max',
        //         lastName: 'Lynx',
        //         tagline: 'Hey, it\'s me',
        //         face: 'img/max.png'
        //     },
        //     {
        //         id: 2,
        //         firstName: 'Adam',
        //         lastName: 'Bradleyson',
        //         tagline: 'I should buy a boat',
        //         face: 'img/adam.jpg'
        //     }
        // ];

        var service = {
            initDatabase: initDatabase,
            initPlayers: initPlayers,
            initOverallStatistics: initOverallStatistics,
            initGameSettings: initGameSettings,
            initAppSettings: initAppSettings,
            getAllPlayers: getAllPlayers,
            getOverallStatistics: getOverallStatistics,
            getGameSettings: getGameSettings,
            getAppSettings: getAppSettings,
            updateOverallStatistics: updateOverallStatistics,
            updateGameSettings: updateGameSettings,
            updateAppSettings: updateAppSettings
        };
        return service;

        ////////////////

        function initDatabase() { // called from app.config.js
            if (!window.cordova) {
                return;
            }

            database = $cordovaSQLite.openDB({
                name: 'my.db', location: 'default'
            });

            initDatabaseTables(database);
        }

        function initPlayers() {
            if (!window.cordova) {
                return;
            }

            var selectAllPlayersQuery = 'SELECT * FROM players';
            return $cordovaSQLite.execute(database, selectAllPlayersQuery).then(function(res) {
                for (var i = 0; i < res.rows.length; i++) {
                    var row = res.rows.item(i);
                    players.push({
                        id: row.id,
                        firstName: row.firstname,
                        lastName: row.lastname,
                        tagline: row.tagline,
                        face: row.face,
                        statistics: {
                            rawData: {
                                id: row.statistics_raw_data_id
                            },
                            metrics: {
                                id: row.statistics_metrics_id
                            }
                        }
                    });
                }
                return players;
            }, function (err) {
                console.error(err.message);
            });
        }

        function initOverallStatistics() {
            if (!window.cordova) {
                return;
            }

            var selectOverallStatisticsQuery = 'SELECT * FROM statistics_overall_metrics';
            return $cordovaSQLite.execute(database, selectOverallStatisticsQuery).then(function(res) {
                overallStatistics.totalGamesPlayed = res.rows.item(0).total_games_played;
            }, function (err) {
                console.error(err.message);
            });
        }

        function initGameSettings() {
            if (!window.cordova) {
                return;
            }

            var selectGameSettingsQuery = 'SELECT * FROM game_settings';
            return $cordovaSQLite.execute(database, selectGameSettingsQuery).then(function(res) {
                gameSettings.isCustom = res.rows.item(0).is_custom === 1 ? true : false;
                gameSettings.winningScore = res.rows.item(0).winning_score;
                gameSettings.winningScoreExceeded = res.rows.item(0).winning_score_exceeded;
                gameSettings.threeMisses = res.rows.item(0).three_misses;
            }, function (err) {
                console.error(err.message);
            });
        }

        function initAppSettings() {
            if (!window.cordova) {
                return;
            }

            var selectAppSettingsQuery = 'SELECT * FROM app_settings';
            return $cordovaSQLite.execute(database, selectAppSettingsQuery).then(function(res) {
                appSettings.language = res.rows.item(0).language;
                return appSettings;
            }, function (err) {
                console.error(err.message);
            });
        }

        function getAllPlayers() {
            return players;
        }

        function getOverallStatistics() {
            return overallStatistics;
        }

        function getGameSettings() {
            return gameSettings;
        }

        function getAppSettings() {
            return appSettings;
        }

        function updateOverallStatistics() {
            var totalGamesPlayed = overallStatistics.totalGamesPlayed;
            var updateOverallStatistics = 'UPDATE statistics_overall_metrics SET' +
                                            ' total_games_played=' + totalGamesPlayed +
                                            ' WHERE id=1';
            $cordovaSQLite.execute(database, updateOverallStatistics).then(function(res) {
                // overall statistics updated
            }, function (err) {
                console.error(err.message);
            });
        }

        function updateGameSettings() {
            var isCustom = gameSettings.isCustom ? 1 : 0;
            var winningScore = gameSettings.winningScore;
            var winningScoreExceeded = gameSettings.winningScoreExceeded;
            var threeMisses = gameSettings.threeMisses;
            var updateGameSettings = 'UPDATE game_settings SET' +
                                            ' is_custom=' + isCustom + ',' +
                                            ' winning_score=' + winningScore + ',' +
                                            ' winning_score_exceeded="' + winningScoreExceeded + '",' +
                                            ' three_misses="' + threeMisses + '"' +
                                            ' WHERE id=1';
            $cordovaSQLite.execute(database, updateGameSettings).then(function(res) {
                // overall statistics updated
            }, function (err) {
                console.error(err.message);
            });
        }

        function updateAppSettings() {
            var language = appSettings.language;
            var updateGameSettings = 'UPDATE app_settings SET' +
                                            ' language="' + language + '"' +
                                            ' WHERE id=1';
            $cordovaSQLite.execute(database, updateGameSettings).then(function(res) {
                // app settings updated
            }, function (err) {
                console.error(err.message);
            });
        }

        /*  Helper functions
            ======================================================================================== */
        function initDatabaseTables(database) {
            if (!window.cordova) {
                return;
            }
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
                ' (id integer primary key auto_increment, is_custom tinyint(1), winning_score integer,' +
                ' winning_score_exceeded text, three_misses text)';
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

            // testDatabase();
        }

        function testDatabase() {
            var values = [0, 25, 'half of winning score', 'disqualified'];
            // var insertOverallStatistics = 'UPDATE statistics_overall_metrics SET total_games_played=1 WHERE id=1';
            var insertOverallStatistics = 'INSERT INTO game_settings (is_custom, winning_score,' +
                ' winning_score_exceeded, three_misses) VALUES (?,?,?,?)';
            $cordovaSQLite.execute(database, insertOverallStatistics, values).then(function(res) {
                console.log('INSERT -> ' + res);
            }, function (err) {
                console.error(err.message);
            });
        }

        /*  first time application use functions
            ======================================================================================== */
        function introGameSettings() {
            var values = [0, 50, 'half of winning score', 'disqualified'];
            var insertGameSettings = 'INSERT INTO game_settings (is_custom, winning_score,' +
                ' winning_score_exceeded, three_misses) VALUES (?,?,?,?)';
            $cordovaSQLite.execute(database, insertGameSettings, values).then(function(res) {
                console.log('INSERT -> ' + res);
            }, function (err) {
                console.error(err.message);
            });
        }

        function introAppSettings() {
            var values = ['english'];
            var insertAppSettings = 'INSERT INTO app_settings (language) VALUES (?)';
            $cordovaSQLite.execute(database, insertAppSettings, values).then(function(res) {
                console.log('INSERT -> ' + res);
            }, function (err) {
                console.error(err.message);
            });
        }
    }
})();
