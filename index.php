
      
    <?php
require('../vendor/autoload.php');
$app = new Silex\Application();
$app['debug'] = true;

// Our web handlers
$app->get('/', function() use($app) {
  $app['monolog']->addDebug('logging output.');
  
  echo "<!DOCTYPE html><html lang="en">  <head>    <meta charset="utf-8">    <meta http-equiv="X-UA-Compatible" content="IE=edge">    <meta name="viewport" content="width=device-width, initial-scale=1">    <meta name="description" content="">    <meta name="author" content="">    <link rel="icon" href="../../favicon.ico">";
  echo "hello world"
  
  
});
$app->run();
?>

    
