// JavaScript Document
(function () {
    var start = 0;
    var self = this;
    var cm = new top.common(document);
    var urlArr = [];
    var currentAlbumId = 1;

    this.uploadHandler = function (type, msg) {
        if (type == 0) {
            urlArr = [];
        } else if (type == 1) {
            urlArr.push(msg["url"]);
        } else if (type == 4) {
            var albumId = currentAlbumId;
            cm.ajax("index.php?m=Index&c=Space&a=addPhoto", {urls: urlArr.join(","), albumId: albumId}, function (res) {
                if (res["status"] == 'success') {
                    var album = cm.getSpaceUser()["albumMap"][albumId];
                    album["list"] = res["photo"].concat(album["list"]);
                    if (cm.get("photo_panel").isVisible()) {
                        loadPhotos();
                    } else {
                        loadAlbums();
                    }
                }
            });
        }
    };
    var initPage = function () {
        var tab_photo = cm.get("tab_photo");
        var tab_album = cm.get("tab_album");
        var photoPanel = cm.get("photo_panel");
        var albumPanel = cm.get("album_panel");

        tab_photo.onclick = function () {
            this.addCls("tab_focus");
            tab_album.removeCls("tab_focus");
            photoPanel.show();
            albumPanel.hide();
            loadPhotos();
            cm.doHome("freshSpace");
        };
        tab_album.onclick = function () {
            this.addCls("tab_focus");
            tab_photo.removeCls("tab_focus");
            photoPanel.hide();
            albumPanel.show();
            loadAlbums();
            cm.doHome("freshSpace");
        };

        if (cm.isSelf() && cm.getUser()["role"] != 3) {
            cm.get("bar").show();
            initGroup();
            new Gwx.PhotoUploader({
                width: 100,
                height: 23,
                render: "flash",
                handler: self.uploadHandler,
                count: 10,
               // type: "flash",
                extraArgs: "token=" + cm.getToken(),
                action: "index.php?m=Index&c=Upload&a=upload&dir=photo"
            });

            cm.get("build").onclick = function () {
                var wrp = cm.mk("div");
                var label = cm.mk("label");
                var input = cm.mk("input");
                wrp.cls("s_dlg_build");
                label.cls("s_dlg_build_label");
                input.cls("s_dlg_build_input");

                label.html(cm.i18n('name'));
                wrp.append(label);
                wrp.append(input);

                var dlg = cm.getDlg();
                dlg.showHtml(400, 150, cm.i18n('new'), wrp);

                dlg.addBtn(cm.i18n("cancel"), dlg.cancel);
                dlg.addBtn(cm.i18n("done"), function () {
                    var name = input.val();
                    if (!cm.isEmpty(name)) {
                        cm.ajax("index.php?m=Index&c=Space&a=addAlbum", {name: name}, function (res) {
                            var su = cm.getSpaceUser();
                            if (su) {
                                var album = res["album"];
                                var albumId = album["id"];
                                album["list"] = [];
                                su["albumMap"][albumId] = album;
                                dlg.cancel();
                                initGroup();
                                loadAlbums();

                                currentAlbumId = albumId;
                                cm.get("group_default").html(name);
                            }
                        });
                    }
                }, "blue");

                input.focus();
            };

        }

    };
    var loadPhotos = function () {
        var photoPanel = cm.get("photo_list");
        var albumMap = cm.getSpaceUser()["albumMap"];
        photoPanel.html("");
        for (var id in albumMap) {
            var photoList = albumMap[id]["list"];
            for (var j = 0, len4j = photoList.length; j < len4j; j++) {
                var photo = photoList[j];
                photoPanel.append(createPhoto(photo))
            }
        }
        cm.doHome("freshSpace");
    };


    var createPhoto = function (photo) {
        var item = cm.mk("div");
        var frame = cm.mk("div");
        var img = cm.mk("img");

        img.onerror = function () {
            this.show();
            this.style.width = 165 + "px";
            this.style.height = 145 + "px";
        };

        img.onload = function () {
            this.show();
            var img = this;
            var maxPx = 165;
            var w = img.width;
            var h = img.height;
            if (h > w) {
                img.style.width = maxPx + "px";
                img.style.height = parseInt(h * maxPx / w) + "px";
            } else {
                w = parseInt((w * maxPx) / h);
                img.style.height = maxPx + "px";
                img.style.width = w + "px";
                img.style.marginLeft = -(w - maxPx) / 2 + "px";
            }
        };

        img.onclick = function () {
            cm.showPic(this.src);
        };

        frame.cls("photo_frame");
        item.cls("photo_item photo_loading");
        frame.append(img);
        item.append(frame);

        if (cm.isSelf()) {
            var remove = cm.mk("a");
            remove.className = "photo_remove";
            item.append(remove);
            remove.onclick = function () {
                cm.ajax("index.php?m=Index&c=Space&a=delPhoto", {photoId: photo["id"]}, function (res) {
                    if (res["status"] == 'success') {
                        item.parentNode.removeChild(item);
                        var list = cm.getSpaceUser()["albumMap"][photo["album"]]["list"];
                        for (var i = 0, len = list.length; i < len; i++) {
                            if (list[i]["id"] == photo["id"]) {
                                list.splice(i, 1);
                                break;
                            }
                        }
                    }
                });
            }
        }

        setTimeout(function () {
            img.src = cm.getImgBySize(photo["url"], "180");//涓€瀹氳鏀炬渶鍚庯紝濡傛灉鏈夌紦瀛樺姞杞戒細寰堝揩
        }, 100);
        return item;
    };
    var initGroup = function () {
        if (cm.isSelf()) {
            var group = cm.get("group");
            var group_list = cm.get("group_list");
            var albumMap = cm.getSpaceUser()["albumMap"];
            var createOption = function (album) {
                var albumId = album["id"];
                if (album["name"] == 'default_album') {
                    album["name"] = cm.i18n('default_album');
                }else if (album["name"] == 'header_album'){
                    album["name"] = cm.i18n('header_album');
                }
                var item = cm.mk("div");
                var name = album["name"];

                item.cls("group_list_item");
                item.html(name);

                item.onclick = function () {
                    currentAlbumId = albumId;
                    cm.get("group_default").html(name);
                    group_list.hide();
                };
                return item;
            };

            group_list.html("");

            for (var id in albumMap) {
                group_list.append(createOption(albumMap[id]));
            }

            group.hover("", function (t) {
                group_list[t ? "show" : "hide"]();
            });
        }
    };
    var loadAlbums = function () {
        var panel = cm.get("album_list");
        var temp = cm.get("album_tmp");

        temp.hide();
        panel.show();
        panel.html("");

        var albumMap = cm.getSpaceUser()["albumMap"];
        for (var id in albumMap) {
            var album = albumMap[id];
            panel.append(createAlbum(album));
        }

        initGroup();
    };


    /**
     * 鍒涘缓鐩稿唽鍏冪礌
     */
    var createAlbum = function (album) {
        var albumId = album["id"];
        var list = album["list"];
        var len = list.length > 4 ? 4 : list.length;
        var item = cm.mk("div");
        var board = cm.mk("div");
        var name = cm.mk("div");

        item.cls("album_item");
        board.cls("album_board");
        name.cls("album_name");

        name.innerHTML = album["name"];
        for (var i = 0; i < len; i++) {
            var photo = cm.mk("div");
            var img = cm.mk("img");
            photo.cls("album_photo");
            photo.append(img);
            board.append(photo);
            img.src = cm.getImgBySize(list[i]["url"], "80");
        }
        if (len > 0) {
            name.onclick = board.onclick = function () {
                showPhotoInAlbum(list);
                cm.doHome("freshSpace");
            };
        }

        if (albumId > 2 && cm.isSelf()) {//鍒犻櫎鎸夐挳
            var remove = cm.mk("div");
            remove.cls("album_item_remove");
            remove.onclick = function () {//鍒犻櫎鐩稿唽
                cm.ajax("index.php?m=Index&c=Space&a=delAlbum", {albumId: albumId}, function (res) {
                    if (res['status'] == 'success') {
                        var su = cm.getSpaceUser();
                        if (su) {
                            delete su["albumMap"][albumId];
                            initGroup();
                            loadAlbums();
                            loadPhotos();
                        }
                    }
                });
            };
            item.append(remove);
        }

        item.append(board);
        item.append(name);
        return item;
    };

    /**
     * 灞曠ず鐩稿唽鍥剧墖
     */
    var showPhotoInAlbum = function (photos) {
        var panel = cm.get("album_tmp");
        panel.html("");
        panel.show();
        cm.get("album_list").hide();

        for (var i = 0, len = photos.length; i < len; i++) {
            var photo = photos[i];
            photo["url"] = cm.getImgBySize(photo["url"], "180");
            panel.insertBefore(createPhoto(photo), panel.firstChild);
        }
    };

    if (!cm.isBlocked()) {
        initPage();
        loadPhotos();
    }
})();
