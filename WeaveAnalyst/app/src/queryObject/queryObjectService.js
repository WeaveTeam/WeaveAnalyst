'use strict';
/**
 * Query Object Service provides access to the main "singleton" query object.
 *
 * Don't worry, it will be possible to manage more than one query object in the
 * future.
 */
angular.module("weaveAnalyst.queryObject", []);
//using value recipes so that these tools could be used elsewhere as well TODO: make them into directives
angular.module("weaveAnalyst.queryObject").value('indicator_tool', {
												title : 'Indicator',
												template_url : 'src/analysis/indicator/indicator.tpl.html',
												description : 'Choose an Indicator for the Analysis',
												category : 'indicatorfilter'
});

angular.module("weaveAnalyst.queryObject").value('geoFilter_tool',{
										title : 'Geography Filter',
										template_url : 'src/analysis/data_filters/geographyFilter.tpl.html',
										description : 'Filter data by States and Counties',
										category : 'datafilter'
});

angular.module("weaveAnalyst.queryObject").value('timeFilter_tool', {
											title : 'Time Period Filter',
											template_url : 'src/analysis/data_filters/time_period.tpl.html',
											description : 'Filter data by Time Period',
											category : 'datafilter'
});

angular.module("weaveAnalyst.queryObject").value('byVariableFilter_tool', {
													title : 'By Variable Filter',
													template_url : 'src/analysis/data_filters/by_variable.tpl.html',
													description : 'Filter data by Variables',
													category : 'datafilter'
});

angular.module("weaveAnalyst.queryObject").value('BarChartTool',{
										id : 'BarChartTool',
										title : 'Bar Chart Tool',
										template_url : 'src/visualization/tools/barChart/bar_chart.tpl.html'

});

angular.module("weaveAnalyst.queryObject").value('MapTool', {
									id : 'MapTool',
									title : 'Map Tool',
									template_url : 'src/visualization/tools/mapChart/map_chart.tpl.html'
});

angular.module("weaveAnalyst.queryObject").value('ScatterPlotTool', {
											id : 'ScatterPlotTool',
											title : 'Scatter Plot Tool',
											template_url : 'src/visualization/tools/scatterPlot/scatter_plot.tpl.html',
											description : 'Display a Scatter Plot in Weave'
});

angular.module("weaveAnalyst.queryObject").value('DataTableTool', {
											id : 'DataTableTool',
											title : 'Data Table Tool',
											template_url : 'src/visualization/tools/dataTable/data_table.tpl.html',
											description : 'Display a Data Table in Weave'
});

angular.module("weaveAnalyst.queryObject").value('color_Column', {	
											id : 'color_Column',
											title : 'Color Column',
											template_url : 'src/visualization/tools/color/color_Column.tpl.html',
											description : 'Set the color column in Weave'
});


