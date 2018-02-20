(function () {
    var flower = null;
    var cm = new top.common(document);

    var self = this;
    var timer4search;
    var user = null;
    var virtualArray = null;
    var currentUser = null;

    var init = function () {
        var keyEl = cm.get("panel2_key");
        keyEl.onmouseup = keyEl.onkeyup = search;

        flower = frameElement.args;
        frameElement.setCaption(flower["name"]);

        showPanel1();
        readDetail();
    };

    var showPanel1 = function () {
        frameElement.removeAllBtn();
        frameElement.addBtn(cm.i18n("cancel"), function () {
            frameElement.cancel();
        });
        frameElement.addBtn(cm.i18n("next"), function () {
            if (cm.isEnough(flower["price"])) {
                showPanel2();
            } else {
                alert(cm.i18n("need_recharge"));
                cm.showPay({type: "r"});
            }
        }, "blue");
        cm.get("panel1").show();
        cm.get("panel2").hide();
    };

    var showPanel2 = function () {
        if (currentUser == null && cm.getUserId() != cm.getSpaceUser()['id']) {
            currentUser = cm.getSpaceUser();
            if (currentUser) {
                cm.get("panel2_key").val(currentUser["username"]);
                search();
            }
        }
        frameElement.removeAllBtn();
        frameElement.addBtn(cm.i18n("previous"), function () {
            showPanel1();
        });
        frameElement.addBtn(cm.i18n("send"), sendFlower, "blue");
        cm.get("panel2").style.display = "block";
        cm.get("panel1").style.display = "none";
    };

    var readDetail = function () {
        cm.ajax("index.php?m=Index&c=Gift&a=detail", {flowerId: flower["id"]}, function (res) {
            if (res["status"] == 'success') {
                flower = res["data"];
                cm.get("photo").src = cm.getGiftImgBySize(flower["img"], 0);
                cm.get("words").val(flower["words"]);
                cm.get("prop_name").html(flower["name"]);
                cm.get("prop_price").html(flower["price"]);
                cm.get("prop_describe").html(flower["descri"]);
                cm.get("prop_introduce").html(flower["introduce"]);
                cm.get("prop_material").html(flower["material"]);
                cm.get("email").html(flower["email"]);
            }
            frameElement.complete();
        });
    };
    var showStatus = function () {
        var type = arguments[0];
        var outer = cm.get("panel2_icon");
        var name = cm.get("panel2_user");
        outer.html("");
        name.html("");

        if (type == 0) {
            name.removeCls("panel2_user_loading");
        } else if (type == 1) {
            name.addCls("panel2_user_loading");
        } else {
            name.removeCls("panel2_user_loading");
            name.html(currentUser["username"]);

            var img = document.createElement("img");
            img.src = cm.getImgBySize(currentUser["header"], 180);//cm.getAvatarBySize(currentUser["icon"], "120", currentUser["gender"]);
            outer.appendChild(img);
        }
    };
    var search = function () {
        var account = cm.getUser()["username"];
        var input = cm.get("panel2_key");
        var val = input.value;
        var run = function () {
            cm.ajax("index.php?m=Index&c=User&a=search", {name: input.val()}, function (msg) {
                if (msg["status"] == 'success') {
                    currentUser = msg["data"];
                    showStatus(3);
                } else {
                    showStatus(0);
                }
            });
        };

        if (val == account) {
            showStatus(0);
        } else if (currentUser && val == currentUser["username"]) {
            showStatus(2);
        } else if (val == "") {
            showStatus(0);
        } else {
            showStatus(1);
            timer4search = setTimeout(run, 1000);
        }
    };
    var sendFlower = function () {
        var btn = this;
        var words = cm.get("words").value;
        words = words.replace(/^\s*|\s*cm/g, "");
        if (words.length > 500) {
            alert("Less of 500 words");
            return;
        }
        if (currentUser != null) {
            //   btn.disabled = true;
            cm.ajax("index.php?m=Index&c=Flower&a=sendGift", {
                fid: currentUser["id"],
                gid: flower["id"],
                words: words,
                type: 'real'
            }, function (msg) {
                var status = msg["status"];
                if (status == 'success') {
                    var balance = msg["balance"];
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
        } else {
            alert("送给哪个？");
        }
    };
    init();
})();