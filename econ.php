<!DOCTYPE html>
    <head>
        <meta charset="utf-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <meta name="description" content="">
        <meta name="author" content="">
            
        <title>Flint Hills Dashboard</title>
    
        <!-- Latest compiled and minified Bootstrap CSS -->
        <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.1/css/bootstrap.min.css">
          
        <!-- Custom CSS -->    
        <link href="template.css" rel="stylesheet">
    
        <!-- HTML5 shim and Respond.js for IE8 support of HTML5 elements and media queries -->
        <!--[if lt IE 9]>
        <script src="https://oss.maxcdn.com/html5shiv/3.7.2/html5shiv.min.js"></script>
        <script src="https://oss.maxcdn.com/respond/1.4.2/respond.min.js"></script>
        <![endif]-->
        
        <!-- Mapbox-->
        <script src='https://api.tiles.mapbox.com/mapbox.js/v2.1.4/mapbox.js'></script>
        <link href='https://api.tiles.mapbox.com/mapbox.js/v2.1.4/mapbox.css' rel='stylesheet' />
        
        <!-- d3.js-->
        <script src="http://d3js.org/d3.v3.min.js"></script>
	
	<!-- Table Top-->
	<script src='tabletop.js'></script>
	
    </head>
    <body>

      <?php require 'menu.html'; ?>

      <div class="container">
	<div class="content">
            <h1>Economy Metrics</h1>
            <hr>
	    <?php  require 'infographics/unemployment.html'; ?>
	</div> <!-- /.content -->
      </div><!-- /.container -->

      <!-- Bootstrap core JavaScript
      ================================================== -->
      <!-- Placed at the end of the document so the pages load faster -->
      <script src="https://ajax.googleapis.com/ajax/libs/jquery/1.11.1/jquery.min.js"></script>
      <!-- Latest compiled and minified JavaScript -->
      <script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.1/js/bootstrap.min.js"></script>
    </body>
</html>