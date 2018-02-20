<?php if (!defined('THINK_PATH')) exit();?><!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<title><?php echo (L("title")); ?></title>
<meta http-equiv="X-UA-Compatible" content="IE=9; IE=8; IE=7; IE=EDGE">
<meta http-equiv="content-type" content="text/html;charset=utf-8">
<meta name="Keywords" content="<?php echo (L("Keywords")); ?>"/>
<meta name="description" content="<?php echo (L("description")); ?>"/>
    <link rel="Bookmark" type="image/x-icon" href="/Public/Index/Images/favicon.ico">
    <link rel="shortcut icon" type="image/x-icon" href="/Public/Index/Images/favicon.ico">
    <link type="text/css" rel="stylesheet" href="/Public/Index/Css/home.css?2">
    <link type="text/css" rel="stylesheet" href="/Public/Index/Css/chat.css">

    <link rel="stylesheet" type="text/css" href="/Public/Index/Css/setting.css">
    <link rel="stylesheet" type="text/css" href="/Public/Index/Css/s_about.css">
    <link rel="stylesheet" type="text/css" href="/Public/Index/Css/d_avatar.css">
    <link rel="stylesheet" type="text/css" href="/Public/Index/Css/GwxDialog.css"> 
    
</head>
<body>
<link type="text/css" rel="stylesheet" href="/Public/Index/Css/home.css?3111">
<link rel="stylesheet" href="/Public/Index/Css/Font-Awesome-4.2.0/css/font-awesome.min.css">
<style>
    .head_submenu li{ border:none; }
    .head_submenu{ border-radius: 7px; overflow: hidden; }
    .head_search_em { 
        background: #6281b9 url(/Public/Index/Images/icon_0.png) no-repeat -211px 0;
        border-radius: 0 50px 50px 0;
    }
    #head_search_key{ border-radius: 50px 0 0 50px; background-color: #6281b9;}
    #head_search{ width: 160px; }
    #head_search_key{ width: 120px; }
