/**
 * this directive contains the UI and logic for the correlation Matrix
 */

dataStatsModule.directive('correlationMatrix',[function factory(){
	var directiveDefnObj= {
			restrict : 'E', //restricts the directive to a specific directive declaration style.in this case as element
			scope : {//isolated scope, its parent is the scope of the correlation matrix tab in dataStatsMain.tpl.html
					//data: '='
			},
			templateUrl: 'src/dataStatistics/corr_Matrices_directive_content.tpl.html',
			//this is the scope against the templateUrl i.e.src/dataStatistics/correlationMatrices.tpl.htm
			controller : function(){
				
			},
			//scope: the isolated scope against the template url
			//elem :The jQLite wrapped element on which the directive is applied.  
			//attrs : any attributes that may have been applied on the directive element for e.g.<aws-select-directive style = "padding-top: 5px"></aws-select-directive>
			link: function(scope, elem, attrs){
				

			}
	};
	
	return directiveDefnObj;
}]);

