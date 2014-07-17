<!DOCTYPE html>
<!--[if lt IE 8]>         	<html class="no-js lt-ie9 lt-ie8"> <![endif]-->
<!--[if IE 8]>         		<html class="no-js lt-ie9"> <![endif]-->
<!--[if gt IE 8]>			<!--> <html class="no-js "> <!--<![endif]-->
<head profile="http://gmpg.org/xfn/11">
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1" />
	<meta http-equiv="X-UA-Compatible" content="IE=edge">
    
    <link rel="icon" type="image/ico" href="<?php bloginfo('template_directory') ?>/assets/images/favicon.ico" />
	
	<title><?php wp_title('&raquo;','true','right'); ?></title>
	
	<!--[if IE 8]>
		<link rel="stylesheet" href="<?php bloginfo('template_directory') ?>/ie.css" />
	<![endif]-->
	<!--[if !(IE 8) ]><!-->
		<link rel="stylesheet" href="<?php bloginfo('template_directory') ?>/style.css" />
	<!--<![endif]-->

	<!--[if lt IE 9]>
		<script src="<?php bloginfo('template_directory') ?>/assets/scripts/vendor/html5shiv.js"></script>
	<![endif]-->

	<script>
		// Place Google Analytics code here

		// Set up site configuration
		window.config = window.config || {};

		// The base URL for the WordPress theme
		window.config.baseUrl = "<?php bloginfo('url')?>";

		// Empty default Gravity Forms spinner function
		var gformInitSpinner = function() {};
	</script>

	<?php wp_head();?>

</head>
<body <?php body_class(); ?>  id="<?php echo get_template_name(); ?>">