(function(){
	angular.module('weaveAnalyst.project', []).controller("ProjectManagementController", ProjectManagementController);
	
	ProjectManagementController.$inject = ['$scope', '$filter','$location','queryService', 'projectService', 'WeaveService', 'usSpinnerService'];
	
	function ProjectManagementController ($scope, $filter,$location,queryService, projectService, WeaveService, usSpinnerService){
		var prjtCtrl = this;
		
		prjtCtrl.projectService = projectService;
		prjtCtrl.WeaveService = WeaveService;
		prjtCtrl.queryService = queryService;
		prjtCtrl.checkQOTableExits = checkQOTableExits;
		prjtCtrl.insertQueryObjectStatus = 0;//count changes when single queryObject or multiple are added to the database
		prjtCtrl.nameOfQueryObjectToDelete = "";
		prjtCtrl.deleteProject = deleteProject;
		prjtCtrl.deleteSpecificQueryObject = deleteSpecificQueryObject;
		prjtCtrl.deleteQueryConfirmation = deleteQueryConfirmation;
		prjtCtrl.openInAnalysis = openInAnalysis;
		
		//check for table
		prjtCtrl.checkQOTableExits();
		//create table with dummy project and queries
		
		
		//when a project is selected or changed
		$scope.$watch(function(){
			return prjtCtrl.projectService.cache.project.selected;
		},function(){
			if(prjtCtrl.projectService.cache.project.selected){
				console.log("project Selected", prjtCtrl.projectService.cache.project.selected);
				prjtCtrl.projectService.getListOfQueryObjects(prjtCtrl.projectService.cache.project.selected);
			}
		});
		
		//Watch for when record is inserted in db
	     $scope.$watch(function(){
	     	return prjtCtrl.queryService.queryObject.properties.insertQueryObjectStatus;
	      }, function(){ 
	    	  prjtCtrl.insertQueryObjectStatus = prjtCtrl.queryService.queryObject.properties.insertQueryObjectStatus;
	     	if(!(angular.isUndefined(prjtCtrl.insertQueryObjectStatus)))
			 {
			 	if(prjtCtrl.insertQueryObjectStatus != 0)
			 		{
	    		 		alert("Query Object has been added");
	    		 		prjtCtrl.queryService.cache.listofQueryObjectsInProject = [];
	    		 		prjtCtrl.queryService.getListOfQueryObjectsInProject(prjtCtrl.projectService.cache.project.selected);//makes a new call
			 		}
			 }
		 
	     	prjtCtrl.queryService.queryObject.properties.insertQueryObjectStatus = 0;//reset
	      });
		
	     //checks if a table is created for storing query objects
	     function checkQOTableExits (){
	    	prjtCtrl.projectService.checkQOTableExits().then(function(projExists){
		    	 console.log("projExists",projExists );
		    	 if(projExists){
		    		 prjtCtrl.projectService.getListOfProjects().then(function(projectList){
		    			 console.log("projectList", projectList);
		    			 if(projectList.length == 0)
		    				 alert("There are no stored query objects");
		    		 });//retrives project list
		    	 }
		    	 else{
			    		var conf = confirm("There is no dedicated datatable to store query objects" +"\n"
			    		 		+ "Create a table to store query objects?");
			    		 if(conf == true){
			    			 prjtCtrl.projectService.createQOTable().then(function(status){
			    				 if(status){
			    					 console.log("status", status);
			    				 }
			    					 alert("Table \"stored_query_objects\" has been successfully created");
			    			 });
			    		 }
			    		 else
			    			 alert("You will not be able to store query objects. Refresh the page if you change your mind");
		    	 }
	    	});
	     };
	     
		//deletes an entire Project along with all queryObjects within
		function deleteProject (){
			prjtCtrl.deleteProjectConfirmation(prjtCtrl.projectService.cache.project.selected);
		};
		
		//additional checks for confirming deletion
		function deleteProjectConfirmation (projectSelected){
			var deletePopup = confirm("Are you sure you want to delete project " + projectSelected + "?");
			if(deletePopup == true){
				prjtCtrl.projectService.deleteProject(projectSelected);
			}
		};
		
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
			prjtCtrl.projectService.returnSessionState(queryObject).then(function(weaveSessionState){
				var newWeave;
				if(!(angular.isUndefined(weaveSessionState))){
					
			   		 if (!newWeave || newWeave.closed) {
							newWeave = window
									.open("/weave.html?",
											"abc",
											"toolbar=no, fullscreen = no, scrollbars=yes, addressbar=no, resizable=yes");
						}
			   		 
			   		prjtCtrl.WeaveService.setWeaveWindow(newWeave);
				   		
				   		$scope.$watch(function(){
				   			return prjtCtrl.WeaveService.weave;
				   		},function(){
				   			if(prjtCtrl.WeaveService.checkWeaveReady()) 
				   				prjtCtrl.WeaveService.setBase64SessionState(weaveSessionState);
				   		});
			   		}
				else{
					console.log("Session state was not returned");
				}
			});
		};
		
	};
})();//end of IIFE




