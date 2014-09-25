<?php

function autoloader ($class) {
    $class = str_replace('\\', '/', $class);
    $class = str_replace('WPSC', '', $class);
    $class_path = HP_BASE_PATH . $class . '.php';

    if (!file_exists($class_path)) {
        return;
    }

    include($class_path);
}

spl_autoload_register('autoloader');