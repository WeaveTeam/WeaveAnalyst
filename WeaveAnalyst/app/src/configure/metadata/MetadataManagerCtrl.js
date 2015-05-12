(function(){
	angular.module('weaveAnalyst.configure.metadata', []);
	
	
	// SOURCE: from stack overflow : http://stackoverflow.com/questions/25531961/angularjs-bootstrap-progressbar-max-changing
	//adding a decorator that encapsulates the progressbar and bar directives provided by ui-bootstrap
	angular.module('weaveAnalyst.configure.metadata').config(function($provide){
		var progressDecorator = function($delegate){//$delegate is the original service instance which is decorated
			var directive = $delegate[0];
			var compile = directive.compile;
			var link = directive.link;
			
			directive.compile = function(){
				compile.apply(this,arguments);
				
				return function(scope, elem, attr, ctrl){
					link.apply(this,arguments);
					
					if(angular.isDefined(attr.dynamicMax)){
						attr.$observe('dynamicMax', function(max) {
				              scope.max = max;
			              scope.percent = +(100 * scope.value / max).toFixed(2);
				        }); 
				}
				};
			};//end of compile function
			
			return $delegate;
		};//end of progressIndicator;
		
		//the decorator function decorates the given service while instantiating it and returns the decorated service instance
		$provide.decorator('progressbarDirective', progressDecorator);
	    $provide.decorator('barDirective', progressDecorator);
		
	});
	

	angular.module('weaveAnalyst.configure.metadata').controller("MetadataManagerController", MetadataManagerController );	
	MetadataManagerController.$inject = ['$scope','$rootScope', 'dataServiceURL','queryService', 'authenticationService', 'runQueryService','errorLogService', 'metadataService'];
	
	function MetadataManagerController ($scope,$rootScope, dataServiceURL,queryService, authenticationService, runQueryService,errorLogService, metadataService){
		
		var mDataCtrl = this;
		
		mDataCtrl.queryService = queryService;
		mDataCtrl.authenticationService = authenticationService;
		mDataCtrl.metadataService = metadataService;
		mDataCtrl.selectedDataTableId;//datatable selected by the user
		mDataCtrl.maxTasks= 0;
		mDataCtrl.progressValue = 0;
		
		//object representation of the metadata csv uploaded 
		mDataCtrl.metadataUploaded = {
				file : {
					filename : "",
					content :""
				}
		};
		
		
		mDataCtrl.addNewRow = addNewRow;
		mDataCtrl.removeRow = removeRow;
		mDataCtrl.refresh = refresh;
		
		mDataCtrl.fileUpload;
		$scope.selectedItems = [];
		var treeData = [];

		//TODO try moving this to the directive controller or to the service

		//generated when the dynatree directive loads
		$scope.generateTree = function(element) {

				queryService.getDataTableList(true).then(function(dataTableList) {
					for (var i = 0; i < dataTableList.length; i++) {
							dataTable = dataTableList[i];
							treeNode = { title: dataTable.title, key : dataTable.id,
							children : [], isFolder : true, isLazy : true
					};
					treeData.push(treeNode);
					if( treeData.length == dataTableList.length) {
						$(element).dynatree({
							minExpandLevel: 1,
							children :treeData,
						keyBoard : true,
						onPostInit: function(isReloading, isError) {
									this.reactivate();
									},
						onActivate: function(node) {
							//handling nodes when tables TODO check if handling is done correctly
							if(!node.data.metadata)
							{
						
								mDataCtrl.selectedDataTableId = parseInt(node.data.key);
								//clears the grid when nodes are selected
								mDataCtrl.metadataService.setGridData([]);
							}
					
							//handle when node is a column
							if(node.data.metadata){
								mDataCtrl.selectedDataTableId = node.data.id;
								mDataCtrl.metadataService.getColumnMetadata(node.data);
							}
						},
						//******************************************lazy loading*****************************************************
						onLazyRead : function(node){
							var request = {
							jsonrpc: "2.0",
							id: "no_id",
							method : "getEntityChildIds",
							params : [node.data.key]
							};
					
							node.appendAjax({
								url : dataServiceURL,
								data : JSON.stringify(request),
								type: "POST",
								dataType : "json",
								error : function(node, XMLHttpRequest, textStatus, errorThrown)//refer to dynatree documentation
								{
									errorLogService.openErrorLog(errorThrown);
								},
								success : function(node, status, jqxhr)//this success function is different from the regular ajax success (modified by dynatree)
								{
									if(status.error)
										errorLogService.openErrorLog(status.error.message);
										
									if(status.result)
										{
											node.removeChildren();
											var list = status.result;// the actual result from ajax
											
											var columnChildren= [];
											//as soon as ids are returned retrieve their metadata
											runQueryService.queryRequest(dataServiceURL, 'getEntitiesById', [list], function(columnsWithMetadata){
												for(var i=0, l=columnsWithMetadata.length; i<l; i++){
													var singleColumn = columnsWithMetadata[i];
								                    columnChildren.push({title: singleColumn.publicMetadata.title,
								                        	id: singleColumn.id,
								                        	metadata: singleColumn.publicMetadata,
								                        	addClass : "custom1",// for a particular kind of document representation
								                        	focus: true});
								                }
								                node.setLazyNodeStatus(DTNodeStatus_Ok);//look at dynatree documentation
								                node.addChild(columnChildren);
											});
										}
									
								}
							});
						},
						debugLevel: 0
						});
					}
					}
				});
		};//controller;
		

		//$scope.gridOptions = { 
		//data: 'myData',
		//enableRowSelection: true,
		//enableCellEdit: true,
		//columnDefs: [{field: 'property', displayName: 'Property', enableCellEdit: true}, 
		//{field:'value', displayName:'Value', enableCellEdit: true}],
		//multiSelect : false,
		//selectedItems : $scope.selectedItems
		//
		//};

		$scope.$on('ngGridEventEndCellEdit', function(){
		this.metadataService.updateMetadata(this.metadataService.gridData);
		});


		/**
		* Editing
		* function calls for editing a column metadata property
		*/
		//adding
		function addNewRow () {
			mDataCtrl.metadataService.gridData.push({property: 'Property Name', value: 'Value'});
			mDataCtrl.metadataService.updateMetadata(mDataCtrl.metadataService.gridData);
		};

		//deleting
		function removeRow () {
			var index = mDataCtrl.metadataService.gridData.indexOf($scope.gridOptions.selectedItems[0]);
			mDataCtrl.metadataService.gridData.splice(index, 1);
			mDataCtrl.metadataService.updateMetadata(mDataCtrl.metadataService.gridData);
		};


		//refreshing the hierarchy
		function refresh () {
			$("#tree").dynatree("getTree").reload();
			var node = $("#tree").dynatree("getRoot");
			node.sortChildren(this.metadataService.cmp, true);
		};

	};//end of MetadataManagerController
	
	
	
	/*
	 *applies metadata standards defined by user in a csv to the selected datatable 
	 *updates the aws-metadata property of columns in a datatable 
	 */
	angular.module('weaveAnalyst.configure.metadata').controller("MetadataFileController",MetadataFileController );	
	MetadataFileController.$inject = ['$scope', 'queryService', 'authenticationService', 'errorLogService'];
	
	function MetadataFileController ($scope, queryService, authenticationService, errorLogService){
		var mFCtrl = this;
		
		mFCtrl.maxTasks= 0;
		mFCtrl.progressValue = 0;
		
		//object representation of the metadata csv uploaded 
		mFCtrl.metadataUploaded = {
				file : {
					filename : "",
					content :""
				}
		};
		
		$scope.$watch(function(){
			return mFCtrl.metadataUploaded.file;
			}, function(n, o) {
			if(mFCtrl.metadataUploaded.file.content){
				
				/****/mFCtrl.selectedDataTableId = $scope.mDataCtrl.selectedDataTableId;/****/ //this is how you access parent controller instance properties
				
		        	  //metadata file(.csv) uploaded by the user is converted to update the columns
		           var metadataArray = queryService.CSVToArray(mFCtrl.metadataUploaded.file.content);
		            
		    	  if(mFCtrl.selectedDataTableId) {//works only if a selection is made
		    		  queryService.getDataColumnsEntitiesFromId(mFCtrl.selectedDataTableId, true).then(function(columns) {
		    			 // console.log("columns", columns);
		    			  if(columns.length) {//works only if a datatable that contains column children is selected, will not work if a column is selected
			    				  var end = columns.length;
			    				  mFCtrl.maxTasks = end;
			    				  console.log("max",mFCtrl.maxTasks );
			    				  
		        				  for (var i = 1; i < metadataArray.length; i++) {//starting the loop from index 1 to avoid headers
		        						var title = metadataArray[i][0];//gets the title of a single column
		        						
		        						var metadata = metadataArray[i][1];//gets the metadata to be updated per column
		        						
		        						var id;
		        						for(var j = 0; j < columns.length; j++) {
		        							if(columns[j].title == title) {
		        								id = columns[j].id;
		        								break; // we assume there is only one match
		        							}
		        						}
			        					if(id) {
			        								//TODO handle columns with missing metadata
			        								if(!(angular.isUndefined(metadata)))//if a particular column does not have metadata
			        									metadata = metadata;
			        								
			        								
			        								//updating the column metadata(adding the aws_metadata property to the public metadata) on the server 
			        								queryService.updateEntity(authenticationService.user, authenticationService.password, id, {publicMetadata :{ 
			        																												aws_metadata : metadata
			        																											 }
			        																							}
				        							 ).then(function() {
				        								 mFCtrl.progressValue++;
				        								 console.log( mFCtrl.progressValue);
				        							 });								
			        							}
									 }
		        			  } else {
		        				  //if a column is selected
		        				  errorLogService.openErrorLog("Selected entity is not a table or table does not contain any columns.");
		        				  console.log("selected entity is not a table or table does not contain any columns.");
		        			  }
					  });
		    	  } else {
		    		  		errorLogService.openErrorLog("no selected tables");
							console.log("no selected tables");
		    	  		};
	        }

	      }, true);
		
		//watch expression to reset the progress bar after the task has been completed
		 $scope.$watch(function(){
			return mFCtrl.progressValue;
		 }, function(){
			 //console.log("progress", $scope.progressValue);
			if(mFCtrl.progressValue == mFCtrl.maxTasks) {
				//console.log("equal");
				setTimeout(function() {
					//resetting variables
					mFCtrl.inProgress = false;
					mFCtrl.progressValue = 0;
					mFCtrl.maxTasks = 0;
					//resetting the uploaded file (because if we repeated upload same file)
					mFCtrl.metadataUploaded.file.filename = "";
					mFCtrl.metadataUploaded.file.content = "";
					
					$scope.$apply();
				}, 5000);
			} else {
				//console.log("not equal");
				mFCtrl.inProgress = true;
			}
		 });
	};//end of MetadataFileController

		
})();//end of IIFE



angular.module('weaveAnalyst.configure.metadata').directive('dynatree', function() {
	return {
        link: function(scope, element, attrs) {
        	scope.generateTree(element);
        }
   };	
});