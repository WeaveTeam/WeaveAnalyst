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
		that.repo_pkgs = [];//list of packages present at a particular repo
		that.cran_mirrors = [];
		that.pkg_objects = {funcs : [], constants : []};//list of functions in a given package
		
		//gets the list of CRAN mirrors
		that.getRMirrors = function(){
			if(that.cran_mirrors.length > 1)
				return that.cran_mirrors;
			else{
				console.log("retrieving CRAN mirrors");
				var deferred = $q.defer();
				
				runQueryService.queryRequest(computationServiceURL, 'runBuiltScripts',["getMirrors.R", null], function(result){
					var mirror_names = result.resultData[0];
					var mirror_urls = result.resultData[3];
					for(var i =0; i< mirror_names.length; i++){
						var mObj = {};
						mObj.name = mirror_names[i];
						mObj.url = mirror_urls[i];
						
						that.cran_mirrors.push(mObj);
					}
					console.log("result", that.cran_mirrors);
					deferred.resolve(that.cran_mirrors);
				},
				function(error){
					deferred.reject(error);
				});
				
				return deferred.promise;
			}
		};
		
		//gets a list from the library folder of the installed R version
		that.getInstalled_R_Packages = function(){
			console.log("retreiving installed R packages");
			that.rInstalled_pkgs = [];
			
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
		
		that.get_packages_at_repo = function(repository){
			
			var deferred = $q.defer();
			runQueryService.queryRequest(computationServiceURL, 'runBuiltScripts', ["getRepoPackages.R", {repo : repository}], function(result){
				that.repo_pkgs = result;
				console.log("repo_pkgs", result);
				deferred.resolve(that.repo_pkgs);
			}, function(error){
				deferred.reject(error);
			});
			
			return deferred.promise;
		};
		
		//gets the objects in a particular package
		that.get_Pkg_Objects = function(package_name){
			if(!package_name)
				return;
			
			var deferred = $q.defer();
			runQueryService.queryRequest(computationServiceURL, 'runBuiltScripts', ["getPackageObjects.R", {packageName : package_name}], function(result){
				console.log("pkg_objects", result);
				
				that.pkg_objects.funcs = result.resultData[0];
				that.pkg_objects.constants = result.resultData[1];
				
				deferred.resolve(that.pkg_objects);
			}, function(error){
				deferred.reject(error);
			});
			
			return deferred.promise;
		};
		
		//verifies the path entered by user or else uses default
		that.verify_Path = function(){
			
		};
	}
})();