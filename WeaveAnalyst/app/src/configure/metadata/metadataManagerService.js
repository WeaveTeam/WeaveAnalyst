angular.module('weaveAnalyst.configure.metadata').service("metadataService", ['$q', '$rootScope','queryService', 'authenticationService',
                                           function($q, rootScope, queryService, authenticationService) {
	this.gridData = [];
	var that = this;
	
	/**
	  * this function is called whenever the user adds or deletes a column metadata property
	  * function converts an object into a json string to send to server
	  */
	 this.updateMetadata = function(metadata) {
		 var jsonaws_metadata = angular.toJson(convertToMetadataFormat(metadata));
		 if(angular.isDefined($scope.selectedDataTableId))
			 {
						 queryService.updateEntity($scope.authenticationService.user, 
				 				   $scope.authenticationService.password, 
				 				   $scope.selectedDataTableId, 
				 				   { 
										publicMetadata : { aws_metadata : jsonaws_metadata }
				 				   }).then(function() {
				 					   	//$scope.maxTasks = 100;
				 					   //$scope.progressValue = 100;
				 				   });
			 }
		 
		 alert("Metadata Updated for id : " + $scope.selectedDataTableId);
	 };
 
	 this.setGridData = function(data) {
		  this.gridData = data;
		  rootScope.$safeApply();
	 };
	 
	 
	/**
	 * function that converts a aws-metadata json object into an array of objects that look like this { property:
	 * 																	 								value : }
	 * for using in the grid
	 * */
	this.convertToTableFormat = function(aws_metadata) {
		var data = [];
		for (var key in aws_metadata) {
			data.push({property : key, value : angular.toJson(aws_metadata[key]) });
		}
		return data;
	};
		
	/**
	 * retrieves the metadata for a single column
	 * */
	this.getColumnMetadata = function (columnObject) {
		if(columnObject && columnObject.id) {
			queryService.getEntitiesById([columnObject.id], true).then(function(entity) {
					entity = entity[0];
					if(entity.publicMetadata.hasOwnProperty('aws_metadata')) {
						var data = [];
						var aws_metadata = angular.fromJson(entity.publicMetadata.aws_metadata);//converts the json string into an object
						data = that.convertToTableFormat(aws_metadata);//to use in the grid
						that.setGridData(data);
					}
			});
		} else {
				this.setGridData([]);
		}
	};

	this.cmp = function(a, b) {
		key1 = a.data.key;
		key2 = b.data.key;
		return key1 > key2 ? 1 : key1 < key2 ? -1 : 0;
	};
	 
    
}]);
