<?php
namespace Index\Controller;
use Think\Controller;
require(COMMON_PATH."common.php");
class IndexController extends Controller {
    public function index(){


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
        $webconf = M('web_conf');
        $webinfo = $webconf->find();
        if (isset($_COOKIE['name'])) {
            $name = $_COOKIE['name'];
            $this->assign('name',$name);
        }
        $recommend = I('get.recommend');
        if ($recommend) {
            session('recommend',$recommend);
        }
        $this->assign('u','Index/Index/index');
        $this->assign('lang',$lang);
        $this->assign('l',$l);
        $this->assign('webinfo',$webinfo);
    	$this->display();
    }
    public function register() {
        $username = I('post.username');
        $pwd = I('post.pwd');
        $pwd = md5('tmj'.$pwd);
        $email = I('post.email');
        $year = I('post.year');
        $month = I('post.month');
        $day = I('post.day');
        $sex = I('post.sex');
        $created = time();
        $userModel = M('user');
        $nameres = $userModel->where("username = '$username'")->getField('id');
        if ($nameres) {
            $data = array('status' => 1);
            $this->ajaxReturn($data);
        }
        $eamilres = $userModel->where("email = '$email'")->getField('id');
        if (!$eamilres) {
            $this->sendAuthEmail($email);
        }else{
            $data = array('status' => 2);
            $this->ajaxReturn($data); 
        }
        $ip = get_client_ip($type = 0,$adv=true);
        $area = $this->taobaoIP($ip);
        $data = array('username'=>$username,'pwd'=>$pwd,'email'=>$email,'year'=>$year,'month'=>$month,'day'=>$day,'sex'=>$sex,'country_zhcn'=>$area['country'],'reg_ip'=>$ip,'terminal'=>'PC','city'=>$area['city'],'created'=>$created);
        $recommend = session('recommend');
        if ($recommend) {
            $data['is_alloted'] = 1;
        }
        $trans = new TransController();
        $data['country_zhtw'] = $trans->trans($area['country'],'cht');
        $data['country_de'] = $trans->trans($area['country'],'de');
        $data['country_enus'] = $trans->trans($area['country'],'en');
        $data['country_fra'] = $trans->trans($area['country'],'fra');
        $data['country_it'] = $trans->trans($area['country'],'it');
        $data['country_ja'] = $trans->trans($area['country'],'jp');
        $data['country_kokr'] = $trans->trans($area['country'],'kor');
        $data['country_nl'] = $trans->trans($area['country'],'nl');
        $data['country_pt'] = $trans->trans($area['country'],'pt');
        $data['country_ru'] = $trans->trans($area['country'],'ru');
        $data['country_es'] = $trans->trans($area['country'],'spa');
        $confModel = M('web_conf');
        $female_reg = $confModel->where("id=1")->getField('female_reg');
        if (!$female_reg && $sex == 'female') {
            $data['verify_status'] = 1;
        }else{
            $data['verify_status'] = 2;
        }
        $result = $userModel->add($data);
        if (!$result) {
            $msg = array('status'=>3);
            return $this->ajaxReturn($msg);
        }else{
            session('userId',$result);
            if ($recommend) {
                $innerMemberModel = M('inner_member');
                $data = array(
                        'job_number' => $recommend,
                        'user_id' => $result,
                        'created' => time()
                    );
                $res = $innerMemberModel->add($data);
            }
            if ($data['verify_status'] == 1) {
                $msg =  array('status'=>'4');
            }else{
                $msg = array('status'=>'success');
            }
            return $this->ajaxReturn($msg);
        }
    }

    public function auth() {
        $oid = I('post.oid');
        $auth = I('post.auth');
        $userModel = M('user');
        $condition = array(
                'oid' => $oid,
                'auth' => $auth
            );
        $id = $userModel->where($condition)->getField('id');
        if (!$id) {
            $msg = array('status'=>'error');
            return $this->ajaxReturn($msg);
        }else{
            session('userId',$id);
            $msg = array('status'=>'success','id'=>$id);
            return $this->ajaxReturn($msg);
        }
    }

    public function authBind() {
        $oid = I('post.reg_oid');
        $auth = I('post.reg_auth');
        $sex = I('post.reg_gender');
        if ($sex == 1) {
            $sex = 'male';
        }elseif ($sex == 2) {
            $sex = 'female';
        }
        $username = I('post.reg_alias');
        if (!$oid || !$auth || !$sex || !$username) {
            $msg = array('status'=>'error');
            return $this->ajaxReturn($msg);
        }
        $userModel = M('user');
        $data = array(
                'oid' => $oid,
                'auth' => $auth,
                'sex' => $sex,
                'username' => $username,
                'token' => $token
            );
        $res = $userModel->add($data);
        if (!$res) {

        }else{
            session('userId',$res);
            header("location:index.php?m=Index&c=Home&a=index");
        }
    }

