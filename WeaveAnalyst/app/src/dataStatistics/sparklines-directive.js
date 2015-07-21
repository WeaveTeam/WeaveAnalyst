/**
 * this directive contains the UI and logic for the sparklines drawn for each numerical column
 */

angular.module('weaveAnalyst.dataStatistics').directive('sparkLines',[ function factory(){
	var directiveDefnObj= {
			restrict: 'EA',
			scope : {
				
					//data: '='//data that describes the column breaks and column counts in each bin for each numerical column !! gets populated asyncronously
			},
			template: '<div id = "sparklineContainer"></div>',
			controller : function(){
				
				
			},
			link: function(scope, elem, attrs){
								
			}//end of link function
	};
	
	return directiveDefnObj;
}]);

