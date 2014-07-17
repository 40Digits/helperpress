<?php
$sourceFile = $_GET['file'];


if( headers_sent() )
  die('Headers Sent');

if(ini_get('zlib.output_compression'))
  ini_set('zlib.output_compression', 'Off');

if (!is_file($sourceFile)) { die("<b>404 File not found!</b>"); }

$len = filesize($sourceFile);
$filename = basename($sourceFile);
$file_extension = strtolower(substr(strrchr($filename,"."),1));

switch( $file_extension ) {
  case "pdf"  : $ctype="application/pdf"; break;
  case "exe"  : $ctype="application/octet-stream"; break;
  case "zip"  : $ctype="application/zip"; break;
  case "doc"  : $ctype="application/msword"; break;
  case "xls"  : $ctype="application/vnd.ms-excel"; break;
  case "ppt"  : $ctype="application/vnd.ms-powerpoint"; break;
  case ".docx": $ctype="application/vnd.openxmlformats-officedocument.wordprocessingml.document"; break;
  case ".pptx": $ctype="application/vnd.openxmlformats-officedocument.presentationml.presentation"; break;
  case ".xlsx": $ctype="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"; break;
  case "gif"  : $ctype="image/gif"; break;
  case "png"  : $ctype="image/png"; break;
  case "jpeg" :
  case "jpg"  : $ctype="image/jpg"; break;
  case "mp3"  : $ctype="audio/mpeg"; break;
  case "wav"  : $ctype="audio/x-wav"; break;
  case "mpeg" :
  case "mpg"  :
  case "mpe"  : $ctype="video/mpeg"; break;
  case "mov"  : $ctype="video/quicktime"; break;
  case "avi"  : $ctype="video/x-msvideo"; break;
  case "mp4"  : $ctype="video/mpeg"; break;

  //The following are for extensions that shouldn't be downloaded
  case "php"  :
  case "css"  :
  case "js"   :
  case "htm"  :
  case "html" :
  case "txt"  : die("<b>Cannot be used for ". $file_extension ." files!</b>"); break;

  default     : $ctype="application/force-download";
}

header("Pragma: public");
header("Expires: 0");
header("Cache-Control: must-revalidate, post-check=0, pre-check=0");
header("Cache-Control: public");
header("Content-Description: File Transfer");
header("Content-Type: $ctype");
$header="Content-Disposition: attachment; filename=".$filename.";";
header($header );
header("Content-Transfer-Encoding: binary");
header("Content-Length: ".$len);
@readfile($sourceFile);
exit;

?>