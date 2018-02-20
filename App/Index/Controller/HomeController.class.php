<?php
namespace Index\Controller;
use Index\Controller;
class HomeController extends BaseController {
    public function index() {

    

        $l = I('get.l');
        if (!$l) {
            $l = cookie('think_language');
        }
        if (!$l) {
            $l = 'zh-cn';
        }
        $l = strtolower($l);
        if ($l == 'en-us') {
            $lang = 'EN';
        }elseif ($l == 'zh-cn') {
            $lang = '中';
        }elseif ($l == 'zh-tw') {
            $lang = '繁';
        }elseif ($l == 'ko-kr') {
            $lang = 'KO';
        }elseif ($l == 'es') {
            $lang = 'ES';
        }elseif ($l == 'ja') {
            $lang = '日';
        }elseif ($l == 'de') {
            $lang = 'DE';
        }elseif ($l == 'fra') {
            $lang = 'FR';
        }elseif ($l == 'it') {
            $lang = 'IT';
        }elseif ($l == 'nl') {
            $lang = 'NL';
        }elseif ($l == 'pt') {
            $lang = 'PT';
        }elseif ($l == 'ru') {
            $lang = 'RU';
        }else{
            $lang = '中';
        }
        $webConfModel = M('web_conf');
        $webinfo = $webConfModel->find();
        $this->assign('webinfo',$webinfo);        
        $this->assign('lang',$lang);
        $this->display();
    }
    public function user() {
        $userId = session('userId');
        if (!$userId) {
            $msg = array('status'=>'error');
            $this->ajaxReturn($msg);
        }
        $userModel = M('user');
        $l = cookie('think_language');
        $lang = str_replace('-', '', $l);
        $ext = strtolower($lang);
        $countryfield = 'country_'.$ext;
        $user = $userModel->field("id,username,name,terminal,header,sex,sexuality,email,mobile,year,month,day,height,weight,".$countryfield." as country,city,worker,relationship,income,education,level,gold,mood,language,is_online,is_member,deadline,deadline_1,inner_member,is_visible,is_focus,always_online,is_service,chat_state,chat_line,authentication,created,updated")->where('user.id='.$userId)->find();
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
                'visitor' => $visitorsCount,
                'encounter' => $encounterCount,
                'passive' => $passiveCount,
                'match' => $passiveCount
            );

        $lan = str_replace('-', '',$l);
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
        $lang = include COMMON_PATH.'Lang/'.strtolower($l).'-js.php';

        $data = array(
                'user' => $user,
                'wall' => $wall,
                'spaceUser' => $spaceUser,
                'i18n' => $lang,
                'service' => $service,
                'sticker' => $sticker,
                'interact' => $interact
            );
        $msg = array('status'=>'success','data'=>$data);
        $this->ajaxReturn($msg);
    }
}
?>