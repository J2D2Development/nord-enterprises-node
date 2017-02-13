<?php
// content_style.inc - style sheet values that need to be used in all files generating
//		site content, e.g. pagecontent and all "feature" files
//
// general include files
// include_once "utilities.inc";
// include "db.inc";

// // get the hoa_main record for the HOA whose site we are in
// $hoa_main = get_hoa_main();

//get contact form color
if($hoa_lookfeel['title_bg_color'] == $hoa_lookfeel['content_bg_color'])
{
	$contact_bg_color = '#a9a9a9';
}
else
{
	$contact_bg_color = $hoa_lookfeel['title_bg_color'];
}

//get header image- size and url
$header_file = get_picture_file($hoa_lookfeel['header_file_id']);
$imgfilename = 'http://www.home-owners-assoc.com' . $header_file['src'];
$size = getimagesize($imgfilename);
$width = $size[0];
$height = $size[1];

//get header position (user chosen)
$headerHorizontal = $hoa_lookfeel['header_horizontal_justification'];
$headerVertical = $hoa_lookfeel['header_vertical_justification'];
//adjust 'middle' as stored in db to 'center' for css purposes
if($headerVertical == 'middle') {
	$headerVertical = 'center';
}

//if header image is < 150px tall, bg size can ruin resolution.  this should fix
if($height < 130)
{
	$background_size = 'auto';
}
else
{
	$background_size = 'contain';
}

//custom google font options
if($hoa_lookfeel['content_font'] == 'Raleway' ||
	$hoa_lookfeel['header_font'] == 'Raleway' ||
	$hoa_lookfeel['title_font'] == 'Raleway' ||
	$hoa_lookfeel['menu_font'] == 'Raleway') {
	print "<link href='http://fonts.googleapis.com/css?family=Raleway' rel='stylesheet' type='text/css'>";
}
if($hoa_lookfeel['content_font'] == 'Playfair Display' ||
	$hoa_lookfeel['header_font'] == 'Playfair Display' ||
	$hoa_lookfeel['title_font'] == 'Playfair Display' ||
	$hoa_lookfeel['menu_font'] == 'Playfair Display') {
	print "<link href='http://fonts.googleapis.com/css?family=Playfair+Display' rel='stylesheet' type='text/css'>";
}
if($hoa_lookfeel['content_font'] == 'Eagle Lake' ||
	$hoa_lookfeel['header_font'] == 'Eagle Lake' ||
	$hoa_lookfeel['title_font'] == 'Eagle Lake' ||
	$hoa_lookfeel['menu_font'] == 'Eagle Lake') {
	print "<link href='http://fonts.googleapis.com/css?family=Eagle+Lake' rel='stylesheet' type='text/css'>";
}
if($hoa_lookfeel['content_font'] == 'Open Sans' ||
	$hoa_lookfeel['header_font'] == 'Open Sans' ||
	$hoa_lookfeel['title_font'] == 'Open Sans' ||
	$hoa_lookfeel['menu_font'] == 'Open Sans') {
	print "<link href='http://fonts.googleapis.com/css?family=Open+Sans' rel='stylesheet' type='text/css'>";
}

//Some areas use the page title/font as border/bgcolor.  This will default those to gray/black if the page title bg and page title font colors are the same
if($hoa_lookfeel['title_bg_color'] == $hoa_lookfeel['content_bg_color'])
{
	$default_main_color = '#000000';
	$default_border_bg_color = '#a9a9a9';
}
else
{
	$default_border_bg_color = $hoa_lookfeel['title_bg_color'];
	$default_main_color = $hoa_lookfeel["title_font_color"];
}

//search icon position
if($hoa_main['search_position'] == 'left' && $hoa_lookfeel['nav_orientation'] == 'v') {
	$search_icon_float = 'none';
	$search_icon_margin = '0px auto';
} else if($hoa_main['search_position'] == 'bottom') {
	$search_icon_float = 'none';
	$search_icon_margin = '0 0 10px 0';
} else {
	$search_icon_float = 'right';
	$search_icon_margin = '0 10px 0 0';
}

//search icon color scheme
if($hoa_main['search_icon_color'] == 'white') {
	$search_icon_color = '#ffffff';
	$search_icon_bg_color = 'rgba(0,0,0,1)';
	$search_icon_hover_color = 'rgba(0,0,0,.7)';
} else if($hoa_main['search_icon_color'] == 'black') {
	$search_icon_color = '#000000';
	$search_icon_bg_color = 'rgba(255,255,255,1)';
	$search_icon_hover_color = 'rgba(255,255,255,.7)';
} else {
	$search_icon_color = '#000000';
	$search_icon_bg_color = 'rgba(128,128,128,.7)';
	$search_icon_hover_color = 'rgba(128,128,128,1)';
}

?>
<style type="text/css">
<!--
* {
	-webkit-box-sizing: border-box;
	-moz-box-sizing: border-box;
	box-sizing: border-box;
}
body {
	margin: <?php printf("%-0dpx %-0dpx %-0dpx %-0dpx", $hoa_lookfeel["page_margin_top"], $hoa_lookfeel["page_margin_right"], $hoa_lookfeel["page_margin_bottom"], $hoa_lookfeel["page_margin_left"]) ?>;
	background: <?php print $hoa_lookfeel["page_bg_color"] ?>;
/*	width: 100%;
	min-width: 100%;*/
<?php
	if($hoa_lookfeel["background_apply_to"] == "page")
	{
		if($hoa_lookfeel["content_background_file_id"] > 0)
		{
			$background_file = get_picture_file($hoa_lookfeel['content_background_file_id']);
?>
	background-image: url('<?php print $background_file[src]; ?>');
<?php
			if($hoa_lookfeel["content_background_repeat"] == "no-repeat")
			{
?>
	background-position: <?php print $hoa_lookfeel["content_background_horizontal_pos"] ?> <?php print $hoa_lookfeel["content_background_vertical_pos"] ?>;
<?
			}
?>
	background-repeat: <?php print $hoa_lookfeel["content_background_repeat"] ?>;
<?
		}
	}
?>
	}
.container {
	display: inline-block;
}
.pages {
	border-collapse: separate;
	border-spacing: 6px;
}
.pages td {
	padding: 6px;
}
.dir-label {
	display: inline-block;
	margin-left: 6px;
}
td.logo {
	padding: 0;
	margin: 0;
	background: <?php print $hoa_lookfeel["logo_bg_color"] ?>;
	}
td.header {
	background: <?php print $hoa_lookfeel["header_bg_color"] ?>;
	}
td.title {
	background: <?php print $hoa_lookfeel["title_bg_color"] ?>;
	}
td.menu {
	-webkit-box-sizing: border-box;
	-moz-box-sizing: border-box;
	box-sizing: border-box;
	background: <?php print $hoa_lookfeel["menu_bg_color"] ?>;
	color: <?php print $hoa_lookfeel["menu_font_color"] ?>;
	text-align: center;
	}
td.menuitem_img {
	margin: 0px 0px 0px 0px;
	text-align: <?php print $menu_text_pos; ?>;
	white-space: nowrap;
	}
td.menuitem_text {
	margin: 0px 0px 0px 0px;
	padding: <?php printf("%-0dpx %-0dpx %-0dpx %-0dpx", $hoa_button["pad_top"], $rpad, 0, $lpad) ?>;
	text-align: <?php print $menu_text_pos; ?>;
	white-space: nowrap;
	color: <?php print $hoa_lookfeel["menu_font_color"] ?>;
	}
td.content {
	background: <?php print $hoa_lookfeel["content_bg_color"] ?>;
	color: <?php print $hoa_lookfeel["content_font_color"] ?>;
	width: 100%;
	/*
	background-image: url('images/bg_body3.jpg');
	background-position: center center;
	background-repeat: no-repeat;
	*/
	}
table.pages {
	font-size: 8pt;
	border-collapse: separate;
	border-spacing: 4px;
	}
table.pages td {
    padding: 4px;
}
td.content_main {
	background: <?php print $hoa_lookfeel["content_bg_color"] ?>;
	color: <?php print $hoa_lookfeel["content_font_color"] ?>;
<?php
	if($hoa_lookfeel["background_apply_to"] == "content")
	{
		if($hoa_lookfeel["content_background_file_id"] > 0)
		{
			$background_file = get_picture_file($hoa_lookfeel['content_background_file_id']);
?>
	background-image: url('<?php print $background_file[src]; ?>');
<?php
			if($hoa_lookfeel["content_background_repeat"] == "no-repeat")
			{
?>
	background-position: <?php print $hoa_lookfeel["content_background_horizontal_pos"] ?> <?php print $hoa_lookfeel["content_background_vertical_pos"] ?>;
<?
			}
?>
	background-repeat: <?php print $hoa_lookfeel["content_background_repeat"] ?>;
<?
		}
	}
?>
	}

div.header-title {
	font-family: "<?php print $hoa_lookfeel["header_font"] ?>",Arial,san-serif;
	font-size: 14pt;
	padding-top: 4px;
	font-weight: bold;
	color: <?php print $hoa_lookfeel["header_font_color"] ?>;
	}
