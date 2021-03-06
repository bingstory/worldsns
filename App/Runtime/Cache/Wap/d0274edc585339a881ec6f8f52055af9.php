<?php if (!defined('THINK_PATH')) exit();?><!DOCTYPE HTML>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<meta name="viewport" content="user-scalable=no, initial-scale=1.0, maximum-scale=1.0 minimal-ui"/>
<meta name="apple-mobile-web-app-capable" content="yes"/>
<meta name="apple-mobile-web-app-status-bar-style" content="black">
<link rel="shortcut icon" href="/Public/Wap/Images/favicon.ico" type="Images/x-icon">
<!-- 苹果为了支持网络应用（或者说网页）添加到桌面需要的图标-->
<link rel="apple-touch-icon-precomposed" sizes="114x114" href="products/slideout/images/splash/splash-icon.png">
<link rel="apple-touch-startup-image" href="products/slideout/images/splash/splash-screen.png" 	media="screen and (max-device-width: 320px)" />  
<link rel="apple-touch-startup-image" href="products/slideout/images/splash/splash-screen@2x.png"	media="(max-device-width: 480px) and (-webkit-min-device-pixel-ratio: 2)" /> 
<link rel="apple-touch-startup-image" sizes="640x1096" href="products/slideout/images/splash/splash-screen@3x.png" />
<link rel="apple-touch-startup-image" sizes="1024x748" href="images/splash/splash-screen-ipad-landscape" media="screen and (min-device-width : 481px) and (max-device-width : 1024px) and (orientation : landscape)" />
<link rel="apple-touch-startup-image" sizes="768x1004" href="products/slideout/images/splash/splash-screen-ipad-portrait.png" media="screen and (min-device-width : 481px) and (max-device-width : 1024px) and (orientation : portrait)" />
<link rel="apple-touch-startup-image" sizes="1536x2008" href="products/slideout/images/splash/splash-screen-ipad-portrait-retina.png"   media="(device-width: 768px)	and (orientation: portrait)	and (-webkit-device-pixel-ratio: 2)"/>
<link rel="apple-touch-startup-image" sizes="1496x2048" href="products/slideout/images/splash/splash-screen-ipad-landscape-retina.png"   media="(device-width: 768px)	and (orientation: landscape)	and (-webkit-device-pixel-ratio: 2)"/>

<title><?php echo (L("title")); ?></title>
<meta http-equiv="Expires" content="0">
<meta http-equiv="Pragma" content="no-cache">
<meta http-equiv="Cache-control" content="no-cache">
<meta http-equiv="Cache" content="no-cache">


<link href="/Public/Wap/Css/styles.style.css?123"   rel="stylesheet" type="text/css">
<link href="/Public/Wap/Css/framework.css?12"  rel="stylesheet" type="text/css">
<link href="/Public/Wap/Css/owl.theme.css" rel="stylesheet" type="text/css">
<link href="/Public/Wap/Css/swipebox.css"	 rel="stylesheet" type="text/css">
<link href="/Public/Wap/Css/font-awesome.css"	 rel="stylesheet" type="text/css">
<link href="/Public/Wap/Css/animate.css" rel="stylesheet" type="text/css">
<link href="/Public/Wap/Css/mobiscroll.custom-2.6.2.min.css" rel="stylesheet" type="text/css" />
<script src="//at.alicdn.com/t/font_568042_ah9h8klqe7ncow29.js" type="text/javascript" charset="utf-8" ></script>
<style type="text/css">
    .icon {
       width: 1.6em; height: 1.6em;
       vertical-align: -0.15em;
       fill: currentColor;
       overflow: hidden;
    }
</style>
</head>

<body onLoad="IndexAll()"> 

<!--页面加载中...display:blck;-->
	<div id="preloader" >
		<div id="status">
			<p class="center-text">
				Loading the content...
			</p>
		</div>
	</div>

<!-- 搜索框    点击“右侧，黑色聊天列表顶部的搜索框”出来-->
	<div id="search_txt"  style="display:none;"> 
		<input results="s"type="search" size="30" placeholder="" value="" id="search_inputString" />

		<div id="search_botton" onClick="SearchRecent_Close()">取消</div><!--点击“取消“整个页面关闭，包括”id="search_txt"id="search_div"“-->
	</div>
	<div id="search_div" style="display:none; min-height: 480px;">	<!-- 搜索的 结果 显示-->
		<ul id="search_list">
				
		</ul>
	</div> 
	 
<!--  “左边 黑色的菜单” 黑屏 + “右边的聊天好友”的黑屏 点击按钮，即可显示相应的图层--> 
	<div class="all-elements" style=" min-height:100%;" >		
		<div class="snap-drawers">
			<!-- Left Sidebar--> <!--  “左边 黑色的菜单” 黑屏 -->
			<div class="snap-drawer snap-drawer-left" >
				<div class="sidebar-header" >
					<a href="#" class="sidebar1-close" onClick="PersonalHomepage()">
						<div id="user_photo" class="sidebar-toxiang">
						<!--js写入：用户的“头像”-->
							
						</div>
						<div class="sidebar-xinxi">
							<div class="sidebar-names">
								<div id="user_name" class="sidebar-name">	

								</div>				
								<div id="menu-img-Diamond1">
									
								</div>
							</div>
							<div id="user_golds" class="sidebar-gold">
								
							</div>
						</div>
					</a>
				</div>
				<div class="sidebar-header1">
				   
				</div> 			
				<ul class="sidebar-menu">
					<li>
						<a href="#" class="active-item sidebar1-close" onClick="Upgradepage()">
							<svg class="icon nav-icon" aria-hidden="true">
   			 <use xlink:href="#icon-youxiang"></use>
			</svg>
							<p id="menu_Upgrade">升级</p>
						</a>
					</li>        
					<li>
						<a href="#" class="show-submenu sidebar1-close" onClick="Goldpage()">
									<svg class="icon nav-icon" aria-hidden="true">
   			 <use xlink:href="#icon-zijin"></use>
			</svg>
							<p id="menu_Gold">获取金币</p>
						</a>
					</li> 
					<li>
						<a href="#" class="show-submenu sidebar1-close" onClick="ExpressionShop()">
												<svg class="icon nav-icon" aria-hidden="true">
   			 <use xlink:href="#icon-biaoqing"></use>
			</svg>
							<p id="menu_ExpressionShop">表情帖商店</p>
						</a>             
					</li>               
				</ul>
				<ul class="sidebar-menu">
					<li>
						<a href="#" class="show-submenu sidebar1-close" onClick="OnlineUsers()">
										<svg class="icon" aria-hidden="true">
   			 <use xlink:href="#icon-nvsheng"></use>
			</svg>
							<p id="menu_OnlineUsers">在线好友</p>
						</a>
					</li>
					<li>
						<a href="#" class="show-submenu sidebar1-close" onClick="freshNewsPage()">
										<svg class="icon" aria-hidden="true">
   			 <use xlink:href="#icon-nvsheng"></use>
			</svg>
							<p id="menu_freshNews">新鲜事</p>
						</a>
					</li>				
					<li>
						<a  id="menu_chats_a" href="#" class="show-submenu open-return" >
								<svg class="icon" aria-hidden="true">
   			 <use xlink:href="#icon-nvsheng"></use>
			</svg>
							<p id="menu_chats">聊天</p>
							<div id="interaction_chat" class="interaction_div" style="display: none;">
							</div>
						</a>
					</li> 
					<li>
						<a href="#" class="show-submenu sidebar1-close" onClick="visitingPage()">
									<svg class="icon" aria-hidden="true">
   			 <use xlink:href="#icon-nvsheng"></use>
			</svg>
							<p id="menu_visiting">来访</p>
							
							<div id="interaction_visit" class="interaction_div"><!-- 来访的人数  -->
								<div class="interaction_bg"></div>
							</div>
						</a>            
					</li>
					<li>
						<a href="#" class="show-submenu sidebar1-close" onClick="collectionPage()">
									<svg class="icon" aria-hidden="true">
   			 <use xlink:href="#icon-nvsheng"></use>
			</svg>
							<p id="menu_collection">收藏</p>
						</a>            
					</li>
					<li>
						<a href="#" class="show-submenu sidebar1-close" onClick="GiftBoxPage(1)">
								<svg class="icon" aria-hidden="true">
   			 <use xlink:href="#icon-nvsheng"></use>
			</svg>
							<p id="menu_GiftBox">礼物盒子</p>
							<div id="interaction_gift" class="interaction_div"></div>
						</a>	             
					</li>
				</ul>
				<ul class="sidebar-menu">
					<li>
						<a href="index.html" class="show-submenu sidebar1-close" onClick="encounterPage()">
									<svg class="icon" aria-hidden="true">
   			 <use xlink:href="#icon-nvsheng"></use>
			</svg>
							<p id="menu_encounter">邂逅</p>
						</a>
					</li>        
					<li>
						<a href="#" class="show-submenu sidebar1-close" onClick="LoveEachOtherPage()">
										<svg class="icon" aria-hidden="true">
   			 <use xlink:href="#icon-nvsheng"></use>
			</svg>
							<p id="menu_LoveEachOther">互相喜欢</p>
							<div id="interaction_match" class="interaction_div"></div>
						</a>
					</li> 
					<li>
						<a href="#" class="show-submenu sidebar1-close" onClick="ILikeThePage()">
									<svg class="icon" aria-hidden="true">
   			 <use xlink:href="#icon-nvsheng"></use>
			</svg>
							<p id="menu_ILikeThe">我喜欢的</p>
						</a>	             
					</li>
					<li>
						<a href="#" class="show-submenu sidebar1-close" onClick="LikeMyPage()">
									<svg class="icon" aria-hidden="true">
   			 <use xlink:href="#icon-nvsheng"></use>
			</svg>
							<p id="menu_LikeMy">喜欢我的</p>
							<div id="interaction_passive" class="interaction_div"></div>
						</a>					             
					</li>
				</ul>
				<ul class="sidebar-menu">
					<li>
						<a href="index.html" class="show-submenu sidebar1-close" onClick="Setting()">
									<svg class="icon " aria-hidden="true">
   			 <use xlink:href="#icon-nvsheng"></use>
			</svg>
							<p id="menu_Setting">设置</p>
						</a>
					</li>                  
				</ul>          
			</div>
			<!--  “左边 黑色的菜单” 黑屏          结束-->
			
			<!-- Right Sidebar  -  “右边 黑色的菜单” 黑屏   开始  -->
			<div class="snap-drawer snap-drawer-right">
				<div class="sidebar-header-right">
					<div id="imnews">
						<!-- 最近联系人 -->
					</div>
					<div class="search-input" ><!-- 点击后，跳到”searchpage.html"-->
						<div class="homepage_div_img">
							<input type="text" oninput="searchContant()" id="search-contant">
						</div>
						<!--<div id="inputString">搜索</div>-->   
					</div>
					<div id="gengduo-right">
						
					</div>
				</div>
				
				<div class="sidebar-header-right1">
				   
				</div> 	
				
				<div id="Recent_Contact" class="sidebar-right-user-list">  

				</div>			
			</div>
			<!-- 右边的黑屏”“结束-->
		</div>
	</div>
