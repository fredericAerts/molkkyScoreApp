(function() {
    'use strict';

    angular
        .module('molkkyscore')
        .factory('settingsService', settingsService);

    settingsService.$inject = ['$translate', 'dataService'];

    function settingsService($translate, dataService) {
        var parameters = {
            app: dataService.getAppSettings(),
            game: dataService.getGameSettings()
        };

        var service = {
            getOptions: getOptions,
            isCustomSetting: isCustomSetting,
            getParameters: getParameters,
            updateGameParameter: updateGameParameter,
            updateAppParameter: updateAppParameter
        };
        return service;

        ////////////////

        function getOptions() {
            return {
                app: {
                    language: [
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
                    ]
                },
                game: {
                    winningScore: [25, 50, 100],
                    winningScoreExceeded: ['to zero', 'halved', 'half of winning score'],
                    threeMisses: ['to zero', 'halved', 'disqualified']
                }
            };
        }

        function isCustomSetting(isCustom) {
            if (isCustom !== undefined) {
                parameters.game.isCustom = isCustom;
            }

            return parameters.game.isCustom; // TODO: get from database
        }

        function getParameters() {
            return parameters;
        }

        function updateAppParameter(key, value) {
            parameters.app[key] = value;

            switch (key) {
                case 'language': $translate.use(value); break;
            }
        }

        function updateGameParameter(key, value) {
            parameters.game[key] = value;
        }
    }
})();
