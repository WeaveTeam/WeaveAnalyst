/**
 * this controller deals with the Scripts, its input and re-mapping of input parameters
 */
(function(){
	
	/////////////////////
	//Scripts Controller
	/////////////////////
	
	angular.module('weaveAnalyst.AnalysisModule').controller("ScriptInputsController", ScriptInputsController);
	ScriptInputsController.$inject = ['$scope', 'queryService', '$filter', 'analysisService'];
	
	function ScriptInputsController ($scope, queryService, $filter, analysisService){
		var scrCtrl = this;
		
		scrCtrl.values = [];
		scrCtrl.columnToRemap = {
				value : {}
		};
		scrCtrl.queryService = queryService;
		scrCtrl.analysisService = analysisService;
		scrCtrl.setValue = setValue;
		scrCtrl.getScriptMetadata = getScriptMetadata;
		scrCtrl.toggleButton = toggleButton;
		scrCtrl.showColumnInfo = showColumnInfo;
		
		
		//clears scrip options when script clear button is hit
		function getScriptMetadata (scriptSelected, forceUpdate){
			if(scrCtrl.queryService.queryObject.scriptSelected)
				scrCtrl.analysisService.getScriptMetadata(scriptSelected, forceUpdate);
			else
				scrCtrl.analysisService.cache.scriptMetadata = {};
		};
		
		function setValue (originalValue, newValue)
		{
			if(scrCtrl.queryService.queryObject.columnRemap) {
				if(scrCtrl.queryService.queryObject.columnRemap[scrCtrl.columnToRemap.value]) {
					scrCtrl.queryService.queryObject.columnRemap[scrCtrl.columnToRemap.value][originalValue] = newValue;
				} else {
					scrCtrl.queryService.queryObject.columnRemap[scrCtrl.columnToRemap.value] = {};
					scrCtrl.queryService.queryObject.columnRemap[scrCtrl.columnToRemap.value][originalValue] = newValue;
				}
			} 
		};
		
		
		function toggleButton (input) {
			
			if (scrCtrl.queryService.queryObject.scriptOptions[input.param] == input.options[0]) {
				scrCtrl.queryService.queryObject.scriptOptions[input.param] = input.options[1];
			} else {
				scrCtrl.queryService.queryObject.scriptOptions[input.param] = input.options[0];
			}
		};
		
		function showColumnInfo (column, param) {
			scrCtrl.columnToRemap = {value : param}; // bind this column to remap to the scope
			if(column) {
				scrCtrl.description = column.description;
				scrCtrl.queryService.getEntitiesById([column.id], true).then(function (result) {
					if(result.length) {
						var resultMetadata = result[0];
						if(resultMetadata.publicMetadata.hasOwnProperty("aws_metadata")) {
							var metadata = angular.fromJson(resultMetadata.publicMetadata.aws_metadata);
							if(metadata.hasOwnProperty("varValues")) {
								scrCtrl.queryService.getDataMapping(metadata.varValues).then(function(result) {
									scrCtrl.varValues = result;
								});
							} else {
								scrCtrl.varValues = [];
							}
						}
					}
				});
			} else {
				// delete description and table if the indicator is clear
				scrCtrl.description = "";
				scrCtrl.varValues = [];
			}
		};
		
		
		$scope.$watchCollection(function(){
			return scrCtrl.columnToRemap.value;
		},function(newVal, oldVal) {
			if(newVal) {
				var temp = [];
				for(var key in scrCtrl.queryService.queryObject.columnRemap[newVal]) {
					temp.push(scrCtrl.queryService.queryObject.columnRemap[newVal][key]);
				}
				scrCtrl.values = temp;
			}
		});
		
		
		$scope.$watch(function(){
			return scrCtrl.queryService.queryObject.columnRemap;
		}, function() {
			if(scrCtrl.columnToRemap.value) {
				scrCtrl.values = [];
				for(var key in scrCtrl.queryService.queryObject.columnRemap[scrCtrl.columnToRemap.value]) {
					scrCtrl.values.push(scrCtrl.queryService.queryObject.columnRemap[scrCtrl.columnToRemap.value][key]);
				}
			}
		}, true);
		
		$scope.$watch(function(){
			return scrCtrl.queryService.queryObject.ComputationEngine;
		}, function(){
			if(scrCtrl.queryService.queryObject.ComputationEngine)
				scrCtrl.analysisService.getListOfScripts(true, scrCtrl.queryService.queryObject.ComputationEngine);
		});
		
		$scope.$watch(function(){
			return scrCtrl.queryService.queryObject.scriptSelected;
		}, function() {
			scrCtrl.getScriptMetadata(scrCtrl.queryService.queryObject.scriptSelected, true);
		});
		
		//handles the indicators in the script options
		$scope.$watch(function() {
			return scrCtrl.queryService.queryObject.scriptOptions;
		}, function(newValue, oldValue) {
			// run this only if the user chooses to link the indicator
			if(scrCtrl.queryService.queryObject.properties.linkIndicator) {
				if(!angular.equals(newValue, oldValue)) {
					var scriptOptions = newValue;
					for(var key in scriptOptions) { 
						var option = scriptOptions[key];
						if(option) {
							if(option.hasOwnProperty("columnType")) {
								if(option.columnType.toLowerCase() == "indicator") {
									scrCtrl.queryService.queryObject.Indicator = option;
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
										scrCtrl.queryService.queryObject.Indicator = undefined;
								}
							}
						}
					}	
				}
			}
		}, true);
		
		$scope.$watchCollection(function() {
			return [scrCtrl.queryService.queryObject.Indicator, 
			        scrCtrl.queryService.queryObject.scriptSelected, 
			        scrCtrl.analysisService.cache.scriptMetadata];
		}, function(newVal, oldVal) {
			if(newVal != oldVal) {
				var indicator = newVal[0];
				var scriptSelected = newVal[1];
				var scriptMetadata = newVal[2];
				
				$scope.$watch(function() {
					return scrCtrl.analysisService.cache.scriptMetadata;
				}, function(newValue, oldValue) {
					// run this only if the user chooses to link the indicator

					if(scrCtrl.queryService.queryObject.properties.linkIndicator) {
						if(newValue) {
							scriptMetadata = newValue;
							if(indicator && scriptMetadata) {
								for(var i in scrCtrl.analysisService.cache.scriptMetadata.inputs) {
									var metadata = scrCtrl.analysisService.cache.scriptMetadata.inputs[i];
									if(metadata.hasOwnProperty('type')) {
										if(metadata.type == 'column') {
											if(metadata.hasOwnProperty('columnType')) {
												if(metadata.columnType.toLowerCase() == "indicator") {
													scrCtrl.queryService.queryObject.scriptOptions[metadata.param] = indicator;
												}
											}
										}
									}
								}
							} else if(!indicator) {
								for(var i in scrCtrl.analysisService.cache.scriptMetadata.inputs) {
									var metadata = scrCtrl.analysisService.cache.scriptMetadata.inputs[i];
									if(metadata.hasOwnProperty('type')) {
										if(metadata.type == 'column') {
											if(metadata.hasOwnProperty('columnType')) {
												if(metadata.columnType.toLowerCase() == "indicator") {
													scrCtrl.queryService.queryObject.scriptOptions[metadata.param] = undefined;
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
			return [scrCtrl.analysisService.cache.scriptMetadata, scrCtrl.queryService.cache.columns];
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
											scrCtrl.queryService.queryObject.scriptOptions[input.param] = column;
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