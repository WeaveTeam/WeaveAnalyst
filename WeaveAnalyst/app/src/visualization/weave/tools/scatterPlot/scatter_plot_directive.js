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
		var weave_wrapper;
		
		spCtrl.request_scatterPlot = request_scatterPlot;
		spCtrl.items = ['a','d'];
		
		spCtrl.config = {
			toolName: null,
			X : null,
			Y : null
		};
		
		
		function request_scatterPlot (){
			if(wa.WeaveWrapper.check_WeaveReady()){//TODO figure out where to call checkWeaveReady
				//TODO put this retrieval in manager class later
				if(!wa.wWrapper)
					weave_wrapper = new wa.WeaveWrapper();
				else
					weave_wrapper = WeaveWrapper.instance;
				
				
				if(spCtrl.checked)//if checked
					spCtrl.config.toolName = weave_wrapper.request_ScatterPlot(spCtrl.config);
				else{//if unchecked
					if(spCtrl.config.toolName)//if the tool exists
						weave_wrapper.remove_Object(spCtrl.config.toolName);//remove it
					else
						return;
				}
			}
			else
				setTimeout(request_scatterPlot, 100);
		};
	};
	
})();