</style>
<div class="head">
    <div class="head_wrap">
        <em class="head_logo">
            <?php if(!empty($webinfo["logo"])): ?><img width="180px" height="45px" src="<?php echo ($webinfo["logo"]); ?>">     
            <?php else: ?>
                <img width="180px" height="45px" src="/Public/Index/Images/ymz_logo.png" /><?php endif; ?> 
        </em>
        <dl class="head_west">
            <!--原来“浏览”
            <dd id="head_discover" class="head_link">
                <a class="head_em head_discover_icon"></a>
                <span><?php echo (L("browse")); ?></span>
            </dd>首页 我的主页 聊天   升级   充值
            -->
            <!--点击“聊天”,增加类名：“chat_focus”，  “聊天的背景即可亮起”-->
            <dd id="head_discover" class="head_link">
                <i class="fa fa-home" style="color:#e3e5e5; font-size:22px;line-height: 45px;"></i>
                <span style="line-height:43px;"><?php echo (L("browse")); ?></span>
            </dd>
            <dd id="head_space_2" class="head_link">
                <a class="head_em head_discover_icon"></a>
                <span><?php echo (L("profile")); ?></span>
            </dd>
            <dd id="head_chat" class="head_link ">  
                <a class="head_em head_chat_icon"></a>
                <span><?php echo (L("chat")); ?></span>
            </dd>
            <!-- 图标+充值，图标+升级 -->
            <!-- <dd id="head_upgrade" class="head_link">
                <i class="fa fa-level-up" style="color:#e3e5e5; font-size:20px;line-height: 45px;"></i>
                <span style="line-height:43px;"><?php echo (L("upgrade")); ?></span>
            </dd>
            <dd id="head_recharge" class="head_link">
                <i class="fa fa-usd" style="color:#e3e5e5; font-size:20px;line-height: 45px;"></i>
                <span style="line-height:43px;"><?php echo (L("recharge")); ?></span>
            </dd> -->
            <!-- <dd id="head_upgrade" class="head_pay head_upgrade" style="margin-left:40px;">
            </dd>
            <dd id="head_recharge" class="head_pay head_recharge" style="margin-left:25px;">
            </dd> -->
            
            
            <dd id="head_chat_count" class="head_chat_count" style="display:none;"></dd>
            <dd id="chat_show" style="display:none;">   
            <!--通常是display:none；但，当“点击 聊天”时，display:block；-->
                <div id="chat_mask" class="chat_mask"></div>
                <div class="chat_outer">
                    <ul id="chat_panel">
                        <li id="chat_close"></li>
                        <li id="chat_west">
                            <div id="chat_so">
                                <input id="chat_so_key" type="text"/>
                                <span id="chat_so_list"></span>
                            </div>
                            <div id="chat_list">
                                
                            </div>
                        </li>
                        <li id="chat_empty" style="display:block;"></li>    <!--JS，判断是否“聊天中”，无聊天，则 display:block;  显示背景图 -->
                        <li id="chat_east"  style="display:none;">  <!--JS，判断是否“聊天中”，聊天时，则 display:block;  显示 “对话”-->
                            <div id="chat_pal" >
                                <img id="chat_pal_icon" src="">  <!--JS，“聊天中”，好友的 “ 头像，” -->
                                <ul>
                                    <li>
                                        <em class="chat_pal_m chat_pal_m_2" id="chat_pal_m"></em>   <!-- 类名"chat_pal_m_2"，“皇冠”的图标 -->                                                                                                                 <!-- 类名"chat_pal_m_1"，“蓝钻”的图标 -->
                                        <span id="chat_pal_name"></span>        <!--“聊天中”，好友的 “ 名字” -->
                                    </li>
                                    <li id="chat_pal_about" >
                                                        <!--“聊天中”，好友的 “内容” -->
                                    </li>
                                </ul>
                            </div>  
                            <div id="chat_main">
                                <a id="chat_history_wrap" class="chat_history_wrap">
                                    <em class="chat_history_btn"></em>
                                </a>
                                <div id="chat_content">
                                    
                                </div>
                            </div>
                            <textarea id="chat_input" maxlength="300"></textarea>
                            <div id="chat_bar">
                                <div id="chat_emotion" class="chat_btn chat_emotion">
                                    <ul id="chat_emotion_viewer" class="chat_emotion_viewer">
                                        <li id="chat_emotion_wrp" class="chat_emotion_wrp">
                                            <div id="chat_emotion_bar" class="chat_emotion_bar">
                                                <em id="chat_emotion_tl" class="chat_emotion_tb chat_emotion_tl"></em>
                                                <span id="chat_emotion_tc" class="chat_emotion_tc">
                                                    <div id="chat_emotion_ts"></div>
                                                </span>
                                                <em id="chat_emotion_tr" class="chat_emotion_tb chat_emotion_tr"></em>
                                                <em id="chat_emotion_tp" class="chat_emotion_tb chat_emotion_tp"></em>
                                            </div>
                                            <div id="chat_emotion_board" class="chat_emotion_board"></div>
                                        </li>
                                        <li id="chat_emotion_arrow" class="chat_emotion_arrow"></li>
                                    </ul>
                                </div>
                                <div id="chat_camera" class="chat_btn">
                                    <div id="camera_object"></div>
                                </div>
                                <ul id="chat_camera_viewer">
                                    <li id="chat_camera_close"></li>
                                    <li id="chat_camera_photo"></li>
                                    <li class="chat_arrow"></li>
                                </ul>
                                <div id="chat_send">Post</div>
                                <select id="chat_trans_select">
                                </select>
                            </div>
                        </li>
                    </ul>
                </div>
            </dd>
        </dl>
        <dl class="head_east">
            <!-- 不加图标的“充值”、“升级” -->
            <dd id="head_recharge" class="head_link" >
                <span style="line-height:45px;"><?php echo (L("recharge")); ?></span>
            </dd>
            <dd id="head_upgrade" class="head_link" style="margin-right: 15px;">
                <span style="line-height:45px;"><?php echo (L("upgrade")); ?></span>
            </dd>

            <dd id="head_search">
                <input type="text" id="head_search_key"><em id="head_search_em" class="head_search_em"></em>

                <div id="head_search_wrap">
                    <div class="head_search_arrow"></div>
                    <div id="head_search_result"></div>
                </div>
            </dd>
            <!--
            <dd id="head_recharge" class="head_pay head_recharge" ></dd>
            <dd id="head_upgrade" class="head_pay head_upgrade" ></dd>
            -->

            <dd class="head_user">
                <a id="head_space_1" class="head_profile" >
                     <!--    <img id="head_url" class="head_url" />
                    <?php echo (L("setup")); ?>
                    <em class="head_arrow"></em> -->
                    <img src="/Public/Index/Images/sz.png" style="width: 23px; height: 23px; margin-top: 5px;" alt="">
                </a>
                <ul class="head_submenu">
                    <!--
                    <li id="head_space_2"><?php echo (L("profile")); ?></li>
                    -->
                    <li id="head_contact">
                    <!-- 联系客服 --> <?php echo (L("contact us")); ?> 
                    </li>

                    <li id="head_Head"><?php echo (L("Head set")); ?></li>
                    <li id="head_Data"><!-- <a href="http://localhost/yang2/index.php?m=Index&c=Setting&a=index" target="blank" style="text-decoration: none; color:#707070;"> --><?php echo (L("Data set")); ?><!-- </a> --></li>
                    
                    <li id="head_pass"><?php echo (L("change password")); ?></li>
                    <a href="index.php?m=Index&c=index&a=logOut" style=" text-decoration:none;">
                    <li id="logout"><?php echo (L("log out")); ?></li>
                    </a>
                </ul>
            </dd>
        </dl>
    </div>
