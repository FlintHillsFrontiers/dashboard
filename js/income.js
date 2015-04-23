var public_spreadsheet_url = 'https://docs.google.com/spreadsheet/pub?hl=en_US&hl=en_US&key=1ljdI8dfeh2nRXkf6EwrdpmeAIuTyTXsrFZb6pQXktcM&output=html';


function drawEasementsMap(data){
 
  //Set the names of the fields and filter out the label field
  var varNames = d3.keys(data[0])
    .filter(function(key){return key !=='Label';});
 
  //Create the HTML for the dropdown menu with the fields
  var htmlString = "Select Metric: <select id='easementsMetricSelect'>";
  for (var i=0; i < varNames.length; i++ ) {
    htmlString = htmlString + "<option value='"+varNames[i]+"'>" +varNames[i]+"</option>";
  }
  htmlString = htmlString + "</select>";
  
  //For formatting as percentage 
  var formatAsPercentage = d3.format("%");
  var formatDecimal = d3.format('$,');

  
  //Create the div for the infographic and add it to the document
  var div = document.createElement("div");
  var idAtt = document.createAttribute("id");
  idAtt.value = "easements";
  div.setAttributeNode(idAtt);
  document.getElementById('content').appendChild(div);
  document.getElementById('easements').innerHTML ="<br><br><br><hr><h4><i class='fa fa-money'></i>Income</h4>" + htmlString +
    "<!-- Following div sets size of infographic. This layer contains the tooltips; the next div is for the map, which is pulled underneath the tooltips with a negative margin -->\
    <div style='width: 400px; height: 500px;'>\
    <div id='tooltip' class='hidden'>\
    <p><strong><span id='name'>100</span></strong></p>\
    <p><span id='unemployed'>100</span></p>\
    <p><span id='rate'>100</span></p>\
    </div></div>\
    <!-- Following div contains the map, which is pulled underneath the tooltips with a negative margin -->\
    <div class='row'>\
    <div class='easementsmap' style='margin-top: -485px; margin-left:15px;'></div>\
    <div style='margin-left:430px; margin-top:-520px; width:400px;' class='easementsTable' id='easementsTable'></div></div>";
 
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
  var svg = d3.select(".easementsmap")
    .append("svg")
    .attr("width", w)
    .attr("height", h);
  
  //Get the selected metric from the drop down menu
  var easementsMetric = document.getElementById("easementsMetricSelect");
  var easementsMetricSelect = easementsMetric.value;
  
  var maximum = d3.max(data, function(d){
      return d[easementsMetricSelect];
  });
  
  var minimum = d3.min(data, function(d){
      return d[easementsMetricSelect];
  });
  
  console.log(data[2]);
  
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
          easementsMetricSelect = easementsMetric.value;
          var array =[];
          for (var i=0; i<data.length; i++){                                  
            array.push(data[i][easementsMetricSelect]);
          }
          var maximum = Math.max.apply(Math, array);
          var minimum = Math.min.apply(Math, array);
          color = d3.scale.quantile()
            .range(['rgb(237,248,251)','rgb(178,226,226)','rgb(102,194,164)','rgb(44,162,95)','rgb(0,109,44)'])
            .domain([minimum, maximum]);
          for (var i=0; i<data.length; i++){
            if (d.properties.NAME10 == data[i].Label) {
              if (data[i][easementsMetricSelect] == '') {
                return '#eeeeee';
              }
              else{
                 return color(data[i][easementsMetricSelect]);
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
          easementsMetricSelect = easementsMetric.value;
          var array =[];
          for (var i=0; i<data.length; i++){                                  
            array.push(data[i][easementsMetricSelect]);
          }
          var maximum = Math.max.apply(Math, array);
          var minimum = Math.min.apply(Math, array);
          color = d3.scale.quantile()
            .range(['rgb(237,248,251)','rgb(178,226,226)','rgb(102,194,164)','rgb(44,162,95)','rgb(0,109,44)'])
            .domain([minimum, maximum]);
          for (var i=0; i<data.length; i++){
            if (d.properties.NAME10 == data[i].Label) {
              if (data[i][easementsMetricSelect] == '') {
                return '#eeeeee';
              }
              else{
                 return color(data[i][easementsMetricSelect]);
              }
            } 
          }
        })
        .style("stroke","#ddd")
        .style("stroke-width","0.5");
      
      //Create the HTML string for the table
      var tableHTML = "<table class='table table-condensed'><thead><tr><th>County</th><th style='text-align:right;'>Income</th></tr></thead>";
      var tableData;
      for(var i=0; i < data.length; i++){
        if (data[i][easementsMetricSelect] == '') {
          tableData = "-";
        }
        else{
          tableData = data[i][easementsMetricSelect];
        }
        if (tableData == "-") {
          tableHTML = tableHTML + "<tr><td>"+data[i].Label+" County</td><td style='text-align:right;'>" + tableData +  "</td></tr>";
        }
        else if (tableData > 1) {
          tableHTML = tableHTML + "<tr><td>"+data[i].Label+" County</td><td style='text-align:right;'>" + formatDecimal(tableData,0) +  "</td></tr>";
        }
        else{
          tableHTML = tableHTML + "<tr><td>"+data[i].Label+" County</td><td style='text-align:right;'>" + formatAsPercentage(tableData) +  "</td></tr>";
        }
        
      }
      tableHTML= tableHTML + "</table>";
      
      //Add html table
      document.getElementById("easementsTable").innerHTML=tableHTML; 
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
    d3.selectAll("#easementsMetricSelect")
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
  
         

}//End of drawEasementsMapfunction

function init() {
  Tabletop.init( { key: public_spreadsheet_url,
    callback: drawEasementsMap,
    simpleSheet: true } )
}
init();