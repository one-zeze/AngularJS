var myApp = angular.module("myApp", ["ngRoute"]);

myApp.config(function ($routeProvider) {
  $routeProvider

    .when("/", {
      templateUrl: "pages/main.html",
      controller: "mainController",
    })

    .when("/second/:num", {
      templateUrl: "/copy.html",
      controller: "secondController",
    });
});

myApp.controller("mainController", [
  "$scope",
  "$log",
  function ($scope, $log) {
    $scope.name = "Main";
  },
]);

myApp.controller("secondController", [
  "$scope",
  "$log",
  "$routeParams",
  function ($scope, $log, $routeParams) {
    $scope.name = "Second";
    $scope.num = $routeParams.num;
  },
]);
