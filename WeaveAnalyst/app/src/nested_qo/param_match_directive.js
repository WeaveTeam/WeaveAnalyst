/**
 * this directive checks for matching the output parameters of one query object with the input parameters of the successive one 
 * in the nested query object
 * A nested query object is a collection of two or more query objects with a directed analytic flow
 * 
 * @author spurushe
 */

(function(){
	angular.module('weaveAnalyst.nested_qo', [] );
	angular.module('weaveAnalyst.nested_qo').directive('paramMatcher', param_MatcherComponent);
	
	function  param_MatcherComponent (){
		return {
			restrict : 'E',
			templateUrl : 'src/nested_qo/param_Matcher.tpl.html',
			controller : param_MatcherController,
			controllerAs : 'p_MCtrl',
			bindToController : true,
			link : function(){ 
				
			}
		};
	};// end og directive definition
	
	
	param_MatcherController.$inject = ['$scope', 'projectService', 'queryObjectService'];
	function param_MatcherController ($scope, projectService, queryObjectService){
		var p_MCtrl = this;
		p_MCtrl.projectService = projectService;
		p_MCtrl.queryObjectService = queryObjectService;
		
		p_MCtrl.selected_prj;
		p_MCtrl.selected_qo;//this will be set to a new clean query object or the one selected from drop downs 
		
		p_MCtrl.add_mode= null;
		
		$scope.$watch('p_MCtrl.add_mode', function(){
			if(p_MCtrl.add_mode == 'new'){
				var fresh = confirm("Do you wish to save the query object created?" );
				if(fresh == false){
					p_MCtrl.queryObjectService.native_nested_qo = new QueryObject();
				}
				else{
					//save (1)to database (2) download it and 
					//then create a fresh one
				}
				
			}
		});
		
		$scope.$watch('p_MCtrl.selected_prj', function(){
			if(p_MCtrl.selected_prj)
				p_MCtrl.projectService.getListOfQueryObjects(p_MCtrl.selected_prj.Name);
		});
		
		
	};
})();