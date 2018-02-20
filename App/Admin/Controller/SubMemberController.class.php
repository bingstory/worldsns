<?php
namespace Admin\Controller;
use Admin\Controller;
class SubMemberController extends BaseController{
	public function showList() {
		$search = $this->getWhere();
		if (!empty($search['id'])) {
			$search['id'] = intval($search['id']);
		}
		$employeeId = I('get.employeeid');
		//设置显示项参数
		$array['SelectAll'] = 'yes';
		$array['delSelect'] = 'no';
		$array['disSelect'] = 'no';
		$array['url'] = U("Admin/SubMember/showlist",array('employeeid'=>$employeeId));
		$array['fields'] = array('id'=>'编号','created'=>'注册时间','updated'=>'更新时间');
		//设置分页参数
		$pages['size'] = isset($search['size'])?$search['size']:C('DEFAULT_PAGESIZE');  
		$pages['page'] = isset($search['page'])?$search['page']:1;
		//设置排序参数
		$pages['sort'] = isset($search['sort'])?$search['sort']:'id';
		$pages['dir'] = isset($search['dir'])?$search['dir']:'asc';

		$SubMemberModel = D('SubMember');
        $result = $SubMemberModel->showList($search,$pages,$employeeId);
        $pages['count'] = $result['count'];
        $pages['allPages'] = ceil(intval($pages['count'])/$pages['size']);

        $memberModel = M('member');
        $member = $memberModel->field('id,name,key')->select();

       	$year = date('Y',time());

        $this->assign('search',$search);
        $this->assign('list',$result['list']);
        $this->assign('num',1);
        $this->assign($array);
        $this->assign($pages);
        $this->assign('year',$year);
        $this->assign('member',$member);
        $this->assign('employeeId',$employeeId);
		$this->display();
	}
	
	/**
	 * 禁用/启用管理员
	 */
	public function changeStatus()
	{
		$id = I('get.id');
		$status = I('get.status');
		if (!IS_AJAX) {
			$data = array('status'=>'error','msg'=>L('illegal submission'));
			return $this->ajaxReturn($data);
		}
		if (!$id) {
			$data = array('status'=>'error','msg'=>L('illegal submission'));
			return $this->ajaxReturn($data);
		}
		if (!$status) {
			$data = array('status'=>'error','msg'=>L('illegal submission'));
			return $this->ajaxReturn($data);
		}
		if ($status == 'enable') {
			$status = true;
		}elseif ($status == 'disable') {
			$status = false;
		}
		$user = M('user');
		$data['status'] = $status;
		$result = $user->where('id='.$id)->save($data);
		if (!$result) {
			$data = array('status'=>'error','msg'=>L("opertion failed"));
			return $this->ajaxReturn($data);
		}
		$data = array('status'=>'success','msg'=>L("opertion success"));
		return $this->ajaxReturn($data);
	} 
	public function certify() {
		$id = I('get.id');
		$status = I('get.status');
		if (!$id) {
			$msg = array('status'=>'error','msg'=>L('illegal submission'));
			$this->ajaxReturn($msg);
		}
		if (!$status) {
			$msg = array('status'=>'error','msg'=>L('illegal submission'));
			$this->ajaxReturn($msg);
		}
		$userModel = M('user');
		$data = array('verify_status' => $status);
		$res = $userModel->where('id='.$id)->save($data);
		if (!$res) {
			$msg = array('status'=>'error','msg'=>L("opertion failed"));
			return  $this->ajaxReturn($msg);
		}else{
			$msg = array('status'=>'success','msg'=>L("opertion success"));
			return $this->ajaxReturn($msg);
		}
	}
	public function showInner() {
		$memberModel = M('member');
		$member = $memberModel->field('id,name,key')->select();
		$userModel = M('user');
		$inner = $userModel->field('id,username')->where('inner_member=1')->select();
		$data = array('member'=>$member,'inner'=>$inner);
		$msg = array('status' => 'success','data'=>$data);
		$this->ajaxReturn($msg);
	}
	public function innerMember() {
		$id = I('get.id');
		$level = I('get.level');
		$deadline = I('get.deadline');
		if (!$id) {
			$msg = array('status'=>'error','msg'=>L('illegal submission'));
			return $this->ajaxReturn($msg);
		}
		if (!$level) {
			$msg = array('status'=>'error','msg'=>L("please input member level"));
			return $this->ajaxReturn($msg);
		}elseif ($level == 'no'){
			$level = 0;
		}else{
			if (!$deadline) {
				$msg = array('status'=>'error','msg'=>L("please input deadline"));
				return $this->ajaxReturn($msg);
			}else{
				$deadline = strtotime($deadline);
			}
		}
		$userModel = M('user');
		if ($level != 0) {
			$data = array('level'=>$level,'deadline'=>$deadline,'is_member'=>1,'inner_member'=>1,'updated'=>time());
		}else{
			$data = array('level'=>$level,'deadline'=>0,'is_member'=>0,'inner_member'=>0,'updated'=>time());
		}
		$res = $userModel->where('id='.$id)->save($data);
		if (!$res) {
			$msg = array('status'=>'error','msg'=>L("modify failed"));
			return $this->ajaxReturn($msg);
		}
		$msg = array('status'=>'success','msg'=>L("modify success"));
		return $this->ajaxReturn($msg);
	}

