<!DOCTYPE html>
<?php include_once 'header.php';?>
<?php include_once 'dashboard-menu.php';?>
<div class="col-sm-9 col-sm-offset-3 col-md-10 col-md-offset-2 main">
            <h2>Economy</h2>
            <p>Economy relates to what people do for work in the Flint Hills and the goods and services we make here.</p>
            <h3>Metrics</h3>
	    
	    <div class="row">
	    <div class="list-group col-md-4">
			<a href="#" class="list-group-item " id="commutelink"><i class="fa fa-line-chart"></i>Industries</a>
			<a href="#" class="list-group-item " id="commutelink"><i class="fa fa-bar-chart"></i>Unemployment</a>
	    </div>
	    </div>
           
            <hr>
	      <div id="content"></div>
          <!--
	  <div id="infographics">
            <script>
                window.onload = function() {
				
				drawInfographic("unemployment");				
				
			}
            </script>
	</div>
          -->
          
          
        </div>
      </div>
    </div>
        
        

        <script src="//ajax.googleapis.com/ajax/libs/jquery/1.11.2/jquery.min.js"></script>
        <script>window.jQuery || document.write('<script src="js/vendor/jquery-1.11.2.min.js"><\/script>')</script>
        <script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.4/js/bootstrap.min.js"></script>
        <script src="http://d3js.org/d3.v3.min.js" charset="utf-8"></script>
       
        <script src="dashboard/dashboard.js"></script>
        <script src="dashboard/tabletop.js"></script>
	<script src="js/employment.js"></script>
	<script src="js/unemployment.js"></script>
	<script src="js/income.js"></script>
	<script>
	    $(document).ready(function(){
		
	    
	    $("#econ-menu").addClass('active');
	    });
	    
</script>


        
    </body>
</html>