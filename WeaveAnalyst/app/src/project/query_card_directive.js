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