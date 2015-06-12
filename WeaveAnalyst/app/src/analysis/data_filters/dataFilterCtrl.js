AnalysisModule.controller('dataFilterCtrl', function($scope, queryService, WeaveService){
	
	
	var weave = WeaveService.weave;
	var pathToFilters = ["defaultSubsetKeyFilter", "filters"];
	
//	$scope.$watch(function() {
//		return WeaveService.weave;
//	}, function() {
//		weave = WeaveService.weave;
//	});
	
	$scope.queryService = queryService;
	
	$scope.addCategoricalFilter = function() {
		// the values are the same as the index for convenience
		if(!weave)
			return;
		filterName = WeaveService.generateUniqueName("filter", pathToFilters);
		weave.path(pathToFilters).push(filterName).request("StringDataFilter");
		queryService.queryObject.categoricalFilters[filterName] = {};
	};
	
	$scope.removeFilter = function(filterName, filterType) {
		if(!weave)
			return;
		weave.path(pathToFilters).push(filterName).remove();
		if(filterType == "categorical")
			delete queryService.queryObject.categoricalFilters[filterName];
		else 
			delete queryService.queryObject.rangeFilters[filterName];
	};

	$scope.addRangeFilter = function() {
		if(!weave)
			return;
		// the values are the same as the index for convenience
		filterName = WeaveService.generateUniqueName("filter", pathToFilters);
		weave.path("defaultSubsetKeyFilter", "filters").push(filterName).request("NumberDataFilter");
		queryService.queryObject.rangeFilters[filterName] = {};
	};
});