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
				
				that.process_Children(dSources);
			}
			else
				setTimeout(that.request_Tree, 800);
		};

		that.request_data = function(node){
			var children;
			//check if weave tree exists first
			if(!that.weave_tree)
				that.request_Tree();
			
			else{
					children = that.process_Children(node.source);
				
			}//end of else
		};
		
		//TODO merge this with retrieve_children funct
		that.retrieve_Columns = function(node){
			var wApp = that.weaveWindow.weaveApp;
			that.dataColumns = [];
			node.getChildren();
			
			that.get_Children_Busy(node).then(function(result_nodes){//fetches the columns
				var col_nodes = result_nodes[0].source;
				
				var weaveTreeIsBusy = wApp.WeaveWrapper.weave.evaluateExpression(null, '() => WeaveAPI.SessionManager.linkableObjectIsBusy(WEAVE_TREE_NODE_LOOKUP[0])');
				
				
				for(var t =0; t < col_nodes.length; t++){
					get_metadata(col_nodes[t], t);
				}
				
				
				function get_metadata(node, index){
					if(weaveTreeIsBusy())
						setTimeout(get_metadata.bind(null, node, index), 500);
					else{
						that.dataColumns[index] = {
								dataSource : node.getDataSourceName(),
								metadata : node.getColumnMetadata()
						};
						
					}
				};
				
				shanti = that.dataColumns;
				////////////////
				///DATA COLUMNS
				////////////////
				//that.dataColumns = result; 
			});
			
		};
		
		
		
		//var weaveTreeIsBusy = null;
		
		that.get_Children_Busy = function(node){
			var deferred = $q.defer();
			var wApp = that.weaveWindow.weaveApp;
			var weaveTreeIsBusy = wApp.WeaveWrapper.weave.evaluateExpression(null, '() => WeaveAPI.SessionManager.linkableObjectIsBusy(WEAVE_TREE_NODE_LOOKUP[0])');
			var children;

			(function yyy (node){
				if(weaveTreeIsBusy()){
					console.log("busy");
					setTimeout(yyy.bind(null, node), 200);
				}
				else{
					var c = node.getChildren();
					var label = node.getLabel();
					children = [{name : label, source : c}];
					deferred.resolve(children);
				}
			})(node);
			
			console.log("children", children);
			return deferred.promise;
		};
		
		that.process_Children = function(node){
			var children;
			var wApp = that.weaveWindow.weaveApp;
			var weaveTreeIsBusy = wApp.WeaveWrapper.weave.evaluateExpression(null, '() => WeaveAPI.SessionManager.linkableObjectIsBusy(WEAVE_TREE_NODE_LOOKUP[0])');
			
			if(node.length){//if the node has several source
				for (var t =0 ; t < node.length; t++){
					that.get_Children_Busy(node[t]).then(function(children){//1. retrieve them

						//if(children){
							//2. process them
							switch (children[0].name){
								////////////////
								///DATATABLES
								////////////////
								case "Data Tables" :
								that.dataTables = that.format_Tree_Objects(children[0].source);
								break;
								////////////////
								///DATASOURCES
								////////////////	
								case "WeaveDataSource":
								that.dataSources = children;
							}
							//process geometry collections
							//other types of data sources
							//etc
						//}
					});
				}			
			}
			else{
				children = that.retrieve_Children(node);//1. retrieve them
			}

			return children;
		};
		
		that.format_Tree_Objects = function(tree_Object){
			var formatted = [];
			for(var f =0; f < tree_Object.length; f++){
				formatted[f] = {name : tree_Object[f].getLabel(), source : tree_Object[f]};
			}
			return formatted;
		};
		
	};
})();