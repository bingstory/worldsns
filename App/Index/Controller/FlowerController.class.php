<?php
namespace Index\Controller;
use Think\Controller;
class FlowerController extends BaseController {
	public function index() {
		$this->display();
	}
	public function sendGift() {
		$fid = I('post.fid');
		$gid = I('post.gid');
		$words = I('post.words');
		$type = I('post.type');

		$userId = session('userId');
		$userModel = M('user');
		$user = $userModel->where('id='.$userId)->find();
		$gold = $user['gold'];

		$giftModel = M('gift');
		$gift = $giftModel->where('id='.$gid)->find();
		$amount = $gift['price'];
		$type = $gift['type'];
		if ($user['inner_member'] == 1){
			if ($type == 'virtual') {
				$newGold = $gold;
			}else{
				if ($gold < $amount) {
					$msg = array('status'=>'error');
					return $this->ajaxReturn($msg);
				}
				$newGold = $gold - $amount;
				$data = array(
						'gold' => $newGold
					);
				$userModel->where('id='.$userId)->save($data);
			}	
		}else{
			if ($gold < $amount) {
				$msg = array('status'=>'error');
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
					'type' => 'gift',
					'record_id' => $res,
					'created' => time()
				);
			$goldRecord->add($data);

			$orderModel = M('order_record');
			$order_sn  = 'or_'.time().uniqid();
			$data = array(
					'order_sn' => $order_sn,
					'user_id' => $userId,
					'gainer' => $fid,
					'goods_type' => 'gift',
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
					'gainer' => $fid,
					'type' => 'gift',
					'amount' => $amount,
					'rate' => $webInfo['consume_commission'],
					'commision' => $amount * $webInfo['consume_commission'] / 100,
					'order_sn' => $order_sn,
					'created' => time()
				);
			$commisionModel->add($commisiondata);
		}

		$userGiftModel = M('user_gift');
		$data = array(
				'gift_id' => $gid,
				'sender_id' => $userId,
				'reciver_id' => $fid,
				'amount' => $amount,
				'created' => time()
			);
		if ($words) {
			$data['words'] = $words;
		}
		$res = $userGiftModel->add($data);

		if (!$res) {
			$msg = array('status'=>'error');
			return $this->ajaxReturn($msg);
		}
		$msg = array('status'=>'success','balance'=>$newGold);
		$this->ajaxReturn($msg);
 	}
}
?>