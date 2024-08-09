var myApp = angular.module("myApp", ["ngRoute"]);

myApp.config(function ($routeProvider) {
  $routeProvider

    .when("/", {
      templateUrl: "pages/main.html",
      controller: "mainController",
    })

    .when("/second", {
      templateUrl: "pages/second.html",
      controller: "secondController",
    })

    .when("/second/:num", {
      templateUrl: "pages/second.html",
      controller: "secondController",
    });
});

myApp.controller("mainController", []);

myApp.controller("secondController", []);

myApp.directive("searchResult", function () {
  return {
    restrict: "AECM",
    //directive에만 해당
    // restrict: "AECM" -> 속성, html요소, class, 주석으로 사용가능함.
    // default: AE
    template: "pages/searchresult.html",
    replace: true,
  };
});
