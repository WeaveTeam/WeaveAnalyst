/**
 *this object represents the over arching global object for the Weave Analyst
 *@author shweta purushe 
 */
if(!this.wa)
	this.wa = {};


(function(){
	
	Object.defineProperty(ScriptInputs, 'NS', {
        value: 'wa'
    });

	Object.defineProperty(ScriptInputs, 'CLASS_NAME', {
        value: 'ScriptInputs'
	});
	
	function ScriptInputs (){
		
		 Object.defineProperty(this, 'sessionable', {
	           value: true
	       });
		 
		 Object.defineProperty(this, 'columns', {
			 value : WeaveAPI.SessionManager.registerLinkableChild(this, new weavecore.LinkableVariable([]))
		 });
		 
	}
	
	window.wa.ScriptInputs = ScriptInputs;
})();



(function(){
	
	 Object.defineProperty(QueryObject, 'NS', {
	        value: 'wa'
	    });

	 Object.defineProperty(QueryObject, 'CLASS_NAME', {
	        value: 'QueryObject'
   	});
	    
	    
	function QueryObject (){
		
	 Object.defineProperty(this, 'sessionable', {
           value: true
       });
		
	 Object.defineProperty(this, 'author', {
		 value : WeaveAPI.SessionManager.registerLinkableChild(this, new weavecore.LinkableString(""))
	 });
	 
	 Object.defineProperty(this, 'date', {
		 value : new Date()
	 });
	 
	 Object.defineProperty(this, 'ComputationEngine', {
           value: WeaveAPI.SessionManager.registerLinkableChild(this, new weavecore.LinkableString(""))
       });
	 
	 Object.defineProperty(this, 'scriptSelected', {
		 value : WeaveAPI.SessionManager.registerLinkableChild(this, new weavecore.LinkableString(""))
	 });
		
	 Object.defineProperty(this, 'title', {
		 value : WeaveAPI.SessionManager.registerLinkableChild(this, new weavecore.LinkableString(""))
	 });
	 
	 Object.defineProperty(this, 'scriptOptions', {
		 value : WeaveAPI.SessionManager.registerLinkableChild(this, new wa.ScriptInputs())
	 });
	 
		
	}
	
	window.wa.QueryObject = QueryObject;
	
})();

