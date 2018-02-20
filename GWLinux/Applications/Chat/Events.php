<?php
/**
 * This file is part of workerman.
 *
 * Licensed under The MIT License
 * For full copyright and license information, please see the MIT-LICENSE.txt
 * Redistributions of files must retain the above copyright notice.
 *
 * @author walkor<walkor@workerman.net>
 * @copyright walkor<walkor@workerman.net>
 * @link http://www.workerman.net/
 * @license http://www.opensource.org/licenses/mit-license.php MIT License
 */

/**
 * 用于检测业务代码死循环或者长时间阻塞等问题
 * 如果发现业务卡死，可以将下面declare打开（去掉//注释），并执行php start.php reload
 * 然后观察一段时间workerman.log看是否有process_timeout异常
 */
declare(ticks=1);

use \GatewayWorker\Lib\Gateway;
use \GatewayWorker\Lib\Db;
use \Applications\Chat\translate;
/**
 * 主逻辑
 * 主要是处理 onConnect onMessage onClose 三个方法
 * onConnect 和 onClose 如果不需要可以不用实现并删除
 */
class Events
{    
    public static $uid;
    /**
    *为每一个businessWorker进程做一些全局初始化工作
    */
    public static function onWorkerStart($businessWorker)
    {
        echo "WorkerStart\n";
    }
    /**
    *businessWorker结束时触发
    **/
    public static function onWorkerStop($businessWorker)
    {
       echo "WorkerStop\n";
    }
    /**
     * 当客户端连接时触发
     * 如果业务不需此回调可以删除onConnect
     * 
     * @param int $client_id 连接id
     */
    public static function onConnect($client_id)
    {  
        /*var_dump($uid);
        // 向当前uid发送数据
        $msg = array(
            'status' => 'success',
            'opt' => 0,
            'data' => '123',
        );
        $str = json_encode($data);
        Gateway::sendToAll($str);*/
    }
    