</div>
<div style="position: fixed;bottom: 0;right: 0;display: none">
    <button id="btn4en">en</button>
    <button id="btn4ru">ru</button>
    <button id="btn4zh">zh</button>
</div>
<ul class="short_menu">
    <li id="short_top" class="short_btn short_top"></li>
    <li id="short_chat" class="short_btn short_chat"></li>
    <li id="short_lang" class="short_btn short_lang">
      <div id="short_txt"><?php echo ($lang); ?></div>
          <div id="short_viewer">
        <a class="short_code" href="<?php echo U('Index/Home/index',array('l'=>'zh-cn'));?>">中文简体</a>
        <a class="short_code" href="<?php echo U('Index/Home/index',array('l'=>'zh-tw'));?>">中文-繁體</a>
        <a class="short_code" href="<?php echo U('Index/Home/index',array('l'=>'en-us'));?>">English</a>
        <a class="short_code" href="<?php echo U('Index/Home/index',array('l'=>'ja'));?>">日本語</a>
        <a class="short_code" href="<?php echo U('Index/Home/index',array('l'=>'ko-kr'));?>">한국의</a>
        <a class="short_code" href="<?php echo U('Index/Home/index',array('l'=>'de'));?>">Deutsch</a>
        <a class="short_code" href="<?php echo U('Index/Home/index',array('l'=>'es'));?>">Español</a>
        <a class="short_code" href="<?php echo U('Index/Home/index',array('l'=>'fra'));?>">Français</a>
        <a class="short_code" href="<?php echo U('Index/Home/index',array('l'=>'it'));?>">Italiano</a>
        <a class="short_code" href="<?php echo U('Index/Home/index',array('l'=>'nl'));?>">Nederlandse</a>
        <a class="short_code" href="<?php echo U('Index/Home/index',array('l'=>'pt'));?>">Português</a>
        <a class="short_code" href="<?php echo U('Index/Home/index',array('l'=>'ru'));?>">Русский</a>
          </div>
    </li>
</ul>
<style>
.user_avatar img{ height: 83px; }
/*.s_top{ background-size: 100% 100%; }*/
#chat_east,#chat_empty{ width: 810px; }
.wall_list img{ 
    border-radius: 50%;
 }
