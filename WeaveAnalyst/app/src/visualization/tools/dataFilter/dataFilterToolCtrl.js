/**
 * controls the weave data filter visualization tool  widget
 */
AnalysisModule.controller("DataFilterToolCtrl", function($scope, WeaveService, queryService) {

	$scope.WeaveService = WeaveService;

	$scope.layoutModes = [ {value : "List", label : "List"},
	                       {value : "ComboBox", label : "Combo box"}, 
	                       {value : "VSlider", label : "Vertical Slider"},
	                       {value : "HSlider", label : "Horizontal Slider"},
	                       {value : "CheckBoxList", label : "Checklist"}
	                     ];
	
	// initialize the filterStyle variable
	$scope.tool ? $scope.tool.filterStyle = "Discrete values" : $scope.tool = { filterStyle : "Discrete values"};
	
	$scope.tool.layoutMode = {value : "HSlider", label : "Horizontal Slider"};
	
	$scope.toggleFiterStyle = function() {
		if($scope.tool.filterStyle == "Discrete values") {
			$scope.tool.filterStyle = "Continuous Range";
		}
		else
			$scope.tool.filterStyle = "Discrete values";
	};
	
	$scope.$watch('tool', function() {
		if($scope.toolId) // this gets triggered twice, the second time toolId with a undefined value.
			WeaveService.DataFilterTool($scope.tool, $scope.toolId);
	}, true);
	
}); 