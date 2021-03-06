function drawInfographic(metric){
       
        //For formatting as percentage 
            var formatAsPercentage = d3.format("%");
       
            console.log("unemployment Infographic");
            var div = document.createElement("div");
            var idAtt = document.createAttribute("id");
            idAtt.value = "unemployment";
            div.setAttributeNode(idAtt);
            document.getElementById('content').appendChild(div);
            document.getElementById('unemployment').innerHTML = "<h4><i class='fa fa-bar-chart'></i>Unemployment</h4>\
            <div>Year: <select id='unemploymentYearSelect'>\
                <option value='2007'>2007</option>\
                <option value='2008'>2008</option>\
                <option value='2009'>2009</option>\
                <option value='2010'>2010</option>\
                <option value='2011'>2011</option>\
                <option value='2012'>2012</option>\
                <option value='2013'>2013</option>\
                </select></div>\
                <svg style='position: relative; top: 0px; left: 400px;' class='unemployment' id='unemployment'></svg>\
                <!-- Following div sets size of infographic. This layer contains the tooltips; the next div is for the map, which is pulled underneath the tooltips with a negative margin -->\
                <div style='width: 400px; height: 500px; margin-top: -500px;'>\
                <div id='tooltip' class='hidden'>\
                <p><strong><span id='name'>100</span></strong></p>\
                <p><span id='unemployed'>100</span></p>\
                <p><span id='rate'>100</span></p>\
                </div></div>\
                <!-- Following div contains the map, which is pulled underneath the tooltips with a negative margin -->\
                <div class='map' style='margin-top: -500px'></div>\
                                                 </div></div>";
           
    
  
            var dataArray = [0,0];
           
            var public_spreadsheet_url = 'https://docs.google.com/spreadsheet/pub?hl=en_US&hl=en_US&key=1JsjyHZt5AgJCmC_42X9veNFw6CSaQqPpQCG4Ej5LVB8&output=html';
            
            
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
              .tickSubdivide(true)
              .tickFormat(formatAsPercentage);
          
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
              
              dataset = dataset["Unemployment"].elements;
              
               //Grab the labels for the data fields (exclude county names)
  var varNames = d3.keys(dataset[0])
    .filter(function(key){return key !=='County' && key !=='lat' && key !=='lon' && key !=='pop';});
    
 
    
  //Determine the number of years to display in the drop down menu by selecting the first 4 characters of the column heading, which should be the year
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
  
     console.log(years);

  //Create dropdown menu
  var htmlString = "";
  years.forEach(function(entry, index){
    htmlString = htmlString + "<option value='" + years[index] +"'>" + years[index] +"</option>";
  });
 
  
   document.getElementById('unemploymentYearSelect').innerHTML = htmlString;

              
              dataArray[0]=dataset;
            
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
              var year = document.getElementById("unemploymentYearSelect").value;
              
          
              /*
               * The following function draws the Flint Hills counties, kansas counties, US state boundaries, and unemployment circles.
               * It also includes the function to update the unemployment circles based on year.  The functions are nested to
               * ensure proper drawing order.
               */
    
   
                d3.json("data/flinthills.geojson", function(json) {
            
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
                        return Math.sqrt(parseInt(d[year.toString()+' Unemployment']) * 0.5);    
                      })
                      //Set the Fill Color
                      .style("fill", function(d) {
                         var value = d[year.toString()+' Unemployment Rate'];			   		
                         if(value) {
                          return color(value);
                         }
                         else {
                         //If value is undefinedů
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
                          .text(d['County'] + " County");
                        d3.select("#unemployed")
                          .text("Number of Unemployed: " + numberWithCommas(d[year.toString()+' Unemployment']));
                        d3.select("#rate")
                          .text("Unemployment Rate: " + Math.round(d[year.toString()+' Unemployment Rate'] * 1000)/10 + "%");
                      
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
                d3.select("#unemploymentYearSelect")
                  .on("change",function(){
                    
                    //Change the year displayed
                    year = document.getElementById("unemploymentYearSelect").value;
                    
                    
                    chart.selectAll(".bar")
                            .data(dataArray[1])
                            .transition()
                            .duration(1500)
                            .attr("class", "bar")
                            .attr("x", function(d) { return x(d['Geography']); })
                            .attr("y", function(d){ return height - y(0.1-d[year.toString()]);} )
                            .attr("width", x.rangeBand())
                            .attr("height", function(d) { return y(0.1-d[year.toString()]); })
                            .style("fill", function(d) {
                              var value = d[year.toString()];			   		
                              if(value) {
                                return color(value);
                              }
                              else {
                              //If value is undefinedů
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
                     //Set the Radius
                      .attr("r", function(d){
                        return Math.sqrt(parseInt(d[year.toString()+' Unemployment']) * 0.5);    
                      })
                      //Set the Fill Color
                      .style("fill", function(d) {
                         var value = d[year.toString()+' Unemployment Rate'];			   		
                         if(value) {
                          return color(value);
                         }
                         else {
                         //If value is undefinedů
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
                          .text(d['County'] + " County");
                                  
                        d3.select("#unemployed")
                          .text("Number of Unemployed: " + numberWithCommas(d[year.toString()+' Unemployment']));
                               
                        d3.select("#rate")
                          .text("Unemployment Rate: " + Math.round(d[year.toString()+' Unemployment Rate'] * 1000)/10 + "%");
                                
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
                
                data = data["Unemployment Comparison"].elements;
            
                dataArray[1] = data;
              
                year = document.getElementById("unemploymentYearSelect").value;
               
                y.domain([0, 0.1 ]).range([height, 0]);
                x.domain(data.map(function(d) { return d['Geography']; }));
              
                chart.append("g")
                    .attr("class", "x axis")
                    .attr("transform", "translate(0," + height + ")")
                    .call(xAxis);
                    
                    chart.append("g")
                      .attr("class", "y axis")
                      .call(yAxis)
                      .append("text")
                      .attr("transform", "rotate(-90)")
                      .attr("y", -40)
                      .attr("dy", ".71em")
                      .style("text-anchor", "end")
                      .text("Unemployment Rate");
           
                chart.selectAll(".bar")
                    .data(dataArray[1])
                    .enter().append("rect")
                    .attr("class", "bar")
                    .attr("x", function(d) { return x(d['Geography']); })
                    .attr("y", function(d){ return height - y(0.1-d[year.toString()]);} )
                    .attr("width", x.rangeBand())
                    .attr("height", function(d) { return y(0.1-d[year.toString()]); } )
                    .style("fill", function(d) {
                        var value = d[year.toString()];			   		
                        if(value) {
                          return color(value);
                        }
                        else {
                          //If value is undefinedů
                            return "#333";
                        }
                      });
            }
 function init() {
              Tabletop.init( { key: public_spreadsheet_url,
                               callback: drawMap,
                               simpleSheet: false } )
            }
            function init2() {
              Tabletop.init( { key: public_spreadsheet_url,
                               callback: drawChart,
                               simpleSheet: false } )
            }
            init();
            init2();
      
}

drawInfographic();
           
       