


var public_spreadsheet_url = 'https://docs.google.com/spreadsheet/pub?hl=en_US&hl=en_US&key=1Wlayz271NRiU1ATYfOxo5VFbYx0lTtcWJI-chNzRgqk&output=html';

function drawChart(data){
  
   data = data["Mode Share"].elements;
   

  //Create the div for the infographic and add it to the page.
  var div = document.createElement("div");
  var idAtt = document.createAttribute("id");
  
  idAtt.value = "modeshare";
  div.setAttributeNode(idAtt);
  
  document.getElementById('content').appendChild(div);
  document.getElementById('modeshare').innerHTML ="<hr><h4>Means of Travel to Work by County</h4>\
          Year: <select id='yearSelect'>\
          <option value='1980'>1980</option>\
          <option value='1990'>1990</option>\
          <option value='2000'>2000</option>\
          <option value='2010'>2010</option>\
          </select>&nbsp; &nbsp; &nbsp;\
          Geography: <select id='geoSelect'>\
          <option value='Butler'>Butler County, KS</option>\
          <option value='Chase'>Chase County, KS</option>\
          <option value='Chautauqua'>Chautauqua County, KS</option>\
          <option value='Clay'>Clay County, KS</option>\
          <option value='Cowley'>Cowley County, KS</option>\
          <option value='Dickinson'>Dickinson County, KS</option>\
          <option value='Elk'>Elk County, KS</option>\
          <option value='Geary'>Geary County, KS</option>\
          <option value='Greenwood'>Greenwood County, KS</option>\
          <option value='Lyon'>Lyon County, KS</option>\
          <option value='Marion'>Marion County, KS</option>\
          <option value='Marshall'>Marshall County, KS</option>\
          <option value='Morris'>Morris County, KS</option>\
          <option value='Pottawatomie'>Pottawatomie County, KS</option>\
          <option value='Riley'>Riley County, KS</option>\
          <option value='Wabaunsee'>Wabaunsee County, KS</option>\
          <option value='Washington'>Washington County, KS</option>\
         </select><br>";

  
  
  var width = 600,
      height = 500,
      radius = Math.min(width, height) / 2;
    
  var legendRectSize = 18;
  var legendSpacing = 4;

  var color = d3.scale.ordinal()
      .range(["#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56", "#d0743c", "#ff8c00"]);

  var arc = d3.svg.arc()
      .outerRadius(radius - 50)
      .innerRadius(100);
    
  var outerArc = d3.svg.arc()
    .innerRadius(radius * 0.9)
    .outerRadius(radius * 0.9);
    
  var key = function(d){ return d.data.Mode; };

  var geo = document.getElementById("geoSelect");

  var pie = d3.layout.pie()
    .sort(null)
    .value(function(d) { return d[geo.value]; });

  var svg = d3.select("#modeshare").append("svg")
    .attr("width", width)
    .attr("height", height)
    .append("g")
    .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");
    
  data.forEach(function(d) {
    d[geo.value]= +d[geo.value];
  });

  var path = svg.datum(data).selectAll(".arc")
      .data(pie)
      .enter().append("path")
      .attr("class", "arc")
      .attr("d", arc)
      .attr("fill", function(d) { return color(d.data.Mode); })
      .on("mouseover", function (d) { showPopover.call(this, d); })
      .on("mouseout",  function (d) { removePopovers(); });
      
  //Make the legend
    
  var legend = svg.selectAll('.legend')
    .data(color.domain())
    .enter()
    .append('g')
    .attr('class', 'legend')
    .attr("transform", function(d, i) {return "translate(" + (-width/2) + "," + (-height/2+i*25+15) +")"});
     
  
    
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
          
  
  
  
  
      
  d3.selectAll("#geoSelect")
    .on("change", change);
    
    path.transition()
      .duration(500)
      .attr("fill", function(d, i) { return color(d.data.Mode); })
      .attr("d", arc)
      .each(function(d) { this._current = d; });
    
  function change(){
      path = path.data(pie);
      path.transition().duration(1000).attrTween("d", function(d) {
                          this._current = this._current || d;
                          var interpolate = d3.interpolate(this._current, d);
                          this._current = interpolate(0);
                          return function(t) {
                                  return arc(interpolate(t));
                          }; })
      .on("mouseover", function (d) { showPopover.call(this, d); })
      .on("mouseout",  function (d) { removePopovers(); });
  
  
  
         
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
  

   
function arcTween(a) {
  var i = d3.interpolate(this._current, a);
  this._current = i(0);
  return function(t) {
    return arc(i(t));
  };
}





 
}



//This function passes the google chart info to the drawChart function and runs the function
function init() {
              Tabletop.init( { key: public_spreadsheet_url,
                               callback: drawChart,
                               simpleSheet: false } )
            }

//do the stuff.      
init();