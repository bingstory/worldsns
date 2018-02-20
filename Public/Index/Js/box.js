// JavaScript Document
(function () {
    var index = 0;
    var cm = new top.common(document);
    var isAjax = false;
    
    var query = function () {
        if (!isAjax) {
            isAjax = true;
            cm.ajax("index.php?m=Index&c=Box&a=getlist", {index: index++, size: cm.getPageSize()}, function (msg) {
                if (msg["status"] == 'success') {
                    var list = msg["data"];
                    var outer = cm.get("render");
                    var len = list.length;
                    for (var i = 0; i < len; i++) {
                        var gift = list[i];
                        var item = createItem(list[i]);
                        outer.append(item);
                    }
                    isAjax = len != cm.getPageSize();
                }
                cm.doHome("freshHome");
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
    var createItem = function (gift) {
        var menu = null;
        var sender = gift["sender"];
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
        life.cls("item_life" + (sender["is_online"] == 1 ? " item_life_active" : ""));
        life.id = 'item_life_'+gift['user_id'];
        name.cls("item_name");

        btn4show.cls("item_btn item_btn_left");
        btn4more.cls("item_btn item_btn_right");

        img4show.cls("item_btn_img item_btn_gift_blue");
        img4arrow.cls("item_btn_img item_btn_more");

        life.html("&bull;");
        name.html(sender["username"] + " , " + gift["gift_name"] + " , " + cm.formatDate(new Date(gift["created"]*1000), "yyyy-MM-dd HH:mm"));

        li2.html(gift["words"] || "");
        btn4txt.html(cm.i18n("gift_ack"));

        icon.src = cm.getGiftImgBySize(gift["gift_img"],80);

        name.onclick = function () {
            cm.doHome("showSpace", sender["id"]);
        };
        btn4show.onclick = function () {
            cm.showVirtual(sender);
        };

        btn4more.onmouseover = function () {
            if (menu == null) {
                var handler = [
                    function () {
                        cm.showChat(sender);
                    }, function () {
                        cm.ajax("index.php?m=Index&c=Box&a=del", {giftId: gift["id"]}, function (msg) {
                            if (msg["status"] == 'success')
                                item.parentNode.removeChild(item);
                        })
                    }
                ];
                menu = createMenu(["chat"], handler);
                this.append(menu);
            }
            menu.show();
        };

        btn4more.onmouseout = function () {
            menu.hide();
        };

        li1.append(life);
        li1.append(name);

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
