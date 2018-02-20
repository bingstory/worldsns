<?php
namespace Wap\Controller;
use Wap\Controller;
class HomeController extends BaseController{
    public function index() {
        $giftCateModel = M('gift_cate');
        if (isset($_COOKIE['think_language'])) {
            $l = cookie('think_language');
        }else{
            $l = 'zh-cn';
        }
        $lang = str_replace('-', '', $l);
        $ext = strtolower($lang);
        $field  = 'name_'.$ext;
        $where = array('type' => 'virtual');
        $giftCate = $giftCateModel->field('id,'.$field.' as name')->where($where)->select();
        $webConfModel = M('web_conf');
        $conf = $webConfModel->where('id=1')->find();
        $base_url = 'http://'.$_SERVER['HTTP_HOST'];
        $this->assign('base_url',$base_url);
        $this->assign('conf',$conf);
        $this->assign('giftCate',$giftCate);  
        $this->display();
    }
    public function user() {
        $userId = session('userId');
        $lang  = I('post.lang');
        if (!$userId) {
            $msg = array('status'=>'error');
            $this->ajaxReturn($msg);
        }
        $userModel = M('user');
        $user = $userModel->where('user.id='.$userId)->find();
        if (isset($user['mood'])) {
            $broadcastModel = M('broadcast');
            $user['mood_content'] = $broadcastModel->where('id='.$user['mood'])->getField('content');
            if (!$user['mood_content']) {
                $user['mood_content'] = '';
            }
        }else{
            $user['mood_content'] = '';
        }

        $service = $userModel->field('id,username')->where('is_service = 1')->select();

        $albumModel = M('album');
        $where = "user_id = $userId or user_id = 0";
        $album = $albumModel->field('id,name')->where($where)->select();
        $albumMap = array();
        $photoModel = M('photo');
        foreach($album as $item) {
            $albumMap[$item['id']]['id'] = $item['id'];
            $albumMap[$item['id']]['name'] = $item['name'];
            $where = array(
                    'album' => $item['id'],
                    'user_id' => $userId
                );
            $list = $photoModel->field('id,url,album')->where($where)->select();
            $albumMap[$item['id']]['list'] = $list;
        }
        $spaceUser = $user;
        $spaceUser['albumMap'] = $albumMap;
        $userSpotModel = M('spot_record');
        $webConfModel = M('web_conf');
        $webinfo = $webConfModel->find(); 
        $wall = $userSpotModel->field('spot_record.*,user.id as id,user.username as username,user.header as header,user.sex as sex')
                ->join('user on user.id = spot_record.user_id')
                ->limit(0,$webinfo['wall_number'])
                ->order('spot_record.created desc')
                ->select();
        if (isset($_COOKIE['think_language'])) {
            $l = cookie('think_language');
        }else{
            $l = 'zh-cn';
        }

        $userGiftModel = M('user_gift');
        $giftWhere = array('is_read'=>0,'reciver_id'=>$userId);
        $giftCount = $userGiftModel->where($giftWhere)->count();
        $visitorsModel = M('visitors');
        $visitorsWhere = array('is_read'=>0,'target_id'=>$userId);
        $visitorsCount = $visitorsModel->where($visitorsWhere)->count();
        $userLikeModel = M('user_like');
        $passiveWhere = array('is_read'=>0,'target_id'=>$userId);
        $passiveCount = $userLikeModel->where($passiveWhere)->count();
        $matchWhere = array();
        $matchCount = $userLikeModel->where($matchWhere)->count();
        $encounterCount = $passiveCount + $matchCount;
        $interact = array(
                'gift' => $giftCount,
                'visitor' => $giftCount,
                'encounter' => $encounterCount,
                'passive' => $passiveCount,
                'match' => $passiveCount
            );

        $webConfModel = M('web_conf');
        $webconf = $webConfModel->field('price_spot,price_google,price_human')->where('id=1')->find();


        if ($lang == 'zh') {
            $lang = 'zh-cn';
        }elseif ($lang == 'tw'){
            $lang = 'zh-tw';
        }elseif ($lang == 'en'){
            $lang = 'en-us';
        }elseif ($lang == 'ko') {
            $lang = 'ko-kr';
        }elseif ($lang == 'fr') {
            $lang = 'fra';
        }
        $lan = str_replace('-', '',$lang);
        $namefield = strtolower('name_'.$lan);
        $userStickerModel = M('user_sticker');
        $sticker = $userStickerModel->field('user_sticker.*,sticker.'.$namefield.' as stickername,sticker.img as stickerimg')
                    ->join('sticker on sticker.id = user_sticker.sticker_id')
                    ->where('user_sticker.user_id='.$userId)
                    ->select();
        $stickerDetailModel = M('sticker_detail');
        for ($i = 0 ; $i < count($sticker) ; $i ++) {
            $detail = $stickerDetailModel->field('id,sticker_id,detail_img')->where('sticker_id='.$sticker[$i]['sticker_id'])->select();
            $sticker[$i]['detail'] = $detail;
        }

        $data = array(
                'user' => $user,
                'wall' => $wall,
                'price_spot' => $webconf['price_spot'],
                'price_google' => $webconf['price_google'],
                'price_human' => $webconf['price_human'],
                //'spaceUser' => $spaceUser,
                'service' => $service,
                'sticker' => $sticker
            );
        $msg = array('status'=>'success','data'=>$data);
        $this->ajaxReturn($msg);
    }
    public function recommend() {
        $index = I('post.index');
        $size = I('post.size');
        $lang = I('post.lang');
        $userId = session('userId');
        $userModel = M('user');
        $mySex = $userModel->where('id='.$userId)->getField('sex');
        if ($mySex == 'male') {
            $sex = 'female';
        }else{
            $sex = 'male';
        }
        $where = array(
                    'sex'=>$sex
                );
        if ($lang == 'zh') {
            $l = 'zh-cn';
        }elseif ($lang == 'tw') {
            $l = 'zh-tw';
        }elseif ($lang == 'en') {
            $l = 'en-us';
        }elseif ($lang == 'ko') {
            $l = 'ko-kr';
        }elseif ($lang == 'fr') {
            $l = 'fra';
        }else {
            $l = $lang;
        }
        $lang = str_replace('-', '', $l);
        $ext = strtolower($lang);
        $countryfield = 'country_'.$ext;
        $list = $userModel->field("id,username,header,sex,year,month,day,".$countryfield." as country,city,level,mood,is_member,deadline,is_online,inner_member")->where($where)->order('is_online desc,header desc')->limit($index*$size,$size)->select();
        $broadcastModel = M('broadcast');
        for ($i = 0 ; $i < count($list) ; $i ++) {
            if (isset($list[$i]['mood'])) {
                $list[$i]['mood'] = $broadcastModel->where('id='.$list[$i]['mood'])->getField('content');
                if (!$list[$i]['mood']) {
                    $list[$i]['mood'] = '';
                }
            }else{
                $list[$i]['mood'] = '';
            }
        }
        $msg = array('status'=>'success','data'=>$list);
        $this->ajaxReturn($msg);
    }
    public function getWall() {
        $userSpotModel = M('spot_record');
        $webConfModel = M('web_conf');
        $webinfo = $webConfModel->find(); 
        $wall = $userSpotModel->field('spot_record.*,user.id as id,user.username as username,user.header as header,user.sex as sex')
                ->join('user on user.id = spot_record.user_id')
                ->limit(0,$webinfo['wall_number'])
                ->order('spot_record.created desc')
                ->select();
        if (!$wall) {
            $msg = array('status' => 'error');
            $this->ajaxReturn($msg);
        }else{
            $msg = array('status' => 'success','data' => $wall);
            $this->ajaxReturn($msg);
        }
    }
    public function addSpot() {
        $userId = session('userId');
        $amount = I('price_spot');

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
?>