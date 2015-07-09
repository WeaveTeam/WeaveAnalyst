/**
 * this directive contains the Computation selection and configuring its parameters
 * COMPUTATION ENGINE
 * SCRIPT (COMPUTATION)
 * SCRIPT INPUT (defaults)
 * REMAPPING
 * 
 * @author spurushe
 * @author fkamayou
 */

(function(){
	
	angular.module('weaveAnalyst.AnalysisModule').directive('scriptControls', scriptControls);
	
	function scriptControls() {
		return {
			restrict : 'E',
			templateUrl : 'src/analysis/script_Controls.tpl.html',
			controller : scriptController,
			controllerAs : 'scriptCtrl',
			bindToController : true, 
			link : function(){
				
			}
		};//directive definition object
	};

	scriptController.$inject = ['$scope', 'queryService', '$filter', 'analysisService'];
	
	function scriptController ($scope, queryService, $filter, analysisService){
		var scriptCtrl = this;
		
		scriptCtrl.queryService = queryService;
		scriptCtrl.analysisService = analysisService;
		
		scriptCtrl.getScriptMetadata = getScriptMetadata;
		scriptCtrl.toggleButton = toggleButton;
		
		scriptCtrl.values = [];
		scriptCtrl.columnToRemap = {
				value : {}
		};
		
		//clears scrip options when script clear button is hit
		function getScriptMetadata (scriptSelected, forceUpdate){
			if(scriptCtrl.queryService.queryObject.scriptSelected)
				scriptCtrl.analysisService.getScriptMetadata(scriptSelected, forceUpdate);
			else
				scriptCtrl.analysisService.cache.scriptMetadata = {};
		};
		
		
		function toggleButton (input) {
			
			if (scriptCtrl.queryService.queryObject.scriptOptions[input.param] == input.options[0]) {
				scriptCtrl.queryService.queryObject.scriptOptions[input.param] = input.options[1];
			} else {
				scriptCtrl.queryService.queryObject.scriptOptions[input.param] = input.options[0];
			}
		};
		
		
		$scope.$watch(function(){
			return scriptCtrl.queryService.queryObject.ComputationEngine;
		}, function(){
			if(scriptCtrl.queryService.queryObject.ComputationEngine)
				scriptCtrl.analysisService.getListOfScripts(true, scriptCtrl.queryService.queryObject.ComputationEngine);
		});
		
		$scope.$watch(function(){
			return scriptCtrl.queryService.queryObject.scriptSelected;
		}, function() {
			scriptCtrl.getScriptMetadata(scriptCtrl.queryService.queryObject.scriptSelected, true);
		});
		
	}//end of controller definition
	
})();