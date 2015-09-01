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
		$scope.isCollapsed = false;
		var anaCtrl = this;
		
		anaCtrl.queryService = queryService;
		anaCtrl.analysisService = analysisService;
		anaCtrl.WeaveService = WeaveService;
		anaCtrl.QueryHandlerService = QueryHandlerService;
		anaCtrl.statisticsService = statisticsService;
		
		anaCtrl.varValues = [];
	
		
	};
})();
