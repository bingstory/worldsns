<?php if (!defined('THINK_PATH')) exit();?><!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns:wb="http://open.weibo.com/wb">
<head>
    <title><?php echo (L("title")); ?></title>
    <meta http-equiv="X-UA-Compatible" content="IE=9; IE=8; IE=7; IE=EDGE">
    <meta http-equiv="content-type" content="text/html;charset=utf-8">
    <meta name="Keywords" content="<?php echo (L("Keywords")); ?>"/>
    <meta name="description" content="<?php echo (L("description")); ?>"/>
    <link rel="Bookmark" type="image/x-icon" href="/Public/Index/Images/favicon.ico">
    <link rel="shortcut icon" type="image/x-icon" href="/Public/Index/Images/favicon.ico">
    <meta property="qc:admins" content="2041450627605241456375"/>
    <meta property="wb:webmaster" content="5095a0b1f6ec9d15"/>
    <link type="text/css" rel="stylesheet" href="/Public/Index/Css/login.css">
    <style>
.reg_tip{ right: 320px; }
.ad_wrp img{ width: 100%; height: 100%; }
.reg_main{ 
    display: none; 
    padding: 0; 
    margin-top: 0; 
    width: 320px;
}
.login_main_up{
    float: right;
    height: 40px;
    line-height: 40px;
    text-align: center;
    width: 320px;
    margin-top: 60px; 
    padding: 0px;
    border-radius: 0px;
    position: relative;
    background: none;
    color: #000;
}
.blogin{
    font-size: 16px;
    color: #333;
    width: 50%;
    float: left;
    background: rgba(255, 255, 255, 0.5) none repeat scroll 0 0 !important;
    filter: Alpha(opacity=50);
}
.breg{
    font-size: 16px;
    color: #333;
    width: 50%;
    float: left;
        background: rgba(255, 255, 255, 0.5) none repeat scroll 0 0 !important;
    filter: Alpha(opacity=50);
}
.bactive{
    background: rgba(255, 255, 255, 0.9) none repeat scroll 0 0 !important;

}

.bclear{
    clear: both;
    height: 0px;
    width: 100%;
}
 
.join,.encounter,.fun,.case{ display: none; }
.head_input{
    width: 237px;
    height: 35px;
    padding: 0 5px;
    border-radius: 0;
}


    </style>
