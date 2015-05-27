/**
 * controls the datatable visualization tool  widget
 */

AnalysisModule.controller("DataTableCtrl", function($scope, WeaveService, queryService) {

	$scope.WeaveService = WeaveService;

	$scope.addRemoveAllLabel = "add all";
	
	$scope.$watch('tool', function() {
		if($scope.toolId) // this gets triggered twice, the second time toolId with a undefined value.
			WeaveService.DataTableTool($scope.tool, $scope.toolId);
	}, true);
	
	$scope.addRemoveAll = function() {
		if($scope.addRemoveAllLabel == "add all") {
			$scope.tool.columns = queryService.cache.columns;
			$scope.addRemoveAllLabel = "remove all";
		} else if ($scope.addRemoveAllLabel == "remove all") {
			$scope.tool.columns = [];
			$scope.addRemoveAllLabel = "add all";
		}
	};
}); 