<!--  “左边 黑色的菜单” 黑屏 + “右边的聊天好友”的黑屏- 整个”黑屏“层 结束--> 
	
<!-- Page Content--><!--  主要的   内容展示区域 -点击左侧的按钮”id="content" - -transform: translate3d(266px, 0px, 0px);“-->
    <div id="content" class="snap-content">
	
		<!-- 页面的第一部分："页面的标题"： “ 左、右图标，和 显示的标题"-->
		<div class="homepage-header"> <!--  头部的  各种  按钮、图标 -->
			<a href="#" id="open-nav" class="open-nav"><!-- 左上角  横线“返回”图标-->
				<img src="/Public/Wap/Images/menu.png" class="homepage-img" />
			</a>
			<a href="#" id="open-nav1" class="open-nav" style="display: none;"> <!-- 左上角  向左的箭头 < “返回”图标-->
				<img src="/Public/Wap/Images/back.png" class="homepage-img" />
			</a>
			<a href="#" id="open-nav2" class="open-return" style="display:none;" onClick="PersonalHomepage()">
				<!-- 个人主页  的“点击” -->
				<img src="/Public/Wap/Images/back.png" class="homepage-img" />	  <!-- 左上角  向左的箭头 < “返回”图标-->
			</a>
			<a href="#" id="open-nav3" class="open-return" style="display: none;" onClick="PhotoAlbumPage()">
				<!-- 相册  的  “点击” -->
				<img src="/Public/Wap/Images/back.png" class="homepage-img" />	<!-- 左上角  向左的箭头 < “返回”图标-->
			</a>
			<a href="#" id="open-return" class="open-return"  style="display: none;" onClick="ExpressionShop()"><!-- 表情帖 -->
				<img src="/Public/Wap/Images/back.png" class="homepage-img" />	<!-- 左上角  向左的箭头 < “返回”图标-->
			</a>
			
			<a href="#" id="open-socials" class="open-socials">
			<!-- 右上上角  显示 聊天 的  “点点”图标-->
				<img src="/Public/Wap/Images/chat.png" class="homepage-img" />
				<div class="Chatshu-style" id="chat_shu" style="display:block;">
					<!-- 2  display:block: 表示现在有2 条消息-->
				</div>
			</a>    
			<a href="#" id="open-encounter" class="open-socials1" style="display: none;" onClick="ILikeThePage()"><!-- 右上上角  显示我喜欢的人  “心形”图标-->
				<img src="/Public/Wap/Images/encounter.png" class="homepage-img1" />
			</a>
			<a href="#" id="open-freshNewsadd" class="open-socials1" style="display:none;" onClick="freshNewsAdd()">
				<!-- 增加图片 “+”图标-->
				<img src="/Public/Wap/Images/addphoto.png" class="homepage-img1" />
			</a>
			<a href="#" id="open-PhotoAlbum" class="open-socials1" style="display: none;" onClick="PhotoAlbumAddPage()">
				<!-- 增加 “相册” 图片 “+”图标-->
				<img src="/Public/Wap/Images/addphoto.png" class="homepage-img1">
			</a>
			
			<a href="#" id="open-nav4" class="open-return" style="display: none;" onClick="freshNewsPage()"></a>
			<a href="#" id="freshNewsAdd" class="open-socials1" style="display: none;" onClick="freshNewsRelease()">
				<!-- 新鲜事 添加-->
			</a>
			
			<!-- 左上角  向左的箭头 < “返回”图标    以下好几条都是  开始-->
			<a href="#" id="cloce-visiting-gift" class="open-return" style="display: none;" onClick="visitingPage()"> 
				<img src="/Public/Wap/Images/back.png" class="homepage-img">
			</a>
			<a href="#" id="cloce-collection-gift" class="open-return" style="display: none;" onClick="collectionPage()">
				<img src="/Public/Wap/Images/back.png" class="homepage-img">
			</a>
			<a href="#" id="cloce-LoveEachOther-gift" class="open-return" style="display: none;" onClick="LoveEachOtherPage()">
				<img src="/Public/Wap/Images/back.png" class="homepage-img">
			</a>
			<a href="#" id="cloce-ILikeThe-gift" class="open-return" style="display: none;" onClick="ILikeThePage()">
				<img src="/Public/Wap/Images/back.png" class="homepage-img">
			</a>
			<a href="#" id="cloce-LikeMy-gift" class="open-return" style="display: none;" onClick="LikeMyPage()">
				<img src="/Public/Wap/Images/back.png" class="homepage-img">
			</a>
			<a href="#" id="PersonalfriendHome" class="open-return" style="display: none;" onClick="PersonalfriendHome()">
				<!-- “他人的页面” -->
				<img src="/Public/Wap/Images/back.png" class="homepage-img">
			</a>
			<a href="#" id="PersonalfriendA" class="open-return" style="display: none;" onClick="PersonalfriendA()">
				<img src="/Public/Wap/Images/back.png" class="homepage-img">
			</a>
			<a href="#" id="PhotoHomes" class="open-return" style="display: none;" onClick="PhotoHome()"><!-- 相册照片 -->
				<img src="/Public/Wap/Images/back.png" class="homepage-img">
			</a>
			<a href="#" id="cloce-gift1" class="open-return" style="display: none;" onClick="SendGiftmenu('virtual',0,'all',0)">
				<img src="/Public/Wap/Images/back.png" class="homepage-img">
			</a>
			<a href="#" id="cloce-gift2" class="open-return" style="display: none;" onClick="SendGiftmenu('real','real','real',0)">
				<img src="/Public/Wap/Images/back.png" class="homepage-img">
			</a>
			<!-- 左上角  向左的箭头 < “返回”图标    上下好几条都是  结束-->
			
			
			<a href="#" id="RealGifts" class="open-socials1" style="display: none;" onClick="SendGiftmenu('real','real','real',0)"></a>						
			<a href="#" id="personal_ok" class="open-socialss" style="display: none;" onClick="personalContentAdd()"></a>
				
			<a href="#" id="open-search-back" class="open-return" style="display: none;" onClick="OnlineUsers()"><!-- 左上角  向左的箭头 < “返回”图标  -->
				<img src="/Public/Wap/Images/back.png" class="homepage-img">
			</a>
			
			<a href="#" id="search-ok" class="open-socialss" style="display: none;" onClick="searchoks()"><!-- 右上角显示“完成”-->
				
			</a>
			<a href="index.php?m=Wap&c=Searchpage&a=index" id="open-search-two" class="open-return" style="display:none;" target="searchpage" ><!-- 左上角  向左的箭头 < “返回”图标  -->
				<img src="/Public/Wap/Images/back.png" class="homepage-img">
			</a>
		   
			<em id="header_top_title">
			<!--  标题  --> <!-- JS 来改变 标题  -->
				<!--变量"Onlineuserss"de值：在线用户-->
			</em>
			<em id="header_top_title1">
				<!--  标题  -->
			</em>	
		</div>
			<!--标题”礼物“  de 下拉菜单。  点击”三角形“，展开在页面上 -->
		<em id="header_top_title_gift" style="display: none;"> 
			<dd id="0" style="border-top: 0px;" onClick="SendGiftmenu('virtual',0,'all',0)" >全部</dd>
			<?php if(is_array($giftCate)): foreach($giftCate as $key=>$row): ?><dd id="<?php echo ($row['id']); ?>" onClick="SendGiftmenu('virtual',<?php echo ($row['id']); ?>,'<?php echo ($row['name']); ?>',0)"><?php echo ($row['name']); ?></dd><?php endforeach; endif; ?>		
		</em>
	<!-- 页面的第一部分：“ 左、右图标，和 显示的标题" 结束-->
		
	<!-- 页面的第 2 部 分： 推荐墙 -->
	   <div id="Recommended_wall" class="slider-container full-bottom" data-snap-ignore="true" >         
            <div id="User_phont_Add" class="tuijianqingadd">         	
			</div>
			<div class="tuijianqingadd1" onClick="RecommendedWalladd()">
				<img  src="/Public/Wap/Images/alila/spotlightadd.png" class="female_add1" />
			</div>
			
			<!-- 图片墙   go  -->
			<div id="slider1_container" style="position: relative; top: 0px; left: 0px; width: 600px; height: 85px; overflow: hidden;">
				<!-- Loading Screen -->
				<!-- Slides Container -->	
				<div id="slider1_container1" u="slides" style="cursor: move; position: absolute; left: 0px; top: 0px; width: 600px; height: 85px; overflow: hidden;">
					
				</div>	
				<!-- Arrow Navigator Skin Begin -->

				<!-- Arrow Left -->

				<!-- Arrow Navigator Skin End -->
				
				<!-- Thumbnail Navigator Skin Begin -->
				<div id="slider1_container2" u="thumbnavigator" class="jssort01" style="position: absolute; width: 600px; height: 85px; left:0px; bottom: 0px;">
					<!-- Thumbnail Item Skin Begin -->
					<style>
						/* jssor slider thumbnail navigator skin 01 css */
						/*
						.jssort01 .p           (normal)
						.jssort01 .p:hover     (normal mouseover)
						.jssort01 .pav           (active)
						.jssort01 .pav:hover     (active mouseover)
						.jssort01 .pdn           (mousedown)
						*/
						.jssort01 .w {
							position: absolute;
							top: 0px;
							left: 0px;
							width: 100%;
							height: 100%;
						}

						.jssort01 .c {
							position: absolute;
							top: 0px;
							left: 0px;
							width: 78px;
							height: 78px;
						 
						}

						.jssort01 .p:hover .c, .jssort01 .pav:hover .c, .jssort01 .pav .c {
							border-width: 0px;
							top: 2px;
							left: 2px;
							width: 78px;
							height: 78px;
						}

						.jssort01 .p:hover .c, .jssort01 .pav:hover .c {
							top: 0px;
							left: 0px;
							width: 80px;
							height: 80px;
						}
					</style>
					<div u="slides" style="cursor: move;">
						<div u="prototype" class="p" style="position: absolute; width: 80px; height: 80px; top: 0; left: 0;">
							<div class=w>
								<div id="slider1_container3" u="thumbnailtemplate" style=" width: 85px; height: 85px; border: none;position:absolute; top: 0; left: 0;">
								
								</div>
							</div>                
						</div>
					</div>
				<!-- Thumbnail Item Skin End -->
				</div>
			<!-- Thumbnail Navigator Skin End -->
			</div>
		<!-- 图片墙   over  -->			   	
    	</div>
