/**
 * User: Gwx
 * Date: 13-10-10
 * Time: 下午2:33
 * Version:0.1
 */
if (typeof Gwx == "undefined") {
    Gwx = {
        id: "Gwx_" + new Date().getTime()
    };
}
Gwx.PhotoCutter = function (c) {
    var self = this;
    var config = {};
    for (var p in c) {//复制属性
        config[p] = c[p];
    }

    self.docOffsetX = 0;
    self.docOffsetY = 0;
    self.photoWidth = 0;
    self.photoHeight = 0;
    self.centerX = 10;
    self.centerY = 10;
    self.centerWidth = 50;//包括border的宽度
    self.centerHeight = 50;//包括border的高度
    self.centerOffset = 0;//中心位置偏移：两个center的border的宽度
    self.blockOffset = 0;//block位置偏移：一个block的宽度
    self.docMosSel = document.onselectstart;
    self.docMosUp = document.onmouseup;
    self.docMosMove = document.onmousemove;
    self.docCursor = document.body.style.cursor;
    self.previews = [];

    self.render = (typeof  config["render"] == "object") ? config["render"] : document.getElementById(config["render"]);
    //self.previewOuter = (typeof  config["preview"] == "object") ? config["preview"] : document.getElementById(config["preview"]);
    self.minCenterSize = config["minCenterSize"] || 10;
    self.maxWidth = config["maxWidth"] || self.render.clientWidth || 200;
    self.maxHeight = config["maxHeight"] || self.render.clientHeight || 200;
    //self.previewSize = self.previewOuter.clientWidth || 100;
    self.cursorMap = {
        0: "se-resize",
        1: "s-resize",
        2: "ne-resize",
        3: "w-resize",
        4: "e-resize",
        5: "ne-resize",
        6: "s-resize",
        7: "se-resize",
        m: "move"
    };


    self.parseIntValue = function (num) {
        num = parseInt(num);
        num = isNaN(num) ? 0 : num;
        return num;
    };

    self.getStyleValue = function (obj, type) {
        var width = 0;
        if (obj.currentStyle) {
            width = obj.currentStyle[type];
        } else {
            width = window.getComputedStyle(obj, null)[[type]];
        }
        width = self.parseIntValue(width);

        return width;
    };

    self.createOuter = function () {
        var outer = self.outer = document.createElement("div");

        self.render.appendChild(outer);

        outer.className = "gwx_photo_cutter_outer";
        /*outer.style.width = self.maxWidth + "px";
         outer.style.height = self.maxHeight + "px";*/
    };

    self.createPreviews = function () {
        var panels = config["previews"];
        for (var i = 0, len = panels.length; i < len; i++) {
            var preview = panels[i];
            preview = document.getElementById(preview);
            preview.viewSize = preview.clientWidth || 100;
            self.previews[i] = preview;
        }
    };

    self.createMask = function () {
        var mask = self.mask = document.createElement("div");
        var mask_north = mask.mask_north = document.createElement("div");
        var mask_south = mask.mask_south = document.createElement("div");
        var mask_west = mask.mask_west = document.createElement("div");
        var mask_east = mask.mask_east = document.createElement("div");

        self.outer.insertBefore(mask, self.outer.firstChild);//放到photo前面

        mask.appendChild(mask_north);
        mask.appendChild(mask_west);
        mask.appendChild(mask_east);
        mask.appendChild(mask_south);

        mask.className = "gwx_photo_cutter_mask";
        mask_north.className = "gwx_photo_cutter_mask_sub gwx_photo_cutter_mask_north";
        mask_south.className = "gwx_photo_cutter_mask_sub gwx_photo_cutter_mask_south";
        mask_west.className = "gwx_photo_cutter_mask_sub";
        mask_east.className = "gwx_photo_cutter_mask_sub gwx_photo_cutter_mask_east";

        mask.onselectstart = function () {
            return false;
        };
    };


    self.createCenter = function () {
        var center = self.center = document.createElement("div");
        var fake = self.fake = document.createElement("div");
        fake.className = "gwx_photo_cutter_fake";
        self.mask.appendChild(center);
        center.appendChild(fake);


        for (var i = 0; i < 8; i++) {
            var block = self["block_" + i] = document.createElement("div");
            center.appendChild(block);
            block.className = "gwx_photo_cutter_block gwx_photo_cutter_block_" + i;
            block.mode = i;
        }


        center.className = "gwx_photo_cutter_center";

        self.centerOffset = self.getStyleValue(center, "borderLeftWidth") * 2;//两个中心边框
        self.blockOffset = self["block_1"].offsetWidth;//一个block的宽度

        /* var l =0;
         var t=0;*/

        center.onmousedown = function (e) {//z注册事件
            e = e || window.event;
            var el = e.target || e.srcElement;
            var x = e.pageX || (e.clientX + self.docOffsetX);
            var y = e.pageY || (e.clientY + self.docOffsetY);

            center.tag = true;
            center.ox = x;
            center.oy = y;

            /* l =self.outer.offsetLeft+self.render.offsetLeft;
             t=self.outer.offsetTop+self.render.offsetTop;*/

            if (el.className.indexOf("block") > -1) {
                center.mode = el.mode;
                self.fake.style.cursor = self.cursorMap[center.mode];//暂时修改center上面的鼠标效果
            } else {
                center.mode = "m";
            }

            document.body.style.cursor = self.cursorMap[center.mode];//暂时修改document上面的鼠标效果

            document.onselectstart = function () {
                return false;
            };

            document.onmouseup = function () {
                center.tag = false;
                self.fake.style.cursor = self.cursorMap["m"];//还原修改document上面的鼠标效果
                document.body.style.cursor = "";//self.docCursor;//还原center上面的鼠标效果
                document.onselectstart = self.docMosSel;
                document.onmousemove = self.docMosMove;
                document.onmouseup = self.docMosUp;
            };

            document.onmousemove = function (e) {
                if (center.tag) {
                    e = e || window.event;
                    var x = e.pageX || (e.clientX + self.docOffsetX);
                    var y = e.pageY || (e.clientY + self.docOffsetY);
                    /*x=x<l?(l):x;
                     y=y<t?(t):y;*/

                    // self.pos=x+" "+y+"  "+l+" "+t;

                    var dx = x - center.ox;
                    var dy = y - center.oy;
                    center.ox = x;
                    center.oy = y;
                    self.resizeHandler(center.mode, dx, dy);
                }

            };
        };
    };


    self.resizeHandler = function (mode, dx, dy) {
        var mw = self.photoWidth;
        var mh = self.photoHeight;
        var ol = self.parseIntValue(self.center.style.left);
        var ot = self.parseIntValue(self.center.style.top);
        var newX = ol;
        var newY = ot;
        var isIn = true;

        var handlers = {
            mode_m: function () {//移动
                newX = ol + dx;
                newY = ot + dy;
                dx = dy = 0;
                if (newX < 0 || newX > (mw - self.centerWidth)) {
                    newX = (newX < 0) ? 0 : (mw - self.centerWidth);
                }

                if (newY < 0 || newY > (mh - self.centerHeight)) {
                    newY = (newY < 0) ? 0 : (mh - self.centerHeight);
                }
            },
            mode_0: function () {//西北方向移动
                //dx = dy = self.parseIntValue((dy + dx) /2);
                dy = dx;
                newX = ol + dx;
                newY = ot + dy;
            },
            mode_1: function () {//北部移动
                dx = dy = self.parseIntValue(dy / 2) * 2;
                newX = ol + dx / 2;
                newY = ot + dy;
            },
            mode_2: function () {//东北移动
                dx = dy = -dx;// -self.parseIntValue((dx - dy) / 2);
                newY = ot + dy;
            },
            mode_3: function () {//西部移动
                dx = dy = (self.parseIntValue(dx / 2) * 2);
                newX = ol + dx;
                newY = ot + dx / 2;

            },
            mode_4: function () {//东部移动
                dx = dy = -self.parseIntValue(dx / 2) * 2;
                newY = ot + dy / 2;
            },
            mode_5: function () {//西南移动
                dy = dx;//= self.parseIntValue(dx);
                newX = ol + dx;
            },
            mode_6: function () {//南部移动
                dx = dy = -self.parseIntValue(dy / 2) * 2;
                newX = ol + dx / 2;
            },
            mode_7: function () {//东南移动
                dx = dy = -dx;//-self.parseIntValue((dx + dy) / 2);
            }
        };

        handlers["mode_" + mode]();//根据mode调用相应事件

        if (mode != "m") {
            isIn = !(newX < 0 || newY < 0);//判断左上角越界
            isIn = !isIn ? isIn : newX < (mw - self.centerWidth + dx + 1);//判断右部越界
            isIn = !isIn ? isIn : newY < (mh - self.centerHeight + dy + 1);//判断底部越界
            isIn = !isIn ? isIn : (!((self.centerWidth - dx) < self.minCenterSize && dx > 0));//判断center最小极限
        }

        if (isIn) {//如果已经yue越界，停止移动，move除外
            self.centerWidth -= dx;
            self.centerHeight -= dy;
            self.freshMask(newX, newY);
        }

    };

    self.show = function () {
        var photo = self.photo = document.createElement("img");

        photo.className = "gwx_photo_cutter_photo";
        photo.onload = self.loadPhotoSuccessed;
        photo.onerror = self.loadPhotoFailed;
        setTimeout(function () {
            photo.src = config["photo"];
        }, 200);
        self.outer.appendChild(photo);
    };

    self.showPreview = function () {
        for (var i = 0, len = self.previews.length; i < len; i++) {
            var previewPanel = self.previews[i];
            var previewPhoto = document.createElement("img");
            previewPanel.style.overflow = "hidden";//隐藏预览区div的滚动条
            previewPhoto.src = config["photo"];
            previewPanel.innerHTML = "";
            previewPanel.appendChild(previewPhoto);
        }
    };

    self.showTip = function (content) {
        if (!self.tipMain) {
            var tipMain = self.tipMain = document.createElement("div");
            var createTip4Preview = function () {
                var tipPreview = document.createElement("div");
                tipPreview.className = "gwx_photo_cutter_tip";
                tipPreview.innerHTML = "loading...";
                return tipPreview;
            };
            tipMain.className = "gwx_photo_cutter_tip";
            tipMain.style.lineHeight = self.maxHeight * 4 / 5 + "px";
            self.outer.appendChild(tipMain);
        }

        self.tipMain.innerHTML = content || "loading...";


        /* for (var i = 0, len = self.previews.length; i < len; i++) {
         var previewPanel = self.previews[i];
         var tip = createTip4Preview();
         tip.style.lineHeight = previewPanel.viewSize * 4 / 5 + "px";
         previewPanel.appendChild(tip);
         }*/
    };


    self.freshMask = function (newX, newY) {

        var mask = self.mask;

        mask.mask_north.style.height = mask.mask_west.style.top = mask.mask_east.style.top = newY + "px";

        mask.mask_west.style.width = newX + "px";
        mask.mask_east.style.width = (self.photoWidth - self.centerWidth - newX) + "px";

        mask.mask_south.style.height = (self.photoHeight - self.centerHeight - newY) + "px";
        mask.mask_west.style.height = mask.mask_east.style.height = self.centerHeight + "px";

        self.freshCenter(newX, newY);
        if (self["showStatus"]) {//刷新状态信息
            self["showStatus"](self.getStatus());
        }
        self.freshPreview();
    };


    self.freshCenter = function (newX, newY) {
        var center = self.center;
        var centerSize = self.centerHeight - self.centerOffset;
        var blockPos = (centerSize - self.blockOffset) / 2;

        center.style.left = newX + "px";
        center.style.top = newY + "px";
        center.style.width = (self.centerWidth - self.centerOffset) + "px";
        center.style.height = (self.centerHeight - self.centerOffset) + "px";
        self["block_1"].style.left = self["block_4"].style.top = self["block_6"].style.left = self["block_3"].style.top = blockPos + "px";
    };


    self.freshPreview = function () {
        var cLeft = self.parseIntValue(self.center.style.left);
        var cTop = self.parseIntValue(self.center.style.top);
        for (var i = 0, len = self.previews.length; i < len; i++) {
            var previewPanel = self.previews[i];
            var previewPhoto = previewPanel.getElementsByTagName("img")[0];
            var scale = (previewPanel.viewSize / self.centerWidth);
            var npw = scale * self.photoWidth;
            var nph = scale * self.photoHeight;
            previewPhoto.width = npw;
            previewPhoto.height = nph;

            previewPhoto.style.marginLeft = -(cLeft * scale) + "px";
            previewPhoto.style.marginTop = -(cTop * scale) + "px";
        }
    };
    self.loadPhotoFailed = function () {
        self.tipMain.innerHTML = "Load failed!";
        /*for (var i = 0, len = self.previews.length; i < len; i++) {
         self.previews[i].firstChild.innerHTML = "Load failed!";
         }*/
        this["onerror"] = null;
    };
    self.loadPhotoSuccessed = function () {
        var photo = this;
        var width = self.realPhotoWidth = photo.width;
        var height = self.realPhotoHeight = photo.height;
        if (self.outer) {
            //self.outer.removeChild(self.tipMain);
            self.tipMain.style.display = "none";
        }
        self.createMask();
        self.createCenter();
        self.showPreview();

        if (width > height) {
            photo.width = self.maxWidth;
        } else {
            photo.height = self.maxHeight;
        }

        self.photoWidth = photo.width;
        self.photoHeight = photo.height;
        self.outer.style.width = self.photoWidth + "px";
        self.centerWidth = self.centerHeight = self.parseIntValue(0.8 * Math.min(photo.width, photo.height));
        self.centerX = self.parseIntValue((self.photoWidth - self.centerWidth) / 2);
        self.centerY = self.parseIntValue((self.photoHeight - self.centerWidth) / 2);

        self.mask.style.width = self.photoWidth + "px";
        self.mask.style.height = self.photoHeight + "px";

        photo.className = photo.className.replace(/\s*gwx_photo_cutter_photo/g, "");

        self.freshMask(self.centerX, self.centerY);

        self.docOffsetX = document.body.scrollLeft - document.body.clientLeft;
        self.docOffsetY = document.body.scrollTop - document.body.clientTop;

        photo["onload"] = null;
    };

    self.setPhoto = function (src) {
        config["photo"] = src;
    };


    self.getStatus = function () {
        var scale = self.realPhotoWidth / self.photoWidth;
        var fw = self.centerWidth;
        var fh = self.centerHeight;
        var fx = self.parseIntValue(self.center.style.left);
        var fy = self.parseIntValue(self.center.style.top);

        var w = self.parseIntValue(fw * scale);
        var h = self.parseIntValue(fh * scale);
        var x = self.parseIntValue(fx * scale);
        var y = self.parseIntValue(fy * scale);

        return {
            w: w,
            h: h,
            x: x,
            y: y,
            fw: fw,
            fh: fh,
            fx: fx,
            fy: fy,
            rw: self.realPhotoWidth,
            rh: self.realPhotoHeight
        };
    };

    self.clear = function () {
        if (self) {
            self.render.innerHTML = "";
            for (var i = 0, len = self.previews.length; i < len; i++) {
                self.previews[i].innerHTML = "";
            }
        }
        try {

        } catch (e) {
        }
    };
    self.clear();
    self.createOuter();
    self.createPreviews();
};

/**
 * 加载样式
 */
(function () {
    if (!document.GwxPhotoCutterMarker) {// css未加载
        var scripts = document.getElementsByTagName("script");

        for (var i = 0, len = scripts.length; i < len; i++) {
            var script = scripts[i];
            if (script && script.src.indexOf("GwxPhotoCutter") > -1) {
                var src = script.src;
                var filePath = src.replace(/GwxPhotoCutter([_\d])*\.js/g, "");
                var style = document.createElement("link");
                document.getElementsByTagName("head")[0].appendChild(style);
                style.href = filePath + "GwxPhotoCutter.css";
                style.rel = "stylesheet";
                style.type = "text/css";

                document.GwxPhotoCutterMarker = true;// 增加样式已加载标记
                break;
            }
        }
    }
})();