a.hlink {
	font-family: "<?php print $hoa_lookfeel["header_font"] ?>",Arial,san-serif;
	font-size: 14pt;
	color: <?php print $hoa_lookfeel["header_font_color"] ?>;
	text-decoration: none;
	}
a:hover.hlink {
	text-decoration: underline;
	}
div.header-toc {
	font-family: "<?php print $hoa_lookfeel["header_font"] ?>",Arial,san-serif;
	font-size: 8pt;
	color: <?php print $hoa_lookfeel["header_font_color"] ?>;
	}
a.header-toc {
	font-family: "<?php print $hoa_lookfeel["header_font"] ?>",Arial,san-serif;
	font-size: 8pt;
	color: <?php print $hoa_lookfeel["header_font_color"] ?>;
	text-decoration: none;
	}
a:hover.header-toc {
	text-decoration: underline;
	}
div.page-title {
	margin-left: 20px;
	margin-right: 10px;
	font-family: "<?php print $hoa_lookfeel["title_font"] ?>",Arial,san-serif;
	font-size: <?php print $hoa_lookfeel['title_font_size'] . "pt" ?>;
	color: <?php print $hoa_lookfeel["title_font_color"] ?>;
	}
div.page-toc {
	margin-left: 20px;
	margin-right: 10px;
	font-family: "<?php print $hoa_lookfeel["title_font"] ?>",Arial,san-serif;
	font-size: 8pt;
	color: <?php print $hoa_lookfeel["title_font_color"] ?>;
	}
a.page-toc {
	font-family: "<?php print $hoa_lookfeel["title_font"] ?>",Arial,san-serif;
	font-size: 8pt;
	color: <?php print $hoa_lookfeel["title_font_color"] ?>;
	text-decoration: none;
	}
a:hover.page-toc {
	text-decoration: underline;
	}
div.content {
	text-indent: 0px;
	padding: 10px;
	/*margin-top: 10px;
	margin-left: 20px;
	margin-right: 10px;*/
	font-family: '<?php print $hoa_lookfeel["content_font"] ?>',Arial,san-serif;
	color: <?php print $hoa_lookfeel["content_font_color"] ?>;
	font-size: <?php print $hoa_lookfeel['content_font_size'] . "pt" ?>;
	}
div.notices {
	margin: 0px auto;
	width: 75%;
	text-align: center;
	font-family: "<?php print $hoa_lookfeel["content_font"] ?>",Arial,san-serif;
	font-size: 8pt;
	padding: 16px;
	color: <?php print $hoa_lookfeel["content_font_color"] ?>;
	}
a.notices {
	font-family: "<?php print $hoa_lookfeel["content_font"] ?>",Arial,san-serif;
	font-size: 8pt;
	font-weight: normal;
	white-space: nowrap;
	}
a:hover.notices {
	text-decoration: underline;
	color: <?php print $hoa_lookfeel["content_font_color"] ?>;
	}
span.menutext {
	font-family: "<?php print $hoa_lookfeel["menu_font"] ?>",Arial,san-serif;
	font-size: 9pt;
	font-weight: normal;
	color: <?php print $hoa_lookfeel["menu_font_color"] ?>;
	text-decoration: none;
	white-space: nowrap;
	}
a.menutext {
	font-family: "<?php print $hoa_lookfeel["menu_font"] ?>",Arial,san-serif;
	font-size: 9pt;
	font-weight: normal;
	color: <?php print $hoa_lookfeel["menu_font_color"] ?>;
	text-decoration: underline;
	white-space: nowrap;
	}
a:hover.menutext {
	font-weight: bold;
	}
span.mtsmall {
	font-family: "<?php print $hoa_lookfeel["menu_font"] ?>",Arial,san-serif;
	font-size: 8pt;
	font-weight: normal;
	color: <?php print $hoa_lookfeel["menu_font_color"] ?>;
	text-decoration: none;
	}
a.mtsmall {
	font-family: "<?php print $hoa_lookfeel["menu_font"] ?>",Arial,san-serif;
	font-size: 8pt;
	font-weight: normal;
	color: <?php print $hoa_lookfeel["menu_font_color"] ?>;
	text-decoration: underline;
	}
a:hover.mtsmall {
	font-weight: bold;
	}
a.menuitem {
	font-family: "<?php print $hoa_lookfeel["menu_font"] ?>",Arial,san-serif;
	font-size: <?php print $hoa_lookfeel["menu_font_size"] ?>pt;
	font-weight: normal;
	color: <?php print $hoa_lookfeel["menu_font_color"] ?>;
	text-decoration: none;
	white-space: nowrap;
	margin: 0px auto;
	}
a:hover.menuitem {
	font-weight: bold;
	}
a.colortile {
	-webkit-box-sizing: border-box;
	-moz-box-sizing: border-box;
	box-sizing: border-box;
	font-family: "<?php print $hoa_lookfeel["menu_font"] ?>",Arial,san-serif;
	font-size: <?php print $hoa_lookfeel["menu_font_size"] ?>pt;
	display: block;
	font-weight: normal;
	text-decoration: none;
	background-color: <?php print $hoa_lookfeel["button_bg_color"] ?>;
	border: 1px solid <?php print $hoa_lookfeel["button_bg_color"] ?>;
	color: <?php print $hoa_lookfeel["button_font_color"] ?>;
	text-align: <?php print $menu_text_pos; ?>;
	padding: 4px;
	width: 142px;
	min-width: 142px;
	max-width: 142px;
	margin: 1px auto 0 auto;
	word-wrap: break-word;
	}
a:hover.colortile {
	background-color: <?php print $hoa_lookfeel["menu_rollover_bg_color"] ?>;
	color: <?php print $hoa_lookfeel["menu_rollover_font_color"] ?>;
	}
a.colortileRounded {
	-webkit-box-sizing: border-box;
	-moz-box-sizing: border-box;
	box-sizing: border-box;
	font-family: "<?php print $hoa_lookfeel["menu_font"] ?>",Arial,san-serif;
	font-size: <?php print $hoa_lookfeel["menu_font_size"] ?>pt;
	display: block;
	font-weight: normal;
	text-decoration: none;
	background-color: <?php print $hoa_lookfeel["button_bg_color"] ?>;
	border-radius: 20px;
	color: <?php print $hoa_lookfeel["button_font_color"] ?>;
	text-align: <?php print $menu_text_pos; ?>;
	padding: 4px 6px 4px 6px;
	width: 142px;
	min-width: 142px;
	max-width: 142px;
	margin: 1px auto 0 auto;
	word-wrap: break-word;
	}
a:hover.colortileRounded {
	background-color: <?php print $hoa_lookfeel["menu_rollover_bg_color"] ?>;
	color: <?php print $hoa_lookfeel["menu_rollover_font_color"] ?>;
	}

/*Formatting for header*/
.headerImage {
	background-image: url("<?php print $header_file['src'] ?>");
	background-repeat: no-repeat;
	background-position: <?php print $headerHorizontal . " " . $headerVertical ?>;
	background-size: <?php print $background_size ?>;
	height: <?php print $height . "px" ?>;
	min-height: 150px;
}

