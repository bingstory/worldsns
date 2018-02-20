// JavaScript Document
(function () {
    var self = this;
    var user = null;
    var cm = new top.common(document);
    var u_btn = cm.get("u_btn");
    var r_btn = cm.get("r_btn");
    var initPage = function () {
        var type = (frameElement.args || {type: "u"})["type"];
        var panel_1 = cm.get("panel_1");
        var panel_2 = cm.get("panel_2");
        var tab_1 = cm.get("tab_1");
        var tab_2 = cm.get("tab_2");
        tab_1.hover("tab_hover");
        tab_2.hover("tab_hover");
        tab_1.onclick = function () {
            this.addCls("tab_focus");
            tab_2.removeCls("tab_focus");
            panel_1.show();
            panel_2.hide();
        };
        tab_2.onclick = function () {
            this.addCls("tab_focus");
            tab_1.removeCls("tab_focus");
            panel_2.show();
            panel_1.hide();
        };

        if ("r" == type) {
            tab_2.onclick();
        } else {
            tab_1.onclick();
        }
        u_btn.payType = "u";
        r_btn.payType = "r";
        u_btn.onclick = r_btn.onclick = submitOrder;
        cm.get("close").onclick = frameElement.cancel;
        cm.get("r_balance_val").html(cm.getUserGold());
        frameElement.complete();
    };
    /*var sub = function() {
        var type = this.payType;
        var way = this.way;//鏀粯鏂瑰紡
        var product = this.product;//浜у搧
        setTimeout(submitOrder(type,way,product),5000);
    }*/
//绫诲瀷 鏀粯鏂瑰紡 鍊�
    var initUpgrade = function () {
        var curUpgradeOpt = cm.get("u_opt_1");
        var curUpgradeWay = cm.get("u_type_0");
        for (var i = 0; i < 8; i++) {
            var o = cm.get("u_opt_" + i);
            o.index = i;
            o.onclick = function () {
                curUpgradeOpt.removeCls("u_opt_focus");
                this.addCls("u_opt_focus");
                curUpgradeOpt = this;
                u_btn.product = this.index;
            }
        }
        for (var j = 0; j < 3; j++) {
            var t = cm.get("u_type_" + j);
            t.index = j;
            t.onclick = function () {
                curUpgradeWay.removeCls("u_bar_focus");
                this.addCls("u_bar_focus");
                curUpgradeWay = this;
                u_btn.way = this.index;
            }
        }
        curUpgradeOpt.onclick();
        curUpgradeWay.onclick();
    };
    var initRecharge = function () {
        var curUpgradeOpt = cm.get("r_opt_3");
        var curUpgradeWay = cm.get("r_type_0");

        for (var i = 0; i < 6; i++) {
            var o = cm.get("r_opt_" + i);
            o.index = i;
            o.onclick = function () {
                curUpgradeOpt.removeCls("r_opt_focus");
                this.addCls("r_opt_focus");
                curUpgradeOpt = this;
                r_btn.product = this.index;
            }
        }
        for (var j = 0; j < 2; j++) {
            var t = cm.get("r_type_" + j);
            t.index = j;
            t.onclick = function () {
                curUpgradeWay.removeCls("u_bar_focus");
                this.addCls("u_bar_focus");
                curUpgradeWay = this;
                r_btn.way = this.index;
            }
        }
        curUpgradeOpt.onclick();
        curUpgradeWay.onclick();
    };

    /*var submitOrder = function (type,way,product) {
        var args = [];
        var customId = cm.getUserId();
        var doSubmit = function () {
            var form = cm.get("pay_form");
            var appendField = function () {
                for (var p in args) {
                    var item = cm.mk("input");
                    item.type = "hidden";
                    item.name = item.id = p;
                    item.val(args[p]);
                    form.append(item);
                }
            };
            form.html("");
            form.action = way == 0 ? "index.php?m=Index&C=Pay&a=order&t=paypal" : "index.php?m=Index&C=Pay&a=order&t=ali";
            appendField();
            form.submit();
        };

        if (type == "r") {//鑷畾涔夊厖鍊�
            var valArray = [20, 50, 100, 200, 500, -1];
            product = valArray[product];
            if (product == -1) {
                product = cm.get("rechargeValue").val();
            }
            if (product < 20) {
                alert(">20 Gold");
            } else {
                args = {type: type, way:way,income: product, customId: customId};
                cm.ajax("index.php?m=Index&c=Pay&a=order", args, function (msg) {
                    if (msg["status"] == 'success') {
                            cm.get('item_name').val(msg.data.goods_type);
                            cm.get('item_number').val(msg.data.order_sn);
                            cm.get('amount').val(msg.data.amount);
                            var paypalform = cm.get('paypal');
                            paypalform.submit();
                    } else {
                        alert("error");
                    }
                });
            }
        } else {//鍗囩骇
            var upobj =  document.getElementsByName("upobj");
            var upobjstr = '';
            for(var i=0;i<upobj.length;i++){
                if(upobj[i].checked){
                    upobjstr = upobj[i].value;
                    break;
                }
            }
            if (upobjstr == 1) {
                var helpId = customId;
            }else{
                var helpId = cm.get('help_id').val();
            }
            product = ["1-1-20", "1-3-50", "1-6-90", "1-12-150", "2-1-99", "2-3-249", "2-6-449", "2-12-749"][product].split("-");
            args = {
                level: product[0],
                month: product[1],
                income: product[2],
                customId: helpId
            };
            if (way < 2) {
                args["type"] = type;
                args["way"] = way;
                cm.ajax("index.php?m=Index&c=Pay&a=order", args, function (msg) {
                    if (msg["status"] == 'success') {
                        if (msg.data.pay_type == 'paypal') {
                            //cm.get('item_name').val(msg.data.goods_type);
                            //cm.get('item_number').val(msg.data.order_sn);
                            cm.get('amount').val(msg.data.amount);
                            var paypalform = cm.get('paypal');
                            paypalform.submit();
                        }
                    } else {
                        alert("error");
                    }
                });
            } else {//閲戝竵
                if (cm.getUserGold() >= parseFloat(args["income"])) {
                    cm.ajax("index.php?m=Index&c=Pay&a=goldUpgrade", args, function (msg) {
                        if (msg["status"] == 'success') {
                            alert("ok");
                            frameElement.cancel();
                        } else if (msg["status"] == 'gold not enough') {
                            alert(cm.i18n("need_recharge"));
                        } else {
                            alert("error");
                        }
                    });
                } else {
                    alert(cm.i18n("need_recharge"));
                }
            }
        }
        //window.open("view_paypal?userId=" + MUtil4Common.getUserId() + "&type=" + type + "&membership=" + atr[0] + "&month=" + atr[1] + "&income=" + atr[2] + "&customId=" + customId);
    };*/
    var submitOrder = function () {
        var type = this.payType;
        var way = this.way;//支付方式
        var product = this.product;//产品
        var args = [];
        var customId = cm.getUserId();
        var doSubmit = function () {
            var form = cm.get("pay_form");
            var appendField = function () {
                for (var p in args) {
                    var item = cm.mk("input");
                    item.type = "hidden";
                    item.name = item.id = p;
                    item.val(args[p]);
                    form.append(item);
                }
            };
            form.html("");
            form.action = way == 0 ? "index.php?m=Index&c=Pay&a=order&t=paypal" : "index.php?m=Index&c=Pay&a=order&t=ali";
            appendField();
            form.submit();
        };

        if (type == "r") {//自定义充值
            var valArray = [20, 50, 100, 200, 500, -1];
            product = valArray[product];
            if (product == -1) {
                product = cm.get("rechargeValue").val();
            }
            if (product < 0) {
                alert(">20 Gold");
            } else {
                args = {type: type, way:way,income: product, customId: customId};
                doSubmit();
            }
        } else {//升级
            var upobj =  document.getElementsByName("upobj");
            var upobjstr = '';
            for(var i=0;i<upobj.length;i++){
                if(upobj[i].checked){
                    upobjstr = upobj[i].value;
                    break;
                }
            }
            if (upobjstr == 1) {
                var helpId = customId;
            }else{
                var helpId = cm.get('help_id').val();
            }
            if (!helpId) {
                alert(cm.i18n('help friend'));
                return false;
            }
            product = ["1-1-20", "1-3-50", "1-6-90", "1-12-150", "2-1-99", "2-3-249", "2-6-449", "2-12-749"][product].split("-");
            args = {
                level: product[0],
                month: product[1],
                income: product[2],
                customId: helpId
            };
            if (way < 2) {
                args["type"] = type;
                args["way"] = way;
                doSubmit();
            } else {//金币
                if (cm.getUserGold() >= parseFloat(args["income"])) {
                    cm.ajax("index.php?m=Index&c=Pay&a=goldUpgrade", args, function (msg) {
                        if (msg["status"] == 'success') {
                            alert("ok");
                            frameElement.cancel();
                        } else if (msg["status"] == 'gold not enough') {
                            alert(cm.i18n("need_recharge"));
                        } else {
                            alert("error");
                        }
                    });
                } else {
                    alert(cm.i18n("need_recharge"));
                }
            }
        }
        //window.open("view_paypal?userId=" + MUtil4Common.getUserId() + "&type=" + type + "&membership=" + atr[0] + "&month=" + atr[1] + "&income=" + atr[2] + "&customId=" + customId);
    };
    initPage();
    initUpgrade();
    initRecharge();
    cm.get('search').onclick = function() {
        username = cm.get('payother_name').val();
        cm.ajax("index.php?m=Index&c=User&a=search", {name:username}, function (msg) {
            if (msg["status"] == 'success') {
                alert('ok');
                cm.get('help_id').val(msg.data.id);
            }  else {
                alert(cm.i18n("the user does not exist"));
                return false;
            }
        });
    } 
})();
