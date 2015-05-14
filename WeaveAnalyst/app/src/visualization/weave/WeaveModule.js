(function(){
	angular.module('weaveAnalyst.WeaveModule', []);
	angular.module('weaveAnalyst.WeaveModule').service("WeaveService", WeaveService);

	WeaveService.$inject = ['$q','$rootScope','runQueryService', 'dataServiceURL','queryService'];
	
	function WeaveService ($q, rootScope, runQueryService, dataServiceURL, queryService){
		var that = this;
		
		that.weave;
		that.weaveWindow = window;
		that.analysisWindow = window;
		that.toolsEnabled = [];
		that.columnNames = [];
		
		
		that.generateUniqueName = function(className) {
			if(!that.weave)
				return null;
			return that.weave.path().getValue('generateUniqueName')(className);
		};
		
		that.tileWindothat = function() {
			if(!that.checkWeaveReady())
				return;
			that.weave.path()
			 .libs("weave.ui.DraggablePanel")
			 .exec("DraggablePanel.tileWindothat()");
		};
		
		that.setWeaveWindow = function(window) {
			var weave;
			if(!window) {
				that.weave = null;
				return;
			}
			try {
				that.weaveWindow = window;
				weave = window.document.getElementById('weave');

				if (weave && weave.WeavePath && weave.WeavePath.prototype.pushLayerSettings) {
					that.weave = weave;
					console.log("weave and its api are ready");
					rootScope.$safeApply();
				}
				else {
					setTimeout(that.setWeaveWindow, 50, window);
				}
			} catch (e)
			{
				console.error("fails", e);
			}
	    };
	    
	    that.setWeaveWindow(window);
		
	    
	    that.checkWeaveReady = function(){
	    	return that.weave && that.weave.WeavePath && that.weave._jsonCall;
	    };
	    
	    that.addCSVData = function(csvData, aDataSourceName, queryObject) {
			var dataSourceName = "";
			if(!aDataSourceName)
				dataSourceName = that.generateUniqueName("CSVDataSource");
			else
				dataSourceName = that.generateUniqueName(aDataSourceName);
		
			that.weave.path(dataSourceName)
				.request('CSVDataSource')
				.vars({rothat: csvData})
				.exec('setCSVData(rothat)');
			for(var i in csvData[0])
			{
				queryObject.resultSet.unshift({ id : csvData[0][i], title: csvData[0][i], dataSourceName : dataSourceName});
			}
		};
		
		// weave path func
		that.setQueryColumns = function(mapping) {
			this.forEach(mapping, function(column, propertyName) {
				//console.log("column", column);
				//console.log("propertyName", propertyName);
				if (Array.isArray(column))
				{
					this.push(propertyName).call(setQueryColumns, column);
				}
				else if (that.checkWeaveReady() && column)
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
		that.listOfTools = function(){
			if(that.checkWeaveReady()){
				var tools =  that.weave.path().libs('weave.api.ui.IVisTool').getValue('getNames(IVisTool)');
			}

			return tools;
		};
		
		that.getSelectableAttributes = function(toolName, vizTool){
			
			var selAttributes =[];
			
			if(that.checkWeaveReady()){
				if(vizTool == 'MapTool'){//because we're naming the plot layers here
					var plotLayers = that.weave.path(vizTool, 'children', 'visualization', 'plotManager', 'plotters').getNames();
					
					for(var i in plotLayers)
					{
						var attrs = that.weave.path(vizTool, 'children', 'visualization', 'plotManager', 'plotters', plotLayers[i]).getValue('getSelectableAttributeNames()');
						for(var j in attrs){
							selAttributes.push({plotLayer : plotLayers[i], title : attrs[j]});
						}
					}
					
				}
				else{
					
					var attrs = that.weave.path(vizTool, 'children', 'visualization', 'plotManager', 'plotters', 'plot').getValue('getSelectableAttributeNames()');
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
		
		that.setVizAttribute = function(originalTool, toolName, vizAttribute, attrObject){
			if((that.checkWeaveReady))
				{	
					var selectedColumn;
					//1. collect columns find the right one
					var columnObjects = that.weave.path(originalTool).request('AttributeMenuTool').push('choices').getState();
					for (var i in columnObjects)
					{
						if(columnObjects[i].sessionState.metadata == attrObject.title)
							selectedColumn = columnObjects[i].objectName;
					}
					//2. set it
					that.weave.path(originalTool).request('AttributeMenuTool').state({selectedAttribute : selectedColumn});
					
				}
		};

		/////////////////////////
		//TOOLS
		/////////////////////////
		that.AttributeMenuTool = function(state, aToolName){
			
			var toolName = aToolName || that.generateUniqueName("AttributeMenuTool");
			if(state && state.enabled){
				if(that.checkWeaveReady()){
					
					that.weave.path(toolName).request('AttributeMenuTool')
					.state({ panelX : "50%", panelY : "0%", panelHeight: "15%", panelWidth :"50%",  panelTitle : state.title, enableTitle : true})
					.call(setQueryColumns, {choices: state.columns});
					
					if(state.vizAttribute && state.selectedVizTool)
						that.weave.path(toolName).request('AttributeMenuTool')
						.state({targetAttribute : state.vizAttribute.title , targetToolPath : [state.selectedVizTool]});
				}
				else{
					that.setWeaveWindow(window);
				}
			}
			else{//if the tool is disabled
				if(that.checkWeaveReady())
					that.weave.path(toolName).remove();
			}
			
			return toolName;
		};
		
		that.BarChartTool = function(state, aToolName){
			var toolName = aToolName || that.generateUniqueName("BarChartTool");
			
			if(state && state.enabled){//if enabled
				if(that.checkWeaveReady())//if weave is ready
					{
						//add to the enabled tools collection
						if($.inArray(toolName, this.toolsEnabled) == -1)
							this.toolsEnabled.push(toolName);
						//create tool
						that.weave.path(toolName)
						.request('CompoundBarChartTool')
						.state({ panelX : "0%", panelY : "50%", panelTitle : state.title, enableTitle : true, showAllLabels : state.showAllLabels })
						.push('children', 'visualization', 'plotManager', 'plotters', 'plot')
						.call(setQueryColumns, {
							sortColumn : state.sort,
							labelColumn : state.label,
							heightColumns : state.heights,
							positiveErrorColumns : state.posErr,
							negativeErrorColumns : state.negErr
						});
						//capture session state
						queryService.queryObject.weaveSessionState = that.getSessionStateObjects();
					}
				else{//if weave not ready
					//setTimeout(that.setWeaveWindow, 50, that.analysisWindow);
					that.setWeaveWindow(window);
				}
			}
			else{//if the tool is disabled
				if(that.checkWeaveReady())
					{
						//remove from enabled tool collection
						if($.inArray(toolName, this.toolsEnabled) != -1){
							var index = this.toolsEnabled.indexOf(toolName);
							this.toolsEnabled.splice(index, 1);
						}
						that.weave.path(toolName).remove();
					}
			}
			
			return toolName;
		};
		
		that.ScatterPlotTool = function(state, aToolName){
			
			var toolName = aToolName || that.generateUniqueName("ScatterPlotTool");
			if(state && state.enabled){//if enabled
				
				if(that.checkWeaveReady())//if weave is ready
					{
						//add to the enabled tools collection
						if($.inArray(toolName, this.toolsEnabled) == -1)
							this.toolsEnabled.push(toolName);
						//create tool
						that.weave.path(toolName).request('ScatterPlotTool')
						.state({ panelX : "50%", panelY : "50%", panelTitle : state.title, enableTitle : true})
						.push('children', 'visualization','plotManager', 'plotters', 'plot')
						.call(setQueryColumns, {dataX : state.X, dataY : state.Y});
						//capture session state
						queryService.queryObject.weaveSessionState = that.getSessionStateObjects();
					}
				else{//if weave not ready
					that.setWeaveWindow(window);
				}
			}
			else{//if the tool is disabled
				if(that.checkWeaveReady() && state)
					{
						//remove from enabled tool collection
						if($.inArray(toolName, this.toolsEnabled) != -1){
							var index = this.toolsEnabled.indexOf(toolName);
							this.toolsEnabled.splice(index, 1);
						}
						that.weave.path(toolName).remove();
					}
			}
			
			return toolName;
		};
		
		that.DataTableTool = function(state, aToolName){

			var toolName = aToolName || that.generateUniqueName("DataTableTool");
			
			if(state && state.enabled){//if enabled
				if(that.checkWeaveReady())//if weave is ready
					{
						//add to the enabled tools collection
						if($.inArray(toolName, this.toolsEnabled) == -1)
							this.toolsEnabled.push(toolName);
						//create tool
						that.weave.path(toolName).request('AdvancedTableTool')
						.state({ panelX : "50%", panelY : "0%", panelTitle : state.title, enableTitle : true})
						.call(setQueryColumns, {columns: state.columns});
						//capture session state
						queryService.queryObject.weaveSessionState = that.getSessionStateObjects();
					}
				else{//if weave not ready
					that.setWeaveWindow(window);
				}
			}
			else{//if the tool is disabled
				if(that.checkWeaveReady())
					{
						//remove from enabled tool collection
						if($.inArray(toolName, this.toolsEnabled) != -1){
							var index = this.toolsEnabled.indexOf(toolName);
							this.toolsEnabled.splice(index, 1);
						}
						that.weave.path(toolName).remove();
					}
			}
			
			return toolName;
		};
		
		that.ColorColumn = function(state){
			if(state.column){//if enabled
				
				if(that.checkWeaveReady())//if weave is ready
					{
						//create color column
						that.weave.path('defaultColorDataColumn').setColumn(state.column.id, state.column.dataSourceName);
						
						//hack for demo
//						if(state.column2 && state.column3){
//							console.log("getting columns together", state.column2, state.column3);
//							//gets their ids
//							//call modified combinedColumnfunction
//							that.weave.path('defaultColorDataColumn', 'internalDynamicColumn', null)
//							  .request('CombinedColumn')
//							  .push('columns')
//							  .setColumns([ state.column3.id, state.column2.id]);
//						}
						//hack for demo end
						
						//handle color legend
						if(state.showColorLegend)//add it
						{
							that.weave.path("ColorBinLegendTool").request('ColorBinLegendTool')
							.state({panelX : "80%", panelY : "0%"});
						}
						else{//remove it
							that.weave.path("ColorBinLegendTool").remove();
						}
						//capture session state
						queryService.queryObject.weaveSessionState = that.getSessionStateObjects();
					}
				else{//if weave not ready
					that.setWeaveWindow(window);
				}
			}
			else{//if the tool is disabled
			}
			
		};
		
		that.keyColumn = function(state){
			if(state.keyColumn)
			{
				if(that.checkWeaveReady()){
					
					that.weave.setSessionState([state.keyColumn.dataSourceName], {keyColName : state.keyColumn.id});
					//capture session state
					queryService.queryObject.weaveSessionState = that.getSessionStateObjects();
				}
				else{//if weave is not ready
					that.setWeaveWindow(window);
				}
			}
		};
		
		//returns session state of Weave as objects
		that.getSessionStateObjects = function(){
			return that.weave.path().getState();
		};
		
		//returns session state of Weave as base64Encoded string
		that.getBase64SessionState = function()
		{
			return that.weave.path().getValue("\
			        var e = new 'mx.utils.Base64Encoder'();\
			        e.encodeBytes( Class('weave.Weave').createWeaveFileContent(true) );\
			        return e.drain();\
			    ");
		};
		
		//returns session state by decoding a base64Encoded string representation of the Weave session state 
		that.setBase64SessionState = function(base64encodedstring)
		{
			that.weave.path()
			.vars({encoded: base64encodedstring})
			.getValue("\
		        var d = new 'mx.utils.Base64Decoder'();\
				var decodedStuff = d.decode(encoded);\
				var decodeBytes =  d.toByteArray();\
		      Class('weave.Weave').loadWeaveFileContent(decodeBytes);\
		    ");
		};
		
		that.clearSessionState = function(){
			that.weave.path().state(['WeaveDataSource']);
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
		that.createCSVDataFormat = function(resultData, columnNames){
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

	};//end of service definition
}());//end of IIFE