/*
SEARCH FORMATTING
*/
.search-icon {
	background-color: <?php print $search_icon_bg_color ?>;
	border-radius: 50%;
	padding: 8px;
	margin: <?php print $search_icon_margin ?>;
	font-size: 1.5em;
	display: inline-block;
	float: <?php print $search_icon_float ?>;
	color: <?php print $search_icon_color ?>;
	transition: all .2s ease;
}
.search-icon:hover {
	background-color: <?php print $search_icon_hover_color ?>;
	cursor: pointer;
}
.modal {
	font-family: '<?php print $hoa_lookfeel["content_font"] ?>',Arial,sans-serif;
}
.modal-height-lg {
	max-height: 550px !important;
	overflow: auto;
}
.modal-header {
	background-color: <?php print $hoa_lookfeel["title_bg_color"] ?>;
	color: <?php print $hoa_lookfeel["title_font_color"] ?>;
}
.searchBox {
	background-color: #ffffff;
	width: 100%;
	margin: 10px 0 10px 0;
	color: #000000;
	text-align: center;
	box-sizing: border-box;
}
.searchBox span {
	color: #000000;
	font-weight: bold;
}
.searchBox input[type="submit"], .searchBox input[type="button"] {
	border: 1px solid <?php print $hoa_lookfeel["title_bg_color"] ?>;;
	border-radius: 3px;
	background-color: #ffffff;
	color: #000000;
	display: inline-block;
	margin: 10px auto 0 auto;
	padding: 5px;
	transition: all .2s ease;
}
.searchBox input[type="submit"]:hover, .searchBox input[type="button"]:hover {
	background-color: <?php print $hoa_lookfeel["title_bg_color"] ?>;
	color: <?php print $hoa_lookfeel["title_font_color"] ?>;
}
.searchBox input[type="text"] {
	display: block;
	width: 90%;
	padding: 5px;
	text-align: center;
	margin: 0px auto;
}
.search-results-wrapper {
	width: 100%;
	margin: 10px 0 10px 0;
}
.search-results-top {
	margin: 0 0 20px 0;
	box-sizing: border-box;
}
.search-results-keyword {
	display: inline-block;
	text-align: left;
	width: 72%;
}
.search-results-numbers {
	display: inline-block;
	text-align: right;
	width: 22%;
}
.search-results-page {
	display:inline-block;
	margin: 0 15px 2px -5px;
	font-size: 1.25em;
	text-decoration: none !important;
}
.search-results-page:hover {
	text-decoration: underline !important;
}
#search-results {
	display: none;
}
.search-results-wrapper ul {
	list-style: none outside none;
	margin: 0;
	padding: 0;
}
.search-results-wrapper li {
	padding: 5px;
	margin: 0 10px 20px 10px;
}
#search-spinner {
	display: none;
}
/*Formatting for Classifieds/Services*/
.adCategory {
	font-size: <?php print ($hoa_lookfeel['content_font_size'] + 2) . "pt" ?>;
	margin: 30px 0 10px -3px;
	width: 70%;
}
.adCategory a {
	text-decoration: none;
	color: inherit;
}
.adMain {
	border: 1px solid <?php print $default_border_bg_color ?>;
	margin: 5px 0 10px 10px;
	width: 70%;
	display: inline-block;
}
.adMain img {
	max-width: 90%;
}
.adTitle {
	background-color: <?php print $default_border_bg_color ?>;
	color: <?php print $hoa_lookfeel['title_font_color'] ?>;
	border-bottom-right-radius: 15px;
	width: 45%;
	padding: 8px 10px 8px 8px;
	font-size: <?php print ($hoa_lookfeel['content_font_size'] + 1) . "pt" ?>;
	/*font-size: 12pt;*/
}
.adText {
	padding: 5px;
	font-size: <?php print $hoa_lookfeel['content_font_size'] . "pt" ?>;
	/*font-size: 10pt;*/
}
.adAdditionalInfo {
	background-color: <?php print $default_border_bg_color ?>;
	color: <?php print $hoa_lookfeel['title_font_color'] ?>;
	font-size: <?php print ($hoa_lookfeel['content_font_size'] - 1) . "pt" ?>;
	padding: 5px;
	float: right;
	clear: both;
	margin-top: 10pt;
	border-top-right-radius: 5px;
	border-top-left-radius: 5px;
	transition: all .2s ease;
}
.adAdditionalInfo:hover {
	background-color: <?php print $hoa_lookfeel['title_font_color'] ?>;
	color: <?php print $default_border_bg_color ?>;
}
.adCreatedDate {
	font-size: 10pt;
	font-style: italic;
	float: right;
	margin: 3px;
}
.adCategoryHeadlineWrapper {
	margin-bottom: 20px;
}
.adCategoryHeadlineWrapper a {
	text-decoration: none;
	color: inherit;
}
.adCategoryHeadline {
	font-size: <?php print $hoa_lookfeel['content_font_size'] . "pt" ?>;
	/*font-size: 10pt;*/
	background-color: #999999;
	display: inline-block;
	font-weight: bold;
	padding: 5px;
	margin: 0px 10px 5px 0px;
}
.adCategoryHeadline:hover {
	background-color: #cccccc;
}
.adCategoryInstructions {
	font-style: italic;
	font-size: <?php print ($hoa_lookfeel['content_font_size'] - 1) . "pt" ?>;
	/*font-size: 10pt;*/
	margin-bottom: 5px;
}
.backToTop {
	font-size: <?php print ($hoa_lookfeel['content_font_size'] - 1) . "pt" ?>;
	/*font-size: 10pt;*/
	background-color: #999999;
	color: #ffffff;
	font-style: italic;
	float: right;
	padding: 2px;
	margin: 3px -13px 0 0;
}
.backToTop:hover {
	background-color: #cccccc;
	color: #000000;
}
/*End classified/services formatting*/

<?php
//set formatting of contact success message depending on user-defined layout
if($hoa_lookfeel['nav_orientation'] == 'h') {
	$contact_align = "center";
	$margin_left = "auto";
	$margin_right = "auto";
} else {
	$contact_align = "left";
	$margin_left = "40px";
	$margin_right = "0px";
}
?>
.msgSent {
	margin: 10px <?php print $margin_right ?> 20px <?php print $margin_left ?>;
	text-align: <?php print $contact_align ?>;
	font-size: <?php print $hoa_lookfeel['content_font_size'] . "pt" ?>;
	/*font-size: 12pt;*/
	min-height: 300px;
}
.msgSent a {
	border: 2px solid <?php print $hoa_lookfeel['title_bg_color'] ?>;
	background-color: <?php print $hoa_lookfeel['title_bg_color'] ?>;
	color: <?php print $hoa_lookfeel['title_font_color'] ?>;
	padding: 5px;
	font-size: 10pt;
	border-radius: 5px;
	text-decoration: none;
	white-space: nowrap;
}
.msgSent a:hover {
	background-color: <?php print $hoa_lookfeel['title_font_color'] ?>;
	color: <?php print $hoa_lookfeel['title_bg_color'] ?>;
}

/*loader - bars*/
.spinner {
  margin: 8px auto 8px auto;
  width: 50px;
  height: 40px;
  text-align: center;
  font-size: 10px;
}

.spinner > div {
  background-color: #34495e;
  height: 100%;
  width: 6px;
  display: inline-block;

  -webkit-animation: sk-stretchdelay 2.2s infinite ease-in-out;
  animation: sk-stretchdelay 2.2s infinite ease-in-out;
}

.spinner .rect2 {
  -webkit-animation-delay: -2.1s;
  animation-delay: -2.1s;
}

.spinner .rect3 {
  -webkit-animation-delay: -2.0s;
  animation-delay: -2.0s;
}

.spinner .rect4 {
  -webkit-animation-delay: -1.9s;
  animation-delay: -1.9s;
}

.spinner .rect5 {
  -webkit-animation-delay: -1.8s;
  animation-delay: -1.8s;
}

@-webkit-keyframes sk-stretchdelay {
  0%, 40%, 100% { -webkit-transform: scaleY(0.4) }
  20% { -webkit-transform: scaleY(1.0) }
}

@keyframes sk-stretchdelay {
  0%, 40%, 100% {
    transform: scaleY(0.4);
    -webkit-transform: scaleY(0.4);
  }  20% {
    transform: scaleY(1.0);
    -webkit-transform: scaleY(1.0);
  }
}

/*Loader Spinner*/
.loaderWrapper {
	width: 50%;
	margin: 25px auto;
	/*min-height: 400px;*/
	text-align: center;
	font-style: italic;
}
.loader {
  text-align: center;
  font-size: 10px;
  margin: 10px auto;
  z-index: 999;
  border-top: 1.1em solid rgba(52,73,94,0.3);
  border-right: 1.1em solid rgba(52,73,94,0.3);
  border-bottom: 1.1em solid rgba(52,73,94,0.3);
  border-left: 1.1em solid rgba(52,73,94,1.0);
  -webkit-animation: load8 1.5s infinite linear;
  animation: load8 1.5s infinite linear;
}
.loader,
.loader:after {
  border-radius: 50%;
  width: 5em;
  height: 5em;
  z-index: 999;
}
.fullsize-loader {
  text-align: center;
  font-size: 10px;
  margin: 50px auto;
  z-index: 999;
  border-top: 1.1em solid rgba(52,73,94,0.3);
  border-right: 1.1em solid rgba(52,73,94,0.3);
  border-bottom: 1.1em solid rgba(52,73,94,0.3);
  border-left: 1.1em solid rgba(52,73,94,1.0);
  -webkit-animation: load8 1.5s infinite linear;
  animation: load8 1.5s infinite linear;
}
.fullsize-loader,
.fullsize-loader:after {
  border-radius: 50%;
  width: 10em;
  height: 10em;
  z-index: 999;
}

@-webkit-keyframes load8 {
  0% {
    -webkit-transform: rotate(0deg);
    transform: rotate(0deg);
  }
  100% {
    -webkit-transform: rotate(360deg);
    transform: rotate(360deg);
  }
}
@keyframes load8 {
  0% {
    -webkit-transform: rotate(0deg);
    transform: rotate(0deg);
  }
  100% {
    -webkit-transform: rotate(360deg);
    transform: rotate(360deg);
  }
}

