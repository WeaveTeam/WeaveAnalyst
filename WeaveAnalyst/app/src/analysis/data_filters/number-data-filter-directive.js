AnalysisModule.directive('numberDataFilter', function(WeaveService) {
	
	function link($scope, element, attrs, ngModel, ngModelCtrl) {
//		element.draggable({ containment: "parent"}).resizable({
//			 //maxHeight: 300,
//		     maxWidth: 250,
//		     minHeight: 80,
//		     minWidth: 180
//		});
		element.addClass('databox');
		element.width(180);
		//element.height("100%");
		
	}

	return {
		restrict : 'E',
		transclude : true,
		templateUrl : 'src/analysis/data_filters/number_data_filter.tpl.html',
		link : link,
		require : 'ngModel',
		scope : {
			columns : '=',
			ngModel : '='
		},
		controller : function($scope, $element, $rootScope, $filter) {
			
			var pathToFilters = ["defaultSubsetKeyFilter", "filters"];
			var weave = WeaveService.weave; 
			
			var filterName = $scope.$parent.filterName;

			$scope.columnMin = 0;
			$scope.columnMax = 100;
			
			$scope.$watch('ngModel.column', function(column) {
				if(column)
				{
					weave.path(pathToFilters).push(filterName, "column").setColumn(column.metadata, column.dataSourceName);
					
					weave.path(pathToFilters).push(filterName).addCallback(function() {
						$scope.columnMin = this.getValue("EquationColumnLib.getMin(column);");
						$scope.columnMax = this.getValue("EquationColumnLib.getMax(column);");
						console.log($scope.columnMin);
						console.log($scope.columnMax);
						$scope.$apply();
					});
				}
			});
		}
	};
});