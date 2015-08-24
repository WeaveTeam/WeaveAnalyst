/**
 * this card appears on the index page and gives an idea of functionality of the tabs. 
 * @shwetapurushe
 */

(function(){
	angular.module('weaveAnalyst.utils').directive('introCard', introCardComponent);
	
	function introCardComponent(){
		return {
			restrict: 'E', 
			template:'<div class = "intro_card"><div class="header panel-heading"><h2>{{ic_Ctrl.title}}</h2></div>' +
				'<div><div>{{ic_Ctrl.description}}</div><div></div>',
			scope:{
				title : '@',
				description : '@',
				tab: '@'
				
			},
			controller : introCardController,
			controllerAs : 'ic_Ctrl',
			bindToController : true,
			link : function(){
				
			}
		};//end of directive def
	};
	
	function introCardController (){
		var ic_Ctrl = this;
	};
})();