</head>
<body>
    <div class="head">
        <div class="wrp">
            <em class="head_logo">
                <?php if(!empty($webinfo["logo"])): ?><img width="180px" height="45px" src="<?php echo ($webinfo["logo"]); ?>"> 
                <?php else: ?>
                    <img width="180px" height="45px" src="/Public/Index/Images/ymz_logo.png" /><?php endif; ?> 
            </em>
            <dl class="head_lang">
                <dd id="head_lang_txt" class="head_lang_txt"><?php echo ($lang); ?></dd>
                <dd class="head_lang_arrow"></dd>
                <dd id="head_lang_viewer" class="head_lang_viewer" style=" height:106px; overflow:hidden;">
                    <a class="head_lang_item" href="<?php echo U('Index/Index/index',array('l'=>'zh-cn'));?>">中文简体</a>
                    <a class="head_lang_item" href="<?php echo U('Index/Index/index',array('l'=>'zh-tw'));?>">中文-繁體</a>
                    <a class="head_lang_item" href="<?php echo U('Index/Index/index',array('l'=>'en-us'));?>">English</a>
                    <a class="head_lang_item" href="<?php echo U('Index/Index/index',array('l'=>'ja'));?>">日本語</a>
                    <a class="head_lang_item" href="<?php echo U('Index/Index/index',array('l'=>'ko-kr'));?>">한국의</a>
                    <a class="head_lang_item" href="<?php echo U('Index/Index/index',array('l'=>'de'));?>">Deutsch</a>
                    <a class="head_lang_item" href="<?php echo U('Index/Index/index',array('l'=>'es'));?>">Español</a>
                    <a class="head_lang_item" href="<?php echo U('Index/Index/index',array('l'=>'fra'));?>">Français</a>
                    <a class="head_lang_item" href="<?php echo U('Index/Index/index',array('l'=>'it'));?>">Italiano</a>
                    <a class="head_lang_item" href="<?php echo U('Index/Index/index',array('l'=>'nl'));?>">Nederlandse</a>
                    <a class="head_lang_item" href="<?php echo U('Index/Index/index',array('l'=>'pt'));?>">Português</a>
                    <a class="head_lang_item" href="<?php echo U('Index/Index/index',array('l'=>'ru'));?>">Русский</a>
                </dd>
            </dl>
           
        </div>
    </div>
    <?php if(!empty($webinfo["indexbg1"])): ?><div class="reg" style="background:url(<?php echo ($webinfo["indexbg1"]); ?>) no-repeat center 0 / cover;">
    <?php else: ?>
        <div class="reg" style="background:url(/Public/Index/Images/bg1.jpg) no-repeat center 0 / cover;"><?php endif; ?>
        <div class="wrp">
            <div class="login_main_up">
                <div class="blogin bnav bactive" data-inreg="login">
                    Login
                </div>
                 <div class="breg bnav" data-inreg="reg">
                    Register
                </div>
            </div>
            <div class="bclear"></div>
            <form id="reg_form" class="reg_main bform" >
                <input type="hidden" name="reg_birth" id="reg_birth">
                <input type="hidden" name="reg_md5pwd" id="reg_md5pwd">
                <input type="hidden" name="reg_fid" id="reg_fid" value="">
                <input type="hidden" name="reg_sid" id="reg_sid" value="">
                <div class="reg_caption"><?php echo (L("reg caption")); ?></div>
                <table class="reg_table">
                    <tr>
                        <td class="reg_td0">
                            <dl id="reg_email_tip"></dl>
                            </td>
                        <td><input placeholder="<?php echo (L("email")); ?>" type="email" class="reg_input" id="reg_email" name="reg_email" /></td>
                    </tr>
                    <tr>
                        <td class="reg_td0">
                            <dl id="reg_alias_tip"></dl>
                            </td>
                        <td><input placeholder="<?php echo (L("name")); ?>" type="text" class="reg_input" id="reg_alias" name="reg_alias"/></td>
                    </tr>
                    
                    <tr>
                        <td class="reg_td0">
                            <dl id="reg_pwd_tip"></dl>
                            </td>
                        <td><input placeholder="<?php echo (L("password")); ?>" type="password" class="reg_input" id="reg_pwd" name="reg_pwd"/></td>
                    </tr>
                    <tr>
                        <!-- <td class="reg_td0">
                            <dl id="reg_pwd2_tip" >
                            </dl>
                            <?php echo (L("Retype Password")); ?>
                        </td>
                        <td><input type="password" class="reg_input" id="reg_pwd2" name="reg_pwd2"/></td> -->

                        <td class="reg_td0">
                            <dl id="reg_pwd2_tip" class="reg_tip" style="right: 320px;display: none;">
                                <dd class="reg_tip_arrow"></dd>
                                <dd class="reg_tip_txt" id="reg_tip_txt2"></dd>
                            </dl>
                            </td>
                        <td><input placeholder="<?php echo (L("Retype Password")); ?>" type="password" class="reg_input" id="reg_pwd2" name="reg_pwd2" onblur="checkPWD()" /></td>
                    </tr>
                    <script type="text/javascript">
                        function checkPWD(){
                            var PWD = document.getElementById("reg_pwd").value;
                            var PWD2 = document.getElementById("reg_pwd2").value;
                            if (PWD!=PWD2) {
                                document.getElementById("reg_pwd2_tip").style.display="block";
                                document.getElementById("reg_tip_txt2").innerHTML="<?php echo (L("not_equal")); ?>";
                            } else {
                                //alert("ok");
                            } 
                        }
                    </script>
                    <tr>
                        <td class="reg_td0">
                            <dl id="reg_birth_tip"></dl>
                           <!--  <?php echo (L("birthday")); ?> --></td>
                        <td>
                            <select id="reg_month" name="reg_month">
                                <option value="-1"><?php echo (L("month")); ?></option>
                                
                            </select>
                            <select id="reg_day" name="reg_day">
                                <option value="-1"><?php echo (L("day")); ?></option>
                                
                            </select>
                            <select id="reg_year" name="reg_year" style="margin-right: 0">
                                <option value="-1"><?php echo (L("year")); ?></option>
                                
                            </select>
                        </td>
                    </tr>
                    <tr>
                        <td class="reg_td0"><!-- <?php echo (L("gender")); ?> --></td>
                        <td>
                            <input id="reg_gender1" checked name="reg_gender" type="radio" value="male">
                            <label for="reg_gender1"><?php echo (L("male")); ?></label>
                            <input id="reg_gender2" name="reg_gender" value="female" type="radio">
                            <label for="reg_gender2"><?php echo (L("female")); ?></label>
                        </td>
                    </tr>
                </table>
                <div id="reg_btn"><?php echo (L("sign up")); ?></div>
                <div class="reg_bar">
                    <em id="vk_auth" class="reg_auth reg_vk"></em><!-- vk.com 账号登录的界面   NO-->
                  <em id="fb_auth" class="reg_auth reg_fb"></em>   <!--facebook.net 账号登录的界面   NO-->
                </div>
            </form>
            <div class="login_main bform">
 <table class="login_table">
                    <tr>
                        <td class="login_td0"> </td>
                        <td>
                            <?php if(!empty($name)): ?><input id="name" type="text" value="<?php echo (L("email/phone")); ?>" class="head_input head_input_mask" value="<?php echo ($name); ?>"/>
                    <?php else: ?>
                        <input id="name" type="text" value="<?php echo (L("email/phone")); ?>" class="head_input head_input_mask"/><?php endif; ?>
                </td>
                    </tr>
                    <tr>
                        <td class="login_td0"> </td>
                        <td>
