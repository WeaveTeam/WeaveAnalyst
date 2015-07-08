/**
 * this directive contains buttons for different operations on the Query object
 * IMPORT
 * EXPORT
 * SAVE
 * EDITOR
 * RUN-UPDATE
 * RUN-NEW
 * 
 * 
 * @author spurushe
 * @author fkamayou
 */

(function(){
	
	angular.module('weaveAnalyst.AnalysisModule').directive('qoButtons', qoButtons);
	
	function qoButtons(){
		return {
			restrict: 'E',
			scope:{},
			templateUrl:'src/analysis/qo_buttons.tpl.html', 
			controller : qoButtonController,
			controllerAs : 'qo_btnsCtrl',
			bindToController: true,
			link: function(){
				
			}
		};//directive definition object
	};
	
	//controller is put out of the directive definition
	qoButtonController.$inject = ['$scope', '$modal', 'queryService', 'WeaveService','projectService', 'QueryHandlerService'];//dependencies
	function qoButtonController ($scope, $modal, queryService, WeaveService,projectService, QueryHandlerService){
		var qo_btnsCtrl = this;
		
		qo_btnsCtrl.queryService = queryService;
		qo_btnsCtrl.QueryHandlerService = QueryHandlerService;
		qo_btnsCtrl.WeaveService = WeaveService;
		qo_btnsCtrl.projectService = projectService;
		
		qo_btnsCtrl.export_Query = export_Query;
		qo_btnsCtrl.save_Visualizations = save_Visualizations;
		qo_btnsCtrl.run_update = run_update;
		qo_btnsCtrl.run = run;
		
		//structure for file upload
		qo_btnsCtrl.queryObjectUploaded = {
				file : {
					content : "",
					filename : ""
				}
		};
		//options for the dialog for saving output visuals
		qo_btnsCtrl.opts = {
				 backdrop: false,
		          backdropClick: true,
		          dialogFade: true,
		          keyboard: true,
		          templateUrl: 'src/analysis/savingOutputsModal.html',
		          controller: 'savingQOModalController',
		          resolve:
		          {
		                      projectEntered: function() {return $scope.projectEntered;},
		                      queryTitleEntered : function(){return $scope.queryTitleEntered;},
		                      userName : function(){return $scope.userName;}
		          }
			};


		//chunk of code that runs when a QO is imported
	    $scope.$watch(function(){
	    	return qo_btnsCtrl.queryObjectUploaded.file;
	    }, function(n, o) {
			if(qo_btnsCtrl.queryObjectUploaded.file.content)
			{
				qo_btnsCtrl.queryService.queryObject = angular.fromJson(qo_btnsCtrl.queryObjectUploaded.file.content);
				if(qo_btnsCtrl.WeaveService.weave)
				{
					qo_btnsCtrl.WeaveService.weave.path().state(qo_btnsCtrl.queryService.queryObject.sessionState);
					delete qo_btnsCtrl.queryService.queryObject.sessionState;
				}
			}
	    }, true);
	    
		
		function export_Query(){
			console.log("exporting query");
			if(WeaveService.weave)
			{
				qo_btnsCtrl.queryService.queryObject.sessionState = WeaveService.weave.path().getState();
			}
			
			var blob = new Blob([ angular.toJson(queryService.queryObject, true) ], {
				type : "text/plain;charset=utf-8"
			});
			saveAs(blob, "QueryObject.json");//TODO add a dialog to allow saving file name
		};
		
		
		function save_Visualizations(){
			var saveQueryObjectInstance = $modal.open(qo_btnsCtrl.opts);
	    	saveQueryObjectInstance.result.then(function(params){//this takes only a single object
	    	console.log("params", params);
	    		//qo_btnsCtrl.projectService.getBase64SessionState(params);
	    		
	    	});
		};
		
		
		function run_update(){
			//QueryHandlerService.run(queryService.queryObject, true)//update
		};
		
		
		function run(){
			//run new QueryHandlerService.run(queryService.queryObject)
		};
	}
	
	
	///////////////////
	//MODAL controller
	///////////////////
	angular.module("weaveAnalyst.AnalysisModule").controller('savingQOModalController', savingQOModalController);
	savingQOModalController.$inject = ['$scope', '$modalInstance', 'projectEntered', 'queryTitleEntered', 'userName'];
	
	function savingQOModalController ($scope, $modalInstance, projectEntered, queryTitleEntered, userName){
		$scope.close = function (projectEntered, queryTitleEntered, userName) {
			  var params = {
					  projectEntered : projectEntered,
					  queryTitleEntered : queryTitleEntered,
					  userName :userName
			  };
		  $modalInstance.close(params);
		};
	}
	
})();