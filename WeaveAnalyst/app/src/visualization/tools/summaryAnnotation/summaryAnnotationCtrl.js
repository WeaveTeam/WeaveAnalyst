/**
 * controls the scatter plot visualization tool  widget
 */

AnalysisModule.controller("SummaryAnnotationCtrl", function($scope,  AnalysisService, WeaveService) {

	$scope.WeaveService = WeaveService;

	$scope.$watch('tool', function() {
		if($scope.toolId) // this gets triggered twice, the second time toolId with a undefined value.
		{
			if ($scope.tool.generated)
			{
				// TODO: Call the content generation here.
				$scope.tool.content = "Generated Content @ " + Math.floor(new Date().getTime()/1000);
			}
			WeaveService.SummaryAnnotation($scope.tool, $scope.toolId);
		}
	}, true);
});