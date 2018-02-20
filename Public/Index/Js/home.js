// JavaScript Document
var home = null;
(function () {
    home = this;
    var cm = new common();
    var homePanel = cm.get("home");
    var spacePanel = cm.get("space");
    var settingPanel = cm.get("setting");
    var loadConfig = function () {
        cm.ajax("index.php?m=Index&c=Home&a=user", {}, function (msg) {
            if (msg.status == 'success') {
                cm.setCache(msg.data);
                self.initUser();
                initLocation();
                initWall(msg.data.wall);
                this.freshInteractive();

                /*if (cm.isNull(cm.getUser()["header"])) {
                    cm.showAvatar(true);
                }*/
                /*if (cm.getUser()["authentication"] == 0) {
                    cm.showAuth();
                }*/

            } else if (msg.status == 'error') {
                cm.logout();
            }
        });
    };

    var initLocation = function () {
        var url = String(location || "#home").split("#")[1];
        url = (url || "first").split("_");
        if (url.length > 2) {
            cm.ajax("index.php?m=Index&c=Space&a=ajax_profile", {id: url[2]}, function (r) {
                onSpaceResult(r,url[1]);
            });
        } else {
            home.showHome((url[0] == "home") ? "first" : url[0]);
        }
        return url;
    };

    var initWall = function (walls) {
        var render = cm.get("wall_list");
        for (var i = 0, len = walls.length; i < len; i++) {
            var w = walls[i];
            var img = cm.mk("img");
            img.title = img.alt = w["username"];
            render.append(img);
            img["obj"] = w;
            img.onclick = function () {
                var u = this["obj"];
                home.showSpace(u["id"]);
            };
            img.setSrc(cm.getImgBySize(w["header"], 80), w["sex"]);
        }
    };

    var initShortBar = function () {
        cm.get("short_top").onclick = cm.goTop;

        /*var localeEasy = "EN";
        var localeCode = cm.getCookie("lang");
        var codeArr = cm.getCodeList();
        var easyArray = cm.getEasyCodeList();
        var langArr = cm.getRawLangList();
        var viewer = cm.get("short_viewer");
        if (!localeCode) {
            localeCode = document.langCode;
            cm.setCookie("lang", localeCode, 300);
        }
        for (var i = 0; i < 12; i++) {
            var a = cm.mk("a");
            a.cls("short_code");
            a.code = codeArr[i];
            a.html(langArr[i]);
            a.onclick = function () {
                cm.setCookie("lang", this.code, 300);
                window.location.reload();
            };
            viewer.append(a);
            if (localeCode == a.code) {
                localeEasy = easyArray[i];
            }
        }

        cm.get("short_txt").html(localeEasy);*/
    };
    var initHomeNav = function () {
        // var ids = ["first", "visitor", "favor", "encounter", "box", "flower", "valentine"];
        cm.get("submit_ok").onclick = function () {
            var Original_pass = cm.get("Original_pass").val();
            var pass1 = cm.get("pass1").val();
            var pass2 = cm.get("pass2").val();
            //第一个输入框是否输入
            if (Original_pass == '' || Original_pass == '') {
                return false; 
            }
            if (pass1 == ""|| pass1 == null){
                cm.get("error_info").html(cm.i18n('new password'));
                return false;   
            }
            if (pass2 == ""|| pass1 == null) {
                cm.get("error_info").html(cm.i18n('new password'));
                return false;
            }
            //判断之：两次输入不一致
            else if(pass1 !== pass2){
                cm.get("error_info").html(cm.i18n('not_equal'));
                return false;
            }
            cm.ajax("index.php?m=Index&c=User&a=editPass", {ori_pass:Original_pass,pwd: pass1}, function (res) {
                if (res["status"] == 'success') {
                    cm.get("Original_pass").val('');
                    cm.get("pass1").val('');
                    cm.get("pass2").val('');
                    alert('ok');
                }else if (res["status"] == 'error1') {
                    cm.get("error_info").html(cm.i18n('oripass error'));
                }else {
                    cm.get("error_info").html(cm.i18n('edit failed'));
                }
            });
        }
        var ids = ["first", "visitor", "favor", "encounter", "box", "Giftall", "sticker"];
        var pre = cm.get("nav_" + ids[0]);
        // alert(ids.length);
        for (var i = 0, len = ids.length; i < len; i++) {
            var id = ids[i];
            var nav = cm.get("nav_" + id);
                nav.view = id;
                nav.hover("nav_hover");
                nav.onclick = nav.onFocus = function () {
                    /*if (this.view == "visitor" && !cm.isMember()) {
                        alert(cm.i18n('need_upgrade'));
                        cm.showPay({type: "u"});
                    } else {
                        pre.removeCls("nav_focus");
                        this.addCls("nav_focus");
                        pre = this;
                        home.freshIfm(this["view"]+"_index");
                    }*/
                    pre.removeCls("nav_focus");
                    this.addCls("nav_focus");
                    pre = this;
                    home.freshIfm(this["view"]+"_index");
                };
        }

        cm.get("nav_sticker").onclick = cm.showSticker;
        cm.get("west_sticker").onclick = cm.showSticker;
        cm.get("wall_me").onclick = cm.showSpot;
        //导航栏下的“修改密码”(原来的)
        // cm.get("head_pass").onclick = cm.showPass;
        cm.get("head_discover").onclick = home.showHome;//"首页"
        //cm.get("user_avatar").onclick = cm.get("west_upload").onclick = cm.showAvatar; 原来的
        
        //导航栏下的“头像设置”(原来的)  user_url
        // cm.get("head_Head").onclick = cm.showAvatar;
        //导航栏下的“资料设置”
        //cm.get("head_Data").onclick = cm.showData;
        // cm.get("head_Data").onclick = function(){
        //     //alert(this['Setting']);
        //     home.freshIfm('Setting');
        // }
        //cm.get("head_Data").onclick = function aa(){window.open ('Setting/index.html','newwindow','height=400,width=100%,top=0,left=0,toolbar=no,menubar=no,scrollbars=no, resizable=no,location=no, status=no');} 
        cm.get("west_upgrade").onclick = cm.get("head_upgrade").onclick = cm.get("user_m").onclick = cm.showPay;
        cm.get("logout").onclick = cm.logout;
        //资料设置（杰）
        cm.get("head_Data").onclick = function () {
            home.showSetting(cm.get,"1");
        };
        //导航栏下的“头像设置”（杰）
        cm.get("head_Head").onclick = function () {
            home.showSetting(cm.get,"2");
        };
        //左侧导航栏下的“完善头像”（杰）
        cm.get("west_upload").onclick = function () {
            home.showSetting(cm.get,"2");
        };
        //导航栏下的“修改密码”（杰）
        cm.get("head_pass").onclick = function () {
            home.showSetting(cm.get,"3");
        };
        //左侧菜单的“用户头像”（杰）
        cm.get("user_avatar").onclick = function () {
            home.showSetting(cm.get,"2");
        };

        cm.get("head_contact").onclick = function () {
            var service = cm.getService();
            if (cm.getUserGender() == 'male') {
                cm.showChat(service[0]); 
            }else{
                cm.showChat(service[2]);
           }  
        };
        cm.get("user_name").onclick = cm.get("head_space_2").onclick = function () {
            //= cm.get("head_space_1").onclick
            document.getElementById("setting").style.display="none";
            home.showSpace(cm.getUserId());

        };
        cm.get("head_recharge").onclick = cm.get("user_gold").onclick = cm.get("user_gold_icon").onclick = function () {
            cm.showPay({type: "r"});
        }
    };

    var initSpaceNav = function () {
        //删掉主页中的“资料模块”
        // var spaceNavIdArray = ["s_nav_profile", "s_nav_album", "s_nav_about"];
        var spaceNavIdArray = ["s_nav_profile", "s_nav_album"];
        var currentNav = cm.get(spaceNavIdArray[0]);
        for (var i = 0, len = spaceNavIdArray.length; i < len; i++) {
            var id = spaceNavIdArray[i];
            var nav = cm.get(id);
            nav.page = "Space_"+id.replace("s_nav_", "");

            nav.setCurrent = function () {
                currentNav.removeCls("s_nav_focus");
                this.addCls("s_nav_focus");
                currentNav = this;
            };
            nav.onclick = function (z) {
                this.setCurrent();
                home.freshSpace(this.page);
            };
        }
        currentNav.setCurrent();
    };

    var initSearch = function () {
        var lastVal = null;
        var lastResSize = 0;
        var timer4key;
        var time4search;
        var key = cm.get("head_search_key");
        var resultPanel = cm.get("head_search_result");
        var wrapPanel = cm.get("head_search_wrap");

        var createSearchItem = function (o) {
            var item = cm.mk("div");
            var icon = cm.mk("img");
            var name = cm.mk("a");

            item.cls("head_search_item");
            icon.cls("head_search_item_icon");
            name.cls("head_search_item_name");

            name.html(o["username"]);
            icon.setSrc(cm.getImgBySize(o["header"], 80));

            item.onclick = function () {
                wrapPanel.hide();
                home.showSpace(o["id"]);
            };

            item.append(icon);
            item.append(name);

            resultPanel.append(item);
        };

        cm.get("head_search").hover("", function (t) {
            if (t == 1 && lastResSize > 0) {
                clearTimeout(timer4key);
                wrapPanel.show();
            } else {
                timer4key = setTimeout(wrapPanel.hide, 200);
            }
        });

        key.onmouseup = key.onkeyup = function () {
            var newVal = key.val();
            if (cm.trim(newVal) != "" && newVal != lastVal) {
                cm.get("head_search_em").addCls("head_search_loading");
                lastVal = newVal;
                clearTimeout(time4search);
                time4search = setTimeout(function () {
                    cm.ajax("index.php?m=Index&c=User&a=searchLike", {key: newVal, gender: cm.getUserGender()}, function (res) {
                        cm.get("head_search_result").html("");
                        var list = res["data"] || [];
                        var len = lastResSize = list.length;
                        for (var i = 0; i < len; i++) {
                            createSearchItem(list[i]);
                        }
                        wrapPanel[len > 0 ? "show" : "hide"]();
                        cm.get("head_search_em").removeCls("head_search_loading");
                    });
                }, 2000);
            }
        }
    };
    var onSpaceReady = function (p) {
        homePanel.hide();
        spacePanel.show();
        home.freshSpaceUser();
        cm.get("s_nav_" + (p || "profile")).onclick();
    };
    var onSpaceResult = function (msg,p) {
        if (msg["status"] == 'success') {
            /*var albumMap = {
                1: {id: 1, name: cm.i18n("album_1"), list: []},
                2: {id: 2, name: cm.i18n("album_2"), list: []}
            };*/
            var data = msg["data"];
            var photoList = data["photo"];
            var albumList = data["album"];
            var sp = data["base"];
            //sp["albumMap"] = albumMap;
            var albumMap = new Array();
            //灏佽鐩稿唽
            for (var i = 0, len4i = albumList.length; i < len4i; i++) {
                var album = albumList[i];
                album["list"] = [];
                if (album['name'] == 'default_album') {
                    album['name'] = cm.i18n('default_album');
                }
                if (album['name'] == 'header_album') {
                    album['name'] = cm.i18n('header_album');
                }
                albumMap[album["id"]] = album;
            }
            //灏佽鐓х墖
            for (var j = 0, len4j = photoList.length; j < len4j; j++) {
                var photo = photoList[j];
                var a = albumMap[photo["album"]];
                if (a) {
                    a["list"].push(photo);
                }
            }
            sp["albumMap"] = albumMap;
            cm.setSpaceId(sp["id"]);
            cm.setSpaceUser(sp);
            onSpaceReady(p);
        }
    };
    this.initUser = function (user) {
        user = user || cm.getUser();
        cm.get("user_name").html(user["username"]);
        cm.get("user_m").cls("user_m user_m_" + user["level"]);
        cm.get("user_gold").html(user["gold"]);
        cm.get("wall_me_url").setSrc(cm.getImgBySize(user["header"], 80), user['sex']);
        //导航右侧的“头像”
        //cm.get("head_url").setSrc(cm.getImgBySize(user["header"], 40), user['sex']);
        cm.get("user_url").setSrc(cm.getImgBySize(user["header"], 80), user['sex']);
    };
    this.freshInteractive = function () {
        var interact = cm.getInteract();
        interact["encounter"] = parseInt(interact["passive"]) + parseInt(interact["match"]);
        for (var p in interact) {
            var count = interact[p];
            //console.log(p+'='+count);
            var el = cm.get("note_count_" + p);
            if (el) {
                el.html(count);
                el[count > 0 ? "show" : "hide"]();
            }
        }
    };
    this.freshUserStatus = function () {
        var user = cm.getUser();
        cm.get("user_m").cls("user_m user_m_" + user["level"]);
        cm.get("user_gold").html(user["gold"]);
        if (cm.getRole() == 3) {
            cm.logout();                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                
        }
    };
    //头部“主页”的导航栏：打开“主页”
    this.showSpace = function (sid) {
        var spaceUser = cm.getSpaceUser() || {};
        sid = sid || cm.getUserId();
        cm.setSpaceId(sid);
        cm.get("s_icon").html("");
        cm.get("s_name").html("");
        //清空s_ifm（iframe）中的内容
        home.freshSpace("");
        if (spaceUser["id"] != sid) {
            // cm.print("鏂板姞杞斤細" + sid);
            // $.print("新加载：" + sid);
            cm.ajax("index.php?m=Index&c=Space&a=ajax_profile", {id: sid}, onSpaceResult);
        } else {
            // cm.print("鑰佺敤鎴凤細" + sid);
            // $.print("老用户：" + sid);
            onSpaceReady();
        }
    };
    this.freshSpaceUser = function () {
        var img = cm.mk("img");
        var su = cm.getSpaceUser();
        //自己的“主页”，设置“隐身”和“在线”
        var lifeStatus = cm.get("s_life_status");
            //获取元素id（“状态”）
        if (cm.isSelf()) {
            //初始化SS(ss为：状态的值1或2)
            var ss = su["is_online"];
            //判断“状态”是2？是2，则类名=s_life_hide；否则，s_life_true；
            lifeStatus.cls("s_life_" + (ss == 0 ? "hide" : "true"));
            //
            lifeStatus.html(ss == 0 ? "" : "&bull;");
            //鼠标以上去，“展开”下拉菜单
            
            cm.get("s_life").hover("", function (tag) {               
                cm.get("s_life_list")[tag == 1 ? "show" : "hide"]();
            });

            //点击“设置隐身”
            cm.get("s_life_hide").onclick = function() {
                /*cm.ajax("index.php?m=Index&c=Space&a=is_online", {status: 0}, function (res) {
                    if (res["status"] == 'success') {
                        lifeStatus.cls("s_life_" + "hide");
                        lifeStatus.html("");
                    }    
                });*/
                top.sendMsgExternal(cm.getUserId(),'invisble');
              return;
            }
            //点击“设置在线”
            cm.get("s_life_online").onclick = function(){
                /*cm.ajax("index.php?m=Index&c=Space&a=is_online", {status: 1}, function (res) {
                    if (res["status"] == 'success') {
                        lifeStatus.cls("s_life_" + "true");
                        lifeStatus.html("&bull;");
                    }
                });*/
                top.sendMsgExternal(cm.getUserId(),'online');
              return;
            }
        } else {
            lifeStatus.html("&bull;");
            lifeStatus.cls("s_life s_life_" + su["is_online"]);
            cm.get("s_life").hover("", function (tag) {               
                cm.get("s_life_list").hide();
            });
        }
        cm.get("s_icon").html("");
        cm.get("s_icon").append(img);
        cm.get("s_name").html(su["username"]);

        
        cm.get("s_m").cls("s_m s_m_" + su["level"]);

        //cm.get("s_life").cls("s_life s_life_" + su["is_online"]);
        
        // img.setSrc($.getImgBySize(su["icon"], 180), su["gender"]);
        // $.get("s_icon").onclick = $.isSelf() ? $.showAvatar : null;

        img.setSrc(cm.getImgBySize(su["header"], 180), su["sex"]);
        cm.get("s_icon").onclick = cm.isSelf() ? cm.showAvatar : null;
    };
    //头部“首页”的导航栏：打开“首页”
    this.showHome = function (p) {
        if (typeof p != "string") {
            p = "first";
        }
        homePanel.show();
        spacePanel.hide();
        settingPanel.hide();
        cm.goTop();
        //改
        // home.freshIfm("first_index","center_ifm");
        // setTimeout(function(){document.getElementById("center_ifm").contentWindow.document.getElementById("nav1").onclick();},1800);
        //最新动态 （原来）
        home.freshIfm(p + "_index");
        cm.get("nav_" + p).onFocus();    
    };
    //切换“内容区”框架 中 html页面
    this.freshIfm = function () {
        var newUrl = arguments[0];
        var ifmId = arguments[1] || "center_ifm";
        var ifm = cm.get(ifmId);
        if (!cm.isNull(newUrl)) {
            window.onscroll = null;
            cm.bindLocation(newUrl);
            var arr = newUrl.split('_');
            var url = "index.php?m=Index&c="+arr[0]+"&a="+arr[1];
            if (!cm.isEmpty(arr[2])) {
                url += "&id="+arr[2];
            }else{
                url += '&id='+cm.getSpaceUser()['id'];
                //getSpaceUser(){return cache.spaceUser;}
            }
            url = cm.isEmpty(url) ? url : (url);
            ifm.src = url;
            cm.goTop();
        }
        var content = ifm.contentDocument || window.frames[ifmId].document;
        var height = content.body.clientHeight;
        ifm.style.height = height + "px";
    };
    this.freshHome = function (url) {
        this.freshIfm(url, "center_ifm");
    };
    this.freshSpace = function (url) {
        this.freshIfm(url, "s_ifm");
    };

    //头部“设置setting”的导航栏：打开“设置setting”(杰)
    this.showSetting = function (p,n) {
        homePanel.hide();
        spacePanel.hide();
        navSET(n);
        function navSET(n){
            //先找到这些导航“id”
            var ids=["setli_1","setli_2","setli_3"];
            for (var i = ids.length - 1; i >= 0; i--) {
                var divID = ids[i]+"Date";
                document.getElementById(ids[i]).className = "";
                document.getElementById(divID).style.display = "none";
            };

         //如果点击“1”，“1”添加一个类名，同时，关联的“id”显示
            var i = n-1;
            var id = ids[i];
            var t = document.getElementById(id);
            t.className = "focusli";
            t.click();
        //alert("n="+n);
        }
        settingPanel.show();
        cm.goTop();
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
    device_detect();
    initHomeNav();
    initSpaceNav();
    initShortBar();
    initSearch();
    loadConfig();
})();

