<!DOCTYPE html>
<?php include_once 'header.php';?>
<?php include_once 'dashboard-menu.php';?>
<div class="col-sm-9 col-sm-offset-3 col-md-10 col-md-offset-2 main">
            <h2>Social Systems</h2>
            
            <h3>Metrics</h3>
	    <div class="row">
	    <div class="list-group col-md-4">
			<a href="#" class="list-group-item " id="healthlink"><i class='fa fa-medkit'></i>Community Health</a>
			<a href="#" class="list-group-item" id="edulink"><i class='fa fa-graduation-cap'></i>Educational Attainment</a>
			<a href="#" class="list-group-item"><i class='fa fa-user-secret'></i>Crime</a>

</div></div>
	   
	    
	    
            <div id="content">            
	    </div>
	    
          
        </div>
</div>
 </div>
      </div>
    </div>
        
        
	

        <script src="//ajax.googleapis.com/ajax/libs/jquery/1.11.2/jquery.min.js"></script>
        <script>window.jQuery || document.write('<script src="js/vendor/jquery-1.11.2.min.js"><\/script>')</script>
        <script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.4/js/bootstrap.min.js"></script>
        <script src="http://d3js.org/d3.v3.min.js" charset="utf-8"></script>
        <script src="js/health.js"></script>
	<script src="js/education.js"></script>
	<script src="js/crime.js"></script>
	<script>
	    $("#healthlink").click(function() {
			$('html, body').animate({
				    scrollTop: $("#health").offset().top-65
			}, 1000);
	    });
	    $("#edulink").click(function() {
			$('html, body').animate({
				    scrollTop: $("#education").offset().top-65
			}, 1000);
	    });
	</script>
	
	
	
        
    </body>
</html>