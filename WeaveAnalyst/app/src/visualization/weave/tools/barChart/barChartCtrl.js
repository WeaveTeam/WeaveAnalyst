/**
 * directive that creates the bar chart visualization tool widget
 * controls the bar chart in Weave
 * @spurushe
 */

(function(){
	angular.module().directive();
	
	function barChart(){
		return{
			restrict: 'E',
			templateUrl : 'tools/barChart/bar_chart.tpl.html',
			controller : bar_chartController,
			controllerAs: 'bcCtrl',
			bindToController : true,
			link : function(){
				
			}
		};
	}//end of directive definition
	
	function bar_chartController (){
		var bcCtrl = this;
		var weave_wrapper;
		
		bcCtrl.request_barChart = request_barChart;
		bcCtrl.initWeaveWrapper = initWeaveWrapper;
		bcCtrl.items = ['a','d'];
		
		bcCtrl.config = {
			checked : false,
			toolName: null,
			heights : null,
			posErr : null,
			negErr : null,
			label: null,
			sort: null
		};
		
		function initWeaveWrapper(){
			//TODO put this retrieval in manager class later
			if(!wa.wWrapper)
				weave_wrapper = new wa.WeaveWrapper();
			else
				weave_wrapper = WeaveWrapper.instance;
		};
		
		function request_barChart (){
			if(wa.WeaveWrapper.check_WeaveReady()){//TODO figure out where to call checkWeaveReady
				
				bcCtrl.initWeaveWrapper();
				
				if(bcCtrl.config.checked)//if checked
					bcCtrl.config.toolName = weave_wrapper.request_BarChart(bcCtrl.config);//request it with config
				else{//if unchecked
					if(bcCtrl.config.toolName)//if the tool exists
						weave_wrapper.remove_Object(bcCtrl.config.toolName);//remove it
					else
						return;
				}
			}
			else
				setTimeout(request_barChart, 100);
		};
	};
})();