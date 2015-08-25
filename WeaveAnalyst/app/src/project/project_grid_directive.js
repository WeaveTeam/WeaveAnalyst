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
			template : '<div ui-grid = "pGrid_Ctrl.gridOptions" ui-grid-pinning ui-grid-expandable></div>',
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
		          expandableRowTemplate : 'src/project/subGrid.html',
		          expandableRowHeight : 150,
		          expandableRowScope : {
		              subGridVariable : 'subGridScopeVariable'
		          },
				  data : pGrid_Ctrl.data
        };
		
		//defining the columns of the parent grid
		pGrid_Ctrl.gridOptions.columnDefs = [
		                                { name: 'Name', width: '35%'  },
		                                { name: 'Description', width: '60%' }
		                            ];
		
		pGrid_Ctrl.gridOptions.onRegisterApi = function (gridApi){
			pGrid_Ctrl.gridApi = gridApi;
        };
		  		
	};//end of grid controller
		
})();