.wall_list img:hover {
    border: 1px solid #FFF;
}
.wall_a_i img{ border-radius: 50%; }
.nav_focus{ border-radius: 0; }
</style>
<div id="home" class="home" >  
    <div class="wall">
        <div id="wall_me" class="wall_a">
            <div class="wall_a_i">
                <img id="wall_me_url" >
            </div>
            <div class="wall_a_m wall_a_b"></div>
            <div class="wall_a_plus" style="background: url('/Public/Index/Images/icon_0.png') -343px -0px;"></div>
        </div>
        <div id="wall_list" class="wall_list">
                
        </div>
    </div>
    <div class="west">
        <div class="user_wrapper">
            <div id="user_avatar" class="user_avatar">
                <img id="user_url" class="user_url" />
            </div>
            <div class="user_list">
                <div>
                    <span id="user_name" class="user_name"></span> <!--链接：<a href="用户的主页" target="_self"> -->
                    <span id="user_m" ></span>   <!-- “蓝钻” js来增加class=“user_m user_m_1” -->
                </div>
                <div style="margin-top: 8px">
                    <span id="user_gold" class="user_gold" ></span>     <!--  后台显示“账户余额： 0” -->
                    <span id="user_gold_icon" class="user_m user_gold_icon"></span>
                </div>
            </div>
        </div>
        <div class="nav">
            <div id="nav_first" class="nav_item nav_focus" title="<?php echo (L("news feed")); ?>" >
                <em class="nav_first"></em><a ><span> <?php echo (L("news feed")); ?> </span></a>
            </div>
            <div id="nav_encounter" class="nav_item" title="<?php echo (L("encounter")); ?>">
                <em class="nav_encounter"></em><a><span> <?php echo (L("encounter")); ?> </span></a>
                <b id="note_count_encounter" style="display:block;"></b>        <!--  js来显示消息个数  style="display:block;" -->
            </div>
            <!-- 好友 -->
            <!-- <div id="nav_friends" class="nav_item" title="<?php echo (L("good friends")); ?>">
                <em class="nav_favor"></em><a>
                <span><?php echo (L("good friends")); ?></span></a>
            </div> -->
            <div id="nav_favor" class="nav_item" title="<?php echo (L("favorite")); ?>">
                <em class="nav_favor"></em><a><span><?php echo (L("favorite")); ?></span></a>
                <b style="display: none;" id="note_count_encounter">0</b>
            </div>

            <div id="nav_visitor" class="nav_item" title="<?php echo (L("visitor")); ?>">
                <em class="nav_visitor"></em><a><span> <?php echo (L("visitor")); ?> </span></a>
                <b id="note_count_visitor" style="display:block;"></b>      <!--  js来显示消息个数  style="display:block;" -->
            </div>
              
        </div>
        <div class="nav">
            <!-- 礼物商店 -->
            <div id="nav_Giftall" class="nav_item" title="<?php echo (L("gift store")); ?>">
                <em class="nav_flower"></em><a><span><?php echo (L("gift store")); ?></span></a>
            </div>

            <div id="nav_sticker" class="nav_item" title="<?php echo (L("sticker store")); ?>">
                <em class="nav_sticker"></em><a><span><?php echo (L("sticker store")); ?></span></a>
            </div>
            <div id="nav_box" class="nav_item" title="<?php echo (L("gift box")); ?>" >
                <em class="nav_box"></em><a><span><?php echo (L("gift box")); ?></span></a>
                <b id="note_count_gift" style="display:block;"> 
                <!-- js来显示消息个数  -->
                </b>    
            </div>
            <!-- 真实礼物
            <div id="nav_flower" class="nav_item" title="<?php echo (L("real gift")); ?>">
                <em class="nav_flower"></em><a><span><?php echo (L("real gift")); ?></span></a>
            </div>
            情人节礼物
            <div id="nav_valentine" class="nav_item" title="<?php echo (L("valentine's day")); ?>">
                <em class="nav_valentine"></em><a><span><?php echo (L("valentine's day")); ?></span></a>
            </div>
            表情商店
            <div id="nav_sticker" class="nav_item" title="<?php echo (L("sticker store")); ?>">
                <em class="nav_sticker"></em><a><span><?php echo (L("sticker store")); ?></span></a>
            </div> -->
        </div>
        <div id="west_upgrade" class="west_upgrade"><?php echo (L("upgrade")); ?></div>
        <div id="west_sticker" class="west_sticker">
            <a class="west_sticker_btn"><?php echo (L("more fun in chatting")); ?></a>
        </div>
        <div id="west_upload" class="west_upload"><?php echo (L("add photo of yourself")); ?></div>
    </div>
    <div class="center">
        <iframe id="center_ifm" name="center_ifm" frameborder="0" class="center_ifm"></iframe>
    </div>
