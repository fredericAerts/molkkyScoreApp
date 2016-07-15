(function() {
    'use strict';

    angular
        .module('molkkyscore')
        .factory('statisticsService', statisticsService);

    statisticsService.$inject = ['$translate', 'TEMPLATES_ROOT'];

    function statisticsService($translate, TEMPLATES_ROOT) {
        var metrics = [{ // 'listingTitle' & 'listingViewTitle' properties are attached later on
                id: 0,
                propertyName: 'hallOfFame',
                infoPopupIncludeTemplate: TEMPLATES_ROOT + '/statistics/info-hall-of-fame.html',
                listingTitle: '', // init via translations
                listingViewTitle: '' // added via translations
            },
            {
                id: 1,
                propertyName: 'effectiveness',
                infoPopupIncludeTemplate: TEMPLATES_ROOT + '/statistics/info-effectiveness.html',
                listingTitle: '', // init via translations
                listingViewTitle: '' // added via translations
            },
            {
                id: 2,
                propertyName: 'accuracy',
                infoPopupIncludeTemplate: TEMPLATES_ROOT + '/statistics/info-accuracy.html',
                listingTitle: '', // init via translations
                listingViewTitle: '' // init via translations
            }
        ];

        var service = {
            getMetrics: getMetrics,
            getMetric: getMetric,
            translateMetricsListingTitles: translateMetricsListingTitles,
            translateMetricsListingViewTitles: translateMetricsListingViewTitles
        };
        return service;

        ////////////////

        function getMetrics() {
            return metrics;
        }

        function getMetric(metricId) {
            return _.findWhere(metrics, {id: metricId});
        }

        function translateMetricsListingTitles() {
            metrics.forEach(function(metric) {
                var translationId = 'HOME.STATISTICS.METRICS.' + metric.propertyName.toUpperCase() + '.TITLE';
                metric.listingTitle = $translate.instant(translationId);
            });
        }

        function translateMetricsListingViewTitles() {
            metrics.forEach(function(metric) {
                var translationId = 'HOME.STATISTICS.METRICS.' + metric.propertyName.toUpperCase() + '.VIEW-TITLE';
                metric.listingViewTitle = $translate.instant(translationId);
            });
        }
    }
})();
