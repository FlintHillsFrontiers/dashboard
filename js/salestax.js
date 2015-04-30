//Load in the Google Sheet
var public_spreadsheet_url = 'https://docs.google.com/spreadsheet/pub?hl=en_US&hl=en_US&key=1BVC9ul1RJw87LjjDHIT-a77ErVEh5voJtUEB2Np15Sg&output=html';

//Function to draw the chart
function drawSalesChart(data) {
    
    var labelVar = 'Year';
    var chartTitle = "<i class='fa fa-credit-card'></i>Retail Sales";
    var alias = "salestax";
    var yLabel = "Sales Tax Revenue (2014 dollars)";
    var popoverLabel = "Sales Tax Revenue (2014 dollars): ";
    
    //Create the div for the infographic and add it to the page.
    var div = document.createElement("div");
    var idAtt = document.createAttribute("id");
    idAtt.value = alias;
    div.setAttributeNode(idAtt);
    document.getElementById('content').appendChild(div);
    document.getElementById(alias).innerHTML = "<hr><h4>"+chartTitle+"</h4>";

    //Width and height
    var w = 850;
    var h = 500;
    var marginLeft = 100;
    var marginRight = 0;
    var marginBottom = 50;
    var marginTop = 0;
   
    //Formatting help 
    var formatAsPercentage = d3.format("%");
    var formatAsNumber = d3.format("");

    //The color scale
    var color = d3.scale.ordinal()
        .range(['rgb(240,163,10)', 'rgb(130,90,44)', 'rgb(0,80,239)', 'rgb(162,0,37)', 'rgb(27,161,226)',
        'rgb(216,0,115)', 'rgb(164,196,0)', 'rgb(106,0,255)', 'rgb(96,169,23)', 'rgb(0,138,0)',
        'rgb(118,96,138)', 'rgb(109,135,100)', 'rgb(250,104,0)', 'rgb(244,114,208)', 'rgb(229,20,0)',
        'rgb(122,59,63)', 'rgb(100,118,135)', 'rgb(0,171,169)', 'rgb(170,0,255)', 'rgb(216,193,0)', 'rgb(0,0,0)']);

    //Create Y scale and set domain
    var y = d3.scale.linear()
        .rangeRound([h - marginBottom, marginTop]);

    //Create x scale and set domain
    var x = d3.scale.linear()
        .rangeRound([marginLeft, w - marginRight]);

    //Make the y axis
    var yAxis = d3.svg.axis()
        .scale(y)
        .orient('left')
        .tickSize(-w + marginLeft)
        .tickSubdivide(true);

    //Make the x axis                
    var xAxis = d3.svg.axis()
        .scale(x)
        .orient("bottom")
        .tickFormat(formatAsNumber);

    //Create the line variable
    var line = d3.svg.line()
        .interpolate("cardinal")
        .x(function (d) {
        return x(d.label);
    })
        .y(function (d) {
        return y(d.value);
    });

    //Create the svg variable
    var svg = d3.select("#"+alias).append("svg")
        .attr("width", w + marginLeft+marginRight)
        .attr("height", h + marginTop + marginBottom)
        .append("g")
        .attr("transform", "translate(" + 0 + "," + 35 + ")");

    
    
    //Set the key for object permanence
    function key(d) {
        return d.name;
    }
 
    //Grab the labels for the data fields (filter out excluded fields)
    
    var varNames = d3.keys(data[0])
        .filter(function (key) {
             return key !== labelVar && key.indexOf("Sales Tax Revenue") == -1  && key !== "CPI" && key !== "State Sales Tax Rate";    
    });

    //Set the colors of the data categories
    color.domain(varNames);

    //Create seriesData object that has the name, label, and value of each item
    var seriesData = varNames.map(function (name) {
        return {
            name: name,
            values: data.map(function (d) {
                return {
                    name: name,
                    label: d[labelVar],
                    value: +d[name]
                };
            })
        };
    });

    //Set the x domain
    x.domain(d3.extent(data, function (d) {
        return d.Year;
    }));

    //Set the y domain
    y.domain([
    d3.min(seriesData, function (c) {
        return d3.min(c.values, function (v) {
            return v.value;
        });
    }),
    d3.max(seriesData, function (c) {
        return d3.max(c.values, function (v) {
            return v.value;
        });
    })]);

    //Add the Y axis
    svg.append('g')
        .attr("class", "y axis")
        .attr("transform", "translate(" + marginLeft + ",0)")
        .call(yAxis)
        .selectAll("text")
        .attr("x", -8);
    svg.selectAll(".y.axis").append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", -90)
        .attr("dy", ".71em")
        .style("text-anchor", "end")
        .text(yLabel);

    //Draw the Lines
    var series = svg.selectAll(".series")
        .data(seriesData)
        .enter().append("g")
        .attr("class", "series");
    series.append("path")
        .attr("class", "line")
        .attr("d", function (d) {
        return line(d.values);
    })
        .style("stroke", function (d) {
        return color(d.name);
    })
        .style("stroke-width", "4px")
        .style("fill", "none")
        .attr("id", function (d) {
        return d.name;
    });

    //Add the points
    series.selectAll(".point")
        .data(function (d) {
        return d.values;
    })
        .enter().append("circle")
        .attr("class", "point")
        .attr("cx", function (d) {
        return x(d.label);
    })
        .attr("cy", function (d) {
        return y(d.value);
    })
        .attr("r", "4px")
        .style("fill", function (d) {
        return color(d.name);
    })
        .style("stroke-width", "0px")
        .on("mouseover", function (d) {
        showPopover.call(this, d);
    })
        .on("mouseout", function (d) {
        removePopovers();
    });

    //Add the x axis
    svg.append('g')
        .attr("class", "axis")
        .attr("transform", "translate(0, " + (h - marginBottom) + ")")
        .call(xAxis)
        .selectAll("text")
        .attr("y", 12)
        .attr("x", -5)
        .attr("dy", ".0em")
        .attr("transform", "rotate(-45)")
        .style("text-anchor", "end");

    //Create the legend div
    var legendHtml = "<div style='width:" + (w+marginLeft+marginRight) + "px;'>";
    
    //Size of Squares in legend buttons
    var legendRectSize = 9;
    
    //Create a button for each item
    varNames.forEach(function(element, index){
        legendHtml = legendHtml + "<button class='btn btn-default btn-xs legend "+alias+"clickable active' style='margin-right:5px;margin-bottom:5px;' id='" + varNames[index] + "'><svg width='9' height='9'><g><rect width='"+legendRectSize+"' height='"+legendRectSize+"' style='fill:" + color(varNames[index]) + ";'></rect></g></svg> " + varNames[index] + "</button>";
    });

    //Close out the legend div
    legendHtml = legendHtml + "</div>";

    //Add the legend div to the bottom of the chart
    var legendDiv = document.createElement("div");
    var legendIdAtt = document.createAttribute("id");
    legendIdAtt.value = alias+"legend";
    legendDiv.setAttributeNode(legendIdAtt);
    document.getElementById(alias).appendChild(legendDiv);
    document.getElementById(alias+'legend').innerHTML = legendHtml;

    //Event listener for updating the chart
    $('body').on('click', '.'+alias+'clickable', function () {
        var id = $(this).attr('id');
        //Toggle the buttons active or not active
        if ($(this).hasClass("active")) {
            $(this).removeClass("active");
        } else {
            $(this).addClass("active");
        }
        changePatents(id);
    });

    //Function to update the chart
    function changePatents(d) {
        var match = false;
        if (d.name) {
            d = d.name;
        }
        //cycle through the seriesData, if there is a match, remove the item and tell the program that there as a match        
        seriesData.forEach(function(element, index) {
            if (d == seriesData[index].name) {
                seriesData.splice(index, 1);
                match = true;
            }
        });

        //If a match was not found, add the item at the end of the object.
        if (match == false) {
            var newDatum;
            varNames.forEach(function(element,index) {
                if (varNames[index] == d) {
                    newDatum = {
                        name: varNames[index],
                        values: data.map(function (d) {
                            return {
                                name: varNames[index],
                                label: d[labelVar],
                                value: +d[varNames[index]]
                            };
                        })
                    };
                }
            });
            seriesData.push(newDatum)
        }

        //update the y axis with the new min and max
        y.domain([
        d3.min(seriesData, function (c) {
            return d3.min(c.values, function (v) {
                return v.value;
            });
        }),
        d3.max(seriesData, function (c) {
            return d3.max(c.values, function (v) {
                return v.value;
            });
        })]);
        svg.selectAll(".y.axis").transition().duration(1000).call(yAxis).selectAll("text")
            .attr("x", -8);

        //Load new series data
        series = svg.selectAll(".series")
            .data(seriesData, key);


        //Update remaining items
        series.selectAll(".series")
            .transition().duration(1000)
            .attr("class", "series");

        series.selectAll("path")
            .transition().duration(1000)
            .attr("class", "line")
            .attr("d", function (d) {
            return line(d.values);
        })
            .style("stroke", function (d) {
            return color(d.name);
        })
            .style("stroke-width", "4px")
            .style("fill", "none")
            .attr("id", function (d) {
            return d.name;
        });


        series.selectAll(".point")
            .data(function (d) {
            return d.values;
        })
            .transition().duration(1000)
            .attr("class", "point")
            .attr("cx", function (d) {
            return x(d.label);
        })
            .attr("cy", function (d) {
            return y(d.value);
        })
            .attr("r", "4px")
            .style("fill", function (d) {
            return color(d.name);
        })
            .style("stroke-width", "0px");



        //enter new items
        series.enter().append("g")
            .attr("class", "series")
            .append("path")
            .attr("class", "line")
            .attr("d", function (d) {
            return line(d.values);
        })
            .style("stroke", function (d) {
            return color(d.name);
        })
            .style("stroke-width", "4px")
            .style("fill", "none")
            .attr("id", function (d) {
            return d.name;
        });

        series.selectAll(".point")
            .data(function (d) {
            return d.values;
        })
            .enter().append("g").append("circle")
            .attr("class", "point")
            .attr("cx", function (d) {
            return x(d.label);
        })
            .attr("cy", function (d) {
            return y(d.value);
        })
            .attr("r", "4px")
            .style("fill", function (d) {
            return color(d.name);
        })
            .style("stroke-width", "0px")
            .on("mouseover", function (d) {
            showPopover.call(this, d);
        })
            .on("mouseout", function (d) {
            removePopovers();
        });
        
        //Remove old items
        series.exit().remove();
    }

    //Function to remove the tooltips
    function removePopovers() {
        $('.popover').each(function () {
            $(this).remove();
        });
    }

    //Function to show the tooltips
    function showPopover(d) {
        $(this).popover({
            title: d.name,
            placement: 'auto top',
            container: 'body',
            trigger: 'manual',
            html: true,
            content: function () {
                return popoverLabel + d3.format(",")(d.value ? d.value : d.y1 - d.y0);
            }
        });
        $(this).popover('show')
    }
}

//Function to pass the Google Sheet to the drawSalesChart function and run the function
function init() {
    Tabletop.init({
        key: public_spreadsheet_url,
        callback: drawSalesChart,
        simpleSheet: true
    })
}

//do the stuff.      
init();