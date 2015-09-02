/**
 *this tree is an interactive interface for creating the nested query object. 
 *@shwetapurushe
 */

(function(){
	angular.module('weaveAnalyst.nested_qo').directive('d3QueryObjectTree', nested_qoTreeComponent);
	
	function nested_qoTreeComponent (){
		return {
			restrict : 'E', 
			template : '<div id = "qo_tree"></div>',
			controller : nested_qoTreeController,
			controllerAs : 'tree_Ctrl',
			bindToController : true,
			link : function(scope, elem, attr){
				var dom_element = document.getElementById("qo_tree");
				
				var config = {
					container : dom_element
					
				};
				
				var nesTree = new window.wa.d3_viz.collapsibleTree();
				nesTree.intialize_tree(config);
			}
		};
	};
	
	function nested_qoTreeController (){
		var tree_Ctrl = this;
		
	};
})();