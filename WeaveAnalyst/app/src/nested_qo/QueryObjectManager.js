/**
 * this manager is responsible for maintaining the pipeline of query objects and their execution
 * @author shweta purushe
 * @author sanjay krishna
 */
//(function (){
//	
//	function QueryObjectManager(){
//		this._queryMap = {};
//		this._queryId = 0;
//	}
//	
//	var p  = QueryObjectManager.prototype;
//	
//	
//	p.generate_new_Id = function (){
//		this._queryId = this._queryId + 1;
//		return query_Id;
//	};
//	
//	p.request_Query_Object = function (q_id){
//		if(q_id)
//			return this._queryMap[q_id];
//		else{
//			var new_id = generate_new_Id();
//			var qo = new QueryObject(new_id);
//			this._queryMap[new_id] = qo;
//			
//			return qo;
//		}
//	};
//	
//	p.execute_nested_queryObject = function(){
//		
//	};
//	
//	window.wa.nested_qo.QueryObjectManager = QueryObjectManager;//this should happen only once and stored on the global wa object
//})();