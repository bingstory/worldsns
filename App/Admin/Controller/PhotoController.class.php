<?php
namespace Admin\Controller;
use Admin\Controller;
class PhotoController extends BaseController {
	public function showlist() {
		$user_id = I('get.user_id');
		$search = $this->getWhere();
		if (!empty($search['id'])) {
			$search['id'] = intval($search['id']);
		}
		//设置显示项参数
		$array['SelectAll'] = 'yes';
		$array['delSelect'] = 'no';
		$array['disSelect'] = 'no';
		$array['url'] = "index.php?m=Admin&c=Photo&a=showlist&user_id=$user_id";
		$array['fields'] = array('id'=>'编号','created'=>'发布时间');
		//设置分页参数
		$pages['size'] = isset($search['size'])?$search['size']:C('DEFAULT_PAGESIZE');  
		$pages['page'] = isset($search['page'])?$search['page']:1;
		//设置排序参数
		$pages['sort'] = isset($search['sort'])?$search['sort']:'id';
		$pages['dir'] = isset($search['dir'])?$search['dir']:'asc';

		$user = D('Photo');
        $result = $user->showList($user_id,$search,$pages);
        $pages['count'] = $result['count'];
        $pages['allPages'] = ceil(intval($pages['count'])/$pages['size']);

       	$year = date('Y',time());

        $this->assign('search',$search);
        $this->assign('list',$result['list']);
        $this->assign('num',1);
        $this->assign($array);
        $this->assign($pages);
        $this->assign('year',$year);
        $this->assign('user_id',$user_id);
		$this->display();
	}
	public function del()
	{
		$id = I('get.id');
		if (!$id) {
			$data = array('status'=>'error','msg'=>L('illegal submission'));
			return $this->ajaxReturn($data);
		}
		$photoModel = M('Photo');
		$url = $photoModel->where('id='.$id)->getField('url');
		$res = $photoModel->where('id='.$id)->delete();
		if (!$res) {
			$data = array('status'=>'error','msg'=>L("opertion failed"));
			return $this->ajaxReturn(L('operation failure'));
		}else{
			if (file_exists($url)) {
				unlink($url);
			}
			$data = array('status'=>'success','msg'=>L("delete success"));
			return $this->ajaxReturn ($data);
		}
		
	}
}
?>
