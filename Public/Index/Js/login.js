// JavaScript Document
(function () {
    var cm = new common();
    var regex4pwd = /^\w{6,30}$/;//鍙厑璁告暟瀛椼€佸瓧姣嶃€佷笅鍒掔嚎
    var regex4name = /^(\w{1,50}$|(^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$))/;//鍙厑璁告暟瀛椼€佸瓧姣嶃€佷笅鍒掔嚎,email
    var regex4email = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;

    function initPage() {
        var nameEl = cm.get("name");
        var oldName = cm.getCookie("name");
        if (oldName) {
            nameEl.val(oldName);
        }
        nameEl.onfocus = function () {
            this.className = "head_input";
            if (!oldName) {
                this.val("");
                this.onfocus = null;
            }
        };

        cm.get("pwd").onfocus = function () {
            this.cls("head_input");
            this.val("");
            this.onfocus = null;
        };
        cm.get("head_login").onclick = login;
        cm.get("reg_btn").onclick = reg;
        //cm.get("vk_auth").onclick = vkLogin;
        //cm.get("fb_auth").onclick = fbLogin;


        document.body.onkeydown = function (e) {//enter
            e = e || window.event;
            if (e.keyCode == 13) {
                login();
            }
        };
    }

    function initBirth() {
        var select4month = cm.get("reg_month");
        var select4day = cm.get("reg_day");
        var select4year = cm.get("reg_year");

        var option4month = cm.get(new Option());
            for (var i = 1; i < 13; i++) {
                var option = new Option();
                option.value = i;
                option.innerHTML = option.value = i;
                select4month.append(option);
            }
            for (i = 1; i < 32; i++) {
                option = new Option();
                option.innerHTML = option.value = i;
                select4day.append(option);
            }

        var currentYear = new Date().getFullYear();
        for (i = (currentYear - 2); i > (currentYear - 106); i--) {
            option = new Option();
            option.innerHTML = option.value = i;
            select4year.appendChild(option);
        }
    }

    function initLang() {
        var localeLang = "English";
        var localeCode = document.langCode;
        var headViewer = cm.get("head_lang_viewer");
        var codeArr = ["zh", "zh-tw", "en", "ja", "ko", "de", "es", "fr", "it", "nl", "pt", "ru"];
        var langArr = ["中文简体", "中文-繁體", "English", "日本語", "한국의", "Deutsch", "Español", "Français", "Italiano", "Nederlandse", "Português", "Русский"];  
        for (var i = 0; i < 12; i++) {
            var a = cm.mk("a");
            a.cls("head_lang_item");
            a.code = codeArr[i];
            a.html(langArr[i]);
            a.onclick = function () {
                cm.setCookie("lang", this.code, 300);
                top.location = "";
            };
            headViewer.append(a);
            if (localeCode.toLowerCase() == a.code) {
                localeLang = langArr[i];
                cm.setCookie("lang", localeCode, 300);
            }
        }

        cm.get("head_lang_txt").html(localeLang);
    }

    var initTip = function () {
        var propArr = ["reg_alias", "reg_pwd", "reg_email", "reg_birth"];
        var createTip = function (p) {
            var tip = cm.get(p + "_tip");
            var tip_txt = cm.mk("dd");
            var tip_arrow = cm.mk("dd");

            tip.cls("reg_tip");
            tip_txt.cls("reg_tip_txt");
            tip_arrow.cls("reg_tip_arrow");

            tip.append(tip_arrow);
            tip.append(tip_txt);


            tip.setInfo = function (i) {
                tip_txt.html(i);
            };
            // tip.style.right = cm.get("reg_form").clientWidth + "px";
        };
        for (var i = 0; i < propArr.length; i++) {
            createTip(propArr[i]);
        }

    };

    var initQQ = function () {
        var header = document.getElementsByTagName("head")[0];
        var ql = document.createElement('script');
        var qs = document.createElement('script');
        qs.type = 'text/javascript';
        ql.type = 'text/javascript';
        ql.setAttribute("data-callback", "true");
        qs.setAttribute("data-appid", "101199647");
        qs.setAttribute("data-redirecturi", "http://www.perdate.com/qq_back.html");
        ql.src = "http://qzonestyle.gtimg.cn/qzone/openapi/qc_loader.js";
        qs.src = "http://qzonestyle.gtimg.cn/qzone/openapi/qc_loader.js?" + Math.random();
        header.appendChild(qs);
        header.appendChild(ql);

        var QQLogin = function (o1, o2) {
            var alias = o1["nickname"];
            var gender = o1["gender"] == "鐢�" ? 1 : 2;
            var birth = o1["year"] + "-01-01";
            var openId = null;
            var accessToken = null;
            var args = [];
            QC.Login.getMe(function (oid, at) {
                openId = oid;
                accessToken = at;
                args.alias = alias;
                args.gender = gender;
                args.birth = birth;
                args.openId = openId;
                args.category = 0;
                args.accessToken = accessToken;
                args.country = country;
                args.city = city;
                args.friendName = top.friendName || "";
                ajax(
                    "client/open/register_QQ", args,
                    function (msg) {
                        var status = msg["status"];
                        if (status == 1) {//success
                            setCookie("token", msg["token"]);
                            setCookie("name", "");
                            if (msg["isNew"] == 1) {
                                setCookie("relation", 0);
                            }
                            top.location = "home";
                        }
                    }, true);
            });
        };

        var retrieve = function () {
            setTimeout(function () {
                if (typeof QC != "undefined") {
                    QC.Login({btnId: "reg_qq", scope: "all"}, QQLogin);
                } else {
                    retrieve();
                }
            }, 1000);
        };
        retrieve();
    };

    function reg() {
        var reg_alias = cm.get("reg_alias").val();
        var reg_pwd = cm.get("reg_pwd").val();
        var reg_email = cm.get("reg_email").val();
        var reg_gender = cm.get("reg_gender1").checked ? 'male' : 'female';
        var reg_year = cm.get("reg_year").val();
        var reg_month = cm.get("reg_month").val();
        var reg_day = cm.get("reg_day").val();
        var checkCount = 0;
        var f = function (id, b, info) {
            var tip = cm.get(id + "_tip");
            tip[!b ? "show" : "hide"]();
            tip.setInfo(info);
            checkCount += b ? 1 : 0;
        };
        f("reg_alias", reg_alias.length > 1 && reg_alias.match(/perdate|yangmeizi/gi) == null, document.i18n["tip_alias"]);
        f("reg_pwd", regex4pwd.test(reg_pwd), document.i18n["tip_pwd"]);
        f("reg_email", regex4email.test(reg_email), document.i18n["tip_email"]);
        f("reg_birth", reg_year != -1 && reg_month != -1 && reg_day != -1, document.i18n["tip_birth"]);
        reg_pwd = $.md5(reg_pwd);
        if (checkCount == 4) {
            cm.ajax("index.php?m=Index&c=Index&a=register", {username:reg_alias,pwd:reg_pwd,email: reg_email,sex:reg_gender,year:reg_year,month:reg_month,day:reg_day}, function (res) {
                if (res["status"] == 'success') {
                    top.location = "http://"+document.domain;
                } else if (res["status"] == 1){
                    f("reg_alias", false, document.i18n["tip_username_exist"]);
                } else if (res["status"] == 2){
                    f("reg_email", false, document.i18n["tip_email_exist"]);
                } else if (res["status"] == 3){
                    alert(document.i18n["reg_failed"]);
                }else if (res["status"] == 4){
                    alert(document.i18n["being audited"]);
                    window.location = "index.php?m=Index&c=Index&a=index";
                }
            });

        }
    }


    var wblogin = function () {
        WB2.anyWhere(function (W) {
            W.widget.connectButton({
                id: "reg_wb",
                type: '3,2',
                callback: {
                    login: function (o) { //鐧诲綍鍚庣殑鍥炶皟鍑芥暟
                        alert("login: " + o.screen_name)
                        var arr = [];
                        for (var p in o) {
                            arr.push(p + ":" + o[p]);
                        }
                        window.console.log(arr.join("\r\n"))
                        //return false;
                    },
                    logout: function () { //閫€鍑哄悗鐨勫洖璋冨嚱鏁�
                        alert('logout');
                    }
                }
            });
        });
    };
    var loadJs = function (d, id, url, o) {
        if (!d.getElementById(id)) {
            var fjs = d.getElementsByTagName("script")[0];
            var js = d.createElement("script");
            for (var p in o) {
                js.setAttribute(p, o[p]);
            }
            js.type = "text/javascript";
            js.async = true;
            js.id = id;
            js.src = url;
            fjs.parentNode.insertBefore(js, fjs);
        }
    };
    var postAuth = function (user) {
        cm.ajax("index.php?m=Index&c=Index&a=auth", {oid: user["oid"], auth: user["auth"], device: 0}, function (res) {
            if (res["status"] == 'success') {
                cm.setCookie("id", res["id"]);
                top.location = "http://"+document.domain;
            } else {
                var form = cm.mk("form");
                var c = function (k) {
                    var input = cm.mk("input");
                    input.type = "hidden";
                    input.name = "reg_" + k;
                    input.value = (user[k]);
                    form.append(input);
                };
                var ns = ["oid", "alias", "gender", "auth"];
                for (var i = 0, len = ns.length; i < len; i++) {
                    c(ns[i]);
                }
                form["method"] = "post";
                form["acceptCharset"] = "utf-8";
                form["action"] = "index.php?m=Index&c=Index&a=authBind";
                form.submit();
            }
        });
    };
    var qqLogin = function () {
        var startQQ = function () {
            VK.init({apiId: 5159445});
            VK.Auth.getLoginStatus(function (res) {
                var getInfo = function (res) {
                    if (res.session) {
                        VK.Api.call('users.get', {uids: res.session.mid, fields: "sex,bdate,country"}, function (r) {
                            r = r.response[0];
                            var user = {};
                            user["oid"] = r["uid"];
                            user["auth"] = "vk";
                            user["gender"] = r["sex"] == 2 ? 1 : 2;
                            user["alias"] = r["first_name"] + " " + r["last_name"];
                            cm.printProp(user);
                            postAuth(user);
                        });
                    }
                };
                if (res.session) {
                    getInfo(res);
                } else {
                    VK.Auth.login(getInfo);
                }
            });
        };
        if (window.vkAsyncInit) {
            startQQ();
        } else {
            window.vkAsyncInit = startQQ;
        }
        loadJs(document, "qq_sdk", "http://qzonestyle.gtimg.cn/qzone/openapi/qc_loader.js",
            {
                "data-callback": true,
                "data-appid": "101199647",
                "data-redirecturi": "http://www.perdate.com/qq_back.html"
            }
        );
    };
    var vkLogin = function () {
        var startVk = function () {
            VK.init({apiId: 5405283});
            VK.Auth.getLoginStatus(function (res) {
                var getInfo = function (res) {
                    if (res.session) {
                        VK.Api.call('users.get', {uids: res.session.mid, fields: "sex,bdate,country"}, function (r) {
                            r = r.response[0];
                            var user = {};
                            user["oid"] = r["uid"];
                            user["auth"] = "vk";
                            user["gender"] = r["sex"] == 2 ? 1 : 2;
                            user["alias"] = r["first_name"] + " " + r["last_name"];
                            cm.printProp(user);
                            postAuth(user);
                        });
                    }
                };
                if (res.session) {
                    getInfo(res);
                } else {
                    VK.Auth.login(getInfo);
                    //top.location = "https://oauth.vk.com/authorize?client_id=5405283&scope=PERMISSIONS&redirect_uri=http://ymz.tmj.tech/&response_type=code";
                }
            });
        };
        if (window.vkAsyncInit) {
            startVk();
        } else {
            window.vkAsyncInit = startVk;
        }
        loadJs(document, "vk_sdk", "http://vk.com/js/api/openapi.js");
    };
    var fbLogin = function () {
        loadJs(document, "fb-sdk", "//connect.facebook.net/en_US/sdk.js");
        var startFb = function () {
            FB.init({appId: '1527989137519967', xfbml: true,cookie: true, version: 'v2.5', status: true});
            FB.getLoginStatus(function (res) {
                    var getInfo = function () {
                        FB.api('/me', {fields: 'id,name,email,gender,birthday,location'}, function (res) {
                            if (res["id"]) {
                                var user = {};
                                user["oid"] = res["id"];
                                user["alias"] = res["name"];
                                user["gender"] = res["gender"] == "male" ? 1 : 2;
                                user["auth"] = "fb";
                                cm.printProp(user);
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

    function login() {
        var name = cm.trim(cm.get("name").val());
        var pwd = cm.trim(cm.get("pwd").val());
        pwd = $.md5(pwd);
        cm.ajax("index.php?m=Index&c=Index&a=login", {name: name, pwd: pwd, device: 0}, function (res) {
            if (res["status"] == 'success') {
                //cm.setCookie("token", res["token"],300);
                cm.setCookie("name", name,300);
                top.location = "http://"+document.domain;
            } else {
                if (res["msg"] == 'verifying') {
                    alert(document.i18n["being audited"]);
                }else{
                    alert(res["msg"]);
                }
            }
        })
    }

    function mobile_device_detect(url){
        var thisOS=navigator.platform;
        var os=new Array("iPhone","iPod","iPad","android","Nokia","SymbianOS","Symbian","Windows Phone","Phone","Linux armv71","MAUI","UNTRUSTED/1.0","Windows CE","BlackBerry","IEMobile");
        for(var i=0;i<os.length;i++) {
            if(thisOS.match(os[i])) {   
                window.location=url;
            }
        }
        //因为相当部分的手机系统不知道信息,这里是做临时性特殊辨认
        if(navigator.platform.indexOf('iPad') != -1) {
            window.location=url;
        }
        //做这一部分是因为Android手机的内核也是Linux
        //但是navigator.platform显示信息不尽相同情况繁多,因此从浏览器下手，即用navigator.appVersion信息做判断
        var check = navigator.appVersion;
        if( check.match(/linux/i) ) {
            //X11是UC浏览器的平台 ，如果有其他特殊浏览器也可以附加上条件
            if(check.match(/mobile/i) || check.match(/X11/i)) {
                    window.location=url;
            }  
        }
        //类in_array函数
        Array.prototype.in_array = function(e) {
            for(i=0;i<this.length;i++){
                if(this[i] == e)
                return true;
            }
            return false;
        }
    } 
    function device_detect() {
        var nowUrl = window.location.href;
        reg = /recommend=\d*/;
        var bool = nowUrl.match(reg);
        if (bool) {
            var newUrl = "index.php?m=Wap&c=Index&a=index&"+bool;
        }else{
            var newUrl = "index.php?m=Wap&c=Index&a=index";
        }
        mobile_device_detect(newUrl);
    }
    //initLang();
    initBirth();
    initPage();
    initTip();
    device_detect();
})();
