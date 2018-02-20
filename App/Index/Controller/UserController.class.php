<?php
namespace Index\Controller;
use Think\Controller;
class UserController extends BaseController {
	public function search() {
		$userId = session('userId');
		$name = I('post.name');
		$userModel = M('user');
		$sex = $userModel->where("id=".$userId)->getField('sex');
		if ($sex == 'male') {
			$gender = 'female';
		}else{
			$gender = 'male';
		}
		$where = array(
				'username' => $name,
				'sex' => $gender
			);
		$user = $userModel->where($where)->find();
		if (!$user) {
			$msg = array('status'=>'error');
			$this->ajaxReturn($msg);
		}else{
			$msg =array('status'=>'success','data'=>$user);
			$this->ajaxReturn($msg);
		}
	}
	public function searchLike() {
		$key = I('post.key');
		$gender = I('post.gender');
		$userModel = M('user');
		if ($gender == 'female') {
			$sex = 'male';
		}else{
			$sex = 'female';
		}
		$where = array(
				'username' => array('LIKE','%'.$key.'%'),
				'sex' => $sex
			);
		$list = $userModel->field('id,username,header')->where($where)->select();
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
		$ori_pass = I('post.ori_pass');
		$ori_pass == md5('tmj'.md5($ori_pass));
		$pwd = I('post.pwd');
		$userId = session('userId');
		$password = md5('tmj'.md5($pwd));
		$userModel = M('user');
		$userinfo = $userModel->where('id='.$userId)->find();
		if (md5('tmj'.md5($ori_pass)) != $userinfo['pwd']) {
			$msg = array('status' => 'error1');
			$this->ajaxReturn($msg);
		}
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