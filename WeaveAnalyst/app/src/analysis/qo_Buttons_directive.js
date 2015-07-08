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

angular.module('weaveAnalyst.AnalysisModule').directive('qoButtons', ['queryService', 'QueryHandlerService', function factory(queryService, QueryHandlerService){
	var directiveDefnObject = {
			restrict: 'E',
			templateUrl:'src/analysis/qo_buttons.tpl.html', 
			controller : function(){
				var qo_btnsCtrl = this;
				qo_btnsCtrl.queryService = queryService;
				qo_btnsCtrl.QueryHandlerService = QueryHandlerService;
				
				qo_btnsCtrl.export_Query = export_Query;
				qo_btnsCtrl.save_Visualizations = save_Visualizations;
				qo_btnsCtrl.run_update = run_update;
				qo_btnsCtrl.run = run;
				
				function export_Query(){
				};
				
				function save_Visualizations(){
				};
				
				function run_update(){
					//QueryHandlerService.run(queryService.queryObject, true)//update
				};
				
				function run(){
					//run new QueryHandlerService.run(queryService.queryObject)
				};
			},
			controllerAs : 'qo_btnsCtrl',
			bindToController: true,
			link: function(){
				
			}
	};
	
	return directiveDefnObject;
}]);
