var friendid="";
var friendname="";
var friendicon="";
var friendgender="";
var country="";
//他人主页
var personalGift=function(){
	var friendGiftid="giftf_"+friendid;
	parent.SendGiftmenu('virtual',0,'all',friendGiftid);
}
var personalAlbum=function(){
	parent.PhotoAlbumPage(friendid);
}

var PersonalFriendHomepage=function (){
	parent.PersonalfriendHome();
	
	PersonalFriendbottonabount();
	friendid = getQueryString("friendid");	
	parent.Giftpage="FriendPage";
	document.getElementById("personal_album").innerHTML=Photoalbum;
	document.getElementById("personal_collection").innerHTML=collections;
	document.getElementById("personal_gift").innerHTML=gifts;
	document.getElementById("personal_chat").innerHTML=chatlang;	
	document.getElementById("per_left_abount").innerHTML=AboutMy;
	document.getElementById("per_right_freshNews").innerHTML=freshNews;
	document.getElementById("per_abount_title").innerHTML=AboutMyself;
	document.getElementById("TheBasicInformation").innerHTML=EssentialInformation;
	document.getElementById("gender").innerHTML=Sex;
	document.getElementById("birthday").innerHTML=Birthday;
	document.getElementById("language").innerHTML=languages;
	document.getElementById("weight").innerHTML=weights;
	document.getElementById("height").innerHTML=heights;
	document.getElementById("AffectionIsIntroduced").innerHTML=AffectionIsIntroduced;
	document.getElementById("sexuality").innerHTML=SexualOrientation;
	document.getElementById("relationship").innerHTML=EmotionalState;
	document.getElementById("GeographicalPosition").innerHTML=geographicPosition;
	document.getElementById("country").innerHTML=countries;
	document.getElementById("city").innerHTML=citys;
	document.getElementById("EducationAndWork").innerHTML=EducationWork;
	document.getElementById("education").innerHTML=Education;
	document.getElementById("work").innerHTML=works;
	document.getElementById("income").innerHTML=incomes;
	
	//alert(parent.token);
	var langphp=getCookie("lang");
	doAjax("index.php?m=Wap&c=Space&a=ajax_profile", {id:friendid,lang:langphp}, function (PersonalHomepagemsg){
		var obj = JSON.parse(PersonalHomepagemsg);
		
		if(obj.status=="success"){
			parent.document.getElementById("header_top_title").innerHTML=obj.data.base['username'];

			var ps=0;
			var photo=0;
			friendname=obj.data.base['username'];
			document.getElementById("per_abount_title").innerHTML="关于"+obj.data.base['username'];
			var PersonalPhotos=document.getElementById("mySwipe");
			var onerroricon="javascript:this.src='Public/Wap/Images/bigpicture.png'";
			var home_sliders = document.getElementById("home_slider");
			home_sliders.innerHTML="";
			var slides=document.createElement("ul");
			slides.id="home_phont";
			slides.className="slides";
			var friendphotes="";
			var friendphonteAlbum="";
			friendphotes=obj.data.photo;
			friendphonteAlbum=obj.data.album;
			
			/*var Albumaobj1=new Array();
				Albumaobj1["id"]=1;
				Albumaobj1["name"]="defaults";
				Albumaobj1["time"]="";
			var Albumaobj2=new Array();
				Albumaobj2["id"]=2;
				Albumaobj2["name"]="icons";
				Albumaobj2["time"]="";
			friendphonteAlbum.unshift(Albumaobj2);
			friendphonteAlbum.unshift(Albumaobj1);*/
			for (album in friendphonteAlbum) {
				if (album['name'] == 'default_album') {
                    album['name'] = defaults;
                }
                if (album['name'] == 'header_album') {
                    album['name'] = icons;
                }
			}
			parent.phontes=friendphotes;
			parent.phonteAlbum=friendphonteAlbum;
					
			for(var j=0; j<friendphotes.length; j++){
				photo=photo+friendphotes.length;
					//for(var i=0;i<friendphotes.length;i++){
						var newNodea=document.createElement("li");
						var slide=document.createElement("div");
						slide.className="slide";
						var w=document.documentElement.clientWidth;
						var slideimg=document.createElement("img");
						slideimg.src=getImgSize(friendphotes[j].url,0);
						slideimg.onload=function(){
									//Zoom(this,w);
									};
						//slide.innerHTML="<img src='"+getImgBySize(obj.data[j].photos[i].url,0)+"' onload='Zoom(this,"+w+")' alt='' />";
						slide.insertBefore(slideimg,null);
						slides.insertBefore(newNodea,null);
						newNodea.insertBefore(slide,null);
						ps++;
					//}
			}
			if(photo==0){
				var newNodea=document.createElement("li");
				var slide=document.createElement("div");
				slide.className="slide";
				var w=document.documentElement.clientWidth;
				slide.innerHTML="<img src='Public/Wap/Images/bigpicture.png' onload='Zoom(this,"+w+")' alt='' />";
				var a=slides.insertBefore(newNodea,null);
				newNodea.insertBefore(slide,null);
			}
			
			//newNodea.insertBefore(slides,null);
			home_sliders.insertBefore(slides,null);
			$('#home_slider').flexslider({
				animation : 'slide',
				controlNav : true,
				directionNav : true,
				animationLoop : true,
				slideshow : false,
				useCSS : false
			});
			document.getElementById('Head-tupianshuliang').innerHTML =ps;		
			var onerroricon="javascript:this.src='Public/Wap/Images/alila/male.png'";
			if(obj.data.base['gender']=='male'){
				onerroricon="javascript:this.src='Public/Wap/Images/alila/male.png'";	
			}else{
				onerroricon="javascript:this.src='Public/Wap/Images/alila/female.png'";	
			}
			var memberships="";
			if(obj.data.base['level']==1){
				memberships="<img src='Public/Wap/Images/crown1.png' class='Head-img-Diamond1'>";
			}else if(obj.data.base['level']==2){
				memberships="<img src='Public/Wap/Images/crown2.png' class='Head-img-Diamond1'>";
			}
			if (obj.data.base['header']) {
				friendicon=getImgSize(obj.data.base['header'],80);
			}else{
				if (obj.data.base['sex'] == 'male') {
					friendicon="Public/Wap/Images/alila/male.png";
				}else{
					friendicon="Public/Wap/Images/alila/female.png";
				}
			}
			document.getElementById('friend-img-Diamond1').innerHTML =memberships;
			document.getElementById('Head-portrait').innerHTML ="<img src='"+friendicon+"' onerror="+onerroricon+" class='homepage-content-imgx'>";
			document.getElementById('Head-name').innerHTML =obj.data.base['username'];
			
			var about=obj.data.base['mood_content'];
			if(about==0){	
				document.getElementById('per_about').style.color="#6f6e6e";
				document.getElementById('per_about').innerHTML =Introduceyourself;
			}else{
				document.getElementById('per_about').style.color="#3c3c3c";
				document.getElementById('per_about').innerHTML = about;
			}
			if(obj.data.base['sex']=='male'){						
				document.getElementById('per_gender').innerHTML =boy;
			}else{
				document.getElementById('per_gender').innerHTML =girl;
			}												
			var dateObj = new Date();
            var year = dateObj.getFullYear();
            var age = year -  obj.data.base['year'];
			if(age==0){						
				document.getElementById('per_age').innerHTML ="";
			}else{
				document.getElementById('per_age').innerHTML = age;
			}
			var language=obj.data.base['language'];
			if(language==0){					
				document.getElementById('per_language').innerHTML ="";
			}else{
				document.getElementById('per_language').innerHTML = language;
			}
			var weights=obj.data.base['weight'];
			if(weights==-1){						
				document.getElementById('per_weight').innerHTML ="";
			}else{
				document.getElementById('per_weight').innerHTML = weight[weights];
			}
			var heights=obj.data.base['height'];
			if(heights==-1){							
				document.getElementById('per_height').innerHTML ="";
			}else{
				document.getElementById('per_height').innerHTML = height[heights];
			}
			var sexualitys=obj.data.base['sexuality'];
			if(sexualitys==-1){							
				document.getElementById('per_sexuality').innerHTML ="";
			}else{
				document.getElementById('per_sexuality').innerHTML = sexuality[sexualitys];
			}
			var relationships=obj.data.base['relationship'];
			if(relationships==-1){						
				document.getElementById('per_relationship').innerHTML ="";
			}else{
				document.getElementById('per_relationship').innerHTML = relationship[relationships];
			}
			var country=obj.data.base['country'];
			if(country==0){					
				document.getElementById('per_country').innerHTML ="";
			}else{
				document.getElementById('per_country').innerHTML = country;
			}
			var city=obj.data.base['city'];
			if(city==0){						
				document.getElementById('per_city').innerHTML ="";
			}else{
				document.getElementById('per_city').innerHTML = city;
			}
			var educations=obj.data.base['education'];
			if(educations==-1){						
				document.getElementById('per_education').innerHTML ="";
			}else{
				document.getElementById('per_education').innerHTML = education[educations];
			}
			var work=obj.data.base['worker'];
			if(work==0){						
				document.getElementById('per_work').innerHTML ="";
			}else{
				document.getElementById('per_work').innerHTML = work;
			}
			var incomes=obj.data.base['income'];
			if(incomes==-1){
			
				document.getElementById('per_income').innerHTML ="";
			}else{							
				document.getElementById('per_income').innerHTML = income[incomes];													
			}				

		}
	});
}

