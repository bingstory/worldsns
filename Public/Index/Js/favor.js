// JavaScript Document
(function () {
    var cm = new top.common(document);
    var pageSize = cm.getPageSize();
    var pageIndex = 0;
    var isAjax = false;

    var query = function () {
        if (!isAjax) {
            isAjax = true;
            cm.ajax("index.php?m=Index&c=First&a=getFavor", {index: pageIndex++, size: pageSize}, function (msg) {
                var status = msg["status"] || 600;
                if (status == 'success') {
                    var list = msg["data"];
                    var outer = cm.get("render");
                    var len = list.length;
                    for (var i = 0; i < len; i++) {
                        var user = list[i];
                        var item = createItem(user);
                        outer.append(item);
                    }
                    isAjax = len != pageSize;
                }
                cm.doHome("freshIfm");
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

    var createItem = function (user) {
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
        life.cls("item_life" + (user["is_online"] == 1 ? " item_life_active" : ""));
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
                        cm.ajax("index.php?m=Index&c=First&a=delFavor", {favorId: user["id"]}, function (res) {
                            if (res["status"] == 'success') {
                                item.parentNode.removeChild(item);
                            }
                        });
                    }
                ];
                menu = createMenu(["gift", "remove"], handler);
                this.append(menu);
            }
            this.addCls("item_btn_hover");
            menu.show();
        };
        btn4show.onclick = function () {
            var u = new Array();
            u['id'] = user['user_id'];
            u['username'] = user['username'];
            u['header'] = user['header'];
            cm.showChat(u);
        };
        btn4more.onmouseout = function () {
            this.removeCls("item_btn_hover");
            menu.hide();
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

    cm.bindScrollEvent(query, true);
})();
