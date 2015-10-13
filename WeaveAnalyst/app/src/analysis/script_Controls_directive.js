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
var qo;
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
		scriptCtrl.active_qo = $scope.anaCtrl.active_qo;
		qo = scriptCtrl.active_qo;
		
		scriptCtrl.values = [];
		scriptCtrl.openAdvRModal = openAdvRModal;
		scriptCtrl.columnToRemap = {
				value : {}
		};
	
		//watches for change in computation engine
//		$scope.$watch(function(){
//			return scriptCtrl.active_qo.ComputationEngine.value;
//		}, function(){
//			if(scriptCtrl.active_qo.ComputationEngine.value)
//				scriptCtrl.analysisService.getListOfScripts(true, scriptCtrl.active_qo.ComputationEngine.value);
//		});
		
		//USING WEAVECOREJS
		scriptCtrl.active_qo.ComputationEngine.addImmediateCallback(this, function(){
			scriptCtrl.analysisService.getListOfScripts(true, scriptCtrl.active_qo.ComputationEngine.value);
		}, true);
		
		function openAdvRModal () {
			$scope.anaCtrl.openAdvRModal();
		} ;
		
		//watches for change in script selected
		$scope.$watch(function(){
			return scriptCtrl.active_qo.scriptSelected.value;
		}, function() {
			if(scriptCtrl.active_qo.scriptSelected.value)
				scriptCtrl.getScriptMetadata(scriptCtrl.active_qo.scriptSelected.value, true);
		});
		
		
		//clears scrip options when script clear button is hit
		function getScriptMetadata (scriptSelected, forceUpdate){
			if(scriptSelected)
//				scriptCtrl.analysisService.getScriptMetadata(scriptSelected, forceUpdate).
//				then(function(result){
//					scriptCtrl.scriptOptions = [];//clear
//					scriptCtrl.scriptOptions = result.inputs;
//				});
				scriptCtrl.scriptOptions =[{
					"type": "column",
					"param": "Year",
					"description": "Time variable",
					"columnType": "time",
					"defaults": "year",
					"dataSource" : null
				}];
			else
				scriptCtrl.analysisService.cache.scriptMetadata = {};
		};
		
		
	}//end of controller definition
	
})();