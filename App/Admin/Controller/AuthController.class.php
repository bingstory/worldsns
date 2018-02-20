<?php
namespace Admin\Controller;
use Admin\Controller;
class AuthController extends BaseController{
	public function showList() {
		$search = $this->getWhere();
		if (!empty($search['id'])) {
			$search['id'] = intval($search['id']);
		}
		//设置显示项参数
		$array['SelectAll'] = 'yes';
		$array['delSelect'] = 'yes';
		$array['disSelect'] = 'no';
		$array['url'] = U("Admin/Auth/showlist");
		$array['fields'] = array('id'=>'编号','created'=>'创建时间','updated'=>'更新时间');
		//设置分页参数
		$pages['size'] = isset($search['size'])?$search['size']:C('DEFAULT_PAGESIZE');  
		$pages['page'] = isset($search['page'])?$search['page']:1;
		//设置排序参数
		$pages['sort'] = isset($search['sort'])?$search['sort']:'id';
		$pages['dir'] = isset($search['dir'])?$search['dir']:'asc';

		$auth = D('auth');
        $result = $auth ->showList($search,$pages);
        $pages['count'] = $result['count'];
        $pages['allPages'] = ceil(intval($pages['count'])/$pages['size']);

        $this->assign('search',$search);
        $this->assign('list',$result['list']);
        $this->assign('num',1);
        $this->assign($array);
        $this->assign($pages);
        $this->assign('year',$year);
		$this->display();
	}
	/**
	 * 添加管理员
	 */
	public function add()
	{
		$name = I('get.name');
		$key = I('get.key');
		$controller = I('get.controller');
		$action = I('get.action');
		if (!$name) {
			$data = array('status'=>'error','msg'=>L('please input auth name'));
			return $this->ajaxReturn($data);
		}
		if (!$key) {
			$data = array('status'=>'error','msg'=>L('please input keywords'));
			return $this->ajaxReturn($data);
		}
		if (!$controller) {
			$data = array('status'=>'error','msg'=>L('please input controller name'));
			return $this->ajaxReturn($data);
		}
		if (!$action) {
			$data = array('status'=>'error','msg'=>L('please input action name'));
			return $this->ajaxReturn($data);
		}
		$auth = M('Auth');
		$res = $auth->add(array('name'=>$name,'key'=>$key,'controller'=>$controller,'action'=>$action,'created'=>time()));
		if (!$res) {
			return  $this->ajaxReturn($data);
		}
		$data = array('status'=>'success',"msg"=>L("add success"));
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
		$auth = M('Auth');
		$res = $auth->where('id='.$id)->delete();
		if (!$res) {
			$data = array('status'=>'error','msg'=>L("opertion failed"));
			return $this->ajaxReturn(L('operation failure'));
		}else{
			$data = array('status'=>'success','msg'=>L("delete success"));
			return $this->ajaxReturn ($data);
		}
		
	}
	//ajax方法获取权限列表
	public function getlist() {
		$auth = D('auth');
		$list = $auth->field('id,name')->select();
		if (!$list) {
			$msg = array('status'=>'error','msg'=>L("get data failed")); 
			return $this->ajaxReturn($msg);
		}
		$msg = array('status'=>'success','data'=>$list);
		return $this->ajaxReturn($msg);
	}
}
