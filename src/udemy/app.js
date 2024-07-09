var myApp = angular.module("myApp", []);

myApp.controller("mainController", [
  "$scope",
  "$filter",
  "$timeout",
  //   "$log",
  function ($scope, $filter, $timeout) {
    $scope.handle = "";
    $scope.characters = 5;
    $scope.lowercaseHandle = function () {
      return $filter("lowercase")($scope.handle);
    };
    // $scope.$watch("handle", function (newValue, oldValue) {
    //   console.log("Old:" + oldValue);
    //   console.log("New:" + newValue);
    // })

    // setTimeout(function () {
    //   $scope.handle = "reset";
    //   console.log("$scope.handle changed");
    // }, 3000);
  },
]);

//function()의 파라미터 이름과 상관없이, injection된 순서에 따라 매핑됨
//ex) myApp.controller('$scope', '$http', '$log', function(a,b,c))
//    a=$scope, b=$http, c=$log

//min.js
// 따옴표"" 안에 작성한 텍스트는 그대로
// var myApp = angular.module("myApp", []);
// myApp.controller("mainController", [
//   "$scope",
//   "$log",
//   function (o, l) {
//     (l.info = "log info"), console.log(o), console.log(l);
//   },
// ]);
