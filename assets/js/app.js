// D3 Scatterplot Assignment

// Students:
// =========
// Follow your written instructions and create a scatter plot with D3.js.
//Set up chart
var svgWidth = 960;
var svgHeight = 400;

var margin = {top: 20, right: 20, bottom: 30, left: 40},
    width = svgWidth - margin.left - margin.right,
    height = svgHeight - margin.top - margin.bottom;

//Create an SVG Wrapper
var svg = d3.select("body").append("svg").attr("width", svgWidth).attr("height", svgHeight);

//append an svg group that will hold our chart and shift by left and top margins
var chartGroup = svg.append("g").attr("transform", `translate(${margin.left},${margin.top})`);


// load data
d3.csv("data/data.csv", function(error, data) {
    if(error) throw error;

  // change string (from CSV) into number format
  data.forEach(function(d) {
    d.poverty = +d.poverty;
    d.healthcare = +d.healthcare;
  });
    

// setup x 
var xValue = function(d) { return d.poverty;}, // data -> value
    xScale = d3.scaleLinear().range([0, width]), // value -> display
    xMap = function(d) { return xScale(xValue(d));}, // data -> display
    xAxis = d3.axisBottom(xScale);

// setup y
var yValue = function(d) { return d.healthcare;}, // data -> value
    yScale = d3.scaleLinear().range([height, 0]), // value -> display
    yMap = function(d) { return yScale(yValue(d));}, // data -> display
    yAxis = d3.axisLeft(yScale);


// add the tooltip area to the webpage
var tooltip = d3.tip()
    .attr("class", "d3-tip")
    .html(function (d){return d["State"] + "<br/> <hr> In Poverty : " + xValue(d) 
	        + "% <br/> Lacks Healthcare : " + yValue(d) + "%"})
        /*.style("Opacity", "0.9")
    .style("background", "lightgreen")
    .style("font-size", "10px")
    .style("fill", "white")
    .style("padding", "5px")
    .style("position", "absolute")
    .style("display", "none")
    .on('mouseover', function(d, i) {
        tooltip.transition().duration(0);
      })
    .on('mouseout', function(d, i) {
        tooltip.style('display', 'none');
      });;*/



  // don't want dots overlapping axis, so add in buffer to data domain
  xScale.domain([d3.min(data, xValue)-1, d3.max(data, xValue)+1]);
  yScale.domain([d3.min(data, yValue)-1, d3.max(data, yValue)+1]);

    chartGroup.call(tooltip);
  // add x-axis
  chartGroup.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(10," + height + ")")
      .call(xAxis)
  

  // add y-axis
  chartGroup.append("g")
      .attr("class", "y axis")
      .attr("transform", "translate(10)")
      .call(yAxis)
    
    //Y-axis title
    chartGroup.append("text")
                .attr("text-anchor", "middle")
                .attr("transform", "translate(" + (margin.right-margin.left) + "," +(height/2) + ")rotate(-90)")
                .text("Lacks Healthcare(%)");
    
    //X-axis title
    chartGroup.append("text")
                .attr("text-anchor", "middle")
                .attr("transform", "translate(" + (width/2)+ "," + (margin.bottom+height)+ ")")
                .text("In Poverty (%)")
    

  // draw dots
  chartGroup.selectAll(".dot")
      .data(data)
    .enter().append("circle")
      .attr("class", "bubble")
      .attr("r", 6)
      .attr("cx", xMap)
      .attr("cy", yMap)
      .style("fill", "green")
      .style("opacity", 0.5)
      .on("mouseover", tooltip.show)
      .on("mouseout", tooltip.hide);
            
    

    // label data points
    
    chartGroup.selectAll("bubble")
                .data(data)
                .enter()
                .append("text")
                .text(function(d){return d.Locationabbr;})
                .attr("x", xMap)
                .attr("y", yMap)
                .attr("font-family", "sans-serif")
                .attr("font-size", "6px")
                .attr("fill", "white")
                .attr("text-anchor", "middle");
});