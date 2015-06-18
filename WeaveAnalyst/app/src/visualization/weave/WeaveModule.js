var weave_mod = angular.module('aws.WeaveModule', []);
//TODO figure out whici module this service belongs to
var nodePath;
AnalysisModule.service("WeaveService", ['$q','$rootScope','runQueryService', 'dataServiceURL','queryService', function($q, rootScope, runQueryService, dataServiceURL, queryService) {
	
	this.weave;
	var ws = this;
	this.weaveWindow = window;
	this.analysisWindow = window;
	this.toolsEnabled = [];
	this.cache = {
		previousNodeId : null,
		columnReference: null
	};
	
	
	
	this.columnNames = [];
	this.ScatterPlot_Path = ["children", "visualization", "plotManager", "plotters", "plot", "fill", "color", "internalDynamicColumn"];
	this.BarchartTool_Path = ["children", "visualization", "plotManager", "plotters", "plot", "colorColumn", "internalDynamicColumn"];
	this.MapTool_Path = ["children", "visualization", "plotManager", "plotters", "Albers_State_Layer", "color", "internalDynamicColumn"];
	
	/**
	 * 
	 * @param className {String}
	 * @param path {Array} path to the desired location in the session state, if no path is provided
	 * 					   it defaults to the root of the session state
	 * 
	 * @return {string}
	 */
	this.generateUniqueName = function(className, path) {
		if(!ws.weave)
			return null;
		return ws.weave.path(path || []).getValue('generateUniqueName')(className);
	};
	//fetches the path of the given node in the weave tree
	this.fetchNodePath = function(input_node){
		var deferred = $q.defer();
		
		//if(ws.cache.previousNodeId == input_node.metadata.weaveEntityId){
		//	console.log("retrieving from cache");
		//	return this.cache.columnReference;
		//}
		//else{
		//	console.log("making fresh call");
			
			if(ws.weave && ws.checkWeaveReady()){
					
					var w = new ws.weave.WeaveTreeNode();
					var weaveTreeIsBusy = weave.evaluateExpression(null, '() => WeaveAPI.SessionManager.linkableObjectIsBusy(WEAVE_TREE_NODE_LOOKUP[0])');
					var indx = 0;
					
					(function retrievePathOnceReady(){
						nodePath = w.findPath(input_node.dataSourceName, input_node.metadata);
						if(nodePath){
							if(weaveTreeIsBusy()){
								setTimeout(retrievePathOnceReady, 500);
							}
							else{
								indx = (nodePath.length) - 2;
								//console.log(nodePath[indx].getChildren());
								var children = nodePath[indx].getChildren();
								//ws.cache.columnReference = children;//caching children
								//ws.cache.previousNodeId = input_node.metadata.weaveEntityId;//caching previously used node id
								rootScope.$safeApply(function() {
				    				deferred.resolve(children);
				    			});
							}
								
						}
						else{
							setTimeout(retrievePathOnceReady, 500);
						}
						
					})();
				}
			
			return deferred.promise;
		//}
		
	};
	
	this.tileWindows = function() {
		if(!ws.checkWeaveReady())
			return;
		ws.weave.path()
		 .libs("weave.ui.DraggablePanel")
		 .exec("DraggablePanel.tileWindows()");
	};
	
	
	this.setWeaveWindow = function(window) {
		var weave;
		if(!window) {
			ws.weave = null;
			return;
		}
		try {
			ws.weaveWindow = window;
			weave = window.document.getElementById('weave');

			if (weave && weave.WeavePath && weave.WeavePath.prototype.pushLayerSettings) {
				ws.weave = weave;
				console.log("weave and its api are ready");
				rootScope.$safeApply();
			}
			else {
				setTimeout(ws.setWeaveWindow, 50, window);
			}
		} catch (e)
		{
			console.error("fails", e);
		}
    };
    
    this.checkWeaveReady = function(){
    	return ws.weave && ws.weave.WeavePath && ws.weave._jsonCall;
    };
    
	this.setWeaveWindow(window);
	
	this.addCSVData = function(csvData, aDataSourceName, queryObject) {
		var dataSourceName = "";
		if(!aDataSourceName)
			dataSourceName = ws.generateUniqueName("CSVDataSource");
		else
			dataSourceName = ws.generateUniqueName(aDataSourceName);
	
		ws.weave.path(dataSourceName)
			.request('CSVDataSource')
			.vars({rows: csvData})
			.exec('setCSVData(rows)');
		for(var i in csvData[0])
		{
			queryObject.resultSet.unshift({ id : csvData[0][i], title: csvData[0][i], dataSourceName : dataSourceName});
		}
	};
	
	// weave path func
	var setQueryColumns = function(mapping) {
		this.forEach(mapping, function(column, propertyName) {
			//console.log("column", column);
			//console.log("propertyName", propertyName);
			if (Array.isArray(column))
			{
				this.push(propertyName).call(setQueryColumns, column);
			}
			else if (ws.checkWeaveReady() && column)
			{
				if(column.id == "" || angular.isUndefined(column.id))
					return;
				this.push(propertyName).setColumn(column.id, column.dataSourceName);
			}
		});
		if (Array.isArray(mapping))
			while (this.getType(mapping.length))
				this.remove(mapping.length);
		return this;
	};
	
	//returns a list of visualization tools currently open in Weave
	this.listOfTools = function(){
		var tools = [];
		if(ws.checkWeaveReady()){
			tools =  ws.weave.path().libs('weave.api.ui.IVisTool').getValue('getNames(IVisTool)');
		}

		return tools;
	};

	Object.defineProperty(this, "toolsEnabled", {get: this.listOfTools});
	
	this.getSelectableAttributes = function(toolName, vizTool){
		
		var selAttributes =[];
		
		if(ws.checkWeaveReady()){
			if(vizTool == 'MapTool'){//because we're naming the plot layers here
				var plotLayers = ws.weave.path(vizTool, 'children', 'visualization', 'plotManager', 'plotters').getNames();
				
				for(var i in plotLayers)
				{
					var attrs = ws.weave.path(vizTool, 'children', 'visualization', 'plotManager', 'plotters', plotLayers[i]).getValue('getSelectableAttributeNames()');
					for(var j in attrs){
						selAttributes.push({plotLayer : plotLayers[i], title : attrs[j]});
					}
				}
				
			}
			else{
				
				var attrs = ws.weave.path(vizTool, 'children', 'visualization', 'plotManager', 'plotters', 'plot').getValue('getSelectableAttributeNames()');
				for(var j in attrs){
					selAttributes.push({plotLayer : 'plot', title : attrs[j]});
				}
			}
			

		}
		
		
		return selAttributes;
	};
	
	/**
	 * this function sets the selected attribute(selected in the attribute widget tool) in the required tool
	 * @param toolName the tool whose attribute is to be set
	 * @param vizAttribute the attribute of tool to be set
	 * @param attrObject the object used for setting vizAttribute
	 */
	
	this.setVizAttribute = function(originalTool, toolName, vizAttribute, attrObject){
		if((ws.checkWeaveReady))
			{	
				var selectedColumn;
				//1. collect columns find the right one
				var columnObjects = ws.weave.path(originalTool).request('AttributeMenuTool').push('choices').getState();
				for (var i in columnObjects)
				{
					if(columnObjects[i].sessionState.metadata == attrObject.title)
						selectedColumn = columnObjects[i].objectName;
				}
				//2. set it
				ws.weave.path(originalTool).request('AttributeMenuTool').state({selectedAttribute : selectedColumn});
				
			}
	};
	
	this.AttributeMenuTool = function(state, aToolName){
		
		if (!ws.checkWeaveReady())
		{
			ws.setWeaveWindow(window);
			return;
		}

		var toolName = aToolName || ws.generateUniqueName("AttributeMenuTool");
		if(state && state.enabled){
			ws.weave.path(toolName).request('AttributeMenuTool')
			//.state({ panelX : "50%", panelY : "0%", panelHeight: "15%", panelWidth :"50%",  panelTitle : state.title, enableTitle : true})
			.call(setQueryColumns, {choices: state.columns});
			
			if(state.vizAttribute && state.selectedVizTool)
				ws.weave.path(toolName).request('AttributeMenuTool')
				.state({targetAttribute : state.vizAttribute.title , targetToolPath : [state.selectedVizTool]});
		}
		else{//if the tool is disabled
			ws.weave.path(toolName).remove();
		}
		
		return toolName;
	};
	
	this.BarChartTool = function(state, aToolName){

		if (!ws.checkWeaveReady())
		{
			ws.setWeaveWindow(window);
			return;
		}

		var toolName = aToolName || ws.generateUniqueName("BarChartTool");
		
		if(state && state.enabled){//if enabled
			//create tool
			//panelX : "0%", panelY : "50%", panelTitle : state.title, enableTitle : true,
			ws.weave.path(toolName)
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
			//capture session state
			queryService.queryObject.weaveSessionState = ws.getSessionStateObjects();
			//tiling
			ws.tileWindows();
		}
		else{//if the tool is disabled
			ws.weave.path(toolName).remove();
		}
		
		return toolName;
	};
	
	this.MapTool = function(state, aToolName){

		if (!ws.checkWeaveReady())
		{
			ws.setWeaveWindow(window);
			return;
		}

		var toolName = aToolName || ws.generateUniqueName("MapTool");

		if(state && state.enabled){//if enabled
			//create tool
			ws.weave.path(toolName).request('MapTool');
			//.state({ panelX : "0%", panelY : "0%", panelTitle : state.title, enableTitle : true });
			
			//STATE LAYER
			if(state.stateGeometryLayer)
			{
				var stateGeometry = state.stateGeometryLayer;

				ws.weave.path(toolName).request('MapTool')
				.push('children', 'visualization', 'plotManager', 'plotters')
				.push('Albers_State_Layer').request('weave.visualization.plotters.GeometryPlotter')
				.push('line', 'color', 'defaultValue').state('0').pop()
				.call(setQueryColumns, {geometryColumn: stateGeometry});
				
				if(state.useKeyTypeForCSV)
				{
					if(state.labelLayer)
					{
						ws.weave.setSessionState([state.labelLayer.dataSourceName], {"keyType" : stateGeometry.keyType});
					}
				}
				
			}
			else{//to remove state layer
				
				if($.inArray('Albers_State_Layer',ws.weave.path().getNames()))//check if the layer exists and then remove it
					ws.weave.path(toolName, 'children', 'visualization', 'plotManager', 'plotters', 'Albers_State_Layer').remove();
			}
			
			
			//COUNTY LAYER
			if(state.countyGeometryLayer)
			{
				var countyGeometry = state.countyGeometryLayer;
				
				ws.weave.path(toolName).request('MapTool')
				.push('children', 'visualization', 'plotManager', 'plotters')
				.push('Albers_County_Layer').request('weave.visualization.plotters.GeometryPlotter')
				.push('line', 'color', 'defaultValue').state('0').pop()
				.call(setQueryColumns, {geometryColumn : countyGeometry});
			
				//TODO change following
				//done for handling albers projection What about other projection?
				ws.weave.path(toolName, 'projectionSRS').state(stateGeometry.projection);
				ws.weave.path(toolName, 'children', 'visualization', 'plotManager', 'layerSettings', 'Albers_County_Layer', 'alpha').state(0);
			}
			else{//to remove county layer
				
				if($.inArray('Albers_County_Layer',ws.weave.path().getNames()))//check if the layer exists and then remove it
					ws.weave.path(toolName, 'children', 'visualization', 'plotManager', 'plotters', 'Albers_County_Layer').remove();
			}
			
			
			//LABEL LAYER
			if(state.labelLayer && state.stateGeometryLayer)
			{
				var labelLayer = state.labelLayer;
				//ws.weave.setSessionState([labelLayer.dataSourceName], {keyColName : "fips"});
				
				var stateGeometryLayer = state.stateGeometryLayer;
				
				ws.weave.path(toolName).request('MapTool')
				.push('children', 'visualization', 'plotManager','plotters')
				.push('stateLabellayer').request('weave.visualization.plotters.GeometryLabelPlotter')
				.call(setQueryColumns, {geometryColumn : stateGeometryLayer})
				.call(setQueryColumns, {text : labelLayer});
			}
			
			//LAYER ZOOM
			if(state.zoomLevel)
				{
					ws.weave.path('MapTool','children', 'visualization', 'plotManager').vars({myZoom: state.zoomLevel}).exec('setZoomLevel(myZoom)');
					
					//for demo
					if(state.zoomLevel > 3 && state.countyGeometryLayer)
					{
						ws.weave.path(toolName, 'children', 'visualization', 'plotManager', 'layerSettings', 'Albers_County_Layer', 'alpha').state(1);
			
					}
					else{
						ws.weave.path(toolName, 'children', 'visualization', 'plotManager', 'layerSettings', 'Albers_County_Layer', 'alpha').state(0);
					}
					//for demo end
				}
			
			
			//capture session state
			queryService.queryObject.weaveSessionState = ws.getSessionStateObjects();
			//tiling
			ws.tileWindows();
		}
		else{//if the tool is disabled
			ws.weave.path(toolName).remove();
		}
		
		return toolName;
	};

	this.ScatterPlotTool = function(state, aToolName){
		
		if (!ws.checkWeaveReady())
		{
			ws.setWeaveWindow(window);
			return;
		}
		
		var toolName = aToolName || ws.generateUniqueName("ScatterPlotTool");

		if(state && state.enabled){//if enabled
			//create tool
			ws.weave.path(toolName).request('ScatterPlotTool')
			//.state({ panelTitle : state.title, enableTitle : true});
			
			if(state.X){
				 ws.weave.path(toolName).request('ScatterPlotTool')
				.push('children', 'visualization','plotManager', 'plotters', 'plot')
				.push('dataX').setColumn(state.X.metadata, state.X.dataSourceName);
			}
			else{
				 ws.weave.path(toolName).request('ScatterPlotTool')
					.push('children', 'visualization','plotManager', 'plotters', 'plot')
					.push('dataX').state('null');
			}
			
			if(state.Y){
				ws.weave.path(toolName).request('ScatterPlotTool')
				.push('children', 'visualization','plotManager', 'plotters', 'plot')
				.push('dataY').setColumn(state.Y.metadata, state.Y.dataSourceName);
			}
			else{
				 ws.weave.path(toolName).request('ScatterPlotTool')
					.push('children', 'visualization','plotManager', 'plotters', 'plot')
					.push('dataY').state('null');
			}
			//capture session state
			queryService.queryObject.weaveSessionState = ws.getSessionStateObjects();
			//tiling
			ws.tileWindows();
		}
		else {//if the tool is disabled
			ws.weave.path(toolName).remove();
		}
		
		return toolName;
	};
	
	this.DataTableTool = function(state, aToolName){

		if (!ws.checkWeaveReady())
		{
			ws.setWeaveWindow(window);
			return;
		}

		var toolName = aToolName || ws.generateUniqueName("DataTableTool");
		
		if(state && state.enabled){//if enabled			
			//create tool
			ws.weave.path(toolName).request('AdvancedTableTool')
			//.state({ panelX : "50%", panelY : "0%", panelTitle : state.title, enableTitle : true})
			.push("columns").setColumns(state && state.columns && state.columns.length ? state.columns.map(function(column) {
				return column.metadata;
			}) : {}, state && state.columns && state.columns[0] ? state.columns[0].dataSourceName : ""); 
			
			// empty columns
			if(state.columns && !state.columns.length)
				weave.path(toolName).request("AdvancedTableTool").push("columns").state({});
			//capture session state
			queryService.queryObject.weaveSessionState = ws.getSessionStateObjects();
			//tiling
			ws.tileWindows();
		}
		else{//if the tool is disabled
			ws.weave.path(toolName).remove();
		}
		
		return toolName;
	};
	
	this.DataFilterTool = function(state, aToolName) {
		
	};

//		
	this.SummaryAnnotation = function (state, summaryName) {

	    var toolName = summaryName || ws.generateUniqueName("SummaryBox");

	    if (!ws.checkWeaveReady()) {

	        ws.setWeaveWindow(window);

	        return;

	    }

	    if (state && state.enabled) { //when auto-generation checked
	        if (state.generated) { //content generation enabled
	            //if data-source exists - contents come from WeaveAnalystDataSource
	            if (ws.weave.path("WeaveAnalystDataSource").getType()) {
	                var script;
	                var inputs;
	                var inputString = "Inputs : ";
	                script = "Script : " + ws.weave.path("WeaveAnalystDataSource").push('scriptName').getState();
	                inputs = ws.weave.path("WeaveAnalystDataSource").push("inputs").getNames();

	                for (var i = 0; i < inputs.length; i++) {
	                    inputString += inputs[i] + " , ";
	                }

	                if (i == inputs.length)
	                    inputString = inputString.substr(0, inputString.lastIndexOf(','));

	                state.content = script + "\n" + inputString;
	                ws.weave.path(toolName).request("SessionedTextBox").push("htmlText").state(state.content);

	            } else { //when no data-source: contents come from UI inputs
	                ws.weave.path(toolName).request("SessionedTextBox").push("htmlText").state(state.content);
	            }

	        } else {
	            ws.weave.path(toolName).request("SessionedTextBox").push("htmlText").state(state.content);
	        }
	    } else {
	        ws.weave.path(toolName).remove();
	    }



	};

	this.ColorColumn = function ()
	{
		// stub for compat;
	};
	
	this.setColorGroup = function(toolName, groupName, columnInfo){
		
		var toolType = ws.weave.path(toolName).getType();
		var dynamicColumnPath;
		
		console.log("tooltype", toolType);
		
		switch(toolType){
			case("weave.visualization.tools::ScatterPlotTool"):
					dynamicColumnPath = ws.weave.path(toolName).push(this.ScatterPlot_Path);
					break;
			case("weave.visualization.tools::MapTool"):
					dynamicColumnPath = ws.weave.path(toolName).push(this.MapTool_Path);
					break;
			case("weave.visualization.tools::CompoundBarChartTool"):
					dynamicColumnPath = ws.weave.path(toolName).push(this.BarchartTool_Path);
					break;
		
		}
		
		console.log(dynamicColumnPath.getPath());
		dynamicColumnPath.vars({name: groupName}).getValue("ColumnUtils.unlinkNestedColumns(this); globalName = name");
		ws.weave.path(groupName).getValue("ColumnUtils.hack_findInternalDynamicColumn(this)").setColumn(columnInfo.metadata, columnInfo.dataSourceName);
	};
	
//	{
//		var dynamicColumnPath = ws.weave.path(tool).pushPlotter().push('dynamicColorColumn');
//		//ws.weave.path(groupName).request('ColorColumn').setColumn(columnInfo.metadata, columnInfo.dataSourceName);
//		dynamicColumnPath.vars({name: groupName}).exec("ColumnUtils.unlinkNestedColumns(this); globalName = name");
//		ws.weave.path(groupName).getValue("ColumnUtils.hack_findInternalDynamicColumn(this)").setColumn(columnInfo.metadata, columnInfo.dataSourceName);
//	};

	this.getColorGroups = function(){
		return	ws.weave.path().getValue('getNames(ColorColumn)');
	};
	
	this.cleanupColorGroups = function()
	{
		return;
	};

	this.keyColumn = function(state){

		if (!ws.checkWeaveReady())
		{
			ws.setWeaveWindow(window);
			return;
		}

		if(state.keyColumn)
		{
			ws.weave.setSessionState([state.keyColumn.dataSourceName], {keyColName : state.keyColumn.metadata.title});
			//capture session state
			queryService.queryObject.weaveSessionState = ws.getSessionStateObjects();
		}
	};
	
	//returns session state of Weave as objects
	this.getSessionStateObjects = function(){
		return ws.weave.path().getState();
	};
	
	//returns session state of Weave as base64Encoded string
	this.getBase64SessionState = function()
	{
		return ws.weave.path().getValue("\
		        var e = new 'mx.utils.Base64Encoder'();\
		        e.encodeBytes( Class('weave.Weave').createWeaveFileContent(true) );\
		        return e.drain();\
		    ");
	};
	
	//returns session state by decoding a base64Encoded string representation of the Weave session state 
	this.setBase64SessionState = function(base64encodedstring)
	{
		ws.weave.path()
		.vars({encoded: base64encodedstring})
		.getValue("\
	        var d = new 'mx.utils.Base64Decoder'();\
			var decodedStuff = d.decode(encoded);\
			var decodeBytes =  d.toByteArray();\
	      Class('weave.Weave').loadWeaveFileContent(decodeBytes);\
	    ");
	};
	
	this.clearSessionState = function(){
		ws.weave.path().state(['WeaveDataSource']);
	};
	
	//this function creates the CSV data format needed to create the CSVDataSource in Weave
	/*[
	["k","x","y","z"]
	["k1",1,2,3]
	["k2",3,4,6]
	["k3",2,4,56]
	] */
	/**
	 * @param resultData the actual data values
	 * @param columnNames the names of the result columns returned
	 */
	this.createCSVDataFormat = function(resultData, columnNames){
		var columns = resultData;


		var final2DArray = [];

	//getting the rowCounter variable 
		var rowCounter = 0;
		/*picking up first one to determine its length, 
		all objects are different kinds of arrays that have the same length
		hence it is necessary to check the type of the array*/
		var currentRow = columns[0];
		if(currentRow.length > 0)
			rowCounter = currentRow.length;
		//handling single row entry, that is the column has only one record
		else{
			rowCounter = 1;
		}

		var columnHeadingsCount = 1;

		rowCounter = rowCounter + columnHeadingsCount;//we add an additional row for column Headings

		final2DArray.unshift(columnNames);//first entry is column names

			for( var j = 1; j < rowCounter; j++)
			{
				var tempList = [];//one added for every column in 'columns'
				for(var f =0; f < columns.length; f++){
					//pick up one column
					var currentCol = columns[f];
					if(currentCol.length > 0)//if it is an array
					//the second index in the new list should coincide with the first index of the columns from which values are being picked
						tempList[f]= currentCol[j-1];
					
					//handling single record
					else 
					{
						tempList[f] = currentCol;
					}

				}
				final2DArray[j] = tempList;//after the first entry (column Names)
			}

			return final2DArray;
	};
}]);