/**
 * directive for creating a geo filter
 */

angular.module('weaveAnalyst.AnalysisModule').directive('geoFilter', [function factory(){
	
	var directiveDefnObject = {
			restrict : 'E',
			require : 'ngModel',
			templateUrl : 'src/analysis/data_filters/geographyFilter.tpl.html',
			controller : function(){
				
				
				
			},
			link : function(scope, elem, attrs){
			
			}
			
	};
	
	return directiveDefnObject;
}]);

angular.module('weaveAnalyst.AnalysisModule').service('geoService', [function(){
	

}]);