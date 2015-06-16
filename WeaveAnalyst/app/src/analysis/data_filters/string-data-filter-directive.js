AnalysisModule.directive('stringDataFilter', function(WeaveService) {
	
	function link($scope, element, attrs, ngModelCtrl) {
//		element.draggable({ containment: "parent" }).resizable({
//			 //maxHeight: 150,
//		     maxWidth: 250,
//		     minHeight: 100,
//		     minWidth: 180
//		});
		element.addClass('databox');
		element.width(180);
	}

	return {

		restrict : 'E',
		transclude : true,
		templateUrl : 'src/analysis/data_filters/string_data_filter.tpl.html',
		link : link,
		require : 'ngModel',
		scope : {
			columns : '=',
			ngModel : '=',
		},
		controller : function($scope, $filter) {
			
			var pathToFilters = ["defaultSubsetKeyFilter", "filters"];
			
			var filterName = $scope.$parent.filterName;
			
			var getFilterType = function (length) {
				if(length < 9)
					return "checklist";
				else
					return "combobox";
			};
			
			$scope.$watch('ngModel.selectedFilterStyle', function(selectedFilterStyle) {
				if(selectedFilterStyle == "checklist")
				{
					console.log("this runs too");
					$scope.ngModel.comboboxModel = [];
				} else if(selectedFilterStyle == "combobox")
				{
					console.log("this runs");
					$scope.ngModel.checklistModel = {};
				}
			});
			
			$scope.$watch('ngModel.column', function(column) {
				
				var weave = WeaveService.weave;
				if(weave && WeaveService.checkWeaveReady()) {
					if(column)
					{
						weave.path(pathToFilters).push(filterName, "column").setColumn(column.metadata, column.dataSourceName);
						
						if(column.metadata && column.metadata.aws_metadata) {
							var aws_metadata = angular.fromJson(column.metadata.aws_metadata);
							$scope.filterOptions = aws_metadata.varValues || [];
							$scope.ngModel.selectedFilterStyle = getFilterType($scope.filterOptions.length);
						} else {
							var options = [];
							weave.path(pathToFilters).push(filterName).addCallback(function() {
								options = this.getValue("StringDataFilterEditor.getChoices(column)");
								$scope.filterOptions = options.map(function(option){
									return { value : option, label : option };
								});
								$scope.$apply();
							});
						}
					} else {
						$scope.ngModel.stringValues = [];
						$scope.ngModel.comboboxModel = [];
						$scope.ngModel.checklistModel = {};
					}
				}
			});
			
			$scope.$watch('ngModel.checklistModel', function(checklistModel) {
				$scope.ngModel.stringValues = [];
				for(value in checklistModel) {
					if(checklistModel[value])
					{
						$scope.ngModel.stringValues.push(value);
					}
				}
			}, true);
			
			$scope.$watch('ngModel.comboboxModel', function(comboboxModel) {
				$scope.ngModel.stringValues = comboboxModel.map(function(obj) {
					return obj.value;
				});
			}, true);
			
			$scope.$watch("ngModel.stringValues", function () {
				var weave = WeaveService.weave;
				if(weave && WeaveService.checkWeaveReady())
					weave.path(pathToFilters).push(filterName, "stringValues").state($scope.ngModel.stringValues);
			}, true);
		}
	};
});