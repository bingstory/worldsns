<?php if (!defined('THINK_PATH')) exit();?><!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html>
<head>
    <meta http-equiv="content-type" content="text/html;charset=utf-8">
    <link rel="stylesheet" type="text/css" href="/Public/Index/Css/encounter.css">
    <!--<link rel="stylesheet" type="text/css" href="theme/item.css">
    <!-<link rel="stylesheet" type="text/css" href="theme/public.css">-->
</head>
<body>
<div class="nav">
    <div id="nav1" class="nav_link nav_focus"><?php echo (L("discover")); ?></div>      <!-- onlick 事件 first.js  增加类名"nav_focus"    区别”选中“与否-->
    <div class="nav_line"></div>
    <div id="nav2" class="nav_link"><?php echo (L("who I like")); ?></div>      <!-- onlick 事件 first.js  增加类名"nav_focus"    区别”选中“与否-->
    <div class="nav_line"></div>
    <div id="nav3" class="nav_link">
        <?php echo (L("who like me")); ?>
        <a id="note_passive"></a>
    </div>      <!-- onlick 事件 first.js  增加类名"nav_focus"    区别”选中“与否-->   <!-- a 中的数字代表 消息的个数  -->
    <div class="nav_line"></div>
    <div id="nav4" class="nav_link">
        <?php echo (L("match list")); ?>
        <a id="note_match"></a>
    </div><!-- onlick 事件 first.js  增加类名"nav_focus"    区别”选中“与否-->
    <div class="nav_line"></div>
</div>
<div id="panel1" class="panel" style="display:block;padding: 20px"><!--style="display:block;"    切换样式的显示与否-->
    <div id="rec_photo" class="rec_photo">
        
    </div>
    <div class="rec_right" style="margin: 0 auto">
        <div id="rec_ask" class="rec_ask">
        </div>
        <dl class="rec_dl">
            <dd id="btn4yes" class="rec_btn rec_yes"></dd>
            <dd id="btn4no" class="rec_btn rec_no"></dd>
        </dl>
        <div class="rec_hr"></div>
        <div id="rec_name" class="rec_name"></div>  <!--  ”用户名“  随时可以改变-->
        <div id="rec_profile" class="rec_profile"></div>    <!--  ”用户de信息“  随时可以改变-->
        <div id="rec_about" class="rec_about"></div>
    </div>
</div>
<div id="panel2" class="panel" style="display:none;"><!--style="display:block;"    切换样式的显示与否-->
    
</div>
<script src="/Public/Index/Js/encounter.js"></script>
<!--<script type="text/javascript">
function changeClasNm(id0){
//找到所有的目标，恢复”初始“状态  //定义数组：var cars=new Array("Audi","BMW","Volvo");
var arrLeft=["nav1","nav2","nav3","nav4"];//定义目标数组
var n = arrLeft.length;
for(i=0;i<n;i++){
    var id = arrLeft[i];
    document.getElementById(id).className = "nav_link";
}
    document.getElementById(id0).className = "nav_link nav_focus";//点击的对象，通过类名改变，显示”选中“
}
function changePage(id1,id2,id3,id4,id) {   //切换“浏览” 与 “主页”的显示
  document.getElementById(id1).style.display="none";    //关闭所有的页面
  document.getElementById(id2).style.display="none";
  document.getElementById(id3).style.display="none";
  document.getElementById(id4).style.display="none";

  document.getElementById(id).style.display="block";  //只打开一个页面

function changNav_cont(id0,id1,id2,id3,id4,id){
    changeClasNm(id0);
    changePage(id1,id2,id3,id4,id);
}
</script>-->
</body>
</html>