/*Back to top button*/
.toTopRd {
	display: none;
	position: fixed;
	bottom: 20px;
	right: 10px;
	border-radius: 50%;
	z-index: 99;
	text-align: center;
	height: 30px;
	width: 30px;
	line-height: 30px;
	font-size: 15pt;
    background-color: <?php print $default_border_bg_color ?>;
    color: <?php print $default_main_color ?>;
    border: 1px solid <?php print $default_border_bg_color ?>;
/*    margin: 0 25px 10px 0;*/
    cursor: pointer;
    transition: all 0.3s ease;
    -webkit-transition: all 0.3s ease;
}
.toTopRd:hover {
    background-color: <?php print $default_main_color ?>;
    color: <?php print $default_border_bg_color ?>;
    border: 1px solid <?php print $default_border_bg_color ?>;;
}
.titleText-wrapper {
  background-color: #ecf0f1;
  display: block;
  padding: 8px;
}
.titleText {
  font-size: 16pt;
  color: #34495E;
  display: inline-block;
}
.nord-panel {
    border: 1px solid #ecf0f1;
    margin-bottom: 16px;
    padding: 16px;
}
.buttons-left {
	text-align: left;
	width: 90%;
	margin: 5px auto 10px auto;
}
.createLink {
	margin: 4px 0 10px 0;
	padding: 5px 5px 5px 5px;
  	background-color: #34495e;
  	color: #ffffff;
  	text-decoration: none;
    border: none;
  	line-height: 100%;
	font-size: 12pt;
	display: inline-block;
	text-align: center;
	cursor: pointer;
	-webkit-transition:all 0.3s ease;
	transition:all 0.3s ease;
}
.createLink:hover {
    color: #ffffff;
    text-decoration: none;
    background-color: #7FB2E5;
}
.cancelLink {
    margin: 5px 0 10px 0;
    padding: 5px 3px 5px 3px;
    background-color: #7F4746;
    color: #ffffff;
    text-decoration: none;
    border-radius: 2px;
    line-height: 100%;
    font-size: 12pt;
    display: inline-block;
    text-align: center;
    cursor: pointer;
    -webkit-transition:all 0.2s ease;
    transition:all 0.2s ease;
}
.cancelLink:hover {
    background-color: #FF8E8D;
    text-decoration: none;
    color: #ffffff;
}
input[type="submit"] {
    font-family: sans-serif;
    margin: 5px 0 10px 0;
    padding: 5px 3px 5px 3px;
    background-color: #2B7F45;
    border: none;
    color: #ffffff;
    border-radius: 2px;
    font-size: 12pt;
    line-height: 100%;
    display: inline-block;
    text-align: center;
    cursor: pointer;
    -webkit-transition:all 0.2s ease;
    transition:all 0.2s ease;
}
input[type="submit"]:hover {
    background-color: #4CDF78;
}
input[type="button"], input[type="reset"] {
    font-family: sans-serif;
    margin: 5px 0 10px 0;
    padding: 5px 3px 5px 3px;
    background-color: #7F4746;
    border: none;
    color: #ffffff;
    border-radius: 2px;
    font-size: 12pt;
    line-height: 100%;
    display: inline-block;
    text-align: center;
    cursor: pointer;
    -webkit-transition:all 0.2s ease;
    transition:all 0.2s ease;
}
input[type="button"]:hover, input[type="reset"]:hover {
    background-color: #FF8E8D;
}
.req-form-wrapper {
	margin-left: 10px;
}
.req-form-item {
	padding: 5px;
	display: block;
	margin: 8px 0 8px 0;
}

.status-left {
    position: fixed;
    padding: 25px;
    max-width: 40%;
    top: 5px;
    left: 20px;
    text-align: center;
    font-size: 0.9em;
    z-index: 9999;
    color: #ffffff;
    background-color: #009f13;
}
.status-left-failed {
    margin: 5px 10px 10px 10px;
    display: inline-block;
    color: #000000;
    font-size: 10pt;
    background-color: #FF8E8D;
    border-radius: 3px;
    border: 1px solid #7F4746;
    padding: 5px;
}
.multiDeleteFiles {
    display: none;
}
.mobile-only, .mobile-menu {
	display: none;
}
a:link:after, a:visited:after {
  content: normal !important;
}
a {
	text-decoration: underline;
}
.link-non-default {
	text-decoration: none;
}

/*Mailing list specific*/
.modal-messages {
  display: none;
  text-align: center;
  width: 100%;
  height: 100%;
}
#modal-message-title {
  font-size: 1.5em;
  margin-bottom: 8px;
}
#modal-message-text {
  display: none;
}
#modal-success {
  display: none;
  font-size: 4.5em;
  color: green;
  margin-bottom: 16px;
}
#modal-failure {
  display: none;
  font-size: 4.5em;
  color: red;
  margin-bottom: 16px;
}

/*User profiles adjustments*/
.slider-messages {
	width: 85%;
	margin: 0px auto;
}
.slider-message-title {
	color: #333;
	margin-top: 42px;
	margin-bottom: 36px;
}
.slider-icon {
	margin-top: 42px;
	margin-bottom: 16px;
}
.slider-message-body-text {
	font-size: 1.5em;
	margin-top: 28px;
}

/*User Login form*/
.login-regular {
    font-size: 12pt;
    margin: 20px 0 20px 20px;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
}
.login-regular input[type=submit] {
	margin: 10px 0 10px 0;
	display: block;
}
.login-regular-ind {
	display: inline-block;
}
.mobile-header {
	display: none;
}
.login-regular-ind input[type=text] {
	border: 1px solid black;
	padding: 5px;
}
.login-regular-ind input[type=password] {
	border: 1px solid black;
	padding: 5px;
}

/*Contact/request form styling*/
.contactFormContainer {
	min-width: 500px;
}
.contactFormWrapper {
	width: 60%;
	margin: 0px auto 50px auto;
}
.contactFormWrapper a {
	border: 2px solid <?php print $contact_bg_color ?>;
	background-color: <?php print $contact_bg_color ?>;
	color: <?php print $hoa_lookfeel['title_font_color'] ?>;
	padding: 5px;
	font-size: 8pt;
	border-radius: 5px;
	text-decoration: none;
	white-space: nowrap;
}
.contactFormWrapper a:hover {
	background-color: <?php print $hoa_lookfeel['title_font_color'] ?>;
	color: <?php print $contact_bg_color ?>;
	cursor: pointer;
}
.contactButtonWrapper {
	margin: 15px 10px 10px 0;
	text-align: left;
	width: 85%;
	min-width: 400px;
}
.antiSpamWrapper {
	width: 100%;
	text-align: center;
	font-size: 10pt;
}
#contactButton {
	border: 2px solid <?php print $contact_bg_color ?>;
	background-color: <?php print $contact_bg_color ?>;
	color: <?php print $hoa_lookfeel['title_font_color'] ?>;
	padding: 5px;
	font-size: 14pt;
	border-radius: 5px;
	text-align: center;
}
#contactButton:hover {
	background-color: <?php print $hoa_lookfeel['title_font_color'] ?>;
	color: <?php print $contact_bg_color ?>;
	cursor: pointer;
}
.mainContactField {
	border: 2px solid <?php print $contact_bg_color ?>;
	border-right: 20px solid <?php print $contact_bg_color ?>;
	padding: 5px;
	width: 85%;
	margin: -1px 5px 10px 0;
	border-radius: 5px;
}
#requiredMessage {
	height: 150px;
}
#textareaCheckbox {
	margin: 0 0 75px -6px;
}
.contactSiteAdminTitle {
	font-size: 16pt;
	font-weight: bold;
	margin-bottom: 5px;
	text-align: right;
}

/*HELPER CLASSES*/
.uppercase {
	text-transform: uppercase;
	border: 1px solid <?php print $contact_bg_color ?>;
	padding: 5px;
	width: 50%;
	margin: 1px 5px 10px 0;
}
.green-button {
  background-color: #2B7F45 !important;
}
.green-button:hover {
  background-color: #4CDF78 !important;
}

.contactCheckbox {
	border-radius: 50%;
	background-color: green;
	display: none;
	height: 10px;
	width: 10px;
	padding: 3px;
}
#errorTextBox {
	display: none;
	font-size: 10pt;
	text-align: left;
	padding: 5px;
	border: 2px solid red;
	border-right: 20px solid red;
	border-radius: 5px;
	color: red;
	float: right;
}
#errorTextBoxCustom {
	display: none;
	font-size: 10pt;
	text-align: left;
	padding: 5px;
	border: 2px solid red;
	border-right: 20px solid red;
	border-radius: 5px;
	color: red;
	margin-left: 5px;
}

/*Fix form styling (to avoid white text on white background*/
form input[type=text], input[type=password], select, textarea {
	color: #000000;
}
.base-table {
	width: 100%;
}

/*Bootstrap tooltip styling*/
.tooltip-inner {
	background-color: <?php print $hoa_lookfeel['help_text_background_color'] ?>;
	color: #000000;
}

