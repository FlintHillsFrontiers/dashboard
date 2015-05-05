

 var public_spreadsheet_url = 'https://docs.google.com/spreadsheet/pub?hl=en_US&hl=en_US&key=1cukLFdD9JAOOwt4cvFEBkloXml7Rsyui3U6hgfFQF8Y&output=html';


function drawMap(data){
  
  var label = 'Geography';
  
  data = data["Community Health"].elements;
  
  
  var varNames = d3.keys(data[0])
                    .filter(function(key){return key !==label;});
                console.log(varNames);
                
        var htmlString = "Select Metric: <select id='metricSelect'>";
          
        for (var i=0; i < varNames.length; i++ ) {
          htmlString = htmlString + "<option value='"+varNames[i]+"'>" +varNames[i]+"</option>";
        }
        
        htmlString = htmlString + "</select>";
        
        console.log(htmlString);
          
          
    
        //For formatting as percentage 
            var formatAsPercentage = d3.format("%");
       
            console.log("health map");
            var div = document.createElement("div");
            var idAtt = document.createAttribute("id");
            idAtt.value = "health";
            
            div.setAttributeNode(idAtt);
            
            document.getElementById('content').appendChild(div);
            document.getElementById('health').innerHTML ="<hr><h4><i class='fa fa-medkit'></i>Community Health</h4>" + htmlString +
                "<!-- Following div sets size of infographic. This layer contains the tooltips; the next div is for the map, which is pulled underneath the tooltips with a negative margin -->\
                <div style='width: 400px; height: 500px;'>\
                <div id='tooltip' class='hidden'>\
                <p><strong><span id='name'>100</span></strong></p>\
                <p><span id='unemployed'>100</span></p>\
                <p><span id='rate'>100</span></p>\
                </div></div>\
                <!-- Following div contains the map, which is pulled underneath the tooltips with a negative margin -->\
                <div class='row'>\
                <div class='map' style='margin-top: -485px; margin-left:15px;'></div>\
                <div style='margin-left:430px; margin-top:-520px; width:400px;' class='healthTable' id='healthTable'></div></div>";
            
            
            
          
              
            //Set Color Scale, Colors taken from colorbrewer.js, included in the D3 download
            var color = d3.scale.quantile()
                .range(['rgb(26,150,65)','rgb(166,217,106)','rgb(253,174,97)','rgb(215,25,28)'])
                .domain([0.03, .09]);
              
         //Width and height
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
              var svg = d3.select(".map")
                  .append("svg")
                  .attr("width", w)
                  .attr("height", h);
           
           
           var metric = document.getElementById("metricSelect");
               
                  
            var metricSelect = metric.value;
          
            
   
                d3.json("data/flinthills.geojson", function(json) {
                    
            
                    //Draw Flint Hills Counites
                    svg.selectAll("path")
                        .data(json.features)
                        .enter()
                        .append("path")
                        .attr("d", path)
                        .style("fill", function(d){
                                metricSelect = metric.value;
                                for (var i=0; i<data.length; i++){                                  
                                  if (d.properties.NAME10 == data[i][label]) {
                                      if(data[i][metricSelect] == 'better'){
                                        return '#91cf60';
                                      }
                                      else if(data[i][metricSelect] == 'moderate'){
                                        return '#ffffbf';
                                      }
                                      else if(data[i][metricSelect] == 'worse'){
                                        return '#fc8d59';
                                      }
                                      else{
                                        return '#eeeeee';
                                      }
                                  }
                                }
                            
                        })
                        .style("stroke","#ddd")
                        .style("stroke-width","0.5");
                        
                        
                   
                  
                function change(){
                  
                  svg.selectAll("path")
                        .data(json.features)
                        .transition()
                        .style("fill", function(d){
                                metricSelect = metric.value;
                                for (var i=0; i<data.length; i++){                                  
                                  if (d.properties.NAME10 == data[i][label]) {
                                      if(data[i][metricSelect] == 'better'){
                                        return '#91cf60';
                                      }
                                      else if(data[i][metricSelect] == 'moderate'){
                                        return '#ffffbf';
                                      }
                                      else if(data[i][metricSelect] == 'worse'){
                                        return '#fc8d59';
                                      }
                                      else{
                                        return '#eeeeee';
                                      }
                                  }
                                }
                            
                        })
                        .style("stroke","#ddd")
                        .style("stroke-width","0.5");
                        
                        
                    var tableHTML = "<table class='table table-condensed'><thead><tr><th style='width:50px;'></th><th>County</th></tr></thead>";
        
                    for(var i=0; i < data.length; i++){
                      if(data[i][metricSelect] == 'better'){
                        tableHTML = tableHTML + "<tr><td><i class='fa fa-circle' style='color: #91cf60;'></td><td>" + data[i][label] +  " County</td></tr>";
                      }
                                      else if(data[i][metricSelect] == 'moderate'){
                                        tableHTML = tableHTML + "<tr><td><i class='fa fa-square fa-rotate-30' style='color: #ffffbf;'></td><td>" + data[i][label] +  " County</td></tr>";
                                      }
                                      else if(data[i][metricSelect] == 'worse'){
                                         tableHTML = tableHTML + "<tr><td><i class='fa fa-square' style='color: #fc8d59;'></td><td>" + data[i][label] +  " County</td></tr>";
                                      }
                                      else{
                                        tableHTML = tableHTML + "<tr><td><i class='fa fa-circle-o' style='color: #dddddd;'</td><td>" + data[i][label] +  " County</td></tr>";
                                      }
         
                
                    }
                    tableHTML= tableHTML + "</table>";
                    document.getElementById("healthTable").innerHTML=tableHTML; 
                }
                
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
                        
                         d3.selectAll("#metricSelect")
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
        
        var tableHTML = "<table class='table table-condensed'><thead><tr><th style='width:50px;'></th><th>County</th></tr></thead>";
        
        for(var i=0; i < data.length; i++){
          if(data[i][metricSelect] == 'better'){
                                        tableHTML = tableHTML + "<tr><td><i class='fa fa-circle' style='color: #91cf60;'></td><td>" + data[i][label] +  " County</td></tr>";
                                      }
                                      else if(data[i][metricSelect] == 'moderate'){
                                        tableHTML = tableHTML + "<tr><td><i class='fa fa-square fa-rotate-30' style='color: #ffffbf;'></td><td>" + data[i][label] +  " County</td></tr>";
                                      }
                                      else if(data[i][metricSelect] == 'worse'){
                                         tableHTML = tableHTML + "<tr><td><i class='fa fa-square' style='color: #fc8d59;'></td><td>" + data[i][label] +  " County</td></tr>";
                                      }
                                      else{
                                        tableHTML = tableHTML + "<tr><td><i class='fa fa-circle-o' style='color: #eeeeee;'</td><td>" + data[i][label] +  " County</td></tr>";
                                      }
         
                
        }
        tableHTML= tableHTML + "</table>";
        document.getElementById("healthTable").innerHTML=tableHTML;        
                
               


  }
            
      


function init() {
              Tabletop.init( { key: public_spreadsheet_url,
                               callback: drawMap,
                               simpleSheet: false } )
}
            
          
init();