/**
 * Handle all Analysis Tab related work - Controllers to handle Analysis Tab
 */
'use strict';
(function(){
	angular.module('weaveAnalyst.AnalysisModule', ['ui.slider', 'ui.bootstrap']);
	
	/////////////////////
	//Analysis Controller
	/////////////////////
	angular.module('weaveAnalyst.AnalysisModule').controller('AnalysisController', analysisController);
	analysisController.$inject = ['$scope','$filter', 'queryService', 'analysisService', 'WeaveService', 'QueryHandlerService', '$window','statisticsService'];
	
	function analysisController ($scope,$filter, queryService, analysisService, WeaveService, QueryHandlerService, $window,statisticsService ){
		var anaCtrl = this;
		
		anaCtrl.queryService = queryService;
		anaCtrl.analysisService = analysisService;
		anaCtrl.WeaveService = WeaveService;
		anaCtrl.QueryHandlerService = QueryHandlerService;
		anaCtrl.statisticsService = statisticsService;
		
		anaCtrl.toggle_widget = toggle_widget;
		anaCtrl.disable_widget = disable_widget;

		anaCtrl.IndicDescription = "";
		anaCtrl.varValues = [];
		
		$("#queryObjectPanel" ).draggable().resizable();
		anaCtrl.queryObjectTreeData = anaCtrl.analysisService.buildTree(anaCtrl.queryService.queryObject);
		anaCtrl.qobjData = anaCtrl.analysisService.convertToTableFormat(anaCtrl.queryService.queryObject);
		
		anaCtrl.qobjGridOptions = { 
		        data: 'anaCtrl.qobjData',
		        enableRowSelection: true,
		        enableCellEdit: true,
		        enableCellSelection : true,
		        enableCellEditOnFocus : true,
		        columnDefs: [{field: 'property', displayName: 'Property', enableCellEdit: false, enableCellSelection : false}, 
		                     {field:'value', displayName:'Value', enableCellEdit: true}],
		        multiSelect : false,
		        selectedItems : anaCtrl.selectedItems
		 };
		
		$scope.$watch(function(){
			return anaCtrl.queryService.queryObject.dataTable;
		}, function(newVal, oldVal) {
			if(anaCtrl.queryService.queryObject.dataTable) {
				anaCtrl.queryService.getDataColumnsEntitiesFromId(anaCtrl.queryService.queryObject.dataTable.id, true);
			}
			
		}, true);
		
		$scope.$watch(function(){
			return anaCtrl.queryService.cache.columns;
		}, function(newVal, oldVal) {
			
			if(!angular.equals(newVal, oldVal)) {
				// this deletes the columns from the old data table selected in the resultSet
				var tempArray = [];
				for(var i = 0; i < anaCtrl.queryService.queryObject.resultSet.length; i++) {
					if(anaCtrl.queryService.queryObject.resultSet[i].dataSourceName != "WeaveDataSource") {
						tempArray.push(anaCtrl.queryService.queryObject.resultSet[i]); // creating a temp array is faster than splicing
					}
				}
				anaCtrl.queryService.queryObject.resultSet = tempArray;
			}
			
			for(var i in anaCtrl.queryService.cache.columns) {
				var column = anaCtrl.queryService.cache.columns[i];
				anaCtrl.queryService.queryObject.resultSet.push({ id : column.id, title: column.title, dataSourceName : column.dataSourceName });
			}
		});

		function toggle_widget (tool) {
			queryService.queryObject[tool.id].enabled = tool.enabled;
		};
		
		function disable_widget (tool) {
			tool.enabled = false;
			queryService.queryObject[tool.id].enabled = false;
			WeaveService[tool.id](queryService.queryObject[tool.id]); // temporary because the watch is not triggered
		};
		
		
	};
})();
