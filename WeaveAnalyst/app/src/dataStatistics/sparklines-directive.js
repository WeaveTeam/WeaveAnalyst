/**
 * this directive contains the UI and logic for the sparklines drawn for each numerical column
 */

angular.module('weaveAnalyst.dataStatistics').directive('sparkLines',[ function factory(){
	var directiveDefnObj= {
			restrict: 'EA',
			scope : {
				
					//data: '='//data that describes the column breaks and column counts in each bin for each numerical column !! gets populated asyncronously
			},
			templateUrl: '<div id = "singleContainer" style = "width:100%; height:93%; overflow-y: scroll; background-color:white;opacity:0.5; border : 1px solid #999191"></div>',
			controller : function(){
				
				
			},
			link: function(scope, elem, attrs){
								
			}//end of link function
	};
	
	return directiveDefnObj;
}]);

