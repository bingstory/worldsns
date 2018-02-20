<?php
namespace Admin\Controller;
use Admin\Controller;
class EmployeeController extends BaseController{
	public function showlist() {
		$search = $this->getWhere();
		if (!empty($search['id'])) {
			$search['id'] = intval($search['id']);
		}
		//设置显示项参数
		$array['SelectAll'] = 'yes';
		$array['delSelect'] = 'yes';
		$array['disSelect'] = 'no';
		$array['url'] = U("Admin/Employee/showlist");
		$array['fields'] = array('id'=>'编号','created'=>'创建时间','commision'=>'提成');
		//设置分页参数
		$pages['size'] = isset($search['size'])?$search['size']:C('DEFAULT_PAGESIZE');  
		$pages['page'] = isset($search['page'])?$search['page']:1;
		//设置排序参数
		$pages['sort'] = isset($search['sort'])?$search['sort']:'id';
		$pages['dir'] = isset($search['dir'])?$search['dir']:'asc';
		$employeeModel = D('employee');

		$result = $employeeModel->showList($search,$pages);
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
		$jobNumber = I('post.addjobnumber');
		$name = I('post.addname');
		$pwd = I('post.addpwd');
		$pwd = md5('tmj'.md5($pwd));
	    $data = array(
	    		'job_number' => $jobNumber,
	    		'name' => $name,
	    		'pwd' => $pwd,
	    		'created' 	=> time()
	    	);
		$EmployeeModel = M('employee');
		$res = $EmployeeModel->add($data);
		if (!$res) {
			$msg = array('status'=>'error','msg'=>L('add failure'));
			return  $this->ajaxReturn($msg);
		}
		$msg = array('status'=>'success',"msg"=>L("add success"));
		return  $this->ajaxReturn($msg);
	}
	public function getEmployee() {
		$employeeModel = M('employee');
		$employee = $employeeModel->field('id,job_number,name')->select();
		if (!$employee) {
			$msg = array('status'=>'error','msg'=>L('get info failure'));
			return  $this->ajaxReturn($msg);
		}else{
			$msg = array('status'=>'success','data'=>$employee);
			return  $this->ajaxReturn($msg);
		}
	}
	public function edit () {
		$id = I('post.editid');
		$name = I('post.editname');
		$pwd = I('post.editpwd');
		$allotto = I('post.editallotto');
		$data = array(
	    		'name' => $name,
	    		'updated' 	=> time()
	    	);
		if (!empty($pwd)) {
			$data['pwd'] = md5('tmj'.md5($pwd));
		}
		if ($allotto) {
			$userInerModel = M('inner_member');
			$allotData = array(
					'job_number' => $allotto,
					'updated' => time()
				);
			$res = $userInerModel->where('job_number='.$id)->save($allotData);
		}
		$EmployeeModel = M('employee');
		$res = $EmployeeModel->where('id='.$id)->save($data);
		if (!$res) {
			$msg = array('status'=>'error','msg'=>L('operation failure'));
			return  $this->ajaxReturn($msg);
		}
		$msg = array('status'=>'success',"msg"=>L("modify success"));
		return  $this->ajaxReturn($msg);
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
		$EmployeeModel = M('employee');
		$res = $EmployeeModel->where('id='.$id)->delete();
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
			$employeeModel = D('employee');
			$res = $employeeModel->batchDelete($ids);
			$msg = array('status'=>'sucess','data'=>$res);
			return $this->ajaxReturn($msg);
		}else{
			$msg = array('status'=>'error','msg'=>L('illegal submission'));
			return $this->ajaxReturn($msg);
		}
	}
}
