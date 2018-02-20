/**
 * Created by GGW on 15-11-11.
 */
if (typeof Gwx == "undefined") {
    Gwx = {
        id: "Gwx_" + new Date().getTime()
    };
}
Gwx.PhotoUploader = function (config) {
    var total = 0;
    var progressIndex = 0;
    var resultIndex = 0;
    var html5FileBtn = null;
    var limit = config["limit"] || 31;
    var btnWidth = config["width"];
    var btnHeight = config["height"];
    var render = config["render"] || "outer";
    var fileCount = config["count"] || 1;
    var type = config["type"];
    var fileTypes = config["suffix"];
    var uploadHandlerStr = config["handlerName"];
    var uploadHandler = config["handler"];

    var action = config["action"];
    var processArray = [];
    var fUpload = null;
    var extraArgs = config["extraArgs"];
    var init = function () {
        var outer = document.getElementById(render);
        outer.style.width = btnWidth + "px";
        outer.style.height = btnHeight + "px";
        outer.style.overflow = "hidden";
        outer.style.opacity = outer.style.mozOpacity = "0.001";
        outer.style.filter = "alpha(opacity=0)";
        outer.style.position = "absolute";
        outer.style.backgroundColor = "blue";
        if (!window.FileReader || type == "flash") {//flash上传方式初始化
            outer.appendChild(loadFlash());
        } else {//html5上传方式初始化
            outer.appendChild(loadInputFile());
        }
    };
    this.setFlashArgs = function (args) {
        if (fUpload) {//flash上传方式初始化
            return window[fUpload].setArgs(args);
        } else {
            extraArgs = args;
            return true;
        }
    };
    var getPath = function () {
        var scripts = document.getElementsByTagName("script");
        var filePath = null;
        for (var i = 0, len = scripts.length; i < len; i++) {
            var script = scripts[i];
            if (script && script.src.indexOf("GwxPhotoUploader") > -1) {
                var src = script.src;
                filePath = src.replace(/GwxPhotoUploader[_\d]*\.js/g, "");
                break;
            }
        }
        return filePath;
    };
    var log = function (s) {
        window.console.log("FUpload:" + s);
    };
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

    var loadInputFile = function () {
        html5FileBtn = document.createElement("input");
        html5FileBtn.type = "file";
        html5FileBtn.style.cursor = "pointer";
        html5FileBtn.style.width = "500px";
        html5FileBtn.style.height = btnHeight + "px";
        html5FileBtn.style.marginLeft = "-200px";
        html5FileBtn.style.opacity = "0";
        html5FileBtn.accept = "image/jpeg,image/jpg,image/bmp,image/png";
        if (fileCount > 1) {
            html5FileBtn.multiple = "multiple";
        }
        html5FileBtn.onchange = function () {
            var files = this.files;
            if ((total = files.length) > 0) {
                resultIndex = 0;
                html5FileBtn.disabled = true;
            }
            uploadHandler(0);
            for (var i = 0; i < files.length; i++) {
                dealFile(files[i]);
            }
        };
        return html5FileBtn;
    };
    var dealFile = function (file) {
        try {
            var type = file.type;
            var size = file.size;
            var name = file.name;
            var reader = new FileReader();
            reader.readAsDataURL(file);
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