</div>
<div id="space" class="space">          <!--通常是display:none；但，“点击 主页”时，display:block；-->
    <?php if(!empty($webinfo["spacebanner"])): ?><div class="s_top" style="background: url('<?php echo ($webinfo["spacebanner"]); ?>') repeat; background-size: 100% 100%;">
    <?php else: ?>
        <div class="s_top" style="background: url('/Public/Index/Images/space_top2.jpg') repeat;"><?php endif; ?>
        <div class="s_user">
            <div id="s_icon" class="s_icon">
                
            </div>
            <dl class="s_info">
                
                <dd id="s_life" class="s_life">
                    <em id="s_life_status"></em>
                    <ul id="s_life_list" class="s_life_list">
                        <li id="s_life_hide" class="s_life_item" ><?php echo (L("Set stealth")); ?></li>
                        <li id="s_life_online" class="s_life_item" ><?php echo (L("Set online")); ?></li>
                    </ul>
                </dd>
                <!--
                <dd id="s_life" class="s_life s_life_false">•</dd>  不在线”s_life_false“-->
                <dd id="s_name" class="s_name"></dd>    
                <!-- 用户名字-->
                <dd id="s_m"></dd>
                <!-- 用户的等级 : s_m_1 , s_m_2 。-->
            </dl>
        </div>

        <div id="s_nav" class="s_nav">
            <div id="s_nav_profile" class="s_nav_item s_nav_focus"><?php echo (L("home")); ?></div>
            <div id="s_nav_album" class="s_nav_item"><?php echo (L("photos")); ?></div>
            <!-- 主页里的“资料” -->
            <!-- <div id="s_nav_about" class="s_nav_item"><?php echo (L("about")); ?></div> -->
        </div>
    </div>
    <div class="s_center">
        <iframe id="s_ifm" name="s_ifm" frameborder="0" class="s_center_ifm" ></iframe>
    </div>
