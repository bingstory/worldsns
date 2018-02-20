<?php
namespace Index\Controller;
use Index\Controller;
class PayController extends BaseController {
	public function index() {
		$webConfModel = M('web_conf');
		$conf = $webConfModel->where('id=1')->find();
		$base_url = 'http://'.$_SERVER['HTTP_HOST'];
		$this->assign('base_url',$base_url);
		$this->assign('conf',$conf);
		$this->display();
	}
	public function order() {
		$type = I('post.type');
		$way = I('post.way');
		$income = I('post.income');
		$customId = I('post.customId');
		$userId = session('userId');
		if ($way == 0) {
			$payType = 'paypal';
			$currency = '美元';
		} elseif ($way  == 1) {
			$payType = 'ali';
			$currency = '人民币';
		} elseif ($way  == 2) {
			$payType = 'gold';
			$currency = '金币';
		}
		$orderModel = M('order_record');
		$order_sn  = 'or_'.time().uniqid();
		$data = array(
				'order_sn' => $order_sn,
				'user_id' => $userId,
				'goods_type' => $goodsType,
				'amount' => $income,
				'pay_type' => $payType,
				'currency' => '美元',
				'pay_status' => '1',
				'created' => time()
			);
		if ($type == 'r') {
			$data['goods_type'] = 'recharge';
		}elseif ($type == 'u'){
			$data['goods_type'] = 'upgrade';
			$level = I('post.level');
			$month = I('post.month');
			$upgradeModel = M('upgrade_record');
			$updata = array(
					'source_id' => $userId,
					'target_id' => $customId,
					'type_id' => $level,
					'time' => $month,
					'status' => 'success',
					'amount' => $income,
					'created' => time()
				);
			$record_id = $upgradeModel->add($updata);
			if (!$record_id) {
				$msg = array('status' => 'error');
				return $this->ajaxReturn($msg);
			}
			$data['record_id'] = $record_id;

		}
		$res = $orderModel->add($data);
		if (!$res) {
			$msg = array('status'=>'error');
			return $this->ajaxReturn($msg);
		}
		$msg = array('status'=>'success','data'=>$data);
		$this->ajaxReturn($msg);
	}
	public function goldUpgrade() {
		$userId = session('userId');
		$level = I('post.level');
		$month = I('post.month');
		$income = I('post.income');
		$customId = I('post.customId');

		$userModel = M('user');
		//检查金币数量
		$gold = $userModel->where('id='.$userId)->getField('gold');
		if ($gold < $income) {
			$msg = array('status' => 'gold not enough');
			return $this->ajaxReturn($msg);
		}
		//升级
		$data = array(
				'is_member' => 1,
				'level' => $level,
				'deadline' => time()+$month*30*24*3600,
				'updated' => time()
			); 
		$res = $userModel->where('id='.$customId)->save($data);
		if (!$res) {
			$msg = array('status' => 'error');
			return $this->ajaxReturn($msg);
		}
		//扣除金币
		$newGold = $gold - $income;
		$data = array(
				'gold' => $newGold
			);
		$userModel->where('id='.$userId)->save($data);
		//写入升级记录表
		$upgradeModel = M('upgrade_record');
		$data = array(
				'source_id' => $userId,
				'target_id' => $customId,
				'type_id' => $level,
				'time' => $month,
				'status' => 'success',
				'amount' => $income,
				'created' => time()
			);
		$res = $upgradeModel->add($data);
		if (!$res) {
			$msg = array('status' => 'error');
			return $this->ajaxReturn($msg);
		}

		//写入金币记录表
		$goldRecord = M('gold_record');
		$data = array(
				'user_id' => $userId,
				'gold' => $income,
				'sum' => $newGold,
				'mark' => '-',
				'type' => 'upgrade',
				'record_id' => $res,
				'created' => time()
			);
		$goldRecord->add($data);

		//写入订单
		$orderModel = M('order_record');
		$order_sn  = 'or_'.time().uniqid();
		$data = array(
				'order_sn' => $order_sn,
				'user_id' => $userId,
				'goods_type' => 'upgrade',
				'record_id' => $res,
				'amount' => $income,
				'pay_type' => 'gold',
				'currency' => '金币',
				'pay_status' => '4',
				'created' => time()
			);
		$orderModel->add($data);
		$msg = array('status'=>'success');
		$this->ajaxReturn($msg);

	}
	public function resReturn()
    {	
        $data = $_POST;
        //echo '<pre>';
        //var_dump($data);
        if (isset($_SESSION['txn_id']) && $_SESSION['txn_id'] == $data['txn_id']) {
            $msg = L("Illegal operation");
            $this->error($msg,"index.php?m=Index&c=Home&a=index");
            exit;
        }
        $data['cmd'] = "_notify-validate";
        //$url = "https://www.sandbox.paypal.com/cgi-bin/webscr";
        $url = "https://www.paypal.com/cgi-bin/webscr";

        $ch = curl_init();
        
        curl_setopt($ch, CURLOPT_URL, $url);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
        curl_setopt($ch, CURLOPT_POST, 1);
        curl_setopt($ch, CURLOPT_POSTFIELDS, $data);
        curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, 0);
        curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, 0);

        $res = curl_exec($ch);
        curl_close($ch);

        $item_name = $data['item_name'];
        $item_number = $data['item_number'];
        $amount = $data['payment_gross'];
        $orderModel = M('order_record');
        $order = $orderModel->where("order_sn='$item_number'")->find();
        if (!$order) {
        	$msg = 'Failed';
        	return $this->error($msg,"index.php?m=Index&c=Home&a=index");
        }
        //上线后请注释以下一行代码
        //$res = "VERIFIED";

        if (strcmp ($res, "VERIFIED") == 0) {

            $userId = session('userId');

            if ($amount == $order['amount']) {
            	if ($order['goods_type'] == 'recharge') {
            		$orderdata = array(
	            			'pay_status' => 4,
	            			'updated' => time()
	            		);
	            	$res = $orderModel->where("order_sn='$item_number'")->save($orderdata);
	            	if ($res) {
	            		$userModel = M('user');
	            		$gold = $userModel->where('id='.$userId)->getField('gold');
	            		$newGold = floatval($gold) + floatval($amount);
	            		$userdata = array(
	            				'gold' => $newGold,
	            				'updated' => time() 
	            			);
	            		$result=  $userModel->where('id='.$userId)->save($userdata);
	            		var_dump($res);
	            		$goldRecord = M('gold_record');
						$data = array(
								'user_id' => $userId,
								'gold' => $income,
								'sum' => $newGold,
								'mark' => '+',
								'type' => 'upgrade',
								'created' => time()
							);
						$goldRecord->add($data);
	            	}
            	}
            	if ($order['goods_type'] == 'upgrade') {
            		$upgradeModel = M('upgrade_record');
            		$record_id = $order['record_id'];
            		$upgradeRecord = $upgradeModel->where("id=$record_id")->find();
            		if ($upgradeRecord) {
            			$updata = array(
            					'status' => 'success', 
            					'updated' => time() 
            				); 
            			$res1 =  $upgradeModel->where("id=$record_id")->save($updata);
            		}
	            	$orderdata = array(
	            			'pay_status' => 4,
	            			'updated' => time()
	            		);
	            	$res2 = $orderModel->where("order_sn='$item_number'")->save($orderdata);
	            	if ($res1 && $res2) {
	            		$userModel = M('user');
		            	$userdata = array(
		            			'is_member' => 1,
								'level' => $upgradeRecord['type_id'],
								'deadline' => time()+$upgradeRecord['time']*30*24*3600,
								'updated' => time()
		            		);
		            	$userwhere = array('id' => $upgradeRecord['target_id']);
		            	$result = $userModel->where($userwhere)->save($userdata);

	            	}
	            }
            }
           	if ($result) {
           		$msg = 'OK';
            	$this->success($msg,"index.php?m=Index&c=Home&a=index");
           	}else{
           		$msg = 'Failed';
            	$this->error($msg,"index.php?m=Index&c=Home&a=index");
           	}
        }else{
        	$data = array(
        			'pay_status' => 3,
        			'updated' => time()
        		);
        	$res = $orderModel->where("order_sn='$item_number'")->save($data);  
            $msg = 'Failed';
            $this->error($msg,"index.php?m=Index&c=Home&a=index");
        }  
    }

    public function resNotify()
    {
        $data = $_POST;
        $data['cmd'] = "_notify-validate";
        //$url = "https://www.sandbox.paypal.com/cgi-bin/webscr";
        $url = "https://www.paypal.com/cgi-bin/webscr";

        $ch = curl_init();
        
        curl_setopt($ch, CURLOPT_URL, $url);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
        curl_setopt($ch, CURLOPT_POST, 1);
        curl_setopt($ch, CURLOPT_POSTFIELDS, $data);
        curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, 0);
        curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, 0);

        $res = curl_exec($ch);
        curl_close($ch);
        
        //上线后请注释以下一行代码
        $res = "VERIFIED";

        if (strcmp ($res, "VERIFIED") == 0) {  
        }
    }
}
?>