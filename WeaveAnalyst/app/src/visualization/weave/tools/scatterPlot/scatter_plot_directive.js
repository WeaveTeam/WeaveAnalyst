/**
 * directive that creates the scatter plot visualization tool widget
 * controls the scatter plot in Weave
 * @spurushe
 */

(function(){
	
	angular.module('weaveApp').directive('scatterPlot', scatterPlot);
	
	function scatterPlot (){
		return {
			restrict: 'E',
			templateUrl:'tools/scatterPlot/scatter_plot.tpl.html', 
			controller : scatter_plotController,
			controllerAs : 'spCtrl',
			bindToController: true,
			link: function(){
				
			}
		};//directive definition object
	}
	
	scatter_plotController.$inject = ['$scope'];
	function scatter_plotController ($scope){
		var spCtrl = this;
		var weave_wrapper;
		
		spCtrl.request_scatterPlot = request_scatterPlot;
		spCtrl.initWeaveWrapper = initWeaveWrapper;
		spCtrl.items = ['a','d'];
		
		spCtrl.config = {
			type : 'ScatterPlotTool',	
			checked : false,
			toolName: null,
			X : null,
			Y : null
		};
		
		function initWeaveWrapper(){
			//TODO put this retrieval in manager class later
			if(!weaveApp.WeaveWrapper.instance)
				weave_wrapper = new weaveApp.WeaveWrapper();
			else
				weave_wrapper = weaveApp.WeaveWrapper.instance;
		};
		
		function request_scatterPlot (){
			spCtrl.initWeaveWrapper();
			
			if(weaveApp.WeaveWrapper.check_WeaveReady()){//TODO figure out where to call checkWeaveReady
								
				if(spCtrl.config.checked)//if checked
					spCtrl.config.toolName = weave_wrapper.request_ScatterPlot(spCtrl.config);//request it with config
				else{//if unchecked
					if(spCtrl.config.toolName)//if the tool exists
						weave_wrapper.remove_Object(spCtrl.config.toolName);//remove it
					else
						return;
				}
				//**********for the entry made earlier populate object here (in scatterplot directive)**********/
				$scope.appCtrl.scatterplots[spCtrl.config.toolName] = spCtrl.config;
				console.log("scatterplots", $scope.appCtrl.scatterplots);
			}
			else
				setTimeout(request_scatterPlot, 100);
		};
	};
	
})();