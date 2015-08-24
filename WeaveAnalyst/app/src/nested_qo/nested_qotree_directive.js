/**
 *this tree is an interactive interface for creating the nested query object. 
 *@shwetapurushe
 */

(function(){
	angular.module('weaveAnalyst.nested_qo').directive('', nested_qoTreeComponent);
	
	function nested_qoTreeComponent (){
		return {
			restrict : 'E', 
			template : '<div></div>',
			controller : nested_qoTreeController,
			controllerAs : 'tree_Ctrl',
			bindToController : true,
			link : function(){
				
			}
		};
	};
	
	function nested_qoTreeController (){
		var tree_Ctrl = this;
	};
})();