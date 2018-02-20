<?php
namespace Index\Controller;
use Think\Controller;
class InformationController extends Controller {
	public function index() {
		$username = I('get.username');
		$userModel = M('user');
		$where = array('username'=>$username);
		$info = $userModel->where($where)->find();
		$this->assign('info',$info);
		$this->display();
	}
	public function saveInfo() {
		$id = I('get.id');
		$src = I('get.header');
		$x1 = I('get.x1'); 
		$x2 = I('get.x2');
		$y1 = I('get.y1');
		$y2 = I('get.y2');
		$h = I('get.h');
		$w = I('get.w');
		$country = I('get.country');
		$work = I('get.work');
		$salary  = I('get.salary');
		$year = I('get.year');
		$month = I('get.month');
		$day = I('get.day');
		$height1  = I('get.height');
		$weight = I('get.weight');
		$smoke = I('get.smoke');
		$drink = I('get.drink');
		$sex = I('get.sex');
		$marriage = I('get.marriage');
		if (!$id) {
			$msg = array('status'=>'error','msg'=>L('illegal submission'));
			return $this->ajaxReturn($msg);
		}
		if (!$x1) {
			$msg = array('status'=>'error','msg'=>L('illegal submission'));
			return $this->ajaxReturn($msg);
		}
		if (!$x2) {
			$msg = array('status'=>'error','msg'=>L('illegal submission'));
			return $this->ajaxReturn($msg);
		}
		if (!$y1) {
			$msg = array('status'=>'error','msg'=>L('illegal submission'));
			return $this->ajaxReturn($msg);
		}
		if (!$y2) {
			$msg = array('status'=>'error','msg'=>L('illegal submission'));
			return $this->ajaxReturn($msg);
		}
		if (!$h) {
			$msg = array('status'=>'error','msg'=>L('illegal submission'));
			return $this->ajaxReturn($msg);
		}
		if (!$w) {
			$msg = array('status'=>'error','msg'=>L('illegal submission'));
			return $this->ajaxReturn($msg);
		}
		if (!$src) {
			$msg = array('status'=>'error','msg'=>L("please choose a image as your header"));
			return $this->ajaxReturn($msg);
		}
		if (!$country) {
			$msg = array('status'=>'error','msg'=>L("please input your nationality"));
			return $this->ajaxReturn($msg);
		}
		if (!$work) {
			$msg = array('status'=>'error','msg'=>L('please input your work'));
			return $this->ajaxReturn($msg);
		}
		if (!$salary) {
			$msg = array('status'=>'error','msg'=>L('please input your salary'));
			return $this->ajaxReturn($msg);
		}
		if (!$year) {
			$msg = array('status'=>'error','msg'=>L('please input your birthday'));
			return $this->ajaxReturn($msg);
		}
		if (!$month) {
			$msg = array('status'=>'error','msg'=>L('please input your birthday'));
			return $this->ajaxReturn($msg);
		}
		if (!$day) {
			$msg = array('status'=>'error','msg'=>L('please input your birthday'));
			return $this->ajaxReturn($msg);
		}
		if (!$height1) {
			$msg = array('status'=>'error','msg'=>L('please input your height'));
			return $this->ajaxReturn($msg);
		}
		if (!$weight) {
			$msg = array('status'=>'error','msg'=>L('please input your weight'));
			return $this->ajaxReturn($msg);
		}
		if (!$sex) {
			$msg = array('status'=>'error','msg'=>L('please input your sex'));
			return $this->ajaxReturn($msg);
		}
		if (!$smoke) {
			$msg = array('status'=>'error','msg'=>L('please input your smoking frequency'));
			return $this->ajaxReturn($msg);
		}
		if (!$drink) {
			$msg = array('status'=>'error','msg'=>L('please input your drinking frequency'));
			return $this->ajaxReturn($msg);
		}
		if (!$marriage) {
			$msg = array('status'=>'error','msg'=>L('please input your marital status'));
			return $this->ajaxReturn($msg);
		}
        $file = './public/Upload/header/header_'.uniqid().'.jpg'; 
        $targ_w = $targ_h = 300;
        $jpeg_quality = 90;
        $num = strrpos($src,'.');
        $ext = substr($src,$num);
        if ($ext == '.jpg') {
            $img_r = imagecreatefromjpeg($src);
        }elseif($ext == '.png') {
            $img_r = imagecreatefrompng($src);
        }elseif($ext == '.gif') {
            $img_r = imagecreatefromgif($src);
        }else{
            $msg = array('status'=>'error','msg'=>L('upload failed'));
            return $this->ajaxReturn($msg);
        }
        $img = getimagesize($src);
        $width = $img[0];
        $height = $img[1];
        if ($width<$height ) {
            $rate = $width/300;
        }else{
            $rate = $height/300;
        }
        $w = $w*$rate;
        $h = $h*$rate;
        $x = $x1*$rate;
        $y = $y1*$rate;
        $dst_r = ImageCreateTrueColor($targ_w, $targ_h);
        imagecopyresampled($dst_r,$img_r,0,0,$x,$y,
        $targ_w,$targ_h,$w,$h);
        $res = imagejpeg($dst_r,$file);
        if (!$res) {
            $msg = array('status'=>'error','msg'=>L('upload failed'));
            return $this->ajaxReturn($msg);
        }
        $data = array(
        			'header' => $file,
        			'sex' => $sex,
        			'country' => $country,
        			'worker' => $work,
        			'salary' => $salary,
        			'year' => $year,
        			'month' => $month,
        			'day' => $day,
        			'height' => $height1,
        			'weight' => $weight,
        			'is_smoke' => $smoke,
        			'is_drink' => $drink,
        			'marital_status' => $marriage,
        			'verify_status' => 2
        	);
        $userModel = M('user');
        $res = $userModel->where('id='.$id)->save($data);
        if (!$res) {
        	$msg = array('status'=>'error','msg'=>L('modify failed'));
        	return $this->ajaxReturn($msg);
        }else{
        	$msg = array('status'=>'success','msg'=>L("Your information has been submitted, we will be completed within three working days"));
        	return $this->ajaxReturn($msg);
        }
	} 
}
?>

