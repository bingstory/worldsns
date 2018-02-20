<?php
namespace Inner\Controller;
use Inner\Controller;
/**
*	管理员维护，管理员的增删改查以及赋权功能
*	@author ftian
*/
class LinksController extends BaseController{
	public function showList()
	{	
		$id = session('innerId');
		$baseUrl = $_SERVER['SERVER_NAME'];
		$url =  $baseUrl."/index.php?m=Index&c=Index&a=index&recommend=".$id;
		$wapUrl = $baseUrl."/index.php?m=Wap&c=Index&a=index&recommend=".$id;
		$this->assign('url',$url);
		$this->assign('wapUrl',$wapUrl);
		$this->display();
	}	
}