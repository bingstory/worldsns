<?php
namespace Index\Controller;
use Index\Controller;
class VipController extends BaseController {
    public function index(){
    	$user = array();
    	$target = array();
    	$user['id'] = session('userId'); 
    	$user['name'] = session('userName');
    	$target['id']= I('target');
    	if (!$target['id']) {
    		$target['id'] = $user['id'];
    		$target['name'] = $user['name'];
    	}else{
    		$userModel = M('user');
    		$target['name'] = $userModel->where('id='.$target['id'])->getField('username');
    	}
    	$member = M('Member');
    	$list = $member->select();
    	foreach($list as $item) {
    		$init['money'] = $item['onefee'];
    		$init['id']= $item['id'];
    		break;
    	}
    	$auth = M('auth');
    	$authlist = $auth->select();
    	$webconf = M('web_conf');
    	$conf = $webconf->field('id,paypal')->find();
        $base_url = 'http://' . $_SERVER['SERVER_NAME'] . '/';
        $this->assign('base_url',$base_url);
    	$this->assign('user',$user);
    	$this->assign('target',$target);
    	$this->assign('list',$list);
    	$this->assign('authlist',$authlist);
    	$this->assign('conf',$conf);
    	$this->assign('init',$init);
        $this->assign('u','Index/Vip/Index');
        $this->display();
    }
    public function resReturn()
    {
        $data = $_POST;
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
        /*if ($res === FALSE) {
            var_dump(curl_error($ch));
        }*/
        curl_close($ch);
        //上线后请注释以下一行代码
        $res = "VERIFIED";

        if (strcmp ($res, "VERIFIED") == 0) { 
            /*
            1、修改user表is_member字段值为true；
            2、修改user表deadline；
            3、user表会员类型设置为;
            4、充值记录表upgrade_record添加一条记录
            */
            $info = explode("_", $data['item_name']);
            $userId = session('userId');
            $user['is_member'] = true;
            $user['deadline'] = time()+30*24*3600*intval($data['item_number']);
            $user['level'] = $info[3];
            $res1 = M('user')->where("id = $userId")->save($user);

            $up['source_id'] = $info[1];
            $up['target_id'] = $info[2];
            $up['type_id'] = $info[3];
            $up['time'] = $data['item_number'];
            $up['amount'] = $data['mc_gross'];
            $up['created'] = time();
            $res2 = M('upgrade_record')->add($up); 
            
            $msg = L("upgrade success");
            $this->success($msg,"Index/Discover/index");
        }else{
            $msg = L("upgrade failed");
            $this->error($msg,"Index/Discover/index");
        }  
    }

    public function resNotify()
    {
        $data = $_POST;
        $data['cmd'] = "_notify-validate";
        $url = "https://www.sandbox.paypal.com/cgi-bin/webscr";
        //$url = "https://www.paypal.com/cgi-bin/webscr";

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
        
        }
    }

    public function resReturnbak()
    {
        $req = 'cmd=_notify-validate';  
   
        foreach ($_POST as $key => $value) {  
        $value = urlencode(stripslashes($value));  
        $req .= "&$key=$value";  
        }
   
        // post back to PayPal system to validate  
        $header .= "POST /cgi-bin/webscr HTTP/1.0\r\n";  
        $header .= "Content-Type: application/x-www-form-urlencoded\r\n";  
        $header .= "Content-Length: " . strlen($req) . "\r\n\r\n";  
   
        //$fp = fsockopen ('ssl://www.sandbox.paypal.com', 443, $errno, $errstr, 30); // 沙盒用  
        $fp = fsockopen ('ssl://www.paypal.com', 443, $errno, $errstr, 30); // 正式用  
   
        // assign posted variables to local variables  
        $item_name = $_POST['item_name'];  
        $item_number = $_POST['item_number'];  
        $payment_status = $_POST['payment_status'];  
        $payment_amount = $_POST['mc_gross'];  
        $payment_currency = $_POST['mc_currency'];  
        $txn_id = $_POST['txn_id'];  
        $receiver_email = $_POST['receiver_email'];  
        $payer_email = $_POST['payer_email'];  
        $mc_gross = $_POST['mc_gross ']; // 付款金额  
        $custom = $_POST['custom ']; // 得到订单号  
   
        var_dump($errno);
        var_dump($errstr);

        if (!$fp) {  
            echo 123;
        } else {  
            fputs ($fp, $header . $req);  
            while (!feof($fp)) {  
                $res = fgets ($fp, 1024);  
                if (strcmp ($res, "VERIFIED") == 0) {  
                // check the payment_status is Completed  
                // check that txn_id has not been previously processed  
                // check that receiver_email is your Primary PayPal email  
                // check that payment_amount/payment_currency are correct  
                // process payment  
                // 验证通过。付款成功了，在这里进行逻辑处理（修改订单状态，邮件提醒，自动发货等）
                echo "VERIFIED" ;
                }  
                else if (strcmp ($res, "INVALID") == 0) {  
                // log for manual investigation  
                // 验证失败，可以不处理。 
                echo "INVALID"; 
                }  
            }
            fclose ($fp);  
        }  
    }
}