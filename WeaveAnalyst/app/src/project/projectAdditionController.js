(function(){
	angular.module('weaveAnalyst.project').controller("projectAdditionController",projectAdditionController);
	
	projectAdditionController.$inject = ['$scope', '$modal', 'projectService'];
	function projectAdditionController ($scope,$modal, projectService){
		var prAddCtrl = this;
		
		prAddCtrl.openAdditionPanel = openAdditionPanel;
		//options needed for creating the modal instance window
		 //communicating with the modal
		prAddCtrl.pjtModalOptions = pjtModalOptions = {//TODO find out how to push error log to bottom of page
				 backdrop: true,
		         backdropClick: false,
		         dialogFade: true,
		         keyboard: true,
		         templateUrl: 'src/project/projectAdditionPanel.html',
		         controller: 'pjtAddtionInstanceController',
		         resolve :{
		        	 projectNameEntered : function(){return $scope.projectNameEntered;},
		        	 userNameEntered : function(){return $scope.userNameEntered;},
		        	 projectDescriptionEntered : function(){return $scope.projectDescriptionEntered;}
		        	 
		         }
			};
		
		//button click event that creates the modal
		function openAdditionPanel(){
			var saveNewProject = $modal.open(prAddCtrl.pjtModalOptions);
			
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
	additionController.$inject= ['$modalInstance','projectService', 'projectNameEntered','projectDescriptionEntered', 'userNameEntered'];
	
	function additionController ($modalInstance,projectService, projectNameEntered,projectDescriptionEntered, userNameEntered){
		
	};
	
})();
