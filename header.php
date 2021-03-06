 <head>
        <meta charset="utf-8">
        <meta http-equiv="x-ua-compatible" content="ie=edge">
        <title>Flint Hills Frontiers</title>
        <meta name="description" content="">
        <meta name="viewport" content="width=device-width, initial-scale=1">

        <link rel="apple-touch-icon" href="apple-touch-icon.png">
        <!-- Place favicon.ico in the root directory -->
        
        <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.4/css/bootstrap.min.css">
            <link rel="stylesheet" href="//maxcdn.bootstrapcdn.com/font-awesome/4.3.0/css/font-awesome.min.css">
	    <link rel="stylesheet" href="dashboard/dashboard.css"></link>
            <link rel="stylesheet" href="css/example.css">
            <style type="text/css">
			
			.axis path,
			.axis line {
				fill: none;
				stroke: black;
				shape-rendering: crispEdges;
			}
			
			.axis text {
				font-family: sans-serif;
				font-size: 11px;
			}
                        .legend text {
				font-family: sans-serif;
				font-size: 11px;
			}
                        
                        .bar:hover {
                            opacity: 1 !important;
                            box-shadow:  0px 0px 1px #999999 !important;
                        }
                        .fa{
                            width: 32px;
                            display: inline-block;
                            text-align: center;
                            margin-right: 10px;
                        }
			.glyphicon{
                            width: 32px;
                            display: inline-block;
                            text-align: center;
                            margin-right: 10px;
                        }
                        
                        .y.axis path{
				    display: none;
			}
			
			.y.axis line{
				    stroke-dasharray: 2,2;
			}
                      
                        
                         
                         img.logo{
                          margin-right: 10px;
                          margin-left: 10px;
                         }
			 
			 path.slice{
				stroke-width:2px;
			}

			polyline{
				opacity: .3;
				stroke: black;
				stroke-width: 2px;
				fill: none;
			}
			.background{
				    background: url(img/konza.jpg)  no-repeat center center fixed;
				    
			}
			.btn-default:focus{
				    background-color: #ffffff !important;
				    
			}
                         


		</style>
    </head>
    <body>
        <!--[if lt IE 8]>
            <p class="browserupgrade">You are using an <strong>outdated</strong> browser. Please <a href="http://browsehappy.com/">upgrade your browser</a> to improve your experience.</p>
        <![endif]-->

        <!-- Add your site or application content here -->
         <nav class="navbar navbar-inverse navbar-fixed-top">
      <div class="container-fluid">
        <div class="navbar-header">
          <button type="button" class="navbar-toggle collapsed" data-toggle="collapse" data-target="#navbar" aria-expanded="false" aria-controls="navbar">
            <span class="sr-only">Toggle navigation</span>
            <span class="icon-bar"></span>
            <span class="icon-bar"></span>
            <span class="icon-bar"></span>
          </button>
          <a class="navbar-brand" href="index.php"><div class="row"><img src="img/logo.png" class="logo">Flint Hills Frontiers</div></a>
        </div>
        <div id="navbar" class="navbar-collapse collapse">
          <ul class="nav navbar-nav navbar-right">
	    <li><a href="plan.php"><i class="fa fa-book"></i>Plan</a></li>
            <li><a href="dashboard.php"><i class="fa fa-tachometer"></i>Dashboard</a></li>
	    <li><a href="toolbox.php"><i class="fa fa-briefcase"></i>Toolbox</a></li>
            <li><a href="#"><i class="fa fa-newspaper-o"></i>News</a></li>
            <li><a href="#"><i class="fa fa-question-circle"></i>Help</a></li>
          </ul>
        </div>
      </div>
    </nav>