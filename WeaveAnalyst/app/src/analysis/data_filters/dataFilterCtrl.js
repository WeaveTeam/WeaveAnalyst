AnalysisModule.controller('dataFilterCtrl', function($scope, queryService, WeaveService){
	
	var pathToFilters = ["defaultSubsetKeyFilter", "filters"];

	$scope.queryService = queryService;
	
	$scope.addCategoricalFilter = function() {
		// the values are the same as the index for convenience
		var weave = WeaveService.weave;
		if(weave && WeaveService.checkWeaveReady())
		{
			filterName = WeaveService.generateUniqueName("filter", pathToFilters);
			weave.path(pathToFilters).push(filterName).request("StringDataFilter");
			queryService.queryObject.categoricalFilters[filterName] = {};
		}
	};
	
	$scope.removeFilter = function(filterName, filterType) {
		
		var weave = WeaveService.weave;
		
		if(weave && WeaveService.checkWeaveReady())
		{
			weave.path(pathToFilters).push(filterName).remove();
			if(filterType == "categorical")
				delete queryService.queryObject.categoricalFilters[filterName];
			else 
				delete queryService.queryObject.rangeFilters[filterName];
		}
	};

	$scope.addRangeFilter = function() {
		
		var weave = WeaveService.weave;
		
		if(weave && WeaveService.checkWeaveReady())
		{
			// the values are the same as the index for convenience
			filterName = WeaveService.generateUniqueName("filter", pathToFilters);
			weave.path("defaultSubsetKeyFilter", "filters").push(filterName).request("NumberDataFilter");
			queryService.queryObject.rangeFilters[filterName] = {};
		}
	};
});