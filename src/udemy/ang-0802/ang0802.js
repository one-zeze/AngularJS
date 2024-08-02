var ang0802 = angular.module("ang0802", ["ngRoute"]);

ang0802.config(function ($routeProvider) {
  $routeProvider

    .when("/", {
      templateUrl: "pages/main.html",
      controller: "mainController",
    })

    .when("/copy/:number/:soju", {
      templateUrl: "/copy.html",
      controller: "mainController2",
    });
});

ang0802.controller("mainController", [
  "$scope",
  "$log",
  function ($scope, $log) {
    $scope.name = "nop";
    $log.main = "this is main";
    console.log($log);
  },
]);
ang0802.controller("mainController2", [
  "$scope",
  "$log",
  "$routeParams",
  function ($scope, $log, $routeParams) {
    $scope.number = $routeParams.number || 1;
    $scope.soju = $routeParams.soju || 2;
    $log.second = "this is second";
    console.log($log);
  },
]);
