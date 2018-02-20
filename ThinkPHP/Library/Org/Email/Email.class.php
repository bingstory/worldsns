<?php
namespace Org\Email;
require("Smtp.class.php"); 

class EMail{
	
	/*private $smtpserver = "smtp.yeah.net";
	private $smtpserverport = 25;
	private $smtpusermail = "f_tian@yeah.net";
	private $smtpuser = "f_tian";
	private $smtppass = "rocugdyqukygextn";
	private $mailtype = "HTML";
	private $smtp;*/

	private $smtpserver = "smtp.yeah.net";
	private $smtpserverport = 25;
	private $smtpusermail = "vivimeetteam@yeah.net";
	private $smtpuser = "vivimeetteam";
	private $smtppass = "haha123456";
	private $mailtype = "HTML";
	private $smtp;

	static protected $handle;
	public function __construct()
	{
		$this->smtp = new Smtp($this->smtpserver,$this->smtpserverport,true,$this->smtpuser,$this->smtppass);
		$this->smtp->debug = false;
	}
	//单例化
	static public function instance(){
		if(!self::$handle){
			self::$handle = new self;
		}
		return self::$handle;
	}

	public function send($smtpemailto,$mailsubject,$mailbody)
	{
		$res = $this->smtp->sendmail($smtpemailto, $this->smtpusermail, $mailsubject, $mailbody, $this->mailtype);
		return $res;
	}
}