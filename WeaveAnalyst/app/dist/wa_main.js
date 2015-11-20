'use strict';
//                                 
//                                 'ui.sortable',
//Using IIFEs

if(!this.wa)
	this.wa = {};
(function($stateProvider, $urlRouterProvider, $rootScope){

	angular.module('weaveAnalyst',['ui.router',
	                               'ui.grid',
	                               'ui.grid.treeView',
	                               'ui.grid.expandable',
	                               'ui.grid.pinning',
	                               'ui.grid.selection',
	                               'ui.layout',
	                               'ui.select',
	                               'ui.tree', 
	                               'mk.editablespan',
	                               'ngAnimate',
	                               'mgcrea.ngStrap',
	                               'ui.bootstrap',
	                               'angularSpinner',
	                               'ngSanitize',
	                               'weaveAnalyst.utils',
	                               'weaveAnalyst.configure',
	                               'weaveAnalyst.dataStatistics',
	                               //'weaveAnalyst.queryObjectEditor', 
	                               'weaveAnalyst.project',
	                               'weaveAnalyst.errorLog',
	                               'weaveAnalyst.nested_qo',
	                               'weaveAnalyst.AnalysisModule',
	                               'weaveAnalyst.WeaveModule',
	                               'weaveAnalyst.run']);

	
	angular.module('weaveAnalyst.configure', ['weaveAnalyst.configure.auth',
	                                          'weaveAnalyst.configure.metadata',
	                                          'weaveAnalyst.configure.script']);
	
	angular.module('weaveAnalyst').run(['$rootScope', function($rootScope){
		
		var x = $rootScope;
		var gh = WeaveAPI.globalHashMap;
		
		gh.addGroupedCallback({}, function (){
			$rootScope.$apply();
		});

	}]);
	
	angular.module('weaveAnalyst').config(function($stateProvider, $urlRouterProvider) {
	
	//$parseProvider.unwrapPromises(true);
	
	$urlRouterProvider.otherwise('/index');
	
	$stateProvider
		.state('index', {
			url:'/projects',//projects is the entry point into the app
	    	templateUrl : 'src/project/projectManagementPanel.html',
	    	controller : 'ProjectManagementController',
	    	controllerAs : 'prjtCtrl',
	    	data: {
	    		activetab : 'project'
	    	}
		})
		.state('metadata', {
			url:'/metadata',
			templateUrl : 'src/configure/metadata/metadataManager.html',
			controller: 'MetadataManagerController',
			controllerAs : 'mDataCtrl',
			data : {
				activetab : 'metadata'
			}
		})
	    .state('script_management', {
	    	url:'/scripts',
	    	templateUrl : 'src/configure/script/scriptManager.html',
	    	//controller : 'ScriptManagerCtrl',
	    	data:{
	    		activetab : 'script_management'
	    	}
	    })
	    .state('analysis', {
	    	url:'/analysis',
	    	templateUrl : 'src/analysis/analysis.tpl.html',
	    	controller: 'AnalysisController',
	    	controllerAs : 'anaCtrl',
	    	data : {
	    		activetab : 'analysis'
	    	}
	    })
	    .state('project', {
	    	url:'/projects',
	    	templateUrl : 'src/project/projectManagementPanel.html',
	    	controller : 'ProjectManagementController',
	    	controllerAs : 'prjtCtrl',
	    	data: {
	    		activetab : 'project'
	    	}
	    })
	    .state('cross_tab',{
	    	url:'/cross_tab',
	    	templateUrl: 'src/analysis/crosstab/cross_tab.tpl.html',
	    	data :{
    			activetab : 'cross_tab'
    		}
	    })
	    .state('data_stats',{
	    	url:'/dataStatistics',
	    	templateUrl : 'src/dataStatistics/dataStatisticsMain.tpl.html',
    		controller : 'data_StatisticsController',
    		controllerAs : 'ds_Ctrl',
    		data :{
    			activetab : 'data_stats'
    		}
	    })
	    .state('data_stats.summary_stats',{
	    	url:'/summary_stats',
	    	templateUrl: 'src/dataStatistics/summary_stats.tpl.html',
	    	data :{
    			activetab : 'summary_stats'
    		}
	    })
	    .state('data_stats.correlations', {
	    	url:'/correlations',
	    	templateUrl : 'src/dataStatistics/correlation_matrices.tpl.html',
	    	data :{
    			activetab : 'correlations'
    		}
	    })
	    .state('data_stats.regression', {
	    	url:'/regression',
	    	templateUrl :'src/dataStatistics/regression_analysis.tpl.html',
	    	data:{
	    		activetab: 'regression'
	    	}
	    });
		
	    
});
	
	angular.module('weaveAnalyst').controller('weaveAnalystController',weaveAnalystController );
	
	weaveAnalystController.$inject = ['$state','authenticationService', 'WeaveService'];
	function weaveAnalystController ($state,authenticationService, WeaveService){//treating controllers as a constructor
		
		var wa_main = this;
		
		wa_main.state = $state;
		wa_main.authenticationService = authenticationService;
		wa_main.WeaveService = WeaveService;
		
		//launching Weave
		wa_main.WeaveService.launch_Weave();
	};
	
	
	//using the value provider recipe 
	angular.module('weaveAnalyst').value("dataServiceURL", '/WeaveServices/DataService');
	angular.module('weaveAnalyst').value('adminServiceURL', '/WeaveServices/AdminService');
	angular.module('weaveAnalyst').value('projectManagementURL', '/WeaveAnalystServices/ProjectManagementServlet');
	angular.module('weaveAnalyst').value('scriptManagementURL', '/WeaveAnalystServices/ScriptManagementServlet');
	angular.module('weaveAnalyst').value('computationServiceURL', '/WeaveAnalystServices/ComputationalServlet');
	angular.module('weaveAnalyst').value('WeaveDataSource', 'WeaveDataSource');



})();//end of IIFE



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
	analysisController.$inject = ['$scope','$filter','$modal', '$window', 'queryService', 'rUtils'];
	
	function analysisController ($scope,$filter,$modal, $window, queryService, rUtils ){
		$scope.isCollapsed = false;
		var anaCtrl = this;
		
		anaCtrl.queryService = queryService;
		anaCtrl.rUtils = rUtils;
		anaCtrl.getaActive_QO = getaActive_QO;
		anaCtrl.openAdvRModal = openAdvRModal;
		
		anaCtrl.advR_modal_opts = {
				backdrop: false,
		          backdropClick: true,
		          dialogFade: true,
		          keyboard: true,
		          templateUrl: 'src/analysis/advRModal.html',
		          windowClass : 'errorLog-modal',
		          controller: 'advRModalController',
		          controllerAs: 'adCtrl',
		          resolve:
		          {
//		                      projectEntered: function() {return $scope.projectEntered;},
//		                      queryTitleEntered : function(){return $scope.queryTitleEntered;},
//		                      userName : function(){return $scope.userName;}
		          }
		};
		
		anaCtrl.active_qoName = anaCtrl.queryService.active_qoName;
		anaCtrl.active_qoName.addImmediateCallback(null, anaCtrl.getaActive_QO, true);
		
		function getaActive_QO (){
			anaCtrl.active_qo = anaCtrl.queryService.queryObjectCollection.getObject(anaCtrl.active_qoName.value);
		};
		
		function openAdvRModal(){
			var modalInst = $modal.open(anaCtrl.advR_modal_opts);
		};
	};
	
	
	///////////////////
	// ADVANCED R MODAL controller
	///////////////////
	angular.module('weaveAnalyst.AnalysisModule').controller('advRModalController', advRModalController);
	advRModalController.$inject = ['$scope','rUtils'];
	function advRModalController($scope, rUtils){
		
		var adCtrl = this;
		adCtrl.rUtils = rUtils;
		adCtrl.getInstalled_R_Packages = getInstalled_R_Packages;
		adCtrl.get_packages = get_packages;
		adCtrl.get_Pkg_Objects = get_Pkg_Objects;
		
		adCtrl.rUtils.getRMirrors();//getting list of CRAN mirrors
		adCtrl.getInstalled_R_Packages();
		
		adCtrl.gridOptions = {
			columnDefs : [
                            { field: 'Package', width: '35%' },
                            { field: 'Version', width: '60%' }
                         ],
            enableFiltering : true
		};
		
		function getInstalled_R_Packages (){
			adCtrl.rUtils.getInstalled_R_Packages().then(function(result){
				adCtrl.gridOptions.data = result;
			});
		}
		
		function get_packages (){
			adCtrl.rUtils.get_packages_at_repo(adCtrl.rMirror.url);
		}
		
		function get_Pkg_Objects (){
			adCtrl.rUtils.get_Pkg_Objects(adCtrl.pkg.Package);
		}
		
		$scope.$watch('adCtrl.rMirror', function(){
			if(adCtrl.rMirror)
				adCtrl.get_packages();
		});
		
		$scope.$watch('adCtrl.pkg', function(){
			if(adCtrl.pkg)
				adCtrl.get_Pkg_Objects();
		});
	};
})();

/**
 * this is the service responsible for the analysis tab
 */
(function(){
	angular.module('weaveAnalyst.AnalysisModule').service('analysisService', analysisService);
	analysisService.$inject = ['$q', 'runQueryService', 'scriptManagementURL'];
	
	function analysisService ($q, runQueryService, scriptManagementURL){
		var that = this;
		
		that.cache = {
				scriptList : [],
				scriptMetadata :null
		};
		/**
	     * This function wraps the async aws getListOfScripts function into an angular defer/promise
	     * So that the UI asynchronously wait for the data to be available...
	     */
	    that.getListOfScripts = function(forceUpdate, compEngine) {
	    	if(!forceUpdate) {
				return that.cache.scriptList;
	    	} else {
	    		switch(compEngine){
	    			case ("R"):
	    				runQueryService.queryRequest(scriptManagementURL, 'getListOfRScripts', null, function(result){
	    					that.cache.scriptList = [];
	    	    			that.cache.scriptList = result;
	    	    		});	
	    			break;
	    			case("STATA"):
	    				runQueryService.queryRequest(scriptManagementURL, 'getListOfStataScripts', null, function(result){
	    					that.cache.scriptList = [];
	    	    			that.cache.scriptList = result;
	    	    		});	
	    			break;
	    			default:
	    				that.cache.scriptList = [];
	    		}
	    		
	    	}
	    };

	    
		/**
	     * This function wraps the async aws getListOfScripts function into an angular defer/promise
	     * So that the UI asynchronously wait for the data to be available...
	     */
	    that.getScriptMetadata = function(scriptName, forceUpdate) {
	        
	    	var deferred = $q.defer();

	    	if (!forceUpdate) {
	    		return this.cache.scriptMetadata;
	    	}
	    	if(scriptName) {
	    		runQueryService.queryRequest(scriptManagementURL, 
	    									'getScriptMetadata', 
	    									[scriptName], 
	    									function(result){
								    			that.cache.scriptMetadata = result;
								    				deferred.resolve(that.cache.scriptMetadata);
	    									},
	    									function(error){
	    											deferred.reject(error);
	    									});
	    	}
	        return deferred.promise;
	    };

	};
})();
/**
 * this directive contains buttons for different operations on the Query object
 * IMPORT
 * EXPORT
 * SAVE
 * EDITOR
 * RUN-UPDATE
 * RUN-NEW
 * 
 * 
 * @author spurushe
 * @author fkamayou
 */
