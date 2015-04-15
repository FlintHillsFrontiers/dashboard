<!DOCTYPE html>
<?php include_once 'header.php';?>
<?php include_once 'dashboard-menu.php';?>
<div class="col-sm-9 col-sm-offset-3 col-md-10 col-md-offset-2 main">
            <h2>Economy</h2>
            <p>Economy relates to what people do for work in the Flint Hills and the goods and services we make here.</p>
            <h3>Metrics</h3>
            <div class="btn-group" role="group" aria-label="...">
                <button type="button" class="btn btn-default" id="line"><i class="fa fa-line-chart"></i>Employment by Industry</button>
		<button type="button" class="btn btn-default" id="bar"><i class="fa fa-bar-chart"></i>Unemployment</button>
                <button type="button" class="btn btn-default"><i class="fa fa-pie-chart"></i>...</button>
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
       
        <script src="http://zachflanders.com/FlintHills/dashboard/dashboard.js"></script>
        <script src="http://zachflanders.com/FlintHills/dashboard/tabletop.js"></script>
	<script src="js/employment.js"></script>
	<script src="js/unemployment.js"></script>
	<script>
	    $(document).ready(function(){
		
		$("#bar").click(function(){
		    $('#unemployment').removeClass('hidden');
		     $("#unemployment").show();
		     $("#commute2").hide();
		});
	    $("#line").click(function(){
		 
		 $("#commute2").show();
		 $("#unemployment").hide();
	     });
	    
	    $("#econ-menu").addClass('active');
	    });
	    
</script>


        
    </body>
</html>