var PersonalFriendbottonabount=function (){
	document.getElementById("per_left_abount").style.borderBottom="1px solid #017CCB";
	document.getElementById("per_right_freshNews").style.borderBottom="1px solid #E6E6E6";
	document.getElementById("per_personal_data").style.display="block";
	document.getElementById("per_freshNews").style.display="none";
	
}
var PersonalFriendbottonfreshNews=function (){
	p=0;
	PersonalFriendfreshNewsList();
	document.getElementById("per_left_abount").style.borderBottom="1px solid #E6E6E6";
	document.getElementById("per_right_freshNews").style.borderBottom="1px solid #017CCB";
	document.getElementById("per_personal_data").style.display="none";
	document.getElementById("per_freshNews").style.display="block";
}
var PersonalFriendfreshNewsList=function(){
	var size =20;
	var perfreshNews_homepages=document.getElementById("per_freshNews");

	var ajaxpage="perfreshNewsmsg";	
	doAjax("index.php?m=Wap&c=Dynamic&a=getOneList", {index:p++,size:size,sid:friendid}, function (perfreshNewsmsg){
		var obj = JSON.parse(perfreshNewsmsg);
		if(obj.status=="success"){
			var perfreshNews_Contact=document.getElementById("per_freshNews_list");
			if(obj.data.length>0){
				if(obj.data.length<20){		
					document.getElementById("per_freshNews_submit").style.display="none";
				}
				for(var i=0; i<obj.data.length; i++){
					var UserIcon=getImgSize(friendicon,80);
					var onerroricon="javascript:this.src='Public/Wap/Images/alila/male.png'";					
					
					if(friendgender=='male'){
						onerroricon="javascript:this.src='Public/Wap/Images/alila/male.png'";	
					}else{
						onerroricon="javascript:this.src='Public/Wap/Images/alila/female.png'";	
					}					
					var freshNewscontent="";
					if(obj.data[i].content!==null || obj.data[i].content==""){
						freshNewscontent=JsExpressionContent(obj.data[i].content);
					}
					var freshNews_content_photos="";
				
					if(obj.data[i].urls==null || obj.data[i].urls==undefined || obj.data[i].urls==''){
						freshNews_content_photos="";
					}else{
						var photosid=obj.data[i].urls;
						var photosimg="";
						for(var p=0; p<photosid.length;p++){
							if(photosid.length>1){
								photosimg+="<img src='"+getImgSize(photosid[p],180)+"' class='homepage-photos-imgs'>";
							}else{
								photosimg="<img src='"+getImgSize(photosid[p],0)+"' class='homepage-photos-img'>";
							}
							
						}
						freshNews_content_photos=photosimg;
					}
					var freshNews_content_type="";
					if(obj.data[i].type==2){
						freshNews_content_type=UploadThePicture;
					}else if(obj.data[i].type==3){
						freshNews_content_type=UploadPhotos;
					}
					var peroDiv=document.createElement("div");
					peroDiv.id=obj.data[i].id;
					peroDiv.className="freshNews_botton";
					var peroDivleft=document.createElement("div");
					peroDivleft.id=obj.data[i].id+"-"+friendname;
					peroDivleft.onclick=function(){
											parent.Personalfreshchat(this.id);
											};
					peroDivleft.className="freshNews_botton_left";
					peroDivleft.innerHTML ="<div class='freshNews_botton_img'><img src='Public/Wap/Images/encounterim.png' style='width: 30px;  margin: 3px auto;'></div>";
					peroDiv.appendChild(peroDivleft);
					var peroDivright=document.createElement("div");
					peroDivright.id="freshNews_right_"+obj.data[i].id;
					peroDivright.className="freshNews_botton_right";
					peroDivright.onclick=function(){
												freshNewsShareOpen(this.id);
											};
					peroDivright.innerHTML ="<div class='freshNews_botton_img'><img src='Public/Wap/Images/share.png' style='width: 30px;  margin: 3px auto;'></div>";
					peroDiv.appendChild(peroDivright);
					var peroDivcontent=document.createElement("div");
					peroDivcontent.id=obj.data[i].id;
					peroDivcontent.name=obj.data[i].user_id;
					if(freshNewscontent){
						peroDivcontent.onclick=function(){
													var inpid="certid"+this.id;
													var valuecontent=document.getElementById(inpid);
													parent.divcenteropen(this.id,3,valuecontent.value);
												};
					}else{
						peroDivcontent.onclick=function(){
													alert(tranno);
												};
					}
					peroDivcontent.className="freshNews_botton_content";
					peroDivcontent.innerHTML ="<div class='freshNews_botton_img'><img src='Public/Wap/Images/translation.png' style='width: 30px;  margin: 3px auto;'></div>";
					peroDiv.appendChild(peroDivcontent);
					var perfreshNewsLists=document.createElement("div");
					perfreshNewsLists.className='honepage-freshNews-list';
					perfreshNewsLists.innerHTML="<div class='freshNews_user'><div class='freshNews_user_left'><img src='"+UserIcon+"' onerror="+onerroricon+" class='homepage-freshNews-img'></div><div class='freshNews_user_conter'><div class='visiting_style'>"+friendname+"</div><div class='visiting_style visiting_style_country'>"+country+"</div></div><div class='freshNews_user_right'><div class='freshNews_user_img'>"+datatime(obj.data[i].created)+"</div><img src='Public/Wap/Images/jiantou.png' style='width: 15px;float: right;  margin: 3px;'></div></div><div class='freshNews_content'><div class='freshNews_content_content'>"+freshNewscontent+"</div><div id='txt_"+obj.data[i].id+"'  class='freshNews_content_txt'></div><input id='certid"+obj.data[i].id+"' type='hidden' value='"+obj.data[i].content+"' ><div class='freshNews_content_photos'>"+freshNews_content_photos+"</div><div class='freshNews_content_type'>"+freshNews_content_type+"</div></div>";
					perfreshNewsLists.appendChild(peroDiv);
					perfreshNews_Contact.appendChild(perfreshNewsLists);
				}
			}else{
			}
		}
	});
}

