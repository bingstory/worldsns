(function () {
    var start = 0;
    var cm = new top.common(document);
    var init = function () {
        frameElement.setCaption("pass");
        frameElement.removeAllBtn();
        frameElement.addBtn(cm.i18n("cancel"), function () {
            frameElement.cancel();
        });
        frameElement.addBtn(cm.i18n("done"), done, "blue");
        frameElement.complete();
    };
    var done = function () {
        var pass1 = cm.get("pass1").val();
        var pass2 = cm.get("pass2").val();
        var reg4text = /^(\w{1,50}cm|(^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+cm))/;//只允许数字、字母、下划线,email
        //if (reg4text.test(pass1) && pass1 == pass2) {
        if (pass1 == pass2) {
            cm.ajax("index.php?m=Index&c=User&a=editPass", {pwd: pass1}, function (msg) {
                if (msg && msg["status"] == 'success') {
                    alert("ok");
                    frameElement.cancel();
                } else {
                    alert(":(");
                }
            });
        } else {
            cm.get("error_info").html(cm.i18n("not_equal"));
        }
    };
    init();
})();
