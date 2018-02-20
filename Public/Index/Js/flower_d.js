// 虚拟礼物
(function () {
    var curType = 0;
    var curVirtual = null;
    var pageSize = 36;
    var index = 0;
    var cm = new top.common(document);
    var mySelf =  cm.getUserId();
    var user = cm.getSpaceUser();

    var initPage = function () {
        if (mySelf != user['id']) {
            cm.get('Uname').val(user['username']);
            cm.get('Uid').val(user['id']);
        }
        cm.get("tab_0").onclick();
    };

    cm.get("search").onclick = function () {
        var account = cm.getUser()["username"];
        var input = cm.get("Uname");
        var val = input.value;
        cm.ajax("index.php?m=Index&c=User&a=search", {name: input.val()}, function (msg) {
            if (msg["status"] == 'success') {
                alert('ok');
                cm.get('Uname').val(msg["data"]['username']);
                cm.get('Uid').val(msg["data"]['id']);
            }else{
                alert("error");
            }
        });
    };

    var showType = function (type, page) {
        var currentItem = null;
        var createItem = function (virtual) {
            var item = cm.mk("div");
            var pic = cm.mk("img");
                pic.cls("item_img");
                pic.src = virtual["url"];
                pic.hover("item_img_hover");
            var name = cm.mk("span"); 
                name.html(virtual["price"]);
            
            item.cls("item");
            item.title = virtual["name"];
            item.onclick = function () {
                if (currentItem != this) {
                    if (currentItem != null) {
                        currentItem.firstChild.removeCls("item_focus");
                    }
                    this.firstChild.addCls("item_focus");
                    currentItem = this;
                    curVirtual = virtual;
                    cm.get("words").val(curVirtual["words"]);
                }
            };
            item.append(pic);
            item.append(name);
            return item;
        };
        
        cm.ajax("index.php?m=Index&c=Gift&a=getList", {index: index++, size: 130, 'type': 'virtual', cate: 'virtual'}, function (res) {
            if (res["status"] == 'success') {
                var list = res["data"];
                var panel = cm.get("list_" + type);
                for (var i = 0, len = list.length; i < len; i++) {
                    var item = createItem(list[i]);
                    panel.append(item);
                }
                if (len < pageSize) {
                    panel.stop();
                }
            }
        });
    };
    
    var inittab = function () {//创建了导航
        cm.ajax("index.php?m=Index&c=Gift&a=getCatList",{} ,function (msg) {
                    if (msg.status == 'success') {
                        var tab = cm.get('tab');
                       // alert(tab);
                        var length = msg.data.length < 8 ? msg.data.length:8;
                        for(var i=0; i<length; i++) {
                            var div = cm.mk('div');
                                if (msg.data[i].id == 0) {
                                    div.cls('tab_item tab_focus');
                                }else{
                                    div.cls('tab_item');
                                }
                                div.hover('tab_item tab_focus');
                                div.html(msg.data[i].name);
                                div.id = 'tab_'+msg.data[i].id;
                                //alert(div);
                                //div.setAttribute('name','tab');//ie8-不支持
                                
                                div.onclick = function () {
                                    // var tabs = document.getElementsByName('tab');
                                    // var lists = document.getElementsByName('list');
                                    var tabs = document.getElementsByClassName('tab_item');
                                    var lists = document.getElementsByClassName('list');
                                    
                                    //alert(lists.length);
                                    for (var i = 0; i < tabs.length ; i ++) {
                                        //tabs[i].setAttribute('class','tab_item');
                                        tabs[i].cls('tab_item');
                                    }
                                    for (var i = 0; i < lists.length ; i ++) {
                                        lists[i].style.display="none"; 
                                    }
                                    catId = this.id.split('_')[1];
                                    cm.get('tab_'+catId).addCls('tab_focus');
                                    if (cm.get('list_'+catId)) {
                                        cm.get('list_'+catId).show();
                                    }else{
                                        cm.ajax("index.php?m=Index&c=Gift&a=getList", {index: index++, size: 130, type:'virtual', cate:catId}, function (res) {
                                            if (res["status"] == 'success') {
                                                var panelj = cm.get('panelj');
                                                var list = cm.mk('div');
                                                    list.cls('list');
                                                    list.id = 'list_'+catId;

                                                    //list.setAttribute('name','list');
                                                    list.style.display="block";
                                                for (p in res['data']) {
                                                    var item = cm.mk('div');
                                                    item.cls('item');
                                                    item.title = res['data'][p].name;
                                                    item.id = res['data'][p].id;
                                                    item.price = res['data'][p].price;
                                                    item.onclick = function () {
                                                        var gifts = document.getElementsByClassName('item');
                                                        for (var i = 0 ; i < gifts.length ; i ++) {
                                                            gifts[i].className = 'item';
                                                        }
                                                        this.addCls('item_focus');
                                                        cm.get('Fid').val(this.id);
                                                        cm.get('price').val(this.price);
                                                    }
                                                    var img = cm.mk('img');
                                                    img.src = res['data'][p].img;
                                                    var span = cm.mk('span');
                                                    span.html(res['data'][p].price);
                                                    item.append(img);
                                                    item.append(span);
                                                    list.append(item);
                                                    panelj.append(list); 
                                                }
                                            }
                                        });
                                    }
                                }
                            tab.append(div);
                        }
                    } else {
                        alert("error");
                    }
                });
    }
    //送给谁：
    var getFname = function () {
        var Fname=cm.get("Fname_id").val();
        if(Fname==''||null){
            alert("请输入您要送给的好友");
            false;
        }else{
            true;
        }
    }
    //setTimeout(getFname,5000);
    
    //余额：
    var isEnough4Virtual = function (price) {
        var me = cm.getUser();
        var status = me["inner_member"] == 1;
        if (!status) {
            var g = me["gold"];
            status = (g > 0) && eval(price) <= eval(g);
        }
        if (!status) {
            alert(cm.i18n("need_recharge"));
            cm.showPay({type:"r"});
        }
        return status;
    };
    //发送
    var doSend = function () {
        var gid = cm.get('Fid').val();
        //alert(gid);
        if (gid == '' || gid == null || gid == 'undifined') {
            return false;
        }
        var price = cm.get('price').val();
        var Uid = cm.get("Uid").val();
        if (Uid == '' || Uid == null || Uid == 'undifined') {
            return false;
        }
        if (isEnough4Virtual(price)) {
            //var btn = this;
            var words = cm.get("words").val();
                words = words.replace(/^\s*|\s*cm/g, "");
            var fid = cm.get("Uid").val();
                    
            //btn.disabled = true;

            // cm.ajax("action/gift/buy", {
            cm.ajax("index.php?m=Index&c=Flower&a=sendGift", {
                fid: Uid, gid: gid, words: words, type: 0
            }, function (res) {
                var status = res["status"];
                if (status == 'success') {
                    var balance = res["balance"];
                    if (balance) {
                        cm.getUser()["gold"] = balance;
                    }
                    alert("ok");
                } else {
                    alert("error");
                }
                //btn.disabled = false;
                //frameElement.cancel();
            });
        }
    };
    //绑定事件(发送)
    var setEVLENT= function ( ) {
        var sendbtn=document.getElementById("but_send");
            sendbtn.onclick=doSend;
    }
     

    inittab();
    setEVLENT();
    //initPage();
    setTimeout(initPage,3500);
    //setTimeout(function(){initPage()},3000); 
})();
// JavaScript Document
(function () {
    var currentReal = null;
    var cm = new top.common(document);
    var readFlower = function () {
        var flowerArray = null;
        var index = 0;
        //获取id=panel的元素
        var outer = cm.get("panel3");
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

    document.flowerCate = 'real';

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


//情人节礼物
// JavaScript Document
(function () {
    var currentReal = null;
    var cm = new top.common(document);
    var readFlower = function () {
        var flowerArray = null;
        var index = 0;
        //获取id=panel的元素
        var outer = cm.get("panel2");
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

    document.flowerCate = 'valentine';

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


