const svgWidth = 960;
const svgHeight = 500;

const margin = {
  top: 20,
  right: 40,
  bottom: 80,
  left: 100
};

//dimensions of chart area
const width = svgWidth - margin.left - margin.right;
const height = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper, append an SVG group that will hold our chart,
// and shift the latter by left and top margins.
const svg = d3
  .select("#scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

// Append an SVG group
const chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Initial Params
var chosenXAxis = "poverty";
var chosenYAxis = "healthcare";

// function used for updating x-scale const upon click on axis label
function xScale(stateData, chosenXAxis) {
  // create scales
  var xLinearScale = d3.scaleLinear()
    .domain([d3.min(stateData, d => d[chosenXAxis]) * 0.8,
      d3.max(stateData, d => d[chosenXAxis]) * 1.2
    ])
    .range([0, width]);

  return xLinearScale;

}

function yScale (stateData, chosenYAxis) {
     //create scales
     var yLinearScale = d3.scaleLinear()
     .domain([d3.min(stateData, d => d[chosenYAxis]) * 0.8,
         d3.max(stateData, d => d[chosenYAxis]) * 1.2
        ])
     .range([height, 0]);

 return yLinearScale;
}

// function used for updating xAxis const upon click on axis label
function renderAxes(newXScale, xAxis) {
  var bottomAxis = d3.axisBottom(newXScale);

  xAxis.transition()
    .duration(1000)
    .call(bottomAxis);

  return xAxis;
}

function renderYAxes(newYScale, yAxis) {
    var leftAxis = d3.axisLeft(newYScale);

    yAxis.transition()
        .duration(1000)
        .call(leftAxis);

    return yAxis;
}

// function used for updating circles group with a transition to new circles
function renderCircles(circlesGroup, newXScale, chosenXAxis, newYScale, chosenYAxis) {
    
  circlesGroup.transition()
    .duration(1000)
    .attr("cx", d => newXScale(d[chosenXAxis]))
    .attr("cy", d => newYScale(d[chosenYAxis]));

  return circlesGroup;
}

function renderText(circleText, newXScale, chosenXAxis, newYScale, chosenYAxis) {

    textGroup.transition()
      .duration(1000)
      .attr("x", d => newXScale(d[chosenXAxis]))
      .attr("y", d => newYScale(d[chosenYAxis]))
      .attr("text-anchor", "middle");

    return circleText;
  }

// function used for updating circles group with new tooltip
function updateToolTip(chosenXAxis, chosenYAxis, circlesGroup, circleText) {

    let labelx  = "";

    if (chosenXAxis === "poverty") {
        labelx = "Poverty";
    }
    else if (chosenXAxis === "income") {
        labelx = "Median Income:";
    }
    else {    
        labelx = "Age:";
    }

    //selecting y value lables

    let labely  = "";

    if (chosenYAxis === "healthcare") {
       labely = "Lacks Healthcare:";
    }
    else if (chosenYAxis === "obesity") {
        labely = "Obesity:";
    }
    else {
        labely = "Smokers:";
    }

    //initializing tool tip    
    var toolTip = d3.tip()
        .attr("class", "d3-tip")
        .offset([80, 80])
        .html(function(d) {
            return (`${d.abbr}<br>${labelx} ${d[chosenXAxis]}<br>${labely} ${d[chosenYAxis]}`);
        });
//circles tool tip
    circlesGroup.call(toolTip);
//event listeners for circles tooltip
    circlesGroup.on("mouseover", function(data) {
        toolTip.show(data, this);
    })
    // onmouseout event
    .on("mouseout", function(data, index) {
        toolTip.hide(data, this);
    });

    circleText.call(toolTip);

    circleText.on("mouseover", function(data) {
        toolTip.show(data, this);
    })
     // onmouseout event
     .on("mouseout", function(data, index) {
        toolTip.hide(data, this);
    });

  return circlesGroup;
}

// Retrieve data from the CSV file and execute everything below
(async function(){
    const stateData = await d3.csv("assets/data/data.csv");
// parse data
    stateData.forEach(function(d) {
        d.poverty = +d.poverty;
        d.age = +d.age;
        d.income = +d.income;
        d.healthcare = +d.healthcare;
        d.obesity = +d.obesity;     
        d.smokes = +d.smokes;
    });

// xLinearScale and yLinearScale function above csv import
    const xLinearScale = xScale(stateData, chosenXAxis);
    const yLinearScale = yScale(stateData, chosenYAxis);

// Create initial axis functions
    const bottomAxis = d3.axisBottom(xLinearScale);
    const leftAxis = d3.axisLeft(yLinearScale);

// append x axis
    var x_Axis = chartGroup.append("g")
        .classed("x-axis", true)
        .attr("transform", `translate(0, ${height})`)
        .call(bottomAxis);

    // append y axis
    var y_Axis = chartGroup.append("g")
        .classed("y-axis", true)
        .call(leftAxis);

    // append initial circles
    var circlesGroup = chartGroup.selectAll(".stateCircle")
        .data(stateData)
        .enter()
        .append("circle")
        .attr("cx", d => xLinearScale(d[chosenXAxis]))
        .attr("cy", d => yLinearScale(d[chosenYAxis]))
        .attr("class", "stateCircle")
        .attr("r", 15)
        .attr("fill", "steelblue")
        .attr("opacity", ".80");

    var circleText = chartGroup.selectAll(".stateText")
        .data(stateData)
        .enter()
        .append("text")
        .attr("class", "stateText")
        .attr("x", d => xLinearScale(d[chosenXAxis]))
        .attr("y", d => yLinearScale(d[chosenYAxis]*1))
        .attr("text-anchor", "middle")
        .attr("font-size", "10px")
        .text(d => (d.abbr));

    // Create group for  3x- axis labels
    let xlabelsGroup = chartGroup.append("g")
        .attr("transform", `translate(${width/2}, ${height + 20})`);
   
    var povertyLabel = xlabelsGroup.append("text")
        .classed("aText", true)
        .classed("active", true)
        .attr("x", 0)
        .attr("y", 20)
        .attr("value", "poverty") // value to grab for event listener
        .text("In Poverty (%)");

    var ageLabel = xlabelsGroup.append("text")
        .classed("aText", true)
        .classed("inactive", true)
        .attr("x", 0)
        .attr("y", 40)
        .attr("value", "age")
        .text("Age (Median)");

    var incomeLabel = xlabelsGroup.append("text")
        .classed("aText", true)
        .classed("inactive", true)
        .attr("x", 0)
        .attr("y", 60)
        .attr("value", "income")
        .text("Household Income (Median)");

    //create group for 3 y-axis labels
    let ylabelsGroup = chartGroup.append("g")
    .attr("transform", `translate(-30, ${(height/2)})`);

    var healthcareLabel = ylabelsGroup.append("text")
        .classed("aText", true)
        .classed("active", true)
        .attr("x", 0)
        .attr("y", -20)
        .attr("dy", "1em")
        .attr("transform", "rotate(-90)")
        .attr("value", "healthcare")
        .text("Lacks Healthcare (%)");

    var smokesLabel = ylabelsGroup.append("text")
        .classed("aText", true)
        .classed("inactive", true)
        .attr("x", 0)
        .attr("y", -50)
        .attr("dy", "1em")
        .attr("transform", "rotate(-90)")
        .attr("value", "smokes")
        .text("Smokes (%)");

    var obesityLabel = ylabelsGroup.append("text")
        .classed("aText", true)
        .classed("inactive", true)
        .attr("x", 0)
        .attr("y", -70)
        .attr("dy", "1em")
        .attr("transform", "rotate(-90)")
        .attr("value", "obesity")
        .text("Obese (%)");


        // updateToolTip function above csv import
    var circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup, circleText);

    // x axis labels event listener
    xlabelsGroup.selectAll("text")
        .on("click", function() {
        // get value of selection
        var value = d3.select(this).attr("value");

        if (value !== chosenXAxis) {

            // replaces chosenXAxis with value
            chosenXAxis = value;

            // console.log(chosenXAxis)

            // functions here found above csv import
            // updates x scale for new data
            xLinearScale = xScale(stateData, chosenXAxis);

            // updates x axis with transition
            XaxisUpdate = renderAxes(xLinearScale, XaxisUpdate);

            // updates circles with new x values
            circlesGroup = renderCircles(circlesGroup, xLinearScale, chosenXAxis, yLinearScale, chosenYAxis);

            circleText = renderText (circleText, xLinearScale, chosenXAxis, yLinearScale, chosenYAxis)

            // updates tooltips with new info
            circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup, circleText);

            // changes classes to change bold text
            if (chosenXAxis === "poverty") {
                povertyLabel
                    .classed("active", true)
                    .classed("inactive", false);
                ageLabel
                    .classed("active", false)
                    .classed("inactive", true);
                incomeLabel
                    .classed("active", false)
                    .classed("inactive", true);
            }
            else if (chosenXAxis === "age") {
                povertyLabel
                    .classed("active", false)
                    .classed("inactive", true);
                ageLabel
                    .classed("active", true)
                    .classed("inactive", false);
                incomeLabel
                    .classed("active", false)
                    .classed("inactive", true);
            }
            else {
                povertyLabel
                    .classed("active", false)
                    .classed("inactive", true);
                ageLabel
                    .classed("active", false)
                    .classed("inactive", true);
                incomeLabel
                    .classed("active", true)
                    .classed("inactive", false);
            }
     
        }
     });
//yaxis label event listener
     yLabelsGroup.selectAll("text")
     .on("click", function() {
        //get value of selection
        var value = d3.select(this).attr("value");

        //check if value is same as current axis
        if (value != chosenYAxis) {

        //replace chosenYAxis with value
            chosenYAxis = value;
        //update y scale for new data
            yLinearScale = yScale(stateData, chosenYAxis);

        //update x axis with transition
            YaxisUpdate = renderYAxes(yLinearScale, YaxisUpdate);

        //update circles with new y values
    circlesGroup = renderCircles(circlesGroup, xLinearScale, chosenXAxis, yLinearScale, chosenYAxis);

        //update text with new y values
    circleText = renderText(circleText, xLinearScale, chosenXAxis, yLinearScale, chosenYAxis)

    circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup, circleText);

    //change classes to change bold text
    if (chosenYAxis === "healthcare") {
        healthcareLabel
            .classed("active", true)
            .classed("inactive", false);
        obesityLabel
            .classed("active", false)
            .classed("inactive", true);
        smokesLabel
            .classed("active", false)
            .classed("inactive", true);
    }
    else if (chosenYAxis === "obesity") {
        healthcareLabel
            .classed("active", false)
            .classed("inactive", true);
        obesityLabel
            .classed("active", true)
            .classed("inactive", false);
        incomeLabel
            .classed("active", false)
            .classed("inactive", true);
            }
    else {
        healthcareLabel
            .classed("active", false)
            .classed("inactive", true);
        obesityLabel
            .classed("active", false)
            .classed("inactive", true);
        smokesLabel
            .classed("active", true)
            .classed("inactive", false);
            }
        }
    });

})()

