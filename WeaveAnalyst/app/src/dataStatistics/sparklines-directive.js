/**
 * this directive contains the UI and logic for the sparklines drawn for each numerical column
@author spurushe
 */

(function(){
	
	angular.module('weaveAnalyst.dataStatistics').directive('sparkLines', sparkLinesComponent);
	
	function sparkLinesComponent (){
		return{
			restrict: 'EA',
			scope : {
				
					data: '='//data that describes the column breaks and column counts in each bin for each numerical column !! gets populated asyncronously
			},
			template: '<div id = "sparklineContainer"></div>',
			//TODO will have individual controller for more advanced interaction with sparkline
			link: function(scope, elem, attrs){
				
				var dom_element_to_append_to = document.getElementById('sparklineContainer');
				
				//TODO try getting rid of this watch
				scope.$watch(function(){
					return scope.data;//the data used for  creatign sparklines
				}, function(){
					if(scope.data){
						if(scope.data.breaks.length > 1){
							//console.log("got it", scope.data);
							for(var i in scope.data.counts){
								
								//service call for drawing one sparkline one/column
								var config ={
										container : dom_element_to_append_to,
										width: 60,
										height:60,
										breaks : scope.data.breaks, 
										counts: scope.data.counts[i],
										title : i
								};
								
								
								var sl = new window.wa.d3_viz.sparkLine();//create
								sl.initialze_sparkLine(config);//initialize
								sl.render_sparkLine();//render
								
							}
						}
					}
				});			
			}//end of link function
		};//enf of directive definition object
	};
			
})();