    public function checkEmail() {
        $email = I('post.email');
        $userModel = M('user');
        $eamilres = $userModel->where("email = '$email'")->getField('id');
        if (!$eamilres) {
            $data = array('status' => 1);
            $this->sendAuthEmail($email);
            $this->ajaxReturn($data);
        }else{
            $data = array('status' => 0);
            $this->ajaxReturn($data); 
        }
    }
    public function sendEmail() {
        $to = I('post.email');
        $bool = $this->sendAuthEmail($to);
        if (!$bool) {
            $msg = array('status' => 'error');
        }else{
            $msg = array('status' => 'success');
        }
        $this->ajaxReturn($msg);
    }
    public function sendAuthEmail($to) {
        $subject = 'Welcome to Hahameet !';
        $baseurl = $_SERVER['HTTP_HOST'];
        $mail = new \Org\Email\Email();
        $stamp = time();
        $token = md5($to.$stamp.'tmj');
        $url = 'http://'.$baseurl.'/index.php?m=Index&c=Index&a=emailauth&to='.$to.'&stamp='.$stamp.'&token='.$token;
        $message = "<div style='width: 650px;margin: 0 auto;background:#F4F5F9;border:1px solid #E8E4E4;padding:25px;line-height:30px;'>Dear <a target='_blank' href='mailto:".$to."'>".$to."</a>:<div style='padding-left: 60px;margin-top: 10px;'>Welcome to Hahameet , please click the following link to finish your registration .<a target='_blank' style='margin-top: 20px;font-size:15px;font-weight:bolder;text-decoration: underline;display: block;color: #296CD8;' href='".$url."'>Click here to activate your account!</a><div style='text-align: right;margin-top: 20px;'>Sincerely<br>   &copy; 2016 Hahameet.com</div></div></div>";
        $bool = $mail->send($to,$subject,$message);
        return $bool;
    }
    public function emailauth() {
        $to = I('get.to');
        $stamp = I('get.stamp');
        $token = I('get.token');
        $newtoken = md5($to.$stamp.'tmj');
        if ($newtoken == $token) {
            $userModel = M('user');
            $where = array(
                'email' => $to
            );
            $data = array(
                    'authentication' => 1,
                    'updated' => time()
                );
            $res = $userModel->where($where)->save($data);
            if (!$res) {
                header("location:index.php?m=Index&c=Index&a=index");
            }else{
                $id = $userModel->where($where)->getField('id');
                session('userId',$id);
                header("location:index.php?m=Index&c=Home&index");
            }
        }else{
            header("location:index.php?m=Index&c=Index&a=index");
        }
    }
    public function login() {
        $name = I('post.name');
        $pwd = I('post.pwd');
        $condition = "(username = '$name' or email = '$name') and status = 1";
        $user = M('user'); 
        $info = $user->field('id,pwd,verify_status,inner_member')->where($condition)->find();
        if (!$info) {
            $msg = array('status'=>'0','msg'=>L('username or password error'));
            return $this->ajaxReturn($msg);
        }
        if ($info['pwd'] != md5('tmj'.$pwd)) {
            $msg = array('status'=>'error','msg'=>L('username or password error'));
            return $this->ajaxReturn($msg);
        }
        if ($info['verify_status'] == 1 && $info['inner_member'] != 1) {
            $msg = array('status'=>'error','msg'=>'verifying');
            return $this->ajaxReturn($msg);
        }else{
            $where = array('id' => $info['id'],'is_visible' => 1);
            $data = array('is_online' => true,'last_time' => time()); 
            $res = $user->where($where)->save($data);
            session('userId',$info['id']);
            cookie('last_time',$info['last_time']);            
            $msg = array('status'=>'success','msg'=>L('login success'));
            return $this->ajaxReturn($msg);
        }
    }

    public function login_auto_b($username) {

        // 让前一个账号下线
        if (isset($_SESSION['userId'])) {
            $userId = session('userId');
            $data = array('is_online' => 0,'last_out'=>time());
            $user = M('user');
            $res = $user->where(array('id'=>$userId,'always_online'=>0))->save($data);
            unset($_SESSION['userId']);
        }


        $name = $username;
        $pwd = I('post.pwd');
        $condition = "(username = '$name' or email = '$name') and status = 1";
        $user = M('user'); 
        $info = $user->field('id,pwd,verify_status,inner_member')->where($condition)->find();
        if (!$info) {
            $msg = array('status'=>'0','msg'=>L('username or password error'));
            echo "用户状态异常！";
        }else{
            
            $where = array('id' => $info['id'],'is_visible' => 1);
            $data = array('is_online' => true,'last_time' => time()); 
            $res = $user->where($where)->save($data);
            session('userId',$info['id']);
            cookie('last_time',$info['last_time']);    
            // echo 2;die;        
            $url = "/";
            header("location:$url");
        }
    }
    /**
    *退出登录功能
    */
    public function logOut() {
        if (isset($_SESSION['userId'])) {
            $userId = session('userId');
            $data = array('is_online' => 0,'last_out'=>time());
            $user = M('user');
            $res = $user->where(array('id'=>$userId,'always_online'=>0))->save($data);
            unset($_SESSION['userId']);
        }
        $url = U('Index/Index/index');
        header("location:$url");
    }
    public function taobaoIP($clientIP){
        $taobaoIP = 'http://ip.taobao.com/service/getIpInfo.php?ip='.$clientIP;
        $IPinfo = json_decode(file_get_contents($taobaoIP));
        $country = $IPinfo->data->country;
        $province = $IPinfo->data->region;
        $city = $IPinfo->data->city;
        $data = array(
                'country' => $country,
                'province' => $province,
                'city' => $city
            );
        return $data;
    }
}