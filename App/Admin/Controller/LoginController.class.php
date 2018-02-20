<?php
namespace Admin\Controller;
use Think\Controller;
/**
*	管理员登录控制器
*	@author ftian
*/
class LoginController extends Controller{
	/**
      * 显示登陆页面
      */
	public function login(){
		$this->display();
	}
	/**
	 * 验证码调用
	 */
	public function vCode(){
		$config =    array(
    		'fontSize'    =>    50,    // 验证码字体大小
    		'length'      =>    4,     // 验证码位数
    		'useNoise'    =>    true, // 关闭验证码杂点
    		'codeSet'     =>   	'0123456789',
			);
		$Verify = new \Think\Verify($config);
    	$Verify->entry();
	}
	/**
	 * 验证登录信息
	 */
	public function check()
	{
		//是否是ajax提交
		if(!IS_AJAX){
			$data = array('status'=>"error",'msg'=>L("illegal submission"));
			return $this->ajaxReturn($data);
		}

		//用户名为空验证
		$username = I('get.name');
		if (! $username) {
			$data = array('status'=>"error",'msg'=>L("username can't null"));
			return $this->ajaxReturn($data);
		}
	
		//密码为空验证
		$password = I('get.pwd');
		if (! $password) {
			$data = array('status'=>"error",'msg'=>L("password can't null"));
			return $this->ajaxReturn($data);
		}

// echo $password; 
		// die;


		// 参数检查验证码
		$vcode = I('get.vcode');
		if (! $vcode) {
			$data = array('status'=>"error",'msg'=>L("vcode can't null"));
			return $this->ajaxReturn($data);
		}

		//验证码是否正确
		$verify = new \Think\Verify();
		$result = $verify->check($vcode);
		if(!$result){
			$data = array('status'=>"error",'msg'=>L('verification code error'));
			return $this->ajaxReturn($data);
		}



		//用户名密码匹配验证
		$id=$this->setLogin($username, $password);
		if(!$id){
			$data = array('status'=>"error",'msg'=>L('username or password error'));
			return $this->ajaxReturn($data);
		}
		session('admin',$username);
		session('adminId',$id);
		$admin = $admin = M('Admin');
		$data['lasttime'] = time();
		$data['last_ip'] = get_client_ip();
		$result = $admin->where('id='.$id)->save($data);
		$data = array('status'=>'success');
		return $this->ajaxreturn($data);
	}
	/**
	*登录功能
	*/
	public function setLogin($username,$password) {

		// echo $password;die;
		$admin = M('Admin');
		$condition = array('username'=>$username);
		$info = $admin->where($condition)->find();

		if ($info['pwd'] != md5('being'.$password)) {
			return false;
		}
		session('lastTime',$info['lasttime']);
		session('lastIp',$info['last_ip']);
		return $info['id'];
	} 
	/**
	*退出登录功能
	*/
	public function logOut() {
		unset($_SESSION['admin']);
		unset($_SESSION['adminId']);
		$url = "index.php?m=Admin&c=Login&a=login";
		// var_dump($url);
		header("location:$url");
	}
}