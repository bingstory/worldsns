<?php
namespace Admin\Controller;
use Admin\Controller;
class StickerController extends BaseController{
	public function showlist() {
		$search = $this->getWhere();
		if (!empty($search['id'])) {
			$search['id'] = intval($search['id']);
		}
		//设置显示项参数
		$array['SelectAll'] = 'yes';
		$array['delSelect'] = 'yes';
		$array['disSelect'] = 'no';
		$array['url'] = U("Admin/Sticker/showlist");
		$array['fields'] = array('id'=>'编号','created'=>'创建时间','updated'=>'更新时间');
		//设置分页参数
		$pages['size'] = isset($search['size'])?$search['size']:C('DEFAULT_PAGESIZE');  
		$pages['page'] = isset($search['page'])?$search['page']:1;
		//设置排序参数
		$pages['sort'] = isset($search['sort'])?$search['sort']:'id';
		$pages['dir'] = isset($search['dir'])?$search['dir']:'asc';

		$stickerModel = D('Sticker');
        $result = $stickerModel->showList($search,$pages);
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
		$price = I('post.addprice');
		$addimg = I('data.addimg','','',$_FILES);
		if (!$name) {
			$msg = array('status'=>'error','msg'=>L('please input gift name'));
			return $this->ajaxReturn($msg);
		}
		if (!$price) {
			$msg = array('status'=>'error','msg'=>L('please input price'));
			return $this->ajaxReturn($msg );
		}
		if (empty($addimg)) {
			$msg = array('status'=>'error','msg'=>L('please upload img'));
			return $this->ajaxReturn($msg);
		}
		$upload = new \Think\Upload();
    	$upload->maxSize   =     2097152 ;  //2M
    	$upload->exts      =     array('jpg', 'gif', 'png', 'jpeg');
    	$upload->rootPath  =     './Public/Upload/sticker/';
    	$upload->savePath  =     '';
    	$upload->saveName  =      array('uniqid','');
    	$upload->autoSub   =   	false;
    	$info = $upload->upload();
    	if(!$info) {// 上传错误提示错误信息
    		$msg = array('status'=>'error','msg'=>$upload->getError());
	        return $this->ajaxReturn($msg);
	    }
	    $img = $upload->rootPath.$info['addimg']["savename"];

	    $data = array(
	    		'name' 		=> $name,
	    		'price' 	=> $price,
	    		'img' 		=> $img,
	    		'created'   => time()
	    	);
	    $trans = new TransController;
	    $data['name_zhcn'] = $trans->translate($name,'zh');
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

	    $stickerModel = M('sticker');
	    $res = $stickerModel->add($data);
	    if (!$res) {
	    	$msg = array('status'=>'error',"msg"=>L("add failure"));
			return  $this->ajaxReturn($msg);
	    }
		$msg = array('status'=>'success',"msg"=>L("add success"));
		return  $this->ajaxReturn($msg);
	}

	public function edit () {
		$id = I('post.editid');
		$name = I('post.editname');
		$price = I('post.editprice');
		$editimg = I('data.editimg','','',$_FILES);
		if (!$id) {
			$msg = array('status'=>'error','msg'=>L('illegal submission'));
			return $this->ajaxReturn($msg);
		}
		if (!$name) {
			$msg = array('status'=>'error','msg'=>L('please input gift name'));
			return $this->ajaxReturn($msg);
		}
		if (!$price) {
			$msg = array('status'=>'error','msg'=>L('please input price'));
			return $this->ajaxReturn($msg );
		}
		if (!empty($editimg)) {
			$upload = new \Think\Upload();
	    	$upload->maxSize   =     2097152 ;  //2M
	    	$upload->exts      =     array('jpg', 'gif', 'png', 'jpeg');
	    	$upload->rootPath  =     './Public/Upload/gift/';
	    	$upload->savePath  =     '';
	    	$upload->saveName  =      array('uniqid','');
	    	$upload->autoSub   =   	false;
	    	$info = $upload->upload();
	    	if(!$info) {// 上传错误提示错误信息
	    		$msg = array('status'=>'error','msg'=>$upload->getError());
		        return $this->ajaxReturn($msg);
		    }
		}
		$data = array(
				'name'  => $name,
				'price' => $price,
				'updated' => time(),
			);
		if (!empty($editimg)) {
			$data['img'] = $upload->rootPath.$info['editimg']["savename"];
		}
		$trans = new TransController;
		$data['name_zhcn'] = $trans->translate($name,'zh');
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
		$stickerModel = M('Sticker');
		$res = $stickerModel->where('id='.$id)->save($data);
		if (!$res) {
			$msg = array('status'=>'error',"msg"=>L("modify failure"));
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
		$stickerModel = M('sticker');
		$res = $stickerModel->where('id='.$id)->delete();
		if (!$res) {
			$data = array('status'=>'error','msg'=>L("opertion failed"));
			return $this->ajaxReturn($data);
		}else{
			$stickerDetailModel = M('StickerDetail');
			$arr = $stickerDetailModel->where('sticker_id='.$id)->select();
			$stickerDetailModel->where('sticker_id='.$id)->delete();
			foreach($arr as $item) {
				unlink($item['detail_img']);
			}
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
			$gift = D('Sticker');
			$res = $gift->batchDelete($ids);
			$msg = array('status'=>'sucess','data'=>$res);
			return $this->ajaxReturn($msg);
		}else{
			$msg = array('status'=>'error','msg'=>L('illegal submission'));
			return $this->ajaxReturn($msg);
		}
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
		$stickerModel = M('sticker');
		$data['permission'] = $status;
		$result = $stickerModel->where('id='.$id)->save($data);
		if (!$result) {
			$data = array('status'=>'error','msg'=>L("opertion failed"));
			return $this->ajaxReturn($data);
		}
		$data = array('status'=>'success','msg'=>L("opertion success"));
		return $this->ajaxReturn($data);
	}

	public function getCate() {
		$type = I('get.type');
		$giftCateModel = M('gift_cate');
		$where = array(
				'type' => $type 
			);
		$list = $giftCateModel->field('id,name_zhcn')->where($where)->select();
		if (!$list) {
			$msg = array('status'=>'error','msg'=>L("opertion failed"));
		}else{
			$msg = array('status'=>'success','data'=>$list);
		}
		$this->ajaxReturn($msg);
		$this->display();
	}

}
?>
