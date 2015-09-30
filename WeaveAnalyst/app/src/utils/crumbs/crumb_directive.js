/**
 * Created by Shweta on 8/5/15.
 * this component represents one ui crumb in the hierarchy
 * TODO import this as bower module from GITHUB
 * */
var shanti;
(function (){
    angular.module('weaveAnalyst.utils').directive('crumbSelector', selectorPillComponent);

    selectorPillComponent.$inject= [];
    function selectorPillComponent () {
        return {
            restrict: 'E',
            scope:{
            	column :'='
            },
            templateUrl:"src/utils/crumbs/crumbPartial.html" ,
            controller: sPillController,
            controllerAs: 'p_Ctrl',
            bindToController: true,
            link: function (scope, elem, attrs) {

            }
        };//end of directive definition
    }

    sPillController.$inject = ['$scope', 'WeaveService'];
    function sPillController (scope, WeaveService){
       var p_Ctrl = this;
        p_Ctrl.WeaveService = WeaveService;
        p_Ctrl.display_Children = display_Children;
        p_Ctrl.display_Siblings = display_Siblings;
        p_Ctrl.add_init_Crumb = add_init_Crumb;
        p_Ctrl.manage_Crumbs = manage_Crumbs;
        p_Ctrl.populate_Defaults = populate_Defaults;
        p_Ctrl.get_trail_from_column = get_trail_from_column;

        p_Ctrl.showList = false;

        //is the previously added node in the stack, needed for comparison
        //structure of each node should be {w_node //actual node ; label: its label}
        p_Ctrl.weave_node = {};
        p_Ctrl.crumbTrail = [];
        p_Ctrl.crumbLog = [];

        shanti = p_Ctrl;
        scope.$watch('p_Ctrl.column', function(){
        	if(p_Ctrl.column.defaults)
        		p_Ctrl.populate_Defaults();
        });
        
        function populate_Defaults (){
        	//clear existing logs and trails
        	p_Ctrl.crumbLog = []; p_Ctrl.crumbTrail = [];
        	//create the new trail starting from the column
        };
        
        function get_trail_from_column (in_column){
        	var trailObj = {trail : [], logs : []};
        	
        	
        	return trailObj;
        };

        function manage_Crumbs(i_node){
            /*1. check if it is the previously added node*/
            if(i_node.label != p_Ctrl.weave_node.label && p_Ctrl.weave_node) {//proceed only if it is new
                /*2. check if it in the trail already */
                if($.inArray(i_node.label, p_Ctrl.crumbLog) == -1) {//proceed if it is new
                    /* for the very first crumb added; happens only once*/
                    if(!p_Ctrl.crumbTrail.length && !p_Ctrl.crumbLog.length){
                       // console.log("first WeaveDataSource crumb added...");
                        p_Ctrl.crumbTrail.push(i_node);
                        p_Ctrl.crumbLog.push(i_node.label);
                    }
                    //remaining iterations
                    else{
                        /*3. check if previous crumb in trail is parent*/
                        var p_name = i_node.w_node.parent.getLabel();
                        var p_ind = p_Ctrl.crumbLog.indexOf(p_name);
                        var trail_parent = p_Ctrl.crumbTrail[p_ind].label;

                        if(p_name == trail_parent) {//proceed only if previous one in trail is parent
                            /*4. check if a sibling is present after parent */
                            if(p_Ctrl.crumbTrail[p_ind + 1]){
                                var sib_node = p_Ctrl.crumbTrail[p_ind + 1];
                                var sib_parent_name = sib_node.w_node.parent.getLabel();
                                if(p_name == sib_parent_name){
                                    //if yes
                                    //remove sibling and is trail
                                    p_Ctrl.crumbTrail.splice(p_ind+1, Number.MAX_VALUE);
                                    p_Ctrl.crumbLog.splice(p_ind+1, Number.MAX_VALUE);
                                    //add it
                                    p_Ctrl.crumbTrail.push(i_node);
                                    p_Ctrl.crumbLog.push(i_node.label);
                                    //console.log("replacing sibling and updating ...");

                                }
                            }
                            else{
                                //if no then add
                                //console.log("new child added after parent...");
                                p_Ctrl.crumbTrail.push(i_node);
                                p_Ctrl.crumbLog.push(i_node.label);
                            }
                        }
                        else{}//don't add it anywhere in trail
                    }
                }
                else{}//if it already exists in the trail
            }
            else{}// if it is old
            p_Ctrl.weave_node = i_node;

            //p_Ctrl.toggleList = false;
            if(i_node.w_node.isBranch()){
                if(i_node.label == 'WeaveDataSource')
                    p_Ctrl.showList = false;
                else{
                    p_Ctrl.display_Children(i_node);
                    p_Ctrl.showList = true;
                }
            }
            else
                p_Ctrl.showList = false;
        }


        //this function adds the data source initial pill, done only once as soon as weave loads
        function add_init_Crumb (){
            if(p_Ctrl.WeaveService.request_WeaveTree()){
                var ds = p_Ctrl.WeaveService.weave_Tree.getChildren();

                var init_node = {};
                init_node.label = ds[0].getLabel();
                init_node.w_node= ds[0];//starting with the WeaveDataSource Pill
                p_Ctrl.manage_Crumbs(init_node);
                //scope.$apply();//because digest completes by the time the tree root is fetched
            }
            else
                setTimeout(p_Ctrl.add_init_Crumb, 300);
        }

        function display_Children(i_node){
            p_Ctrl.showList = true;
            p_Ctrl.WeaveService.display_Options(i_node, true);//using the actual node
        }

        function display_Siblings(i_node){
            p_Ctrl.showList = true;
            p_Ctrl.WeaveService.display_Options(i_node);
        }
    }
})();