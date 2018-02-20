// JavaScript Document
(function () {
    var self = this;
    var user = null;
    var isAjax = false;
    var pageIndex = 0;
    var pageSize = 10;
    var cm = new top.common(document);
    var bindScroll = function () {
        var panel = cm.get("list");
        panel.onscroll = function () {
            var ch = panel.clientHeight;
            var sh = panel.scrollHeight;
            var st = panel.scrollTop;
            var dif = sh - st - ch;
            if (dif < 20 && isAjax == false) {
                isAjax = true;
                setTimeout(function () {
                    loadShop();
                }, 10);
            }
        };
    };
    var loadShop = function () {
        cm.ajax("index.php?m=Index&c=Sticker&a=getList", {index: pageIndex++, size: pageSize}, function (res) {
            if (res.status == 'success') {
                var stickers = res["data"];
                paintShop(stickers);
                isAjax = stickers.length != pageSize;
            }
        });
    };
    var paintShop = function (stickers) {
        var outer = cm.get("list");
        var buy = function () {
            var btn = this;
            if (cm.isEnough(btn["sticker"]["price"]) || cm.getMemberShip()>1 || cm.isInMember()) {
                cm.ajax("index.php?m=Index&c=Sticker&a=order", {stickerId: btn.sticker.id}, function (msg) {
                    if (msg["status"] == 'success') {
                        btn.hide();
                        alert(cm.i18n("buy_success"));
                    } else {
                        alert(cm.i18n(msg.msg));
                        if (msg.msg == 'need_recharge') {
                            cm.showPay({type:"r"});
                        }
                    }
                });
            }else{
                alert(cm.i18n("need_recharge"));
                cm.showPay({type:"r"});
            }
        };
        var createItem = function (sticker) {
            var size = sticker["capacity"];
            var item = cm.mk("div");
            var banner = cm.mk("div");
            var name = cm.mk("div");
            var bar = cm.mk("div");

            item.className = "item";
            banner.className = "item_banner";
            bar.className = "item_bar";
            name.className = "item_name";
            name.innerHTML = name.title = sticker["des"];
            bar.append(name);
            if (sticker["permission"] == true) {
                //bar.innerHTML = "宸叉坊鍔 ";
            } else {
                var button = cm.mk("div");
                var price = sticker["price"];

                button.className = "item_button";
                bar.append(button);
                if (price > 0) {
                    button.innerHTML = price + " G / " + document.i18n["permanently"];
                } else {
                    button.innerHTML = "Free";
                }
                button.sticker = sticker;
                button.onclick = buy;
            }
            var img4banner = cm.mk("img");
            img4banner.src = sticker['img'];
            banner.append(img4banner);
            item.append(banner);
            item.append(bar);
            outer.append(item);
        };
        for (var i = 0, len = stickers.length; i < len; i++) {
            var s = stickers[i];
            createItem(s);
        }
    };


    frameElement.complete();
    loadShop();
    bindScroll();
})();