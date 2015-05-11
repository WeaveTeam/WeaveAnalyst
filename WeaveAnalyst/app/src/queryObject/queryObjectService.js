'use strict';
/**
 * Query Object Service provides access to the main "singleton" query object.
 *
 * Don't worry, it will be possible to manage more than one query object in the
 * future.
 */

//using value recipes so that these tools could be used elsewhere as well TODO: make them into directives
QueryObject.value('indicator_tool', {
												title : 'Indicator',
												template_url : 'src/analysis/indicator/indicator.tpl.html',
												description : 'Choose an Indicator for the Analysis',
												category : 'indicatorfilter'
});

QueryObject.value('geoFilter_tool',{
										title : 'Geography Filter',
										template_url : 'src/analysis/data_filters/geographyFilter.tpl.html',
										description : 'Filter data by States and Counties',
										category : 'datafilter'
});

QueryObject.value('timeFilter_tool', {
											title : 'Time Period Filter',
											template_url : 'src/analysis/data_filters/time_period.tpl.html',
											description : 'Filter data by Time Period',
											category : 'datafilter'
});

QueryObject.value('byVariableFilter_tool', {
													title : 'By Variable Filter',
													template_url : 'src/analysis/data_filters/by_variable.tpl.html',
													description : 'Filter data by Variables',
													category : 'datafilter'
});

QueryObject.value('BarChartTool',{
										id : 'BarChartTool',
										title : 'Bar Chart Tool',
										template_url : 'src/visualization/tools/barChart/bar_chart.tpl.html'

});

QueryObject.value('MapTool', {
									id : 'MapTool',
									title : 'Map Tool',
									template_url : 'src/visualization/tools/mapChart/map_chart.tpl.html'
});

QueryObject.value('ScatterPlotTool', {
											id : 'ScatterPlotTool',
											title : 'Scatter Plot Tool',
											template_url : 'src/visualization/tools/scatterPlot/scatter_plot.tpl.html',
											description : 'Display a Scatter Plot in Weave'
});

QueryObject.value('DataTableTool', {
											id : 'DataTableTool',
											title : 'Data Table Tool',
											template_url : 'src/visualization/tools/dataTable/data_table.tpl.html',
											description : 'Display a Data Table in Weave'
});

QueryObject.value('color_Column', {	
											id : 'color_Column',
											title : 'Color Column',
											template_url : 'src/visualization/tools/color/color_Column.tpl.html',
											description : 'Set the color column in Weave'
});


QueryObject.value('key_Column', {
										id : 'Key_Column', 
										title : 'Key Column',
										template_url : 'src/visualization/tools/color/key_Column.tpl.html',
										description : 'Set the key column in Weave'
});
QueryObject.service('runQueryService', [ function(){

}]);


QueryObject.service("queryService", [ function() {

}]);
