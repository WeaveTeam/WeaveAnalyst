/**
 * controllers and service for the 'Data Stats' tab and its nested tabs
 */
//TODO create submodules corresponding to every nested tab
//Module definition
angular.module('weaveAnalyst.dataStatistics', []);

//*******************************Value recipes********************************************
//Correlation coefficients
angular.module('weaveAnalyst.dataStatistics').value('pearsonCoeff', {label:"Pearson's Coefficent", scriptName : "getCorrelationMatrix.R"});
angular.module('weaveAnalyst.dataStatistics').value('spearmanCoeff', {label : "Spearman's Coefficient", scriptName:"getSpearmanCoefficient.R"});

//value recipes to be used in result handling of non-query statistics
//Summary statistics for each numerical data columns
angular.module('weaveAnalyst.dataStatistics').value('summaryStatistics', 'SummaryStatistics');

//correlation Matrices computed using different algorithms
angular.module('weaveAnalyst.dataStatistics').value('correlationMatrix', 'CorrelationMatrix');


//************************SERVICE***********************************************************
angular.module('weaveAnalyst.dataStatistics').service('statisticsService', [ function(){
	
}]);


//********************CONTROLLERS***************************************************************
angular.module('weaveAnalyst.dataStatistics').controller('dataStatsCtrl', function(){

});
