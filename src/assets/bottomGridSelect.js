/**
 * 하단 그리드 셀렉트
 */
(function (angular) {
  "use strict";

  function BottomGridSelectCtrl(
    $scope,
    constants,
    exportGrid,
    dialog,
    $i18next
  ) {
    var ctrl = this;
    var getBottomSelection = null;
    var selectGridApi = null;
    if (!ctrl.uid) ctrl.uid = "prodId";
    ctrl.selectGrid = angular.copy(ctrl.parentGrid);
    ctrl.selectGrid.showColumnFooter = false;
    ctrl.selectGrid.showGridFooter = false;
    ctrl.selectGrid.useExternalSorting = false;
    ctrl.selectGrid.onRegisterApi = function (gridApi) {
      if (!!gridApi.selection)
        getBottomSelection = gridApi.selection.getSelectedRows;
      selectGridApi = gridApi;
      ctrl.getVisibleRows = function () {
        return gridApi.core.getVisibleRows(gridApi.grid);
      };
    };

    ctrl.selectGrid.onGridDblClick = function (col, row) {
      ctrl.removeSelect();
    };

    ctrl.selectGrid.contextMenu = [
      {
        caption: "ui.btn.deleteRow",
        action: function (context) {
          var deleteIdx = ctrl.selectGrid.data.lastIndexOf(context.row.entity);
          ctrl.selectGrid.data.splice(deleteIdx, 1);
        },
      },
      {
        caption: "ui.btn.deleteSelected",
        action: function (context) {
          ctrl.removeSelect();
        },
      },
    ];

    $scope.$on("bottomGrid.addSelect", function () {
      ctrl.addSelect();
    });

    ctrl.addSelect = function () {
      var limitAlert = false;
      console.log(ctrl.getSelection());
      console.log(ctrl.getSelection().data);
      angular.forEach(ctrl.getSelection(), function (data, index) {
        if (ctrl.selectGrid.data.length >= constants.config.selectlemit) {
          limitAlert = true;
          return;
        }
        var found = ctrl.selectGrid.data.find(function (rec) {
          return rec[ctrl.uid] === data[ctrl.uid];
        });
        if (!found) {
          ctrl.selectGrid.data.push(data);
        }
      });
      if (limitAlert) {
        dialog.msg(
          $i18next.t("msg.alertLimit").format(constants.config.selectlemit)
        );
      }
      console.log("bottomGrid: " + ctrl.uid);
    };

    ctrl.removeSelect = function () {
      angular.forEach(getBottomSelection(), function (data, index) {
        ctrl.selectGrid.data.splice(ctrl.selectGrid.data.lastIndexOf(data), 1);
      });
    };

    ctrl.menuClick = function (menu, ev) {
      ctrl.onMenuClick({ menu: menu, event: ev });
    };

    ctrl.export = function (type) {
      exportGrid.exportGrid2Xlsx(
        ctrl.selectGrid,
        selectGridApi,
        $i18next.t("export.fileName.selectedProd")
      );
    };

    $scope.$emit("angular-resizable.resizeEnd", {});
  }

  app.component("bottomGridSelect", {
    templateUrl: "/templates/bottomGridSelect.html",
    controller: BottomGridSelectCtrl,
    controllerAs: "ctrl",
    transclude: true,
    bindings: {
      parentGrid: "<",
      selectGrid: "=childGrid",
      getSelection: "<",
      getVisibleRows: "=?",
      menus: "<",
      onMenuClick: "&menuClick",
      uid: "@?",
    },
  });
})(window.angular);
