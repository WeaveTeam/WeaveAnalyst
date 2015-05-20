/**
 * controls the attribute menu visualization tool  widget
 */
(function(){
	angular.module('weaveAnalyst.WeaveModule').controller("AttributeMenuController",AttributeMenuController );
	AttributeMenuController.$inject = ['$scope', 'WeaveService', '$timeout'];
	
	function AttributeMenuController ($scope, WeaveService, $timeout){

		var attCtrl = this;
		attCtrl.WeaveService = WeaveService;

		$scope.$watch('tool.selectedVizTool', function(){
			//console.log("tools selected", $scope.tool.selectedVizTool);
			if($scope.tool.selectedVizTool){
				$scope.vizAttributeColl = [];
				$scope.vizAttributeColl = WeaveService.getSelectableAttributes($scope.tool.title, $scope.tool.selectedVizTool);
			}
		});
		
		$scope.$watch('tool', function() {
			if($scope.toolId) // this gets triggered twice, the second time toolId with a undefined value.
				WeaveService.AttributeMenuTool($scope.tool, $scope.toolId);
		}, true);
		
		$scope.setAttributes = function(attr){
			if(attr)
				$scope.tool.chosenAttribute = attr;
			//check for tha attrbite selected
			if($scope.tool.vizAttribute && $scope.tool.selectedVizTool && $scope.tool.chosenAttribute)
				//set the attribute in weave
				WeaveService.setVizAttribute($scope.tool.title,
											  $scope.tool.selectedVizTool,
											  $scope.tool.vizAttribute,
											  $scope.tool.chosenAttribute);
		};
	}
})();