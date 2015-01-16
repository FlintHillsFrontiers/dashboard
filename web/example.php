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

    </div><!-- /.container -->

    <script>

var data = [4, 8, 15, 16, 23, 42];

var x = d3.scale.linear()
    .domain([0, d3.max(data)])
    .range([0, 420]);

d3.select(".chart")
  .selectAll("div")
    .data(data)
  .enter().append("div")
    .style("width", function(d) { return x(d) + "px"; })
    .text(function(d) { return d; });

</script>


    <!-- Bootstrap core JavaScript
    ================================================== -->
    <!-- Placed at the end of the document so the pages load faster -->
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/1.11.1/jquery.min.js"></script>
   <!-- Latest compiled and minified JavaScript -->
    <script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.1/js/bootstrap.min.js"></script>
  </body>
</html>