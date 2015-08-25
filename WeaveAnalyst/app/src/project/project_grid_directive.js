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
	
	projectGridController.$inject = ['projectService', 'uiGridTreeViewConstants', '$scope'];
	function projectGridController (projectService, uiGridTreeViewConstants, $scope){
		var pGrid_Ctrl = this;
		
		
		pGrid_Ctrl.projectService = projectService;

		pGrid_Ctrl.gridOptions = {
		          expandableRowTemplate : 'src/project/subGrid.html',  //This is the template that will be used to render subgrid.
		          expandableRowHeight : 150, //This will be the height of the subgrid
		          expandableRowScope : {
		              subGridVariable : 'subGridScopeVariable'  //Variables of object expandableScope will be available in the scope of the expanded subgrid
		          },
		          onRegisterApi: function (gridApi) {
		              gridApi.expandable.on.rowExpandedStateChanged($scope, function (row) {
		                  if (row.isExpanded) {
		                    row.entity.subGridOptions = {
		                      columnDefs: [
		                      { name: 'author'},
		                      { name: 'queryObjectName'},
		                      { name: 'columns'}
		                    ]};
		                    
		                    pGrid_Ctrl.projectService.getListOfQueryObjects(row.entity.Name).then(function(childQos){
		                    	
		                    	row.entity.subGridOptions.data = childQos;
		                    });
		                    
		                  }
		              });
		          },
				  data : pGrid_Ctrl.data//sets the data of the parent grid
        };
		
		//defining the columns of the parent grid
		pGrid_Ctrl.gridOptions.columnDefs = [
		                                { name: 'Name', width: '35%'  },
		                                { name: 'Description', width: '60%' }
		                            ];
		
			
	};//end of grid controller
		
})();