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
		//console.log("scope", scope);
		//console.log("ctrl", cMenu_Ctrl);
	};
})();