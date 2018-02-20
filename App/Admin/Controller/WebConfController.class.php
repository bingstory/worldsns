<?php
namespace Admin\Controller;
use Admin\Controller;
/**
*	管理员维护，管理员的增删改查以及赋权功能
*	@author ftian
*/
class WebConfController extends BaseController{
	/**
	 * 管理员信息列表
	 */
	public function showList()
	{	
		$webconf = D('Web_conf');
        $list = $webconf->find();
        $this->assign('list',$list);
		$this->display();
		
	}

	/**
	 * 添加管理员
	 */
	public function add()
	{
		$name = I('post.name');
		$copyright = I('post.copyright');
		$recordNum = I('post.recordNum');
		$email = I('post.eamil');
		$paypal = I('post.paypal');
		$logoarr = I('data.logo','','',$_FILES);
	    $indexbg1arr = I('data.indexbg1','','',$_FILES);
	    $indexbg2arr = I('data.indexbg2','','',$_FILES);
	    $indexbg3arr = I('data.indexbg3','','',$_FILES);
	    $indexbg4arr = I('data.indexbg4','','',$_FILES);
	    $indexbg5arr = I('data.indexbg5','','',$_FILES);
	    $bannerarr = I('data.banner','','',$_FILES);
	    $spacebanner = I('data.spacebanner','','',$_FILES);
	    $female_reg = I('post.female_reg');
	    $gift_sort = I('post.gift_sort');
	    $paypalCommission = I('post.paypal_commission');
	    $consumeCommission = I('post.consume_commission');
	    $wallNumber = I('wall_number');
		$webconf = M('Web_conf');
		if (!empty($logoarr) || !empty($indexbg1arr) || !empty($indexbg2arr) || !empty($indexbg3arr) || !empty($indexbg4arr) || !empty($indexbg5arr) || !empty($bannerarr) || !empty($spacebanner)) {
			$upload = new \Think\Upload();
	    	$upload->maxSize   =     5242880 ;  //5M
	    	$upload->exts      =     array('jpg', 'gif', 'png', 'jpeg');
	    	$upload->rootPath  =     './Public/Upload/webconf/';
	    	$upload->savePath  =     '';
	    	$upload->saveName  =      array('uniqid','');
	    	$upload->autoSub   =   	false;
	    	$info = $upload->upload();
	    	if(!$info) {// 上传错误提示错误信息
		        return $this->error($upload->getError());
		    }
		}
	    $data = array(
	    		'name' => $name,
	    		'copyright' => $copyright,
	    		'record_number' => $recordNum,
	    		'email' => $email,
	    		'paypal' => $paypal,
	    		'female_reg' => $female_reg,
	    		'gift_sort' => $gift_sort,
	    		'paypal_commission' => $paypalCommission,
	    		'consume_commission' => $consumeCommission,
	    		'wall_number' => $wallNumber,
	    	);
	   	if (!empty($logoarr)) {
	    	$data['logo'] = $upload->rootPath.$info['logo']["savename"];
	    }
	    if (!empty($indexbg1arr)) {
	    	$data['indexbg1'] = $upload->rootPath.$info['indexbg1']["savename"];
	    }
	    if (!empty($indexbg2arr)) {
	    	$data['indexbg2'] = $upload->rootPath.$info['indexbg2']["savename"];
	    }
	    if (!empty($indexbg3arr)) {
	    	$data['indexbg3'] = $upload->rootPath.$info['indexbg3']["savename"];
	    }
	    if (!empty($indexbg4arr)) {
	    	$data['indexbg4'] = $upload->rootPath.$info['indexbg4']["savename"];
	    }
	    if (!empty($indexbg5arr)) {
	    	$data['indexbg5'] = $upload->rootPath.$info['indexbg5']["savename"];
	    }
	    if (!empty($bannerarr)) {
	    	$data['banner'] = $upload->rootPath.$info['banner']["savename"];
	    }
	    if (!empty($spacebanner)) {
	    	$data['spacebanner'] = $upload->rootPath.$info['spacebanner']["savename"];
	    }	
	    $webconf = M('Web_conf');
	    $info = $webconf->find();
	    if (!empty($info)) {
	    	$data['updated'] = time();
	    	$res = $webconf->where('id='.$info['id'])->save($data);
	    }else{
	    	$data['created'] = time();
	    	$res = $webconf->add($data);
	    }
		if (!$res) {
			$msg = array('status'=>'error','msg'=>L('modify failed'));
			return  $this->ajaxReturn($msg);
		}
		$msg = array('status'=>'success',"msg"=>L("modify success"));
		return  $this->ajaxReturn($msg);
	}
}