<dd>
                    
                    <input id="pwd" type="password" placeholder="<?php echo (L("password")); ?>" value="" class="head_input  head_input_mask"/>
                </dd>
                        </td>
                    </tr>
                    
                    <tr style="height: 30px;">
                        <td class="login_td0"> </td>
                        <td>
                            
            <dl class="head_east">
                
                <dd><a href="index.php?m=Index&c=Forget&a=index" class="head_find" target="_self"><?php echo (L("Forget password")); ?></a></dd>
            </dl>
                        </td>
                    </tr>
                     <tr>
                        <td class="login_td0"> </td>
                        <td>
                             <button id="head_login"><?php echo (L("login")); ?></button>
                             
                        </td>
                    </tr>
                </table>




                
            </div>
        </div>
    </div>

    <style>
.reg_bar{ display: none; }
.reg_table label{ color: #333; }
.reg_caption{ display: none; }
.reg_td0{
    width: 0 !important;
    min-width: 0 !important;
    max-width: 0 !important;
}
#head_reg{
    border-radius: 50px;
    width: 90%;
    height: 33px;
    background: #2d57a1;
    margin: 0 auto 10px;
}
.reg_main {
    float: right;
    /*margin-top: 60px;*/
    background:rgba(255, 255, 255, 0.9) none repeat scroll 0 0 !important;
    border-radius: 0;
    /*padding: 20px;*/
    width: 320px;
    position: relative;
}
.reg_input{
    width: 237px;
    height: 35px;
    padding: 0 5px;
    border-radius: 0;
    border: none;
}
#reg_btn{
    border-radius: 50px;
    width: 90%;
    height: 33px;
    line-height: 33px;
    padding: 0;
    background: #2d57a1;
    margin: 0 auto 20px;
    font-weight: normal;
}

#reg_btn:hover{ background:#285ebf!important;}


        /*登录框的样式，后期来优化*/

.head_input{
    width: 237px;
    height: 35px;
    padding: 0 5px;
    border-radius: 0;
    margin-left: 0;
}

.login_td0{
    width: 0 !important;
    min-width: 0 !important;
    max-width: 0 !important;
}
#head_login{
    border-radius: 50px;
    width: 90%;
    height: 33px;
    background: #2d57a1;
    margin: 0 auto 10px;
}
#head_login:hover{ background:#285ebf!important;}

