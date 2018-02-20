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
	public function goldUpgrade() {
		$userId = session('userId');
		$level = I('post.level');
		$month = I('post.month');
		$income = I('post.income');
		$customId = I('post.customId');

		$userModel = M('user');
		//检查金币数量
		$gold = $userModel->where('id='.$userId)->getField('gold');
		$custom = $userModel->where('id='.$customId)->find();
		if ($gold < $income) {
			$msg = array('status' => 'gold not enough');
			return $this->ajaxReturn($msg);
		}
		//升级
		$t = time();
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
		$userData = array(
			'is_member' => 1,
			'level' => $level,
			'deadline_1' => $deadline1,
			'deadline' => $deadline,
			'updated' => $t
		);
		$res = $userModel->where('id='.$customId)->save($userData);
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
				'gainer' => $customId,
				'goods_type' => 'upgrade',
				'record_id' => $res,
				'amount' => $income,
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
				'gainer' => $customId,
				'type' => 'upgrade',
				'amount' => $income,
				'rate' => $webInfo['consume_commission'],
				'commision' => $income * $webInfo['consume_commission'] / 100,
				'order_sn' => $order_sn,
				'created' => time()
			);
		$commisionModel->add($commisiondata);
		
		$msg = array('status'=>'success');
		$this->ajaxReturn($msg);

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
				'gainer' => $customId,
				'goods_type' => $goodsType,
				'amount' => $income,
				'pay_type' => $payType,
				'currency' => '美元',
				'pay_status' => '1',
				'created' => time()
			);
		if ($type == 'r') {
			$type = 'recharge';
			$data['goods_type'] = 'recharge';
		}elseif ($type == 'u'){
			$type = 'upgrade';
			$data['goods_type'] = 'upgrade';
			$level = I('post.level');
			$month = I('post.month');
			$upgradeModel = M('upgrade_record');
			$updata = array(
					'source_id' => $userId,
					'target_id' => $customId,
					'type_id' => $level,
					'time' => $month,
					'status' => 'unpaid',
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
		if ($payType == 'paypal') {
			
			$this->paypal($income,$order_sn,$type);
		}else{

		}
	}
	public function paypal($paymentAmount,$item_number,$item_name) {
		$base_url = 'http://'.$_SERVER['HTTP_HOST'];
		$returnURL = urlencode($base_url.'/index.php?m=Index&c=Pay&a=resReturn');
		$cancelURL = urlencode($base_url.'/index.php?m=Index&c=Home&a=index');
		$Paypal = new PaypalController(false);
		$resArray = $Paypal->CallShortcutExpressCheckout ($paymentAmount, 'USD', 'Sale', $returnURL, $cancelURL,$item_number,$item_name);
		$_SESSION["Payment_Amount"] = $paymentAmount;
		$ack = strtoupper($resArray["ACK"]);
		if($ack=="SUCCESS" || $ack=="SUCCESSWITHWARNING")
		{
			$Paypal->RedirectToPayPal($resArray["TOKEN"]);
		} 
		else  
		{
			//Display a user friendly Error on the page using any of the following error information returned by PayPal
			$ErrorCode = urldecode($resArray["L_ERRORCODE0"]);
			$ErrorShortMsg = urldecode($resArray["L_SHORTMESSAGE0"]);
			$ErrorLongMsg = urldecode($resArray["L_LONGMESSAGE0"]);
			$ErrorSeverityCode = urldecode($resArray["L_SEVERITYCODE0"]);
			
			echo "SetExpressCheckout API call failed. ";
			echo "Detailed Error Message: " . $ErrorLongMsg;
			echo "Short Error Message: " . $ErrorShortMsg;
			echo "Error Code: " . $ErrorCode;
			echo "Error Severity Code: " . $ErrorSeverityCode;
		}
	}
	public function resReturn()
    {	
    	$_SESSION['payer_id'] =  $_GET['PayerID'];
    	$userId = session('userId');
    	$Paypal = new PaypalController(false);
    	$finalPaymentAmount =  $_SESSION["Payment_Amount"];
    	$resArray = $Paypal->ConfirmPayment( $finalPaymentAmount );
    	$ack = strtoupper($resArray["ACK"]);
		if( $ack == "SUCCESS" || $ack == "SUCCESSWITHWARNING" ){

	        $paymentStatus	= $resArray["PAYMENTINFO_0_PAYMENTSTATUS"];
	        $item_number = $_SESSION['order_sn'];
	        $order['goods_type'] = $_SESSION['goods_type'];
	        $amount = $resArray["PAYMENTINFO_0_AMT"];
	        $orderModel = M('order_record');
	        $where = array(
	        		'order_sn' => $item_number
	        	);
	        $order = $orderModel->where($where)->find();
	        if (!$order) {
	        	$msg = 'Failed';
	        	return $this->error($msg,"index.php?m=Index&c=Home&a=index");
	        }
	        $userModel = M('user');
	        $gold = $userModel->where('id='.$userId)->getField('gold');
	        
	        $webConfModel = M('web_conf');
			$webInfo = $webConfModel->where('id=1')->find();
			$commisionModel = M('commission');
	        if ($paymentStatus == 'Completed' || $paymentStatus == 'Completed_Funds_Held') {
		        if ($amount == $order['amount']) {
	            	if ($order['goods_type'] == 'recharge') {
	            		$newGold = floatval($gold) + floatval($amount);
	            		$goldRecord = M('gold_record');
						$data = array(
								'user_id' => $userId,
								'gold' => $amount,
								'sum' => $newGold,
								'mark' => '+',
								'type' => 'recharge',
								'created' => time()
							);
						$goldID = $goldRecord->add($data);

						$orderdata = array(
								'payer_id' => $_SESSION['payer_id'],
								'correlation_id' => $_SESSION['CORRELATIONID'],
				    			'pay_status' => 4,
				    			'record_id' => $goldID,
				    			'updated' => time()
				    		);
				    	$res = $orderModel->where($where)->save($orderdata);
				    	if ($res) {
							$paypaldata = array(
									'user_id' => $order['user_id'],
									'gainer' => $order['gainer'],
									'type' => 'recharge',
									'amount' => $order['amount'],
									'rate' => $webInfo['paypal_commission'],
									'commision' => $order['amount'] * $webInfo['paypal_commission'] / 100,
									'order_sn' => $order['order_sn'],
									'created' => time()
								);
							$result = $commisionModel->add($paypaldata);
				    		$userdata = array(
				    				'gold' => $newGold,
				    				'updated' => time() 
				    			);
				    		$result = $userModel->where('id='.$userId)->save($userdata);
				    	}
	            	}elseif ($order['goods_type'] == 'upgrade') {
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
							$level = $upgradeRecord['type_id'];
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
	            	}
	            }
	            $this->success('OK',"index.php?m=Index&c=Home&a=index");
	        }else{
	        	$data = array(
	        		'payer_id' => $_SESSION['payer_id'],
	            	'correlation_id' => $_SESSION['CORRELATIONID'],
        			'pay_status' => 3,
        			'updated' => time()
        		);
        		$res = $orderModel->where("order_sn='$item_number'")->save($data);  
           		$msg = 'Failed';
            	$this->error($msg,"index.php?m=Index&c=Home&a=index");
	        }
	    }else{
	    	//Display a user friendly Error on the page using any of the following error information returned by PayPal
			$ErrorCode = urldecode($resArray["L_ERRORCODE0"]);
			$ErrorShortMsg = urldecode($resArray["L_SHORTMESSAGE0"]);
			$ErrorLongMsg = urldecode($resArray["L_LONGMESSAGE0"]);
			$ErrorSeverityCode = urldecode($resArray["L_SEVERITYCODE0"]);
			
			echo "GetExpressCheckoutDetails API call failed. ";
			echo "Detailed Error Message: " . $ErrorLongMsg;
			echo "Short Error Message: " . $ErrorShortMsg;
			echo "Error Code: " . $ErrorCode;
			echo "Error Severity Code: " . $ErrorSeverityCode;
	    }
	}
    public function resNotify()
    {
    	echo '222222222222';
        /*$data = $_POST;
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
        }*/
    }
}
?>