//个人相册图片
var PersonalFriendPhoto=function (){
	doAjax("index.php?m=Wap&c=Space&a=", {friendid:friendid,userId:parent.id,token:parent.token }, function (PersonalPhotomsg){
		var obj = JSON.parse(PersonalPhotomsg);		
		var ps=0;
		var photo=0;
		var PersonalPhotos=document.getElementById("mySwipe");
		if(obj.status=="success"){
			var onerroricon="javascript:this.src='Public/Wap/Images/bigpicture.png'";
			var home_sliders = document.getElementById("home_slider");
			home_sliders.innerHTML="";
			var slides=document.createElement("ul");
			slides.id="home_phont";
			slides.className="slides";

				for(var j=0; j<obj.data.length; j++){
					photo=photo+obj.data[j].photos.length;
						for(var i=0;i<obj.data[j].photos.length;i++){
							var newNodea=document.createElement("li");
							var slide=document.createElement("div");
							slide.className="slide";
							var w=document.documentElement.clientWidth;
							var slideimg=document.createElement("img");
							slideimg.src=getImgSize(obj.data[j].photos[i].url,0);
							slideimg.onload=function(){
										Zoom(this,w);
										};
							//slide.innerHTML="<img src='"+getImgBySize(obj.data[j].photos[i].url,0)+"' onload='Zoom(this,"+w+")' alt='' />";
							slide.insertBefore(slideimg,null);
							slides.insertBefore(newNodea,null);
							newNodea.insertBefore(slide,null);
							ps++;
						}
				}
				if(photo==0){
					var newNodea=document.createElement("li");
					var slide=document.createElement("div");
					slide.className="slide";
					var w=document.documentElement.clientWidth;
					slide.innerHTML="<img src='Public/Wap/Images/bigpicture.png' onload='Zoom(this,"+w+")' alt='' />";
					var a=slides.insertBefore(newNodea,null);
					newNodea.insertBefore(slide,null);
				}
				
				//newNodea.insertBefore(slides,null);
				home_sliders.insertBefore(slides,null);
						$('#home_slider').flexslider({
							animation : 'slide',
							controlNav : true,
							directionNav : true,
							animationLoop : true,
							slideshow : false,
							useCSS : false
							});
			document.getElementById('Head-tupianshuliang').innerHTML =ps;			
		}
	});
}
PersonalFriendHomepage();

