<?php
namespace Index\Controller;
use Index\Controller;
class AvatarController extends BaseController {
	public function index() {
		$this->display();
	}
	public function save() {
		$url = I('post.s');
		$x = I('post.x');
		$y = I('post.y');
		$w = I('post.w');
		$image = new \Think\Image();
		$img = $image->open($url);
	    $path = './Public/Upload/header/';
		$fileName = time().uniqid().'.png';
		$fileName40  = str_replace('.','_40.',$fileName);
		$fileName80  = str_replace('.','_80.',$fileName);
		$fileName180  = str_replace('.','_180.',$fileName);
		$fullName = $path.$fileName;
		$res = $image->crop($w, $w, $x, $y)->save($fullName);
		$fullName40 = $path.$fileName40;
		$fullName80 = $path.$fileName80;
		$fullName180 = $path.$fileName180;
		$image->thumb(180, 180)->save($fullName180);
		$image->thumb(80, 80)->save($fullName80);
		$image->thumb(40, 40)->save($fullName40);
		
		$userId = session('userId');
		$photoModel = M('photo');
		$t = time();
		$photoData = array(
				'user_id' => $userId,
				'url' => $fullName,
				'album' => 2,
				'created' => $t
			);
		$res = $photoModel->add($photoData);
		$broadcastModel = M('broadcast');
		$broadData = array(
				'user_id' => $userId,
				'img' => $res,
				'type' => 'photo',
				'created' => time()
			);
		$broadcastId = $broadcastModel->add($broadData);
		if (!$res) {
			$msg = array('status'=>'error');
			$this->ajaxReturn($msg);
			return false;
		}
		$userModel = M('user');
		$userData = array(
				'header' => $fullName,
				'updated' => $t
			);
		$res = $userModel->where('id='.$userId)->save($userData);
		$data = array(
				'header' => $fullName
			);
		$msg = array('status'=>'success','data'=>$data);
		$this->ajaxReturn($msg);
	}
}