</div>
<div id="setting" style="display: none;">
    <!-- 导航菜单 -->
    <div id="settop">
        <ul id="setul" >
            <li id="setli_1" onclick="focusli('setli_1')" class="focusli"><?php echo (L("Data set")); ?></li>
            <li id="setli_2"  onclick="focusli('setli_2')"><?php echo (L("Head set")); ?></li>
            <li id="setli_3"  onclick="focusli('setli_3')" style="border: none;"><?php echo (L("change password")); ?></li>
        </ul>
    </div>
    <script type="text/javascript">
        function focusli(id){
            //导航菜单样式
            var Lis = document.getElementById('setul').getElementsByTagName('li');
            for (var i = Lis.length - 1; i >= 0; i--) {
                Lis[i].className="";    
            }
            document.getElementById(id).className="focusli";
            //导航菜单关联的内容
            var DIVs = ["setli_1Date","setli_2Date","setli_3Date"];
            for (var i = DIVs.length - 1; i >= 0; i--) {
                document.getElementById(DIVs[i]).style.display="none";  
            }
            document.getElementById(id+"Date").style.display="block";
        }
    </script>
    <!-- 资料设置 -->
    <div id="setli_1Date" class="baseDate" style="width:1100px; margin: 10px auto;">
        <div class="panel" style="float: left;">
            <div class="caption">
                <?php echo (L("about me2")); ?>        
                <button name="btn_edit" class="btn btn_edit" style="display:block;"><?php echo (L("edit")); ?></button> 
                <button name="btn_post" class="btn public_btn_blue"><?php echo (L("save it")); ?></button> 
                <div id="btn_trans" class="btn btn_trans">
                    <label lang="public_btn_trans|c"></label>
                </div>
            </div>
            <div class="base" style="padding: 0;">
                <div id="about_look"></div>
                <textarea id="about" style="display: none"></textarea>
            </div>
        </div>

        <div class="panel" style="float: right;">
            <div class="caption">
                <?php echo (L("basic information")); ?>        
                <button name="btn_edit" class="btn btn_edit"><?php echo (L("edit")); ?></button>
                <button name="btn_post" class="btn public_btn_blue"><?php echo (L("save it")); ?></button>
            </div>
            <div class="base">
                <table>
                    <tr>
                        <td><?php echo (L("gender")); ?>:</td>
                        <td>
                            <div id="gender_look"></div>
                        </td>
                    </tr>
                    <tr>
                        <td><?php echo (L("birthday")); ?>:</td>
                        <td>
                            <div id="birth_look" style="display:block;"></div>
                            <div id="birth" style="display: none;padding-left: 0">
                                <select id="birth_day">
                                    
                                </select>
                                <select id="birth_month">
                                    
                                </select>
                                <select id="birth_year">
                                    
                                </select>
                            </div>
                        </td>
                    </tr>
                    <tr>
                        <td><?php echo (L("language")); ?>:</td>
                        <td>
                            <div id="language_look"></div>
                            <select id="language" style="display: none">
                                
                            </select>
                        </td>
                    </tr>
                    <tr>
                        <td><?php echo (L("weight")); ?>:</td>
                        <td>
                            <div id="weight_look"></div>
                            <select id="weight" style="display: none">
                                
                            </select>
                        </td>
                    </tr>
                    <tr>
                        <td><?php echo (L("height")); ?>:</td>
                        <td>
                            <div id="height_look"></div>
                            <select id="height" style="display: none;">
                                
                            </select>
                        </td>
                    </tr>
                </table>
            </div>
        </div>
        <div class="panel" style="float: left;margin-top: 10px">
            <div class="caption">
                <?php echo (L("status")); ?>        <button name="btn_edit" class="btn btn_edit"><?php echo (L("edit")); ?></button>
                <button name="btn_post" class="btn public_btn_blue"><?php echo (L("save it")); ?></button>
            </div>
            <div class="base">
                <table>
                    <tr>
                        <td><?php echo (L("sexuality")); ?>:</td>
                        <td>
                            <div id="sexuality_look"></div>
                            <select id="sexuality" style="display: none">
                            
                            </select>
                        </td>
                    </tr>
                    <tr>
                        <td><?php echo (L("status1")); ?>:</td>
                        <td>
                            <div id="relationship_look"></div>
                            <select id="relationship" style="display: none">
                                
                            </select>
                        </td>
                    </tr>
                </table>
            </div>
        </div>
        <div class="panel" style="float: right;margin-top: 10px">
            <div class="caption">
                <?php echo (L("education and work")); ?>        
                <button name="btn_edit" class="btn btn_edit"><?php echo (L("edit")); ?></button>
                <button name="btn_post" class="btn public_btn_blue"><?php echo (L("save it")); ?></button>
            </div>
            <div class="base">
                <table>
                    <tr>
                        <td><?php echo (L("education")); ?>:</td>
                        <td>
                            <div id="education_look"></div>
                            <select id="education" style="display: none">
                                
                            </select>
                        </td>
                    </tr>
                    <tr>
                        <td><?php echo (L("job")); ?>:</td>
                        <td>
                            <div id="work_look"></div>
                            <input type="text" id="work" style="display: none">
                        </td>
                    </tr>
                    <tr>
                        <td><?php echo (L("income")); ?>:</td>
                        <td>
                            <div id="income_look"></div>
                            <select id="income" style="display: none">
                                
                            </select>
                        </td>
                    </tr>
                </table>
            </div>
        </div>

        <div class="panel" style="float: left;margin-top: 10px">
            <div class="caption">
                <?php echo (L("place")); ?>       
                <button name="btn_edit" class="btn btn_edit"><?php echo (L("edit")); ?></button>
                <button name="btn_post" class="btn public_btn_blue"><?php echo (L("save it")); ?></button>
            </div>
            <div class="base">
                <table>
                    <tr>
                        <td><?php echo (L("country")); ?>:</td>
                        <td>
                            <div id="country_look"></div>
                            <input id="country" type="text" style="display: none">
                        </td>
                    </tr>
                    <tr>
                        <td><?php echo (L("city")); ?>:</td>
                        <td>
                            <div id="city_look"></div>
                            <input id="city" type="text" style="display: none">
                        </td>
                    </tr>
                </table>
            </div>
            <!-- <script type="text/javascript" charset="utf-8" src="/Public/Index/js/first.js"></script> -->
        </div>
    </div>
    <!-- 头像设置 -->
    <div id="setli_2Date" class="setli_2Date" style="display: none;">
        
        <div id="browse" class="browse">
            <div id="upload2" >
            </div>
            <a><?php echo (L("choose photo")); ?></a>
        </div>
        <div id="raw2" class="raw"></div>
        <div id="preview2" class="preview" style="overflow: hidden;">
            <img style="margin-left: 0px; margin-top: 0px;" height="203" width="203"/>
        </div>
        <div id="setImg" class="setimg" style="margin-top: 370px;">
            <input id="setImgOK" type="button" value="<?php echo (L("done")); ?>" />
        </div>    
    </div>

    <!-- 修改密码 -->
    <div id="setli_3Date" class="setli_3Date" style="display: none;">
        <form method="post" action="">
            <table style="height: 100px;">
            <tbody>
                <tr><!-- 后台获取原始密码，输入是判断是否一致 -->
                    <td><?php echo (L("Original password")); ?> :</td>
                    <td><input id="Original_pass" type="password"></td>
                </tr>
                <tr>
                    <td><?php echo (L("new password")); ?> :</td>
                    <td><input id="pass1" type="password"></td>
                </tr>
                <tr>
                    <td><?php echo (L("enter new password again")); ?> :</td>
                    <td><input id="pass2" type="password"></td>
                </tr>
            </tbody>
            </table>
            <div id="error_info" >
            </div> 
        </form>
        <div class="setimg">
            <input type="button" value="<?php echo (L("confirm")); ?>" id="submit_ok" />
            <input type="reset" id="submit_reset" onclick="document.getElementById('pass1').value='';document.getElementById('pass2').value='';document.getElementById('Original_pass').value='';document.getElementById('error_info').innerHTML='';" value="<?php echo (L("cancel")); ?>" />
        </div>
    </div>

