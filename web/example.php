 <div class="container">

      <div class="content">
        <h1>Flint Hills Dashboard</h1>
        <p class="lead">A quick mockup showing a web map and interactive chart.</p>
      </div>
      
      <div id='map'></div>
      <div class="chart"></div>
    <script>
    L.mapbox.accessToken = 'pk.eyJ1IjoiemFjaGZsYW5kZXJzIiwiYSI6Im5PQWUydWMifQ.K3IgstPvVhP6ZDoXsKNzJQ';
    var map = L.mapbox.map('map', 'examples.map-i86nkdio')
    .setView([39.15, -96.5], 10);
    </script>

     <!-- d3.js-->
Select Geography:<br>
<div class="btn btn-default flinthills">Flint Hills</div>
<div class="btn btn-default manhattan">Manhattan</div>
<div class="btn btn-default marys">Marysville</div>
 
<svg class="chart" id="chart"></svg>
<script src="http://d3js.org/d3.v3.min.js"></script>
<script>

var margin = {top: 20, right: 30, bottom: 30, left: 355},
    width = 960 - margin.left - margin.right,
    height = 750 - margin.top - margin.bottom;

var x = d3.scale.linear()
    .range([0, width]);

var y = d3.scale.ordinal()
    .rangeRoundBands([0, height], .1);

var xAxis = d3.svg.axis() 
    .scale(x)
    .orient("bottom");

var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left");

var chart = d3.select(".chart")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");




    
    d3.tsv("data.tsv", type, function(error, data) {
        
    x.domain([0, d3.max(data, function(d) { return d.value; })]);
    y.domain(data.map(function(d) { return d.name; }));

  

    chart.append("g")
        .attr("class", "y axis")
        .call(yAxis);
  
    chart.selectAll(".bar")
        .data(data)
        .enter().append("rect")
        .attr("class", "bar")
        .attr("x", x)
        .attr("y", function(d) { return y(d.name); })
        .attr("width", function(d) { return x(d.value); })
        .attr("height", y.rangeBand());
        
    chart.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis);
      });
      
  function type(d) {
          d.value = +d.value; // coerce to number
          return d;
        }

  
d3.select(".marys")
    .on("click", function(){
        
        
        d3.tsv("marysville.tsv", type, function(error, data) {
        
        
          
            chart.selectAll(".bar")
                .data(data)
                .transition()
                .duration(1500)
                .attr("class", "bar")
                .attr("x", x)
                .attr("y", function(d) { return y(d.name); })
                .attr("width", function(d) { return x(d.value); })
                .attr("height", y.rangeBand());
                
           
        });
    });

    d3.select(".manhattan")
    .on("click", function(){
        
        
        d3.tsv("manhattan.tsv", type, function(error, data) {
        
       

           
          
            chart.selectAll(".bar")
                .data(data)
                .transition()
                .duration(1500)
                .attr("class", "bar")
                .attr("x", x)
                .attr("y", function(d) { return y(d.name); })
                .attr("width", function(d) { return x(d.value); })
                .attr("height", y.rangeBand());
                
           
        });
    });
      
 d3.select(".flinthills")
    .on("click", function(){
        
        
        d3.tsv("data.tsv", type, function(error, data) {
        
          

  

            
          
            chart.selectAll(".bar")
                .data(data)
                .transition()
                .duration(1500)
                .attr("class", "bar")
                .attr("x", x)
                .attr("y", function(d) { return y(d.name); })
                .attr("width", function(d) { return x(d.value); })
                .attr("height", y.rangeBand());
                
            
        });
    });
 
            




</script>


    <!-- Bootstrap core JavaScript
    ================================================== -->
    <!-- Placed at the end of the document so the pages load faster -->
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/1.11.1/jquery.min.js"></script>
   <!-- Latest compiled and minified JavaScript -->
    <script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.1/js/bootstrap.min.js"></script>
  </body>
</html>