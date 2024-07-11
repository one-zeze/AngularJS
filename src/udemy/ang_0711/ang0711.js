var app0711 = angular.module("app0711", []);

app0711.controller("newController", [
  "$scope",
  function ($scope) {
    $scope.alertClick = function () {
      alert("Clicked#!@");
    };

    $scope.name = "John Wick";
  },
]);