/*
PHOTO ALBUM FEATURE SPECIFIC STYLING
*/
.modal-open {
	display: inline-block;
}
.modal-lg {
	width: 90%;
	min-width: 90%;
	text-align: center;
	height: 90%;
	max-height: 90%;
	z-index: 99;
}
.modal-content {
	height: 100%;
	min-height: 100%;
}
.modal-backdrop {
	z-index: 98;
	/*background-color: <?php print $hoa_lookfeel['title_bg_color'] ?> !important;*/
}
.glyphicon-remove {
	float: right;
	z-index: 99;
}
.modal-body {
	padding-top: 0;
	padding-bottom: 0;
	height: 100%;
	min-height: 100%;
}
.modal-body img {
	max-width: 100%;
	max-height: 100%;
}
.img-grid-wrapper {
	box-sizing: border-box;
	font-size: 0;
}
.ind-picture-view {
	padding: 5px 5px 5px 5px;
	height: 175px;
	text-align: center;
	vertical-align: top;
	cursor: pointer;
}
.ind-picture-view img {
	max-width: 100% !important;
	max-height: 100% !important;
}
.modal-content .container-fluid, .row {
	height: 100%;
	min-height: 100%;
}
.album-img-background {
	color: #cccccc;
	background-color: #000000;
	padding: 0;
	height: 100%;
	min-height: 100%;
	text-align: center;
}
.album-img-background img {
	margin: auto;
	position: absolute;
	top: 0; left: 0; bottom: 0; right: 0;
}
.album-caption-background {
	background-color: #ffffff;
	height: 100%;
	min-height: 100%;
	text-align: left;
	padding: 0;
}
.col-md-3 {
	padding-right: 0;
	padding-left: 0;
}
.caption-wrapper {
	margin-top: 25px;
	position: relative;
	min-height: 50%;
	padding: 5em 0 0 0;
}
.img-caption {
	text-align: center;
	padding: 5px;
	font-size: 10pt;
}
.caption-footer {
	position: absolute;
	bottom: 0;
	right: 0;
	text-align: center;
	padding: 5px;
	color: #000000;
	font-style: italic;
	font-size: 10pt;
	width: 100%;
    -webkit-touch-callout: none;
    -webkit-user-select: none;
    -khtml-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
}
.glyphicon-chevron-left {
	float: left;
	font-size: 18pt;
	padding: 3px;
    -webkit-touch-callout: none;
    -webkit-user-select: none;
    -khtml-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
    transition: all .2s ease;
}
.glyphicon-chevron-right {
	float: right;
	font-size: 18pt;
	padding: 3px;
    -webkit-touch-callout: none;
    -webkit-user-select: none;
    -khtml-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
    transition: all .2s ease;
}
.glyphicon-chevron-left:hover, .glyphicon-chevron-right:hover {
	cursor: pointer;
	color: #666666;
	background-color: #cccccc;
}
.mobile-only {
	display: none;
}

/*Loader Spinner for album only*/
.loaderWrapper--album {
	width: 100%;
	text-align: center;
	font-style: italic;
}
.loader--album {
  text-align: center;
  position: absolute;
	  top: 0; left: 0; bottom: 0; right: 0;
  font-size: 1.25em;
  margin: auto;
  z-index: 999;
  border-top: .75em solid <?php print $default_border_bg_color ?>;
  border-right: .75em solid <?php print $default_border_bg_color ?>;
  border-bottom: .75em solid <?php print $default_border_bg_color ?>;
  border-left: .75em solid <?php print $default_main_color ?>;
  -webkit-animation: load8 2s infinite linear;
  animation: load8 2s infinite linear;
}
.loader--album,
.loader--album:after {
  border-radius: 50%;
  width: 6em;
  height: 6em;
  z-index: 999;
}
/*@-webkit-keyframes load8 {
  0% {
    -webkit-transform: rotate(0deg);
    transform: rotate(0deg);
  }
  100% {
    -webkit-transform: rotate(360deg);
    transform: rotate(360deg);
  }
}
@keyframes load8 {
  0% {
    -webkit-transform: rotate(0deg);
    transform: rotate(0deg);
  }
  100% {
    -webkit-transform: rotate(360deg);
    transform: rotate(360deg);
  }
}*/
.album-container {
	box-sizing: border-box;
	position: relative;
	display: inline-block;
	vertical-align: top;
	/*max-width: 23%;*/
	margin: 0 15px 15px 0;
	box-shadow: 0 0 6px 0 <?php print $hoa_lookfeel["title_bg_color"] ?>;
	height: 200px;
	width: 225px;
	transition: all .2s ease;
}
.album-container img {
	max-width: 100% !important;
	max-height: 100% !important;
	width: 100%;
	height: 100%;
}
.album-headline {
	font-size: 1.15em;
	padding: 3px;
	position: absolute;
	top: 0;
	left: 0;
	background-color: rgba(255,255,255,.6);
	color: #000000;
	width: 92%;
	transition: all .2s ease;
}
.album-container:hover {
	box-shadow: 0 0 8px 3px <?php print $hoa_lookfeel["title_bg_color"] ?>;
}
.album-container:hover .album-headline {
	background-color: rgba(255,255,255,1.0);
}
.album-link {
	font-family: "<?php print $hoa_lookfeel["content_font"] ?>",Arial,san-serif;
	font-size: <?php print $hoa_lookfeel['content_font_size'] . "pt" ?>;
	font-weight: normal;
	color: <?php print $hoa_lookfeel["content_font_color"] ?>;
	text-decoration: none;
}
.album-link:hover {
	text-decoration: none;
}

/*
Login module styles
*/
.logoutText {
	text-align: center;
	padding: 0 0 3px 0;
	width: <?php print $cell_width . "px" ?>;
	color: <?php print $hoa_lookfeel['button_font_color'] ?>;
}
.logoutText a {
	color: <?php print $hoa_lookfeel['menu_bg_color'] ?>;
	background-color: <?php
		if($hoa_lookfeel['button_font_color'] != '' && $hoa_lookfeel['menu_bg_color'] != $hoa_lookfeel['button_font_color']) {
			print $hoa_lookfeel['button_font_color'];
		} else {
			print $hoa_lookfeel['menu_font_color'];
		}?>;
	text-decoration: none;
	padding: 3px;
	border-radius: 2px;
	border: 1px solid <?php
		if($hoa_lookfeel['button_font_color'] != '' && $hoa_lookfeel['menu_bg_color'] != $hoa_lookfeel['button_font_color']) {
			print $hoa_lookfeel['button_font_color'];
		} else {
			print $hoa_lookfeel['menu_font_color'];
		}?>;
	cursor: pointer;
	transition: all 0.2s ease;
}
.logoutText a:hover {
	color: <?php
		if($hoa_lookfeel['button_font_color'] != '' && $hoa_lookfeel['menu_bg_color'] != $hoa_lookfeel['button_font_color']) {
			print $hoa_lookfeel['button_font_color'];
		} else {
			print $hoa_lookfeel['menu_font_color'];
		}?>;
	background-color: <?php print $hoa_lookfeel['menu_bg_color'] ?>;
}
.logoutTextHoriz {
	text-align: center;
	width: <?php print $cell_width . "px" ?>;
	color: <?php print $hoa_lookfeel['content_font_color'] ?>;
}
.logoutTextHoriz a {
	color: <?php print $hoa_lookfeel['content_bg_color'] ?>;
	background-color: <?php print $hoa_lookfeel['content_font_color'] ?>;
	text-decoration: none;
	padding: 3px;
	border-radius: 2px;
	border: 1px solid <?php print $hoa_lookfeel['content_font_color'] ?>;
	cursor: pointer;
	transition: all 0.2s ease;
}
.logoutTextHoriz a:hover {
	color: <?php print $hoa_lookfeel['content_font_color'] ?>;
	background-color: <?php print $hoa_lookfeel['content_bg_color'] ?>;
}
.logoutTextHoriz .glyphicon, .logoutText .glyphicon {
	margin-right: 6px;
}


/*
User Profile Feature Styles
*/

/*Slider Backdrop*/
.slider-backdrop {
  min-height: 100%;
  min-width: 100%;
  top: 0;
  left: 0;
  position: fixed;
  background-color: rgba(0,0,0,0.3);
  z-index: -1;
  opacity: 0;
  cursor: pointer;
  transition: opacity 0.2s ease-in-out;
}
.backdrop-show {
  z-index: 98;
  opacity: 1;
}
/*Main slider styles*/
.slider-wrapper {
  padding: 16px 8px 16px 8px;
  display: flex;
  flex-wrap: wrap;
}
.slider-wrapper input[type=text] {
  border: 0;
  min-width: 45%;
  background-color: rgba(51,51,51,1.0);
  color: #fff;
  border-bottom: 1px solid #ccc;
  margin: 8px;
  padding: 4px;
  font-size: 1.25em;
  border-top-right-radius: 5px;
  border-top-left-radius: 5px;
  transition: border 0.5s ease;
}
.slider-wrapper input[type=text]:focus {
  outline: 0;
  box-shadow: 0;
  background-color: rgba(255,255,255,0.1);
}
.sidebar {
  height: 100%;
  min-height: 100%;
  background-color: #333;
  color: #fff;
  width: 600px;
  max-width: 85%;
  box-shadow: 0 0 6px #000;
  z-index: 99;
}
.sidebar h2 {
  margin-top: 0;
  margin-bottom: 0;
  padding: 6px;
  font-weight: normal;
  color: white;
}
.subhead-info {
  font-style: italic;
  margin: 0 16px 0 16px;
}
#slider-hide {
  position: absolute;
  top: 0;
  right: 0;
  padding: 6px;
  font-size: 1.2em;
  cursor: pointer;
}
#slider-hide:hover {
  color: #ccc;
}
.sidebar-hidden {
  position: fixed;
  top: 0;
  left: 0;
  -ms-transform: translateX(-650px);
  -webkit-transform: translateX(-650px);
  -moz-transform: translateX(-650px);
  -o-transform: translateX(-650px);
  transform: translateX(-650px);
  transition: transform 0.5s ease-in-out;
}
.sidebar-show {
  -ms-transform: translateX(0);
  -webkit-transform: translateX(0);
  -moz-transform: translateX(0);
  -o-transform: translateX(0);
  transform: translateX(0);
}
.profile-button {
  border: 0;
  font-size: 1.5em;
  color: #f5f5f5;
  transition: color 0.2s ease-in-out;
}
.profile-button:hover {
	color: #fff;
}
.profile-button-wrapper {
	position: absolute;
	bottom: 0;
	right: 0;
}
.profile-save {
  background-color: rgba(0,135,68,0.8);
  transition: background-color 0.2s ease-in-out;
}
.profile-save:hover {
	background-color: rgba(0,135,68,1);
}
.profile-cancel {
    background-color: rgba(214,45,32,0.8);
    transition: background-color 0.2s ease-in-out;
}
.profile-cancel:hover {
	background-color: rgba(214,45,32,1);
}
.profile-logout {
	background-color: rgba(0,87,231,0.8);
	transition: background-color 0.2s ease-in-out;
}
.profile-logout:hover {
	background-color: rgba(0,87,231,1.0);
}


