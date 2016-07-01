angular.module('starter.controllers', [])

.controller('DashCtrl', function($scope, $ionicTabsDelegate) {
  $scope.hideBar = function() {
    $ionicTabsDelegate.showBar(!$ionicTabsDelegate.showBar());
  };
})

.controller('HallOfFameCtrl', function($scope) {
  $scope.test = "test";
})

.controller('PlayerDetailCtrl', function($scope, $stateParams, Players) {
  $scope.player = Players.get($stateParams.playerId);
})

.controller('PlayersCtrl', function($scope, Players) {
  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //
  //$scope.$on('$ionicView.enter', function(e) {
  //});

  $scope.players = Players.all();
  $scope.remove = function(player) {
    Players.remove(player);
  };
});
