<?php
namespace Admin\Controller;
use Admin\Controller;
/**
*	管理员维护，管理员的增删改查以及赋权功能
*	@author ftian
*/
class GiftCateController extends BaseController{
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
		$array['url'] = U("Admin/GiftCate/showlist");
		$array['fields'] = array('id'=>'编号','created'=>'创建时间','updated'=>'更新时间');
		//设置分页参数
		$pages['size'] = isset($search['size'])?$search['size']:C('DEFAULT_PAGESIZE');  
		$pages['page'] = isset($search['page'])?$search['page']:1;
		//设置排序参数
		$pages['sort'] = isset($search['sort'])?$search['sort']:'id';
		$pages['dir'] = isset($search['dir'])?$search['dir']:'asc';

		$gift = D('GiftCate');
        $result = $gift->showList($search,$pages);
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
		$name = I('post.addname');
		$type = I('post.addtype');
	    $data = array(
	    		'name_zhcn' => $name,
	    		'type' 		=> $type,
	    		'created' 	=> time()
	    	);
	    $trans = new TransController;
	    $data['name_zhtw'] = $trans->translate($name,'cht');
	    $data['name_enus'] = $trans->translate($name,'en');
	    $data['name_ja'] = $trans->translate($name,'jp');
	    $data['name_kokr'] = $trans->translate($name,'kor');
	    $data['name_es'] = $trans->translate($name,'spa');
	    $data['name_de'] = $trans->translate($name,'de');
	    $data['name_fra'] = $trans->translate($name,'fra');
	    $data['name_it'] = $trans->translate($name,'it');
	    $data['name_nl'] = $trans->translate($name,'nl');
	    $data['name_pt'] = $trans->translate($name,'pt');
	    $data['name_ru'] = $trans->translate($name,'ru');
		$gift = M('gift_cate');
		$res = $gift->add($data);
		if (!$res) {
			$msg = array('status'=>'error','msg'=>L('add failure'));
			return  $this->ajaxReturn($msg);
		}
		$msg = array('status'=>'success',"msg"=>L("add success"));
		return  $this->ajaxReturn($msg);
	}

	public function showEdit() {
		$id = I('get.id');
		if (!$id) {
			$msg = array('status'=>'error','msg'=>L('illegal submission'));
			return $this->ajaxReturn($msg);
		}
		$giftCateModel = M('gift_cate');
		$record = $giftCateModel->field('id,name_zhcn,type')->where('id='.$id)->find();
		$msg = array('status'=>'success','data'=>$record);
		$this->ajaxReturn($msg);
	}
	public function edit () {
		$id = I('post.editid');
		$name = I('post.editname');
		$type = I('post.edittype');
		
		$data = array(
	    		'name_zhcn' => $name,
	    		'type' 		=> $type,
	    		'updated' 	=> time()
	    	);
	    $trans = new TransController;
	    $data['name_zhtw'] = $trans->translate($name,'cht');
	    $data['name_enus'] = $trans->translate($name,'en');
	    $data['name_ja'] = $trans->translate($name,'jp');
	    $data['name_kokr'] = $trans->translate($name,'kor');
	    $data['name_es'] = $trans->translate($name,'spa');
	    $data['name_de'] = $trans->translate($name,'de');
	    $data['name_fra'] = $trans->translate($name,'fra');
	    $data['name_it'] = $trans->translate($name,'it');
	    $data['name_nl'] = $trans->translate($name,'nl');
	    $data['name_pt'] = $trans->translate($name,'pt');
	    $data['name_ru'] = $trans->translate($name,'ru');
		$giftCate = M('gift_cate');
		$res = $giftCate->where('id='.$id)->save($data);
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
		$giftCate = M('gift_cate');
		$res = $giftCate->where('id='.$id)->delete();
		if (!$res) {
			$data = array('status'=>'error','msg'=>L("opertion failed"));
			return $this->ajaxReturn(L('operation failure'));
		}else{
			$data = array('status'=>'success','msg'=>L("delete success"));
			return $this->ajaxReturn ($data);
		}
		
	}
}
