(function() {
    'use strict';

    angular
        .module('molkkyscore')
        .factory('tutorialService', tutorialService);

    tutorialService.$inject = ['dataService', 'TEMPLATES_ROOT', '$ionicPopover', '$timeout'];

    function tutorialService(dataService, TEMPLATES_ROOT, $ionicPopover,  $timeout) {
        var popoverObject = {};
        var popoverScope = {};

        var service = {
            startTutorial: startTutorial,
            proceedTutorial: proceedTutorial
        };
        return service;

        ////////////////

        function startTutorial(newScope) {
            popoverScope = newScope;

            $ionicPopover.fromTemplateUrl(TEMPLATES_ROOT + '/tutorial/popover.html', {
                scope: popoverScope
            }).then(function(popover) {
                popoverObject = popover;
                triggerProceed(1);
            });

            /*  ==================================================================
                - popover template should reference 'viewModel' as its scope
                ================================================================== */
            popoverScope.viewModel = {
                progressStep: 0,
                progressSteps: 5,
                triggerProceed: triggerProceed
            };

            function triggerProceed(step) {
                var targetElement = getTargetElement(step);
                $timeout(function() {
                    targetElement.triggerHandler('click');
                });
            }
        }

        function proceedTutorial($event) {
            // TODO: trigger from all target clickhandlers in game controller
            var preventDefault = false;
            popoverScope.viewModel.progressStep++;

            return popoverObject.hide().then(function() {
                popoverScope.viewModel.titleTranslationId = 'HOME.TUTORIAL.INFO-POPOVER.STEP-' + popoverScope.viewModel.progressStep +'.TITLE'
                popoverScope.viewModel.textTranslationId = 'HOME.TUTORIAL.INFO-POPOVER.STEP-' + popoverScope.viewModel.progressStep + '.TEXT'

                // switch (popoverScope.viewModel.progressStep) {
                //     case 2: preventDefault = step2(); break;
                //     case 3: preventDefault = step3(); break;
                //     case 4: preventDefault = step4(); break;
                //     case 5: preventDefault = step5(); break;
                // }

                popoverObject.show($event);

                return preventDefault;
            });
        }

        /*  Helper functions
            ======================================================================================== */
        function getTargetElement(step) {
            var targetId = '';
            switch (step) {
                case 1: targetId = 'score-12'; break;
                case 2: targetId = 'score-12'; break;
                case 3: targetId = 'player-cell'; break;
                case 4: targetId = 'scoreboard'; break;
                case 5: targetId = 'settings'; break;
            }

            console.log(targetId);
            return angular.element(document.getElementById(targetId));
        }
    }
})();
