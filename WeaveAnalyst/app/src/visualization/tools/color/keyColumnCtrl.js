AnalysisModule.controller("keyColumnCtrl", function($scope, WeaveService){

	$scope.WeaveService = WeaveService;

	// return a list of all WeaveAnalystDataSources and all CSVDataSources
	$scope.getDataSources = function() {
		if(WeaveService.checkWeaveReady()) {
			$scope.dataSources = WeaveService.weave.path().getValue('getNames(WeaveAnalystDataSource)').concat(WeaveService.weave.path().getValue('getNames(CSVDataSource)'));
		}
	}; 
	
	$scope.getColumnNames = function () {
		if($scope.tool.dataSourceName && WeaveService.checkWeaveReady()) {
			$scope.columnNames = WeaveService.weave.path($scope.tool.dataSourceName).getValue('getHierarchyRoot().getChildren().map(c => c.getColumnMetadata().title)');
			console.log($scope.columnNames);
		}
	};
	
});