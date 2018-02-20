<?php if (!defined('THINK_PATH')) exit();?><!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
    <meta http-equiv="content-type" content="text/html;charset=utf-8">
    <link rel="stylesheet" type="text/css" href="/Public/Index/Css/first.css?21121">
    <style>
        .ad_wrp img{ width: 100%; height: 100%; }
        .r_item{ width: 190px; margin-left: 18px;}
        .r_item img{  width: 100%; height: auto;}
        .r_name{ width: 115px; }
        .r_mood{ display: none; }
        .r_bar{ width: 100%; }
        .r_favor{ margin-left: 12px; }
    </style>
</head>
<body>
<a target="_self"  class="ad_wrp" id="ad_banner">
    <?php if(!empty($banner)): ?><img src="<?php echo ($banner); ?>"/>  
    <?php else: ?>
        <img src="/Public/Index/Images/banner.gif"/><?php endif; ?>
</a>

<div class="mood">
    <div class="mood_caption"><em class="mood_edit"></em><?php echo (L("update status")); ?></div>
    <div class="mood_textarea_outer">
        <textarea class="mood_textarea" id="mood_textarea"></textarea>
    </div>
    <div id="mood_bar" class="mood_bar">
        <div id="mood_btn_face" class="mood_btn mood_face">
            <dl id="mood_face_viewer" class="mood_bar_viewer">
                <dd class="mood_arrow"></dd>
                <dd id="mood_face_panel" class="mood_face_panel">
                    
                </dd>
            </dl>
        </div>
        <div id="mood_btn_camera" class="mood_btn mood_camera">
            <div id="camera_object">
                
            </div>
        </div>
        <div id="mood_btn_enter" class="mood_enter"><?php echo (L("post")); ?></div>
        <div id="mood_btn_trans" class="mood_btn mood_trans">
            <dl id="mood_trans_viewer" class="mood_bar_viewer">
                <dd class="mood_arrow"></dd>
            </dl>
        </div>
    </div>
    <dl id="mood_camera_viewer" class="mood_camera_viewer">
        <dd class="mood_arrow"></dd>
        <dd id="mood_camera_close" class="mood_camera_close"></dd>
        <dd id="mood_camera_photo" class="mood_camera_photo"></dd>
    </dl>
</div>
<div class="nav">
    <div id="nav1" class="nav_link nav_focus"><?php echo (L("recommend")); ?></div>     
    <div class="nav_line"></div>
    <div id="nav2" class="nav_link" ><?php echo (L("news feed")); ?></div>      
    <div class="nav_line"></div>
</div>

<div id="panel1" class="panel1" style="display:block;"> 
</div>
<div id="panel2" class="panel2" style="display:none;">  
</div>

<script src="/Public/Index/Js/GwxPhotoUploader.js"></script>
<script src="/Public/Index/Js/first.js?3456"></script>
</body>
</html>