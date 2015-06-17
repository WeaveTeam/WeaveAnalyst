AnalysisModule.controller('dataFilterCtrl', function($scope, queryService, WeaveService){
	
	var pathToFilters = ["scriptKeyFilter", "filters"];
	
	var initKeyFilter = function() {
		if(WeaveService.checkWeaveReady()) {
			WeaveService.path("scriptKeyFilter").request("KeyFilter");
			return true;
		}
		return false;
	};
	
	$scope.queryService = queryService;
	
	$scope.addCategoricalFilter = function() {
		// the values are the same as the index for convenience
		var weave = WeaveService.weave;
		
		// make sure weave is ready and that we have the keyFilter in the session state
		if(initKeyFilter())
		{
			filterName = WeaveService.generateUniqueName("filter", pathToFilters);
			weave.path(pathToFilters).push(filterName).request("StringDataFilter");
			
			if(!queryService.queryObject.categoricalFilters[filterName])
				queryService.queryObject.categoricalFilters[filterName] = {};
		}
	};
	
	$scope.removeFilter = function(filterName, filterType) {
		
		var weave = WeaveService.weave;
		
		if(initKeyFilter())
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
		
		if(initKeyFilter())
		{
			// the values are the same as the index for convenience
			filterName = WeaveService.generateUniqueName("filter", pathToFilters);
			weave.path(pathToFilters).push(filterName).request("StringDataFilter");
			if(!queryService.queryObject.rangeFilters[filterName])
				queryService.queryObject.rangeFilters[filterName] = {};
		}
	};
});