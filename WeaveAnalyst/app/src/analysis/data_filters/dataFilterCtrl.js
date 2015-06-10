AnalysisModule.controller('dataFilterCtrl', function($scope, queryService, WeaveService){
	
	
	var weave = WeaveService.weave;
	var pathToFilters = ["defaultSubsetKeyFilter", "filters"];
	
	$scope.$watch(function() {
		return WeaveService.weave;
	}, function() {
		weave = WeaveService.weave;
	});
	
	$scope.queryService = queryService;
	
	$scope.addCategoricalFilter = function() {
		// the values are the same as the index for convenience
		if(!weave)
			return;
		filterName = WeaveService.generateUniqueName("filter", pathToFilters);
		weave.path(pathToFilters).push(filterName).request("StringDataFilter");
		queryService.queryObject.filters[filterName] = {};
	};
	
	$scope.removeFilter = function(filterName) {
		if(!weave)
			return;
		weave.path(pathToFilters).push(filterName).remove();
		delete queryService.queryObject.filters[filterName];
	};

	$scope.addContinuousFilter = function() {
		if(!weave)
			return;
		// the values are the same as the index for convenience
		filterName = WeaveService.generateUniqueName("filter");
		weave.path("defaultSubsetKeyFilter", "filters").push(filterName).request("NumberDataFilter");
		queryService.queryObject.filters[filterName] = {};
	};
});