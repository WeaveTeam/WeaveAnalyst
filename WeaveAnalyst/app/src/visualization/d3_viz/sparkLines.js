/**
 * this renders column distributions of numerical columns using the d3 library
 * @author spurushe 
 */


if(!this.wa){
	this.wa = {};
}

if(!this.wa.d3_viz){
	this.d3_viz = {};
}

(function(){
	
	function sparkLines (){
		this._container;
		this._svg;
		
		this._breaks;
		this._counts;
		
		this._heightScale;
		this._widthScale;
		this._width;
		this._height;
		this._barWidth;
		
		this.toolTip;
		this._bar;
	};
	
	var p = sparkLines.prototype;
	d3_viz.sparkLines = sparkLines;
	
	
	
	p.initialze_sparkLines = function(config){
		
		this._container = config.container;

		//data
		this._breaks = config.breaks;
		this._counts = config.counts;
		
		this._margin = {top: 5, right: 5, bottom: 5, left: 5};
		this._width = 60; this._height= 60;

		//scales
		this._heightScale = d3.scale.linear()
				  .domain([0, d3.max(this._counts)])
				  .range([this._height, 0]);//output should be between height and 0
		
		this._widthScale = d3.scale.linear()
						   .domain([0, d3.max(this._breaks)])
						   .range([0, this._width]);
		
		//tooltip
		this._tooltip = d3.select(this._container)
		.append("div")
		.style("position", "absolute")
		.style("z-index", "10")
		.style("visibility", "hidden")
		.text("")
		.style("color", "red")
		.style("font-weight", 'bold');
		
		this._barWidth = (this._width - this._margin.left - this._margin.right)/this._counts.length;
	};
	
	

	/**
	 * this function draws the sparklines computed in R/STATA (one per column)
	 * @param dom_element_to_append_to :the HTML element to which the sparkline D3 viz is appended
	 * @param sparklineData : the distribution data calculated in R/STATA
	 */
	p.render_sparkLines = function(){
		//creating the svgS
		this._svg = d3.select(this._container).append('svg')
					  .attr('fill', 'black')
					  .attr('width', this._width)//svg viewport dynamically generated
					  .attr('height', this._height )
					  .append('g')
					  .attr("transform", "translate(" + this._margin.left + "," + this._margin.top + ")");
		
		//making one g element per bar 
		this._bar = this._svg.selectAll("g")
	      			   .data(this._counts)
	      			   .enter().append("svg:g")
	      			   .attr("transform", function(d, i) { return "translate(" + (i * this._barWidth ) + ",0)"; });

		this._bar.append("rect")
	      .attr("y", function(d) { return this._heightScale(d); })
	      .attr("height", function(d) { return this._height - this._heightScale(d); })
	      .attr("width", this._barWidth)
	      .on('mouseover', function(d){ this._tooltip.style('visibility', 'visible' ).text(d); 
			             							   d3.select(this).style('stroke-opacity', 1);})
			             .on("mousemove", function(){return this._tooltip.style("top", (event.pageY-10)+"px").style("left",(event.pageX+10)+"px");})
			             .on('mouseout', function(){ this._tooltip.style('visibility', 'hidden'); 
			             							 d3.select(this).style('stroke-opacity', 0);});
	};
})();
