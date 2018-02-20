<?php
namespace Index\Controller;
use Index\Controller;
class SpotController extends BaseController {
	public function index() {
		$this->display();
	}

	public function add() {
		$userId = session('userId');
		$amount = 10;

		$userSpotModel = M('spot_record');
		$data = array(
				'user_id' => $userId,
				'created' => time()
			);
		$res = $userSpotModel->add($data);
		if (!$res) {
			$msg =array('status' => 'error');
			return $this->ajaxReturn($msg);
		}

		$userModel = M('user');
		$gold = $userModel->where('id='.$userId)->getField('gold');
		$newGold = $gold - $amount; 
		$data =array(
				'gold' => $newGold,
				'is_focus' => 1,
				'updated' => time()
			);
		$userModel->where('id='.$userId)->save($data);

		$goldRecord = M('gold_record');
		$data = array(
				'user_id' => $userId,
				'gold' => $amount,
				'sum' => $newGold,
				'mark' => '-',
				'type' => 'spot',
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
				'goods_type' => 'spot',
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
				'type' => 'spot',
				'amount' => $amount,
				'rate' => $webInfo['consume_commission'],
				'commision' => $amount * $webInfo['consume_commission'] / 100,
				'order_sn' => $order_sn,
				'created' => time()
			);
		$commisionModel->add($commisiondata);

		$msg = array('status' => 'success');
		$this->ajaxReturn($msg);	
	}
}