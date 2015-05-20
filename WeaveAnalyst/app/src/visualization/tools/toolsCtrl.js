(function(){
	angular.module('weaveAnalyst.WeaveModule').controller("vizToolsController", vizToolsController );
	vizToolsController.$inject = ['$scope', '$filter','queryService', 'WeaveService'];
	
	function vizToolsController ($scope, $filter,queryService, WeaveService){
		var vizCtrl = this;
		
		vizCtrl.queryService = queryService;
		vizCtrl.WeaveService = WeaveService;
		vizCtrl.showToolMenu = false;
		vizCtrl.selectedToolToAdd = {};
		vizCtrl.tool_options = ["MapTool", "BarChartTool", "ScatterPlotTool", "DataTable"];
		vizCtrl.fixed_ids = ["MapTool", "BarChartTool", "ScatterPlotTool", "DataTableTool", "KeyColumn", "ColorColumn", "AttributeMenuTool"];
		
		vizCtrl.addTool = addTool;
		vizCtrl.clearSessionState = clearSessionState;
		vizCtrl.removeTool = removeTool;
		
		$scope.$watch(function() {
			return vizCtrl.WeaveService.weave;
		}, function () {
			if(vizCtrl.WeaveService.weave) {
				vizCtrl.showToolMenu = true;
			}
		});
		
		function addTool(name) {
			switch(name) {
				case "MapTool":
					var toolName = WeaveService.MapTool(null, "");
					console.log(toolName);
					vizCtrl.queryService.queryObject.visualizations[toolName] = {
						title : toolName,
						template_url : 'src/visualization/tools/mapChart/map_chart.tpl.html'
					};
					break;
				case "BarChartTool":
					var toolName = WeaveService.BarChartTool(null, "");
					vizCtrl.queryService.queryObject.visualizations[toolName] = {
						title : toolName,
						template_url : 'src/visualization/tools/barChart/bar_chart.tpl.html'
					};
					break;
				case "ScatterPlotTool":
					var toolName = WeaveService.ScatterPlotTool(null, "");
					vizCtrl.queryService.queryObject.visualizations[toolName] = { 
						title : toolName,
						template_url : 'src/visualization/tools/scatterPlot/scatter_plot.tpl.html'
					};
					break;
				case "DataTableTool":
					var toolName = WeaveService.DataTableTool(null, "");
					vizCtrl.queryService.queryObject.visualizations[toolName] = {
						title : toolName,
						template_url : 'src/visualization/tools/dataTable/data_table.tpl.html'
					};
					break;
				case "AttributeMenuTool":
					var toolName = WeaveService.AttributeMenuTool(null, "");
					vizCtrl.queryService.queryObject.visualizations[toolName] = {
						title : toolName,
						template_url : 'src/visualization/tools/attributeMenu/attribute_Menu.tpl.html'
					};
					break;
			}
		};
		

		//clears the session state
		function clearSessionState (){
			vizCtrl.WeaveService.clearSessionState();
		};
		
		
		function removeTool (toolId) {
			vizCtrl.WeaveService.weave.path(toolId).remove();
			delete vizCtrl.queryService.queryObject.visualizations[toolId];
		};
	}
})();