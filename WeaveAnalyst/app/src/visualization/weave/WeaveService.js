(function(){
	angular.module('weaveAnalyst.WeaveModule', []);
	
	angular.module('weaveAnalyst.WeaveModule').service('WeaveService', WeaveService);
	
	WeaveService.$inject = ['$q','$window','runQueryService', 'dataServiceURL','queryService'];
	function WeaveService ($q,$window, runQueryService, dataServiceURL, queryService){
		var that = this;
		that.weaveWindow;
		that.wWrapper;
		
		that.blah = "bujumbarra";
		that.launch_Weave = function(){
			
			//check if it is open
			if(that.weaveWindow)
				return;
			else{
				that.weaveWindow = $window.open("src/visualization/weave/weaveApp.html","abc","toolbar=no, fullscreen = no, scrollbars=no, addressbar=no, resizable=yes");
				that.weaveWindow.wa_data = that.blah;
				
				//fetching the weave root item
				that.request_Tree();
			}
		};
		
		that.request_Tree = function (){
			if(WeaveWrapper.check_WeaveReady())
				that.request_tree();
			else
				setTimeout(that.request_Tree, 100);
		};
		
	};
})();