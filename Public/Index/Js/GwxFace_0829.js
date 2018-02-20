/**
 * Created by GGW on 14-2-8.
 */
if (typeof Gwx == "undefined") {
    Gwx = {
        id: "Gwx_" + new Date().getTime()
    };
}

Gwx.Face = function (doc) {
    var self = this;
    var context = doc || document;
    var panel = null;
    var handler = null;
    var filePath = null;

    var faceTitles = ["Smile", "Grimace", "Drooling", "Scowl", "Chill", "Sob",
        "Shy", "Silence", "Cry", "Embarrassed", "On fire", "Wink", "Grin",
        "Surprised", "Sad", "Cool", "Frightened", "Scream", "Puke",
        "Chuckle", "Lovely", "Sneer", "Arrogant", "Hungry", "Drowsy",
        "Panic", "Sweating", "Laugh", "Soldier", "Strive", "Scold",
        "Confused", "Shhh", "Hypnotized", "Torment", "Frustrated", "Skull",
        "Hammer", "Wave/Bye", "Relived", "Pick nose", "Applause",
        "Flushed", "Hellooo", "Snub1", "Snub2", "Yawn", "Booo",
        "Distressed", "Sniffle", "Sly", "Pucker", "Scared", "Pathetic",
        "Petrified", "Speechless"];

    var createPanel = function () {
        panel = context.createElement("div");
        panel.className = "gwx_face_outer";
    };

    var fillFace = function () {
        for (var i = 0, len = faceTitles.length; i < len; i++) {
            var face = context.createElement("img");
            // 正则替换：
            // var a = 'abc;def;hij;';
            // a = a.replace(/;/g,',');
            // alert(a);
            //alert(filePath); js的路径           
            filePath = filePath.replace("Css","Images");
            //alert(filePath);  
            face.src = filePath + "faces/face" + (i + 1) + ".gif";

            face.title = faceTitles[i];
            face.className = "gwx_face_face";
            face.onmouseover = function () {
                this.className += " gwx_face_hover";
            };
            face.onmouseout = function () {
                this.className = this.className.replace(" gwx_face_hover", "");
            };
            face.onclick = function () {
                handler(this.title);
            };
            panel.appendChild(face);
        }
    };
    var hide = function () {
        panel.parentNode.style.display = "none";
    };

    var loadStyle = function () {
        var scripts = document.getElementsByTagName("script");
        for (var i = 0, len = scripts.length; i < len; i++) {
            var script = scripts[i];
            if (script && script.src.indexOf("GwxFace") > -1) {
                var src = script.src;
                var arr = src.match(/GwxFace(_?\d*)\.js/);
                filePath = src.replace(arr[0], "");
                var style = context.createElement("link");
                context.getElementsByTagName("head")[0].appendChild(style);

                //将原来的js 路径改为正确的Images路径
                filePath = filePath.replace('Js','Css');
                style.href = filePath + "GwxFace" + arr[1] + ".css";
                style.rel = "stylesheet";
                style.type = "text/css";
                break;
            }
        }
    };
    this.covert = function (words) {
        var coverOne = function (name) {
            var face = "";
            var src = "";
            name = name.replace(/\[|\]/g, "");
            for (var i = 0; i < faceTitles.length; i++) {
                if (name == faceTitles[i]) {
                    //将原来的js 路径改为正确的Images路径
                    filePath = filePath.replace('Css','Images');
                    src = filePath + "faces/face" + (i + 1) + ".gif";
                    break;
                }
            }
            if (src != "") {
                face = context.createElement("img");
                //face["title"] = name;
                face["src"] = src;
                face.style.border = "none";
                face.style.verticalAlign = "middle";
                face = face.outerHTML;
            } else {
                face = "[" + name + "]";
            }
            return face;
        };

        if (words) {
            var finds = words.match(/\[[\w|\/|\s]+\]/g);//替换表情
            if (finds && finds.length > 0) {
                for (var i = 0; i < finds.length; i++) {
                    var text = finds[i];
                    words = words.replace(text, coverOne(text));
                }
            }
        }
        return words;
    };
    this.bind = function (p, h) {
        handler = h;
       // createPanel();
        panel = p;
        fillFace();
        return panel;
    };
    loadStyle();
};
