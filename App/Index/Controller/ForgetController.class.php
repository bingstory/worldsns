<?php
namespace Index\Controller;
use Think\Controller;
class ForgetController extends Controller {
	public function index() {
		$webconf = M('web_conf');
        $webinfo = $webconf->find();
        $this->assign('webinfo',$webinfo);
		$this->display();
	}
	public function find() {
		$email  = I('post.mail');
		$userModel = M('user');
		$where = array('email' => $email);
		$id = $userModel->where()->getField('id');
		if (!$id) {
			$msg = array('status' => 'error');
			$this->ajaxReturn($msg);
		}else{
			$subject = 'Mail of Hahameet retrieved password';
        	$baseurl = $_SERVER['HTTP_HOST'];
        	$mail = new \Org\Email\Email();
        	$stamp = time();
        	$token = md5($email.$stamp.'tmj');
        	$baseurl = $_SERVER['HTTP_HOST'];
        	$url = 'http://'.$baseurl.'/index.php?m=Index&c=Forget&a=reset&email='.$email.'&stamp='.$stamp.'&token='.$token;
        	$message = "<div style='width: 650px;margin: 0 auto;background:#F4F5F9;border:1px solid #E8E4E4;padding:25px;'>Dear haha:<div style='text-indent: 60px;margin-top: 10px;'>Please click the following link in 24 hours if you want to reset your password .<a target='_blank' style='text-indent: 60px;margin-top: 20px;text-decoration: underline;display: block;color: #296CD8;' href='".$url."'>Reset my password.</a><div style='text-align: right;margin-top: 20px;'>Sincerely<br>&copy; 2016 vivimeet.com</div></div></div>";
        	$bool = $mail->send($email,$subject,$message);
			$msg = array('status' => 'success');
			$this->ajaxReturn($msg);
		}
	}
	public function reset() {
		$email = I('get.email');
		$stamp = I('get.stamp');
		$token = I('get.token');
		$t = time();
		if ($t - $stamp < 3600 * 24) {
			$newtoken = md5($email.$stamp.'tmj');
			if ($newtoken == $token) {
				$userModel = M('user');
				$where = array('email' => $email);
				$id = $userModel->where($where)->getField('id');
				if (!$id) {
					header("location:index.php?m=Index&c=Index&a=index");
				} else {
					session('userId',$id);
        			//header("location:index.php?m=Index&c=Home&a=index");
        			$this->display();	
				}
			}
		}else{
			header("location:index.php?m=Index&c=Index&a=index");
		}
	}
	public function modify() {
		$pass = I('post.pwd');
		$pass = md5('tmj'.md5($pass));
		$userId = session('userId');
		if (!$userId) {
			$msg = array('status' => 'error');
			return $this->ajaxReturn($msg);
		}
		$userModel = M('user');
		$data = array(
				'pwd' => $pass,
				'updated' => time()
			);
		$res = $userModel->where('id='.$userId)->save($data);
		if (!$res) {
			$msg = array('status' => 'error');
			return $this->ajaxReturn($msg);
		}else{
			$msg = array('status' => 'success');
			return $this->ajaxReturn($msg);
		}
	}
}
?>