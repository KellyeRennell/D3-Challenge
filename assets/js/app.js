(async function() {
// Setting up our Chart
//Dimensions of the SVG container
    const
        svgWidth = 1000,
        svgHeight = 500;
//Create an object to represent the chart's margins within the SVG container
    const margin = {
        top: 20,
        right: 40,
        bottom: 60,
        left: 50
 
    };

//setting up the params for the SVG
    const chartWidth = svgWidth - margin.left - margin.right;
    const chartHeight = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper, appending an SVG group that will hold our chart.

   const svg = d3.select(".chart")
   .append("svg")
   .attr("height", svgWidth)
   .attr("width", svgHeight);

//shift everything over by the margins
   const chartGroup = svg.append("g")
   .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Import data csv - data set incldes data on rates of income, obesity, poverty, etc. by state. MOE stands for "margin of error."
const healthpovData = await d3.csv("data.csv").catch(error => console.warn(error))
console.log(healthpovData);

//Parse the data/ cast as numbers
// data.forEach(function(data) {
//     data.poverty = +data.poverty;
//     data.healthcareLow = +data.healthcareLow;
// });

// //Create scale functions
// const xLinearScale = d3.scaleLinear()
//     .domain




// }

// // function used for updating x-scale const upon click on axis label
// function xScale(data, xAxis) {
// // create scales
// const xLinearScale = d3.scaleLinear()
// .domain([d3.min(data, d => d[xAxis]) *0.8,
// ])


})()






 























