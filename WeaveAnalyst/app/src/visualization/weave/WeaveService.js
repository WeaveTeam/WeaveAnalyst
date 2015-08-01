var shanti;
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
		that.current_DataSource = {name: null, source: null};
		that.current_DataTable;
		that.dataTables;
		that.dataColumns;
		
		that.selected_data;
		
		/*{
		 * [DataSource1] : {
		 * 						[DataTable1] : {
		 * 											[column1] : {dataSourceName : null, metadata : null}
		 * 										}	
		 * 				    }
		 * 					.
		 * 					.
		 * 					.
		 * [DataSourceN] : {
		 * 						[column1] : {dataSourceName : null, metadata : null}
		 * 						[column2] : {dataSourceName : null, metadata : null}
		 * 						.
		 * 						.
		 * 					}
		 *}
		 * 
		 * look up for data sources, data tables and columns
		 * this datamap will be populated on request lazily
		 * */
		that.data_Map = {};
		
		
		
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
			var dSources;
			
			if(wApp.WeaveWrapper.check_WeaveReady()){//if weave is ready
				that.weave_tree = wApp.WeaveWrapper.request_WeaveTree();//get the tree
				dSources = that.weave_tree.getChildren();
				
				////////////////
				///DATASOURCES
				////////////////
				that.dataSources = that.process_Children(dSources);
				
			}
			else
				setTimeout(that.request_Tree, 800);
		};

		that.request_data = function(node){
			//var deferred = $q.defer();
			var children;
			//check if weave tree exists first
			if(!that.weave_tree)
				that.request_Tree();
			
			else{
				//check if datasource already in data map
				if (!that.data_Map.hasOwnProperty(node)){//if no fetch it from weave tree and populate data map 
					children = that.process_Children(node.source);
				}
				else{
				}
				
			}//end of else
			
			//return deferred.promise;
		};
		
		that.process_Children = function(node){
			var children;
			
			for (var t =0 ; t < node.length; t++){
					
				children = that.retrieve_Children(node[t]);//1. retrieve them
			}			
			shanti= children;

			//2. process them 
			return children;
		};
		
		that.retrieve_Children = function(node){
			var wApp = that.weaveWindow.weaveApp;
			var children;
			var weaveTreeIsBusy = wApp.WeaveWrapper.weave.evaluateExpression(null, '() => WeaveAPI.SessionManager.linkableObjectIsBusy(WEAVE_TREE_NODE_LOOKUP[0])');
			
			(function getting_Children(){
				if(weaveTreeIsBusy())
					setTimeout(getting_Children, 500);
				else{
					var c = node.getChildren();
					var label = node.getLabel();
					children = [{name : label, source : c}];
				}
			})(node);
			
			return children;
		};
		
		
	};
})();