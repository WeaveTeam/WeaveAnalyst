/**
 * 
 */
AnalysisModule.directive('colorColumnSelector', ['WeaveService',  function factory(WeaveService){
	
	var directiveDefnObj= {
			restrict: 'E',
			templateUrl: 'src/visualization/tools/color/color_Column_new.html',
			controller : function($scope, WeaveService){

				$scope.color = {colorColumn : ""};
				
				$scope.setColorColumn = function(){
					console.log("colorColumn", $scope.color.colorColumn);
					WeaveService.ColorColumn($scope.color.colorColumn, $scope.tool);
				};
			},
			link: function(scope, elem, attrs){
				
								
			}//end of link function
	};
	
	return directiveDefnObj;
}]);