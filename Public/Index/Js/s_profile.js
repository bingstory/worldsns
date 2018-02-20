// JavaScript Document
(function () {
    var cm = new top.common(document);
    var faceUtil = new top.Gwx.Face(document);
    var index = 0;
    var pageSize = cm.getPageSize();
    var isAjax = false;
    var user = cm.getSpaceUser();

    var initPage = function () {
        if (!cm.isSelf() && cm.getUserGender() != user["sex"]) {
            cm.get("west_bar").show();
            cm.get("west_bar_gift").onclick = function () {
                //cm.showVirtual(user);
                cm.doHome('showHome','Giftall');
            };
            cm.get("west_bar_chat").onclick = function () {
                cm.showChat(user);
            };
            cm.get("west_bar_favor").onclick = function () {
                cm.ajax("index.php?m=Index&c=First&a=favor", {favorId: user["id"]}, function (res) {
                    alert((res["status"] == 'success') ? "ok" : "error");
                });
            };
            cm.get("west_bar_like").onclick = function () {
                cm.ajax("index.php?m=Index&c=First&a=like", {likeId: user["id"]}, function (res) {
                    alert((res["status"] == 'success') ? "ok" : "error");
                });
            };
            cm.get("west_bar_report").onclick = function () {
                /*var t = window.prompt(cm.i18n("report reason"),"");
                if (t!=null && t!=""){
                    alert(t);
                }*/
                var service = cm.getService();
                service[1]['default'] = cm.i18n("report reason");
                if (cm.getUserGender() == 'male') {
                    cm.showChat(service[1]); 
                }else{
                    cm.showChat(service[3]);
                }
            }
            // cm.get("west_bar_flower").onclick = function () {
            //     cm.getHome().showHome("flower");
            //     //cm.getHome().freshHome("flower");
            // };
            // cm.get("west_bar_upgrade").onclick = function () {
            //     cm.showPay(user);
            // };
        }
        cm.doHome("freshSpace");
    };
    var initUser = function () {
        cm.get("user_about").html(user["mood_content"]);
        cm.get("user_work").html(user["worker"]);
        var dateObj = new Date();
        var year = dateObj.getFullYear();
        cm.get("user_age").html(year - user["year"]);
        cm.get("user_country").html(user["country"]);
        cm.get("user_city").html(user["city"]);
        cm.get("user_height").html(cm.getHeightList()[user["height"]]);
        cm.get("user_weight").html(cm.getWeightList()[user["weight"]]);
        cm.get("user_income").html(cm.getIncomeList()[user["income"]]);
        cm.get("user_education").html(cm.i18n("education")[user["education"]]);
        cm.get("user_sexuality").html(cm.i18n("sexuality")[user["sexuality"]]);
        cm.get("user_relationship").html(cm.i18n("relationship")[user["relationship"]]);
    };

    var initAlbum = function () {
        var photoList = [];
        var albumMap = user["albumMap"];
        var panel = cm.get("west_photo_list");



        var createPhoto = function(p) {

            var outer = cm.mk("div");
            var img = cm.mk("img");
            
            var complete = function () {
                img.show();
            };
            // var burl = p['url'];

            img.onerror = function () {
                complete();
                this.style.width = 71 + "px";
                this.style.height = 71 + "px";
            };

            img.onload = function () {
                complete();
                var img = this;
                var maxPx = 71;
                var w = img.width;
                var h = img.height;
                if (h > w) {
                    img.style.width = maxPx + "px";
                    img.style.height = parseInt(h * maxPx / w) + "px";
                } else {
                    w = parseInt((w * maxPx) / h);
                    img.style.height = maxPx + "px";
                    img.style.width = w + "px";
                    img.style.marginLeft = -(w - maxPx) / 2 + "px";
                }
            };

            img.onclick = function () {
                cm.showPic(this.src);
            };

            outer.cls("west_photo_outer west_photo_loading");

            // var p["url"] = "";
            // console.log(p);
            // var burls = p['url'];
            var url = "url";
            img.src = cm.getImgBySize(p['url'], 80);
            outer.append(img);
            panel.append(outer);
        };
        for (var id in albumMap) {
            photoList = photoList.concat(albumMap[id]["list"]);
            if (photoList.length > 12) {
                break;
            }
        }

        // console.log(photoList);

        var len = Math.min(photoList.length, 12);
        for (var i = 0; i < len; i++) {
            if(photoList[i] != undefined){
                createPhoto(photoList[i]);
            }else{
                // alert('error');
            }
            
        }
    };

    var queryDynamic = function () {
        if (!isAjax) {
            if (index == 0 || cm.isMember() || cm.isInMember()) {
                cm.ajax("index.php?m=Index&c=Dynamic&a=getOneList", {index: index++, size: pageSize, sid: cm.getSpaceId()}, function (t) {
                    if (t["status"] == 'success') {
                        var list = t["data"];
                        var render = cm.get("east");
                        var len = list.length;
                        for (var i = 0; i < len; i++) {
                            render.append(createDItem(list[i]));
                            cm.doHome("freshSpace");
                        }
                        isAjax = len != pageSize;
                    } else {
                        alert("error");
                    }
                });
            } else if (!cm.isBlocked()) {
                alert(cm.i18n("need_upgrade"));
                cm.showPay({type: "u"});
            }
        }
    };

    var createGoogleTransPop = function (fn) {
        var row;
        var table = cm.mk("table");
        var langList = cm.getLangList();
        var codeList = cm.getCodeList();
        table.cls("public_trans_list");

        for (var i = 0; i < 12; i++) {
            if (i % 4 == 0) {
                row = table.insertRow(i / 4);
            }
            var td = cm.get(row.insertCell(i % 4));
            var a = cm.mk("a");
            a.cls("public_trans_item");
            a.html(langList[i]);
            a.code = codeList[i];
            a.onclick = function () {
                fn(this.code);
            };
            td.append(a);
        }
        return table;
    };

    var createDItem = function (d) {
        var item = cm.mk("div");
        var icon = cm.mk("img");
        var arrow = cm.mk("em");
        var content = d["content"];
        var transResult;

        var drawCaption = function () {
            var caption = cm.mk("div");
            var name = cm.mk("span");
            var time = cm.mk("span");

            caption.cls("d_caption");
            name.cls("d_name");
            time.cls("d_time");

            name.html(user["username"]);
            time.html(cm.formatDate(new Date(d["created"]*1000), "yyyy-MM-dd HH:mm"));

            caption.append(name);
            caption.append(time);

            item.append(caption);
        };

        var drawCenter2 = function () {
            // alert();
            var center = cm.mk("div");
            var strText = content;
            var urls = d["urls"];

            center.cls("d_center");

            if (!cm.isEmpty(strText)) {
                var text = cm.mk("div");
                transResult = cm.mk("div");

                strText = cm.formatText(strText);
                strText = faceUtil.covert(strText);

                text.cls("d_text");
                transResult.cls("d_trans_result");
                text.html(strText);
                center.append(text);
                center.append(transResult);
            }
            if (urls.length > 0) {
                for (var i = 0; i < urls.length; i++) {
                    var img = cm.mk("img");
                    img.cls("d_img");
                    img.onclick = function () {
                        cm.showPic(this.src);
                    };
                    img.onload = function () {
                        cm.doHome("freshSpace");
                    };
                    center.append(img);
                    img.src = cm.getImgBySize(urls[i], 0);
                }
            }
            item.append(center);
        };

        var drawBar = function () {
            var createBtn = function (key) {
                var btn = cm.mk("a");
                var btnIcon = cm.mk("em");
                var btnTxt = cm.mk("span");

                btnIcon.cls("d_btn_icon d_icon_" + key);
                btnTxt.html(cm.i18n(key));
                btn.append(btnIcon);
                btn.append(btnTxt);

                btn.cls("d_btn d_" + key);
                return btn;
            };

            var bar = cm.mk("div");
            bar.cls("d_bar");

            if (!cm.isEmpty(content)) {
                var trans = createBtn("trans");

                trans.hover("", function (t) {
                    var viewer = trans.viewer;
                    if (!trans.render) {
                        var arrow = cm.mk("dd");
                        viewer = cm.mk("dl");

                        arrow.cls("d_trans_arrow");
                        viewer.cls("d_trans_viewer");

                        viewer.append(createGoogleTransPop(
                            function (code) {
                                var level = cm.getMemberShip();
                                if (level < 2) {
                                    var gold = cm.getUserGold();
                                    var money = content.length*0.01;
                                    if (parseFloat(gold) < parseFloat(money) && !cm.isInMember()) {
                                        alert(cm.i18n('need_recharge'));
                                        cm.showPay({type: "r"});
                                        return false;
                                    }
                                }
                                viewer.hide();
                                cm.ajax("index.php?m=Index&c=Trans&a=translate", {to: code, content: content,'source_id':user["id"]}, function (res) {
                                    if (res["status"] == 'success') {
                                        transResult.html(res["data"]);
                                        cm.doHome("freshSpace");
                                    }
                                });
                            }
                        ));
                        viewer.append(arrow);
                        trans.append(viewer);

                        trans.render = true;
                        trans.viewer = viewer;
                    }
                    if (t) {
                        clearTimeout(trans.timer);
                        viewer.show();
                    } else {
                        trans.timer = setTimeout(viewer.hide, 200);
                    }
                });

                bar.append(trans);
            }

            if (cm.isSelf()) {
                var remove = createBtn("remove");
                remove.onclick = function () {
                    cm.ajax("index.php?m=Index&c=Dynamic&a=remove", {dynamicId: d["id"]}, function (res) {
                        if (res["status"] == 'success') {
                            item.parentNode.removeChild(item);
                            cm.doHome("freshSpace");
                            alert("ok");
                        } else {
                            if (res['msg'] == 'mood') {
                                alert(cm.i18n("can't remove mood"));
                            }else{
                                alert("error");
                            }
                        }
                    });
                };
                bar.append(remove);
            } else {
                var report = createBtn("report");
                bar.append(report);
            }

            item.append(bar);
        };

        drawCaption();
        drawCenter2();
        drawBar();

        item.cls("d_item");
        return item;
    };
    initPage();
    initUser();
    initAlbum();
    cm.bindScrollEvent(queryDynamic, true);
})();
