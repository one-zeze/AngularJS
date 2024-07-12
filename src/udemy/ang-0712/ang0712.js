var ang0712 = angular.module("ang0712", []);

ang0712.controller("mainController", [
  "$scope",
  "$filter",
  "$http",
  function ($scope, $filter, $http) {
    // $scope.person = {
    //   name: "",
    //   age: "",
    //   email: "",
    //   father: "",
    // };
    $scope.btnClick = function (name) {
      $scope.person.name = name;
      getData();
    };

    $http
      .get("/api/test.json")
      .success(function (result) {
        console.log(result);
        $scope.person = result;
      })
      .error(function (data, status) {
        console.log(data);
      });
    // var getData = function () {
    //   $http
    //     .get("/api/test.json")
    //     .success(function (result) {
    //       console.log(result);
    //       $scope.person = result;
    //     })
    //     .error(function (data, status) {
    //       console.log(data);
    //     });
    // };
  },
]);
