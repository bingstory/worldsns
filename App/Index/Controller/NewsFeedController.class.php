<?php
namespace Index\Controller;
use Think\Controller;
class NewsFeedController extends BaseController {
	public function index() {
		$webConfModel = M('web_conf');
		$banner = $webConfModel->where('id=1')->getField('banner');
		$mysex = $myInfo['sex'];
		$userModel = M('user');
        $userId = session('userId');
        $myInfo = $userModel->field('id,username,header,sex,gold')->where('id='.$userId)->find();
        if ($mysex == 'male') {
        	$sex = 'female';
        }else{
        	$sex = 'male';
        }
		$this->assign('banner',$banner);
		$this->display();
	}
}
?>