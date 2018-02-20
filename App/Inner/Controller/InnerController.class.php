<?php
namespace Inner\Controller;
use Inner\Controller;
class InnerController extends BaseController{
    public function inner() {
       $this->display();
    }
    public function header() {
        $wenConfModel = M('web_conf');
        $webName = $wenConfModel->where('id=1')->getField('name');
        $this->assign('webName',$webName);
    	$this->display();
    }
    public function menu() {
    	$all = array (
                '业务管理' => array(
                            '提成管理' => U('inner/Order/showlist'),
                            '邀请人管理' => U('inner/User/showlist'),
                            '充值记录' => U('Inner/Prepaid/showlist'),
                            '邀请链接' => U('inner/Links/showlist'),
                            //'会员升级记录' => U('inner/Upgrade/showlist'),
                            //'消费记录' => U('Inner/Consume/showlist')
                    ),
                '密码管理'  =>  array(
                            '修改密码'  =>  U('Inner/Myinfo/showModifyPwd'),
                    )
		);
		$this->assign('menu',$all);
		$this->display();
    }
    public function main() {
    	$this->display();
    }
}