var Addcollection=function(){	
	parent.collectionAdd(friendid);	
}
var personalChat=function(){
	if(parent.membership==0 && parent.innerMember!=1){
		alert(UpgradePrompt);
		parent.Upgradepage();
	}else{
		var personalChatid=friendid+"-"+friendname;
		parent.Personalfreshchat(personalChatid);
	}
}
var freshNewsShareOpen=function(shareid){
	shareid=shareid.substr(16);
	var ShareSummaryid="certid"+shareid;
	var Sharepicid="pic"+shareid;
	
	ShareSummary=document.getElementById(ShareSummaryid).value;
	//Sharepic=document.getElementById(Sharepicid).value;
	Sharepic = '';
	if(ShareSummary==null || ShareSummary==undefined || ShareSummary==''){
		ShareSummary=ShareContent;
	}else{
		ShareSummary=ShareSummary;
	}
	if(Sharepic==null || Sharepic==undefined || Sharepic==''){
		Sharepic='Public/Wap/Images/ABOUT.png';
	}else{
		Sharepic=Sharepic;
	}
	//分享qq空间
	qzOpener(ShareSummary,Sharepic);
	//分享qq好友qcShareqq
	qcShareqq(ShareSummary,Sharepic);
	//分享新浪微博weiboSharexinlangs
	weiboShare(ShareSummary,Sharepic);
	//分享到Vk
	vkShares(ShareSummary,Sharepic);
	//分享到twitter
	twitterShares();
	//分享到fb
	fbShares();
	document.getElementById("freshNews_share").style.display="block";
	document.getElementById("freshNews_sharebg").style.display="block";
}
var freshNewsShareClose=function(){
	ShareSummary="";
	Sharepic="";
	document.getElementById("freshNews_share").style.display="none";
	document.getElementById("freshNews_sharebg").style.display="none";
}
//分享qq空间
var qzOpener=function(ShareSummary,Sharepic){
	var p = {
	url:parent.yangurl+"?sid="+parent.simpleId,
	showcount:'0',/*是否显示分享总数,显示：'1'，不显示：'0' */
	desc:'',/*默认分享理由(可选)*/
	summary:ShareSummary,/*分享摘要(可选)*/
	title:Sharetitle,/*分享标题(可选)*/
	site:'',/*分享来源 如：腾讯网(可选)*/
	pics:Sharepic, /*分享图片的路径(可选)*/
	style:'',
	width:39,
	height:39
	};
	var s = [];
	for(var i in p){
		s.push(i + '=' + encodeURIComponent(p[i]||''));
	}
	var qqurl="http://sns.qzone.qq.com/cgi-bin/qzshare/cgi_qzshare_onekey?"+s.join('&');
	document.getElementById("qzOpeners").innerHTML="<a version='1.0' class='qzOpenerDiv' href='"+qqurl+"' target='_blank'><img src='Public/Wap/Images/qzone.png' class='class-img'></a>";
}
//分享qq好友qcShareqq
var qcShareqq=function(ShareSummary,Sharepic){
	var p = {
	url:parent.yangurl+"?sid="+parent.simpleId, /*获取URL，可加上来自分享到QQ标识，方便统计*/
	desc:'', /*分享理由(风格应模拟用户对话),支持多分享语随机展现（使用|分隔）*/
	title:Sharetitle, /*分享标题(可选)*/
	summary:ShareSummary, /*分享摘要(可选)*/
	pics:Sharepic, /*分享图片(可选)*/
	flash: '', /*视频地址(可选)*/
	site:'', /*分享来源(可选) 如：QQ分享*/
	style:'201',
	width:32,
	height:32
	};
	var s = [];
	for(var i in p){
	s.push(i + '=' + encodeURIComponent(p[i]||''));
	}
	var qqurl="http://connect.qq.com/widget/shareqq/index.html?"+s.join('&');
	document.getElementById("qcShareqqs").innerHTML="<a class='qcShareQQDiv' href='"+qqurl+"' target='_blank'><img src='Public/Wap/Images/qq.png' class='class-img'></a>";
}
//分享新浪微博weiboSharexinlangs
var weiboShare=function(ShareSummary,Sharepic){
	var p = {
	url:parent.yangurl+"?sid="+parent.simpleId, /*获取URL，可加上来自分享到QQ标识，方便统计*/
	title:Sharetitle, /*分享标题(可选)*/
	pic:Sharepic

	};
	var s = [];
	for(var i in p){
	s.push(i + '=' + encodeURIComponent(p[i]||''));
	}
	var qqurl="http://service.weibo.com/share/share.php?"+s.join('&');
	document.getElementById("weiboSharexinlangs").innerHTML="<a class='' href='"+qqurl+"' target='_blank'><img src='Public/Wap/Images/weibo.png' class='class-img'></a>";
	
}
//分享微信
var veixinShare=function() { 
	 if (typeof WeixinJSBridge == "undefined") { 
		//alert("请先通过微信搜索 wow36kr 添加36氪为好友，通过微信分享文章 "); 
	 } else {
		 WeixinJSBridge.invoke('shareTimeline', {
		 "title": Sharetitle, 
		 "link": yangurl+"?sid="+simpleId, 
		 "desc": ShareSummary, 
		 "img_url": Sharepic 
		 }); 
	 } 
 }
