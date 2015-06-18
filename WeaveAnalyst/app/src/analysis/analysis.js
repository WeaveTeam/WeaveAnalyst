/**
 * Handle all Analysis Tab related work - Controllers to handle Analysis Tab
 */
'use strict';
var AnalysisModule = angular.module('aws.AnalysisModule', ['wu.masonry', 'ui.slider', 'ui.bootstrap']);

//analysis service
AnalysisModule.service('AnalysisService', ['geoFilter_tool','timeFilter_tool', 'queryService',
                                           function(geoFilter_tool, timeFilter_tool, queryService ) {
	
	var AnalysisService = {
			
	};
	//getting the list of datatables
	//queryService.getDataTableList(true);
	AnalysisService.geoFilter_tool = geoFilter_tool;
	AnalysisService.timeFilter_tool = timeFilter_tool;
	
	AnalysisService.filterColumn = function(criteria)
	{
		return function(item) {
			
			// if the script metadata has a columnType
			if(criteria.columnType && criteria.columnType != "all" && criteria.columnType != " ") {
				// we check if the column inputs have aws_metadata
				if(item && item.metadata && item.metadata.aws_metadata)
				{
					// if we have aws_metadata, then we filter
					var awsmetadata =  angular.fromJson(item.metadata.aws_metadata);
					if(awsmetadata && awsmetadata.columnType)
					{
						if(awsmetadata.columnType == criteria.columnType) {
							// then we match the search text
							var lwCase = item.metadata.title.toLowerCase();
							if(lwCase.indexOf(criteria.title.toLowerCase()) > -1) {
								return true;
							}
						} 
					}
					
				} else {
					// if we don't have aws_metadata, we only filter with search text
					if(item && item.metadata && item.metadata.title) {
						var lwCase = item.metadata.title.toLowerCase();
						if(lwCase.indexOf(criteria.title.toLowerCase()) > -1) {
							return true;
						}
					}
				}
			} else {
				// if no script metadata columnType or "all" is specified
				if(item && item.metadata && item.metadata.title) {
					var lwCase = item.metadata.title.toLowerCase();
					if(lwCase.indexOf(criteria.title.toLowerCase()) > -1) {
						return true;
					}
				}
			}
		};
	};
	
	return AnalysisService;
	
}]);

