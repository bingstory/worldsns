<?php if (!defined('THINK_PATH')) exit();?><!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.0 Frameset//EN">
<html>
	<head>
		<title>后台管理</title>
		<meta http-equiv=Content-Type content="text/html; charset=utf-8">
		<meta http-equiv=Pragma content=no-cache>
		<meta http-equiv=Cache-Control content=no-cache>
		<meta http-equiv=Expires content=-1000>
	</head>
	<frameset border=0 frameSpacing=0 rows="50, *" frameBorder=0>
		<frame name=header src="<?php echo U('Admin/admin/header');?>" frameBorder=0 noResize scrolling=no>
			<frameset cols="200, *">
				<frame name=menu src="<?php echo U('Admin/admin/menu');?>" frameBorder=0 noResize>
				<frame name=main src="<?php echo U('Admin/admin/main');?>" frameBorder=0 noResize scrolling=yes>
			</frameset>
	</frameset>
	<noframes>
	</noframes>
</html>