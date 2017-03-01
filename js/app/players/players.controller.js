(function() {
    'use strict';

    angular
        .module('molkkyscore')
        .controller('PlayersCtrl', PlayersCtrl);

    PlayersCtrl.$inject = ['$scope',
                            '$rootScope',
                            'playersService',
                            'statisticsService',
                            'dataService',
                            'TEMPLATES_ROOT',
                            '$ionicPopup',
                            '$ionicModal',
                            '$translate',
                            '$ionicHistory',
                            '$cordovaCamera',
                            'toast'];

    function PlayersCtrl($scope,
                            $rootScope,
                            playersService,
                            statisticsService,
                            dataService,
                            TEMPLATES_ROOT,
                            $ionicPopup,
                            $ionicModal,
                            $translate,
                            $ionicHistory,
                            $cordovaCamera,
                            toast) {
        /* jshint validthis: true */
        var vm = this;
        var addPlayerModalScope = $scope.$new(true);
        var toastMessages = toast.getMessages().players;

        vm.players = playersService.all();
        vm.removeVisible = false;
        vm.showRemoveConfirmPopup = showRemoveConfirmPopup;
        vm.addPlayerModal = {};
        vm.showPlayerModal = showPlayerModal;

        activate();

        ////////////////

        function activate() {
            initAddPlayerModal();
        }

        /*  LISTENERS
            ======================================================================================== */
        $rootScope.$on('$translateChangeSuccess', function () {
            toastMessages = toast.getMessages().players;
        });

        // Cleanup the modal when we're done with it!
        $scope.$on('$destroy', function() {
            vm.addPlayerModal.remove();
        });

        /*  FUNCTIONS
            ======================================================================================== */
        function initAddPlayerModal() {
            addPlayerModalScope.$on('modal.hidden', function() {
                angular.element(document).find('body').removeClass('modal-open');
            });

            $ionicModal.fromTemplateUrl(TEMPLATES_ROOT + '/players/modal-add-player.html', {
                scope: addPlayerModalScope,
                animation: 'slide-in-up'
            })
            .then(function(modal) {
                vm.addPlayerModal = modal;

                /*  ==================================================================
                - modal template should reference 'viewModel' as its scope
                - viewModel data is initialized (reset) each time modal is shown
                ================================================================== */
                addPlayerModalScope.viewModel = {
                    player: {},
                    takePicture: takePicture,
                    removeAvatar: removeAvatar,
                    cancelPlayer: cancelPlayer,
                    confirmPlayer: confirmPlayer

                };
            });
        }

        function showPlayerModal() {
            addPlayerModalScope.viewModel.player = getNewPlayerTemplate();

            vm.addPlayerModal.show();
        }

        function takePicture(fromGallery) {
            if (!window.cordova) {
                return;
            }

            var sourceType = fromGallery ? Camera.PictureSourceType.PHOTOLIBRARY : Camera.PictureSourceType.CAMERA;
            var options = {
                quality : 90,
                destinationType : Camera.DestinationType.DATA_URL,
                sourceType : sourceType,
                allowEdit : false,
                encodingType: Camera.EncodingType.JPEG,
                targetWidth: 150,
                targetHeight: 150,
                saveToPhotoAlbum: false
            };

            $cordovaCamera.getPicture(options).then(function(imageData) {
                addPlayerModalScope.viewModel.player.face = 'data:image/jpeg;base64,' + imageData;
            }, function(err) {
                console.log(err.message);
            });

            $cordovaCamera.cleanup();
        }

        function removeAvatar() {
            var popupOptions = {
                title: $translate.instant('HOME.PLAYERS.ADD-PLAYER-MODAL.REMOVE-AVATAR-POPUP.TITLE'),
                template: $translate.instant('HOME.PLAYERS.ADD-PLAYER-MODAL.REMOVE-AVATAR-POPUP.TEXT'),
                buttons: [
                    {
                        text: $translate.instant('HOME.GENERAL.CONFIRM.NO')
                    },
                    {
                        text: '<b>' + $translate.instant('HOME.GENERAL.CONFIRM.YES') + '</b>',
                        type: 'button-positive',
                        onTap: function(event) {
                            return true;
                        }
                    }
                ]
            };

            $ionicPopup.confirm(popupOptions)
            .then(function(res) {
                if (res) {
                    addPlayerModalScope.viewModel.player.face = '';
                }
            });
        }

        function cancelPlayer() {
            addPlayerModalScope.viewModel.player = {};

            vm.addPlayerModal.hide();
        }

        function confirmPlayer($event) {
            if (!addPlayerModalScope.viewModel.player.firstName || !addPlayerModalScope.viewModel.player.lastName) {
                toast.show(toastMessages.requiredFields);
                return;
            }

            initNewPlayer(addPlayerModalScope.viewModel.player);

            vm.players.push(addPlayerModalScope.viewModel.player);
            $ionicHistory.clearCache();

            dataService.addPlayer(addPlayerModalScope.viewModel.player);
            toast.show(addPlayerModalScope.viewModel.player.firstName + ' ' + toastMessages.addPlayer);

            vm.addPlayerModal.hide();
        }

        function showRemoveConfirmPopup(player) {
            var templateTranslationId = 'HOME.PLAYERS.REMOVE-POPUP.TEXT';
            var templateTranslationVariable = {playerName: player.firstName + ' ' + player.lastName};

            $ionicPopup.confirm({
                title: $translate.instant('HOME.PLAYERS.REMOVE-POPUP.TITLE'),
                template: $translate.instant(templateTranslationId, templateTranslationVariable),
                okText: $translate.instant('HOME.GENERAL.CONFIRM.YES'),
                cancelText: $translate.instant('HOME.GENERAL.CONFIRM.NO'),
            })
            .then(function(confirmed) {
                if (confirmed) {
                    playersService.remove(player);
                    $ionicHistory.clearCache();

                    dataService.removePlayer(player);
                    toast.show(player.firstName + ' ' + toastMessages.removePlayer);
                }
                vm.removeVisible = false;
            });
        }

        /*  Helper functions
            ======================================================================================== */
        function getNewPlayerTemplate() {
            var playerId = getNewPlayerId();
            var player = { // id is added when written to Database
                id: playerId,
                firstName: '',
                lastName: '',
                tagline: '',
                face: ''
            };

            return player;
        }

        function initNewPlayer(player) {
            if (!player.tagline) {
                player.tagline = 'No tagline provided';
            }
            statisticsService.initPlayerStatistics(player);

            return player;
        }

        function getNewPlayerId() {
            if (!vm.players.length) {
                return 0;
            }
            else {
                return _.max(vm.players, function(player) {
                    return player.id;
                }).id + 1;
            }
        }
    }
})();
