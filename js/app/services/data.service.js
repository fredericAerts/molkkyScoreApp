(function() {
    'use strict';

    angular
        .module('molkkyscore')
        .factory('dataService', dataService);

    dataService.$inject = ['$cordovaSQLite', '$q'];

    function dataService($cordovaSQLite, $q) {
        var database = {};
        var players = [];
        var teams = [];
        var overallStatistics = {};
        var gameSettings = {};
        var appSettings = {};
        var gameTutorial = {};

        var service = {
            initBrowserDev: initBrowserDev,
            initDatabase: initDatabase,
            initPlayers: initPlayers,
            initTeams: initTeams,
            initPlayerStatistics: initPlayerStatistics,
            initTeamStatistics: initTeamStatistics,
            initOverallStatistics: initOverallStatistics,
            initGameSettings: initGameSettings,
            initAppSettings: initAppSettings,
            initGameTutorial: initGameTutorial,
            getAllPlayers: getAllPlayers,
            getAllTeams: getAllTeams,
            getOverallStatistics: getOverallStatistics,
            getGameSettings: getGameSettings,
            getDefaultGameSettings: getDefaultGameSettings,
            getAppSettings: getAppSettings,
            getGameTutorial: getGameTutorial,
            updatePlayerStatistics: updatePlayerStatistics,
            updateOverallStatistics: updateOverallStatistics,
            updateGameSettings: updateGameSettings,
            updateAppSettings: updateAppSettings,
            updateGameTutorial: updateGameTutorial,
            updatePlayerProfile: updatePlayerProfile,
            addPlayer: addPlayer,
            removePlayer: removePlayer,
            addTeam: addTeam,
            removeTeam: removeTeam
        };
        return service;

        ////////////////

        function initBrowserDev() {
            players = [
                {
                    id: 0,
                    firstName: 'John',
                    lastName: 'Doe',
                    tagline: 'Look at my tagline',
                    face: 'img/dummy-man.jpg',
                    statistics: getDefaultStatistics()
                },
                {
                    id: 1,
                    firstName: 'Jane',
                    lastName: 'Doe',
                    tagline: 'Hey, it\'s me!',
                    face: 'img/dummy-woman.jpg',
                    statistics: getDefaultStatistics()
                },
                {
                    id: 2,
                    firstName: 'Adam',
                    lastName: 'McCarthy',
                    tagline: 'I should buy a boat',
                    face: 'img/perry.png',
                    statistics: getDefaultStatistics()
                },
                {
                    id: 3,
                    firstName: 'Ben',
                    lastName: 'Dillon',
                    tagline: 'Molkky is fun!',
                    face: '',
                    statistics: getDefaultStatistics()
                }
            ];
            teams = [
                {
                    id: 0,
                    name: 'De Bosklappers',
                    players: [
                       players[0],
                       players[1],
                       players[3]
                    ],
                    statistics: getDefaultStatistics()
                }
            ];
            overallStatistics = {
                totalGamesPlayed: 89
            };
            gameSettings = {
                isCustom: false,
                winningScore: 50,
                winningScoreExceeded: 'half of winning score',
                threeMisses: 'disqualified'
            };
            appSettings = {
                language: 'english'
            };
            gameTutorial = {
                showInvite: true
            };

            function getDefaultStatistics() {
                return {
                    rawData: {
                        throws: 148,
                        throwsSinglePin: 126,
                        throwsInGamesReachedMaxScore: 89,
                        gamesPlayed: 64,
                        gamesReachedMaxScore: 51,
                        gamesWon: 41
                    },
                    metrics: {
                        totalWins: 41,
                        versatility: 78,
                        winningRatio: 86,
                        accuracy: 58,
                        efficiency: 74
                    }
                };
            }
        }

        function initDatabase() { // called from app.config.js
            if (!window.cordova) {
                return;
            }

            database = $cordovaSQLite.openDB({
                name: 'number-kubb-score.db', location: 'default'
            });

            // $cordovaSQLite.deleteDB({
            //     name: 'number-kubb-score.db', location: 'default'
            // }, function(res) {
            //     console.log('deleted');
            // }, function(err) {
            //     console.log(err.message);
            // });

            return initDatabaseTables(database);
        }

        function initPlayers() {
            var selectAllPlayersQuery = 'SELECT * FROM PLAYERS';
            return $cordovaSQLite.execute(database, selectAllPlayersQuery).then(function(res) {
                for (var i = 0; i < res.rows.length; i++) {
                    var row = res.rows.item(i);
                    players.push({
                        id: row.ID,
                        firstName: row.FIRSTNAME,
                        lastName: row.LASTNAME,
                        tagline: row.TAGLINE,
                        face: row.FACE,
                        statistics: {}
                    });
                }
                return players;
            });
        }

        function initTeams(players) {
            var selectAllTeamsQuery = 'SELECT * FROM TEAMS';
            return $cordovaSQLite.execute(database, selectAllTeamsQuery).then(function(res) {
                for (var i = 0; i < res.rows.length; i++) {
                    var row = res.rows.item(i);
                    var teamPlayers = row.PLAYER_IDS.split('/').map(function(playerId) {
                        return players.filter(function(player) {
                            return player.id === parseInt(playerId, 10);
                        })[0];
                    });
                    teams.push({
                        id: row.ID,
                        name: row.NAME,
                        players: teamPlayers,
                        statistics: {}
                    });
                }
                return teams;
            });
        }

        function initPlayerStatistics(player) {
            var statistics = {};
            var selectRawDataQuery = 'SELECT * FROM STATISTICS_PLAYER_RAW_DATA WHERE PLAYER_ID=' +
                                        player.id + ' LIMIT 1';
            var selectMetricsQuery = 'SELECT * FROM STATISTICS_PLAYER_METRICS WHERE PLAYER_ID=' +
                                        player.id + ' LIMIT 1';
            return $q.all([
                $cordovaSQLite.execute(database, selectRawDataQuery),
                $cordovaSQLite.execute(database, selectMetricsQuery)
            ]).then(function(res) {
                statistics.rawData = {
                    throws: res[0].rows.item(0).THROWS,
                    throwsSinglePin: res[0].rows.item(0).THROWS_SINGLE_PIN,
                    throwsInGamesReachedMaxScore: res[0].rows.item(0).THROWS_IN_GAMES_REACHED_MAX_SCORE,
                    gamesPlayed: res[0].rows.item(0).GAMES_PLAYED,
                    gamesReachedMaxScore: res[0].rows.item(0).GAMES_REACHED_MAX_SCORE,
                    gamesWon: res[0].rows.item(0).GAMES_WON
                };
                statistics.metrics = {
                    totalWins: res[1].rows.item(0).TOTAL_WINS,
                    versatility: res[1].rows.item(0).VERSATILITY,
                    winningRatio: res[1].rows.item(0).WINNING_RATIO,
                    accuracy: res[1].rows.item(0).ACCURACY,
                    efficiency: res[1].rows.item(0).EFFICIENCY
                };
                player.statistics = statistics;

                return statistics;
            });
        }

        function initTeamStatistics(team) {
            var statistics = {};
            var selectRawDataQuery = 'SELECT * FROM STATISTICS_TEAM_RAW_DATA WHERE TEAM_ID=' +
                                        team.id + ' LIMIT 1';
            var selectMetricsQuery = 'SELECT * FROM STATISTICS_TEAM_METRICS WHERE TEAM_ID=' +
                                        team.id + ' LIMIT 1';
            return $q.all([
                $cordovaSQLite.execute(database, selectRawDataQuery),
                $cordovaSQLite.execute(database, selectMetricsQuery)
            ]).then(function(res) {
                statistics.rawData = {
                    throws: res[0].rows.item(0).THROWS,
                    throwsSinglePin: res[0].rows.item(0).THROWS_SINGLE_PIN,
                    throwsInGamesReachedMaxScore: res[0].rows.item(0).THROWS_IN_GAMES_REACHED_MAX_SCORE,
                    gamesPlayed: res[0].rows.item(0).GAMES_PLAYED,
                    gamesReachedMaxScore: res[0].rows.item(0).GAMES_REACHED_MAX_SCORE,
                    gamesWon: res[0].rows.item(0).GAMES_WON
                };
                statistics.metrics = {
                    totalWins: res[1].rows.item(0).TOTAL_WINS,
                    versatility: res[1].rows.item(0).VERSATILITY,
                    winningRatio: res[1].rows.item(0).WINNING_RATIO,
                    accuracy: res[1].rows.item(0).ACCURACY,
                    efficiency: res[1].rows.item(0).EFFICIENCY
                };
                team.statistics = statistics;

                return statistics;
            });
        }

        function initOverallStatistics() {
            var selectOverallStatisticsQuery = 'SELECT * FROM STATISTICS_OVERALL_METRICS' + ' LIMIT 1';
            return $cordovaSQLite.execute(database, selectOverallStatisticsQuery).then(function(res) {
                if (res.rows.length) {
                    overallStatistics.totalGamesPlayed = res.rows.item(0).TOTAL_GAMES_PLAYED;
                    return overallStatistics;
                }
                else {
                    return;
                }
            }, function (err) {
                console.error(err.message);
            });
        }

        function initGameSettings() {
            var selectGameSettingsQuery = 'SELECT * FROM GAME_SETTINGS' + ' LIMIT 1';
            return $cordovaSQLite.execute(database, selectGameSettingsQuery).then(function(res) {
                if (res.rows.length) {
                    gameSettings.isCustom = res.rows.item(0).IS_CUSTOM === 1 ? true : false;
                    gameSettings.winningScore = res.rows.item(0).WINNING_SCORE;
                    gameSettings.winningScoreExceeded = res.rows.item(0).WINNING_SCORE_EXCEEDED;
                    gameSettings.threeMisses = res.rows.item(0).THREE_MISSES;
                    return gameSettings;
                }
                else {
                    return;
                }
            }, function (err) {
                console.error(err.message);
            });
        }

        function initAppSettings() {
            var selectAppSettingsQuery = 'SELECT * FROM APP_SETTINGS' + ' LIMIT 1';
            return $cordovaSQLite.execute(database, selectAppSettingsQuery).then(function(res) {
                if (res.rows.length) {
                    appSettings.language = res.rows.item(0).LANGUAGE;
                    return appSettings;
                }
                else {
                    return;
                }
            }, function (err) {
                console.error(err.message);
            });
        }

        function initGameTutorial() {
            var selectGameTutorialQuery = 'SELECT * FROM GAME_TUTORIAL' + ' LIMIT 1';
            return $cordovaSQLite.execute(database, selectGameTutorialQuery).then(function(res) {
                if (res.rows.length) {
                    gameTutorial.showInvite = res.rows.item(0).SHOW_INVITE === 1 ? true : false;
                    return gameTutorial;
                }
                else {
                    return;
                }
            }, function (err) {
                console.error(err.message);
            });
        }

        function getAllPlayers() {
            return players;
        }

        function getAllTeams() {
            return teams;
        }

        function getOverallStatistics() {
            return overallStatistics;
        }

        function getGameSettings() {
            return gameSettings;
        }

        function getDefaultGameSettings() {
            return {
                winningScore: 50,
                winningScoreExceeded: 'half of winning score',
                threeMisses: 'disqualified'
            };
        }

        function getAppSettings() {
            return appSettings;
        }

        function getGameTutorial() {
            return gameTutorial;
        }

        function updatePlayerStatistics(player) {
            if (!window.cordova) {
                return;
            }

            updateRawData(player);
            updateMetrics(player);
        }

        function updateOverallStatistics() {
            if (!window.cordova) {
                return;
            }

            var totalGamesPlayed = overallStatistics.totalGamesPlayed;
            var updateOverallStatistics = 'UPDATE STATISTICS_OVERALL_METRICS SET' +
                                            ' TOTAL_GAMES_PLAYED=' + totalGamesPlayed;
            $cordovaSQLite.execute(database, updateOverallStatistics).then(function(res) {
                // overall statistics updated
            }, function (err) {
                console.error(err.message);
            });
        }

        function updateGameSettings() {
            if (!window.cordova) {
                return;
            }

            var isCustom = gameSettings.isCustom ? 1 : 0;
            var winningScore = gameSettings.winningScore;
            var winningScoreExceeded = gameSettings.winningScoreExceeded;
            var threeMisses = gameSettings.threeMisses;
            var updateGameSettings = 'UPDATE GAME_SETTINGS SET' +
                                        ' IS_CUSTOM=' + isCustom + ',' +
                                        ' WINNING_SCORE=' + winningScore + ',' +
                                        ' WINNING_SCORE_EXCEEDED="' + winningScoreExceeded + '",' +
                                        ' THREE_MISSES="' + threeMisses + '"';
            $cordovaSQLite.execute(database, updateGameSettings).then(function(res) {
                // overall statistics updated
            }, function (err) {
                console.error(err.message);
            });
        }

        function updateAppSettings() {
            if (!window.cordova) {
                return;
            }

            var language = appSettings.language;
            var updateGameSettings = 'UPDATE APP_SETTINGS SET' +
                                        ' LANGUAGE="' + language + '"';
            $cordovaSQLite.execute(database, updateGameSettings).then(function(res) {
                // app settings updated
            }, function (err) {
                console.error(err.message);
            });
        }

        function updateGameTutorial() {
            if (!window.cordova) {
                return;
            }

            var showInvite = gameTutorial.showInvite ? 1 : 0;
            var updateGameTutorial = 'UPDATE GAME_TUTORIAL SET' +
                                        ' SHOW_INVITE="' + showInvite + '"';
            $cordovaSQLite.execute(database, updateGameTutorial).then(function(res) {
                // game tutorial updated
            }, function (err) {
                console.error(err.message);
            });
        }

        function updatePlayerProfile(player) {
            if (!window.cordova) {
                return;
            }

            var updatePlayer = 'UPDATE PLAYERS SET' +
                                ' FIRSTNAME="' + player.firstName + '",' +
                                ' LASTNAME="' + player.lastName + '",' +
                                ' TAGLINE="' + player.tagline + '",' +
                                ' FACE="' + player.face + '"' +
                                ' WHERE ID=' + player.id;
            $cordovaSQLite.execute(database, updatePlayer).then(function(res) {
                // player updated
            }, function (err) {
                console.error(err.message);
            });
        }

        function addPlayer(player) {
            if (!window.cordova) {
                return;
            }

            var playerValues = [
                player.id,
                player.firstName,
                player.lastName,
                player.tagline,
                player.face
            ];
            var addPlayer = 'INSERT INTO PLAYERS (ID, FIRSTNAME, LASTNAME,' +
                ' TAGLINE, FACE) VALUES (?,?,?,?,?)';
            $cordovaSQLite.execute(database, addPlayer, playerValues);

            introPlayerStatistics(player);
        }

        function removePlayer(player) {
            if (!window.cordova) {
                return;
            }

            var deletePlayer = 'DELETE FROM PLAYERS WHERE ID=' + player.id;
            var deletePlayerRawData = 'DELETE FROM STATISTICS_PLAYER_RAW_DATA WHERE PLAYER_ID=' + player.id;
            var deletePlayerMetrics = 'DELETE FROM STATISTICS_PLAYER_METRICS WHERE PLAYER_ID=' + player.id;
            $cordovaSQLite.execute(database, deletePlayer);
            $cordovaSQLite.execute(database, deletePlayerRawData);
            $cordovaSQLite.execute(database, deletePlayerMetrics);
        }

        function addTeam(team) {
            if (!window.cordova) {
                return;
            }

            var playerIds = team.players.map(function(player) {
                return player.id;
            }).join('/');

            var teamValues = [
                team.id,
                team.name,
                playerIds
            ];
            var addTeam = 'INSERT INTO TEAMS (ID, NAME, PLAYER_IDS)' +
                ' VALUES (?,?,?)';
            $cordovaSQLite.execute(database, addTeam, teamValues);

            introTeamStatistics(team);
        }

        function removeTeam(team) {
            if (!window.cordova) {
                return;
            }

            var deleteTeam = 'DELETE FROM TEAMS WHERE ID=' + team.id;
            var deleteTeamRawData = 'DELETE FROM STATISTICS_TEAM_RAW_DATA WHERE TEAM_ID=' + team.id;
            var deleteTeamMetrics = 'DELETE FROM STATISTICS_TEAM_METRICS WHERE TEAM_ID=' + team.id;
            $cordovaSQLite.execute(database, deleteTeam);
            $cordovaSQLite.execute(database, deleteTeamRawData);
            $cordovaSQLite.execute(database, deleteTeamMetrics);
        }

        /*  Helper functions
            ======================================================================================== */
        function initDatabaseTables(database) {
            var addPlayersTable = 'CREATE TABLE IF NOT EXISTS PLAYERS' +
                ' (ID integer, FIRSTNAME text, LASTNAME text, TAGLINE text,' +
                ' FACE text)';
            var addTeamsTable = 'CREATE TABLE IF NOT EXISTS TEAMS' +
                ' (ID integer, NAME text, PLAYER_IDS text)';
            var addStatisticsPlayerRawDataTable = 'CREATE TABLE IF NOT EXISTS STATISTICS_PLAYER_RAW_DATA' +
                ' (PLAYER_ID integer, THROWS integer, THROWS_SINGLE_PIN integer,' +
                ' THROWS_IN_GAMES_REACHED_MAX_SCORE integer, GAMES_PLAYED integer,' +
                ' GAMES_REACHED_MAX_SCORE integer, GAMES_WON integer)';
            var addStatisticsPlayerMetricsTable = 'CREATE TABLE IF NOT EXISTS' +
                ' STATISTICS_PLAYER_METRICS (PLAYER_ID integer, TOTAL_WINS integer,' +
                ' VERSATILITY decimal(5,4), WINNING_RATIO decimal(5,4), ACCURACY decimal(5,4),' +
                ' EFFICIENCY decimal(5,4))';
            var addStatisticsTeamRawDataTable = 'CREATE TABLE IF NOT EXISTS STATISTICS_TEAM_RAW_DATA' +
                ' (TEAM_ID integer, THROWS integer, THROWS_SINGLE_PIN integer,' +
                ' THROWS_IN_GAMES_REACHED_MAX_SCORE integer, GAMES_PLAYED integer,' +
                ' GAMES_REACHED_MAX_SCORE integer, GAMES_WON integer)';
            var addStatisticsTeamMetricsTable = 'CREATE TABLE IF NOT EXISTS' +
                ' STATISTICS_TEAM_METRICS (TEAM_ID integer, TOTAL_WINS integer,' +
                ' VERSATILITY decimal(5,4), WINNING_RATIO decimal(5,4), ACCURACY decimal(5,4),' +
                ' EFFICIENCY decimal(5,4))';
            var addStatisticsOverallMetricsTable = 'CREATE TABLE IF NOT EXISTS STATISTICS_OVERALL_METRICS' +
                ' (TOTAL_GAMES_PLAYED integer)';
            var addGameSettingsTable = 'CREATE TABLE IF NOT EXISTS GAME_SETTINGS' +
                ' (IS_CUSTOM tinyint(1), WINNING_SCORE integer,' +
                ' WINNING_SCORE_EXCEEDED text, THREE_MISSES text)';
            var addAppSettingsTable = 'CREATE TABLE IF NOT EXISTS APP_SETTINGS' +
                ' (LANGUAGE text)';
            var addGameTutorialTable = 'CREATE TABLE IF NOT EXISTS GAME_TUTORIAL' +
                ' (SHOW_INVITE tinyint(1))';

            // Init players & their statistics
            return $q.all([
                $cordovaSQLite.execute(database, addPlayersTable),
                $cordovaSQLite.execute(database, addTeamsTable),
                $cordovaSQLite.execute(database, addStatisticsPlayerRawDataTable),
                $cordovaSQLite.execute(database, addStatisticsPlayerMetricsTable),
                $cordovaSQLite.execute(database, addStatisticsTeamRawDataTable),
                $cordovaSQLite.execute(database, addStatisticsTeamMetricsTable),
                $cordovaSQLite.execute(database, addStatisticsOverallMetricsTable),
                $cordovaSQLite.execute(database, addGameSettingsTable),
                $cordovaSQLite.execute(database, addAppSettingsTable),
                $cordovaSQLite.execute(database, addGameTutorialTable)
            ]).then(function(results) {
                return initOverallStatistics().then(function(overallStatistics) {
                    if (!overallStatistics) { // first time user
                        return $q.all([
                            introPlayers(),
                            introOverallStatistics(),
                            introGameSettings(),
                            introAppSettings(),
                            introGameTutorial()
                        ]);
                    }
                });
            });
        }

        function updateRawData(player) {
            var rawData = player.statistics.rawData;
            var updateRawData = 'UPDATE STATISTICS_PLAYER_RAW_DATA SET' +
                                    ' THROWS=' + rawData.throws + ',' +
                                    ' THROWS_SINGLE_PIN=' + rawData.throwsSinglePin + ',' +
                                    ' THROWS_IN_GAMES_REACHED_MAX_SCORE=' + rawData.throwsInGamesReachedMaxScore + ',' +
                                    ' GAMES_PLAYED=' + rawData.gamesPlayed + ',' +
                                    ' GAMES_REACHED_MAX_SCORE=' + rawData.gamesReachedMaxScore + ',' +
                                    ' GAMES_WON=' + rawData.gamesWon +
                                    ' WHERE PLAYER_ID=' + player.id;
            $cordovaSQLite.execute(database, updateRawData).then(function(res) {
                // raw data updated
            }, function (err) {
                console.error(err.message);
            });
        }

        function updateMetrics(player) {
            var metrics = player.statistics.metrics;
            var updateMetrics = 'UPDATE STATISTICS_PLAYER_METRICS SET' +
                                    ' TOTAL_WINS=' + metrics.totalWins + ',' +
                                    ' VERSATILITY=' + metrics.versatility + ',' +
                                    ' WINNING_RATIO=' + metrics.winningRatio + ',' +
                                    ' ACCURACY=' + metrics.accuracy + ',' +
                                    ' EFFICIENCY=' + metrics.efficiency +
                                    ' WHERE PLAYER_ID=' + player.id;
            $cordovaSQLite.execute(database, updateMetrics).then(function(res) {
                // raw data updated
            }, function (err) {
                console.error(err.message);
            });
        }

        /*  Functions for populating database for first time app users
            ======================================================================================== */
        function introPlayers() {
            var playerOneValues = ['1', 'John', 'Doe', 'Look at my tagline', 'img/dummy-man.jpg'];
            var playerTwoValues = ['2', 'Jane', 'Doe', 'Hey, it\'s me!', 'img/dummy-woman.jpg'];
            var insertPlayers = 'INSERT INTO PLAYERS (ID, FIRSTNAME, LASTNAME,' +
                ' TAGLINE, FACE) VALUES (?,?,?,?,?)';
            return $q.all([
                $cordovaSQLite.execute(database, insertPlayers, playerOneValues),
                $cordovaSQLite.execute(database, insertPlayers, playerTwoValues)
            ]).then(function(results) {
                return fetchAllPlayersFromDB().then(function(players) {
                    var promises = [];
                    players.forEach(function(player) {
                        promises.push(introPlayerStatistics(player));
                    });

                    return $q.all(promises);
                });
            });
        }

        function introPlayerStatistics(player) {
            var insertRawData = 'INSERT INTO STATISTICS_PLAYER_RAW_DATA (PLAYER_ID, THROWS,' +
                ' THROWS_SINGLE_PIN, THROWS_IN_GAMES_REACHED_MAX_SCORE, GAMES_PLAYED,' +
                ' GAMES_REACHED_MAX_SCORE, GAMES_WON) VALUES (?,?,?,?,?,?,?)';
            var insertMetrics = 'INSERT INTO STATISTICS_PLAYER_METRICS (PLAYER_ID, TOTAL_WINS,' +
                ' VERSATILITY, WINNING_RATIO, ACCURACY, EFFICIENCY) VALUES (?,?,?,?,?,?)';

            return $q.all([
                $cordovaSQLite.execute(database, insertRawData, [player.id, 0, 0, 0, 0, 0, 0]),
                $cordovaSQLite.execute(database, insertMetrics, [player.id, 0, 0, 0, 0, 0])
            ]);
        }

        function introTeamStatistics(team) {
            var insertRawData = 'INSERT INTO STATISTICS_TEAM_RAW_DATA (TEAM_ID, THROWS,' +
                ' THROWS_SINGLE_PIN, THROWS_IN_GAMES_REACHED_MAX_SCORE, GAMES_PLAYED,' +
                ' GAMES_REACHED_MAX_SCORE, GAMES_WON) VALUES (?,?,?,?,?,?,?)';
            var insertMetrics = 'INSERT INTO STATISTICS_TEAM_METRICS (TEAM_ID, TOTAL_WINS,' +
                ' VERSATILITY, WINNING_RATIO, ACCURACY, EFFICIENCY) VALUES (?,?,?,?,?,?)';

            return $q.all([
                $cordovaSQLite.execute(database, insertRawData, [team.id, 0, 0, 0, 0, 0, 0]),
                $cordovaSQLite.execute(database, insertMetrics, [team.id, 0, 0, 0, 0, 0])
            ]);
        }

        function introOverallStatistics() {
            var insertOverallStatistics = 'INSERT INTO STATISTICS_OVERALL_METRICS (TOTAL_GAMES_PLAYED) VALUES (?)';

            return $cordovaSQLite.execute(database, insertOverallStatistics, [0]);
        }

        function introGameSettings() {
            var defaultSettings = getDefaultGameSettings();
            var winningScore = defaultSettings.winningScore;
            var winningScoreExceeded = defaultSettings.winningScoreExceeded;
            var threeMisses = defaultSettings.threeMisses;

            var values = [0, winningScore, winningScoreExceeded, threeMisses];
            var insertGameSettings = 'INSERT INTO GAME_SETTINGS (IS_CUSTOM, WINNING_SCORE,' +
                ' WINNING_SCORE_EXCEEDED, THREE_MISSES) VALUES (?,?,?,?)';

            return $cordovaSQLite.execute(database, insertGameSettings, values);
        }

        function introAppSettings() {
            var values = ['english'];
            var insertAppSettings = 'INSERT INTO APP_SETTINGS (LANGUAGE) VALUES (?)';

            return $cordovaSQLite.execute(database, insertAppSettings, values);
        }

        function introGameTutorial() {
            var values = [1];
            var insertGameTutorial = 'INSERT INTO GAME_TUTORIAL (SHOW_INVITE) VALUES (?)';

            return $cordovaSQLite.execute(database, insertGameTutorial, values);
        }

        function fetchAllPlayersFromDB() {
            var fetchedPlayers = [];
            var selectAllPlayersQuery = 'SELECT * FROM PLAYERS';

            return $cordovaSQLite.execute(database, selectAllPlayersQuery).then(function(res) {
                for (var i = 0; i < res.rows.length; i++) {
                    var row = res.rows.item(i);
                    fetchedPlayers.push({
                        id: row.ID,
                        firstName: row.FIRSTNAME,
                        lastName: row.LASTNAME,
                        tagline: row.TAGLINE,
                        face: row.FACE,
                        statistics: {}
                    });
                }
                return fetchedPlayers;
            });
        }
    }
})();