.head_find{
    color: #333;
}
.head_east{
    margin: 0;
}
.login {
    overflow: hidden;
    width: 100%;
    height: 804px;
    /*background: url('img/bg1.jpg') no-repeat center 0; */
    background-size: cover;
    /*filter: progid:DXImageTransform.Microsoft.AlphaImageLoader(src="/theme/img/bg1.jpg", sizingMethod="scale");*/

}

.login_main {
    float: right;
    /*margin-top: 60px;*/
    background:rgba(255, 255, 255, 0.9) none repeat scroll 0 0 !important;
    border-radius: 0;
    /*padding: 20px;*/
    width: 320px;
    position: relative;
}

.login_caption {
    color: white;
    font-size: 18px;
    text-align: center;
    margin-bottom: 15px;
}

.login_tip_info {
    border-radius: 3px;
    padding: 2px 5px;
    line-height: 20px;
    color: #3e95e5;
    /*background-color: lightgoldenrodyellow;*/
}

.login_table {
    font-size: 13px;
    color: white;
}

.login_table tr {
    height: 53px;
}

.login_table select {
    color: #5D5D5D;
    width: 68px;
    height: 25px;
    margin-right: 10px;
    padding: 2px 0 3px \9;
    border-radius: 3px;
    border: 1px solid #e9e9e9;
}

.login_table label, #login_gender1, #login_gender2 {
    cursor: pointer;
}

.login_td0 {
    min-width: 36px;
    max-width: 70px;
    line-height: 12px;
    padding-right: 15px;
}

.login_tip {
    position: absolute;
    right: 0;
    margin-top: -5px;
    margin-right: -5px;
    width: 100%;
    display: none;
}

.login_tip_txt {
    color: white;
    line-height: 16px;
    background: #D35465;
    border-radius: 3px;
    margin-right: 10px;
    padding: 6px 8px;
    min-width: 30px;
    float: right;
    display: inline-block;
}

.login_tip_arrow {
    margin-top: 8px;
    border: 5px solid transparent;
    border-left-color: #D35465;
    position: absolute;
    right: 0;
}

#login_gender2 {
    margin-left: 30px;
}

.login_input {
    color: #5D5D5D;
    width: 220px;
    height: 25px;
    padding: 0 5px;
    font-size: 13px;
    line-height: 25px \9;
    border: 1px solid lightgray;
    border-radius: 3px;
    font-family: Helvetica, "Microsoft Yahei", Arial, sans-serif;
}

