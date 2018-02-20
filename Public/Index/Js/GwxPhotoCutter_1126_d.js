/**
 * User: Gwx
 * Version:0.1
 */
if (typeof Gwx == "undefined") {
    Gwx = {
        id: "Gwx_" + new Date().getTime()
    };
}
//图片的裁剪
Gwx.PhotoCutter = function (c) {
    var self = this;
    var config = {};//配置，布局

    //console.log(c);//调试:输出，解析出（c）这个变量

    for (var p in c){//复制属性
        config[p] = c[p];
    }

    //offsetX:鼠标相比较于触发事件的元素的位置,以元素盒子模型的内容区域的左上角为参考点
    self.docOffsetX = 0;
    //检索与触发事件的对象相关的鼠标位置的垂直坐标
    self.docOffsetY = 0;
    self.photoWidth = 0;// 图片初始宽度记录 
    self.photoHeight = 0;// 图片初始高度记录 
    self.centerX = 10;  //获取或设置:中心点的 x 坐标。
    self.centerY = 10;  //获取或设置:中心点的 Y 坐标.
    self.centerWidth = 50;//包括border的宽度
    self.centerHeight = 50;//包括border的高度
    self.centerOffset = 0;//中心位置偏移：两个center的border的宽度
    self.blockOffset = 0;//block位置偏移：一个block的宽度
    //onselectstart几乎用于所有对象，其触发时间为目标对象被开始选中时（即选中动作刚开始，尚未实质性被选中）。
    self.docMosSel = document.onselectstart;
    //onmouseup:鼠标抬起时触发的事件。
    self.docMosUp = document.onmouseup;
    //onmousemove 事件会在鼠标指针移动时发生.
    self.docMosMove = document.onmousemove;
    //设置鼠标指针的形状
    self.docCursor = document.body.style.cursor;
    //初始化“照片预览”
    self.previews = [];
    //render渲染:在浏览器上按照一定的规范显示出相应的内容。
    self.render = (typeof  config["render"] == "object") ? config["render"] : document.getElementById(config["render"]);
    //self.previewOuter = (typeof  config["preview"] == "object") ? config["preview"] : document.getElementById(config["preview"]);
    //最小尺寸
    self.minCenterSize = config["minCenterSize"] || 10;
    //最大尺寸
    //alert("self.render = "+self.render);
    self.maxWidth = config["maxWidth"] || self.render.clientWidth || 200;//clientWidth:当前浏览器窗口的宽
    self.maxHeight = config["maxHeight"] || self.render.clientHeight || 200;
    //self.previewSize = self.previewOuter.clientWidth || 100;
    //0-7:是8个方向
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

    //字符串的数值化
    self.parseIntValue = function (num) {
        //将参数num转化为 整数
        num = parseInt(num);//parseInt解析一个字符串，并返回一个整数。
        num = isNaN(num) ? 0 : num;
        return num;
    };

    //获取参数obj 的所有样式属性值
    self.getStyleValue = function (obj, type) {
        var width = 0;
        //js的style属性可以获得html标签的样式，但是不能获取非行间样式。
        //IE下可以用currentStyle，而在火狐下面我们需要用到getComputedStyle。
        if (obj.currentStyle) {//IE:
            width = obj.currentStyle[type];
        } else {//其他浏览器：
            //getComputedStyle("元素", "伪类"或null);
            //获取当前元素所有最终使用的CSS属性值。返回的是一个CSS样式声明对象()，只读。
            width = window.getComputedStyle(obj, null)[[type]];
        }
        width = self.parseIntValue(width);//数值化
        return width;
    };

    //创建最外层div
    self.createOuter = function () {
        //创建一个“DIV”对象
        var outer = self.outer = document.createElement("div");
            //这个“DIV”的 类名：
            outer.className = "gwx_photo_cutter_outer";
            outer.style.width = self.maxWidth + "px";
            outer.style.height = self.maxHeight + "px";

        //在self.render末尾添加这个“DIV”对象
        self.render.appendChild(outer);      
    };

    //创建“图片预览”
    self.createPreviews = function () {
        //将config["previews"] 赋值给panels
        var panels = config["previews"];
        for (var i = 0, len = panels.length; i < len; i++) {
            //将config["previews"]中的previews遍历给 preview
            var preview = panels[i];
                //通过id依次获得 preview
                preview = document.getElementById(preview);
                //设置 预览区的 尺寸：（可见区域的宽度）或（100）
                preview.viewSize = preview.clientWidth || 100;

            self.previews[i] = preview;
        }
    };

    //创建一个 遮罩层（Mask）
    self.createMask = function () {
        //初始化mask（内容区域）为一个 新建的“DIV”
        var mask = self.mask = document.createElement("div");
        //分别创建mask（内容区域）的上、下、左、右的四个黑色遮罩“DIV”
        var mask_north = mask.mask_north = document.createElement("div");
        var mask_south = mask.mask_south = document.createElement("div");
        var mask_west = mask.mask_west = document.createElement("div");
        var mask_east = mask.mask_east = document.createElement("div");

        self.outer.insertBefore(mask, self.outer.firstChild);//放到photo前面

        //mask（内容区域）的上、下、左、右分别添加以上四个黑色遮罩“DIV”
        mask.appendChild(mask_north);
        mask.appendChild(mask_west);
        mask.appendChild(mask_east);
        mask.appendChild(mask_south);

        //上、下、左、右分别为以上四个黑色遮罩“DIV”添加类名
        mask.className = "gwx_photo_cutter_mask";
        mask_north.className = "gwx_photo_cutter_mask_sub gwx_photo_cutter_mask_north";
        mask_south.className = "gwx_photo_cutter_mask_sub gwx_photo_cutter_mask_south";
        mask_west.className = "gwx_photo_cutter_mask_sub";
        mask_east.className = "gwx_photo_cutter_mask_sub gwx_photo_cutter_mask_east";

        //onselectstart(选中动作刚开始，尚未实质性被选中)
        mask.onselectstart = function () {//禁止点击选中
            return false;
        };
    };

    //创建中心的“DIV”
    self.createCenter = function () {
        //初始化center为一个新建的“DIV”
        var center = self.center = document.createElement("div");
        //初始化fake为一个新建的“DIV”
        var fake = self.fake = document.createElement("div");
            fake.className = "gwx_photo_cutter_fake";
        //在mask的末尾节点，添加center这个DIV
        self.mask.appendChild(center);
        //在center的末尾节点，添加fake这个DIV
        center.appendChild(fake);


        for (var i = 0; i < 8; i++) {
            //依次创建8 个block（div）
            var block = self["block_" + i] = document.createElement("div");
                block.className = "gwx_photo_cutter_block gwx_photo_cutter_block_" + i;

            //在center子节点末尾依次添加这8个block（div）
            center.appendChild(block);
            //mode
            block.mode = i;
        }

        //分别设置center、block的css属性
        center.className = "gwx_photo_cutter_center";
        self.centerOffset = self.getStyleValue(center, "borderLeftWidth") * 2;//两个中心边框
        self.blockOffset = self["block_1"].offsetWidth;//一个block的宽度

        /* var l =0;
         var t=0;*/
        //例子：
        // <input type= "text" id="t1" onclick="aaa(event)">
         
        // function aaa(e){
        //    e = e || window.event;
        //    var tar = e.target || e.srcElement;
        //    alert(tar.id);//触发onclick事件的元素 即这个text框 的id
        // }

        center.onmousedown = function (e) {//z注册事件
            //初始化e
            e = e || window.event;
            //e.target（FF）和e.srcElement(IE)是触发event事件的元素对象
            var el = e.target || e.srcElement;
            //pageX指鼠标在页面上的位置，以页面左侧为参考点
            //clientX指可视区域内离左侧的距离，以滚动条滚动到的位置为参考点。
            var x = e.pageX || (e.clientX + self.docOffsetX);
            var y = e.pageY || (e.clientY + self.docOffsetY);
            //
            center.tag = true;
            //
            center.ox = x;
            center.oy = y;

            /*l =self.outer.offsetLeft+self.render.offsetLeft;
              t =self.outer.offsetTop+self.render.offsetTop;*/
            
            //el.className 为对象添加类名
            //el.className.indexOf("block"):兼容ie通过类名查找的问题
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

    //
    self.resizeHandler = function (mode, dx, dy) {
        //
        var mw = self.photoWidth;
        var mh = self.photoHeight;
        //style.left:左边距。是读写的，offsetLeft是只读的
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

        if (isIn) {//如果已经越界，停止移动，move除外
            self.centerWidth -= dx;
            self.centerHeight -= dy;
            self.freshMask(newX, newY);
        }
    };

    //显示照片
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

    //预览区 的显示
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

    //提示语“loading...”
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

    //新图片的位置布局
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

    //新图片的中心位置
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

    //新图片  的预览
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
    //加载失败
    self.loadPhotoFailed = function () {
        self.tipMain.innerHTML = "Load failed!";
        /*for (var i = 0, len = self.previews.length; i < len; i++) {
         self.previews[i].firstChild.innerHTML = "Load failed!";
         }*/
        this["onerror"] = null;
    };
    //加载成功
    self.loadPhotoSuccessed = function () {
        var photo = this;
        var width = self.realPhotoWidth = photo.width;
        var height = self.realPhotoHeight = photo.height;
        //如果图片显加载出来了
        if (self.outer) {
            //self.outer.removeChild(self.tipMain);
            self.tipMain.style.display = "none";
        }
        //创建边框区、中心图片区、图片预览
        self.createMask();
        self.createCenter();
        self.showPreview();
        //获取图片合适的宽高
        if (width > height) {
            photo.width = self.maxWidth;
        } else {
            photo.height = self.maxHeight;
        }
        //设置相关的宽高
        self.photoWidth = photo.width;
        self.photoHeight = photo.height;
        self.outer.style.width = self.photoWidth + "px";
        self.centerWidth = self.centerHeight = self.parseIntValue(0.8 * Math.min(photo.width, photo.height));
        self.centerX = self.parseIntValue((self.photoWidth - self.centerWidth) / 2);
        self.centerY = self.parseIntValue((self.photoHeight - self.centerWidth) / 2);

        self.mask.style.width = self.photoWidth + "px";
        self.mask.style.height = self.photoHeight + "px";
        //
        photo.className = photo.className.replace(/\s*gwx_photo_cutter_photo/g, "");
        //
        self.freshMask(self.centerX, self.centerY);
        //
        //offsetX：IE特有,鼠标相比较于触发事件的元素的位置
        //scrollTop代表页面利用滚动条滚动到下方时，隐藏在滚动条上方的页面的高度；
        //scrollLeft代表页面利用滚动条滚动到右侧时，隐藏在滚动条左侧的页面的宽度 
        //scrollLeft() 方法返回或设置匹配元素的滚动条的水平位置。
        self.docOffsetX = document.body.scrollLeft - document.body.clientLeft;
        self.docOffsetY = document.body.scrollTop - document.body.clientTop;

        photo["onload"] = null;
    };

    //设置图片的路径
    self.setPhoto = function (src) {
        config["photo"] = src;
    };

    //获取当前状态下的宽高、边距
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

    //
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
                var filePath = src.replace(/GwxPhotoCutter([_\d])*\_d\.js/g, "");
                var style = document.createElement("link");
                document.getElementsByTagName("head")[0].appendChild(style);
                //（杰）修改路径
                filePath=filePath.replace("Js","Css");
                style.href = filePath + "GwxPhotoCutter.css";
                style.rel = "stylesheet";
                style.type = "text/css";

                document.GwxPhotoCutterMarker = true;// 增加样式已加载标记
                break;
            }
        }
    }
})();
