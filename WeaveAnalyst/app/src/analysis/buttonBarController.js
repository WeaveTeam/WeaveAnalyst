/**
 * buttonBarController. This controller manages query import and exports.
 */
(function(){
	
	angular.module("weaveAnalyst.AnalysisModule").controller('buttonBarController', buttonBarController);
	
	buttonBarController.$inject = ['$scope', '$modal', 'queryService', 'WeaveService','projectService', 'QueryHandlerService'];
	function buttonBarController($scope, $modal, queryService, WeaveService,projectService, QueryHandlerService) {
		var bbCtrl = this;
		
		bbCtrl.queryService = queryService;
		bbCtrl.WeaveService = WeaveService;
		bbCtrl.projectService = projectService;
		bbCtrl.QueryHandlerService = QueryHandlerService;
		
		//structure for file upload
		bbCtrl.queryObjectUploaded = {
				file : {
					content : "",
					filename : ""
				}
		};
		//options for the dialog for saving output visuals
		bbCtrl.opts = {
				 backdrop: false,
		          backdropClick: true,
		          dialogFade: true,
		          keyboard: true,
		          templateUrl: 'src/analysis/savingOutputsModal.html',
		          controller: 'savingQOModalController',
		          resolve:
		          {
		                      projectEntered: function() {return $scope.projectEntered;},
		                      queryTitleEntered : function(){return $scope.queryTitleEntered;},
		                      userName : function(){return $scope.userName;}
		          }
			};


		//Handles the download of a query object
		bbCtrl.exportQuery = function() {
			if(WeaveService.weave)
			{
				bbCtrl.queryService.queryObject.sessionState = WeaveService.weave.path().getState();
			}
			
			var blob = new Blob([ angular.toJson(queryService.queryObject, true) ], {
				type : "text/plain;charset=utf-8"
			});
			saveAs(blob, "QueryObject.json");//TODO add a dialog to allow saving file name
		};
		 
		//cleans the queryObject
		bbCtrl.cleanQueryObject = function(){
			queryService.queryObject = {
					title : "Beta Query Object",
					date : new Date(),
		    		author : "",
		    		dataTable : "",
					ComputationEngine : "R",
					Indicator : "",
					columnRemap : {},
					filters : [],
					treeFilters : [],
					GeographyFilter : {
						stateColumn:{},
						nestedStateColumn : {},
						countyColumn:{},
						geometrySelected : null,
						selectedStates : null,
						selectedCounties : null
					},
					openInNewWindow : false,
					Reidentification : {
						idPrevention :false,
						threshold : 0
					},
					scriptOptions : {},
					scriptSelected : "",
					properties : {
						linkIndicator : false,
						validationStatus : "test",
						isQueryValid : false
					},
					filterArray : [],
					treeFilterArray : [],
					visualizations : {
						MapTool : {
							title : 'MapTool',
							template_url : 'src/visualization/tools/mapChart/map_chart.tpl.html',
							enabled : false
						},
						BarChartTool : {
							title : 'BarChartTool',
							template_url : 'src/visualization/tools/barChart/bar_chart.tpl.html',
							enabled : false
						},
						DataTableTool : {
							title : 'DataTableTool',
							template_url : 'src/visualization/tools/dataTable/data_table.tpl.html',
							enabled : false
						},
						ScatterPlotTool : {
							title : 'ScatterPlotTool',
							template_url : 'src/visualization/tools/scatterPlot/scatter_plot.tpl.html',
							enabled : false
						},
						AttributeMenuTool : {
							title : 'AttributeMenuTool',
							template_url : 'src/visualization/tools/attributeMenu/attribute_Menu.tpl.html',
							enabled: false
						},
						ColorColumn : {
							title : "ColorColumn",
							template_url : 'src/visualization/tools/color/color_Column.tpl.html'
						},
						KeyColumn : {
							title : "KeyColumn",
							template_url : 'src/visualization/tools/color/key_Column.tpl.html'
						}
					},
					resultSet : [],
					weaveSessionState : null
			};//TODO fix this   		
		};
		
		bbCtrl.saveVisualizations = function (projectEntered, queryTitleEntered, userName) {
	    	
	    	var saveQueryObjectInstance = $modal.open(bbCtrl.opts);
	    	saveQueryObjectInstance.result.then(function(params){//this takes only a single object
	    	//console.log("params", params);
	    		//bbCtrl.projectService.getBase64SessionState(params);
	    		
	    	});
	    };
	    
	    	
		//chunk of code that runs when a QO is imported
	    $scope.$watch(function(){
	    	return bbCtrl.queryObjectUploaded.file;
	    }, function(n, o) {
			if(bbCtrl.queryObjectUploaded.file.content)
			{
				bbCtrl.queryService.queryObject = angular.fromJson(bbCtrl.queryObjectUploaded.file.content);
				if(bbCtrl.WeaveService.weave)
				{
					bbCtrl.WeaveService.weave.path().state(bbCtrl.queryService.queryObject.sessionState);
					delete bbCtrl.queryService.queryObject.sessionState;
				}
			}
	    }, true);
	};

	
	///////////////////
	//MODAL controller
	///////////////////
	angular.module("weaveAnalyst.AnalysisModule").controller('savingQOModalController', savingQOModalController);
	savingQOModalController.$inject = ['$scope', '$modalInstance', 'projectEntered', 'queryTitleEntered', 'userName'];
	
	function savingQOModalController ($scope, $modalInstance, projectEntered, queryTitleEntered, userName){
		$scope.close = function (projectEntered, queryTitleEntered, userName) {
			  var params = {
					  projectEntered : projectEntered,
					  queryTitleEntered : queryTitleEntered,
					  userName :userName
			  };
		  $modalInstance.close(params);
	};
	}
})();
