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
		appCtrl.manage_Active_Tools = manage_Active_Tools;
		appCtrl.addTool2Menu = addTool2Menu;
		appCtrl.showToolList = false;
		
		appCtrl.scatterplots = {};
		appCtrl.datatables = [];
		
		
		
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
		
		function addTool2Menu(tool){
			appCtrl.showToolList = false;
			var name = tool;
			var toolKey;
			var counter = Object.keys(appCtrl.scatterplots).length + 1;
			if(counter > 1)
				toolKey = name.concat(counter);
			else
				toolKey = name;
			appCtrl.manage_Active_Tools(toolKey, null, true);
		}
		
		
		 $scope.oneAtATime = true;

		  $scope.items = ['Item 1', 'Item 2', 'Item 3'];

		  $scope.addItem = function() {
		    var newItemNo = $scope.items.length + 1;
		    $scope.items.push('Item ' + newItemNo);
		  };
	};
})();