/**
 * Created by GGW on 15-11-11.
 */
//如果“Gwx”是未定义
if (typeof Gwx == "undefined") {
    //那么定义Gwx：是一个对象{id：Gwx_时间}
    Gwx = {
        //Date().getTime()返回值为Number类型，返回距1970年1月1日午夜的毫秒数。
        id: "Gwx_" + new Date().getTime()
    };
}
//图片的上传
Gwx.PhotoUploader = function (config) {
    //config:配置数据
    //初始化：以下的变量
    var total = 0;
    var progressIndex = 0;
    var resultIndex = 0;
    var html5FileBtn = null;
    var limit = config["limit"] || 31;//limit:限制
    var btnWidth = config["width"];
    var btnHeight = config["height"];
    var render = config["render"] || "outer";//渲染
    var fileCount = config["count"] || 1;//文件数
    var type = config["type"];
    var fileTypes = config["suffix"];
    var uploadHandlerStr = config["handlerName"];//反应堆
    var uploadHandler = config["handler"];//处理程序
    var action = config["action"];
    var processArray = [];
    var fUpload = null;
    var extraArgs = config["extraArgs"];

    //图片上传显示区outer
    var init = function () {
        //获取 id =（变量render）的元素，定义为： outer
        //alert(render);
        var outer = document.getElementById(render);
            //设置outer 的css 属性（以下：）
            //alert(outer.id);
            outer.style.width = btnWidth + "px";
            outer.style.height = btnHeight + "px";
            outer.style.overflow = "hidden";
            outer.style.opacity = outer.style.mozOpacity = "0.001";
            outer.style.filter = "alpha(opacity=0)";
            outer.style.position = "absolute";
            outer.style.backgroundColor = "blue";
        //HTML5定义了FileReader作为文件API的重要成员用于读取文件  
        if (!window.FileReader || type == "flash") {//flash上传方式初始化
            outer.appendChild(loadFlash());
        } else {//html5上传方式初始化
            outer.appendChild(loadInputFile());
        }
    };

    //设置Flash的参数
    this.setFlashArgs = function (args) {
        if (fUpload) {//flash上传方式初始化
            return window[fUpload].setArgs(args);
        } else {
            extraArgs = args;
            return true;
        }
    };

    //获取,并且修改路径
    var getPath = function () {
        var scripts = document.getElementsByTagName("script");
        var filePath = null;
        for (var i = 0, len = scripts.length; i < len; i++) {
            var script = scripts[i];
            //indexOf() 方法可返回某个指定的字符串值在字符串中首次出现的位置。从头到尾地检索字符串,如果要检索的字符串值没有出现，则该方法返回 -1.
            if (script && script.src.indexOf("GwxPhotoUploader") > -1) {
                var src = script.src;
                alert("1          "+src);
                filePath = src.replace(/GwxPhotoUploader_d[_\d]*\.js/g, "");
                alert("2       "+filePath);
                break;
            }
        }
        return filePath;
    };
    //输出s：
    var log = function (s) {
        window.console.log("FUpload:" + s);
    };

    //flash上传方式
    var loadFlash = function () {
        window.FUpload = {};
        var filePath = getPath();
        var swf_js = document.createElement("script");
            swf_js.src = filePath + "swfobject.js";
        document.getElementsByTagName("head")[0].appendChild(swf_js);
        var flashOuter = document.createElement("div");
            flashOuter.id = fUpload = "flashOuter_" + new Date().getTime();
        var loadSwf = function () {
            setTimeout(function () {
                if (typeof swfobject != "undefined") {
                    swfobject.embedSWF(filePath + "FUpload.swf", fUpload, btnWidth, btnHeight, "9.0", "expressInstall.swf",
                        {
                            action: action,
                            count: fileCount,
                            width: btnWidth,
                            height: btnHeight,
                            extraArgs: extraArgs
                        },
                        {
                            wmode: "transparent",
                            hasPriority: true,
                            allowScriptAccess: "always"
                        });
                } else {
                    loadSwf();
                }
            }, 100);
        };
        FUpload.onFlashLoad = function (e) {
            fUpload = window[fUpload];
            FUpload.debug("flash loaded");
        };
        FUpload.onEvent = function (type, info) {
            if (type == 1) {
                info = eval("(" + info + ")");
            }
            uploadHandler(type, info);
        };
        FUpload.debug = function (info) {
            window.console.log("flash_upload debug: " + info);
        };
        loadSwf();
        return flashOuter;
    };

    //html5上传方式
    var loadInputFile = function () {
        html5FileBtn = document.createElement("input");
        html5FileBtn.type = "file";
        html5FileBtn.style.cursor = "pointer";
        html5FileBtn.style.width = "500px";
        html5FileBtn.style.height = btnHeight + "px";
        html5FileBtn.style.marginLeft = "-200px";
        html5FileBtn.style.opacity = "0";
        html5FileBtn.accept = "image/jpeg,image/jpg,image/bmp,image/png";
        if (fileCount > 1) {//文件数量
            //multiple 属性规定输入字段可选择多个值。如果使用该属性，则字段可接受多个值。
            html5FileBtn.multiple = "multiple";
        }
        html5FileBtn.onchange = function () {
            var files = this.files;
            if ((total = files.length) > 0) {
                resultIndex = 0;
                html5FileBtn.disabled = true;//input禁用:disabled="disabled",
            }
            uploadHandler(0);
            for (var i = 0; i < files.length; i++) {
                dealFile(files[i]);
            }
        };
        return html5FileBtn;
    };

    //处理 文件
    var dealFile = function (file) {
        try {
            var type = file.type;
            var size = file.size;
            var name = file.name;
            var reader = new FileReader();
                //(FileReader中)readAsDataURL：该方法将文件读取为一段以 data: 开头的字符串，这段字符串的实质就是 Data URL，Data URL是一种将小文件直接嵌入文档的方案。这里的小文件通常是指图像与 html 等格式的文件。
                reader.readAsDataURL(file);
                //onload (FileReader中):文件读取成功完成时触发
                reader.onload = function () {
                var img = new Image();
                    img.src = this.result;
                    img.onload = function () {
                        var width = img.width, height = img.height, scale = width / height;
                        var canvas = document.createElement("Canvas");//生成canvas
                        var ctx = canvas.getContext('2d');
                            width = Math.min(width, 1200);
                            height = parseInt(width / scale);
                            scale = height / width;
                            height = Math.min(height, 900);
                            width = parseInt(height / scale);
                            canvas.width = width;
                            canvas.height = height;
                            ctx.drawImage(img, 0, 0, width, height);

                        var base64 = canvas.toDataURL("image/jpeg", 0.7);
                        var suffix = type.replace("image/", "");
                            base64 = base64.length > size ? img.src : base64;
                            base64 = base64.replace(/.*base64,/, "");
                        doAjax(action, {data: base64, name: name}, uploadHandler, function (msg) {
                            uploadHandler(1, msg);
                            if (!(++resultIndex < total)) {
                                html5FileBtn.disabled = false;
                                uploadHandler(4);
                            }
                        }, true);
                }
            };
        } catch (e) {
            alert(e)
        }
    };

    //
    

    //Ajax的改装：
    var doAjax = function (server, data, process, handler, isJson, isAsync) {
        var xmlhttp;
        var tdata = [];
        for (var o in data) {
            tdata.push(o + "=" + encodeURIComponent(data[o]));
        }
        if (window.XMLHttpRequest) {// code for IE7+, Firefox, Chrome, Opera, Safari
            xmlhttp = new XMLHttpRequest();
        }
        xmlhttp.onreadystatechange = function () {
            if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
                var result = xmlhttp.responseText;
                try {
                    result = eval("(" + result + ")");
                } catch (e) {//可能连接服务器失败.
                    result = null;
                }
                handler(result);
            }
        };

        if (process) {
            var myIndex = progressIndex++;
            xmlhttp.upload.addEventListener("progress", function (evt) {
                if (evt["lengthComputable"]) {
                    process(10, parseInt(evt.loaded * 100 / evt.total) + "%", myIndex);
                }
            }, false);
        }
        xmlhttp.open("POST", server, true);
        xmlhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded; charset=utf-8");

        tdata = tdata.join("&");
        if (extraArgs != null) {
            tdata += "&" + extraArgs;
        }
        xmlhttp.send(tdata);
    };
    init();
};