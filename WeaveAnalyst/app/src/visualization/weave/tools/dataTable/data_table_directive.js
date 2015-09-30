/**
 * directive that creates the AdvancedTable tool widget
 * controls the Advanced Table in Weave
 * @spurushe
 */

(function(){
	angular.module('weaveApp').directive('dataTable', dataTable );
	
	function dataTable(){
		return {
			restrict : 'E',
			templateUrl : 'tools/dataTable/data_table.tpl.html',
			controller : dataTableController,
			controllerAs : 'dtCtrl',
			bindToController : true,
			link : function(){
				
			}
		};
	}//end of directive definition
	
	function dataTableController (){
		var dtCtrl = this;
		var weave_wrapper;
		
		dtCtrl.request_dataTable = request_dataTable;
		dtCtrl.initWeaveWrapper = initWeaveWerapper;
		dtCtrl.items = ['a','d'];
		
		dtCtrl.config = {
			checked: false,
			toolName: null,
			columns : null
		};
		
		function initWeaveWrapper(){
			//TODO put this retrieval in manager class later
			if(!wa.wWrapper)
				weave_wrapper = new wa.WeaveWrapper();
			else
				weave_wrapper = WeaveWrapper.instance;
		};
		
		function request_dataTable (){
			if(wa.WeaveWrapper.check_WeaveReady()){//TODO figure out where to call checkWeaveReady
				
				dtCtrl.initWeaveWrapper();
				
				if(dtCtrl.config.checked)//if checked
					dtCtrl.config.toolName = weave_wrapper.request_AdvancedDataTable(dtCtrl.config);//request it with config
				else{//if unchecked
					if(dtCtrl.config.toolName)//if the tool exists
						weave_wrapper.remove_Object(dtCtrl.config.toolName);//remove it
					else
						return;
				}
			}
			else
				setTimeout(request_dataTable, 100);
		};
	};
})();