	public function getInner() {
		$id = I('get.id');
		if (!$id) {
			$msg = array('status'=>'error','msg'=>L('illegal submission'));
			return $this->ajaxReturn($msg);
		}
		$EmployeeModel = M('employee');
		$userInnerModel = M('inner_member');
		$parent = $userInnerModel->where('user_id='.$id)->getField('job_number');
		$employee = $EmployeeModel->field('id,name,job_number')->select();
		if (!$employee) {
			$msg = array('status'=>'error','msg'=>L('get data failed'));
			return $this->ajaxReturn($msg);
		}
		$data = array('parent'=>$parent,'inner'=>$employee);
		$msg = array('status'=>'success','data'=>$data);
		return $this->ajaxReturn($msg);

	}

	public function showOutMember() {
		$memberModel = M('member');
		$member = $memberModel->field('id,name,key')->select();
		$userModel = M('user');
		$data = array('member'=>$member);
		$msg = array('status' => 'success','data'=>$data);
		$this->ajaxReturn($msg);
	}

	public function outMember() {
		$id = I('get.id');
		$level = I('get.level');
		$deadline = I('get.deadline');
		if (!$id) {
			$msg = array('status'=>'error','msg'=>L('illegal submission'));
			return $this->ajaxReturn($msg);
		}
		if (!$level) {
			$msg = array('status'=>'error','msg'=>L("please input member level"));
			return $this->ajaxReturn($msg);
		}elseif ($level == 'no'){
			$level = 0;
		}else{
			if (!$deadline) {
				$msg = array('status'=>'error','msg'=>L("please input deadline"));
				return $this->ajaxReturn($msg);
			}else{
				$deadline = strtotime($deadline);
			}
		}
		$userModel = M('user');
		if ($level != 0) {
			$data = array('level'=>$level,'deadline'=>$deadline,'is_member'=>1,'updated'=>time());
		}else{
			$data = array('level'=>$level,'deadline'=>0,'is_member'=>0,'updated'=>time());
		}
		$res = $userModel->where('id='.$id)->save($data);
		if (!$res) {
			$msg = array('status'=>'error','msg'=>L("modify failed"));
			return $this->ajaxReturn($msg);
		}
		$msg = array('status'=>'success','msg'=>L("modify success"));
		return $this->ajaxReturn($msg);
	}

	public function changeGold() {
		$id = I('get.id');
		$gold = I('get.gold');
		if (!$id) {
			$msg = array('status'=>'error','msg'=>L('illegal submission'));
			return $this->ajaxReturn($msg);
		}
		$userModel = M('user');
		$data = array(
				'gold' => $gold, 
				'updated' => time()
			);
		$res = $userModel->where('id='.$id)->save($data);
		if (!$res) {
			$msg = array('status'=>'error','msg'=>L("modify failed"));
			return $this->ajaxReturn($msg);
		}
		$msg = array('status'=>'success','msg'=>L("modify success"));
		return $this->ajaxReturn($msg);
	}

	public function allot() {
		$id = I('get.id');
		if (!$id) {
			$msg = array('status'=>'error','msg'=>L('illegal submission'));
			return $this->ajaxReturn($msg);
		}
		$allotTo = I('get.allotTo');
		if (!$allotTo) {
			$msg = array('status'=>'error','msg'=>L('illegal submission'));
			return $this->ajaxReturn($msg);
		}
		$userModel = M('user');
		$EmployeeModel = M('employee');
		$userInnerModel = M('inner_member');
		//$is_inner_user = $userModel->where("id=".$id)->getField('inner_member');
		$employee = $EmployeeModel->field('id,job_number,name')->where("id=".$allotTo)->find();
		/*if ($is_inner_user == 1) {
			$msg = array('status'=>'error','msg'=>L("is inner"));
			return $this->ajaxReturn($msg);
		}*/
		if (!$employee) {
			$msg = array('status'=>'error','msg'=>L("not employee"));
			return $this->ajaxReturn($msg);
		}
		$relation_id = $userInnerModel->where('user_id='.$id)->getField('id');
		if (empty($relation_id)) {
			$data = array(
				'job_number' => $allotTo,
				'user_id' => $id,
				'created' => time(),
			);
			$res = $userInnerModel->add($data);
		}else{
			$data = array(
				'job_number' => $allotTo,
				'updated' => time(), 
				);
			$res = $userInnerModel->where('id='.$relation_id)->save($data);
		}
		if (!$res) { 
			$msg = array('status'=>'error','msg'=>L("opertion failed"));
			return $this->ajaxReturn($msg);
		}else{
			$data = array(
					'is_alloted' => 1,
					'updated' => time(),
				);
			$userModel->where('id='.$id)->save($data);
			$msg = array('status'=>'success','msg'=>L("opertion success"));
			return $this->ajaxReturn($msg);
		}
		
	}
	public function alwaysOnline() {
		$id = I('get.id');
		$status = I('get.status');
		$userModel = M('user');
		if ($status == 'yes') {
			$data = array(
				'is_online' => 1,
				'always_online' => 1 ,
				'updated' => time()
			);
		}elseif ($status == 'no') {
			$data = array(
				'is_online' => 0,
				'always_online' => 0,
				'updated' => time()
			);
		}
		$res = $userModel->where('id='.$id)->save($data);
		if (!$res) {
			$msg = array('status'=>'error','msg'=>L("opertion failed"));
			return $this->ajaxReturn($msg);
		}else{
			$msg = array('status'=>'success','msg'=>L("opertion success"));
			return $this->ajaxReturn($msg);
		}
	}
}