//main analysis controller
AnalysisModule.controller('AnalysisCtrl', function($scope, $filter, queryService, AnalysisService, WeaveService, QueryHandlerService, $window,statisticsService ) {

	setTimeout(loadFlashContent, 100);
	$scope.queryService = queryService;
	$scope.AnalysisService = AnalysisService;
	$scope.WeaveService = WeaveService;
	$scope.QueryHandlerService = QueryHandlerService;
	
	$scope.showToolMenu = false;
	
	$scope.filterColumn = AnalysisService.filterColumn;
	
	$scope.$watch(function() {
		return WeaveService.weave;
	}, function () {
		if(WeaveService.weave) {
			$scope.showToolMenu = true;
			loadWeaveSessionState();
		}
	});
	
	function loadWeaveSessionState (){
		if(WeaveService.checkWeaveReady()){
			
			if(queryService.queryObject.weaveSessionState) {
				WeaveService.weave.path().state(queryService.queryObject.weaveSessionState);
			}
		}else{
			setTimeout(loadWeaveSessionState, 500, window);
		}
	};

	$("#queryObjectPanel" ).draggable().resizable({
       handles: 'n, e, s, w'
    });
	
	
	/*********************** BEGIN Data Source Panel *******************************************/
	$("#hierarchyPanel" ).draggable().resizable({
       handles: 'n, e, s, w'
    });
	
	
	$scope.hierarchyClass = {
			width : "48%",
			height: "100%",
			marginRight: "2%",
			float:"left"
	};
	
	$scope.columnsClass = {
			width : "48%",
			height: "100%",
			marginRight: "2%",
			float:"left"
	};
	
	$scope.$watch("showColumns", function() {
		
		if($scope.showColumns) {
			$scope.hierarchyClass.width = "48%";
			$scope.columnsClass.width = "48%";
			
		} else {
			$scope.hierarchyClass.width = "96%";
			$scope.columnsClass.width = "0%";
		}
	});
	
	var weaveTreeIsBusy = null;
	
	queryService.refreshHierarchy = function() {
		var weave = WeaveService.weave;
		
		if( weave && WeaveService.checkWeaveReady()){
			
			var weaveTreeNode = new weave.WeaveTreeNode();
			
			weaveTreeIsBusy = weave.evaluateExpression(null, '() => WeaveAPI.SessionManager.linkableObjectIsBusy(WEAVE_TREE_NODE_LOOKUP[0])');
			
			queryService.cache.hierarchy = {
				minExpandLevel: 1,
				clickFolderMode: 2,
				children: [createDynatreeNode(weaveTreeNode)],
				onLazyRead : function(node) {
					
					var getTreeAsync = function(){
						var children = [];
						var leaves = [];
						
						// check if this is data table
						node.data.weaveNode.getChildren().forEach(function(child) {
							if(child.isBranch())
								children.push(child);
							else
								leaves.push(child);
						});
						
						
						if(children.length)
							children = children.map(createDynatreeNode);
						
						if (weaveTreeIsBusy()) {
							setTimeout(getTreeAsync, 500);
							return;
						}
						
						node.removeChildren();
						node.setLazyNodeStatus(DTNodeStatus_Ok);
						if(children.length)
							node.addChild(children);

						if(leaves.length) {
							queryService.queryObject.dataTable = node.data.weaveNode.getLabel();
							// console.log(node.data.weaveNode.findPath(leaves[0].getDataSourceName(), leaves[0].getColumnMetadata()));
							queryService.cache.columns = leaves.map(function(wNode) {
								return {
									dataSourceName : wNode.getDataSourceName(),
									metadata : wNode.getColumnMetadata()
								};
							});
							queryService.cache.filteredColumns = queryService.cache.columns ;
							$scope.$apply();
						} else {
							queryService.queryObject.dataTable = "";
						}
					}; 
					setTimeout(getTreeAsync, 500);
				},
				onActivate : function(node) {
				},
				dnd : {
					revert : false,
					
					onDragStart : function(node) {
						
						if(node.data.isFolder) {
							return false;
						}
						return true;
					},
					onDragStop : function(node) {
						
					}
				},
				keyBoard : true,
				debugLevel: 0
			};
		}
	};
	
	var createDynatreeNode = function(wNode) {
		if(!wNode)
			return;
		return {
			title : wNode.getLabel(),
			isLazy : wNode.isBranch(),
			isFolder : wNode.isBranch(),
			weaveNode : wNode
		};
	};
	
	var createDynatreeColumnList = function(column) {
		if(!column)
			return;
		return {
			title : column.metadata.title,
			isFolder : false,
			column : column
		};
	};
	
	
	var createColumnTree = function(columns) {
		return {
			minExpandLevel: 1,
			children: columns.map(createDynatreeColumnList),
			dnd : {
				revert : false,
				
				onDragStart : function(node) {
					
					if(node.data.isFolder) {
						return false;
					}
					return true;
				}
			},
			keyBoard : true,
			debugLevel: 0
		};
	};
	
	$scope.$watch('queryService.cache.hierarchy', function(hierarchy) {
		if(hierarchy) {
			$(".dynatree-container").scrollTop(scrolledPosition);

			$('#hierarchyTree').dynatree(hierarchy);
			$('#hierarchyTree').dynatree("getTree").reload();
			
			$(".dynatree-container").scrollTop(scrolledPosition);

		}
	}, true);
	
	$scope.$watchCollection("queryService.cache.filteredColumns", function(columns) {
		console.log("columns", columns);
		if(columns) {
			$('#columnsTree').dynatree(createColumnTree(columns));
			$('#columnsTree').dynatree("getTree").reload();
		}
	});
	
	
	// this watch is needed when searching for columns in the
	// queryObject panel
	$scope.$watch(function() {
		return [$scope.columnSearch, queryService.cache.columns];
	}, function(newVal) {
		var columnSearch = newVal[0];
		var columns = newVal[1];
		if(columns && columns.length) {
			queryService.cache.filteredColumns = columns.filter(function(column) {
				if(column) {
					var columnTitle = column.metadata.title;
					
					if(columnTitle) {
						if(columnSearch) {
							var lwCase = columnTitle.toLowerCase();
							if(lwCase.indexOf(columnSearch.toLowerCase()) > -1) {
								return true;
							} else {
								return false;
							}
						} else {
							return true;
						}
					}
				}
			});
		}
	}, true);
	/*********************** END Data Source Panel *******************************************/

	$scope.$watch('WeaveService.weaveWindow.closed', function() {
		queryService.queryObject.properties.openInNewWindow = WeaveService.weaveWindow.closed;
	});
	
	//************************** query object editor**********************************
	var expandedNodes = null;
	var scrolledPosition = 0;
	var activeNode = null;
	
	var buildTree = function (node, key) {
		return {
			title : key,
			value : node,
			select : activeNode ? node == activeNode.data.value : false,
			expand : expandedNodes && expandedNodes.indexOf(node) >= 0,
			isFolder : !!(typeof node == 'object' && node),
			children : (typeof node == 'object' && node)
				? Object.keys(node).map(function(key) { return buildTree(node[key], key); })
				: null
		};	
	};
	
	var queryObjectTreeData = buildTree(queryService.queryObject);
	
	$scope.getPath = function(node) {
		var path = [];
		while (node.parent)
		{
			path.unshift(node.data.title);
			node = node.parent;
		}
		return path;
	};
	
	$scope.setValueAtPath = function(obj, path, value)
	{
		path.shift(); // throw away root
		
		for (var i = 0; i < path.length - 1; i++)
	        obj = obj[path[i]];

	    obj[path[i]] = value;
	};
	
	$scope.$watch('queryService.queryObject', function () {
		
		scrolledPosition = $(".dynatree-container").scrollTop();

		if(expandedNodes) {
			expandedNodes = [];
			activeNode = $("#queryObjTree").dynatree("getActiveNode");
			$("#queryObjTree").dynatree("getTree").visit(function(node) {
				if(node.bExpanded)
				{
					expandedNodes.push(node.data.value);
				}
			});
		} else {
			expandedNodes = [];
		}
		
		queryObjectTreeData = buildTree(queryService.queryObject);
		queryObjectTreeData.title = "QueryObject";

		$('#queryObjTree').dynatree({
			minExpandLevel: 1,
			clickFolderMode: 1,
			children : queryObjectTreeData,
			keyBoard : true,
			onPostInit: function(isReloading, isError) {
				this.reactivate();
			},
			onActivate: function(node) {
				$scope.selectedNode = node;
				$scope.selectedValue = node.data;
				$scope.selectedKey = node.data.title;
				$scope.$apply();
			},
			debugLevel: 0
		});
		
		$("#queryObjTree").dynatree("getTree").reload();
		$(".dynatree-container").scrollTop(scrolledPosition);

	}, true);
	
	var convertToTableFormat = function(obj) {
		var data = [];
		for (var key in obj) {
			data.push({property : key, value : angular.toJson(obj[key])});
		}
		return data;
	};
	
	$scope.qobjData = convertToTableFormat(queryService.queryObject);
	$scope.selectedItems = [];
	$scope.selectedValue = {};
	
	$scope.$watch('selectedValue.value', function () {
		if($scope.selectedValue.value) {
			if(typeof $scope.selectedValue.value != 'object')
			{
				$scope.isValue = true;
				
				var val = $scope.selectedValue.value;
				//try { val = JSON.parse($scope.selectedValue.value); } catch(e) {}
				$scope.setValueAtPath($scope.queryService.queryObject, $scope.getPath($scope.selectedNode), val);
				$scope.selectedVal = $scope.selectedValue.value;
			} else {
				$scope.isValue = false;
				$scope.qobjData = convertToTableFormat($scope.selectedValue.value);
			}
		} else {
			$scope.isValue = true;
		}
	});
	
	$scope.qobjGridOptions = { 
	        data: 'qobjData',
	        enableRowSelection: true,
	        enableCellEdit: true,
	        enableCellSelection : true,
	        enableCellEditOnFocus : true,
	        columnDefs: [{field: 'property', displayName: 'Property', enableCellEdit: false, enableCellSelection : false}, 
	                     {field:'value', displayName:'Value', enableCellEdit: true}],
	        multiSelect : false,
	        selectedItems : $scope.selectedItems
	 };
	
	$scope.$on('ngGridEventEndCellEdit' , function() {
		if($scope.qobjData.length) {
			var edited = $scope.selectedItems[0];
			if(edited) {
				try {
					edited.value = JSON.parse(edited.value);
				} catch(e) {}
				$scope.selectedValue.value[edited.property] = edited.value;
			}
		}
	});
	 // starting position for the queryObject panel
	 $("#queryObjectPanel" ).css({'top' : -1059, 'left' : 315});
	
	 
	 //************************** query object editor end**********************************
	 
	//**********************************************************REMAPPING**************************************
	 queryService.cache.shouldRemap = [];
	 $scope.newValue= "";
	 queryService.cache.remapValue = [];
	 
	 //checks for object in collection and accordingly updates
//	 $scope.setRemapValue= function(columnToRemap, originalValue, reMappedValue)
//	 {
//		 
//		 if(columnToRemap && originalValue && reMappedValue) {
//			 queryService.queryObject.columnRemap.push({
//				 columnsToRemapId : parseInt(columnId),
//				 originalValue : originalValue,
//				 reMappedValue : reMappedValue
//			 });
//		 }
//		 var columnId = columnToRemap.id;
//		 //TODO parameterize columnType
//		 var matchFound = false;//used to check if objects exist in queryService.queryObject.IndicatorRemap
//		 
//		if(reMappedValue)//handles empty or undefined values
//		{
//			 	queryService.queryObject.columnRemap[columnId] = {
//			 	};
//		}
//		 else
//		 {
//			//checking if the entity exists and update the required object
//			 for(var key in queryService.queryObject.columnRemap)
//			 {
//				 	var oneObject = queryService.queryObject.columnRemap[key];
//				 	if( oneObject.originalValue == originalValue)
//			 		{
//				 		oneObject.reMappedValue = reMappedValue;
//				 		matchFound = true;
//				 		//console.log("match found, hence overwrote", queryService.queryObject.IndicatorRemap );
//			 		}
//			 }
//					 
//			if(!matchFound)//if match is not found create new object
//			{
//				queryService.queryObject.columnRemap[columnId] = {
//					columnsToRemapId : parseInt(columnId),
//					originalValue : originalValue,
//					reMappedValue : reMappedValue
//				};
//				 			//console.log("match not found, hence new", queryService.queryObject.IndicatorRemap );
//			}
//		}
//	 };
	 //**********************************************************REMAPPING END**************************************

	
	//******************************managing weave and its session state**********************************************//
	$scope.$watch(function() {
		return queryService.queryObject.properties.openInNewWindow;
	}, function() {
		if(WeaveService.weave && WeaveService.weave.path) {
			if(queryService.queryObject.properties.openInNewWindow)
				queryService.cache.weaveSessionState = WeaveService.weave.path().getState();
		}
	
		if(!queryService.queryObject.properties.openInNewWindow) {
			if(WeaveService.weaveWindow !== WeaveService.analysisWindow) {
				WeaveService.weaveWindow.close();
				setTimeout(loadFlashContent, 0);
				WeaveService.setWeaveWindow(WeaveService.analysisWindow);
				if($scope.queryService.cache.weaveSessionState)//TODO check with sessionhistory instead// DONT ADD properties dynamically
					WeaveService.weave.path().state($scope.queryService.cache.weaveSessionState);
				
			}
		} else {
			WeaveService.setWeaveWindow($window.open("/weave.html?",
							"abc","toolbar=no, fullscreen = no, scrollbars=no, addressbar=no, resizable=yes"));
		}
	});
	//******************************managing weave and its session state END**********************************************//

	$scope.IndicDescription = "";
	$scope.varValues = [];
	
	$scope.toggle_widget = function(tool) {
		queryService.queryObject[tool.id].enabled = tool.enabled;
	};
	
	$scope.disable_widget = function(tool) {
		tool.enabled = false;
		queryService.queryObject[tool.id].enabled = false;
		WeaveService[tool.id](queryService.queryObject[tool.id]); // temporary because the watch is not triggered
	};
	
	$scope.columnToRemap = {
		value : {}
	};
	
	$scope.showColumnInfo = function(column, param) {
		$scope.columnToRemap = {value : param}; // bind this column to remap to the scope
		if(column) {
			$scope.description = column.description;
			if(column.metadata && column.metadata.aws_metadata) {
				var metadata = angular.fromJson(column.metadata.aws_metadata);
				if(metadata.varValues) {
					queryService.getDataMapping(metadata.varValues).then(function(result) {
						$scope.varValues = result;
					});
				} else {
					$scope.varValues = [];
				}
			}
		} else {
			// delete description and table if the indicator is clear
			$scope.description = "";
			$scope.varValues = [];
		}
	};

	/************** watches for query validation******************/
	$scope.$watchCollection(function() {
		return [queryService.queryObject.scriptSelected,
		        queryService.queryObject.scripOptions,
		        queryService.cache.scriptMetadata
		        ];
	}, function () {
		//if script has not been selected
		if(queryService.queryObject.scriptSelected == null || queryService.queryObject.scriptSelected == "")
		{
			queryService.queryObject.properties.validationStatus = "Script has not been selected.";
			queryService.queryObject.properties.isQueryValid = false;
		}
		//this leaves checking the scriptOptions
		else if (queryService.cache.scriptMetadata) 
		{
			
			$scope.$watch(function() {
				return queryService.queryObject.scriptOptions;
			}, function () {
				var g = 0;
				var counter = Object.keys(queryService.queryObject.scriptOptions).length;
				for(var f in queryService.queryObject.scriptOptions) {
					if(!queryService.queryObject.scriptOptions[f]) {
						queryService.queryObject.properties.validationStatus = "'" + f + "'" + " has not been selected";
						queryService.queryObject.properties.isQueryValid = false;
	
						break;
					}
					else
						g++;
				}
				if(g == counter) {
					queryService.queryObject.properties.validationStatus = "Query is valid";
					queryService.queryObject.properties.isQueryValid = true;
				}
			}, true);
		}
	}, true);
	/************** watches for query validation******************/
	
});


