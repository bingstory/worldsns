// JavaScript Document
(function () {
    var self = this;
    var index = 0;
    var cm = new top.common(document);
    var user;
    var toggleLook = function (arr, isLook) {
        for (var i = 0, len = arr.length; i < len; i++) {
            var id = arr[i];
            cm.get(id)[isLook ? "hide" : "show"]();
            cm.get(id + "_look")[isLook ? "show" : "hide"]();
        }
    };
    var setVal = function (arr) {
        for (var i = 0, len = arr.length; i < len; i++) {
            var k = arr[i];
            if (k == 'work') {
                cm.get(k).val(user['worker']);
            }else{
                cm.get(k).val(user[k]);
            }
        }
    };
    var setHtml = function (arr, is18Arr) {
        for (var i = 0, len = arr.length; i < len; i++) {
            var k = arr[i];
            var v = is18Arr ? (cm.i18n(k)[user[k]]) : user[k];
            if (k == 'about') {
                v = user['mood_content']; 
            }
            if (k == 'work') {
                v =  user['worker'];
            }
            if (k == 'gender') {
                v = cm.i18n(k)[user['sex']];
            }
            //jQueryObject.html( [ htmlString ] ): 返回、设置obj的html内容
            cm.get(k + "_look").html(v);
        }
    };
    var getLang = function (code) {
        var langList = cm.getLangList();
        var codeList = cm.getCodeList();
        for (var i = 0, len = codeList.length; i < len; i++) {
            if (codeList[i] == code) {
                return langList[i];
            }
        }
    };
    //执行的第一个函数：初始化（也可改变）页面的"显示区（id）"的内容
    var initUserLook = function () {
        //var birth = new Date(user["year"],user["month"],user["day"]);
        //cm.print(user["year"]+'-'+user["month"]+'-'+user["day"] + "\t" + birth.toLocaleDateString() + "\t" + birth.getDate() + "\t" + cm.formatDate(birth, "yyyy-MM-dd HH:mm:ss") + "\t" + birth.getHours());
        //cm.print((birth.getMonth() + 1) + "-" + birth.getDate() + "-" + birth.getFullYear());
        //"birth_look"生日（显示）DIV的id。
        var month = cm.i18n("month");
        cm.get("birth_look").html(user["day"] + "-" + month[user["month"]] + "-" + user["year"]);

        setHtml(["about", "work", "country", "city"]);
        setHtml(["relationship", "sexuality", "education", "gender"], true);
        //"xxx_look"分别为语言、身高、体重、收入（显示）DIV的id。
        cm.get("language_look").html(getLang(user["language"]));
        cm.get("height_look").html(cm.getHeightList()[user["height"]]);
        cm.get("weight_look").html(cm.getWeightList()[user["weight"]]);
        cm.get("income_look").html(cm.getIncomeList()[user["income"]]);
    };
    //执行的第二函数：如果是在“自己”的空间，
    var initBtn = function () {
        //获取所有的“编辑”、“保存”按钮
        var editList = document.getElementsByName("btn_edit");
        var postList = document.getElementsByName("btn_post");
        // alert("editList.length = "+ editList.length);
        //给所有的“编辑”、“保存”按钮，添加事件
        for (var i = 0, len = editList.length; i < len; i++) {
            var edit = cm.get(editList[i]);
            var post = cm.get(postList[i]);
            // obj.show = function () {
            // obj.style.display = arguments[0] || "block";
            // };
            edit.show();
            //index()方法的返回值为Number类型，返回指定元素的索引位置(从0开始算起)。
            edit.index = post.index = i;

            edit.onclick = function () {
                this.hide();
                self["edit" + this.index]();
                cm.get(postList[this.index]).show();
                //common.js中：
                // this.doHome = function () {
                //     if (top.home) {
                //         top.home[arguments[0]](arguments[1], arguments[2]);
                //     }
                // };
                //cm.doHome("freshSpace");
            };

            post.onclick = function () {
                this.hide();
                cm.get(editList[this.index]).show();
                self["post" + this.index]();
               // cm.doHome("freshSpace");
            };
        }
    };


    this.edit0 = function () {
        toggleLook(["about"]);
        cm.get("about").val(user["mood_content"]);
    };
    this.edit1 = function () {
        toggleLook(["birth", "language", "weight", "height"]);

        var sm = cm.get("birth_month");
        var sd = cm.get("birth_day");
        var sy = cm.get("birth_year");
        var sl = cm.get("language");
        var sw = cm.get("weight");
        var sh = cm.get("height");

        if (!this.paint1) {
            var paintBirth = function () {
                for (var i = 1; i < 13; i++) {
                    var om = cm.get(new Option());
                    om.val(i);
                    om.html(cm.i18n("month")[i]);
                    sm.append(om);
                }
                for (i = 1; i < 32; i++) {
                    var od = cm.get(new Option());
                    od.html(i);
                    od.val(i);
                    sd.append(od);
                }
                for (i = 1920; i < 1995; i++) {
                    var oy = cm.get(new Option());
                    oy.html(i);
                    oy.val(i);
                    sy.appendChild(oy);
                }

            };
            var paintLanguage = function () {
                var langList = cm.getLangList();
                var codeList = cm.getCodeList();
                for (var i = 0, len = langList.length; i < len; i++) {
                    var ol = cm.get(new Option());
                    ol.html(langList[i]);
                    ol.val(codeList[i]);
                    sl.append(ol);
                }
            };
            var paintWeight = function () {
                var wList = cm.getWeightList();
                for (var i = 0, len = wList.length; i < len; i++) {
                    var ow = cm.get(new Option());
                    ow.html(wList[i]);
                    ow.val(i);
                    sw.append(ow);
                }
            };
            var paintHeight = function () {
                var hList = cm.getHeightList();
                for (var i = 0, len = hList.length; i < len; i++) {
                    var oh = cm.get(new Option());
                    oh.html(hList[i]);
                    oh.val(i);
                    sh.append(oh);
                }
            };
            paintBirth();
            paintLanguage();
            paintWeight();
            paintHeight();
            this.paint1 = true;
        }

        var birth = new Date(user["birth"]);
        sm.val(user['month']);
        sd.val(user['day']);
        sy.val(user['year']);
        setVal(["weight", "height", "language"]);
    };
    this.edit2 = function () {
        var keyArr = ["sexuality", "relationship"];
        var ss = cm.get("sexuality");
        var rs = cm.get("relationship");
        if (!this.paint2) {
            var sList = cm.i18n("sexuality");
            var rList = cm.i18n("relationship");
            for (var i = 0, len4i = sList.length; i < len4i; i++) {
                var s = sList[i];
                var os = cm.get(new Option());
                os.value = i;
                os.html(s);
                ss.append(os);
            }
            for (var j = 0, len4j = rList.length; j < len4j; j++) {
                var r = rList[j];
                var or = cm.get(new Option());
                or.value = j;
                or.html(r);
                rs.append(or);
            }
            this.paint2 = true;
        }
        setVal(keyArr);
        toggleLook(keyArr);
    };

    this.edit3 = function () {
        var keyArr = ["education", "work", "income"];
        var se = cm.get("education");
        var si = cm.get("income");

        if (!this.paint3) {
            var eList = cm.i18n("education");
            var iList = cm.getIncomeList();
            for (var i = 0, len4i = eList.length; i < len4i; i++) {
                var e = eList[i];
                var oe = cm.get(new Option());
                oe.value = i;
                oe.html(e);
                se.append(oe);
            }
            for (var j = 0, len4j = iList.length; j < len4j; j++) {
                var m = iList[j];
                var om = cm.get(new Option());
                om.value = j;
                om.html(m);
                si.append(om);
            }
            this.paint3 = true;
        }
        setVal(keyArr);
        toggleLook(keyArr);
    };
    this.edit4 = function () {
        var keyArr = ["country", "city"];
        toggleLook(keyArr);
        setVal(keyArr);
    };
    this.post0 = function () {
        var about = cm.get("about").val();
        if (!cm.isEmpty(about)) {
            cm.ajax("index.php?m=Index&c=Space&a=editAbout", {about: about}, function (res) {
                if (res["status"] == 'success') {
                    about = res["data"];
                    cm.get("about").val(about['mood_content']);
                    cm.get("about_look").html(about['mood_content']);
                    user["mood"] = about['mood'];
                    user["mood_content"] = about['mood_content'];
                    toggleLook(["about"], true);
                }
            });
        }
    };
    this.post1 = function () {
        var year = cm.get("birth_year").val();
        var month = cm.get("birth_month").val();
        var day = cm.get("birth_day").val();
        var weight = cm.get("weight").val();
        var height = cm.get("height").val();
        var language = cm.get("language").val();
        var arg = {'year':year, month:month, day:day, weight: weight, height: height, language: language};
        cm.ajax("index.php?m=Index&c=Space&a=editBase", arg, function (res) {
            if (res["status"] == 'success') {
                user["year"] = year;
                user["month"] = month;
                user["day"] = day;
                user["height"] = height;
                user["weight"] = weight;
                user["language"] = language;
                cm.get("birth_look").html(year + "-" + cm.i18n("month")[month] + "-" + day);
                cm.get("language_look").html(getLang(language));
                cm.get("height_look").html(cm.getHeightList()[height]);
                cm.get("weight_look").html(cm.getWeightList()[weight]);
                toggleLook(["height", "weight", "birth", "language"], true);
            }
        });
    };
    this.post2 = function () {
        var sexuality = cm.get("sexuality").val();
        var relationship = cm.get("relationship").val();
        var arg = {sexuality: sexuality, relationship: relationship};
        cm.ajax("index.php?m=Index&c=Space&a=editRelation", arg, function (res) {
            if (res["status"] == 'success') {
                user["sexuality"] = sexuality;
                user["relationship"] = relationship;
                setHtml(["sexuality", "relationship"], true);
                toggleLook(["sexuality", "relationship"], true);
            }
        });
    };
    this.post3 = function () {
        var education = cm.get("education").val();
        var work = cm.get("work").val();
        var income = cm.get("income").val();
        var arg = {education: education, work: work, income: income};
        cm.ajax("index.php?m=Index&c=Space&a=editEducation", arg, function (res) {
            if (res["status"] == 'success') {
                user["education"] = education;
                user["worker"] = work;
                user["income"] = income;
                setHtml(["education"], true);
                setHtml(["work"], false);
                cm.get("income_look").html(cm.getIncomeList()[income]);
                toggleLook(["education", "income", "work"], true);
            }
        });
    };
    this.post4 = function () {
        var country = cm.get("country").val();
        var city = cm.get("city").val();
        var arg = {country: country, city: city};
        cm.ajax("index.php?m=Index&c=Space&a=editPlace", arg, function (res) {
            if (res["status"] == 'success') {
                user["country"] = country;
                user["city"] = city;
                cm.setSpaceUser(user);
                setHtml(["country", "city"]);
                toggleLook(["country", "city"], true);
            }
        });
    };
    setTimeout(init,2000);
    function init() {
        user = cm.getSpaceUser();
        initUserLook();
        initBtn();
    }
    //原来的空间的判断：(如果是自己的空间，才能修改；否则，不能修改)
    // if (cm.isSelf()) {
    //     initBtn();
    // }
    //原来的空间编辑后的"更新"
    //cm.doHome("freshSpace");
})
();
