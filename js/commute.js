var public_spreadsheet_url = 'https://docs.google.com/spreadsheet/pub?hl=en_US&hl=en_US&key=1Wlayz271NRiU1ATYfOxo5VFbYx0lTtcWJI-chNzRgqk&output=html';

function drawChart(data){
  data = data["Travel Time by Percent"].elements;

 
  
  //Width and height
  var w = 850;
  var h = 500;
  var padding = 35;
  var marginBottom = 125;
  var marginTop = 1;
  
  //Legend size
  var legendRectSize = 18;
  var legendSpacing = 4;
  
  //For formatting as percentage 
  var formatAsPercentage = d3.format("%");
  
  //The color scale
  var color = d3.scale.ordinal()
    .range(['rgb(254,232,200)','rgb(253,187,132)','rgb(227,74,51)']);
    
  
  
  //Manipulate the data in order to create grouped bar chart
  
  //Group by county name
  var labelVar = 'county';
  
  //Grab the labels for the data fields (exclude county names)
  var varNames = d3.keys(data[0])
    .filter(function(key){return key !==labelVar;});
    
  
    
  var years = [];
  
  function determineYears(varNames) {
    var yearsArray = [];
    varNames.forEach(function(entry, index){
        if(yearsArray.indexOf(varNames[index].substring(0,4)) == -1){
            yearsArray.push(varNames[index].substring(0,4));
        }
      
      
    })
    return yearsArray;
  }
years = determineYears(varNames);

var htmlString = "<hr><h4>Percentage of Commuters Traveling 30, 45, and 60+ Minutes</h4>Year: <select id='yearSelect'>";

years.forEach(function(entry, index){
  htmlString = htmlString + "<option value='" + years[index] +"'>" + years[index] +"</option>";
});

htmlString = htmlString + "</select><br><Br>";
 

  
  
   //Create the div for the infographic and add it to the page.
  var div = document.createElement("div");
  var idAtt = document.createAttribute("id");
  idAtt.value = "commute";
  div.setAttributeNode(idAtt);
  document.getElementById('content').appendChild(div);
  document.getElementById('commute').innerHTML = htmlString;
  
    //Get the selected metric from the drop down menu
  var metric = document.getElementById('yearSelect');
  var metricSelect = metric.value;
  

 
        
  
    
  //This is kind of unnecessary.  I was originally going to do a stacked bar chart.                  
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
  
  //set the y scale
  var y = d3.scale.linear()
    .domain([0, d3.max(data, function(d){return d.total;})])
    .rangeRound([h-marginBottom, marginTop]);
  
 //set the x scale for spacing out the groups of bars by county
  var x0 = d3.scale.ordinal()
                .domain(data.map(function (d) { return d[labelVar]; }))
                .rangeRoundBands([padding, w-padding*2], 0.2);
  
  function makeDomainArray(varNames){
      var domainArray = [];
      varNames.forEach(function(entry,index){
         if(varNames[index].substring(0,4) == metricSelect){
          domainArray.push(varNames[index]);
         }
      });
      return domainArray;    
      
        
      
  }
  
      //Set the colors of the data categories
  color.domain(makeDomainArray(varNames));
  
  //set the x scale for spacing out the bars within each group
  var x1 = d3.scale.ordinal()
              .domain(makeDomainArray(varNames))
              .rangeRoundBands([0, x0.rangeBand()]);
   
  //Make the y axis
  var yAxis = d3.svg.axis()
                .scale(y)
                .orient('left')
                .tickFormat(formatAsPercentage);

  //Make the x axis                
  var xAxis = d3.svg.axis()
		.scale(x0)
		.orient("bottom");
  
  //Make the svg
  var svg = d3.select("#commute").append("svg")
          .attr("width",  w)
          .attr("height", h)
          .append("g");
  
  
  //Make the groups for the bars to go into
  var selection = svg.selectAll(".series")
    .data(data)
    .enter().append("g")
    .attr("class", "series")
    .attr("transform", function (d) { 
      return "translate(" + x0(d[labelVar]) + ",0)"; 
    });

  //Add the bars the the chart
  selection.selectAll("rect")
    .data(function (d) {
      var newArray = [];
      d.mapping.forEach(function(entry, index){
        
        if(metricSelect == d.mapping[index].name.substring(0,4)){
            newArray.push(d.mapping[index]);
          }
           });
      return newArray;
       }) 
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
    .text("Percent of Commuters");
      
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
    .attr("transform", function(d, i) {return "translate(" + (padding + i*200) + "," + (h-marginBottom+65) +")"});
  
    
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
      return d.substring(5);
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

  function change(){
    metricSelect = metric.value;
  
     x1 = d3.scale.ordinal()
              .domain(makeDomainArray(varNames))
              .rangeRoundBands([0, x0.rangeBand()]);
    
    selection.selectAll("rect")
    .data(function (d) {
      var newArray = [];
      d.mapping.forEach(function(entry, index){
        
        if(metricSelect == d.mapping[index].name.substring(0,4)){
            newArray.push(d.mapping[index]);
          }
           });
      return newArray;
       }) 
    .transition()
    .attr("width", x1.rangeBand())
    .attr("class", "bar")
    .attr("x", function(d){return x1(d.name);})
    .attr("y", function (d) { return y(d.y1); })
    .attr("height", function (d) { return y(d.y0) - y(d.y1); });
  }

  
  d3.selectAll("#yearSelect")
      .on("change", change);
}

//This function passes the google chart info to the drawChart function and runs the function
function init() {
              Tabletop.init( { key: public_spreadsheet_url,
                               callback: drawChart,
                               simpleSheet: false} )
            }

//do the stuff.      
init();