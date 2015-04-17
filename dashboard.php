<!DOCTYPE html>
<?php include_once 'header.php';?>
<?php include_once 'dashboard-menu.php';?>
<div class="col-sm-9 col-sm-offset-3 col-md-10 col-md-offset-2 main">
     <h2>Dashboard</h2>

     <h3>Topics</h3>

    <hr>
    <div id="content">
        <div class="col-md-6">
            <div class="panel panel-default " style="background: rgba(255,255,255,0)">
                <div class="panel-heading" style="background: rgba(255,255,255,0.9)"> <a href="dashboard-natural.php"><h3 class="panel-title"><i class="fa fa-leaf"></i>Natural Systems</h3></a>

                </div>
                <ul class="list-group">
                    <li class="list-group-item" style="background: rgba(255,255,255,0.75)"><i class="fa fa-leaf"></i>Conservation Easements</li>
                </ul>
            </div>
        </div>
        <div class="col-md-6">
            <div class="panel panel-default" style="background: rgba(255,255,255,0)">
                <div class="panel-heading"> <a href="dashboard-social.php"><h3 class="panel-title"><i class="fa fa-smile-o"></i>Social Systems</h3></a>

                </div>
                <ul class="list-group">
                    <li class="list-group-item" style="background: rgba(255,255,255,0.75)"><i class="fa fa-medkit"></i>Community Health</li>
                    <li class="list-group-item" style="background: rgba(255,255,255,0.75)"><i class="fa fa-graduation-cap"></i>Educational Attainment</li>
                    <li class="list-group-item" style="background: rgba(255,255,255,0.75)"><i class="fa fa-user-secret"></i>Crime</li>
                </ul>
            </div>
        </div>
        <div class="col-md-6">
            <div class="panel panel-default" style="background: rgba(255,255,255,0)">
                <div class="panel-heading"> <a href="dashboard-cultural.php"><h3 class="panel-title"><i class="fa fa-users"></i>Cultural Systems</h3></a>

                </div>
                <ul class="list-group">
                    <li class="list-group-item" style="background: rgba(255,255,255,0.75)"><i class='fa fa-paint-brush'></i>Cultural Jobs</li>
                </ul>
            </div>
        </div>
        <div class="col-md-6">
            <div class="panel panel-default" style="background: rgba(255,255,255,0)">
                <div class="panel-heading"> <a href="dashboard-mobility.php"><h3 class="panel-title"><i class="fa fa-car"></i>Mobility</h3></a>

                </div>
                <ul class="list-group">
                    <li class="list-group-item" style="background: rgba(255,255,255,0.75)"><i class='fa fa-car'></i>Commute</li>
                </ul>
            </div>
        </div>
        <div class="col-md-6">
            <div class="panel panel-default" style="background: rgba(255,255,255,0)">
                <div class="panel-heading"> <a href="dashboard-economy.php"><h3 class="panel-title"><i class="fa fa-usd"></i>Economy</h3></a>

                </div>
                <ul class="list-group">
                    <li class="list-group-item" style="background: rgba(255,255,255,0.75)"><i class="fa fa-line-chart"></i>Industries</li>
                    <li class="list-group-item" style="background: rgba(255,255,255,0.75)"><i class="fa fa-bar-chart"></i>Unemployment</li>
                </ul>
            </div>
        </div>
        <div class="col-md-6">
            <div class="panel panel-default" style="background: rgba(255,255,255,0)">
                <div class="panel-heading"> <a href="dashboard-built.php"><h3 class="panel-title"><i class="fa fa-home"></i>Built Environment</h3></a>

                </div>
                <ul class="list-group">
                    <li class="list-group-item" style="background: rgba(255,255,255,0.75)"><i class='fa fa-home'></i>Housing Affordability</li>
                </ul>
            </div>
        </div>
        <div class="col-md-6">
            <div class="panel panel-default" style="background: rgba(255,255,255,0)">
                <div class="panel-heading"> <a href="dashboard-farm.php"><h3 class="panel-title"><span class="glyphicon glyphicon-grain" aria-hidden="true"></span>Farm & Ranch</h3></a>

                </div>
                <ul class="list-group">
                    <li class="list-group-item" style="background: rgba(255,255,255,0.75)"><span class="glyphicon glyphicon-grain" aria-hidden="true"></span>Agricultural Sales</li>
                </ul>
            </div>
        </div>
    </div>
</div>
</div>
</div>
</div>
</div>
<script src="//ajax.googleapis.com/ajax/libs/jquery/1.11.2/jquery.min.js"></script>
<script>
    window.jQuery || document.write('<script src="js/vendor/jquery-1.11.2.min.js"><\/script>')
</script>
<script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.4/js/bootstrap.min.js"></script>
<script src="http://d3js.org/d3.v3.min.js" charset="utf-8"></script>
<script>
    $(document).ready(function() {
        $("#over-menu").addClass('active');
        $("body").addClass('background');
    });
</script>
</body>

</html>