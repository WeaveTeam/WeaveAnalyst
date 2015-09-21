/**
 *this is a class representation of a query object which can be used to instantiate query objects.  
 */
if(!this.wa)
	this.wa = {};

(function (){
	
	//constructor
	function QueryObject (){
		//config properties not needed in computation or query object storage
		this.config = {
				validationStatus : "test",
				isQueryValid : false,
				hideQueryObjectPanel : true
		};
		
		this._title =  null;
		this._date = new Date();
		this._author; 
		this._computationEngine;
		
		//SCRIPT OPTIONS
		this._scriptSelected;
		this._script_Input_Options = {};
		this._script_Output_Options = {};
		
		//FILTERS
		this._filters = [];
		this._treeFilters = [];
		this._geographyFilter = {
			stateColumn:{},
			nestedStateColumn : {},
			countyColumn:{},
			geometrySelected : null,
			selectedStates : null,
			selectedCounties : null
		};
		
		//Computation RESULTS
		this._resultSet = [];
		//WEAVE SESSION STATE
		this._weaveSessionState;
		
		//Column remapping
		this._columnRemapObject ;
		
		//prevention of re-id
		this._reidentification_Object = {
			idPrevention :false,
			threshold : 0
		};
		
		var p = QueryObject.prototype;
		
		p.set_compEngine = function(value){
			this._computationEngine = value;
		};
		
		window.wa.QueryObject = QueryObject;
		
	}
})();