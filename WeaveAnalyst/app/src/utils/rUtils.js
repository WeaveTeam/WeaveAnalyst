/**
 *this file contains utlity functions for making the weave analyst support features present in the R GUI
 * @shweta purushe 
 */

(function(){
	angular.module('weaveAnalyst.utils').service('rUtils', rUtils);
	
	rUtils.$inject = ['$q', 'runQueryService', 'computationServiceURL'];
	function rUtils($q, runQueryService, computationServiceURL){
		var that = this; 
		that.rPath; //stores the path of the user's R installation 
		that.rInstalled_pkgs = [];
		
		that.getRMirrors = function(){
			
		};
		
		//gets a list from the library folder of the installed R version
		that.getInstalled_R_Packages = function(){
			console.log("retreiving installed R packages");
			
			var deferred = $q.defer();
			var rpath = "C:\\Program Files\\R\\R-3.1.2\\library";//hard coded for now
			runQueryService.queryRequest(computationServiceURL, 'runBuiltScripts', ["getPackages.R", {path: rpath}],function (result){ 
				var data = result.resultData;
				for(var i = 0; i < data[0].length; i++){//figure way around hard coding
					var obj = {};
					obj.Package = data[0][i];
					obj.Version = data[1][i];
					that.rInstalled_pkgs.push(obj);
				}
				
				deferred.resolve(that.rInstalled_pkgs);
			}, 
			function (error){ deferred.reject(error);}
			);
			
			return deferred.promise;
		};
		
		that.get_package_funcs = function(package_name){
			
		};
	}
})();