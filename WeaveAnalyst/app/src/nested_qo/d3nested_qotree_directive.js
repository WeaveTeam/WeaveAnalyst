/**
 *this tree is an d3 interactive interface for creating the nested query object. 
 *@shwetapurushe
 */

(function(){
	angular.module('weaveAnalyst.nested_qo', [] );
	angular.module('weaveAnalyst.nested_qo').directive('d3QueryObjectTree', d3nested_qoTreeComponent);
	
	function d3nested_qoTreeComponent (){
		return {
			restrict : 'E', 
			template : '<div id = "qo_tree"></div>',
			controller : d3nested_qoTreeController,
			controllerAs : 'd3tree_Ctrl',
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
	
	function d3nested_qoTreeController (){
		var d3tree_Ctrl = this;
		
	};
})();