</div>


<div id="MaskBox" style="z-index: 2147483647; opacity: 0.6; height:100%; display:none;" class="gwx_dialog_mask">
<!-- 黑色的  遮罩层-->
</div>
<div id="MaskContent" style="z-index: 2147483647; position:absolute; height: 360px; width:700px; display:none;" class="gwx_dialog_win_outer">
    <div  class="gwx_dialog_win">
        <div class="gwx_dialog_north">
            <span id="gwx_dialog_title"><?php echo (L("Email auth")); ?></span>
            <div id="gwx_dialog_close" class="gwx_dialog_close"></div>
        </div>
        <div class="gwx_dialog_ifm_loading" style=" height: auto;">
            <iframe id="MyFrame" class="gwx_dialog_ifm" src="" style="width:700px;height: 320px;" frameborder="0">
            </iframe>
        </div>
    </div>
</div>

<script type="text/javascript" charset="utf-8" src="/Public/Index/Js/common.js"></script>
<script type="text/javascript" charset="utf-8" src="/Public/Index/Js/home.js"></script>
<script type="text/javascript" charset="utf-8" src="/Public/Index/Js/GwxDialog.js"></script>
<!-- <script type="text/javascript" charset="utf-8" src="/Public/Index/Js/GwxPhotoUploader.js"></script> -->
<script type="text/javascript" charset="utf-8" src="/Public/Index/Js/GwxFace_0829.js"></script>
<script type="text/javascript" charset="utf-8" src="/Public/Index/Js/chat.js?2"></script>
<script src="/Public/Index/Js/GwxPhotoCutter_1126_d.js"></script>
<script src="/Public/Index/Js/GwxPhotoUploader_d.js"></script>
<script src="/Public/Index/Js/d_avatar_d.js"></script>
<script src="/Public/Index/Js/s_about.js"></script>
<script>
var _hmt = _hmt || [];
(function() {
  var hm = document.createElement("script");
  hm.src = "https://hm.baidu.com/hm.js?9dedf994d48fce2a4765a9168d878887";
  var s = document.getElementsByTagName("script")[0]; 
  s.parentNode.insertBefore(hm, s);
})();
</script>

</body>
</html>