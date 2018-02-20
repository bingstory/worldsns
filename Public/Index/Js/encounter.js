// JavaScript Document
var visitor = new function () {
    var index = 0;
    var cm = new top.common(document);
    var pageSize = cm.getPageSize();
    var isAjax4initiative = false;
    var isAjax4passive = false;
    var isAjax4match = false;
    var index4initiative = 0;
    var index4passive = 0;
    var index4match = 0;
    var index4next = 0;
    var recommendList = [];
    var currentRecommend;

    var initPage = function () {
        var currentTab = cm.get("nav1");
        var setFocus = function (obj, type) {
            showList(true);
            currentTab.removeCls("nav_focus");
            obj.addCls("nav_focus");
            currentTab = obj;
            if (type) {
                eval("index4" + type + "=0");
                eval("isAjax4" + type + "=false");
                cm.bindScrollEvent(function () {
                    queryEncounter(type);
                }, true);
            }
        };
        var showList = function (isShow) {
            cm.get("panel2").html("");
            cm.get("panel1")[isShow ? "hide" : "show"]();
            cm.get("panel2")[isShow ? "show" : "hide"]();
        };
        cm.get("nav1").onclick = function () {
            setFocus(this);
            showList(false);
        };
        cm.get('nav2').onclick = function () {
            setFocus(this, "initiative");
        };
        cm.get('nav3').onclick = function () {
            if (cm.isMember() || cm.isInMember()) {
                setFocus(this, "passive");
                cm.getInteract()["passive"] = 0;
                cm.doHome("freshInteractive");
                freshInteract();
            } else if (!cm.isBlocked()) {
                alert(cm.i18n("need_upgrade"));
                cm.showPay({type: "u"});
            }
        };
        cm.get('nav4').onclick = function () {
            if (cm.isMember() || cm.isInMember()) {
                setFocus(this, "match");
                cm.getInteract()["match"] = 0;
                cm.doHome("freshInteractive");
                freshInteract();
            } else if (!cm.isBlocked()) {
                alert(cm.i18n("need_upgrade"));
                cm.showPay({type: "u"});
            }
        };
        cm.get("btn4yes").onclick = function () {
            cm.ajax("index.php?m=Index&c=First&a=like", {likeId: currentRecommend["id"]}, function (res) {
                if (res["status"] == 'success') {
                    alert("ok");
                } else {
                    alert("error");
                }
            });
            showNextRecommend();
        };
        cm.get("btn4no").onclick = showNextRecommend;
        cm.get("rec_ask").html(cm.i18n("like_" + cm.getUserGender()));
    };
    var freshInteract = function () {
        var interact = cm.getInteract();
        var passive = interact["passive"];
        var match = interact["match"];
        var passiveNote = cm.get("note_passive");
        var matchNote = cm.get("note_match");
        passiveNote.html(passive);
        matchNote.html(match);
        passiveNote[passive > 0 ? "show" : "hide"]();
        matchNote[match > 0 ? "show" : "hide"]();
    };

    var queryRecommend = function () {
        cm.ajax("index.php?m=Index&c=First&a=recommend", {index: 0, size: 20}, function (msg) {
            recommendList = msg["data"];
            showNextRecommend();
            cm.doHome("freshHome");
        });
    };

    var showNextRecommend = function () {
        currentRecommend = recommendList[index4next];
        var outer = cm.get("rec_photo");
        var name = cm.get("rec_name");
        var about = cm.get("rec_about");
        var profile = cm.get("rec_profile");

        var img = cm.mk("img");
        var maxWidth = 450;
        var maxHeight = 400;

        name.html(currentRecommend["username"]);
        var dateObj = new Date();
        var year = dateObj.getFullYear();
        var age = year - currentRecommend["year"];
        profile.html((currentRecommend["city"] || currentRecommend["country"]) + "," + age);
        about.html(currentRecommend["mood"]);

        name.onclick = function () {
            cm.doHome("showSpace", currentRecommend["id"]);
        };
        img.onload = function () {
            var w = img.width;
            var h = img.height;
            if (w > h) {
                img.height = maxWidth * h / w;
                img.width = maxWidth;
                img.style.marginTop = (maxHeight - img.height) / 2 + "px";
            } else {
                img.width = maxHeight * w / h;
                img.height = maxHeight;
            }
        };

        outer.html("");
        outer.append(img);
        img.src = cm.getImgBySize(currentRecommend["header"], "0");

        if (++index4next > recommendList.length - 1) {
            index4next = 0;
        }
    };
    var queryEncounter = function (type) {
        var isAjax = "isAjax4" + type;
        var index = "index4" + type;
        if (!eval(isAjax)) {
            cm.ajax("index.php?m=Index&c=First&a=getLike", {type: type, index: eval(index + "++"), size: pageSize}, function (res) {
                if (res["status"] == 'success') {
                    var list = res["data"];
                    var render = cm.get("panel2");
                    var len = list.length;
                    for (var i = 0; i < len; i++) {
                        render.append(createItem(list[i],type));
                    }
                    eval(isAjax + "=" + (len != pageSize));
                    cm.doHome("freshHome");
                }
            });
        }
    };
    var createMenu = function (btns, handler) {
        var menu = cm.mk("div");
        var arrow = cm.mk("div");

        menu.cls("item_menu");
        arrow.cls("item_menu_arrow");
        menu.append(arrow);

        for (var i = 0, len = btns.length; i < len; i++) {
            var fn = handler[i];
            var item = cm.mk("div");
            var wrp = cm.mk("div");
            var img = cm.mk("em");
            var text = cm.mk("span");

            item.onclick = fn;
            item.cls("item_menu_item");
            wrp.cls("item_menu_wrp");
            img.cls("item_btn_img item_btn_" + btns[i]);

            text.html(cm.i18n(btns[i]));

            wrp.append(img);
            wrp.append(text);
            item.append(wrp);
            menu.append(item);
        }

        return menu;
    };

    var createItem = function (user,type) {
        var menu = null;
        var item = cm.mk("div");
        var icon = cm.mk("img");
        var ul = cm.mk("ul");
        var li1 = cm.mk("li");
        var li2 = cm.mk("li");
        var life = cm.mk("div");
        var name = cm.mk("div");

        var btn4show = cm.mk("div");
        var btn4more = cm.mk("div");
        var img4show = cm.mk("em");
        var btn4txt = cm.mk("span");
        var img4arrow = cm.mk("div");

        item.cls("item");
        icon.cls("item_icon");
        life.cls("item_life" + (user["is_online"] == true ? " item_life_active" : ""));
        life.id = 'item_life_'+user['user_id'];
        name.cls("item_name");

        btn4show.cls("item_btn item_btn_left");
        btn4more.cls("item_btn item_btn_right");

        img4show.cls("item_btn_img item_chat_blue");
        img4arrow.cls("item_btn_img item_btn_more");


        life.innerHTML = "&bull;";
        var dateObj = new Date();
        var year = dateObj.getFullYear();
        var age = year - user["year"];
        name.innerHTML = user["username"] + " , " + age;
        li2.innerHTML = user["mood"];

        btn4txt.html(cm.i18n("chat"));

        icon.onerror = function () {
            // this.src = cm.getAvatarBySize(null, "80", user["gender"]);
        };
        icon.onclick = name.onclick = function () {
            cm.doHome("showSpace", user["user_id"]);
        };

        icon.setSrc(cm.getImgBySize(user["header"], "80"));

        btn4more.onmouseover = function () {
            if (menu == null) {
                var handler = [
                    function () {
                        cm.showVirtual(user);
                    }, function () {
                        cm.ajax("index.php?m=Index&c=First&a=delLike", {likeId: user["id"],'type': type}, function (res) {
                            if (res["status"] == 'success') {
                                item.parentNode.removeChild(item);
                            } else {
                                alert("error");
                            }
                        });

                    }
                ];
                menu = createMenu(["gift", "remove"], handler);
                this.append(menu);
            }
            menu.show();
        };
        btn4more.onmouseout = function () {
            menu.hide();
        };
        btn4show.onclick = function () {
            var u = new Array();
            u['id'] = user['user_id'];
            u['username'] = user['username'];
            u['header'] = user['header'];
            cm.showChat(u);
        };
        li1.append(life);
        li1.append(name);

        if (user["type"] == 1) {
            var mutual = cm.mk("div");
            mutual.cls("item_mutual");
            li1.append(mutual);
        }

        ul.append(li1);
        ul.append(li2);

        btn4show.append(img4show);
        btn4show.append(btn4txt);
        btn4more.append(img4arrow);

        item.append(icon);
        item.append(ul);
        item.append(btn4more);
        item.append(btn4show);
        return item;
    };
    queryRecommend();
    initPage();
    freshInteract();
};
