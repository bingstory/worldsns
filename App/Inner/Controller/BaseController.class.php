<?php
namespace Inner\Controller;
use Think\Controller;
/**
*	管理模块基本控制器，用于处理管理模块通用功能，特别是权限判断以及登录验证
*	@author ftian
*/
class BaseController extends Controller{
	/**
	 * 验证是否登录
	 * @return  boolean
	 */
	public function __construct(){
		parent::__construct();
		$this->islogin();
	}
	protected function islogin() {
		$admin = session('inner');
		$adminId = session('innerId');
		if (empty($admin) || empty($adminId)) {
			$this->success('您还未登录，或者长时间未操作导致自动退出，请登录','index.php?m=Inner&c=Login&a=login');
			exit;
		}else{
			return true;
		}
	}
	protected function getWhere()
	{
		$where = array();
		if(IS_POST){
			foreach (I('post.') as $postname => $postvalue) {
				if (strstr($postname,"search_")) {
					if ($postvalue != "") {
						$tempname = substr($postname,7);
						$where[$tempname] = $postvalue;
					}
				}
				if (strstr($postname,"page_")) {
					if ($postvalue != "") {
						$tempname = substr($postname,5);
						$where[$tempname] = $postvalue;
					}
				}
			}
		}
		if(IS_GET){
			foreach (I('get.') as $getname => $getvalue){
				if (!strstr($getname,"page_")) {
					if ($getname!="c" && $getname!= "a" && $getvalue!="") {
						if (strstr($getname,"_like")) {
							$where[str_replace("_like","",$getname)] = str_replace("%","",$getvalue);
						}elseif(strstr($getname,"_>")){
							$where[str_replace("_>","_start",$getname)] = strstr($getname,".")?floatval(str_replace("=","",$getvalue)):intval(str_replace("=","",$getvalue));
						}elseif(strstr($getname,"_<")){
							$where[str_replace("_<","_end",$getname)] = strstr($getname,".")?floatval(str_replace("=","",$getvalue)):intval(str_replace("=","",$getvalue));
						}else{
							$where[$getname] = $getvalue;
						}
					}
				}
			}
		}
		return $where;
	}
	public function getArea($ip) {
		if (!empty($ip)) {
            if ($ip == '127.0.0.1') {
                $Area = '本机';
            }else{
                $Ip = new \Org\Net\IpLocation('UTFWry.dat'); // 实例化类 参数表示IP地址库文件
                $Area = $Ip->getlocation($ip); // 获取某个IP地址所在的位置
            }
        }else{
            $Area = '';
        }
        return $Area;
	}
}