   /**
    * 当客户端发来消息时触发
    * @param int $client_id 连接id
    * @param mixed $message 具体消息
    */
   public static function onMessage($client_id, $message)
   {
        $db = Db::instance('db1');
        $req_data = json_decode($message,true);
        $t = time()-45*60;
        if (isset($_SESSION['uid'])) {
            $uid = $_SESSION['uid'];
        }else{
            $uid = $req_data['uid'];
            $_SESSION['uid'] =  $uid;
        }
        if (!Gateway::isUidOnline($uid)) {
            Gateway::bindUid($client_id, $uid);
        }
        if ($req_data['opt'] == 100) {//初始化链接，获取联系人列表
            if (isset($req_data['hasInit']) && $req_data['hasInit'] == 'no') {
                Gateway::bindUid($client_id, $uid);
                //通知客户端已上线
                $user = $db->select('id,username,is_visible,is_member,level,deadline,deadline_1')->from('user')->where("id = $uid")->row();
                if ($user['is_visible']){
                    $onlineRes = $db->update('user')->cols(array('is_online'=>1,'updated'=>$t))->where("id = $uid")->query();
                    $user['is_online'] = 1;
                    $msg = array(
                            'status' => 'success',
                            'opt' => 4,
                            'data' => $user
                        );
                    $str = json_encode($msg);
                    Gateway::sendToAll($str);
                }
                //会员到到期
                if ($user['level'] == 1) {
                    if ($user['deadline_1'] < $t) {
                        if (!empty($user['deadline']) && $user['deadline'] > 0) {
                            $upgradeData = array(
                                    'is_member' => 1,
                                    'level' => 2,
                                    'deadline_1' => 0,
                                    'deadline' => $user['deadline'],
                                    'updated' => $t 
                                );
                        }else{
                            $upgradeData = array(
                                    'is_member' => 0,
                                    'level' => 0,
                                    'deadline_1' => 0,
                                    'deadline' => 0,
                                    'updated' => $t 
                                );
                        }
                        $res = $db->update('user')->cols($upgradeData)->where("id = $uid")->query();
                    }
                }elseif ($user['level'] == 2) {
                    if ($user['deadline'] < $t) {
                        if (!empty($user['deadline_1']) && $user['deadline_1'] > 0) {
                            $upgradeData = array(
                                        'is_member' => 1,
                                        'level' => 1,
                                        'deadline_1' => $user['deadline_1'],
                                        'deadline' => 0,
                                        'updated' => $t 
                                    );
                        }else{
                            $upgradeData = array(
                                        'is_member' => 0,
                                        'level' => 0,
                                        'deadline_1' => 0,
                                        'deadline' => 0,
                                        'updated' => $t 
                                    );
                        }
                        $res = $db->update('user')->cols($upgradeData)->where("id = $uid")->query();
                    }
                }
                //查询联系人
                $reciverlist = $db->select('chat_record.*,user.id as user_id,user.username as  username,user.header as header,user.sex as sex,user.is_online as is_online,user.level as level,user.mood as mood,user.inner_member as inner_member,user.country_enus as country')->from('chat_record')->innerJoin('user','chat_record.reciver_id = user.id')->where("chat_record.sender_id=$uid")->orderBy(array('chat_record.created'))->query();
                $senderlist = $db->select('chat_record.*,user.id as user_id,user.username as username,user.header as header,user.sex as sex,user.is_online as is_online,user.level as level,user.mood as mood,user.inner_member as inner_member,user.country_enus as country')->from('chat_record')->innerJoin('user','chat_record.sender_id = user.id')->where("chat_record.reciver_id=$uid")->orderBy(array('chat_record.created'))->query();
                $contact = array_merge($reciverlist,$senderlist);
                $chatlist = array();
                $contactlist  = array();
                if (count($contact) > 100) {
                    $count = 100;
                }else{
                    $count = count($contact);
                }
                for ($i = 0 ; $i < $count ; $i ++) {
                    for ($j = $i + 1 ; $j < $count ; $j ++) {
                        if ($contact[$i]['created'] < $contact[$j]['created']) {
                            $temp = $contact[$i];
                            $contact[$i] = $contact[$j];
                            $contact[$j] = $temp;
                        }
                    }   
                }  
                $z = 0;
                for ($i = 0 ; $i < count($contact) ; $i ++) {
                    if (!in_array($contact[$i]['user_id'], $chatlist)) {
                        $chatlist[$z] = $contact[$i]['user_id'];
                        $contactlist[$z] = $contact[$i];
                        $z ++;
                    }
                }
                for ($i = 0 ; $i < count($contactlist) ; $i ++) {
                    /*$sender = $contact[$i]['user_id'];
                    $where = "sender_id = $sender AND reciver_id = $uid AND is_read = 0";
                    $list = $db->select('*')->from('chat_record')->where($where)->orderByASC(array('created'),false)->query();
                    if (!$list) {
                        $contact[$i]['list'] = array();
                        $contact[$i]['count'] = 0;
                    }else{
                        $contact[$i]['list'] = $list;
                        $contact[$i]['count'] = count($list);
                    }*/
                    $contactlist[$i]['list'] = array();
                    $contactlist[$i]['count'] = 0;

                    if (isset($contactlist[$i]['mood'])) {
                        $mood = $db->select('*')->from('broadcast')->where('id='.$contactlist[$i]['mood'])->query();
                        if (!$mood) {
                            $contactlist[$i]['mood'] = '';
                        }else{
                            $contactlist[$i]['mood'] = $mood[0]['content'];
                        }
                    }
                }
                $data = $req_data['uid'];

                $where = "reciver_id = $uid and is_read = 0";
                $allList = $db->select('*')->from('chat_record')->where($where)->orderByASC(array('created'))->query();  
                $msg = array(
                      'status' => 'success',
                      'opt' => 0,
                      'contact' => $contactlist,
                      'msg' => $allList
                );
            }else{
                $giftCount = $db->query("select count(*) from user_gift where is_read = 0 AND reciver_id = $uid");
                $visitorsCount = $db->query("select count(*) from visitors where is_read = 0 AND target_id = $uid");
                $passiveCount = $db->query("select count(*) from user_like where is_read = 0 AND target_id = $uid");
                $matchCount = $db->query("select count(*) from user_like where is_read = 0 AND is_match = 1");
                $interact = array(
                    'gift' => $giftCount[0]['count(*)'],
                    'visitor' => $visitorsCount[0]['count(*)'],
                    'passive' => $passiveCount[0]['count(*)'],
                    'match' => $passiveCount[0]['count(*)']
                );
                $user = $db->select('id,gold,level,chat_state,chat_line')->from('user')->where("id = $uid")->row();
                if ($user['chat_line'] > $t) {
                    $user['chat_state'] = 1;
                    $userdata = array(
                            'chat_stat' => 1,
                            'chat_line' => '',
                            'updated' => $t,
                        );
                    $db->update('user')->cols($userdata)->where("id = $uid")->query();
                }
                $msg = array(
                      'status' => 'success',
                      'opt' => 100,
                      'interact' => $interact,
                      'user' => $user  
                  );
            }
            $str = json_encode($msg);
            Gateway::sendToUid($uid,$str);
        }elseif ($req_data['opt'] == 0) {
            $address = $req_data['address'];
            $where = "reciver_id = $uid AND sender_id = $address";
            $res = $db->update('chat_record')->cols(array('is_read'=>1))->where($where)->query();
        }elseif ($req_data['opt'] == 1) {
            //echo 'opt=1';
            $newGold = '';
            $data['sender_id'] = $uid;
            $data['reciver_id'] = $req_data['address'];
            $address = $req_data['address'];
            //echo 'address='.$address;
            if (isset($req_data['txt'])) {
                $data['content'] = $req_data['txt'];
                $data['content'] = preg_replace('/(qq|QQ|Q|q|facebook|line|163|126|139|skype|gmail|@|msn|MSN|陌陌|AIM|GTalk|ICQ|FlickIM|Gadu-Gadu|MessengerFX|MySpace|Xfire|wechat|微信).*/',' ', $data['content']);
                $data['content'] = preg_replace('/(www\.|WWW\.|\.com|\.COM)/',' ', $data['content']);
                $userlist = $db->select('*')->from('user')->where("id=$uid")->query();
                $user = $userlist[0];
                if ($user['inner_member'] != 1 && $user['is_member'] != 1) {
                    $date = date('Y-m-d');
                    $timeStart = strtotime($date);
                    $timeEnd = $timeStart + 24*3600 - 1;
                    $count = $db->query("select count(*) from chat_record where sender_id = $uid and created >= '$timeStart' and created <= '$timeEnd'");
                    if ($count[0]['count(*)'] >= 3) {
                        $msg = array(
                            'status' => 'success',
                            'opt' => 8
                        );
                        $str = json_encode($msg);
                        Gateway::sendToUid($uid,$str);
                        exit;
                    }
                }
                if (isset($req_data['transType'])) {
                    if ($req_data['tl'] == 'zh-cn') {
                        $to = 'zh';
                    }elseif ($req_data['tl'] == 'zh-tw') {
                        $to = 'cht';
                    }elseif ($req_data['tl'] == 'en-us') {
                        $to = 'en';
                    }elseif ($req_data['tl'] == 'ko-kr') {
                        $to = 'kor';
                    }elseif ($req_data['tl'] == 'ja') {
                        $to = 'jp';
                    }elseif ($req_data['tl'] == 'es') {
                        $to = 'spa';
                    }else{
                        $to = $req_data['tl'];
                    }
                    if ($user['inner_member'] != 1) {
                        if ($user['is_member'] == 0) {
                            $str = preg_replace('/[\x80-\xff]{3}/', ' ', $data['content'],-1,$n);
                            $length = $n +  str_word_count($str);
                            $money = $length*0.01;
                            if (floatval($user['gold']) < floatval($money)) {
                                $msg = array(
                                    'status' => 'success',
                                    'opt' => 7
                                );
                                $str = json_encode($msg);
                                Gateway::sendToUid($uid,$str);
                                return false;
                            }
                            $newGold = floatval($user['gold']) - floatval($money);
                            $res = $db->update('user')->cols(array('gold'=>$newGold))->where('id='.$uid)->query();

                            $transData = array(
                                'user_id' => $uid,
                                'source_id' => $uid,
                                'content' => $data['content'],
                                'to' => $to,
                                'leng' => $length,
                                'money' => $money,
                                'created' => $t
                            );
                            $transId = $db->insert('translate_record')->cols($transData)->query();

                            $goldData = array(
                                'user_id' => $uid,
                                'gold' => $money,
                                'sum' => $newGold,
                                'mark' => '-',
                                'type' => 'translate',
                                'record_id' => $transId,
                                'created' => $t
                            );
                            $db->insert('gold_record')->cols($goldData)->query();

                            $order_sn  = 'or_'.$t.uniqid();
                            $orderData = array(
                                    'order_sn' => $order_sn,
                                    'user_id' => $uid,
                                    'gainer' => $uid,
                                    'goods_type' => 'translate',
                                    'record_id' => $transId,
                                    'amount' => $money,
                                    'pay_type' => 'gold',
                                    'currency' => '金币',
                                    'pay_status' => 4,
                                    'created' => $t
                                );
                            $db->insert('order_record')->cols($orderData)->query();

                            $webInfo = $db->select('paypal_commission,consume_commission')->from('web_conf')->where("id=1")->row();
                            $commisiondata = array(
                                'user_id' => $uid,
                                'gainer' => $uid,
                                'type' => 'translate',
                                'amount' => $money,
                                'rate' => $webInfo['consume_commission'],
                                'commision' => $money * $webInfo['consume_commission'] / 100,
                                'order_sn' => $order_sn,
                                'created' => $t
                            );
                            $db->insert('commission')->cols($commisiondata)->query();
                        }elseif ($user['level'] == 1) {
                            $str = preg_replace('/[\x80-\xff]{3}/', ' ', $data['content'],-1,$n);
                            $length = $n +  str_word_count($str);
                            $money = $length*0.01;
                            if (floatval($user['gold']) < floatval($money)) {
                                $msg = array(
                                    'status' => 'success',
                                    'opt' => 7
                                );
                                $str = json_encode($msg);
                                Gateway::sendToUid($uid,$str);
                                return false;
                            }
                            $newGold = floatval($user['gold']) - floatval($money);
                            $res = $db->update('user')->cols(array('gold'=>$newGold))->where('id='.$uid)->query();

                            $transData = array(
                                'user_id' => $uid,
                                'source_id' => $uid,
                                'content' => $data['content'],
                                'to' => $to,
                                'leng' => $length,
                                'money' => $money,
                                'created' => $t
                            );
                            $transId = $db->insert('translate_record')->cols($transData)->query();

                            $goldData = array(
                                'user_id' => $uid,
                                'gold' => $money,
                                'sum' => $newGold,
                                'mark' => '-',
                                'type' => 'translate',
                                'record_id' => $transId,
                                'created' => $t
                            );
                            $db->insert('gold_record')->cols($goldData)->query();

                            $order_sn  = 'or_'.$t.uniqid();
                            $orderData = array(
                                    'order_sn' => $order_sn,
                                    'user_id' => $uid,
                                    'gainer' => $uid,
                                    'goods_type' => 'translate',
                                    'record_id' => $transId,
                                    'amount' => $money,
                                    'pay_type' => 'gold',
                                    'currency' => '金币',
                                    'pay_status' => 4,
                                    'created' => $t
                                );
                            $db->insert('order_record')->cols($orderData)->query();

                            $webInfo = $db->select('paypal_commission,consume_commission')->from('web_conf')->where("id=1")->row();
                            $commisiondata = array(
                                'user_id' => $uid,
                                'gainer' => $uid,
                                'type' => 'translate',
                                'amount' => $money,
                                'rate' => $webInfo['consume_commission'],
                                'commision' => $money * $webInfo['consume_commission'] / 100,
                                'order_sn' => $order_sn,
                                'created' => $t
                            );
                            $db->insert('commission')->cols($commisiondata)->query();
                        }
                    }
                    $trans = new translate;
                    $res = $trans->translate($data['content'],'auto', $to);
                    $data['tras'] = $res['trans_result'][0]['dst'];

                }
            }
            if (isset($req_data['url'])) {
                $data['img'] = $req_data['url'];
            }
            if (isset($req_data['type']) && $req_data['type'] == 'sticker') {
                $data['type'] = $req_data['type'];
            }
            $data['created'] = $t;
            $res = $db->insert('chat_record')->cols($data)->query();
            $data['gold'] =  $newGold;
            $data['id'] = $res;
            $data['is_read'] = 1;
            if ($res) {
                $msg = array(
                    'status' => 'success',
                    'opt' => 1,
                    'msg' => $data
                );
                $str = json_encode($msg);
                //echo 'online';
                //echo 'uid='.$uid;
                Gateway::sendToUid($uid,$str); 
                //echo 'end<br>';
                if (Gateway::isUidOnline($data['reciver_id'])) {
                    $data['is_read'] = 0;
                    $msg = array(
                        'status' => 'success',
                        'opt' => 1,
                        'msg' => $data
                    );
                    $str = json_encode($msg);
                    Gateway::sendToUid($data['reciver_id'],$str);
                }
            }

        }elseif ($req_data['opt'] == 2) {
            if ($req_data['tl'] == 'zh-cn') {
                $to = 'zh';
            }elseif ($req_data['tl'] == 'zh-tw') {
                $to = 'cht';
            }elseif ($req_data['tl'] == 'en-us') {
                $to = 'en';
            }elseif ($req_data['tl'] == 'ko-kr') {
                $to = 'kor';
            }elseif ($req_data['tl'] == 'ja') {
                $to = 'jp';
            }elseif ($req_data['tl'] == 'es') {
                $to = 'spa';
            }else{
                $to = $req_data['tl'];
            }
            $userlist = $db->select('*')->from('user')->where("id=$uid")->query();
            $user = $userlist[0];
            if ($user['inner_member'] != 1) {
                if ($user['is_member'] == 0) {
                    $str = preg_replace('/[\x80-\xff]{3}/', ' ', $req_data['content'],-1,$n);
                    $length = $n +  str_word_count($str);
                    $money = $length*0.01;
                    if (floatval($user['gold']) < floatval($money)) {
                        $msg = array(
                            'status' => 'success',
                            'opt' => 7
                        );
                        $str = json_encode($msg);
                        Gateway::sendToUid($uid,$str);
                        return false;
                    }
                    $newGold = floatval($user['gold']) - floatval($money);
                    $db->update('user')->cols(array('gold'=>$newGold))->where('id='.$uid)->query();

                    $transData = array(
                        'user_id' => $uid,
                        'source_id' => $req_data['sender_id'],
                        'content' => $req_data['content'],
                        'to' => $to,
                        'leng' => $length,
                        'money' => $money,
                        'created' => $t
                    );
                    $transId = $db->insert('translate_record')->cols($transData)->query();

                    $goldData = array(
                        'user_id' => $uid,
                        'gold' => $money,
                        'sum' => $newGold,
                        'mark' => '-',
                        'type' => 'translate',
                        'record_id' => $transId,
                        'created' => $t
                    );
                    $db->insert('gold_record')->cols($goldData)->query();

                    $order_sn  = 'or_'.$t.uniqid();
                    $orderData = array(
                            'order_sn' => $order_sn,
                            'user_id' => $uid,
                            'gainer' => $req_data['sender_id'],
                            'goods_type' => 'translate',
                            'record_id' => $transId,
                            'amount' => $money,
                            'pay_type' => 'gold',
                            'currency' => '金币',
                            'pay_status' => 4,
                            'created' => $t
                        );
                    $db->insert('order_record')->cols($orderData)->query();

                    $webInfo = $db->select('paypal_commission,consume_commission')->from('web_conf')->where("id=1")->row();
                    $commisiondata = array(
                        'user_id' => $uid,
                        'gainer' => $req_data['sender_id'],
                        'type' => 'translate',
                        'amount' => $money,
                        'rate' => $webInfo['consume_commission'],
                        'commision' => $money * $webInfo['consume_commission'] / 100,
                        'order_sn' => $order_sn,
                        'created' => $t
                    );
                    $db->insert('commission')->cols($commisiondata)->query();
                }elseif ($user['level'] == 1) {
                    $str = preg_replace('/[\x80-\xff]{3}/', ' ', $req_data['content'],-1,$n);
                    $length = $n +  str_word_count($str);
                    $money = $length*0.01;
                    if (floatval($user['gold']) < floatval($money)) {
                        $msg = array(
                            'status' => 'success',
                            'opt' => 7
                        );
                        $str = json_encode($msg);
                        Gateway::sendToUid($uid,$str);
                        return false;
                    }
                    $newGold = floatval($user['gold']) - floatval($money);
                    $db->update('user')->cols(array('gold'=>$newGold))->where('id='.$uid)->query();

                    $transData = array(
                        'user_id' => $uid,
                        'source_id' => $req_data['sender_id'],
                        'content' => $req_data['content'],
                        'to' => $to,
                        'leng' => $length,
                        'money' => $money,
                        'created' => $t
                    );
                    $transId = $db->insert('translate_record')->cols($transData)->query();

                    $goldData = array(
                        'user_id' => $uid,
                        'gold' => $money,
                        'sum' => $newGold,
                        'mark' => '-',
                        'type' => 'translate',
                        'record_id' => $transId,
                        'created' => $t
                    );
                    $db->insert('gold_record')->cols($goldData)->query();

                    $order_sn  = 'or_'.$t.uniqid();
                    $orderData = array(
                            'order_sn' => $order_sn,
                            'user_id' => $uid,
                            'gainer' => $req_data['sender_id'],
                            'goods_type' => 'translate',
                            'record_id' => $transId,
                            'amount' => $money,
                            'pay_type' => 'gold',
                            'currency' => '金币',
                            'pay_status' => 4,
                            'created' => $t
                        );
                    $db->insert('order_record')->cols($orderData)->query();

                    $webInfo = $db->select('paypal_commission,consume_commission')->from('web_conf')->where("id=1")->row();
                    $commisiondata = array(
                        'user_id' => $uid,
                        'gainer' => $req_data['sender_id'],
                        'type' => 'translate',
                        'amount' => $money,
                        'rate' => $webInfo['consume_commission'],
                        'commision' => $money * $webInfo['consume_commission'] / 100,
                        'order_sn' => $order_sn,
                        'created' => $t
                    );
                    $db->insert('commission')->cols($commisiondata)->query();
                }
            }
            $trans = new translate;
            $res = $trans->translate($req_data['content'],'auto', $to);
            $req_data['transResult'] = $res['trans_result'][0]['dst'];
            $msg = array(
                  'status' => 'success',
                  'opt' => 2,
                  'data' => $req_data
              );
            $str = json_encode($msg);
            Gateway::sendToUid($uid,$str);
        }elseif ($req_data['opt'] == 3) {//获取历史消息
            $address = $req_data['address'];
            if (isset($req_data['created'])) {
                $created = $req_data['created'];
            }else{
                $created = $t;
            }
            $where = "((a.sender_id = $uid AND a.reciver_id = $address) or (a.sender_id=$address AND a.reciver_id=$uid)) AND a.created < $created";
            $list = $db->select('a.*,b.id as b_id,b.username as b_username,c.id as c_id,c.username as c_username')->from('chat_record as a')->innerJoin('user as b','b.id = a.sender_id')->innerJoin('user as c','c.id = a.reciver_id')->where($where)->orderByASC(array('a.created'),false)->limit(9)->query();
            $msg = array(
                  'status' => 'success',
                  'opt' => 3,
                  'data' => $list
              );
            $str = json_encode($msg);
            Gateway::sendToUid($uid,$str);
        }elseif ($req_data['opt'] == 4) {
            $address = $req_data['address'];
            $data = $db->select("id,username,header,is_online,level,mood,sex,inner_member")->from('user')->where("id = $address")->row();
            $data['created'] = $t;
            $data['user_id'] = $data['id'];
            unset($data['id']);
            $msg = array(
                      'status' => 'success',
                      'opt' => 5,
                      'data' => $data
                  );
            $str = json_encode($msg);
            Gateway::sendToUid($uid,$str);
        }elseif ($req_data['opt'] == 5) {
            $address = $req_data['address'];
            $where = "(reciver_id = $uid AND sender_id = $address) OR (reciver_id = $address AND sender_id = $uid)";
            $res = $db->delete('chat_record')->where($where)->query();
            if ($res) {
                $msg = array(
                      'status' => 'success',
                      'opt' => 6,
                      'data' => $address
                  );
            }else{
                $msg = array();
            }
            $str = json_encode($msg);
            Gateway::sendToUid($uid,$str); 
        }elseif ($req_data['opt'] == 6) {
            $address = $req_data['address'];
            $user = $db->select('id,username,always_online')->from('user')->where("id = $address")->row();
            if ($user['always_online'] == 1) {
                $user['is_online'] = 1;
            }else{
                $onlineRes = $db->update('user')->cols(array('is_online'=>0,'updated'=>$t))->where("id = $address")->query();
                $user['is_online'] = 0;
            }
            $msg = array(
                    'status' => 'success',
                    'opt' => 4,
                    'data' => $user
                );
            $str = json_encode($msg);
            Gateway::sendToAll($str);
        }elseif ($req_data['opt'] == 7) {
            $address = $req_data['address'];
            $user = $db->select('id,username')->from('user')->where("id = $address")->row();
            $status = $req_data['status'];
            if ($status) {
                $is_visible = 1;
            }else{
                $is_visible = 0;
            }
            $data = array(
                'is_online' => $status,
                'is_visible' => $is_visible,
                'updated' => $t
            );
            $res = $db->update('user')->cols($data)->where("id = $address")->query();
            if ($res) {
                $user['is_online'] = $status; 
                $msg = array(
                    'status' => 'success',
                    'opt' => 4,
                    'data' => $user
                );
                $str = json_encode($msg);
                Gateway::sendToAll($str);
            }
        }
   }
   
   /**
    * 当用户断开连接时触发
    * @param int $client_id 连接id
    */
   public static function onClose($client_id)
   {
        /*$user = $db->select('id,username')->from('user')->where("id = $uid")->row();
        $onlineRes = $db->update('user')->cols(array('is_online'=>0,'updated'=>$t))->where("id = $uid")->query();
        $user['is_online'] = 0;
        $msg = array(
                'status' => 'success',
                'opt' => 4,
                'data' => $user
            );
        $str = json_encode($msg);
        Gateway::sendToAll($str);*/
   }
}
