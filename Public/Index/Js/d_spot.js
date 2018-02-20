// JavaScript Document
(function () {
    var self = this;
    var cm = new top.common(document);
    frameElement.complete();

    var init = function () {
        var user = cm.getUser();
        var wallArray = cm.getWallArray();
        var panel = cm.get("list");

        for (var i = 0; i < 3; i++) {
            var w = wallArray[i];
            var img = cm.mk("img");
            img.cls("other");
            img.setSrc(cm.getImgBySize(w["header"], 180));
            panel.append(img);
        }

        cm.get("btn").onclick = addSpot;
        cm.get("me").setSrc(cm.getImgBySize(cm.getUser()["header"], 180), true);
    };

    var addSpot = function () {
        if (cm.checkIcon() && cm.isEnough(10)) {
            cm.ajax("index.php?m=Index&c=Spot&a=add", {}, function (res) {
                if (res["status"] == 'success') {
                    top.location.reload();
                } else {
                    alert("Upload photo firstly");
                }
            });
        } else {
            alert(cm.i18n("need_recharge"));
            cm.showPay({type: "r"});
        }
    };

    init();
    frameElement.setCaption(cm.i18n('spot caption'));
})();