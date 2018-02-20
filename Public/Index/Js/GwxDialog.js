// JavaScript Document

/**
 * Created by GGW on 14-2-8.
 */
if (typeof Gwx == "undefined") {
    Gwx = {
        id: "Gwx_" + new Date().getTime()
    };
}
Gwx.Dialog = function () {
    var mask = null;
    var winOuter = null;
    var self = this;
    var hide4title = false;
    var hide4close = false;
    var context = document;
    var opacity = 0.6;
    var width = 300;
    var height = 300;
    var captionText = "vivimeet";
    var resizeEvent = function () {
    };
    var winResizeHandler = window.onresize || function () {
    };
    var topDocOverFlow = top.document.documentElement.style.overflow;

    window.onresize = function () {
        resizeEvent();
        winResizeHandler();
    };

    var bindHover = function (obj, hoverCls) {
        obj.onmouseover = function () {
            if (this.className.indexOf("focus") == -1) {
                this.className += " " + hoverCls;
            }
        };
        obj.onmouseout = function () {
            this.className = this.className.replace(" " + hoverCls, "");
        };
    };

    var createMask = function () {
        mask = context.createElement("div");
        mask.className = "gwx_dialog_mask";
        mask.style.height = context.documentElement.clientHeight;
        mask.style.zIndex = new Date().getTime();

        if ("hidden" != topDocOverFlow) {
            top.document.documentElement.style.overflow = "hidden";
        }
        mask.style["filter"] = "alpha(opacity=" + opacity * 100 + ")";
        mask.style["opacity"] = opacity;
        mask.style["-moz-opacity"] = opacity;

        context.body.appendChild(mask);
    };

    var createWinOuter = function () {
        winOuter = context.createElement("div");
        winOuter.className = "gwx_dialog_win_outer";
        winOuter.style.zIndex = new Date().getTime() + 1;
        context.body.appendChild(winOuter);
    };
    var createWin = function () {
        var win = self.win = context.createElement("div");
        win.className = "gwx_dialog_win";
        win.style.width = width + "px";
        //win.style.height = height + "px";
        winOuter.appendChild(win);
    };

    var createTitle = function () {
        var north = self.north = context.createElement("div");
        var caption = self.caption = context.createElement("span");
        caption.innerHTML = captionText;
        north.className = "gwx_dialog_north";
        north.appendChild(caption);

        if (!hide4close) {
            var close = self.close = context.createElement("div");
            close.className = "gwx_dialog_close";
            close.onclick = self.cancel;
            bindHover(close, "gwx_dialog_close_hover");
            north.appendChild(close);
        }

        self.win.appendChild(north);
    };
    this.showPublic = function () {
        width = arguments[0];
        height = arguments[1];
        captionText = arguments[2] || "";

        createMask();
        createWinOuter();
        createWin();
        if (!hide4title) {
            createTitle();
        }
        resizeEvent = freshPos;
    };

    this.showText = function () {

    };

    this.showHtml = function (w, h, t, html) {
        var content = context.createElement("div");
        content.style.background = "white";
        if (typeof html == "string") {
            content.innerHTML = html;
        } else {
            content.appendChild(html);
        }
        content.style.height = h + "px";
        this.showPublic(w, h, t);
        this.win.appendChild(content);
        freshPos();
    };

    this.tip = function (c) {
        this.hideClose();
        this.hideTitle();
        var win = self.win = context.createElement("div");
        var img = document.createElement("span");
        var content = context.createElement("span");

        self.setOpacity(0.1);
        createWinOuter();

        content.innerHTML = c;
        img.className="gwx_dialog_tip_img";
        content.className="gwx_dialog_tip_text";
        win.className = "gwx_dialog_tip";

        winOuter.style.textAlign = "center";
        winOuter.style.height=0;
       /* win.style.textAlign = "center";
        win.style.margin = "0 auto";
        win.style.height = "0";*/
        win.appendChild(img);
        win.appendChild(content);
        winOuter.appendChild(win);

        height = parseInt(content.clientHeight);
        resizeEvent = freshPos;
        freshPos();
        setTimeout(function () {
         self.cancel();
         }, 2000);
    };

    this.showPage = function (page, w, h, t) {
        var ifm = context.createElement("iframe");
        var loading = context.createElement("div");

        ifm.frameBorder = "0";
        ifm.style.height = h + "px";
        ifm.src = page;
        ifm.className = "gwx_dialog_ifm";
        ifm.addBtn = self.addBtn;
        ifm.removeAllBtn = self.removeAllBtn;
        ifm.addWords = self.addWords;
        ifm.setCaption = self.setCaption;
        ifm.args = this.args;
        ifm.cancel = self.cancel;

        ifm.loading = function () {
            loading.style.width = w + "px";
            loading.style.height = h + "px";
            loading.className = "gwx_dialog_ifm_loading";
        };

        ifm.complete = function () {
            loading.style.height = 0;
        };

        ifm.loading();

        self.showPublic(w, h, t);
        self.win.appendChild(loading);
        self.win.appendChild(ifm);
        freshPos();
    };
    this.showPhoto = function (url) {
        var photoOuter = context.createElement("div");
        var index = 0;
        var photo = context.createElement("img");
        var rw = 0;
        var rh = 0;
        var resizePic = function () {
            var ww = getWindowWidth();
            var wh = getWindowHeight();
            var w = Math.min(rw, ww - 100);
            var h = Math.min(rh, wh - 100);
            photo.style.maxWidth = w + "px";
            photo.style.maxHeight = h + "px";

            photoOuter.style.marginTop = (wh - photo.height) * 2 / 5 + "px";
            photoOuter.className = "gwx_dialog_win_photo";
            photoOuter.style.width = photo.width + "px";
        };
        photo.onload = function () {
            rw = photo.width;
            rh = photo.height;
            resizeEvent = resizePic;
            resizePic();
        };

        photoOuter.style.margin = "0 auto";
        photoOuter.style.textAlign = "center";
        photoOuter.appendChild(photo);
        self.setOpacity(0.85);
        createMask();
        createWinOuter();
        winOuter.appendChild(photoOuter);
        mask.onclick = photo.onclick = this.cancel;
        photo.src = url;
    };
    var getSouth = function () {
        if (!self.south) {
            var bar = self.south = context.createElement("div");
            bar.className = "gwx_dialog_south";
            self.win.appendChild(bar);
        }
        return self.south;
    };

    var freshPos = function () {
        var dis = 0;
        if (self.north) {
            dis += 35;
        }
        if (self.south) {
            dis += 35;
        }
        if (winOuter) {
            winOuter.style.marginTop = (getWindowHeight() - height - dis) * 3 / 8 + "px";
        }
        if (mask) {
            mask.style.height = getWindowHeight() + "px";
        }
    };

    var getWindowHeight = function () {
        return context.documentElement.clientHeight;
    };
    var getWindowWidth = function () {
        return context.documentElement.clientWidth;
    };
    this.removeAllBtn = function () {
        getSouth().innerHTML = "";
    };
    this.cancel = function () {
        var freq = 50;
        var closeNow = function () {
            if (mask) {
                context.body.removeChild(mask);
            }
            if (winOuter) {
                context.body.removeChild(winOuter);
            }
            mask = null;
            winOuter = null;
            self.south = null;
            self.north = null;
            window.onresize = winResizeHandler;
            if ("hidden" != topDocOverFlow) {
                top.document.documentElement.style.overflow = topDocOverFlow;
            }
            freshPos = function () {

            };
        };
        var haha = function () {

            if (self.win.clientHeight < freq || self.win.clientWidth < freq) {
                closeNow();
            } else {
                var handler = arguments.callee;
                setTimeout(handler, freq);
                self.win.style.height = (self.win.clientHeight - freq) + "px";
                self.win.style.width = (self.win.clientWidth - freq) + "px";
                freq += freq / 2;
                //handler();
            }
        };

        //haha();
        closeNow();
        self.cancel = {};
    };

    this.addBtn = function () {
        var btn = context.createElement("input");
        var bgCls = "gwx_dialog_btn_" + (arguments[2] || "gray");
        btn.type = "button";
        btn.value = arguments[0];
        btn.className = "gwx_dialog_btn " + bgCls;
        btn.onclick = arguments[1] || function () {
        };

        bindHover(btn, bgCls + "_hover");

        getSouth().appendChild(btn);

        freshPos();
        return btn;
    };

    this.addWords = function () {
        var div = document.createElement("div");
        var label = document.createElement("label");
        var input = document.createElement("input");

        div.className = "gwx_dialog_ifm_words";
        label.innerHTML = arguments[0];
        input.style.width = arguments[1] || 100 + "px";
        div.appendChild(label);
        div.appendChild(input);

        getSouth().appendChild(div);
    };

    this.hideTitle = function () {
        hide4title = true;
    };
    this.hideClose = function () {
        hide4close = true;
    };
    this.setOpacity = function (o) {
        opacity = o;
    };
    this.setArgs = function (args) {
        this.args = args;
    };
    this.setCaption = function (c) {
        captionText = c;
        self.caption.innerHTML = captionText;
    };

    this.createPhotoBody = function () {

    };

};

/**
 * 加载样式
 */
(function () {
    if (!document.GwxDialogMarker) {// css未加载
        var scripts = document.getElementsByTagName("script");

        for (var i = 0, len = scripts.length; i < len; i++) {
            var script = scripts[i];
            if (script && script.src.indexOf("GwxDialog") > -1) {
                var src = script.src;
                var filePath = src.replace(/Js\/GwxDialog[_\d]*\.js/g, "Css/");
                var style = document.createElement("link");
                document.getElementsByTagName("head")[0].appendChild(style);
                
                //修改路径（杰）
                style.href = filePath + "GwxDialog.css";
                style.rel = "stylesheet";
                style.type = "text/css";

                document.GwxDialogMarker = true;// 增加样式已加载标记
                break;
            }
        }
    }
})();

