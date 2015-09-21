/**
 *this object represents the over arching global object for the Weave Analyst
 *communicates with the query Object
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
		
		Object.defineProperty(this, 'Computation_Engine', {
           value: WeaveAPI.SessionManager.registerLinkableChild(this, new weavecore.LinkableString(""))
       });
		
	}
	
	this.wa.QueryObject = QueryObject;
	
})();


