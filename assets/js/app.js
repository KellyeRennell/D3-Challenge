// SVG wrapper dimensions are determined by the current width and
// (async function() {
(async function() { 
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
const width = svgWidth - margin.left - margin.right;
const height = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper/container, appending an SVG group that will hold our chart.
const svg = d3.select("#scatter")
    .append("svg")
    .attr("height", svgHeight)
    .attr("width", svgWidth);
    
const chartGroup = svg.append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

//Retrieve data from the CSV file and execute everything below

const stateData = await d3.csv("../assets/data/data.csv");
// console.log(stateData);

     // console.log(stateData);
    stateData.forEach(function(data) {
            data.poverty = +data.poverty;
            data.healthcare = +data.healthcare;
              
    });
   
   
 //Create scales  
    var xScale = d3.scaleLinear()
        .domain([8, d3.max(stateData, d => d.poverty)])
        .range([0, width]);

    var yScale = d3.scaleLinear()
        .domain([0, d3.max(stateData, d => d.healthcare)])
        .range([height, 0]);

//Create axes functions
    var xAxis = d3.axisBottom(xScale);
    var yAxis = d3.axisLeft(yScale);

//Append axes to chartgroup
    chartGroup.append("g")
        .attr("transform", `translate(0, ${height})`)
        .classed("x-axis", true)
        .call(xAxis);

    //Add yAxis to left side of display
    chartGroup.append("g")
    .classed("y-axis", true)
        .call(yAxis);

    // Step 5: Create Circle groups for the content of each circle
    // ==============================
    
    var toolTip = d3.tip()
    .attr("class", "tooltip")
    .attr([80, -60])
    .html(function(d) {
        return (`<strong>${d.state}<br>In Poverty (%): ${d.poverty}<br> Lacks Healthcare (%): ${d.healthcare}`);
    });

//create tooltip in chartgroup
    chartGroup.call(toolTip);

    var circlesGroup = chartGroup.selectAll("circle")
        .data(stateData)
        .enter()
        .append("circle")
        .classed("stateCircle", true)
        .attr ("cx", d => xScale(d.poverty)-1)
        .attr ("cy", d => yScale(d.healthcare)+1)
        .attr("r", 20)
        .attr("class", function(d) {
            return "stateCircle " + d.abbr;
          })
        .attr("fill", "blue")
        .attr("opacity", ".5")


    circlesGroup.on("mouseover", function(d) {
        toolTip.show(d, this);
      })
        // onmouseout event
        .on("mouseout", function(d, index) {
          toolTip.hide(d);
      });

      chartGroup.selectAll(".stateText")
      .data(stateData)
      .enter()
      .append("text")
      .classed("stateText", true)
      .text(d => d.abbr)
      .attr("x", d => xScale(d.poverty)-0)
      .attr("y", d => yScale(d.healthcare)-0.2)
      .attr("font-size", "10px")
      .attr("fill", "black")
      .style("text-anchor", "middle");
        

    // Add the text label for the axes
   
    chartGroup.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin.left + 40)
        .attr("x", 0 - (height / 2))
        .attr("dy", "1em")
        .classed("class", "axisText")
        .text("Lacks Healthcare (%)");

    chartGroup.append("text")
        .attr("transform", `translate(${width / 2}, ${height + margin.top + 20})`)
        .attr("class", "axisText")
        .text("In Poverty (%)");
    
    })()



