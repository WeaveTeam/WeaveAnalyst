AnalysisModule.directive('filter', function(queryService, WeaveService) {
	
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
		templateUrl : 'src/analysis/data_filters/generic_filter.html',
		link : link,
		require : 'ngModel',
		scope : {
			columns : '=',
			ngModel : '='
		},
		controller : function($scope, $filter) {
			
			var pathToFilters = ["defaultSubsetKeyFilter", "filters"];
			
			var weave = WeaveService.weave;
			var filterName = $scope.$parent.filterName;
				
			$scope.filterStyle = ["List", "Combo Box", "Vertical Slider", "Horizontal Slider", "Checklist"];
			$scope.filterOptions = [];
			
			$scope.ngModel.selectedFilterStyle = "Checklist";
			
			$scope.$watch('ngModel.column', function(column) {
				if(column)
				{
					weave.path(pathToFilters).push(filterName, "column").setColumn(column.metadata, column.dataSourceName);
					
					if(column.metadata && column.metadata.aws_metadata) {
						var aws_metadata = angular.fromJson(column.metadata.aws_metadata);
						$scope.filterOptions = aws_metadata.varValues;
					} else {
						options = weave.path(pathToFilters).push(filterName).getValue("StringDataFilterEditor.getChoices(column)");
						$scope.filterOptions = options.map(function(option){
							return { value : option, label : option };
						});
					}
				}
			});
			
//			$scope.ngModel = $scope.$parent.filtersModel[$scope.$parent.$index] || {
//					comboboxModel : [],
//					multiselectModel : [],
//					sliderModel : [],
//					nestedFilter : {},
//			};
//			
//			
//			$scope.$watch('ngModel.column', function(newVal, oldVal) {
//				if(!$scope.ngModel.column || !$scope.ngModel.column.hasOwnProperty("id")) {
//					$scope.filterType = "";
//				}
//			}, true);
//			
//			$scope.$watchCollection('ngModel.multiselectModel', function(newVal, oldVal) {
//				var ngModel = $scope.ngModel.multiselectModel;
//				
//				$scope.ngModel.comboboxModel = [];
//				$scope.ngModel.sliderModel = [];
//
//				if(!ngModel || !ngModel.length)
//					return;
//				
//				$scope.ngModel.nestedFilter = 
//					{
//						cond : {
//							f : $scope.ngModel.column.id,
//							v : ngModel
//						}
//					};
//			});
//			
//			/* combo box controls    */
//			$scope.$watchCollection('ngModel.comboboxModel', function(newVal, oldVal) {
//				
//				var ngModel = $scope.ngModel.comboboxModel;
//				
//				$scope.ngModel.multiselectModel = [];
//				$scope.ngModel.sliderModel = [];
//				
//				if(!ngModel.length)
//					return;
//				
//				var result = [];
//				for(var i in ngModel)
//				{
//					if(ngModel[i] && $scope.filterOptions[i])
//						result.push($scope.filterOptions[i].value);
//				}
//				$scope.ngModel.nestedFilter = 
//					{
//						cond : {
//							f : $scope.ngModel.column.id,
//							v : result
//						}
//					};
//			});
//			
//			/* combo box controls    */
//			$scope.$watchCollection('ngModel.sliderModel', function(newVal, oldVal) {
//
//				var ngModel = $scope.ngModel.sliderModel;
//
//				$scope.ngModel.multiselectModel = [];
//				$scope.ngModel.comboboxModel = [];
//
//				if(!ngModel.length)
//					return;
//				
//				$scope.ngModel.nestedFilter = 
//					{
//						cond : {
//							f : $scope.ngModel.column.id,
//							r : [ngModel]
//						}
//					};
//			});
		}
	};
});