<?php

$action = $_REQUEST['action'];

$success = false;

function glob_recursive($pattern, $flags = 0)
{
    $files = glob($pattern, $flags);
    foreach (glob(dirname($pattern).'/*', GLOB_ONLYDIR|GLOB_NOSORT) as $dir) {
        $files = array_merge($files, glob_recursive($dir.'/'.basename($pattern), $flags));
    }
    return $files;
}

function dir_tree($dir, $root=null)
{
    $root = $root ?? $dir;
    $files = array_map('basename', glob("$dir/*"));
    foreach ($files as $file) {
        if (is_dir("$dir/$file")) {
            $return[$file] = [
                'type'	=> 'folder',
                'name' => $file,
                'path' => str_replace($root, '', "$dir/$file"),
                'nodes' => dir_tree("$dir/$file", $root),
            ];
        } else {
            $return[] = [
                'type'	=> 'file',
                'name' => $file,
                'path' => str_replace($root, '', "$dir/$file"),

            ];
        }
    }
    return $return;
}

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST');
header("Access-Control-Allow-Headers: X-Requested-With");



switch ($action) {
    case 'files':
        $data = dir_tree('../src');
        $success = true;
        break;
    case 'open':
        $filename = $_REQUEST['filename'];
        $data = file_get_contents('../src'. $filename);
        $success = true;
        break;
    case 'save':

        break;
}

header('Content-Type: application/json');
echo json_encode([
    'success' => $success,
    'data' => $data
]);
