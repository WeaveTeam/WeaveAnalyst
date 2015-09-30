angular.module('weaveAnalyst.AnalysisModule').directive('treeFilter', function() {
	
	function link($scope, element, attrs, ngModel, ngModelCtrl) {

		
	}

	return {
		restrict : 'E',
		transclude : true,
		templateUrl : 'src/analysis/data_filters/tree_filter.tpl.html',
		link : link,
		require : 'ngModel',
		scope : {
			columns : '=',
			ngModel : '='
		},
		controller : function($scope, $element, $rootScope, $filter) {
		
		}
	};
});