/**
 * controls the weave data filter visualization tool  widget
 */
AnalysisModule.controller("DataFilterCtrl", function($scope, WeaveService, queryService) {

	$scope.WeaveService = WeaveService;

	$scope.$watch('tool', function() {
		if($scope.toolId) // this gets triggered twice, the second time toolId with a undefined value.
			WeaveService.DataFilterTool($scope.tool, $scope.toolId);
	}, true);
	
}); 