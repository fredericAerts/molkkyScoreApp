(function() {
    'use strict';

    angular
        .module('molkkyscore')
        .controller('PlayerDetailCtrl', PlayerDetailCtrl);

    PlayerDetailCtrl.$inject = ['$scope',
                                '$rootScope',
                                '$stateParams',
                                'TEMPLATES_ROOT',
                                'playersService',
                                'statisticsService',
                                '$ionicModal',
                                '$ionicPopup',
                                '$translate',
                                '$cordovaCamera',
                                'toast'];

    function PlayerDetailCtrl($scope,
                                $rootScope,
                                $stateParams,
                                TEMPLATES_ROOT,
                                playersService,
                                statisticsService,
                                $ionicModal,
                                $ionicPopup,
                                $translate,
                                $cordovaCamera,
                                toast) {
        /* jshint validthis: true */
        var vm = this;
        var editPlayerModalScope = $scope.$new(true);
        var toastMessages = toast.getMessages().players;

        vm.player = playersService.get($stateParams.playerId);
        vm.editPlayerModal = {};
        vm.showPlayerModal = showPlayerModal;
        vm.metricDonuts = [];
        vm.profileData = {};

        activate();

        ////////////////

        function activate() {
            initMetricDonuts();
            initProfileData();
            initEditPlayerModal();
        }

        /*  LISTENERS
            ======================================================================================== */
        $rootScope.$on('$translateChangeSuccess', function () {
            toastMessages = toast.getMessages().players;
        });

        // Cleanup the modal when we're done with it!
        $scope.$on('$destroy', function() {
            vm.editPlayerModal.remove();
        });

        /*  FUNCTIONS
            ======================================================================================== */
        function initMetricDonuts() {
            var metricKeys = ['versatility', 'winningRatio', 'accuracy', 'efficiency'];
            var metric = {};

            metricKeys.forEach(function(key) {
                metric = statisticsService.getMetricByKey(key);
                vm.metricDonuts.push({
                    translationId: metric.translationId,
                    value: vm.player.statistics.metrics[key],
                    unit: metric.unit
                });
            });

            return vm.metricDonuts;
        }

        function initProfileData() {
            var profileItems = [
                item($translate.instant('HOME.PLAYERS.DETAIL.PROFILE-DATA-LABELS.FIRST-NAME'), vm.player.firstName),
                item($translate.instant('HOME.PLAYERS.DETAIL.PROFILE-DATA-LABELS.LAST-NAME'), vm.player.lastName),
                item($translate.instant('HOME.PLAYERS.DETAIL.PROFILE-DATA-LABELS.TAGLINE'), vm.player.tagline)
            ];
            var statisticsItems = [// raw data
                item($translate.instant('HOME.PLAYERS.DETAIL.PROFILE-DATA-LABELS.GAMES-PLAYED'), vm.player.statistics.rawData.gamesPlayed),
                item($translate.instant('HOME.PLAYERS.DETAIL.PROFILE-DATA-LABELS.GAMES-WON'), vm.player.statistics.rawData.gamesWon),
                item($translate.instant('HOME.PLAYERS.DETAIL.PROFILE-DATA-LABELS.GAMES-REACHED-MAX-SCORE'), vm.player.statistics.rawData.gamesReachedMaxScore),
                item($translate.instant('HOME.PLAYERS.DETAIL.PROFILE-DATA-LABELS.THROWS'), vm.player.statistics.rawData.throws),
                item($translate.instant('HOME.PLAYERS.DETAIL.PROFILE-DATA-LABELS.THROWS-SINGLE-PIN'), vm.player.statistics.rawData.throwsSinglePin),
                item($translate.instant('HOME.PLAYERS.DETAIL.PROFILE-DATA-LABELS.THROWS-REACHED-MAX-SCORE'), vm.player.statistics.rawData.throwsInGamesReachedMaxScore)
            ];

            vm.profileData.profile = profileItems;
            vm.profileData.statistics = statisticsItems;

            return vm.profileData;

            function item(title, value, unit) {
                var item = {};
                item.title = title;
                item.value = value;
                item.unit = unit ? unit : '';
                return item;
            }
        }

        function initEditPlayerModal() {
            editPlayerModalScope.$on('modal.hidden', function() {
                angular.element(document).find('body').removeClass('modal-open');
            });

            $ionicModal.fromTemplateUrl(TEMPLATES_ROOT + '/players/modal-edit-player.html', {
                scope: editPlayerModalScope,
                animation: 'slide-in-up'
            })
            .then(function(modal) {
                vm.editPlayerModal = modal;

                /*  ==================================================================
                - modal template should reference 'viewModel' as its scope
                - viewModel data is initialized (reset) each time modal is shown
                ================================================================== */
                editPlayerModalScope.viewModel = {
                    player: {},
                    takePicture: takePicture,
                    removeAvatar: removeAvatar,
                    confirmPlayer: confirmPlayer
                };
            });
        }

        function showPlayerModal(player) {
            editPlayerModalScope.viewModel.player = player;
            vm.editPlayerModal.show();
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
                saveToPhotoAlbum: false,
                correctOrientation: true
            };

            $cordovaCamera.getPicture(options).then(function(imageData) {
                editPlayerModalScope.viewModel.player.face = 'data:image/jpeg;base64,' + imageData;
            }, function(err) {
                console.log(err.message);
            });

            // $cordovaCamera.cleanup(); // only on iOS, remove for android build
        }

        function removeAvatar() {
            var popupOptions = {
                title: $translate.instant('HOME.PLAYERS.EDIT-PLAYER-MODAL.REMOVE-AVATAR-POPUP.TITLE'),
                template: $translate.instant('HOME.PLAYERS.EDIT-PLAYER-MODAL.REMOVE-AVATAR-POPUP.TEXT'),
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
                    editPlayerModalScope.viewModel.player.face = '';
                }
            });
        }

        function confirmPlayer($event) {
            if (!editPlayerModalScope.viewModel.player.firstName || !editPlayerModalScope.viewModel.player.lastName) {
                toast.show(toastMessages.requiredFields);
                return;
            }

            if (!editPlayerModalScope.viewModel.player.tagline) {
                editPlayerModalScope.viewModel.player.tagline = 'No tagline provided';
            }

            initProfileData();
            playersService.updatePlayer(vm.player);
            toast.show(toastMessages.updateSaved);

            vm.editPlayerModal.hide();
        }
    }
})();
