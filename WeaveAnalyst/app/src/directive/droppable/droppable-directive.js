AnalysisModule.directive('droppable', function() {
	
	function link($scope, element, attrs, ngModelCtrl) {
		
		var multiple = angular.isDefined(attrs.multiple);
		
		element.droppable({
			drop : function(event, ui) {
				if(ui && ui.helper) {
					var node = ui.helper.data("dtSourceNode");
					var column;
					if(node) {
						column = node.data.column;
						if(column) {
							if(multiple) {
								// double check the selected item is not already in 
								// the selection and that it's the same keyType as the first column
								// otherwise it would cause ng-duplicate error
								if($scope.$select.selected.indexOf(column) < 0) {
									if($scope.$select.selected.length > 0) {
										if($scope.$select.selected[0].metadata.keyType == column.metadata.keyType)
											$scope.$select.selected.push(column);
									} else {
										$scope.$select.selected.push(column);
									}
								}
							} else {
								$scope.$select.selected = column;
							}
							$scope.$apply();
						}
					}
				}
			}
		});
	}
	
	return {
		restrict : 'A',
		link : link
	};
});