/*
Recordkeeping Feature Styles
*/

.rkc-outer-wrapper {
    width: 100%;
    text-align: left;
}
.rkc-outer-wrapper .col-md-6 {
    padding-left: 0;
    padding-right: 0;
}
.rkc-cat-wrapper {
    border: 1px solid #3b7d75;
    border-radius: 3px;
    width: 31%;
    display: inline-block;
    vertical-align: top;
    margin: 10px 12px 12px 0;
    font-size: 10pt;
    color: #000000;
    min-height: 200px;
}
.rkc-cat-wrapper_text {
    padding: 5px;
    text-align: center;
}
.rkc-cat-wrapper_text .glyphicon {
    cursor: default;
}
.rkc-cat-header {
    background-color: #dbe8e5;
    padding: 3px;
    border-bottom: 1px solid #3b7d75;
}
.rkc-cat-title {
    font-size: 1.25em;
    text-align: left;
    width: 70%;
    display: inline-block;
}
.rkc-cat-options {
    font-size: 1em;
    text-align: right;
    width: 27%;
    display: inline-block;
}
.rkc-cat-options .glyphicon {
    margin-left: 3px;
    cursor: pointer;
}
.rkc-cat-options a {
    text-decoration: none;
}
.rkc-cat-users {
    padding: 5px;
    margin: 0px auto 10px 0;
    width: 32%;
    display: inline-block;
    vertical-align: top;
}
.rkc-cat-users-half {
    padding: 5px;
    margin: 0px auto 10px 0;
    width: 48%;
    display: inline-block;
    vertical-align: top;
}
.rkc-cat-users-full {
    padding: 5px;
    margin: 0px auto 10px 0;
    width: 100%;
    display: block;
}
.rkc-cat-users_circle {
    border-radius: 50%;
    width: 45px;
    height: 45px;
    font-size: 40px;
    padding: 5px;
    line-height: 40px;
    margin: 0px auto;
    /*background-color: #cccccc;*/
}
.rkc-cat-users_circle .glyphicon-ok {
    color: #3c763d;
}
.rkc-cat-users_circle .glyphicon-remove {
    color: #a94442;
}

/*
General admin/manage styles
*/
.admin-content-wrapper--fullwidth {
    width: 100%;
    padding: 20px;
    text-align: left;
    border-top: 1px solid #a9a9a9;
    border-bottom: 1px solid #a9a9a9;
    position: relative;
}
.admin-help-button {
    position: absolute;
    bottom: 0;
    right: 0;
    padding: 6px;
    background-color: #ffa000;
    color: #ffffff;
    text-decoration: none;
    transition: all .3s ease-in-out;
    transform-origin: right bottom;
}
.admin-help-button:hover {
    text-decoration: none;
    color: #ffffff;
    transform: scale(1.15);
}
.admin-help-button:focus {
    text-decoration: none;
    color: inherit;
}
.admin-content-wrapper {
    min-height: 100%;
    width: 100%;
    flex: 1 0 auto;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
}
.admin-content-wrapper form {
  width: 100%;
}
.admin-content-text {
    padding: 0 10px 0 10px;
    margin: 25px 0 0 0;
}
.admin-content-text table {
	table-layout: fixed;
    width: 100%;
    max-width: 100%;
    border-collapse: separate;
    border-spacing: 2px !important;
}
.admin-content-text td {
    padding: 4px;
}

