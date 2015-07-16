(function(){
	angular.module('weaveAnalyst.WeaveModule', []);
	
	angular.module('weaveAnalyst.WeaveModule').service('WeaveService', WeaveService);
	
	WeaveService.$inject = ['$q','$window','$rootScope','runQueryService', 'dataServiceURL','queryService'];
	function WeaveService ($q,$window, rootScope, runQueryService, dataServiceURL, queryService){
		var that = this;
		
		that.launch_Weave = function(){
			$window.open("../weave.html?",
					"abc","toolbar=no, fullscreen = no, scrollbars=no, addressbar=no, resizable=yes");
		};
		
	};
})();