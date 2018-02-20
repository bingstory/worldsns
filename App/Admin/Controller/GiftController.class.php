<?php
namespace Admin\Controller;
use Admin\Controller;
/**
*	管理员维护，管理员的增删改查以及赋权功能
*	@author ftian
*/
class GiftController extends BaseController{
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
		$array['url'] = U("Admin/Gift/showlist");
		$array['fields'] = array('id'=>'编号','created'=>'创建时间','updated'=>'更新时间');
		//设置分页参数
		$pages['size'] = isset($search['size'])?$search['size']:C('DEFAULT_PAGESIZE');  
		$pages['page'] = isset($search['page'])?$search['page']:1;
		//设置排序参数
		$pages['sort'] = isset($search['sort'])?$search['sort']:'id';
		$pages['dir'] = isset($search['dir'])?$search['dir']:'asc';

		$gift = D('Gift');
        $result = $gift->showList($search,$pages);
        $pages['count'] = $result['count'];
        $pages['allPages'] = ceil(intval($pages['count'])/$pages['size']);

        $giftCate = M('gift_cate');
        $catelist = $giftCate->field('id,name_zhcn')->where("type='virtual'")->select();

        $this->assign('search',$search);
        $this->assign('list',$result['list']);
        $this->assign('num',1);
        $this->assign('catelist',$catelist);
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
		$type = I('post.addtype');
		$cate = I('post.addcate');
		$introduce = I('post.addintroduce');
		$descri = I('post.adddescribe');
		$material = I('post.addmaterial');
		$words = I('post.addwords');
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
    	$upload->rootPath  =     './Public/Upload/gift/';
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
	    		'type'		=> $type,
	    		'cate'      => $cate,
	    		'created' 	=> time()
	    	);
	    if ($type == 'real') {
	    	if (!$introduce) {
	    		$msg = array('status'=>'error','msg'=>L('please input introduce'));
				return $this->ajaxReturn($msg);
	    	}
	    	if (!$descri) {
	    		$msg = array('status'=>'error','msg'=>L('please input descri'));
				return $this->ajaxReturn($msg);
	    	}
	    	if (!$material) {
	    		$msg = array('status'=>'error','msg'=>L('please input material'));
				return $this->ajaxReturn($msg);
	    	}
	    	if (!$words) {
	    		$msg = array('status'=>'error','msg'=>L('please input words'));
				return $this->ajaxReturn($msg);
	    	}
	    	$data['introduce'] = $introduce;
	    	$data['descri'] = $descri;
	    	$data['material'] = $material;
	    	$data['words'] = $words;
	    }
		$gift = M('gift');
		$res = $gift->add($data);
		if (!$res) {
			$msg = array('status'=>'error','msg'=>L('operation failure'));
			return  $this->ajaxReturn($msg);
		}
		$trans = new TransController;
		if ($type == 'real') {
			$giftzhcn = M('gift_detail_zhcn');
			$nameTra = $trans->translate($name,'zh');
			$introduceTra = $trans->translate($introduce,'zh');
			$descriTra = $trans->translate($descri,'zh');
			$materialTra = $trans->translate($material,'zh');
			$wordsTra = $trans->translate($words,'zh');
			$datazhcn = array(
					'id' => $res,
					'name' => $nameTra,
					'introduce' => $introduceTra,
					'descri' => $descriTra,
					'material' => $materialTra,
					'words' => $wordsTra,
					'created' => time()
				);
			$giftzhcn->add($datazhcn);

			$giftzhtw = M('gift_detail_zhtw');
			$nameTra = $trans->translate($name,'cht');
			$introduceTra = $trans->translate($introduce,'cht');
			$descriTra = $trans->translate($descri,'cht');
			$materialTra = $trans->translate($material,'cht');
			$wordsTra = $trans->translate($words,'cht');
			$datazhtw = array(
					'id' => $res,
					'name' => $nameTra,
					'introduce' => $introduceTra,
					'descri' => $descriTra,
					'material' => $materialTra,
					'words' => $wordsTra,
					'created' => time()
				);
			$giftzhtw->add($datazhtw);

			$giftenus = M('gift_detail_enus');
			$nameTra = $trans->translate($name,'en');
			$introduceTra = $trans->translate($introduce,'en');
			$descriTra = $trans->translate($descri,'en');
			$materialTra = $trans->translate($material,'en');
			$wordsTra = $trans->translate($words,'en');
			$dataenus = array(
					'id' => $res,
					'name' => $nameTra,
					'introduce' => $introduceTra,
					'descri' => $descriTra,
					'material' => $materialTra,
					'words' => $wordsTra,
					'created' => time()
				);
			$giftenus->add($dataenus);

			$giftja = M('gift_detail_ja');
			$nameTra = $trans->translate($name,'jp');
			$introduceTra = $trans->translate($introduce,'jp');
			$descriTra = $trans->translate($descri,'jp');
			$materialTra = $trans->translate($material,'jp');
			$wordsTra = $trans->translate($words,'jp');
			$dataja = array(
					'id' => $res,
					'name' => $nameTra,
					'introduce' => $introduceTra,
					'descri' => $descriTra,
					'material' => $materialTra,
					'words' => $wordsTra,
					'created' => time()
				);
			$giftja->add($dataja);

			$giftkokr = M('gift_detail_kokr');
			$nameTra = $trans->translate($name,'kor');
			$introduceTra = $trans->translate($introduce,'kor');
			$descriTra = $trans->translate($descri,'kor');
			$materialTra = $trans->translate($material,'kor');
			$wordsTra = $trans->translate($words,'kor');
			$datakokr = array(
					'id' => $res,
					'name' => $nameTra,
					'introduce' => $introduceTra,
					'descri' => $descriTra,
					'material' => $materialTra,
					'words' => $wordsTra,
					'created' => time()
				);
			$giftkokr->add($datakokr);

			$giftes = M('gift_detail_es');
			$nameTra = $trans->translate($name,'spa');
			$introduceTra = $trans->translate($introduce,'spa');
			$descriTra = $trans->translate($descri,'spa');
			$materialTra = $trans->translate($material,'spa');
			$wordsTra = $trans->translate($words,'spa');
			$dataes = array(
					'id' => $res,
					'name' => $nameTra,
					'introduce' => $introduceTra,
					'descri' => $descriTra,
					'material' => $materialTra,
					'words' => $wordsTra,
					'created' => time()
				);
			$giftes->add($dataes);

			$giftde = M('gift_detail_de');
			$nameTra = $trans->translate($name,'de');
			$introduceTra = $trans->translate($introduce,'de');
			$descriTra = $trans->translate($descri,'de');
			$materialTra = $trans->translate($material,'de');
			$wordsTra = $trans->translate($words,'de');
			$datade = array(
					'id' => $res,
					'name' => $nameTra,
					'introduce' => $introduceTra,
					'descri' => $descriTra,
					'material' => $materialTra,
					'words' => $wordsTra,
					'created' => time()
				);
			$giftde->add($datade);

			$giftfra = M('gift_detail_fra');
			$nameTra = $trans->translate($name,'fra');
			$introduceTra = $trans->translate($introduce,'fra');
			$descriTra = $trans->translate($descri,'fra');
			$materialTra = $trans->translate($material,'fra');
			$wordsTra = $trans->translate($words,'fra');
			$datafra = array(
					'id' => $res,
					'name' => $nameTra,
					'introduce' => $introduceTra,
					'descri' => $descriTra,
					'material' => $materialTra,
					'words' => $wordsTra,
					'created' => time()
				);
			$giftfra->add($datafra);

			$giftit = M('gift_detail_it');
			$nameTra = $trans->translate($name,'it');
			$introduceTra = $trans->translate($introduce,'it');
			$descriTra = $trans->translate($descri,'it');
			$materialTra = $trans->translate($material,'it');
			$wordsTra = $trans->translate($words,'it');
			$datait = array(
					'id' => $res,
					'name' => $nameTra,
					'introduce' => $introduceTra,
					'descri' => $descriTra,
					'material' => $materialTra,
					'words' => $wordsTra,
					'created' => time()
				);
			$giftit->add($datait);

			$giftnl = M('gift_detail_nl');
			$nameTra = $trans->translate($name,'nl');
			$introduceTra = $trans->translate($introduce,'nl');
			$descriTra = $trans->translate($descri,'nl');
			$materialTra = $trans->translate($material,'nl');
			$wordsTra = $trans->translate($words,'nl');
			$datanl = array(
					'id' => $res,
					'name' => $nameTra,
					'introduce' => $introduceTra,
					'descri' => $descriTra,
					'material' => $materialTra,
					'words' => $wordsTra,
					'created' => time()
				);
			$giftnl->add($datanl);

			$giftpt = M('gift_detail_pt');
			$nameTra = $trans->translate($name,'pt');
			$introduceTra = $trans->translate($introduce,'pt');
			$descriTra = $trans->translate($descri,'pt');
			$materialTra = $trans->translate($material,'pt');
			$wordsTra = $trans->translate($words,'pt');
			$datapt = array(
					'id' => $res,
					'name' => $nameTra,
					'introduce' => $introduceTra,
					'descri' => $descriTra,
					'material' => $materialTra,
					'words' => $wordsTra,
					'created' => time()
				);
			$giftpt->add($datapt);

			$giftru = M('gift_detail_ru');
			$nameTra = $trans->translate($name,'ru');
			$introduceTra = $trans->translate($introduce,'ru');
			$descriTra = $trans->translate($descri,'ru');
			$materialTra = $trans->translate($material,'ru');
			$wordsTra = $trans->translate($words,'ru');
			$dataru = array(
					'id' => $res,
					'name' => $nameTra,
					'introduce' => $introduceTra,
					'descri' => $descriTra,
					'material' => $materialTra,
					'words' => $wordsTra,
					'created' => time()
				);
			$giftru->add($dataru);
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
		$gift = M('Gift');
		$record = $gift->where('id='.$id)->find();
		$giftCateModel = M('gift_cate');
		$where = array(
				'type' => $record['type']
			);
		$cateList = $giftCateModel->field('id,name_zhcn')->where($where)->select();
		$data = array(
				'list' => $record,
				'cateList' => $cateList
			);
		$msg = array('status'=>'success','data'=>$data);
		$this->ajaxReturn($msg);
	}
	public function edit () {
		$id = I('post.editid');
		$name = I('post.editname');
		$price = I('post.editprice');
		$type = I('post.edittype');
		$cate = I('post.editcate');
		$descri = I('post.editdescribe');
		$material = I('post.editmaterial');
		$words = I('post.editwords');
		$introduce = I('post.editintroduce');
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
		$gift = M('Gift');
		$rawtype = $gift->where('id='.$id)->getField('type');
		$data = array(
				'name'  => $name,
				'price' => $price,
				'cate'	=> $cate,
				'type'  => $type,
				'updated' => time(),
			);
		if (!empty($editimg)) {
			$data['img'] = $upload->rootPath.$info['editimg']["savename"];
		}
		if ($type == 'real') {
	    	if (!$introduce) {
	    		$msg = array('status'=>'error','msg'=>L('please input introduce'));
				return $this->ajaxReturn($msg);
	    	}
	    	if (!$descri) {
	    		$msg = array('status'=>'error','msg'=>L('please input descri'));
				return $this->ajaxReturn($msg);
	    	}
	    	if (!$material) {
	    		$msg = array('status'=>'error','msg'=>L('please input material'));
				return $this->ajaxReturn($msg);
	    	}
	    	if (!$words) {
	    		$msg = array('status'=>'error','msg'=>L('please input words'));
				return $this->ajaxReturn($msg);
	    	}
	    	$data['introduce'] = $introduce;
	    	$data['descri'] = $descri;
	    	$data['material'] = $material;
	    	$data['words'] = $words;
	    }else{
	    	$data['introduce'] = '';
	    	$data['descri'] = '';
	    	$data['material'] = '';
	    	$data['words'] = '';
	    }
		$res = $gift->where('id='.$id)->save($data);
		if (!$res) {
			$msg = array('status'=>'error','msg'=>L('operation failure'));
			return  $this->ajaxReturn($msg);
		}
		$trans = new TransController;
		if ($rawtype == 'virtual') {
			if ($type == 'real') {
				$giftzhcn = M('gift_detail_zhcn');
				$nameTra = $trans->translate($name,'zh');
				$introduceTra = $trans->translate($introduce,'zh');
				$descriTra = $trans->translate($descri,'zh');
				$materialTra = $trans->translate($material,'zh');
				$wordsTra = $trans->translate($words,'zh');
				$datazhcn = array(
						'id' => $id,
						'name' => $nameTra,
						'introduce' => $introduceTra,
						'descri' => $descriTra,
						'material' => $materialTra,
						'words' => $wordsTra,
						'created' => time()
					);
				$giftzhcn->add($datazhcn);

				$giftzhtw = M('gift_detail_zhtw');
				$nameTra = $trans->translate($name,'cht');
				$introduceTra = $trans->translate($introduce,'cht');
				$descriTra = $trans->translate($descri,'cht');
				$materialTra = $trans->translate($material,'cht');
				$wordsTra = $trans->translate($words,'cht');
				$datazhtw = array(
						'id' => $id,
						'name' => $nameTra,
						'introduce' => $introduceTra,
						'descri' => $descriTra,
						'material' => $materialTra,
						'words' => $wordsTra,
						'created' => time()
					);
				$giftzhtw->add($datazhtw);

				$giftenus = M('gift_detail_enus');
				$nameTra = $trans->translate($name,'en');
				$introduceTra = $trans->translate($introduce,'en');
				$descriTra = $trans->translate($descri,'en');
				$materialTra = $trans->translate($material,'en');
				$wordsTra = $trans->translate($words,'en');
				$dataenus = array(
						'id' => $id,
						'name' => $nameTra,
						'introduce' => $introduceTra,
						'descri' => $descriTra,
						'material' => $materialTra,
						'words' => $wordsTra,
						'created' => time()
					);
				$giftenus->add($dataenus);

				$giftja = M('gift_detail_ja');
				$nameTra = $trans->translate($name,'jp');
				$introduceTra = $trans->translate($introduce,'jp');
				$descriTra = $trans->translate($descri,'jp');
				$materialTra = $trans->translate($material,'jp');
				$wordsTra = $trans->translate($words,'jp');
				$dataja = array(
						'id' => $id,
						'name' => $nameTra,
						'introduce' => $introduceTra,
						'descri' => $descriTra,
						'material' => $materialTra,
						'words' => $wordsTra,
						'created' => time()
					);
				$giftja->add($dataja);

				$giftkokr = M('gift_detail_kokr');
				$nameTra = $trans->translate($name,'kor');
				$introduceTra = $trans->translate($introduce,'kor');
				$descriTra = $trans->translate($descri,'kor');
				$materialTra = $trans->translate($material,'kor');
				$wordsTra = $trans->translate($words,'kor');
				$datakokr = array(
						'id' => $id,
						'name' => $nameTra,
						'introduce' => $introduceTra,
						'descri' => $descriTra,
						'material' => $materialTra,
						'words' => $wordsTra,
						'created' => time()
					);
				$giftkokr->add($datakokr);

				$giftes = M('gift_detail_es');
				$nameTra = $trans->translate($name,'spa');
				$introduceTra = $trans->translate($introduce,'spa');
				$descriTra = $trans->translate($descri,'spa');
				$materialTra = $trans->translate($material,'spa');
				$wordsTra = $trans->translate($words,'spa');
				$dataes = array(
						'id' => $id,
						'name' => $nameTra,
						'introduce' => $introduceTra,
						'descri' => $descriTra,
						'material' => $materialTra,
						'words' => $wordsTra,
						'created' => time()
					);
				$giftes->add($dataes);

				$giftde = M('gift_detail_de');
				$nameTra = $trans->translate($name,'de');
				$introduceTra = $trans->translate($introduce,'de');
				$descriTra = $trans->translate($descri,'de');
				$materialTra = $trans->translate($material,'de');
				$wordsTra = $trans->translate($words,'de');
				$datade = array(
						'id' => $id,
						'name' => $nameTra,
						'introduce' => $introduceTra,
						'descri' => $descriTra,
						'material' => $materialTra,
						'words' => $wordsTra,
						'created' => time()
					);
				$giftde->add($datade);

				$giftfra = M('gift_detail_fra');
				$nameTra = $trans->translate($name,'fra');
				$introduceTra = $trans->translate($introduce,'fra');
				$descriTra = $trans->translate($descri,'fra');
				$materialTra = $trans->translate($material,'fra');
				$wordsTra = $trans->translate($words,'fra');
				$datafra = array(
						'id' => $id,
						'name' => $nameTra,
						'introduce' => $introduceTra,
						'descri' => $descriTra,
						'material' => $materialTra,
						'words' => $wordsTra,
						'created' => time()
					);
				$giftfra->add($datafra);

				$giftit = M('gift_detail_it');
				$nameTra = $trans->translate($name,'it');
				$introduceTra = $trans->translate($introduce,'it');
				$descriTra = $trans->translate($descri,'it');
				$materialTra = $trans->translate($material,'it');
				$wordsTra = $trans->translate($words,'it');
				$datait = array(
						'id' => $id,
						'name' => $nameTra,
						'introduce' => $introduceTra,
						'descri' => $descriTra,
						'material' => $materialTra,
						'words' => $wordsTra,
						'created' => time()
					);
				$giftit->add($datait);

				$giftnl = M('gift_detail_nl');
				$nameTra = $trans->translate($name,'nl');
				$introduceTra = $trans->translate($introduce,'nl');
				$descriTra = $trans->translate($descri,'nl');
				$materialTra = $trans->translate($material,'nl');
				$wordsTra = $trans->translate($words,'nl');
				$datanl = array(
						'id' => $id,
						'name' => $nameTra,
						'introduce' => $introduceTra,
						'descri' => $descriTra,
						'material' => $materialTra,
						'words' => $wordsTra,
						'created' => time()
					);
				$giftnl->add($datanl);

				$giftpt = M('gift_detail_pt');
				$nameTra = $trans->translate($name,'pt');
				$introduceTra = $trans->translate($introduce,'pt');
				$descriTra = $trans->translate($descri,'pt');
				$materialTra = $trans->translate($material,'pt');
				$wordsTra = $trans->translate($words,'pt');
				$datapt = array(
						'id' => $id,
						'name' => $nameTra,
						'introduce' => $introduceTra,
						'descri' => $descriTra,
						'material' => $materialTra,
						'words' => $wordsTra,
						'created' => time()
					);
				$giftpt->add($datapt);

				$giftru = M('gift_detail_ru');
				$nameTra = $trans->translate($name,'ru');
				$introduceTra = $trans->translate($introduce,'ru');
				$descriTra = $trans->translate($descri,'ru');
				$materialTra = $trans->translate($material,'ru');
				$wordsTra = $trans->translate($words,'ru');
				$dataru = array(
						'id' => $id,
						'name' => $nameTra,
						'introduce' => $introduceTra,
						'descri' => $descriTra,
						'material' => $materialTra,
						'words' => $wordsTra,
						'created' => time()
					);
				$giftru->add($dataru);
			}
		}else{
			if ($type == 'real') {
				$giftzhcn = M('gift_detail_zhcn');
				$nameTra = $trans->translate($name,'zh');
				$introduceTra = $trans->translate($introduce,'zh');
				$descriTra = $trans->translate($descri,'zh');
				$materialTra = $trans->translate($material,'zh');
				$wordsTra = $trans->translate($words,'zh');
				$datazhcn = array(
						'name' => $nameTra,
						'introduce' => $introduceTra,
						'descri' => $descriTra,
						'material' => $materialTra,
						'words' => $wordsTra,
						'updated' => time()
					);
				$res = $giftzhcn->where('id='.$id)->find();
				if (!$res) {
					$datazhcn['id'] = $id;
					$giftzhcn->add($datazhcn);
				}else{
					$giftzhcn->where('id='.$id)->save($datazhcn);
				}

				$giftzhtw = M('gift_detail_zhtw');
				$nameTra = $trans->translate($name,'cht');
				$introduceTra = $trans->translate($introduce,'cht');
				$descriTra = $trans->translate($descri,'cht');
				$materialTra = $trans->translate($material,'cht');
				$wordsTra = $trans->translate($words,'cht');
				$datazhtw = array(
						'name' => $nameTra,
						'introduce' => $introduceTra,
						'descri' => $descriTra,
						'material' => $materialTra,
						'words' => $wordsTra,
						'updated' => time()
					);
				$res = $giftzhtw->where('id='.$id)->find();
				if (!$res) {
					$datazhtw['id'] = $id;
					$giftzhtw->add($datazhtw);
				}else{
					$giftzhtw->where('id='.$id)->save($datazhtw);
				}

				$giftenus = M('gift_detail_enus');
				$nameTra = $trans->translate($name,'en');
				$introduceTra = $trans->translate($introduce,'en');
				$descriTra = $trans->translate($descri,'en');
				$materialTra = $trans->translate($material,'en');
				$wordsTra = $trans->translate($words,'en');
				$dataenus = array(
						'name' => $nameTra,
						'introduce' => $introduceTra,
						'descri' => $descriTra,
						'material' => $materialTra,
						'words' => $wordsTra,
						'updated' => time()
					);
				$res = $giftenus->where('id='.$id)->find();
				if (!$res) {
					$giftenus['id'] = $id;
					$giftenus->add($dataenus);
				}else{
					$giftenus->where('id='.$id)->save($dataenus);
				}

				$giftja = M('gift_detail_ja');
				$nameTra = $trans->translate($name,'jp');
				$introduceTra = $trans->translate($introduce,'jp');
				$descriTra = $trans->translate($descri,'jp');
				$materialTra = $trans->translate($material,'jp');
				$wordsTra = $trans->translate($words,'jp');
				$dataja = array(
						'name' => $nameTra,
						'introduce' => $introduceTra,
						'descri' => $descriTra,
						'material' => $materialTra,
						'words' => $wordsTra,
						'updated' => time()
					);
				$res = $giftja->where('id='.$id)->find();
				if (!$res) {
					$dataja['id'] = $id;
					$giftja->add($dataja);
				}else{
					$giftja->where('id='.$id)->save($dataja);
				}

				$giftkokr = M('gift_detail_kokr');
				$nameTra = $trans->translate($name,'kor');
				$introduceTra = $trans->translate($introduce,'kor');
				$descriTra = $trans->translate($descri,'kor');
				$materialTra = $trans->translate($material,'kor');
				$wordsTra = $trans->translate($words,'kor');
				$datakokr = array(
						'name' => $nameTra,
						'introduce' => $introduceTra,
						'descri' => $descriTra,
						'material' => $materialTra,
						'words' => $wordsTra,
						'updated' => time()
					);
				$res = $giftkokr->where('id='.$id)->find();
				if (!$res) {
					$datakokr['id'] = $id;
					$giftkokr->add($datakokr);
				}else{
					$giftkokr->where('id='.$id)->save($datakokr);
				}

				$giftes = M('gift_detail_es');
				$nameTra = $trans->translate($name,'spa');
				$introduceTra = $trans->translate($introduce,'spa');
				$descriTra = $trans->translate($descri,'spa');
				$materialTra = $trans->translate($material,'spa');
				$wordsTra = $trans->translate($words,'spa');
				$dataes = array(
						'name' => $nameTra,
						'introduce' => $introduceTra,
						'descri' => $descriTra,
						'material' => $materialTra,
						'words' => $wordsTra,
						'updated' => time()
					);
				$res = $giftes->where('id='.$id)->find();
				if (!$res) {
					$dataes['id'] = $id;
					$giftes->add($dataes);
				}else{
					$giftes->where('id='.$id)->save($dataes);
				}

				$giftde = M('gift_detail_de');
				$nameTra = $trans->translate($name,'de');
				$introduceTra = $trans->translate($introduce,'de');
				$descriTra = $trans->translate($descri,'de');
				$materialTra = $trans->translate($material,'de');
				$wordsTra = $trans->translate($words,'de');
				$datade = array(
						'name' => $nameTra,
						'introduce' => $introduceTra,
						'descri' => $descriTra,
						'material' => $materialTra,
						'words' => $wordsTra,
						'updated' => time()
					);
				$res = $giftde->where('id='.$id)->find();
				if (!$res) {
					$datade['id'] = $id;
					$giftde->add($datade);
				}else{
					$res = $giftde->where('id='.$id)->save($datade);
				}

				$giftfra = M('gift_detail_fra');
				$nameTra = $trans->translate($name,'fra');
				$introduceTra = $trans->translate($introduce,'fra');
				$descriTra = $trans->translate($descri,'fra');
				$materialTra = $trans->translate($material,'fra');
				$wordsTra = $trans->translate($words,'fra');
				$datafra = array(
						'name' => $nameTra,
						'introduce' => $introduceTra,
						'descri' => $descriTra,
						'material' => $materialTra,
						'words' => $wordsTra,
						'updated' => time()
					);
				$res = $giftfra->where('id='.$id)->find();
				if (!$res) {
					$datafra['id'] = $id;
					$giftfra->add($datafra);
				}else{
					$giftfra->where('id='.$id)->save($datafra);
				}

				$giftit = M('gift_detail_it');
				$nameTra = $trans->translate($name,'it');
				$introduceTra = $trans->translate($introduce,'it');
				$descriTra = $trans->translate($descri,'it');
				$materialTra = $trans->translate($material,'it');
				$wordsTra = $trans->translate($words,'it');
				$datait = array(
						'name' => $nameTra,
						'introduce' => $introduceTra,
						'descri' => $descriTra,
						'material' => $materialTra,
						'words' => $wordsTra,
						'updated' => time()
					);
				$res = $giftit->where('id='.$id)->find();
				if (!$res) {
					$datait['id'] = $id;
					$giftit->add($datait);
				}else{
					$giftit->where('id='.$id)->save($datait);
				}

				$giftnl = M('gift_detail_nl');
				$nameTra = $trans->translate($name,'nl');
				$introduceTra = $trans->translate($introduce,'nl');
				$descriTra = $trans->translate($descri,'nl');
				$materialTra = $trans->translate($material,'nl');
				$wordsTra = $trans->translate($words,'nl');
				$datanl = array(
						'name' => $nameTra,
						'introduce' => $introduceTra,
						'descri' => $descriTra,
						'material' => $materialTra,
						'words' => $wordsTra,
						'updated' => time()
					);
				$res = $giftnl->where('id='.$id)->find();
				if (!$res) {
					$datanl['id'] = $id;
					$giftnl->add($datanl);
				}else{
					$giftnl->where('id='.$id)->save($datanl);
				}

				$giftpt = M('gift_detail_pt');
				$nameTra = $trans->translate($name,'pt');
				$introduceTra = $trans->translate($introduce,'pt');
				$descriTra = $trans->translate($descri,'pt');
				$materialTra = $trans->translate($material,'pt');
				$wordsTra = $trans->translate($words,'pt');
				$datapt = array(
						'name' => $nameTra,
						'introduce' => $introduceTra,
						'descri' => $descriTra,
						'material' => $materialTra,
						'words' => $wordsTra,
						'updated' => time()
					);
				$res = $giftpt->where('id='.$id)->find();
				if (!$res) {
					$datapt['id'] = $id;
					$giftpt->add($datapt);
				}else{
					$giftpt->where('id='.$id)->save($datapt);
				}

				$giftru = M('gift_detail_ru');
				$nameTra = $trans->translate($name,'ru');
				$introduceTra = $trans->translate($introduce,'ru');
				$descriTra = $trans->translate($descri,'ru');
				$materialTra = $trans->translate($material,'ru');
				$wordsTra = $trans->translate($words,'ru');
				$dataru = array(
						'name' => $nameTra,
						'introduce' => $introduceTra,
						'descri' => $descriTra,
						'material' => $materialTra,
						'words' => $wordsTra,
						'updated' => time()
					);
				$res = $giftru->where('id='.$id)->find();
				if (!$res) {
					$dataru['id'] = $id;
					$giftru->add($dataru);
				}else{
					$giftru->where('id='.$id)->save($dataru);
				}
			}else{
				$giftzhcn = M('gift_detail_zhcn');
				$giftzhcn->where('id='.$id)->delete();

				$giftzhtw = M('gift_detail_zhtw');
				$giftzhtw->where('id='.$id)->delete();

				$giftenus = M('gift_detail_enus');
				$giftenus->where('id='.$id)->delete();

				$giftja = M('gift_detail_ja');
				$giftja->where('id='.$id)->delete();

				$giftkokr = M('gift_detail_kokr');
				$giftkokr->where('id='.$id)->delete();

				$giftes = M('gift_detail_es');
				$giftes->where('id='.$id)->delete();

				$giftde = M('gift_detail_de');
				$giftde->where('id='.$id)->delete();

				$giftfra = M('gift_detail_fra');
				$giftfra->where('id='.$id)->delete();

				$giftit = M('gift_detail_it');
				$giftit->where('id='.$id)->delete();

				$giftnl = M('gift_detail_nl');
				$giftnl->where('id='.$id)->delete();

				$giftpt = M('gift_detail_pt');
				$giftpt->where('id='.$id)->delete();

				$giftru = M('gift_detail_ru');
				$giftru->where('id='.$id)->delete();
			}
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
		$gift = M('Gift');
		$res = $gift->where('id='.$id)->delete();
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
			$gift = D('Gift');
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
		$gift = M('gift');
		$data['status'] = $status;
		$result = $gift->where('id='.$id)->save($data);
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
	}
}
