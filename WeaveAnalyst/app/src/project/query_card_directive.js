/**
 * this directive represents a single query object and its respective controls.
 * @spurushe
 */

(function(){
	angular.module('weaveAnalyst.project').directive('queryCard', queryCard);
	function queryCard(){
		return {
			restrict : 'E',
			scope :{},
			templateUrl : 'src/projects/query_card.tpl.html',
			controller : queryCardController,
			controllerAs : 'q_cardCtrl',
			bindToControler : true,
			link : function(){
				
			}
		};
	}//end of directive definition
	
	queryCardController.$inject = ['projectService'];
	function queryCardController(projectService){
		var q_cardCtrl = this;
		q_cardCtrl.projectService = projectService;
		
		q_cardCtrl.returnSessionState = returnSessionState;
		prjtCtrl.deleteSpecificQueryObject = deleteSpecificQueryObject;
		prjtCtrl.deleteQueryConfirmation = deleteQueryConfirmation;
		prjtCtrl.openInAnalysis = openInAnalysis;

		//deletes a single queryObject within the currently selected Project
		function deleteSpecificQueryObject(item){
			prjtCtrl.nameOfQueryObjectToDelete = item.queryObjectName; 
			prjtCtrl.deleteQueryConfirmation(prjtCtrl.projectService.cache.project.selected, prjtCtrl.nameOfQueryObjectToDelete);
		};
		
		function deleteQueryConfirmation (currentProject, currentQueryFileName){
			var deletePopup = confirm("Are you sure you want to delete " + currentQueryFileName + " from " + currentProject + "?");
			if(deletePopup == true){
				prjtCtrl.projectService.deleteQueryObject(currentProject, currentQueryFileName);
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