<?php
namespace Index\Controller;
use Index\Controller;
class RechargeController extends BaseController {
    public function index(){
    	$userId = session('userId'); 
    	$userName = session('userName');
    	$webconf = M('web_conf');
    	$conf = $webconf->field('id,paypal')->find();
        $conf = $webconf->field('id,paypal')->find();
        $base_url = 'http://' . $_SERVER['SERVER_NAME'] . '/';
        $this->assign('base_url',$base_url);
    	$this->assign('userId',$userId);
    	$this->assign('userName',$userName);
    	$this->assign('conf',$conf);
        $this->assign('u','Index/Recharge/Index');
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
        curl_close($ch);

        //上线后请注释以下一行代码
        $res = "VERIFIED";

        if (strcmp ($res, "VERIFIED") == 0) {

            $userId = session('userId');

            $setting = M('prepaidset')->find();
            $money = floatval($data['mc_gross']);
            $rate = floatval($setting['rate']);
            if ($money < 30) {
                $give = 0;
            }elseif ($money < 50) {
                $give = floatval($setting['greater30']);
            }elseif ($money < 100) {
                $give = floatval($setting['greater50']);
            }elseif ($money < 300) {
                $give = floatval($setting['greater100']);
            }elseif ($money < 500) {
                $give = floatval($setting['greater300']);
            }else{
                $give = floatval($setting['greater500']);
            }

            $gold = $money*$rate+$give;
            $res1 = M('user')->where("id = $userId")->setInc('gold',$gold);

            $rec['user_id'] = $userId;
            $rec['sum'] = $money;
            $rec['gold'] = $gold;
            $rec['created'] = time();

            $res2 = M('prepaid_record')->add($rec);

            $msg = L("charge success");
            $this->success($msg,"Index/Discover/index");
        }else{  
            $msg = L("charge failed");
            $this->error($msg,"Index/Discover/index");
        }  
    }

    public function resNotify()
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
        curl_close($ch);
        
        //上线后请注释以下一行代码
        $res = "VERIFIED";

        if (strcmp ($res, "VERIFIED") == 0) {  
        }
    }
}