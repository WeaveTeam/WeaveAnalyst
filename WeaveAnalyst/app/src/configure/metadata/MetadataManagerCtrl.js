var metadataModule = angular.module('weaveAnalyst.configure.metadata', []);

// SOURCE: from stack overflow : http://stackoverflow.com/questions/25531961/angularjs-bootstrap-progressbar-max-changing
//adding a decorator that encapsulates the progressbar and bar directives provided by ui-bootstrap
//metadataModule.config(function($provide){
//	var progressDecorator = function($delegate){//$delegate is the original service instance which is decorated
//		var directive = $delegate[0];
//		var compile = directive.compile;
//		var link = directive.link;
//		
//		directive.compile = function(){
//			compile.apply(this,arguments);
//			
//			return function(scope, elem, attr, ctrl){
//				link.apply(this,arguments);
//				
//				if(angular.isDefined(attr.dynamicMax)){
//					attr.$observe('dynamicMax', function(max) {
//			              scope.max = max;
//		              scope.percent = +(100 * scope.value / max).toFixed(2);
//			        }); 
//			}
//			};
//		};//end of compile function
//		
//		return $delegate;
//	};//end of progressIndicator;
//	
//	//the decorator function decorates the given service while instantiating it and returns the decorated service instance
//	$provide.decorator('progressbarDirective', progressDecorator);
//    $provide.decorator('barDirective', progressDecorator);
//	
//});

metadataModule.controller("MetadataManagerCtrl", function(){			

});		


metadataModule.directive('dynatree', function() {
	return {
        link: function(scope, element, attrs) {
        	scope.generateTree(element);
        }
   };	
});