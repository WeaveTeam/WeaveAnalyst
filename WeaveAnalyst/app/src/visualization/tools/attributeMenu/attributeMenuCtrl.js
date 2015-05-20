/**
 * controls the attribute menu visualization tool  widget
 */
(function(){
	angular.module('weaveAnalyst.WeaveModule').controller("AttributeMenuController",AttributeMenuController );
	AttributeMenuController.$inject = ['$scope', 'WeaveService', '$timeout'];
	
	function AttributeMenuController ($scope, WeaveService, $timeout){

		var attCtrl = this;
		attCtrl.WeaveService = WeaveService;
		attCtrl.setAttributes = setAttributes;
		attCtrl.tool = {
			title : "",
			enabled : false,
			selectedVizTool : null, 
			vizAttribute :{}, 
			columns: []
		};

		$scope.$watch(function(){
			return attCtrl.tool.selectedVizTool;
		}, function(){
			//console.log("tools selected", $scope.tool.selectedVizTool);
			if(attCtrl.tool.selectedVizTool){
				attCtrl.vizAttributeColl = [];
				attCtrl.vizAttributeColl = attCtrl.WeaveService.getSelectableAttributes(attCtrl.tool.title, attCtrl.tool.selectedVizTool);
			}
		});
		
		$scope.$watch(function(){
			return attCtrl.tool;
		},function() {
			if(attCtrl.toolId) // this gets triggered twice, the second time toolId with a undefined value.
				attCtrl.WeaveService.AttributeMenuTool(attCtrl.tool, attCtrl.toolId);
		}, true);
		
		function setAttributes (attr){
			if(attr)
				attCtrl.tool.chosenAttribute = attr;
			//check for tha attrbite selected
			if(attCtrl.tool.vizAttribute && attCtrl.tool.selectedVizTool && attCtrl.tool.chosenAttribute)
				//set the attribute in weave
				WeaveService.setVizAttribute(attCtrl.tool.title,
											 attCtrl.tool.selectedVizTool,
											 attCtrl.tool.vizAttribute,
											 attCtrl.tool.chosenAttribute);
		};
	}
})();