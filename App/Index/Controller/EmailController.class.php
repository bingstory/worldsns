<?php
namespace Index\Controller;
use Think\Controller;
class EmailController extends controller { 
	public function send() {
		header("Content-Type:text/html;charset=utf-8"); 
		$mail = new \Org\Email\Email();
		$email = '1171101514@qq.com';
		$url = "http://www.appreciate.cn.com".U('activeAccount')."?u=$uname&k=".md5($uname.md5($pwd));
        $subject = "vivimeetteam";
        $content = "尊敬的用户，您好！<br><br><br><br>
        您在我司网站注册的用户名为$uname,若是您本人操作，请点击<a href=\"$url\">激活账号</a>,否则，请不必理会！<br><br>
        若链接无法跳转请将以下网址复制到浏览器地址栏进行打开<br><br>".
        $url."<br><br>给您造成的不便敬请见谅，祝您生活愉快！
        ";
       	$res = $mail->send($email,$subject,$content);
       	var_dump($res);
	}
}
?>