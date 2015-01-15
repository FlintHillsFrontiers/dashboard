 <div class="container">

      <div class="content">
        <h1>Flint Hills Dashboard</h1>
        <p class="lead">A quick mockup showing a web map and interactive chart.</p>
      </div>
      
      <div id='map'></div>
    <script>
    L.mapbox.accessToken = 'pk.eyJ1IjoiemFjaGZsYW5kZXJzIiwiYSI6Im5PQWUydWMifQ.K3IgstPvVhP6ZDoXsKNzJQ';
    var map = L.mapbox.map('map', 'examples.map-i86nkdio')
    .setView([39.15, -96.5], 10);
    </script>

    </div><!-- /.container -->


    <!-- Bootstrap core JavaScript
    ================================================== -->
    <!-- Placed at the end of the document so the pages load faster -->
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/1.11.1/jquery.min.js"></script>
   <!-- Latest compiled and minified JavaScript -->
    <script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.1/js/bootstrap.min.js"></script>
  </body>
</html>