#login_btn {
    margin: 20px auto;
    padding: 5px 0;
    width: 80%;
    display: block;
    font-size: 18px;
    line-height: 25px;
    border-radius: 30px;
    color: white;
    cursor: pointer;
    text-align: center;
    font-weight: bolder;
    border: none;
    background-image: -moz-linear-gradient(bottom, #3ec73b, #38ea3c);
    background-image: -webkit-linear-gradient(bottom, #3ec73b, #38ea3c);
    background-image: -ms-linear-gradient(bottom, #3ec73b, #38ea3c);
    background-color: #3ec73b;
}

#login_btn:hover {
    background-image: -moz-linear-gradient(bottom, #38ea3c, #3ec73b);
    background-image: -webkit-linear-gradient(bottom, #38ea3c, #3ec73b);
    background-image: -ms-linear-gradient(bottom, #38ea3c, #3ec73b);
    background-color: #38ea3c;
}

.login_bar {
    text-align: center;
    padding-top: 16px;
    padding-left: 10px;
    background: url(/Public/Index/Images//line.png) no-repeat center 0;
}

.login_bar span {
    color: white;
    line-height: 36px;
    display: inline-block;
    float: left;
}

.login_auth {
    cursor: pointer;
    vertical-align: top;
    display: inline-block;
    width: 36px;
    height: 36px;
    margin: 0 10px;
    background: url(/Public/Index/Images/login.png) no-repeat;
}

.login_vk {
    background-position: -146px -53px;
}

.login_vk:hover {
    background-position: -146px -99px;
}

.login_fb {
    background-position: -195px -53px;
}

.login_fb:hover {
    background-position: -195px -99px;
}
    </style>
    <div class="join">
        <div class="wrp">
            <!-- <div class="join_caption"><?php echo (L("join caption")); ?></div> 原来-->

            <div class="encounter_line1"><?php echo (L("join caption")); ?></div>
            <div class="encounter_line2"><?php echo (L("join caption2")); ?></div>
        </div>
        <!-- 原来的图片 -->
        <!-- <?php if(!empty($webinfo["indexbg2"])): ?><div class="join_section" style="background: url(<?php echo ($webinfo["indexbg2"]); ?>) no-repeat center;"></div>
        <?php else: ?>
            <div class="join_section" style="background: url(/Public/Index/Images/bg2.jpg) no-repeat center;"></div><?php endif; ?> -->
        
        <div class="join_section" style="height: 260px;">
            <div id="maq" style="height:240px; width:1100px; overflow:hidden; margin:20px auto;">
                <table>
                    <tr>
                        <td id="m1">
                            <table>
                              <tr>
                                <td>
                                    <img src="/Public/Upload/header/wu001.jpg" width="196" height="230" />
                                </td>
                                <td>
                                    <img src="/Public/Upload/header/wu002.jpg" width="196" height="230" />
                                </td>
                                <td>
                                    <img src="/Public/Upload/header/wu003.jpg" width="196" height="230" />
                                </td>
                                <td>
                                    <img src="/Public/Upload/header/wu0005.jpg" width="196" height="230" />
                                </td>
                                <td>
                                    <img src="/Public/Upload/header/wu0006.jpg" width="196" height="230" />
                                </td>
                                <td>
                                    <img src="/Public/Upload/header/wu0009.jpg" width="196" height="230" />
                                </td>
                                <td>
                                    <img src="/Public/Upload/header/wu0010.jpg" width="196" height="230" />
                                </td>
                                <td>
                                    <img src="/Public/Upload/header/wu00012.jpg" width="196" height="230" />
                                </td>
                              </tr>
                            </table>
                        </td>
                        <td id="m2">
                        
                        </td>
                    </tr>
                </table>
            </div>
        </div>
    </div>
    <div class="encounter">
        <div class="wrp">
            <div class="encounter_line1"><?php echo (L("encounter line1")); ?></div>
            <div class="encounter_line2"><?php echo (L("encounter line2")); ?></div>
        </div>
        <?php if(!empty($webinfo["indexbg3"])): ?><div class="encounter_section" style="background: url(<?php echo ($webinfo["indexbg3"]); ?>) no-repeat #fff;"></div>
        <?php else: ?>
            <div class="encounter_section" style="background: url(/Public/Index/Images/bg3.jpg) no-repeat #fff;"></div><?php endif; ?>
    </div>
    <div class="fun">
        <?php if(!empty($webinfo["indexbg4"])): ?><div class="wrp fun_wrp" style="background: url(<?php echo ($webinfo["indexbg4"]); ?>) no-repeat left 70px;">
        <?php else: ?>
            <div class="wrp fun_wrp" style="background: url(/Public/Index/Images/bg4.jpg) no-repeat left 70px;"><?php endif; ?>
            <table class="fun_table">
                <tr>
                    <td colspan="2" class="fun_line1"><?php echo (L("fun line1")); ?></td>
                </tr>
                <tr>
                    <td class="fun_icon fun_icon1"></td>
                    <td class="fun_line2"><?php echo (L("fun icon1")); ?></td>
                </tr>
                <tr>
                    <td class="fun_icon fun_icon2"></td>
                    <td class="fun_line2"><?php echo (L("fun icon2")); ?></td>
                </tr>
                <tr>
                    <td class="fun_icon fun_icon3"></td>
                    <td class="fun_line2"><?php echo (L("fun icon3")); ?></td>
                </tr>
            </table>
        </div>
    </div>
    <div class="case">
        <div class="wrp">
            <div class="case_line1"><?php echo (L("case line1")); ?></div>
            <div class="case_line2"><?php echo (L("case line2")); ?></div>
            <table class="case_table">
                <tr>
                    <td>
                        <div class="case_icon case_icon1"></div>
                        <div class="case_txt case_txt1"><?php echo (L("case icon1")); ?></div>
                    </td>
                    <td>
                        <div class="case_icon case_icon2"></div>
                        <div class="case_txt case_txt2"><?php echo (L("case icon2")); ?></div>
                    </td>
                    <td style="float: right;">
                        <div class="case_icon case_icon3"></div>
                        <div class="case_txt case_txt3"><?php echo (L("case icon3")); ?></div>
                    </td>
                </tr>
            </table>
        </div>
    </div>
    <!--<div class="phone">
        <?php if(!empty($webinfo["indexbg5"])): ?><div class="wrp phone_wrp"  style="background: url(<?php echo ($webinfo["indexbg5"]); ?>) repeat 0 0;">
        <?php else: ?>
            <div class="wrp phone_wrp"  style="background: url(/Public/Index/Images/bg5.jpg) repeat 0 0;"><?php endif; ?>
            <table class="phone_table">
                <tr>
                    <td colspan="2" class="phone_caption">
                        <div class="phone_line1"><?php echo (L("phone line1")); ?></div>
                        <div class="phone_line2"><?php echo (L("phone line2")); ?></div>
                    </td>
                </tr>
                app 的二维码  图片 + 链接
                <tr>
                    <td>
                        <a class="phone_link phone_ios" target="_blank" style="background:url(/Public/Index/Images/app.png) no-repeat ;"
                           href="https://itunes.apple.com/cn/app/yangxifu/id919483283?mt=8"></a>
                    </td>
                    <td>
                        <a class="phone_link phone_android" target="_blank" style="background:url(/Public/Index/Images/app.png) no-repeat -200px 0;"
                           href="https://play.google.com/store/apps/details?id=com.jshon.yangxifu&hl=zh-CN"></a>
                    </td>
                </tr>
                
            </table>
        </div>
    </div>-->
    <div class="bottom">
        Copyright © <?php echo ($webinfo['copyright']); ?> All Rights Reserved&nbsp;&nbsp;&nbsp;|
        <a id="about_btn0" href="<?php echo U('Index/Declare/index',array('item'=>'about'));?>"><?php echo (L("about us")); ?></a>|
        <a id="about_btn1" href="<?php echo U('Index/Declare/index',array('item'=>'terms'));?>"><?php echo (L("terms of use")); ?></a>|
        <a id="about_btn2" href="<?php echo U('Index/Declare/index',array('item'=>'privacy'));?>"><?php echo (L("privacy policy")); ?></a>|
        <a id="about_btn3" href="<?php echo U('Index/Declare/index',array('item'=>'safe'));?>"><?php echo (L("dating safety")); ?></a>|
        <a id="about_btn4" href="<?php echo U('Index/Declare/index',array('item'=>'help'));?>"><?php echo (L("help center")); ?></a>|
        <a id="about_btn5" href="<?php echo U('Index/Declare/index',array('item'=>'contact'));?>"><?php echo (L("contact us")); ?></a>
    </div>

    <?php if($l == 'zh-cn'): ?><script type="text/javascript" charset="utf-8">
            document.langCode = "zh";
            document.i18n ={"tip_alias":"请输入您的姓名","tip_pwd":"请输入至少6个字符，可以是数字、英文字母、下划线","tip_email":"请输入您正确的邮箱，可以登陆网站使用","tip_birth":"请选择您的生日","tip_email_exist":"邮箱已注册过，请直接登陆或更换其他邮箱","tip_username_exist":"该用户名已存在","reg_failed":"注册失败",'being audited':"您的账户正在审核中"};
        </script>
    <?php elseif($l == 'zh-tw'): ?>
        <script type="text/javascript" charset="utf-8">
            document.langCode = "zh-tw";
            document.i18n ={"tip_alias":"請輸入您的姓名","tip_pwd":"請輸入至少6個字符,可以是數字、英文字母、下劃線","tip_email":"請輸入您正確的郵箱，可以登陸網站使用","tip_birth":"請選擇您的生日","tip_email_exist":"郵箱已註冊過，請直接登陸或更換其他郵箱","tip_username_exist":"該用戶名已存在","reg_failed":"注册失敗",'being audited':"您的帳號正在稽核"};
        </script>
    <?php elseif($l == 'en-us'): ?>
        <script type="text/javascript" charset="utf-8">
            document.langCode = "en";
            document.i18n ={"tip_alias":"Please enter your name","tip_pwd":"Use at least 6 characters (numbers,letters or underline)","tip_email":"Enter your email address,you can login with this email","tip_birth":"Select your date of birth","tip_email_exist":"Your email has been registered!","tip_username_exist":"The user name already exists","reg_failed":"Registration failure",'being audited':"Your account is being audited."};
        </script>
    <?php elseif($l == 'ko-kr'): ?>
        <script type="text/javascript" charset="utf-8">
            document.langCode = "ko";
            document.i18n ={"tip_alias":"이름을 입력하세요","tip_pwd":"적어도 6 자 (숫자, 문자 또는 밑줄)를 사용하여","tip_email":"귀하의 이메일 주소를 입력, 당신은이 이메일로 로그인 할 수 있습니다","tip_birth":"당신의 생일을 입력하세요","tip_email_exist":"E-메일이 등록되어 있습니다","tip_username_exist":"그 이름이 이미 존재합니다.","reg_failed":"등록 실패",'being audited':"당신의 계좌 지금 심사"};
        </script>
    <?php elseif($l == 'es'): ?>
        <script type="text/javascript" charset="utf-8">
            document.langCode = "es";
            document.i18n ={"tip_alias":"Por favor, introduzca su nombre","tip_pwd":"Utilice por lo menos 6 caracteres (números, letras o subrayado)","tip_email":"Introduzca su dirección de correo electrónico, puede iniciar sesión con este correo electrónico","tip_birth":"Por favor, introduzca su cumpleaños","tip_email_exist":"E-mail ha sido  registrado","tip_username_exist":"Ya existe el nombre de usuario","reg_failed":"No de registro",'being audited':"Su cuenta es de auditoría"};
        </script>
    <?php elseif($l == 'ja'): ?>
        <script type="text/javascript" charset="utf-8">
            document.langCode = "ja";
            document.i18n ={"tip_alias":"あなたの名前を入力してください","tip_pwd":"少なくとも6文字（数字、文字またはアンダーライン）を使用します","tip_email":"あなたのメールアドレスを入力してください、あなたはこのメールにログインすることができます","tip_birth":"あなたの誕生日を入力してください","tip_email_exist":"電子メールは、登録されている","tip_username_exist":"ユーザー名はすでに存在している","reg_failed":"登録失敗",'being audited':"あなたのアカウントは審査しています"};
        </script>
    <?php elseif($l == 'de'): ?>
        <script type="text/javascript" charset="utf-8">
            document.langCode = "de";
            document.i18n ={"tip_alias":"Bitte geben Sie Ihren Namen","tip_pwd":"Verwenden Sie mindestens 6 Zeichen (Ziffern, Buchstaben oder Unterstrich)","tip_email":"Geben Sie einfach Ihre E-Mail-Adresse können Sie mit dieser E-Mail Anmelden","tip_birth":"Bitte geben Sie Ihren Geburtstag","tip_email_exist":"E-Mail registriert wurde","tip_username_exist":"Der benutzername bereits existiert","reg_failed":"注册失敗",'being audited':"Ihr konto ist die überprüfung der"};
        </script>
    <?php elseif($l == 'fra'): ?>
        <script type="text/javascript" charset="utf-8">
            document.langCode = "fr";
            document.i18n ={"tip_alias":"S'il vous plaît entrer votre nom","tip_pwd":"Utilisez au moins 6 caractères (chiffres, lettres ou soulignement)","tip_email":"Entrez votre adresse email, vous pouvez vous connecter avec cet e-mail","tip_birth":"S'il vous plaît entrez votre anniversaire","tip_email_exist":"E-mail a été enregistré","tip_username_exist":"Le nom existe déjà","reg_failed":"Eintragung versagen",'being audited':"Votre compte est à examiner"};
        </script>
    <?php elseif($l == 'it'): ?>
        <script type="text/javascript" charset="utf-8">
            document.langCode = "it";
            document.i18n ={"tip_alias":"Inserisci il tuo nome","tip_pwd":"Utilizzare almeno 6 caratteri (numeri, lettere o sottolineatura)","tip_email":"Inserisci il tuo indirizzo e-mail, è possibile effettuare il login con questa e-mail","tip_birth":"Inserisci il tuo compleanno","tip_email_exist":"E-mail è stato registrato","tip_username_exist":"IL nome utente esiste già","reg_failed":"La registrazione è fallito",'being audited':"IL tuo conto è in corso di Revisione"};
        </script>
    <?php elseif($l == 'nl'): ?>
        <script type="text/javascript" charset="utf-8">
            document.langCode = "nl";
            document.i18n ={"tip_alias":"Voer uw naam in","tip_pwd":"Gebruik minimaal 6 tekens (cijfers, letters of onderstrepen)","tip_email":"Vul uw e-mailadres, kunt u inloggen met dit e-","tip_birth":"Vul uw verjaardag","tip_email_exist":"E-mail is geregistreerd","tip_username_exist":"De naam van de gebruiker zijn","reg_failed":"De registratie heeft gefaald",'being audited':"Uw rekening is."};
        </script>
    <?php elseif($l == 'pt'): ?>
        <script type="text/javascript" charset="utf-8">
            document.langCode = "pt";
            document.i18n ={"tip_alias":"Digite seu nome","tip_pwd":"Use pelo menos 6 caracteres (números, letras ou sublinhado)","tip_email":"Digite seu endereço de e-mail, você pode fazer o login com este e-mail","tip_birth":"Digite seu aniversário","tip_email_exist":"E-mail foi registrado","tip_username_exist":"Este Nome de usuário já existe","reg_failed":"Falha de Registro",'being audited':"A verificação de SUA conta"};
        </script>
    <?php elseif($l == 'ru'): ?>
        <script type="text/javascript" charset="utf-8">
            document.langCode = "ru";
            document.i18n ={"tip_alias":"Пожалуйста, введите ваше имя","tip_pwd":"Используйте не менее 6 символов (цифры, буквы или подчеркивания)","tip_email":"Введите ваш адрес электронной почты, вы сможете войти в это письмо","tip_birth":"выберите дату вашего рождения","tip_email_exist":"Электронная почта была зарегистрирована","tip_username_exist":"это имя пользователя  уже существует","reg_failed":"Ошибка регистрации",'being audited':"ваш номер счета,  рассматривает"};
        </script><?php endif; ?>
    <script type="text/javascript" charset="utf-8" src="/Public/Index/Js/common.js"></script>
    <script type="text/javascript"  charset="utf-8"  src="/Public/Index/Js/login.js?22"></script>
    <script type="text/javascript"  charset="utf-8"  src="/Public/Index/Js/jquery.js"></script>
    <script type="text/javascript"  charset="utf-8"  src="/Public/Index/Js/jquery.md5.js"></script>
 <script>
        $('.bnav').click(function(){
            var inreg = $(this).data('inreg');
            $(this).addClass('bactive').siblings('div').removeClass('bactive');
            $('.bform').hide();
            $('.'+inreg+"_main").show();

            // alert(inreg);
        });
    </script>
    <script type="text/javascript">
         var speed = 200;//滚动速度
         var maq;//显示区域
         var m1;//第一份滚动的内容
         var m2;//第二份滚动的内容（复制的）
         var timer;//定时器
         function run(){
            if(m1.offsetWidth<=maq.scrollLeft){
               maq.scrollLeft-=m1.offsetWidth;
            }else{
               maq.scrollLeft+=6;
            }
        }
        window.onload=function(){
             maq=document.getElementById("maq");
             m1=document.getElementById("m1");
             m2=document.getElementById("m2");
             m2.innerHTML=m1.innerHTML;
          if(timer==null){
           timer=window.setInterval(run,speed);
          }
          maq.onmouseover=function(){
           window.clearInterval(timer);
          }
          maq.onmouseout=function(){
           timer=window.setInterval(run,speed);
          }
        }
    </script>
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