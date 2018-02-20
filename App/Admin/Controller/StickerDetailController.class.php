<?php
namespace Admin\Controller;
use Admin\Controller;
class StickerDetailController extends BaseController{
	public function showlist() {
		$sticker = I('get.sticker_id');
		$search = $this->getWhere();
		if (!empty($search['id'])) {
			$search['id'] = intval($search['id']);
		}
		//设置显示项参数
		$array['SelectAll'] = 'yes';
		$array['delSelect'] = 'no';
		$array['disSelect'] = 'no';
		$array['url'] = U("Admin/StickerDetail/showlist");
		$array['fields'] = array('id'=>'编号','created'=>'创建时间','updated'=>'更新时间');
		//设置分页参数
		$pages['size'] = isset($search['size'])?$search['size']:C('DEFAULT_PAGESIZE');  
		$pages['page'] = isset($search['page'])?$search['page']:1;
		//设置排序参数
		$pages['sort'] = isset($search['sort'])?$search['sort']:'id';
		$pages['dir'] = isset($search['dir'])?$search['dir']:'asc';

		$stickerDetailModel = D('StickerDetail');
        $result = $stickerDetailModel->showList($search,$pages,$sticker);
        $pages['count'] = $result['count'];
        $pages['allPages'] = ceil(intval($pages['count'])/$pages['size']);
        $this->assign('search',$search);
        $this->assign('list',$result['list']);
        $this->assign('num',1);
        $this->assign('sticker',$sticker);
        $this->assign($array);
        $this->assign($pages);
		$this->display();
	}

	/**
	 * 添加管理员
	 */
	public function add()
	{
		$sticker_id = I('get.sticker_id');
		$addimg = I('data.addimg','','',$_FILES);
		if (empty($addimg)) {
			$msg = array('status'=>'error','msg'=>L('please upload img'));
			return $this->ajaxReturn($msg);
		}
		$upload = new \Think\Upload();
    	$upload->maxSize   =     2097152 ;  //2M
    	$upload->exts      =     array('jpg', 'gif', 'png', 'jpeg');
    	$upload->rootPath  =     './public/Upload/sticker/';
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
	    		'sticker_id' => $sticker_id, 
	    		'detail_img' => $img,
	    		'created'   => time()
	    	);

	    $stickerDetailModel = M('sticker_detail');
	    $res = $stickerDetailModel->add($data);
	    if (!$res) {
	    	$msg = array('status'=>'error',"msg"=>L("add failure"));
			return  $this->ajaxReturn($msg);
	    }
		$msg = array('status'=>'success',"msg"=>L("add success"));
		return  $this->ajaxReturn($msg);
	}

	public function edit () {
		$id = I('post.editid');
		$editimg = I('data.editimg','','',$_FILES);
		if (!$id) {
			$msg = array('status'=>'error','msg'=>L('illegal submission'));
			return $this->ajaxReturn($msg);
		}
		if (!empty($editimg)) {
			$upload = new \Think\Upload();
	    	$upload->maxSize   =     2097152 ;  //2M
	    	$upload->exts      =     array('jpg', 'gif', 'png', 'jpeg');
	    	$upload->rootPath  =     './public/Upload/gift/';
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
				'updated' => time(),
			);
		if (!empty($editimg)) {
			$data['img'] = $upload->rootPath.$info['editimg']["savename"];
		}
		$stickerDetailModel = M('sticker_detail');
		$res = $stickerDetailModel->where('id='.$id)->save($data);
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
		$stickerDetailModel = M('sticker_detail');
		$img = $stickerDetailModel->where('id='.$id)->getField('detail_img');
		$res = $stickerDetailModel->where('id='.$id)->delete();
		if (!$res) {
			$data = array('status'=>'error','msg'=>L("opertion failed"));
			return $this->ajaxReturn($data);
		}else{
			unlink($img);
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
