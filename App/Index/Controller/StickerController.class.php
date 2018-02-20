<?php
namespace Index\Controller;
use Index\Controller;
class StickerController extends BaseController {
	public function index() {
		$this->display();
	}
	public function getList() {
		$index = I('post.index');
		$size = I('post.size');
		$stickerModel = M('sticker');
		$userId = session('userId');
		if (isset($_COOKIE['think_language'])) {
			$l = cookie('think_language');
		}else{
			$l = 'zh-cn';
		}
		$lang = str_replace('-', '', $l);
		$ext = strtolower($lang);
		$field = 'name_'.$ext;
		$str = "id,name,".$field." as des,price,img";
		$list = $stickerModel->field($str)->limit($index,$size)->select();

		$userStickerModel = M('user_sticker');
		$userStickerWhere = array(
						'user_id' => $userId
			);
		$user_sticker = $userStickerModel->where($userStickerWhere)->select();

		for ($i = 0 ; $i < count($list) ; $i ++) {
			foreach ($user_sticker as $item) {
				if ($list[$i]['id'] == $item['sticker_id']) {
					$list[$i]['permission'] = true;
				}
			}
		}

		if (!$list) {
			$msg = array('status' => 'error');
		}else{
			$msg = array('status' => 'success','data' => $list);
		}
		return $this->ajaxReturn($msg);
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