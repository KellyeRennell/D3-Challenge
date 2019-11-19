//referencing day 3 activities 7 and 10 
  // SVG wrapper dimensions are determined by the current width and
     const  
         svgWidth = 960;
         svgHeight = 500;
    
 //Create an object to represent the chart's margins within the SVG container
    const margin = {
        top: 20,
        right: 40,
        bottom: 80,
        left: 100
    };

    //setting up the params for the SVG, chart area minus the margins
   
    var width = svgWidth - margin.left - margin.right;
    var height = svgHeight - margin.top - margin.bottom;

 // Create an SVG wrapper/container, appending an SVG group that will hold our chart.

    const svg = d3
        .select("#scatter")
        .append("svg")
        .attr("height", svgHeight)
        .attr("width", svgWidth);

//append group element("g") that will hold our chart
    var chartGroup = svg.append("g")
         .attr("transform", `translate(${margin.left}, ${margin.top})`);

//Retrieve data from the CSV file and execute everything below
(async function() {
    const stateData = await d3.csv("./assets/data/data.csv")
    .catch(error => console.warn(error))
    console.log(stateData);

    stateData.forEach(function(d) {
        d.poverty = +d.poverty;
        d.healthcare = +d.healthcare;
    
});
  
   
    let xScale = d3.scaleLinear()
        .domain([5, d3.max(stateData, d => d.poverty)])
        .range([0, width]);
       
    let yScale = d3.scaleLinear()
        .domain([2, d3.max(stateData, d => d.healthcare)])
        .range([height, 0]);
      
   let xAxis = d3.axisBottom(xScale);
   let yAxis = d3.axisLeft(yScale);

   chartGroup.append("g")
   .attr("transform", `translate(0, ${height})`)
   .call(xAxis);

   chartGroup.append("g")
       .call(yAxis);

// Step 5: Create Circles
// ==============================
    var circlesGroup = chartGroup.selectAll("circle")
        .data(stateData)
        .enter()
        .append("circle")
        .attr("cx", d => xScale(d.poverty))
        .attr("cy", d => yScale(d.healthcare))
        .attr("r", "15")
        .attr("class", function(d) {
            return "state" + d.abbr;
        })
        .attr("fill", "steelblue")
        .attr("opacity", ".5")

       

    var toolTip = d3.tip()
        .attr("class", "d3-tip")
        .html(function(d) {
            return (abbr + "%");
        });

chartGroup.call(toolTip);

//// Step 8: Create event listeners to display and hide the tooltip
circlesGroup.on("click", function(d) {
    toolTip.show(data);
})

.on("mouseout", function(data, index) {
        toolTip.hide(data);
    });

    //// Create axes labels

chartGroup.append("text")
    .selectAll("p")
    .data(stateData)
    .enter()
    .append("text")
    .attr("x", function(data) {
        return xScale(data.healthcare);
        })
        .attr("y", function(data) {
            return yScale(data.poverty);
        })
        .text(function(data) {
            return data.abbr
        });

chartGroup.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin.left + 40)
        .attr("x", 0 - (height / 2))
        .attr("dy", "1em")
        .attr("class", "axisText")
        .text("Lacks Healthcare (%)");

chartGroup.append("text")
        .attr("transform", `translate(${width /2}, ${height + margin.top + 30})`)
        .attr("class", "axisText")
        .text("In Poverty (%)");

    
})()