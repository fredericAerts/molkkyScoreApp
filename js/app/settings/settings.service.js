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

        var service = {
            getActiveLanguageKey: getActiveLanguageKey,
            setLanguageKey: setLanguageKey,
            getLanguageOtions: getLanguageOtions,
            isGameCustomSetting: isGameCustomSetting,
            toggleGameCustomSetting: toggleGameCustomSetting,
            getMaxScoreOptions: getMaxScoreOptions,
            setMaxScore: setMaxScore
        };
        return service;

        ////////////////

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

        function getMaxScoreOptions() {
            return [
                {
                    value: 25,
                    active: false
                },
                {
                    value: 50,
                    active: false
                },
                {
                    value: 100,
                    active: true
                }
            ];
        }

        function setMaxScore(maxScore) {
            // TODO: write to database
        }
    }
})();