AnalysisModule.config(function($selectProvider) {
	angular.extend($selectProvider.defaults, {
		caretHTML : '&nbsp'
	});
});


//Script Options controller
AnalysisModule.controller("ScriptsSettingsCtrl", function($scope, queryService, $filter, WeaveService) {

	// This sets the service variable to the queryService 
	$scope.queryService = queryService;
	
	$scope.values = [];
	
	//we use the column to fetch the table (list of columns it belongs to)
	$scope.fetchColumnProvider = function(input_column){
		console.log("input", input_column);
		if(input_column){
			WeaveService.fetchNodePath(input_column).then(function(result_nodes){
				queryService.cache.columns = result_nodes.map(function(one_Node) {
					return {
						dataSourceName : one_Node.getDataSourceName(),
						metadata : one_Node.getColumnMetadata()
					};
				}); //end of map
			});
		}
		
	};
	
	$scope.setValue = function(originalValue, newValue)
	{
		if(queryService.queryObject.columnRemap) {
			if(queryService.queryObject.columnRemap[$scope.columnToRemap.value]) {
				queryService.queryObject.columnRemap[$scope.columnToRemap.value][originalValue] = newValue;
			} else {
				queryService.queryObject.columnRemap[$scope.columnToRemap.value] = {};
				queryService.queryObject.columnRemap[$scope.columnToRemap.value][originalValue] = newValue;
			}
		} 
	};
	
	$scope.$watchCollection("columnToRemap.value", function(newVal, oldVal) {
		if(newVal) {
			var temp = [];
			for(var key in queryService.queryObject.columnRemap[newVal]) {
				temp.push(queryService.queryObject.columnRemap[newVal][key]);
			}
			$scope.values = temp;
		}
	});
	
	$scope.$watch('queryService.queryObject.columnRemap', function() {
		if($scope.columnToRemap.value) {
			$scope.values = [];
			for(var key in queryService.queryObject.columnRemap[$scope.columnToRemap.value]) {
				$scope.values.push(queryService.queryObject.columnRemap[$scope.columnToRemap.value][key]);
			}
		}
	}, true);
	
	$scope.$watch('queryService.queryObject.ComputationEngine', function(){
		if($scope.queryService.queryObject.ComputationEngine)
			queryService.getListOfScripts(true, $scope.queryService.queryObject.ComputationEngine);
	});
	
	$scope.$watch("queryService.queryObject.scriptSelected", function(scriptSelected) {
		if(scriptSelected)
			$scope.queryService.getScriptMetadata(scriptSelected, true);
		else
			$scope.queryService.cache.scriptMetadata = {};
	});
	
	//clears script options when script clear button is hit
	$scope.clearScriptOptions = function() {
		queryService.queryObject.scriptOptions = {};
	};
	
	//handles the defaults appearing in the script options selection
	$scope.$watch(function() {
		return queryService.cache.scriptMetadata;
	}, function(scriptMetadata) {
		
			var columns = queryService.cache.columns;
			
			if(scriptMetadata && columns) {
				if(scriptMetadata.hasOwnProperty("inputs")) {
					for(var i in scriptMetadata.inputs) {
						var input = scriptMetadata.inputs[i];
						if(input.type == "column") {
							for(var j in columns) {
								var column = columns[j];
								if(input.hasOwnProperty("defaults")) {
									if(column.metadata.title == input['defaults']) {
										$scope.queryService.queryObject.scriptOptions[input.param] = column;
										break;
									}
								}
							}
						} else if(input.type == "value" || input.type == "options") {
							$scope.queryService.queryObject.scriptOptions[input.param] = input['defaults'];
						}
					}
				}
		}
	}, true);
	
//	//handles the indicators in the script options
//	$scope.$watch(function() {
//		return queryService.queryObject.scriptOptions;
//	}, function(newValue, oldValue) {
//		// run this only if the user chooses to link the indicator
//		if(queryService.queryObject.properties.linkIndicator) {
//			if(!angular.equals(newValue, oldValue)) {
//				var scriptOptions = newValue;
//				for(var key in scriptOptions) { 
//					var option = scriptOptions[key];
//					if(option) {
//						if(option.hasOwnProperty("columnType")) {
//							if(option.columnType.toLowerCase() == "indicator") {
//								queryService.queryObject.Indicator = option;
//							}
//						}
//					}
//				}
//				var oldScriptOptions = oldValue;
//				var newScriptOptions = newValue;
//				var flag = true;
//				for(var key in oldScriptOptions) { 
//					var option = oldScriptOptions[key];
//					if(option) {
//						if(option.hasOwnProperty("columnType")) {
//							if(option.columnType.toLowerCase() == "indicator") {
//								for(var key2 in newScriptOptions) {
//									var option2 = newScriptOptions[key2];
//									if(option2) {
//										if(option2.hasOwnProperty("columnType")) {
//											if(option2.columnType.toLowerCase() == "indicator") {
//												flag = false;
//											}
//										}
//									}
//								}
//								if(flag)
//									queryService.queryObject.Indicator = undefined;
//							}
//						}
//					}
//				}	
//			}
//		}
//	}, true);
//
//	$scope.$watchCollection(function() {
//		return [queryService.queryObject.Indicator, queryService.queryObject.scriptSelected, queryService.cache.scriptMetadata];
//	}, function(newVal, oldVal) {
//		if(newVal != oldVal) {
//			var indicator = newVal[0];
//			var scriptSelected = newVal[1];
//			var scriptMetadata = newVal[2];
//			
//			$scope.$watch(function() {
//				return queryService.cache.scriptMetadata;
//			}, function(newValue, oldValue) {
//				// run this only if the user chooses to link the indicator
//
//				if(queryService.queryObject.properties.linkIndicator) {
//					if(newValue) {
//						scriptMetadata = newValue;
//						if(indicator && scriptMetadata) {
//							for(var i in queryService.cache.scriptMetadata.inputs) {
//								var metadata = queryService.cache.scriptMetadata.inputs[i];
//								if(metadata.hasOwnProperty('type')) {
//									if(metadata.type == 'column') {
//										if(metadata.hasOwnProperty('columnType')) {
//											if(metadata.columnType.toLowerCase() == "indicator") {
//												queryService.queryObject.scriptOptions[metadata.param] = indicator;
//											}
//										}
//									}
//								}
//							}
//						} else if(!indicator) {
//							for(var i in queryService.cache.scriptMetadata.inputs) {
//								var metadata = queryService.cache.scriptMetadata.inputs[i];
//								if(metadata.hasOwnProperty('type')) {
//									if(metadata.type == 'column') {
//										if(metadata.hasOwnProperty('columnType')) {
//											if(metadata.columnType.toLowerCase() == "indicator") {
//												queryService.queryObject.scriptOptions[metadata.param] = undefined;
//											}
//										}
//									}
//								}
//							}
//						}
//					}
//				}
//			}, true);
//		}
//	}, true);
});