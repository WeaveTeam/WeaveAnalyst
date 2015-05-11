/**
 * this service deals with login credentials
 */

var authenticationModule = angular.module('weaveAnalyst.configure.auth', []);
//experimenting with another kind of angular provider factory vs service (works!!)
authenticationModule
.factory('authenticationService',[function authenticationServiceFactory(){
	var authenticationService = {};
	
   
   return authenticationService;
	
}]);
