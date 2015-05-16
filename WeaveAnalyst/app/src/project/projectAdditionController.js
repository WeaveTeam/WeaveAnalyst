(function(){
	angular.module('weaveAnalyst.project').controller("projectAdditionController",projectAdditionController);
	
	projectAdditionController.$inject = ['$scope', '$modal', 'projectService'];
	function projectAdditionController ($scope,$modal, projectService){
		var prAddCtrl = this;
		
		prAddCtrl.openAdditionPanel = openAdditionPanel;
		
		
		
	};
	
})();
