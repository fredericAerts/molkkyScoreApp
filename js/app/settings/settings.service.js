(function() {
    'use strict';

    angular
        .module('molkkyscore')
        .factory('settingsService', settingsService);

    settingsService.$inject = ['$translate'];

    function settingsService($translate) {
        var languageOptions = [
            {
                value: 'English',
                key: 'english'
            },
            {
                value: 'Français',
                key: 'french'
            },
            {
                value: 'Finnish',
                key: 'finnish'
            }
        ];
        var gameCustomSetting = false;

        var winningScoreOptions = [
            {
                value: 25,
                active: false
            },
            {
                value: 50,
                active: true
            },
            {
                value: 100,
                active: false
            }
        ];

        var winningScoreExceededOptions = [
            {
                value: 'to zero',
                active: true
            },
            {
                value: 'halved',
                active: false
            },
            {
                value: 'half of winning score',
                active: false
            }
        ];

        var threeMissesOptions = [
            {
                value: 'to zero',
                active: false
            },
            {
                value: 'halved',
                active: false
            },
            {
                value: 'disqualified',
                active: true
            }
        ];

        var service = {
            getSettings: getSettings,
            getActiveLanguageKey: getActiveLanguageKey,
            setLanguageKey: setLanguageKey,
            getLanguageOtions: getLanguageOtions,
            isGameCustomSetting: isGameCustomSetting,
            toggleGameCustomSetting: toggleGameCustomSetting,
            getWinningScoreOptions: getWinningScoreOptions,
            setWinningScore: setWinningScore,
            getWinningScoreExceededOptions: getWinningScoreExceededOptions,
            setWinningScoreExceeded: setWinningScoreExceeded,
            getThreeMissesOptions: getThreeMissesOptions,
            setThreeMisses: setThreeMisses
        };
        return service;

        ////////////////

        function getSettings() {
            return {
                winningScore: 25,
                winningScoreExceeded: 'halved',
                threeMisses: 'disqualified'
            };
        }

        function getActiveLanguageKey() {
            return $translate.use();
        }

        function setLanguageKey(languageKey) {
            $translate.use(languageKey); // TODO: write to database
        }

        function getLanguageOtions() {
            return languageOptions;
        }

        function isGameCustomSetting() {
            return gameCustomSetting; // TODO: get from database
        }

        function toggleGameCustomSetting() {
            gameCustomSetting = !gameCustomSetting;
            return gameCustomSetting;
        }

        function getWinningScoreOptions() {
            return winningScoreOptions;
        }

        function setWinningScore(activeOption) { // TODO: write to database
            winningScoreOptions.map(function(option) {
                option.active = option.value === activeOption;
                return option;
            });
        }

        function getWinningScoreExceededOptions() {
            return winningScoreExceededOptions;
        }

        function setWinningScoreExceeded(activeOption) { // TODO: write to database
            winningScoreExceededOptions.map(function(option) {
                option.active = option.value === activeOption;
                return option;
            });
        }

        function getThreeMissesOptions() {
            return threeMissesOptions;
        }

        function setThreeMisses(activeOption) { // TODO: write to database
            threeMissesOptions.map(function(option) {
                option.active = option.value === activeOption;
                return option;
            });
            console.log(threeMissesOptions);
        }
    }
})();
