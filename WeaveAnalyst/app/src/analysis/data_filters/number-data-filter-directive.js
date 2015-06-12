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
			
			var filterName = $scope.$parent.filterName;
			
			$scope.ngModel.range = [];
			
			$scope.$watch('ngModel.column', function(column) {
				
				var weave = WeaveService.weave;
				if(column)
				{
					$scope.ngModel.range = [];
					if(weave && WeaveService.checkWeaveReady()) {
						weave.path(pathToFilters).push(filterName, "column").setColumn(column.metadata, column.dataSourceName);

						weave.path(pathToFilters).push(filterName).exec("registerLinkableChild(this, WeaveAPI.StatisticsCache.getColumnStatistics(column))").addCallback(function() {
							var min = this.getValue("EquationColumnLib.getMin(column);") || 0;
							var max = this.getValue("EquationColumnLib.getMax(column);") || 100;
							// default handle locations
							$scope.sliderOptions = { range:true, min:min, max:max };
							$rootScope.$safeApply();
						});
					}
				} 
			}, true);

			$scope.$watchCollection('ngModel.range', function() {
				weave.path(pathToFilters).push(filterName, "min").state($scope.ngModel.range[0]);
				weave.path(pathToFilters).push(filterName, "max").state($scope.ngModel.range[1]);
			});
			
		}
	};
});