/**
 * directive for creating a geo filter
 */

AnalysisModule.directive('geoFilter', [function factory(){
	
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

AnalysisModule.service('geoService', [function(){
	

}]);