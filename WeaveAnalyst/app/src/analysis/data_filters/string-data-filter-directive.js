AnalysisModule.directive('stringDataFilter', function(queryService, WeaveService) {
	
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
		controller : function($scope, $filter, queryService) {
			
			var pathToFilters = ["defaultSubsetKeyFilter", "filters"];
			
			var weave = WeaveService.weave;
			var filterName = $scope.$parent.filterName;
			
			var getFilterType = function (length) {
				if(length < 9)
					return "checklist";
				else
					return "combobox";
			};
			
			$scope.filterOptions = [];
			$scope.ngModel.stringValues = [];
			$scope.ngModel.comboboxModel = [];
			$scope.ngModel.checklistModel = [];
			
			$scope.ngModel.selectedFilterStyle = "checklist";
			
			$scope.$watch('ngModel.selectedFilterStyle', function(selectedFilterStyle) {
				if(selectedFilterStyle == "checklist")
				{
					//$scope.ngModel.comboboxModel = [];
				} else if(selectedFilterStyle == "combobox")
				{
					//$scope.ngModel.checklistModel = [];
				}
			})
			$scope.$watch('ngModel.column', function(column) {
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
							$scope.ngModel.selectedFilterStyle = getFilterType($scope.filterOptions.length);
							$scope.$apply();
						});
						
					}
				}
			});
			
			$scope.$watchCollection('ngModel.checklistModel', function(checkListModel) {
				$scope.ngModel.stringValues = [];
				for(value in checkListModel) {
					if(checkListModel[value])
					{
						$scope.ngModel.stringValues.push(value);
					}
				}
			});
			
			$scope.$watchCollection('ngModel.comboboxModel', function(comboboxModel) {
				$scope.ngModel.stringValues = comboboxModel.map(function(obj) {
					return obj.value;
				});
			});
			
			$scope.$watchCollection("ngModel.stringValues", function () {
				weave.path(pathToFilters).push(filterName, "stringValues").state($scope.ngModel.stringValues);
			});
		}
	};
});