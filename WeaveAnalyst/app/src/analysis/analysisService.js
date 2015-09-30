/**
 * this is the service responsible for the analysis tab
 */
(function(){
	angular.module('weaveAnalyst.AnalysisModule').service('analysisService', analysisService);
	analysisService.$inject = ['$q', 'runQueryService', 'scriptManagementURL'];
	
	function analysisService ($q, runQueryService, scriptManagementURL){
		var that = this;
		
		that.cache = {
				scriptList : [],
				scriptMetadata :null
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