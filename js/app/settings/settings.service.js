(function() {
    'use strict';

    angular
        .module('molkkyscore')
        .factory('settingsService', settingsService);

    settingsService.$inject = ['$translate', 'dataService'];

    function settingsService($translate, dataService) {
        var parameters = {};

        var service = {
            getOptions: getOptions,
            getParameters: getParameters,
            updateGameParameter: updateAppParameter,
            assignDefaultGameParameters: assignDefaultGameParameters
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

        function getParameters() {
            if (_.isEmpty(parameters)) {
                parameters.app = dataService.getAppSettings();
                parameters.game = dataService.getGameSettings();
            }

            return parameters;
        }

        function updateAppParameter(key, value) {
            parameters.app[key] = value;

            switch (key) {
                case 'language': $translate.use(value); break;
            }

            dataService.updateAppSettings();
        }

        function updateGameParameter() {
            dataService.updateGameSettings();
        }

        function assignDefaultGameParameters(settings) {
            _.extendOwn(settings, dataService.getDefaultGameSettings());
        }
    }
})();
