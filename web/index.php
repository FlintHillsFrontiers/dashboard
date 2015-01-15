
    <?php
require('../vendor/autoload.php');
$app = new Silex\Application();
$app['debug'] = true;

include_once 'header.php';
include_once 'example.php';

$app->run();
?>

  