.feature-description {
    text-align: left;
    font-size: 9pt;
    color: #000000;
    font-style: italic;
    margin-top: 5px;
}
.feature-description .glyphicon {
    margin-right: 5px;
    color: inherit;
    cursor: default;
    float: none;
}
.feature-description .glyphicon:hover {
    color: inherit;
}
.feature-title-text {
    text-align:left;
    color:#3b7d75;
    font-size:2em;
    display: inline-block;
    vertical-align: top;
    width: 70%;
    margin-bottom: 25px;
}
.feature-title-text .nav {
    margin-bottom: 3px;
}
.feature-title-text .nav li a {
    padding: 5px 10px;
    text-decoration: none;
}
.feature-create-div {
    text-align:right;
    display: inline-block;
    vertical-align: top;
    width: 27%;
}
.rkc-cat-wrapper {
    position: relative;
}
.rkc-wrapper {
    width: 100%;
    text-align: left;
    display: none;
}
.rkc-wrapper .col-md-8 {
    margin-bottom: 2em;
}
/*.rkc-wrapper input[type=text] {
    padding: 20px;
}*/
.rkc-wrapper h1 {
    font-size: 1.25em;
    margin: 5px 0 15px 5px;
    display: inline-block;
    color: #3b7d75;
}
.rkc-edit {
    float: right;
}
.glyph-lg {
    cursor: pointer;
}
.rkcTitleText {
    font-size: 2.25em;
    color: #0F1E1E;
    margin: -15px 0 3px 0;
    text-align: left;
}
.rkc-small {
    font-size: .5em;
}
.rkcTitleTextSm {
    font-size: 1em;
    color: #3b7d75;
    font-style: italic;
    text-align: left;
    margin: 0 0 20px 0;
}
.rkc-menu-main h1 {
    font-size: 1.15em;
}
.rkc-form-submit{
    position: relative;
}
.adding-in-progress {
    display: none;
    width: 100%;
    height: 100%;
    z-index: 99;
    text-align: center;
    position: absolute;
    background-color: rgba(0,0,0, .2);
}
.rkc-menu {
    background-color: #dbe8e5;
    width: 100%;
    margin: 0 0 15px 0;
    border: 1px solid #cccccc;
}
#rkc-approval-hidden .container-fluid {
    padding-left: 0;
    padding-right: 0;
}
.rkc-menu-text {
    padding: 5px;
    text-align: left;
}
.return {
    display: block;
    width: 100%;
    color: #3b7d75;
    margin-top: 15px;
    text-align: center;
    padding: 5px;
    text-decoration: none;
}
.return:hover {
    color: inherit;
    text-decoration: none;
}
.rkc-top {

}
.rkc-images {
    position: relative;
}
.rkc-files {
    position: relative;
}
.rkc-images input[type=text], .rkc-files input[type=text] {
    padding: 3px;
}
.rkc-addnew {
}
.rkc-addnew input[type=text] {
    margin: 0 0 5px 0;
}
.rkc-addnew textarea, #rkc-entryEdit-Modal textarea {
    margin: 0 0 5px 0;
    min-height: 150px;
}
.rkc-addnew-hidden {
    display: none;
}
.rkc-archive-wrapper {
    display: none;
    border: 1px solid #000000;
    margin: 10px 0 10px 0;
    padding: 5px;
}
.rkc-text-left {
    text-align: left;
}
.modal-body input[type=select] {
    min-width: 100%;
    padding: 10px;
}
.showArchive {
    padding: 5px;
    background-color: #cccccc;
    display: inline-block;
    transition: all .2s ease;
}
.showArchive:hover {
    background-color: #666666;
    cursor: pointer;
}
.rkc-file-container {
    text-align: left;
}
.rkc-file-wrapper {
    display: inline-block;
    width: 30%;
    margin: 0 5px 10px 0;
    border: 1px solid #3b7d75;
    border-radius: 3px;
    color: #3b7d75;
    height: 75px;
    cursor: pointer;
    transition: all .2s ease;
}
.rkc-file-wrapper:hover {
    color: #000000;
    border: 1px solid #000000;
}
.rkc-entry-ul {
    margin: 0;
    padding: 0;
}
.rkc-entry-ul h3 {
    font-size: 1.4em;
    margin: 0 0 10px 0;
}
.rkc-entry-profile {
    height: 32px;
    width: 32px;
    font-size: 26px;
    text-align: center;
    line-height: 32px;
    float: right;
}
.rkc-entry-profile .glyphicon {
    height: 28px;
    width: 28px;
    cursor: default;
}
.rkc-entry-profile .glyphicon-comment {
    color: #31708f;
}
.rkc-entry-profile .glyphicon-ok-sign {
    color: #3c763d;
}
.rkc-entry-profile .glyphicon-remove-sign {
    color: #a94442;
}
.rkc-entry-ul li {
    /*border: 1px solid black;*/
    background-color: rgba(0,0,0,.1);
    border-radius: 5px;
    width: 100%;
    list-style-type: none;
    margin: 0 0 15px 0;
    padding: 0;
}
.rkc-entry-text {
    padding: 6px;
}
.modal-width-lg {
    min-width: 85%;
}
.modal-height-lg {
    min-height: 500px;
}
.rkc-entry-buttons {
    padding: 3px;
    border-top: 1px solid #cccccc;
    border-left: 1px solid #cccccc;
    border-top-left-radius: 3px;
    display: inline-block;
    font-size: 1.25em;
    margin-left: 5px;
}
.rkc-entry-details {
    padding-bottom: 3px;
    margin-top: 10px;
    width: 100%;
    font-style: italic;
    font-size: .8em;
    text-align: right;
}
.rkc-date-name {
    margin-right: 5px;
}
.approval-status {
    margin: -5px 0 5px 0;
}
.right-align {
    text-align: right;
}
.center-align {
    text-align: center;
}
.add-bottom-margin {
    margin: 0 0 10px 0;
}
.rk-approve-row {
    margin: 0 0 10px 0;
    border: 1px solid rgba(255,255,255,1);
    background-color: rgba(255,255,255,.5);
}
.rk-approve-row span {
    padding: 3px 0 3px 0;
}
.approve-click {
    padding: 0 3px 0 3px;
    height: 100%;
    min-height: 100%;
    background-color: #2B7F45;
    font-size: 1em;
    color: #ffffff;
    cursor: pointer;
    display: inline-block;
    text-align: center;
    margin: 0 3px 0 6px;
    transition: background-color ease .2s;
}
.approve-click:hover {
    background-color: #4CDF78;
}
.approve-cancel-click {
    padding: 0 3px 0 3px;
    height: 100%;
    min-height: 100%;
    background-color: #f03e26;
    font-size: 1em;
    color: #ffffff;
    cursor: pointer;
    display: inline-block;
    text-align: center;
    margin: 0 3px 0 3px;
    transition: background-color ease .2s;
}
.approve-cancel-click:hover {
    background-color: red;
}
.glyphicon-edit {
    color: #337ab7;
    cursor: pointer
}
.glyphicon-edit:hover {
    color: #23527c;
}
.rkc-entry-ul .glyphicon-remove {
    color: #337ab7;
    cursor: pointer;
}
.rkc-entry-ul .glyphicon-remove:hover {
    color: #23527c;
}
.glyphicon-plus-sign {
    margin: 5px;
}
.glyph-lg {
    font-size: 1.5em;
    border: 1px solid #3b7d75;
    color: #3b7d75;
    border-radius: 50%;
    padding: 5px;
    transition: all .2s ease;
}
.glyph-lg:hover {
    color: #000000;
    border: 1px solid #000000;
}
input[type=submit]:focus, input[type=submit]:active {
    background-color: #2B7F45;
    border: none;
    color: #ffffff;
}
input[type=reset]:focus, input[type=reset]:active {
    background-color: #7F4746;
    border: none;
    color: #ffffff;
}
.rkc-error {
    font-size: .75em;
    display: none;
    text-align: center;
    padding: 2px;
    background-color: #FF837E;
    border: 1px solid #BF1616;
    border-radius: 3px;
    color: #ffffff;
    margin: 0 0 2px 0;
}
.rkc-deleted {
  display: none;
  position: fixed;
  padding: 20px 5px 20px 5px;
  opacity: .9;
  width: 98%;
  top: 40%;
/*  background-color: #f03e26;
  color: #ffffff;*/
  text-align: center;
  font-size: 2.5em;
  z-index: 99;
  background-color: #a94442;
  color: #f6ecec;
  border-bottom: 1px solid #652827;
  border-top: 1px solid #652827;
}
#final-delete-confirm, #final-delete-cancel {
    padding: 5px;
    margin: 0 15px 0 15px;
    font-size: .75em;
    background-color: #f6ecec;
    border-radius: 3px;
    color: #652827;
    cursor: pointer;
    transition: all .2s ease;
}
#final-delete-confirm:hover, #final-delete-cancel:hover {
    color: #321413;
}
.rkc-notice {
  display: none;
  position: fixed;
  padding: 15px 5px 15px 5px;
  width: 50%;
  top: 0;
  right: 0;
  text-align: center;
  font-size: 1.5em;
  z-index: 99;
  border-bottom-left-radius: 3px;
}
.rkc-delete {
    display: none;
    position: absolute;
    width: 100%;
    height: 100%;
    background-color: rgba(0,0,0,.9);
    text-align: center;
    padding: 50px 0 0 0;
    color: #fff;
    z-index: 999;
}
.rkc-delete-confirm, .rkc-delete-cancel {
    display: inline-block;
    vertical-align: top;
    padding: 5px;
    margin: 10px;
    color: white;
    transition: all .2s ease;
    cursor: pointer;
}
.rkc-delete-confirm {
    background-color: #2B7F45;
}
.rkc-delete-cancel {
    background-color: #7F4746;
}
.rkc-delete-confirm:hover {
    background-color: #4CDF78;
}
.rkc-delete-cancel:hover {
    background-color: #FF8E8D;
}
.rkc-error {
  background-color: #a94442;
  color: #e5c6c6;
  border-bottom: 1px solid #e5c6c6;
  border-left: 1px solid #e5c6c6;
}
.rkc-added {
  background-color: #BEEB9F;
  color: #3c5e47;
  border-bottom: 1px solid #79BD8F;
  border-left: 1px solid #79BD8F;
}
.rkc-updated {
  background-color: #31708f;
  color: #eaf0f3;
  border-bottom: 1px solid #224e64;
  border-left: 1px solid #224e64;
}
.rkc-error-notice {
  background-color: #a94442;
  color: #e5c6c6;
  border-bottom: 1px solid #e5c6c6;
  border-left: 1px solid #e5c6c6;
}
#record-response {
  display: none;
  position: absolute;
  opacity: 1;
  width: 100%;
  height: 100%;
  padding: 10px 5px 10px 5px;
  background-color: rgba(255,255,255,1);
  color: #000000;
  text-align: left;
  font-size: 1em;
  z-index: 9999;
}
.rkc-upload-document {
  display: none;
  position: absolute;
  opacity: 1;
  width: 100%;
  height: 100%;
  padding: 10px 5px 10px 5px;
  background-color: rgba(255,255,255,1);
  color: #000000;
  text-align: left;
  font-size: 1em;
  z-index: 99;
}
#record-response textarea, .rkc-upload-document textarea {
    width: 100%;
    min-height: 100px;
    margin: 0 0 5px 0;
}
.modal.fade .modal-dialog {
    -webkit-transform: scale(0.1);
    -moz-transform: scale(0.1);
    -ms-transform: scale(0.1);
    transform: scale(0.1);
    top: 300px;
    opacity: 0;
    -webkit-transition: all 0.3s;
    -moz-transition: all 0.3s;
    transition: all 0.3s;
}

.modal.fade.in .modal-dialog {
    -webkit-transform: scale(1);
    -moz-transform: scale(1);
    -ms-transform: scale(1);
    transform: scale(1);
    -webkit-transform: translate3d(0, -300px, 0);
    transform: translate3d(0, -300px, 0);
    opacity: 1;
}
.to-be-deleted {
    opacity: .4;
    border: 1px solid rgba(255,0,0,.5);
}
.cat-subheader {
    padding: 3px;
    font-size: 12pt;
    margin-top: 10px;
    background-color: #dbe8e5;
}
.custom-backdrop {
    position: fixed;
    display: none;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 98;
    background-color: rgba(0,0,0,.1);
}
.dropzone {
    max-height: 75%;
}
.dropzone-img-actions {
    max-height: 25%;
}
.dropzone-upload-comments {
    border: 0;
    border-bottom: 1px solid #cccccc;
    width: 120px;
    margin: 2px 0 2px 0;
    padding: 5px;
    cursor: text;
    transition: all 0.3s ease;
}
.dropzone-upload-comments:focus {
    box-shadow: none;
    outline: none;
    border: 0;
    border-bottom: 1px solid #a9a9a9;
}
.dropzone .dz-clickable {
    cursor: auto;
}
.dropzone .dz-preview .dz-success-mark, .dropzone .dz-preview .dz-error-mark {
    margin-left: -15px;
    font-size: 2.5em;
    color: #ffffff;
}
.dz-custom-remove {
    z-index: 999;
    cursor: pointer !important;
    font-size: 1.25em;
    color: #cccccc;
}
.dz-custom-remove:hover {
    color: #a9a9a9;
}

