/**
 * controllers and service for the 'Data Stats' tab and its nested tabs
 * @author spurushe
 */
//TODO create submodules corresponding to every nested tab
//Module definition
(function(){
	angular.module('weaveAnalyst.dataStatistics', []);

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
//			var dt = ds_Ctrl.statisticsService.cache.dataTable; 
//				
//			if(dt)//if a datatable has been selected
//				ds_Ctrl.statisticsService.get_Summary_Statistics(dt);
		};
		
		function get_Coefficients (algorithm){
			var dt = ds_Ctrl.statisticsService.cache.dataTable;
			if(dt)
				ds_Ctrl.statisticsService.get_Coefficients(dt, algorithm);
		
		}; 
	};
})();