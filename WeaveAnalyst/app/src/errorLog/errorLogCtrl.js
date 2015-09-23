/**
 * controller for the error log that is universal to all tabs
 * Also includes the service for logging errors
 */
(function(){
	angular.module('weaveAnalyst.errorLog', []);
	
	/////////////////////
	//CONTROLLERS
	/////////////////////
	
	angular.module('weaveAnalyst.errorLog').controller('analystErrorLogController', analystErrorLogController);

	analystErrorLogController.$inject = ['$modal', 'errorLogService'];
	function analystErrorLogController($modal, errorLogService){
		var aEl = this;
		aEl.errorLogService = errorLogService;
		aEl.openErrorLog = function(){
			$modal.open(aEl.errorLogService.errorLogModalOptions);
		};
	}
	
	
	angular.module('weaveAnalyst.errorLog').controller('errorLogInstanceController', errorLogInstanceController);
	errorLogInstanceController.$inject= ['errorLogService'];
	function errorLogInstanceController(errorLogService){
		var inst_Ctrl = this;
		
		inst_Ctrl.errorLogService = errorLogService;
	};
	
	/////////////////
	//SERVICES
	/////////////////
	
	angular.module('weaveAnalyst.errorLog').service('errorLogService',errorLogService);
	errorLogService.$inject = ['$modal'];
	
	function errorLogService ($modal){

		var that = this;
		that.logs = "";
		
		that.errorLogModalOptions = {//TODO find out how to push error log to bottom of page
				 backdrop: true,
		         backdropClick: true,
		         dialogFade: true,
		         keyboard: true,
		         templateUrl: 'src/errorLog/analystErrorLog.html',
		         controller: 'errorLogInstanceController',
		         controllerAs : 'inst_Ctrl',
		         windowClass : 'erroLog-modal'
			};
		
		that.showErrorLog = false;
		//function to pop open the error log when required
		that.openErrorLog = function(error){
			that.logInErrorLog(error);
			$modal.open(that.errorLogModalOptions);
		};

		/**
		 *this is the function that will be used over all tabs to log errors to the error log
		 *@param the string you want to log to the error log
		 */
		that.logInErrorLog = function(error){
			this.logs += error  + new Date().toLocaleTimeString();
		};
		
	};
	
})();//end of IIFE


