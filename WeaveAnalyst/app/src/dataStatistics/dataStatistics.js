/**
 * controllers and service for the 'Data Stats' tab and its nested tabs
 */
//TODO create submodules corresponding to every nested tab
//Module definition
var dataStatsModule = angular.module('weaveAnalyst.dataStatistics', []);

//*******************************Value recipes********************************************
//Correlation coefficients
dataStatsModule.value('pearsonCoeff', {label:"Pearson's Coefficent", scriptName : "getCorrelationMatrix.R"});
dataStatsModule.value('spearmanCoeff', {label : "Spearman's Coefficient", scriptName:"getSpearmanCoefficient.R"});

//value recipes to be used in result handling of non-query statistics
//Summary statistics for each numerical data columns
dataStatsModule.value('summaryStatistics', 'SummaryStatistics');

//correlation Matrices computed using different algorithms
dataStatsModule.value('correlationMatrix', 'CorrelationMatrix');


//************************SERVICE***********************************************************
dataStatsModule.service('statisticsService', [ function(){
	
}]);


//********************CONTROLLERS***************************************************************
dataStatsModule.controller('dataStatsCtrl', function(){

});
