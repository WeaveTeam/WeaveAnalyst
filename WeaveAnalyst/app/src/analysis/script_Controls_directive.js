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
		
		scriptCtrl.active_qoName = WeaveAPI.globalHashMap.getObject("active_qo");
		scriptCtrl.active_qo = WeaveAPI.globalHashMap.getObject(scriptCtrl.active_qoName.value);
		
		
		scriptCtrl.scriptOptions = [];
		
		scriptCtrl.queryService = queryService;
		scriptCtrl.analysisService = analysisService;
		
		scriptCtrl.getScriptMetadata = getScriptMetadata;
		scriptCtrl.autoFillDefaults = autoFillDefaults;
		scriptCtrl.validateQuery = validateQuery;
		scriptCtrl.toggleButton = toggleButton;
		
		scriptCtrl.values = [];
		scriptCtrl.columnToRemap = {
				value : {}
		};
	
		//this function checks if the script inputs have any user specified defaults in the script input metadata
		function autoFillDefaults (){
			var sc_metadata = scriptCtrl.analysisService.cache.scriptMetadata;
			
			if(sc_metadata){
				var columns = scriptCtrl.queryService.cache.columns;
				var scriptOptions= scriptCtrl.queryService.queryObject.scriptOptions;
				
				if(sc_metadata && columns) {
					if(!scriptOptions)//create scriptoptions object so that properties can be added dynamically later
						scriptOptions = {};
					
					if(sc_metadata.hasOwnProperty("inputs")) {
						for(var i in sc_metadata.inputs) {//
							var input = sc_metadata.inputs[i];
							if(input.type == "column") {
								for(var j in columns) {//loop thru columns to find match for defaults
									var column = columns[j];
									if(input.hasOwnProperty("defaults")) {//check if input has default property
										if(column.metadata.title == input['defaults']) {//if match is found
											scriptOptions[input.param] = column;//assign column
											break;
										}
									}
									else{//if no default is specified
										scriptOptions[input.param] = null;//empty object without default value filled in
									}
								}// end of column iteration
							} 
							else if(input.type == "value" || input.type == "options") {
								scriptOptions[input.param] = input['defaults'];
							}
							
							//scriptCtrl.validatequery();
						}// end of metadata input iteration
						
						//scriptCtrl.validatequery();
					}
				}
			}
		};
		
		function validateQuery(){
			var qo = scriptCtrl.queryService.queryObject;
			
			var isQueryValid = true;
			var validationStatus= "Query is valid.";
			//validate datatable
			if(!qo.dataTable){
				validationStatus = "Input data has not been selected";
				isQueryValid = false;//setting false
				setQueryObjectParams();
				return;
			}
			
			//validate script
			//if script has not been selected
			if(qo.scriptSelected == null || qo.scriptSelected == "")
			{
				validationStatus = "Script has not been selected.";
				isQueryValid = false;
				setQueryObjectParams();//setting false
				return;
			}
			
			
			//validate options
			if(qo.scriptOptions){//if they exist validate them
				var g = 0;
				var counter = Object.keys(scriptCtrl.analysisService.cache.scriptMetadata.inputs).length;
				for(var f = 0; f < counter; f++) {
					var tempObj = scriptCtrl.queryService.cache.scriptMetadata.inputs[f];
					if(!qo.scriptOptions[tempObj.param]) {
						validationStatus = "'" + f + "'" + " has not been selected";
						isQueryValid = false;
						setQueryObjectParams();//setting false
						return;
					}
					else
						g++;
				}
			}
			else{
				validationStatus = "Script - Options has not been set.";
				isQueryValid = false;
				setQueryObjectParams();//setting false
				return;
				
			}
			
			setQueryObjectParams();//to set true status
			
			function setQueryObjectParams (){//closure function, do not move
				
				qo.properties.validationStatus = validationStatus;
				qo.isQueryValid = isQueryValid;
			};
			
		};
		function toggleButton (input) {
			
			if (scriptCtrl.queryService.queryObject.scriptOptions[input.param] == input.options[0]) {
				scriptCtrl.queryService.queryObject.scriptOptions[input.param] = input.options[1];
			} else {
				scriptCtrl.queryService.queryObject.scriptOptions[input.param] = input.options[0];
			}
		};
		
		//watches for change in computation engine
		$scope.$watch(function(){
			return scriptCtrl.active_qo.Computation_Engine.value;
		}, function(){
			if(scriptCtrl.active_qo.Computation_Engine.value)
				scriptCtrl.analysisService.getListOfScripts(true, scriptCtrl.active_qo.Computation_Engine.value);
		});
		
		//USING WEAVECOREJS
//		scriptCtrl.active_qo.Computation_Engine.addImmediateCallback(this, function(){
//			scriptCtrl.analysisService.getListOfScripts(true, scriptCtrl.active_qo.Computation_Engine.value);
//		});
		
		
		
		//watches for change in script selected
		$scope.$watch(function(){
			return scriptCtrl.active_qo.script_Selected.value;
		}, function() {
			if(scriptCtrl.active_qo.script_Selected.value)
				scriptCtrl.getScriptMetadata(scriptCtrl.active_qo.script_Selected.value, true);
		});
		
		
		//clears scrip options when script clear button is hit
		function getScriptMetadata (scriptSelected, forceUpdate){
			if(scriptSelected)
				scriptCtrl.analysisService.getScriptMetadata(scriptSelected, forceUpdate).
				then(function(result){
					scriptCtrl.scriptOptions = [];//clear
					scriptCtrl.scriptOptions = result.inputs;
				});
			else
				scriptCtrl.analysisService.cache.scriptMetadata = {};
		};
		
		
	}//end of controller definition
	
})();