/**
 * This Service is designed to receive a query object, pre-process an analysis query and processes its results.
 * @author spurushe
 * @author fkamayou
 * 
 **/
(function(){
	angular.module('weaveAnalyst.run', []);

	angular.module('weaveAnalyst.run').service('QueryHandlerService', QueryHandlerService);
	
	function QueryHandlerService (){
		var that = this;
		var nestedFilterRequest = {and : []};
		
		//this function pre-processes filters applied on the input data before being sent to the server
		that.handle_Filters = function(){
			
		};
		
		//this function pre-processes the inputs of a particular computation by wrapping it into a bean
		that.handle_ScriptInput_Options = function(scriptOptions){

	    	var typedInputObjects= [];
	    
	    	for(var key in scriptOptions) {
				var input = scriptOptions[key];
				
				// handle multiColumns. Note that we do this first because type of arrayVariabel == 'object' returns true.
				if(Array.isArray(input)) {
					typedInputObjects.push({
						name : key,
						type : 'dataColumnMatrix',
						value : {
							
							columnIds : $.map(input, function(column) {
								return column.id;
							}), 
							filters : nestedFilterRequest.and.length ? nestedFilterRequest : null,
							namesToAssign : $.map(input, function(column) {
								return column.title;
							})
						}
					});
				} 
				
				// handle single column
				else if((typeof input) == 'object') {
		    		rowsObject.value.columnIds.push(input.id);
	    			rowsObject.value.namesToAssign.push(key);
		    		if($.inArray(rowsObject,typedInputObjects) == -1)//if not present in array before
		    			typedInputObjects.push(rowsObject);
		    	}

				else if ((typeof input) == 'string'){
					typedInputObjects.push({
						name : key, 
						type : 'string',
						value : input
					});
		    	}
		    	else if ((typeof input) == 'number'){// regular number
		    		typedInputObjects.push({
						name : key, 
						type : 'number',
						value : input
					});
		    	} 
		    	else if ((typeof input) == 'boolean'){ // boolean 
		    		typedInputObjects.push({
						name : key, 
						type : 'boolean',
						value : input
					});
		    	}
		    	else{
					console.log("unknown script input type ", input);
				}
	    	}
	    	
	    	return typedInputObjects;
		};
		
		//this function temporarily remaps original data values to new ones without altering the original data 
		that.handle_ColumnRemapping = function(){
			
		};
		
		//runs a pre-processed query (analysis) on the server (in R/STATA etc)
		that.run_query = function(){
			
		};
	};
})();