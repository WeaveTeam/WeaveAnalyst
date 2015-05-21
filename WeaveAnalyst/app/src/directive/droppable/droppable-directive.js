AnalysisModule.directive('droppable', function() {
	
	function link($scope, element, attrs, ngModelCtrl) {
		
		var multiple = angular.isDefined(attrs.multiple);
		
		element.droppable({
			drop : function(event, ui) {
				console.log("dropped");
				console.log($scope);
				if(ui && ui.helper) {
					var node = ui.helper.data("dtSourceNode");
					var weaveNode;
					if(node) {
						weaveNode = node.data.weaveNode;
						if(weaveNode) {
							if(multiple) {
								if(!$scope.$select.selected) {
									$scope.$select.selected = [{
										dataSourceName : weaveNode.getDataSourceName(),
										metadata : weaveNode.getColumnMetadata()
									}];
								} else {
									$scope.$select.selected.push({
										dataSourceName : weaveNode.getDataSourceName(),
										metadata : weaveNode.getColumnMetadata()
									});
								}
							} else {
								$scope.$select.selected = {
										dataSourceName : weaveNode.getDataSourceName(),
										metadata : weaveNode.getColumnMetadata()
									};
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