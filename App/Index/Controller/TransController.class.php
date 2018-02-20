<?php
namespace Index\Controller;
use Think\Controller;
class TransController extends Controller {
	public function translate() {
		$content = I('post.content');
        $to = I('post.to');
        $sourceId = I('post.source_id');
        $userId = session('userId');
        if (!$sourceId) {
            $sourceId = $userId;
        }
        if ($to == 'zh-cn') {
            $to = 'zh';
        }elseif ($to == 'zh-tw') {
            $to = 'cht';
        }elseif ($to == 'en-us') {
            $to = 'en';
        }elseif ($to == 'ko-kr') {
            $to = 'kor';
        }elseif ($to == 'ja') {
            $to = 'jp';
        }elseif ($to == 'es') {
            $to = 'spa';
        }
        $userModel = M('user');
        $user = $userModel->where('id='.$userId)->find();
        if (!$user['inner_member']) {
            if ($user['is_member'] == 0 ) {
                $str = preg_replace('/[\x80-\xff]{3}/', ' ', $content,-1,$n);
                $length = $n +  str_word_count($str);
                $money = $length*0.01;
                
                if (floatval($user['gold']) < floatval($money)) {
                    $msg = array('status'=>'error');
                    return  $this->ajaxReturn($msg);
                }

                $newGold = floatval($user['gold']) - floatval($money);
                $data = array(
                        'gold' => $newGold,
                        'updated' => time()
                    );
                $res = $userModel->where('id='.$userId)->save($data);

                $translateModel = M('translate_record');
                $data = array(
                        'user_id' => $userId,
                        'source_id' => $sourceId,
                        'content' => $content,
                        'to' => $to,
                        'leng' => $length,
                        'money' => $money,
                        'created' => time()
                    );
                $res = $translateModel->add($data);

                $goldRecord = M('gold_record');
                $data = array(
                        'user_id' => $userId,
                        'gold' => $money,
                        'sum' => $newGold,
                        'mark' => '-',
                        'type' => 'translate',
                        'record_id' => $res,
                        'created' => time()
                    );
                $goldRecord->add($data);

                $orderModel = M('order_record');
                $order_sn  = 'or_'.time().uniqid();
                $data = array(
                        'order_sn' => $order_sn,
                        'user_id' => $userId,
                        'gainer' => $sourceId,
                        'goods_type' => 'translate',
                        'record_id' => $res,
                        'amount' => $money,
                        'pay_type' => 'gold',
                        'currency' => '金币',
                        'pay_status' => 4,
                        'created' => time()
                    );
                $orderModel->add($data);

                $webConfModel = M('web_conf');
                $webInfo = $webConfModel->where('id=1')->find();
                $commisionModel = M('commission');
                $commisiondata = array(
                        'user_id' => $userId,
                        'gainer' => $sourceId,
                        'type' => 'translate',
                        'amount' => $money,
                        'rate' => $webInfo['consume_commission'],
                        'commision' => $money * $webInfo['consume_commission'] / 100,
                        'order_sn' => $order_sn,
                        'created' => time()
                    );
                $commisionModel->add($commisiondata);
            }elseif ($user['level'] == 1) {
                $str = preg_replace('/[\x80-\xff]{3}/', ' ', $content,-1,$n);
                $length = $n +  str_word_count($str);
                $money = $length*0.01;
                if (floatval($user['gold']) < floatval($money)) {
                    $msg = array('status'=>'error');
                    return  $this->ajaxReturn($msg);
                }
                $newGold = floatval($user['gold']) - floatval($money);
                $data = array(
                        'gold' => $newGold,
                        'updated' => time()
                    );
                $res = $userModel->where('id='.$userId)->save($data);
                $translateModel = M('order_record');
                $data = array(
                        'user_id' => $userId,
                        'source_id' => $sourceId,
                        'content' => $content,
                        'to' => $to,
                        'leng' => $length,
                        'money' => $money,
                        'created' => time($data)
                    );
                $res = $translateModel->add($data);

                $goldRecord = M('gold_record');
                $data = array(
                        'user_id' => $userId,
                        'gold' => $money,
                        'sum' => $newGold,
                        'mark' => '-',
                        'type' => 'translate',
                        'record_id' => $res,
                        'created' => time()
                    );
                $goldRecord->add($data);

                $orderModel = M('order_record');
                $order_sn  = 'or_'.time().uniqid();
                $data = array(
                        'order_sn' => $order_sn,
                        'user_id' => $userId,
                        'gainer' => $sourceId,
                        'goods_type' => 'translate',
                        'record_id' => $res,
                        'amount' => $money,
                        'pay_type' => 'gold',
                        'currency' => '金币',
                        'pay_status' => 4,
                        'created' => time()
                    );
                $orderModel->add($data);

                $webConfModel = M('web_conf');
                $webInfo = $webConfModel->where('id=1')->find();
                $commisionModel = M('commission');
                $commisiondata = array(
                        'user_id' => $userId,
                        'gainer' => $sourceId,
                        'type' => 'translate',
                        'amount' => $money,
                        'rate' => $webInfo['consume_commission'],
                        'commision' => $money * $webInfo['consume_commission'] / 100,
                        'order_sn' => $order_sn,
                        'created' => time()
                    );
                $commisionModel->add($commisiondata);
            }
        }
        $trans = new translateController;
        $res = $trans->translate($content,'auto',$to);
        $msg = array('status'=>'success','data'=>$res['trans_result'][0]['dst']);
        $this->ajaxReturn($msg); 
	}
    public function trans($content,$to) {
        $trans = new translateController;
        $res = $trans->translate($content,'auto',$to);
        return $res['trans_result'][0]['dst'];
    }
}
?>