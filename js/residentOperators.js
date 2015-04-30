var public_spreadsheet_url = 'https://docs.google.com/spreadsheet/pub?hl=en_US&hl=en_US&key=1hkMAG88WF_2eojzX1EIai5kN8xbb21aDC_r15zBL9ME&output=html';

function drawResidentMap(data){
    
    var labelVar = "Geography";
    var chartTitle = "<i class='fa fa-bar-chart'></i>Resident Operators";
    var alias = "resident";
    var popoverLabel = "Resident Operators: ";
 
   
  //Set the names of the fields and filter out the label field
  var varNames = d3.keys(data[0])
    .filter(function(key){return key !== labelVar;});
 
  //Create the HTML for the dropdown menu with the fields
  var htmlString = "Select Metric: <select id='" + alias + "MetricSelect'>";
  for (var i=0; i < varNames.length; i++ ) {
    htmlString = htmlString + "<option value='"+varNames[i]+"'>" +varNames[i]+"</option>";
  }
  htmlString = htmlString + "</select>";
  
  //For formatting as percentage 
  var formatAsPercentage = d3.format("%");
  var formatDecimal = d3.format(',');

  
  //Create the div for the infographic and add it to the document
  var div = document.createElement("div");
  var idAtt = document.createAttribute("id");
  idAtt.value = alias;
  div.setAttributeNode(idAtt);
  document.getElementById('content').appendChild(div);
  document.getElementById(alias).innerHTML ="<hr><h4>" + chartTitle+"</h4>" + htmlString +
    "<!-- Following div sets size of infographic. This layer contains the tooltips; the next div is for the map, which is pulled underneath the tooltips with a negative margin -->\
    <div style='width: 400px; height: 500px;'>\
    <div id='tooltip' class='hidden'>\
    <p><strong><span id='name'>100</span></strong></p>\
    <p><span id='unemployed'>100</span></p>\
    <p><span id='rate'>100</span></p>\
    </div></div>\
    <!-- Following div contains the map, which is pulled underneath the tooltips with a negative margin -->\
    <div class='row'>\
    <div class='"+alias+"map' style='margin-top: -485px; margin-left:15px;'></div>\
    <div style='margin-left:430px; margin-top:-520px; width:400px;' class='"+alias+"Table' id='"+alias+"Table'></div></div>";
 
  //Set Color Scale, Colors taken from colorbrewer.js, included in the D3 download
  
  
  //Width and height of Map
  var w = 400;
  var h = 500;
 
  //Define Projection and Scale                    
  var projection = d3.geo.albersUsa()
    .scale([7200])
    .translate([w/2, h/2.9]);
  
  //Define default path generator
  var path = d3.geo.path()
    .projection(projection);
  
  //Create SVG element
  var svg = d3.select("."+alias+"map")
    .append("svg")
    .attr("width", w)
    .attr("height", h);
  
  //Get the selected metric from the drop down menu
  var metric = document.getElementById(alias+"MetricSelect");
  var metricSelect = metric.value;
 
  
  var maximum = d3.max(data, function(d){
     
      return d[metricSelect];
  });
  
  var minimum = d3.min(data, function(d){
      return d[metricSelect];
  });
  
  console.log(minimum);
    
  var color = d3.scale.quantile()
    .range(['rgb(237,248,251)','rgb(178,226,226)','rgb(102,194,164)','rgb(44,162,95)','rgb(0,109,44)'])
    .domain([minimum, maximum]);
 

  //Bring in the Flint Hill county geojson file
  d3.json("data/flinthills.geojson", function(json) {
   
    //Draw Flint Hills Counites
    svg.selectAll("path")
      .data(json.features)
      .enter()
      .append("path")
      .attr("d", path)
      // Set the Fill according to the value of the metric
      .style("fill", function(d){
          metricSelect = metric.value;
          var array =[];
          for (var i=0; i<data.length; i++){                                  
            array.push(data[i][metricSelect]);
          }
          var maximum = Math.max.apply(Math, array);
          var minimum = Math.min.apply(Math, array);
          color = d3.scale.quantile()
            .range(['rgb(237,248,251)','rgb(178,226,226)','rgb(102,194,164)','rgb(44,162,95)','rgb(0,109,44)'])
            .domain([minimum, maximum]);
          for (var i=0; i<data.length; i++){
            if (d.properties.NAME10 == data[i][labelVar]) {
              if (data[i][metricSelect] == '') {
                return '#eeeeee';
              }
              else{
                 return color(data[i][metricSelect]);
              }
            } 
          }
        })
      .style("stroke","#ddd")
      .style("stroke-width","0.5");
    
    //function for changing the colors of the counties
    function change(){
      
      
      
      //Redraw the counties
      svg.selectAll("path")
        .data(json.features)
        .transition()
        .style("fill", function(d){
          metricSelect = metric.value;
          var array =[];
          for (var i=0; i<data.length; i++){
            if (data[i][metricSelect]!=='') {
                array.push(data[i][metricSelect]);
            }
            
          }
          var maximum = Math.max.apply(Math, array);
          var minimum = Math.min.apply(Math, array);
          color = d3.scale.quantile()
            .range(['rgb(237,248,251)','rgb(178,226,226)','rgb(102,194,164)','rgb(44,162,95)','rgb(0,109,44)'])
            .domain([minimum, maximum]);
          for (var i=0; i<data.length; i++){
            if (d.properties.NAME10 == data[i][labelVar]) {
              if (data[i][metricSelect] == '') {
                return '#eeeeee';
              }
              else{
                 return color(data[i][metricSelect]);
              }
            } 
          }
        })
        .style("stroke","#ddd")
        .style("stroke-width","0.5");
      
      //Create the HTML string for the table
      var tableHTML = "<table class='table table-condensed'><thead><tr><th>County</th><th style='text-align:right;'>Value</th></tr></thead>";
      var tableData;
      for(var i=0; i < data.length; i++){
        if (data[i][metricSelect] == '') {
          tableData = "-";
        }
        else{
          tableData = data[i][metricSelect];
        }
        if (tableData == "-") {
          tableHTML = tableHTML + "<tr><td>"+data[i][labelVar]+" County</td><td style='text-align:right;'>" + tableData +  "</td></tr>";
        }
        else if (tableData > 1) {
          tableHTML = tableHTML + "<tr><td>"+data[i][labelVar]+" County</td><td style='text-align:right;'>" + formatDecimal(tableData,0) +  "</td></tr>";
        }
        else{
          tableHTML = tableHTML + "<tr><td>"+data[i][labelVar]+" County</td><td style='text-align:right;'>" + formatAsPercentage(tableData) +  "</td></tr>";
        }
        
      }
      tableHTML= tableHTML + "</table>";
      
      //Add html table
      document.getElementById(alias+"Table").innerHTML=tableHTML; 
    }//end of change function
    
    //Function to remove the tooltips
    function removePopovers () {
      $('.popover').each(function() {
        $(this).remove();
      }); 
    }
    
    //Function to show the tooltips
    function showPopover (d) {
      $(this).popover({
        title: d.data.Mode,
        placement: 'auto right',
        container: 'body',
        trigger: 'manual',
        html : true,
        content: function() { 
          return "Number of Commuters: " + 
          d3.format("1,000")(d.value ? d.value: d.y1 - d.y0); }
      });
      $(this).popover('show')
    }
    
    //Run the change function for the first time
    change();
    
    //Labels for Flint Hills Counties
    svg.selectAll("text")
      .data(json.features)
      .enter()
      .append("text")
      .text(function(d){
          return d.properties.NAME10;
      })
      .attr("text-anchor", "middle")
      .attr("x", function(d){
          return projection([d.properties.INTPTLON10, d.properties.INTPTLAT10])[0];
      })
      .attr("y", function(d){
          return projection([d.properties.INTPTLON10, d.properties.INTPTLAT10])[1];
      })
      .style("fill","#000")
      .attr("text-anchor", "middle")
      .style("font-size","8.5px")
      .style("text-transform","uppercase");
    
    //Listen for a change in the drop down menu and run the change function if it happens
    d3.selectAll("#"+alias+"MetricSelect")
      .on("change", change);
   
    //Draw rest of Kansas Counties
    d3.json("data/ks-counties.json", function(json) {
      
      //Bind data and create one path per GeoJSON feature
      svg.selectAll("path")
        .data(json.features)
        .enter()
        .append("path")
        .attr("d", path)
        .style("fill","none")
        .style("fill-opacity","0")
        .style("stroke","#ddd")
        .style("stroke-width","0.5");
      
      //Draw US states Boundaries
      d3.json("data/us-states.geojson", function(json) {
        
        //Bind data and create one path per GeoJSON feature
        svg.selectAll("path")
          .data(json.features)
          .enter()
          .append("path")
          .attr("d", path)
          .style("fill","none")
          .style("stroke","#999");
        
      });  //End State Layer
    }); //End Kansas Counties Layer
  }); //End Flint Hills Counties Layer
  
  function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }
  
         

}//End of drawAgsalesMapfunction

function init() {
  Tabletop.init( { key: public_spreadsheet_url,
    callback: drawResidentMap,
    simpleSheet: true } )
}
init();