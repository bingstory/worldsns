<?php if (!defined('THINK_PATH')) exit();?><!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html>
<head>
    <meta http-equiv="content-type" content="text/html;charset=utf-8">
    <link href="/Public/Index/Css/s_profile.css" rel="stylesheet" type="text/css">
    <style>
        .east{ width: 734px; }
        .d_caption{ height: 17px; }
    </style>
</head>
<body>
<div class="west">
    <table id="west_bar" class="west_bar">
        <tr>
            <td id="west_bar_favor" colspan="2" class="west_bar_cell1">
                <em class="west_bar_favor"></em><a><?php echo (L("favorite")); ?></a>
            </td>
            <td id="west_bar_like" colspan="2" class="west_bar_cell2">
                <em class="west_bar_like"></em><a><?php echo (L("like")); ?></a>
            </td>
            <td id="west_bar_chat" colspan="2" class="west_bar_cell1">
                <em class="west_bar_chat"></em><a><?php echo (L("chat")); ?></a>
            </td> 
        </tr>
        <tr>
            <!-- <td id="west_bar_flower">
                <em class="west_bar_flower"></em><a><?php echo (L("real gift")); ?></a>
            </td> -->
            <td id="west_bar_report" colspan="3" onclick="tishi()">
                <em class="west_bar_report"></em>
                <a><?php echo (L("report")); ?></a>
            </td>
            <td id="west_bar_gift" colspan="3" class="west_bar_cell3">
                <em class="west_bar_gift"></em><a><?php echo (L("gift")); ?></a>
            </td>
            <!-- <td id="west_bar_upgrade">
                <em class="west_bar_upgrade"></em><a><?php echo (L("help up")); ?></a>
            </td> -->
        </tr>
    </table>
    <div class="west_panel">
        <div class="west_panel_title">
            <?php echo (L("album")); ?>
        </div>
        <div id="west_photo_list" class="west_photo_list">
            
        </div>
    </div>
    <div class="west_panel" style="margin-top: 15px;">
        <div class="west_panel_title">
            <?php echo (L("about me")); ?>
        </div>
        <ul>
            <li>
                <?php echo (L("about me1")); ?>：<span id="user_about"></span>
            </li>
            <li>
                <?php echo (L("sexuality")); ?>：<span id="user_sexuality"></span>
            </li>
            <li>
                <?php echo (L("status1")); ?>：<span id="user_relationship"></span>
            </li>
            <li>
                <?php echo (L("country")); ?>：<span id="user_country"></span>
            </li>
            <li>
                <?php echo (L("city")); ?>：<span id="user_city"></span>
            </li>
            <li>
                <?php echo (L("job")); ?>：<span id="user_work"></span>
            </li>
            <li>
                <?php echo (L("income")); ?>：<span id="user_income"></span>
            </li>
            <li>
                <?php echo (L("age")); ?>：<span id="user_age"></span>
            </li>
            <li>
                <?php echo (L("weight")); ?>：<span id="user_weight"></span>
            </li>
            <li>
                <?php echo (L("height")); ?>：<span id="user_height"></span>
            </li>
            <li>
                <?php echo (L("education")); ?>：<span id="user_education"></span>
            </li>
        </ul>
    </div>
</div>
<div id="east" class="east">        <!-- ”右侧的”照片“状态“ ：用户  上传 过得 照片-->
    
</div>
<script src="/Public/Index/Js/s_profile.js?4111"></script>

</body>
</html>