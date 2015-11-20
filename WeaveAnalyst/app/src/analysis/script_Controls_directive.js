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

	scriptController.$inject = ['$scope', 'queryService', '$filter', 'analysisService', '$log'];
	
	function scriptController ($scope, queryService, $filter, analysisService, $log){
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
		
		/*******************************slider stuff**********************************************/
		scriptCtrl.handleSliderValueChange = handleSliderValueChange;
		scriptCtrl.updateSliderValues = updateSliderValues;
		
		//temp sol
		WeaveAPI.log = scriptCtrl.log = new weavecore.SessionStateLog(WeaveAPI.globalHashMap);
		var cc = WeaveAPI.SessionManager.getCallbackCollection(scriptCtrl.log);
        cc.addGroupedCallback({}, scriptCtrl.updateSliderValues, true);
		
		
		scriptCtrl.labeledslider = {
		            'options': {
		                start: function (event, ui) {
		                    $log.info('Event: Slider start');
		                },
		                stop: function (event, ui) {
		                    $log.info('Event: Slider stop');
		                    scriptCtrl.handleSliderValueChange(ui);
		                }
		            }
        };
		
		function handleSliderValueChange(ui) {
            var delta = ui.value - scriptCtrl.log.undoHistory.length;
            if (delta < 0)
            	scriptCtrl.log.undo(-delta);
            else
            	scriptCtrl.log.redo(delta);

            $scope.$apply();
        }
		
		function updateSliderValues() {
            scriptCtrl.sliderPosition = scriptCtrl.log._undoHistory.length;
            // since this function is called programatically in next frame in next frame ,
            // and not called by UI event , we need to manually trigger digest cycle.
            console.log('UpdateSliderValues called');
            $scope.$apply();
        }
		
		scriptCtrl.log.clearHistory();
		/*******************************slider stuff**********************************************/
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