var indexlang=function(){
	weixinLogin();
	// var h=document.documentElement.clientHeight+100;
	var h=document.documentElement.clientHeight;
	document.getElementById("language_div_bg").style.height =  h+"px";
	document.getElementById("block_home_content").style.height =  h+"px";		
	var c_start=document.cookie.indexOf("lang=");
	if(c_start == -1){
		var language=langpages();	
		languagebotton(language);
	}else{
		var language=getCookie("lang");
		languagebotton(language);
	}	
	homepagejs();
	homepageimg();
	//setTimeout('homepageimg()',1000);
	setTimeout('homepagejs()',3000);	
}
function weixingetCookie(name) 
{ 
  var arr = document.cookie.match(new RegExp("(^| )"+name+"=([^;]*)(;|$)")); 
  if(arr != null) return unescape(arr[2]);  
  return null; 
} 
var weixinLogin=function(){
	if(!weixingetCookie("weixinuser")) 
	{ 
	  
	}else{
		var weiuser=JSON.parse(weixingetCookie("weixinuser"));
		var user = {};
		user["uid"] = weiuser["openid"];
		user["auth"] = "wx";
		user["gender"] = weiuser["sex"];
		user["alias"] = weiuser["nickname"];						
		printProp(user);
		postAuth(user);	
	 	alert(weiuser["nickname"]); 
	} 
}
//banner 【删掉：改homepageimg为homepageImg】
var homepageImg=function(){
	//document.getElementById("pageslide").style.display="none";
	var homesliderul = document.getElementById("home_slider_ul");
	
	//第二张
	var homesliderli1=document.createElement("li");
		homesliderli1.className='language_name_list';
		homesliderul.appendChild(homesliderli1);
	
	var homesliderdiv1=document.createElement("div");
		homesliderdiv1.className='slide';
		homesliderli1.appendChild(homesliderdiv1);
	
	var homesliderp1=document.createElement("p");
		homesliderp1.id='title_1';
		homesliderp1.className='slide_text';
		homesliderp1.innerHTML=titlehome1;
		homesliderdiv1.appendChild(homesliderp1);
	
	var homesliderimg1=document.createElement("img");
		homesliderimg1.className='hamepage-img';
		homesliderimg1.src="Public/Wap/Images/y3.png";
		homesliderdiv1.appendChild(homesliderimg1);

	//第三张
	var homesliderli2=document.createElement("li");
		homesliderli2.className='language_name_list';
		homesliderul.appendChild(homesliderli2);
	
	var homesliderdiv2=document.createElement("div");
		homesliderdiv2.className='slide';
		homesliderli2.appendChild(homesliderdiv2);
	
	var homesliderp2=document.createElement("p");
		homesliderp2.id='title_2';
		homesliderp2.className='slide_text';
		homesliderp2.innerHTML=titlehome2;
		homesliderdiv2.appendChild(homesliderp2);
	
	var homesliderimg2=document.createElement("img");
		homesliderimg2.className='hamepage-img';
		homesliderimg2.src="Public/Wap/Images/y2.png";
		homesliderdiv2.appendChild(homesliderimg2);
	
	//第四张
	var homesliderli3=document.createElement("li");
		homesliderli3.className='language_name_list';
		homesliderul.appendChild(homesliderli3);
	
	var homesliderdiv3=document.createElement("div");
		homesliderdiv3.className='slide';
		homesliderli3.appendChild(homesliderdiv3);
	
	var homesliderp3=document.createElement("p");
		homesliderp3.id='title_32';
		homesliderp3.className='slide_text';
		homesliderp3.innerHTML=titlehome3;
		homesliderdiv3.appendChild(homesliderp3);
	
	var homesliderimg3=document.createElement("img");
		homesliderimg3.className='hamepage-img';
		homesliderimg3.src="Public/Wap/Images/y3.png";
		homesliderdiv3.appendChild(homesliderimg3);	
	//document.getElementById("Footer_Quick_content").innerHTML=FooterQuickcontent;
	document.title = yangtitle;
	document.getElementById("lang_login").innerHTML=Landed;
	document.getElementById("submit_login_register").innerHTML=Register;
	document.getElementById("lang_register").innerHTML=Register;
	document.getElementById("lang_login1").innerHTML=Landed;
	document.getElementById("submit_login").value=Landed;
	//document.getElementById("Quick_login").innerHTML=Quicklogin;	
}
//add:2016-05-10
var homepageimg=function(){
	document.title = yangtitle;
	document.getElementById("Welcome_join").innerHTML=Welcome_join;
	document.getElementById("Dating_platform").innerHTML=Dating_platform;
	document.getElementById("lang_login").innerHTML=Landed;
	document.getElementById("submit_login_register").innerHTML=Register;
	document.getElementById("lang_register").innerHTML=Register;
	document.getElementById("lang_login1").innerHTML=Landed;
	document.getElementById("submit_login").value=Landed;
}
var homepagejs=function (){
		$('#home_slider').flexslider({
					animation : 'slide',
					controlNav : true,
					directionNav : false,
					animationLoop : true,
					slideshow : true,
					useCSS : true
				});
}
function loginajax(){
	var name = document.getElementById("username1").value;
	var pwd = document.getElementById("password1").value;
	name = trimStr(name);
	pwd = $.md5(pwd);
	doAjax("index.php?m=Wap&c=Index&a=login", { name:name, pwd:pwd}, function (msg) {
		var obj = JSON.parse(msg);
		if(obj.status == 'success'){
			//setCookie("token",obj.token);
			location.replace("http://"+document.domain+'/?m=wap');
		}else{
			if (obj.msg == 'verifying') {
				alert(being_audited);
			}else{
				alert(u_p_err);
			}
		}
		
	});
}
function KeyLandVK(){
	document.getElementById("KeyLand_VK").style.display="block";
	document.getElementById("KeyLandbg").style.display="block";
}
function KeyLandclose(){
	document.getElementById("KeyLand_VK").style.display="none";
	document.getElementById("KeyLandbg").style.display="none";
}
function emailsend(){
	var email = document.getElementById("FPemail").value;
	if(email){
		//var ajaxpage="emailsend";
	doAjax("index.php?m=Wap&c=Index&a=sendPassEmail", {email:email}, function (emailsendmsg) {
		var obj = JSON.parse(emailsendmsg);
		if(obj.status == 'success'){
			alert(logemail);
		}else{
			document.getElementById('FPemail_error').style.display="block";
			document.getElementById('FPemail_error').innerHTML = login_email;			
		}
	});
	}else{
		document.getElementById('FPemail_error').style.display="block";
		document.getElementById('FPemail_error').innerHTML = login_email_cont;
	}
}