<!--添加推荐墙的  弹出框 -->		
	<div id="Recommended_wall_bg" class="ExitAccount_style"  style="display: none;" onClick="Recommendedcancel()">
	</div>
	<div id="Recommended_wall_div"  style="display: none;">
		<div id="Recommended_wall_content" class='ExitAccount-top'>
		</div>
		<div class='ExitAccount-botton'>
			<div id="Recommended_wall_3" class='ExitAccount_left' onClick="Recommendedcancel()">
				<!-- 取消 -->
			</div>
			<div id="Recommended_wall_4" class='ExitAccount_right' onClick="RecommendedAdd()">
				<!-- 确定 -->
			</div>
		</div>
	</div>

	<div id="Recommended_wall_bg2" class="ExitAccount_style" style="display: none;" onClick="Recommendedcancel2()">
	</div>
	<div id="Recommended_wall_div2"  style="display: none;">	
		<div id="Recommended_wall_content2" class='ExitAccount-top'>
		</div>
		<div class='ExitAccount-botton'>
			<div id="Recommended_wall_32" class='ExitAccount_left' onClick="Recommendedcancel2()">
			</div>
			<div id="Recommended_wall_42" class='ExitAccount_right'>
			</div>
		</div>
	</div>
<!-- 头部 “照片墙” 下来的 “搜索框” --> 
	<!-- 搜索 -->  		 
	<div id="search" class="sousuo"  style="display:block;">
		<div class="sousuo_left" >
			<a href="index.php?m=Wap&c=Searchpage&a=index" target="searchpage">
				<div class="search-nav">
					<div class="homepage_div">
						<img src="/Public/Wap/Images/search.png" class="homepage-search" />
					</div>
					<div class="search_font" id="search_text">搜索</div>
				</div>
			</a>
		</div>
		
		<div class="lest_right" >
			<!-- 对应着<div id="zaixian">的  block；  “一条一条”好友列表-->
			<a href="#" hidefocus="true"  class="lest-nav" id="user-lest" onClick="lineandbord(1)">	
				<img src="/Public/Wap/Images/list.png" class="homepage-lest" />
			</a>
			<!-- 对应着<div id="zaixianbord">的  block；  “简单的头像排列”的好友列表-->
			<a href="#" hidefocus="true" class="lest-nav" id="user-bord"  onClick="lineandbord(2)"  style="display: none;">
				<img src="/Public/Wap/Images/bord.png" class="homepage-lest" />
			</a>
		</div>
	</div>
	
	
