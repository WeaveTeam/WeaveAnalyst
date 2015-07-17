/**
 * controls the scatter plot visualization tool  widget
 */

(function(){
	
	angular.module('weaveApp').directive('scatterPlot', scatterPlot);
	
	function scatterPlot (){
		return {
			restrict: 'E',
			scope:{},
			templateUrl:'tools/scatterPlot/scatter_plot.tpl.html', 
			controller : scatter_plotController,
			controllerAs : 'spCtrl',
			bindToController: true,
			link: function(){
				
			}
		};//directive definition object
	}
	
	function scatter_plotController (){
		var spCtrl = this;
		
		spCtrl.items = ['a','d'];
		
		spCtrl.config = {
			X : null,
			Y : null
		};
	};
	
})();