var photos="";
var progressIndex = 0;
    var resultIndex = 0;
	var uploadHandler = [];
	var extraArgs="token=" + parent.token;
	var GetalbumId=getQueryString("Albumid");
var PhotoAdd=function (){
	parent.personalPhotoAddPage();
	document.getElementById("UploadPhotoBotton").innerHTML=UploadPhotoBotton;
	document.getElementById("UploadBotton_left").innerHTML=relection;
	document.getElementById("UploadBotton_right").innerHTML=uploading;
}
var Upload=function (){
	  file_head.click();
	}
var UploadPicturesAdd=function(urls,upf){
	if(upf){
		var UploadalbumId=upf;
	}else{
		var UploadalbumId=1;
	}	
	doAjax("index.php?m=Wap&c=Space&a=addPhoto&dir=photo", {urls:urls,albumId:UploadalbumId}, function (uploadphotomsg){
			var obj = JSON.parse(uploadphotomsg);
			if(obj.status=='success'){
				parent.PersonalData();
				parent.PersonalHomepage();
			}
	});	
}
	    var dealFile = function () {
        try {
			var action="index.php?m=Wap&c=Upload&a=upload";
			var file = document.getElementById("file_head").files[0];
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
                    uploadAjax(action, {data: base64, name: name}, function (msg) {
						if(msg['status']=='success'){
							//alert();
							
							document.getElementById("preview").src=msg['url'];
							UploadPicturesAdd(msg['url'],GetalbumId);
						}
						
                     
                    }, true);
                }
            };
        } catch (e) {
            alert(e)
        }
    };


 

PhotoAdd();