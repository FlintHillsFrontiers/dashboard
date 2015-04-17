console.log('hello.');
var public_spreadsheet_url = 'https://docs.google.com/spreadsheet/pub?hl=en_US&hl=en_US&key=1EhvozhiQx7S9c5ske2pJJriLdtuaN7Mmq8MsdjhvKXQ&output=html';

function drawChart(data){

  //Create the div for the infographic and add it to the page.
  var div = document.createElement("div");
  var idAtt = document.createAttribute("id");
  var classAtt = document.createAttribute("class");
  idAtt.value = "commute2";
  div.setAttributeNode(idAtt);
  classAtt.value = "hidden";
  div.setAttributeNode(classAtt);
  document.getElementById('content').appendChild(div);
  document.getElementById('commute2').innerHTML ="<h5>Average Commute Time by County</h5>";
  
  //Width and height
  var w = 850;
  var h = 500;
  var padding = 35;
  var marginBottom = 130;
  var marginTop = 0;
  
  //Legend size
  var legendRectSize = 18;
  var legendSpacing = 4;
  
  //For formatting as percentage 
  var formatAsPercentage = d3.format("%");
  
  var formatAsNumber = d3.format("04d");
  
  //The color scale
  var color = d3.scale.ordinal()
    .range(['rgb(240,163,10)','rgb(130,90,44)','rgb(0,80,239)','rgb(162,0,37)','rgb(27,161,226)',
            'rgb(216,0,115)','rgb(164,196,0)','rgb(106,0,255)','rgb(96,169,23)','rgb(0,138,0)',
            'rgb(118,96,138)','rgb(109,135,100)','rgb(250,104,0)','rgb(244,114,208)','rgb(229,20,0)',
            'rgb(122,59,63)','rgb(100,118,135)','rgb(0,171,169)','rgb(170,0,255)','rgb(216,193,0)','rgb(0,0,0)']);
  
  var y = d3.scale.linear()
    .domain([0, 30])
    .rangeRound([h-marginBottom, marginTop]);
  
 //set the x scale for spacing out the groups of bars by county
  var x = d3.scale.linear()
                .domain([1980,2010])
                .rangeRound([padding, w-padding*2]);
  
  //Make the y axis
  var yAxis = d3.svg.axis()
                .scale(y)
                .orient('left');
                
  //Make the x axis                
  var xAxis = d3.svg.axis()
		.scale(x)
		.orient("bottom")
                .tickFormat(formatAsNumber);
  
  var line = d3.svg.line()
    .interpolate("cardinal")
    .x(function(d) { return x(d.label); })
    .y(function(d) { return y(d.value); });
   
   var svg = d3.select("#commute2").append("svg")
          .attr("width",  w + padding*2)
          .attr("height", h + marginTop  + marginBottom)
          .append("g")
          .attr("transform", "translate(" + 0 + "," + 35 + ")");
  
  
  //Group by Year Label
  var labelVar = 'Year';
  
  function key(d) {
    return d.name;
  }
  
  //Grab the labels for the data fields (exclude county names)
  var varNames = d3.keys(data[0])
    .filter(function(key){return key !==labelVar && key !== 'Source';});
  
  
    
  //Set the colors of the data categories
  color.domain(varNames);
    
  var seriesData = varNames.map(function (name){
    return{
        name:name,
        values: data.map(function(d){
            return{name: name, label: d[labelVar], value: +d[name]};
        })
    };
  });
  
  x.domain(d3.extent(data, function(d) { return d.Year; }));
  
  y.domain([
    d3.min(seriesData, function(c) { return d3.min(c.values, function(v) { return v.value; }); }),
    d3.max(seriesData, function(c) { return d3.max(c.values, function(v) { return v.value; }); })
  ]);
           
  //Draw the Lines
                
    var series = svg.selectAll(".series")
      .data(seriesData, key)
      .enter().append("g")
      .attr("class", "series");

  series.append("path")
    .attr("class", "line")
    .attr("d", function (d) { return line(d.values); })
    .style("stroke", function (d) { return color(d.name); })
    .style("stroke-width", "4px")
    .style("fill", "none")
    .attr("id", function(d){ return d.name+"line";})
    .on("mouseover", function(d) {
        d3.select(this).style("opacity", "1");
      })
    .on("mouseout", function(d) {
        d3.select(this).style("opacity", ".75");
      })
    .style("opacity",".75");

  
 
    
  //Add the Y axis
  svg.append('g')
    .attr("class", "y axis")
    .attr("transform", "translate(" + padding + ",0)")
    .call(yAxis)
    .append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", -35)
    .attr("dy", ".71em")
    .style("text-anchor", "end")
    .text("Average length of commute (minutes)");
      
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
  var j=0;
  var k=0;
  
  var legend = svg.selectAll('.legend')
    .data(color.domain())
    .enter()
    .append('g')
    .attr('class', 'legend')
    .attr("transform", function(d, i) {
        
        if (i<8) {
          return "translate(" + (padding + i*100) + "," + (h-marginBottom+65) +")";
        }
        else if (i>=8 && i<16) {
          j=j+1;
          return "translate(" + (padding + (j-1)*100) + "," + (h-marginBottom+105) +")";
        }
        else if (i>=16 && i<24) {
          k=k+1;
          return "translate(" + (padding + (k-1)*100) + "," + (h-marginBottom+145) +")";
        }
      });
  
    
  //Add the legend rects
  legend.append('rect')
    .attr('width', legendRectSize)
    .attr('height', legendRectSize)
    .style('fill', color)
    .style('stroke', color)
    .on("mouseover", function(d) {
            d3.select(this).style("opacity", "1");
            d3.select("#"+d+"line").style("opacity","1");
            d3.select("#"+d+"line").style("-webkit-filter","drop-shadow( 0px 0px 1px rgba(0,0,0,.4) )");
            d3.select("#"+d+"line").style("filter","drop-shadow( 0px 0px 1px rgba(0,0,0,.4) )");
            console.log(d);
          })
        .on("mouseout", function(d) {
            d3.select(this).style("opacity", ".75");
            d3.select("#"+d+"line").style("opacity",".75");
            d3.select("#"+d+"line").style("-webkit-filter","drop-shadow( 0px 0px 2px rgba(0,0,0,.0) )");
            d3.select("#"+d+"line").style("filter","drop-shadow( 0px 0px 2px rgba(0,0,0,.0) )");
          })
        .style("opacity",".5");
  
  //Add the legend text
  legend.append('text')                                  
    .attr('x', legendRectSize + legendSpacing)           
    .attr('y', legendRectSize - legendSpacing)           
    .text(function(seriesData) {
          return seriesData;
      });
          
    
  
  d3.selectAll(".legend")
    .on("click", function(d){
        var match = false;
        for (var i=0; i<seriesData.length; i++) {
          
          if (d == seriesData[i].name){
            seriesData.splice(i,1);
            match= true;
          }
                   
        }
        
        if (match == false) {
          var newDatum;
          for (var z=0; z < varNames.length; z++){
            if (varNames[z] == d) {
              newDatum = {
                name:varNames[z],
                values: data.map(function(d){
                  return{name: varNames[z], label: d[labelVar], value: +d[varNames[z]]};
                })
              };
            };
          }
          seriesData.push(newDatum)
        }
    
        svg.selectAll(".series").remove();
        
        y.domain([
    d3.min(seriesData, function(c) { return d3.min(c.values, function(v) { return v.value; }); }),
    d3.max(seriesData, function(c) { return d3.max(c.values, function(v) { return v.value; }); })
  ]);

 
    svg.selectAll(".y.axis").transition().duration(1500).call(yAxis); 


    var newLines = svg.selectAll(".series")
      .data(seriesData, key).attr("class","series");
      
      var linesUpdate = d3.transition(newLines)
        .attr("d", function (d) { return line(d.values);});
    
    newLines.transition().duration(1500).attr("d", function (d) { return line(d.values);}).style("stroke", function (d) { return color(d.name); })
        .style("stroke-width", "4px")
        .style("fill", "none"); 
        
    newLines.enter()
        .append("path")
        .attr("class", "series")
        .attr("d", function (d) { return line(d.values); })
        .style("stroke", function (d) { return color(d.name); })
        .style("stroke-width", "4px")
        .style("fill", "none")
        .attr("id", function(d){ return d.name+"line";})
        .on("mouseover", function(d) {
            d3.select(this).style("opacity", "1");
          })
        .on("mouseout", function(d) {
            d3.select(this).style("opacity", ".75");
          })
        .style("opacity",".75");
        
      newLines.exit().remove();
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
      title: d.label,
      placement: 'auto top',
      container: 'body',
      trigger: 'manual',
      html : true,
      content: function() { 
        return "Percent of Commuters: " + 
        d3.format(".1%")(d.value ? d.value: d.y1 - d.y0); }
    });
    $(this).popover('show')
  }
}



//This function passes the google chart info to the drawChart function and runs the function
function init() {
              Tabletop.init( { key: public_spreadsheet_url,
                               callback: drawChart,
                               simpleSheet: true } )
            }

//do the stuff.      
init();