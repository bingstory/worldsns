<?php
namespace Index\Controller;
use Index\Controller;
class TestController extends BaseController {
	public function test() {
		echo '11111111111<br />';
		$_SESSION['payer_id'] =  $_GET['PayerID'];
    	$userId = session('userId');
    	$orderModel = M('order_record');
    	$where = array(
	        		'order_sn' => 'or_14768490095806ed711f53d'
	        	);
    	$order = $orderModel->where($where)->find();
    	$_SESSION['payer_id'] = '4511111111111';
    	$_SESSION['CORRELATIONID'] = '65616561561616516';
        if (!$order) {
        	$msg = 'Failed';
        	echo '222222222';
        }

        $commisionModel = M('commission');



        echo '333333333333<br />';

		$upgradeModel = M('upgrade_record');
		$record_id = $order['record_id'];
		$upgradeRecord = $upgradeModel->where('id='.$record_id)->find();

		if ($upgradeRecord) {
			$updata = array(
					'status' => 'success', 
					'updated' => time() 
				); 
			$res1 =  $upgradeModel->where('id='.$record_id)->save($updata);
		}
    	$orderdata = array(
    			'payer_id' => $_SESSION['payer_id'],
				'correlation_id' => $_SESSION['CORRELATIONID'],
    			'pay_status' => 4,
    			'updated' => time()
    		);
    	$res2 = $orderModel->where($where)->save($orderdata);
    	if ($res1 && $res2) {
    		$paypaldata = array(
					'user_id' => $order['user_id'],
					'gainer' => $order['user_id'],
					'type' => 'upgrade',
					'amount' => $order['amount'],
					'rate' => $webInfo['paypal_commission'],
					'commision' => $order['amount'] * $webInfo['paypal_commission'] / 100,
					'order_sn' => $order['order_sn'],
					'created' => time()
				);
			$goldata = array(
					'user_id' => $order['user_id'],
					'gainer' => $order['gainer'],
					'type' => 'upgrade',
					'amount' => $order['amount'],
					'rate' => $webInfo['consume_commission'],
					'commision' => $order['amount'] * $webInfo['consume_commission'] / 100,
					'order_sn' => $order['order_sn'],
					'created' => time()
				);
			$paypalRes = $commisionModel->add($paypaldata);
			$goldRes = $commisionModel->add($goldata);

    		$userModel = M('user');
    		$custom = $userModel->where('id='.$upgradeRecord['target_id'])->find();
			$t = time();
			$month = $upgradeRecord['time'];
			if (empty($custom['deadline_1'])) {
				$custom['deadline_1'] = 0;
			}
			if (empty($custom['deadline'])) {
				$custom['deadline'] = 0;
			}
			if ($custom['deadline_1'] == 0 && $custom['deadline'] == 0) {
				if ($level == 1) {
					$deadline1 = $t + $month*30*24*3600;
					$deadline = 0;
				}elseif ($level == 2) {
					$deadline1 = 0;
					$deadline = $t + $month*30*24*3600;
				}
			}elseif ($custom['deadline_1'] == 0 && $custom['deadline'] != 0) {
				if ($level == 1) {
					$deadline1 = $t + $month*30*24*3600;
					$deadline = $custom['deadline'] + $month*30*24*3600;
				}elseif ($level == 2) {
					$deadline1 = 0;
					$deadline = $custom['deadline'] + $month*30*24*3600;
				}
			}elseif ($custom['deadline_1'] != 0 && $custom['deadline'] == 0) {
				if ($level == 1) {
					$deadline1 = $custom['deadline_1'] + $month*30*24*3600;
					$deadline = 0;
				}elseif ($level == 2) {
					$deadline1 = $custom['deadline_1']+$month*30*24*3600;
					$deadline = $t + $month*30*24*3600;
				}
			}elseif ($custom['deadline_1'] != 0 && $custom['deadline'] != 0) {
				if ($custom['deadline_1'] > $custom['deadline']) {
					$time1 =  $custom['deadline_1'] - $custom['deadline'];
					$time = $custom['deadline'] - $t;
				}else{
					$time1 = $custom['deadline_1'] - $t;
					$time = $custom['deadline'] - $custom['deadline_1'];
				}
				if ($level == 1) {
					$deadline1 = $t + $month*30*24*3600 + $time1;
					$deadline = $deadline1 + $time;
				}elseif ($level == 2) {
					$deadline = $t + $month*30*24*3600 + $time;
					$deadline1 = $deadline + $time1;
				}
			}
			$userdata = array(
					'is_member' => 1,
					'level' => $upgradeRecord['type_id'],
					'deadline_1' => $deadline1,
					'deadline' => $deadline,
					'updated' => $t
				);
        	$userwhere = array('id' => $upgradeRecord['target_id']);
        	$result = $userModel->where($userwhere)->save($userdata);
    	}
    	var_dump($result);
	}

	public function index() {
		$userModel = M('user');
		$where = array(
				'level' => array('neq','')
 			);
		$count = $userModel->where($where)->count();
		$step = 50;
		$group = ceil($count/$step);
		for ($i = 0 ; $i < $group ; $i ++) {
			$start = $i * $step;
			if ($start + $step > $count) {
				$end = $count - $start;
			}else{
				$end = $step;
			}
			$order = array('id' =>'asc');
			$data = $userModel->where($where)->order($order)->limit($start,$end)->select();
			for ($j = 0; $j < $end; $j ++) {
				if ($data[$j]['level'] == 1) {
					$saveData = array(
							'deadline_1' => $data[$j]['deadline'],
							'deadline' => 0,
							'updated' => time()
						);
					$saveWhere = array(
							'id' => $data[$j]['id']
						);
					$res = $userModel->where($saveWhere)->save($saveData);
					if (!$res) {
						echo 'group'.$i.'--number'.$j.'---id'.$data[$j]['id'].'-----failed <br />';
					}else{
						echo 'group'.$i.'--number'.$j.'---id'.$data[$j]['id'].'--success <br />';
					}
				}
			}
		}
		echo 'complete';
	}
}