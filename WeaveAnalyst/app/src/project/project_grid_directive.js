/**
 *this directive contains the logic for managing the list view of projects and its query objects
 *@author spurushe 
 */

(function(){
	angular.module('weaveAnalyst.project').directive('projectGrid', projectGrid);
	
	function projectGrid (){
		return{
			restrict : 'E',
			controller : projectGridController,
			scope:{
				data : '='
			},
			template : '<div ui-grid = "pGrid_Ctrl.gridOptions" ui-grid-tree-view></div>',
			controllerAs : 'pGrid_Ctrl',
			bindToController : true,
			link : function(){

			}
		};
	};//end of directive defintion
	
	projectGridController.$inject = ['projectService', 'uiGridTreeViewConstants'];
	function projectGridController (projectService, uiGridTreeViewConstants){
		var pGrid_Ctrl = this;
		
		
		pGrid_Ctrl.projectService = projectService;
		pGrid_Ctrl.gridOptions = {
				enableSorting: true,
			    enableFiltering: true,
			    showTreeExpandNoChildren: true,
			    columnDefs: [
			      { name: 'Name', width: '30%'},
			     // { name: 'Author', width: '15%'},
			      { name: 'Description', width: '65%'}//handle warning of data type
			    ],
			    data : pGrid_Ctrl.data
//			    onRegisterApi: function( gridApi ) {
//			      $scope.gridApi = gridApi;
//			      $scope.gridApi.treeBase.on.rowExpanded($scope, function(row) {
//			        if( row.entity.$$hashKey === $scope.gridOptions.data[50].$$hashKey && !$scope.nodeLoaded ) {
//			          $interval(function() {
//			            $scope.gridOptions.data.splice(51,0,
//			              {name: 'Dynamic 1', gender: 'female', age: 53, company: 'Griddable grids', balance: 38000, $$treeLevel: 1},
//			              {name: 'Dynamic 2', gender: 'male', age: 18, company: 'Griddable grids', balance: 29000, $$treeLevel: 1}
//			            );
//			            $scope.nodeLoaded = true;
//			          }, 2000, 1);
//			        }
//			      });
//			    }
			  };	
	};//end of grid controller
		
})();