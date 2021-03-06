<?php
namespace Index\Controller;
use Think\Controller;
class BaseController extends controller {
	protected $userinfo;
	public function __construct(){
		parent::__construct();
		$this->changelang();
		$this->islogin();
		$this->userinfo();
		$this->getInfoNum();


 
// 如果有HTTP_X_WAP_PROFILE则一定是移动设备
    if (isset ($_SERVER['HTTP_X_WAP_PROFILE'])){
        $this->redirect("/index.php?m=Wap&c=Index&a=index");
    }
    
    
    //此条摘自TPM智能切换模板引擎，适合TPM开发
    if(isset ($_SERVER['HTTP_CLIENT']) &&'PhoneClient'==$_SERVER['HTTP_CLIENT']){
         $this->redirect("/index.php?m=Wap&c=Index&a=index");
    }
   

    //如果via信息含有wap则一定是移动设备,部分服务商会屏蔽该信息
    if (isset ($_SERVER['HTTP_VIA'])){
        if(stristr($_SERVER['HTTP_VIA'], 'wap')){
            $this->redirect("/index.php?m=Wap&c=Index&a=index");
        }
    }
        //找不到为flase,否则为true
        
    //判断手机发送的客户端标志,兼容性有待提高
    if (isset ($_SERVER['HTTP_USER_AGENT'])) {
        $clientkeywords = array(
            'nokia','sony','ericsson','mot','samsung','htc','sgh','lg','sharp','sie-','philips','panasonic','alcatel','lenovo','iphone','ipod','blackberry','meizu','android','netfront','symbian','ucweb','windowsce','palm','operamini','operamobi','openwave','nexusone','cldc','midp','wap','mobile'
        );
        //从HTTP_USER_AGENT中查找手机浏览器的关键字
        if (preg_match("/(" . implode('|', $clientkeywords) . ")/i", strtolower($_SERVER['HTTP_USER_AGENT']))) {
           $this->redirect("/index.php?m=Wap&c=Index&a=index");
        }
    }
    //协议法，因为有可能不准确，放到最后判断
    if (isset ($_SERVER['HTTP_ACCEPT'])) {
        // 如果只支持wml并且不支持html那一定是移动设备
        // 如果支持wml和html但是wml在html之前则是移动设备
        if ((strpos($_SERVER['HTTP_ACCEPT'], 'vnd.wap.wml') !== false) && (strpos($_SERVER['HTTP_ACCEPT'], 'text/html') === false || (strpos($_SERVER['HTTP_ACCEPT'], 'vnd.wap.wml') < strpos($_SERVER['HTTP_ACCEPT'], 'text/html')))) {
            $this->redirect("/index.php?m=Wap&c=Index&a=index");
        }
    }
   
  




	}
	protected function islogin() {
		$userId = session('userId');
		$checked = cookie('checked');
		$userModel = M('user');
		if (!empty($checked) && $checked == 'yes') {
			return true;
		}elseif(empty($userId)){
			//$this->success('您还未登录，或者长时间未操作导致自动退出，请登录','index.php?m=Index&a=index&c=index');
			header("location:index.php?m=Index&c=Index&a=index");
			exit;
		}else{
			$query = U();
			$this->assign('query',$query);
			$this->assign('host',$_SERVER['HTTP_HOST']); 
			/*$where = array('last_time'=>array('lt',time()-30*60),'always_online'=>0);
			$data = array('is_online'=>0,'last_out'=>time());
			$mydata = array('is_online'=>1,'last_time'=>time());
			$userModel->where($where)->save($data);
			$userModel->where('id='.$userId)->save($mydata);*/
			/*$userModel = M('user');
			$t = time();
			$where = array(
					'deadline' => array('elt',$t)
				);
			$data = array(
					'is_member' => 0,
					'inner_member' => 0,
					'level' => 0,
					'deadline' => '',
					'updated' => $t
				);
			$res = $userModel->where($where)->save($data);

			$upgradeModel = M('upgrade_record');
			$upgradeWhere = array(
							'status' => 'success', 
						);
			$upgradeData = $upgradeModel->where($upgradeWhere)->select();
			foreach ($upgradeData as $item) {
				$time = $item['updated']+$item['time']*30*24*3600;
				if ($time > time()) {
					$newdata = array(
							'is_member' => 1,
							'level' => $item['type_id'],
							'deadline' => $time,
							'updated' => $t
						);
					$userModel->where('id='.$item['target_id'])->save($newdata);
				}
			}*/
			return true;	
		}
	}
	public function userinfo() {
		$userId = session('userId');
		$user = M('user');
		$userinfo = $user->where('id='.$userId)->find();
		$webconf = M('web_conf');
		$webinfo = $webconf->find();
		$this->userinfo = $userinfo;
		$this->assign('webinfo',$webinfo);
		$this->assign('userinfo',$userinfo);
	}
	public function getMember() {
		$userId = session('userId');
		$user = M('user');
		$userinfo = $user->field('id,level,is_member,deadline')->where('id='.$userId)->find();
		if ($userinfo['is_member'] && ($userinfo['deadline']-time()>0)) {
			$member = M('member');
			$memberinfo  = $member->select();
			foreach ($memberinfo as $item) {
				if ($userinfo['level'] == $item['id']) {
					$level = $item['key'];
				}
			}
		}else{
			$data = array('is_member'=>0,'level'=>0,'deadline'=>0,'inner_member'=>0);
			$res = $user->where('id='.$userId)->save($data);
			$level = 'user';
		}
		return 	$level;
	}
	public function ajaxMember() {
		$needlevel = I('get.needlevel');
		$level = $this->getMember();
        if ($level == 'user' && $needlevel == 'ordinary') {
            $msg = array('status'=>'error','msg'=>L("need ordinary member")); 
            return $this->ajaxReturn($msg);
        }
        if($level == 'user' && $needlevel == 'senior') {
        	$msg = array('status'=>'error','msg'=>L("need senior member")); 
            return $this->ajaxReturn($msg);
        }
        if($level == 'ordinary' && $needlevel == 'senior') {
        	$msg = array('status'=>'error','msg'=>L("need senior member")); 
            return $this->ajaxReturn($msg);
        }
        $msg = array('status'=>'success');
        return $this->ajaxReturn($msg);
	}
	public function notAjaxMember($needlevel) {
		$level = $this->getMember();
        if ($level == 'user' && $needlevel == 'ordinary') {
            return false;
        }
        if($level == 'user' && $needlevel == 'senior') {
        	return false;
        }
        if($level == 'ordinary' && $needlevel == 'senior') {
        	return false;
        }
        return true;
	}
	public function getInfoNum() {
		$userId = session('userId');

		$likeModel = M('user_like');
		$likeWhere = array(
				'target_id' => $userId,
				'is_read' => 0
			);
		$likeNum = $likeModel->where($likeWhere)->count();

		$giftModel = M('user_gift');
		$giftWhere = array(
				'reciver_id' => $userId,
				'is_read' => 0
			);
		$giftNum = $giftModel->where($giftWhere)->count();

		$visitorModel = M('visitors');
		$visitorWhere =  array(
				'target_id' => $userId,
				'is_read' => 0
			);
		$visitorNum = $visitorModel->where($visitorWhere)->count();

		$totalNum = $likeNum + $giftNum + $visitorNum;
		$num =  array(
				'likeNum' => $likeNum,
				'giftNum' => $giftNum,
				'visitorNum' => $visitorNum,
				'totalNum' => $totalNum
			);
		$this->assign('num',$num);
	}
	protected function changelang() {
		$l = I('get.l');
		if (!$l) {
			$l = cookie('think_language');
		}
		if (!$l) {
			$l = 'zh-cn';
		}
		$l = strtolower($l);
        if ($l == 'en-us') {
            $lang = 'English';
        }elseif ($l == 'zh-cn') {
            $lang = '简体中文';
        }elseif ($l == 'zh-tw') {
            $lang = '繁體中文';
        }elseif ($l == 'ko-kr') {
            $lang = '한국어';
        }elseif ($l == 'es') {
            $lang = 'Español';
        }elseif ($l == 'ja') {
            $lang = '日本語';
        }elseif ($l == 'de') {
            $lang = 'Deutsch';
        }elseif ($l == 'Fra') {
            $lang = 'Français';
        }elseif ($l == 'it') {
            $lang = 'Italiano';
        }elseif ($l == 'nl') {
            $lang = 'Nederlandse';
        }elseif ($l == 'pt') {
            $lang = 'Português';
        }elseif ($l == 'ru') {
            $lang = 'Русский';
        }else{
            $lang = '简体中文';
        }
        $this->assign('lang',$lang);
	} 
    		 
}