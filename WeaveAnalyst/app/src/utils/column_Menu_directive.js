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
	angular.module('weaveAnalyst.AnalysisModule').directive('columnMenu', columnMenuComponent);
	
	function columnMenuComponent (){
		return {
			restrict : 'E',
			templateUrl : 'src/utils/column_Menu.tpl.html',
			scope:{
				input : '='
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
	
	columnMenuController.$inject = ['$scope', 'WeaveService'];
	function columnMenuController (scope, WeaveService){
		var cMenu_Ctrl = this;
		cMenu_Ctrl.WeaveService = WeaveService;
		
		cMenu_Ctrl.ss = {ds : null};
		cMenu_Ctrl.dSource_Change_Handler = dSource_Change_Handler;
		
		function dSource_Change_Handler (){
			if(cMenu_Ctrl.dataSource.name){
				cMenu_Ctrl.WeaveService.request_data(cMenu_Ctrl.dataSource);
			}
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
