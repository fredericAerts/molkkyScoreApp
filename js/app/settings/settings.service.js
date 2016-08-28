(function() {
    'use strict';

    angular
        .module('molkkyscore')
        .factory('settingsService', settingsService);

    settingsService.$inject = ['$translate'];

    function settingsService($translate) {
        var service = {
            getOptions: getOptions,
            isCustomSetting: isCustomSetting,
            getParameters: getParameters
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

        function isCustomSetting() {
            return false; // TODO: get from database
        }

        function getParameters() {
            return {
                app: {
                    language: $translate.use()
                },
                game: {
                    winningScore: 50,
                    winningScoreExceeded: 'halved',
                    threeMisses: 'disqualified'
                }
            };
        }
    }
})();
