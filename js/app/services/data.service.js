(function() {
    'use strict';

    angular
        .module('molkkyscore')
        .factory('dataService', dataService);

    dataService.$inject = ['$ionicPlatform', '$cordovaSQLite'];

    function dataService($ionicPlatform, $cordovaSQLite) {
        var database = {};
        var players = [];
        var overallStatistics = {};
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
            getAllPlayers: getAllPlayers,
            getOverallStatistics: getOverallStatistics,
            updateOverallStatistics: updateOverallStatistics
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

        function getAllPlayers() {
            return players;
        }

        function getOverallStatistics() {
            return overallStatistics;
        }

        function updateOverallStatistics() {
            var totalGamesPlayed = overallStatistics.totalGamesPlayed;
            var insertOverallStatistics = 'UPDATE statistics_overall_metrics SET total_games_played=' + totalGamesPlayed + ' WHERE id=1';
            $cordovaSQLite.execute(database, insertOverallStatistics, [0]).then(function(res) {
                // overall statistics updated
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

            // testDatabase();
        }

        function testDatabase() {
            var insertOverallStatistics = 'UPDATE statistics_overall_metrics SET total_games_played=1 WHERE id=1';
            $cordovaSQLite.execute(database, insertOverallStatistics, [0]).then(function(res) {
                console.log('INSERT -> ' + res);
            }, function (err) {
                console.error(err.message);
            });
        }
    }
})();
