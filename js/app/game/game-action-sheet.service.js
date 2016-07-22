(function() {
    'use strict';

    angular
        .module('molkkyscore')
        .factory('gameActionSheetService', gameActionSheetService);

    gameActionSheetService.$inject = ['$ionicActionSheet', '$translate', '$ionicPopup'];

    function gameActionSheetService($ionicActionSheet, $translate, $ionicPopup) {
        var actionSheetData = translateActionSheetData();

        var service = {
            showActionSheet: showActionSheet,
            translateActionSheetData: translateActionSheetData
        };
        return service;

        ////////////////

        function showActionSheet(actions, isGameEnded) {
            // Show the action sheet
            var hideSheet = $ionicActionSheet.show({
                buttons: [
                    {text: $translate.instant('HOME.GAME.ACTION-SHEET.RESTART.BUTTON')},
                    {text: $translate.instant('HOME.GAME.ACTION-SHEET.NEW.BUTTON')},
                    {text: $translate.instant('HOME.GAME.ACTION-SHEET.UNDO.BUTTON')},
                    {text: $translate.instant('HOME.GAME.ACTION-SHEET.EXIT.BUTTON')},
                ],
                titleText: $translate.instant('HOME.GAME.ACTION-SHEET.TITLE'),
                cancelText: $translate.instant('HOME.GAME.ACTION-SHEET.CONTINUE.BUTTON'),
                cancel: function() {
                    // add cancel code..
                },
                buttonClicked: function(index) {
                    switch (index) {
                        case 0: showRestartPopup(actions.restart, isGameEnded); break; // restart game
                        case 1: showNewPopup(actions.new); break; // new game
                        case 2: actions.undo(); break; // undo last
                        case 3: showExitPopup(actions.exit, isGameEnded); break; // exit game
                    }
                    return true;
                }
            });
        }

        function translateActionSheetData() {
            actionSheetData = {
                restartConfirm: {
                    title: $translate.instant('HOME.GAME.ACTION-SHEET.RESTART.CONFIRM.TITLE'),
                    text: $translate.instant('HOME.GAME.ACTION-SHEET.RESTART.CONFIRM.TEXT')
                },
                newConfirm: {
                    title: $translate.instant('HOME.GAME.ACTION-SHEET.NEW.CONFIRM.TITLE'),
                    text: $translate.instant('HOME.GAME.ACTION-SHEET.NEW.CONFIRM.TEXT')
                },
                exitConfirm: {
                    title: $translate.instant('HOME.GAME.ACTION-SHEET.EXIT.CONFIRM.TITLE'),
                    text: $translate.instant('HOME.GAME.ACTION-SHEET.EXIT.CONFIRM.TEXT')
                }
            };

            return actionSheetData;
        }

        /*  Helper functions
            ======================================================================================== */
        function showRestartPopup(callback, isGameEnded) {
            if (isGameEnded) {
                callback();
            }
            else {
                showPopup(getPopupOptions(), callback);
            }

            function getPopupOptions() {
                var options = {
                    title: actionSheetData.restartConfirm.title,
                    template: actionSheetData.restartConfirm.text,
                    buttons: [
                        {
                            text: $translate.instant('HOME.GENERAL.CONFIRM.CANCEL')
                        },
                        {
                            text: '<b>' + $translate.instant('HOME.GENERAL.CONFIRM.OK') + '</b>',
                            type: 'button-positive',
                            onTap: function(event) {
                                return true;
                            }
                        }
                    ]
                };

                return options;
            }
        }

        function showNewPopup(callback) {
            showPopup(getPopupOptions(), callback);

            function getPopupOptions() {
                var options = {
                    title: actionSheetData.newConfirm.title,
                    template: actionSheetData.newConfirm.text,
                    cssClass: 'three-btn',
                    buttons: [
                        {
                            text: $translate.instant('HOME.GENERAL.CONFIRM.CANCEL')
                        },
                        {
                            text: '<b>' + $translate.instant('HOME.GENERAL.CONFIRM.NO') + '</b>',
                            type: 'button-positive',
                            onTap: function(event) {
                                callback(true); // new players
                                return false;
                            }
                        },
                        {
                            text: '<b>' + $translate.instant('HOME.GENERAL.CONFIRM.YES') + '</b>',
                            type: 'button-positive',
                            onTap: function(event) {
                                callback(false); // same players
                                return false;
                            }
                        }
                    ]
                };

                return options;
            }
        }

        function showExitPopup(callback, isGameEnded) {
            if (isGameEnded) {
                callback();
            }
            else {
                showPopup(getPopupOptions(), callback);
            }

            function getPopupOptions() {
                var options = {
                    title: actionSheetData.exitConfirm.title,
                    template: actionSheetData.exitConfirm.text,
                    buttons: [
                        {
                            text: $translate.instant('HOME.GENERAL.CONFIRM.CANCEL')
                        },
                        {
                            text: '<b>' + $translate.instant('HOME.GENERAL.CONFIRM.OK') + '</b>',
                            type: 'button-positive',
                            onTap: function(event) {
                                return true;
                            }
                        }
                    ]
                };

                return options;
            }
        }

        function showPopup(popupOptions, callback) {
            $ionicPopup.show(popupOptions)
            .then(function(confirmed) {
                if (confirmed) {
                    callback();
                }
            });
        }
    }
})();
