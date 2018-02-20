<?php
namespace Admin\Controller;
use Admin\Controller;
class AdminController extends BaseController{
    public function admin() {
       $this->display();
    }
    public function header() {
    	$this->display();
    }
    public function menu() {
    	$all = array (
				'个人中心'	=>	array(
							'我的信息'	=> 	U('Admin/Myinfo/show'),
							'密码管理'	=> 	U('Admin/Myinfo/showModifyPwd'),
							'手机管理'	=> 	U('Admin/Myinfo/showModifyTel'),
							'邮箱管理'	=>	U('Admin/Myinfo/showModifyEmail'),
					),
                '管理员管理' => array(
                            '管理员管理' => U('Admin/AdminUser/showlist'),
                    ),
                '用户管理' => array(
                            '用户管理' => U('Admin/User/showlist'),
                    ),
                '订单管理' => array(
                            //'订单管理' => U('Admin/Order/showlist'),
                            '总营业额' => U('Admin/Turnover/showlist'),
                            '充值记录' => U('Admin/Prepaid/showlist'),
                            '金币消费记录' => U('Admin/Consum/showlist'),
                            '礼物查询' => U('Admin/GiftRecord/showlist')
                    ),
                '礼物管理' => array(
                            '礼物分类' => U('Admin/GiftCate/showlist'),
                            '礼物管理' => U('Admin/Gift/showlist')
                    ),
                '表情贴管理' => array(
                            '表情贴管理' => U('Admin/Sticker/showlist') 
                    ),
                '网站配置' => array(
                            '网站配置管理' => U('Admin/WebConf/showlist'),
                    ),
                '推广员管理' => array(
                            '推广员管理' => U('Admin/Employee/showlist')
                    )
		);
		$this->assign('menu',$all);
		$this->display();
    }
    public function main() {
    	$this->display();
    }
}