/**
 *this object serves as a wrapper for the API calls made when Weave is being used as a visualization engine 
 *@author spurushe
 */

if(!this.wa)
	this.wa = {};

(function(){
	function WeaveWrapper (){
		this.weave = document.getElementById('weave');
	}
	
	var p = WeaveWrapper.prototype;
	
	
	//////////////
	////VIZs
	//////////////
	p.request_BarChart = function(){
		if(this.check_WeaveReady()){
			var toolName = this.generate_UniqueName("BarChartTool");
			this.weave.path(toolName)
			.request('CompoundBarChartTool')
			.state({  showAllLabels : state.showAllLabels })
			.push('children', 'visualization', 'plotManager', 'plotters', 'plot')
			.push('sortColumn').setColumn(state && state.sort ? state.sort.metadata : "", state && state.sort ? state.sort.dataSourceName : "")
			.pop()
			.push('labelColumn').setColumn(state && state.label ? state.label.metadata : "", state && state.label ? state.label.dataSourceName : "")
			.pop()
			.push("heightColumns").setColumns(state && state.heights && state.heights.length ? state.heights.map(function(column) {
				return column.metadata;
			}) : {}, state && state.heights && state.heights[0] ? state.heights[0].dataSourceName : "")
			.pop()
			.push("positiveErrorColumns").setColumns(state && state.posErr ? state.posErr.map(function(column) {
				return column.metadata;
			}) : {}, state && state.posErr && state.posErr[0] ? state.posErr[0].dataSourceName : "")
			.pop()
			.push("negativeErrorColumns").setColumns(state && state.negErr && state.negErr.map(function(column) {
				return column.metadata;
			}), state && state.negErr && state.negErr[0] ? state.negErr[0].dataSourceName : "");
		}
		else{
			console.log("Weave and its api are not ready");
			return;
		}
		
	};
	
	
	p.request_ScatterPlot = function(){
		var toolName;
		if(this.check_WeaveReady()){
			
			toolName = this.generate_UniqueName("ScatterPlotTool");
			
			 this.weave.path(toolName).request('ScatterPlotTool')
			.push('children', 'visualization','plotManager', 'plotters', 'plot')
			.push('dataX').setColumn(state.X.metadata, state.X.dataSourceName)
			.pop()
			.push('dataY').setColumn(state.Y.metadata, state.Y.dataSourceName);
				
		}
		else{//if weave is not ready
			console.log("Weave and its api are not ready");
			return;
		}
		return toolName;
	};
	
	
	p.request_AdvancedDataTable = function(){
		var toolName;
		if (this.check_WeaveReady())
		{
			toolName = this.generate_UniqueName("DataTableTool");
			
			this.weave.path(toolName).request('AdvancedTableTool')
			.push("columns").setColumns(state && state.columns && state.columns.length ? state.columns.map(function(column) {
				return column.metadata;
			}) : {}, state && state.columns && state.columns[0] ? state.columns[0].dataSourceName : ""); 
			
			// empty columns
			if(state.columns && !state.columns.length)
				weave.path(toolName).request("AdvancedTableTool").push("columns").state({});
		}
		else{//if weave is not ready
			console.log("Weave and its api are not ready");
			return;
		}
		return toolName;
	};
	
	
	p.request_Map = function(){
		
	};
	
	
	////////////////
	//TOOLS
	///////////////
	p.request_AttributeMenu = function(){
		var toolName;
		if(this.check_WeaveReady()){
			toolName = aToolName || ws.generateUniqueName("AttributeMenuTool");
			ws.weave.path(toolName).request('AttributeMenuTool').call(setQueryColumns, {choices: state.columns});
				
				if(state.vizAttribute && state.selectedVizTool)
					ws.weave.path(toolName).request('AttributeMenuTool')
					.state({targetAttribute : state.vizAttribute.title , targetToolPath : [state.selectedVizTool]});
			}
		else{
			console.log('Weave and its api are not ready yet');
		}
	};
	
	
	p.request_DataFilter = function(){
		
		if(this.check_WeaveReady()){
			
			this.weave.path(toolName).request('DataFilterTool');
			
			if(state.filterStyle == "Discrete values") {
				this.weave.path(toolName, "editor", null).request("StringDataFilterEditor").state({
					layoutMode : state.layoutMode.value,
					showPlayButton : state.showPlayButton,
					showToggle : state.showToggle
				});
			} else if(state.filterStyle == "Continuous range") {
				this.weave.path(toolName, "editor", null).request("NumberDataFilterEditor");
			}
			if(state.column) {
				this.weave.path(toolName, "filter", null, "column").setColumn(state.column.metadata, state.column.dataSourceName);
			}
		}
		else{
			console.log("Weave and its api are not ready");
		}
	};
	
	
	p.request_SummaryAnnotation = function(){
		
	};
	
	///COLOR///////
	
	p.set_ColorGroup = function(toolName, plotName, groupName, column){
		var plotterPath = this.weave.path(toolName).pushPlotter(plotName);
		var plotType = plotterPath.getType();
		if (!plotName) plotName = "plot";
		var dynamicColumnPath;
		
		if (plotType == "weave.visualization.plotters::CompoundBarChartPlotter")
		{
			dynamicColumnPath = plotterPath.push("colorColumn", "internalDynamicColumn");
		}
		else
		{
			dynamicColumnPath = plotterPath.push("fill", "color", "internalDynamicColumn");
		}
		
		dynamicColumnPath.vars({name: groupName}).getValue("ColumnUtils.unlinkNestedColumns(this); globalName = name");
		this.weave.path(groupName).getValue("ColumnUtils.hack_findInternalDynamicColumn(this)").setColumn(column.metadata, column.dataSourceName);
	};
	
	p.get_ColorGroups = function(){
		return	this.weave.path().getValue('getNames(ColorColumn)');
	};
	
	/////////////
	//UTILITY
	////////////
	
	p.get_base64_SessionState = function(){
		
		return this.weave.path().getValue("\
		        var e = new 'mx.utils.Base64Encoder'();\
		        e.encodeBytes( Class('weave.Weave').createWeaveFileContent(true) );\
		        return e.drain();\
		    ");
	};
	
	p.set_base64_SessionState = function(){
		
		this.weave.path()
		.vars({encoded: base64encodedstring})
		.getValue("\
	        var d = new 'mx.utils.Base64Decoder'();\
			var decodedStuff = d.decode(encoded);\
			var decodeBytes =  d.toByteArray();\
	      Class('weave.Weave').loadWeaveFileContent(decodeBytes);\
	    ");
	};
	
	p.clear_SessionState = function(){
		this.weave.path().state(['WeaveDataSource']);
	};
	
	p.check_WeaveReady = function(){
		console.log("this",this);
		return this.weave && this.weave.WeavePath && this.weave._jsonCall;
	};
	
	p.generate_UniqueName = function(className, path) {
		if(!this.weave)
			return null;
		return this.weave.path(path || []).getValue('generateUniqueName')(className);
	};
	
	p.get_PathToFilters = function() {
		if(!this.checkWeaveReady())
			return;
		return this.weave.path("scriptKeyFilter").request("KeyFilter").push("filters");//references the Linkableashmap 'filters' in a keyFilter
	};
	
	p.tile_Windows = function() {
		if(!this.checkWeaveReady())
			return;
		this.weave.path()
		.libs("weave.ui.DraggablePanel")
		.exec("DraggablePanel.tileWindows()");
	};
	
	p.fetch_NodePath = function(){
		
	};
	
	p.get_listOfTools = function(){
		
	};
	
	p.remove_Object = function(object_name){
		this.weave.path(object_name).remove();
	};
	
	
	
	//attaching it to the global wa object
	wa.WeaveWrapper = WeaveWrapper;
})();