(function() {
    'use strict';

    angular
        .module('molkkyscore')
        .factory('statisticsService', statisticsService);

    statisticsService.$inject = [];

    function statisticsService() {
        var metrics = [
            {
                id: 0,
                propertyName: 'hallOfFame'
            },
            {
                id: 1,
                propertyName: 'effectiveness'
            },
            {
                id: 2,
                propertyName: 'accuracy'
            }
        ];

        var service = {
            getMetrics: getMetrics,
            getMetric: getMetric
        };
        return service;

        ////////////////

        function getMetrics() {
            return metrics;
        }

        function getMetric(metricId) {
            return _.findWhere(metrics, {id: metricId});
        }
    }
})();
