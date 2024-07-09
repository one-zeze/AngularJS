/**
 * 상단 그리드 셀렉트
 */
(function (angular) {
  "use strict";
  function acGridCtrl(
    $scope,
    $q,
    $http,
    $timeout,
    uiGridConstants,
    InfiniteScrollApi,
    ExternalSortApi,
    constants,
    dialog,
    $log,
    $mdMedia,
    useragent
  ) {
    var ctrl = this;

    if (
      !$mdMedia("gt-md") ||
      (useragent.browser() === "MSIE" &&
        useragent.browser() &&
        useragent.OSVersion() < 7)
    ) {
      angular.forEach(ctrl.options.columnDefs, function (col) {
        delete col.pinnedLeft;
        delete col.pinnedRight;
      });
    }

    if (typeof ctrl.api === "undefined") {
      ctrl.api = {};
    }
    // infinite scroll setting
    $scope.infiniteScrollApi = null;

    ctrl.refreshGrid = function () {
      $scope.refresh = true;

      $scope.infiniteScrollApi.destroy();

      delete ctrl.gridApi;
      delete $scope.infiniteScrollApi;
      delete $scope.externalSortApi;

      return $timeout(function () {
        $scope.refresh = false;
      }, 0);
    };

    var queryParam = null;
    if (!ctrl.options.onSortChange) {
      ctrl.options.onSortChange = function (sort) {
        ctrl.options.sortParam = sort;
        ctrl.gridApi.selection.clearSelectedRows();
        ctrl.selected = null;
        ctrl.onChange();
        $scope.infiniteScrollApi.load();
      };
    }

    var delegeteFn = null;
    if (!!ctrl.options.onRegisterApi) delegeteFn = ctrl.options.onRegisterApi;
    ctrl.options.onRegisterApi = function (gridApi) {
      //set gridApi on scope
      ctrl.gridApi = gridApi;

      ctrl.api.getSelection = gridApi.selection.getSelectedRows;

      gridApi.selection.on.rowSelectionChanged($scope, function (row) {
        $timeout(function () {
          ctrl.selected = gridApi.selection.getSelectedRows()[0];
          ctrl.onChange({ selected: ctrl.selected });
          $scope.prodSelect = ctrl.gridApi.selection.getSelectedRows;
          // console.log(ctrl.selected); selected[0]만 찍힘
          console.log("acGrid: " + ctrl);
        });
      });

      gridApi.grid.registerDataChangeCallback(
        function (grid) {
          // gridApi.selection.selectRow($scope.options.data[0]);
        },
        [uiGridConstants.dataChange.ROW]
      );
      //				external sort
      $scope.externalSortApi = new ExternalSortApi(
        $scope,
        gridApi.grid.options,
        gridApi
      );
      // create InfiniteScrollApi
      $scope.infiniteScrollApi = new InfiniteScrollApi(
        $scope,
        gridApi.grid.options,
        gridApi
      );
      $scope.infiniteScrollApi.onLoading = function () {
        ctrl.isLoading = true;
      };
      $scope.infiniteScrollApi.onLoadDone = function () {
        ctrl.isLoading = false;
      };
      $scope.infiniteScrollApi.onLoadFail = function (errorData) {
        ctrl.isLoading = false;
        dialog.msg(errorData.message, "msg.loadFail");
      };
      if (delegeteFn) delegeteFn(gridApi);
    };

    ctrl.api.search = function (type, query) {
      if (!!query) queryParam = query;
      if (!queryParam && !ctrl.options.onInfinataScrollLoadData) return;
      if (!$scope.infiniteScrollApi) return;

      ctrl.options.data = null;
      if (!!ctrl.gridApi) ctrl.gridApi.selection.clearSelectedRows();
      ctrl.selected = null;
      ctrl.onChange();

      if (!!queryParam) {
        queryParam.includeChild = ctrl.includeChild;
      }
      if (
        !!queryParam &&
        !!queryParam.includeChild !== !!ctrl.options.enableTreeView
      ) {
        ctrl.options.enableTreeView = !!queryParam.includeChild;
        ctrl.refreshGrid().then(function () {
          $timeout(function () {
            $scope.infiniteScrollApi.load();
          });
        });
      } else {
        $scope.infiniteScrollApi.load();
      }
    };

    ctrl.api.loadAll = function () {
      var promise = $q.defer();
      function more() {
        if (!$scope.infiniteScrollApi) {
          return promise.resolve();
        }

        $scope.infiniteScrollApi.loadMore().then(
          function () {
            more();
          },
          function () {
            promise.resolve();
          }
        );
      }
      more();
      return promise.promise;
    };

    /**
     * 실제조회
     */
    if (!ctrl.options.onInfinataScrollLoadData) {
      ctrl.options.onInfinataScrollLoadData = function (page, pageSize) {
        var promise = $q.defer();
        if (!queryParam) {
          promise.resolve();
        } else {
          queryParam.sort = ctrl.options.sortParam;
          queryParam.page = page;
          queryParam.pageSize = pageSize;

          $http
            .get(constants.urlConst.grid.prod, {
              params: queryParam,
              paramSerializer: "$httpParamSerializer",
            })
            .then(
              function (res) {
                if (ctrl.options.showColumnFooter) ctrl.getSummary();

                promise.resolve(res);
              },
              function (res) {
                promise.reject(res);
              }
            );
        }

        return promise.promise;
      };
    }

    ctrl.getSummary = function () {
      // MS browser hack footer 깜빡임 -> 제거시 서머리가 쳐짐..
      var sheet = document.createElement("style");
      sheet.innerHTML = "ui-grid-footer { visibility: hidden; }";
      document.body.appendChild(sheet);
      $http
        .get(constants.urlConst.prod.summary, {
          params: queryParam,
          paramSerializer: "$httpParamSerializer",
        })
        .then(function (res) {
          ctrl.options.summary = res.data;
        })
        .finally(function () {
          $timeout(function () {
            document.body.removeChild(sheet);
          });
        });
    };

    ctrl.api.summary = ctrl.getSummary;

    var listener = $scope.$watch("ctrl.includeChild", function () {
      ctrl.api.search();
    });

    $scope.$on("$destroy", function () {
      delete ctrl.gridApi;
      delete $scope.infiniteScrollApi;
      delete $scope.externalSortApi;
      if (!!listener) listener();
    });
  }

  app.component("acGrid", {
    templateUrl: "/templates/acGrid.html",
    controller: acGridCtrl,
    controllerAs: "ctrl",
    transclude: true,
    bindings: {
      api: "=acApi",
      selected: "=?acSelected",
      options: "=",
      includeChild: "=?",
      isLoading: "=acLoading",
      onChange: "&acChange",
      gridApi: "=?",
    },
  });
})(window.angular);
