<?php
namespace Wap\Controller;
use Wap\Controller;
class UploadController extends BaseController {
	public function index() {
		$this->display();
	}
	public function upload() {
		$name = I("post.name");
		$data = I("post.data");
		$dir = I('get.dir');
		if (!$dir) {
			$dir = 'temp';
		}
		if ($data) {
			$img = base64_decode($data);
			$path = './Public/Upload/'.$dir.'/';
	       	$allowArr = array('jpg', 'gif', 'png', 'jpeg','PNG');
	       	$arr = explode('.',$name);
	       	$ext = $arr[1];
	       	if (in_array($ext, $allowArr)) {
	       		$fileName = time().uniqid().'.'.$ext;
	       		$fullName = $path.$fileName;
	       		$res = file_put_contents($fullName,$img);
	       		if (!$res) {
	       			$msg = array('status'=>'error');
					$this->ajaxreturn($msg);
	       		}else{
	       			$msg = array('status'=>'success','url'=>$fullName);
					$this->ajaxreturn($msg);
	       		}

	       	}
		}else{
			$msg = array('status'=>'error');
			$this->ajaxreturn($msg);
		}
	}
}
?>