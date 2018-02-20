// JavaScript Document
var d_avatar = new function () {
    var self = this;
    var cm = new top.common(document);
    var cutter = null;
    var init = function () {
        frameElement.removeAllBtn();
        if (frameElement.args != "force") {
            frameElement.addBtn(cm.i18n("cancel"), function () {
                frameElement.cancel();
            });
        }
        frameElement.addBtn(cm.i18n("done"), updateAvatar, "blue");
        if (cm.getUser()["role"] != 3) {//静默用户
            var config = {
                width: 150,
                height: 30,
                render: "upload",
                handler: self.loadIcon,
                //type: "flash",
                extraArgs: "token=" + cm.getToken(),
                action: "index.php?m=Index&c=Upload&a=upload"
            };
            new Gwx.PhotoUploader(config);
        }
        frameElement.complete();
    };

    this.loadIcon = function (type, msg) {
        if (type == 0) {
            if (cutter != null) {
                cutter.clear();
            }
            cutter = new Gwx.PhotoCutter({render: "raw", previews: ["preview"]});
            cutter.showTip();
        } else if (type == 1) {
            if (msg["status"] == 'success') {
                var url = msg["url"];
                self.relName = url;
                cutter.setPhoto(url);
                cutter.show();
            } else {
                cutter.clear();
            }
        } else if (type == 2) {
            cutter.clear();
        } else if (type == 3) {
            alert(msg + " time out");
        }
    };

    var isBusy = false;
    var updateAvatar = function () {
        if (isBusy) {
            return;
        }

        if (cutter) {
            isBusy = true;
            var status = cutter.getStatus();
            var args = {s: self.relName, x: status.x, y: status.y, w: status.w};
            frameElement.loading();
            cm.ajax("index.php?m=Index&c=Avatar&a=save", args, function (msg) {
                if (msg["status"] == 'success') {
                    if (cm.isSelf()) {
                        var sp = cm.getSpaceUser();
                        var album = sp["albumMap"][2];
                        album["list"] = res["photo"].concat(album["list"]);
                        sp["header"] = msg.data.header;
                        cm.doHome("freshSpaceUser");
                    }
                    cm.getUser()["header"] = msg.data.header;
                    cm.doHome("initUser");
                    frameElement.cancel();
                } else {
                    alert("retry");
                    frameElement.complete();
                }
                isBusy = false;
            });

        } else {
            alert("info_null");
        }
    };

    init();
};