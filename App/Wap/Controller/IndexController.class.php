<?php
namespace Wap\Controller;
use Think\Controller;
class IndexController extends Controller{
    public function index() {
        $recommend = I('get.recommend');
        if ($recommend) {
            session('recommend',$recommend);
        }
        $this->display();
    }
    public function login() {
        $name = I('post.name');
        $pwd = I('post.pwd');
        $condition = "(email = '$name' or username = '$name') and status = 1";
        $user = M('user'); 
        $info = $user->field('id,pwd,username,verify_status')->where($condition)->find();
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
    public function register() {
        $username = I('post.username');
        $pwd = I('post.pwd');
        $pwd = md5('tmj'.$pwd);
        $birth = I('post.birth');
        $email = I('post.email');
        $sex = I('post.gender');
        $created = time();
        $birtharr = explode('-', $birth);
        $year = $birtharr[0];
        $month = $birtharr[1];
        $day = $birtharr[2];
        $userModel = M('user');
        $id = $userModel->field('id')->where("email='$email'")->select();
        if ($id) {
            $msg = array('status' => 4);
            return $this->ajaxReturn($msg);
        }else{
            $this->sendAuthEmail($email);
        }
        /*$condition = array('username'=>$username);
        $res = $user->where($condition)->find();
        if (!empty($res)) {
            $msg = array('status'=>'error','msg'=>L('username exist'));
            return $this->ajaxReturn($msg);
        }*/
        $ip = get_client_ip($type = 0,$adv=true);
        $area = $this->taobaoIP($ip);
        $data = array('username'=>$username,'pwd'=>$pwd,'email'=>$email,'year'=>$year,'month'=>$month,'day'=>$day,'sex'=>$sex,'country_zhcn'=>$area['country'],'reg_ip'=>$ip,'terminal'=>'WAP','city'=>$area['city'],'created'=>$created);
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
        if (isset($oid)) {
            $data['oid'] = $oid;
        }
        $result = $userModel->add($data);
        if (!$result) {
            $msg = array('status'=>'error');
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
                $msg =  array('status'=>5);
            }else{
                $msg = array('status'=>1);
            }
            return $this->ajaxReturn($msg);
        }
    }
    public function sendEmail() {
        $email = I('post.email');
        $userModel = M('user');
        $res = $userModel->where("email = '$email'")->getField('id');
        if (!$res) {
            $data = array('status' => 'success');
            $this->sendAuthEmail($email);
            $this->ajaxReturn($data);
        }else{
            $data = array('status' => 'error');
            $this->ajaxReturn($data); 
        }
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
    public function sendPassEmail() {
    	$email  = I('post.email');
        $userModel = M('user');
        $where = array('email' => $email);
        $id = $userModel->where()->getField('id');
        if (!$id) {
            $msg = array('status' => 'error');
            $this->ajaxReturn($msg);
        }else{
            $subject = 'Mail of Hahameet retrieved password';
            $baseurl = $_SERVER['HTTP_HOST'];
            $mail = new \Org\Email\Email();
            $stamp = time();
            $token = md5($email.$stamp.'tmj');
            $baseurl = $_SERVER['HTTP_HOST'];
            $url = 'http://'.$baseurl.'/index.php?m=Index&c=Forget&a=reset&email='.$email.'&stamp='.$stamp.'&token='.$token;
            $message = "<div style='width: 650px;margin: 0 auto;background:#F4F5F9;border:1px solid #E8E4E4;padding:25px;'>Dear haha:<div style='text-indent: 60px;margin-top: 10px;'>Please click the following link in 24 hours if you want to reset your password .<a target='_blank' style='text-indent: 60px;margin-top: 20px;text-decoration: underline;display: block;color: #296CD8;' href='".$url."'>Reset my password.</a><div style='text-align: right;margin-top: 20px;'>Sincerely<br>&copy; 2016 vivimeet.com</div></div></div>";
            $bool = $mail->send($email,$subject,$message);
            $msg = array('status' => 'success');
            $this->ajaxReturn($msg);
        }
    }
    public function sendMsg() {
    	$phone = I('post.phone');
    	$countryCode = I('post.countryCode');
        $lang = I('post.lang');
        $code = ''; 
        for ($i=0; $i < 4; $i ++) {
            $code .= rand(0,9);
        }
    	if ($l == 'zh') {
            $str = '欢迎注册vivimeet,您的验证码为：';
        }elseif ($l == 'tw') {
            $str = '歡迎註冊vivimeet，您的驗證碼為：';
        }elseif ($l == 'en') {
            $str = 'Welcome to vivimeet, your verification code is ';
        }elseif ($l == 'ja') {
            $str = '登録vivimeetを歓迎して、あなたの確認コードを：';
        }elseif ($l == 'ko') {
            $str = '환영 등록 vivimeet 당신의 인증 코드 위해:';
        }elseif ($l == 'de') {
            $str = 'Sie begrüßen die registrierung vivimeet, code:';
        }elseif ($l == 'es') {
            $str = 'Acoge con beneplácito vivimeet registrada, su Código de verificación:';
        }elseif ($l == 'fr') {
            $str = "Se félicite de l'enregistrement vivimeet, votre code de vérification:";
        }elseif ($l == 'it') {
            $str = 'Accolgo con favore la registrazione vivimeet, il tuo Codice di verifica per:';
        }elseif ($l == 'nl') {
            $str = 'Welkom in het register vivimeet, uw bevestigingscode: ';
        }elseif ($l == 'pt') {
            $str = 'Welkom in het register vivimeet, uw bevestigingscode:';
        }elseif ($l == 'ru') {
            $str = 'приветствует  vivimeet  регистрации  ,  ваш  код проверки  : ';
        }
        $str .= $code;
        session('code',$code);
    	$msg = array('status' => 'success','data' => $code);
        $this->ajaxReturn($msg);
    }
    public function logOut() {
        if (isset($_SESSION['userId'])) {
            $userId = session('userId');
            $data = array('is_online' => 0,'last_out'=>time());
            $user = M('user');
            $res = $user->where(array('id'=>$userId,'always_online'=>0))->save($data);
            unset($_SESSION['userId']);
        }
        $url = U('Wap/Index/index');
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
?>