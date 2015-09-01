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
	analysisController.$inject = ['$scope','$filter', '$window', 'analysisService', 'WeaveService'];
	
	function analysisController ($scope,$filter, $window, WeaveService ){
		$scope.isCollapsed = false;
		var anaCtrl = this;
		
		anaCtrl.WeaveService = WeaveService;
		
		
	};
})();
