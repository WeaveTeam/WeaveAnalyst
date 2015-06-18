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
			
			var filterName = $scope.$parent.filterName;
			$scope.ngModel.sliderOptions = { range:true, min:0, max:100 };
			
			$scope.$watch('ngModel.column', function(column) {
				if(column)
				{
					var pathToFilters = WeaveService.getPathToFilters();
					
					if(pathToFilters) {
						pathToFilters.push(filterName).request("NumberDataFilter").push("column").setColumn(column.metadata, column.dataSourceName);
						pathToFilters.push(filterName).exec("registerLinkableChild(this, WeaveAPI.StatisticsCache.getColumnStatistics(column))").addCallback(function() {
							var min = this.getValue("EquationColumnLib.getMin(column);");
							var max = this.getValue("EquationColumnLib.getMax(column);");
							if(min && max) {
								$scope.sliderOptions = { range:true, min:min, max:max };
							}
							$rootScope.$safeApply();
						});
					}
				} else {
					$scope.ngModel.range = [];	
				}
			}, true);

			$scope.$watch('sliderOptions', function(newVal, oldVal) {
				// reset the slider when the slider options change
				if(angular.equals(newVal, oldVal))
					return;
				
				$scope.ngModel.range = [Math.floor(1/3*(newVal.max-newVal.min) + newVal.min), Math.floor(2/3*(newVal.max-newVal.min) + newVal.min)];
			}, true);
			
			$scope.$watchCollection('ngModel.range', function() {
				if($scope.ngModel.range && $scope.ngModel.length == 2) {
					var pathToFilters = WeaveService.getPathToFilters();
					
					if(pathToFilters) {
						pathToFilters.push(filterName).request("NumberDataFilter").push("min").state($scope.ngModel.range[0]);
						pathToFilters.push(filterName).request("NumberDataFilter").push("max").state($scope.ngModel.range[1]);
					}
				}
			});
		}
	};
});