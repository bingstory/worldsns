<?php
namespace Admin\Controller;
use Think\Controller;
class TransController extends Controller {
	public function translate($content,$to) {
        $trans = new translateController;
        $res = $trans->translate($content,'auto',$to);
        return $res['trans_result'][0]['dst']; 
	}
}
?>