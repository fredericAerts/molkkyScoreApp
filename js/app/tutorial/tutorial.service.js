(function() {
    'use strict';

    angular
        .module('molkkyscore')
        .factory('tutorialService', tutorialService);

    tutorialService.$inject = ['dataService', 'TEMPLATES_ROOT', '$ionicPopover', '$timeout'];

    function tutorialService(dataService, TEMPLATES_ROOT, $ionicPopover,  $timeout) {
        var popoverObject = {};
        var popoverScope = {};
        var totalProgressSteps = 5;
        var tutorialOngoing = false;
        var preventClickHandler = false;

        var service = {
            startTutorial: startTutorial,
            proceedTutorial: proceedTutorial,
            isPreventClickHandler: isPreventClickHandler,
            isTutorialOngoing: isTutorialOngoing
        };
        return service;

        ////////////////

        function startTutorial(newScope) {
            popoverScope = newScope;

            $ionicPopover.fromTemplateUrl(TEMPLATES_ROOT + '/tutorial/popover.html', {
                scope: popoverScope,
                backdropClickToClose: false,
                hardwareBackButtonClose: false
            }).then(function(popover) {
                popoverObject = popover;
                triggerProceed(1);
            });

            /*  ==================================================================
                - popover template should reference 'viewModel' as its scope
                ================================================================== */
            popoverScope.viewModel = {
                progressStep: 0,
                progressSteps: totalProgressSteps,
                triggerProceed: triggerProceed
            };

            function triggerProceed(step) {
                if (step > totalProgressSteps) {
                    popoverScope.$emit('tutorial:finished'); // notify game controller
                    popoverObject.remove();
                    return;
                }

                $timeout(function() {
                    getTargetElement(step).triggerHandler('click');
                });
            }
        }

        function proceedTutorial($event) {
            // TODO: trigger from all target clickhandlers in game controller
            popoverScope.viewModel.progressStep = popoverScope.viewModel.progressStep + 1;

            switch (popoverScope.viewModel.progressStep) {
                case 2: preventClickHandler = false; break; // tap number 2nd time
                case 3: preventClickHandler = true; break; // tap player cell
                case 4: preventClickHandler = true; break; // tap scoreboard
                case 5: preventClickHandler = true; break; // tap settings
            }

            return popoverObject.hide().then(function() {
                popoverScope.viewModel.titleTranslationId = 'HOME.TUTORIAL.INFO-POPOVER.STEP-' + popoverScope.viewModel.progressStep +'.TITLE';
                popoverScope.viewModel.textTranslationId = 'HOME.TUTORIAL.INFO-POPOVER.STEP-' + popoverScope.viewModel.progressStep + '.TEXT';

                popoverObject.show($event);
            });
        }

        function isPreventClickHandler() {
            return preventClickHandler;
        }

        function isTutorialOngoing() {
            if (!popoverObject || _.isEmpty(popoverObject)) {
                return false;
            }

            tutorialOngoing = popoverScope.viewModel.progressStep < totalProgressSteps;
            return tutorialOngoing;
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

            return angular.element(document.getElementById(targetId));
        }
    }
})();
