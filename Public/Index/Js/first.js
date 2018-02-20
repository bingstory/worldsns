// JavaScript Document
(function () {
    var self = this;
    var cm = new top.common(document);
    var newMoodUrl = null;
    var faceUtil = new top.Gwx.Face(document);
    var pageSize = cm.getPageSize();
    var index4recommend = 0;
    var index4dynamic = 0;
    var isAjax4R = false;
    var isAjax4D = false;
    //改动
    var initPage = function () {
        var panel1 = cm.get("panel1");
        var panel2 = cm.get("panel2");
        var nav1 = cm.get("nav1");
        var nav2 = cm.get("nav2");
        nav2.onclick = function () {
            this.addCls("nav_focus");
            nav1.removeCls("nav_focus");
            panel2.show();
            panel1.hide();
            cm.doHome("freshHome");
            cm.bindScrollEvent(loadDynamic, index4dynamic == 0);
        };
        nav1.onclick = function () {
            this.addCls("nav_focus");
            nav2.removeCls("nav_focus");
            panel1.show();
            panel2.hide();
            cm.doHome("freshHome");
            cm.bindScrollEvent(loadRecommend, index4recommend == 0);
        };
        cm.get("nav2").onclick();
        cm.get("mood_btn_enter").onclick = doAddDynamic;
        cm.get("ad_banner").onclick = function () {
        cm.doHome("showHome", "Giftall");
        }
    };

    //add  默认：先打开“推荐用户”
    var initPage2 = function () {
        var panel1 = cm.get("panel1");
        var panel2 = cm.get("panel2");
        var nav1 = cm.get("nav1");
        var nav2 = cm.get("nav2");
       
        nav2.onclick = function () {
            this.addCls("nav_focus");
            nav1.removeCls("nav_focus");
            panel2.show();
            panel1.hide();
            cm.doHome("freshHome");
            cm.bindScrollEvent(loadDynamic, index4dynamic == 0);
        };
        nav1.onclick = function () {
            this.addCls("nav_focus");
            nav2.removeCls("nav_focus");
            panel1.show();
            panel2.hide();
            cm.doHome("freshHome");
            cm.bindScrollEvent(loadRecommend, index4recommend == 0);
        };
        cm.get("nav1").onclick();
        cm.get("mood_btn_enter").onclick = doAddDynamic;
        cm.get("ad_banner").onclick = function () {
            cm.doHome("showHome", "Giftall");
        }
    };
    var initFace = function () {
        var viewer = cm.get("mood_face_viewer");
        cm.get("mood_btn_face").hover("", function () {
            if (!viewer["isRender"]) {
                var item = faceUtil.bind(cm.get("mood_face_panel"), function (val) {
                    var ta = cm.get("mood_textarea");
                    ta.focus();
                    ta.val(ta.value + "[" + val + "]");
                });
                viewer["isRender"] = true;
            }
        });
    };
    var closePhoto = function () {
        newMoodUrl = null;
        cm.get("mood_camera_photo").html("");
        cm.get("mood_camera_close").hide();
        cm.get("mood_camera_viewer").hide();
    };
    var initCamera = function () {
        if (cm.getUser()["role"] != 3) {//闈欓粯鐢ㄦ埛
            var photoHandler = function (type, msg) {
                var viewer = cm.get("mood_camera_viewer");
                var wrp = cm.get("mood_camera_photo");
                var close = cm.get("mood_camera_close");
                if (type == 0) {
                    closePhoto();
                    viewer.show();
                } else if (type == 1) {
                    newMoodUrl = msg["url"];
                    var img = cm.mk("img");
                    img.src = newMoodUrl;
                    wrp.append(img);
                    close.show();
                    close.onclick = closePhoto;
                }
            };
            var config = {
                width: 40,
                height: 36,
                render: "camera_object",
                handler: photoHandler,
                // type: "flash",
                extraArgs: "token=" + cm.getToken(),
                action: 'index.php?m=Index&c=Upload&a=upload&dir=photo'
            };
            new Gwx.PhotoUploader(config);
        }
    };

    var createGoogleTransPop = function (fn) {
        var row;
        var table = cm.mk("table");
        var langList = cm.getLangList();
        var codeList = cm.getCodeList();
        table.cls("public_trans_list");

        for (var i = 0; i < 12; i++) {
            if (i % 4 == 0) {
                row = table.insertRow(i / 4);
            }
            var td = cm.get(row.insertCell(i % 4));
            var a = cm.mk("a");
            a.cls("public_trans_item");
            a.html(langList[i]);
            a.code = codeList[i];
            a.onclick = function () {
                fn(this.code);
            };
            td.append(a);
        }
        return table;
    };
    var initTrans = function () {
        var viewer = cm.get("mood_trans_viewer");
        var textarea = cm.get("mood_textarea");
        viewer.append(createGoogleTransPop(
            function (code) {
                viewer.hide();
                if (!cm.isEmpty(textarea.val())) {
                    var content = textarea.val();
                    var level = cm.getMemberShip();
                    if (level < 2) {
                        var gold = cm.getUserGold();
                        var money = content.length*0.01;
                        if (parseFloat(gold) < parseFloat(money) && !cm.isInMember()) {
                            alert(cm.i18n('need_recharge'));
                            cm.showPay({type: "r"});
                            return false;
                        }
                    }
                    cm.ajax("index.php?m=Index&c=Trans&a=translate", {to: code, content: textarea.val()}, function (msg) {
                        if (msg["status"] == 'success') {
                            textarea.val(msg["data"]);
                        }
                    });
                }
            }
        ));
        cm.get("mood_btn_trans").hover("", function (t) {
            if (t) {
                viewer.show();
            } else {
                viewer.hide(0);
            }
        });
    };
    var loadRecommend = function () {
        if (!isAjax4R) {
            isAjax4R = true;
            if (index4recommend == 0 || (cm.getMemberShip() == 1 && index4recommend < 5) || cm.getMemberShip() > 1 || cm.isInMember()) {
                cm.ajax("index.php?m=Index&c=First&a=recommend", {index: index4recommend++, size: pageSize}, function (msg) {
                    if (msg["status"] == 'success') {
                        var list = msg["data"];
                        var render = cm.get("panel1");
                        var len = list.length;
                        for (var i = 0; i < len; i++) {
                            cm.setRecommend(list[i]);
                            render.append(createRItem(list[i]));
                            cm.doHome("freshHome");
                        }
                        cm.doHome("freshHome");
                        isAjax4R = len != pageSize;
                    }
                });
            } else if (!cm.isBlocked()) {
                alert(cm.i18n("need_upgrade"));
                cm.showPay({type: "u"});
            }
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

            m.cls("r_m r_m_" + member["level"]);
            //alert(member["level"]);

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
    var loadDynamic = function () {
        if (!isAjax4D) {
            isAjax4D = true;
            if (index4dynamic == 0 || (cm.getMemberShip() == 1 && index4dynamic < 5) || cm.getMemberShip() > 1 || cm.isInMember()) {
                cm.ajax("index.php?m=Index&c=Dynamic&a=getList", {index: index4dynamic++, size: pageSize}, function (msg) {
                    if (msg["status"] == 'success') {
                        var list = msg["list"];
                        var render = cm.get("panel2");
                        var len = list.length;
                        for (var i = 0; i < len; i++) {
                            render.append(createDItem(list[i]));
                            cm.doHome("freshIfm");
                        }
                        isAjax4D = list.length != pageSize;
                        setTimeout(function () {
                            cm.doHome("freshIfm");
                        }, 1000);
                    } else {
                        //alert("load failed!");
                    }
                });
            } else if (!cm.isBlocked()) {
                alert(cm.i18n("need_upgrade"));
                cm.showPay({type: "u"});
            }
        }
    };
    var createDItem = function (d) {
        var item = cm.mk("div");
        var icon = cm.mk("img");
        var arrow = cm.mk("em");
        var main = cm.mk("div");
        var content = d["content"];
        var transResult;

        var goSpace = function () {
            cm.doHome("showSpace", d["user_id"]);
        };
        var cIcon = function () {
            icon.cls("d_icon");
            icon.onclick = goSpace;
            icon.setSrc(cm.getImgBySize(d["header"], 80));
            item.append(icon);
        };
        var cArrow = function () {
            // arrow.cls("d_arrow");
            // item.append(arrow);
        };
        var cMain = function () {
            var drawCaption = function () {
                var caption = cm.mk("div");
                var name = cm.mk("span");
                var time = cm.mk("span");

                caption.cls("d_caption");
                name.cls("d_name");
                time.cls("d_time");

                name.html(d["username"]);
                time.html(cm.formatDate(new Date(d["created"]*1000), "yyyy-MM-dd HH:mm"));

                caption.append(name);
                caption.append(time);

                name.onclick = goSpace;

                main.append(caption);
            };

            var drawCenter = function () {
                var center = cm.mk("div");
                var strText = content;
                var urls = d["urls"];

                center.cls("d_center");

                if (!cm.isEmpty(strText)) {
                    var text = cm.mk("div");
                    transResult = cm.mk("div");

                    strText = cm.formatText(strText);
                    strText = faceUtil.covert(strText);

                    text.cls("d_text");
                    transResult.cls("d_trans_result");
                    text.html(strText);
                    center.append(text);
                    center.append(transResult);
                }
                if (urls.length > 0) {
                    for (var i = 0; i < urls.length; i++) {
                        var img = cm.mk("img");
                        img.cls("d_img");
                        img.onclick = function () {
                            cm.showPic(this.src);
                        };
                        center.append(img);
                        img.src = cm.getImgBySize(urls[i], 0);
                    }
                }
                main.append(center);
            };

            var drawBar = function () {
                var createBtn = function (key) {
                    var btn = cm.mk("a");
                    var btnIcon = cm.mk("em");
                    var btnTxt = cm.mk("span");

                    btnIcon.cls("d_btn_icon d_icon_" + key);
                    btnTxt.html(cm.i18n(key));
                    btn.append(btnIcon);
                    btn.append(btnTxt);

                    btn.cls("d_btn d_" + key);
                    return btn;
                };
                var bar = cm.mk("div");
                var report = createBtn("report");
                if (!cm.isEmpty(content)) {
                    var trans = createBtn("trans");
                    trans.hover("", function (t) {
                        var viewer = trans.viewer;
                        if (!trans.render) {
                            var arrow = cm.mk("dd");
                            viewer = cm.mk("dl");

                            arrow.cls("d_trans_arrow");
                            viewer.cls("d_trans_viewer");

                            viewer.append(createGoogleTransPop(function (code) {
                                var level = cm.getMemberShip();
                                if (level < 2) {
                                    var gold = cm.getUserGold();
                                    var money = content.length*0.01;
                                    if (parseFloat(gold) < parseFloat(money)) {
                                        alert(cm.i18n('need_recharge'));
                                        cm.showPay({type: "r"});
                                        return false;
                                    }
                                }
                                viewer.hide();
                                cm.ajax("index.php?m=Index&c=Trans&a=translate", {to: code, content: content,'source_id':d["user_id"]}, function (res) {
                                    if (res["status"] == 'success') {
                                        transResult.html(res["data"]);
                                        cm.doHome("freshHome");
                                    }
                                });
                            }));

                            viewer.append(arrow);
                            trans.append(viewer);

                            trans.render = true;
                            trans.viewer = viewer;
                        }
                        if (t) {
                            clearTimeout(trans.timer);
                            viewer.show();
                        } else {
                            trans.timer = setTimeout(viewer.hide, 200);
                        }
                    });
                    bar.append(trans);
                }

                bar.cls("d_bar");
                bar.append(report);

                main.append(bar);
            };

            drawCaption();
            drawCenter();
            drawBar();

            main.cls("d_main");
            item.append(main);
        };

        cIcon();
        cArrow();
        cMain();

        item.cls("d_item");
        return item;
    };
    var doAddDynamic = function () {
        var content = cm.get("mood_textarea").val();
        if (!cm.isBlocked() && (!cm.isEmpty(content) || newMoodUrl != null)) {
            cm.ajax("index.php?m=Index&c=Dynamic&a=add", {content: content, url: newMoodUrl}, function (msg) {
                if (msg["status"] == 'success') {
                    var sp = cm.getSpaceUser();
                    if (sp &&　msg["photo"]) {
                        var albumMap = sp["albumMap"];
                        //alert(albumMap);
                        var album = albumMap["1"];
                        //alert(album);
                        album["list"] = msg["photo"].concat(album["list"]);
                        sp["albumMap"]['1'] = album;
                    }
                    closePhoto();
                    cm.get("mood_textarea").val("");
                    alert("ok");
                } else {
                    alert("error!");
                }
            });
        }
    };

    if (!cm.isBlocked()) {
        initPage2();//推荐用户  在先
        //initPage();//最新动态   在先
        initFace();
        initTrans();
        initCamera();
    }
})();
// 方法1：
// document.onclick=mouseClick; 
//     function mouseClick(evt){ if(evt){//不是ie 
//         alert(evt.target.id); 
//         }else if(window.event){//ie
//          alert(window.event.srcElement.id); 
//      } 
//  } 
// 方法1：
// var curId; // 保存全局id
//  parent.window.document.onclick=Hanlder; 
//     function Hanlder(e) { 
//         e = e || event; 
//         var tag = e.srcElement || e.target; 
//         if (tag.id) { curId = tag.id; } 
//         alert(curId);
//     } 
// 方法3：
// $(document).click(function (e) {
//     var v_id = $(e.target).attr('id');
//     alert(v_id);
//     });