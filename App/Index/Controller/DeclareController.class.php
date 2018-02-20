<?php
namespace Index\Controller;
use Think\Controller;
class DeclareController extends Controller {
    public function index(){
        $item = I('get.item');
        $l = I('get.l');
        if (!$l) {
            $l = cookie('think_language');
        }
        if (!$l) {
            $l = 'zh-cn';
        }
        $l = strtolower($l);
        $tpl = 'index.'.$l;
        $webconfModel = M('web_conf');
        $webInfo = $webconfModel->where('id=1')->find();
        $this->assign('webInfo',$webInfo); 
        $this->assign('item',$item);
        $this->display($tpl);
    }
}
?>