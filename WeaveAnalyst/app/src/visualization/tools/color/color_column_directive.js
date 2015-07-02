/**
 * 
 */
AnalysisModule.directive('colorColumnSelector', ['WeaveService',  function factory(WeaveService, queryService){
	
	var directiveDefnObj= {
			restrict: 'A',
			templateUrl: 'src/visualization/tools/color/color_Column_new.html',
			scope:{
				
			},

			controller : function($scope, WeaveService, queryService){
				$scope.queryService = queryService;
				$scope.geometryLayers = {};

				$scope.colorGroup = {};
				$scope.color = {};
				
				$scope.setColorGroup = function(layer){
					
					if(layer.group && layer.column){
						
						WeaveService.setColorGroup($scope.toolname, 
													$scope.plotname,
												   layer.group,
												   layer.column);
					}
				};
				
				$scope.getColorGroups = function(){
					if(WeaveService.checkWeaveReady()){
						$scope.colorGroups = WeaveService.getColorGroups();
					}
					else{
						setTimeout($scope.getColorGroups, 50, window);
					}
				};
				
				$scope.getColorGroups();
				
			},
			link: function(scope, elem, attrs){
				
				//scope.plotname =  scope.$eval(attrs["plotname"]);
				scope.plotname = attrs["plotname"];
				
				
				scope.geometryLayers[scope.plotname] = {group :"Select group...", column:null};
				
				scope.toolname = attrs["toolname"];
								
			}//end of link function
	};
	
	return directiveDefnObj;
}]);