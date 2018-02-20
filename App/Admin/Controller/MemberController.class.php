<?php
namespace Admin\Controller;
use Admin\Controller;
/**
*	管理员维护，管理员的增删改查以及赋权功能
*	@author ftian
*/
class MemberController extends BaseController{
	/**
	 * 管理员信息列表
	 */
	public function showList()
	{	
		$search = $this->getWhere();
		if (!empty($search['id'])) {
			$search['id'] = intval($search['id']);
		}
		//设置显示项参数
		$array['SelectAll'] = 'yes';
		$array['delSelect'] = 'yes';
		$array['disSelect'] = 'no';
		$array['url'] = U("Admin/Member/showlist");
		$array['fields'] = array('id'=>'编号','created'=>'创建时间','updated'=>'更新时间');
		//设置分页参数
		$pages['size'] = isset($search['size'])?$search['size']:C('DEFAULT_PAGESIZE');  
		$pages['page'] = isset($search['page'])?$search['page']:1;
		//设置排序参数
		$pages['sort'] = isset($search['sort'])?$search['sort']:'id';
		$pages['dir'] = isset($search['dir'])?$search['dir']:'asc';

		$member = D('Member');
        $result = $member->showList($search,$pages);
        $pages['count'] = $result['count'];
        $pages['allPages'] = ceil(intval($pages['count'])/$pages['size']);

        $this->assign('search',$search);
        $this->assign('list',$result['list']);
        $this->assign('num',1);
        $this->assign($array);
        $this->assign($pages);
		$this->display();
		
	}

	/**
	 * 添加管理员
	 */
	public function add()
	{
		$name = I('get.name');
		$key = I('get.key');
		$onefee = I('get.onefee');
		$threefee = I('get.threefee');
		$sixfee = I('get.sixfee');
		$yearfee = I('get.yearfee');
		if (!$name) {
			$msg = array('status'=>'error','msg'=>L('please input member name'));
			return $this->ajaxReturn($msg);
		}
		if (!$key) {
			$msg = array('status'=>'error','msg'=>L("please input keywords"));
			return $this->ajaxReturn($msg);
		}
		if (!$onefee) {
			$msg = array('status'=>'error','msg'=>L('please input onefee'));
			return $this->ajaxReturn($msg);
		}
		if (!$threefee) {
			$msg = array('status'=>'error','msg'=>L('please input threefee'));
			return $this->ajaxReturn($msg);
		}
		if (!$sixfee) {
			$msg = array('status'=>'error','msg'=>L('please input sixfee'));
			return $this->ajaxReturn($msg);
		}
		if (!$yearfee) {
			$msg = array('status'=>'error','msg'=>L('please input yearfee'));
			return $this->ajaxReturn($msg);
		}
		$member = M('Member');
		$res = $member->add(array('name'=>$name,'key'=>$key,'onefee'=>$onefee,'threefee'=>$threefee,'sixfee'=>$sixfee,'yearfee'=>$yearfee,'created'=>time()));
		if (!$res) {
			$data = array('status'=>'error','msg'=>L('operation failure'));
			return  $this->ajaxReturn($data);
		}
		$data = array('status'=>'success',"msg"=>L("add success"));
		return  $this->ajaxReturn($data);
	}

	public function showEdit() {
		$id = I('get.id');
		if (!$id) {
			$msg = array('status'=>'error','msg'=>L('illegal submission'));
			return $this->ajaxReturn($msg);
		}
		$member = M('Member');
		$record = $member->where('id='.$id)->find();
		$data = array('member'=>$record);
		$msg = array('status'=>'success','data'=>$data);
		$this->ajaxReturn($msg);
	}
	public function edit () {
		$id = I('get.id');
		$name = I('get.name');
		$onefee = I('get.onefee');
		$threefee = I('get.threefee');
		$sixfee = I('get.sixfee');
		$yearfee = I('get.yearfee');
		if (!$id) {
			$msg = array('status'=>'error','msg'=>L('illegal submission'));
			return $this->ajaxReturn($msg);
		}
		if (!$name) {
			$msg = array('status'=>'error','msg'=>L('please input member name'));
			return $this->ajaxReturn($msg);
		}
		if (!$onefee) {
			$msg = array('status'=>'error','msg'=>L('please input onefee'));
			return $this->ajaxReturn($msg);
		}
		if (!$threefee) {
			$msg = array('status'=>'error','msg'=>L('please input threefee'));
			return $this->ajaxReturn($msg);
		}
		if (!$sixfee) {
			$msg = array('status'=>'error','msg'=>L('please input sixfee'));
			return $this->ajaxReturn($msg);
		}
		if (!$yearfee) {
			$msg = array('status'=>'error','msg'=>L('please input yearfee'));
			return $this->ajaxReturn($msg);
		}
		$member = M('Member');
		$res = $member->where('id='.$id)->save(array('name'=>$name,'onefee'=>$onefee,'threefee'=>$threefee,'sixfee'=>$sixfee,'yearfee'=>$yearfee,'updated'=>time()));
		if (!$res) {
			$data = array('status'=>'error','msg'=>L('operation failure'));
			return  $this->ajaxReturn($data);
		}
		$data = array('status'=>'success',"msg"=>L("modify success"));
		return  $this->ajaxReturn($data);
	}
	/**
	 * 删除管理员
	 */
	public function del()
	{
		$id = I('get.id');
		if (!$id) {
			$data = array('status'=>'error','msg'=>L('illegal submission'));
			return $this->ajaxReturn($data);
		}
		$member = M('Member');
		$res = $member->where('id='.$id)->delete();
		if (!$res) {
			$data = array('status'=>'error','msg'=>L("opertion failed"));
			return $this->ajaxReturn(L('operation failure'));
		}else{
			$data = array('status'=>'success','msg'=>L("delete success"));
			return $this->ajaxReturn ($data);
		}
		
	}

	/**
	 * 批量删除
	 */
	public function batchDel(){
		$ids = I('get.ids');
		if (is_array($ids)&&count($ids)) {
			$member = D('Member');
			$res = $member->batchDelete($ids);
			$msg = array('status'=>'sucess','data'=>$res);
			return $this->ajaxReturn($msg);
		}else{
			$msg = array('status'=>'error','msg'=>L('illegal submission'));
			return $this->ajaxReturn($msg);
		}
	}
}
