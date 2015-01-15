
      
    <?php
require('../vendor/autoload.php');
$app = new Silex\Application();
$app['debug'] = true;

// Our web handlers
$app->get('/', function() use($app) {
  $app['monolog']->addDebug('logging output.');
  
  return 'Hello, again.'
  
  
});
$app->run();
?>

    
