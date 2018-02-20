(function () {
	var cm = new common();
	cm.get('submit_ok').onclick = function () {
		var pass1 = cm.get("pass1").val();
        var pass2 = cm.get("pass2").val();
        if (pass1 == ""|| pass1 == null){
            cm.get("error_info").html(cm.i18n('new password'));
            return false;   
        }
        if (pass2 == ""|| pass1 == null) {
            cm.get("error_info").html(cm.i18n('new password'));
            return false;
        }
        //判断之：两次输入不一致
        else if(pass1 !== pass2){
            cm.get("error_info").html(cm.i18n('not_equal'));
            return false;
        }
        cm.ajax("index.php?m=Index&c=Forget&a=modify", {pwd: pass1}, function (res) {
            if (res["status"] == 'success') {
                alert('ok');
                window.location='index.php?m=Index&c=Home&a=index';
            }else {
                alert('failed');
                window.location='index.php?m=Index&c=Index&a=index';
            }
        });
	}
})();