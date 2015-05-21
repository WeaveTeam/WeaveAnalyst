AnalysisModule.directive('droppable', function() {
	
	function link($scope, element, attrs, ngModelCtrl) {
		
		var multiple = angular.isDefined(attrs.multiple);
		
		element.droppable({
			drop : function(event, ui) {
				console.log("dropped");
				console.log($scope);
				if(ui && ui.helper) {
					var node = ui.helper.data("dtSourceNode");
					var column;
					if(node) {
						column = node.data.column;
						if(column) {
							if(multiple) {
								if(!$scope.$select.selected) {
									$scope.$select.selected = [column];
								} else {
									// double check the selected item is not already in 
									// the selection
									// otherwise we create ng-duplicate error
									if($scope.$select.selected.indexOf(column) < 0) {
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