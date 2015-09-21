var shanti;
(function(){
	angular.module('weaveAnalyst.WeaveModule', []);
	angular.module('weaveAnalyst.WeaveModule').service('WeaveService', weaveService);

    weaveService.$inject = ['usSpinnerService','$timeout', 'queryService', '$window'];
    function weaveService (usSpinnerService, $timeout, queryService, $window){
        var that = this;

        that.weave;
        that.weave_Tree;
        that.node_options;
        that.blah = "bujumbarra";
        
        that.launch_Weave = function(){
			
			//check if it is open
			if(that.weaveWindow)
				return;
			else{
				that.weaveWindow = $window.open("src/visualization/weave/weaveApp.html","abc","toolbar=no, fullscreen = no, scrollbars=no, addressbar=no, resizable=yes");
				//that.weaveWindow.wa_data = that.blah;
				shanti = that.weaveWindow;
				that.weaveWindow.addEventListener("load", that.request_WeaveTree);
				//that.weaveWindow.addEventListener("load", that.create_weaveWrapper);//getting the instance
			}
		};

        /*object of script input options
        * keys are the script input names
        * values are the trail (array of crumbs)*/

        that.display_Options = function(input_node, getChildren){
            var weaveTreeIsBusy = that.weave.evaluateExpression(null, '() => WeaveAPI.SessionManager.linkableObjectIsBusy(WEAVE_TREE_NODE_LOOKUP[0])');


            if(getChildren){//when request is for children
                if(input_node.children && input_node.children.length){//use list if already there
                    that.node_options = input_node.children;//set the provider
                    //console.log("using cached list");
                }

                else{//make fresh request
                    that.node_options = [];//clear
                    usSpinnerService.spin('dataLoadSpinner');// start the spinner
                    fetching_Children(input_node.w_node, getChildren);//use node
                    //console.log("fetching new list");
                }
            }

            else{//when request is for siblings
                if(input_node.siblings && input_node.siblings.length){//use if list is already there
                    that.node_options = input_node.siblings;//set the provider
                    //console.log("using cached list");
                }

                else{//make fresh request
                    that.node_options = [];//clear
                    usSpinnerService.spin('dataLoadSpinner');// start the spinner
                    fetching_Children(input_node.w_node.parent, getChildren);//use its parent
                    //console.log("fetching new list");
                }
            }



            function fetching_Children(i_node, getChildren) {
               var chi = i_node.getChildren();
                if (weaveTreeIsBusy())
                    setTimeout(function () {
                        fetching_Children(i_node, getChildren);
                    }, 300);
                else {
                    var tempProvider = [];

                    for (var u = 0; u < chi.length; u++) {
                        var node_obj = {};
                        chi[u].getLabel();//TODO get this confirmed w/o this line column labels appear ...

                        if (weaveTreeIsBusy())
                            setTimeout(function () {
                                fetching_Children(i_node, getChildren);
                            }, 300);
                        //formats the children for displaying in the drop down selector
                        node_obj.label = chi[u].getLabel();//need this for filter of options to work
                        node_obj.w_node = chi[u];

                        tempProvider[u] = node_obj;
                    }
                    $timeout(function () {
                        that.node_options = tempProvider;
                        if(getChildren)
                            input_node.children = that.node_options;//set the provider
                        else
                            input_node.siblings = that.node_options;

                        usSpinnerService.stop('dataLoadSpinner');//stops the spinner
                    }, 300);

                }
            }//end of fetching children
        };

        /** requests the WeaveNodeTree hierarchy comprised of IWeaveTreeNode objects**/
        that.request_WeaveTree = function (){
            if(that.check_WeaveReady())//only if Weave is ready
            {
                if(!that.weave_Tree){
                    that.weave_Tree = new that.weave.WeaveTreeNode();
                    return that.weave_Tree;
                }
                else
                    return that.weave_Tree;
            }
            else{
                $timeout(that.request_WeaveTree, 100);
            }
        };

        /** checks if the Weave software has loaded**/
        that.check_WeaveReady = function(){

            if(!that.weave)
                that.weave = that.weaveWindow.document.getElementById('weave');
            return that.weave && that.weave.WeavePath && that.weave._jsonCall;
        };

    }
})();