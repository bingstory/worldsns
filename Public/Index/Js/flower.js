// JavaScript Document
(function () {
    var currentReal = null;
    var cm = new top.common(document);
    var readFlower = function () {
        var flowerArray = null;
        var index = 0;
        var outer = cm.get("panel");
        var preItem = null;
        currentReal = null;
        outer.html("");
        cate = document.flowerCate;
        cm.ajax("index.php?m=Index&c=Gift&a=getList", {index: index++, size: 130, 'type': 'real', cate: cate}, function (msg) {
            flowerArray = msg["data"];
            for (var i = 0, len = flowerArray.length; i < len; i++) {
                var flower = flowerArray[i];
                var item = createItem(flower);
                outer.appendChild(item);
            }
            cm.doHome("freshHome");
        });
        cm.doHome("freshHome");
    };

    var createItem = function (flower) {
        var item = cm.mk("div");
        var picOuter = cm.mk("div");
        var pic = cm.mk("img");
        var name = cm.mk("div");
        var price = cm.mk("div");

        item.cls("item");
        picOuter.cls("item_pic");
        name.cls("item_name");
        price.cls("item_price");


        item.title = flower["name"];
        name.innerHTML = flower["name"];
        price.innerHTML = flower["price"];

        picOuter.appendChild(pic);
        item.appendChild(picOuter);
        item.appendChild(name);
        item.appendChild(price);

        pic.width = '180px';
        //pic.height = '180px';
        pic.src = flower["img"];
        pic.onload=function(){
            cm.doHome("freshHome");
        };
        item.onclick = function () {
            cm.showFlower(flower);
        };
        return item;
    };
    readFlower();
})();