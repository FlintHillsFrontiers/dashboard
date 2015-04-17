<!DOCTYPE html>
<?php include_once 'header.php';?>
<?php include_once 'dashboard-menu.php';?>
<div class="col-sm-9 col-sm-offset-3 col-md-10 col-md-offset-2 main">
            <h2>Mobility</h2>
            <p>Mobility is the ability to get around the Flint Hills.  It includes transportation infrastructure and land use policies that determine the location of destinations in our communities.  This topic considers your ability to get to work on time and the ability to ship goods to and from the region.</p>
            <h3>Metrics</h3>
	    <div class="row">
	    <div class="list-group col-md-4">
			<a href="#" class="list-group-item " id="commutelink"><i class='fa fa-car'></i>Commuting</a>
			

</div></div>
	    
	    <hr>
	    <h4 id="commuteanchor"><i class='fa fa-car'></i>Commuting</h4>
            <div class="btn-group" role="group" aria-label="...">
                <button type="button" class="btn btn-default" id="bar"><i class="fa fa-bar-chart"></i>% Commuting 30, 45, & 60+ min.</button>
                <button type="button" class="btn btn-default" id="line"><i class="fa fa-line-chart"></i>Avg. Commute Time</button>
                <button type="button" class="btn btn-default" id="pie"><i class="fa fa-pie-chart"></i>Means of Travel</button>
	    </div>
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
        <script src="dashboard/tabletop.js"></script>
	<script src="js/commute.js"></script>
	<script src="js/commute2.js"></script>
	<script src="js/modeshare.js"></script>
	<script>
	    
	    
	    $("#commutelink").click(function() {
			$('html, body').animate({
				    scrollTop: $("#commuteanchor").offset().top-65
			}, 1000);
	    });
	
	    $(document).ready(function(){
		
		$("#bar").click(function(){
		     $("#commute2").hide();
		     $("#commute").show();
		     $("#modeshare").hide();		 
		});
		$("#line").click(function(){
		     $('#commute2').removeClass('hidden');
		     $("#commute2").show();
		     $("#commute").hide();
		     $("#modeshare").hide();
		});
		$("#pie").click(function(){
		     $('#modeshare').removeClass('hidden');
		     $("#modeshare").show();
		     $("#commute").hide();
		     $("#commute2").hide();
		 });
		$("#mobility-menu").addClass('active');
	    });
	    
</script>
        
    </body>
</html>