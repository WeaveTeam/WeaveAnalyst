/**
 * this is an interactive interface for manipulating the nested query object
 * @author shweta purushe
 */

(function (){
	angular.module('weaveAnalyst.nested_qo').directive('queryObjectTree', nested_qoTree_component);
	
	function nested_qoTree_component (){
		return {
			restrict : 'E',
			templateUrl : 'src/nested_qo/nested_qotree.tpl.html', 
			controller : nested_qoTree_Controller,
			bindToController : true,
			controllerAs : 'tree_Ctrl',
			link : function (scope, elem, attrs){
				
			}
		};
	};
	
	nested_qoTree_Controller.$inject= ['$scope'];
	function nested_qoTree_Controller ($scope){
		var tree_Ctrl = this;
		 $scope.remove = function (scope) {
		        scope.remove();
		      };

		      $scope.toggle = function (scope) {
		        scope.toggle();
		      };

		      $scope.moveLastToTheBeginning = function () {
		        var a = $scope.data.pop();
		        $scope.data.splice(0, 0, a);
		      };

		      $scope.newSubItem = function (scope) {
		        var nodeData = scope.$modelValue;
		        nodeData.nodes.push({
		          id: nodeData.id * 10 + nodeData.nodes.length,
		          title: nodeData.title + '.' + (nodeData.nodes.length + 1),
		          nodes: []
		        });
		      };

		      $scope.collapseAll = function () {
		        $scope.$broadcast('collapseAll');
		      };

		      $scope.expandAll = function () {
		        $scope.$broadcast('expandAll');
		      };
		 $scope.data = [{
		        'id': 1,
		        'title': 'node1',
		        'nodes': [
		          {
		            'id': 11,
		            'title': 'node1.1',
		            'nodes': [
		              {
		                'id': 111,
		                'title': 'node1.1.1',
		                'nodes': []
		              }
		            ]
		          },
		          {
		            'id': 12,
		            'title': 'node1.2',
		            'nodes': []
		          }
		        ]
		      }, {
		        'id': 2,
		        'title': 'node2',
		        'nodrop': true, // An arbitrary property to check in custom template for nodrop-enabled
		        'nodes': [
		          {
		            'id': 21,
		            'title': 'node2.1',
		            'nodes': []
		          },
		          {
		            'id': 22,
		            'title': 'node2.2',
		            'nodes': []
		          }
		        ]
		      }, 
		      {
		        'id': 3,
		        'title': 'node3',
		        'nodes': [
		          {
		            'id': 31,
		            'title': 'node3.1',
		            'nodes': []
		          }
		        ]
		      }];
	};
})();