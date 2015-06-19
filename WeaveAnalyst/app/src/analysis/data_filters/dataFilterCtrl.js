AnalysisModule.controller('dataFilterCtrl', function($scope, queryService, WeaveService){
	
	$scope.queryService = queryService;
	
	$scope.addCategoricalFilter = function() {
		// the values are the same as the index for convenience
		var pathToFilters = WeaveService.getPathToFilters();
		
		// make sure weave is ready and that we have the keyFilter in the session state
		if(pathToFilters)
		{
			filterName = WeaveService.generateUniqueName("filter", pathToFilters.getPath());
			pathToFilters.push(filterName).request("StringDataFilter");
			if(!queryService.queryObject.categoricalFilters[filterName])
				queryService.queryObject.categoricalFilters[filterName] = {};
		}
	};
	
	$scope.removeFilter = function(filterName, filterType) {
		
		var pathToFilters = WeaveService.getPathToFilters();
		
		if(pathToFilters)
		{
			pathToFilters.push(filterName).remove();
			if(filterType == "categorical")
				delete queryService.queryObject.categoricalFilters[filterName];
			else 
				delete queryService.queryObject.rangeFilters[filterName];
		}
	};

	$scope.addRangeFilter = function() {
		
		var pathToFilters = WeaveService.getPathToFilters();
		
		// make sure weave is ready and that we have the keyFilter in the session state
		if(pathToFilters)
		{
			// the values are the same as the index for convenience
			filterName = WeaveService.generateUniqueName("filter", pathToFilters.getPath());
			pathToFilters.push(filterName).request("NumberDataFilter");
			if(!queryService.queryObject.rangeFilters[filterName])
				queryService.queryObject.rangeFilters[filterName] = {};
		}
	};
});