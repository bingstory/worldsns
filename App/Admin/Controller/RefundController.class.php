<?php
namespace Index\Controller;
use Index\Controller;
class RefundController extends BaseController {
	/********************************************
	PayPal API Module
	 
	Defines all the global variables and the wrapper functions 
	********************************************/
	public $PROXY_HOST = '127.0.0.1';
	public $PROXY_PORT = '808';

	public $SandboxFlag = false;

	//'------------------------------------
	//' PayPal API Credentials
	//' Replace <API_USERNAME> with your API Username
	//' Replace <API_PASSWORD> with your API Password
	//' Replace <API_SIGNATURE> with your Signature
	//'------------------------------------
	public $API_UserName="vivimeet_api1.outlook.com";
	public $API_Password="D77ZVPS657J5JYRA";
	public $API_Signature="AO.SaIHGjhxNEus2T3kcy.68yHDnAOU2IwHngMrY8nyqYRRwv5kkpsB3";
	/*public $API_UserName="1171101514-facilitator-1_api1.qq.com";
	public $API_Password="A7DYBWX7QHA7DJPA";
	public $API_Signature="AFcWxV21C7fd0v3bYYYRCpSSRl31AaUBGG4GvsN74g6R4yyIFT0yQpSV";*/

	// BN Code 	is only applicable for partners
	public $sBNCode = "PP-ECWizard";
	public $API_Endpoint = '';
	public $PAYPAL_URL = '';
	
	public $USE_PROXY = false;
	public $version = 93.0;
	
	/*	
	' Define the PayPal Redirect URLs.  
	' 	This is the URL that the buyer is first sent to do authorize payment with their paypal account
	' 	change the URL depending if you are testing on the sandbox or the live PayPal site
	'
	' For the sandbox, the URL is       https://www.sandbox.paypal.com/webscr&cmd=_express-checkout&token=
	' For the live site, the URL is        https://www.paypal.com/webscr&cmd=_express-checkout&token=
	*/
	public function __construct($SandboxFlag) {
		$this->SandboxFlag = $SandboxFlag;
		if ($this->SandboxFlag == true) {
			$API_UserName="1171101514-facilitator-1_api1.qq.com";
			$API_Password="A7DYBWX7QHA7DJPA";
			$API_Signature="AFcWxV21C7fd0v3bYYYRCpSSRl31AaUBGG4GvsN74g6R4yyIFT0yQpSV";

			$this->API_Endpoint = "https://api-3t.sandbox.paypal.com/nvp";
			$this->PAYPAL_URL = "https://www.sandbox.paypal.com/webscr?cmd=_express-checkout&token=";
		}else{
			$this->API_Endpoint = "https://api-3t.paypal.com/nvp";
			$this->PAYPAL_URL = "https://www.paypal.com/cgi-bin/webscr?cmd=_express-checkout&token=";
		}

		if (session_id() == "") 
			session_start();
	}
	public function hash_call($methodName,$nvpStr) {

		//setting the curl parameters.
		$ch = curl_init();
		curl_setopt($ch, CURLOPT_URL,$this->API_Endpoint);
		curl_setopt($ch, CURLOPT_VERBOSE, 1);

		//turning off the server and peer verification(TrustManager Concept).
		curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, FALSE);
		curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, FALSE);

		curl_setopt($ch, CURLOPT_RETURNTRANSFER,1);
		curl_setopt($ch, CURLOPT_POST, 1);
		
	    //if USE_PROXY constant set to TRUE in Constants.php, then only proxy will be enabled.
	   //Set proxy name to PROXY_HOST and port number to PROXY_PORT in constants.php 
		if($this->USE_PROXY)
			curl_setopt ($ch, CURLOPT_PROXY, $this->PROXY_HOST. ":" . $this->PROXY_PORT); 

		//NVPRequest for submitting to server
		$nvpreq="METHOD=" . urlencode($methodName) . "&VERSION=" . urlencode($this->version) . "&PWD=" . urlencode($this->API_Password) . "&USER=" . urlencode($this->API_UserName) . "&SIGNATURE=" . urlencode($this->API_Signature) . $nvpStr . "&BUTTONSOURCE=" . urlencode($this->sBNCode);

		//setting the nvpreq as POST FIELD to curl
		curl_setopt($ch, CURLOPT_POSTFIELDS, $nvpreq);

		//getting response from server
		$response = curl_exec($ch);

		//convrting NVPResponse to an Associative Array
		$nvpResArray=$this->deformatNVP($response);
		$nvpReqArray=$this->deformatNVP($nvpreq);
		$_SESSION['nvpReqArray']=$nvpReqArray;

		if (curl_errno($ch)) 
		{
			// moving to display page to display curl errors
			  $_SESSION['curl_error_no']=curl_errno($ch) ;
			  $_SESSION['curl_error_msg']=curl_error($ch);

			  //Execute the Error handling module to display errors. 
		} 
		else 
		{
			 //closing the curl
		  	curl_close($ch);
		}

		return $nvpResArray;
	}
	/*'----------------------------------------------------------------------------------
	 * This function will take NVPString and convert it to an Associative Array and it will decode the response.
	  * It is usefull to search for a particular key and displaying arrays.
	  * @nvpstr is NVPString.
	  * @nvpArray is Associative Array.
	   ----------------------------------------------------------------------------------
	  */
	public function deformatNVP($nvpstr) {
		$intial=0;
	 	$nvpArray = array();

		while(strlen($nvpstr))
		{
			//postion of Key
			$keypos= strpos($nvpstr,'=');
			//position of value
			$valuepos = strpos($nvpstr,'&') ? strpos($nvpstr,'&'): strlen($nvpstr);

			/*getting the Key and Value values and storing in a Associative Array*/
			$keyval=substr($nvpstr,$intial,$keypos);
			$valval=substr($nvpstr,$keypos+1,$valuepos-$keypos-1);
			//decoding the respose
			$nvpArray[urldecode($keyval)] =urldecode( $valval);
			$nvpstr=substr($nvpstr,$valuepos+1,strlen($nvpstr));
	     }
		return $nvpArray;
	}
	public function refundReq($transactionId,$refundType,$paymentAmount,$currencyCodeType,$refundSource,$storeId) {
		$nvpstr = "&TRANSACTIONID=".$transactionId."&REFUNDTYPE=".$refundType."&REFUNDSOURCE=".$refundSource."&STOREID=".$storeId;
		if ($refundType == 'Partial') {
			$nvpstr .=  "&AMT=".number_format($paymentAmount,2)."&CURRENCYCODE=".$currencyCodeType;
		}
		$resArray = $this->hash_call('RefundTransaction',$nvpstr); 
	    return $resArray;
	}
}