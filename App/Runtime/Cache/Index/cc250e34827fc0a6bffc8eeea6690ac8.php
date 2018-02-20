<?php if (!defined('THINK_PATH')) exit();?><!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html>
<head>
    <meta http-equiv="content-type" content="text/html;charset=utf-8">
    <link rel="stylesheet" type="text/css" href="/Public/Index/Css/encounter.css">
    <link rel="stylesheet" type="text/css" href="/Public/Index/Css/flower.css">
    <link rel="stylesheet" type="text/css" href="/Public/Index/Css/d_virtual_d.css">
    <style>
      #panel1 .list .item img{ width: 100%; height: auto; }
    </style>
</head>
<body>
<div class="nav">
    <div id="nav11" class="nav_link nav_focus" onclick="nav_panel('nav11','panel1')"><?php echo (L("virtual gift")); ?></div>
    <div class="nav_line"></div>

    <div id="nav12" class="nav_link" onclick="nav_panel('nav12','panel2')"><?php echo (L("valentine's day")); ?></div>  
    <div class="nav_line"></div>

    <div id="nav13" class="nav_link" onclick="nav_panel('nav13','panel3')"><?php echo (L("real gift")); ?></div> 
    <div class="nav_line"></div>

</div>
<div id="panel3" class="public_panel panel_flower panel_flowerset" style="display: none;">
    <!--   真实礼物的  页面  -->

</div>
<div id="panel2" class="public_panel panel_flower panel_flowerset" style="display:none;">
  
    <!--   情人节礼物的  页面  -->

</div>
<!--   虚拟礼物的  页面  -->
<div id="panel1" class="public_panel panel_flower" style="display:block;"> 
    <div class="words" style="padding-bottom:20px; margin-top:3px;">
       <label for="Uname" style="background: #79ca04;"><?php echo (L("to")); ?>：</label>
       <input id="Uname" style="color: #2d57a1;font-size: 14px;width: 480px;float: none;" type="text">
       <input id="search" type="button" value="Search" style="color: #2d57a1;font-size: 14px;width: 70px;height: 30px;font-weight: 800;">
       <input id="Uid" type='hidden'>
       <input id="Fid" type='hidden'>
       <input id="price" type='hidden'>
    </div>
    <div class="panelj" id="panelj">
        <div id="tab" class="tab">
        </div>
        
    </div>
    <div class="words">
       <label for="words"><?php echo (L("Zengyan")); ?></label>
       <input id="words" type="text">
    </div>
    <div class="but_div">
       <!-- <input type="button" value="取消" class="but_cancel"> -->
       <input type="button" value="<?php echo (L("send")); ?>" id="but_send" class="but_send" >
    </div>
</div>
<script src="/Public/Index/Js/encounter_d.js"></script>
<script src="/Public/Index/Js/flower_d.js"></script>
<!-- <script src="/Public/Index/Js/d_virtual_d.js"></script> -->
</body>
</html>