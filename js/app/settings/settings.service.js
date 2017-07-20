(function() {
    'use strict';

    angular
        .module('molkkyscore')
        .factory('settingsService', settingsService);

    settingsService.$inject = ['$translate', 'dataService', 'gameService'];

    function settingsService($translate, dataService, gameService) {
        var parameters = {};

        var service = {
            getOptions: getOptions,
            getParameters: getParameters,
            updateGameParameter: updateGameParameter,
            updateAppParameter: updateAppParameter,
            updateAppParameterTutorialInvite: updateAppParameterTutorialInvite,
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
                parameters.app.showTutorialInvite =  dataService.getGameTutorial().showInvite;
                parameters.game = dataService.getGameSettings();
            }

            return parameters;
        }

        function updateAppParameter(key, value) {
            parameters.app[key] = value;

            switch (key) {
                case 'language': $translate.use(value); break;
                case 'showTutorialInvite': updateTutorialInvite(value); break;
            }

            if (key !== 'showTutorialInvite') {
                dataService.updateAppSettings();
            }
        }

        function updateAppParameterTutorialInvite(showInvite) {
            parameters.app.showTutorialInvite = showInvite;
        }

        function updateGameParameter() {
            dataService.updateGameSettings();
        }

        function assignDefaultGameParameters(settings) {
            _.extendOwn(settings, dataService.getDefaultGameSettings());
        }

        /*  Helper Functions
            ====================================================================== */
        function updateTutorialInvite(showInvite) {
            gameService.getTutorial().showInvite = showInvite;
            gameService.updateTutorial();
        }
    }
})();
