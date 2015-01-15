
    <?php
require('../vendor/autoload.php');
$app = new Silex\Application();
$app['debug'] = true;

include_once 'header.php';

// Our web handlers
$app->get('/', function() use($app) {
  $app['monolog']->addDebug('logging output.');
  return 'Hello World';
});
$app->run();
?>

  