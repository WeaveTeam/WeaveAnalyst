/**

 * this manager is responsible for maintaining the pipeline of query objects and their execution
 * @author shweta purushe
 * @author sanjay krishna
 */

(function(){
	angular.module('weaveAnalyst.nested_qo').service('QueryManagerService', QueryManagerService);
	
	QueryManagerService.$inject = ['queryService'];
	function QueryManagerService(queryService){
		var that = this;
		

		//create the base query object;
		//there will be a base query object irrespective of new ones added or deleted, one always stays that represents the analysis tab 
		that.native_nested_qo;
		
		//MANAGE QUERY OBJECTS HERE
		
		that._queryMap = {};
		that._queryId = 0;
		
		that.generate_new_Id = function (){
			that._queryId = that._queryId + 1;
			return query_Id;
		};
		
		that.request_Query_Object = function (q_id){
			if(q_id)
				return that._queryMap[q_id];
			else{
				var new_id = that.generate_new_Id();
				var qo = new QueryObject(new_id);
				that._queryMap[new_id] = qo;
				
				return qo;
			}
		};
		
		that.execute_nested_queryObject = function(){
			//use query Service to loop through the qos
		};
		
	}
	
})();