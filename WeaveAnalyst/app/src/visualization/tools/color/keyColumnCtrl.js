AnalysisModule.controller("keyColumnCtrl", function($scope, WeaveService){

	$scope.WeaveService = WeaveService;

	// return a list of all WeaveAnalystDataSources and all CSVDataSources
	$scope.getDataSources = function() {
		if(WeaveService.checkWeaveReady()) {
			$scope.dataSources = WeaveService.weave.path().getValue('getNames(WeaveAnalystDataSource)').concat(WeaveService.weave.path().getValue('getNames(CSVDataSource)'));
		}
	}; 
	
	$scope.getListOfColumnMetadata = function () {
		if($scope.tool.dataSourceName && WeaveService.checkWeaveReady()) {
			$scope.columnsMetadata = WeaveService.weave.path($scope.tool.dataSourceName).getValue('getHierarchyRoot().getChildren().map(c => c.getColumnMetadata())');
		}
	};
	
	$scope.getKeyType = function () {
		$scope.tool.keyType = $scope.tool.columnMetadata.keyType;
	};
	
	$scope.setKeyColumn = function() {
		WeaveService.setKeyColumn($scope.tool.dataSourceName, $scope.tool.columnMetadata.title, $scope.tool.keyType);
		// refresh the list of columns so that they include the newly set keyType
		$scope.getListOfColumnMetadata();
	};
});