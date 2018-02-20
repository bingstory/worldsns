// JavaScript Document
(function () {
    var index = 0;
    var cm = new top.common(document);
    var regex4email = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;

    var init = function () {
        cm.get("btn_ask").onclick = function () {
            var mail = cm.get("ask_mail").val();
            cm.get("tip").html("");
            if (regex4email.test(mail)) {
                cm.ajax("index.php?m=Index&c=Forget&a=find", {mail: mail}, function (res) {
                    if (res["status"] == 'success') {
                        cm.get("panel1").hide();
                        cm.get("panel2").show();
                    } else {
                        cm.get("tip").html(document.i18n["tip_error"]);
                    }
                });
            } else {
                cm.get("tip").html(document.i18n["tip_format"]);
            }
        };
        cm.get("btn_mail").onclick = function () {
            var mail = cm.get("ask_mail").val();
            top.location = "http://" + getEmailUrl(mail);
        }
    };

    var getEmailUrl = function (mail) {
        var t = mail.split('@')[1];
        t = t.toLowerCase();
        if (t == '163.com') {
            return 'mail.163.com';
        } else if (t == 'vip.163.com') {
            return 'vip.163.com';
        } else if (t == '126.com') {
            return 'mail.126.com';
        } else if (t == 'qq.com' || t == 'vip.qq.com' || t == 'foxmail.com') {
            return 'mail.qq.com';
        } else if (t == 'gmail.com') {
            return 'mail.google.com';
        } else if (t == 'sohu.com') {
            return 'mail.sohu.com';
        } else if (t == 'tom.com') {
            return 'mail.tom.com';
        } else if (t == 'vip.sina.com') {
            return 'vip.sina.com';
        } else if (t == 'sina.com.cn' || t == 'sina.com' || t == 'sina.cn') {
            return 'mail.sina.com.cn';
        } else if (t == 'yahoo.com.cn' || t == 'yahoo.cn') {
            return 'mail.cn.yahoo.com';
        } else if (t == 'yeah.net') {
            return 'www.yeah.net';
        } else if (t == '21cn.com') {
            return 'mail.21cn.com';
        } else if (t == 'hotmail.com') {
            return 'www.hotmail.com';
        } else if (t == 'sogou.com') {
            return 'mail.sogou.com';
        } else if (t == '188.com') {
            return 'www.188.com';
        } else if (t == '139.com') {
            return 'mail.10086.cn';
        } else if (t == '189.cn') {
            return 'webmail15.189.cn/webmail';
        } else if (t == 'wo.com.cn') {
            return 'mail.wo.com.cn/smsmail';
        } else if (t == '139.com') {
            return 'mail.10086.cn';
        } else if (t == 'live.com') {
            return 'login.live.com';
        } else if (t == 'live.cn') {
            return 'login.live.cn';
        } else if (t == 'live.com.cn') {
            return 'login.live.com.cn';
        } else if (t == 'eyou.com') {
            return 'www.eyou.com';
        } else if (t == '21cn.com') {
            return 'mail.21cn.com';
        } else {
            return '';
        }
    };

    init();
})();
