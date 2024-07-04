(function (angular) {
  "use strict";
  function Assets1060Ctrl(
    $scope,
    $http,
    $log,
    $stateParams,
    $timeout,
    constants,
    detailSearch
  ) {
    var ctrl = this;
    if (!!$stateParams.reload) {
      $timeout(function () {
        ctrl.search("init", { prodStatus: [1] });
      });
    }
    ctrl.readonly = true;
    ctrl.assetMenu = [
      {
        id: "btnDetailSearch",
        caption: "ui.btn.detialSearch",
        img: "images/svg/ic_youtube_searched_for_white_24px.svg",
      },
      {
        id: "multiDelete",
        caption: "ui.btn.multiDelete",
        img: "images/svg/ic_delete_sweep_white_24px.svg",
      },
    ];
    ctrl.bottomMenu = [
      {
        id: "multiDelete",
        caption: "ui.btn.multiDelete",
        img: "images/svg/ic_delete_sweep_white_24px.svg",
      },
    ];

    ctrl.search = function (type, query) {
      ctrl.api.search(type, query);
      console.log("1060Ctrl" + ctrl);
    };
    ctrl.delClick = function () {
      console.log("1060Ctrl" + ctrl);
      // if (ctrl.prodSelect.data.length > 0) {
      //   $http.put("/prod/flag", ctrl.prodSelect.data).then(function () {
      //     ctrl.prodSelect.data = [];
      //     ctrl.search();
      //   });
      // }
    };

    ctrl.menuClick = function (menu, ev) {
      $log.debug(menu, ev);
      switch (menu.id) {
        case "btnDetailSearch":
          console.log("case btnDetailSearch");
          detailSearch.show().then(function (answer) {
            ctrl.search("detailSerch", answer);
          });
          break;
        case "multiDelete":
          ctrl.delClick();
      }
    };

    ctrl.prodGrid = angular.copy(constants.gridOptions.prodGrid);
    ctrl.prodSelect = null;

    ctrl.prodGrid.onGridDblClick = function (col, row) {
      console.log("col:" + col + " row:" + row);
      $scope.$broadcast("bottomGrid.addSelect");
    };
  }

  app.controller("Assets1060Ctrl", Assets1060Ctrl);
})(window.angular);
