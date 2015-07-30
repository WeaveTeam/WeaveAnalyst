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
				input : '=',
				dataTable : '=',
				dataSourceName : '='
			},
			controller : columnMenuController,
			bindToController : true,
			link : function(scope, elem, attrs){
				
			}
		};//end of directive definition
	};
	
	columnMenuController.$inject = ['$scope', 'queryService'];
	function columnMenuController (scope, queryService){
		var cMenu_Ctrl = this;
		cMenu_Ctrl.queryService = queryService;
		
		console.log("scope", scope);
		//console.log("ctrl", cMenu_Ctrl );
	};
})();