var postAuth=function(user){
	var oid=user["uid"];
	var auth=user["auth"];
	doAjax("loginauth.php", { oid:oid, auth:auth}, function (msg) {
	var obj = JSON.parse(msg);
	//alert(msg);
	if(obj.status==1){
		setCookie("token",obj.token);
		location.replace('homepage/index.php');
	}else if(obj.status==2){
		 registerAnd=2;
		 page_register(user);
	}
	});
}
	var vkLogin = function () {
        loadJs(document, "vk_sdk", "http://vk.com/js/api/openapi.js");
        var startVk = function () {
            VK.init({apiId: 5155268});
            VK.Auth.getLoginStatus(function (res) {
                var getInfo = function (res) {
                    if (res.session) {
                        VK.Api.call('users.get', {uids: res.session.mid, fields: "sex,bdate,country"}, function (r) {
                            r = r.response[0];
                            var user = {};
                            user["uid"] = r["uid"];
                            user["auth"] = "vk";
                            user["gender"] = r["sex"] == 2 ? 1 : 2;
                            user["alias"] = r["first_name"] + " " + r["last_name"];						
                            printProp(user);
							postAuth(user);	
                        });
                    }
                };
                if (res.session) {
                    getInfo(res);
                } else {
                    VK.Auth.login(getInfo);
                    //top.location = "https://oauth.vk.com/authorize?client_id=5159445&scope=PERMISSIONS&redirect_uri=http://localhost&response_type=code";
                }
            });
        };
        if (window.vkAsyncInit) {
            startVk();
        } else {
            window.vkAsyncInit = startVk;
        }
    };
	var fbLogin = function () {
        loadJs(document, "fb-sdk", "//connect.facebook.net/en_US/sdk.js");
        var startFb = function () {
            FB.init({appId: '1704832023081290', xfbml: true, version: 'v2.5', status: true});
            FB.getLoginStatus(function (res) {
                    var getInfo = function () {
                        FB.api('/me', {fields: 'id,name,email,gender,birthday,location'}, function (res) {
                            if (res["id"]) {
                                var user = {};
                                user["uid"] = res["id"];
                                user["alias"] = res["name"];
                                user["gender"] = res["gender"] == "male" ? 1 : 2;
                                user["auth"] = "fb";
                               	printProp(user);
							    registerAnd=2;
                               	postAuth(user);	
                            }
                        });
                    };
                    if (res.status === 'connected') {
                        getInfo();
                    } else {
                        FB.login(getInfo);
                        //top.location="https://www.facebook.com/dialog/oauth?client_id=1527989137519967&redirect_uri=http://localhost";
                    }
                }
            );
        };
        if (window.fbAsyncInit) {
            startFb();
        } else {
            window.fbAsyncInit = startFb;
        }
    };
var QQLogin = function(){
	loadJs(document, "qq_sdk", "http://qzonestyle.gtimg.cn/qzone/openapi/qc_loader.js",
            {
                "data-appid": "101276097",
                "data-redirecturi": "http://ceshi.yangmeizi.com/index.php"
            }
        );
	var startQQ = function () {
		QC.Login.signOut();//首先注销当前用户
		QC.Login.showPopup({appId: "101276097"});
		QC.api("get_user_info").success(function (s) {
			QC.Login.getMe(function (openId, accessToken) {
					if (openId) {
						var user = {};
						user["uid"] = openId;
						user["auth"] = "qq";
						user["gender"] = s.data.gender == "男" ? 1 : 2;
						user["alias"] = s.data.nickname;							
						printProp(user);
						postAuth(user);		
					}
  
                });
		})
		.error(function (f) {//失败回调
			startQQ();
		})
		.complete(function (c) {//完成请求回调
			
		});
	};
	if (window.qqAsyncInit) {
            startQQ();
        } else {
			window.qqAsyncInit = startQQ;
			setTimeout('QQLogin()',1000);
			//QQLogin();
        }
}
