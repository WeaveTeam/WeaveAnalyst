/**
 * controllers and service for the 'Data Stats' tab and its nested tabs
 */
//TODO create submodules corresponding to every nested tab
//Module definition
(function(){
	angular.module('weaveAnalyst.dataStatistics', []);

	//*******************************Value recipes********************************************
	//Correlation coefficients
	//angular.module('weaveAnalyst.dataStatistics').value('pearsonCoeff', {label:"Pearson's Coefficent", scriptName : "getCorrelationMatrix.R"});
	//angular.module('weaveAnalyst.dataStatistics').value('spearmanCoeff', {label : "Spearman's Coefficient", scriptName:"getSpearmanCoefficient.R"});

	//value recipes to be used in result handling of non-query statistics
	//Summary statistics for each numerical data columns
	angular.module('weaveAnalyst.dataStatistics').value('summaryStatistics', 'SummaryStatistics');

	//correlation Matrices computed using different algorithms
	angular.module('weaveAnalyst.dataStatistics').value('correlationMatrix', 'CorrelationMatrix');


	//************************SERVICE***********************************************************
	angular.module('weaveAnalyst.dataStatistics').service('statisticsService', data_statisticsService);
	
	data_statisticsService.$inject = ['$q', 'queryService', 'QueryHandlerService'];
	function data_statisticsService($q, queryService, QueryHandlerService){
		var that = this;
		
		that.cache = {
			dataTable : null,
			summaryStats : {statsData:[], columnDefinitions:[]},
			sparklineData :{ breaks: [], counts: {}},
			columnTitles: null,//column titles of the columns in current table 
			input_metadata : null
		};
		
		/**
		 * common function that runs various statistical tests and scripts and processes results accordingly
		 * @param scriptName name of the script 
		 * @param statsObject the input data
		 * @param statistic to calculate 
		 */
		that.calculate_Statistics = function (scriptName, statsObject, statsToCalculate, forceUpdate){

			var statsInputs = QueryHandlerService.handle_ScriptInput_Options(statsObject);//will return a dataColumnmatrix bean
			if(statsInputs){
				//getting the data
				queryService.getDataFromServer(statsInputs, null).then(function(success){
					
					//executing the stats script
					if(success){
						queryService.runScript(scriptName).then(function(result){
							if(result){
								//handling different kinds of non -query results returned from R
								for(var x = 0; x < statsInputs.length; x++){
									
									switch (statToCalculate)
									{
										case summaryStatistics:
											that.handle_DataStats(result.resultData[0], that.cache.statsInputMetadata.inputs );
											that.handle_SparklineData(result.resultData[1]);
											break;
										case correlationMatrix:
											that.handleCorrelationData(result.resultData);
											break;
										
									}
										
									
								}//end of loop for statsinputs
							}
						});
					}
				});
			}
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
					
					//during the last iteration
					if(x == (resultData.length - 1)){
						this.cache.summaryStats.columnDefinitions = [];
						for(var z = 0; z < metadata.length; z++){
							//populates the column definitions of the grid
							this.cache.summaryStats.columnDefinitions.push({
								field: metadata[z].param,
								displayName : metadata[z].param,
								enableCellEdit:false
							});
						}
						
					}
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
		
		that.handleCorrelationData = function(){
			
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
	
	data_statisticsController.$inject = ['queryService', 'statisticsService', 'analysisService', 'summaryStatistics'];
	function data_statisticsController (queryService, statisticsService, analysisService, summaryStatistics){
		var ds_Ctrl = this;
		
		ds_Ctrl.queryService = queryService;
		ds_Ctrl.statisticsService = statisticsService;
		ds_Ctrl.analysisService = analysisService;
		
		ds_Ctrl.getStatistics = getStatistics;
		
		ds_Ctrl.columnDefinitions = [];//populates the stats grid
		ds_Ctrl.statsData = [];//the array that gets populated by the Column statistics
			
		
		
		if(queryService.cache.dataTableList.length == 0)//getting the list of datatables if they have not been retrieved yet//that is if the person visits this tab directly
			queryService.getDataTableList(true);
			
		
		function getStatistics (){
			var dt = ds_Ctrl.statisticsService.cache.dataTable; 
				
			if(dt.id){//if a datatable has been selected
				//retrieve metadata for the built in canned stats script
				ds_Ctrl.analysisService.getScriptMetadata("getStatistics.R", true).then(function(){
					ds_Ctrl.statisticsService.cache.input_metadata = ds_Ctrl.analysisService.cache.scriptMetadata;
					
					ds_Ctrl.queryService.getDataColumnsEntitiesFromId(dt.id, true).then(function(){
						var ncols = ds_Ctrl.queryService.cache.numericalColumns;
						
						ds_Ctrl.statisticsService.getColumnTitles(ncols);
						
						ds_Ctrl.statisticsService.calculate_Statistics('getStatistics.R', {'SummaryStatistics':ncols}, summaryStatistics, true );
					});
				});
			}//end of if 
		};
	};
})();