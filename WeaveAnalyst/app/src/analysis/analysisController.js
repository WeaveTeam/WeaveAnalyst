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
		          backdrop: true,
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
	};
})();
