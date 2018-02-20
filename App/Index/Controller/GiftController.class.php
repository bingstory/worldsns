<?php
namespace Index\Controller;
use Think\Controller;
class GiftController extends BaseController {
	public function index() {
		$this->display();
	}
	public function getList() {
		$index = I('post.index');
		$size = I('post.size');
		$type = I('post.type');
		$cate = I('post.cate');
		$giftCateModel = M('gift_cate');
		$giftModel = M('gift');
		if (isset($_COOKIE['think_language'])) {
			$l = cookie('think_language');
		}else{
			$l = 'zh-cn';
		}
		$lang = str_replace('-', '', $l);
		$ext = strtolower($lang);
		$joinTable = 'gift_detail_'.$ext;
		if ($type == 'real') {
			$cateId = $giftCateModel->where("keywords='$cate'")->getField('id');
			$where = array(
				'gift.cate' => $cateId,
				'gift.type' => $type
			);
			$list = $giftModel->alias('gift')
				->field('gift.id,gift.img,gift.type,gift.cate,gift.status,gift.price,gift.created,detail.name as name')
				->join($joinTable.' as detail on gift.id = detail.id')
				->where($where)
				//->limit($index,$size)
				->select();
		}elseif ($type == 'virtual'){
			if ($cate == 0) {
				$where = array(
					'type' => $type
				);
			}else{
				$where = array(
					'type' => $type,
					'cate' => $cate
				);
			}
			$list = $giftModel
				//->alias('gift')
				//->field('gift.id,gift.img,gift.type,gift.cate,gift.status,gift.price,gift.created,detail.name as name')
				//->join($joinTable.' as detail on gift.id = detail.id')
				->where($where)
				//->limit($index,$size)
				->select();
		}
		if (!$list) {
			$msg = array('status' => 'error');
			$this->ajaxReturn($msg);
		}else{
			$msg = array('status' => 'success','data'=>$list);
			$this->ajaxReturn($msg);
		}
	}

	public function getCatList() {
		$giftCateModel = M('gift_cate');
		if (isset($_COOKIE['think_language'])) {
			$l = cookie('think_language');
		}else{
			$l = 'zh-cn';
		}
		$lang = str_replace('-', '', $l);
		$ext = strtolower($lang);
		$field  = 'name_'.$ext;
		$where = array('type' => 'virtual');
		$list = $giftCateModel->field('id,'.$field.' as name')->where($where)->select();
		if (!$list) {
			$msg = array('status' => 'error');
			return $this->ajaxReturn($msg);
		}
		if ($l == 'zh-cn') {
			$name = '全部';
		}elseif ($l == 'zh-tw') {
			$name = '全部';
		}elseif ($l == 'en-us') {
			$name = 'all';
		}elseif ($l == 'ko-kr') {
			$name = '전부';
		}elseif ($l == 'es') {
			$name = 'Todo';
		}elseif ($l == 'ja') {
			$name = '全部';
		}elseif ($l == 'de') {
			$name = 'Alle';
		}elseif ($l == 'fra') {
			$name = 'Tout';
		}elseif ($l == 'it') {
			$name = 'Tutti i';
		}elseif ($l == 'pt') {
			$name = 'Todos OS';
		}elseif ($l == 'nl') {
			$name = 'Alle';
		}elseif ($l == 'ru') {
			$name = 'все';
		}else {
			$name = '全部';
		}
		$all = array(array('id' => 0,'name' => $name));
		$list = array_merge($all,$list);
		$msg = array('status' => 'success','data' => $list);
		return $this->ajaxReturn($msg);
	}

	public function detail() {
		$floeId = I('post.flowerId');
		if (isset($_COOKIE['think_language'])) {
			$l = cookie('think_language');
		}else{
			$l = 'zh-cn';
		}
		$lang = str_replace('-', '', $l);
		$ext = strtolower($lang);
		$joinTable = 'gift_detail_'.$ext;
		$where = array(
				'gift.id' => $floeId
			);
		$webconfModel = M('web_conf');
		$email = $webconfModel->where('id=1')->getField('email');
		$giftModel = M('gift');
		$detail = $giftModel->alias('gift')
			->field('gift.id,gift.img,gift.type,gift.cate,gift.status,gift.price,gift.created,detail.name as name,detail.material as material,detail.descri as descri,detail.introduce as introduce,detail.words as words')
			->join($joinTable.' as detail on gift.id = detail.id')
			->where($where)
			->find();
		$detail['email'] = $email;
		if (!$detail) {
			$msg = array('status' => 'error');
			$this->ajaxReturn($msg);
		}else{
			$msg = array('status' => 'success','data'=>$detail);
			$this->ajaxReturn($msg);
		}

	}
}
?>