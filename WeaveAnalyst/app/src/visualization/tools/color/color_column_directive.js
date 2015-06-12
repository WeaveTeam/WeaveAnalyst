/**
 * 
 */
AnalysisModule.directive('colorColumn', ['WeaveService',  function factory(WeaveService){
	
	var directiveDefnObj= {
			restrict: 'E',
			templateUrl: 'src/visualization/tools/color/color_Column_new.html',
			controller : function($scope, WeaveService){
				
				$scope.$watch('colorColumn', function(){
					//if(colorColumn)
						WeaveService.ColorColumn($scope.colorColumn, $scope.tool);
				});
			},
			link: function(scope, elem, attrs){
				
								
			}//end of link function
	};
	
	return directiveDefnObj;
}]);