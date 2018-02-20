(function () {
    var start = 0;
    var cm = new top.common(document);
    var friend = frameElement.args;
    var init = function () {
        if (friend['default']) {
            cm.get("content").placeholder = friend['default'];
        }
        frameElement.setCaption(friend["username"]);
        frameElement.removeAllBtn();
        frameElement.addBtn(cm.i18n("cancel"), function () {
            frameElement.cancel();
        });
        frameElement.addBtn(cm.i18n("done"), function () {
            var txt = cm.get("content").val()||"Hi";
            top.sendMsgExternal(friend["id"], txt);
            frameElement.cancel();
        }, "blue");
        frameElement.complete();
    };
    init();
})();
