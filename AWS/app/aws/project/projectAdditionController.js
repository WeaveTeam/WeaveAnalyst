angular.module('aws.project')
.controller("projectAdditionController", function($scope, queryService){
	
	var project = "";
	var user = "";
	$scope.uploadStatus = "No file uploaded";
	var queryObjectJsons = []; //array of uploaded queryObject jsons
	var fileCount = 0;
	
	$scope.$watch('projectName', function(){
		 project = $scope.projectName;
	});
	
	$scope.$watch('userName', function(){
		 user = $scope.userName;
	});
	
	$scope.$on('fileUploaded', function(e) {
        $scope.$safeApply(function() {
        	$scope.uploadStatus = "";
        	fileCount++;
        	var countString = fileCount.toString();
        	console.log("fileUploaded", e.targetScope.file);
        	$scope.uploadStatus = countString + " files uploaded";
//        	var jsonObject = JSON.parse(e.targetScope.file);
//        	var qOTitle= jsonObject.title;
//        	$scope.uploadStatus = $scope.uploadStatus.concat(qOTitle + " uploaded") + "\n";
        });
	});
	
	
	 $scope.saveNewProjectToDatabase = function(){
		
		 console.log("saving to database");
		 var queryObjectTitle = []; //array of titles extracted from the queryObjectJsons
		 var queryObjectContent = [];//array of stringifed json objects
		 
		 
		 for(var i in queryObjectJsons){
			 
			var currentTitle = queryObjectJsons[i].title;//get title
			queryObjectTitle.push(currentTitle);
			var singleQueryObject = JSON.stringify(quesryObjectJsons[i]); //stringify object
			queryObjectContent.push(singleQueryObject);
			 
			}
		 
		 
		// queryService.addQueryObjectToProject(user, project, queryObjectTitle, queryObjectContent);
		 
	 };
	
});