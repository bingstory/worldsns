// JavaScript Document
var chat = null;
function replaceAll(str,s1,s2) {
    while( str.indexOf(s1) != -1 ) {
        str = str.replace(s1,s2); 
    } 
    return str;
}
(function () {
    var self = this;
    chat = this; 
    var cm = new top.common(document);
    var faceUtil = new top.Gwx.Face(document);
    var contactMap = {};
    var strangerMap = {};//陌生人信息 ID->消息数组
    var contactIdList = [];
    var fSocket;
    var heartTimer;
    var hasInit = 0;
    var user = null;
    var ws = {};
    var imgUrl = null;
    var chatServer = null;
    var curContact = null;
    var curItem = null;
    var closeImg = null;
    var internal4count = null;
    var humanLang = ["0-2", "0-11", "0-4", "0-5"];
    var contentPanel = cm.get("chat_content");

    var ring = function () {
    };

    var getUrl = function () {
        user = cm.getUser();
        uid=user['id'];
        chatServer = "ws://211.149.192.145:2345/?uid="+uid;
        return chatServer;
    };

    var init = function () {
        user = cm.getUser();
        if (user != null) {
            freshSocket();
            initSearch();
            initInput();
            initEmotion();
            initChatEvent();
            initTrans();
            initCamera();
            initRing();
            cm.get("chat_history_wrap").onclick = loadHistory;
            top.sendMsgExternal = function (fid, txt) {
                if (txt == 'logout') {
                   doReq(6,fid);
                }else if (txt == 'invisble') {
                    doReq(7,fid,0);
                }else if (txt == 'online') {
                    doReq(7,fid,1);
                }else{
                    doReq(101, fid, txt);
                }
            }
        } else {
            setTimeout(init, 100);
        }
    };


    var initCamera = function () {
        if (cm.getUser()["role"] != 3) {//静默用户
            var viewer = cm.get("chat_camera_viewer");
            var wrp = cm.get("chat_camera_photo");
            var close = cm.get("chat_camera_close");

            var photoHandler = function (type, msg) {
                if (type == 0) {
                    closeImg();
                    viewer.show();
                } else if (type == 1) {
                    imgUrl = msg["url"];
                    var img = cm.mk("img");
                    img.src = imgUrl;
                    wrp.append(img);
                    close.show();
                    close.onclick = closeImg;
                }
            };
            var config = {
                width: 40,
                height: 36,
                render: "camera_object",
                handler: photoHandler,
                //type: "flash",
                extraArgs: "token=" + cm.getToken(),
                action: "index.php?m=Index&c=Upload&a=upload&dir=chat"
            };
            new Gwx.PhotoUploader(config);

            closeImg = function () {
                imgUrl = null;
                wrp.html("");
                close.hide();
                viewer.hide();
            };
        }
    };

    var initRing = function () {
        try {
            var elem;
            if (!cm.isH5()) {
                elem = cm.mk("bgsound");
                cm.get(document.body).append(elem);
                ring = function () {
                    elem.src = "Public/Index/Images/ring.mp3";
                }
            } else {
                var mp3 = cm.mk("source");
                var ogg = cm.mk("source");
                mp3.src = "Public/Index/Images/ring.mp3";
                ogg.src = "Public/Index/Images/ring.ogg";
                elem = cm.mk("audio");
                elem.append(mp3);
                elem.append(ogg);
                ring = function () {
                    try {
                        if (elem.paused) {
                            elem.play();
                        } else {
                            elem.onpause = function () {
                                elem.play();
                                elem.onpause = null;
                            };
                        }
                    } catch (e) {
                    }
                }
            }
        } catch (e) {
        }
    };
    //初始化高度
    var initHeight = function () {
        var otherEvent = window.onresize;
        var doHeight = function () {
            var winH = document.documentElement.clientHeight;
            winH = Math.max(winH, 300);
            cm.get("chat_empty").style.height = winH + "px";
            cm.get("chat_panel").style.height = (winH - 80) + "px";
            cm.get("chat_list").style.height = (winH - 120) + "px";
            cm.get("chat_main").style.height = (winH - 266) + "px";
            if (otherEvent) {
                otherEvent();
            }
        };

        window.onresize = doHeight;
        doHeight();
    };
    var initEmotion = function () {
            var curEmotion = null;
            var viewer = cm.get("chat_emotion_viewer");
            var board = cm.get("chat_emotion_board");
            var bar = cm.get("chat_emotion_ts");
            var stickerList = [{capacity: 18, des: "DADA", dir: "./Public/Index/Images/dada/", name: "DADA"}].concat(cm.getSticker());
            var timerEmotion = null;
            cm.get("chat_emotion").hover("", function (s) {
                if (s) {
                    clearTimeout(timerEmotion);
                    viewer.show();
                } else {
                    timerEmotion = setTimeout(viewer.hide, 100);
                }
            });
            var initDirection = function () {
                var ts = cm.get("chat_emotion_ts");
                var tc = cm.get("chat_emotion_tc");
                var timer = null;
                var scrollAnimate = function () {
                    var hz = this.direction * 10;
                    var sw = ts.scrollWidth;
                    var cw = tc.clientWidth;
                    var ml = parseInt(ts.style.marginLeft) || 0;
                    var dis = hz > 0 ? Math.min(cw, -ml) : Math.max(-cw, cw - sw - ml);
                    var num = parseInt(dis / hz);
                    var fn = function () {
                        setTimeout(function () {
                            if (--num > -1) {
                                fn();
                                ts.style.marginLeft = hz + (parseInt(ts.style.marginLeft) || 0) + "px";
                            } else {
                                ts.style.marginLeft = ml + dis + "px";
                            }
                        }, 10);
                    };
                    fn();
                };

                cm.get("chat_emotion_tl").show("inline-block");
                cm.get("chat_emotion_tr").show("inline-block");
                cm.get("chat_emotion_tl").direction = 1;
                cm.get("chat_emotion_tr").direction = -1;
                cm.get("chat_emotion_tl").onclick = cm.get("chat_emotion_tr").onclick = scrollAnimate;
            };
            var showSticker = function (s) {
                if (s["dir"]) {
                    var dir = s["dir"];
                    var size = s["capacity"];
                    for (var i = 1, len = s["capacity"]; i < len; i++) {
                        var img = cm.mk("img");
                        img.index = i;
                        img.cls("chat_emotion_sticker_item");
                        img.src = dir + "face" + i + ".gif";
                        img.onclick = function () {
                            imgUrl = dir + "face" + this.index + ".gif";
                            doReq(1,'sticker');
                            viewer.hide();
                        };
                        board.append(img);
                    }
                }else if (s['detail']){
                    for (var p in s['detail']) {
                        var img = cm.mk("img");
                        img.index = p;
                        img.cls("chat_emotion_sticker_item");
                        img.src = s['detail'][p]['detail_img'];
                        img.onclick = function () {
                            imgUrl = s['detail'][this.index]['detail_img'];
                            doReq(1,'sticker');
                            viewer.hide();
                        };
                        board.append(img);
                    }
                }
            };
            var showFace = function () {
                faceUtil.bind(board, function (val) {
                    var ta = cm.get("chat_input");
                    ta.focus();
                    ta.val(ta.value + "[" + val + "]");
                });
            };
            var createThumb = function (s) {
                var a = cm.mk("a");
                var img = cm.mk("img");
                    img.style.width = '20px';
                if (s['detail'] && s['detail'] != '') {
                    img.src = s['detail'][0]['detail_img'];
                }else if (s['dir']) {
                    img.src = s['dir']+'face1.gif';
                }else{
                    img.src = './Public/Index/Images/faces/face1.gif';
                }
                a.cls("chat_emotion_ta");

                a.onclick = function () {
                    board.html("");
                    if (s["dir"] || s['detail']) {
                        showSticker(s);
                    } else {
                        showFace();
                    }

                    if (curEmotion) {
                        curEmotion.removeCls("chat_emotion_tf");
                    }
                    curEmotion = this;
                    curEmotion.addCls("chat_emotion_tf");
                };
                a.append(img);
                bar.append(a);
                if (curEmotion == null) {
                    a.onclick();
                }
            };

            createThumb({});//创建QQ表情
            for (var i = 0, len = stickerList.length; i < len; i++) {
                var ss = stickerList[i];
                if (ss) {
                    createThumb(ss);
                } else {
                    cm.print("null:" + i)
                }
            }
            cm.get("chat_emotion_tp").onclick = cm.showSticker;//表情贴商店按钮事件
            if (stickerList.length > 9) {//超过9个就显示方向键
                initDirection();
            }
        }
        ;

    //初始化切换连天对话框显示，隐藏功能
    var initChatEvent = function () {
        var head_chat = cm.get("head_chat");
        var chat_show = cm.get("chat_show");
        var short_chat = cm.get("short_chat");
        var chat_close = cm.get("chat_close");
        head_chat.onclick = short_chat.onclick = chat_close.onclick = function () {
            setDisplay(!chat_show.isVisible());
        };
        chat_show.onclick = function (e) {
            e = e || window.event;
            if (/chat_(outer|mask)/g.test((e.srcElement || e.target).className)) {
                setDisplay(false);
            }
        };
    };
    //初始化输入框和发送按钮
    var initInput = function () {
        var input = cm.get("chat_input");
        var cutTxt = function () {
            var v = input.val();
            if (v.length > 300) {
                input.val(v.substr(0, 300));
                input.focus();
            }
        };
        input.onkeydown = function (e) {
            e = e || window.event;
            if (e.keyCode == 13) {
                doReq();
                return false;
            } else {
                cutTxt();
            }
        };
        setInterval(cutTxt, 10);
        cm.get("chat_send").onclick = doReq;
    };
    //初始化翻译功能
    var initTrans = function () {
        var sel = cm.get("chat_trans_select");
        var langList = cm.getLangList();
        var codeList = cm.getCodeList();
        var gog = cm.mk("OPTGROUP");
        var hog = cm.mk("OPTGROUP");
        var name = cm.get(new Option());

        name.html(cm.i18n("trans_service"));
        name.val(-1);
        sel.append(name);

        //gog.label = "Google";
        //hog.label = cm.i18n("trans_human");
        //sel.append(gog);
        //sel.append(hog);

        for (var i = 0, len = langList.length; i < len; i++) {
            var og = cm.get(new Option());
            og.val(codeList[i]);
            og.html(langList[i]);
            og.onclick = function () {
                /*if (cm.getMemberShip() < 2 && cm.getUserGold() <= 0) {
                    alert(cm.i18n("need_recharge"));
                }*/
                if (cm.getMemberShip() < 2 && !cm.isInMember()) {
                    alert(cm.i18n("trans tip"));
                } 
            }
            sel.append(og);
        }
        /*for (i = 0, len = humanLang.length; i < len; i++) {
            var lanArray = humanLang[i].split("-");
            var l1 = lanArray[0];
            var l2 = lanArray[1];
            var oh = cm.get(new Option());
            oh.val(codeList[l1] + "," + codeList[l2]);
            oh.html(langList[l1] + " - " + langList[l2]);
            hog.append(oh);
        }*/
    };
    //搜索聊天对象列表
    var initSearch = function () {
        var outer = cm.get("chat_so");
        var list = cm.get("chat_so_list");
        var key = cm.get("chat_so_key");

        var addItem = function (f) {
            var item = cm.mk("div");
            item.cls("chat_so_item");
            item.html(f["username"]);
            item.onclick = function (e) {
                list.hide();
                list.scrollTop = 0;
                cm.get("chat_list").scrollTop = f.setFocus(e) - 160;//移动到滚动条
            };
            list.append(item);
        };

        var so = function () {
            var val = key.val();
            list.html("");
            if (val != "") {
                var index = 0;
                val = val.toLowerCase();
                for (var i = 0, len = contactIdList.length; i < len; i++) {
                    var f = contactMap[contactIdList[i]];
                    if (f["username"].toLowerCase().indexOf(val) > -1) {
                        addItem(f);
                        if (++index > 11)break;
                    }
                }
            }
            list[index > 0 ? "show" : "hide"]();
        };
        key.onkeyup = key.onclick = so;
        cm.get("chat_so").hover("", function (s) {
            list[(s == 1 && list.childNodes.length > 0) ? "show" : "hide"]();
        })
    };
    var loadFlashSocket = function () {
        if (!fSocket) {
            window.FSocket = {};
            var loadSwfJs = function () {
                var script = cm.mk("script");
                script.src = "/Public/Index/Js/swfobject.js?" + Math.random();
                cm.get(document.body).append(script);
            };
            var loadSwf = function () {
                if (window.swfobject) {
                    var fSocketDiv = cm.mk("div");
                    fSocketDiv.id = "fSocketDiv";
                    cm.get(document.body).append(fSocketDiv);
                    swfobject.embedSWF("/Public/Index/Js/FSocket.swf?" + Math.random(), "fSocketDiv", "1", "1", "10.0.0",
                        null, null, {hasPriority: true, allowScriptAccess: "always"});
                } else {
                    setTimeout(loadSwf, 100);
                }
            };
            loadSwfJs();
            loadSwf();
        } else {
            fSocket["connect"](getUrl());
        }

        FSocket.onFlashLoad = function (e) {
            fSocket = window["fSocketDiv"];
            fSocket["setDebug"](true);
            fSocket["connect"](getUrl());
            ws.send = function (msg) {
                fSocket.sendText(encodeURIComponent(msg));
            };
        };
        FSocket.onOpen = function () {
            ws.readyState = 1;
            doOpen();
        };
        FSocket.onClose = function (e) {
            ws.readyState = 3;
            doClose();
        };
        FSocket.onError = function (msg) {
            msg = decodeURIComponent(msg);
            cm.print("onError..................." + msg);
            msg = cm.str2json(msg);
            if (msg["type"] == 2) {
                fSocket["connect"](getUrl());
            }
        };
        FSocket.onMessage = function (txt) {
            doAck({data: decodeURIComponent(txt)});
        };
        FSocket.debug = function (e) {
            cm.print("flash:" + decodeURIComponent(e));
        };
    };
    var freshSocket = function () {
        var bindEvent = function () {
            ws.onclose = doClose;
            ws.onopen = doOpen;
            ws.onmessage = doAck;
        };
        if ('WebSocket' in window) {
            ws = new WebSocket(getUrl());
            bindEvent();
        } else if ('MozWebSocket' in window) {
            ws = new window["MozWebSocket"](getUrl());
            bindEvent();
        } else {
            loadFlashSocket();
        }
    };
    var doOpen = function (event) {
        console.log('链接成功');
        hasInit = 0;
        doHeart();
    };
    var doHeart = function () {
        doReq(100);
        heartTimer = setTimeout(doHeart, 3000);
    };
    var doClose = function (event) {
        setTimeout(freshSocket, 1000);
        if (heartTimer != null) {
            clearTimeout(heartTimer);
            heartTimer = null;
        }
    };

    var doAck = function (event) {
        var rawRes = event.data;
        var res = cm.str2json(rawRes);
        var desArray = ["建立链接", "普通消息", "翻译信息", "历史记录", "在线状态", "陌生人信息", "移除联系人"];
        if (res && res.status == 'success') {
            var opt = res.opt;
            var des;
            switch (opt) {
                case 0:
                    des = "建立链接";
                    if (hasInit == 0) {
                        hasInit = 1;
                        des = "建立链接+加载联系人";
                        ackContact(res["contact"]);
                        cm.print("联系人" + res["contact"].length)
                    }
                    ackMsg(res["msg"]);
                    break;
                case 1:
                    //alert('doack');
                    des = "普通消息";
                    ackMsg([res["msg"]]);
                    break;
                case 2:
                    des = "翻译信息";
                    var item = cm.get(res["data"]["id"]);
                    if (item) {
                        item.paintTrans(res["data"]["transResult"]);
                    }
                    break;
                case 3:
                    des = "历史记录";
                    ackMsg(res["data"], true);
                    break;
                case 4:
                    des = "在线状态";
                    ackLife(res["data"]);
                    break;
                case 5:
                    des = "陌生人信息";
                    ackStranger(res["data"]);
                    break;
                case 6:
                    des = "移除联系人";
                    ackRemove(res["data"]);
                    break;
                case 7:
                    des = '金币不足';
                    alert(cm.i18n('need_recharge'));
                    cm.showPay({type: "r"});
                    break;
                case 8:
                    des = '需要升级';
                    alert(cm.i18n('need_upgrade'));
                    cm.showPay({type: "u"});
                    break;
                case 100:
                    //user["role"] = res["role"];
                    user["gold"] = res['user']["gold"];
                    user["level"] = res['user']["level"];
                    user["chat_state"] = res['user']["chat_state"];
                    cm.setInteract(res["interact"]);
                    cm.doHome("freshUserStatus");
                    cm.doHome("freshInteractive");
                    break;
                default :
                    break;
            }
               //cm.print("接收 (" + opt + " : " + (desArray[opt] || "心跳") + ") >>>> " + rawRes);
        } else {
            var text = cm.mk("div");
            text.html(rawRes);
            text.innerText = (rawRes);
            cm.get('chat_content').append(text);
        }
    };
    //删除联系人
    var ackRemove = function (cId) {
        for (var i = 0, len = contactIdList.length; i < len; i++) {
            if (contactIdList[i] == cId) {
                contactIdList.splice(i, 1);//删除联系人索引
                break;
            }
        }
        if (curContact && cId == curContact["user_id"]) {
            beLeave();
        }
        contactMap[cId].beRemove();
        delete strangerMap[cId];//删除陌生人对象
        delete  contactMap[cId];//删除联系人对象
    };
    /**
     * 封装陌生人信息
     */
    var ackStranger = function (s) {
        var sid = s["user_id"];
        var msgArr = strangerMap[sid];//取出缓存消息
        delete strangerMap[sid];//删除该好友缓存

        if (!contactMap.hasOwnProperty(sid)) {
            s["count"] = 0;
            s["list"] = [];
            contactIdList.push(sid);//保存好友id
            contactMap[sid] = s;//保存好友对象
            createContact(s);//添加到好友列表里面
            s.beFirst();
            ackMsg(msgArr);//封装好友未处理的消息
        }
    };
    var ackLife = function (data) {
        var contactUser = contactMap[data["id"]];
        cm.print(data["username"] + (data["is_online"] == 1  ? "上线" : "下线"));
        //刷新联系人列表
        if (contactUser) {
            contactMap[data["id"]]["is_online"] = data["is_online"];
            var list = [];
            for(var item in contactMap){
                list.push(contactMap[item]);
            }
            ackContact(list);
        }
        /*if (contactUser) {
            data["is_online"];
            contactUser["is_online"] = data["is_online"];
            contactUser.freshLife();
        }*/
        //刷新空间在线状态
        var lifeStatus = cm.get("s_life_status");
        if (data["id"] == cm.getSpaceId()) {
            if (data["id"] == cm.getUserId()) {
                lifeStatus.cls("s_life_" + (data["is_online"] == 0 ? "hide" : "true"));
                lifeStatus.html(data["is_online"] == 0 ? "" : "&bull;");
            }else{
                lifeStatus.cls("s_life_" + (data["is_online"] == 0 ? "" : "true"));
                lifeStatus.html("&bull;");
            }
            var spaceUser = cm.getSpaceUser();
            spaceUser['is_online'] = data["is_online"]
            cm.setSpaceUser(spaceUser);
        }
        //定义innerHTML
        var set_innerHTML = function (el, htmlCode){
            var ua = navigator.userAgent.toLowerCase();
            if (ua.indexOf('msie') >= 0 && ua.indexOf('opera') < 0)
            {htmlCode = '<div style="display:none">for IE</div>' + htmlCode;
             htmlCode = htmlCode.replace(/<script([^>]*)>/gi,'<script$1 defer="true">');
             el.innerHTML = htmlCode;
             el.removeChild(el.firstChild);
            }
            else
            {var el_next = el.nextSibling;
             var el_parent = el.parentNode;
             el_parent.removeChild(el);
             el.innerHTML = htmlCode;
             if (el_next)
              el_parent.insertBefore(el, el_next)
             else
              el_parent.appendChild(el);
            }
        }

        //刷新推荐列表
        var recommendPanel = '';
        if(document.all){
            recommendPanel = window.document.frames['center_ifm'].document.getElementById('panel1');
        }else{
            recommendPanel = cm.get('center_ifm').contentWindow.document.getElementById('panel1');
        }
        if (recommendPanel && data["id"] != cm.getUserId()) {
            var recommendMap = cm.getRecommend();
            if (recommendMap &&　recommendMap[data["id"]]) {
                set_innerHTML(recommendPanel,'');
                //recommendPanel.innerHTMl = '';
                recommendMap[data["id"]]['is_online'] = data["is_online"];
                var list = [];
                for(var item in recommendMap){
                    list.push(recommendMap[item]);
                }
                for (var i = 0; i < list.length-1 ; i++) {
                    for (var j = i + 1; j < list.length ; j++) {
                        if (list[i]['created'] < list[j]['created']) {
                            var temp = list[i];
                            list[i] = list[j];
                            list[j] = temp;
                        }
                    }
                }
                for (var i = 0; i < list.length-1 ; i++) {
                    for (var j = i + 1; j < list.length ; j++) {
                        if (list[i]['header'] < list[j]['header']) {
                            var temp = list[i];
                            list[i] = list[j];
                            list[j] = temp;
                        }
                    }
                }
                for (var i = 0; i < list.length-1 ; i++) {
                    for (var j = i + 1; j < list.length ; j++) {
                        if (list[i]['is_online'] < list[j]['is_online']) {
                            var temp = list[i];
                            list[i] = list[j];
                            list[j] = temp;
                        }
                    }
                }
                for (var i = 0; i < list.length ; i++) {
                    recommendPanel.appendChild(createRItem(list[i]));
                }
            }
        }
        if(document.all){
            var user_online = window.document.frames['center_ifm'].document.getElementById('r_life_'+data["id"]);
            var item_online = window.document.frames['center_ifm'].document.getElementById('item_life_'+data["id"]);
        }else{
            var user_online = cm.get('center_ifm').contentWindow.document.getElementById('r_life_'+data["id"]);
            var item_online = cm.get('center_ifm').contentWindow.document.getElementById('item_life_'+data["id"]);
        }
        if (user_online) {
            user_online.cls("r_life r_life_" + data["is_online"]);
        }
        if (item_online) {
            item_online.cls("item_life" + (data["is_online"] == 1 ? " item_life_active" : ""));
        }
    };
    var createRItem = function (member) {
        var item = cm.mk("div");
        var img = cm.mk("img");
        var prof = cm.mk("dl");
        var pos = cm.mk("dl");
        var mood = cm.mk("div");
        var bar = cm.mk("dl");

        var cImg = function () {
            img.onload = function () {
                cm.doHome("freshHome");
            };
            img.setSrc(cm.getImgBySize(member["header"], 180));
            item.append(img);
        };

        var cProf = function () {
            var life = cm.mk("dd");
            var name = cm.mk("dd");
            var m = cm.mk("dd");

            prof.cls("r_prof");
            life.cls("r_life r_life_" + member["is_online"]);
            life.id = 'r_life_'+member["id"];

            name.cls("r_name");
            if(member['inner_member']) {
                m.cls("r_m r_m_0");
            }else{
                m.cls("r_m r_m_" + member["level"]);
            }

            life.html("&bull;");
            name.html(member["username"]);

            prof.append(life);
            prof.append(name);
            prof.append(m);
            item.append(prof);
        };

        var cPos = function () {
            //初始化“性别”
            var sex = cm.mk("dd");
            var age = cm.mk("dd");
            var country = cm.mk("dd");
            pos.cls("r_pos");
            sex.cls("r_pos_age");//增加“性别”的classname
            age.cls("r_pos_age");
            country.cls("r_pos_country");
            var dateObj = new Date();
            var year = dateObj.getFullYear();
            age.html( year - member["year"]);
            country.html(member["country"] || member["city"]);
            //alert(cm.i18n(member["sex"]));
            sex.html(cm.i18n('gender')[member["sex"]]);
            pos.append(sex);//在html中显示“性别”
            pos.append(age);
            pos.append(country);
            item.append(pos);
        };

        var cMood = function () {
            mood.cls("r_mood");
            mood.title = member["mood"];
            mood.html(member["mood"]);
            item.append(mood);
        };

        var cBar = function () {
            var chat = cm.mk("dd");
            var like = cm.mk("dd");
            var favor = cm.mk("dd");

            bar.cls("r_bar");
            chat.cls("r_btn r_chat");
            like.cls("r_btn r_like");
            favor.cls("r_btn r_favor");

            chat.onclick = function () {
                cm.showChat(member);
            };
            favor.onclick = function () {
                cm.ajax("index.php?m=Index&c=First&a=favor", {favorId: member["id"]}, function (res) {
                    if (res["status"] == 'success') {
                        alert("ok");
                    } else {
                        alert("error");
                    }
                });
            };

            like.onclick = function () {
                cm.ajax("index.php?m=Index&c=First&a=like", {likeId: member["id"]}, function (res) {
                    if (res["status"] == 'success') {
                        alert("ok");
                    } else {
                        alert("error");
                    }
                });
            };
            bar.append(favor);
            bar.append(like);
            bar.append(chat);

            item.append(bar);
        };
        //设置classname为"r_item"
        item.cls("r_item");
        img.onclick = prof.onclick = pos.onclick = mood.onclick = function () {
            cm.doHome("showSpace", member["id"]);
        };

        cImg();
        cProf();
        cPos();
        cMood();
        cBar();
        return item;
    };
    var ackContact = function (list) {
        //排序联系人
        var len = list.length;
        for (var j = 0; j < len; j++) {
            for (var m = j + 1; m < len; m++) {
                var c1 = list[j];
                var c2 = list[m];
                /*if (new Date(c1["created"]) < new Date(c2["created"])) {*/
                if (c1["created"] < c2["created"]) {
                    list[j] = c2;
                    list[m] = c1;
                }
            }
        }
        for (var j = 0; j < len; j++) {
            for (var m = j + 1; m < len; m++) {
                var c1 = list[j];
                var c2 = list[m];
                /*if (new Date(c1["created"]) < new Date(c2["created"])) {*/
                if (c1["is_online"] < c2["is_online"]) {
                    list[j] = c2;
                    list[m] = c1;
                }
            }
        }
        cm.get('chat_list').html('');
        for (var i = 0; i < len; i++) {
            var c = list[i];
            var cId = c["user_id"];
            if (!contactMap[cId]) {
                contactIdList.push(cId);
                contactMap[cId] = c;
            }
            createContact(c);
        }
    };
    //重复消息检测
    var isRepeatMsg = function (contact, msg) {
        var newMsgId = msg["id"];
        var l = contact["list"];

        for (var i = 0, len = l.length; i < len; i++) {
            if (l[i]["id"] == newMsgId) {
                cm.print("重复消息:" + msg["content"]);
                return true;
            }
        }
        return false;
    };
    //显示消息列表
    var ackMsg = function (list, isHistory) {
        if (!list) {
            return;
        }
        var noticeRing = false;
        var markId = null;
        var newStrangerArr = [];
        var curContactId = curContact ? curContact["user_id"] : null;

        if (isHistory && list.length < 9) {
            setHistoryBtn(true);
            curContact["dump"] = true;
        }

        for (var i = 0, len = list.length; i < len; i++) {
            var msg = list[i];
            var fid = decodeFid(msg);
            var contact = contactMap[fid];
            if (contact) {//判断联系人是否存在
                /*var repeatState = 0;
                for (var k = 0 ; k < contact.list.length ; k++) {
                    if ((contact.list[k].id == list[i].id - 1)  && (contact.list[k].content == list[i].content)) {
                        repeatState = 1;
                        break;
                    }
                }
                if (repeatState == 1) {
                    cm.print('重复消息');
                    continue;
                }*/
                if (isRepeatMsg(contact, msg)) {//消息重复
                    continue;
                }
                if (fid == curContactId) {//是否是正在聊天的用户
                    createMsg(msg, isHistory);
                    if (!isHistory) {
                        if (msg["sender_id"] == fid) {
                            markId = fid;//标记消息已读
                        }
                        goBottom();//滚动到底部
                    }
                } else if (msg["sender_id"] == fid && !isHistory) {//添加提醒
                    contact["count"]++;
                    noticeRing = true;
                }
                if (isHistory) {//缓存消息
                    contact["list"].unshift(msg);
                } else {
                    contact["content"] = msg["content"];
                    contact["list"].push(msg);//缓存消息
                    contact["created"] = msg['created'];
                    var list = [];
                    for(var item in contactMap){
                        list.push(contactMap[item]);
                    }
                    ackContact(list);
                    //contact.beFirst();
                }
            } else {
                var stranger = strangerMap[fid];
                if (!stranger) {
                    stranger = [];
                }
                stranger.push(msg);
                strangerMap[fid] = stranger;
                newStrangerArr.push(fid);
            }
        }
        if (markId) {//通知服务器，消息已读
            doReq(0);
            cm.print("+++++++++++++++---" + markId);
        }
        for (var j = 0, len4j = newStrangerArr.length; j < len4j; j++) {//查询联系人信息
            doReq(4, newStrangerArr[j]);
        }
        freshAllCount();
        if (noticeRing) {
            ring();
        }
    };
    var clone = function (o) {
        var n = {};
        for (var p in o) {
            n[p] = o[p];
        }
        return n;
    };
    var doReq = function () {
        var desArray = ["标记已读", "发送消息", "翻译信息", "历史记录", "陌生人信息", "移除联系人"];
        if (ws.readyState == 1) {
            var opt = arguments[0];
            opt = isNaN(opt) ? 1 : opt;
            var req = {};
            if (opt == 0) {//标记已读某联系人消息
                req["address"] = curContact["user_id"];
            } else if (opt == 1) {//发送消息、表情贴
                //alert('opt=1');
                var txt = arguments[1];
                if (txt == 'sticker') {
                    msgType = txt;
                    req["type"] = txt;
                }else{
                    msgType = 0;
                    req["type"] = 0;
                }
                req["address"] = curContact["user_id"];
                //alert('curContact='+req["address"]);

                if (msgType == 0) {//normal msg
                    var msgTxt = cm.get("chat_input").val();
                    msgTxt = cm.trim(msgTxt);
                    if (msgTxt.length > 300) {
                        alert("< 300 words");
                        req = null;
                        return false;
                    } else if (!cm.isNull(msgTxt) || imgUrl != null) {
                        var transType = getTransType();
                        req["transType"] = transType;
                        if (transType > -1) {
                            var money = msgTxt.length * 0.01;
                            if (cm.getMemberShip() < 2 && cm.getUserGold() <= money && !cm.isInMember()) {
                                alert(cm.i18n("need_recharge"));
                                cm.showPay({type: "r"});
                                return false;
                            }
                            var ls = cm.get("chat_trans_select").val().split(",");
                            if (ls.length == 2) {
                                req["sl"] = ls[0] || "";
                                req["tl"] = ls[1] || "";
                            } else {
                                req["tl"] = ls[0] || "";
                            }
                        } else {
                            delete req["transType"];
                        }
                        if (imgUrl != null) {
                            req["url"] = imgUrl;
                            closeImg();
                        }
                        req["txt"] = replaceAll(msgTxt,'?','？');
                        req["txt"] = replaceAll(req["txt"],',','，');
                        req["txt"] = replaceAll(req["txt"],"'","’");
                        cm.get("chat_input").val("");//clear input
                    } else {
                        req = null;
                    }
                } else {
                    /*req["txt"] = replaceAll(msgTxt,'?','？');
                    req["txt"] = replaceAll(req["txt"],',','，');
                    req["txt"] = replaceAll(req["txt"],"'","’");
                    req["txt"] = msgTxt.serialize();*/
                    req["url"] = imgUrl;
                    imgUrl = null;
                }
            } else if (opt == 2) {//历史记录翻译
                req = clone(arguments[1]);
                var money = req['content'].length * 0.01;
                if (cm.getMemberShip() < 2 && cm.getUserGold() <= money && !cm.isInMember()) {
                    alert(cm.i18n("need_recharge"));
                    cm.showPay({type: "r"});
                    return false;
                }
                delete req["time"];
                delete req["stop"];
            } else if (opt == 3) {//历史记录查询
                req = arguments[1];
            } else if (opt == 4) {//陌生人查询
                req["address"] = arguments[1];
            } else if (opt == 5) {//删除联系人
                req["address"] = arguments[1];
            } else if (opt == 6) {//退出登录
                req["address"] = arguments[1];
            }else if  (opt == 7) {
                req["address"] = arguments[1];
                req["status"] = arguments[2];
            } else if (opt == 100) {//心跳
                
            } else if (opt == 101) {//外部js调用
                opt = 1;
                req["type"] = 0;
                req["address"] = arguments[1];
                req["txt"] = replaceAll(arguments[2],'?','？');
                req["txt"] = replaceAll(req["txt"],',','，');
                req["txt"] = replaceAll(req["txt"],"'","’");
                cm.print("外部js调用")
            }
            if (opt == 1 && cm.getUser()['chat_state'] == 0) {
                alert(cm.i18n('be banned'));
                return false;
            }
            if (req) {//判断请求是否合法
                req["opt"] = opt;
                if (opt == 100) {
                    if (hasInit == 0) {
                        req["hasInit"] = 'no';
                    }
                    //cm.print("发送 (" + opt + " : 心跳 ) >>>> " + req);
                } else {
                    //cm.print("发送 (" + opt + " : " + desArray[opt] + ") >>>> " + req);
                }
                req["uid"] = cm.getUser()['id'];
                req = cm.json2str(req);
                ws.send(req);
            }
        }
    };
    //历史消息记录显示
    var setHistoryBtn = function (isDump) {
        if (!isDump) {
            cm.get("chat_history_wrap").show();
        } else {
            cm.get("chat_history_wrap").hide();
        }
    };
    //加载历史消息
    var loadHistory = function () {
        var m = curContact["list"][0];
        var arg = {address: curContact["user_id"]};
        if (m) {
            arg["created"] = m["created"];
        }
        doReq(3, arg);
    };
    var loadMsg = function () {
        var c = curContact;
        var list = c["list"];
        contentPanel.html("");
        setHistoryBtn(c["dump"]);
        for (var i = 0, len = list.length; i < len; i++) {
            var msg = list[i];
            createMsg(msg);
        }
        if (c["count"] > 0) {//通知服务器该联系人消息已读
            doReq(0);
            c["count"] = 0;
        }
        freshAllCount();
    };


    var createTransPop = function (render, msg) {
        var row;
        var table = cm.mk("table");
        var langList = cm.getLangList();
        var codeList = cm.getCodeList();
        table.cls("chat_msg_lang");

        var paintGoogleTable = function () {
            for (var i = 0; i < 12; i++) {
                if (i % 4 == 0) {
                    row = table.insertRow(i / 4);
                }
                var td = cm.get(row.insertCell(i % 4));
                var a = cm.mk("a");
                a.cls("chat_msg_lang_item");
                a.html(langList[i]);
                a.code = codeList[i];
                a.onclick = function () {
                    msg["opt"] = 2;
                    msg["transType"] = 1;
                    msg["tl"] = this.code;
                    doReq(2, msg);
                };
                td.append(a);
            }
        };

        var paintHumanTable = function () {

            for (var i = 0, len = humanLang.length; i < len; i++) {
                if (i % 2 == 0) {
                    row = table.insertRow();
                }
                var arr = humanLang[i].split("-");
                var td = cm.get(row.insertCell(0));
                var a = cm.mk("a");
                a.cls("chat_msg_lang_item");
                a.sl = codeList[arr[0]];
                a.tl = codeList[arr[1]];

                a.html(langList[arr[0]] + " - " + langList[arr[1]]);
                a.onclick = function () {
                    msg["opt"] = 3;
                    msg["transType"] = 2;
                    msg["tl"] = this.tl;
                    msg["sl"] = this.sl;
                    doReq(2, msg);
                };
                td.append(a);
            }
        };

        render.append(table);

        var timer = null;
        var dis = 100;
        if (render["transType"] == 2) {
            dis = 70;
            paintHumanTable();
        } else {
            paintGoogleTable();
        }

        render.toggle = function (s) {
            // $.print("翻译类型：" + $.get("chat_trans_type").val());
            if (s) {
                clearTimeout(timer);
                table.show();
                table.style.marginLeft = -(table.clientWidth / 2) + "px";
                table.style.marginTop = -(dis + cm.get("chat_main").scrollTop) + "px";
            } else {
                timer = setTimeout(table.hide, 30);
            }
        };
    };
    //生成消息
    var createMsg = function (msg, isHistory) {
        var item = cm.mk("div");
        var avatar = cm.mk("img");
        var txt = cm.mk("span");
        var txtSource = cm.mk("div");
        var transBtn = null;
        var time = cm.mk("span");
        var isMe = msg["sender_id"] == user["id"];
        var strTxt = msg["content"];

        item.id = msg["id"];
        item.cls("chat_msg");
        avatar.cls("chat_msg_avatar chat_msg_" + (isMe ? "right" : "left"));
        txt.cls("chat_msg_txt chat_msg_" + (isMe ? "right" : "left"));
        time.cls("chat_msg_time chat_msg_" + (isMe ? "left" : "right"));
        avatar.setSrc(cm.getImgBySize((isMe ? user : curContact)["header"], 40), isMe);
        time.html(cm.formatDate(new Date(msg["created"]*1000), "yyyy-MM-dd HH:mm:ss"));

        if (strTxt) {
            if (msg["msgType"] == 1) {//sticker
                txtSource.html(decodeSticker(strTxt));
                txt.append(txtSource);
            } else {
                var txtTrans = cm.mk("div");
                transBtn = cm.mk("em");
                txtTrans.cls("chat_msg_tr");
                transBtn.cls("chat_msg_trans chat_msg_" + (isMe ? "left" : "right"));

                txtSource.html(faceUtil.covert(strTxt));
                txtTrans.html(faceUtil.covert(msg["tras"] || ""));
                transBtn.hover("", function (s) {
                    var newTransType = getTransType();
                    if (transBtn["transType"] != newTransType) {
                        transBtn.html("");
                        transBtn["transType"] = newTransType;
                        createTransPop(transBtn, msg);
                    }
                    transBtn.toggle(s);
                });
                item.paintTrans = function (t) {
                    txtTrans.html(faceUtil.covert(t));
                };

                txt.append(txtSource);
                txt.append(txtTrans);
            }
        }

        if (msg["img"]) {
            var img = cm.mk("img");
            img.src = msg["img"];
            img.cls("chat_msg_url");
            img.onclick = function () {
                cm.showPic(msg["img"]);
            };
            txt.append(img);
        }

        item.append(avatar);
        item.append(txt);
        item.append(time);

        if (transBtn) {
            item.append(transBtn);
        }

        if (isHistory) {
            contentPanel.insertBefore(item, contentPanel.firstChild);
        } else {
            contentPanel.append(item);
        }

    };
    //生成联系人列表
    var createContact = function (c) {
        var item = cm.mk("div");
        var icon = cm.mk("img");
        var board = cm.mk("dl");
        var wrp = cm.mk("dd");
        var txt = cm.mk("dd");
        var time = cm.mk("dd");
        var life = cm.mk("em");
        var name = cm.mk("a");
        var count = cm.mk("a");
        var remove = cm.mk("em");

        item.cls("chat_contact");
        icon.cls("chat_contact_icon");
        name.cls("chat_contact_name");
        time.cls("chat_contact_time");
        txt.cls("chat_contact_txt");
        count.cls("chat_contact_count");
        remove.cls("chat_contact_remove");
        life.cls("chat_contact_life chat_contact_life_" + c["is_online"]);

        icon.setSrc(cm.getImgBySize(c["header"], 80));
        life.html("&bull;");
        name.html(c["username"]);
        time.html(cm.formatDate(new Date(c["created"]*1000), "yyyy-MM-dd"));
        txt.html(faceUtil.covert(c["content"]));

        wrp.append(life);
        wrp.append(name);
        wrp.append(remove);
        wrp.append(count);

        board.append(wrp);
        board.append(txt);
        board.append(time);

        item.append(icon);
        item.append(board);

        remove.onclick = function () {
            doReq(5, c["user_id"]);
            return false;
        };
        c.setFocus = item.onclick = function (e) {
            if (cm.isMember() || cm.isInMember()) {
                e = e || window.event;
                e = e.target || e.srcElement;
                if (e != remove) {
                    if (curItem != item) {//判断是否是重复点击
                        curContact = c;
                        if (curItem) {
                            curItem.removeCls("chat_contact_focus");
                        }
                        curItem = item;
                        curItem.addCls("chat_contact_focus");
                        showPalInfo();
                        loadMsg();
                        goBottom();
                        cm.get("chat_empty").hide();
                        cm.get("chat_east").show();
                    }
                    cm.get("chat_input").focus();
                    return item.offsetTop;
                }
            }else{
                alert(cm.i18n("need_upgrade"));
                cm.showPay({type: "u"});
            }
        };
        //刷新数量
        c.freshCount = function () {
            var num = c["count"];
            if (num == 0) {
                count.hide();
            } else {
                count.show();
                count.html(num);
            }
            return num;
        };
        c.freshLife = function () {
            life.removeCls("chat_contact_life_(false|true)");
            if (c["is_online"]) {
                life.addCls("chat_contact_life_" + c["is_online"]);
            }else{
                life.cls('chat_contact_life');
            }
        };

        c.beFirst = function () {
            txt.html(faceUtil.covert(c["content"]));
            if (contactIdList.length > 1) {
                var chat_list = cm.get("chat_list");
                chat_list.remove(item);
                chat_list.insertBefore(item, chat_list.firstChild);
            }
        };
        c.beRemove = function () {
            cm.get("chat_list").remove(item);
        };
        cm.get("chat_list").append(item);
    };

     /*
     *刷新消息提醒
     */
    var freshAllCount = function () {
        var total = 0;
        for (var id in contactMap) {
            total += (contactMap[id].freshCount());
        }

        var chat_count = cm.get("head_chat_count");
        if (total > 0 && !cm.get("chat_show").isVisible()) {
            chat_count.html(total);
            chat_count.show();
            if (!internal4count) {
                internal4count = setInterval(function () {
                    chat_count[chat_count.isVisible() ? "hide" : "show"]();
                }, 1000);
            }
        } else {
            clearInterval(internal4count);
            internal4count = null;
            chat_count.hide();
        }
    };


    var getTransType = function () {
        var transType = cm.get("chat_trans_select").val();
        if (transType != -1) {
            transType = (transType.indexOf(",") > -1) ? 2 : 1;
        }
        return transType;
    };
    //解析表情贴
    var decodeSticker = function (s) {
        var arr = s.replace(/\[|\]/g, "").split("_");
        var src = cm.getServer("sticker") + arr[0] + "/" + arr[1] + ".gif";
        var sticker = cm.mk("img");
        sticker["src"] = src;
        sticker.style.border = "none";
        sticker.style.verticalAlign = "middle";
        sticker.style.maxWidth = "100px";
        return sticker.outerHTML;
    };
    //显示当前聊天对象信息
    var showPalInfo = function () {
        var p = curContact;
        var pM = cm.get("chat_pal_m");
        var pName = cm.get("chat_pal_name");
        var pIcon = cm.get("chat_pal_icon");
        var pAbout = cm.get("chat_pal_about");

        pName.html(p["username"]);
        /*if (p['inner_member'] == 1) {
            pM.cls("chat_pal_m chat_pal_m_0");
        }else{
            pM.cls("chat_pal_m chat_pal_m_" + p["level"]);
        }*/
        pM.cls("chat_pal_m chat_pal_m_" + p["level"]);
        pIcon.setSrc(cm.getImgBySize(p["header"], 80));
        pAbout.html(p["mood"] || "Hi");
        pAbout.title = p["mood"];
        pName.onclick = pIcon.onclick = function () {
            setDisplay(false);
            cm.doHome("showSpace", p["user_id"]);
        };
    };
    //显示或隐藏聊天对话框
    var setDisplay = function (isShow) {
        var head_chat = cm.get("head_chat");
        var chat_show = cm.get("chat_show");
        if (isShow) {
            initHeight();
            head_chat.addCls("chat_focus");
            chat_show.show();
            document.documentElement.style.overflow = "hidden";
        } else {
            beLeave();
            head_chat.removeCls("chat_focus");
            chat_show.hide();
            document.documentElement.style.overflow = "auto";
        }
        freshAllCount();
    };
    //移除已选中的聊天对象，关闭聊天内容框
    var beLeave = function () {
        if (curItem) {
            curItem.removeCls("chat_contact_focus");
        }
        curContact = null;
        curItem = null;
        cm.get("chat_empty").show();
        cm.get("chat_east").hide();
    };
    var decodeFid = function (m) {
        return (m["sender_id"] == user["id"]) ? m["reciver_id"] : m["sender_id"];
    };
    var goBottom = function () {
        cm.get("chat_main").scrollTop = parseInt(cm.get("chat_main").scrollHeight);
    };

    init();
})();