<!-- ”搜索框“ 之下的 ”在线好友“的 两种排列方式：-->
	<!--- 在线用户 -->
	
	<!-- 好友列表排列方式之一：长长的 ”列排列“ -->
	<div id="zaixian"  style="display:block; height: 312px;">	
		<div id="Onlinelist" style="display:block;">
		
		</div>
		<!--- 点击“更多”， js控制 继续 导入 数据-  -->
		<!--默认先显示20为好友，点击“更多”，继续显示20位依次进行，但当点击2次后，第3次点击时，当点击第3次时，就弹出“升级”提示框-->
		<div  id="Onlinelist_submit" class="gengduo" style="display:block;">
			<input type="submit" tabindex="3" id="submit" value="更多" onClick="OnlineUsersList()" class="s_btn s_btn_d">	
		</div>
	</div> 
	
	<!-- 好友列表的  另一种排列方式  “精简的方阵”排列-与上一排列 不同时出现-->	  
	<div id="zaixianbord" style="display:none; height: 312px;">
		<div id="Onlinebord" >	
		</div>
		<div  id="Onlinelist_submit1" class="gengduo">  
			<input type="submit" tabindex="3" id="submit1" value="更多" onClick="OnlineUsersList()" class="s_btn s_btn_d">
		</div>
	</div>
		
	<!--- 搜索页面 --><!--加入src：   ，并且 display: block;"-->
	<iframe id="searchpage" class="page_content" src="" name="searchpage" scrolling="auto" frameborder="0" allowtransparency="yes"   style="width:100%;display:none;">
		
	</iframe>
		
	<!--- 个人主页 --> <!-- 个人资料  像空间一样的主页 -->
	<div id="personal_homepage" class="page_content" style="display: none;" >
		<!-- 第一部分  轮播图 -->
		<div id="home_slider" class="flexslider" data-snap-ignore="true">
			<!--  相册里照片的  “轮播图‘” -->
			<div style="overflow: hidden; position: relative;" class="flex-viewport"> 
				
			</div>
			<ol class="flex-control-nav flex-control-paging">
				<li><a class="flex-active">1</a></li>
				<li><a>2</a></li>
				<li><a>3</a></li>
				<li><a>4</a></li>
				<li><a>5</a></li>
			</ol>
			<ul class="flex-direction-nav">
				<!-- 轮播里的  上一张-->
				<li><a class="flex-prev" href="#">Previous</a></li>
				<!-- 轮播里的  下一张-->
				<li><a class="flex-next" href="#">Next</a></li>
			</ul>
		</div>
		
		<!-- 主页的 第二部分-->
		<div class="User-personal_homepage"> 
			<!-- 用户的  头像  圆图--> 
			<div id="Head-portrait" class="Head-portrait">	
				 <img src="" onerror="javascript:this.src='/Public/Wap/Images/alila/male.png'" class="homepage-content-imgx" />
			</div>
			<!-- 主页的  ”左侧“ 用户姓名  和  头像-->
			<div class="Head-name">				
				<div id="Head-name" class="Head-name1"></div>
				<div id="per-img-Diamon" >		<!-- 蓝色的  钻石 图标-->
					<img src="/Public/Wap/Images/Diamond1.png" class="Head-img-Diamond1" />
				</div>
			</div>
			<!-- 主页的  ”右侧“ 用户的相册 -->
			<div class="img_Albumnumber">		
				<img src="/Public/Wap/Images/Albumnumber.png" class="menu-img-xiangji"> <!-- "照相机" 小图标，不能点击-->
				<div id="Head-tupianshuliang" class="Head-xiangceshu"></div>
			</div>
		</div>
		
		<!-- 主页的 第 三 部分： 导航栏，菜单切换-->
		<div class="personal_1">		
			<div id="personal_album" class="personal_album personal_style"  onclick="PhotoAlbumPage()">
				相册
			</div>
			<a href='index.php?m=Wap&c=Headportrait&a=index' target='HeadPortrait' class="personal_collection personal_style" onClick="HeadPortraitPage()">
				<div id="personal_collection" >
					修改头像
				</div>
			</a>
			<div id="personal_gift" class="personal_gift personal_style" onClick="GiftBoxPage()">
				礼物
			</div>
			<div class="personal_chat_background">
				<a href='index.php?m=Wap&c=Upload&a=index' class="UploadPictures_a" target='Photo_Add_homepage'>
					<div id="personal_chat" class="personal_chat">
						上传照片
					</div>
				</a>
			</div>
		</div>
		
		<!-- 主页的 第 四 部分： 二级 导航栏，菜单切换-->
		<div class="per_botton_style">
			<div style="border-bottom: 1px solid rgb(1, 124, 203);" id="per_left_abount" onClick="Personalbottonabount()">
				关于<!-- 点击之后，增加css：border-bottom: 1px solid rgb(1, 124, 203);即：蓝色的横线： -->
			</div>
			<div style="border-bottom: 1px solid rgb(230, 230, 230);" id="per_right_freshNews" onClick="PersonalbottonfreshNews()">
				新鲜事
			</div>
		</div>
		
		<!-- ‘新鲜事’de  页面  -->
		<div id="per_freshNews" style="display: none;">
			
			<div id="per_freshNews_list">
			<!--   导入数据 - 开始-->
			<!--  最后一次动态   发布 -->
			
			</div>
			<div id="per_freshNews_submit" class="gengduo">
				<input type="submit" tabindex="3" id="submit" value="更多" onClick="PersonalfreshNewsList()" class="s_btn s_btn_d">
			</div>
		</div>
		
		<!-- ‘关于’ de  页面  -->	
		<div id="per_personal_data" style="display: none;"> 
			<div class="per-title">
				<p id="per_abount_title">关于自己</p>
			</div>
			<div class="per-content">
				<p style="color: rgb(60, 60, 60);" id="per_about" onClick="personalContent('about')"></p>
			</div>
			<div class="per-title">
				<p id="TheBasicInformation">基本信息</p>
			</div>
			<div class="per-content">
				<div id="gender" class="per-left">
					性别
				</div>
				<div class="per-right" id="per_gender">
					
				</div>
			</div>
			<div class="per-content" onClick="personalContent('birthday')">
				<div id="birthday" class="per-left">
					生日
				</div>
				<div class="per-right" id="per_age">
					
				</div>
			</div>
			<div class="per-content" onClick="personalContent('language')">
				<div id="language" class="per-left">
					语言
				</div>
				<div class="per-right" id="per_language">
					
				</div>
			</div>
			<div class="per-content" onClick="personalContent('weight')">
				<div id="weight" class="per-left">体重</div>
				<div class="per-right" id="per_weight"></div>
			</div>
			<div class="per-content" onClick="personalContent('height')">
				<div id="height" class="per-left">身高</div>
				<div class="per-right" id="per_height"></div>
			</div>
			<div class="per-title">
				<p id="AffectionIsIntroduced">感情介绍</p>
			</div>
			<div class="per-content" onClick="personalContent('sexuality')">
				<div id="sexuality" class="per-left">性取向</div>
				<div class="per-right" id="per_sexuality"></div>
			</div>
			<div class="per-content" onClick="personalContent('relationship')">
				<div id="relationship" class="per-left">感情状态</div>
				<div class="per-right" id="per_relationship"></div>
			</div>
			<div class="per-title">
				<p id="GeographicalPosition">地理位置</p>
			</div>
			<div class="per-content" onClick="personalContent('country')">
				<div id="country" class="per-left">国家</div>
				<div class="per-right" id="per_country"></div>
			</div>
			<div class="per-content" onClick="personalContent('city')">
				<div id="city" class="per-left">城市</div>
				<div class="per-right" id="per_city"></div>
			</div>
			<div class="per-title">
				<p id="EducationAndWork">教育/工作</p>
			</div>
			<div class="per-content" onClick="personalContent('education')">
				<div id="education" class="per-left">教育</div>
				<div class="per-right" id="per_education"></div>
			</div>
			<div class="per-content" onClick="personalContent('work')">
				<div id="work" class="per-left">工作</div>
				<div class="per-right" id="per_work"></div>
			</div>
			<div class="per-content" onClick="personalContent('income')">
				<div id="income" class="per-left">收入</div>
				<div class="per-right" id="per_income"></div>
			</div>
		</div>
		<script type="text/javascript" src="/Public/Wap/Js/jquery.js"></script>
		<script type="text/javascript" src="/Public/Wap/Js/jquery.flexslider-min.js" ></script>	
	</div>
	
	<!--- 个人主页修改资料 -->

	<!--点击 “语言” 之后，切换到这个页面，其他页面均关闭-->
	<div id="personal_content_add_lang" class="page_content" style=" height: 430px;display: none;">
		<div class="language_name_list" id="zh">中文简体</div>
		<div class="language_name_list" id="zh-TW">中文繁体</div>
		<div class="language_name_list" id="en">English</div>
		<div class="language_name_list" id="ja">日本語</div>
		<div class="language_name_list" id="ko">韩国</div>
		<div class="language_name_list" id="de">Deutsch</div>
		<div class="language_name_list" id="es">Español</div>
		<div class="language_name_list" id="fr">Français</div>
		<div class="language_name_list" id="it">Italiano</div>
		<div class="language_name_list" id="nl">Nederlands</div>
		<div class="language_name_list" id="pt">Português</div>
		<div class="language_name_list" id="ru">Русский</div>
	</div>
		
	<!--点击 “体重” 之后，切换到这个页面，其他页面均关闭-->
	<div id="personal_content_add_weight" class="page_content" style="display: none; height: 430px;">
		<div class="language_name_list" id="0">不足 40 kg (88 pounds)</div>
		<div class="language_name_list" id="1">41 - 50 kg (90 - 110 pounds)</div>
		<div class="language_name_list" id="2">51 - 60 kg (111 - 132 pounds)</div>
		<div class="language_name_list" id="3">61 - 70 kg (133 - 155 pounds)</div>
		<div class="language_name_list" id="4">71 - 80 kg (156 - 176 pounds)</div>
		<div class="language_name_list" id="5">81 - 90 kg (177 - 199 pounds)</div>
		<div class="language_name_list" id="6">91 - 100 kg (200 - 220 pounds)</div>
		<div class="language_name_list" id="7">超过 100 kg (220 pounds)</div>
	</div>
		
	<!--点击 “身高” 之后，切换到这个页面，其他页面均关闭-->
	<div id="personal_content_add_height" class="page_content" style="display:none; height: 430px;">
		<div class="language_name_list" id="0">低于 150 cm (5'0')</div>
		<div class="language_name_list" id="1">151 - 160 cm (5'0' - 5'2')</div>
		<div class="language_name_list" id="2">161 - 170 cm (5'2' - 5'6')</div>
		<div class="language_name_list" id="3">171 - 180 cm (5'6' - 5'9')</div>
		<div class="language_name_list" id="4">181 - 190 cm (5'9' - 6'2')</div>
		<div class="language_name_list" id="5">高于191 cm (6'2')</div>
	</div>
		
	<!--点击 “性取向” 之后，切换到这个页面，其他页面均关闭-->
	<div id="personal_content_add_sex" class="page_content" style="display:none; height: 430px;">
		<div class="language_name_list" id="0">异性</div>
		<div class="language_name_list" id="1">开放</div>
		<div class="language_name_list" id="2">双性</div>
		<div class="language_name_list" id="3">同性</div>
	</div>
		
	<!--点击 “感情状态” 之后，切换到这个页面，其他页面均关闭-->
	<div id="personal_content_add_love" class="page_content" style="display:none; height: 430px;">
		<div class="language_name_list" id="0">单身</div>
		<div class="language_name_list" id="1">恋爱中</div>
		<div class="language_name_list" id="2">订婚</div>
		<div class="language_name_list" id="3">已婚</div>
		<div class="language_name_list" id="4">不好说</div>
		<div class="language_name_list" id="5">开放式的交往方式</div>
		<div class="language_name_list" id="6">丧偶</div>
		<div class="language_name_list" id="7">分居</div>
		<div class="language_name_list" id="8">离婚</div>
		<div class="language_name_list" id="9">同性伴侣</div>
	</div>
		
	<!--点击 “教育” 之后，切换到这个页面，其他页面均关闭-->
	<div id="personal_content_add_edu" class="page_content" style="display:none; height: 430px;">
		<div class="language_name_list" id="0">中小学</div>
		<div class="language_name_list" id="1">专科/技校</div>
		<div class="language_name_list" id="2">学院/大学</div>
		<div class="language_name_list" id="3">更高学位</div>
	</div>

	
	<!--点击 “收入” 之后，切换到这个页面，其他页面均关闭-->
	<div id="personal_content_add" class="page_content" style="display: none; height: 430px;">
		
	</div>
		
	<!--- 修改头像 -->
	<iframe id="HeadPortrait" class="page_content" name="HeadPortrait" scrolling="auto" frameborder="0" allowtransparency="yes"   style="width:100%;display: none;">
	</iframe>
	
	<!-- 修改“生日”-->
	<iframe id="personal_content_homepage" class="page_content" src="index.php?m=Wap&c=Birthday&a=index" name="personal_homepage" scrolling="auto" frameborder="0" allowtransparency="yes"   style="width:100%;display: none;">
	<!--  可以加入：修改“生日”的页面-->
	</iframe>
		
	<!--- 相册 -->	
	<div id="PhotoAlbum_homepage" class="page_content" style="display: none; height: 432px;">
			
	</div>
	
	<!--- 添加相册 -->
	<div id="PhotoAlbumAdd_homepage" class="page_content" style="display:none;" >
		<div class="album_page">
			<div class="album_input">
				<input id="album" name="album" placeholder="创建相册" type="text">
			</div>
			<input name="submit" tabindex="3" id="PhotoAlbumAdd_input" value="创建相册" onClick="PhotoAlbumAdd()" class="album_input_style" type="submit">		
		</div>		
	</div>
	
	<!--- 照片 -->
	<iframe id="Photo_homepage" class="page_content"  name="Photo_homepage" scrolling="auto" frameborder="0" allowtransparency="yes"   style="width:100%;display:none;">
	</iframe>
	
	<!--- 照片添加 -->
	<iframe id="Photo_Add_homepage" class="page_content" name="Photo_Add_homepage" scrolling="auto" frameborder="0" allowtransparency="yes"   style="width:100%;display: none;">
	</iframe>
		
	<!--- 升级 -->
	<div id="Upgrade_homepage"  class="page_content" style="display:none;">
		<!-- 一： 关于“会员特权”的说明、介绍 -->	
		<div class="upgrade-synopsis">
			<div id="upgrade-title">
				会员专享
			</div>
			<div class="upgrade-content">
				<div class="upgrade-content-img">
					<img src="/Public/Wap/Images/languageselect.png" style="width: 25px;">
				</div>
				<div id="upgrade-content-1" class="upgrade-content-style">
					和你感兴趣的人联系
				</div>
			</div>
			<div class="upgrade-content">
				<div class="upgrade-content-img">
					<img src="/Public/Wap/Images/languageselect.png" style="width: 25px;">
				</div>
				<div id="upgrade-content-2" class="upgrade-content-style">
					发送 and 接收无限制会员信息
				</div>
			</div>
			<div class="upgrade-content">
				<div class="upgrade-content-img">
					<img src="/Public/Wap/Images/languageselect.png" style="width: 25px;">
				</div>
				<div id="upgrade-content-3" class="upgrade-content-style">
					得到异性会员的关注
				</div>
			</div>
		</div>
			  
		<!-- 二： 选中“充值的金额” - 之后跳到支付的页面，支付-->	
		<div class="upgrade-title-style">
			<div class="upgrade-content-img">
				<img src="/Public/Wap/Images/Diamond1.png" style="width: 25px;">
			</div>
			<div id="upgrade-Blue-diamond" class="upgrade-content-style">
				升级成钻石用户
			</div>
		</div>
		<div id="upgrade_Blue_diamond">
			<div class="upgrade-border" onClick="upgradeopen('150','u',1,12)">
				<div class="upgrade-border1">$12.5/<sapn class='up-month'>月</sapn></div>
				<div class="upgrade-border2">150$/<sapn class='up-year'>年</sapn></div>
				<div class="upgrade-border3"><sapn class='up-save'>节省</sapn><br><span style="color:red">37.5%</span></div>
			</div>
			<div class="upgrade-border" onClick="upgradeopen('90','u',1,6)">
				<div class="upgrade-border1">$15.0/<sapn class='up-month'>月</sapn></div>
				<div class="upgrade-border2">90$/6<sapn class='up-month'>月</sapn></div>
				<div class="upgrade-border3"><sapn class='up-save'>节省</sapn><br><span style="color:red">25%</span></div>
			</div>
			<div class="upgrade-border" onClick="upgradeopen('50','u',1,3)">
				<div class="upgrade-border1">$16.6/<sapn class='up-month'>月</sapn></div>
				<div class="upgrade-border2">50$/3<sapn class='up-month'>月</sapn></div>
				<div class="upgrade-border3"><sapn class='up-save'>节省</sapn><br><span style="color:red">16.7%</span></div>
			</div>
			<div class="upgrade-border" onClick="upgradeopen('20','u',1,1)">
				<div class="upgrade-border1">$20.0/<sapn class='up-month'>月</sapn></div>
				<div class="upgrade-border2">20$/1<sapn class='up-month'>月</sapn></div>
				<div class="upgrade-border3"></div>
			</div>	
		</div>
		
		<div class="upgrade-title-style">
			<div class="upgrade-content-img">
				<img src="/Public/Wap/Images/crown2.png" style="width: 25px;">
			</div>
			<div id="upgrade-crown" class="upgrade-content-style">
				升级成皇冠用户
			</div>
		</div>
		<div id="upgrade_crown">
			<div class="upgrade-border" onClick="upgradeopen('749','u',2,12)">
				<div class="upgrade-border1">$62.42/<sapn class='up-month'>月</sapn></div>
				<div class="upgrade-border2">749$/<sapn class='up-year'>年</sapn></div>
				<div class="upgrade-border3"><sapn class='up-save'>节省</sapn><br><span style="color:red">36.9%</span></div>
			</div>
			<div class="upgrade-border" onClick="upgradeopen('499','u',2,6)">
				<div class="upgrade-border1">$74.83/<sapn class='up-month'>月</sapn></div>
				<div class="upgrade-border2">499$/6<sapn class='up-month'>月</sapn></div>
				<div class="upgrade-border3"><sapn class='up-save'>节省</sapn><br><span style="color:red">24.4%</span></div>
			</div>
			<div class="upgrade-border" onClick="upgradeopen('249','u',2,3)">
				<div class="upgrade-border1">$83.0/<sapn class='up-month'>月</sapn></div>
				<div class="upgrade-border2">249$/3<sapn class='up-month'>月</sapn></div>
				<div class="upgrade-border3"><sapn class='up-save'>节省</sapn><br><span style="color:red">16.2%</span></div>
			</div>
			<div class="upgrade-border" onClick="upgradeopen('99','u',2,1)">
				<div class="upgrade-border1">$99.0/<sapn class='up-month'>月</sapn></div>
				<div class="upgrade-border2">99$/1<sapn class='up-month'>月</sapn></div>
				<div class="upgrade-border3"></div>
			</div>
		</div>	
	</div>
		
	<!--开关：  关闭 “升级”的 div-->
	<div id="goldbg"  style="display: none;" onClick="upgradeclose()"></div>
	
	<!--   支付的  弹出  框   -->
	<div id="upgrade_button" style="display:none;">
		<div id="upgrade_name">
			支付方式
		</div>
		
			<!--  支付宝的  -->
		<div id="Paypal" onClick="Paypalbotton()">
			<div class="pay_img">
				<div id="Paypal1" class="alipay_img" style="display:none;">
					<img src="/Public/Wap/Images/languageselect.png" class="ali_class_imgs">
				</div>
			</div>
			<div class="alipay_class">
				<img src="/Public/Wap/Images/paypal.png" class="ali_class_img">
			</div>
		</div>
		
			<!--  其他  支付的  -->
		<!--<div id="alipay" onClick="alipaybotton()" >
			<div class="pay_img">
				<div id="alipay1" class="alipay_img" style="display:none">
					<img src="/Public/Wap/Images/languageselect.png" class="ali_class_imgs">
				</div>
			</div>
			<div class="alipay_class">
				<img src="/Public/Wap/Images/zhifu.jpg.png" class="ali_class_img">
			</div>
		</div>-->	
		<form id="formtest" method="post" action="index.php?m=Wap&c=Pay&a=order" style="display:none;">
			<input type="hidden" id="membership0" name="level" value="0" />
			<input type="hidden" id="income0" name="income" value="" />
			<input type="hidden" id="type" name="type" value="u" />
			<input type="hidden" id="month0" name="month" value="0" />
			<input type="hidden" id="customId" name="customId" value="" />
			<input type="hidden" id="payment" name="way" value="0" />
			<div id="dialog_pay_upgrade_btn_0" class="dialog_pay_panel_pay_way_send dialog_pay_panel_pay_way_send_hover">
				<input type="submit" tabindex="3" id="upgradep_r_su" value="立即升级" class="s_btn s_btn_d"  />
			</div>
		</form>
		<form id="formtest1" action="index.php?m=Wap&c=Order&a=create" method="post" style="display:none;">
			<input type="hidden" id="membership1" name="level" value="0" />
			<input type="hidden" id="income1" name="income" value="20" />
			<input type="hidden" id="type1" name="type" value="u" />
			<input type="hidden" id="month1" name="month" value="0" />
			<input type="hidden" id="customId1" name="customId" value="" />
			<input type="hidden" id="payment1" name="way" value="1" />
			<div id="dialog_pay_upgrade_btn_1" class="dialog_pay_panel_pay_way_send dialog_pay_panel_pay_way_send_hover">
				<input type="submit" tabindex="3" id="upgradea_r_su" value="立即升级" class="s_btn s_btn_d"/>
			</div>
		</form>	
	</div>
			
	<!-- 获得金币 -->
	<div id="gold_homepage" class="page_content" style="display: none;">
		<div  class="gold_balance">
			<div class="gold_balance_img">
				<img src="/Public/Wap/Images/gold1.png" style="width: 35px;"/>
			</div>
			<div id="gold_balance_content" class="gold_balance_content">
				
			</div>
		</div>
		<div id="gold_title_page" class="gold_title">
			
		</div>
		<div id="gold_content">
			<div class="gold_content_style" onClick="upgradeopen('500','r')">
			<div class="gold_content_img">
			<img src="/Public/Wap/Images/gold1.png" style="width: 35px;"/>
			</div>
			<div class="gold_content_font">500<sapn class='reGold'>金币</sapn>/$500</div>
			</div>
			<div class="gold_content_style" onClick="upgradeopen('200','r')">
			<div class="gold_content_img">
			<img src="/Public/Wap/Images/gold1.png" style="width: 35px;"/>
			</div>
			<div class="gold_content_font">200<sapn class='reGold'>金币</sapn>/$200</div>
			</div>
			<div class="gold_content_hot " onClick="upgradeopen('100','r')">
			<div class=" gold_content_img">
			<img src="/Public/Wap/Images/gold1.png" style="width: 35px;">
			</div>
			<div class="gold_content_font">100<sapn class='reGold'>金币</sapn>/$100</div>
			</div>
			<div class="gold_content_style" onClick="upgradeopen('50','r')">
			<div class="gold_content_img">
			<img src="/Public/Wap/Images/gold1.png" style="width: 35px;">
			</div><div class="gold_content_font">50<sapn class='reGold'>金币</sapn>/$50</div>
			</div>
			<div class="gold_content_style" onClick="upgradeopen('20','r')">
			<div class="gold_content_img">
			<img src="/Public/Wap/Images/gold1.png" style="width: 35px;">
			</div>
			<div class="gold_content_font">20<sapn class='reGold'>金币</sapn>/$20</div>
			</div>
		</div>	
	</div>
	
	<!-- 表情贴商店 -->
	<div id="Expression_post_shop_homepage" class="page_content" style="display: none;">
		<div class="shop-b">
			<img src="/Public/Wap/Images/640X300.png"  style="width: 100%;">
		</div>
		
		<div id="Expression_list">
				 
		</div>		
	</div>
		
	<!-- 表情贴详细界面 -->
	<div id="Expressions_posted_in_detail_homepage" class="page_content" style="display: none;">
		<div id="ExpressionDetailimg">
			
		</div>
		
		<div id="ExpressionDetaillest" height="223">

		</div>
	</div>
	<!-- 新鲜事 -->
	<div id="freshNews_homepage" class="page_content" style="display: none;  background: #EDEDED; height: 430px;">

		<div id="freshNews_list">
		</div>

		<div id="freshNews_submit" class="gengduo">
			<input type="submit" tabindex="3" id="submit" value="更多" onClick="freshNewsList()" class="s_btn s_btn_d">
		</div>
		
	</div>
	
	<div id="freshNews_sharebg" class="ExitAccount_style" style="display: none;" onClick="freshNewsShareClose()">
	</div>
	
	<div id="freshNews_share" style="display: none;">
		<div id="qzOpeners" class="share_div"></div>
		<div id="qcShareqqs" class="share_div"></div>
		<div id="weiboSharexinlangs" class="share_div"></div>
		<div id="weixinShares" class="share_div">
			<div  onclick="veixinShare()" >
				<img src='/Public/Wap/Images/weixin.png' class='class-img'>
			</div>
		</div>
		<div id="twitterShares" class="share_div">
			<div>
				<a class="fav_twitter" rel="nofollow" href="javascript:window.open('http://twitter.com/home?status='+encodeURIComponent('http://wap.yangmeizi.com/')+' '+encodeURIComponent(document.title));void(0)">
					<img src='/Public/Wap/Images/twitter.png' class='class-img'>
				</a>
			</div>
		</div>
		<div id="vkShares" class="share_div">
		</div>
		<div id="fbShares" class="share_div">
			<div>
				<a class="fav_facebook" rel="nofollow" href="javascript:window.open('http://www.facebook.com/sharer/sharer.php?u='+encodeURIComponent('http://yangmeizi.com/')+'&amp;t='+encodeURIComponent(Sharetitle));void(0)">
					<img src='/Public/Wap/Images/fb.png' class='class-img'>
				</a>
			</div>
		</div>				
	</div>
	
	<!-- 新鲜事添加 -->
	<div id="freshNewsAdd_homepage" class="page_content" style="display: none;  background: #EDEDED;" data-snap-ignore="true">
		<div class="freshNewsAdd_style">
			<div class="freshNewsAdd_text">
				<textarea id="txt_freshNewsAdd_textarea" placeholder="有何打算？" cols="" rows="6"></textarea>
			</div>
			
			<div class="freshNewsAdd_botton">
				<div class="freshNewsAdd_img" onClick="freshNewsExpressions()">
					<img src="/Public/Wap/Images/sticker.png" class="freshNews-img">
				</div>
				<div class="freshNewsAdd_img">
					<input type="file" name="filefreshNewsimg" id="filefreshNewsimg" accept="Images/*" onChange="javascript:freshNewsFile();" />
					<img src="/Public/Wap/Images/photo.png" class="freshNews-img" style="z-index: 2;">
				</div>
				<div class="freshNewsAdd_img">
					<img src="/Public/Wap/Images/translation.png"  onClick="freshNewsAddTrans('freshNewsAdd_textarea')" class="freshNews-img">
				</div>
			</div>
		</div>
		
		<div id="freshNews_img">
		</div>
		
		<!--笑脸-->
		<div id="freshNewsAdd_Expressions" class="freshNewsAdd_Expression" style="display: none;">
			<div class="gwx_face_outer">
				<img src="/Public/Wap/Images/faces/face1.gif" onClick="freshNewsExpressionsAdd('Smile')" title="Smile" class="gwx_face_face">
				<img src="/Public/Wap/Images/faces/face2.gif" onClick="freshNewsExpressionsAdd('Grimace')" title="Grimace" class="gwx_face_face">
				<img src="/Public/Wap/Images/faces/face3.gif" onClick="freshNewsExpressionsAdd('Drooling')" title="Drooling" class="gwx_face_face">
				<img src="/Public/Wap/Images/faces/face4.gif" onClick="freshNewsExpressionsAdd('Scowl')" title="Scowl" class="gwx_face_face">
				<img src="/Public/Wap/Images/faces/face5.gif" onClick="freshNewsExpressionsAdd('Chill')" title="Chill" class="gwx_face_face">
				<img src="/Public/Wap/Images/faces/face6.gif" onClick="freshNewsExpressionsAdd('Sob')" title="Sob" class="gwx_face_face">
				<img src="/Public/Wap/Images/faces/face7.gif" onClick="freshNewsExpressionsAdd('Shy')" title="Shy" class="gwx_face_face">
				<img src="/Public/Wap/Images/faces/face8.gif" onClick="freshNewsExpressionsAdd('Silence')" title="Silence" class="gwx_face_face">
				<img src="/Public/Wap/Images/faces/face9.gif" onClick="freshNewsExpressionsAdd('Cry')" title="Cry" class="gwx_face_face">
				<img src="/Public/Wap/Images/faces/face10.gif" onClick="freshNewsExpressionsAdd('Embarrassed')" title="Embarrassed" class="gwx_face_face">
				<img src="/Public/Wap/Images/faces/face11.gif" onClick="freshNewsExpressionsAdd('On fire')" title="On fire" class="gwx_face_face">
				<img src="/Public/Wap/Images/faces/face12.gif" onClick="freshNewsExpressionsAdd('Wink')" title="Wink" class="gwx_face_face">
				<img src="/Public/Wap/Images/faces/face13.gif" onClick="freshNewsExpressionsAdd('Grin')" title="Grin" class="gwx_face_face">
				<img src="/Public/Wap/Images/faces/face14.gif" onClick="freshNewsExpressionsAdd('Surprised')" title="Surprised" class="gwx_face_face">
				<img src="/Public/Wap/Images/faces/face15.gif" onClick="freshNewsExpressionsAdd('Sad')" title="Sad" class="gwx_face_face">
				<img src="/Public/Wap/Images/faces/face16.gif" onClick="freshNewsExpressionsAdd('Cool')" title="Cool" class="gwx_face_face">
				<img src="/Public/Wap/Images/faces/face17.gif" onClick="freshNewsExpressionsAdd('Frightened')" title="Frightened" class="gwx_face_face">
				<img src="/Public/Wap/Images/faces/face18.gif" onClick="freshNewsExpressionsAdd('Scream')" title="Scream" class="gwx_face_face">
				<img src="/Public/Wap/Images/faces/face19.gif" onClick="freshNewsExpressionsAdd('Puke')" title="Puke" class="gwx_face_face">
				<img src="/Public/Wap/Images/faces/face20.gif" onClick="freshNewsExpressionsAdd('Chuckle')" title="Chuckle" class="gwx_face_face">
				<img src="/Public/Wap/Images/faces/face21.gif" onClick="freshNewsExpressionsAdd('Lovely')" title="Lovely" class="gwx_face_face">
				<img src="/Public/Wap/Images/faces/face22.gif" onClick="freshNewsExpressionsAdd('Sneer')" title="Sneer" class="gwx_face_face">
				<img src="/Public/Wap/Images/faces/face23.gif" onClick="freshNewsExpressionsAdd('Arrogant')" title="Arrogant" class="gwx_face_face">
				<img src="/Public/Wap/Images/faces/face24.gif" onClick="freshNewsExpressionsAdd('Hungry')" title="Hungry" class="gwx_face_face">
				<img src="/Public/Wap/Images/faces/face25.gif" onClick="freshNewsExpressionsAdd('Drowsy')" title="Drowsy" class="gwx_face_face">
				<img src="/Public/Wap/Images/faces/face26.gif" onClick="freshNewsExpressionsAdd('Panic')" title="Panic" class="gwx_face_face">
				<img src="/Public/Wap/Images/faces/face27.gif" onClick="freshNewsExpressionsAdd('Sweating')" title="Sweating" class="gwx_face_face">
				<img src="/Public/Wap/Images/faces/face28.gif" onClick="freshNewsExpressionsAdd('Laugh')" title="Laugh" class="gwx_face_face">
				<img src="/Public/Wap/Images/faces/face29.gif" onClick="freshNewsExpressionsAdd('Soldier')" title="Soldier" class="gwx_face_face">
				<img src="/Public/Wap/Images/faces/face30.gif" onClick="freshNewsExpressionsAdd('Strive')" title="Strive" class="gwx_face_face">
				<img src="/Public/Wap/Images/faces/face31.gif" onClick="freshNewsExpressionsAdd('Scold')" title="Scold" class="gwx_face_face">
				<img src="/Public/Wap/Images/faces/face32.gif" onClick="freshNewsExpressionsAdd('Confused')" title="Confused" class="gwx_face_face">
				<img src="/Public/Wap/Images/faces/face33.gif" onClick="freshNewsExpressionsAdd('Shhh')" title="Shhh" class="gwx_face_face">
				<img src="/Public/Wap/Images/faces/face34.gif" onClick="freshNewsExpressionsAdd('Hypnotized')" title="Hypnotized" class="gwx_face_face">
				<img src="/Public/Wap/Images/faces/face35.gif" onClick="freshNewsExpressionsAdd('Torment')" title="Torment" class="gwx_face_face">
				<img src="/Public/Wap/Images/faces/face36.gif" onClick="freshNewsExpressionsAdd('Frustrated')" title="Frustrated" class="gwx_face_face">
				<img src="/Public/Wap/Images/faces/face37.gif" onClick="freshNewsExpressionsAdd('Skull')" title="Skull" class="gwx_face_face">
				<img src="/Public/Wap/Images/faces/face38.gif" onClick="freshNewsExpressionsAdd('Hammer')" title="Hammer" class="gwx_face_face">
				<img src="/Public/Wap/Images/faces/face39.gif" onClick="freshNewsExpressionsAdd('Wave/Bye')" title="Wave/Bye" class="gwx_face_face">
				<img src="/Public/Wap/Images/faces/face40.gif" onClick="freshNewsExpressionsAdd('Relived')" title="Relived" class="gwx_face_face">
				<img src="/Public/Wap/Images/faces/face41.gif" onClick="freshNewsExpressionsAdd('Pick nose')" title="Pick nose" class="gwx_face_face">
				<img src="/Public/Wap/Images/faces/face42.gif" onClick="freshNewsExpressionsAdd('Applause')" title="Applause" class="gwx_face_face">
				<img src="/Public/Wap/Images/faces/face43.gif" onClick="freshNewsExpressionsAdd('Flushed')" title="Flushed" class="gwx_face_face">
				<img src="/Public/Wap/Images/faces/face44.gif" onClick="freshNewsExpressionsAdd('Hellooo')" title="Hellooo" class="gwx_face_face">
				<img src="/Public/Wap/Images/faces/face45.gif" onClick="freshNewsExpressionsAdd('Snub1')" title="Snub1" class="gwx_face_face">
				<img src="/Public/Wap/Images/faces/face46.gif" onClick="freshNewsExpressionsAdd('Snub2')" title="Snub2" class="gwx_face_face">
				<img src="/Public/Wap/Images/faces/face47.gif" onClick="freshNewsExpressionsAdd('Yawn')" title="Yawn" class="gwx_face_face">
				<img src="/Public/Wap/Images/faces/face48.gif" onClick="freshNewsExpressionsAdd('Booo')" title="Booo" class="gwx_face_face">
				<img src="/Public/Wap/Images/faces/face49.gif" onClick="freshNewsExpressionsAdd('Distressed')" title="Distressed" class="gwx_face_face">
				<img src="/Public/Wap/Images/faces/face50.gif" onClick="freshNewsExpressionsAdd('Sniffle')" title="Sniffle" class="gwx_face_face">
				<img src="/Public/Wap/Images/faces/face51.gif" onClick="freshNewsExpressionsAdd('Sly')" title="Sly" class="gwx_face_face">
				<img src="/Public/Wap/Images/faces/face52.gif" onClick="freshNewsExpressionsAdd('Pucker')" title="Pucker" class="gwx_face_face">
				<img src="/Public/Wap/Images/faces/face53.gif" onClick="freshNewsExpressionsAdd('Scared')" title="Scared" class="gwx_face_face">
				<img src="/Public/Wap/Images/faces/face54.gif" onClick="freshNewsExpressionsAdd('Pathetic')" title="Pathetic" class="gwx_face_face">
				<img src="/Public/Wap/Images/faces/face55.gif" onClick="freshNewsExpressionsAdd('Petrified')" title="Petrified" class="gwx_face_face">
				<img src="/Public/Wap/Images/faces/face56.gif" onClick="freshNewsExpressionsAdd('Speechless')" title="Speechless" class="gwx_face_face">
				<img src="/Public/Wap/Images/faces/facedelect.png" title="facedelect" class="gwx_face_facedelect">
			</div>
		</div>
		
	</div>
		
	<!-- 来访 -->
	<div id="visiting_homepage" class="page_content" style="display:none; height: 432px;">
		<!-- 来访的好友列表-->
		<div id="visiting_list">

		</div>
			
		<div style="display:block;" id="visiting_submit" class="gengduo">
			<input tabindex="3" id="submit_v" class="submit" value="更多" onClick="visitingList()" type="submit">
		</div>
	</div>
		
	<!-- 收藏 -->
	<div id="collection_homepage" class="page_content" style="display: none; height: 432px;">
		<div id="collection_list">
		</div>
		<div style="display: none;" id="collection_submit" class="gengduo">
			<input tabindex="3" id="submit_c" class="submit" value="更多" onClick="collectionList()" type="submit">
		</div>
	</div>
		
	<!-- 礼物 -->
	<div id="Gifts_homepage" class="page_content" style="display: none; height: 432px;">
		<!--礼物列表-->
		<div id="Gifts_list">

			
		</div>
		
		<div id="Gifts_submit" class="gengduo">
			<input tabindex="3" id="submit" class="submit" value="更多" onClick="SendGiftLest()" type="submit">
		</div>
	</div>
		
	<!-- 礼物详细 -->
	<div id="detail_homepage" class="page_content" style="display: none;">
	
		<div id="Gifts_detail">
			<div class="Detaillist">
				<div class="Details">
					<input id="giftId" name="giftId" value="5D40D3921DC345E59E43AA3AFC904D0A" type="hidden">
					<div class="Detailimg">
						<img src="" style="width:100%;">
					</div>
					<div class="Detailtitle1">家乐福购物卡-可用于购买春装等</div>
					<div class="Detailgold">269 金币</div>
					<div class="Detailcontent1">
						<p>礼物描述</p>
						<p class="DetailC">家乐福购物卡-是非常贴心的礼物。方便快捷的购物方式 ，能够让你的朋友觉得非常贴心 。各类礼物及其他各类商品能够满足你的大部分需求。</p>
					</div>
					<div class="Detailcontent1">
						<p>礼物介绍</p>
						<p class="DetailC">该礼物卡可在网上兑换。有地区限制。</p>
					</div>
					<div class="Detailcontent1">
						<p>联系我们</p>
						<p class="DetailC">vivimeetteam@hotmail.com</p>
					</div>
				</div>
			</div>
		</div>
		
		<input type="hidden" id="InputRealId" name="realId" value="" />
		<input type="hidden" id="Detailgold_price" name="realprice" value="" />
	</div>
	
	<div  id="Detail_botton" class="DetailDutton" onClick="GiftSend(1,0)" style="display: none;">
		确认送出	
	</div>	
		
	<!-- 礼物盒子 --><!--点击左侧“礼物盒子”，页面关闭所有，只打开“这个DIv”-->
	<div id="GiftBox_homepage" class="page_content" style="display: none; height: 432px;">
		<div id="GiftBox_list" style="display: block;">
			
		</div>
	</div>
	
	<!-- 邂逅 -->
	<div id="encounter_homepage" class="page_content" style="display:none; height: ;">
		<div id="encounter_title">
			
		</div>
		<div id="encounter_img">  <!--点击“yes”或者“no”,都会切换下一个朋友，供你选择-->
			
		</div>
			
		<input id="likeId" name="likeId" value="" type="hidden">
		<div class="encounter_button">
			<div class="encounter_button_yes" onClick="encounterlikes()"><!-- 邂逅添加 -->
				<div class='freshNews_bottons1'>
					<div class="encounter_button_img">
						<img src="/Public/Wap/Images/encounterlove.png" style="width: 18px;">
					</div>
					<div class="encounter_button_font">
						yes
					</div>
				</div>
			</div>
			<div class="encounter_button_no" onClick="encounterOperation()">
				<div class='freshNews_bottons1'>
					<div class="encounter_button_img">
						<img src="/Public/Wap/Images/encounterimno.png" style="width: 18px;">
					</div>
					<div class="encounter_button_font">
						no
					</div>
				</div>
			</div>
		</div>	
	</div>
		
	<!-- 相互喜欢      的页面   头部的  三个   切换按钮 ：针对3个div、-->
	<div id="Love_lest" class="page_lest" style="display: none;">
		<div id="ILikeThe_title" class="love_style" style="border-bottom: 1px solid rgb(221, 221, 221);" onClick="ILikeThePage()">
			我喜欢的  <!-- 选中的时候，样式里添加 "border-bottom: 1px solid rgb(221, 221, 221);"-->
		</div>
		<div id="LikeMy_title"  class="love_style"  onclick="LikeMyPage()">
			喜欢我的
		</div>
		<div id="LoveEachOther_title"  class="love_style" onClick="LoveEachOtherPage()">
			相互喜欢
		</div>
	</div>
	<!-- 互相喜欢 LoveEachOther -->
	<div id="LoveEachOther_homepage" class="page_love_content" style="display: none;  height: 382px;">
		
		<div id="LoveEachOther_lest">
			<div class="visit_style">
				您还没有喜欢他/她的，快去邂逅吧！
			</div>
		</div>
		<div id="LoveEachOther_submit" class="gengduo">
			<input type="submit" tabindex="3" id="submit_l" value="更多"  class="submit" onclick="LoveEachOther()" class="s_btn s_btn_d" />
		</div>
	</div> 
	<!-- 我喜欢的 ILikeThe -->
	<div id="ILikeThe_homepage" class="page_love_content" style="display: none; height: 380px;">
		<div id="ILikeThe_lest">
			<!--第 1 个 -->
			<div id="encounter_47F4CB7A827C46D7AEDBEAEF6068DEF4" class="honepage-visiting-list">
				<div class="visiting_lests">
					<div class="honepage-user">
						<a target="myiframeperfriend" href="personalfriend.php?friendid=47F4CB7A827C46D7AEDBEAEF6068DEF4">	  <div class="honepage-user-phont-left">
								<img src="" onerror="javascript:this.src='/Public/Wap/Images/alila/female.png'" class="homepage-content-img">
								<div class="honepage-user-zaixin">
									<img src="/Public/Wap/Images/noline.png" class="homepage-line-img">
								</div>
							</div>
							<div class="visiting_content">
								<div class="visiting_style">			Miroslawa,24
								</div>
								<div class="visiting_style visiting_style_about">
									
								</div>
								<div class="visiting_style visiting_style_time">
									4天以前
								</div>
							</div>
						</a>
						<div class="visiting_style_right">
							<div class="visiting-img1">
								<img src="/Public/Wap/Images/encounterim.png" class="visiting-img">
							</div>
							<div style="display: block;" class="visiting-img1" id="Open4_47F4CB7A827C46D7AEDBEAEF6068DEF4">
								<cite>
									<img src="/Public/Wap/Images/more.png" class="visiting-img">
								</cite>
							</div>
							<div style="display: none;" class="visiting-img1" id="Close4_47F4CB7A827C46D7AEDBEAEF6068DEF4">
								<cite>
									<img src="/Public/Wap/Images/more.png" class="visiting-img">
								</cite>
							</div>
						</div>
						<div style="display: none;" class="TheDropDownMenu_style" id="Menu4_47F4CB7A827C46D7AEDBEAEF6068DEF4">
							<div class="Menu_gift" id="gift4_47F4CB7A827C46D7AEDBEAEF6068DEF4">礼物</div>
							<div class="Menu_Delete" id="47F4CB7A827C46D7AEDBEAEF6068DEF4-EC4251F9AEFF41F2A4D4BE77403BF578">删除</div>
						</div>
					</div>
				</div>
			</div>
		
		</div>
		<div id="ILikeThe_submit" class="gengduo">
			<input type="submit" tabindex="3" id="submit_i" value="更多"  class="submit" onclick="ILikeThe()" class="s_btn s_btn_d" />
		</div>
	</div>
	<!-- 喜欢我的 LikeMy -->
	<div id="LikeMy_homepage" class="page_love_content" style="display: none; height: 380px;">
		<div id="LikeMy_lest">
			<!--  情况一： 没有人喜欢你的时候，显示：-->
			<p style="display:none;">你还没有喜欢他/她的，快去邂逅吧！</p>
			<!--  情况二：有人喜欢你，显示：-->
			<div id="encounter_77ACC692886847E2AE4B0EA9CE0E66D2" class="honepage-visiting-list">	
				<div class="visiting_lests">
					<div class="honepage-user">
						<a target="myiframeperfriend" href="personalfriend.php?friendid=77ACC692886847E2AE4B0EA9CE0E66D2">
							<div class="honepage-user-phont-left">
								<img src="" onerror="javascript:this.src='/Public/Wap/Images/alila/female.png'" class="homepage-content-img">
								<div class="honepage-user-zaixin">
									<img src="/Public/Wap/Images/line.png" class="homepage-line-img">
								</div>
							</div>
							<div class="visiting_content">
								<div class="visiting_style">luluxingg,22</div>
								<div class="visiting_style visiting_style_about">
								</div>
								<div class="visiting_style visiting_style_time">1分以前</div>
							</div>
						</a>
						<div class="visiting_style_right">
							<div class="visiting-img1">
								<img src="/Public/Wap/Images/encounterim.png" class="visiting-img">
							</div>
							<div style="display: block;" class="visiting-img1" id="Open5_77ACC692886847E2AE4B0EA9CE0E66D2">
								<cite><img src="/Public/Wap/Images/more.png" class="visiting-img"></cite>
							</div>
							<div style="display: none;" class="visiting-img1" id="Close5_77ACC692886847E2AE4B0EA9CE0E66D2">
								<cite><img src="/Public/Wap/Images/more.png" class="visiting-img"></cite>
							</div>
						</div>
						<div style="display: none;" class="TheDropDownMenu_style" id="Menu5_77ACC692886847E2AE4B0EA9CE0E66D2">
							<div class="Menu_gift" id="gift5_77ACC692886847E2AE4B0EA9CE0E66D2">礼物</div>
							<div class="Menu_Delete" id="77ACC692886847E2AE4B0EA9CE0E66D2-82321D3A65BF4FF9A8836B3E2395824B">删除</div>
						</div>
					</div>
				</div>
			</div>
			
		</div>
		<div id="LikeMy_submit" class="gengduo">
			<input type="submit" tabindex="3" id="submit_m" value="更多"  class="submit" onclick="LikeMy()" class="s_btn s_btn_d" />
		</div>
	</div>
		
	<!-- 设置 Setting -->	
	<div  id="Setting_homepage" class="page_content" style="display:none; height: 430px;">
		<div id="change_password" class="setting_style" onClick="ChangePasswordpage()">
			修改密码
		</div>
		<!-- <div id="About_Us" class="setting_style" onClick="AboutUspage()">
			关于我们
		</div> -->
		<div id="Dating_Safety" class="setting_style" onClick="DatingSafety()">
			交友安全
		</div>
		<div id="Terms_of_use" class="setting_style" onClick="TermsOfUse(1)">
			使用条款
		</div>
		<div id="Privacy_policy" class="setting_style" onClick="PrivacyPolicy(1)">
			隐私政策
		</div>
		<div id="exit_account" class="setting_style" onClick="ExitAccount()">
			退出账号
		</div>
		
		<!--   点击”退出账号“的时候的，弹出框  de 黑色”遮罩层“-->
		<div id="ExitAccount_id1" class="ExitAccount_style"  style="display: none;" onClick="ExitAccountcancel()">
		</div>
		<!--   点击”退出账号“的时候的，弹出框-->
		<div id="ExitAccount_div"  style="display: none;">
			<div class='ExitAccount-top'>
				<div id="ExitAccount_1" class='ExitAccount-style'>提示</div>
				<div class='' id="ExitAccount_2">是否退出？</div>
			</div>
			<div class='ExitAccount-botton'>
				<div id="ExitAccount_3" class='ExitAccount_left' onClick="ExitAccountcancel()">取消</div>
				<div id="ExitAccount_4" class='ExitAccount_right' onClick="ExitAccountcance2()">确定</div>
			</div>	
		</div>	
		
	</div>
		
		
	<!--    关于我们 的   页面的-->
	<div id="Settings_page_us" class="page_content" style="display: none; height: 432px;">
		<div class="about_bg"><div class="about" style="padding: 50px 5px;  text-align: center;"><img src="/Public/Wap/Images/ABOUT.png" style="width: 105px;  margin: auto;"><p>YangMeizi</p></div><div class="about_img"></div></div>
		<div class="footer1"><p>Copyright © 1998 - 2015 </p><p>ZhiJi Corporation. All Rights Reserved </p><p class="per_a"><a href="http://www.yangmeizi.com/ymz.apk" target="_top"><span>Android<!--?php echo $client;?--></span></a> <a href="https://itunes.apple.com/cn/app/yangxifu/id919483283?mt=8" target="_top"><span>ios<!--?php echo $client;?--></span></a></p></div>
	</div>
	
	<!--  交友安全  的   页面的-->
	<div id="Settings_page_safe" class="page_content" style="display: none; height: 432px;">
		<div class="dating">
		
		</div>
	</div>
	
	<!--  使用条款  的   页面的-->
	<div id="Settings_page_use" class="page_content" style="display: none; height: 432px;">
		<div class="dating">

		</div>
	</div>
	
	<!--  隐私政策  的   页面的-->
	<div id="Settings_page_policy" class="page_content" style="display: none; height: 432px;">
		<div class="dating">
			
		</div>
	</div>
	
	<div id="Settings_page" class="page_content" style="display: none; height: 432px;">
			
	</div>	
		
	<!--   点击“聊天”按钮之后，显示- block-->
	<div  id="chat_history" class="page_content" style="display: none;">
		<div id="history_div" onClick="loadHistory()">
			历史记录  <!--聊天窗口顶部的“查看更多”-->
		</div>
	</div>
	
	<!--聊天窗口  中间的  的“内容区”-->
	<div  id="chat_homepage" class="page_content1" style="display: none;">
		
	
	</div>
	
	<div id="Trans_bg" class="ExitAccount_style"  style="display: none;" onClick="Transdivclose()">
	</div>
	
	<div id="Trans_div"  style="display: none;">	
			<div id="Trans_wall_content" class='ExitAccount-top'>
				
			</div>
			<div class='ExitAccount-botton'>
				<div id="Trans_3" class='ExitAccount_left' onClick="Transdivclose()">取消</div>
				<div id="Trans_4" class='ExitAccount_right'>确定</div>
			</div>
	</div>
	
	<!--点击“翻译、translate，该页面会弹出来， 供用户选择语言”-->
	<div id="chat_fanyi_div" style="position:absolute;left:260px;top:30px;width:310px;height:300px;background-color:#fff;z-index: 10;  border-radius: 5px;  padding: 10px;display:none;">
		<div class="chat_fanyi_close" onClick="divcenterclose()">
			<img src='/Public/Wap/Images/languageselect.png' class='chat-fanyi1-img' id="translation_img">
			<span id="fanyi_close">Translation</span>
		</div>
		<div class="Automatic-translation">
			<div id="Automatic-translation">
				自动翻译:
			</div>
			<div class="Automatic-translation-list">

				<div class="translation-style" onClick="divcenterclose('zh')"><div class="translation_img"><img src='/Public/Wap/Images/languageselect.png' class='chat-fanyi2-img' id="img_zh" style="display: none;"></div><span id="text_zh" class="chat-fanyi2-text">Chinese</span></div>

				<div class="translation-style" onClick="divcenterclose('zh-tw')"><div class="translation_img"><img src='/Public/Wap/Images/languageselect.png' class='chat-fanyi2-img' id="img_zh-tw" style="display: none;"></div><span id="text_zh-tw" class="chat-fanyi2-text">Taiwan</span></div>
				
				<div class="translation-style" onClick="divcenterclose('en')"><div class="translation_img"><img src='/Public/Wap/Images/languageselect.png' class='chat-fanyi2-img' id="img_en" style="display: none;"></div><span id="text_en" class="chat-fanyi2-text">English</span></div>
				
				<div class="translation-style" onClick="divcenterclose('ja')"><div class="translation_img"><img src='/Public/Wap/Images/languageselect.png' class='chat-fanyi2-img' id="img_ja" style="display: none;"></div><span id="text_ja" class="chat-fanyi2-text">Japanese</span></div>
				
				<div class="translation-style" onClick="divcenterclose('ko')"><div class="translation_img"><img src='/Public/Wap/Images/languageselect.png' class='chat-fanyi2-img' id="img_ko" style="display: none;"></div><span id="text_ko" class="chat-fanyi2-text">Korean</span></div>
				
				<div class="translation-style" onClick="divcenterclose('de')"><div class="translation_img"><img src='/Public/Wap/Images/languageselect.png' class='chat-fanyi2-img' id="img_de" style="display: none;"></div><span id="text_de" class="chat-fanyi2-text">German</span></div>
				
				<div class="translation-style" onClick="divcenterclose('es')"><div class="translation_img"><img src='/Public/Wap/Images/languageselect.png' class='chat-fanyi2-img' id="img_es" style="display: none;"></div><span id="text_es" class="chat-fanyi2-text">Spanish</span></div>
				
				<div class="translation-style" onClick="divcenterclose('fr')"><div class="translation_img"><img src='/Public/Wap/Images/languageselect.png' class='chat-fanyi2-img' id="img_fr" style="display: none;"></div><span id="text_fr" class="chat-fanyi2-text">French</span></div>
				
				<div class="translation-style" onClick="divcenterclose('it')"><div class="translation_img"><img src='/Public/Wap/Images/languageselect.png' class='chat-fanyi2-img' id="img_it" style="display: none;"></div><span id="text_it" class="chat-fanyi2-text">Italian</span></div>
				
				<div class="translation-style" onClick="divcenterclose('nl')"><div class="translation_img"><img src='/Public/Wap/Images/languageselect.png' class='chat-fanyi2-img' id="img_nl" style="display: none;"></div><span id="text_nl" class="chat-fanyi2-text">Ductch</span></div>
				
				<div class="translation-style" onClick="divcenterclose('pt')"><div class="translation_img"><img src='/Public/Wap/Images/languageselect.png' class='chat-fanyi2-img' id="img_pt" style="display: none;"></div><span id="text_pt" class="chat-fanyi2-text">Portuguese</span></div>
				
				<div class="translation-style" onClick="divcenterclose('ru')"><div class="translation_img"><img src='/Public/Wap/Images/languageselect.png' class='chat-fanyi2-img' id="img_ru" style="display: none;"></div><span id="text_ru" class="chat-fanyi2-text">Russian</span></div>
			</div>
		</div>
		<!--<div id="translation_Manual" class="Manual-translation">
			<div id="Manual-translation">
				手动翻译:
			</div>
			<div class="Manual-translation-list">
				
			</div>
		</div>-->
	</div>
	
	<div  id="chat_botton" class="page_content1" style="display:none;" data-snap-ignore="true">
		
		<div class="chat_botton_div">
			<div class="chat_img_style">
				<img src="/Public/Wap/Images/smile.png" id="chat_img1" title="Smile" class="chat_img" onClick="stickeropen(1)" style="display: block;">
				<img src="/Public/Wap/Images/amileadd.png" id="chat_img2" title="Smile" class="chat_img" onClick="stickerclose(1)" style="display: none;"><!-- 点击”这个按钮“<div id="sticker_div" style="display: none;"> "笑脸脸谱"  这个页面会显示-->
			</div>
			<div class="chat_img_style">
				<img src="/Public/Wap/Images/add.png" id="chat_d1" title="Smile" class="chat_img" onClick="stickeropen(2)" style="display: block;">
				<img src="/Public/Wap/Images/adddelect.png" id="chat_d2" title="Smile" class="chat_img" onClick="stickerclose(2)" style="display: none;"><!-- 点击”这个按钮“，<div id="sticker_xuanxiang" style="display: none;">   ”礼物， 翻译，  图片“  三个按钮的，这个页面会显示-->
			</div>
			<div class="chat_content_div">
				<textarea id="chat_content" class="chat_content" rows="1" name="chat_content" placeholder="消息" ></textarea>
				<input type="hidden" id="msgType" name="msgType" value="0" />
			</div>
			<div class="send_submit">
				<input type="submit" tabindex="3" id="send_submit" value="发送" onClick="chatsendtxt()" class="send_input">
			</div>
		</div>
		
		<div id="sticker_div" style="display: none;">
			<div id="sticker_idv_img" style="display: none;">
				<div id="sticker_stickerface1"  style="display: none;">
					
				</div>
			</div>
			<div id="sticker_Expression_div" style="display: none;">
				<div id="stickerface1" onClick="stickerExpressions('stickerface1')">
					<img src="/Public/Wap/Images/faces/face1.gif"  title="Smile" class="sticker_faces">
				</div>
				<div id="sticker_Expressions">
					<div id="sticker_Expression1">
					</div>
				</div>
				<div id="sticker_Expression" onClick="ExpressionShop()">
					<!-- 表情帖 -->
					<img src="/Public/Wap/Images/faceshop.png" onClick="" title="Smile" class="sticker_faces">
				</div>
			</div>
			<div id="sticker_xuanxiang" style="display: none;">
				<div class="sticker_img2">
					<img src="/Public/Wap/Images/imgift.png"  class="sticker_chat_img" onClick="StickerImp(1)" >
					<div id="sticker_imgift" class="sticker_text">
						礼物
					</div>
				</div>
				<div class="sticker_img2">
					<img src="/Public/Wap/Images/translation.png"  class="sticker_chat_img" onClick="StickerImp(2)" >
					<div id="sticker_translation" class="sticker_text">
						翻译
					</div>
				</div>
				
				<div class="sticker_img2" >
					<input type="file" name="filechatimg" id="filechatimg" accept="Images/*" onChange="javascript:ChatFile();" />
					<img src="/Public/Wap/Images/impicture.png"  class="sticker_chat_img" style="z-index: 2;">
					<div id="sticker_impicture" class="sticker_text">
						图片
					</div>
				</div>
			</div>
		</div>
	</div>
	
	<iframe id="myiframeperfriend" class="page_content" src="" name="myiframeperfriend" scrolling="auto" frameborder="0" allowtransparency="yes"   style="width:100%;display: none;">
	<!--    查看别人的  空间时，加入的链接是“别人的主页 空间”-->
	</iframe>
	