/*custom radio button styling*/
#record-response input[type=radio] {
    display: none;
}
#record-response label {
    font-weight: normal;
    margin: 0;
}
input#Ind_approveY + label:before {
    content: "\2714";
    border: 1px solid #a9a9a9;
    border-radius: 50%;
    display: inline-block;
    line-height: 17px;
    margin: -2px 3px 0 0;
    height: 20px;
    width: 20px;
    text-align: center;
    vertical-align: middle;
    font-size: 0;
    transition: font-size ease .2s;
}
input#Ind_approveN + label:before {
    content: "\2718";
    border: 1px solid #a9a9a9;
    border-radius: 50%;
    display: inline-block;
    line-height: 17px;
    margin: -2px 3px 0 0;
    height: 20px;
    width: 20px;
    text-align: center;
    vertical-align: middle;
    font-size: 0;
    transition: all ease .2s;
}
input#Ind_approveY:checked + label:before {
    border: 1px solid #3c763d;
    font-size: 20px;
    color: #3c763d;
}
input#Ind_approveN:checked + label:before {
    border: 1px solid #7F4746;
    font-size: 20px;
    color: #7F4746;
}

.menu-right {
}
@media(max-width: 992px) {
  .menu-right {
  }
}
.menu-right-headline {
    font-size: 1.5em;
    width: 100%;
    margin-bottom: 16px;
    border-bottom: 1px solid #666;
}
.menu-right-buttons {
}
.menu-right-buttons input {
    display: block !important;
    width: 100% !important;
    margin: 0 0 6px 0 !important;
}

@media (max-width:800px) {
    .rkc-cat-wrapper {
        display: block;
        width: 100%;
        margin: 0 0 10px 0;
        min-height: 0;
    }
    .feature-title-text {
        display: block;
        width: 100%;
        margin: 0 0 10px 0;
        text-align: center;
    }
    .feature-create-div {
        display: block;
        width: 100%;
        text-align: center;
    }
}


/*
MOBILE STYLING - portrait
*/
@media (max-width: 400px) {
	.album-container {
		display: block;
		width: 100%;
		margin: 0 0 15px 0;
		border-radius: 0;
		min-height: 0;
		height: auto;
	}
	.album-container img {
		min-width: 100%;
	}
}
/*
MOBILE STYLING - landscape
*/
/*@media only screen and (max-device-width: 700px) {*/
@media (max-width: 700px) {
    /* phones and tablets */
	html, body {
		width: 100%;
		max-width: 100% !important;
		min-width: 100% !important;
		margin-left: 0;
		margin-right: 0;
		margin-top: 0px !important;
		font-size: 80% !important;
		-webkit-box-sizing: border-box;
		-moz-box-sizing: border-box;
		box-sizing: border-box;
	}
	img {
		width: auto !important;
		max-width: 100% !important;
		height: auto !important;
		margin-bottom: 5px;
		margin-right: 0px !important;
		margin-left: 0px !important;
		display: block !important;
	}
	.base-table {
		width: auto;
	}
	colgroup {
		display: none;
	}
	.mobile-header {
		display: block;
		height: 100px;
		min-height: 100px;
		max-height: 100px;
		width: 100%;
		min-width: 100%;
		background: <?php print $hoa_lookfeel["header_bg_color"] ?>;
		font-family: "<?php print $hoa_lookfeel["header_font"] ?>",Arial,san-serif;
		font-size: 14pt;
		font-weight: bold;
		color: <?php print $hoa_lookfeel["header_font_color"] ?>;
	}
	.mobile-header-text {
		height: 100%;
		width: 100%;
		text-align: center;
		padding-top: 7%;
	}
	.headerImage {
		height: 100%;
		min-height: 100%;
		width: 100%;
		background-image: url("<?php print $header_file['src'] ?>");
		background-position: center center;
		background-size: 100% 100%;
		/*background-size: contain;*/
	}

	/*Customizing form items for mobile*/
	.login-regular-ind {
		display: block;
		margin: 10px 0 10px 0;
	}
	.login-regular-ind input[type=text] {
		width: 90%;
	}
	.login-regular-ind input[type=password],.login-regular input[type=submit] {
		width: 90%;
	}
	input[type="submit"] {
		margin: 0 0 0 0;
		display: block;
		width: 90%;
	}
	input[type="button"], input[type="reset"] {
		margin-top: -5px;
		display: block;
		width: 90%;
	}
	.req-form-wrapper {
		margin-left: 0px;
	}
	.req-form-item {
		margin: 5px 0 5px 0;
	}
	.captcha-reload {
		display: none;
	}

	/*General styling*/
	table {
		max-width: 100% !important;
	}
	iframe {
		width: auto !important;
		max-width: 100% !important;
		max-height: 300px !important;
	}
	td.title {
		height: auto;
	}
	.hide-lg-menu, .header-toc, .logo, .toTopRd {
		display: none !important;
	}
	.content_main {
		width: 100%;
		min-width: 100%;
		max-width: 100% !important;
	}
	.mobile-only {
		display: block;
		width: 100%;
		min-width: 100%;
	}
	.mobile-menu {
		display: block;
		width: 100%;
		min-width: 100%;
	}
	.nav-right {
		float: right;
	}
	.navbar {
		width: 100%;
		min-width: 100%;
		margin-bottom: 0;
		padding: 0 5px 0 5px;
	}
	.header {
		width: 100%;
		min-width: 100%;
	}
	input[type=text], select, textarea {
		width: 90% !important;
		max-width: 90% !important;
	}

	/*Classifieds/services mobile styling*/
	.adCategory {
		width: 95%;
	}
	.adCategory a {
		text-decoration: none;
		color: inherit;
	}
	.adMain {
		width: 100%;
		margin-right: 0px;
		margin-left: 0px;
	}
	.adMain img {
		max-width: 90%;
	}
	.adTitle {
		width: 90%;
	}
	#navbar li {
		background-color: #cccccc;
		color: #ffffff;
		display: inline-block;
		margin: 5px;
		padding: 10px 0 10px 0;
		border-radius: 3px;
	}

	/*Customizing bootstrap mobile menu*/
	.navbar-nav {
		margin-top: 7.5px; /*-15px;*/
	}
	.navbar-nav > li > a {
		text-decoration: none;
		color: inherit;;
		border: none;
		margin-bottom: 0px;
		padding-top: 0px;
		padding-bottom: 0px;
	}
	.container-fluid > .navbar-header {
		margin-right: 0px;
		margin-left: 0px;
		width: 100%;
		padding-right: 0px;
		padding-left: 0px;
	}
	.container-fluid > .navbar-collapse {
		margin-right: 0px;
		margin-left: 0px;
		width: 100%;
		padding-right: 15px;
		padding-left: 15px;
	}

/*
PHOTO ALBUM SPECIFIC STYLING - MOBILE
*/
	.modal-open {
		display: block;
		margin: 0 0 10px 0;
		min-width: 100%;
	}
	.modal-lg {
		width: 95%;
		height: 90%;
		margin: 10px auto;
		border-radius: 0;
		box-sizing: border-box;
	}
	.ind-picture-view {
		padding: 0;
		max-width: 100%;
		min-height: 0;
		height: auto;
		max-height: 200px;
	}
	.ind-picture-view img {
		max-height: 200px !important;
	}
	.mobile-only {
		display: inline-block;
	}
	.mobile-row-wrapper {
		position: absolute;
		top: 0;
		width: 100%;
		padding: 3px;
		color: #000000;
		background-color: rgba(255,255,255,.6);
		z-index: 101;
	}
	.left-text {
		display: inline-block;
		text-align: left;
	}
	.mobile-close {
		position: absolute;
		text-align: right;
		top: 0;
		right: 0;
		padding: 5px 5px 5px 0;
	}
	.album-img-background, .col-md-9 {
		display: block !important;
		width: 100% !important;
		height: 100% !important;
	}
	.modal-dialog img {
		text-align: center !important;
		margin: auto !important;
  		position: absolute !important;
  		top: 0; left: 0; bottom: 0; right: 0 !important;
	}
	.album-caption-background, .col-md-3 {
		display: none;
	}
	.album-container {
		display: inline-block;
		margin: 0 15px 15px 0;
		border-radius: 0;
		min-height: 0;
	}
	.album-container img {
		width: 100% !important;
		height: 100% !important;
		max-height: 100% !important;
		max-width: 100% !important;
	}
	.album-headline {
		border-top-right-radius: 0;
		border-top-left-radius: 0;
		font-size: 1.5em;
	}

/*
SEARCH FORMATTING - MOBILE
*/
	.add-margins {
		margin: 10px 0 0 5px;
	}
	.search-icon {
		display: none;
	}

/*
PREVENT ZOOM ON MOBILE DEVICE INPUT FIELDS
ios devices auto zoom on input fields- this sets fontsize to 16px which prevents
*/
	select, textarea, input[type="text"], input[type="password"], input[type="datetime"], input[type="datetime-local"], input[type="date"], input[type="month"], input[type="time"], input[type="week"], input[type="number"], input[type="email"], input[type="url"], input[type="search"], input[type="tel"], input[type="color"] {
		font-size: 16px;
	}
}
-->
</style>

