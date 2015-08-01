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
	
	
	function param_MatcherController (){
		var p_MCtrl = this;
	};
})();