(function(){
	
	angular.module('weaveAnalyst.AnalysisModule').directive('qoButtons', qoButtons);
	
	function qoButtons(){
		return {
			restrict: 'E',
			scope:{},
			templateUrl:'src/analysis/qo_buttons.tpl.html', 
			controller : qoButtonController,
			controllerAs : 'qo_btnsCtrl',
			bindToController: true,
			link: function(){
				
			}
		};//directive definition object
	};
	
	//controller is put out of the directive definition
	qoButtonController.$inject = ['$scope', '$modal','$window', 'queryService', 'WeaveService','projectService', 'QueryHandlerService'];//dependencies
	function qoButtonController ($scope, $modal, $window, queryService, WeaveService,projectService, QueryHandlerService){
		var qo_btnsCtrl = this;
		
		qo_btnsCtrl.queryService = queryService;
		qo_btnsCtrl.QueryHandlerService = QueryHandlerService;
		qo_btnsCtrl.WeaveService = WeaveService;
		qo_btnsCtrl.projectService = projectService;
		
		qo_btnsCtrl.export_Query = export_Query;
		qo_btnsCtrl.save_Visualizations = save_Visualizations;
		qo_btnsCtrl.run_update = run_update;
		qo_btnsCtrl.run = run;
		qo_btnsCtrl.launch_Weave = launch_Weave;
		
		//structure for file upload
		qo_btnsCtrl.queryObjectUploaded = {
				file : {
					content : "",
					filename : ""
				}
		};
		//options for the dialog for saving output visuals
		qo_btnsCtrl.opts = {
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


		//chunk of code that runs when a QO is imported
	    $scope.$watch(function(){
	    	return qo_btnsCtrl.queryObjectUploaded.file;
	    }, function(n, o) {
			if(qo_btnsCtrl.queryObjectUploaded.file.content)
			{
				qo_btncCtrl.queryService.populate_qo(angular.fromJson(qo_btnsCtrl.queryObjectUploaded.file.content));
				//qo_btnsCtrl.analysisService.active_qo = angular.fromJson(qo_btnsCtrl.queryObjectUploaded.file.content);
//				if(qo_btnsCtrl.WeaveService.weave)
//				{
//					qo_btnsCtrl.WeaveService.weave.path().state(qo_btnsCtrl.queryService.queryObject.sessionState);
//					delete qo_btnsCtrl.queryService.queryObject.sessionState;
//				}
			}
	    }, true);
	    
		
		function export_Query(){
			console.log("exporting query");
			if(WeaveService.weave)
			{
				qo_btnsCtrl.queryService.queryObject.sessionState = WeaveService.weave.path().getState();
			}
			
			var blob = new Blob([ angular.toJson(queryService.queryObject, true) ], {
				type : "text/plain;charset=utf-8"
			});
			saveAs(blob, "QueryObject.json");//TODO add a dialog to allow saving file name
		};
		
		
		function save_Visualizations(){
			var saveQueryObjectInstance = $modal.open(qo_btnsCtrl.opts);
	    	saveQueryObjectInstance.result.then(function(params){//this takes only a single object
	    	console.log("params", params);
	    		//qo_btnsCtrl.projectService.getBase64SessionState(params);
	    		
	    	});
		};
		
		
		function run_update(){
			//QueryHandlerService.run(queryService.queryObject, true)//update
		};
		
		
		function run(){
			//run new QueryHandlerService.run(queryService.queryObject)
		};
		
		function launch_Weave (){
			qo_btnsCtrl.WeaveService.launch_Weave();
		};
	}
	
	
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
/**
 * this directive contains the UI and logic for the correlation Matrix
@author spurushe
 */
(function(){
	angular.module('weaveAnalyst.dataStatistics', []);
	angular.module('weaveAnalyst.dataStatistics').directive('correlationMatrix', heatMapComponent);
	
	function heatMapComponent (){
		return {
			restrict : 'E', 
			template : '<div id="corrMatrixContainer"></div>',
			scope : {
					data: '='
			},
			link: function(scope, elem, attrs){
				var dom_element_to_append_to = document.getElementById('corrMatrixContainer');
				var array1 = [1,6,9,4];
				var array2= [6.6,2,5,10];
				var array3= [2,7,8,1];
				var array4= [4,5,3,1.9];
				var array5= [1,3.4,5,10];
				var mydata = [array1, array2, array3, array4];
				var labels = ["one", "two", "three", "four"];
				
				
				var config = {
						data: mydata,
						labels : labels,
						container : dom_element_to_append_to
					};
					
					var hm = new window.wa.d3_viz.heatMap();//create
					hm.initialize_heatMap(config);//initialize
					hm.render_heatMap();//render
//					
				
//				scope.$watch(function(){
//					return scope.data;
//				}, function(){
//					if(scope.data){
//						var config = {
//							data: scope.data.input_data,
//							labels : scope.data.labels,
//							container : dom_element_to_append_to
//						};
//						
//						var hm = new window.wa.d3_viz.heatMap();//create
//						hm.initialize_heatMap(config);//initialize
//						hm.render_heatMap();//render
//					}
//				});
				

			}//end of link function

		};
	}//end of directive defintion
})();


/**
 * controllers and service for the 'Data Stats' tab and its nested tabs
 * @author spurushe
 */
//TODO create submodules corresponding to every nested tab
//Module definition
(function(){
		//*******************************Value recipes********************************************
	//Correlation coefficients
	angular.module('weaveAnalyst.dataStatistics').value('pearsonCoeff', {label:"Pearson's Coefficent", algorithm : 'pearson' });
	angular.module('weaveAnalyst.dataStatistics').value('spearmanCoeff', {label : "Spearman's Coefficient", algorithm:"spearman"});

	//value recipes to be used in result handling of non-query statistics
	//Summary statistics for each numerical data columns
	angular.module('weaveAnalyst.dataStatistics').value('summaryStatistics', 'SummaryStatistics');

	//correlation Matrices computed using different algorithms
	angular.module('weaveAnalyst.dataStatistics').value('correlationMatrix', 'CorrelationMatrix');


	//************************SERVICE***********************************************************
	angular.module('weaveAnalyst.dataStatistics').service('statisticsService', data_statisticsService);
	
	data_statisticsService.$inject = ['$q', 'queryService','analysisService', 'QueryHandlerService','summaryStatistics', 'correlationMatrix' ];
	function data_statisticsService($q, queryService,analysisService, QueryHandlerService, summaryStatistics, correlationMatrix){
		var that = this;
		
		that.cache = {
			dataTable : null,
			summaryStats : {statsData:[], columnDefinitions:[]},
			sparklineData :{ breaks: [], counts: {}},
			heatMap :null,
			columnTitles: null,//column titles of the columns in current table 
			input_metadata : null
		};
		
		/**
		 * common function that runs various statistical tests and scripts and processes results accordingly
		 * main purpose is to run NON_QUERY computations 
		 * @param scriptName name of the script 
		 * @param statsObject the input data
		 * @param statistic to calculate 
		 */
		that.calculate_Statistics = function (scriptName, statsObject, statToCalculate, forceUpdate){

			var statsInputs = QueryHandlerService.handle_ScriptInput_Options(statsObject);//will return a dataColumnmatrix bean
			if(statsInputs){
				//getting the data
				queryService.getDataFromServer(statsInputs, null).then(function(success){
					
					//executing the stats script
					if(success){
						queryService.runScript(scriptName).then(function(result){
							if(result){
								//handling different kinds of non -query results returned from R
								for(var x = 0; x < 1; x++){
									
									switch (statToCalculate)
									{
										case summaryStatistics:
											that.handle_DataStats(result.resultData[0], that.cache.input_metadata.inputs );
											that.handle_SparklineData(result.resultData[1]);
											break;
										case correlationMatrix:
											that.handle_CorrelationData(result.resultData[0]);
											break;
										
									}
									
								}//end of loop for statsinputs
							}
						});
					}
				});
			}
		};
		
		
		//function calls for calculation data_stats
		that.get_Summary_Statistics = function(dt){
			//retrieve metadata for the built in canned stats script
			analysisService.getScriptMetadata("getStatistics.R", true).then(function(){
				that.cache.input_metadata = analysisService.cache.scriptMetadata;
				
				queryService.getDataColumnsEntitiesFromId(dt.id, true).then(function(){
					var ncols = queryService.cache.numericalColumns;
					
					that.getColumnTitles(ncols);
					
					that.calculate_Statistics('getStatistics.R', {'SummaryStatistics':ncols}, summaryStatistics, true );
				});
			});
		};
		
		
		/**
		 * this function populates the Summary statistics grid
		 * @param resultData summary statistics of the numerical columns
		 * @param metadata script metadata for the stats script
		 */
		that.handle_DataStats = function(resultData, metadata){
			if(resultData){
				var data = [];
				
				var columnTitles = this.cache.columnTitles;
				for(var x = 0; x < resultData.length; x++){// x number of numerical columns
					
					var oneStatsGridObject = {};
					for(var y = 0; y < metadata.length; y++){//y number of metadata objects
						
						if(metadata[y].param == 'ColumnName'){//since the dataprovider for this entry is different i.e. columnTitles
							oneStatsGridObject[metadata[y].param] = columnTitles[x];
							continue;
						}
						
						oneStatsGridObject[metadata[y].param] = resultData[x][y-1];
					}
					
					data.push(oneStatsGridObject);
				}
				
				that.cache.summaryStats.statsData = [];//clear previous entries
				that.cache.summaryStats.statsData = data;//populates the data displayed in the grid
			}
		};
		
		
		/**
		 * processes the sparklineData populates the data provider for the sparkline directives
		 * @param result the sparkline data returned from R
		 */
		that.handle_SparklineData = function(result){
			//pre-process the sparklines
			var sparklineData= {breaks:[], counts:{}};
			
			sparklineData.breaks  = result[0][0];//breaks are same for all columns needed only once
			for(var x =0; x < result.length; x++){
				sparklineData.counts[this.cache.columnTitles[x]] = result[x][1];//TODO get rid of hard code
			}
			
			// used as the data provider for drawing the sparkline directives
			that.cache.sparklineData = {};//clear the previous content
			that.cache.sparklineData = sparklineData;
		};
		
		//function calls to calculate coefficients
		//does not require a separate script metadata file
		that.get_Coefficients = function(dt, algorithm){
			
			queryService.getDataColumnsEntitiesFromId(dt.id, true).then(function(){
				var ncols = queryService.cache.numericalColumns;
				
				that.getColumnTitles(ncols);
				
				that.calculate_Statistics("getCorrelationMatrix.R", {'CorrelationMatrix' : ncols, 'algorithm' : algorithm}, correlationMatrix, true );
			});
		};
		
		/**
		 * processes the correlation matrix data: populates the data provider for the correlation matrix directive
		 * @param result the corr matrix data returned from R
		 */
		that.handle_CorrelationData = function(resultData){
			var hm = that.cache.heatMap = {};
			hm.input_data = resultData;
			hm.labels = that.cache.columnTitles;
			
		};
		
		
		/**
		 * convenience function to get column titles
		 * @param column objects 
		 */
		that.getColumnTitles = function(columns){
			that.cache.columnTitles = [];//reset from previous run
			
			for(var t=0; t < columns.length; t++){
				this.cache.columnTitles[t] = columns[t].title;
			}
		};
		
	};


	//********************CONTROLLERS***************************************************************
	angular.module('weaveAnalyst.dataStatistics').controller('data_StatisticsController', data_statisticsController );
	
	data_statisticsController.$inject = ['$scope','queryService', 'statisticsService', 'pearsonCoeff', 'spearmanCoeff'];
	function data_statisticsController ($scope, queryService, statisticsService, pearsonCoeff, spearmanCoeff){
		var ds_Ctrl = this;
		
		ds_Ctrl.queryService = queryService;
		ds_Ctrl.statisticsService = statisticsService;
		
		ds_Ctrl.statsData = [];//dataprovider for ui-grid
		ds_Ctrl.selectedCoeff = {label : "", algorithm : ""};
		ds_Ctrl.availableCoeffList = [pearsonCoeff, spearmanCoeff];
		
		ds_Ctrl.get_Summary_Statistics = get_Summary_Statistics;
		ds_Ctrl.get_Coefficients = get_Coefficients;
		
		if(queryService.cache.dataTableList.length == 0)//getting the list of datatables if they have not been retrieved yet//that is if the person visits this tab directly
			queryService.getDataTableList(true);
		
		/////////
		//watches
		//////////
		$scope.$watch(function (){
			return ds_Ctrl.statisticsService.cache.summaryStats.statsData;
		}, function(){
			ds_Ctrl.statsData = ds_Ctrl.statisticsService.cache.summaryStats.statsData;
		});
		
		
		function get_Summary_Statistics (){
			var dt = ds_Ctrl.statisticsService.cache.dataTable; 
				
			if(dt)//if a datatable has been selected
				ds_Ctrl.statisticsService.get_Summary_Statistics(dt);
		};
		
		function get_Coefficients (algorithm){
			var dt = ds_Ctrl.statisticsService.cache.dataTable;
			if(dt)
				ds_Ctrl.statisticsService.get_Coefficients(dt, algorithm);
		
		}; 
	};
})();
/**
 * this directive contains the UI and logic for the sparklines drawn for each numerical column
@author spurushe
 */

(function(){
	
	angular.module('weaveAnalyst.dataStatistics').directive('sparkLines', sparkLinesComponent);
	
	function sparkLinesComponent (){
		return{
			restrict: 'EA',
			scope : {
				
					data: '='//data that describes the column breaks and column counts in each bin for each numerical column !! gets populated asyncronously
			},
			template: '<div id = "sparklineContainer"></div>',
			//TODO will have individual controller for more advanced interaction with sparkline
			link: function(scope, elem, attrs){
				
				var dom_element_to_append_to = document.getElementById('sparklineContainer');
				
				//TODO try getting rid of this watch
				scope.$watch(function(){
					return scope.data;//the data used for  creatign sparklines
				}, function(){
					if(scope.data){
						if(scope.data.breaks.length > 1){
							//console.log("got it", scope.data);
							for(var i in scope.data.counts){
								
								//service call for drawing one sparkline one/column
								var config ={
										container : dom_element_to_append_to,
										width: 60,
										height:60,
										breaks : scope.data.breaks, 
										counts: scope.data.counts[i],
										title : i
								};
								
								
								var sl = new window.wa.d3_viz.sparkLine();//create
								sl.initialze_sparkLine(config);//initialize
								sl.render_sparkLine();//render
								
							}
						}
					}
				});			
			}//end of link function
		};//enf of directive definition object
	};
			
})();
/**
 * controller for the error log that is universal to all tabs
 * Also includes the service for logging errors
 */
(function(){
	angular.module('weaveAnalyst.errorLog', []);
	
	/////////////////////
	//CONTROLLERS
	/////////////////////
	
	angular.module('weaveAnalyst.errorLog').controller('analystErrorLogController', analystErrorLogController);

	analystErrorLogController.$inject = ['$modal', 'errorLogService'];
	function analystErrorLogController($modal, errorLogService){
		var aEl = this;
		aEl.errorLogService = errorLogService;
		aEl.openErrorLog = function(){
			$modal.open(aEl.errorLogService.errorLogModalOptions);
		};
	}
	
	
	angular.module('weaveAnalyst.errorLog').controller('errorLogInstanceController', errorLogInstanceController);
	errorLogInstanceController.$inject= ['errorLogService'];
	function errorLogInstanceController(errorLogService){
		var inst_Ctrl = this;
		
		inst_Ctrl.errorLogService = errorLogService;
	};
	
	/////////////////
	//SERVICES
	/////////////////
	
	angular.module('weaveAnalyst.errorLog').service('errorLogService',errorLogService);
	errorLogService.$inject = ['$modal'];
	
	function errorLogService ($modal){

		var that = this;
		that.logs = "";
		
		that.errorLogModalOptions = {//TODO find out how to push error log to bottom of page
				 backdrop: true,
		         backdropClick: true,
		         dialogFade: true,
		         keyboard: true,
		         templateUrl: 'src/errorLog/analystErrorLog.html',
		         controller: 'errorLogInstanceController',
		         controllerAs : 'inst_Ctrl',
		         windowClass : 'errorLog-modal'
			};
		
		that.showErrorLog = false;
		//function to pop open the error log when required
		that.openErrorLog = function(error){
			that.logInErrorLog(error);
			$modal.open(that.errorLogModalOptions);
		};

		/**
		 *this is the function that will be used over all tabs to log errors to the error log
		 *@param the string you want to log to the error log
		 */
		that.logInErrorLog = function(error){
			this.logs += error  + new Date().toLocaleTimeString();
		};
		
	};
	
})();//end of IIFE



/**
 *this tree is an d3 interactive interface for creating the nested query object. 
 *@shwetapurushe
 */

(function(){
	angular.module('weaveAnalyst.nested_qo', [] );
	angular.module('weaveAnalyst.nested_qo').directive('d3QueryObjectTree', d3nested_qoTreeComponent);
	
	function d3nested_qoTreeComponent (){
		return {
			restrict : 'E', 
			template : '<div id = "qo_tree"></div>',
			controller : d3nested_qoTreeController,
			controllerAs : 'd3tree_Ctrl',
			bindToController : true,
			link : function(scope, elem, attr){
				var dom_element = document.getElementById("qo_tree");
				
				var config = {
					container : dom_element
					
				};
				
				var nesTree = new window.wa.d3_viz.collapsibleTree();
				nesTree.intialize_tree(config);
			}
		};
	};
	
	function d3nested_qoTreeController (){
		var d3tree_Ctrl = this;
		
	};
})();
/**
 * this is an interactive interface for manipulating the nested query object
 * @author shweta purushe
 */

(function (){
	angular.module('weaveAnalyst.nested_qo').directive('queryObjectTree', nested_qoTree_component);
	
	function nested_qoTree_component (){
		return {
			restrict : 'E',
			templateUrl : 'src/nested_qo/nested_qotree.tpl.html', 
			controller : nested_qoTree_Controller,
			bindToController : true,
			controllerAs : 'tree_Ctrl',
			link : function (scope, elem, attrs){
				
			}
		};
	};
	
	nested_qoTree_Controller.$inject= ['$scope'];
	function nested_qoTree_Controller ($scope){
		var tree_Ctrl = this;
		 $scope.remove = function (scope) {
		        scope.remove();
		      };

		      $scope.toggle = function (scope) {
		        scope.toggle();
		      };

		      $scope.moveLastToTheBeginning = function () {
		        var a = $scope.data.pop();
		        $scope.data.splice(0, 0, a);
		      };

		      $scope.newSubItem = function (scope) {
		        var nodeData = scope.$modelValue;
		        nodeData.nodes.push({
		          id: nodeData.id * 10 + nodeData.nodes.length,
		          title: nodeData.title + '.' + (nodeData.nodes.length + 1),
		          nodes: []
		        });
		      };

		      $scope.collapseAll = function () {
		        $scope.$broadcast('collapseAll');
		      };

		      $scope.expandAll = function () {
		        $scope.$broadcast('expandAll');
		      };
		 $scope.data = [{
		        'id': 1,
		        'title': 'Query_Object1',
		        'nodes': [
		          {
		            'id': 11,
		            'title': 'Query_Object1.1',
		            'nodes': [
		              {
		                'id': 111,
		                'title': 'Query_Object1.1.1',
		                'nodes': []
		              }
		            ]
		          },
		          {
		            'id': 12,
		            'title': 'Query_Object1.2',
		            'nodes': []
		          }
		        ]
		      }, {
		        'id': 2,
		        'title': 'Query_Object2',
		        'nodrop': true, // An arbitrary property to check in custom template for nodrop-enabled
		        'nodes': [
		          {
		            'id': 21,
		            'title': 'Query_Object2.1',
		            'nodes': []
		          },
		          {
		            'id': 22,
		            'title': 'Query_Object2.2',
		            'nodes': []
		          }
		        ]
		      }, 
		      {
		        'id': 3,
		        'title': 'Query_Object3',
		        'nodes': [
		          {
		            'id': 31,
		            'title': 'Query_Object3.1',
		            'nodes': []
		          }
		        ]
		      }];
	};
})();
/**
 * this directive checks for matching the output parameters of one query object with the input parameters of the successive one 
 * in the nested query object
 * A nested query object is a collection of two or more query objects with a directed analytic flow
 * 
 * @author spurushe
 */

(function(){
	angular.module('weaveAnalyst.nested_qo').directive('paramMatcher', param_MatcherComponent);
	
	function  param_MatcherComponent (){
		return {
			restrict : 'E',
			templateUrl : 'src/nested_qo/param_Matcher.tpl.html',
			controller : param_MatcherController,
			controllerAs : 'p_MCtrl',
			bindToController : true,
			link : function(){ 
				
			}
		};
	};// end og directive definition
	
	
	param_MatcherController.$inject = ['$scope', 'projectService', 'queryService'];
	function param_MatcherController ($scope, projectService, queryService){
		var p_MCtrl = this;
		p_MCtrl.projectService = projectService;
		p_MCtrl.queryService = queryService;
		p_MCtrl.handle_qo_selection = handle_qo_selection;
		
		p_MCtrl.selected_prj;
		p_MCtrl.selected_qo;//this will be set to a new clean query object or the one selected from drop downs 
		
		p_MCtrl.add_mode= null;
		
		$scope.$watch('p_MCtrl.add_mode', function(){
			if(p_MCtrl.add_mode == 'new'){
				var fresh = confirm("Do you wish to save the query object created?" );
				if(fresh == false){
					p_MCtrl.queryService.native_nested_qo = new QueryObject();
				}
				else{
					//save (1)to database (2) download it and 
					//then create a fresh one
				}
				
			}
		});
		
		$scope.$watch('p_MCtrl.selected_prj', function(){
			if(p_MCtrl.selected_prj)
				p_MCtrl.projectService.getListOfQueryObjects(p_MCtrl.selected_prj.Name);
		});
		
		function handle_qo_selection (){
			//get the script output params for the selected qo object
		};
		
		
	};
})();
/**
 *this service handles the validation and functions associated with executing a nested query object
 *@author shweta purushe 
 */
(function(){
	angular.module('weaveAnalyst.nested_qo').service('paramMatchService', paramMatchService);
	
	function paramMatchService (){
		var that = this;
	};
})();
/**

 * this manager is responsible for maintaining the pipeline of query objects and their execution
 * @author shweta purushe
 * @author sanjay krishna
 */

(function(){
	angular.module('weaveAnalyst.nested_qo').service('QueryManagerService', QueryManagerService);
	
	QueryManagerService.$inject = ['queryService'];
	function QueryManagerService(queryService){
		var that = this;
		

		//create the base query object;
		//there will be a base query object irrespective of new ones added or deleted, one always stays that represents the analysis tab 
		that.native_nested_qo;
		
		//MANAGE QUERY OBJECTS HERE
		
		that._queryMap = {};
		that._queryId = 0;
		
		that.generate_new_Id = function (){
			that._queryId = that._queryId + 1;
			return query_Id;
		};
		
		that.request_Query_Object = function (q_id){
			if(q_id)
				return that._queryMap[q_id];
			else{
				var new_id = that.generate_new_Id();
				var qo = new QueryObject(new_id);
				that._queryMap[new_id] = qo;
				
				return qo;
			}
		};
		
		that.execute_nested_queryObject = function(){
			//use query Service to loop through the qos
		};
		
	}
	
})();
/**
 * this manager is responsible for maintaining the pipeline of query objects and their execution
 * @author shweta purushe
 * @author sanjay krishna
 */
//(function (){
//	
//	function QueryObjectManager(){
//		this._queryMap = {};
//		this._queryId = 0;
//	}
//	
//	var p  = QueryObjectManager.prototype;
//	
//	
//	p.generate_new_Id = function (){
//		this._queryId = this._queryId + 1;
//		return query_Id;
//	};
//	
//	p.request_Query_Object = function (q_id){
//		if(q_id)
//			return this._queryMap[q_id];
//		else{
//			var new_id = generate_new_Id();
//			var qo = new QueryObject(new_id);
//			this._queryMap[new_id] = qo;
//			
//			return qo;
//		}
//	};
//	
//	p.execute_nested_queryObject = function(){
//		
//	};
//	
//	window.wa.nested_qo.QueryObjectManager = QueryObjectManager;//this should happen only once and stored on the global wa object
//})();
'use strict';
/**
 * Query Object Service provides access to the main "singleton" query object.
 *
 * Don't worry, it will be possible to manage more than one query object in the
 * future.
 */

(function (){
	//////////////////////
	//SERVICE
	//////////////////////
	angular.module("weaveAnalyst.nested_qo").service("queryService", queryService);
	queryService.$inject = ['$q', 'runQueryService',
                            'dataServiceURL', 'adminServiceURL','projectManagementURL','computationServiceURL','WeaveDataSource'];
	
	function queryService ($q, runQueryService, 
   		 				   dataServiceURL, adminServiceURL, projectManagementURL, computationServiceURL, WeaveDataSource)
	{
		
		var that = this; // point to this for async responses
		that.queryObjectCollection;
		that.active_qo;
		that.active_qoName;
		
		this.cache = {
				columns : [],
				dataTableList : [],
				filterArray : [],
				numericalColumns : []
		};
		
		this.queryObject = {
				title : "Beta Query Object",
				date : new Date(),
	    		author : "",
	    		dataTable : "",
				ComputationEngine : "",
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
					isQueryValid : false,
					hideQueryObjectPanel : true
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
		};    		
	    
		
		
		that.init_sessioned_qos = function(){
			
			/**************
			******** QUERY OBJECT COLLECTION
			**************/
			that.queryObjectCollection = WeaveAPI.globalHashMap.requestObject("queryObjects",  weavecore.LinkableHashMap);
			
			//TODO call this line to the UI for creation of new QO and addition to collection
			/**************
			******** DEFAULT QUERY OBJECT
			**************/
			that.active_qo = that.queryObjectCollection.requestObject("",  wa.QueryObject);//dynamically create name every time
			
			that.active_qoName = WeaveAPI.globalHashMap.requestObject("active_qo", weavecore.LinkableString);//value is empty
			that.active_qoName.value = that.queryObjectCollection.getName(that.active_qo);//setting the value here
		};
		
		//INIT QUERY OBJECT COLLECTION
		that.init_sessioned_qos();
		
		that.populate_qo = function(in_qo){
			WeaveAPI.SessionManager.setSessionState(that.active_qo, in_qo);
		};
		
		
		/**
	     * This function wraps the async aws runScript function into an angular defer/promise
	     * So that the UI asynchronously wait for the data to be available...
	     */
	    that.runScript = function(scriptName) {
	        
	    	var deferred = $q.defer();

	    	runQueryService.queryRequest(computationServiceURL, 
	    								 'runScript', 
	    								 [scriptName], 
	    								 function(result){	
											deferred.resolve(result);
	    								 },
	    								 function(error){
    										deferred.reject(error);
	    								 }
	    	);
	    	
	        return deferred.promise;
	    };
	    
	    
	    /**
	     * this function pulls data before running a script
	     * @param inputs the ids of the columns to pull the data
	     * @param reMaps remapObjects to overwrite data values temporarily
	     */
	    that.getDataFromServer = function(inputs, reMaps) {
	    	
	    	var deferred = $q.defer();

	    	runQueryService.queryRequest(computationServiceURL, 
	    								'getDataFromServer', 
	    								[inputs, reMaps],
	    								function(result){	
											deferred.resolve(result);
										 },
										 function(error){
											deferred.reject(error);
										 });
	    	
	        return deferred.promise;
	    };
	    
		
		/**
		  * This function makes nested async calls to the aws function getEntityChildIds and
		  * getDataColumnEntities in order to get an array of dataColumnEntities children of the given id.
		  * We use angular deferred/promises so that the UI asynchronously wait for the data to be available...
		  */
		that.getDataColumnsEntitiesFromId = function(id, forceUpdate) {
			
			var deferred = $q.defer();

			if(!forceUpdate) {
				return that.cache.columns;
			} else {
				if(id) {
					runQueryService.queryRequest(dataServiceURL, "getEntityChildIds", [id], function(idsArray) {
						//console.log("idsArray", idsArray);
						runQueryService.queryRequest(dataServiceURL, "getEntitiesById", [idsArray], function (dataEntityArray){
							//console.log("dataEntirtyArray", dataEntityArray);
							//console.log("columns", that.cache.columnsb);
							
							that.cache.numericalColumns = [];//collects numerical columns for statistics calculation
							
							that.cache.columns = $.map(dataEntityArray, function(entity) {
								if(entity.publicMetadata.hasOwnProperty("aws_metadata")) {//will work if the column already has the aws_metadata as part of its public metadata
									var metadata = angular.fromJson(entity.publicMetadata.aws_metadata);
									
									if(metadata.hasOwnProperty("columnType")) {
										var columnObject = {};
										columnObject.id = entity.id;
										columnObject.title = entity.publicMetadata.title;
										columnObject.columnType = metadata.columnType;
										columnObject.varType = metadata.varType;
										columnObject.description = metadata.description || "";
										columnObject.dataSourceName = WeaveDataSource;
										
										if(metadata.varRange)
											columnObject.varRange = metadata.varRange;
//										//pick all numerical columns and create a matrix
										if(metadata.varRange && (metadata.varType == "continuous") && (metadata.columnType != "geography"))
											{
												that.cache.numericalColumns.push(columnObject);
											}
										return columnObject;

									}
									else//handling an empty aws-metadata object 
										{
										
											var columnObject = {};
											columnObject.id = entity.id;
											columnObject.title = entity.publicMetadata.title;
											columnObject.columnType = "";
											columnObject.description =  "";
											columnObject.dataSourceName = WeaveDataSource;
											
											return columnObject;
										}
									
								}
								else{//if its doesnt have aws_metadata as part of its public metadata, create a partial aws_metadata object
									
										var columnObject = {};
										columnObject.id = entity.id;
										columnObject.title = entity.publicMetadata.title;
										columnObject.dataType = entity.publicMetadata.dataType;
										columnObject.entityType = entity.publicMetadata.entityType;
										columnObject.keyType = entity.publicMetadata.keyType;
										columnObject.columnType = "";
										columnObject.description =  "";
										columnObject.dataSourceName = WeaveDataSource;
										
										return columnObject;
									
								}
							});
								deferred.resolve(that.cache.columns);
						},
						function(error) {
								deffered.reject(error);
						});
					});
					
				}
			}
	       return deferred.promise;
	   };
	   
	   that.getEntitiesById = function(idsArray, forceUpdate) {
	   	
	   	var deferred = $q.defer();

			if(!forceUpdate) {
				return that.cache.dataColumnEntities;
			} else {
				if(idsArray) {
					runQueryService.queryRequest(dataServiceURL, "getEntitiesById", [idsArray], function (dataEntityArray){
						that.cache.dataColumnEntities = dataEntityArray;
						
							deferred.resolve(dataEntityArray);
					},
					function(error) {
							deferred.reject(error);
					});
				}
			}
			
	       return deferred.promise;
	   	
	   };
	       
	       
	   /**
		  * This function makes nested async calls to the aws function getEntityIdsByMetadata and
		  * getDataColumnEntities in order to get an array of dataColumnEntities children that have metadata of type geometry.
		  * We use angular deferred/promises so that the UI asynchronously wait for the data to be available...
		  */
		that.getGeometryDataColumnsEntities = function(forceUpdate) {

			var deferred = $q.defer();

			if(!forceUpdate) {
				return that.cache.geometryColumns;
			}
			
			runQueryService.queryRequest(dataServiceURL, 'getEntityIdsByMetadata', [{"dataType" :"geometry"}, 1], function(idsArray){
				runQueryService.queryRequest(dataServiceURL, 'getEntitiesById', [idsArray], function(dataEntityArray){
					that.cache.geometryColumns = $.map(dataEntityArray, function(entity) {
						return {
							id : entity.id,
							title : entity.publicMetadata.title,
							keyType : entity.publicMetadata.keyType,
							dataType : entity.publicMetadata.dataType,
							geometry : entity.publicMetadata.geometry,
							projection: entity.publicMetadata.projection,
							dataSourceName : WeaveDataSource
						};
					});
						deferred.resolve(that.cache.geometryColumns);
				}, function(error) {
						deferred.reject(error);
				});
			});

			return deferred.promise;
	   };
	   
		/**
	     * This function wraps the async aws getDataTableList to get the list of all data tables
	     * again angular defer/promise so that the UI asynchronously wait for the data to be available...
	     */
	    that.getDataTableList = function(forceUpdate){
	    	var deferred = $q.defer();

	    	if(!forceUpdate) {
				return that.cache.dataTableList;
	    	} else {
	    		runQueryService.queryRequest(dataServiceURL, 'getDataTableList', null, function(EntityHierarchyInfoArray){
	    			that.cache.dataTableList = EntityHierarchyInfoArray;
    				deferred.resolve(that.cache.dataTableList);
	    		 }, function(error){
    				 deferred.reject(error);
	    		 });
	    	}
	        return deferred.promise;
	    };
	    
	    that.updateEntity = function(user, password, entityId, diff) {

	    	var deferred = $q.defer();
	        
	    	runQueryService.queryRequest(adminServiceURL, 'updateEntity', [user, password, entityId, diff], function(){
	            
	                deferred.resolve();
	        }, function(error) {
	        		deferred.reject(error);
	        });
	        return deferred.promise;
	    };
	    
	    this.getDataMapping = function(varValues)
	    {
	        	var deferred = $q.defer();

	        	var callback = function(result)
	        	{
	                   deferred.resolve(result);
	        	};

	         	if (Array.isArray(varValues))
	         	{
	         		setTimeout(function(){ callback(varValues); }, 0);
	         		return deferred.promise;
	         	}

	         	//if (typeof varValues == 'string')
	         	//	varValues = {"aws_id": varValues};
	         		
	         	runQueryService.queryRequest(dataServiceURL, 'getColumn', [varValues, NaN, NaN, null],
	         		function(columnData) {
	         			var result = [];
	         			for (var i in columnData.keys) 
	         				result[i] = {"value": columnData.keys[i], "label": columnData.data[i]};
	         			callback(result);
	     			},
	     			function(error) {
	     					deferred.reject(error);
	     			}
	     		);
		        return deferred.promise;
	    };
	    
	    that.CSVToArray = function(strData, strDelimiter) {
	        // Check to see if the delimiter is defined. If not,
	        // then default to comma.
	        strDelimiter = (strDelimiter || ",");
	        // Create a regular expression to parse the CSV values.
	        var objPattern = new RegExp((
	        // Delimiters.
	        "(\\" + strDelimiter + "|\\r?\\n|\\r|^)" +
	        // Quoted fields.
	        "(?:\"([^\"]*(?:\"\"[^\"]*)*)\"|" +
	        // Standard fields.
	        "([^\"\\" + strDelimiter + "\\r\\n]*))"), "gi");
	        // Create an array to hold our data. Give the array
	        // a default empty first row.
	        var arrData = [[]];
	        // Create an array to hold our individual pattern
	        // matching groups.
	        var arrMatches = null;
	        // Keep looping over the regular expression matches
	        // until we can no longer find a match.
	        while (arrMatches = objPattern.exec(strData)) {
	            // Get the delimiter that was found.
	            var strMatchedDelimiter = arrMatches[1];
	            // Check to see if the given delimiter has a length
	            // (is not the start of string) and if it matches
	            // field delimiter. If id does not, then we know
	            // that this delimiter is a row delimiter.
	            if (strMatchedDelimiter.length && (strMatchedDelimiter != strDelimiter)) {
	                // Since we have reached a new row of data,
	                // add an empty row to our data array.
	                arrData.push([]);
	            }
	            // Now that we have our delimiter out of the way,
	            // let's check to see which kind of value we
	            // captured (quoted or unquoted).
	            if (arrMatches[2]) {
	                // We found a quoted value. When we capture
	                // this value, unescape any double quotes.
	                var strMatchedValue = arrMatches[2].replace(
	                new RegExp("\"\"", "g"), "\"");
	            } else {
	                // We found a non-quoted value.
	                var strMatchedValue = arrMatches[3];
	            }
	            // Now that we have our value string, let's add
	            // it to the data array.
	            arrData[arrData.length - 1].push(strMatchedValue);
	        }
	        // Return the parsed data.
	        return (arrData);
	    };
	};
})();//end of IIFE



(function(){
	angular.module('weaveAnalyst.nested_qo').service('runQueryService',runQueryService );
	
	runQueryService.$inject = ['errorLogService','usSpinnerService','$modal'];
	
	/**
	 * This function is a wrapper for making a request to a JSON RPC servlet
	 * 
	 * @param {string} url
	 * @param {string} method The method name to be passed to the servlet
	 * @param {?Array|Object} params An array of object to be passed as parameters to the method 
	 * @param {Function} resultHandler A callback function that handles the servlet result
	 * @param {string|number=}queryId
	 * @see aws.addBusyListener
	 */
	
	function runQueryService (errorLogService, usSpinnerService, $modal){
		var that = this;
		
		
		that.queryRequest = function(url, method, params, resultHandler, errorHandler, queryId)
		{
		    var request = {
		        jsonrpc: "2.0",
		        id: queryId || "no_id",
		        method: method,
		        params: params
		    };
		    
		    $.post(url, JSON.stringify(request), handleResponse, "text");

		    function handleResponse(response)
		    {
		    	// parse result for target window to use correct Array implementation
		    	response = JSON.parse(response);
		    	
		        if (response.error)
		        {	
		        	console.log(JSON.stringify(response, null, 3));
		        	//log the error
		        	errorLogService.openErrorLog(response.error.message);
		        	if(errorHandler){
		        		return errorHandler(response.error, queryId);
		        	}
		        }
		        else if (resultHandler){
		            return resultHandler(response.result, queryId);
		        }
		    }
		};
		
		/**
		 * Makes a batch request to a JSON RPC 2.0 service. This function requires jQuery for the $.post() functionality.
		 * @param {string} url The URL of the service.
		 * @param {string} method Name of the method to call on the server for each entry in the queryIdToParams mapping.
		 * @param {Array|Object} queryIdToParams A mapping from queryId to RPC parameters.
		 * @param {function(Array|Object)} resultsHandler Receives a mapping from queryId to RPC result.
		 */
		that.bulkQueryRequest = function(url, method, queryIdToParams, resultsHandler)
		{
			var batch = [];
			for (var queryId in queryIdToParams)
				batch.push({jsonrpc: "2.0", id: queryId, method: method, params: queryIdToParams[queryId]});
			$.post(url, JSON.stringify(batch), handleBatch, "json");
			function handleBatch(batchResponse)
			{
				var results = Array.isArray(queryIdToParams) ? [] : {};
				for (var i in batchResponse)
				{
					var response = batchResponse[i];
					if (response.error)
						console.log(JSON.stringify(response, null, 3));
					else
						results[response.id] = response.result;
				}
				if (resultsHandler)
					resultsHandler(results);
			}
		};
	};
})();//end of IIFE
/**
 *this is a class representation of a query object which can be used to instantiate query objects.  
 */
if(!this.wa)
	this.wa = {};

(function (){
	
	//constructor
	function QueryObject (){
		//config properties not needed in computation or query object storage
		this.config = {
				validationStatus : "test",
				isQueryValid : false,
				hideQueryObjectPanel : true
		};
		
		this._title =  null;
		this._date = new Date();
		this._author; 
		this._computationEngine;
		
		//SCRIPT OPTIONS
		this._scriptSelected;
		this._script_Input_Options = {};
		this._script_Output_Options = {};
		
		//FILTERS
		this._filters = [];
		this._treeFilters = [];
		this._geographyFilter = {
			stateColumn:{},
			nestedStateColumn : {},
			countyColumn:{},
			geometrySelected : null,
			selectedStates : null,
			selectedCounties : null
		};
		
		//Computation RESULTS
		this._resultSet = [];
		//WEAVE SESSION STATE
		this._weaveSessionState;
		
		//Column remapping
		this._columnRemapObject ;
		
		//prevention of re-id
		this._reidentification_Object = {
			idPrevention :false,
			threshold : 0
		};
		
		var p = QueryObject.prototype;
		
		p.set_compEngine = function(value){
			this._computationEngine = value;
		};
		
		window.wa.QueryObject = QueryObject;
		
	}
})();
/** this controller controls the project tab 
 * @author spurushe
 * 
 **/
(function(){
	angular.module('weaveAnalyst.project', []).controller("ProjectManagementController", ProjectManagementController);
	
	ProjectManagementController.$inject = ['$scope', '$modal', '$filter','$location','queryService', 'projectService', 'WeaveService', 'usSpinnerService'];
	
	function ProjectManagementController ($scope,$modal, $filter,$location,queryService, projectService, WeaveService, usSpinnerService){
		var prjtCtrl = this;
		
		prjtCtrl.projectService = projectService;
		prjtCtrl.WeaveService = WeaveService;
		prjtCtrl.queryService = queryService;
		
		prjtCtrl.checkQOTableExits = checkQOTableExits;
		prjtCtrl.construct_view = construct_view;
		prjtCtrl.deleteProject = deleteProject;
		prjtCtrl.openAdditionPanel = openAdditionPanel;
		
		prjtCtrl.insertQueryObjectStatus = 0;//count changes when single queryObject or multiple are added to the database
		prjtCtrl.nameOfQueryObjectToDelete = "";
		prjtCtrl.view_modes = ['List', 'Compact', 'Detail'];
		
		//options needed for creating the modal instance window
		 //communicating with the modal
		prjtCtrl.pjtModalOptions = {//TODO find out how to push error log to bottom of page
				 backdrop: true,
		         backdropClick: false,
		         dialogFade: true,
		         keyboard: true,
		         templateUrl: 'src/project/projectAdditionModal.html',
		         controller: 'pjtAddtionInstanceController',
		         controllerAs : 'pam',
		         resolve :{
		        	 projectNameEntered : function(){
		        		 return $scope.projectNameEntered;
		        		 },
		        	 userNameEntered : function(){
		        		 return $scope.userNameEntered;
		        		 },
		        	 projectDescriptionEntered : function(){
		        		 return $scope.projectDescriptionEntered;
		        		 }
		        	 
		         }
			};
		
		//check for table 
		prjtCtrl.checkQOTableExits();
		//create table with dummy project and queries
		
		
		//when a project is selected or changed
		$scope.$watch(function(){
			return prjtCtrl.projectService.cache.project.selected;
		},function(){
			if(prjtCtrl.projectService.cache.project.selected){
				console.log("project Selected", prjtCtrl.projectService.cache.project.selected.Name);
				prjtCtrl.projectService.getListOfQueryObjects(prjtCtrl.projectService.cache.project.selected.Name);
			}
		});
		
		//Watch for when record is inserted in db
	     $scope.$watch(function(){
	     	return prjtCtrl.queryService.queryObject.properties.insertQueryObjectStatus;
	      }, function(){ 
	    	  prjtCtrl.insertQueryObjectStatus = prjtCtrl.queryService.queryObject.properties.insertQueryObjectStatus;
	     	if(!(angular.isUndefined(prjtCtrl.insertQueryObjectStatus)))
			 {
			 	if(prjtCtrl.insertQueryObjectStatus != 0)
			 		{
	    		 		alert("Query Object has been added");
	    		 		prjtCtrl.queryService.cache.listofQueryObjectsInProject = [];
	    		 		prjtCtrl.queryService.getListOfQueryObjectsInProject(prjtCtrl.projectService.cache.project.selected);//makes a new call
			 		}
			 }
		 
	     	prjtCtrl.queryService.queryObject.properties.insertQueryObjectStatus = 0;//reset
	      });
	     
	     //this function alters the three kinds of views for viewing projects and query objects
	     function construct_view (){
	    	 var mode = prjtCtrl.projectService.viewMode;
	    	 
	    	 if(mode == 'List')
	    		 prjtCtrl.projectService.view_Desc = "This mode displays the projects and its query obejcts as a list. Select Compact to view a project in detail. Select Detail to view a project's query objects in detail.";
	    	 else if(mode == 'Compact')
	    		 prjtCtrl.projectService.view_Desc ="This mode displays a single project in detail. Select List to view a list of projects. Select Detail to view a project's query objects in detail.";
	    	 else 
	    		 prjtCtrl.projectService.view_Desc = "This mode displays the query objects of a project in detail. Select List to view a list of projects. Select Compact to view a project in detail.";
	    		 
	     };
		
	     //checks if a table is created for storing query objects
	     function checkQOTableExits (){
	    	var	pS = prjtCtrl.projectService;
	    	
	    	pS.checkQOTableExits().then(function(projExists){
		    	 console.log("stored_query_objects table exists",projExists );
		    	 if(projExists){
		    		 pS.getListOfProjects().then(function(projectList){
		    			 if(projectList.length == 0)
		    				 alert("There are no stored query objects");
		    		 });//retrives project list
		    	 }
		    	 else{
			    		var conf = confirm("There is no dedicated datatable to store query objects" +"\n"
			    		 		+ "Create a table to store query objects?");
			    		 if(conf == true){
			    			 pS.createQOTable().then(function(status){
			    				 if(status){
			    					 console.log("status", status);
			    				 }
			    					 alert("Table \"stored_query_objects\" has been successfully created");
			    			 });
			    		 }
			    		 else
			    			 alert("You will not be able to store query objects. Refresh the page if you change your mind");
		    	 }
	    	});
	     };
	     
		//deletes an entire Project along with all queryObjects within
		function deleteProject (){
			prjtCtrl.deleteProjectConfirmation(prjtCtrl.projectService.cache.project.selected);
		};
		
		//additional checks for confirming deletion
		function deleteProjectConfirmation (projectSelected){
			var deletePopup = confirm("Are you sure you want to delete project " + projectSelected + "?");
			if(deletePopup == true){
				prjtCtrl.projectService.deleteProject(projectSelected);
			}
		};
		
		
		//button click event that creates the modal
		function openAdditionPanel(){
			var saveNewProject = $modal.open(prjtCtrl.pjtModalOptions);
			
			//called when modal is being closed
			saveNewProject.result.then(function(additionParams){//then function takes a single object
				 console.log("jsons", additionParams.uploadedObjects.queryObjectJsons);
				 console.log("titles", additionParams.uploadedObjects.queryObjectTitles);
				 console.log("userName", additionParams.userNameEntered);
			});
		};
		
	};
	
	
	//Modal instance controller
	angular.module('weaveAnalyst.project').controller('pjtAddtionInstanceController', additionController);
	additionController.$inject= ['$scope', '$modalInstance','projectService', 'projectNameEntered','projectDescriptionEntered', 'userNameEntered'];
	
	function additionController ($scope, $modalInstance,projectService, projectNameEntered,projectDescriptionEntered, userNameEntered){
		var pam = this;
		
		pam.projectService = projectService;
		pam.uploadStatus = "";
		pam.queryObjectJsons = [];
		pam.queryObjectTitles = [];
		pam.saveQueryObjects = saveQueryObjects;
		pam.remove = remove;
		
		//object representation of a SINGLE file uploaded, changed everytime a file is uploaded
		pam.uploaded = {
				QueryObject : {
					filename : "",
					content : ""			
				}
		};
		
		pam.uploadedObjects = {
				
			queryObjectJsons : [],//contains the content of all query objects uploaded (json strings)
			queryObjectTitles : []//contains the titles of all query Objects uploaded
		};
		
		
		//whenever a file is uploaded
		$scope.$watch(function(){
			return pam.uploaded.QueryObject.filename;
		}, function(){
			
			if(pam.uploaded.QueryObject.filename)
				{
					//check if the file had been uploaded before
					if($.inArray(pam.uploaded.QueryObject.filename, pam.uploadedObjects.queryObjectTitles) == -1)
						{
							//managing the title of queryObject (json )uploaded
							var title = pam.uploaded.QueryObject.filename;
							pam.uploadedObjects.queryObjectTitles.push(title);
							
							//managing the content of queryObject (json )uploaded
							var content = pam.uploaded.QueryObject.content;
							pam.uploadedObjects.queryObjectJsons.push(content);
							
							
							var countUploaded = pam.uploadedObjects.queryObjectTitles.length;
							pam.uploadStatus = countUploaded + " file(s) uploaded";
						}
				}
			
		});
		
		//called when save button is hit.;
		function saveQueryObjects (projectNameEntered,projectDescriptionEntered, userNameEntered) {
			if(!projectNameEntered)
				projectNameEntered = "Example Project";
			if(!projectDescriptionEntered)
				projectDescriptionEntered = "These query object(s) belong to " + projectNameEntered;
			if(!userNameEntered)
				userNameEntered = "Awesome User";
			
			var additionParams = {
					projectNameEntered : projectNameEntered,
					userNameEntered :userNameEntered,
					projectDescriptionEntered : projectDescriptionEntered,
					uploadedObjects : $scope.uploadedObjects
			};
			
			if(additionParams.uploadedObjects.queryObjectJsons.length > 0){//only if something is uploaded, save it
				
				pam.projectService.createNewProject(additionParams.userNameEntered,
						additionParams.projectNameEntered,
						additionParams.projectDescriptionEntered,
						additionParams.uploadedObjects.queryObjectTitles,
						additionParams.uploadedObjects.queryObjectJsons,
						null);
				
				$modalInstance.close(additionParams);
			}
			else{
				alert("Please upload a query object to create a project");
			}
			
		 };
		 
	 	function remove (file){
		 //removes the file from the uploaded collection
		 var index = $.inArray(file, pam.uploadedObjects.queryObjectTitles);
		 console.log("index", index);
		 pam.uploadedObjects.queryObjectTitles.splice(index, 1);
		 pam.uploadedObjects.queryObjectJsons.splice(index, 1);
		 
		 var countUploaded = pam.uploadedObjects.queryObjectTitles.length;
		 pam.uploadStatus = countUploaded + " file(s) uploaded";
		 if(countUploaded == 0){
			 pam.uploadStatus = "";
			 pam.uploaded.QueryObject.filename = null;
			 pam.uploaded.QueryObject.content = null;
			 
		 }
	 };
	};
})();//end of IIFE





/**
 * contains all the functions required for project management 
 * @author spurushe
 */
(function(){
	
	angular.module('weaveAnalyst.project').service('projectService', projectService);
	projectService.$inject = ['$q', '$rootScope', 'WeaveService', 'runQueryService','queryService', 'projectManagementURL'];
	
	function projectService ($q, rootScope, WeaveService, runQueryService,queryService, projectManagementURL){
		var that = this;
		
		that.cache= {
				project: {selected : null},
				listOfProjectsFromDatabase : [],
				returnedQueryObjects : [],
				columnstring : null, 
				projectDescription : null, 
				userName : null, 
				weaveSessionState : null,
				deleteProjectStatus : null, 
				deleteQueryObjectStatus : null, 
				insertQueryObjectStatus : null,
				no_of_projects : 0
		};

		/**
		 *this function checks if the table 'stored_query_objects' has already been created
		 */
		that.checkQOTableExits = function(){
			var deferred = $q.defer();
			
			runQueryService.queryRequest(projectManagementURL, 'checkQOTableExits', null, function(result){
				deferred.resolve(result);
			});
			return deferred.promise;
		};
		
		/**
		 *this function creates the table 'stored_query_objects' if it has not been created before
		 */
		that.createQOTable = function(){
			var deferred = $q.defer();
				
			runQueryService.queryRequest(projectManagementURL, 'createQOTable', null, function(result){
				deferred.resolve(result);
			});
			return deferred.promise;
		};
		
		
		/**
	     * This function wraps the async aws getListOfProjects function into an angular defer/promise
	     * So that the UI asynchronously wait for the data to be available...
	     */
	   
	    that.getListOfProjects = function() {
	    	var deferred = $q.defer();
	    	runQueryService.queryRequest(projectManagementURL, 'getProjectListFromDatabase', null, function(result){
				that.cache.listOfProjectsFromDatabase = result;
				that.cache.no_of_projects = result.length;
				deferred.resolve(result);
			});
	    	
	    	return deferred.promise;
	    };
	    
	    /**
	     * This function wraps the async aws getQueryObjectsInProject function into an angular defer/promise
	     * So that the UI asynchronously wait for the data to be available...
	     */
	    that.getListOfQueryObjects = function(projectName) {
	    	var deferred = $q.defer();
	    	runQueryService.queryRequest(projectManagementURL, 'getListOfQueryObjects', [projectName], function(AWSQueryObjectCollection){
	    		that.cache.returnedQueryObjects = [];
	    		if(!(angular.isUndefined(AWSQueryObjectCollection)))
	    			{    			
	        			var countOfJsons = AWSQueryObjectCollection.length;
	        			for(var i = 0; i < countOfJsons; i++)
	        			{
	        				var singleObject= {};
	        				singleObject.queryObject = JSON.parse(AWSQueryObjectCollection[i].finalQueryObject);//json content of the query object
	        				singleObject.queryObjectName = AWSQueryObjectCollection[i].queryObjectName;//title of the query object
	        				singleObject.projectDescription = AWSQueryObjectCollection[i].projectDescription;
	        				singleObject.author = AWSQueryObjectCollection[i].author;
	        				
	        				that.cache.projectDescription = AWSQueryObjectCollection[i].projectDescription;//handling description
	        				
	        				if(angular.isUndefined(AWSQueryObjectCollection[i].thumbnail)){//handling visualization generated by a query object
	        					singleObject.thumbnail = undefined;
	        					console.log("This queryObject does not contain any stored visualizations");
	        				}
	        				else{
	        					
	        					singleObject.thumbnail = "data:image/png;base64," + AWSQueryObjectCollection[i].thumbnail;
	        				}
	        				
	        				
	        				that.cache.columnstring = "";
	        				var columns = singleObject.queryObject.scriptOptions;
	        				for(var j in columns){
	        					var title = columns[j].metadata.title;
	        					that.cache.columnstring= that.cache.columnstring.concat(title) + " , ";
	        				}
	        				singleObject.columns = that.cache.columnstring.slice(0,-2);//getting rid of the last comma
	        				that.cache.returnedQueryObjects[i] = singleObject;
	        			}
	        			
	    			}else{
	    				that.cache.project.selected = "";
	    				that.cache.projectDescription = "";
	    				that.cache.userName = "";
	    			}
	    		
	                deferred.resolve(that.cache.returnedQueryObjects);
	                rootScope.$apply();
	        	
	        });
	    	
	    	return deferred.promise;
	    };
	    
	    /**
	     * returns the base64 encoded session state of the visualizations generated by a query object
	     */
	    that.getBase64SessionState = function(params){
	    	if(!(WeaveService.weaveWindow.closed)){
	    		var base64SessionState = WeaveService.getBase64SessionState();
	    		queryService.queryObject.weaveSessionState = WeaveService.getSessionStateObjects();//TODO fix this adding properties dynamically not GOOD
	    		that.writeSessionState(base64SessionState, params);
	    	}
	    };
	   
	    that.writeSessionState = function(base64String, params){
	    	var projectName;
	    	var userName;
	    	var queryObjectTitles;
	    	var projectDescription;
	    	
	    	if(angular.isDefined(params.projectEntered))
	    		{
		    		projectName = params.projectEntered;
		    		projectDescription = "This project belongs to " + projectName;
	    		}
	    	else
	    		{
		    		projectName = "Other";
		    		projectDescription = "These query objects do not belong to any project"; 
	    		}
	    	if(angular.isDefined(params.queryTitleEntered)){
	    		queryObjectTitles = params.queryTitleEntered;
	    		queryService.queryObject.title = queryObjectTitles;
	    	}
	    	else
	    		 queryObjectTitles = queryService.queryObject.title;
	    	if(angular.isDefined(params.userName)){
	    		userName = params.userName;
	    		queryService.queryObject.author = userName;
	    	}
	    	else
	    		userName = "Awesome User";
	    	

	    	var queryObjectJsons = angular.toJson(queryService.queryObject);
	    	var resultVisualizations = base64String;
	    	
	    	
	    	runQueryService.queryRequest(projectManagementURL, 'writeSessionState', [userName, projectDescription, queryObjectTitles, queryObjectJsons, resultVisualizations, projectName], function(result){
	    		console.log("adding status", result);
	    		alert(queryObjectTitles + " has been added");
	    	});
	    };
	    
	    
	    /**
	     * this function returns the session state corresponding to the thumbnail of a query object that was clicked
	     */
	    that.returnSessionState = function(queryObject){
	   	 var deferred = $q.defer();
	   	 queryObject = angular.toJson(queryObject);
	   	 //console.log("stringified queryObject", queryObject);
	   	 
	   	 runQueryService.queryRequest(projectManagementURL, 'getSessionState', [queryObject], function(result){
	   		 that.cache.weaveSessionState = result;
	   		 deferred.resolve(result);
	        	
	   	 });
	    		
			return deferred.promise;
	   };
	   
	   	//as soon as service returns deleteStatus
		//1. report status
		//2. reset required variables
		//3. updates required lists
	   /**
	    * This function wraps the async aws deleteproject function into an angular defer/promise
	    * So that the UI asynchronously wait for the data to be available...
	    */
	   that.deleteProject = function(projectName) {
	   	var deferred = $q.defer();
	   	runQueryService.queryRequest(projectManagementURL, 'deleteProjectFromDatabase', [projectName], function(result){
	           
	       	that.cache.deleteProjectStatus = result;//returns an integer telling us the number of row(s) deleted
	       	
	      	 if(! (that.cache.deleteProjectStatus == 0 )){
	      		 
	      		that.cache.returnedQueryObjects = [];//reset
	      		that.cache.projectDescription = "";
	      		 alert("The Project " + projectName + " has been deleted");
	      		 that.getListOfProjects();//call the updated projects list
	      	 }
	      	 
	      	 that.cache.deleteProjectStatus = 0;//reset 
	      	 deferred.resolve(result);
	       	
	       });
	       return deferred.promise;
	   };
	   
	   /**
	    * This function wraps the async aws deleteQueryObject function into an angular defer/promise
	    * So that the UI asynchronously wait for the data to be available...
	    */
	   that.deleteQueryObject = function(projectName, queryObjectTitle){
		   var deferred = $q.defer();
		   runQueryService.queryRequest(projectManagementURL, 'deleteQueryObjectFromProject', [projectName, queryObjectTitle], function(result){
		       	that.cache.deleteQueryObjectStatus = result;
		       	console.log("in the service",that.cache.deleteQueryObjectStatus );
		       	
		       	alert("Query Object " + queryObjectTitle + " has been deleted");
		       	
		       	that.cache.returnedQueryObjects = [];//clears list
		       	
		       	that.getListOfQueryObjects(projectName);//fetches new list
		       	
		       	//if the project contained only one QO which was deleted , retrive the new updated lists of projects
		       	if(that.cache.returnedQueryObjects.length == 0){
		       		that.getListOfProjects();
		       		that.cache.project.selected = "";
		       	}
		       	deferred.resolve(result);
		       	
		       });
		       
		       return deferred.promise;
	   };
	   
	   /**
	    * This function wraps the async aws insertQueryObjectToProject function into an angular defer/promise
	    * adds a query object (row) to the specified project in the database
	    * So that the UI asynchronously wait for the data to be available...
	    */
	   that.insertQueryObjectToProject = function(userName, projectName, projectDescription,queryObjectTitles,queryObjectJsons, resultVisualizations){
	 
	   	var deferred = $q.defer();

	   	runQueryService.queryRequest(projectManagementURL, 'insertMultipleQueryObjectInProjectFromDatabase', [userName,
	   	                                                                                          projectName,
	   	                                                                                          projectDescription,
	   	                                                                                          queryObjectTitles,
	   	                                                                                          queryObjectJsons,
	   	                                                                                          resultVisualizations], function(result){
	   		that.cache.insertQueryObjectStatus = result;//returns an integer telling us the number of row(s) added
	       	console.log("insertQueryObjectStatus", that.cache.insertQueryObjectStatus);
	       	if(that.cache.insertQueryObjectStatus != 0){
	       		alert(that.cache.insertQueryObjectStatus + " Query Object(s)" +  " have been added to project:" + projectName);
	       	}
	       	
	       	deferred.resolve(result);
	       	
	       });
	       return deferred.promise;
	       
	   };
	   
	   that.createNewProject = function(userNameEntered, projectNameEntered,projectDescriptionEntered, queryObjectTitles, queryObjectJsons){
		   that.insertQueryObjectToProject(userNameEntered,
				   						   projectNameEntered,
				   						   projectDescriptionEntered,
				   						   queryObjectTitles,
				   						   queryObjectJsons,
				   						   null)
		   .then(function(){
			   that.cache.listOfProjectsFromDatabase = [];//clear
			   that.getListOfProjects();//fetch new list
		   });

	   };

	};
})();


/**
 *this directive contains the logic for managing the list view of projects and its query objects
 *@author spurushe 
 */

(function(){
	angular.module('weaveAnalyst.project').directive('projectGrid', projectGrid);
	
	function projectGrid (){
		return{
			restrict : 'E',
			controller : projectGridController,
			scope:{
				data : '='
			},
			template : '<div ui-grid = "pGrid_Ctrl.gridOptions" ui-grid-pinning ui-grid-expandable></div>',
			controllerAs : 'pGrid_Ctrl',
			bindToController : true,
			link : function(){

			}
		};
	};//end of directive defintion
	
	projectGridController.$inject = ['projectService', 'uiGridTreeViewConstants', '$scope'];
	function projectGridController (projectService, uiGridTreeViewConstants, $scope){
		var pGrid_Ctrl = this;
		
		
		pGrid_Ctrl.projectService = projectService;

		pGrid_Ctrl.gridOptions = {
		          expandableRowTemplate : 'src/project/subGrid.html',  //This is the template that will be used to render subgrid.
		          expandableRowHeight : 150, //This will be the height of the subgrid
		          expandableRowScope : {
		              subGridVariable : 'subGridScopeVariable'  //Variables of object expandableScope will be available in the scope of the expanded subgrid
		          },
		          onRegisterApi: function (gridApi) {
		              gridApi.expandable.on.rowExpandedStateChanged($scope, function (row) {
		                  if (row.isExpanded) {
		                    row.entity.subGridOptions = {
		                      columnDefs: [
		                      { name: 'author'},
		                      { name: 'queryObjectName'},
		                      { name: 'columns'}
		                    ]};
		                    
		                    pGrid_Ctrl.projectService.getListOfQueryObjects(row.entity.Name).then(function(childQos){
		                    	
		                    	row.entity.subGridOptions.data = childQos;
		                    });
		                    
		                  }
		              });
		          },
				  data : pGrid_Ctrl.data//sets the data of the parent grid
        };
		
		//defining the columns of the parent grid
		pGrid_Ctrl.gridOptions.columnDefs = [
		                                { name: 'Name', width: '35%'  },
		                                { name: 'Description', width: '60%' }
		                            ];
		
			
	};//end of grid controller
		
})();
/**
 * this directive represents a single query object and its respective controls.
 * @spurushe
 */

(function(){
	angular.module('weaveAnalyst.project').directive('queryCard', queryCard);
	function queryCard(){
		return {
			restrict : 'E',
			scope :{
				item : '='
			},
			templateUrl : 'src/project/query_card.tpl.html',
			controller : queryCardController,
			controllerAs : 'q_cardCtrl',
			bindToControler : true,
			link : function(){
				
			}
		};
	}//end of directive definition
	
	queryCardController.$inject = ['$scope', 'projectService'];
	function queryCardController(scope, projectService){
		var q_cardCtrl = this;
		q_cardCtrl.projectService = projectService;
		q_cardCtrl.item = scope.item;
		q_cardCtrl.editMode = false;
		
		
		q_cardCtrl.returnSessionState = returnSessionState;
		q_cardCtrl.deleteSpecificQueryObject = deleteSpecificQueryObject;
		q_cardCtrl.deleteQueryConfirmation = deleteQueryConfirmation;
		q_cardCtrl.openInAnalysis = openInAnalysis;
		q_cardCtrl.edit = edit;
		q_cardCtrl.save = save;

		//toggles the edit mode for editing a query card
		function edit (){
			q_cardCtrl.editMode = true;
		};
		
		//saves a modified query card to the server
		function save (item){
			//save the edited state
			//if saved make the edit mode false
			alert(item.queryObject.title + " has been saved");
			q_cardCtrl.editMode = false;
		};
		
		
		//deletes a single queryObject within the currently selected Project
		function deleteSpecificQueryObject(item){
			q_cardCtrl.nameOfQueryObjectToDelete = item.queryObjectName; 
			q_cardCtrl.deleteQueryConfirmation(q_cardCtrl.projectService.cache.project.selected, q_cardCtrl.nameOfQueryObjectToDelete);
		};
		
		function deleteQueryConfirmation (currentProject, currentQueryFileName){
			var deletePopup = confirm("Are you sure you want to delete " + currentQueryFileName + " from " + currentProject + "?");
			if(deletePopup == true){
				q_cardCtrl.projectService.deleteQueryObject(currentProject, currentQueryFileName);
			}
		};
		
		function openInAnalysis (incoming_queryObject) {
			$scope.$emit("queryObjectloaded", incoming_queryObject);
			$location.path('/analysis'); 
		};

		//called when the thumb-nail is clicked
		/**
		 *@param given a query object
		 *@returns it returns the weave visualizations for it.
		 */
		function returnSessionState (queryObject){
//			q_cardCtrl.projectService.returnSessionState(queryObject).then(function(weaveSessionState){
//				var newWeave;
//				if(!(angular.isUndefined(weaveSessionState))){
//					
//			   		 if (!newWeave || newWeave.closed) {
//							newWeave = window
//									.open("/weave.html?",
//											"abc",
//											"toolbar=no, fullscreen = no, scrollbars=yes, addressbar=no, resizable=yes");
//						}
//			   		 
//			   		q_cardCtrl.WeaveService.setWeaveWindow(newWeave);
//				   		
//				   		$scope.$watch(function(){
//				   			return q_cardCtrl.WeaveService.weave;
//				   		},function(){
//				   			if(q_cardCtrl.WeaveService.checkWeaveReady()) 
//				   				q_cardCtrl.WeaveService.setBase64SessionState(weaveSessionState);
//				   		});
//			   		}
//				else{
//					console.log("Session state was not returned");
//				}
//			});
		};
	}
})();
var aws = {};

/**
 * This function is a wrapper for making a request to a JSON RPC servlet
 * 
 * @param {string} url
 * @param {string} method The method name to be passed to the servlet
 * @param {?Array|Object} params An array of object to be passed as parameters to the method 
 * @param {Function} resultHandler A callback function that handles the servlet result
 * @param {string|number=}queryId
 * @see aws.addBusyListener
 */
aws.queryService = function(url, method, params, resultHandler, queryId)
{
    var request = {
        jsonrpc: "2.0",
        id: queryId || "no_id",
        method: method,
        params: params
    };
    
    $.post(url, JSON.stringify(request), handleResponse, "text");

    function handleResponse(response)
    {
    	// parse result for target window to use correct Array implementation
    	response = targetWindow.JSON.parse(response);
    	
        if (response.error)
        {
        	console.log(JSON.stringify(response, null, 3));
        }
        else if (resultHandler){
            return resultHandler(response.result, queryId);
        }
    }
};

/**
 * Makes a batch request to a JSON RPC 2.0 service. This function requires jQuery for the $.post() functionality.
 * @param {string} url The URL of the service.
 * @param {string} method Name of the method to call on the server for each entry in the queryIdToParams mapping.
 * @param {Array|Object} queryIdToParams A mapping from queryId to RPC parameters.
 * @param {function(Array|Object)} resultsHandler Receives a mapping from queryId to RPC result.
 */
aws.bulkQueryService = function(url, method, queryIdToParams, resultsHandler)
{
	var batch = [];
	for (var queryId in queryIdToParams)
		batch.push({jsonrpc: "2.0", id: queryId, method: method, params: queryIdToParams[queryId]});
	$.post(url, JSON.stringify(batch), handleBatch, "json");
	function handleBatch(batchResponse)
	{
		var results = Array.isArray(queryIdToParams) ? [] : {};
		for (var i in batchResponse)
		{
			var response = batchResponse[i];
			if (response.error)
				console.log(JSON.stringify(response, null, 3));
			else
				results[response.id] = response.result;
		}
		if (resultsHandler)
			resultsHandler(results);
	}
};

var tryParseJSON = function(jsonString){
    try {
        var o = JSON.parse(jsonString);

        // Handle non-exception-throwing cases:
        // Neither JSON.parse(false) or JSON.parse(1234) throw errors, hence the type-checking,
        // but... JSON.parse(null) returns 'null', and typeof null === "object", 
        // so we must check for that, too.
        if (o && typeof o === "object" && o !== null) {
            return o;
        }
    }
    catch (e) { }

    return false;
};

var CSVToArray = function(strData, strDelimiter) {
    // Check to see if the delimiter is defined. If not,
    // then default to comma.
    strDelimiter = (strDelimiter || ",");
    // Create a regular expression to parse the CSV values.
    var objPattern = new RegExp((
    // Delimiters.
    "(\\" + strDelimiter + "|\\r?\\n|\\r|^)" +
    // Quoted fields.
    "(?:\"([^\"]*(?:\"\"[^\"]*)*)\"|" +
    // Standard fields.
    "([^\"\\" + strDelimiter + "\\r\\n]*))"), "gi");
    // Create an array to hold our data. Give the array
    // a default empty first row.
    var arrData = [[]];
    // Create an array to hold our individual pattern
    // matching groups.
    var arrMatches = null;
    // Keep looping over the regular expression matches
    // until we can no longer find a match.
    while (arrMatches = objPattern.exec(strData)) {
        // Get the delimiter that was found.
        var strMatchedDelimiter = arrMatches[1];
        // Check to see if the given delimiter has a length
        // (is not the start of string) and if it matches
        // field delimiter. If id does not, then we know
        // that this delimiter is a row delimiter.
        if (strMatchedDelimiter.length && (strMatchedDelimiter != strDelimiter)) {
            // Since we have reached a new row of data,
            // add an empty row to our data array.
            arrData.push([]);
        }
        // Now that we have our delimiter out of the way,
        // let's check to see which kind of value we
        // captured (quoted or unquoted).
        if (arrMatches[2]) {
            // We found a quoted value. When we capture
            // this value, unescape any double quotes.
            var strMatchedValue = arrMatches[2].replace(
            new RegExp("\"\"", "g"), "\"");
        } else {
            // We found a non-quoted value.
            var strMatchedValue = arrMatches[3];
        }
        // Now that we have our value string, let's add
        // it to the data array.
        arrData[arrData.length - 1].push(strMatchedValue);
    }
    // Return the parsed data.
    return (arrData);
};
angular.module('weaveAnalyst.utils', []);
angular.module('weaveAnalyst.utils').
  directive('myDraggable', function($document) {
    return {
        
    };
  });
angular.module('weaveAnalyst.utils')
.directive(
        'dualListBox',
        function($compile, $timeout) {
            return {
                restrict: "A",
                //templateURL: "tpls/dualList.tpls.html",
                //scope: {options: "="},
                compile: function(telem, attrs) {
                    // telem is the template elememt? if no template then no tElem?
                    // same as "container" below.... 
                    //var container = $compile(telem);
                    return function(scope, elem, attr) {
                        scope.$watch(function() {
                            return scope.options;
                        }, function(newval, oldval) {
                            $timeout(function() {
                                elem.trigger('bootstrapduallistbox.refresh');
                            });
                        });

                        var settings = {
                            bootstrap2compatible: false,
                            preserveselectiononmove: false, // 'all' / 'moved' / false
                            moveonselect: true, // true/false (forced true on androids, see the comment later)
                            initialfilterfrom: '', // string, filter selectables list on init
                            initialfilterto: '', // string, filter selected list on init
                            helperselectnamepostfix: '_helper', // 'string_of_postfix' / false
                            infotext: 'Showing all {0}', // text when all options are visible / false for no info text
                            infotextfiltered: '<span class="label label-warning">Filtered</span> {0} from {1}', // when not all of the options are visible due to the filter
                            infotextempty: 'Empty list', // when there are no options present in the list
                            selectorminimalheight: 100,
                            showfilterinputs: true,
                            filterplaceholder: 'Filter',
                            filtertextclear: 'show all',
                            nonselectedlistlabel: false, // 'string', false
                            selectedlistlabel: false // 'string', false
                        };
                        var container = $('<div class="row bootstrap-duallistbox-container"><div class="col-md-6 box1"><span class="info-container"><span class="info"></span><button type="button" class="btn btn-default btn-xs clear1 pull-right">' + settings.filtertextclear + '</button></span><input placeholder="' + settings.filterplaceholder + '" class="filter" type="text"><div class="btn-group buttons"><button type="button" class="btn btn-default moveall" title="Move all"><i class="glyphicon glyphicon-arrow-right"></i><i class="glyphicon glyphicon-arrow-right"></i></button><button type="button" class="btn btn-default move" title="Move selected"><i class="glyphicon glyphicon-arrow-right"></i></button></div><select multiple="multiple" data-duallistbox_generated="true"></select></div><div class="col-md-6 box2"><span class="info-container"><span class="info"></span><button type="button" class="btn btn-default btn-xs clear2 pull-right">' + settings.filtertextclear + '</button></span><input placeholder="' + settings.filterplaceholder + '" class="filter" type="text"><div class="btn-group buttons"><button type="button" class="btn btn-default remove" title="Remove selected"><i class="glyphicon glyphicon-arrow-left"></i></button><button type="button" class="btn btn-default removeall" title="Remove all"><i class="glyphicon glyphicon-arrow-left"></i><i class="glyphicon glyphicon-arrow-left"></i></button></div><select multiple="multiple" data-duallistbox_generated="true"></select></div></div>');
                        var elements = {
                            originalselect: elem, //$this,
                            box1: $('.box1', container),
                            box2: $('.box2', container),
                            //filterinput1: $('.box1 .filter', container),
                            //filterinput2: $('.box2 .filter', container),
                            //filter1clear: $('.box1 .clear1', container),
                            //filter2clear: $('.box2 .clear2', container),
                            info1: $('.box1 .info', container),
                            info2: $('.box2 .info', container),
                            select1: $('.box1 select', container),
                            select2: $('.box2 select', container),
                            movebutton: $('.box1 .move', container),
                            removebutton: $('.box2 .remove', container),
                            moveallbutton: $('.box1 .moveall', container),
                            removeallbutton: $('.box2 .removeall', container),
                            form: $($('.box1 .filter', container)[0].form)
                        };
                        var i = 0;
                        var selectedelements = 0;
                        var originalselectname = attr.name || "";
                        var c = attr.class;
                        var height;

                        function init() {
                            container.addClass('moveonselect');
                            if (typeof c !== 'undefined' && c) {
                                c = c.match(/\bspan[1-9][0-2]?/);
                                if (!c) {
                                    c = attr.class;
                                    c = c.match(/\bcol-md-[1-9][0-2]?/);
                                }
                            }
                            if ( !! c) {
                                container.addClass(c.toString());
                            }
                            if (elements.originalselect.height() < settings.selectorminimalheight) {
                                height = settings.selectorminimalheight
                            } else {
                                height = elements.originalselect.height();
                            }
                            elements.select1.height(height);
                            elements.select2.height(height);
                            elem.addClass('hide');
                            //update selection states();
                            //elements.filterinput1.hide();
                            //elements.filterinput2.hide();
                            var box = $(container.insertBefore(elem));
                            bindevents();
                            refreshselects();
                            updatesselectionstates();
                            //elem.html(box);
                            $compile(box)(scope);
                            //$compile(elem.contents())(scope);
                            //console.log(elem);

                        }
                        init();

                        function updatesselectionstates() {
                            $(elem).find('option').each(function(index, item) {
                                var $item = $(item);
                                if (typeof($item.data('original-index')) === 'undefined') {
                                    $item.data('original-index', i++);
                                }
                                if (typeof($item.data('_selected')) === 'undefined') {
                                    $item.data('_selected', false);
                                }
                            });
                        }
                        scope.updateselections = refreshselects;

                        function refreshselects() {
                            selectedelements = 0;
                            elements.select2.empty();
                            elements.select1.empty();
                            $(elem).find('option').each(function(index, item) {
                                var $item = $(item);
                                if ($item.prop('selected')) {
                                    selectedelements++;
                                    elements.select2.append($item.clone(true).prop('selected',
                                        $item.data('_selected')));
                                } else {
                                    elements.select1.append($item.clone(true).prop('selected',
                                        $item.data('_selected')));
                                }
                            });
                            // ommited filters here
                        }
                        // functions formatstring(s, args) and refreshinfo()... don't need?'

                        function bindevents() {
                            elements.form.submit(function(e) {
                                if (elements.filterinput1.is(":focus")) {
                                    e.preventDefault();
                                    elements.filterinput1.focusout();
                                } else if (elements.filterinput2.is(":focus")) {
                                    e.preventDefault();
                                    elements.filterinput2.focusout();
                                }
                            }); // probably  not needed

                            elements.originalselect.on('bootstrapduallistbox.refresh', function(e, clearselections) {
                                updatesselectionstates();

                                if (!clearselections) {
                                    saveselections1();
                                    saveselections2();
                                } else {
                                    clearselections12();
                                }

                                refreshselects();
                            });

                            //                        elements.filter1clear.on('click', function() {
                            //                            elements.filterinput1.val('');
                            //                            refreshselects();
                            //                        });
                            //
                            //                        elements.filter2clear.on('click', function() {
                            //                            elements.filterinput2.val('');
                            //                            refreshselects();
                            //                        });

                            elements.movebutton.on('click', function() {
                                move();
                            });

                            elements.moveallbutton.on('click', function() {
                                moveall();
                            });

                            elements.removebutton.on('click', function() {
                                remove();
                            });

                            elements.removeallbutton.on('click', function() {
                                removeall();
                            });

                            //                        elements.filterinput1.on('change keyup', function() {
                            //                            filter1();
                            //                        });
                            //
                            //                        elements.filterinput2.on('change keyup', function() {
                            //                            filter2();
                            //                        });

                            settings.preserveselectiononmove = false;

                            elements.select1.on('change', function() {
                                move();
                            });
                            elements.select2.on('change', function() {
                                remove();
                            });

                        }

                        function saveselections1() {
                            elements.select1.find('option').each(function(index, item) {
                                var $item = $(item);

                                elements.originalselect.find('option').eq($item.data('original-index'))
                                    .data('_selected', $item.prop('selected'));
                            });
                        }

                        function saveselections2() {
                            elements.select2.find('option').each(function(index, item) {
                                var $item = $(item);

                                elements.originalselect.find('option').eq($item.data('original-index'))
                                    .data('_selected', $item.prop('selected'));
                            });
                        }

                        function clearselections12() {
                            elements.select1.find('option').each(function() {
                                elements.originalselect.find('option').data('_selected', false);
                            });
                        }

                        function sortoptions(select) {
                            select.find('option').sort(function(a, b) {
                                return ($(a).data('original-index') > $(b).data('original-index')) ? 1 : -1;
                            }).appendTo(select);
                        }

                        function changeselectionstate(original_index, selected) {
                            elements.originalselect.find('option').each(function(index, item) {
                                var $item = $(item);

                                if ($item.data('original-index') === original_index) {
                                    $item.prop('selected', selected);
                                }
                            });
                        }

                        function move() {
                            if (settings.preserveselectiononmove === 'all') {
                                saveselections1();
                                saveselections2();
                            } else if (settings.preserveselectiononmove === 'moved') {
                                saveselections1();
                            }


                            elements.select1.find('option:selected').each(function(index, item) {
                                var $item = $(item);

                                if (!$item.data('filtered1')) {
                                    changeselectionstate($item.data('original-index'), true);
                                }
                            });

                            refreshselects();
                            triggerchangeevent();

                            sortoptions(elements.select2);
                        }

                        function remove() {
                            if (settings.preserveselectiononmove === 'all') {
                                saveselections1();
                                saveselections2();
                            } else if (settings.preserveselectiononmove === 'moved') {
                                saveselections2();
                            }

                            elements.select2.find('option:selected').each(function(index, item) {
                                var $item = $(item);

                                if (!$item.data('filtered2')) {
                                    changeselectionstate($item.data('original-index'), false);
                                }
                            });

                            refreshselects();
                            triggerchangeevent();

                            sortoptions(elements.select1);
                        }

                        function moveall() {
                            if (settings.preserveselectiononmove === 'all') {
                                saveselections1();
                                saveselections2();
                            } else if (settings.preserveselectiononmove === 'moved') {
                                saveselections1();
                            }

                            elements.originalselect.find('option').each(function(index, item) {
                                var $item = $(item);

                                if (!$item.data('filtered1')) {
                                    $item.prop('selected', true);
                                }
                            });

                            refreshselects();
                            triggerchangeevent();
                        }

                        function removeall() {
                            if (settings.preserveselectiononmove === 'all') {
                                saveselections1();
                                saveselections2();
                            } else if (settings.preserveselectiononmove === 'moved') {
                                saveselections2();
                            }

                            elements.originalselect.find('option').each(function(index, item) {
                                var $item = $(item);

                                if (!$item.data('filtered2')) {
                                    $item.prop('selected', false);
                                }
                            });

                            refreshselects();
                            triggerchangeevent();
                        }

                        function triggerchangeevent() {
                            elements.originalselect.trigger('change');
                        }
                    }
                }

            }
        });
angular.module('weaveAnalyst.utils')
        .directive('fileUpload', function($q) {
          return {
            restrict: 'E',
            template: "<label class='file-nput-btn'>{{label}}<input class='file-upload' type='file'/></label>",
            replace: true,
            link: function($scope, elem, attrs) {
              var deferred;
              $scope.label = attrs.label;
              $(elem).fileReader({
                "debugMode": true,
                "filereader": "lib/file-reader/filereader.swf"
              });
              $(elem).on('click', function(args) {
                deferred = $q.defer();
                $scope.fileUpload = deferred.promise;
              });
              $(elem).find('input').on("change", function(evt) {
                var file = evt.target.files[0];
                if (file.name == undefined || file.name == "") {
                  return;
                }
                var reader = new FileReader();
                reader.onload = function(e) {
                  var contents = {filename: file.name,
                    content: e.target.result};
                  scriptUploaded = contents;
                  $scope.$safeApply(function() { deferred.resolve(contents); });
                };
                reader.readAsText(file);
              });
            }
          };
        })
        .directive("fileread", [function () {
    return {
        scope: {
            fileread: "="
        },
        link: function (scope, element, attributes) {
            element.bind("change", function (changeEvent) {
                var reader = new FileReader();
                reader.onload = function (loadEvent) {
                    scope.$apply(function () {
                        scope.fileread = {
                        		content : loadEvent.target.result,
                        		filename : changeEvent.target.files[0].name
                        };
                    });
                };
                reader.readAsText(changeEvent.target.files[0]);
            });
        }
    };
}]).directive('ngEnter', function () {
    return function (scope, element, attrs) {
        element.bind("keydown keypress", function (event) {
            if(event.which === 13) {
                scope.$apply(function (){
                    scope.$eval(attrs.ngEnter);
                });

                event.preventDefault();
            }
        });
    };
});;;
        

/**
 * this card appears on the index page and gives an idea of functionality of the tabs. 
 * @shwetapurushe
 */

(function(){
	angular.module('weaveAnalyst.utils').directive('introCard', introCardComponent);
	
	function introCardComponent(){
		return {
			restrict: 'E', 
			template:'<div class = "intro_card"><div class="header panel-heading"><h2>{{ic_Ctrl.title}}</h2></div>' +
				'<div><div>{{ic_Ctrl.description}}</div><div></div>',
			scope:{
				title : '@',
				description : '@',
				tab: '@'
				
			},
			controller : introCardController,
			controllerAs : 'ic_Ctrl',
			bindToController : true,
			link : function(){
				
			}
		};//end of directive def
	};
	
	function introCardController (){
		var ic_Ctrl = this;
	};
})();
angular.module('weaveAnalyst.utils').directive('popoverWithTpl', function($compile, $templateCache, $q, $http) {

  var getTemplate = function(templateUrl) {
    var def = $q.defer();

    var template = '';
    
    template = $templateCache.get(templateUrl);
    console.log(template);
    if (typeof template === "undefined") {
      $http.get(templateUrl)
        .success(function(data) {
          $templateCache.put(templateUrl, data);
          def.resolve(data);
        });
    }else {
    	 def.resolve(template);
    }

    return def.promise;
  };
  
  return {
    restrict: "A",
    link: function(scope, element, attrs) {
    	console.log(attrs.templateUrl);
      getTemplate(attrs.templateUrl).then(function(popOverContent) {
        var options = {
          content: popOverContent,
          placement: attrs.popoverPlacement,
          html: true,
          date: scope.date
        };
        $(element).popover(options);
      });
    }
  };
});
/**
 *this file contains utlity functions for making the weave analyst support features present in the R GUI
 * @shweta purushe 
 */

(function(){
	angular.module('weaveAnalyst.utils').service('rUtils', rUtils);
	
	rUtils.$inject = ['$q', 'runQueryService', 'computationServiceURL'];
	function rUtils($q, runQueryService, computationServiceURL){
		var that = this; 
		that.rPath; //stores the path of the user's R installation 
		that.rInstalled_pkgs = [];
		that.repo_pkgs = [];//list of packages present at a particular repo
		that.cran_mirrors = [];
		that.pkg_objects = {funcs : [], constants : []};//list of functions in a given package
		
		//gets the list of CRAN mirrors
		that.getRMirrors = function(){
			if(that.cran_mirrors.length > 1)
				return that.cran_mirrors;
			else{
				console.log("retrieving CRAN mirrors");
				var deferred = $q.defer();
				
				runQueryService.queryRequest(computationServiceURL, 'runBuiltScripts',["getMirrors.R", null], function(result){
					var mirror_names = result.resultData[0];
					var mirror_urls = result.resultData[3];
					for(var i =0; i< mirror_names.length; i++){
						var mObj = {};
						mObj.name = mirror_names[i];
						mObj.url = mirror_urls[i];
						
						that.cran_mirrors.push(mObj);
					}
					console.log("result", that.cran_mirrors);
					deferred.resolve(that.cran_mirrors);
				},
				function(error){
					deferred.reject(error);
				});
				
				return deferred.promise;
			}
		};
		
		//gets a list from the library folder of the installed R version
		that.getInstalled_R_Packages = function(){
			console.log("retreiving installed R packages");
			that.rInstalled_pkgs = [];
			
			var deferred = $q.defer();
			var rpath = "C:\\Program Files\\R\\R-3.1.2\\library";//hard coded for now

			runQueryService.queryRequest(computationServiceURL, 'runBuiltScripts', ["getPackages.R", {path: rpath}],function (result){ 
				var data = result.resultData;
				for(var i = 0; i < data[0].length; i++){//figure way around hard coding
					var obj = {};
					obj.Package = data[0][i];
					obj.Version = data[1][i];
					that.rInstalled_pkgs.push(obj);
				}
				
				deferred.resolve(that.rInstalled_pkgs);
			}, 
			function (error){ deferred.reject(error);}
			);
			
			return deferred.promise;
		};
		
		that.get_packages_at_repo = function(repository){
			
			var deferred = $q.defer();
			runQueryService.queryRequest(computationServiceURL, 'runBuiltScripts', ["getRepoPackages.R", {repo : repository}], function(result){
				that.repo_pkgs = result;
				console.log("repo_pkgs", result);
				deferred.resolve(that.repo_pkgs);
			}, function(error){
				deferred.reject(error);
			});
			
			return deferred.promise;
		};
		
		//gets the objects in a particular package
		that.get_Pkg_Objects = function(package_name){
			if(!package_name)
				return;
			
			var deferred = $q.defer();
			runQueryService.queryRequest(computationServiceURL, 'runBuiltScripts', ["getPackageObjects.R", {packageName : package_name}], function(result){
				console.log("pkg_objects", result);
				
				that.pkg_objects.funcs = result.resultData[0];
				that.pkg_objects.constants = result.resultData[1];
				
				deferred.resolve(that.pkg_objects);
			}, function(error){
				deferred.reject(error);
			});
			
			return deferred.promise;
		};
		
		//verifies the path entered by user or else uses default
		that.verify_Path = function(){
			
		};
	}
})();
/**
 *this object represents the over arching global object for the Weave Analyst
 *@author shweta purushe 
 */
if(!this.wa)
	this.wa = {};


(function(){
	
	Object.defineProperty(ScriptInputs, 'NS', {
        value: 'wa'
    });

	Object.defineProperty(ScriptInputs, 'CLASS_NAME', {
        value: 'ScriptInputs'
	});
	
	function ScriptInputs (){
		
		 Object.defineProperty(this, 'sessionable', {
	           value: true
	       });
		 
		 Object.defineProperty(this, 'columns', {
			 value : WeaveAPI.SessionManager.registerLinkableChild(this, new weavecore.LinkableVariable([]))
		 });
		 
	}
	
	window.wa.ScriptInputs = ScriptInputs;
})();



(function(){
	
	 Object.defineProperty(QueryObject, 'NS', {
	        value: 'wa'
	    });

	 Object.defineProperty(QueryObject, 'CLASS_NAME', {
	        value: 'QueryObject'
   	});
	    
	    
	function QueryObject (){
		
	 Object.defineProperty(this, 'sessionable', {
           value: true
       });
		
	 Object.defineProperty(this, 'author', {
		 value : WeaveAPI.SessionManager.registerLinkableChild(this, new weavecore.LinkableString(""))
	 });
	 
	 Object.defineProperty(this, 'date', {
		 value : new Date()
	 });
	 
	 Object.defineProperty(this, 'ComputationEngine', {
           value: WeaveAPI.SessionManager.registerLinkableChild(this, new weavecore.LinkableString(""))
       });
	 
	 Object.defineProperty(this, 'scriptSelected', {
		 value : WeaveAPI.SessionManager.registerLinkableChild(this, new weavecore.LinkableString(""))
	 });
		
	 Object.defineProperty(this, 'title', {
		 value : WeaveAPI.SessionManager.registerLinkableChild(this, new weavecore.LinkableString(""))
	 });
	 
	 Object.defineProperty(this, 'scriptOptions', {
		 value : WeaveAPI.SessionManager.registerLinkableChild(this, new wa.ScriptInputs())
	 });
	 
		
	}
	
	window.wa.QueryObject = QueryObject;
	
})();


/**
 * This Service is designed to receive a query object, pre-process an analysis query and processes its results.
 * @author spurushe
 * @author fkamayou
 * 
 **/
(function(){
	angular.module('weaveAnalyst.run', []);

	angular.module('weaveAnalyst.run').service('QueryHandlerService', QueryHandlerService);
	
	function QueryHandlerService (){
		var that = this;
		var nestedFilterRequest = {and : []};
		
		//this function pre-processes filters applied on the input data before being sent to the server
		that.handle_Filters = function(){
			
		};
		
		//this function pre-processes the inputs of a particular computation by wrapping it into a bean
		that.handle_ScriptInput_Options = function(scriptOptions){

	    	var typedInputObjects= [];
	    
	    	for(var key in scriptOptions) {
				var input = scriptOptions[key];
				
				// handle multiColumns. Note that we do this first because type of arrayVariabel == 'object' returns true.
				if(Array.isArray(input)) {
					typedInputObjects.push({
						name : key,
						type : 'dataColumnMatrix',
						value : {
							
							columnIds : $.map(input, function(column) {
								return column.id;
							}), 
							filters : nestedFilterRequest.and.length ? nestedFilterRequest : null,
							namesToAssign : $.map(input, function(column) {
								return column.title;
							})
						}
					});
				} 
				
				// handle single column
				else if((typeof input) == 'object') {
		    		rowsObject.value.columnIds.push(input.id);
	    			rowsObject.value.namesToAssign.push(key);
		    		if($.inArray(rowsObject,typedInputObjects) == -1)//if not present in array before
		    			typedInputObjects.push(rowsObject);
		    	}

				else if ((typeof input) == 'string'){
					typedInputObjects.push({
						name : key, 
						type : 'string',
						value : input
					});
		    	}
		    	else if ((typeof input) == 'number'){// regular number
		    		typedInputObjects.push({
						name : key, 
						type : 'number',
						value : input
					});
		    	} 
		    	else if ((typeof input) == 'boolean'){ // boolean 
		    		typedInputObjects.push({
						name : key, 
						type : 'boolean',
						value : input
					});
		    	}
		    	else{
					console.log("unknown script input type ", input);
				}
	    	}
	    	
	    	return typedInputObjects;
		};
		
		//this function temporarily remaps original data values to new ones without altering the original data 
		that.handle_ColumnRemapping = function(){
			
		};
		
		//runs a pre-processed query (analysis) on the server (in R/STATA etc)
		that.run_query = function(){
			
		};
	};
})();
angular.module('weaveAnalyst.AnalysisModule').controller('CrossTabCtrl', function() {

});
angular.module('weaveAnalyst.AnalysisModule').controller('byVariableCtrl', function(){

}); 
angular.module('weaveAnalyst.AnalysisModule').controller('dataFilterCtrl', function($scope){
	$scope.isCollapsed = false;
});
angular.module('weaveAnalyst.AnalysisModule').directive('filter', function() {
	
	function link($scope, element, attrs, ngModelCtrl) {
//		element.draggable({ containment: "parent" }).resizable({
//			 //maxHeight: 150,
//		     maxWidth: 250,
//		     minHeight: 100,
//		     minWidth: 180
//		});
		element.addClass('databox');
		element.width(180);
	}

	return {

		restrict : 'E',
		transclude : true,
		templateUrl : 'src/analysis/data_filters/generic_filter.html',
		link : link,
		require : 'ngModel',
		scope : {
			columns : '=',
			ngModel : '='
		},
		controller : function($scope, $filter) {
			
			$scope.ngModel = $scope.$parent.filtersModel[$scope.$parent.$index] || {
					comboboxModel : [],
					multiselectModel : [],
					sliderModel : [],
					nestedFilter : {}
			};
			$scope.filterType = "";
			$scope.filterOptions = [];
			
			$scope.$watch('ngModel.column',  function(newVal, oldVal) {
				if($scope.ngModel.column && $scope.ngModel.column.hasOwnProperty("id")) {
//					queryService.getEntitiesById([$scope.ngModel.column.id], true).then(function(entity) {
//						entity = entity[0];
//						if(entity && entity.publicMetadata.hasOwnProperty("aws_metadata")) {
//							var metadata = angular.fromJson(entity.publicMetadata.aws_metadata);
//							if(metadata.hasOwnProperty("varType")) {
//								if(metadata.varType == "continuous") {
//									$scope.filterType = "slider";
//									var min = angular.fromJson(metadata.varRange)[0];
//									var max = angular.fromJson(metadata.varRange)[1];
//									$scope.sliderOptions = { range:true, min:min, max:max }; // todo. put the slider values on top of the slider
//									$scope.ngModel.sliderModel = [Math.floor((max - min) / 3), Math.floor(2*(max - min) / 3)];
//								} else if(metadata.varType == "categorical") {
//									if(metadata.varValues) {
//										queryService.getDataMapping(metadata.varValues).then(function(varValues) {
//											$scope.filterOptions = varValues;
//											if($scope.filterOptions.length < 10) {
//												$scope.filterType = "combobox";
//											} else {
//												$scope.filterType = "multiselect";
//											}
//										});
//									}
//								}
//							} else {
//								$scope.filterType = "";
//							}
//						}
//					});
				}
			}, true);
			
			$scope.$watch('ngModel.column', function(newVal, oldVal) {
				if(!$scope.ngModel.column || !$scope.ngModel.column.hasOwnProperty("id")) {
					$scope.filterType = "";
				}
			}, true);
			
			$scope.$watchCollection('ngModel.multiselectModel', function(newVal, oldVal) {
				var ngModel = $scope.ngModel.multiselectModel;
				
				$scope.ngModel.comboboxModel = [];
				$scope.ngModel.sliderModel = [];

				if(!ngModel || !ngModel.length)
					return;
				
				$scope.ngModel.nestedFilter = 
					{
						cond : {
							f : $scope.ngModel.column.id,
							v : ngModel
						}
					};
			});
			
			/* combo box controls    */
			$scope.$watchCollection('ngModel.comboboxModel', function(newVal, oldVal) {
				
				var ngModel = $scope.ngModel.comboboxModel;
				
				$scope.ngModel.multiselectModel = [];
				$scope.ngModel.sliderModel = [];
				
				if(!ngModel.length)
					return;
				
				var result = [];
				for(var i in ngModel)
				{
					if(ngModel[i] && $scope.filterOptions[i])
						result.push($scope.filterOptions[i].value);
				}
				$scope.ngModel.nestedFilter = 
					{
						cond : {
							f : $scope.ngModel.column.id,
							v : result
						}
					};
			});
			
			/* combo box controls    */
			$scope.$watchCollection('ngModel.sliderModel', function(newVal, oldVal) {

				var ngModel = $scope.ngModel.sliderModel;

				$scope.ngModel.multiselectModel = [];
				$scope.ngModel.comboboxModel = [];

				if(!ngModel.length)
					return;
				
				$scope.ngModel.nestedFilter = 
					{
						cond : {
							f : $scope.ngModel.column.id,
							r : [ngModel]
						}
					};
			});
		}
	};
});
/**
 * directive for creating a geo filter
 */

angular.module('weaveAnalyst.AnalysisModule').directive('geoFilter', [function factory(){
	
	var directiveDefnObject = {
			restrict : 'E',
			require : 'ngModel',
			templateUrl : 'src/analysis/data_filters/geographyFilter.tpl.html',
			controller : function(){
				
				
				
			},
			link : function(scope, elem, attrs){
			
			}
			
	};
	
	return directiveDefnObject;
}]);

angular.module('weaveAnalyst.AnalysisModule').service('geoService', [function(){
	

}]);
angular.module('weaveAnalyst.AnalysisModule').controller('GeographyCtrl', function(){
	
	
});
angular.module('weaveAnalyst.AnalysisModule').directive('treeFilter', function() {
	
	function link($scope, element, attrs, ngModel, ngModelCtrl) {

		
	}

	return {
		restrict : 'E',
		transclude : true,
		templateUrl : 'src/analysis/data_filters/tree_filter.tpl.html',
		link : link,
		require : 'ngModel',
		scope : {
			columns : '=',
			ngModel : '='
		},
		controller : function($scope, $element, $rootScope, $filter) {
		
		}
	};
});
angular.module('weaveAnalyst.AnalysisModule').directive('tree', function(queryService) {
	
	
	
});

var treeUtils = {};

treeUtils.toggleSelect = function(treeId){
	$(treeId).dynatree("getRoot").visit(function(node){
		node.toggleSelect();
	});
};
		
treeUtils.deSelectAll = function(treeId){
	$(treeId).dynatree("getRoot").visit(function(node){
		node.select(false);
	});
};
		
treeUtils.selectAll = function(treeId){
	$(treeId).dynatree("getRoot").visit(function(node){
		node.select(true);
	});
};
				
var cmp = function(a, b) {
		return a > b ? 1 : a < b ? -1 : 0;
};

var cmpByKey = function(node1, node2) {
	return cmp(node1.data.key, node2.data.key);
};

var cmpByTitle = function(node1, node2) {
	return cmp(node1.data.title, node2.data.title);
};

treeUtils.getSelectedNodes = function(treeId) {
	var treeSelection = {};
	
	var root = $(treeId).dynatree("getRoot");
	
	for (var i = 0; i < root.childList.length; i++) {
		var level1 = root.childList[i];
		for(var j = 0; j < level1.childList.length; j++) {
			var level2 = level1.childList[j];
			if(level1.childList[j].bSelected) {
				if(!treeSelection[level1.data.key]) {
					var level2Key = level2.data.key;
					treeSelection[level1.data.key] = {};
					treeSelection[level1.data.key].label = level1.data.title;
					var level2Obj = {};
					level2Obj[level2Key] = level2.data.title;
					treeSelection[level1.data.key].level2s = [level2Obj];
				} else {
					var level2Key = level2.data.key;
					var level2Obj = {};
					level2Obj[level2Key] = level2.data.title;
					treeSelection[level1.data.key].level2s.push( { level2Key : level2.data.title } );
				}
			}
		}
	}
	
	return selectedNodes;
};

/**
 * this service deals with login credentials
 */
(function (){
	angular.module('weaveAnalyst.configure.auth', []);
	
	//experimenting with another kind of angular provider factory vs service (works!!)
	angular.module('weaveAnalyst.configure.auth').factory('authenticationService', authenticationService);

	authenticationService.$inject = ['$rootScope', 'runQueryService', 'adminServiceURL'];

	function authenticationService (rootScope, runQueryService, adminServiceURL){
		var authenticationService = {};
		authenticationService.user;
		authenticationService.password;
		authenticationService.authenticated = false;
		
		//make call to server to authenticate
		 authenticationService.authenticate = function(user, password){

			 runQueryService.queryRequest(adminServiceURL, 'authenticate', [user, password], function(result){
	    		authenticationService.authenticated = result;
	          //if accepted
	            if(authenticationService.authenticated){
	            	
	            	authenticationService.user = user;
	            	authenticationService.password = password;
	            }
	            rootScope.$apply();
	        }.bind(authenticationService));
	   };
	   
	    authenticationService.logout = function(){
	    	console.log("loggin out");
	    	//resetting variables
	    	authenticationService.authenticated = false;
	    	authenticationService.user = "";
	    	authenticationService.password = "";
	    };
	   
	   
	   return authenticationService;
	};
})();//end of IIFE

(function(){
	angular.module('weaveAnalyst.configure.metadata', []);
	
	
	// SOURCE: from stack overflow : http://stackoverflow.com/questions/25531961/angularjs-bootstrap-progressbar-max-changing
	//adding a decorator that encapsulates the progressbar and bar directives provided by ui-bootstrap
	angular.module('weaveAnalyst.configure.metadata').config(function($provide){
		var progressDecorator = function($delegate){//$delegate is the original service instance which is decorated
			var directive = $delegate[0];
			var compile = directive.compile;
			var link = directive.link;
			
			directive.compile = function(){
				compile.apply(this,arguments);
				
				return function(scope, elem, attr, ctrl){
					link.apply(this,arguments);
					
					if(angular.isDefined(attr.dynamicMax)){
						attr.$observe('dynamicMax', function(max) {
				              scope.max = max;
			              scope.percent = +(100 * scope.value / max).toFixed(2);
				        }); 
				}
				};
			};//end of compile function
			
			return $delegate;
		};//end of progressIndicator;
		
		//the decorator function decorates the given service while instantiating it and returns the decorated service instance
		$provide.decorator('progressbarDirective', progressDecorator);
	    $provide.decorator('barDirective', progressDecorator);
		
	});
	

	angular.module('weaveAnalyst.configure.metadata').controller("MetadataManagerController", MetadataManagerController );	
	MetadataManagerController.$inject = ['$scope','$rootScope', 'dataServiceURL','queryService', 'authenticationService', 'runQueryService','errorLogService', 'metadataService'];
	
	function MetadataManagerController ($scope,$rootScope, dataServiceURL,queryService, authenticationService, runQueryService,errorLogService, metadataService){
		
		var mDataCtrl = this;
		
		mDataCtrl.queryService = queryService;
		mDataCtrl.authenticationService = authenticationService;
		mDataCtrl.metadataService = metadataService;
		mDataCtrl.selectedDataTableId;//datatable selected by the user
		
		mDataCtrl.addNewRow = addNewRow;
		mDataCtrl.removeRow = removeRow;
		mDataCtrl.refresh = refresh;
		
		$scope.selectedItems = [];
		var treeData = [];

		//TODO try moving this to the directive controller or to the service

		//generated when the dynatree directive loads
		$scope.generateTree = function(element) {

				queryService.getDataTableList(true).then(function(dataTableList) {
					for (var i = 0; i < dataTableList.length; i++) {
							dataTable = dataTableList[i];
							treeNode = { title: dataTable.title, key : dataTable.id,
							children : [], isFolder : true, isLazy : true
					};
					treeData.push(treeNode);
					if( treeData.length == dataTableList.length) {
						$(element).dynatree({
							minExpandLevel: 1,
							children :treeData,
						keyBoard : true,
						onPostInit: function(isReloading, isError) {
									this.reactivate();
									},
						onActivate: function(node) {
							//handling nodes when tables TODO check if handling is done correctly
							if(!node.data.metadata)
							{
						
								mDataCtrl.selectedDataTableId = parseInt(node.data.key);
								//clears the grid when nodes are selected
								mDataCtrl.metadataService.setGridData([]);
							}
					
							//handle when node is a column
							if(node.data.metadata){
								mDataCtrl.selectedDataTableId = node.data.id;
								mDataCtrl.metadataService.getColumnMetadata(node.data);
							}
						},
						//******************************************lazy loading*****************************************************
						onLazyRead : function(node){
							var request = {
							jsonrpc: "2.0",
							id: "no_id",
							method : "getEntityChildIds",
							params : [node.data.key]
							};
					
							node.appendAjax({
								url : dataServiceURL,
								data : JSON.stringify(request),
								type: "POST",
								dataType : "json",
								error : function(node, XMLHttpRequest, textStatus, errorThrown)//refer to dynatree documentation
								{
									errorLogService.openErrorLog(errorThrown);
								},
								success : function(node, status, jqxhr)//this success function is different from the regular ajax success (modified by dynatree)
								{
									if(status.error)
										errorLogService.openErrorLog(status.error.message);
										
									if(status.result)
										{
											node.removeChildren();
											var list = status.result;// the actual result from ajax
											
											var columnChildren= [];
											//as soon as ids are returned retrieve their metadata
											runQueryService.queryRequest(dataServiceURL, 'getEntitiesById', [list], function(columnsWithMetadata){
												for(var i=0, l=columnsWithMetadata.length; i<l; i++){
													var singleColumn = columnsWithMetadata[i];
								                    columnChildren.push({title: singleColumn.publicMetadata.title,
								                        	id: singleColumn.id,
								                        	metadata: singleColumn.publicMetadata,
								                        	addClass : "custom1",// for a particular kind of document representation
								                        	focus: true});
								                }
								                node.setLazyNodeStatus(DTNodeStatus_Ok);//look at dynatree documentation
								                node.addChild(columnChildren);
											});
										}
									
								}
							});
						},
						debugLevel: 0
						});
					}
					}
				});
		};//controller;
		

		//$scope.gridOptions = { 
		//data: 'myData',
		//enableRowSelection: true,
		//enableCellEdit: true,
		//columnDefs: [{field: 'property', displayName: 'Property', enableCellEdit: true}, 
		//{field:'value', displayName:'Value', enableCellEdit: true}],
		//multiSelect : false,
		//selectedItems : $scope.selectedItems
		//
		//};

		$scope.$on('ngGridEventEndCellEdit', function(){
		this.metadataService.updateMetadata(this.metadataService.gridData);
		});


		/**
		* Editing
		* function calls for editing a column metadata property
		*/
		//adding
		function addNewRow () {
			mDataCtrl.metadataService.gridData.push({property: 'Property Name', value: 'Value'});
			mDataCtrl.metadataService.updateMetadata(mDataCtrl.metadataService.gridData);
		};

		//deleting
		function removeRow () {
			var index = mDataCtrl.metadataService.gridData.indexOf($scope.gridOptions.selectedItems[0]);
			mDataCtrl.metadataService.gridData.splice(index, 1);
			mDataCtrl.metadataService.updateMetadata(mDataCtrl.metadataService.gridData);
		};


		//refreshing the hierarchy
		function refresh () {
			$("#tree").dynatree("getTree").reload();
			var node = $("#tree").dynatree("getRoot");
			node.sortChildren(this.metadataService.cmp, true);
		};

	};//end of MetadataManagerController
	
	
	
	/*
	 *applies metadata standards defined by user in a csv to the selected datatable 
	 *updates the aws-metadata property of columns in a datatable 
	 */
	angular.module('weaveAnalyst.configure.metadata').controller("MetadataFileController",MetadataFileController );	
	MetadataFileController.$inject = ['$scope', 'queryService', 'authenticationService', 'errorLogService'];
	
	function MetadataFileController ($scope, queryService, authenticationService, errorLogService){
		var mFCtrl = this;
		
		mFCtrl.maxTasks= 0;
		mFCtrl.progressValue = 0;
		
		//object representation of the metadata csv uploaded 
		mFCtrl.metadataUploaded = {
				file : {
					filename : "",
					content :""
				}
		};
		
		$scope.$watch(function(){
			return mFCtrl.metadataUploaded.file;
			}, function(n, o) {
			if(mFCtrl.metadataUploaded.file.content){
				
				/****///this is how you access parent controller instance properties
				mFCtrl.selectedDataTableId = $scope.mDataCtrl.selectedDataTableId;
				
		        	  //metadata file(.csv) uploaded by the user is converted to update the columns
		           var metadataArray = queryService.CSVToArray(mFCtrl.metadataUploaded.file.content);
		            
		    	  if(mFCtrl.selectedDataTableId) {//works only if a selection is made
		    		  queryService.getDataColumnsEntitiesFromId(mFCtrl.selectedDataTableId, true).then(function(columns) {
		    			 // console.log("columns", columns);
		    			  if(columns.length) {//works only if a datatable that contains column children is selected, will not work if a column is selected
			    				  var end = columns.length;
			    				  mFCtrl.maxTasks = end;
			    				  
		        				  for (var i = 1; i < metadataArray.length; i++) {//starting the loop from index 1 to avoid headers
		        						var title = metadataArray[i][0];//gets the title of a single column
		        						
		        						var metadata = metadataArray[i][1];//gets the metadata to be updated per column
		        						
		        						var id;
		        						for(var j = 0; j < columns.length; j++) {
		        							if(columns[j].title == title) {
		        								id = columns[j].id;
		        								break; // we assume there is only one match
		        							}
		        						}
			        					if(id) {
			        								//TODO handle columns with missing metadata
			        								if(!(angular.isUndefined(metadata)))//if a particular column does not have metadata
			        									metadata = metadata;
			        								
			        								
			        								//updating the column metadata(adding the aws_metadata property to the public metadata) on the server 
			        								queryService.updateEntity(authenticationService.user, authenticationService.password, id, {publicMetadata :{ 
			        																												aws_metadata : metadata
			        																											 }
			        																							}
				        							 ).then(function() {
				        								 mFCtrl.progressValue++;
				        							 });								
			        							}
									 }
		        			  } else {
		        				  //if a column is selected
		        				  errorLogService.openErrorLog("Selected entity is not a table or table does not contain any columns.");
		        				  console.log("selected entity is not a table or table does not contain any columns.");
		        			  }
					  });
		    	  } else {
		    		  		errorLogService.openErrorLog("no selected tables");
							console.log("no selected tables");
		    	  		};
	        }

	      }, true);
		
		//watch expression to reset the progress bar after the task has been completed
		 $scope.$watch(function(){
			return mFCtrl.progressValue;
		 }, function(){
			 //console.log("progress", $scope.progressValue);
			if(mFCtrl.progressValue == mFCtrl.maxTasks) {
				//console.log("equal");
				setTimeout(function() {
					//resetting variables
					mFCtrl.inProgress = false;
					mFCtrl.progressValue = 0;
					mFCtrl.maxTasks = 0;
					//resetting the uploaded file (because if we repeated upload same file)
					mFCtrl.metadataUploaded.file.filename = "";
					mFCtrl.metadataUploaded.file.content = "";
					
					$scope.$apply();
				}, 5000);
			} else {
				//console.log("not equal");
				mFCtrl.inProgress = true;
			}
		 });
	};//end of MetadataFileController

		
})();//end of IIFE


//TODO include diretives in IIFE
angular.module('weaveAnalyst.configure.metadata').directive('dynatree', function() {
	return {
        link: function(scope, element, attrs) {
        	scope.generateTree(element);
        }
   };	
});
(function (){
	
	angular.module('weaveAnalyst.configure.metadata').service('metadataService', metadataService);
	
	metadataService.$inject = ['$q', '$rootScope','queryService', 'authenticationService'];
	
	function metadataService($q, rootScope, queryService, authenticationService){
		
		var that = this;
		that.gridData = [];
		
		/**
		  * this function is called whenever the user adds or deletes a column metadata property
		  * function converts an object into a json string to send to server
		  */
		 that.updateMetadata = function(metadata) {
			 var jsonaws_metadata = angular.toJson(that.convertToMetadataFormat(metadata));
			 if(angular.isDefined($scope.selectedDataTableId))
				 {
							 queryService.updateEntity($scope.authenticationService.user, 
					 				   $scope.authenticationService.password, 
					 				   $scope.selectedDataTableId, 
					 				   { 
											publicMetadata : { aws_metadata : jsonaws_metadata }
					 				   }).then(function() {
					 				   });
				 }
			 
			 alert("Metadata Updated for id : " + $scope.selectedDataTableId);
		 };
	 
		 that.setGridData = function(data) {
			  that.gridData = data;
			 // rootScope.$safeApply();
		 };
		 
		 
		/**
		 * function that converts a aws-metadata json object into an array of objects that look like this { property:
		 * 																	 								value : }
		 * for using in the grid
		 * */
		that.convertToTableFormat = function(aws_metadata) {
			var data = [];
			for (var key in aws_metadata) {
				data.push({property : key, value : angular.toJson(aws_metadata[key]) });
			}
			return data;
		};
		


		/**
		* function that converts a object { property: , value : } into an aws_metadata json object
		* for updating to the server
		* */
		that.convertToMetadataFormat = function (tableData) {
			var aws_metadata = {};
			for (var i in tableData) {
			aws_metadata[tableData[i].property] = angular.fromJson(tableData[i].value);
			}
			return aws_metadata;
		};


			
		/**
		 * retrieves the metadata for a single column
		 * */
		that.getColumnMetadata = function (columnObject) {
			if(columnObject && columnObject.id) {
				queryService.getEntitiesById([columnObject.id], true).then(function(entity) {
						entity = entity[0];
						if(entity.publicMetadata.hasOwnProperty('aws_metadata')) {
							var data = [];
							var aws_metadata = angular.fromJson(entity.publicMetadata.aws_metadata);//converts the json string into an object
							data = that.convertToTableFormat(aws_metadata);//to use in the grid
							that.setGridData(data);
						}
				});
			} else {
					that.setGridData([]);
			}
		};

		that.cmp = function(a, b) {
			key1 = a.data.key;
			key2 = b.data.key;
			return key1 > key2 ? 1 : key1 < key2 ? -1 : 0;
		};		
	};
	
})();//end of IIFE
angular.module('weaveAnalyst.configure.script', []);

var tryParseJSON = function(jsonString){
    try {
        var o = JSON.parse(jsonString);

        // Handle non-exception-throwing cases:
        // Neither JSON.parse(false) or JSON.parse(1234) throw errors, hence the type-checking,
        // but... JSON.parse(null) returns 'null', and typeof null === "object", 
        // so we must check for that, too.
        if (o && typeof o === "object" && o !== null) {
            return o;
        }
    }
    catch (e) { }

    return false;
};

angular.module('weaveAnalyst.configure.script').controller("ScriptManagerCtrl", function() {


    
});

//this controller deals with the script wizard
angular.module('weaveAnalyst.configure.script').controller('AddScriptDialogInstanceCtrl', function () {


});
angular.module('weaveAnalyst.configure.script').service("scriptManagerService", [ function() {

}]);
/**
 * Created by Shweta on 8/5/15.
 * this component represents one ui crumb in the hierarchy
 * TODO import this as bower module from GITHUB
 * */
var shanti;
(function (){
    angular.module('weaveAnalyst.utils').directive('crumbSelector', selectorPillComponent);

    selectorPillComponent.$inject= [];
    function selectorPillComponent () {
        return {
            restrict: 'E',
            scope:{
            	column :'='
            },
            templateUrl:"src/utils/crumbs/crumbPartial.html" ,
            controller: sPillController,
            controllerAs: 'p_Ctrl',
            bindToController: true,
            link: function (scope, elem, attrs) {

            }
        };//end of directive definition
    }

    sPillController.$inject = ['$scope', 'WeaveService'];
    function sPillController (scope, WeaveService){
       var p_Ctrl = this;
        p_Ctrl.WeaveService = WeaveService;
        p_Ctrl.display_Children = display_Children;
        p_Ctrl.display_Siblings = display_Siblings;
        p_Ctrl.add_init_Crumb = add_init_Crumb;
        p_Ctrl.manage_Crumbs = manage_Crumbs;
        p_Ctrl.populate_Defaults = populate_Defaults;
        p_Ctrl.get_trail_from_column = get_trail_from_column;

        p_Ctrl.showList = false;

        //is the previously added node in the stack, needed for comparison
        //structure of each node should be {w_node //actual node ; label: its label}
        p_Ctrl.weave_node = {};
        p_Ctrl.crumbTrail = [];
        p_Ctrl.crumbLog = [];

        shanti = p_Ctrl;
        scope.$watch('p_Ctrl.column', function(){
        	if(p_Ctrl.column.defaults)
        		p_Ctrl.populate_Defaults();
        });
        
        function populate_Defaults (){
        	//clear existing logs and trails
        	p_Ctrl.crumbLog = []; p_Ctrl.crumbTrail = [];
        	//create the new trail starting from the column
        };
        
        function get_trail_from_column (in_column){
        	var trailObj = {trail : [], logs : []};
        	
        	
        	return trailObj;
        };

        function manage_Crumbs(i_node){
            /*1. check if it is the previously added node*/
            if(i_node.label != p_Ctrl.weave_node.label && p_Ctrl.weave_node) {//proceed only if it is new
                /*2. check if it in the trail already */
                if($.inArray(i_node.label, p_Ctrl.crumbLog) == -1) {//proceed if it is new
                    /* for the very first crumb added; happens only once*/
                    if(!p_Ctrl.crumbTrail.length && !p_Ctrl.crumbLog.length){
                       // console.log("first WeaveDataSource crumb added...");
                        p_Ctrl.crumbTrail.push(i_node);
                        p_Ctrl.crumbLog.push(i_node.label);
                    }
                    //remaining iterations
                    else{
                        /*3. check if previous crumb in trail is parent*/
                        var p_name = i_node.w_node.parent.getLabel();
                        var p_ind = p_Ctrl.crumbLog.indexOf(p_name);
                        var trail_parent = p_Ctrl.crumbTrail[p_ind].label;

                        if(p_name == trail_parent) {//proceed only if previous one in trail is parent
                            /*4. check if a sibling is present after parent */
                            if(p_Ctrl.crumbTrail[p_ind + 1]){
                                var sib_node = p_Ctrl.crumbTrail[p_ind + 1];
                                var sib_parent_name = sib_node.w_node.parent.getLabel();
                                if(p_name == sib_parent_name){
                                    //if yes
                                    //remove sibling and is trail
                                    p_Ctrl.crumbTrail.splice(p_ind+1, Number.MAX_VALUE);
                                    p_Ctrl.crumbLog.splice(p_ind+1, Number.MAX_VALUE);
                                    //add it
                                    p_Ctrl.crumbTrail.push(i_node);
                                    p_Ctrl.crumbLog.push(i_node.label);
                                    //console.log("replacing sibling and updating ...");

                                }
                            }
                            else{
                                //if no then add
                                //console.log("new child added after parent...");
                                p_Ctrl.crumbTrail.push(i_node);
                                p_Ctrl.crumbLog.push(i_node.label);
                            }
                        }
                        else{}//don't add it anywhere in trail
                    }
                }
                else{}//if it already exists in the trail
            }
            else{}// if it is old
            p_Ctrl.weave_node = i_node;

            //p_Ctrl.toggleList = false;
            if(i_node.w_node.isBranch()){
                if(i_node.label == 'WeaveDataSource')
                    p_Ctrl.showList = false;
                else{
                    p_Ctrl.display_Children(i_node);
                    p_Ctrl.showList = true;
                }
            }
            else
                p_Ctrl.showList = false;
        }


        //this function adds the data source initial pill, done only once as soon as weave loads
        function add_init_Crumb (){
            if(p_Ctrl.WeaveService.request_WeaveTree()){
                var ds = p_Ctrl.WeaveService.weave_Tree.getChildren();

                var init_node = {};
                init_node.label = ds[0].getLabel();
                init_node.w_node= ds[0];//starting with the WeaveDataSource Pill
                p_Ctrl.manage_Crumbs(init_node);
                //scope.$apply();//because digest completes by the time the tree root is fetched
            }
            else
                setTimeout(p_Ctrl.add_init_Crumb, 300);
        }

        function display_Children(i_node){
            p_Ctrl.showList = true;
            p_Ctrl.WeaveService.display_Options(i_node, true);//using the actual node
        }

        function display_Siblings(i_node){
            p_Ctrl.showList = true;
            p_Ctrl.WeaveService.display_Options(i_node);
        }
    }
})();
/**
 * this is a modified collapsible tree written in d3
 * reference : http://bl.ocks.org/mbostock/4339083
 */

if(!this.wa){
	this.wa = {};
}

if(!this.wa.d3_viz){
	this.wa.d3_viz = {};
}

(function(){
	//constructor
	function collapsibleTree (){
		this._container;
		this._margin;
		this._height;
		this._width;
		
		this._root;
		this._diagnol;
		this._duration;
		
		this._treeSvg;
		this._tree;
		this._nodes;
		this._links;
		this._i;
	};
	
	var p = collapsibleTree.prototype;
	window.wa.d3_viz.collapsibleTree = collapsibleTree;
	
	//inits the tree initial parameters
	p.intialize_tree = function(config){
		
		this._container = config.container;
		
		console.log(config.container.offsetHeight);
		
		this._margin = {top: 20, right: 20, bottom: 20, left: 20};
	    //this._width = this._container.offsetWidth - this._margin.right - this._margin.left,
	    //this._height = this._container.offsetHeight - this._margin.top - this._margin.bottom;
		
		this._width= 500 - this._margin.right - this._margin.left,
		this._height = 500 - this._margin.top - this._margin.bottom;

		this._i = 0;
		this._duration = 750;

		this._tree = d3.layout.tree()
	    	.size([this._height, this._width]);

		this._diagonal = d3.svg.diagonal()
	    .projection(function(d) { return [d.x, d.y]; });
		
		this._treeSvg = d3.select(this._container).append("svg")
	    .attr("width", this._width + this._margin.right + this._margin.left)
	    .attr("height", 1000)
	    .append("g")
	    .attr("transform", "translate(" + this._margin.left + "," + this._margin.top + ")");
		
		this.create_Root_Node();
		
	};
	
	//creates the first root node
	p.create_Root_Node = function(){

		d3.json("src/visualization/d3_viz/flare.json", function(error, flare) {
		  if (error) throw error;

		  this._root = flare;
		  this._root.x0 =  this._height / 2;
		  this._root.y0 = 0;

		  function collapse(d) {
			    if (d.children) {
			      d._children = d.children;
			      d._children.forEach(collapse);
			      d.children = null;
			    }
			  }
		  
		  this._root.children.forEach(collapse);
		  this.update(this._root);
		}.bind(this));

		d3.select(self.frameElement).style("height", "800px");
	};
	

	// Toggle children on click.
	p.click = function (d){
	  if (d.children) {
	    d._children = d.children;
	    d.children = null;
	  } else {
	    d.children = d._children;
	    d._children = null;
	  }
	  this.update(d);
	};
	
	p.update = function(source){
		
		var t = this;

		//console.log("this", this);
		  // Compute the new tree layout.
		t._nodes = t._tree.nodes(t._root).reverse(),
		t._links = t._tree.links(t._nodes);

		  // Normalize for fixed-depth.
		 t._nodes.forEach(function(d) { d.y = d.depth * 180; });

		  // Update the nodesÉ
		  var node = t._treeSvg.selectAll("g.node")
		      .data( t._nodes, function(d) { return d.id || (d.id = ++t._i); });

		  // Enter any new nodes at the parent's previous position.
		  var nodeEnter = node.enter().append("g")
		      .attr("class", "node")
		      .attr("transform", function(d) { return "translate(" + source.x0 + "," + source.y0 + ")"; })
		      .on("click",function(d){ t.click (d)});

		  nodeEnter.append("circle")
		      .attr("r", 1e-6)
		      .style("fill", function(d) { return d._children ? "lightsteelblue" : "#fff"; });

		  nodeEnter.append("text")
		      .attr("x", function(d) { return d.children || d._children ? -10 : 10; })
		      .attr("dy", ".35em")
		      .attr("text-anchor", function(d) { return d.children || d._children ? "end" : "start"; })
		      .text(function(d) { return d.name; })
		      .style("fill-opacity", 1e-6);

		// Transition nodes to their new position.
		  var nodeUpdate = node.transition()
		      .duration(t._duration)
		      .attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });


		  nodeUpdate.select("circle")
		      .attr("r", 4.5)
		      .style("fill", function(d) { return d._children ? "lightsteelblue" : "#fff"; });

		  nodeUpdate.select("text")
		      .style("fill-opacity", 1);

		// Transition exiting nodes to the parent's new position.
		  var nodeExit = node.exit().transition()
		      .duration( t._duration)
		      .attr("transform", function(d) { return "translate(" + source.x + "," + source.y + ")"; })
		      .remove();

		  nodeExit.select("circle")
		      .attr("r", 1e-6);

		  nodeExit.select("text")
		      .style("fill-opacity", 1e-6);

		  // Update the linksÉ
		  var link =  t._treeSvg.selectAll("path.link")
		      .data( t._links, function(d) { return d.target.id; });

		  // Enter any new links at the parent's previous position.
		  link.enter().insert("path", "g")
		      .attr("class", "link")
		      .attr("d", function(d) {
		        var o = {x: source.x0, y: source.y0};
		        return  t._diagonal({source: o, target: o});
		      }.bind(this));

		  // Transition links to their new position.
		  link.transition()
		      .duration( t._duration)
		      .attr("d",  t._diagonal);

		  // Transition exiting nodes to the parent's new position.
		  link.exit().transition()
		      .duration( t._duration)
		      .attr("d", function(d) {
		        var o = {x: source.x, y: source.y};
		        return  t._diagonal({source: o, target: o});
		      })
		      .remove();

		  // Stash the old positions for transition.
		  this._nodes.forEach(function(d) {
		    d.x0 = d.x;
		    d.y0 = d.y;
		  });
	};
})();
/**
 * this d3 file renders a d3 heat map using different metrics
 * for example correlation matrix etc
 * 
 * @ author spurushe
 */

if(!this.wa){
	this.wa = {};
}

if(!this.wa.d3_viz){
	this.wa.d3_viz = {};
}

(function(){
	
	function heatMap (){
		this._container;
		this._margin;
		this._width;
		this._height;
		this._heatMapSvg;
		
		this._colScale;
		this._rowScale;
		this._rowObjects;
		this._rowCells;
		
		
		this._colorRamp;
		this._colorScale;
		this._toolTip;
		
		this._data;
		this._labels;
	};
	
	var p = heatMap.prototype;
	
	window.wa.d3_viz.heatMap = heatMap;
	
	
	//initializes the heat map 
	p.initialize_heatMap = function(config){
		
		this._margin =  {top: 10, right: 200, bottom: 50, left: 50};
		this._container = config.container;
		
		this._width = this._container.offsetWidth - this._margin.left;
		this._height = this._container.offsetHeight - this._margin.top;

		//original SVG
		this._heatMapSvg = d3.select(this._container).append("svg")
			.attr("width", this._width )
			.attr("height",this._height );
		
		this._data = config.data;
		this._labels = config.labels;
		
		  // Scaling Functions
		this._rowScale = d3.scale.linear().range([0, this._width/1.25]).domain([0,this._data.length]);

		this._colScale = d3.scale.linear().range([0, this._height/1.25]).domain([0,this._data.length]);

		//toolTip
		this._toolTip = d3.select(this._container)
		.append("div")
		.style("visibility", "hidden")
		.attr("class", "toolTip")
		.text("");
	};
	
	/**
	 * function to draw a heatmap using a matrix computed in R/STATA
	 *  dom_element_to_append_to: the HTML element to which the heatmap D3 viz is appended
	 *  data: the computed matrix   
	 *  columnTitles required for labeling the matrix
	 */
	p.render_heatMap = function(){
		
		var hmObj = this;
		
		if(!hmObj._heatMapSvg){
			console.log("Heat Map still initializing");
			setTimeout(p.render_heatMap, 100);
		}
		
		this.setColor();

		// remove all previous items before render
	    if(hmObj._heatMapSvg)
	    	hmObj._heatMapSvg.selectAll('*').remove();
	    else
	    	return;
		
		
		//row creation
	    hmObj._rowObjects = hmObj._heatMapSvg.selectAll(".row")//.row is a predefined grid class
						.data(hmObj._data)
						.enter().append("svg:g")
						.attr("transform", "translate(" + hmObj._margin.right + "," + hmObj._margin.bottom + ")")
						.attr("class", "row");
		
		//appending text for row
	    hmObj._rowObjects.append("text")
	      .attr("x", -1)
	      .attr("y", function(d, i) { return hmObj._colScale(i); })
	      .attr("dy", "0.25")
	      .attr("fill", 'darkOrange')
	      .attr("text-anchor", "end")
	      .text(function(d, i) { return hmObj._labels[i]; });
	    

	    hmObj._rowCells = hmObj._rowObjects.selectAll(".cell")
		    			.data(function (d,i)
				    		{ 
				    			return d.map(function(a) 
				    				{ 
				    					return {value: a, row: i};} ) ;
							})//returning a key function
			            .enter().append("svg:rect")
			             .attr("x", function(d, i) {  return hmObj._rowScale(i); })
			             .attr("y", function(d, i) { return hmObj._colScale(d.row); })
			             .attr("width", hmObj._rowScale(1))
			             .attr("height", hmObj._colScale(1))
			             .style("fill", function(d) { return hmObj._colorScale(d.value);})
			             .style('stroke', "black")
			             .style('stroke-width', 1)
			             .style('stroke-opacity', 0)
			             .on('mouseover', function(d){ hmObj._toolTip.style('visibility', 'visible' ).text(d.value); 
			             							   d3.select(this).style('stroke-opacity', 1);})
			             .on("mousemove", function(){return hmObj._toolTip.style("top", (event.pageY-10)+"px").style("left",(event.pageX+10)+"px");})
			             .on('mouseout', function(){ hmObj._toolTip.style('visibility', 'hidden'); 
			             							 d3.select(this).style('stroke-opacity', 0);});
	    
	    //TEMPORARY SOLUTION for getting column names
	    var btm_Label_g = hmObj._rowObjects[0][3];
	    
	   console.log("entire g element", btm_Label_g);
	   console.log("the object", d3.select(btm_Label_g));
	    
	   var x = d3.select(btm_Label_g)
	    .data(hmObj._labels)
	    .enter()
	    .append('g');
	   
	   
	   console.log("four gs", x);
	    
	    
//	    .append("text")
//	    .attr("x", -1)
//	    .attr("y", function(d, i) { return hmObj._colScale(i); })
//	    .attr("dy", "0.25")
//	    .attr("fill", 'darkOrange')
//	    .text(function(d, i) {
//	    	console.log(d);
//	    	return hmObj._labels[i]; });
	};
	
	//sets the color of the heat map
	p.setColor = function(){//to parameterize color scales
		var colorLow = 'green', colorMed = 'yellow', colorHigh = 'red';

		this._colorScale = d3.scale.linear()
		     .domain([0, 5, 10])//TODO parameterize this according to the matrix  
		     .range([colorLow, colorMed, colorHigh]);
	};
})();


/**
 * code for rendering the d3 map filter tool used in the Weave Analyst
 * @ author spurushe
 * @ author sanjay1909
 */

if(!this.wa){
	this.wa = {};
}

if(!this.wa.d3_viz){
	this.wa.d3_viz = {};
}

(function(){
	
	function mapTool(){
		
		this._zoom;
		this._centered;
		this._width;
		this._height;
		this._projection;
		this._path;
		this._toolTip;
		
		
		this._stateGrp;
		this._countyGrp;
		this._counties = {};
		this._statePaths;
		this._countyPaths;
		this._heirarchy;
		this._stateIdLookup = {};
		
		//is a pointer to the geometries after GEO-Jsons are loaded the first time
		this.cache = {
				stateTopoGeometries : [],
				countyTopoGeometries : [],
				selectedStates : {},
				selectedCounties : {},
				US: []
		};
		
		
		
	}
	
	var p = mapTool.prototype;
	
	p.intializeChart = function(config){
		
		this._container = config.container;
		this._margin = config.margin;
		
		this._fileName = config.fileName;
		this._stateFile = config.stateFile;
		this._countyFile = config.countyFile;
		
		this._width = (this._container.offsetWidth) - this._margin.left - this._margin.right;
		this._height = (this._container.offsetHeight) - this._margin.top - this._margin.bottom;
	    
		
		//original SVG
		this._mapSvg = d3.select(this._container).append("svg")
			.attr("width", this._width )
			.attr("height",this._height );
		
		//projection
		this._projection = d3.geo.albersUsa()
							 .translate([this._width/2, this._height/2])
							 .scale([550]);
		//path generator
		this._path = d3.geo.path()
					   .projection(this._projection);
		
		this._zoom = d3.behavior.zoom()
	    .translate(this._projection.translate())
	    .scale(this._projection.scale())
	    .scaleExtent([this._height, 8 * this._height])
	    .on("zoom", this.zoomMap.bind(this));
		
		this._toolTip = d3.select(this._container)
		.append("div")
		.style("position", "absolute")
		.style("z-index", "10")
		.style("visibility", "hidden")
		.text("")
		.style("color", "red")
		.style("font-weight", 'bold');
		
		// these updates the map
		
	};
	

	p.zoomMap = function() {
		  this._projection.translate(d3.event.translate).scale(d3.event.scale);
		  this._stateGrp.selectAll("path").attr("d", this._path);
	};
	
	/**
	 * @param heirarchy the hierarchy you want to render at eg State vs country vs county
	 * @param selectedStates states selected in a previous run
	 * @param selectedCounties counties selected in a previous run
	 */
	p.renderLayer = function(heirarchy, selectedStates, selectedCounties){
		if(!this._mapSvg){
			console.log("Chart not initialized yet");
			return;
		}
		
		
		this._heirarchy = heirarchy;
		if(selectedStates)
			this.cache.selectedStates = selectedStates;
		if(selectedCounties){
			this.cache.selectedCounties = selectedCounties;
		}
			
		
		if(this.cache.US.length == 0)
		{//first time call
			this.loadGeoJson(this._fileName,this._heirarchy);
		}
		else{
			if(this._heirarchy == 'State'){//handling state level geometries
				addStatelayer.call(this,this.cache.stateTopoGeometries.features);	
				
			}
			else if(this._heirarchy == 'County'){ //handling county level
				if('name' in this.cache.countyTopoGeometries.features[0].properties)//if this property has been assigned add it
					addCountyLayer.call(this,this.cache.countyTopoGeometries.features);
				else
					this.loadCountyLayer(this._countyFile);
				
			}
			
		}
	};
	
	p.loadGeoJson = function(filename,heirarchy) {		
		d3.json(filename, function(error, USGeometries){
			
			this.cache.US = USGeometries;
			
			var states = topojson.feature(USGeometries, USGeometries.objects.states);
			this.cache.stateTopoGeometries = states;
			
			var counties = topojson.feature(USGeometries, USGeometries.objects.counties);
			this.cache.countyTopoGeometries = counties;
			
			if(heirarchy== 'State'){//handling state level geometries
				this.loadStateLayer(this._stateFile);
				
			}
			else if(heirarchy== 'County'){ //handling county level
				this.loadCountyLayer(this._countyFile);
			}
		}.bind(this));		
	};
	

	p.loadStateLayer = function(fileName){
		d3.csv(fileName, function(state_fips){
			for(i in state_fips){
				var fips = parseFloat(state_fips[i].US_STATE_FIPS_CODE);
				for(j in this.cache.stateTopoGeometries.features){
					var id = this.cache.stateTopoGeometries.features[j].id;
					if(fips == id){
						this.cache.stateTopoGeometries.features[j].properties.name = state_fips[i].NAME10;
						break;
					}
				}//j loop
			}//i loop
			addStatelayer.call(this,this.cache.stateTopoGeometries.features);	
			
		}.bind(this));//end of csv load
	};
	
	var addStatelayer = function(geometries){
		//adding map layer
		
		this._mapSvg.selectAll("*").remove();
		
		this._stateGrp = this._mapSvg.append("g")
	    .call(this._zoom);
		
		this._statePaths = this._stateGrp.selectAll(".path")
		.data(geometries)
		.enter()
		.append("path")
		.attr("d", this._path)
		.attr("class", "geometryFill");
		
		
		//handling selections							
		this._statePaths							
		.on('click', function(d){
			console.log("d", d);
			//if it is selected for the first time
			if(!(d.id in this.cache.selectedStates)){
				this.cache.selectedStates[d.id] = { title: d.properties.name };
			}
			//if already selected; remove it
			else{
				delete this.cache.selectedStates[d.id];
			}
			this.selectTheStates(this.cache.selectedStates);
			
		}.bind(this))
		.on('mouseover', function(d){
				this._toolTip.style('visibility', 'visible' ).text(d.properties.name); 
			}.bind(this))
	    .on("mousemove", function(){
	    	return this._toolTip.style("top", (event.pageY-10)+"px").style("left",(event.pageX+10)+"px");
	    	}.bind(this))
	    .on('mouseout', function(){ 
	    	this._toolTip.style('visibility', 'hidden');
	    	}.bind(this));
		
		//this runs if the selected states have already been cached
		if(Object.keys(this.cache.selectedStates).length != 0)
		{
			this.selectTheStates(this.cache.selectedStates);
		}
	};
	
	p.selectTheStates = function(selectedStates){
			//TODO it needs improvement
			//apply the selected class for the selected state
		
			this._statePaths.classed('selected', function(d){	
				if(d.id in selectedStates)
					d.selected = true;
				else
					d.selected = false;
				return d.selected;
			});
			
		
	};
	
	p.selectTheCounties = function(selectedCounties){
		this._countyPaths.classed('selected', function(d){
			if(d.id in selectedCounties)
				d.selected = true;
			else
				d.selected = false;
			return d.selected;
		});
	};
	
	
	p.loadCountyLayer = function(fileNmae){
		//adding county name property from csv to topojson
		d3.csv(fileNmae, function(county_fips){
			
			for(i in county_fips){
				var county_fips_code = parseFloat(county_fips[i].FIPS);
				for(j in this.cache.countyTopoGeometries.features){
					var id = this.cache.countyTopoGeometries.features[j].id;
					if(county_fips_code == id){
						this.cache.countyTopoGeometries.features[j].properties.name = county_fips[i].County_Name;
						this.cache.countyTopoGeometries.features[j].properties.state = county_fips[i].State_Name;
						this.cache.countyTopoGeometries.features[j].properties.stateAbbr = county_fips[i].State_Abbr;
						this.cache.countyTopoGeometries.features[j].properties.stateId = parseFloat(county_fips[i].STFIPS);
						break;
					}
				}//j loop
			}//i loop
			
			addCountyLayer.call(this);
			
		}.bind(this));//end of csv load
	};
	
	
	p.addCountyLayerForState = function(d){
		if(d)
			var gElement = this._stateIdLookup[d.id];
		if( this._stateGrp.clickedState != gElement){
			var chart = this;
			var x, y, k;
			
			if (d  && this._centered !== d) {
			    var centroid = this._path.centroid(d);
			    x = centroid[0];
			    y = centroid[1];
			    k = 2;
			    this._centered = d;
			    
			   
			    //drawing counties in d
			    var gAr = d3.select(gElement);
			    this._countyPaths= gAr.selectAll("path")
			     .data(this.cache.countyTopoGeometries.features)
			     .enter().append("g")
			     .filter(function(cd,i){
			    	 return d.id == cd.properties.stateId;
			    	
			     })
			     .attr("class", "geometryFill");
			    
			    
			    this._countyPaths
			     .on('click', function(d){
						var countyObj;
						// first check county object there for stateID , then check countyID there for that state
						if(!this.cache.selectedCounties[d.properties.stateId] || !(d.id in this.cache.selectedCounties[d.properties.stateId].counties)){
							countyObj = this.cache.selectedCounties[d.properties.stateId];
							if(!countyObj) 
								countyObj = {title: d.properties.state, state: d.properties.stateId ,counties:{} };
							countyObj.counties[d.id] = { title: d.properties.name };
							
							this.cache.selectedCounties[d.properties.stateId] = countyObj;
							this._counties[d.id] = d.properties.name;
						}
						//if already selected; remove it
						else{
							countyObj = this.cache.selectedCounties[d.properties.stateId];
							if(countyObj){
								delete this.cache.selectedCounties[d.properties.stateId].counties[d.id];
								delete chart._counties[d.id];
							}
						}
						if(this.cache.selectedCounties[d.properties.stateId])
							this.selectTheCounties(this.cache.selectedCounties[d.properties.stateId].counties);
						
						
						
			     }.bind(this))
			     .on('mouseover', function(d){
					 this._toolTip.style('visibility', 'visible' ).text(d.properties.name + " (" + d.properties.stateAbbr + ")"); 
			     	}.bind(this))
				 .on("mousemove", function(){
					 return this._toolTip.style("top", (event.pageY-10)+"px").style("left",(event.pageX+10)+"px");
				 	}.bind(this))
				 .on('mouseout', function(){
					 this._toolTip.style('visibility', 'hidden');
					 }.bind(this))
			     .append("path")
			     .attr("d", this._path)
			     .attr("class", "countyBorders");
			} 
			  
			else { 
				x = this._width / 2;
				y = this._height / 2;
				k = 1;
				this._centered = null;
		  
			}

//			  f.selectAll("path")
//			      .classed("active", centered && function(d) { return d === centered; });

			this._stateGrp.transition()
			      .duration(750)
			      .attr("transform", "translate(" + this._width / 2 + "," + this._height / 2 + ")scale(" + k + ")translate(" + -x + "," + -y + ")")
			      .style("stroke-width", 1.5 / k + "px");
			
			if(d)
				{
					if(this.cache.selectedCounties[d.id])
						this.selectTheCounties(this.cache.selectedCounties[d.id].counties);
				}
		}
		this._stateGrp.clickedState = gElement;
	};
	
	
	var addCountyLayer = function(geometries){
		if(this.cache.selectedCounties){
			for(stateID in this.cache.selectedCounties)
				for(countyID in this.cache.selectedCounties[stateID].counties)
					this._counties[countyID] = this.cache.selectedCounties[stateID].counties[countyID];
		}
		else
			this._counties = {};
		var chart = this;
		
		this._mapSvg.selectAll("*").remove();
		
		this._mapSvg.append("rect")
		 .attr("class", "background")
		 .attr("width", this._width)
		 .attr("height", this._height)
		 .on("click", this.addCountyLayerForState.bind(this));
		
		this._stateGrp = this._mapSvg.append('g');
		
		
		this._statePaths = this._stateGrp
		 .append("g")
		 .attr("id", "states")
		 .selectAll("g")
		 .data(this.cache.stateTopoGeometries.features)
		 .enter();
		
		this._statePaths.append("g")
		.each(function(d){ 
			chart._stateIdLookup[d.id] = this;
		})
		.on('click', this.addCountyLayerForState.bind(this))
		 .append("path")
		 .attr("d", this._path); 
		
		this._stateGrp.append("path")//just for the borders
	      .datum(topojson.mesh(this.cache.US, this.cache.US.objects.states, function(a, b) { return a !== b; }))
	      .attr("id", "state-borders")
	      .attr("d", this._path);
		
		
		//this runs if the selected states have already been cached
		if(Object.keys(this.cache.selectedCounties).length != 0)
		{
			for(state in this.cache.selectedCounties){
				for(var i = 0; i < this.cache.stateTopoGeometries.features.length; i++)
					{
						if(state == this.cache.stateTopoGeometries.features[i].id)
							{
								this.addCountyLayerForState(this.cache.stateTopoGeometries.features[i]);
								break;
							}
					}
				
			}
			
		}
	};
	
	
	window.wa.d3_viz.mapTool = mapTool;
}());


/**
 * this renders column distributions of numerical columns using the d3 library
 * @author spurushe 
 */


if(!this.wa){
	this.wa = {};
}

if(!this.wa.d3_viz){
	this.wa.d3_viz = {};
}

(function(){
	
	function sparkLine (){
		this._container;
		this._svg;
		
		this._breaks;
		this._counts;
		
		this._heightScale;
		this._widthScale;
		this._width;
		this._height;
		this._barWidth;
		
		this.toolTip;
		this._bar;
	};
	
	var p = sparkLine.prototype;
	window.wa.d3_viz.sparkLine = sparkLine;
	
	
	
	p.initialze_sparkLine = function(config){
		
		this._container = config.container;

		//data
		this._breaks = config.breaks;
		this._counts = config.counts;
		
		this._margin = {top: 5, right: 5, bottom: 5, left: 5};
		this._width = config.width; this._height= config.height;

		//scales
		this._heightScale = d3.scale.linear()
				  .domain([0, d3.max(this._counts)])
				  .range([this._height, 0]);//output should be between height and 0
		
		this._widthScale = d3.scale.linear()
						   .domain([0, d3.max(this._breaks)])
						   .range([0, this._width]);
		
		//tooltip
		this._tooltip = d3.select(this._container)
		.append("div")
		.style("position", "absolute")
		.style("z-index", "10")
		.style("visibility", "hidden")
		.text("")
		.style("color", "red")
		.style("font-weight", 'bold');
		
		this._barWidth = (this._width - this._margin.left - this._margin.right)/this._counts.length;
		
		//creating the svgS
		this._svg = d3.select(this._container).append('svg')
					  .attr('fill', 'black')
					  .attr('width', this._width)//svg viewport dynamically generated
					  .attr('height', this._height )
					  .append('g')
					  .attr("transform", "translate(" + this._margin.left + "," + this._margin.top + ")");
		
	};
	
	

	/**
	 * this function draws the sparklines computed in R/STATA (one per column)
	 * @param dom_element_to_append_to :the HTML element to which the sparkline D3 viz is appended
	 * @param sparklineData : the distribution data calculated in R/STATA
	 */
	p.render_sparkLine = function(){
		var slObj = this;
		
		if(!slObj._svg){
			console.log("Still initializing chart");
			setTimeout(p.render_sparkLine, 100);
		}
	
		//making one g element per bar 
		slObj._bar = slObj._svg.selectAll("g")
	      			   .data(slObj._counts)
	      			   .enter().append("svg:g")
	      			   .attr("transform", function(d, i) {  return "translate(" + (i * slObj._barWidth ) + ",0)"; });

		slObj._bar.append("rect")	
	      .attr("y", function(d) { return slObj._heightScale(d); })
	      .attr("height", function(d) { return slObj._height - slObj._heightScale(d); })
	      .attr("width", slObj._barWidth)
	      .on('mouseover', function(d){ slObj._tooltip.style('visibility', 'visible' ).text(d);   d3.select(this).style('stroke-opacity', 1);})
          .on("mousemove", function(){return slObj._tooltip.style("top", (event.pageY-10)+"px").style("left",(event.pageX+10)+"px");})
          .on('mouseout', function(){ slObj._tooltip.style('visibility', 'hidden'); 
			             							 d3.select(this).style('stroke-opacity', 0);});
	};
})();

(function(){
	angular.module('weaveAnalyst.WeaveModule', []);
	angular.module('weaveAnalyst.WeaveModule').service("WeaveService", WeaveService);

	WeaveService.$inject = ['$q','$rootScope','runQueryService', 'dataServiceURL','queryService'];
	
	function WeaveService ($q, rootScope, runQueryService, dataServiceURL, queryService){
		
		var that = this;
		var ws= this;
		
		that.weave;
		that.weaveWindow = window;
		that.analysisWindow = window;
		that.toolsEnabled = [];
		that.columnNames = [];
	
	
	/**
	 * 
	 * @param className {String}
	 * @param path {Array} path to the desired location in the session state, if no path is provided
	 * 					   it defaults to the root of the session state
	 * 
	 * @return {string}
	 */
	that.generateUniqueName = function(className, path) {
		if(!ws.weave)
			return null;
		return ws.weave.path(path || []).getValue('generateUniqueName')(className);
	};
	
	//TODO move this to app.js
	//fetches the path of the given node in the weave tree
	that.fetchNodePath = function(input_node, childrenFlag){
		var deferred = $q.defer();
		
		//if(ws.cache.previousNodeId == input_node.metadata.weaveEntityId){
		//	console.log("retrieving from cache");
		//	return this.cache.columnReference;
		//}
		//else{
		//	console.log("making fresh call");
			
			if(ws.weave && ws.checkWeaveReady()){
					
					var w = rootScope.weaveTree;
					var weaveTreeIsBusy = weave.evaluateExpression(null, '() => WeaveAPI.SessionManager.linkableObjectIsBusy(WEAVE_TREE_NODE_LOOKUP[0])');
					var indx = 0;
					
					(function retrievePathOnceReady(){
						nodePath = w.findPath(input_node.dataSourceName, input_node.metadata);
						if(nodePath){
							if(weaveTreeIsBusy()){
								setTimeout(retrievePathOnceReady, 500);
							}
							else{
								indx = (nodePath.length) - 2;
								if(childrenFlag){//retrieve children if children requested
									var children = nodePath[indx].getChildren();
									rootScope.$safeApply(function() {
					    				deferred.resolve(children);
					    			});
								}
								else{//retrieve label
									var label = nodePath[indx].getLabel();
									rootScope.$safeApply(function() {
					    				deferred.resolve(label);
					    			});
								}
							}
								
						}
						else{
							setTimeout(retrievePathOnceReady, 500);
						}
						
					})();
				}
			
			return deferred.promise;
		//}
		
	};

	
	that.getPathToFilters = function() {
		if(!ws.checkWeaveReady())
			return;
		return ws.weave.path("scriptKeyFilter").request("KeyFilter").push("filters");//references the Linkableashmap 'filters' in a keyFilter
	};
	
	that.tileWindows = function() {
		if(!ws.checkWeaveReady())
			return;
		ws.weave.path()
		 .libs("weave.ui.DraggablePanel")
		 .exec("DraggablePanel.tileWindows()");
	};
	
	
	that.setWeaveWindow = function(window) {
		var weave;
		if(!window) {
			ws.weave = null;
			return;
		}
		try {
			ws.weaveWindow = window;
			weave = window.document.getElementById('weave');

			if (weave && weave.WeavePath && weave.WeavePath.prototype.pushLayerSettings) {
				ws.weave = weave;
				console.log("weave and its api are ready");
				rootScope.$safeApply();
			}
			else {
				setTimeout(ws.setWeaveWindow, 50, window);
			}
		} catch (e)
		{
			console.error("fails", e);
		}
    };
    
    that.checkWeaveReady = function(){
    	return ws.weave && ws.weave.WeavePath && ws.weave._jsonCall;
    };
    
    that.setWeaveWindow(window);
	
    that.addCSVData = function(csvData, aDataSourceName, queryObject) {
		var dataSourceName = "";
		if(!aDataSourceName)
			dataSourceName = ws.generateUniqueName("CSVDataSource");
		else
			dataSourceName = ws.generateUniqueName(aDataSourceName);
	
		ws.weave.path(dataSourceName)
			.request('CSVDataSource')
			.vars({rows: csvData})
			.exec('setCSVData(rows)');
		for(var i in csvData[0])
		{
			queryObject.resultSet.unshift({ id : csvData[0][i], title: csvData[0][i], dataSourceName : dataSourceName});
		}
	};
	
	// weave path func
	var setQueryColumns = function(mapping) {
		this.forEach(mapping, function(column, propertyName) {
			//console.log("column", column);
			//console.log("propertyName", propertyName);
			if (Array.isArray(column))
			{
				this.push(propertyName).call(setQueryColumns, column);
			}
			else if (ws.checkWeaveReady() && column)
			{
				if(column.id == "" || angular.isUndefined(column.id))
					return;
				this.push(propertyName).setColumn(column.id, column.dataSourceName);
			}
		});
		if (Array.isArray(mapping))
			while (this.getType(mapping.length))
				this.remove(mapping.length);
		return this;
	};
	
	//returns a list of visualization tools currently open in Weave
	that.listOfTools = function(){
		var tools = [];
		if(ws.checkWeaveReady()){
			tools =  ws.weave.path().libs('weave.api.ui.IVisTool').getValue('getNames(IVisTool)');
		}

		return tools;
	};

	Object.defineProperty(this, "toolsEnabled", {get: this.listOfTools});
	
	that.getSelectableAttributes = function(toolName, vizTool){
		
		var selAttributes =[];
		
		if(ws.checkWeaveReady()){
			if(vizTool == 'MapTool'){//because we're naming the plot layers here
				var plotLayers = ws.weave.path(vizTool, 'children', 'visualization', 'plotManager', 'plotters').getNames();
				
				for(var i in plotLayers)
				{
					var attrs = ws.weave.path(vizTool, 'children', 'visualization', 'plotManager', 'plotters', plotLayers[i]).getValue('getSelectableAttributeNames()');
					for(var j in attrs){
						selAttributes.push({plotLayer : plotLayers[i], title : attrs[j]});
					}
				}
				
			}
			else{
				
				var attrs = ws.weave.path(vizTool, 'children', 'visualization', 'plotManager', 'plotters', 'plot').getValue('getSelectableAttributeNames()');
				for(var j in attrs){
					selAttributes.push({plotLayer : 'plot', title : attrs[j]});
				}
			}
			

		}
		
		
		return selAttributes;
	};
	
	/**
	 * this function sets the selected attribute(selected in the attribute widget tool) in the required tool
	 * @param toolName the tool whose attribute is to be set
	 * @param vizAttribute the attribute of tool to be set
	 * @param attrObject the object used for setting vizAttribute
	 */
	
	that.setVizAttribute = function(originalTool, toolName, vizAttribute, attrObject){
		if((ws.checkWeaveReady))
			{	
				var selectedColumn;
				//1. collect columns find the right one
				var columnObjects = ws.weave.path(originalTool).request('AttributeMenuTool').push('choices').getState();
				for (var i in columnObjects)
				{
					if(columnObjects[i].sessionState.metadata == attrObject.title)
						selectedColumn = columnObjects[i].objectName;
				}
				//2. set it
				ws.weave.path(originalTool).request('AttributeMenuTool').state({selectedAttribute : selectedColumn});
				
			};
	};
	
	that.AttributeMenuTool = function(state, aToolName){
		
		if (!ws.checkWeaveReady())
		{
			ws.setWeaveWindow(window);
			return;
		}

		var toolName = aToolName || ws.generateUniqueName("AttributeMenuTool");
		if(state && state.enabled){
			ws.weave.path(toolName).request('AttributeMenuTool')
			//.state({ panelX : "50%", panelY : "0%", panelHeight: "15%", panelWidth :"50%",  panelTitle : state.title, enableTitle : true})
			.call(setQueryColumns, {choices: state.columns});
			
			if(state.vizAttribute && state.selectedVizTool)
				ws.weave.path(toolName).request('AttributeMenuTool')
				.state({targetAttribute : state.vizAttribute.title , targetToolPath : [state.selectedVizTool]});
		}
		else{//if the tool is disabled
			ws.weave.path(toolName).remove();
		}
		
		return toolName;
	};
	
	that.BarChartTool = function(state, aToolName){

		if (!ws.checkWeaveReady())
		{
			ws.setWeaveWindow(window);
			return;
		}

		var toolName = aToolName || ws.generateUniqueName("BarChartTool");
		
		if(state && state.enabled){//if enabled
			//create tool
			//panelX : "0%", panelY : "50%", panelTitle : state.title, enableTitle : true,
			ws.weave.path(toolName)
			.request('CompoundBarChartTool')
			.state({  showAllLabels : state.showAllLabels })
			.push('children', 'visualization', 'plotManager', 'plotters', 'plot')
			.push('sortColumn').setColumn(state && state.sort ? state.sort.metadata : "", state && state.sort ? state.sort.dataSourceName : "")
			.pop()
			.push('labelColumn').setColumn(state && state.label ? state.label.metadata : "", state && state.label ? state.label.dataSourceName : "")
			.pop()
			.push("heightColumns").setColumns(state && state.heights && state.heights.length ? state.heights.map(function(column) {
				return column.metadata;
			}) : {}, state && state.heights && state.heights[0] ? state.heights[0].dataSourceName : "")
			.pop()
			.push("positiveErrorColumns").setColumns(state && state.posErr ? state.posErr.map(function(column) {
				return column.metadata;
			}) : {}, state && state.posErr && state.posErr[0] ? state.posErr[0].dataSourceName : "")
			.pop()
			.push("negativeErrorColumns").setColumns(state && state.negErr && state.negErr.map(function(column) {
				return column.metadata;
			}), state && state.negErr && state.negErr[0] ? state.negErr[0].dataSourceName : "");
			//capture session state
			queryService.queryObject.weaveSessionState = ws.getSessionStateObjects();
			//tiling
			ws.tileWindows();
		}
		else{//if the tool is disabled
			ws.weave.path(toolName).remove();
		}
		
		return toolName;
	};
	
	that.MapTool = function(state, aToolName){

		if (!ws.checkWeaveReady())
		{
			ws.setWeaveWindow(window);
			return;
		}

		var toolName = aToolName || ws.generateUniqueName("MapTool");

		if(state && state.enabled){//if enabled
			//create tool
			ws.weave.path(toolName).request('MapTool');
			//.state({ panelX : "0%", panelY : "0%", panelTitle : state.title, enableTitle : true });
			
			//STATE LAYER
			if(state.stateGeometryLayer)
			{
				var stateGeometry = state.stateGeometryLayer;

				ws.weave.path(toolName).request('MapTool')
				.push('children', 'visualization', 'plotManager', 'plotters')
				.push('Albers_State_Layer').request('weave.visualization.plotters.GeometryPlotter')
				.push('line', 'color', 'defaultValue').state('0').pop()
				.call(setQueryColumns, {geometryColumn: stateGeometry});
				
			}
			else{//to remove state layer
				
				if($.inArray('Albers_State_Layer',ws.weave.path().getNames()))//check if the layer exists and then remove it
					ws.weave.path(toolName, 'children', 'visualization', 'plotManager', 'plotters', 'Albers_State_Layer').remove();
			}
			
			
			//COUNTY LAYER
			if(state.countyGeometryLayer)
			{
				var countyGeometry = state.countyGeometryLayer;
				
				ws.weave.path(toolName).request('MapTool')
				.push('children', 'visualization', 'plotManager', 'plotters')
				.push('Albers_County_Layer').request('weave.visualization.plotters.GeometryPlotter')
				.push('line', 'color', 'defaultValue').state('0').pop()
				.call(setQueryColumns, {geometryColumn : countyGeometry});
			
				//TODO change following
				//done for handling albers projection What about other projection?
				if(state.stateGeometryLayer){
					
					ws.weave.path(toolName, 'projectionSRS').state(stateGeometry.projection);
				}
				//ws.weave.path(toolName, 'children', 'visualization', 'plotManager', 'layerSettings', 'Albers_County_Layer', 'alpha').state(0);
			}
			else{//to remove county layer
				
				if($.inArray('Albers_County_Layer',ws.weave.path().getNames()))//check if the layer exists and then remove it
					ws.weave.path(toolName, 'children', 'visualization', 'plotManager', 'plotters', 'Albers_County_Layer').remove();
			}
			
			
			//LABEL LAYER
			if(state.labelLayer && state.stateGeometryLayer)
			{
				var labelLayer = state.labelLayer;
				//ws.weave.setSessionState([labelLayer.dataSourceName], {keyColName : "fips"});
				
				var stateGeometryLayer = state.stateGeometryLayer;
				
				ws.weave.path(toolName).request('MapTool')
				.push('children', 'visualization', 'plotManager','plotters')
				.push('stateLabellayer').request('weave.visualization.plotters.GeometryLabelPlotter')
				.call(setQueryColumns, {geometryColumn : stateGeometryLayer})
				.push('text').setColumn(labelLayer.metadata, labelLayer.dataSourceName);
			}
			
			//LAYER ZOOM
			//HACK for demo
//			if(state.zoomLevel)
//				{
//					ws.weave.path('MapTool','children', 'visualization', 'plotManager').vars({myZoom: state.zoomLevel}).exec('setZoomLevel(myZoom)');
//					
//					//for demo
//					if(state.zoomLevel > 3 && state.countyGeometryLayer)
//					{
//						ws.weave.path(toolName, 'children', 'visualization', 'plotManager', 'layerSettings', 'Albers_County_Layer', 'alpha').state(1);
//			
//					}
//					else{
//						ws.weave.path(toolName, 'children', 'visualization', 'plotManager', 'layerSettings', 'Albers_County_Layer', 'alpha').state(0);
//					}
//					//for demo end
//				}
			
			//
			if(state.zoomLevel){
					ws.weave.path('MapTool','children', 'visualization', 'plotManager').vars({myZoom: state.zoomLevel}).exec('setZoomLevel(myZoom)');
			}
			
			
			//capture session state
			queryService.queryObject.weaveSessionState = ws.getSessionStateObjects();
			//tiling
			ws.tileWindows();
		}
		else{//if the tool is disabled
			ws.weave.path(toolName).remove();
		}
		
		return toolName;
	};

	that.ScatterPlotTool = function(state, aToolName){
		
		if (!ws.checkWeaveReady())
		{
			ws.setWeaveWindow(window);
			return;
		}
		
		var toolName = aToolName || ws.generateUniqueName("ScatterPlotTool");

		if(state && state.enabled){//if enabled
			//create tool
			ws.weave.path(toolName).request('ScatterPlotTool');
			//.state({ panelTitle : state.title, enableTitle : true});
			
			if(state.X){
				 ws.weave.path(toolName).request('ScatterPlotTool')
				.push('children', 'visualization','plotManager', 'plotters', 'plot')
				.push('dataX').setColumn(state.X.metadata, state.X.dataSourceName);
			}
			else{
				 ws.weave.path(toolName).request('ScatterPlotTool')
					.push('children', 'visualization','plotManager', 'plotters', 'plot')
					.push('dataX').state('null');
			}
			
			if(state.Y){
				ws.weave.path(toolName).request('ScatterPlotTool')
				.push('children', 'visualization','plotManager', 'plotters', 'plot')
				.push('dataY').setColumn(state.Y.metadata, state.Y.dataSourceName);
			}
			else{
				 ws.weave.path(toolName).request('ScatterPlotTool')
					.push('children', 'visualization','plotManager', 'plotters', 'plot')
					.push('dataY').state('null');
			}
			//capture session state
			queryService.queryObject.weaveSessionState = ws.getSessionStateObjects();
			//tiling
			ws.tileWindows();
		}
		else {//if the tool is disabled
			ws.weave.path(toolName).remove();
		}
		
		return toolName;
	};
	
	that.DataTableTool = function(state, aToolName){

		if (!ws.checkWeaveReady())
		{
			ws.setWeaveWindow(window);
			return;
		}

		var toolName = aToolName || ws.generateUniqueName("DataTableTool");
		
		if(state && state.enabled){//if enabled			
			//create tool
			ws.weave.path(toolName).request('AdvancedTableTool')
			//.state({ panelX : "50%", panelY : "0%", panelTitle : state.title, enableTitle : true})
			.push("columns").setColumns(state && state.columns && state.columns.length ? state.columns.map(function(column) {
				return column.metadata;
			}) : {}, state && state.columns && state.columns[0] ? state.columns[0].dataSourceName : ""); 
			
			// empty columns
			if(state.columns && !state.columns.length)
				weave.path(toolName).request("AdvancedTableTool").push("columns").state({});
			//capture session state
			queryService.queryObject.weaveSessionState = ws.getSessionStateObjects();
			//tiling
			ws.tileWindows();
		}
		else{//if the tool is disabled
			ws.weave.path(toolName).remove();
		}
		
		return toolName;
	};
	
	that.DataFilterTool = function(state, aToolName) {
		var toolName = aToolName || ws.generateUniqueName("DataFilterTool");
				
		if(state && state.enabled) {//if enabled
			if(ws.checkWeaveReady()) {//if weave is ready
				//add to the enabled tools collection
				if($.inArray(toolName, this.toolsEnabled) == -1)
					this.toolsEnabled.push(toolName);
				//create tool
				ws.weave.path(toolName).request('DataFilterTool');
				//.state({ panelX : "50%", panelY : "0%", panelTitle : state.title, panelHeight: "10%"});
				
				if(state.filterStyle == "Discrete values") {
					ws.weave.path(toolName, "editor", null).request("StringDataFilterEditor").state({
						layoutMode : state.layoutMode.value,
						showPlayButton : state.showPlayButton,
						showToggle : state.showToggle
					});
				} else if(state.filterStyle == "Continuous range") {
					ws.weave.path(toolName, "editor", null).request("NumberDataFilterEditor");
				}
				if(state.column) {
					ws.weave.path(toolName, "filter", null, "column").setColumn(state.column.metadata, state.column.dataSourceName);
				}
			} else {//if weave not ready
				ws.setWeaveWindow(window);
			}
		}
		else{//if the tool is disabled
			if(ws.checkWeaveReady()) {
				//remove from enabled tool collection
				if($.inArray(toolName, this.toolsEnabled) != -1) {
					var index = this.toolsEnabled.indexOf(toolName);
					this.toolsEnabled.splice(index, 1);
				}
				
				ws.weave.path(toolName).remove();
			}
		}
				
		return toolName;
	};
//		
	that.SummaryAnnotation = function (state, summaryName) {

	    var toolName = summaryName || ws.generateUniqueName("SummaryBox");

	    if (!ws.checkWeaveReady()) {

	        ws.setWeaveWindow(window);

	        return;

	    }

	    if (state && state.enabled) { //when auto-generation checked
	        if (state.generated) { //content generation enabled
	            //if data-source exists - contents come from WeaveAnalystDataSource
	            if (ws.weave.path("WeaveAnalystDataSource").getType()) {
	                var script;
	                var inputStrings = [];
	                var finalInputString;
	                var filterString;
	                script = "Script : " + queryService.queryObject.scriptSelected;
	               
	                //TODO replace all this concatenation code using function same code used in project service
	                var options = queryService.queryObject.scriptOptions;
	                for(input in options){
	                	inputStrings.push(options[input].metadata.title);
	                }

	                finalInputString = "Inputs :" + inputStrings.join(", ");
	                
	                var filterStrings = [];
	                var geoFilterOptions = queryService.queryObject.GeographyFilter;
	                if (geoFilterOptions.geometrySelected)
	                {
	                  var filterString = "";

	                  if (geoFilterOptions.countyColumn)
	                  {
	                    selection = geoFilterOptions.selectedCounties;
	                    column = geoFilterOptions.countyColumn;
	                  }
	                  else if (geoFilterOptions.stateColumn)
	                  {
	                    selection = geoFilterOptions.selectedStates;
	                    column = geoFilterOptions.stateColumn;
	                  }
	                  
	                  if (column && selection)
	                  {
	                    var selectionStrings = [];
	                    for (key in selection)
	                    {
	                      selectionStrings.push(selection[key].title || key);
	                    }
	                    filterStrings.push(column.metadata.title + ": " + selectionStrings.join(", "));
	                  }
	                }
	                if (queryService.queryObject.rangeFilters.filter)
	                {
	                  column = queryService.queryObject.rangeFilters.filter.column;
	                  selectionStrings = [queryService.queryObject.rangeFilters.filter.min, queryService.queryObject.rangeFilters.filter.max];
	                  filterStrings.push(column.metadata.title + ":" + selectionStrings.join("-"));
	                }
	                filterString = "Filters :" +  filterStrings.join(", ");
	                state.content = script + "\n" + finalInputString + "\n" + filterString;
	                ws.weave.path(toolName).request("SessionedTextBox").push("htmlText").state(state.content);

	            } else { //when no data-source: contents come from UI inputs
	                ws.weave.path(toolName).request("SessionedTextBox").push("htmlText").state(state.content);
	            }

	        } else {
	            ws.weave.path(toolName).request("SessionedTextBox").push("htmlText").state(state.content);
	        }
	    } else {
	        ws.weave.path(toolName).remove();
	    }



	};

	that.ColorColumn = function ()
	{
		// stub for compat;
	};
	
	that.setColorGroup = function(toolName, plotName, groupName, columnInfo){
		
		var plotterPath = ws.weave.path(toolName).pushPlotter(plotName);
		var plotType = plotterPath.getType();
		if (!plotName) plotName = "plot";
		var dynamicColumnPath;
		console.log("tooltype", plotType);
		
		if (plotType == "weave.visualization.plotters::CompoundBarChartPlotter")
		{
			dynamicColumnPath = plotterPath.push("colorColumn", "internalDynamicColumn");
		}
		else
		{
			dynamicColumnPath = plotterPath.push("fill", "color", "internalDynamicColumn");
		}
		
		console.log(dynamicColumnPath.getPath());
		dynamicColumnPath.vars({name: groupName}).getValue("ColumnUtils.unlinkNestedColumns(this); globalName = name");
		ws.weave.path(groupName).getValue("ColumnUtils.hack_findInternalDynamicColumn(this)").setColumn(columnInfo.metadata, columnInfo.dataSourceName);
	};

	that.getColorGroups = function(){
		return	ws.weave.path().getValue('getNames(ColorColumn)');
	};
	
	that.cleanupColorGroups = function()
	{
		return;
	};

	that.setKeyColumn = function(dataSourceName, keyColumnName, keyType){

		if (!ws.checkWeaveReady())
		{
			ws.setWeaveWindow(window);
			return;
		}

		if(dataSourceName)
		{
			var type = ws.weave.path(dataSourceName).getType();
			if(type == "weave.data.DataSources::CSVDataSource") {
				if(keyColumnName) {
					ws.weave.path(dataSourceName, "keyColName").state(keyColumnName);
				}
				if(keyType) {
					ws.weave.path(dataSourceName, "keyType").state(keyType);
				}
			} else if (type == "weave.data.DataSources::WeaveAnalystDataSource") {
				if(keyColumnName) {
					ws.weave.path(dataSourceName, "outputKeyColumn").state(keyColumnName);
				}
				if(keyType) {
					ws.weave.path(dataSourceName, "outputKeyType").state(keyType);
				}
			}
			//capture session state
			queryService.queryObject.weaveSessionState = ws.getSessionStateObjects();
		}
	};
	
	//returns session state of Weave as objects
	that.getSessionStateObjects = function(){
		return ws.weave.path().getState();
	};
	
	//returns session state of Weave as base64Encoded string
	that.getBase64SessionState = function()
	{
		return ws.weave.path().getValue("\
		        var e = new 'mx.utils.Base64Encoder'();\
		        e.encodeBytes( Class('weave.Weave').createWeaveFileContent(true) );\
		        return e.drain();\
		    ");
	};
	
	//returns session state by decoding a base64Encoded string representation of the Weave session state 
	that.setBase64SessionState = function(base64encodedstring)
	{
		ws.weave.path()
		.vars({encoded: base64encodedstring})
		.getValue("\
	        var d = new 'mx.utils.Base64Decoder'();\
			var decodedStuff = d.decode(encoded);\
			var decodeBytes =  d.toByteArray();\
	      Class('weave.Weave').loadWeaveFileContent(decodeBytes);\
	    ");
	};
	
	that.clearSessionState = function(){
		ws.weave.path().state(['WeaveDataSource']);
	};
	
	//this function creates the CSV data format needed to create the CSVDataSource in Weave
	/*[
	["k","x","y","z"]
	["k1",1,2,3]
	["k2",3,4,6]
	["k3",2,4,56]
	] */
	/**
	 * @param resultData the actual data values
	 * @param columnNames the names of the result columns returned
	 */
	that.createCSVDataFormat = function(resultData, columnNames){
		var columns = resultData;


		var final2DArray = [];

	//getting the rowCounter variable 
		var rowCounter = 0;
		/*picking up first one to determine its length, 
		all objects are different kinds of arrays that have the same length
		hence it is necessary to check the type of the array*/
		var currentRow = columns[0];
		if(currentRow.length > 0)
			rowCounter = currentRow.length;
		//handling single row entry, that is the column has only one record
		else{
			rowCounter = 1;
		}

		var columnHeadingsCount = 1;

		rowCounter = rowCounter + columnHeadingsCount;//we add an additional row for column Headings

		final2DArray.unshift(columnNames);//first entry is column names

			for( var j = 1; j < rowCounter; j++)
			{
				var tempList = [];//one added for every column in 'columns'
				for(var f =0; f < columns.length; f++){
					//pick up one column
					var currentCol = columns[f];
					if(currentCol.length > 0)//if it is an array
					//the second index in the new list should coincide with the first index of the columns from which values are being picked
						tempList[f]= currentCol[j-1];
					
					//handling single record
					else 
					{
						tempList[f] = currentCol;
					}

				}
				final2DArray[j] = tempList;//after the first entry (column Names)
			}

			return final2DArray;
	};

	};//end of service definition
}());//end of IIFE





(function(){
	angular.module('weaveAnalyst.WeaveModule', []);
	angular.module('weaveAnalyst.WeaveModule').service('WeaveService', weaveService);

    weaveService.$inject = ['usSpinnerService','$timeout', 'queryService', '$window'];
    function weaveService (usSpinnerService, $timeout, queryService, $window){
        var that = this;

        that.weave;
        that.weave_Tree;
        that.node_options;
        that.blah = "bujumbarra";
        
        that.launch_Weave = function(){
			
			//check if it is open
			if(that.weaveWindow)
				return;
			else{
				that.weaveWindow = $window.open("src/visualization/weave/weaveApp.html","abc","toolbar=no, fullscreen = no, scrollbars=no, addressbar=no, resizable=yes");
				//that.weaveWindow.wa_data = that.blah;
				that.weaveWindow.addEventListener("load", that.request_WeaveTree);
				//that.weaveWindow.addEventListener("load", that.create_weaveWrapper);//getting the instance
			}
		};

        /*object of script input options
        * keys are the script input names
        * values are the trail (array of crumbs)*/

        that.display_Options = function(input_node, getChildren){
            var weaveTreeIsBusy = that.weave.evaluateExpression(null, '() => WeaveAPI.SessionManager.linkableObjectIsBusy(WEAVE_TREE_NODE_LOOKUP[0])');


            if(getChildren){//when request is for children
                if(input_node.children && input_node.children.length){//use list if already there
                    that.node_options = input_node.children;//set the provider
                    //console.log("using cached list");
                }

                else{//make fresh request
                    that.node_options = [];//clear
                    usSpinnerService.spin('dataLoadSpinner');// start the spinner
                    fetching_Children(input_node.w_node, getChildren);//use node
                    //console.log("fetching new list");
                }
            }

            else{//when request is for siblings
                if(input_node.siblings && input_node.siblings.length){//use if list is already there
                    that.node_options = input_node.siblings;//set the provider
                    //console.log("using cached list");
                }

                else{//make fresh request
                    that.node_options = [];//clear
                    usSpinnerService.spin('dataLoadSpinner');// start the spinner
                    fetching_Children(input_node.w_node.parent, getChildren);//use its parent
                    //console.log("fetching new list");
                }
            }



            function fetching_Children(i_node, getChildren) {
               var chi = i_node.getChildren();
                if (weaveTreeIsBusy())
                    setTimeout(function () {
                        fetching_Children(i_node, getChildren);
                    }, 300);
                else {
                    var tempProvider = [];

                    for (var u = 0; u < chi.length; u++) {
                        var node_obj = {};
                        chi[u].getLabel();//TODO get this confirmed w/o this line column labels appear ...

                        if (weaveTreeIsBusy())
                            setTimeout(function () {
                                fetching_Children(i_node, getChildren);
                            }, 300);
                        //formats the children for displaying in the drop down selector
                        node_obj.label = chi[u].getLabel();//need this for filter of options to work
                        node_obj.w_node = chi[u];

                        tempProvider[u] = node_obj;
                    }
                    $timeout(function () {
                        that.node_options = tempProvider;
                        if(getChildren)
                            input_node.children = that.node_options;//set the provider
                        else
                            input_node.siblings = that.node_options;

                        usSpinnerService.stop('dataLoadSpinner');//stops the spinner
                    }, 300);

                }
            }//end of fetching children
        };

        /** requests the WeaveNodeTree hierarchy comprised of IWeaveTreeNode objects**/
        that.request_WeaveTree = function (){
            if(that.check_WeaveReady())//only if Weave is ready
            {
                if(!that.weave_Tree){
                    that.weave_Tree = new that.weave.WeaveTreeNode();
                    console.log("creating new Weave Tree");
                    return that.weave_Tree;
                }
                else
                    return that.weave_Tree;
            }
            else{
                $timeout(that.request_WeaveTree, 100);
            }
        };

        /** checks if the Weave software has loaded**/
        that.check_WeaveReady = function(){

            if(!that.weave)
                that.weave = that.weaveWindow.document.getElementById('weave');
            return that.weave && that.weave.WeavePath && that.weave._jsonCall;
        };

    }
})();
/**
 *this object serves as a wrapper for the API calls made when Weave is being used as a visualization engine 
 *@author spurushe
 */

if(!this.weaveApp)//the this refers to the weaveApp window object here
	this.weaveApp = {};

(function(){
	//static properties
	WeaveWrapper.instance;
	WeaveWrapper.weave;
	WeaveWrapper.weave_Tree;
	
	//constructor
	function WeaveWrapper (){
		//TODO move this into a manager class
		WeaveWrapper.instance = this;
		
	}
	
	//static function
	/** requests the WeaveNodeTree hierarchy comprised of IWeaveTreeNode objects**/
	WeaveWrapper.request_WeaveTree = function (){
		if(!WeaveWrapper.weave_Tree){
			WeaveWrapper.weave_Tree = new WeaveWrapper.weave.WeaveTreeNode();
			return WeaveWrapper.weave_Tree;
		}
		else
			return WeaveWrapper.weave_Tree;
	};
	
	//static function
	WeaveWrapper.check_WeaveReady = function(){
		
		if(!WeaveWrapper.weave)
			WeaveWrapper.weave = document.getElementById('weave');
		return WeaveWrapper.weave && WeaveWrapper.weave.WeavePath && WeaveWrapper.weave._jsonCall;
	};
	
	//get list of children for a particular tree node
	WeaveWrapper.get_tree_Children = function(node){
		var children = [];
		
		for(var i = 0; i < node.length; i++){
			children[i] = {name : node[i].getLabel() , source : node[i] };
		}
		return children;
	};
	
	var p = WeaveWrapper.prototype;
	//attaching it to the global wa object
	window.weaveApp.WeaveWrapper = WeaveWrapper;
	
	//////////////
	////VIZs
	//////////////
	p.request_BarChart = function(tool_config){
		if(WeaveWrapper.check_WeaveReady()){
			var toolName = this.generate_UniqueName("BarChartTool");
			WeaveWrapper.weave.path(toolName)
			.request('CompoundBarChartTool')
			.tool_config({  showAllLabels : tool_config.showAllLabels })
			.push('children', 'visualization', 'plotManager', 'plotters', 'plot')
			.push('sortColumn').setColumn(tool_config && tool_config.sort ? tool_config.sort.metadata : "", tool_config && tool_config.sort ? tool_config.sort.dataSourceName : "")
			.pop()
			.push('labelColumn').setColumn(tool_config && tool_config.label ? tool_config.label.metadata : "", tool_config && tool_config.label ? tool_config.label.dataSourceName : "")
			.pop()
			.push("heightColumns").setColumns(tool_config && tool_config.heights && tool_config.heights.length ? tool_config.heights.map(function(column) {
				return column.metadata;
			}) : {}, tool_config && tool_config.heights && tool_config.heights[0] ? tool_config.heights[0].dataSourceName : "")
			.pop()
			.push("positiveErrorColumns").setColumns(tool_config && tool_config.posErr ? tool_config.posErr.map(function(column) {
				return column.metadata;
			}) : {}, tool_config && tool_config.posErr && tool_config.posErr[0] ? tool_config.posErr[0].dataSourceName : "")
			.pop()
			.push("negativeErrorColumns").setColumns(tool_config && tool_config.negErr && tool_config.negErr.map(function(column) {
				return column.metadata;
			}), tool_config && tool_config.negErr && tool_config.negErr[0] ? tool_config.negErr[0].dataSourceName : "");
		}
		else{
			console.log("Weave and its api are not ready");
			return;
		}
		
	};
	
	
	p.request_ScatterPlot = function(tool_config){
		var toolName;
		if(WeaveWrapper.check_WeaveReady()){
			
			if(tool_config.toolName)
				toolName = tool_config.toolName;
			else
				toolName = this.generate_UniqueName("ScatterPlotTool");
			
			 WeaveWrapper.weave.path(toolName).request('ScatterPlotTool')
			.push('children', 'visualization','plotManager', 'plotters', 'plot')
			.push('dataX').setColumn(tool_config.X.metadata, tool_config.X.dataSourceName)
			.pop()
			.push('dataY').setColumn(tool_config.Y.metadata, tool_config.Y.dataSourceName);
				
		}
		else{//if weave is not ready
			console.log("Weave and its api are not ready");
			return;
		}
		return toolName;
	};
	
	
	p.request_AdvancedDataTable = function(tool_config){
		var toolName;
		if (WeaveWrapper.check_WeaveReady())
		{
			if(tool_config.toolName)
				toolName = tool_config.toolName;
			else
				toolName = this.generate_UniqueName("DataTableTool");
			
			WeaveWrapper.weave.path(toolName).request('AdvancedTableTool')
			.push("columns").setColumns(tool_config && tool_config.columns && tool_config.columns.length ? tool_config.columns.map(function(column) {
				return column.metadata;
			}) : {}, tool_config && tool_config.columns && tool_config.columns[0] ? tool_config.columns[0].dataSourceName : ""); 
			
			// empty columns
			if(tool_config.columns && !tool_config.columns.length)
				weave.path(toolName).request("AdvancedTableTool").push("columns").tool_config({});
		}
		else{//if weave is not ready
			console.log("Weave and its api are not ready");
			return;
		}
		return toolName;
	};
	
	
	p.request_Map = function(){
		
	};
	
	
	////////////////
	//TOOLS
	///////////////
	p.request_AttributeMenu = function(){
		var toolName;
		if(WeaveWrapper.check_WeaveReady()){
			toolName = aToolName || ws.generateUniqueName("AttributeMenuTool");
			ws.weave.path(toolName).request('AttributeMenuTool').call(setQueryColumns, {choices: tool_config.columns});
				
				if(tool_config.vizAttribute && tool_config.selectedVizTool)
					ws.weave.path(toolName).request('AttributeMenuTool')
					.tool_config({targetAttribute : tool_config.vizAttribute.title , targetToolPath : [tool_config.selectedVizTool]});
			}
		else{
			console.log('Weave and its api are not ready yet');
		}
	};
	
	
	p.request_DataFilter = function(){
		
		if(WeaveWrapper.check_WeaveReady()){
			
			WeaveWrapper.weave.path(toolName).request('DataFilterTool');
			
			if(tool_config.filterStyle == "Discrete values") {
				WeaveWrapper.weave.path(toolName, "editor", null).request("StringDataFilterEditor").tool_config({
					layoutMode : tool_config.layoutMode.value,
					showPlayButton : tool_config.showPlayButton,
					showToggle : tool_config.showToggle
				});
			} else if(tool_config.filterStyle == "Continuous range") {
				WeaveWrapper.weave.path(toolName, "editor", null).request("NumberDataFilterEditor");
			}
			if(tool_config.column) {
				WeaveWrapper.weave.path(toolName, "filter", null, "column").setColumn(tool_config.column.metadata, tool_config.column.dataSourceName);
			}
		}
		else{
			console.log("Weave and its api are not ready");
		}
	};
	
	
	p.request_SummaryAnnotation = function(){
		
	};
	
	///COLOR///////
	
	p.set_ColorGroup = function(toolName, plotName, groupName, column){
		var plotterPath = WeaveWrapper.weave.path(toolName).pushPlotter(plotName);
		var plotType = plotterPath.getType();
		if (!plotName) plotName = "plot";
		var dynamicColumnPath;
		
		if (plotType == "weave.visualization.plotters::CompoundBarChartPlotter")
		{
			dynamicColumnPath = plotterPath.push("colorColumn", "internalDynamicColumn");
		}
		else
		{
			dynamicColumnPath = plotterPath.push("fill", "color", "internalDynamicColumn");
		}
		
		dynamicColumnPath.vars({name: groupName}).getValue("ColumnUtils.unlinkNestedColumns(this); globalName = name");
		WeaveWrapper.weave.path(groupName).getValue("ColumnUtils.hack_findInternalDynamicColumn(this)").setColumn(column.metadata, column.dataSourceName);
	};
	
	p.get_ColorGroups = function(){
		return	WeaveWrapper.weave.path().getValue('getNames(ColorColumn)');
	};
	
	/////////////
	//UTILITY
	////////////
	
	p.get_base64_SessionState = function(){
		
		return WeaveWrapper.weave.path().getValue("\
		        var e = new 'mx.utils.Base64Encoder'();\
		        e.encodeBytes( Class('weave.Weave').createWeaveFileContent(true) );\
		        return e.drain();\
		    ");
	};
	
	p.set_base64_SessionState = function(){
		
		WeaveWrapper.weave.path()
		.vars({encoded: base64encodedstring})
		.getValue("\
	        var d = new 'mx.utils.Base64Decoder'();\
			var decodedStuff = d.decode(encoded);\
			var decodeBytes =  d.toByteArray();\
	      Class('weave.Weave').loadWeaveFileContent(decodeBytes);\
	    ");
	};
	
	p.clear_SessionState = function(){
		WeaveWrapper.weave.path().state(['WeaveDataSource']);
	};
	
	
	
	p.generate_UniqueName = function(className, path) {
		if(!WeaveWrapper.weave)
			return null;
		return WeaveWrapper.weave.path(path || []).getValue('generateUniqueName')(className);
	};
	
	p.get_PathToFilters = function() {
		if(!this.checkWeaveReady())
			return;
		return WeaveWrapper.weave.path("scriptKeyFilter").request("KeyFilter").push("filters");//references the Linkableashmap 'filters' in a keyFilter
	};
	
	p.tile_Windows = function() {
		if(!this.checkWeaveReady())
			return;
		WeaveWrapper.weave.path()
		.libs("weave.ui.DraggablePanel")
		.exec("DraggablePanel.tileWindows()");
	};
	
	p.fetch_NodePath = function(){
		
	};
	
	p.get_listOfTools = function(){
		
	};
	
	p.remove_Object = function(object_name){
		WeaveWrapper.weave.path(object_name).remove();
	};

})();
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
/**
 * controls the attribute menu visualization tool  widget
 */
(function(){
	angular.module('weaveApp').controller("AttributeMenuController",AttributeMenuController );
	AttributeMenuController.$inject = ['$scope', 'WeaveService', '$timeout'];
	
	function AttributeMenuController ($scope, WeaveService, $timeout){

		var attCtrl = this;
		attCtrl.WeaveService = WeaveService;
		attCtrl.setAttributes = setAttributes;
		attCtrl.tool = {
			title : "",
			enabled : false,
			selectedVizTool : null, 
			vizAttribute :{}, 
			columns: []
		};

		$scope.$watch(function(){
			return attCtrl.tool.selectedVizTool;
		}, function(){
			//console.log("tools selected", $scope.tool.selectedVizTool);
			if(attCtrl.tool.selectedVizTool){
				attCtrl.vizAttributeColl = [];
				attCtrl.vizAttributeColl = attCtrl.WeaveService.getSelectableAttributes(attCtrl.tool.title, attCtrl.tool.selectedVizTool);
			}
		});
		
		$scope.$watch(function(){
			return attCtrl.tool;
		},function() {
			if(attCtrl.toolId) // this gets triggered twice, the second time toolId with a undefined value.
				attCtrl.WeaveService.AttributeMenuTool(attCtrl.tool, attCtrl.toolId);
		}, true);
		
		function setAttributes (attr){
			if(attr)
				attCtrl.tool.chosenAttribute = attr;
			//check for tha attrbite selected
			if(attCtrl.tool.vizAttribute && attCtrl.tool.selectedVizTool && attCtrl.tool.chosenAttribute)
				//set the attribute in weave
				WeaveService.setVizAttribute(attCtrl.tool.title,
											 attCtrl.tool.selectedVizTool,
											 attCtrl.tool.vizAttribute,
											 attCtrl.tool.chosenAttribute);
		};
	}
})();
angular.module('weaveApp').controller("ColorCtrl", function(){

});
angular.module('weaveApp').controller("keyColumnCtrl", function(){


});
/**
 * directive that creates the AdvancedTable tool widget
 * controls the Advanced Table in Weave
 * @spurushe
 */

(function(){
	angular.module('weaveApp').directive('dataTable', dataTable );
	
	function dataTable(){
		return {
			restrict : 'E',
			templateUrl : 'tools/dataTable/data_table.tpl.html',
			controller : dataTableController,
			controllerAs : 'dtCtrl',
			bindToController : true,
			link : function(){
				
			}
		};
	}//end of directive definition
	
	function dataTableController (){
		var dtCtrl = this;
		var weave_wrapper;
		
		dtCtrl.request_dataTable = request_dataTable;
		dtCtrl.initWeaveWrapper = initWeaveWerapper;
		dtCtrl.items = ['a','d'];
		
		dtCtrl.config = {
			checked: false,
			toolName: null,
			columns : null
		};
		
		function initWeaveWrapper(){
			//TODO put this retrieval in manager class later
			if(!wa.wWrapper)
				weave_wrapper = new wa.WeaveWrapper();
			else
				weave_wrapper = WeaveWrapper.instance;
		};
		
		function request_dataTable (){
			if(wa.WeaveWrapper.check_WeaveReady()){//TODO figure out where to call checkWeaveReady
				
				dtCtrl.initWeaveWrapper();
				
				if(dtCtrl.config.checked)//if checked
					dtCtrl.config.toolName = weave_wrapper.request_AdvancedDataTable(dtCtrl.config);//request it with config
				else{//if unchecked
					if(dtCtrl.config.toolName)//if the tool exists
						weave_wrapper.remove_Object(dtCtrl.config.toolName);//remove it
					else
						return;
				}
			}
			else
				setTimeout(request_dataTable, 100);
		};
	};
})();

/**
 * controls the map visualization tool widget
 */

angular.module('weaveApp').controller("MapCtrl", function(){

});
/**
 * directive that creates the scatter plot visualization tool widget
 * controls the scatter plot in Weave
 * @spurushe
 */

(function(){
	
	angular.module('weaveApp').directive('scatterPlot', scatterPlot);
	
	function scatterPlot (){
		return {
			restrict: 'E',
			scope:{},
			templateUrl:'tools/scatterPlot/scatter_plot.tpl.html', 
			controller : scatter_plotController,
			controllerAs : 'spCtrl',
			bindToController: true,
			link: function(){
				
			}
		};//directive definition object
	}
	
	function scatter_plotController (){
		var spCtrl = this;
		var weave_wrapper;
		
		spCtrl.request_scatterPlot = request_scatterPlot;
		spCtrl.initWeaveWrapper = initWeaveWrapper;
		spCtrl.items = ['a','d'];
		
		spCtrl.config = {
			checked : false,
			toolName: null,
			X : null,
			Y : null
		};
		
		function initWeaveWrapper(){
			//TODO put this retrieval in manager class later
			if(!wa.wWrapper)
				weave_wrapper = new wa.WeaveWrapper();
			else
				weave_wrapper = WeaveWrapper.instance;
		};
		
		function request_scatterPlot (){
			if(wa.WeaveWrapper.check_WeaveReady()){//TODO figure out where to call checkWeaveReady
				
				spCtrl.initWeaveWrapper();
				
				if(spCtrl.config.checked)//if checked
					spCtrl.config.toolName = weave_wrapper.request_ScatterPlot(spCtrl.config);//request it with config
				else{//if unchecked
					if(spCtrl.config.toolName)//if the tool exists
						weave_wrapper.remove_Object(spCtrl.config.toolName);//remove it
					else
						return;
				}
			}
			else
				setTimeout(request_scatterPlot, 100);
		};
	};
	
})();