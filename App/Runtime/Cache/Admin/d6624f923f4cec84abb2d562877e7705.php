<?php if (!defined('THINK_PATH')) exit();?><!DOCTYPE html>
<html>

	<head>
		<meta charset="utf-8">
		<title></title>
		<link rel="stylesheet" type="text/css" href="/Public/Admin/Css/header.css" />
		<script type="text/javascript" src="/Public/Admin/Js/tool.js"></script>
	</head>

	<body>
		<div class="header">
			<div class="logo">
				<img src="/Public/Admin/Images/logo2.png" alt="wufu" />
			</div>
			<ul class="header_nav">
				<li><a target="_blank" href="/" class="desktop">网站首页</a></li>
				<!-- <li><a href="javascript:;" class="changePass">修改密码</a></li>
				<li><a href="javascript:frameJumpMain('<?php echo U('Admin/Myinfo/show');?>');" class="info" >个人资料</a></li>
				<li><a href="javascript:;" class="settings">桌面设置</a></li> -->
				<li><a href="javascript:frameJumpParent('<?php echo U('Admin/Login/logout');?>');" class="exit" >退出系统</a></li>
			</ul>
		</div>
		
		<script type="text/javascript">
			function frameJumpMain(url){
				window.parent.main.location.href=url;
			}
			
			function frameJumpParent(url){
				if(confirm('您确定要退出吗?'))
				window.parent.location.href=url;
			}
		</script>
	</body>

</html>