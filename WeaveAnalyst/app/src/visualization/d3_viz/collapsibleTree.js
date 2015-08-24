/**
 * this is a modified collapsible tree written in d3
 * reference : http://bl.ocks.org/mbostock/4339083
 */

if(!this.wa){
	this.wa = {};
}

if(!this.wa.d3_viz){
	this.wa.d3_viz = {};
}

(function(){
	//constructor
	function collapsibleTree (){
		this._container;
		this._margin;
		this._height;
		this._width;
		
		this._root;
		this._diagnol;
		this._duration;
		
		this._treeSvg;
		this._tree;
		this._nodes;
		this._links;
		this._i;
	};
	
	var p = collapsibleTree.prototype;
	window.wa.d3_viz.collapsibleTree = collapsibleTree;
	
	//inits the tree initial parameters
	p.intialize_tree = function(config){
		
		this._container = config.container;
		
		console.log(config.container.offsetHeight);
		
		this._margin = {top: 20, right: 20, bottom: 20, left: 20};
	    //this._width = this._container.offsetWidth - this._margin.right - this._margin.left,
	    //this._height = this._container.offsetHeight - this._margin.top - this._margin.bottom;
		
		this._width= 500 - this._margin.right - this._margin.left,
		this._height = 500 - this._margin.top - this._margin.bottom;

		this._i = 0;
		this._duration = 750;

		this._tree = d3.layout.tree()
	    	.size([this._height, this._width]);

		this._diagonal = d3.svg.diagonal()
	    .projection(function(d) { return [d.x, d.y]; });
		
		this._treeSvg = d3.select(this._container).append("svg")
	    .attr("width", this._width + this._margin.right + this._margin.left)
	    .attr("height", this._height + this._margin.top + this._margin.bottom)
	    .append("g")
	    .attr("transform", "translate(" + this._margin.left + "," + this._margin.top + ")");
		
		this.create_Root_Node();
		
	};
	
	//creates the first root node
	p.create_Root_Node = function(){

		d3.json("src/visualization/d3_viz/flare.json", function(error, flare) {
		  if (error) throw error;

		  this._root = flare;
		  this._root.x0 =  this._height / 2;
		  this._root.y0 = 0;

		  function collapse(d) {
			    if (d.children) {
			      d._children = d.children;
			      d._children.forEach(collapse);
			      d.children = null;
			    }
			  }
		  
		  this._root.children.forEach(collapse);
		  this.update(this._root);
		}.bind(this));

		d3.select(self.frameElement).style("height", "800px");
	};
	

	// Toggle children on click.
	p.click = function (d){
	  if (d.children) {
	    d._children = d.children;
	    d.children = null;
	  } else {
	    d.children = d._children;
	    d._children = null;
	  }
	  this.update(d);
	};
	
	p.update = function(source){
		
		var t = this;

		//console.log("this", this);
		  // Compute the new tree layout.
		t._nodes = t._tree.nodes(t._root).reverse(),
		t._links = t._tree.links(t._nodes);

		  // Normalize for fixed-depth.
		 t._nodes.forEach(function(d) { d.y = d.depth * 180; });

		  // Update the nodes…
		  var node = t._treeSvg.selectAll("g.node")
		      .data( t._nodes, function(d) { return d.id || (d.id = ++t._i); });

		  // Enter any new nodes at the parent's previous position.
		  var nodeEnter = node.enter().append("g")
		      .attr("class", "node")
		      .attr("transform", function(d) { return "translate(" + source.x0 + "," + source.y0 + ")"; })
		      .on("click",function(d){ t.click (d)});

		  nodeEnter.append("circle")
		      .attr("r", 1e-6)
		      .style("fill", function(d) { return d._children ? "lightsteelblue" : "#fff"; });

		  nodeEnter.append("text")
		      .attr("x", function(d) { return d.children || d._children ? -10 : 10; })
		      .attr("dy", ".35em")
		      .attr("text-anchor", function(d) { return d.children || d._children ? "end" : "start"; })
		      .text(function(d) { return d.name; })
		      .style("fill-opacity", 1e-6);

		// Transition nodes to their new position.
		  var nodeUpdate = node.transition()
		      .duration(t._duration)
		      .attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });


		  nodeUpdate.select("circle")
		      .attr("r", 4.5)
		      .style("fill", function(d) { return d._children ? "lightsteelblue" : "#fff"; });

		  nodeUpdate.select("text")
		      .style("fill-opacity", 1);

		// Transition exiting nodes to the parent's new position.
		  var nodeExit = node.exit().transition()
		      .duration( t._duration)
		      .attr("transform", function(d) { return "translate(" + source.x + "," + source.y + ")"; })
		      .remove();

		  nodeExit.select("circle")
		      .attr("r", 1e-6);

		  nodeExit.select("text")
		      .style("fill-opacity", 1e-6);

		  // Update the links…
		  var link =  t._treeSvg.selectAll("path.link")
		      .data( t._links, function(d) { return d.target.id; });

		  // Enter any new links at the parent's previous position.
		  link.enter().insert("path", "g")
		      .attr("class", "link")
		      .attr("d", function(d) {
		        var o = {x: source.x0, y: source.y0};
		        return  t._diagonal({source: o, target: o});
		      }.bind(this));

		  // Transition links to their new position.
		  link.transition()
		      .duration( t._duration)
		      .attr("d",  t._diagonal);

		  // Transition exiting nodes to the parent's new position.
		  link.exit().transition()
		      .duration( t._duration)
		      .attr("d", function(d) {
		        var o = {x: source.x, y: source.y};
		        return  t._diagonal({source: o, target: o});
		      })
		      .remove();

		  // Stash the old positions for transition.
		  this._nodes.forEach(function(d) {
		    d.x0 = d.x;
		    d.y0 = d.y;
		  });
	};
})();