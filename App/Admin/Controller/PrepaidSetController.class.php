<?php
namespace Admin\Controller;
use Admin\Controller;
/**
*	管理员维护，管理员的增删改查以及赋权功能
*	@author ftian
*/
class PrepaidSetController extends BaseController{
	/**
	 * 管理员信息列表
	 */
	public function showList()
	{	
        $set = M('prepaidset');
        $list = $set->find();
        $this->assign('list',$list);
		$this->display();
		
	}

	/**
	 * 添加管理员
	 */
	public function add()
	{
		$rate = I('post.rate');
		$greater30 = I('post.g30');
		$greater50 = I('post.g50');
		$greater100 = I('post.g100');
		$greater300 = I('post.g300');
		$greater500 = I('post.g500');
	    $data = array(
	    		'rate' => $rate,
	    		'greater30' => $greater30,
	    		'greater50' => $greater50,
	    		'greater100' => $greater100,
	    		'greater300' => $greater300,
	    		'greater500' => $greater500,
	    	);
	    $set = M('prepaidset');
	    $info = $set->find();
	    if (!empty($info)) {
	    	$data['updated'] = time();
	    	$res = $set->where('id='.$info['id'])->save($data);
	    }else{
	    	$data['created'] = time();
	    	$res = $set->add($data);
	    }
		if (!$res) {
			$msg = array('status'=>'error','msg'=>L('modify failed'));
			return  $this->ajaxReturn($msg);
		}
		$msg = array('status'=>'success',"msg"=>L("modify success"));
		return  $this->ajaxReturn($msg);
	}
}