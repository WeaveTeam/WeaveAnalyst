/**
 *this object represents the over arching global object for the Weave Analyst
 *@author shweta purushe 
 */
if(!this.wa)
	this.wa = {};

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
	 
	 Object.defineProperty(this, 'Computation_Engine', {
           value: WeaveAPI.SessionManager.registerLinkableChild(this, new weavecore.LinkableString(""))
       });
	 
	 Object.defineProperty(this, 'script_Selected', {
		 value : WeaveAPI.SessionManager.registerLinkableChild(this, new weavecore.LinkableString(""))
	 });
		
	 Object.defineProperty(this, 'title', {
		 value : WeaveAPI.SessionManager.registerLinkableChild(this, new weavecore.LinkableString(""))
	 });
		
	}
	
	window.wa.QueryObject = QueryObject;
	
})();


