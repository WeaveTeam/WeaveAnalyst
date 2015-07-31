(function(){
	angular.module('weaveAnalyst.WeaveModule', []);
	
	angular.module('weaveAnalyst.WeaveModule').service('WeaveService', WeaveService);
	
	WeaveService.$inject = ['$q','$window','queryService'];
	function WeaveService ($q,$window, queryService){
		var that = this;
		that.weaveWindow;
		that.wWrapper;
		that.weave_tree;//so that the tree can be retrieved anywhere in the app by simply injecting this service
		
		that.blah = "bujumbarra";
		that.dataSources;
		that.current_DataSource;
		that.current_DataTable;
		that.dataTables;
		that.dataColumns;
		
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
		
		//retrieves tables from a weavedataSurce
		that.request_Tables = function(dataSource){
			var wApp = that.weaveWindow.weaveApp;
			if(that.current_DataSource != dataSource){//if diff fetch tables
				that.dataTables = wApp.WeaveWrapper.get_tree_Children_labels(dataSource);
				console.log("fetching new list");
				that.current_DataSource = dataSource;//set to new selected datasource
			}
			
			console.log("fetching old list");
			return that.dataTables;
		};
		
		//retreives columns from a CSVDataSource or WeaveAnalystDataSource or a table from WeaveDatSource
		that.request_Columns = function(source_node){
			var wApp = that.weaveWindow.weaveApp;
			if(that.current_DataTable != source_node){//if diff fetch columns
				that.dataColumns = wApp.WeaveWrapper.get_tree_Children_labels(source_node);
				console.log("fetching new list");
				that.current_DataTable = source_node;
			}
			
			console.log("fetching old list");
			return that.dataColumns;
			
		};
	};
})();