/**
 * 
 */
(function(){
	angular.module('weaveApp', [ 'ngAnimate',
	                             'ui.select',
                              	 'ui.bootstrap',
	                             'ngSanitize']);
	
	
	angular.module('weaveApp').controller('appController', appController);
	appController.$inject = ['$window', '$scope'];
	
	function appController($window, $scope){
		var appCtrl = this;
		appCtrl.vizToolOptions  = ['ScatterPlotTool', 'Barchart', 'DataTable'];
		appCtrl.scatterplots = {};
		appCtrl.datatables = [];
		var weave_wrapper;
		var counter= 0;
		
		appCtrl.manage_Active_Tools = manage_Active_Tools;
		appCtrl.addTool2Menu = addTool2Menu;
		appCtrl.removeToolFromMenu = removeToolFromMenu;
		appCtrl.initWeaveWrapper = initWeaveWrapper;
		appCtrl.showToolList = false;
		
		appCtrl.initWeaveWrapper();
		
		function manage_Active_Tools (toolKey, toolObject, addition){
			switch (true) {
			case toolKey.indexOf("ScatterPlotTool") > -1 ://if it contains the string
				if(addition)//adding tools
					appCtrl.scatterplots[toolKey] = toolObject;
				if(!addition)//removing tools
					delete appCtrl.scatterplots[toolKey];
				break;
			}
			
		};
		
		function initWeaveWrapper(){
			//TODO put this retrieval in manager class later
			if(!weaveApp.WeaveWrapper.instance)
				weave_wrapper = new weaveApp.WeaveWrapper();
			else
				weave_wrapper = weaveApp.WeaveWrapper.instance;
		};
		
		function addTool2Menu(tool){
			counter ++;
			appCtrl.showToolList = false;
			var name = tool;
			var toolKey;
			
			if(counter > 1)
				toolKey = name.concat(counter);
			else
				toolKey = name;
			//*******Empty object added here, object populated in scatter plot directive**********/
			appCtrl.manage_Active_Tools(toolKey, null, true);
		}
		
		function removeToolFromMenu(tool){
			appCtrl.manage_Active_Tools(tool.toolName, tool.config, false);//removing tools from widget stack
			weave_wrapper.remove_Object(tool.toolName);//remove corresponding object from weave session state
		}
		
		
		 $scope.oneAtATime = true;

	};
})();