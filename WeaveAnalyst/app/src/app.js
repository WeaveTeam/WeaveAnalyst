'use strict';
//                                 'ui.select',
//                                 'ui.sortable',


angular.module('weaveAnalyst',['ui.router',
                               'ui.grid',
                               'ui.bootstrap',
                               'mk.editablespan',
                               'ngAnimate',
                               'mgcrea.ngStrap',
                               'angularSpinner',
                               'ngSanitize',
                               'weaveAnalyst.configure',
                               'weaveAnalyst.dataStatistics',
                               'weaveAnalyst.directives',
                               'weaveAnalyst.queryObject',                             
                               'weaveAnalyst.queryObjectEditor', 
                               'weaveAnalyst.project',
                               'weaveAnalyst.errorLog',
                               'weaveAnalyst.AnalysisModule',
                               'weaveAnalyst.WeaveModule',
                               'weaveAnalyst.QueryHandlerModule']);

angular.module('weaveAnalyst.configure', ['weaveAnalyst.configure.auth',
                                          'weaveAnalyst.configure.metadata',
                                          'weaveAnalyst.configure.script']);


angular.module('weaveAnalyst.directives', ['weaveAnalyst.directives.dualListBox',
                                'weaveAnalyst.directives.fileUpload',
                                'weaveAnalyst.directives.popover-with-tpl']);



//using the value provider recipe 
angular.module('weaveAnalyst').value("dataServiceURL", '/WeaveServices/DataService');
angular.module('weaveAnalyst').value('adminServiceURL', '/WeaveServices/AdminService');
angular.module('weaveAnalyst').value('projectManagementURL', '/WeaveAnalystServices/ProjectManagementServlet');
angular.module('weaveAnalyst').value('scriptManagementURL', '/WeaveAnalystServices/ScriptManagementServlet');
angular.module('weaveAnalyst').value('computationServiceURL', '/WeaveAnalystServices/ComputationalServlet');
angular.module('weaveAnalyst').value('WeaveDataSource', 'WeaveDataSource');


angular.module('weaveAnalyst').run(['$rootScope', function($rootScope){
	$rootScope.$safeApply = function(fn, $scope) {
			if($scope == undefined){
				$scope = $rootScope;
			}
			fn = fn || function() {};
			if ( !$scope.$$phase ) {
        	$scope.$apply( fn );
    	}
    	else {
        	fn();
    	}
	};
}])
.config(function($stateProvider, $urlRouterProvider) {
	
	//$parseProvider.unwrapPromises(true);
	
	$urlRouterProvider.otherwise('/index');
	
	$stateProvider
		.state('index', {
			url : '/index'
		})
		.state('metadata', {
			url:'/metadata',
			templateUrl : 'src/configure/metadata/metadataManager.html',
			//controller: 'MetadataManagerCtrl',
			data : {
				activetab : 'metadata'
			}
		})
	    .state('script_management', {
	    	url:'/scripts',
	    	templateUrl : 'src/configure/script/scriptManager.html',
	    	//controller : 'ScriptManagerCtrl',
	    	data:{
	    		activetab : 'script_management'
	    	}
	    })
	    .state('analysis', {
	    	url:'/analysis',
	    	templateUrl : 'src/analysis/analysis.tpl.html',
	    	//controller: 'AnalysisCtrl',
	    	data : {
	    		activetab : 'analysis'
	    	}
	    })
	    .state('project', {
	    	url:'/projects',
	    	templateUrl : 'src/project/projectManagementPanel.html',
	    	//controller : 'ProjectManagementCtrl',
	    	data: {
	    		activetab : 'project'
	    	}
	    })
	    .state('cross_tab',{
	    	url:'/cross_tab',
	    	templateUrl: 'src/analysis/crosstab/cross_tab.tpl.html',
	    	data :{
    			activetab : 'cross_tab'
    		}
	    })
	    .state('data_stats',{
	    	url:'/dataStatistics',
	    	templateUrl : 'src/dataStatistics/dataStatisticsMain.tpl.html',
    		//controller : 'dataStatsCtrl',
    		data :{
    			activetab : 'data_stats'
    		}
	    })
	    .state('data_stats.summary_stats',{
	    	url:'/summary_stats',
	    	templateUrl: 'src/dataStatistics/summary_stats.tpl.html',
	    	data :{
    			activetab : 'summary_stats'
    		}
	    })
	    .state('data_stats.correlations', {
	    	url:'/correlations',
	    	templateUrl : 'src/dataStatistics/correlation_matrices.tpl.html',
	    	data :{
    			activetab : 'correlations'
    		}
	    })
	    .state('data_stats.regression', {
	    	url:'/regression',
	    	templateUrl :'src/dataStatistics/regression_analysis.tpl.html',
	    	data:{
	    		activetab: 'regression'
	    	}
	    });
		
	    
});

angular.module('weaveAnalyst').controller('weaveAnalystController', function($scope,$rootScope, $state, authenticationService,usSpinnerService, queryService, WeaveService) {
	
	this.state = $state;
	this.authenticationService = authenticationService;

});
