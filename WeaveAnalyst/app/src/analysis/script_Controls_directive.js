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
		scriptCtrl.setValue = setValue;
		scriptCtrl.getScriptMetadata = getScriptMetadata;
		scriptCtrl.toggleButton = toggleButton;
		scriptCtrl.showColumnInfo = showColumnInfo;
		
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
		
		function setValue (originalValue, newValue)
		{
			if(scriptCtrl.queryService.queryObject.columnRemap) {
				if(scriptCtrl.queryService.queryObject.columnRemap[scriptCtrl.columnToRemap.value]) {
					scriptCtrl.queryService.queryObject.columnRemap[scriptCtrl.columnToRemap.value][originalValue] = newValue;
				} else {
					scriptCtrl.queryService.queryObject.columnRemap[scriptCtrl.columnToRemap.value] = {};
					scriptCtrl.queryService.queryObject.columnRemap[scriptCtrl.columnToRemap.value][originalValue] = newValue;
				}
			} 
		};
		
		
		function toggleButton (input) {
			
			if (scriptCtrl.queryService.queryObject.scriptOptions[input.param] == input.options[0]) {
				scriptCtrl.queryService.queryObject.scriptOptions[input.param] = input.options[1];
			} else {
				scriptCtrl.queryService.queryObject.scriptOptions[input.param] = input.options[0];
			}
		};
		
		function showColumnInfo (column, param) {
			scriptCtrl.columnToRemap = {value : param}; // bind this column to remap to the scope
			if(column) {
				scriptCtrl.description = column.description;
				scriptCtrl.queryService.getEntitiesById([column.id], true).then(function (result) {
					if(result.length) {
						var resultMetadata = result[0];
						if(resultMetadata.publicMetadata.hasOwnProperty("aws_metadata")) {
							var metadata = angular.fromJson(resultMetadata.publicMetadata.aws_metadata);
							if(metadata.hasOwnProperty("varValues")) {
								scriptCtrl.queryService.getDataMapping(metadata.varValues).then(function(result) {
									scriptCtrl.varValues = result;
								});
							} else {
								scriptCtrl.varValues = [];
							}
						}
					}
				});
			} else {
				// delete description and table if the indicator is clear
				scriptCtrl.description = "";
				scriptCtrl.varValues = [];
			}
		};
		
		
		$scope.$watchCollection(function(){
			return scriptCtrl.columnToRemap.value;
		},function(newVal, oldVal) {
			if(newVal) {
				var temp = [];
				for(var key in scriptCtrl.queryService.queryObject.columnRemap[newVal]) {
					temp.push(scriptCtrl.queryService.queryObject.columnRemap[newVal][key]);
				}
				scriptCtrl.values = temp;
			}
		});
		
		
		$scope.$watch(function(){
			return scriptCtrl.queryService.queryObject.columnRemap;
		}, function() {
			if(scriptCtrl.columnToRemap.value) {
				scriptCtrl.values = [];
				for(var key in scriptCtrl.queryService.queryObject.columnRemap[scriptCtrl.columnToRemap.value]) {
					scriptCtrl.values.push(scriptCtrl.queryService.queryObject.columnRemap[scriptCtrl.columnToRemap.value][key]);
				}
			}
		}, true);
		
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
		
		//handles the indicators in the script options
		$scope.$watch(function() {
			return scriptCtrl.queryService.queryObject.scriptOptions;
		}, function(newValue, oldValue) {
			// run this only if the user chooses to link the indicator
			if(scriptCtrl.queryService.queryObject.properties.linkIndicator) {
				if(!angular.equals(newValue, oldValue)) {
					var scriptOptions = newValue;
					for(var key in scriptOptions) { 
						var option = scriptOptions[key];
						if(option) {
							if(option.hasOwnProperty("columnType")) {
								if(option.columnType.toLowerCase() == "indicator") {
									scriptCtrl.queryService.queryObject.Indicator = option;
								}
							}
						}
					}
					var oldScriptOptions = oldValue;
					var newScriptOptions = newValue;
					var flag = true;
					for(var key in oldScriptOptions) { 
						var option = oldScriptOptions[key];
						if(option) {
							if(option.hasOwnProperty("columnType")) {
								if(option.columnType.toLowerCase() == "indicator") {
									for(var key2 in newScriptOptions) {
										var option2 = newScriptOptions[key2];
										if(option2) {
											if(option2.hasOwnProperty("columnType")) {
												if(option2.columnType.toLowerCase() == "indicator") {
													flag = false;
												}
											}
										}
									}
									if(flag)
										scriptCtrl.queryService.queryObject.Indicator = undefined;
								}
							}
						}
					}	
				}
			}
		}, true);
		
		$scope.$watchCollection(function() {
			return [scriptCtrl.queryService.queryObject.Indicator, 
			        scriptCtrl.queryService.queryObject.scriptSelected, 
			        scriptCtrl.analysisService.cache.scriptMetadata];
		}, function(newVal, oldVal) {
			if(newVal != oldVal) {
				var indicator = newVal[0];
				var scriptSelected = newVal[1];
				var scriptMetadata = newVal[2];
				
				$scope.$watch(function() {
					return scriptCtrl.analysisService.cache.scriptMetadata;
				}, function(newValue, oldValue) {
					// run this only if the user chooses to link the indicator

					if(scriptCtrl.queryService.queryObject.properties.linkIndicator) {
						if(newValue) {
							scriptMetadata = newValue;
							if(indicator && scriptMetadata) {
								for(var i in scriptCtrl.analysisService.cache.scriptMetadata.inputs) {
									var metadata = scriptCtrl.analysisService.cache.scriptMetadata.inputs[i];
									if(metadata.hasOwnProperty('type')) {
										if(metadata.type == 'column') {
											if(metadata.hasOwnProperty('columnType')) {
												if(metadata.columnType.toLowerCase() == "indicator") {
													scriptCtrl.queryService.queryObject.scriptOptions[metadata.param] = indicator;
												}
											}
										}
									}
								}
							} else if(!indicator) {
								for(var i in scriptCtrl.analysisService.cache.scriptMetadata.inputs) {
									var metadata = scriptCtrl.analysisService.cache.scriptMetadata.inputs[i];
									if(metadata.hasOwnProperty('type')) {
										if(metadata.type == 'column') {
											if(metadata.hasOwnProperty('columnType')) {
												if(metadata.columnType.toLowerCase() == "indicator") {
													scriptCtrl.queryService.queryObject.scriptOptions[metadata.param] = undefined;
												}
											}
										}
									}
								}
							}
						}
					}
				}, true);
			}
		}, true);
		
		//handles the defaults appearing in the script options selection
		$scope.$watchCollection(function() {
			return [scriptCtrl.analysisService.cache.scriptMetadata, scriptCtrl.queryService.cache.columns];
		}, function(newValue, oldValue) {
			
				var scriptMetadata = newValue[0];
				var columns = newValue[1];
				if(scriptMetadata && columns) {
					if(scriptMetadata.hasOwnProperty("inputs")) {
						for(var i in scriptMetadata.inputs) {
							var input = scriptMetadata.inputs[i];
							if(input.type == "column") {
								for(var j in columns) {
									var column = columns[j];
									if(input.hasOwnProperty("defaults")) {
										if(column.title == input['defaults']) {
											scriptCtrl.queryService.queryObject.scriptOptions[input.param] = column;
											break;
										}
									}
								}
							}
						}
					}
			}
		});
	}//end of controller definition
	
})();