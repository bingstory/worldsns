<?php
namespace Index\Controller;
use Index\Controller;
class PhoneController extends BaseController {
	public function index() {
		$userId = I('get.id');
		$webconf = M('web_conf');
        $webinfo = $webconf->find();
        $l = I('get.l');
        if (!$l) {
            $l = cookie('think_language');
        }
        if (!$l) {
            $l = 'zh-cn';
        }
        $username = I('post.reg_alias');
    	$pwd = I('post.reg_md5pwd');
    	$email = I('post.reg_email');
    	$year = I('post.reg_year');
    	$month = I('post.reg_month');
    	$day = I('post.reg_day');
    	$sex = I('post.reg_gender');
        $l = strtolower($l);
        $this->assign('l',$l);
        $this->assign('webinfo',$webinfo);
        $this->assign('username',$username);
        $this->assign('pwd',$pwd);
        $this->assign('email',$email);
        $this->assign('year',$year);
        $this->assign('month',$month);
        $this->assign('day',$day);
        $this->assign('sex',$sex);
		$this->display();
	}
	public function sendMsg() {
		$phone = I('post.phone');
		$countryCode = I('post.countryCode');
		$code = ''; 
		for ($i=0; $i < 4; $i ++) {
			$code .= rand(0,9);
		}
		$l = I('get.l');
        if (!$l) {
            $l = cookie('think_language');
        }
        if (!$l) {
            $l = 'zh-cn';
        }
        if ($l == 'zh-cn') {
        	$str = '欢迎注册vivimeet,您的验证码为：';
        }elseif ($l == 'zh-tw') {
        	$str = '歡迎註冊vivimeet，您的驗證碼為：';
        }elseif ($l == 'en-us') {
        	$str = 'Welcome to vivimeet, your verification code is ';
        }elseif ($l == 'ja') {
        	$str = '登録vivimeetを歓迎して、あなたの確認コードを：';
        }elseif ($l == 'ko-kr') {
        	$str = '환영 등록 vivimeet 당신의 인증 코드 위해:';
        }elseif ($l == 'de') {
        	$str = 'Sie begrüßen die registrierung vivimeet, code:';
        }elseif ($l == 'es') {
        	$str = 'Acoge con beneplácito vivimeet registrada, su Código de verificación:';
        }elseif ($l == 'fra') {
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
        /*
        *此处为发送验码的代码
        */
        session('code',$code);
        $msg = array('status' => 'success','data' => $code);
        $this->ajaxReturn($msg);
    }	
}
?>