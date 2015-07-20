/**
 * this is the service responsible for the analysis tab
 */
(function(){
	angular.module('weaveAnalyst.AnalysisModule').service('analysisService', analysisService);
	analysisService.$inject = ['$q', '$rootScope', 'queryService', 'runQueryService', 'scriptManagementURL'];
	
	function analysisService ($q, rootScope, queryService, runQueryService, scriptManagementURL){
		var that = this;
		
		that.activeNode = null;
		that.selectedItems = [];
		that.selectedValue = {};
		that.expandedNodes = null;
		that.scrolledPosition = 0;
		
		that.cache = {
				scriptList : [],
				scriptMetadata :null
		};
		
		//fetching datatables
		queryService.getDataTableList(true);
		
		that.buildTree = function (node, key) {
			return {
				title : key,
				value : node,
				select : that.activeNode ? node == that.activeNode.data.value : false,
				expand : that.expandedNodes && that.expandedNodes.indexOf(node) >= 0,
				isFolder : !!(typeof node == 'object' && node),
				children : (typeof node == 'object' && node)
					? Object.keys(node).map(function(key) { return that.buildTree(node[key], key); })
					: null
			};	
		};
		

		that.convertToTableFormat = function  (obj) {
			var data = [];
			for (var key in obj) {
				data.push({property : key, value : angular.toJson(obj[key])});
			}
			return data;
		};

		 that.getPath = function (node) {
			var path = [];
			while (node.parent)
			{
				path.unshift(node.data.title);
				node = node.parent;
			}
			return path;
		};
		
		that.setValueAtPath = function (obj, path, value)
		{
			path.shift(); // throw away root
			
			for (var i = 0; i < path.length - 1; i++)
		        obj = obj[path[i]];

		    obj[path[i]] = value;
		};
		
		
		/**
	     * This function wraps the async aws getListOfScripts function into an angular defer/promise
	     * So that the UI asynchronously wait for the data to be available...
	     */
	    that.getListOfScripts = function(forceUpdate, compEngine) {
	    	if(!forceUpdate) {
				return that.cache.scriptList;
	    	} else {
	    		switch(compEngine){
	    			case ("R"):
	    				runQueryService.queryRequest(scriptManagementURL, 'getListOfRScripts', null, function(result){
	    					that.cache.scriptList = [];
	    	    			that.cache.scriptList = result;
	    	    		});	
	    			break;
	    			case("STATA"):
	    				runQueryService.queryRequest(scriptManagementURL, 'getListOfStataScripts', null, function(result){
	    					that.cache.scriptList = [];
	    	    			that.cache.scriptList = result;
	    	    		});	
	    			break;
	    			default:
	    				that.cache.scriptList = [];
	    		}
	    		
	    	}
	    };

	    
		/**
	     * This function wraps the async aws getListOfScripts function into an angular defer/promise
	     * So that the UI asynchronously wait for the data to be available...
	     */
	    that.getScriptMetadata = function(scriptName, forceUpdate) {
	        
	    	var deferred = $q.defer();

	    	if (!forceUpdate) {
	    		return this.cache.scriptMetadata;
	    	}
	    	if(scriptName) {
	    		runQueryService.queryRequest(scriptManagementURL, 
	    									'getScriptMetadata', 
	    									[scriptName], 
	    									function(result){
								    			that.cache.scriptMetadata = result;
								    				deferred.resolve(that.cache.scriptMetadata);
	    									},
	    									function(error){
	    											deferred.reject(error);
	    									});
	    	}
	        return deferred.promise;
	    };

		
		
	};
})();