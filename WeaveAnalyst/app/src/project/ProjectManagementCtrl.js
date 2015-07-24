/** this controller controls the project tab 
 * @author spurushe
 * 
 **/
(function(){
	angular.module('weaveAnalyst.project', []).controller("ProjectManagementController", ProjectManagementController);
	
	ProjectManagementController.$inject = ['$scope', '$modal', '$filter','$location','queryService', 'projectService', 'WeaveService', 'usSpinnerService'];
	
	function ProjectManagementController ($scope,$modal, $filter,$location,queryService, projectService, WeaveService, usSpinnerService){
		var prjtCtrl = this;
		
		prjtCtrl.projectService = projectService;
		prjtCtrl.WeaveService = WeaveService;
		prjtCtrl.queryService = queryService;
		
		prjtCtrl.checkQOTableExits = checkQOTableExits;
		prjtCtrl.construct_view = construct_view;
		prjtCtrl.deleteProject = deleteProject;
		prjtCtrl.openAdditionPanel = openAdditionPanel;
		
		prjtCtrl.insertQueryObjectStatus = 0;//count changes when single queryObject or multiple are added to the database
		prjtCtrl.nameOfQueryObjectToDelete = "";
		prjtCtrl.view_modes = ['List', 'Compact', 'Detail'];
		
		//options needed for creating the modal instance window
		 //communicating with the modal
		prjtCtrl.pjtModalOptions = {//TODO find out how to push error log to bottom of page
				 backdrop: true,
		         backdropClick: false,
		         dialogFade: true,
		         keyboard: true,
		         templateUrl: 'src/project/projectAdditionModal.html',
		         controller: 'pjtAddtionInstanceController',
		         controllerAs : 'pam',
		         resolve :{
		        	 projectNameEntered : function(){
		        		 return $scope.projectNameEntered;
		        		 },
		        	 userNameEntered : function(){
		        		 return $scope.userNameEntered;
		        		 },
		        	 projectDescriptionEntered : function(){
		        		 return $scope.projectDescriptionEntered;
		        		 }
		        	 
		         }
			};
		
		//check for table
		prjtCtrl.checkQOTableExits();
		//create table with dummy project and queries
		
		
		//when a project is selected or changed
//		$scope.$watch(function(){
//			return prjtCtrl.projectService.cache.project.selected;
//		},function(){
//			if(prjtCtrl.projectService.cache.project.selected){
//				console.log("project Selected", prjtCtrl.projectService.cache.project.selected);
//				prjtCtrl.projectService.getListOfQueryObjects(prjtCtrl.projectService.cache.project.selected);
//			}
//		});
		
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
	     
	     //this function alters the three kinds of views for viewing projects and query objects
	     function construct_view (){
	    	 var mode = prjtCtrl.projectService.viewMode;
	    	 
	    	 if(mode == 'List')
	    		 prjtCtrl.projectService.view_Desc = "This mode displays the projects and its query obejcts as a list. Select Compact to view a project in detail. Select Detail to view a project's query objects in detail.";
	    	 else if(mode == 'Compact')
	    		 prjtCtrl.projectService.view_Desc ="This mode displays a single project in detail. Select List to view a list of projects. Select Detail to view a project's query objects in detail.";
	    	 else 
	    		 prjtCtrl.projectService.view_Desc = "This mode displays the query objects of a project in detail. Select List to view a list of projects. Select Compact to view a project in detail.";
	    		 
	     };
		
	     //checks if a table is created for storing query objects
	     function checkQOTableExits (){
	    	var	pS = prjtCtrl.projectService;
	    	
	    	pS.checkQOTableExits().then(function(projExists){
		    	 console.log("projExists",projExists );
		    	 if(projExists){
		    		 pS.getListOfProjects().then(function(projectList){
		    			 if(projectList.length == 0)
		    				 alert("There are no stored query objects");
		    		 });//retrives project list
		    	 }
		    	 else{
			    		var conf = confirm("There is no dedicated datatable to store query objects" +"\n"
			    		 		+ "Create a table to store query objects?");
			    		 if(conf == true){
			    			 pS.createQOTable().then(function(status){
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
		
		
		//button click event that creates the modal
		function openAdditionPanel(){
			var saveNewProject = $modal.open(prjtCtrl.pjtModalOptions);
			
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
	additionController.$inject= ['$scope', '$modalInstance','projectService', 'projectNameEntered','projectDescriptionEntered', 'userNameEntered'];
	
	function additionController ($scope, $modalInstance,projectService, projectNameEntered,projectDescriptionEntered, userNameEntered){
		var pam = this;
		
		pam.projectService = projectService;
		pam.uploadStatus = "";
		pam.queryObjectJsons = [];
		pam.queryObjectTitles = [];
		pam.saveQueryObjects = saveQueryObjects;
		pam.remove = remove;
		
		//object representation of a SINGLE file uploaded, changed everytime a file is uploaded
		pam.uploaded = {
				QueryObject : {
					filename : "",
					content : ""			
				}
		};
		
		pam.uploadedObjects = {
				
			queryObjectJsons : [],//contains the content of all query objects uploaded (json strings)
			queryObjectTitles : []//contains the titles of all query Objects uploaded
		};
		
		
		//whenever a file is uploaded
		$scope.$watch(function(){
			return pam.uploaded.QueryObject.filename;
		}, function(){
			
			if(pam.uploaded.QueryObject.filename)
				{
					//check if the file had been uploaded before
					if($.inArray(pam.uploaded.QueryObject.filename, pam.uploadedObjects.queryObjectTitles) == -1)
						{
							//managing the title of queryObject (json )uploaded
							var title = pam.uploaded.QueryObject.filename;
							pam.uploadedObjects.queryObjectTitles.push(title);
							
							//managing the content of queryObject (json )uploaded
							var content = pam.uploaded.QueryObject.content;
							pam.uploadedObjects.queryObjectJsons.push(content);
							
							
							var countUploaded = pam.uploadedObjects.queryObjectTitles.length;
							pam.uploadStatus = countUploaded + " file(s) uploaded";
						}
				}
			
		});
		
		//called when save button is hit.;
		function saveQueryObjects (projectNameEntered,projectDescriptionEntered, userNameEntered) {
			if(!projectNameEntered)
				projectNameEntered = "Example Project";
			if(!projectDescriptionEntered)
				projectDescriptionEntered = "These query object(s) belong to " + projectNameEntered;
			if(!userNameEntered)
				userNameEntered = "Awesome User";
			
			var additionParams = {
					projectNameEntered : projectNameEntered,
					userNameEntered :userNameEntered,
					projectDescriptionEntered : projectDescriptionEntered,
					uploadedObjects : $scope.uploadedObjects
			};
			
			if(additionParams.uploadedObjects.queryObjectJsons.length > 0){//only if something is uploaded, save it
				
				pam.projectService.createNewProject(additionParams.userNameEntered,
						additionParams.projectNameEntered,
						additionParams.projectDescriptionEntered,
						additionParams.uploadedObjects.queryObjectTitles,
						additionParams.uploadedObjects.queryObjectJsons,
						null);
				
				$modalInstance.close(additionParams);
			}
			else{
				alert("Please upload a query object to create a project");
			}
			
		 };
		 
	 	function remove (file){
		 //removes the file from the uploaded collection
		 var index = $.inArray(file, pam.uploadedObjects.queryObjectTitles);
		 console.log("index", index);
		 pam.uploadedObjects.queryObjectTitles.splice(index, 1);
		 pam.uploadedObjects.queryObjectJsons.splice(index, 1);
		 
		 var countUploaded = pam.uploadedObjects.queryObjectTitles.length;
		 pam.uploadStatus = countUploaded + " file(s) uploaded";
		 if(countUploaded == 0){
			 pam.uploadStatus = "";
			 pam.uploaded.QueryObject.filename = null;
			 pam.uploaded.QueryObject.content = null;
			 
		 }
	 };
	};
})();//end of IIFE




