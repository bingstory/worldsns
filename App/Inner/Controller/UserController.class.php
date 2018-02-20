<?php
namespace Inner\Controller;
use Inner\Controller;
class UserController extends BaseController{
	public function showList() {
		$search = $this->getWhere();
		if (!empty($search['id'])) {
			$search['id'] = intval($search['id']);
		}
		//设置显示项参数
		$array['SelectAll'] = 'yes';
		$array['delSelect'] = 'no';
		$array['disSelect'] = 'no';
		$array['url'] = U("Inner/User/showlist");
		$array['fields'] = array('id'=>'编号','created'=>'注册时间');
		//设置分页参数
		$pages['size'] = isset($search['size'])?$search['size']:C('DEFAULT_PAGESIZE');  
		$pages['page'] = isset($search['page'])?$search['page']:1;
		//设置排序参数
		$pages['sort'] = isset($search['sort'])?$search['sort']:'id';
		$pages['dir'] = isset($search['dir'])?$search['dir']:'desc';

		$user = D('User');
        $result = $user->showList($search,$pages);
        // dump($result['list']);die;
        foreach ($result['list'] as $k => $v) {
        	$has_chat = M('chat_record')->where(array('reciver_id'=>$v['id'],'is_read'=>'0'))->order('id DESC')->select();
        	// dump($has_chat);die;
        	if($has_chat){
        		$result['list'][$k]['has_chat'] = 1;
        	}else{
        		$result['list'][$k]['has_chat'] = 0;
        	}
        	unset($has_chat);
        }
        // dump($result['list']);die;
        
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
		$this->display();
	}
	public function addname() {
		$id = I('get.id');
		$name = I('get.name');
		$userModel = M('user');
		$data = array(
				'name' => $name,
				'updated' => time()
			);
		$res = $userModel->where('id='.$id)->save($data);
		if (!$res) {
			$data = array('status'=>'error','msg'=>L("opertion failed"));
			return $this->ajaxReturn($data);
		}
		$data = array('status'=>'success','msg'=>L("opertion success"));
		return $this->ajaxReturn ($data);
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