(function(){
	angular.module('weaveAnalyst.WeaveModule', []);
	
	angular.module('weaveAnalyst.WeaveModule').service('WeaveService', WeaveService);
	
	WeaveService.$inject = ['$q','$window','runQueryService', 'dataServiceURL','queryService'];
	function WeaveService ($q,$window, runQueryService, dataServiceURL, queryService){
		var that = this;
		that.weaveWindow;
		that.wWrapper;
		that.weave_tree;//so that the tree can be retrieved anywhere in the app by simply injecting this service
		
		that.blah = "bujumbarra";
		that.dataSources;
		that.dataTables;
		
		that.launch_Weave = function(){
			
			//check if it is open
			if(that.weaveWindow)
				return;
			else{
				that.weaveWindow = $window.open("src/visualization/weave/weaveApp.html","abc","toolbar=no, fullscreen = no, scrollbars=no, addressbar=no, resizable=yes");
				that.weaveWindow.wa_data = that.blah;
				
				that.weaveWindow.addEventListener("load", that.create_weaveWrapper);//getting the instance
			}
		};
		
		that.create_weaveWrapper = function(){
			
			var wApp = that.weaveWindow.weaveApp;
			
			if(!that.wWrapper && that.weaveWindow){
				if(!wApp.WeaveWrapper.instance)
					that.wWrapper =  new wApp.WeaveWrapper();
				else
					that.wWrapper = wApp.WeaveWrapper.instance;
			}
			
			//fetching the weave root item
			that.request_Tree();
		};
		
		that.request_Tree = function (){
			var wApp = that.weaveWindow.weaveApp;
			
			if(wApp.WeaveWrapper.check_WeaveReady()){//if weave is ready
				that.weave_tree = wApp.WeaveWrapper.request_WeaveTree();//get the tree
				that.dataSources = that.request_Children();
			}
			else
				setTimeout(that.request_Tree, 800);
		};
		
		//any time a data source is added in weave, we need to get updated list of children
		that.request_Children = function(){
			//check if tree exists first
			var wApp = that.weaveWindow.weaveApp;
			var dSources;
			var dSourceNames;
			if(that.weave_tree){
				dSources = that.weave_tree.getChildren();//highest node in the tree i.e.datasources
				dSourceNames = wApp.WeaveWrapper.get_tree_Children_labels(dSources);
			}
			
			return dSourceNames;
		};
		
	};
})();