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
        vm.teams = playersService.allTeams();
        vm.removeVisible = false;
        vm.deleteMode = 'delete';
        vm.initDeleteButton = initDeleteButton;
        vm.onClickDeleteButton = onClickDeleteButton;
        vm.submitTeam = submitTeam;
        vm.teamName = '';
        vm.deleteTeam = deleteTeam;
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

        function initDeleteButton(mode) {
            vm.deleteMode = mode;
            vm.removeVisible = !vm.removeVisible;

            // reset state
            if(!vm.removeVisible) {
                resetTeamForm();
            }
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
                saveToPhotoAlbum: false,
                correctOrientation: true
            };

            $cordovaCamera.getPicture(options).then(function(imageData) {
                addPlayerModalScope.viewModel.player.face = 'data:image/jpeg;base64,' + imageData;
            }, function(err) {
                console.log(err.message);
            });

            // $cordovaCamera.cleanup(); // only on iOS, remove for android build
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

        function onClickDeleteButton(player) {
            if (vm.deleteMode === 'delete') {
                var teamPlayers = _.flatten(_.pluck(vm.teams, 'players'));
                var isPartOfTeam = _.contains(teamPlayers, player);
                if (isPartOfTeam) {
                    vm.removeVisible = false;
                    showPlayerPartOfTeamAlert(player)
                } else {
                    showRemoveConfirmPopup(player);
                }
            } else if (vm.deleteMode === 'team') {
                var selectedPlayers = vm.players.filter(function(player) {
                    return player.isSelected;
                });

                if (selectedPlayers.length > 3) {
                    toast.show(toastMessages.maxTeam);
                } else {
                    player.isSelected = player.isSelected ? false : true;
                }
            }
        }

        function showPlayerPartOfTeamAlert(player) {
            var teams = vm.teams.filter(function(team) {
                return _.contains(team.players, player)
            });
            var teamNamesArray = _.pluck(teams, 'name');
            var teamNames = '';
            var lastTeamName = '';
            if (teamNamesArray.length > 1) {
                lastTeamName = ' & ' + teamNamesArray.pop();
            }
            teamNames = teamNamesArray.join(', ') + lastTeamName;

            var templateTranslationId = 'HOME.PLAYERS.REMOVE-TEAM-PLAYER_POPUP.TEXT';
            var templateTranslationVariable = {
                plural: teams.length > 1 ? 's' : '',
                playerName: player.firstName + ' ' + player.lastName,
                teamNames: teamNames
            };

            var alertPopup = $ionicPopup.alert({
                title: $translate.instant('HOME.PLAYERS.REMOVE-TEAM-PLAYER_POPUP.TITLE'),
                template: $translate.instant(templateTranslationId, templateTranslationVariable),
                okText: $translate.instant('HOME.GENERAL.CONFIRM.OK')
            });

            alertPopup.then(function(res) {
            });
        }

        function submitTeam() {
            var teamExists = vm.teams.map(function(team) {
                return team.name;
            }).indexOf(vm.teamName) > -1
            var selectedPlayers = vm.players.filter(function(player) {
                return player.isSelected;
            });

            if (selectedPlayers.length < 2) {
                toast.show(toastMessages.zeroTeam);
                return;
            }

            if (teamExists) {
                toast.show(toastMessages.teamExists);
                return;
            }

            // create  new team
            var newTeam = {
                id: getNewTeamId(),
                name: vm.teamName,
                players: selectedPlayers
            };
            statisticsService.initPlayerStatistics(newTeam);
            vm.teams.push(newTeam);
            $ionicHistory.clearCache();

            dataService.addTeam(newTeam);
            toast.show(newTeam.name + ' ' + toastMessages.addTeam);

            // reset screen state
            resetTeamForm();
            vm.removeVisible = false;

        }

        function resetTeamForm() {
            vm.players.map(function(player) {
                delete player.isSelected;
            });
            vm.teamName = '';
        }

        function deleteTeam(team) {
            showRemoveTeamConfirmPopup(team)
        }

        function getNewTeamId() {
            if (!vm.teams.length) {
                return 0;
            } else {
                return _.max(vm.teams, function(team) {
                    return team.id;
                }).id + 1;
            }
        }

        /*  Helper functions
            ======================================================================================== */
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

        function showRemoveTeamConfirmPopup(team) {
            var templateTranslationId = 'HOME.PLAYERS.REMOVE-TEAM-POPUP.TEXT';
            var templateTranslationVariable = {teamName: team.name};

            $ionicPopup.confirm({
                title: $translate.instant('HOME.PLAYERS.REMOVE-TEAM-POPUP.TITLE'),
                template: $translate.instant(templateTranslationId, templateTranslationVariable),
                okText: $translate.instant('HOME.GENERAL.CONFIRM.YES'),
                cancelText: $translate.instant('HOME.GENERAL.CONFIRM.NO'),
            })
            .then(function(confirmed) {
                if (confirmed) {
                    playersService.removeTeam(team);
                    $ionicHistory.clearCache();

                    // TODO: remove from DB
                    dataService.removeTeam(team);
                    toast.show(team.name + ' ' + toastMessages.removeTeam);
                }
                vm.removeVisible = false;
            });
        }

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
