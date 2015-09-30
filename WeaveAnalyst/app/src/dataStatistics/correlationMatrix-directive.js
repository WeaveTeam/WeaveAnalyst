/**
 * this directive contains the UI and logic for the correlation Matrix
@author spurushe
 */
(function(){
	angular.module('weaveAnalyst.dataStatistics', []);
	angular.module('weaveAnalyst.dataStatistics').directive('correlationMatrix', heatMapComponent);
	
	function heatMapComponent (){
		return {
			restrict : 'E', 
			template : '<div id="corrMatrixContainer"></div>',
			scope : {
					data: '='
			},
			link: function(scope, elem, attrs){
				var dom_element_to_append_to = document.getElementById('corrMatrixContainer');
				var array1 = [1,6,9,4];
				var array2= [6.6,2,5,10];
				var array3= [2,7,8,1];
				var array4= [4,5,3,1.9];
				var array5= [1,3.4,5,10];
				var mydata = [array1, array2, array3, array4];
				var labels = ["one", "two", "three", "four"];
				
				
				var config = {
						data: mydata,
						labels : labels,
						container : dom_element_to_append_to
					};
					
					var hm = new window.wa.d3_viz.heatMap();//create
					hm.initialize_heatMap(config);//initialize
					hm.render_heatMap();//render
//					
				
//				scope.$watch(function(){
//					return scope.data;
//				}, function(){
//					if(scope.data){
//						var config = {
//							data: scope.data.input_data,
//							labels : scope.data.labels,
//							container : dom_element_to_append_to
//						};
//						
//						var hm = new window.wa.d3_viz.heatMap();//create
//						hm.initialize_heatMap(config);//initialize
//						hm.render_heatMap();//render
//					}
//				});
				

			}//end of link function

		};
	}//end of directive defintion
})();

