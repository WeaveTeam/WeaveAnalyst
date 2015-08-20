/**
 *this directive is used for selecting 
 *a data source
 *a data table
 *input columns
 *from the weave root tree
 *
 *@author spurushe
 */

(function(){
	angular.module('weaveAnalyst.utils', []);
	angular.module('weaveAnalyst.utils').directive('columnMenu', columnMenuComponent);
	
	function columnMenuComponent (){
		return {
			restrict : 'E',
			templateUrl : 'src/utils/column_Menu.tpl.html',
			scope:{
				input : '=',
				scriptoptions :'='
				//datatable : '@'
				//datasourcename : '@'
			},
			controller : columnMenuController,
			controllerAs : 'cMenu_Ctrl',
			bindToController : true,
			link : function(scope, elem, attrs){
				
			}
		};//end of directive definition
	};
	
	columnMenuController.$inject = ['$scope', 'WeaveService', 'queryService'];
	function columnMenuController (scope, WeaveService, queryService){
		var cMenu_Ctrl = this;
		cMenu_Ctrl.WeaveService = WeaveService;
		cMenu_Ctrl.queryService = queryService;
		
		cMenu_Ctrl.dataObject = {
				data_Source: null,
				data_Table : null,
				data_Column : null
		};
		
		cMenu_Ctrl.dSource_Change_Handler = dSource_Change_Handler;
		cMenu_Ctrl.fetch_data_Columns = fetch_data_Columns;
		
	
		function dSource_Change_Handler (){
			if(cMenu_Ctrl.dataObject.data_Source){
				cMenu_Ctrl.WeaveService.request_data(cMenu_Ctrl.dataObject.data_Source);
			}
		};
		
		//this function is called when the drop down selector for data columns is clicked
		function fetch_data_Columns (){
			if(cMenu_Ctrl.dataObject.data_Source || cMenu_Ctrl.dataObject.data_Table){
				var node;
				//1. check if it weave datasource
				if(cMenu_Ctrl.dataObject.data_Source.name == 'WeaveDataSource'){
					//2. the check if datatable exists
					if(cMenu_Ctrl.dataObject.data_Table)
						node = cMenu_Ctrl.dataObject.data_Table.source;//set node to datatable
				}
				else{//datasources other than weavedatasource
					node = cMenu_Ctrl.dataObject.data_Source.source;//else set node to dataSource
				}
				//3. fetch columns
				cMenu_Ctrl.WeaveService.retrieve_Columns(node);
			}
			else
				alert("Please select a datasource or a datatable first");
			
		};
		
		
		//TODO replace this eventually with a callback mechanism
//		scope.$watch(function(){
//			return cMenu_Ctrl.dataSource;
//		}, function(){
//			if(cMenu_Ctrl.dataSource == WeaveDataSource)//if its a 'WeaveDataSource'
//				cMenu_Ctrl.WeaveService.request_Tables(cMenu_Ctrl.dataSource);
//			else//if its a WADataSource or CSVDataSource
//				cMenu_Ctrl.WeaveService.request_Columns(cMenu_Ctrl.dataSource);
//		});
		//console.log("scope", scope);
		//console.log("ctrl", cMenu_Ctrl);
	};
})();
