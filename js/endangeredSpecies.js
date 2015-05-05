var public_spreadsheet_url = 'https://docs.google.com/spreadsheet/pub?hl=en_US&hl=en_US&key=1ZhqzJL0iJfJKQkhmN5gRJG3TF9y-d8Yn275d8lQfYEw&output=html';

function drawSpeciesChart(data){
  
  data = data["Endangered Species"].elements;

    var labelVar = 'Geography';
    var chartTitle = "<i class='fa fa-life-ring'></i>Endangered Species";
    var alias = "endangered";
    var yLabel = "Number of Species";
    var popoverLabel = "Number of Species: ";

    //Formatting functions
    var formatAsPercentage = d3.format("%");
    var formatDecimal = d3.format(',.1f0');




    //Grab the Field Names
    var varNames = d3.keys(data[0])
    .filter(function(key){return key !==labelVar;});

    //Create the div for the infographic and add it to the page.
    var div = document.createElement("div");
    var idAtt = document.createAttribute("id");
    idAtt.value = "species";
    div.setAttributeNode(idAtt);
    document.getElementById('content').appendChild(div);
    document.getElementById('species').innerHTML ="<hr><h4>"+chartTitle+"</h4>";

    //Width and height
    var w = 850;
    var h = 500;
    var padding = 35;
    var marginBottom = 125;
    var marginTop = 1;

  //Legend size
  var legendRectSize = 18;
  var legendSpacing = 4;


  //The color scale
  var color = d3.scale.ordinal()
    .range(['rgb(102,194,165)','rgb(252,141,98)','rgb(141,160,203)']);


  //Manipulate the data in order to create grouped bar chart

  //Set the colors of the data categories
  color.domain(varNames);


  data.forEach(function(d){
    var y0 = 0;
    d.mapping = varNames.map(function(name){
      return{
        name: name,
        label: d[labelVar],
        y0: y0,
        y1: +d[name]
      };
    });
    d.total = d.mapping[0].y1;
  });

  console.log(data);
  //set the y scale
  var y = d3.scale.linear()
    .domain([0,d3.max(data, function(d){
        console.log(d[varNames[1]]);return +d[varNames[1]];})])
    .rangeRound([h-marginBottom, marginTop]);

 //set the x scale for spacing out the groups of bars by county
  var x0 = d3.scale.ordinal()
                .domain(data.map(function (d) { return d['Geography']; }))
                .rangeRoundBands([padding, w-padding*2], 0.2);

  //set the x scale for spacing out the bars within each group
  var x1 = d3.scale.ordinal()
              .domain(varNames)
              .rangeRoundBands([0, x0.rangeBand()]);

  //Make the y axis
  var yAxis = d3.svg.axis()
                .scale(y)
                .orient('left');

  //Make the x axis
  var xAxis = d3.svg.axis()
		.scale(x0)
		.orient("bottom");

  //Make the svg
  var svg = d3.select("#species").append("svg")
          .attr("width",  w)
          .attr("height", h)
          .append("g");


  //Make the groups for the bars to go into
  var selection = svg.selectAll(".series")
    .data(data)
    .enter().append("g")
    .attr("class", "series")
    .attr("transform", function (d) {
      return "translate(" + x0(d['Geography']) + ",0)";
    });

  //Add the bars the the chart
  selection.selectAll("rect")
    .data(function (d) { return d.mapping; }) //A
    .enter().append("rect")
    .attr("width", x1.rangeBand())
    .attr("class", "bar")
    .attr("x", function(d){return x1(d.name);})
    .attr("y", function (d) { return y(d.y1); })
    .attr("height", function (d) { return y(d.y0) - y(d.y1); })
    .style("fill", function (d) { return color(d.name); })
    .on("mouseover", function (d) { showPopover.call(this, d); })
   .on("mouseout",  function (d) { removePopovers(); })
   .style("opacity",".75");


  //Add the Y axis
  svg.append('g')
    .attr("class", "axis")
    .attr("transform", "translate(" + padding + ",0)")
    .call(yAxis)
    .append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 6)
    .attr("dy", ".71em")
    .style("text-anchor", "end")
    .text(yLabel);

  //Add the x axis
  svg.append('g')
    .attr("class", "axis")
    .attr("transform", "translate(0, " + (h-marginBottom) + ")")
    .call(xAxis)
    .selectAll("text")
    .attr("y", 12)
    .attr("x", -5)
    .attr("dy", ".0em")
    .attr("transform", "rotate(-45)")
    .style("text-anchor", "end");

  //Make the legend
  var legend = svg.selectAll('.legend')
    .data(color.domain())
    .enter()
    .append('g')
    .attr('class', 'legend')
    .attr("transform", function(d, i) {return "translate(" + (padding + i*260) + "," + (h-marginBottom+65) +")"});


  //Add the legend rects
  legend.append('rect')
    .attr('width', legendRectSize)
    .attr('height', legendRectSize)
    .style('fill', color)
    .style('stroke', color);

  //Add the legend text
  legend.append('text')
    .attr('x', legendRectSize + legendSpacing)
    .attr('y', legendRectSize - legendSpacing)
    .text(function(d) {
      return d;
    });

  //Function to remove the tooltips
  function removePopovers () {
    $('.popover').each(function() {
      $(this).remove();
    });
  }

  //Function to show the tooltips
  function showPopover (d) {
    $(this).popover({
      title: d.label + " County",
      placement: 'auto top',
      container: 'body',
      trigger: 'manual',
      html : true,
      content: function() {
        return popoverLabel+
        d3.format(",")(d.value ? d.value: d.y1 - d.y0); }
    });
    $(this).popover('show')
  }
}

//This function passes the google chart info to the drawChart function and runs the function
function init() {
              Tabletop.init( { key: public_spreadsheet_url,
                               callback: drawSpeciesChart,
                               simpleSheet: false} )
            }

//do the stuff.
init();
