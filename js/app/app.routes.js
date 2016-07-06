(function() {
    angular
        .module('molkkyscore')
        .config(router);

    router.$inject = ['TEMPLATES_ROOT', '$stateProvider', '$urlRouterProvider'];

    function router(TEMPLATES_ROOT, $stateProvider, $urlRouterProvider) {

        // Ionic uses AngularUI Router which uses the concept of states
        // Learn more here: https://github.com/angular-ui/ui-router
        // Set up the various states which the app can be in.
        // Each state's controller can be found in controllers.js
        $stateProvider

            // setup an abstract state for the tabs directive
            .state('tab', {
                url: '/tab',
                abstract: true,
                templateUrl: TEMPLATES_ROOT + '/layout/tabs.html'
            })

            // Each tab has its own nav history stack:

            .state('tab.home', {
                url: '/home',
                views: {
                    'home': {
                        templateUrl: TEMPLATES_ROOT + '/home/home.html',
                        controller: 'HomeCtrl as home'
                    }
                }
            })

            .state('tab.hallOfFame', {
                url: '/hall-of-fame',
                views: {
                    'hall-of-fame': {
                        templateUrl: TEMPLATES_ROOT + '/hall-of-fame/hall-of-fame.html',
                        controller: 'HallOfFameCtrl as hallOfFame'
                    }
                }
            })
            .state('tab.players', {
                url: '/players',
                views: {
                    'players': {
                        templateUrl: TEMPLATES_ROOT + '/players/players.html',
                        controller: 'PlayersCtrl as players'
                    }
                }
            })
            .state('tab.player-detail', {
                url: '/players/:playerId',
                views: {
                    'players': {
                        templateUrl: TEMPLATES_ROOT + '/players/player-detail.html',
                        controller: 'PlayerDetailCtrl as playerDetail'
                    }
                }
            });

        // if none of the above states are matched, use this as the fallback
        $urlRouterProvider.otherwise('/tab/home');
    }
})();
