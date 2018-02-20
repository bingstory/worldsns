<?php
namespace Index\Controller;
use Index\Controller;
class ChatController extends BaseController {
    public function showChat() {
        $this->display();
    }
    public function index(){
        $userId = session('userId');
        $chatModel = M('chat_record');
        $senderwhere = array('reciver_id'=>$userId);
        $senderlist = $chatModel->field('sender_id')->where($senderwhere)->select();
        $reciverwhere = array('sender_id'=>$userId);
        $reciverlist = $chatModel->field('reciver_id')->where($reciverwhere)->select();
        static $chater = array();
        foreach($senderlist as $item) {
            if (!in_array($item['sender_id'],$chater)) {
                $chater[] .= $item['sender_id'];
            }
        }
        foreach($reciverlist as $item) {
            if (!in_array($item['reciver_id'],$chater)) {
                $chater[] .= $item['reciver_id'];
            }
        }
        $userModel = M('user');
        $myInfo = $userModel->field('sex,last_out')->where('id='.$userId)->find();
        $mysex = $myInfo['sex'];
        if ($mysex == 'male') {
            $sex = 'female';
        }else{
            $sex = 'male';
        }
        if (empty($myInfo['last_out'])) {
            $myInfo['last_out'] = 0;
        }
        if (!empty($chater)) {
             $userwhere =array(
                    'sex' =>  $sex,
                    'id' => array('in',$chater)
                );
            $userlist = $userModel->where($userwhere)->order('is_online desc,last_time desc,last_out desc')->select();
        }else{
            $userlist = array();
        }
        $maxcount = 0;
        $totalMessages = 0;
        if (isset($_COOKIE['def'])){
            $default = cookie('def');
            $listwhere = '((a.sender_id='.$userId.' AND a.reciver_id='.$default.') or (a.sender_id='.$default.' AND a.reciver_id='.$userId.')) AND a.created >='.$myInfo['last_out'];
        }else{
            for($i = 0 ; $i < count($userlist) ; $i ++) {
                $default = $userlist[0]['id'];
                $listwhere = array(
                        'is_read' => 0,
                        'reciver_id' => $userId,
                        'sender_id' => $userlist[$i]['id']
                    );
                $count = $chatModel->where($listwhere)->count();
                if ($count > 0) {
                    if ($count > $maxcount) {
                        $maxcount = $count;
                        $default = $userlist[$i]['id'];
                    }
                    $totalMessages = $totalMessages + $count;
                    $userlist[$i]['count'] = $count;
                }else{
                    $userlist[$i]['count'] = 0;
                }
            }
            $listwhere = array(
                    'a.is_read' => 0,
                    'a.reciver_id' => $userId,
                    'a.sender_id' => $default
                );
        }
        cookie('def',$default);
        $defarr = array();
        $userarr = array();
        for($i = 0 ; $i < count($userlist) ; $i ++) {
            if ($default == $userlist[$i]['id']) {
                $defarr[] = $userlist[$i];
            }else{
                $userarr[] = $userlist[$i];
            }
        }
        $userlist = array_merge($defarr,$userarr);
        //获取默认用户消息列表
        $infolist = $chatModel->alias('a')->
            field('a.*,b.id as b_id,b.username as b_username,b.header as b_header,b.sex as b_sex,c.id as c_id,c.username as c_username,c.header as c_header,c.sex as c_sex')
            ->join('user b ON b.id = a.sender_id')
            ->join('user c ON c.id = a.reciver_id')
            ->order('a.created desc')
            ->where($listwhere)->select();
        $where = array(
                'is_read' => 0,
                'reciver_id' => $userId,
                'sender_id' => $default
            );
        $data = array(
                'is_read' => 1,
            );
        $res = $chatModel->where($where)->save($data);
        $arr = array();
        foreach($infolist as $item) {
            $arr[] = $item['id'];
        }
        for($i=0;$i<count($arr);$i++) {
            for($j=$i;$j<count($arr);$j++) {
                if ($arr[$i] > $arr[$j]) {
                    $temp = $arr[$i];
                    $arr[$i] = $arr[$j];
                    $arr[$j] = $temp;
                }
            }
        }
        $info = array();
        foreach ($arr as $row) {
            foreach ($infolist as $item) {
                if ($row == $item['id']) {
                    $info[] = $item;
                }
            }
        }
        $year = date('Y',time());
        if (!empty($default)) {
            $defaultuser =  $userModel->field('id,username,header,year,country,city')->where('id='.$default)->find(); 
        }else{
            $default = 0;
            $defaultuser = array(); 
        }
        $bool = $this->notAjaxMember('ordinary');
        if (!$bool) {
            $bool = 'no';
        }else{
            $bool = 'yes';
        }
        $date = date('Y-m-d');
        $time = strtotime($date);
        $dat1 = date('Y-m-d H:i:s',$time);
        $where = array(
                    'created' => array('gt',$time),
                );
        $recent_count = $chatModel->where($where)->count();

        $this->assign('myId',$userId);
        $this->assign('infolist',$info);
        $this->assign('default',$default);
        $this->assign('userlist',$userlist);
        $this->assign('year',$year);
        $this->assign('defaultuser',$defaultuser);
        $this->assign('totalMessages',$totalMessages);
        $this->assign('bool',$bool);
        $this->assign('recent_count',$recent_count);
        $this->display();
    }
    public function send() {
        $reciver = I('get.reciver');
        $content = I('get.content');
        $img = I('get.img');
        $lang = I('get.lang');
        $userId = session('userId');
        $chat = M('chat_record');
        if (!$reciver) {
            $msg = array('status'=>'error','msg'=>L('illegal submission'));
            return $this->ajaxReturn($msg);
        }
        if (!$content && !$img) {
            $msg = array('status'=>'error','msg'=>L('illegal submission'));
            return $this->ajaxReturn($msg);
        }
        $bool = $this->notAjaxMember('ordinary');
        if (!$bool) {
            $date = date('Y-m-d');
            $time = strtotime($date);
            $dat1 = date('Y-m-d H:i:s',$time);
            $where = array(
                    'sender_id' => $userId,
                    'created' => array('gt',$time)
                );
            $count = $chat->where($where)->count();
            if ($count >= 3) {
                $msg = array('status'=>'error','msg'=>"need member");
                return $this->ajaxReturn($msg);
            }
        }
        //即时聊天工具检测
        $content = preg_replace('/qq|QQ|msn|MSN|陌陌|AIM|GTalk|ICQ|FlickIM|Gadu-Gadu|MessengerFX|MySpace|Xfire|wechat|微信/','', $content);
        $content = $content;
        $t = time()+300;
        $data = array('sender_id'=>$userId,'reciver_id'=>$reciver,'content'=>$content,'created'=>$t);
        if ($img) {
            $data['img'] = $img;
        }
        $bool = $this->notAjaxMember('senior');
        if ($lang && $bool) {
            $trans = new translateController;
            $tras = $trans->translate($content,'auto',$lang);
            $data['tras'] = $tras['trans_result'][0]['dst'];
        }
        $res = $chat->add($data);
        if (!$res) {
            $msg = array('status'=>'error','msg'=>L("send failed"));
            return $this->ajaxReturn($msg);
        }
        $msg = array('status'=>'success','data'=>$res);
        return $this->ajaxReturn($msg);
    }
    public function refresh() {
        $default = I('get.default');
        if (!$default) {
            exit;
        }
        $page = I('get.page');
        if (!$page){
            exit;
        }
        $sendId = I('get.sendid');
        $bottom = 1;
        $refresh = 1;
        $userId = session('userId');
        $chatModel = M('chat_record');
        $senderwhere = array('reciver_id'=>$userId);
        $senderlist = $chatModel->field('sender_id')->where($senderwhere)->select();
        $reciverwhere = array('sender_id'=>$userId);
        $reciverlist = $chatModel->field('reciver_id')->where($reciverwhere)->select();
        static $sender = array();
        static $reciver =array();
        static $chater = array();
        foreach($senderlist as $item) {
            if (!in_array($item['sender_id'],$sender)) {
                $sender[] .= $item['sender_id'];
            }
            if (!in_array($item['sender_id'],$chater)) {
                $chater[] .= $item['sender_id'];
            }
        }
        foreach($reciverlist as $item) {
            if (!in_array($item['reciver_id'],$reciver)) {
                $reciver[] .= $item['reciver_id'];
            }
            if (!in_array($item['reciver_id'],$chater)) {
                $chater[] .= $item['reciver_id'];
            }
        } 
        $userModel = M('user');
        $myInfo = $userModel->field('sex,last_out')->where('id='.$userId)->find();
        $mysex = $myInfo['sex'];
        if ($mysex == 'male') {
            $sex = 'female';
        }else{
            $sex = 'male';
        }
        $userwhere =array(
                    'sex' =>  $sex,
                    'id' => array('in',$chater)
                );
        $userlist = $userModel->field('id,username,header,is_online')->where($userwhere)->order('is_online desc,last_time desc,last_out desc')->select();
        $defaultuser =  $userModel->field('id,username,header,year,country,city')->where('id='.$default)->find();
        $year = date('Y',time());
        $totalMessages = 0;
        $defarr = array();
        $userarr = array();
        for($i = 0 ; $i < count($userlist) ; $i ++) {
            $listwhere = array(
                    'is_read' => 0,
                    'reciver_id' => $userId,
                    'sender_id' => $userlist[$i]['id']
                );
            $count = $chatModel->where($listwhere)->count();
            if ($count > 0) {
                $totalMessages += $count;
                $userlist[$i]['count'] = $count;
            }else{
                $userlist[$i]['count'] = 0;
            }
            if ($default == $userlist[$i]['id']) {
                $defarr[] = $userlist[$i];
            }else{
                $userarr[] = $userlist[$i];
            }
        }
        $userlist = array_merge($defarr,$userarr);
        $listwhere = '(a.sender_id='.$userId.' AND a.reciver_id='.$default.') or (a.sender_id='.$default.' AND a.reciver_id='.$userId.')';
        $where = array(
                    'a.is_read' => 0,
                    'a.reciver_id' => $userId,
                    'a.sender_id' => $default
                );
        $countwhere = array(
                    'is_read' => 0,
                    'reciver_id' => $userId,
                    'sender_id' => $default
                );
        //查看更多消息
        if ($page > 0) {
            $infolist = $chatModel->alias('a')->
            field('a.*,b.id as b_id,b.username as b_username,b.header as b_header,c.id as c_id,c.username as c_username,c.header as c_header')
            ->join('user b ON b.id = a.sender_id')
            ->join('user c ON c.id = a.reciver_id')
            ->where($listwhere)->order('a.created desc')->limit(($page-1)*10,10)->select();
            $page += 1;
            $bottom = 0;
        }
        //自动刷新
        if ($page == -3) {
            $count = $chatModel->where($countwhere)->count();
            if ($count > 0) {
                $infolist = $chatModel->alias('a')->
                    field('a.*,b.id as b_id,b.username as b_username,b.header as b_header,c.id as c_id,c.username as c_username,c.header as c_header')
                    ->join('user b ON b.id = a.sender_id')
                    ->join('user c ON c.id = a.reciver_id')
                    ->where($countwhere)->order('a.created desc')->select();
                $page = 1;
                $totalMessages = $totalMessages-$count;
            }else{
                $bottom = 0;
                $refresh = 0;
            }
        }
        //切换用户
        if ($page == -2) {
            if (!empty($myInfo['last_out'])) {
                $changewhere = '((a.sender_id='.$userId.' AND a.reciver_id='.$default.') or (a.sender_id='.$default.' AND a.reciver_id='.$userId.')) AND a.created >='.$myInfo['last_out'];
            }else{
                $changewhere = '(a.sender_id='.$userId.' AND a.reciver_id='.$default.') or (a.sender_id='.$default.' AND a.reciver_id='.$userId.')';
            }
            $infolist = $chatModel->alias('a')->
                    field('a.*,b.id as b_id,b.username as b_username,b.header as b_header,c.id as c_id,c.username as c_username,c.header as c_header')
                    ->join('user b ON b.id = a.sender_id')
                    ->join('user c ON c.id = a.reciver_id')
                    ->where($changewhere)->order('a.created desc')->select();
            $page = 1;
        }
        //发送消息
        if ($page == -1) {
            $recive = $chatModel->field('id')->where($countwhere)->order('created asc')->find();
            if (!$recive) {
                $listwhere = '((a.sender_id='.$userId.' AND a.reciver_id='.$default.') or (a.sender_id='.$default.' AND a.reciver_id='.$userId.')) AND a.id >= '.$sendId;
            }else{
                if ($recive['id'] > $sendId) {
                    $listwhere = '((a.sender_id='.$userId.' AND a.reciver_id='.$default.') or (a.sender_id='.$default.' AND a.reciver_id='.$userId.')) AND a.id >= '.$sendId;
                }else{
                    $listwhere = '((a.sender_id='.$userId.' AND a.reciver_id='.$default.') or (a.sender_id='.$default.' AND a.reciver_id='.$userId.')) AND a.id >= '.$recive['id'];
                }
            }
            $infolist = $chatModel->alias('a')->
                    field('a.*,b.id as b_id,b.username as b_username,b.header as b_header,c.id as c_id,c.username as c_username,c.header as c_header')
                    ->join('user b ON b.id = a.sender_id')
                    ->join('user c ON c.id = a.reciver_id')
                    ->where($listwhere)->order('a.created desc')->select();
        }
        $data = array(
                'is_read' => 1,
            );
        $res = $chatModel->where($countwhere)->save($data);
        $arr = array();
        foreach($infolist as $item) {
            $arr[] = $item['id'];
        }
        for($i=0;$i<count($arr);$i++) {
            for($j=$i;$j<count($arr);$j++) {
                if ($arr[$i] > $arr[$j]) {
                    $temp = $arr[$i];
                    $arr[$i] = $arr[$j];
                    $arr[$j] = $temp;
                }
            }
        }
        $info = array();
        foreach ($arr as $row) {
            foreach ($infolist as $item) {
                if ($row == $item['id']) {
                    $info[] = $item;
                }
            }
        }
        cookie('def',$default);
        $data = array('infolist'=>$info,'def'=>$default,'userinfo'=>$userlist,'myId'=>$userId,'defaultuser'=>$defaultuser,'year'=>$year,'refresh'=>$refresh,'bottom'=>$bottom,'page'=>$page,'totalMessages'=>$totalMessages);
        $msg = array('status'=>'success','data'=>$data);
        $this->ajaxReturn($msg);    
    }
    public function translate() {
        $userId = session('userId');
        $content = I('get.content');
        $money = strlen($content)*0.1;
        $res = $this->notAjaxMember('senior');
        if (!$res) {
            $userModel = M('user');
            $gold = $userModel->where('id='.$userId)->find('gold');
            if ($gold < $money || $money == 0) {
                $msg = array('status'=>'error','msg'=>L('Recharge or upgrade'));
                $this->ajaxReturn($msg);
                return false;
            }else{
                $data = array(
                        'gold' => $gold-$money
                    );
                $res = $userModel->where('id='.$userId)->save($data);
                if (!$res) {
                    $msg = array('status'=>'error','msg'=>L('translate failed'));
                    $this->ajaxReturn($msg);
                    return false;
                }
            }

        }
        $to = I('get.to');
        $trans = new translateController;
        $res = $trans->translate($content,'auto',$to);
        $msg = array('status'=>'success','data'=>$res['trans_result'][0]['dst']);
        $this->ajaxReturn($msg);
    }
    public function sendImg() {
        $img = I('data.sendimage','','',$_FILES);
        if (!$img ) {
            $msg = array('status'=>'error','msg'=>'illegal submission'); 
            return $this->ajaxReturn($msg);
        }
        $upload = new \Think\Upload();
        $upload->maxSize   =     5242880 ;  //5M
        $upload->exts      =     array('jpg', 'gif', 'png', 'jpeg');
        $upload->rootPath  =     './public/Upload/chat/';
        $upload->savePath  =     '';
        $upload->saveName  =      array('uniqid','');
        $upload->autoSub   =    false;
        $info = $upload->upload();
        if(!$info) {// 上传错误提示错误信息
            return $this->error($upload->getError());
        }
        $image = $upload->rootPath.$info['sendimage']["savename"];
        $msg = array('status'=>'success','data'=>$image);
        return $this->ajaxReturn($msg);
    }
    public function refreshcount() {
        $userId = session('userId');
        $chatModel = M('chat_record');
        $where  = array(
                'is_read' => 0,
                'reciver_id' => $userId
            );
        $totalMessages = $chatModel->where($where)->count();
        if (!$totalMessages) {
            $totalMessages = 0;
        }
        $msg = array('status'=>'success','data'=>$totalMessages);
        return $this->ajaxReturn($msg);
    }
}