(function () {
    var self = this;
    var friend = null;
    var curType = 0;
    var curVirtual = null;
    var pageSize = 36;
    var cm = new top.common(document);

    var initPage = function () {
        friend = frameElement.args;
        frameElement.removeAllBtn();
        frameElement.setCaption(cm.i18n("sendTo") + "\t" + friend["username"]);
        frameElement.addBtn(cm.i18n("cancel"), function () {
            frameElement.cancel();
        });
        frameElement.addBtn(cm.i18n("send"), doSend, "blue");

        for (var i = 0; i < 6; i++) {
            bindEvent(i);
        }
        cm.get("tab_0").onclick();
        frameElement.complete();
    };

    var bindEvent = function (i) {
        var panel = cm.get("list_" + i);
        var tab = cm.get("tab_" + i);
        var type = i;
        var page = 0;

        tab.onclick = function () {
            cm.get("tab_" + curType).removeCls("tab_focus");
            cm.get("list_" + curType).hide();
            cm.get("list_" + type).show();

            curType = type;
            this.addCls("tab_focus");
            if (page == 0) {
                showType(type, page);
                page++;
            }
        };

        panel.stop = function () {
            this.onscroll = function () {
            };
        };
        panel.onscroll = function () {
            var ch = this.clientHeight;
            var sh = this.scrollHeight;
            var st = this.scrollTop;
            var dif = sh - st - ch;
            if (dif < 20) {
                setTimeout(function () {
                    showType(type, page++);
                }, 10);
            }
        };
    };
    var showType = function (type, page) {
        var currentItem = null;

        var createItem = function (virtual) {
            var item = cm.mk("div");
            var pic = cm.mk("img");
            var name = cm.mk("span");

            pic.cls("item_img");
            pic.src = virtual["url"];
            pic.hover("item_img_hover");
            name.html(virtual["price"]);
            item.cls("item");
            item.title = virtual["name"];

            item.onclick = function () {
                if (currentItem != this) {
                    if (currentItem != null) {
                        currentItem.firstChild.removeCls("item_focus");
                    }
                    this.firstChild.addCls("item_focus");
                    currentItem = this;
                    curVirtual = virtual;
                    cm.get("words").val(curVirtual["words"]);
                }
            };

            item.append(pic);
            item.append(name);
            return item;
        };

        cm.ajax("action/virtual/query", {type: type, index: page++, size: pageSize}, function (res) {
            if (res["status"] == 1) {
                var list = res["data"];
                var panel = cm.get("list_" + type);
                for (var i = 0, len = list.length; i < len; i++) {
                    var item = createItem(list[i]);
                    panel.append(item);
                }
                if (len < pageSize) {
                    panel.stop();
                }
            }
        });
    };


    var isEnough4Virtual = function (price) {
        var me = cm.getUser();
        var status = me["role"] == 2;
        if (!status) {
            var g = me["gold"];
            status = g > 0 && !(price > g);
        }
        if (!status) {
            alert(cm.i18n("need_recharge"));
            cm.showPay({type:"r"});
        }
        return status;
    };
    var doSend = function () {
        if (curVirtual != null) {
            var price = curVirtual["price"];
            if (isEnough4Virtual(price)) {
                var btn = this;
                var words = cm.get("words").val();
                words = words.replace(/^\s*|\s*cm/g, "");

                btn.disabled = true;
                cm.ajax("action/gift/buy", {
                    fid: friend["id"], gid: curVirtual["id"], words: words, type: 0
                }, function (res) {
                    var status = res["status"];
                    if (status == 1) {
                        var balance = res["balance"];
                        if (balance) {
                            cm.getUser()["gold"] = balance;
                        }
                        alert("ok");
                    } else {
                        alert("error");
                    }
                    btn.disabled = false;
                    frameElement.cancel();
                });
            }
        }
    };



    var inittab = function () {
        cm.ajax("index.php?m=Index&c=Gift&a=getCatList",{} ,function (msg) {
                    if (msg.status == 'success') {
                        var tab = cm.get('tab');
                        for(var i=1; i<=5; i++) {
                            var div = cm.mk('div');
                            div.cls('tab_item');
                            div.hover('tab_item tab_focus');
                            div.html(msg.data[i].name);
                            div.id = 'tab_'+msg.data[i].id;
                            /*div.onclick = function () {

                            }*/
                            tab.append(div);
                        }
                    } else {
                        alert("error");
                    }
                });
    }

    inittab();
    initPage();
})();