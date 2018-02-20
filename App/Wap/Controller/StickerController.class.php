<?php
namespace Wap\Controller;
use Wap\Controller;
class StickerController extends BaseController {
	public function index() {
		$this->display();
	}
	public function getList() {
		$index = I('post.index');
		$size = I('post.size');
		$langphp = I('post.langphp');
		$userId = session('userId');
		$stickerModel = M('sticker');
		if ($langphp == 'zh') {
			$l = 'zh-cn';
		}elseif ($langphp == 'tw') {
			$l = 'zh-tw';
		}elseif ($langphp == 'en-en') {
			$l = 'en-us';
		}elseif ($langphp == 'Fr') {
			$l = 'fra';
		}elseif ($langphp == 'KO') {
			$l = 'ko-kr';
		}else{
			$l = 'zh-cn';
		}
		$lang = str_replace('-', '', $l);
		$ext = strtolower($lang);
		$field = 'name_'.$ext;
		$str = "id,name,".$field." as des,price,img";
		$list = $stickerModel->field($str)->limit($index*$size,$size)->select();

		$stickerDetailModel = M('sticker_detail');
		$detaillist = $stickerDetailModel->field('id,sticker_id,detail_img')->select();

		$userStickerModel = M('user_sticker');
		$userStickerlist = $userStickerModel->field('id,user_id,sticker_id')->where('user_id='.$userId)->select();
		for ($i = 0 ; $i < count($list) ; $i++) {
			$arr = array();
			foreach ($detaillist as $item) {
				if ($list[$i]['id'] == $item['sticker_id']) {
					$arr[] = $item;
				}
			}
			foreach ($userStickerlist as $row) {
				if ($row['sticker_id'] == $list[$i]['id']) {
					$list[$i]['permission'] = 1;
				}
			}
			$list[$i]['detail'] = $arr;
		}

		if (!$list) {
			$msg = array('status' => 'error');
		}else{
			$msg = array('status' => 'success','data' => $list);
		}
		return $this->ajaxReturn($msg);
	}
	public function getDetail() {
		$id = I('post.id');
		$langphp = I('post.langphp');
		$stickerModel = M('sticker');
		$userId = session('userId');
		if ($langphp == 'zh') {
			$l = 'zh-cn';
		}elseif ($langphp == 'tw') {
			$l = 'zh-tw';
		}elseif ($langphp == 'en-en') {
			$l = 'en-us';
		}elseif ($langphp == 'Fr') {
			$l = 'fra';
		}elseif ($langphp == 'KO') {
			$l = 'ko-kr';
		}else{
			$l = 'zh-cn';
		}
		$lang = str_replace('-', '', $l);
		$ext = strtolower($lang);
		$field = 'name_'.$ext;
		$str = "id,name,".$field." as des,price,img";
		$sticker = $stickerModel->field($str)->where('id='.$id)->find();

		$stickerDetailModel = M('sticker_detail');
		$detaillist = $stickerDetailModel->field('id,sticker_id,detail_img')->select();

		$userStickerModel = M('user_sticker');
		$userStickerlist = $userStickerModel->field('id,user_id,sticker_id')->where('user_id='.$userId)->select();
		$arr = array();
		foreach ($detaillist as $item) {
			if ($sticker['id'] == $item['sticker_id']) {
				$arr[] = $item;
			}
		}
		foreach ($userStickerlist as $row) {
			if ($row['sticker_id'] == $sticker['id']) {
				$sticker['permission'] = 1;
			}
		}
		$sticker['detail'] = $arr;
		if (!$sticker) {
			$msg = array('status' => 'error');
			$this->ajaxReturn();
		}else{
			$msg = array('status' => 'success','data' => $sticker);
			$this->ajaxReturn($msg);
		}
	}
	public function order() {
		$stickerId = I('post.stickerId');
		$stickerModel = M('sticker');
		$amount = $stickerModel->where('id='.$stickerId)->getField('price');
		$userId = session('userId');

		$userStickerModel = M('user_sticker');
		$userStickerWhere = array(
						'user_id' => $userId,
						'sticker_id' => $stickerId
			);
		$id = $userStickerModel->where($userStickerWhere)->getField('id');
		if ($id) {
			$msg = array('status'=>'error','msg'=>'reapeat');
			return $this->ajaxReturn($msg);
		}

		$userModel = M('user');
		$user = $userModel->where('id='.$userId)->find();
		if ($user['inner_member'] != 1) {
			$gold = $user['gold'];
			if ($gold < $amount) {
				$msg = array('status'=>'error','msg'=>'need_recharge');
				return $this->ajaxReturn($msg);
			}
			$newGold = $gold - $amount;
			$data = array(
					'gold' => $newGold
				);
			$userModel->where('id='.$userId)->save($data);

			$goldRecord = M('gold_record');
			$data = array(
					'user_id' => $userId,
					'gold' => $amount,
					'sum' => $newGold,
					'mark' => '-',
					'type' => 'sticker',
					'record_id' => $res,
					'created' => time()
				);
			$goldRecord->add($data);

			$orderModel = M('order_record');
			$order_sn  = 'or_'.time().uniqid();
			$data = array(
					'order_sn' => $order_sn,
					'user_id' => $userId,
					'gainer' => $userId,
					'goods_type' => 'sticker',
					'record_id' => $res,
					'amount' => $amount,
					'pay_type' => 'gold',
					'currency' => '金币',
					'pay_status' => '4',
					'created' => time()
				);
			$orderModel->add($data);
		
			$webConfModel = M('web_conf');
			$webInfo = $webConfModel->where('id=1')->find();
			$commisionModel = M('commission');
			$commisiondata = array(
					'user_id' => $userId,
					'gainer' => $userId,
					'type' => 'sticker',
					'amount' => $amount,
					'rate' => $webInfo['consume_commission'],
					'commision' => $amount * $webInfo['consume_commission'] / 100,
					'order_sn' => $order_sn,
					'created' => time()
				);
			$commisionModel->add($commisiondata);
		}
		$data = array(
				'user_id' => $userId,
				'sticker_id' => $stickerId,
				'created' => time() 
			);
		$res = $userStickerModel->add($data);

		if (!$res) {
			$msg = array('status'=>'error','msg'=>'buy_failure');
			return $this->ajaxReturn($msg);
		}
		$msg = array('status'=>'success','balance'=>$newGold);
		$this->ajaxReturn($msg);
	}
}
?>