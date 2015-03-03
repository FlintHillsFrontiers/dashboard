function drawInfographic(metric){
    console.log("it worked");
    switch (metric) {

/*
 *
 *  BEGIN HELP METRIC
 *
 *
 */

        case metric = "help":
            var availableInfographics = ["Strategy Prioritization Results (metric = strategyprioritization)", "Unemployment by County Over Time (metric = unemployment)"];
            var div = document.createElement("div");
              var idAtt = document.createAttribute("id");
              idAtt.value = "infographichelp";
              div.setAttributeNode(idAtt);
              document.getElementById('infographics').appendChild(div);
              document.getElementById('infographichelp').innerHTML = "<div class='panel panel-default' style='width: 1050px;'>\
                <div class='panel-heading'>\
                    <h3 class='panel-title'>Available Infographics</h3>\
                </div>\
                <div class='panel-body'>\
                    <ul id='helpcontent'></ul>\
                </div>\
                </div>";
              
              for (var i=0; i < availableInfographics.length; i++) {
                var li = document.createElement("li");
                var listitem = document.createTextNode(availableInfographics[i]);
                li.appendChild(listitem);
                document.getElementById('helpcontent').appendChild(li);
              }
        
        break;

/*
 *
 *  BEGIN STRATEGY PRIORITIZATION METRIC
 *
 *
 */

 
        
        case metric = "strategyprioritization":    
            console.log("Straetgy Prioritization Infographic");
              var div = document.createElement("div");
              var idAtt = document.createAttribute("id");
              idAtt.value = "strategyprioritization";
              div.setAttributeNode(idAtt);
              document.getElementById('infographics').appendChild(div);
              document.getElementById('strategyprioritization').innerHTML = "<div class='panel panel-default' style='width: 1050px;'>\
                <div class='panel-heading'>\
                    <h3 class='panel-title'>Flint Hills Strategy Prioritization Results</h3>\
                </div>\
                <div class='panel-body' style='height:600px;'>\
                <svg class='toolchart' id='toolchart'></svg>\
                </div>\
                <div class='panel-footer'>\
                <div class='btn btn-default flinthills'>Flint Hills</div>\
                <div class='btn btn-default leaders'>Leader's Meeting</div>\
                <div class='btn btn-default council'>Council Grove</div>\
                <div class='btn btn-default eldo'>El Dorado</div>\
                <div class='btn btn-default emporia'>Emporia</div>\
                <div class='btn btn-default manhattan'>Manhattan</div>\
                <div class='btn btn-default marys'>Marysville</div>\
                <div class='btn btn-default pawhuska'>Pawhuska</div></div></div>";
                   
              //I actually don't know what this does.      
              function type(d) {
                  d.value = +d.value; // coerce to number
                  return d;
              }
              
              var toolMargin = {top: 0, right: 0, bottom: 30, left: 355},
                  toolWidth = 1000 - toolMargin.left - toolMargin.right,
                  toolHeight = 600 - toolMargin.top - toolMargin.bottom;
              
              var toolx = d3.scale.linear()
                  .range([0, toolWidth]);
              
              var tooly = d3.scale.ordinal()
                  .rangeRoundBands([0, toolHeight], .1);
              
              var toolxAxis = d3.svg.axis() 
                  .scale(toolx)
                  .orient("bottom")
                  .tickSize(-toolHeight)
                  .tickSubdivide(true);
              
              var toolyAxis = d3.svg.axis()
                  .scale(tooly)
                  .orient("left");
              
              var toolchart = d3.select(".toolchart")
                  .attr("width", toolWidth + toolMargin.left + toolMargin.right)
                  .attr("height", toolHeight + toolMargin.top + toolMargin.bottom)
                  .append("g")
                  .attr("transform", "translate(" + toolMargin.left + "," + toolMargin.top + ")");
              
              //Draw the chart using all Flint Hills data
              d3.tsv("dashboard/data/data.tsv", type, function(error, data) {
                      
                  toolx.domain([0, d3.max(data, function(d) { return d.value; })]);
                  tooly.domain(data.map(function(d) { return d.name; }));
              
                
                  toolchart.append("g")
                      .attr("class", "x axis")
                      .attr("transform", "translate(0," + toolHeight + ")")
                      .call(toolxAxis);
                  
                
                  toolchart.selectAll(".toolbar")
                      .data(data)
                      .enter().append("rect")
                      .attr("class", "toolbar")
                      .attr("x", toolx)
                      .attr("y", function(d) { return tooly(d.name); })
                      .attr("width", function(d) { return toolx(d.value); })
                      .attr("height", tooly.rangeBand());
                      
                  toolchart.append("g")
                      .attr("class", "y axis")
                      .call(toolyAxis);
              
              });
              
              
              
              //Redraw with all Flint Hills data      
              d3.select(".flinthills")
                  .on("click", function(){
                      d3.tsv("dashboard/data/data.tsv", type, function(error, data) {
                          toolchart.selectAll(".toolbar")
                              .data(data)
                              .transition()
                              .duration(1500)
                              .attr("class", "toolbar")
                              .attr("x", toolx)
                              .attr("y", function(d) { return tooly(d.name); })
                              .attr("width", function(d) { return toolx(d.value); })
                              .attr("height", tooly.rangeBand());
                      });
                  });
              
              //Redraw with Leader's Meeting Data
              d3.select(".leaders")
                  .on("click", function(){
                      d3.tsv("dashboard/data/leaders.tsv", type, function(error, data) {
                          toolchart.selectAll(".toolbar")
                              .data(data)
                              .transition()
                              .duration(1500)
                              .attr("class", "toolbar")
                              .attr("x", toolx)
                              .attr("y", function(d) { return tooly(d.name); })
                              .attr("width", function(d) { return toolx(d.value); })
                              .attr("height", tooly.rangeBand());
                      });
                  }); 
              
              //Redraw with Council Grove Data
              d3.select(".council")
                  .on("click", function(){
                      d3.tsv("dashboard/data/council.tsv", type, function(error, data) {
                          toolchart.selectAll(".toolbar")
                              .data(data)
                              .transition()
                              .duration(1500)
                              .attr("class", "toolbar")
                              .attr("x", toolx)
                              .attr("y", function(d) { return tooly(d.name); })
                              .attr("width", function(d) { return toolx(d.value); })
                              .attr("height", tooly.rangeBand());
                      });
                  });
              //Redraw with El Dorado Data
              d3.select(".eldo")
                  .on("click", function(){
                      d3.tsv("dashboard/data/eldorado.tsv", type, function(error, data) {
                          toolchart.selectAll(".toolbar")
                              .data(data)
                              .transition()
                              .duration(1500)
                              .attr("class", "toolbar")
                              .attr("x", toolx)
                              .attr("y", function(d) { return tooly(d.name); })
                              .attr("width", function(d) { return toolx(d.value); })
                              .attr("height", tooly.rangeBand());
                      });
                  });
              
              //Redraw with Emporia Data 
              d3.select(".emporia")
                  .on("click", function(){
                      d3.tsv("dashboard/data/Emporia.tsv", type, function(error, data) {
                          toolchart.selectAll(".toolbar")
                              .data(data)
                              .transition()
                              .duration(1500)
                              .attr("class", "toolbar")
                              .attr("x", toolx)
                              .attr("y", function(d) { return tooly(d.name); })
                              .attr("width", function(d) { return toolx(d.value); })
                              .attr("height", tooly.rangeBand());
                      });
                  });
                
              //Redraw with Manhattan Data
              d3.select(".manhattan")
                  .on("click", function(){
                      d3.tsv("dashboard/data/manhattan.tsv", type, function(error, data) {
                          toolchart.selectAll(".toolbar")
                              .data(data)
                              .transition()
                              .duration(1500)
                              .attr("class", "toolbar")
                              .attr("x", toolx)
                              .attr("y", function(d) { return tooly(d.name); })
                              .attr("width", function(d) { return toolx(d.value); })
                              .attr("height", tooly.rangeBand());
                      });
                  });
                  
              //Redraw with Marysville Data
              d3.select(".marys")
                  .on("click", function(){
                      d3.tsv("dashboard/data/marysville.tsv", type, function(error, data) {
                          toolchart.selectAll(".toolbar")
                              .data(data)
                              .transition()
                              .duration(1500)
                              .attr("class", "toolbar")
                              .attr("x", toolx)
                              .attr("y", function(d) { return tooly(d.name); })
                              .attr("width", function(d) { return toolx(d.value); })
                              .attr("height", tooly.rangeBand());
                      });
                  });
              
              //Redraw with Pawhuska Data
              d3.select(".pawhuska")
                  .on("click", function(){
                      d3.tsv("dashboard/data/pawhuska.tsv", type, function(error, data) {
                          toolchart.selectAll(".toolbar")
                              .data(data)
                              .transition()
                              .duration(1500)
                              .attr("class", "toolbar")
                              .attr("x", toolx)
                              .attr("y", function(d) { return tooly(d.name); })
                              .attr("width", function(d) { return toolx(d.value); })
                              .attr("height", tooly.rangeBand());
                      });
                  });
           
        break;
    
/*
 *
 *  BEGIN UNEMPLOYMENT METRIC
 *
 */         
        
        case metric = "unemployment":
            console.log("unemployment Infographic");
            var div = document.createElement("div");
            var idAtt = document.createAttribute("id");
            idAtt.value = "unemployment";
            div.setAttributeNode(idAtt);
            document.getElementById('infographics').appendChild(div);
            document.getElementById('unemployment').innerHTML ="<div class='panel panel-default' style='width: 1050px;'>\
                <div class='panel-heading' >\
                    <button type='button' class='btn btn-default pull-right btn-xs'> <span class='glyphicon glyphicon-info-sign' aria-hidden='true'></span></button>\
                    <h3 class='panel-title'>Flint Hills Unemployment by County</h3>\
                </div>\
                <div class='panel-body' style='height:525px;'>\
                <svg style='position: relative; top: 0px; left: 400px;' class='unemployment' id='unemployment'></svg>\
                <!-- Following div sets size of infographic. This layer contains the tooltips; the next div is for the map, which is pulled underneath the tooltips with a negative margin -->\
                <div style='width: 400px; height: 500px; margin-top: -500px;'>\
                <div id='tooltip' class='hidden'>\
                <p><strong><span id='name'>100</span></strong></p>\
                <p><span id='unemployed'>100</span></p>\
                <p><span id='rate'>100</span></p>\
                </div></div>\
                <!-- Following div contains the map, which is pulled underneath the tooltips with a negative margin -->\
                <div class='map' style='margin-top: -500px'></div></div>\
                <div class='panel-footer'>\
                <datalist id='yearlist'>\
                <option>2007</option>\
                <option>2008</option>\
                <option>2009</option>\
                <option>2010</option>\
                <option>2011</option>\
                <option>2012</option>\
                <option>2013</option>\
                </datalist>\
                <input type='range' id='yearRange' value='2007'  min='2007' max='2013' step='1' list='yearlist' >\
                <div class='btn-toolbar' role='toolbar' aria-label='...'>\
                <div class='btn-group btn-group-sm' role='group' aria-label='...'>\
                  <button type='button' class='btn btn-default' disabled='disabled'> <span class='glyphicon glyphicon-step-backward' aria-hidden='true'></span></button>\
                  <button type='button' class='btn btn-default' disabled='disabled'> <span class='glyphicon glyphicon-play' aria-hidden='true'></span></button>\
                  <button type='button' class='btn btn-default' disabled='disabled'> <span class='glyphicon glyphicon-step-forward' aria-hidden='true'></span></button>\
                </div>\
                <div class='btn-group btn-group-sm' role='group' aria-label='...'>\
                  <span id='range' class='pull-right' style='font-weight: bold; padding-top: 5px; padding-left: 5px;'></span>\
                  </div>\
                </div></div></div>";
    
  
            var dataArray = [0,0];
           
            var public_spreadsheet_url = 'https://docs.google.com/spreadsheet/pub?hl=en_US&hl=en_US&key=194fY194abaOe9gjopnutM0kBWpnss8-f-wod8YzrjCg&output=html';
            var public_spreadsheet_url2 = 'https://docs.google.com/spreadsheet/pub?hl=en_US&hl=en_US&key=1JsjyHZt5AgJCmC_42X9veNFw6CSaQqPpQCG4Ej5LVB8&output=html';
            
            var margin = {top: 5, right: 0, bottom: 30, left: 75},
              width = 600 - margin.left - margin.right,
              height = 500 - margin.top - margin.bottom;
          
            var x = d3.scale.ordinal()
              .rangeRoundBands([0, width], .1);
              
            var y = d3.scale.linear()
              .domain([0,.1])
              .range([0, height]);

 

            var xAxis = d3.svg.axis() 
              .scale(x)
              .orient("bottom");
          
            var yAxis = d3.svg.axis()
              .scale(y)
              .orient("left")
              .tickSize(-width)
              .tickSubdivide(true);
          
            var chart = d3.select(".unemployment")
              .attr("width", width + margin.left + margin.right)
              .attr("height", height + margin.top + margin.bottom)
              .append("g")
              .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
              
              //Set Color Scale, Colors taken from colorbrewer.js, included in the D3 download
              var color = d3.scale.quantile()
                  .range(['rgb(26,150,65)','rgb(166,217,106)','rgb(253,174,97)','rgb(215,25,28)'])
                  .domain([0.03, .09]);
              
   
            
  
 

            function drawMap(dataset, tabletop) {
              
              dataArray[0]=dataset;
              console.log(dataArray);
            
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
           
                                                  
                  
              //Set year at bottom of slider
              var year = document.getElementById("yearRange").value;
              document.getElementById("range").innerHTML=year;
          
              /*
               * The following function draws the Flint Hills counties, kansas counties, US state boundaries, and unemployment circles.
               * It also includes the function to update the unemployment circles based on year.  The functions are nested to
               * ensure proper drawing order.
               */
    
   
                d3.json("dashboard/data/flinthills.geojson", function(json) {
            
                    //Draw Flint Hills Counites
                    svg.selectAll("path")
                        .data(json.features)
                        .enter()
                        .append("path")
                        .attr("d", path)
                        .style("fill","#e7e7e7")
                        .style("stroke","#ddd")
                        .style("stroke-width","0.5");
                        
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
            
                  //Draw rest of Kansas Counties
                  d3.json("dashboard/data/ks-counties.json", function(json) {
            
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
                    d3.json("dashboard/data/us-states.geojson", function(json) {
                      //Bind data and create one path per GeoJSON feature
                      svg.selectAll("path")
                          .data(json.features)
                          .enter()
                          .append("path")
                          .attr("d", path)
                          .style("fill","none")
                          .style("stroke","#999");
                     
               
                    //Draw circles for each point
                    svg.selectAll("circle")
                      //Load Data
                      .data(dataset)
                      .enter()
                      .append("circle")
                      //Place circles on centroids of counties
                      .attr("cx", function(d) {
                        return projection([d.lon, d.lat])[0];
                      })
                      .attr("cy", function(d) {
                        return projection([d.lon, d.lat])[1];
                      })
                      //Set the Radius
                      .attr("r", function(d){
                        return Math.sqrt(parseInt(d['unemp'+year.toString()]) * 0.5);    
                      })
                      //Set the Fill Color
                      .style("fill", function(d) {
                         var value = d['unemprate'+year.toString()];			   		
                         if(value) {
                          return color(value);
                         }
                         else {
                         //If value is undefined…
                            return "#333";
                         }
                      })
                      .style("opacity",".75")
                        
                      //Create tooltips
                      .on("mouseover", function(d) {
                        //Get this bar's x/y values, then augment for the tooltip
                        var xPosition = parseFloat(d3.select(this).attr("cx")) +30;
                        var yPosition = parseFloat(d3.select(this).attr("cy")) -15;
                                  
                        //Update the tooltip position and value
                        d3.select("#tooltip")
                          .style("left", xPosition + "px")
                          .style("top", yPosition  + "px")
                          .select("#name")
                          .text(d.name + " County");
                        d3.select("#unemployed")
                          .text("Number of Unemployed: " + numberWithCommas(d['unemp'+year.toString()]));
                        d3.select("#rate")
                          .text("Unemployment Rate: " + Math.round(d['unemprate'+year.toString()] * 1000)/10 + "%");
                      
                        //Show the tooltip
                        d3.select("#tooltip").classed("hidden", false);
                      })
                      
                      //hide tooltip on mouseout
                      .on("mouseout", function() {
                        svg.selectAll("circle").style("opacity",".75");
                        d3.select("#tooltip").classed("hidden", true);
                      }); 
                    });  //End State Layer
                  }); //End Kansas Counties Layer
                }); //End Flint Hills Counties Layer
    
                //Begin section for updating based on year
                
                //Listen for change on scale
                d3.select("#yearRange")
                  .on("change",function(){
                    
                    //Change the year displayed
                    year = document.getElementById("yearRange").value;
                    document.getElementById("range").innerHTML=year;
                    
                    chart.selectAll(".bar")
                            .data(dataArray[1])
                            .transition()
                            .duration(1500)
                            .attr("class", "bar")
                            .attr("x", function(d) { return x(d.area); })
                            .attr("y", function(d){ return height - y(0.1-d[year.toString()]);} )
                            .attr("width", x.rangeBand())
                            .attr("height", function(d) { return y(0.1-d[year.toString()]); })
                            .style("fill", function(d) {
                              var value = d[year.toString()];			   		
                              if(value) {
                                return color(value);
                              }
                              else {
                              //If value is undefined…
                                return "#333";
                              }
                            });
                    
                    //Update Circles
                    svg.selectAll("circle")
                      .data(dataArray[0])
                      .transition()
                      .duration(1000)
                      .attr("cx", function(d) {
                        return projection([d.lon, d.lat])[0];
                      })
                      .attr("cy", function(d) {
                        return projection([d.lon, d.lat])[1];
                      })
                      //Reset the Radius
                      .attr("r", function(d){
                        return Math.sqrt(parseInt(d['unemp'+year.toString()]) * 0.5);    
                      })
                      //Change the Fill Color
                      .style("fill", function(d) {
                        var value = d['unemprate'+year.toString()];			   		
                        if(value) {
                          return color(value);
                        }
                        else {
                          //If value is undefined…
                            return "#333";
                        }
                      })
                      .style("opacity",".75")
                      //Update Tooltips	  
                      .on("mouseover", function(d) {
                        //Get this bar's x/y values, then augment for the tooltip
                        var xPosition = parseFloat(d3.select(this).attr("cx")) +30;
                        var yPosition = parseFloat(d3.select(this).attr("cy")) -15;
                        console.log(xPosition, yPosition);
                                
                        //Update the tooltip position and value
                        d3.select("#tooltip")
                          .style("left", xPosition + "px")
                          .style("top", yPosition  + "px")
                          .select("#name")
                          .text(d.name + " County");
                                  
                        d3.select("#unemployed")
                          .text("Number of Unemployed: " + numberWithCommas(d['unemp'+year.toString()]));
                               
                        d3.select("#rate")
                          .text("Unemployment Rate: " + Math.round(d['unemprate'+year.toString()] * 1000)/10 + "%");
                                
                        //Show the tooltip
                        d3.select("#tooltip").classed("hidden", false);
                      })
                      .on("mouseout", function() {
                        svg.selectAll("circle").style("opacity",".75");
                        //Hide the tooltip
                        d3.select("#tooltip").classed("hidden", true);
                      });
                });
       
                function numberWithCommas(x) {
                    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                }
            }
            function drawChart(data){

                dataArray[1] = data;
              
                year = document.getElementById("yearRange").value;
               
                y.domain([0, 0.1 ]).range([height, 0]);
                x.domain(data.map(function(d) { return d.area; }));
              
                chart.append("g")
                    .attr("class", "x axis")
                    .attr("transform", "translate(0," + height + ")")
                    .call(xAxis);
                    
                    chart.append("g")
                      .attr("class", "y axis")
                      .call(yAxis);
           
                chart.selectAll(".bar")
                    .data(dataArray[1])
                    .enter().append("rect")
                    .attr("class", "bar")
                    .attr("x", function(d) { return x(d.area); })
                    .attr("y", function(d){ return height - y(0.1-d[year.toString()]);} )
                    .attr("width", x.rangeBand())
                    .attr("height", function(d) { return y(0.1-d[year.toString()]); } )
                    .style("fill", function(d) {
                        var value = d[year.toString()];			   		
                        if(value) {
                          return color(value);
                        }
                        else {
                          //If value is undefined…
                            return "#333";
                        }
                      });
            }
            function init() {
              Tabletop.init( { key: public_spreadsheet_url,
                               callback: drawMap,
                               simpleSheet: true } )
            }
            function init2() {
              Tabletop.init( { key: public_spreadsheet_url2,
                               callback: drawChart,
                               simpleSheet: true } )
            }
            init();
            init2();
        break;
        
        default:
            console.log ('switch activated');
    }
}