angular.module("weaveAnalyst.queryObject").value('key_Column', {
										id : 'Key_Column', 
										title : 'Key Column',
										template_url : 'src/visualization/tools/color/key_Column.tpl.html',
										description : 'Set the key column in Weave'
});
angular.module("weaveAnalyst.queryObject").service('runQueryService', [ 'errorLogService','usSpinnerService','$modal', function(errorLogService, usSpinnerService, $modal){
	/**
	 * This function is a wrapper for making a request to a JSON RPC servlet
	 * 
	 * @param {string} url
	 * @param {string} method The method name to be passed to the servlet
	 * @param {?Array|Object} params An array of object to be passed as parameters to the method 
	 * @param {Function} resultHandler A callback function that handles the servlet result
	 * @param {string|number=}queryId
	 * @see aws.addBusyListener
	 */
	
	this.queryRequest = function(url, method, params, resultHandler, errorHandler, queryId)
	{
	    var request = {
	        jsonrpc: "2.0",
	        id: queryId || "no_id",
	        method: method,
	        params: params
	    };
	    
	    $.post(url, JSON.stringify(request), handleResponse, "text");

	    function handleResponse(response)
	    {
	    	// parse result for target window to use correct Array implementation
	    	response = JSON.parse(response);
	    	
	        if (response.error)
	        {	
	        	console.log(JSON.stringify(response, null, 3));
	        	//log the error
	        	errorLogService.logInErrorLog(response.error.message);
	        	//open the error log
	        	$modal.open(errorLogService.errorLogModalOptions);
	        	if(errorHandler){
	        		return errorHandler(response.error, queryId);
	        	}
	        }
	        else if (resultHandler){
	            return resultHandler(response.result, queryId);
	        }
	    }
	};
	
	/**
	 * Makes a batch request to a JSON RPC 2.0 service. This function requires jQuery for the $.post() functionality.
	 * @param {string} url The URL of the service.
	 * @param {string} method Name of the method to call on the server for each entry in the queryIdToParams mapping.
	 * @param {Array|Object} queryIdToParams A mapping from queryId to RPC parameters.
	 * @param {function(Array|Object)} resultsHandler Receives a mapping from queryId to RPC result.
	 */
	this.bulkQueryRequest = function(url, method, queryIdToParams, resultsHandler)
	{
		var batch = [];
		for (var queryId in queryIdToParams)
			batch.push({jsonrpc: "2.0", id: queryId, method: method, params: queryIdToParams[queryId]});
		$.post(url, JSON.stringify(batch), handleBatch, "json");
		function handleBatch(batchResponse)
		{
			var results = Array.isArray(queryIdToParams) ? [] : {};
			for (var i in batchResponse)
			{
				var response = batchResponse[i];
				if (response.error)
					console.log(JSON.stringify(response, null, 3));
				else
					results[response.id] = response.result;
			}
			if (resultsHandler)
				resultsHandler(results);
		}
	};
	
}]);


