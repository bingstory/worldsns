<?php
namespace Wap\Controller;
use Wap\Controller;
class UserController extends BaseController {
	public function search() {
		$name = I('post.name');
		$userModel = M('user');
		$where = array(
				'name' => $name 
			);
		$user = $userModel->where($where)->find();
		if (!$user) {
			$msg = array('status'=>'error');
			$this->ajaxReturn($msg);
		}else{
			$msg =array('status'=>'error','data'=>$user);
			$this->ajaxReturn($msg);
		}
	}
	public function searchLike() {
		$key = I('post.key');
		$minAge = I('post.minAge');
		$maxAge = I('post.maxAge');
		$userModel = M('user');
		$userId = session('userId');
		$gender = $userModel->where('id='.$userId)->getField('sex');
		if ($gender == 'female') {
			$sex = 'male';
		}else{
			$sex = 'female';
		}
		$where = array(
				'sex' => $sex
			);
		if (!empty($minAge) && !empty($maxAge)) {
			$now = date('Y',time());
			$mimYear = $now - $maxAge;
			$maxYear = $now - $minAge;
			$where['year'] = array(array('lt',$maxYear),array('gt',$mimYear),'and');
		}
		if (!empty($key)) {
			$where['username'] = array('LIKE','%'.$key.'%');
		}
		$list = $userModel->field('id,username,sex,header,country_enus as country,year')->where($where)->select();
		if (!$list) {
			$msg = array('status' => 'error');
		}else{
			$msg = array('status' => 'success','data'=>$list);
		}
		$this->ajaxReturn($msg);
	}

	public function showpass() {
		$this->display();
	}
	public function editPass() {
		$pwd = I('post.pwd');
		$userId = session('userId');
		$password = md5('tmj'.md5($pwd));
		$userModel = M('user');
		$data = array(
				'pwd' => $password,
				'updated' => time()
			);
		$res = $userModel->where('id='.$userId)->save($data);
		if (!$res) {
			$msg = array('status' => 'error');
		}else{
			$msg = array('status' => 'success');
		}
		$this->ajaxReturn($msg); 
	}
}
?>