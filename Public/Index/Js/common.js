// JavaScript Document
var cache = {};//缓存
var recommendMap = {}; 
var common = function () {
    var self = this;
    var doc = arguments[0] || document;
    this.logout = function () {
        //self.removeCookie("name");
        top.sendMsgExternal(cache.user["id"],'logout');
        top.location.href = "{:U('Index/Index/index')}";
    };
    this.isH5 = function () {
        return typeof(Worker) != "undefined";
    };
    this.isMember = function () {
        var user = cache.user;
        return user["is_member"] == 1;
    };
    this.isBlocked = function () {
        var user = cache.user;
        return user["status"] == 0;
    };
    this.getRole = function () {
        return cache.user["level"];
    };
    this.isInMember = function () {
        return cache.user["inner_member"] == 1;
    };
    this.getMemberShip = function () {
        return cache.user["level"];
    };
    this.setInteract = function (i) {
        cache.interact = i;
    };
    this.getInteract = function () {
        return cache.interact;
    };
    this.getPageSize = function () {
        return 20;
    };
    this.getHome = function () {
        return top.home;
    };
    this.doHome = function () {
        if (top.home) {
            top.home[arguments[0]](arguments[1], arguments[2]);
        }
    };
    this.isSelf = function () {
        return cache.sid == cache.user["id"];
    };
    this.getToken = function () {
        return self.getCookie("token");
    };
    this.getService = function () {
        return cache["service"];
    };
    this.setSpaceId = function (newSid) {
        cache.sid = newSid || cache.user["id"];
    };
    this.getSpaceId = function () {
        return cache.sid;
    };
    this.getUserId = function () {
        return cache.user["id"];
    };
    this.getUserGender = function () {
        return cache.user["sex"];
    };
    this.getUserGold = function () {
        return cache.user["gold"];
    };
    this.setCache = function (o) {
        cache = o;
    };
    this.setUser = function (u) {
        cache.user = u;
    };
    /*this.getServer = function (name) {
        return cache["server"]["server_" + name];
    };*/
    this.getSticker = function () {
        return cache.sticker;
    };
    this.i18n = function (p) {
        return cache.i18n[p];
    };
    this.getUser = function () {
        return cache.user;
    };
    this.setSpaceUser = function (su) {
        cache.spaceUser = su;
    };
    this.getSpaceUser = function () {
        return cache.spaceUser;
    };
    this.getWallArray = function () {
        return cache.wall;
    };
    this.getFlowerArray = function () {
        return cache.flower;
    };
    this.setFlowerArray = function (f) {
        cache.flower = f;
    };
    this.getVirtualArray = function () {
        return cache.virtual;
    };
    this.setVirtualArray = function (v) {
        cache.virtual = v;
    };

    this.checkIcon = function (isForced) {
        return self.getUser()["header"] != null;
    };
    this.isEnough = function (c) {
        var g = self.getUserGold();
        c = parseInt(c);
        g = parseInt(g); 
        return (g > 0) && (c <= g);
    };
    this.get = function (obj) {
        if (typeof obj == "string") {
            obj = doc.getElementById(obj);
        }
        if (obj == undefined || obj == null) {
            return null;
        }
        obj.setSrc = function (s) {
            var t = arguments[1];
            this.onerror = function () {
                if (t != 'female' && t != 'male') {
                    var g = self.getUserGender();
                    t = (g == 'male')?'female':'male';
                }
                this.src = "Public/Index/Images/gender_" + t + ".png";
            };
            this.src = s;
        };
        obj.val = function () {
            if (arguments.length == 1) {
                obj.value = arguments[0];
            }
            return obj.value;
        };
        obj.html = function () {
            if (arguments.length == 1) {
                var val = arguments[0];
                if (val == undefined) {
                    val = "";
                }
                obj.innerHTML = val;
            }
            return obj.innerHTML;
        };
        obj.hide = function () {
            obj.style.display = "none";
        };
        obj.show = function () {
            obj.style.display = arguments[0] || "block";
        };
        obj.isVisible = function () {
            return this.style.display != "none";
        };
        obj.append = function (t) {
            obj.appendChild(t);
        };
        obj.remove = function (t) {
            obj.removeChild(t);
        };
        obj.cls = function (c) {
            obj.className = c;
        };
        obj.addCls = function (c) {
            obj.removeCls(c);
            obj.className += " " + c;
        };
        obj.removeCls = function (c) {
            var regex = new RegExp("\\s*(" + c + ")", "g");
            if (this.className) {
                this.className = this.className.replace(regex, "");
            }
        };
        obj.hover = function (h) {
            var fn = arguments[1];
            this.onmouseover = function () {
                if (h && h != "" && this.className.indexOf("focus") == -1) {
                    this.className += " " + h;
                }
                if (fn) {
                    fn(1);
                }
            };
            this.onmouseout = function () {
                if (h && h != "") {
                    var regex = new RegExp("\\s+(" + h + ")", "g");
                    this.className = this.className.replace(regex, "");
                }
                if (fn) {
                    fn(0);
                }
            };
        };
        return obj;
    };
    
    this.bindLocation = function (l) {
        setTimeout(function () {
            /*if (l.indexOf("s_") > -1) {
                l = l.replace("s_", "");
                l = "#" + self.getSpaceUser()["id"] + "." + l;
                // l = l+"/"+self.getSpaceUser()["simpleId"];
            } else if (l == "first") {
                l = "#home";
            } else {
                l = "#" + l;
            }*/
            if (l.indexOf('Space_') > -1) {
                l = "#"+l+"_"+self.getSpaceUser()['id'];
            }else if (l == 'first_index') {
                l = "#home";
            }else{
                l = "#"+l;
            }
            window.location = l;
        }, 100);
    };
    this.mk = function (t) {
        t = doc.createElement(t);
        t = self.get(t);
        return t;
    };
    this.getDlg = function () {
        return new top.Gwx.Dialog();
    };
    this.showPic = function (url) {
        this.getDlg().showPhoto(this.getImgBySize(url, 0));
    };
    this.showChat = function (u) {
        /*if (self.isMember() || self.getRole() == 4) {
            var dlg = self.getDlg();
            dlg.setArgs(u);
            dlg.showPage("index.php?m=Index&c=Chat&=showAdmin", 500, 120);
        } else if (!self.isBlocked()) {
            alert(self.i18n("need_upgrade"));
            self.showPay({type: "u"});
        }*/
        if (self.isMember() || self.isInMember()) {
            var dlg = self.getDlg();
            dlg.setArgs(u);
            dlg.showPage("index.php?m=Index&c=Chat&a=showChat", 500, 120);
        }else{
            alert(self.i18n("need_upgrade"));
            self.showPay({type: "u"});
        }
        
    };
    this.showVirtual = function (u) {
        //var dlg = self.getDlg();
        //dlg.setArgs(u);
        //dlg.showPage("index.php?m=Index&c=Virtual&a=index", 700, 430);
        var user = new Array();
        user['id'] = u['user_id'];
        user['username'] = u['username'];
        user['header'] = u['header'];
        this.setSpaceUser(user);
        this.doHome('showHome','Giftall');
    };
    this.showAuth = function () {
        var dlg = self.getDlg();
        dlg.showPage("index.php?m=Index&c=Auth&a=index", 700, 300);
    };
    //李杰 添加 设置
    this.showData = function () {
        var dlg = self.getDlg();
        dlg.showPage("Setting", 700, 300);
    };
    //左侧导航栏的“头像设置”（杰）
    // this.showAvatar = function () {
    //     var dlg = self.getDlg();
    //     if (arguments[0] == true) {
    //         dlg.hideClose();
    //         dlg.setArgs("force");
    //     }
    //     dlg.showPage("index.php?m=Index&c=Avatar&a=index", 594, 415);
    // };

    this.showPass = function () {
        var dlg = self.getDlg();
        dlg.setArgs();
        dlg.showPage("index.php?m=Index&c=User&a=showpass", 500, 200);
    };
    this.showSpot = function () {
        var dlg = self.getDlg();
        dlg.setArgs();
        dlg.showPage("index.php?m=Index&c=Spot&a=index", 500, 340);
    };
    this.showSticker = function () {
        var dlg = self.getDlg();
        dlg.hideTitle();
        dlg.showPage("index.php?m=Index&c=Sticker&a=index", 600, 600);
    };
    this.showFlower = function (flower) {
        var dlg = self.getDlg();
        dlg.setArgs(flower);
        dlg.showPage("index.php?m=Index&c=Dflower&a=index", 800, 450);
    };
    this.showPay = function (p) {
        var dlg = self.getDlg();
        dlg.hideTitle();
        dlg.setArgs(p);
        dlg.showPage("index.php?m=Index&c=Pay&a=index", 900, 520);
    };
    this.getImgBySize = function (src, size) {
        try {
            /* src = src || "";
             var r = /_(i|p|r)(\d+)\./g;
             r.exec(src);
             if (!self.isEmpty(RegExp.$1) && !self.isEmpty(RegExp.$2)) {
             var mode = "_" + RegExp.$1;
             var size_old = RegExp.$2;
             size = size || 0;
             src = src.replace((mode + size_old), mode + size);
             } else {}*/
            if (src) {
                src = src.replace(/_\d+\./gi, "."); 
                if (size != 0) {
                    var dotIndex = src.lastIndexOf(".");
                    src = src.substr(0, dotIndex) + "_" + size + src.substr(dotIndex);
                }
            } else {
                src = "#";
            }
        } catch (e) {
            src = "#";
        }
        return src;
    };
    this.getGiftImgBySize = function (src, size) {
        src = src || "";
        var r = /_(i|p|r)(\d+)\./g;
        r.exec(src);
        try {
            if (!self.isEmpty(RegExp.$1) && !self.isEmpty(RegExp.$2)) {
                var mode = "_" + RegExp.$1;
                var size_old = RegExp.$2;
                size = size || 0;
                src = src.replace((mode + size_old), mode + size);
            }
        } catch (e) {
            src = "";
        }
        return src;
    };
    this.getIncomeList = function () {
        return [self.i18n("less than") + " $30,000", "$30,000 - $45,000", "$45,000 - $60,000", "$60,000 - $75,000", "$75,000 - $150,000", self.i18n("more than") + " $150,000"];
    };
    this.getWeightList = function () {
        return [self.i18n("less than") + " 40 kg (88 pounds)", "41 - 50 kg (90 - 110 pounds)", "51 - 60 kg (111 - 132 pounds)", "61 - 70 kg (133 - 155 pounds)", "71 - 80 kg (156 - 176 pounds)", "81 - 90 kg (177 - 199 pounds)", "91 - 100 kg (200 - 220 pounds)", self.i18n("more than") + " 100 kg (220 pounds)"];
    };
    this.getHeightList = function () {
        return [self.i18n("shorter than") + " 150 cm (5'0\")", "151 - 160 cm (5'0\" - 5'2\")", "161 - 170 cm (5'2\" - 5'6\")", "171 - 180 cm (5'6\" - 5'9\")", "181 - 190 cm (5'9\" - 6'2\")", self.i18n("taller than") + " 191 cm (6'2\")"];
    };
    this.getLangList = function () {
        return self.i18n("language");
    };
    this.getCodeList = function () {
        return ["zh-cn", "zh-tw", "en-us", "ja", "ko-kr", "de", "es", "fra", "it", "nl", "pt", "ru"];
    };
    this.getEasyCodeList = function () {
        return ["中", "繁", "EN", "日", "KO", "DE", "ES", "FR", "IT", "NL", "PT", "RU"];
    };
    this.getRawLangList = function () {
        return ["中文-简体", "中文-繁体", "English", "日本語", "한국의", "Deutsch", "Español", "Français", "Italiano", "Nederlandse", "Português", "Русский"];
    };
    this.isNull = function (o) {
        return o == undefined || o == "undefined" || o == null || o.length == 0;
    };
    this.trim = function (str) {
        return str.replace(/(^\s+)|(\s+$)/g, "");
    };
    this.isEmpty = function (str) {
        if (!this.isNull(str)) {
            return this.trim(str) == 0;
        } else {
            return true;
        }
    };
    this.formatText = function (txt) {
        if (typeof txt == "string") {
            txt = txt.replace(/</g, "&lt;");
            txt = txt.replace(/>/g, "&gt;");
            txt = txt.replace(/(\r\n|\n)/g, "<br>");
            txt = txt.replace(/\s\s/g, "&nbsp;&nbsp;&nbsp;&nbsp;");
        }
        return txt;
    };
    this.json2str = function (o) {
        var arr = [];
        for (var p in o) {
            var v = String(o[p]);
            v = v.replace(/(<|>|\?|"|'|,|\:)/g, "\\$1");
            arr.push('"' + p + '":"' + v + '"');
        }
        return '{' + arr.join(',') + '}';
    };
    this.str2json = function (s) {
        try {
            s = eval("(" + s + ")");
        } catch (e) {
            self.print("str2json error:" + s);
        }
        return s;
    };
    this.printProp = function (arg) {
        var arr = [];
        for (var p in arg) {
            arr.push(p + " : " + arg[p]);
        }
        self.print("对象属性:\r\n" + arr.join("\r\n"));
    };
    this.goTop = function () {
        document.body.scrollTop = 0;
        document.documentElement.scrollTop = 0;
    };
    this.print = function (t) {
        if (window.console) {
            var time = self.formatDate(new Date(), "HH:mm:ss");
            window.console.log(time + "\t" + t);
        }
    };
    this.bindScrollEvent = function (fn, isFirst) {
        var d = document;
        var reachBottom = function () {
            var scrollTop = 0;
            var clientHeight = 0;
            var scrollHeight = 0;
            var dbe = d.body;
            var dde = d.documentElement;
            var bch = dbe.clientHeight;
            var dch = dde.clientHeight;

            if (dde && dde.scrollTop) {
                scrollTop = dde.scrollTop;
            } else if (dbe) {
                scrollTop = dbe.scrollTop;
            }
            if (bch && dch) {
                clientHeight = (bch < dch) ? bch : dch;
            } else {
                clientHeight = (bch > dch) ? bch : dch;
            }
            scrollHeight = Math.max(dbe.scrollHeight, dde.scrollHeight);
            return (scrollTop + clientHeight) > (scrollHeight - 20);
        };
        window.onscroll = function () {
            try {
                if (fn && reachBottom()) {
                    fn();
                }
            } catch (e) {
                self.print(e)
            }
        };
        if (isFirst) {
            fn();
        }
    };
    this.setCookie = function (name, value, days) {
        days = days || 1;
        var exp = new Date();
        exp.setTime(exp.getTime() + days * 24 * 60 * 60 * 1000);
        name = name + document.domain.replace(/\./g, "") + "v3";
        document.cookie = name + "=" + encodeURIComponent(value) + ";expires=" + exp.toGMTString() + ";path=/";
    };

    this.getCookie = function (n) {
        n = n + document.domain.replace(/\./g, "") + "v3";
        var arr, reg = new RegExp("(^| )" + n + "=([^;]*)(;|$)");
        if (arr = document.cookie.match(reg)) {
            return decodeURIComponent(arr[2]);
        } else return null;
    };

    this.removeCookie = function (n) {
        var cval = self.getCookie(n);
        var exp = new Date();
        exp.setTime(exp.getTime() - 10000000000);
        n = n + document.domain.replace(/\./g, "") + "v3";
        if (cval != null) document.cookie = n + "=" + escape(cval) + ";expires=" + exp.toGMTString() + ";path=/";
    };
    this.formatDate = function (d, mask) {
        var zeroize = function (value, length) {
            if (!length) length = 2;
            value = String(value);
            for (var i = 0, zeros = ''; i < (length - value.length); i++) {
                zeros += '0';
            }
            return zeros + value;
        };
        return mask.replace(/"[^"]*"|'[^']*'|\b(?:d{1,4}|m{1,4}|yy(?:yy)?|([hHMstT])\1?|[lLZ])\b/g, function ($0) {
            switch ($0) {
                case 'd':
                    return d.getDate();
                case 'dd':
                    return zeroize(d.getDate());
                case 'M':
                    return d.getMonth() + 1;
                case 'MM':
                    return zeroize(d.getMonth() + 1);
                case 'yy':
                    return String(d.getFullYear()).substr(2);
                case 'yyyy':
                    return d.getFullYear();
                case 'h':
                    return d.getHours() % 12 || 12;
                case 'hh':
                    return zeroize(d.getHours() % 12 || 12);
                case 'H':
                    return d.getHours();
                case 'HH':
                    return zeroize(d.getHours());
                case 'm':
                    return d.getMinutes();
                case 'mm':
                    return zeroize(d.getMinutes());
                case 's':
                    return d.getSeconds();
                case 'ss':
                    return zeroize(d.getSeconds());
                case 'l':
                    return zeroize(d.getMilliseconds(), 3);
                case 'L':
                    var m = d.getMilliseconds();
                    if (m > 99) m = Math.round(m / 10);
                    return zeroize(m);
                case 'tt':
                    return d.getHours() < 12 ? 'am' : 'pm';
                case 'TT':
                    return d.getHours() < 12 ? 'AM' : 'PM';
                case 'Z':
                    return d.toUTCString().match(/[A-Z]+$/);
                default:
                    return $0.substr(1, $0.length - 2);
            }
        });
    };
    this.ajax = function (server, data, handler) {
        var obj = ["device=0"];
        if (data != null) {
            for (var k in data) {
                obj.push(k + "=" + encodeURIComponent(data[k]));
            }
        }
        var req;
        if (window.XMLHttpRequest) {
            req = new XMLHttpRequest();
        } else {
            req = new ActiveXObject("Microsoft.XMLHTTP");
        }
        req.onreadystatechange = function () {
            if (req.readyState == 4 && req.status == 200) {
                var txt = req.responseText;
                try {
                    txt = eval("(" + txt + ")");
                    if (txt["status"] == 403) {
                        self.logout();
                        return;
                    }
                } catch (e) {
                    txt = null;
                }
                if (handler) {
                    handler(txt);
                }
            }
        };
        req.open("POST", server);
        req.setRequestHeader("Content-type", "application/x-www-form-urlencoded;charset=utf-8");
        if (obj != null) {
            req.send(obj.join("&"));
        }
    }
    //alert("common.js，结束了");
    this.setRecommend = function (item) {
        var recommend = recommendMap[item['id']]
        if (!recommend) {
            recommendMap[item['id']] = item;
        }
    }
    this.getRecommend = function () {
        return recommendMap;
    }
};
