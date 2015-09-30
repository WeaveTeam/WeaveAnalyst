(function (){
	
	angular.module('weaveAnalyst.configure.metadata').service('metadataService', metadataService);
	
	metadataService.$inject = ['$q', '$rootScope','queryService', 'authenticationService'];
	
	function metadataService($q, rootScope, queryService, authenticationService){
		
		var that = this;
		that.gridData = [];
		
		/**
		  * this function is called whenever the user adds or deletes a column metadata property
		  * function converts an object into a json string to send to server
		  */
		 that.updateMetadata = function(metadata) {
			 var jsonaws_metadata = angular.toJson(that.convertToMetadataFormat(metadata));
			 if(angular.isDefined($scope.selectedDataTableId))
				 {
							 queryService.updateEntity($scope.authenticationService.user, 
					 				   $scope.authenticationService.password, 
					 				   $scope.selectedDataTableId, 
					 				   { 
											publicMetadata : { aws_metadata : jsonaws_metadata }
					 				   }).then(function() {
					 				   });
				 }
			 
			 alert("Metadata Updated for id : " + $scope.selectedDataTableId);
		 };
	 
		 that.setGridData = function(data) {
			  that.gridData = data;
			 // rootScope.$safeApply();
		 };
		 
		 
		/**
		 * function that converts a aws-metadata json object into an array of objects that look like this { property:
		 * 																	 								value : }
		 * for using in the grid
		 * */
		that.convertToTableFormat = function(aws_metadata) {
			var data = [];
			for (var key in aws_metadata) {
				data.push({property : key, value : angular.toJson(aws_metadata[key]) });
			}
			return data;
		};
		


		/**
		* function that converts a object { property: , value : } into an aws_metadata json object
		* for updating to the server
		* */
		that.convertToMetadataFormat = function (tableData) {
			var aws_metadata = {};
			for (var i in tableData) {
			aws_metadata[tableData[i].property] = angular.fromJson(tableData[i].value);
			}
			return aws_metadata;
		};


			
		/**
		 * retrieves the metadata for a single column
		 * */
		that.getColumnMetadata = function (columnObject) {
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
					that.setGridData([]);
			}
		};

		that.cmp = function(a, b) {
			key1 = a.data.key;
			key2 = b.data.key;
			return key1 > key2 ? 1 : key1 < key2 ? -1 : 0;
		};		
	};
	
})();//end of IIFE