angular.module("weaveAnalyst.queryObject").service("queryService", ['$q', '$rootScope', 'runQueryService',
                                     'dataServiceURL', 'adminServiceURL','projectManagementURL', 'scriptManagementURL','computationServiceURL',
                                     'BarChartTool', 'MapTool', 'DataTableTool', 'ScatterPlotTool', 'color_Column', 'key_Column','WeaveDataSource',
                         function($q, scope, runQueryService, 
                        		 dataServiceURL, adminServiceURL, projectManagementURL, scriptManagementURL, computationServiceURL,
                        		 BarChartTool, MapTool, DataTableTool, ScatterPlotTool, color_Column, key_Column, WeaveDataSource) {
	
	var that = this; // point to this for async responses
	
	this.cache = {
			columns : [],
			dataTableList : [],
			scriptList : [],
			filterArray : [],
			numericalColumns : []
	};
	
	/**
	  * This function makes nested async calls to the aws function getEntityChildIds and
	  * getDataColumnEntities in order to get an array of dataColumnEntities children of the given id.
	  * We use angular deferred/promises so that the UI asynchronously wait for the data to be available...
	  */
	this.getDataColumnsEntitiesFromId = function(id, forceUpdate) {
		
		var deferred = $q.defer();

		if(!forceUpdate) {
			return that.cache.columns;
		} else {
			if(id) {
				runQueryService.queryRequest(dataServiceURL, "getEntityChildIds", [id], function(idsArray) {
					//console.log("idsArray", idsArray);
					runQueryService.queryRequest(dataServiceURL, "getEntitiesById", [idsArray], function (dataEntityArray){
						//console.log("dataEntirtyArray", dataEntityArray);
						//console.log("columns", that.cache.columnsb);
						
						that.cache.numericalColumns = [];//collects numerical columns for statistics calculation
						
						that.cache.columns = $.map(dataEntityArray, function(entity) {
							if(entity.publicMetadata.hasOwnProperty("aws_metadata")) {//will work if the column already has the aws_metadata as part of its public metadata
								var metadata = angular.fromJson(entity.publicMetadata.aws_metadata);
								
								if(metadata.hasOwnProperty("columnType")) {
									var columnObject = {};
									columnObject.id = entity.id;
									columnObject.title = entity.publicMetadata.title;
									columnObject.columnType = metadata.columnType;
									columnObject.varType = metadata.varType;
									columnObject.description = metadata.description || "";
									columnObject.dataSourceName = WeaveDataSource;
									
									if(metadata.varRange)
										columnObject.varRange = metadata.varRange;
//									//pick all numerical columns and create a matrix
									if(metadata.varRange && (metadata.varType == "continuous") && (metadata.columnType != "geography"))
										{
											that.cache.numericalColumns.push(columnObject);
										}
									return columnObject;

								}
								else//handling an empty aws-metadata object 
									{
									
										var columnObject = {};
										columnObject.id = entity.id;
										columnObject.title = entity.publicMetadata.title;
										columnObject.columnType = "";
										columnObject.description =  "";
										columnObject.dataSourceName = WeaveDataSource;
										
										return columnObject;
									}
								
							}
							else{//if its doesnt have aws_metadata as part of its public metadata, create a partial aws_metadata object
								
									var columnObject = {};
									columnObject.id = entity.id;
									columnObject.title = entity.publicMetadata.title;
									columnObject.dataType = entity.publicMetadata.dataType;
									columnObject.entityType = entity.publicMetadata.entityType;
									columnObject.keyType = entity.publicMetadata.keyType;
									columnObject.columnType = "";
									columnObject.description =  "";
									columnObject.dataSourceName = WeaveDataSource;
									
									return columnObject;
								
							}
						});
						scope.$safeApply(function() {
							deferred.resolve(that.cache.columns);
						});
					},
					function(error) {
						scope.$safeApply(function() {
							deffered.reject(error);
						});
					});
				});
				
			}
		}
       return deferred.promise;
   };
   
   this.getEntitiesById = function(idsArray, forceUpdate) {
   	
   	var deferred = $q.defer();

		if(!forceUpdate) {
			return that.cache.dataColumnEntities;
		} else {
			if(idsArray) {
				runQueryService.queryRequest(dataServiceURL, "getEntitiesById", [idsArray], function (dataEntityArray){
					that.cache.dataColumnEntities = dataEntityArray;
					
					scope.$safeApply(function() {
						deferred.resolve(dataEntityArray);
					});
				},
				function(error) {
					scope.$safeApply(function() {
						deferred.reject(error);
					});
				});
			}
		}
		
       return deferred.promise;
   	
   };
       
       
   /**
	  * This function makes nested async calls to the aws function getEntityIdsByMetadata and
	  * getDataColumnEntities in order to get an array of dataColumnEntities children that have metadata of type geometry.
	  * We use angular deferred/promises so that the UI asynchronously wait for the data to be available...
	  */
	this.getGeometryDataColumnsEntities = function(forceUpdate) {

		var deferred = $q.defer();

		if(!forceUpdate) {
			return that.cache.geometryColumns;
		}
		
		runQueryService.queryRequest(dataServiceURL, 'getEntityIdsByMetadata', [{"dataType" :"geometry"}, 1], function(idsArray){
			runQueryService.queryRequest(dataServiceURL, 'getEntitiesById', [idsArray], function(dataEntityArray){
				that.cache.geometryColumns = $.map(dataEntityArray, function(entity) {
					return {
						id : entity.id,
						title : entity.publicMetadata.title,
						keyType : entity.publicMetadata.keyType,
						dataType : entity.publicMetadata.dataType,
						geometry : entity.publicMetadata.geometry,
						projection: entity.publicMetadata.projection,
						dataSourceName : WeaveDataSource
					};
				});
				scope.$safeApply(function() {
					deferred.resolve(that.cache.geometryColumns);
				});
			}, function(error) {
				scope.$safeApply(function() {
					deferred.reject(error);
				});
			});
		});

		return deferred.promise;
   };
   
	/**
     * This function wraps the async aws getDataTableList to get the list of all data tables
     * again angular defer/promise so that the UI asynchronously wait for the data to be available...
     */
    this.getDataTableList = function(forceUpdate){
    	var deferred = $q.defer();

    	if(!forceUpdate) {
			return that.cache.dataTableList;
    	} else {
    		runQueryService.queryRequest(dataServiceURL, 'getDataTableList', null, function(EntityHierarchyInfoArray){
    			that.cache.dataTableList = EntityHierarchyInfoArray;
    			scope.$safeApply(function() {
    				deferred.resolve(that.cache.dataTableList);
    			});
    		 }, function(error){
    			 scope.$safeApply(function() {
    				 deferred.reject(error);
    			 });
    		 });
    	}
        return deferred.promise;
    };
}]);