//分享twitter
var twitterShare=function(){
	var p = {
	u:parent.yangurl+"?sid="+parent.simpleId, /*获取URL，可加上来自分享到QQ标识，方便统计*/
	t:Sharetitle /*分享标题(可选)*/
	};
	var s = [];
	for(var i in p){
	s.push(i + '=' + encodeURIComponent(p[i]||''));
	}
	var qqurl="http://service.weibo.com/share/share.php?"+s.join('&');
	document.getElementById("weiboSharexinlangs").innerHTML="<a class='' href='"+qqurl+"' target='_blank'><img src='products/slideout/images/weibo.png' class='class-img'></a>";
	
}
//分享到Vk
var vkShares = function(ShareSummary,Sharepic) {
	document.getElementById("vkShares").innerHTML=(VK.Share.button({
		url: parent.yangurl+"?sid="+parent.simpleId,
		title: Sharetitle, 
		description: ShareSummary
		},{
		type: "custom",
		text: "<img src='/Public/Wap/Images/vk.png' class='class-img' />", 
		eng: 1
	}));
}
//分享到
var twitterShares = function() {
	var twitter = document.getElementById("twitterShares");
	url = 'http://twitter.com/home?status='+encodeURIComponent(parent.yangurl)+' '+encodeURIComponent(document.title);
	twitter.innerHTML = "<div><a class='fav_twitter' rel='nofollow' href="+url+"><img src='Public/Wap/Images/twitter.png' class='class-img'></a></div>";
}
//分享到Fb
var fbShares = function() {
	var fbShares = document.getElementById("fbShares");
	var url = 'http://www.facebook.com/sharer/sharer.php?u='+encodeURIComponent(parent.yangurl)+'&amp;t='+encodeURIComponent(Sharetitle);
	fbShares.innerHTML = "<div><a class='fav_facebook' rel='nofollow' href="+url+"><img src='Public/Wap/Images/fb.png' class='class-img'></a></div>";
}