</div> 
</div>
<script charset="windows-1251" src="http://vk.com/js/api/share.js?93" type="text/javascript"></script>
<script type="text/javascript" src="/Public/Wap/Js/jquery.js"></script>
<script type="text/javascript" src="/Public/Wap/Js/jqueryui.js"></script>
<script type="text/javascript" src="/Public/Wap/Js/PublicFunction.js" ></script>
<script type="text/javascript" src="/Public/Wap/Js/framework.plugins.js"></script>
<script type="text/javascript" src="/Public/Wap/Js/custom.js"></script>
<script type="text/javascript" src="/Public/Wap/Js/jssor.js"></script>
<script type="text/javascript" src="/Public/Wap/Js/jssor.slider.js"></script>
<script type="text/javascript" src="/Public/Wap/Js/tuijianqiang.js" ></script>
<script type="text/javascript" src="/Public/Wap/Js/mobiscroll.custom-2.6.2.min.js"></script>
<script type="text/javascript" src="/Public/Wap/Js/index.js?1211" ></script>
<script type="text/javascript" src="/Public/Wap/Js/interaction.js" ></script>
<script type="text/javascript" src="/Public/Wap/Js/WebSocket.js?2" ></script>
<script type="text/javascript">
	fn(jQuery); 
</script>
</body>
</html>