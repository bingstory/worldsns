var token=getCookie("token");
var langphp=getCookie("lang");
var role="";
var gold="";
var icon="";
//index 在线用户和推荐墙
var onclicktext=1;
var yangurl=window.location.host;
var WebSocketurl="";
var langCode="zh";
var id="";
var name="";
var membership="";	// 资格；成员资格；会员身份
var gender="";   //性别
var chatState="";
var j=0;
var d=0;
var fnews=0;
var v=0;
var c=0;
var g=0;
var e=0;
var a=0;
var b=0;
var f=0;
var Shop=0;
var menu_s=0;
var perfriendid="";
var Giftpage="";
var Giftsid=0;
var Gifttype=0;
var GiftUserId="";
var ReadPicture="";
var uploadurl="";
var LookFor="";
var PhotoAlbummsg="";
var personal_content_id="";
var InteractionMsg="";
var InteractVisitor=0;
var InteractGift=0;
var InteractMatch=0;
var InteractPassive=0;
var Marks="";
var HistoryContent="";
var perdatelang = "zh";
var HistorIds="";
var phontes;
var phonteAlbum;
var stickerimg;
var ShareSummary="";
var Sharepic="";
var price_spot="";
var price_google="";
var price_human="";
var simpleId="";
var innerMember="";
var Expressions = {Expressionscont:["Smile","Grimace","Drooling","Scowl","Chill","Sob","Shy","Silence","Cry","Embarrassed","On fire","Wink","Grin","Surprised","Sad","Cool","Frightened","Scream","Puke","Chuckle","Lovely","Sneer","Arrogant","Hungry","Drowsy","Panic","Sweating","Laugh","Soldier","Strive","Scold","Confused","Shhh","Hypnotized","Torment","Frustrated","Skull","Hammer","Wave/Bye","Relived","Pick nose","Applause","Flushed","Hellooo","Snub1","Snub2","Yawn","Booo","Distressed","Sniffle","Sly","Pucker","Scared","Pathetic","Petrified","Speechless"]};
var userlistobj = {};

function refresh(){
	location.replace('index.php?m=wap&c=Home&a=index');
}

//setCookie("token",obj.token);
var IndexAll=function (){
	document.title = yangtitle;
	j=0;	
	//category=0userconfig
	var ajaxpage="userconfig";	
	doAjax("index.php?m=wap&c=Home&a=user", {'lang':langphp}, function (userconfig){
		var obj = JSON.parse(userconfig);//从字符串"userconfig"中解析出json对象
		//print(" 用户信息：" + userconfig);
		if(obj.status=="success"){//临时应答1xx
			WebSocketurl="ws://127.0.0.1:8282";
			ReadPicture="index.php?m=Wap&c=Upload&a=upload";
			uploadurl="index.php?m=Wap&c=Upload&a=upload";
			price_spot=obj.data.price_spot;
			price_google=obj.data.price_google;
			price_human=obj.data.price_human;
			//role=obj.data.user["role"];
			icon=obj.data.user["header"];
			gender=obj.data.user["sex"];
			chatState=obj.data.user["chat_state"];
			if (icon) {
				photoIcon = getImgSize(icon,180);
				photoAddIcon = getImgSize(icon,80);
			}else{
				if (gender == 'male'){
					photoIcon = "Public/Wap/Images/alila/male.png";
					photoAddIcon = "Public/Wap/Images/alila/male.png";
				}else{
					photoIcon = "Public/Wap/Images/alila/male.png";
					photoAddIcon = "Public/Wap/Images/alila/male.png";
				}
			}
			id=obj.data.user["id"];
			setCookie('id',id);
			name=obj.data.user["username"];
			membership=obj.data.user["level"];
			gold=obj.data.user["gold"];
			simpleId=obj.data.user["id"];
			stickerimg=obj.data.sticker;

			var defaultSticker = new Array();
			defaultSticker['stickername'] = 'rabbit';
			defaultSticker['id'] = 0;
			defaultSticker['sticker_id'] = 0;
			defaultSticker['detail'] = new Array();
			for (var i = 1 ; i <= 18; i ++) {
				defaultSticker['detail'][i-1] =new Array();
				defaultSticker['detail'][i-1]['id'] = 'rabbit'+i;
				defaultSticker['detail'][i-1]['sticker_id'] = 'rabbit'+i,
				defaultSticker['detail'][i-1]['detail_img'] = 'Public/Wap/Images/dada/face'+i+'.gif';
			}
			stickerimg.unshift(defaultSticker);

			innerMember=obj.data.user['inner_member'];
			var onerroricon="javascript:this.src='Public/Wap/Images/alila/male.png'";
			if(gender == 'male'){//是1，为男性
				onerroricon="javascript:this.src='Public/Wap/Images/alila/male.png'";	
			}else{
				onerroricon="javascript:this.src='Public/Wap/Images/alila/female.png'";	
			} 
			var memberships="";
			
			if(membership==1){//是1，蓝色钻石  图标
				memberships="<img src='Public/Wap/Images/crown1.png' class='menu-img-zhuan'>";
			}else if(membership==2){//是2，金色皇冠  图标
				memberships="<img src='Public/Wap/Images/crown2.png' class='menu-img-zhuan'>";
			}else if(membership==0){//是0，普通
				//memberships="<img src='Public/Wap/Images/crown0.png' class='menu-img-zhuan'>";
			}
			document.getElementById('menu-img-Diamond1').innerHTML =memberships;
			document.getElementById('user_photo').innerHTML ="<img  src='"+photoIcon+"' onerror="+onerroricon+" class='menu-img-toxiang'>";
			document.getElementById('User_phont_Add').innerHTML ="<img  src='"+photoAddIcon+"' onerror="+onerroricon+" class='female_add'>";
			document.getElementById('user_name').innerHTML =name;
			document.getElementById('user_golds').innerHTML =gold+" "+GoldCoin;
		}
	});	
	//fn(jQuery); //
	reinitIframe(); //
	RecommendedWall(); //
	OnlineUsersList(); //点击“更多”，显示好友
	setTimeout('tuijianqiang()',2000); 
	setTimeout('freshSocket()',1000); 
	document.getElementById("header_top_title1").style.display="none";
	document.getElementById("header_top_title_gift").style.display="none";
	document.getElementById("open-nav1").style.display="none";
	document.getElementById("open-nav").style.display="block";
	document.getElementById("open-socials").style.display="block";
	document.getElementById("header_top_title").innerHTML=Onlineuserss;//标题(未获得)
	//document.getElementById("inputString").placeholder=searchTitle;//搜索关键字(未获得)
	document.getElementById("search-contant").placeholder=searchTitle;//搜索关键字(未获得)
	document.getElementById("imnews").innerHTML=Recentcontact; //“最近联系人”(未获得)
	document.getElementById("search_botton").innerHTML=cancel;	//“取消”(未获得)
	document.getElementById("submit").value=Moreandmore;	//“更多”(未获得)
	document.getElementById("submit1").value=Moreandmore;	//“更多”(未获得)
	document.getElementById("LoveEachOther_title").innerHTML=ReciprocalLiking;
	document.getElementById("ILikeThe_title").innerHTML=ILikeThes;
	document.getElementById("LikeMy_title").innerHTML=LikeMys;
	document.getElementById("menu_Upgrade").innerHTML=upgrade;
	document.getElementById("menu_Gold").innerHTML=GetGold;
	document.getElementById("menu_ExpressionShop").innerHTML=ExpressionPostShop;
	document.getElementById("menu_OnlineUsers").innerHTML=Onlineuserss;
	document.getElementById("menu_freshNews").innerHTML=freshNews;
	document.getElementById("menu_chats").innerHTML=chatlang;
	document.getElementById("menu_visiting").innerHTML=visiting;
	document.getElementById("menu_collection").innerHTML=collections;
	document.getElementById("menu_GiftBox").innerHTML=GiftBox;
	document.getElementById("menu_encounter").innerHTML=Encounter;
	document.getElementById("menu_LoveEachOther").innerHTML=ReciprocalLiking;
	document.getElementById("menu_ILikeThe").innerHTML=ILikeThes;
	document.getElementById("menu_LikeMy").innerHTML=LikeMys;
	document.getElementById("menu_Setting").innerHTML=settingUp;
	document.getElementById("search_text").innerHTML=searchTitle;

	//document.getElementById("userId1").value=token;
	var upmonths = document.getElementsByClassName('up-month');
	var upyears = document.getElementsByClassName('up-year');
	var upsave = document.getElementsByClassName('up-save');
	var reGold = document.getElementsByClassName('reGold');
	for (var i = 0 ; i < upmonths.length ; i ++) {
		upmonths[i].innerHTML = months;
	}
	for (var i = 0 ; i < upyears.length ; i ++) {
		upyears[i].innerHTML = years;
	}
	for (var i = 0 ; i < upsave.length ; i ++) {
		upsave[i].innerHTML = save;
	}
	for (var i = 0 ; i < reGold.length ; i ++) {
		reGold[i].innerHTML = GoldCoin;
	}
}
//在线好友   的排列方式
var lineandbord=function (n){
	if(n==1){
		document.getElementById("user-lest").style.display="none";
		document.getElementById("user-bord").style.display="block";
		document.getElementById("zaixian").style.display="none";
		document.getElementById("zaixianbord").style.display="block";
	}else{
		document.getElementById("user-lest").style.display="block";
		document.getElementById("user-bord").style.display="none";
		document.getElementById("zaixian").style.display="block";
		document.getElementById("zaixianbord").style.display="none";	
	}
}

//推荐墙列表
var RecommendedWall=function (){
	var ajaxpage="RecommendedWall";
	doAjax("index.php?m=Wap&c=Home&a=getWall", {}, function (RecommendedWallmsg) {
		var obj = JSON.parse(RecommendedWallmsg);//从字符串"RecommendedWallmsg"中解析出json对象
		if(obj.status == 'success'){//临时应答1xx
			var slider1_container1=document.getElementById("slider1_container1");
			
			for(var i=0; i<obj.data.length; i++){
				var UserIcon=getImgSize(obj.data[i].header,180);
				var RecommendedWalls=document.createElement("div");
				var onerroricon="javascript:this.src='Public/Wap/Images/alila/male.png'";
				if(obj.data[i].sex== 'male'){
					onerroricon="javascript:this.src='Public/Wap/Images/alila/male.png'";	
				}else{
					onerroricon="javascript:this.src='Public/Wap/Images/alila/female.png'";	
				} 
				RecommendedWalls.innerHTML="<div u='thumb'><a href='index.php?m=Wap&c=Space&a=profile&friendid="+obj.data[i].id+"' target='myiframeperfriend'><img class='userIcon' src='"+UserIcon+"' onerror="+onerroricon+"></a><div class='thumb_name'>"+cutstr(obj.data[i].username,6)+"</div></div>";
				slider1_container1.appendChild(RecommendedWalls);
			}
		}else{
			alert(321);
			// alert(LogOuts);
			// location.replace('../index.php');	
		}
	});
}
//添加推荐墙
var RecommendedWalladd=function(){
	document.getElementById("Recommended_wall_bg").style.display="block";
	document.getElementById("Recommended_wall_div").style.display="block";	
	document.getElementById("Recommended_wall_content").innerHTML=Recommendedwall_content+" "+price_spot+" "+GoldCoin;
	document.getElementById("Recommended_wall_3").innerHTML=cancel;
	document.getElementById("Recommended_wall_4").innerHTML=Determine;
}
var Recommendedcancel=function(){
	document.getElementById("Recommended_wall_bg").style.display="none";
	document.getElementById("Recommended_wall_div").style.display="none";
}
var Recommendedcancel2=function(){
	document.getElementById("Recommended_wall_bg2").style.display="none";
	document.getElementById("Recommended_wall_div2").style.display="none";
}

var RecommendedAdd=function (){
	if(gold<price_spot){
		alert(Goldfailure);
		Goldpage();
	}else{
		var ajaxpage="RecommendedAdd";
		doAjax("index.php?m=Wap&c=Home&a=addSpot", {price_spot:price_spot}, function (RecommendedAddmsg){
			var obj = JSON.parse(RecommendedAddmsg);		
			if(obj.status == 'success'){
				gold=gold-price_spot;
				gold=changeTwoDecimal(gold);
				setCookie("gold",gold);
				document.getElementById('user_golds').innerHTML =gold+""+GoldCoin;
				location.replace('index.php?m=Wap&c=Home&a=index');	
			}else{
				alert(Goldfailure);
				Goldpage();	
			}
		});
	}	
}
//在线用户列表
var OnlineUsersList=function (){//"更多..."
	if(innerMember != 1){
		if(membership==0){
			if(j>=1){
				Upgradepage();
				return false;
			}
		}else if(membership==1){
			if(j>=5){
				Upgradepage();
				return false;
			}
		}	
	}
	var size =20;
	var ajaxpage="OnlineUsersList";	
	doAjax("index.php?m=Wap&c=Home&a=recommend", {index:j++, size:size,'lang':langphp}, function (OnlineUsersListmsg) {
		var obj = JSON.parse(OnlineUsersListmsg);
		//print("在线用户列表：" + OnlineUsersListmsg);
		if(obj.status=="success"){
			//一行一行  排列的 div
			var Onlinelist=document.getElementById("Onlinelist");
			//一块一块  排列的 div
			var Onlinebord=document.getElementById("Onlinebord");
			//控制“更多”的显示与否
			userlist = obj.data;
			if(obj.data.length<20){
				document.getElementById("Onlinelist_submit").style.display="none";
				document.getElementById("Onlinelist_submit1").style.display="none";
			}else{
				document.getElementById("Onlinelist_submit").style.display="block";
				document.getElementById("Onlinelist_submit1").style.display="block";
			}

			for (var i=0; i<obj.data.length; i++) {
				for (var j=i+1; j<obj.data.length; j++) {
					if (obj.data[i].header < obj.data[j].header) {
						var temp = obj.data[i];
						obj.data[i] = obj.data[j];
						obj.data[j] = temp;
					}
				}
			}
			for (var i=0; i<obj.data.length; i++) {
				for (var j=i+1; j<obj.data.length; j++) {
					if (obj.data[i].is_online < obj.data[j].is_online) {
						var temp = obj.data[i];
						obj.data[i] = obj.data[j];
						obj.data[j] = temp;
					}
				}
			}

			for(var i=0; i<obj.data.length; i++){
				setRecommend(obj.data[i]);
				if (obj.data[i].header) {
					var UserIcon=getImgSize(obj.data[i].header,80);
				}else{
					if(gender=='female'){
						UserIcon='Public/Wap/Images/alila/male.png';	
					}else{
						UserIcon='Public/Wap/Images/alila/female.png';	
					} 
				}
				
				var onerroricon="javascript:this.src='Public/Wap/Images/alila/male.png'";
				
				var actives="";
				if(obj.data[i].is_online==1){
					actives="Public/Wap/Images/line.png";
				}else{
					actives="Public/Wap/Images/noline.png";
				}

				//会员等级
				var memberships="";
				if(obj.data[i].level==1){
					memberships="<img src='Public/Wap/Images/crown1.png' class='homepage-user-huiyuan-img'>";
				}else if(obj.data[i].level==2){
					memberships="<img src='Public/Wap/Images/crown2.png' class='homepage-user-huiyuan-img'>";
				}

				// else if(obj.data[i].level==0){
				// 	memberships="<img src='Public/Wap/Images/crown0.png' class='homepage-user-huiyuan-img'>";
				// }
				// 性别
				if(gender=='female'){
					onerroricon="javascript:this.src='Public/Wap/Images/alila/male.png'";	
				}else{
					onerroricon="javascript:this.src='Public/Wap/Images/alila/female.png'";	
				}
				//一行一行  排列的 div  里面的  每一个人
				var OnlineUsersLists=document.createElement("div");
				OnlineUsersLists.className='honepage-user-list';
				var mood = obj.data[i].mood;
				if (mood != '' && mood != null) {
					mood = cutstr(mood,20);
				}else{
					mood = '';
				}
				country = obj.data[i].country;
				if (country != '' && country == '') {
					country = cutstr(country,10);
				}else{
					country = '';
				}
				var dateObj = new Date();
            	var year = dateObj.getFullYear();
            	var age = year -  obj.data[i].year;
				OnlineUsersLists.innerHTML="<a href='index.php?m=Wap&c=Space&a=profile&friendid="+obj.data[i].id+"' target='myiframeperfriend'><div class='honepage-user'><div class='honepage-user-phont-left'><img src='"+UserIcon+"' onerror="+onerroricon+" class='homepage-content-img'><div class='honepage-user-zaixin'><img src='"+actives+"' class='homepage-line-img'></div></div><div class='honepage-user-right'><div class='honepage-user-right-top'><div class='honepage-user-huiyuan'>"+memberships+"</div><div class='honepage-user-name'>"+cutstr(obj.data[i].username,10)+","+age+"</div><div class='honepage-user-dizhi'>"+country+"</div></div><div class='honepage-user-right-bottom'>"+mood+"...</div></div></div></a>";
				Onlinelist.appendChild(OnlineUsersLists);
				//一块一块  排列的 div  里面的  每一个人
				var OnlineUsersbords=document.createElement("div");
				OnlineUsersbords.className='honepage-user-phont-left-bord';
				OnlineUsersbords.innerHTML="<a href='index.php?m=Wap&c=Space&a=profile&friendid="+obj.data[i].id+"' target='myiframeperfriend'><img src='"+UserIcon+"' onerror="+onerroricon+" class='homepage-content-img'><div class='honepage-user-name-bord'>"+cutstr(obj.data[i].username,6)+"</div><div class='honepage-user-zaixin1'><img src='"+actives+"' class='homepage-line-img'></div></a>";
				Onlinebord.appendChild(OnlineUsersbords);
			}
		}else{
						
		}
	});

}
//在线用户  “黑色 左边”
var OnlineUsers=function (){
	himeDisplay();
	j=0;
	document.getElementById("open-nav").style.display="block";
	document.getElementById("open-socials").style.display="block";
	document.getElementById("Recommended_wall").style.display="block";
	document.getElementById("search").style.display="block";
	document.getElementById("zaixian").style.display="block";
	document.getElementById("zaixianbord").style.display="none";
	document.getElementById("header_top_title").innerHTML=Onlineuserss;
	document.getElementById("Onlinelist").innerHTML="";
	document.getElementById("Onlinebord").innerHTML="";
	OnlineUsersList();

}
//个人数据获取
var PersonalData=function(){
	var ajaxpage="PersonalHomepagemsg";	
	doAjax("index.php?m=Wap&c=Space&a=ajax_profile", {id:id,lang:langphp}, function (PersonalHomepagemsg){
		var obj = JSON.parse(PersonalHomepagemsg);
		if(obj.status=="success"){
			phonteAlbum=obj.data.album;
			for (album in phonteAlbum) {
				if (album['name'] == 'default_album') {
                    album['name'] = defaults;
                }
                if (album['name'] == 'header_album') {
                    album['name'] = icons;
                }
			}
			phontes=obj.data.photo;
		}
	});
}
//个人主页
var PersonalHomepage=function (){
	close();
	himeDisplay();
	Personalbottonabount();
	document.getElementById("open-nav1").style.display="none";
	document.getElementById("open-return").style.display="none";
	document.getElementById("open-nav").style.display="block";
	document.getElementById("open-socials").style.display="block";
	document.getElementById("personal_homepage").style.display="block";
	document.getElementById("header_top_title").innerHTML=personalhomepages;
	document.getElementById("personal_album").innerHTML=Photoalbum;
	document.getElementById("personal_collection").innerHTML=Avatar;
	document.getElementById("personal_gift").innerHTML=gifts;
	document.getElementById("personal_chat").innerHTML=uploadPictures;	
	
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
	
	doAjax("index.php?m=Wap&c=Space&a=ajax_profile", {id:id,lang:langphp}, function (PersonalHomepagemsg){
		
		var obj = JSON.parse(PersonalHomepagemsg);
		if(obj.status=="success"){
			phonteAlbum=obj.data.album;
			for(album in phonteAlbum) {
				if (album['name'] == 'default_album') {
                    album['name'] = defaults;
                }
                if (album['name'] == 'header_album') {
                    album['name'] = icons;
                }
			}
			/*var Albumaobj1=new Array();
				Albumaobj1["id"]=1;
				Albumaobj1["name"]="defaults";
				Albumaobj1["time"]="";
			var Albumaobj2=new Array();
				Albumaobj2["id"]=2;
				Albumaobj2["name"]="icons";
				Albumaobj2["time"]="";
			//unshift() 方法可向数组的开头添加一个或更多元素，并返回新的长度。
			//arrayObject.unshift(newelement1,newelement2,....,newelementX).至少有一个参数newelement
			phonteAlbum.unshift(Albumaobj2);
			phonteAlbum.unshift(Albumaobj1);*/
			phontes=obj.data.photo;
			if(onclicktext==1){
				var ps=0;
				var photo=0;
				var PersonalPhotos=document.getElementById("mySwipe");
				var onerroricon="javascript:this.src='Public/Wap/Images/bigpicture.png'";
				var home_sliders = document.getElementById("home_slider");
				home_sliders.innerHTML="";
				var slides=document.createElement("ul");
				slides.id="home_phont";
				slides.className="slides";					
				
				for(var j=0; j<phontes.length; j++){
					photo=photo+phontes.length;
					//for(var i=0;i<phontes.length;i++){
					var newNodea=document.createElement("li");
					var slide=document.createElement("div");
					slide.className="slide";
					var w=document.documentElement.clientWidth;
					var slideimg=document.createElement("img");
					slideimg.src=getImgSize(phontes[j].url,0);
					slideimg.onload=function(){
						Zoom(this,w);
						};

					//slide.innerHTML="<img src='"+getImgBySize(obj.data[j].photos[i].url,0)+"' onload='Zoom(this,"+w+")' alt='' />";
					slide.insertBefore(slideimg,null);
					slides.insertBefore(newNodea,null);
					newNodea.insertBefore(slide,null);
					ps++;
				}
				if(photo==0){
					var newNodea=document.createElement("li");
					var slide=document.createElement("div");
					slide.className="slide";
					var w=document.documentElement.clientWidth;
					var onerroricon="javascript:this.src='Public/Wap/Images/bigpicture.png'";
					slide.innerHTML="<img src='Public/Wap/Images/bigpicture.png' onload='Zoom(this,"+w+")' onerror="+onerroricon+"  alt='' />";
					var a=slides.insertBefore(newNodea,null);
					newNodea.insertBefore(slide,null);
				}
					
				//newNodea.insertBefore(slides,null);
				//insertBefore() 方法在被选元素之前插入 HTML 标记或已有的元素。
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
				onclicktext=2;
			}			
			
			if (obj.data.base['header']) {
				var header = getImgSize(obj.data.base['header'],80);
			}else{
				if (obj.data.base['sex'] == 'male') {
					var header = "Public/Wap/Images/alila/male.png";
				}else{
					var header = "Public/Wap/Images/alila/female.png";
				}
			}	
			var onerroricon="javascript:this.src='Public/Wap/Images/alila/male.png'";
			if(gender=='male'){
				onerroricon="javascript:this.src='Public/Wap/Images/alila/male.png'";	
			}else{
				onerroricon="javascript:this.src='Public/Wap/Images/alila/female.png'";	
			}

			var memberships="";
			if(membership==1){
				memberships="<img src='Public/Wap/Images/crown1.png' class='Head-img-Diamond1'>";
			}else if(membership==2){
				memberships="<img src='Public/Wap/Images/crown2.png' class='Head-img-Diamond1'>";
			}
			document.getElementById('per-img-Diamon').innerHTML =memberships;
			document.getElementById('Head-portrait').innerHTML ="<img src='"+header+"' onerror="+onerroricon+" class='homepage-content-imgx'>";
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
				if (language == language_id[0]) {
					language = language_name[0];
				}else if (language == language_id[1]) {
					language = language_name[1];
				}else if (language == language_id[2]) {
					language = language_name[2];
				}else if (language == language_id[3]) {
					language = language_name[3];
				}else if (language == language_id[4]) {
					language = language_name[4];
				}else if (language == language_id[5]) {
					language = language_id[5];
				}else if (language == language_id[6]) {
					language = language_id[6];
				}else if (language == language_id[7]) {
					language = language_name[7];
				}else if (language == language_id[8]) {
					language = language_name[8];
				}else if (language == language_id[9]) {
					language = language_name[9];
				}else if (language == language_id[10]) {
					language = language_name[10];
				}else if (language == language_id[11]) {
					language = language_name[11];
				}
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
//主页的 第 四 部分：二级 导航栏，菜单切换 之 “关于”
var Personalbottonabount=function (){
	document.getElementById("per_left_abount").style.borderBottom="1px solid #017CCB";
	document.getElementById("per_right_freshNews").style.borderBottom="1px solid #E6E6E6";
	document.getElementById("per_personal_data").style.display="block";
	document.getElementById("per_freshNews").style.display="none";	
}
//主页的 第 四 部分：二级 导航栏，菜单切换 之 “新鲜事”
var PersonalbottonfreshNews=function (){
	fnews=0;
	PersonalfreshNewsList();
	document.getElementById("per_left_abount").style.borderBottom="1px solid #E6E6E6";
	document.getElementById("per_right_freshNews").style.borderBottom="1px solid #017CCB";
	document.getElementById("per_personal_data").style.display="none";
	document.getElementById("per_freshNews").style.display="block";
	document.getElementById("per_freshNews_list").innerHTML="";
}
//主页的 第 四 部分： “新鲜事”  底部的   “更多...”
var PersonalfreshNewsList=function(){
	//alert(11);
	var size =20;
	var ajaxpage="perfreshNewsmsg";	
	var perfreshNews_homepages=document.getElementById("per_freshNews");
	doAjax("index.php?m=Wap&c=Dynamic&a=getOneList", {index:fnews++,size:size,sid:id}, function (perfreshNewsmsg){	
		var obj = JSON.parse(perfreshNewsmsg);
		if(obj.status=="success"){
			var perfreshNews_Contact=document.getElementById("per_freshNews_list");
			if(obj.data.length>0){
				if(obj.data.length<20){		
					document.getElementById("per_freshNews_submit").style.display="none";
				}
				for(var i=0; i<obj.data.length; i++){					
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
					peroDivleft.id=obj.data[i].id+"-"+obj.data[i].mapId;
					peroDivleft.className="freshNews_botton_left";
					peroDivleft.onclick=function(){
									PersonalfreshNewsDelete(this.id);
									};
					peroDivleft.innerHTML ="<div class='freshNews_botton_img'><img src='Public/Wap/Images/delect.png' style='width: 30px;  margin: 3px auto;'></div>";
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
										divcenteropen(this.id,2,valuecontent.value,this.name);
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
						perfreshNewsLists.id="perfreshNews_"+obj.data[i].id;
						perfreshNewsLists.innerHTML="<div class='freshNews_user1'><div class='freshNews_content_type1'>"+freshNews_content_type+"</div><div class='freshNews_user_right1'><div class='freshNews_user_img'>"+datatime(obj.data[i].created)+"</div><img src='Public/Wap/Images/jiantou.png' style='width: 15px;float: right;  margin: 3px;'></div></div><div class='freshNews_content'><div class='freshNews_content_content'>"+freshNewscontent+"</div><div id='txt_"+obj.data[i].id+"'  class='freshNews_content_txt'></div><input id='certid"+obj.data[i].id+"' type='hidden' value='"+obj.data[i].content+"' ><div class='freshNews_content_photos'>"+freshNews_content_photos+"</div><input id='pic"+obj.data[i].id+"' type='hidden' value='"+photosid+"' ></div>";
						perfreshNewsLists.appendChild(peroDiv);
					perfreshNews_Contact.appendChild(perfreshNewsLists);
				}
			}else{
					perfreshNews_homepages.innerHTML="<div class='visit_style'></div>";
			}
		}
	});
}
//“新鲜事”里面的 “内容”
var PersonalfreshNewsDelete=function (pid){
	var ch = pid.split("-");
	var dynamicId=ch[0];
	var mapId=ch[1];
	var ajaxpage="PersonalfreshNewsDeleteMsg";	
	doAjax("index.php?c=Wap&c=Dynamic&a=remove", {dynamicId:dynamicId}, function (PersonalfreshNewsDeleteMsg){
		var obj = JSON.parse(PersonalfreshNewsDeleteMsg);
		if(obj.status=='success'){
			alert(successfuls);
			document.getElementById("perfreshNews_"+dynamicId).style.display="none";
		}else{
			alert(failure);
		}
	});
}

//相册
var PhotoAlbumPage=function(friendids){
	close();
	himeDisplay();
	document.getElementById("PhotoAlbum_homepage").innerHTML="";	
	document.getElementById("PhotoAlbum_homepage").style.display="block";
	if(friendids==null || friendids==undefined || friendids==''){
		friendids=id;
		document.getElementById("open-nav2").style.display="block";
		document.getElementById("open-PhotoAlbum").style.display="block";
		document.getElementById("header_top_title").innerHTML=Photoalbum;
	}else{
		document.getElementById("PersonalfriendHome").style.display="block";
		document.getElementById("open-nav2").style.display="none";
		document.getElementById("open-PhotoAlbum").style.display="none";		
	}
	
	for(var album=0;album<phonteAlbum.length;album++){
		//alert(phonteAlbum[album].name);
		var photoAlbumDiv=document.createElement("div");
			photoAlbumDiv.className="photoAlbumDiv";
			photoAlbumDiv.id="admin_"+phonteAlbum[album].id;
			var photourl="";
			var sum=0;
			for(var photosum=0;photosum<phontes.length;photosum++){
				if(phonteAlbum[album].id==phontes[photosum].album){
					sum++;
					if(photourl){
						photourl=photourl;
					}else{
						photourl=phontes[photosum].url;
					}	
				}
			}
			var photo_sum=sum;
			var photoAlbumName=phonteAlbum[album].name;
			if (photoAlbumName == 'default_album') {
				photoAlbumName = defaults;
			}else if(photoAlbumName == 'header_album'){
				photoAlbumName = icons;
			}
			
			var photoAlbumDiv1=document.createElement("div");
				photoAlbumDiv1.className="photoAlbumDiv_class"; 
			
			var photoAlbum1=photoAlbumDiv.insertBefore(photoAlbumDiv1,null);
			var photoAlbuma=document.createElement("a");
				photoAlbuma.href="index.php?m=Wap&c=Space&a=getphoto&Albumid="+phonteAlbum[album].id+"&friendida="+friendids;
				photoAlbuma.target="Photo_homepage";
			var photoAlbuma2=photoAlbum1.insertBefore(photoAlbuma,null);
			var photoAlbumDiv2=document.createElement("div");
				photoAlbumDiv2.className="photoAlbumDiv_img";
			
			var photoAlbum2=photoAlbuma2.insertBefore(photoAlbumDiv2,null);
			
			var photoAlbumDiv4=document.createElement("div");
				photoAlbumDiv4.className="photoAlbumDiv_font";
			var photoAlbum4=photoAlbum1.insertBefore(photoAlbumDiv4,null);
			
			var photoAlbumDiv5=document.createElement("div");
				photoAlbumDiv5.className="photoAlbumDiv_font1";
				photoAlbumDiv5.innerHTML=photoAlbumName+"("+photo_sum+")";
			var photoAlbum5=photoAlbum4.insertBefore(photoAlbumDiv5,null);
					
			if(friendids==id){
				if(phonteAlbum[album].id!=1 && phonteAlbum[album].id!=2){
					var photoAlbumimg2=document.createElement("img");
						photoAlbumimg2.className="photoAlbumDiv_img_style1";
						photoAlbumimg2.src="Public/Wap/Images/delect.png";
						photoAlbumimg2.id=phonteAlbum[album].id;
						photoAlbumimg2.onclick=function(){
									PhotoAlbumDelete(this.id);
									};
					photoAlbum4.insertBefore(photoAlbumimg2,null);
				}
				
			}
	
			if(photo_sum!==0){
				var photoAlbumDiv3=document.createElement("div");
					photoAlbumDiv3.className="photoAlbumDiv_img_bg";
				var photoAlbum3=photoAlbum2.insertBefore(photoAlbumDiv3,null);
				var photoAlbumimg1=document.createElement("img");
					photoAlbumimg1.className="photoAlbumDiv_img_style";
					photoAlbumimg1.src=getImgSize(photourl,180);

				photoAlbum3.insertBefore(photoAlbumimg1,null);
			}
			document.getElementById("PhotoAlbum_homepage").appendChild(photoAlbumDiv);
		}
}
//添加相册PhotoAlbumAdd_homepage
var PhotoAlbumAddPage=function (){
	close();
	himeDisplay();
	document.getElementById("open-nav3").style.display="block";
	document.getElementById("PhotoAlbumAdd_homepage").style.display="block";
	document.getElementById("header_top_title").innerHTML=AddAlbum;	
	document.getElementById("album").placeholder=AddAlbum;
	document.getElementById("PhotoAlbumAdd_input").value=AddAlbum;
}
var PhotoAlbumAdd=function (){
	var PhotoAlbumAddContent=document.getElementById("album").value;
	var ajaxpage="PhotoAlbumAdd";
	doAjax("index.php?m=Wap&c=Space&a=addAlbum", {name:PhotoAlbumAddContent}, function (PhotoAlbumAddmsg){
		var obj = JSON.parse(PhotoAlbumAddmsg);
		himeDisplay();
			document.getElementById("PhotoAlbum_homepage").style.display="block";
			document.getElementById("open-nav2").style.display="block";
			document.getElementById("open-PhotoAlbum").style.display="block";
			document.getElementById("header_top_title").innerHTML=Photoalbum;
		if(obj.status=='success'){
			var photoAlbumDiv=document.createElement("div");
				photoAlbumDiv.className="photoAlbumDiv";
				photoAlbumDiv.id="admin_"+obj.album.id;
			var photoAlbumName=obj.album.name;
			var photoAlbumDiv1=document.createElement("div");
				photoAlbumDiv1.className="photoAlbumDiv_class"; 
				
			var photoAlbum1=photoAlbumDiv.insertBefore(photoAlbumDiv1,null);
			var photoAlbuma=document.createElement("a");
				photoAlbuma.href="Photo.php?Albumid="+obj.album.id+"&friendida="+id;
				photoAlbuma.target="Photo_homepage";
			var photoAlbuma2=photoAlbum1.insertBefore(photoAlbuma,null);
			var photoAlbumDiv2=document.createElement("div");
				photoAlbumDiv2.className="photoAlbumDiv_img";
				
			var photoAlbum2=photoAlbuma2.insertBefore(photoAlbumDiv2,null);
			
			var photoAlbumDiv4=document.createElement("div");
				photoAlbumDiv4.className="photoAlbumDiv_font";
			var photoAlbum4=photoAlbum1.insertBefore(photoAlbumDiv4,null);
			
			var photoAlbumDiv5=document.createElement("div");
				photoAlbumDiv5.className="photoAlbumDiv_font1";
				photoAlbumDiv5.innerHTML=photoAlbumName+"(0)";
			var photoAlbum5=photoAlbum4.insertBefore(photoAlbumDiv5,null);
			var photoAlbumimg2=document.createElement("img");
				photoAlbumimg2.className="photoAlbumDiv_img_style1";
				photoAlbumimg2.src="Public/Wap/Images/delect.png";
				photoAlbumimg2.id=obj.album.id;
				photoAlbumimg2.onclick=function(){
								PhotoAlbumDelete(this.id);
								};
				photoAlbum4.insertBefore(photoAlbumimg2,null);
				document.getElementById("PhotoAlbum_homepage").appendChild(photoAlbumDiv);
		}else{
			alert(failure);
			PhotoAlbumPage();
		}
	});
}
var PhotoAlbumDelete=function (Aid){
	var PhotoAlbumId=Aid;
	
	var ajaxpage="PhotoAlbumDelete";	
	doAjax("index.php?m=Wap&c=Space&a=delAlbum", {albumId:PhotoAlbumId}, function (PhotoAlbumDeletemsg){
		//alert(PhotoAlbumDeletemsg);
		var obj = JSON.parse(PhotoAlbumDeletemsg);
		if(obj.status=='success'){
			var albumde="admin_"+PhotoAlbumId;
			document.getElementById(albumde).innerHTML="";
			document.getElementById(albumde).style.display="none";			
		}else{
			alert(failure);
		}
	});
}
//相册照片
var PhotoHome=function (){
	close();
	himeDisplay();	
	document.getElementById("Photo_homepage").style.display="block";
	document.getElementById("open-nav3").style.display="block";
	document.getElementById("open-nav2").style.display="none";
	document.getElementById("header_top_title").innerHTML=Photoalbum;
}
//他人相册照片
var friendPhotoHome=function (){
	close();
	himeDisplay();	
	document.getElementById("Photo_homepage").style.display="block";
	document.getElementById("PersonalfriendA").style.display="block";
	//document.getElementById("PersonalfriendHome").style.display="none";
	document.getElementById("header_top_title").innerHTML=Photoalbum;
}
//个人主页资料修改（暂停修改）
var personalContent=function(pcname){
	personal_content_id=pcname;
	himeDisplay();	
	var per_content_A=document.getElementById("personal_content_add");
		per_content_A.style.display="block";
	document.getElementById("open-nav2").style.display="block";
		
	//alert(personal_content_id);	
	if(pcname=="about"){
		document.getElementById("header_top_title").innerHTML=AboutMyself;
		document.getElementById("personal_ok").style.display="block";	
		document.getElementById("personal_ok").innerHTML=Determine;
		var abouts_text=document.getElementById("per_about").innerHTML;
		per_content_A.innerHTML="<textarea name='textarea' id='textarea_about' class='textarea_style'  rows='8'  data-snap-ignore='true'>"+abouts_text+"</textarea>";
	}else if(pcname=="birthday"){
		per_content_A.style.display="none";
		document.getElementById("personal_content_homepage").style.display="block";
		document.getElementById("personal_ok").style.display="block";	
		document.getElementById("personal_ok").innerHTML=Determine;
		document.getElementById("header_top_title").innerHTML=Birthday;
		
	}else if(pcname=="language"){
		document.getElementById("header_top_title").innerHTML=languages;
		per_content_A.innerHTML="";
		for(var i=0;i<language_name.length; i++){
			var languageLists=document.createElement("div");
				languageLists.id=language_id[i];
				languageLists.onclick=function(){
									personalContentAdd(this.id);
									};
			
				languageLists.className='language_name_list';
				languageLists.innerHTML=language_name[i];
			per_content_A.appendChild(languageLists);
		}
	}else if(pcname=="weight"){
		document.getElementById("header_top_title").innerHTML=weights;
		per_content_A.innerHTML="";
		for(var i=0;i<weight.length; i++){
			var weightLists=document.createElement("div");
				weightLists.id=i;
				weightLists.onclick=function(){
									personalContentAdd(this.id);
									};
			
				weightLists.className='language_name_list';
				weightLists.innerHTML=weight[i];
			per_content_A.appendChild(weightLists);
		}
	}else if(pcname=="height"){
		document.getElementById("header_top_title").innerHTML=heights;
		per_content_A.innerHTML="";
		for(var i=0;i<height.length; i++){
			var heightLists=document.createElement("div");
				heightLists.id=i;
				heightLists.onclick=function(){
									personalContentAdd(this.id);
									};
			
				heightLists.className='language_name_list';
				heightLists.innerHTML=height[i];
			per_content_A.appendChild(heightLists);
		}
	}else if(pcname=="sexuality"){
		document.getElementById("header_top_title").innerHTML=SexualOrientation;
		per_content_A.innerHTML="";
		for(var i=0;i<sexuality.length; i++){
			var sexualityLists=document.createElement("div");
				sexualityLists.id=i;
				sexualityLists.onclick=function(){
									personalContentAdd(this.id);
									};
			
				sexualityLists.className='language_name_list';
				sexualityLists.innerHTML=sexuality[i];
			per_content_A.appendChild(sexualityLists);
		}
	}else if(pcname=="relationship"){
		document.getElementById("header_top_title").innerHTML=EmotionalState;
		per_content_A.innerHTML="";
		for(var i=0;i<relationship.length; i++){
			var relationshipLists=document.createElement("div");
				relationshipLists.id=i;
				relationshipLists.onclick=function(){
									personalContentAdd(this.id);
									};
			
				relationshipLists.className='language_name_list';
				relationshipLists.innerHTML=relationship[i];
			per_content_A.appendChild(relationshipLists);
		}
	}else if(pcname=="country"){
		document.getElementById("header_top_title").innerHTML=countries;
		document.getElementById("personal_ok").style.display="block";	
		document.getElementById("personal_ok").innerHTML=Determine;
		var country_text=document.getElementById("per_country").innerHTML;
		per_content_A.innerHTML="<textarea name='textarea_country' id='textarea_country' class='textarea_style'  rows='8'  data-snap-ignore='true'>"+country_text+"</textarea>";
	}else if(pcname=="city"){
		document.getElementById("header_top_title").innerHTML=citys;
		document.getElementById("personal_ok").style.display="block";	
		document.getElementById("personal_ok").innerHTML=Determine;
		var city_text=document.getElementById("per_city").innerHTML;
		per_content_A.innerHTML="<textarea name='textarea_city' id='textarea_city' class='textarea_style'  rows='8'  data-snap-ignore='true'>"+city_text+"</textarea>";
	}else if(pcname=="education"){
		document.getElementById("header_top_title").innerHTML=Education;
		per_content_A.innerHTML="";
		for(var i=0;i<education.length; i++){
			var educationLists=document.createElement("div");
				educationLists.id=i;
				educationLists.onclick=function(){
									personalContentAdd(this.id);
									};
			
				educationLists.className='language_name_list';
				educationLists.innerHTML=education[i];
			per_content_A.appendChild(educationLists);
		}
	}else if(pcname=="work"){
		document.getElementById("header_top_title").innerHTML=works;
		document.getElementById("personal_ok").style.display="block";	
		document.getElementById("personal_ok").innerHTML=Determine;
		var work_text=document.getElementById("per_work").innerHTML;
		per_content_A.innerHTML="<textarea name='textarea_work' id='textarea_work' class='textarea_style'  rows='8'  data-snap-ignore='true'>"+work_text+"</textarea>";
	}else if(pcname=="income"){
		document.getElementById("header_top_title").innerHTML=incomes;
		per_content_A.innerHTML="";
		for(var i=0;i<income.length; i++){
			var incomeLists=document.createElement("div");
				incomeLists.id=i;
				incomeLists.onclick=function(){
									personalContentAdd(this.id);
									};
			
				incomeLists.className='language_name_list';
				incomeLists.innerHTML=income[i];
			per_content_A.appendChild(incomeLists);
		}
	}
}
var personalContentAdd=function(type_id){
	if(personal_content_id=="about"){
		var content=document.getElementById("textarea_about").value;
		var types=3;
		personal_content_id = 'mood';
	}else if(personal_content_id=="birthday"){
		var content=personal_homepage.window.document.getElementById("test_default").value;
		var types=0;
	}else if(personal_content_id=="language"){
		var content=type_id;
		var types=10;
	}else if(personal_content_id=="weight"){
		var content=type_id;
		var types=5;
	}else if(personal_content_id=="height"){
		var content=type_id;
		var types=6;
	}else if(personal_content_id=="sexuality"){
		var content=type_id;
		var types=1;
	}else if(personal_content_id=="relationship"){
		var content=type_id;
		var types=2;
	}else if(personal_content_id=="country"){
		var content=document.getElementById("textarea_country").value;
		//alert(document.getElementById("textarea_country"));
		//alert(content);
		var types=4;
	}else if(personal_content_id=="city"){
		var content=document.getElementById("textarea_city").value;
		var types=11;
	}else if(personal_content_id=="education"){
		var content=type_id;
		var types=9;
	}else if(personal_content_id=="work"){
		var content=document.getElementById("textarea_work").value;
		//alert(document.getElementById("textarea_work"));
		//alert(content);
		var types=7;
		personal_content_id = 'worker';
	}else if(personal_content_id=="income"){
		var content=type_id;
		var types=8;
	}

	var ajaxpage="Txtcontentmsg";
	doAjax("index.php?m=Wap&c=Space&a=editInfo", {type:types,content:content,field:personal_content_id}, function (TxtAboutmsg){
	var obj = JSON.parse(TxtAboutmsg);
	if(obj.status=='success'){									
		PersonalHomepage();								
	}else{
		alert(failure);
	}
	});
}
//他人页面
var PersonalfriendHome=function (){
	close();
	himeDisplay();	
	document.getElementById("myiframeperfriend").style.display="block";
	document.getElementById("open-nav1").style.display="none";
	document.getElementById("open-return").style.display="none";
	document.getElementById("open-nav").style.display="block";
	document.getElementById("open-socials").style.display="block";
	document.getElementById("header_top_title").style.display="block";	
}

var PersonalfriendA=function(){
	PhotoAlbumPage(perfriendid);
}
//图片添加
var personalPhotoAddPage=function(){
	close();
	himeDisplay();	
	document.getElementById("Photo_Add_homepage").style.display="block";
	document.getElementById("PhotoHomes").style.display="block";
	document.getElementById("open-nav2").style.display="none";
	document.getElementById("header_top_title").innerHTML=uploadPictures;
}

//修改头像页面
var HeadPortraitPage=function(){
	close();
	himeDisplay();
	document.getElementById("open-nav").style.display="none";
	document.getElementById("header_top_title").style.display="block";
	document.getElementById("open-nav2").style.display="block";
	document.getElementById("HeadPortrait").style.display="block";
	document.getElementById("header_top_title").innerHTML=HeadPortrait;
}

//搜索
var searchpage=function(){
	close();
	himeDisplay();
	document.getElementById("content").style.webkitTransform="";
	document.getElementById("searchpage").style.display="block";
	document.getElementById("open-search-back").style.display="block";
	document.getElementById("search-ok").style.display="block";
	document.getElementById("search-ok").innerHTML=searchok;
	document.getElementById("header_top_title").innerHTML=searchTitle;
}

var searchoks=function(){
	document.getElementById('searchpage').contentWindow.searchsend();
	//contentWindow 兼容各个浏览器，可取得子窗口的 window 对象
}
//升级
var Upgradepage=function (){
	close();
	himeDisplay();
	document.getElementById("open-nav1").style.display="block";
	document.getElementById("Upgrade_homepage").style.display="block";
	document.getElementById("header_top_title").innerHTML=upgrade;
	document.getElementById("upgrade-title").innerHTML=MEMBERS;
	document.getElementById("upgrade-content-1").innerHTML=Interested;
	document.getElementById("upgrade-content-2").innerHTML=SendReceive;
	document.getElementById("upgrade-content-3").innerHTML=opposites;
	document.getElementById("upgrade-Blue-diamond").innerHTML=UpgradeDiamond;
	document.getElementById("upgrade-crown").innerHTML=Upgradedcrown;
	document.getElementById("customId").value=id;
	//document.getElementById("userId").value=token;
	document.getElementById("customId1").value=id;
}
//支付  之  支付宝
function alipaybotton(){
	document.getElementById('alipay1').style.display="block";
	document.getElementById('formtest1').style.display="block";
	document.getElementById('Paypal1').style.display="none";
	document.getElementById('formtest').style.display="none";
}
//支付  之 其他支付
function Paypalbotton(){
	document.getElementById('formtest1').style.display="none";
	document.getElementById('Paypal1').style.display="block";
	document.getElementById('formtest').style.display="block";
}
function upgradeopen(ug,ty,m,month){
	document.getElementById("income0").value=ug;
	document.getElementById("income1").value=ug;
	document.getElementById("type").value=ty;
	document.getElementById("type1").value=ty;
	document.getElementById("goldbg").style.display="block";
	document.getElementById("upgrade_button").style.display="block";
	if(ty=='u'){
		document.getElementById("membership0").value=m;
		document.getElementById("membership1").value=m;
		document.getElementById("month0").value=month;
		document.getElementById("month1").value=month;
	}
}
function upgradeclose(){
	document.getElementById("goldbg").style.display="none";
	document.getElementById("upgrade_button").style.display="none";
	document.getElementById("Paypal1").style.display="none";
	document.getElementById("formtest").style.display="none";
	document.getElementById("formtest1").style.display="none";
}
//获取金币
var Goldpage=function (){
	close();
	himeDisplay();
	document.getElementById("open-nav1").style.display="block";
	document.getElementById("gold_homepage").style.display="block";
	document.getElementById("header_top_title").style.display="block";
	document.getElementById("header_top_title").innerHTML=GetGold;
	document.getElementById("gold_balance_content").innerHTML=BalanceOfGoldCOINS+"："+gold+""+GoldCoin;
	document.getElementById("gold_title_page").innerHTML=Choosetopup;
	document.getElementById("customId").value=id;
	document.getElementById("customId1").value=id;
}
function createOrder0() {
	var type = document.getElementById("type").value;
	var income = document.getElementById("income0").value;
	var customId = document.getElementById("customId").value;
	args = {type:type, income:income,'customId':customId};
	if (type == 'u') {
		var level = document.getElementById("membership0").value;
		var way = document.getElementById("payment").value;
		var month =  document.getElementById("month0").value;
		args['level'] = level;
		args['way'] = way;
		args['customId'] = customId;
		args['month'] = month;
	}
	doAjax("index.php?m=Wap&c=pay&a=order", args, function (ExpressionShopmsg){
		var msg = JSON.parse(ExpressionShopmsg);
		if(msg.status=="success"){
			document.getElementById('item_name').value = msg.data.goods_type;
            document.getElementById('item_number').value = msg.data.order_sn;
            document.getElementById('amount').value = msg.data.amount;
            var paypalform = document.getElementById('paypal');
            paypalform.submit();
		}else{
			alert('error');
		}
	});
}
//表情贴商店（黑色 左边的菜单）
var ExpressionShop=function (){
	close();
	himeDisplay();
	var ajaxpage="ExpressionShop";
	var size =100;
	document.getElementById("open-nav1").style.display="block";
	document.getElementById("Expression_post_shop_homepage").style.display="block";
	document.getElementById("header_top_title").innerHTML=shoppingmall;
	//document.getElementById("ExpressionDetailimg").innerHTML="";
	//document.getElementById("ExpressionDetaillest").innerHTML="";
	doAjax("index.php?m=Wap&c=Sticker&a=getList", {index:Shop++, size:size,langphp:langphp }, function (ExpressionShopmsg){
		LookFor=ExpressionShopmsg;
		var obj = JSON.parse(ExpressionShopmsg);
		if(obj.status=="success"){
			var Expression_list=document.getElementById("Expression_list");
			for(var i=0; i<obj.data.length; i++){
				var anniu="";
				if(obj.data[i].permission==1){
					var buydiv=document.createElement("div");
						buydiv.className="Have_downloaded";
						buydiv.innerHTML=HaveDownloaded;
				}else{
					var buydiv=document.createElement("div");
						buydiv.id="buy1"+obj.data[i].id;
					gold = parseInt(gold);
					if(gold>=obj.data[i].price || innerMember == 1){
						buydiv.onclick=function(){
										Expressionbuy(this.id);
										};
					}else{
						buydiv.onclick=function(){
										alert(GoldNO);
										Goldpage();
										};
					}
					buydiv.className="buy";
					buydiv.innerHTML=buy;				
				}
				var Expressiondiv=document.createElement("div");
					Expressiondiv.className='Expressions-style';
				var Expressions=document.createElement("div");
					Expressions.id=obj.data[i].id;
					Expressions.className='Expressions-list';
					Expressions.onclick=function(){
										ExpressionDetail(this.id);
										};
					Expressions.innerHTML="<div class='Expressions-list-img'><img src='"+obj.data[i].img+"' width='55'></div><div class='Expressions-list-content'><div class='Expressions-list-content-name'>"+obj.data[i].des+"</div><div class='Expressions-list-content-gold'>"+obj.data[i].price+"Gold</div></div>";
					Expressiondiv.appendChild(Expressions);
					Expressiondiv.appendChild(buydiv);
					
					Expression_list.appendChild(Expressiondiv);
			}
		}
	});
}
var Expressionclose=function(){
	close();
	himeDisplay();
	document.getElementById("open-nav1").style.display="block";
	document.getElementById("Expression_post_shop_homepage").style.display="block";
	document.getElementById("header_top_title").innerHTML=shoppingmall;
	document.getElementById("ExpressionDetailimg").innerHTML="";
	document.getElementById("ExpressionDetaillest").innerHTML="";
}
//表情贴详细 Expressions_posted_in_detail_homepage
var ExpressionDetail=function (Eid){
	//var ExpressionDetailid=Eid;
	//alert(ExpressionDetailid);
	himeDisplay();
	var ExpressionDetailcontent=document.getElementById("Expressions_posted_in_detail_homepage");
		ExpressionDetailcontent.style.display="block";
	document.getElementById("open-return").style.display="block";
	document.getElementById("open-nav").style.display="none";
	document.getElementById("open-socials").style.display="none";
	document.getElementById("open-return").onclick=function(){
											Expressionclose();
											};
	document.getElementById("header_top_title").innerHTML=shoppingmall;
	var obj = JSON.parse(LookFor);
	var ExpressionDetailimg=document.getElementById("ExpressionDetailimg");
	//alert(obj.data.length);
	doAjax("index.php?m=Wap&c=Sticker&a=getDetail", {id:Eid,langphp:langphp }, function (obj){
		var anniu="";
		var obj = JSON.parse(obj);
		if (obj.status == 'success') {
			if(obj.data.permission==1){
				var buydivx=document.createElement("div");
				buydivx.className="Have_downloadedDetail";
				buydivx.innerHTML=HaveDownloaded;
			}else{
				var buydivx=document.createElement("div");
				buydivx.id="buy2"+obj.data.id;
				buydivx.className="buyDetail";
				buydivx.innerHTML=buy;
				gold = parseInt(gold);
				if(gold>=obj.data.price || innerMember == 1){
					buydivx.onclick=function(){
									Expressionbuy(this.id,2);
									};
				}else{
					buydivx.onclick=function(){
									alert(GoldNO);
									Goldpage();
									};
				}
				
			}
			var Expressiondiv=document.createElement("div");
			Expressiondiv.innerHTML = '';
				Expressiondiv.className="ExpressionDetailcontent";
				Expressiondiv.innerHTML="<div class='ExpressionDetailimg'><img src='"+obj.data.img+"' style='width:100%'></div><div class='ExpressionDetailfont'><div class='ExpressionDetailfontname'>"+obj.data.des+"</div><div class='ExpressionDetailfontgold'>"+obj.data.price+"</div></div>";
				Expressiondiv.appendChild(buydivx);
				ExpressionDetailimg.appendChild(Expressiondiv);
			var ExpressionDetaillest=document.getElementById("ExpressionDetaillest");
			ExpressionDetaillest.innerHTML = '';
			for(var x=0; x<count(obj.data.detail); x++){
				var ExpressionDetailimgs=document.createElement("div");
				ExpressionDetailimgs.className='ExpressionDetaillest_img';
				ExpressionDetailimgs.innerHTML="<img src='"+obj.data.detail[x].detail_img+"' width='100%'>";
				ExpressionDetaillest.appendChild(ExpressionDetailimgs);
			}
		}		
	});
}

//表情贴购买（）
var Expressionbuy=function(buyid,w){
	id = buyid.substr(4);	
	doAjax("index.php?m=Wap&c=Sticker&a=order", {stickerId:id}, function (Expressionbuymsg){
		var obj = JSON.parse(Expressionbuymsg);
		if(obj.status=="success"){
			alert(successfuls);
			var buyid1="buy1"+id;
			var buyiddiv1=document.getElementById(buyid1);
				buyiddiv1.style.cssText="background: #F7F7F7;border: 1px #E8E8E8 solid;  color: #5F5F5F;";
				buyiddiv1.innerHTML=HaveDownloaded;
			
			if(w==2){
				var buyid2="buy2"+id;
				var buyiddiv2=document.getElementById(buyid2);
					buyiddiv2.style.cssText="background: #F7F7F7;border: 1px #D2D1D1 solid;  color: #5F5F5F;";
					buyiddiv2.innerHTML=HaveDownloaded;
			}
			
			gold=obj.balance;
			
			gold=changeTwoDecimal(gold);
			setCookie("gold",gold);
			document.getElementById('user_golds').innerHTML =gold+""+GoldCoin;
		}else{
			alert(failure);
		}
	});
}
//新鲜事 freshNews_homepage
var freshNewsPage=function(){
	d=0;
	close();
	himeDisplay();
	document.getElementById("open-nav").style.display="block";
	document.getElementById("open-freshNewsadd").style.display="block";
	document.getElementById("freshNews_homepage").style.display="block";
	document.getElementById("header_top_title").innerHTML=freshNews;
	document.getElementById("freshNews_list").innerHTML="";
	freshNewsList();
}
//新鲜事列表（）
var freshNewsList=function(){
	if(innerMember != 1){
		if(membership==0){
			if(d>0){
				Upgradepage();
				return false;
			}
		}else if(membership==1){
			if(d>=5){
				Upgradepage();
				return false;
			}
		}	
	}
	var size =20;
	var freshNews_homepages=document.getElementById("freshNews_list");
	doAjax("index.php?m=Wap&c=Dynamic&a=getList", {index:d++, size:size,lang:langphp}, function (freshNewsPagemsg){		
		var obj = JSON.parse(freshNewsPagemsg);
		//alert(freshNewsPagemsg);
		if(obj.status=="success"){
			var freshNews_Contact=document.getElementById("freshNews_list");
			if(obj.list.length>0){
				if(obj.list.length<20){		
					document.getElementById("freshNews_submit").style.display="none";
				}
				for(var i=0; i<obj.list.length; i++){
					if (obj.list[i].header) {
						var UserIcon=getImgSize(obj.list[i].header,80);
					}else{
						if (obj.list[i].sex == 'male') {
							var UserIcon='Public/Wap/Images/alila/male.png';
						}else{
							var UserIcon='Public/Wap/Images/alila/female.png';
						}
					}
					var onerroricon="javascript:this.src='Public/Wap/Images/alila/male.png'";					
					var actives="";
					if(obj.list[i].is_online==1){
						actives="Public/Wap/Images/line.png";
					}else{
						actives="Public/Wap/Images/noline.png";
					}
					
					if(obj.list[i].sex=='male'){
						onerroricon="javascript:this.src='Public/Wap/Images/alila/male.png'";	
					}else{
						onerroricon="javascript:this.src='Public/Wap/Images/alila/female.png'";	
					}
					var freshNewscontent="";
					if(obj.list[i].content!==null || obj.list[i].content==""){
						freshNewscontent=JsExpressionContent(obj.list[i].content);
					}
					var freshNews_content_photos="";
					if(obj.list[i].urls==null || obj.list[i].urls==undefined || obj.list[i].urls==''){
						freshNews_content_photos="";
						var photosid="";
					}else{
						var photosid=obj.list[i].urls;
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
					if(obj.list[i].type==2){
						freshNews_content_type=UploadThePicture;
					}else if(obj.list[i].type==3){
						freshNews_content_type=UploadPhotos;
					}
					var oDiv=document.createElement("div");
						oDiv.id=obj.list[i].id;
						oDiv.className="freshNews_botton";
					var oDivleft=document.createElement("div");
						oDivleft.id=obj.list[i].user_id+"-"+obj.list[i].username;
						oDivleft.className="freshNews_botton_left";
						oDivleft.onclick=function(){
											Personalfreshchat(this.id);
											};
						oDivleft.innerHTML ="<div class='freshNews_botton_img'><img src='Public/Wap/Images/encounterim.png' style='width: 30px;  margin: 3px auto;'></div>";
					oDiv.appendChild(oDivleft);
					var oDivright=document.createElement("div");
						oDivright.id="freshNews_right_"+obj.list[i].id;
						oDivright.className="freshNews_botton_right";
						oDivright.onclick=function(){				
											freshNewsShareOpen(this.id);
											};
						oDivright.innerHTML ="<div class='freshNews_botton_img'><img src='Public/Wap/Images/share.png' style='width: 30px;  margin: 3px auto;'></div>";
					oDiv.appendChild(oDivright);
					var oDivcontent=document.createElement("div");
						oDivcontent.id=obj.list[i].id;
						oDivcontent.name=obj.list[i].user_id;
						oDivcontent.className="freshNews_botton_content";
					if(freshNewscontent){
						oDivcontent.onclick=function(){
										var inpid="certid"+this.id;
										var valuecontent=document.getElementById(inpid);
										divcenteropen(this.id,2,valuecontent.value,this.name);
									};
					}else{
						oDivcontent.onclick=function(){
										alert(tranno);
										};
					}
					var dateObj = new Date();
            		var year = dateObj.getFullYear();
            		var age = year -  obj.list[i].year;
					oDivcontent.innerHTML ="<div class='freshNews_botton_img'><img src='Public/Wap/Images/translation.png' style='width: 30px;  margin: 3px auto;'></div>";
					oDiv.appendChild(oDivcontent);
					var freshNewsLists=document.createElement("div");
						freshNewsLists.className='honepage-freshNews-list';
						freshNewsLists.innerHTML="<a href='index.php?m=Wap&c=Space&a=profile&friendid="+obj.list[i].user_id+"' target='myiframeperfriend' class='freshNews_user'><div class='freshNews_user_left'><img src='"+UserIcon+"' onerror="+onerroricon+" class='homepage-freshNews-img'></div><div class='freshNews_user_conter'><div class='visiting_style'>"+obj.list[i].username+","+age+"</div><div class='visiting_style visiting_style_country'>"+obj.list[i].country+"</div></div><div class='freshNews_user_right'><div class='freshNews_user_img'>"+datatime(obj.list[i].created)+"</div><img src='Public/Wap/Images/jiantou.png' style='width: 15px;float: right;  margin: 3px;'></div></a><div class='freshNews_content'><div class='freshNews_content_content'>"+freshNewscontent+"</div><div id='txt_"+obj.list[i].id+"'  class='freshNews_content_txt'></div><input id='certid"+obj.list[i].id+"' type='hidden' value='"+obj.list[i].content+"' ><div class='freshNews_content_photos'>"+freshNews_content_photos+"</div><input id='pic"+obj.list[i].id+"' type='hidden' value='"+photosid+"' ><div class='freshNews_content_type'>"+freshNews_content_type+"</div></div>";
						freshNewsLists.appendChild(oDiv);
						freshNews_Contact.appendChild(freshNewsLists);
				}
			}else{
				freshNews_homepages.innerHTML="<div class='visit_style'>"+visitors+"</div>";
			}
		}
	});
}
//新鲜事分享
var freshNewsShareOpen=function(shareid){
	shareid=shareid.substr(16);
	var ShareSummaryid="certid"+shareid;
	var Sharepicid="pic"+shareid;
	
	ShareSummary=document.getElementById(ShareSummaryid).value;
	Sharepic=document.getElementById(Sharepicid).value;
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
	url:yangurl+"?sid="+simpleId,
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
	url:yangurl+"?sid="+simpleId, /*获取URL，可加上来自分享到QQ标识，方便统计*/
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
	url:yangurl+"?sid="+simpleId, /*获取URL，可加上来自分享到QQ标识，方便统计*/
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
	u:yangurl+"?sid="+simpleId, /*获取URL，可加上来自分享到QQ标识，方便统计*/
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
		url: yangurl+"?sid="+simpleId,
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
	url = 'http://twitter.com/home?status='+encodeURIComponent(yangurl)+' '+encodeURIComponent(document.title);
	twitter.innerHTML = "<div><a class='fav_twitter' rel='nofollow' href="+url+"><img src='Public/Wap/Images/twitter.png' class='class-img'></a></div>";
}
//分享到Fb
var fbShares = function() {
	var fbShares = document.getElementById("fbShares");
	var url = 'http://www.facebook.com/sharer/sharer.php?u='+encodeURIComponent(yangurl)+'&amp;t='+encodeURIComponent(Sharetitle);
	fbShares.innerHTML = "<div><a class='fav_facebook' rel='nofollow' href="+url+"><img src='Public/Wap/Images/fb.png' class='class-img'></a></div>";
}
//新鲜事添加（）
var freshNewsAdd=function(){
	himeDisplay();
	document.getElementById("freshNewsAdd_homepage").style.display="block";
	document.getElementById("open-nav4").style.display="block";
	document.getElementById("freshNewsAdd").style.display="block";
	document.getElementById("open-nav4").innerHTML=cancel;
	document.getElementById("freshNewsAdd").innerHTML=Determine;
	document.getElementById("header_top_title").innerHTML=freshNews;
	document.getElementById("txt_freshNewsAdd_textarea").placeholder=plans;
}
var freshNewsendimg="";
var freshNewsFile=function(){
	        try {
			var action=uploadurl;
			var file = document.getElementById("filefreshNewsimg").files[0];
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

			                    var base64 = canvas.toDataURL("Public/Wap/Images/jpeg", 0.7);
			                    var suffix = type.replace("Public/Wap/Images/", "");
				                    base64 = base64.length > size ? img.src : base64;
				                    base64 = base64.replace(/.*base64,/, "");					
                    			uploadAjax(action, {data: base64, name: name}, function (msg) {
								if(msg['status']=='success'){
									freshNewsendimg=msg['url'];
								document.getElementById("freshNews_img").innerHTML="<img src='"+msg['url']+"' class='chat-freshNew-img'>";
						}  
                    }, true);
                }
            };
        } catch (e) {
            alert(e)
        }
}
var freshNewsExpressions=function(){
	document.getElementById("freshNewsAdd_Expressions").style.display="block";
}
var freshNewsExpressionsAdd=function(Expression){
	var Expressiontxt="["+Expression+"]";
	//alert(Expressiontxt);
	var freshNewsAddtext=document.getElementById('txt_freshNewsAdd_textarea').value;
	document.getElementById('txt_freshNewsAdd_textarea').value=freshNewsAddtext+""+Expressiontxt;
}
//新鲜事发布（） freshNewsRelease()
var freshNewsRelease=function(){
	//var photo="";
	var ajaxpage="freshNewsAddmsg";
	var freshNewsReleasetxt=document.getElementById('txt_freshNewsAdd_textarea').value;
	doAjax("index.php?m=Wap&c=Dynamic&a=add", {content: freshNewsReleasetxt,url:freshNewsendimg}, function (freshNewsAddmsg){   
	var obj1 = JSON.parse(freshNewsAddmsg);
		if(obj1.status=='success'){
			alert(successfuls);										
			freshNewsPage();										
		}else{
			alert(failure);
		}
	});		
}

//来访 visiting_homepage
var visitingPage=function (){
	v=0;
	Giftpage="visiting";
	close();
	himeDisplay();
	document.getElementById("cloce-visiting-gift").style.display="none";
	document.getElementById("open-nav1").style.display="block";
	document.getElementById("visiting_homepage").style.display="block";
	document.getElementById("header_top_title").style.display="block";
	document.getElementById("header_top_title").innerHTML=visiting;
	document.getElementById("visiting_list").innerHTML="";
	document.getElementById("interaction_visit").innerHTML="";
	InteractVisitor=0;
	visitingList();
}
//()
var visitingList=function (){
	var size =20;
	var visiting_homepages=document.getElementById("visiting_list");
	doAjax("index.php?m=Wap&c=Visitor&a=getVisitors", {index:v++, size:size}, function (visitingPagemsg){	
		var obj = JSON.parse(visitingPagemsg);
		print(" 来访信息：" + visitingPagemsg);
		if(obj.status=="success"){
			if(obj.data.length>0){
				if(obj.data.length<20){		
					document.getElementById("visiting_submit").style.display="none";
				}
				for(var i=0; i<obj.data.length; i++){
					if (obj.data[i].header) {
						var UserIcon=getImgSize(obj.data[i].header,80);
					}else{
						if (obj.data[i].sex == 'male') {
							var UserIcon="Public/Wap/Images/alila/male.png";
						}else{
							var UserIcon="Public/Wap/Images/alila/female.png";
						}
					}
					
					var onerroricon="javascript:this.src='Public/Wap/Images/alila/male.png'";
					
					var actives="";
					if(obj.data[i].is_online==1){
						actives="Public/Wap/Images/line.png";
					}else{
						actives="Public/Wap/Images/noline.png";
					}
					if(gender=='male'){
						onerroricon="javascript:this.src='Public/Wap/Images/alila/male.png'";	
					}else{
						onerroricon="javascript:this.src='Public/Wap/Images/alila/female.png'";	
					}
					var dateObj = new Date();
            		var year = dateObj.getFullYear();
            		var age = year -  obj.data[i].year;

            		var mood = obj.data[i].mood;
					if (mood != '' && mood != null) {
						mood = cutstr(mood,20);
					}else{
						mood = '';
					}

					var visitingLists=document.createElement("div");
						visitingLists.className='honepage-visiting-list';
						visitingLists.id="visitingList_"+obj.data[i].id;
					var visiting_lests=document.createElement("div");
						visiting_lests.className='visiting_lests';
						visitingLists.appendChild(visiting_lests);					
					
					var visiting_user=document.createElement("div");
						visiting_user.className='honepage-user';
						visiting_lests.appendChild(visiting_user);
					
					var visiting_a=document.createElement("a");
						visiting_a.href="index.php?m=Wap&c=Space&a=profile&friendid="+obj.data[i].user_id;
						visiting_a.target='myiframeperfriend';
						visiting_user.appendChild(visiting_a);
					
					var visiting_user_phont_left=document.createElement("div");
						visiting_user_phont_left.className='honepage-user-phont-left';
						visiting_user_phont_left.innerHTML="<img src='"+UserIcon+"' onerror="+onerroricon+" class='homepage-content-img'><div class='honepage-user-zaixin'><img src='"+actives+"' class='homepage-line-img'></div>";
						visiting_a.appendChild(visiting_user_phont_left);
					
					var visiting_content=document.createElement("div");
						visiting_content.className='visiting_content';
						visiting_content.innerHTML="<div class='visiting_style'>"+cutstr(obj.data[i].username,10)+","+age+"</div><div class='visiting_style visiting_style_about'>"+mood+"</div><div class='visiting_style visiting_style_time'>"+datatime(obj.data[i].created)+"</div>";
						visiting_a.appendChild(visiting_content);
					
					var visiting_style_right=document.createElement("div");
						visiting_style_right.className='visiting_style_right';
						visiting_user.appendChild(visiting_style_right);
					var visiting_style_right1=document.createElement("div");
						visiting_style_right1.className='visiting-img1';
						visiting_style_right1.id='visitingItem_'+obj.data[i].user_id+'-'+obj.data[i].username;
						visiting_style_right1.innerHTML="<img src='Public/Wap/Images/encounterim.png' class='visiting-img'>";
						visiting_style_right.appendChild(visiting_style_right1);
						visiting_style_right1.onclick = function () {
							if (membership == 0 && innerMember != 1) {
								alert(UpgradePrompt);
								Upgradepage();					
							}else{
								var idStr = this.id;
								var chatObj = idStr.split('_')[1];
								Personalfreshchat(chatObj);
															
							}
						}
					var visiting_style_right2=document.createElement("div");
						visiting_style_right2.id="Open1_"+obj.data[i].id;
						visiting_style_right2.className='visiting-img1';
						visiting_style_right2.style.display="block";
						visiting_style_right2.innerHTML="<cite><img src='Public/Wap/Images/more.png' class='visiting-img'></cite>";
						visiting_style_right2.onclick=function(){
										TheDropDownMenuOpen(1,this.id);
										};
						visiting_style_right.appendChild(visiting_style_right2);
					var visiting_style_right3=document.createElement("div");
						visiting_style_right3.id="Close1_"+obj.data[i].id;
						visiting_style_right3.className='visiting-img1';
						visiting_style_right3.style.display="none";
						visiting_style_right3.innerHTML="<cite><img src='Public/Wap/Images/more.png' class='visiting-img'></cite>";
						visiting_style_right3.onclick=function(){
										TheDropDownMenuClose(1,this.id);
										};
					visiting_style_right.appendChild(visiting_style_right3);
					var TheDropDownMenu=document.createElement("div");
						TheDropDownMenu.id="Menu1_"+obj.data[i].id;				
						TheDropDownMenu.className="TheDropDownMenu_style";
						TheDropDownMenu.style.display="none";
					visiting_user.appendChild(TheDropDownMenu);
					var Menu_gift=document.createElement("div");
						Menu_gift.id="gift1_"+obj.data[i].user_id;
						Menu_gift.className="Menu_gift";
						Menu_gift.innerHTML=gifts;
						Menu_gift.onclick=function(){
											SendGiftmenu('virtual',0,'all',this.id);
										};
					TheDropDownMenu.appendChild(Menu_gift);
					var Menu_Delete=document.createElement("div");
						Menu_Delete.id=obj.data[i].id+"-"+obj.data[i].bindId;
						Menu_Delete.className="Menu_Delete";
						Menu_Delete.innerHTML=Deletes;
						Menu_Delete.onclick=function(){
										visitingDelete(this.id);
										};
					TheDropDownMenu.appendChild(Menu_Delete);
						
					visiting_homepages.appendChild(visitingLists);
				}
				document.getElementById("submit_v").value=Moreandmore;
			}else{
				visiting_homepages.innerHTML="<div class='visit_style'>"+visitors+"</div>";
				document.getElementById("submit_v").style.display="none";
			}
			
		}
	});
}

var TheDropDownMenuOpen=function(Openid,Menuid){
	Menuid=Menuid.substr(6);
	document.getElementById("Menu"+Openid+"_"+Menuid).style.display="block";
	document.getElementById("Open"+Openid+"_"+Menuid).style.display="none";
	document.getElementById("Close"+Openid+"_"+Menuid).style.display="block";
}
var TheDropDownMenuClose=function(Closeid,Menuid){
	Menuid=Menuid.substr(7);
	document.getElementById("Menu"+Closeid+"_"+Menuid).style.display="none";
	document.getElementById("Open"+Closeid+"_"+Menuid).style.display="block";
	document.getElementById("Close"+Closeid+"_"+Menuid).style.display="none";
}

//来访删除（）
var visitingDelete=function (Deleteid){
	var ch = Deleteid.split("-");
	var visitorId=ch[0];
	var bindId=ch[1];
	var ajaxpage="visitingDeletemsg";
	doAjax("index.php?m=Wap&c=Visitor&a=delVisitors", {visitorId:visitorId}, function (visitingDeletemsg){
		var obj = JSON.parse(visitingDeletemsg);
		if(obj.status=="success"){
			//alert(successfuls);
			document.getElementById("visitingList_"+visitorId).style.display="none";
		}else{
			alert(failure);
		}
	});
}

//礼物()
var SendGiftmenu=function(type,cate,name,giftid){
	//alert(giftid);
	//alert(name);
	himeDisplay();
	SendGiftMenuClose();
	Giftsid=0;
	Gifttype=type;
	
	document.getElementById("Gifts_homepage").style.display="block";	
	if(Giftpage=="visiting"){
		document.getElementById("cloce-visiting-gift").style.display="block";
	}else if(Giftpage=="collection"){
		document.getElementById("cloce-collection-gift").style.display="block";
	}else if(Giftpage=="LoveEachOther"){
		document.getElementById("cloce-LoveEachOther-gift").style.display="block";
	}else if(Giftpage=="ILikeThe"){
		document.getElementById("cloce-ILikeThe-gift").style.display="block";
	}else if(Giftpage=="LikeMy"){
		document.getElementById("cloce-LikeMy-gift").style.display="block";
	}else if(Giftpage=="FriendPage"){
		document.getElementById("PersonalfriendHome").style.display="block";
	}
	if(type=='real'){
		document.getElementById("cloce-visiting-gift").style.display="none";
		document.getElementById("cloce-collection-gift").style.display="none";
		document.getElementById("cloce-LoveEachOther-gift").style.display="none";
		document.getElementById("cloce-ILikeThe-gift").style.display="none";
		document.getElementById("cloce-LikeMy-gift").style.display="none";
		document.getElementById("cloce-gift1").style.display="block";
		document.getElementById("header_top_title1").style.display="none";		
		document.getElementById("header_top_title").style.display="block";		
		document.getElementById("header_top_title").innerHTML=realgifts;
	}else{
		document.getElementById("RealGifts").style.display="block";
		document.getElementById("header_top_title1").style.display="block";
		document.getElementById("header_top_title").style.display="none";
		if (name == 'all') {
			name = giftall;
		}
		document.getElementById("header_top_title1").innerHTML = name+"<span class='Gift_sanjiao'></span>";
		document.getElementById("header_top_title1").onclick=function(){
													SendGiftMenuOpen();
													};  
		document.getElementById("RealGifts").innerHTML="<div class='RealGifts_style'>"+realgifts+"</div>";	
	}
	if(giftid!=0){
		GiftUserId=giftid.substr(6);
	}
	document.getElementById("Gifts_list").innerHTML="";
	SendGiftLest(type,cate);
}

var SendGiftMenuOpen=function(){
	/*document.getElementById("gift_all").innerHTML=giftall;
	document.getElementById("gift_Birthday").innerHTML=giftBirthday;
	document.getElementById("gift_Friendship").innerHTML=giftFriendship;
	document.getElementById("gift_Love").innerHTML=giftLove;
	document.getElementById("gift_Festival").innerHTML=giftFestival;
	document.getElementById("gift_Fun").innerHTML=giftFun;*/
	document.getElementById("header_top_title_gift").style.display="block";
	document.getElementById("header_top_title1").onclick=function(){
												SendGiftMenuClose();
												}; 
}
var SendGiftMenuClose=function(){
	document.getElementById("header_top_title_gift").style.display="none";
	document.getElementById("header_top_title1").onclick=function(){
													SendGiftMenuOpen();
													}; 
}

//礼物列表()
var SendGiftLest=function(type,cate){
	var ajaxpage="SendGiftLestmsg";
	if(type==null || type==undefined || type==''){
		type=Gifttype;
	}
	//alert(type);
	var size =40;
	var Giftsdiv=document.getElementById("Gifts_list");
	doAjax("index.php?m=Wap&c=Gift&a=getList", {index:Giftsid++,size:size,type:type,cate:cate,langphp:langphp}, function (SendGiftLestmsg){
		var obj = JSON.parse(SendGiftLestmsg);
		if(obj.status=="success"){
			if(obj.data.length>0){
				if(obj.data.length<40){		
					document.getElementById("Gifts_submit").style.display="none";
				}
				for(var i=0; i<obj.data.length; i++){
					if(type=='real'){
						var detailaLists=document.createElement("div");
							detailaLists.id=obj.data[i].id;
							detailaLists.className='honepage-detailaLists';
							detailaLists.onclick=function(){
										PresentsTheDetailed(this.id);
										}; 
						detailaLists.innerHTML="<div class='Detail_2'><img src='"+getImgSize(obj.data[i].img,0)+"' style='width:100%;  height: 130px;'></div><div class='Detail_3'><p class='Detail_f Detail_t'>"+obj.data[i].name+"..</p><p class='Detail_f Detail_c'>"+obj.data[i].words+"...</p><p class='Detail_f Detail_g'>"+obj.data[i].price+" "+GoldCoin+"</p></div><div class='Detail_4'><img src='Public/Wap/Images/you.png' style='width:20px;height:20px;'></div>";
						Giftsdiv.appendChild(detailaLists);
					}else{
						var giftLists=document.createElement("div");
							giftLists.className='honepage-gift-list';
							giftLists.id=obj.data[i].id;
							giftLists.onclick=function(){
											GiftSend(0,this.id);
											};
							giftLists.innerHTML="<div class='gift-img'><img src='"+obj.data[i].img+"' class='gift-style-img'></div><div class='gift-font'>"+obj.data[i].price+"G</div>";
						Giftsdiv.appendChild(giftLists);
					}	
				}
			}
		}
	});
}

//礼物详细()
var PresentsTheDetailed=function(flowerId){
	himeDisplay();
	document.getElementById("cloce-gift2").style.display="block";
	document.getElementById("header_top_title").style.display="block";		
	document.getElementById("Detail_botton").style.display="block";
	document.getElementById("detail_homepage").style.display="block";
	document.getElementById("Detail_botton").innerHTML=ConfirmToSendOut;
	document.getElementById("Gifts_detail").innerHTML="";
	var ajaxpage="PresentsTheDetailedmsg";
	doAjax("index.php?m=Wap&c=Gift&a=detail", {flowerId:flowerId,langphp:langphp }, function (PresentsTheDetailedmsg){
		var obj = JSON.parse(PresentsTheDetailedmsg);
		if(obj.status=="success"){
			document.getElementById("header_top_title").innerHTML=obj.data.name;
			document.getElementById("InputRealId").value=flowerId;
			document.getElementById("Detailgold_price").value=obj.data.price;
			var oTest = document.getElementById("Gifts_detail");
			var div=document.createElement("div"); 
				div.className="Detaillist";
				div.innerHTML="<div class='Details'><input type='hidden' id='giftId' name='giftId' value='"+obj.data.id+"' /><div class='Detailimg'><img src='"+getImgBySize(obj.data.img,0)+"' style='width:100%;'></div><div class='Detailtitle1'>"+obj.data.introduce+"</div><div class='Detailgold'>"+obj.data.price+" "+GoldCoin+"</div><div class='Detailcontent1'><p>"+Gifttodescribe+"</p><p class='DetailC'>"+obj.data.descri+"</p></div><div class='Detailcontent1'><p>"+Giftisintroduced+"</p><p class='DetailC'>"+obj.data.material+"</p></div><div class='Detailcontent1'><p>"+Contactus+"</p><p class='DetailC'>"+obj.data.email+"</p></div></div>";
			oTest.insertBefore(div,null);
		}
	});	
}
//礼物发送()
var GiftSend=function(type,realId){
	if(type==1){
		realId=document.getElementById("InputRealId").value;
	}
	//alert("gold="+gold);
	var Detailgold_price=document.getElementById("Detailgold_price").value;
	//alert("Detailgold_price="+Detailgold_price);
	if(gold<Detailgold_price){
		alert(Goldfailure);
		Goldpage();
	}else{
		// var close = confirm("确定要发送？");
		// if (close) {
		//     //发送功能  window.open("sssss.html");
		//     var words="";
		//     doAjax("index.php?m=Wap&c=Gift&a=sendGift", {gid:realId,fid:GiftUserId, words:words, type:type}, function (GiftSendmsg){
		//     	var obj = JSON.parse(GiftSendmsg);
		//     	if(obj.status=='success'){
		//     		alert(successfuls);
		//     	}else{
		//     		alert(Goldfailure);
		//     		Goldpage();
		//     	}
		//     });
		// }else{
		//     window.event;
		// }
		document.getElementById('Recommended_wall_div2').style.display="block";
		document.getElementById('Recommended_wall_bg2').style.display="block";
		document.getElementById("Recommended_wall_content2").innerHTML=SendGifts_content;
		document.getElementById("Recommended_wall_32").innerHTML=cancel;
		document.getElementById("Recommended_wall_42").innerHTML=Determine;
		
		var Recommended_wall_42=document.getElementById('Recommended_wall_42');
		Recommended_wall_42.onclick=function(){
			var words="";
			document.getElementById('Recommended_wall_div2').style.display="none";
		    document.getElementById('Recommended_wall_bg2').style.display="none";
			doAjax("index.php?m=Wap&c=Gift&a=sendGift", {gid:realId,fid:GiftUserId, words:words, type:type}, function (GiftSendmsg){
				var obj = JSON.parse(GiftSendmsg);
				if(obj.status=='success'){
					alert(successfuls);
				}else{
					alert(Goldfailure);
					Goldpage();
				}
			});
		}
	}
}

//收藏 collection_homepage
var collectionPage=function (){	
	c=0;
	Giftpage="collection";
	close();
	himeDisplay();
	document.getElementById("cloce-collection-gift").style.display="none";
	document.getElementById("open-nav1").style.display="block";
	document.getElementById("collection_homepage").style.display="block";
	document.getElementById("header_top_title").style.display="block";
	document.getElementById("header_top_title").innerHTML=collections;
	document.getElementById("collection_list").innerHTML="";
	collectionList();
}
//()
var collectionList=function (){
	var size =20;
	var ajaxpage="collectionPagemsg";
	var collection_homepages=document.getElementById("collection_list");
	doAjax("index.php?m=Wap&c=Favor&a=getFavor", {ajaxpage:ajaxpage,index:c++, size:size,token:token,langphp:langphp }, function (collectionPagemsg){
		var obj = JSON.parse(collectionPagemsg);
		if(obj.status=="success"){
			if(obj.data.length>0){
				/*if(obj.data.length<20){
					alert(11111111111);		
					document.getElementById("collection_submit").style.display="none";
				}*/
				for(var i=0; i<obj.data.length; i++){
					if (obj.data[i].header) {
						var UserIcon=getImgSize(obj.data[i].header,80);
					}else{
						if (obj.data[i].sex == 'male') {
							var UserIcon="Public/Wap/Images/alila/male.png";
						}else{
							var UserIcon="Public/Wap/Images/alila/female.png";
						}
					}
					
					var onerroricon="javascript:this.src='Public/Wap/Images/alila/male.png'";
					
					var actives="";
					if(obj.data[i].is_online==1){
						actives="Public/Wap/Images/line.png";
					}else{
						actives="Public/Wap/Images/noline.png";
					}
					if(gender=='female'){
						onerroricon="javascript:this.src='Public/Wap/Images/alila/male.png'";	
					}else{
						onerroricon="javascript:this.src='Public/Wap/Images/alila/female.png'";	
					}

					var dateObj = new Date();
            		var year = dateObj.getFullYear();
            		var age = year -  obj.data[i].year;

            		var mood = obj.data[i].mood;
					if (mood != '' && mood != null) {
						mood = cutstr(mood,20);
					}else{
						mood = '';
					}

					var collectionLists=document.createElement("div");
						collectionLists.className='honepage-visiting-list';
						collectionLists.id="collectionList_"+obj.data[i].id;
					var visiting_lests=document.createElement("div");
						visiting_lests.className='visiting_lests';
						collectionLists.appendChild(visiting_lests);

					var visiting_user=document.createElement("div");
						visiting_user.className='honepage-user';
					visiting_lests.appendChild(visiting_user);
					
					var visiting_a=document.createElement("a");
						visiting_a.href="index.php?m=Wap&c=Space&a=profile&friendid="+obj.data[i].user_id;
						visiting_a.target='myiframeperfriend';
					visiting_user.appendChild(visiting_a);
					
					var visiting_user_phont_left=document.createElement("div");
						visiting_user_phont_left.className='honepage-user-phont-left';
						visiting_user_phont_left.innerHTML="<img src='"+UserIcon+"' onerror="+onerroricon+" class='homepage-content-img'><div class='honepage-user-zaixin'><img src='"+actives+"' class='homepage-line-img'></div>";
					visiting_a.appendChild(visiting_user_phont_left);
					
					var visiting_content=document.createElement("div");
						visiting_content.className='visiting_content';
						visiting_content.innerHTML="<div class='visiting_style'>"+cutstr(obj.data[i].username,10)+","+age+"</div><div class='visiting_style visiting_style_about'>"+mood+"</div><div class='visiting_style visiting_style_time'>"+datatime(obj.data[i].created)+"</div>";
					visiting_a.appendChild(visiting_content);
					
					var visiting_style_right=document.createElement("div");
						visiting_style_right.className='visiting_style_right';
					visiting_user.appendChild(visiting_style_right);
					var visiting_style_right1=document.createElement("div");
						visiting_style_right1.className='visiting-img1';
						visiting_style_right1.id='favor_'+obj.data[i].user_id+'-'+obj.data[i].username;
						visiting_style_right1.onclick = function () {
							if (membership == 0 && innerMember != 1) {
								alert(UpgradePrompt);
								Upgradepage();					
							}else{
								var idStr = this.id;
								var chatObj = idStr.split('_')[1];
								Personalfreshchat(chatObj);
															
							}
						} 
						visiting_style_right1.innerHTML="<img src='Public/Wap/Images/encounterim.png' class='visiting-img'>";
						visiting_style_right.appendChild(visiting_style_right1);
					var visiting_style_right2=document.createElement("div");
						visiting_style_right2.id="Open2_"+obj.data[i].id;
						visiting_style_right2.className='visiting-img1';
						visiting_style_right2.style.display="block";
						visiting_style_right2.innerHTML="<cite><img src='Public/Wap/Images/more.png' class='visiting-img'></cite>";
						visiting_style_right2.onclick=function(){
									TheDropDownMenuOpen(2,this.id);
									};
					visiting_style_right.appendChild(visiting_style_right2);
					var visiting_style_right3=document.createElement("div");
						visiting_style_right3.id="Close2_"+obj.data[i].id;
						visiting_style_right3.className='visiting-img1';
						visiting_style_right3.style.display="none";
						visiting_style_right3.innerHTML="<cite><img src='Public/Wap/Images/more.png' class='visiting-img'></cite>";
						visiting_style_right3.onclick=function(){
									TheDropDownMenuClose(2,this.id);
									};
					visiting_style_right.appendChild(visiting_style_right3);
					var TheDropDownMenu=document.createElement("div");
						TheDropDownMenu.id="Menu2_"+obj.data[i].id;				
						TheDropDownMenu.className="TheDropDownMenu_style";
						TheDropDownMenu.style.display="none";
					visiting_user.appendChild(TheDropDownMenu);
					var Menu_gift=document.createElement("div");
						Menu_gift.id="gift2_"+obj.data[i].user_id;
						Menu_gift.className="Menu_gift";
						Menu_gift.innerHTML=gifts;
						Menu_gift.onclick=function(){
										SendGiftmenu('virtual',0,'all',this.id);
									};
					TheDropDownMenu.appendChild(Menu_gift);
					var Menu_Delete=document.createElement("div");
						Menu_Delete.id=obj.data[i].id+"-"+obj.data[i].bindId;
						Menu_Delete.className="Menu_Delete";
						Menu_Delete.innerHTML=Deletes;
						Menu_Delete.onclick=function(){
									collectionDelete(this.id);
									};
					TheDropDownMenu.appendChild(Menu_Delete);
					
					collection_homepages.appendChild(collectionLists);
					
				}
				document.getElementById("submit_c").value=Moreandmore;
			}else{
				collection_homepages.innerHTML="<div class='visit_style'>"+collection+"</div>";
				document.getElementById("submit_c").style.display="none";
			}		
		}
	});
}
//收藏删除()
var collectionDelete=function (Deleteid){
	var ch = Deleteid.split("-");
	var favorId=ch[0];
	var bindId=ch[1];
	var ajaxpage="collectionDeletemsg";
	doAjax("index.php?m=Wap&c=Favor&a=delFavor", {favorId:favorId}, function (collectionDeletemsg){
		var obj = JSON.parse(collectionDeletemsg);
		if(obj.status=="success"){
			//alert(successfuls);
			document.getElementById("collectionList_"+favorId).style.display="none";
		}else{
			alert(failure);
		}
	});
}

//添加收藏（）
var collectionAdd=function(likeId){
		var ajaxpage="collectionAddmsg";
		doAjax("index.php?m=Wap&c=Favor&a=favor", {favorId:likeId}, function (collectionAddmsg){
		var obj = JSON.parse(collectionAddmsg);
		if(obj.status=="success"){
			alert(successfuls);
		}else{
			alert(failure);
		}
	});
}

//礼物盒子 GiftBox_homepage
var GiftBoxPage=function (s){	
	g=0;
	himeDisplay();
	if(s==1){
		close();
		document.getElementById("open-nav1").style.display="block";
	}else{
		document.getElementById("open-nav2").style.display="block";
	}	
	document.getElementById("GiftBox_homepage").style.display="block";
	document.getElementById("header_top_title").innerHTML=GiftBox;
	document.getElementById("GiftBox_list").innerHTML="";
	document.getElementById("interaction_gift").innerHTML="";
	InteractGift=0;
	GiftBoxList();
}
//()
var GiftBoxList=function (){
	var ajaxpage="GiftBoxPagemsg";
	var size=20;
	var GiftBox_homepages=document.getElementById("GiftBox_list");
	doAjax("index.php?m=Wap&c=Box&a=getlist", {index:g++, size:size}, function (GiftBoxPagemsg){

		var obj = JSON.parse(GiftBoxPagemsg);
		if(obj.status=="success"){
			if(obj.data.length>0){
				for(var i=0; i<obj.data.length; i++){
					var GiftBoxLists=document.createElement("div");
						GiftBoxLists.className='honepage-GiftBox-list';
						GiftBoxLists.innerHTML="<div class='GiftBox-img'><a href='index.php?m=Wap&c=Space&a=profile&friendid="+obj.data[i].sender['id']+"' target='myiframeperfriend'><img src='"+obj.data[i].gift_img+"' style='width:100%;height:100%;'></a></div><div class='GiftBox-name'>"+cutstr(obj.data[i].sender['username'],6)+"</div>";
						GiftBox_homepages.appendChild(GiftBoxLists);					
				}
				document.getElementById("submit").value=Moreandmore;
			}else{
				GiftBox_homepages.innerHTML="<div class='visit_style'>"+Giftcontent+"</div>";
			}	
		}
	});	
}

//邂逅 encounter_homepage
var encounterPage=function (){	
	e=0;
	close();
	himeDisplay();
	document.getElementById("open-nav").style.display="block";
	document.getElementById("open-encounter").style.display="block";
	document.getElementById("encounter_homepage").style.display="block";
	document.getElementById("header_top_title").innerHTML=Encounter;
	document.getElementById("encounter_title").innerHTML=likes;
	encounterOperation();
}
//（）
var encounterOperation=function (){
	var size =1;
	var ajaxpage="encounterOperationmsg";
	var encounterOperationimg=document.getElementById("encounter_img");
	doAjax("index.php?m=Wap&c=Home&a=recommend", {index:e++,size:size,lang:langphp}, function (encounterOperationmsg){
		//alert(encounterOperationmsg);
		var obj = JSON.parse(encounterOperationmsg);
		if(obj.status=="success"){
			var onerroricon="this.src='Public/Wap/Images/alila/male.png'";
			if(obj.data[0].sex == 'male'){//是1，为男性
				onerroricon="this.src='Public/Wap/Images/alila/male.png'";	
			}else{
				onerroricon="this.src='Public/Wap/Images/alila/female.png'";	
			}
			if (obj.data[0].header) {
				var UserIcon=getImgSize(obj.data[0].header,false);
			}else{
				if (obj.data[0].sex == 'male') {
					var UserIcon="Public/Wap/Images/alila/male.png";
				}else{
					var UserIcon="Public/Wap/Images/alila/female.png";
				}
			}
			var dateObj = new Date();
            var year = dateObj.getFullYear();
            var age = year -  obj.data[0].year;
			encounterOperationimg.innerHTML="<img style='width:100%; height: auto;' src='"+UserIcon+"' error="+onerroricon+" class='encounter_img_style'><div class='encounter_user'>"+obj.data[0].username+","+age+","+obj.data[0].country+"</div>";
			document.getElementById('likeId').value = obj.data[0].id;
		}
	});	
}
//邂逅添加()
var encounterlikes=function (){
	var ajaxpage="encounterlikesmsg";
	var likeId = document.getElementById("likeId").value;
	doAjax("index.php?m=Wap&c=Like&a=like", {likeId: likeId}, function (encounterlikesmsg){   
	var obj1 = JSON.parse(encounterlikesmsg);
		if(obj1.status=='success'){
			alert(successfuls);										
			encounterOperation();										
		}else{
			alert(failure);
			encounterOperation();
		}
	});			
}
//互相喜欢 LoveEachOther_homepage
var LoveEachOtherPage=function (){	
	a=0;
	Giftpage="LoveEachOther";
	close();
	
	himeDisplay();
	document.getElementById("interaction_match").innerHTML="";
	InteractMatch=0;
	document.getElementById("cloce-LoveEachOther-gift").style.display="none";
	document.getElementById("open-nav1").style.display="block";
	document.getElementById("Love_lest").style.display="block";
	document.getElementById("ILikeThe_title").style.borderBottom="1px solid #DDDDDD";
	document.getElementById("LikeMy_title").style.borderBottom="1px solid #DDDDDD";
	document.getElementById("LoveEachOther_title").style.borderBottom="2px solid #2995F8";
	document.getElementById("LoveEachOther_homepage").style.display="block";
	document.getElementById("header_top_title").style.display="block";
	document.getElementById("header_top_title").innerHTML=ReciprocalLiking;
	document.getElementById("LoveEachOther_lest").innerHTML="";
	
	LoveEachOther();
}
//（改）
var LoveEachOther=function (){
	var size =20;
	var ajaxpage="LoveEachOthermsg";
	var LoveEachOther_homepages=document.getElementById("LoveEachOther_lest");
	doAjax("index.php?m=Wap&c=Like&a=getLike", {index:a++,size:size,type:'match'}, function (LoveEachOthermsg){
		
		var obj = JSON.parse(LoveEachOthermsg);
		if(obj.status=="success"){
			if(obj.data.length>0){
				if(obj.data.length<20){		
					document.getElementById("LoveEachOther_submit").style.display="none";
				}
				for(var i=0; i<obj.data.length; i++){
					if (obj.data[i].headers) {
						var UserIcon=getImgSize(obj.data[i].header,80);
					}else{
						if (obj.data[i].sex == 'male') {
							var UserIcon="Public/Wap/Images/alila/male.png";
						}else{
							var UserIcon="Public/Wap/Images/alila/female.png";
						}
					}
					
					var onerroricon="javascript:this.src='Public/Wap/Images/alila/male.png'";
					
					var actives="";
					if(obj.data[i].is_online==1){
						actives="Public/Wap/Images/line.png";
					}else{
						actives="Public/Wap/Images/noline.png";
					}
					if(gender=='female'){
						onerroricon="javascript:this.src='Public/Wap/Images/alila/male.png'";	
					}else{
						onerroricon="javascript:this.src='Public/Wap/Images/alila/female.png'";	
					}
					var dateObj = new Date();
            		var year = dateObj.getFullYear();
            		var age = year -  obj.data[i].year;

            		var mood = obj.data[i].mood;
					if (mood != '' && mood != null) {
						mood = cutstr(mood,20);
					}else{
						mood = '';
					}
					var LoveEachOthers=document.createElement("div");
						LoveEachOthers.className='honepage-visiting-list';
						LoveEachOthers.id="encounter_"+obj.data[i].id;
					var visiting_lests=document.createElement("div");
						visiting_lests.className='visiting_lests';
					LoveEachOthers.appendChild(visiting_lests);
					var visiting_user=document.createElement("div");
						visiting_user.className='honepage-user';
					visiting_lests.appendChild(visiting_user);
					
					var visiting_a=document.createElement("a");
						visiting_a.href="index.php?m=Wap&c=Space&a=profile&friendid="+obj.data[i].user_id;
						visiting_a.target='myiframeperfriend';
					visiting_user.appendChild(visiting_a);
					
					var visiting_user_phont_left=document.createElement("div");
						visiting_user_phont_left.className='honepage-user-phont-left';
						visiting_user_phont_left.innerHTML="<img src='"+UserIcon+"' onerror="+onerroricon+" class='homepage-content-img'><div class='honepage-user-zaixin'><img src='"+actives+"' class='homepage-line-img'></div>";
					visiting_a.appendChild(visiting_user_phont_left);
					
					var visiting_content=document.createElement("div");
						visiting_content.className='visiting_content';
						visiting_content.innerHTML="<div class='visiting_style'>"+cutstr(obj.data[i].username,10)+","+age+"</div><div class='visiting_style visiting_style_about'>"+mood+"</div><div class='visiting_style visiting_style_time'>"+datatime(obj.data[i].created)+"</div>";
					visiting_a.appendChild(visiting_content);
					
					var visiting_style_right=document.createElement("div");
						visiting_style_right.className='visiting_style_right';
					visiting_user.appendChild(visiting_style_right);
					var visiting_style_right1=document.createElement("div");
						visiting_style_right1.className='visiting-img1';
						visiting_style_right1.id='LoveEachOther_'+obj.data[i].user_id+'-'+obj.data[i].username;
						visiting_style_right1.onclick = function () {
							if (membership == 0 && innerMember != 1) {
								alert(UpgradePrompt);
								Upgradepage();					
							}else{
								var idStr = this.id;
								var chatObj = idStr.split('_')[1];
								Personalfreshchat(chatObj);
															
							}
						}
						visiting_style_right1.innerHTML="<img src='Public/Wap/Images/encounterim.png' class='visiting-img'>";
					visiting_style_right.appendChild(visiting_style_right1);
					var visiting_style_right2=document.createElement("div");
						visiting_style_right2.id="Open3_"+obj.data[i].id;
						visiting_style_right2.className='visiting-img1';
						visiting_style_right2.style.display="block";
						visiting_style_right2.innerHTML="<cite><img src='Public/Wap/Images/more.png' class='visiting-img'></cite>";
						visiting_style_right2.onclick=function(){
									TheDropDownMenuOpen(3,this.id);
									};
					visiting_style_right.appendChild(visiting_style_right2);
					var visiting_style_right3=document.createElement("div");
						visiting_style_right3.id="Close3_"+obj.data[i].id;
						visiting_style_right3.className='visiting-img1';
						visiting_style_right3.style.display="none";
						visiting_style_right3.innerHTML="<cite><img src='Public/Wap/Images/more.png' class='visiting-img'></cite>";
						visiting_style_right3.onclick=function(){
									TheDropDownMenuClose(3,this.id);
									};
					visiting_style_right.appendChild(visiting_style_right3);
					var TheDropDownMenu=document.createElement("div");
						TheDropDownMenu.id="Menu3_"+obj.data[i].id;				
						TheDropDownMenu.className="TheDropDownMenu_style";
						TheDropDownMenu.style.display="none";
					visiting_user.appendChild(TheDropDownMenu);
					var Menu_gift=document.createElement("div");
						Menu_gift.id="gift3_"+obj.data[i].user_id;
						Menu_gift.className="Menu_gift";
						Menu_gift.innerHTML=gifts;
						Menu_gift.onclick=function(){
										SendGiftmenu('virtual',0,'all',this.id);
									};
					TheDropDownMenu.appendChild(Menu_gift);
					var Menu_Delete=document.createElement("div");
						Menu_Delete.id=obj.data[i].id+"-"+obj.data[i].bindId;
						Menu_Delete.className="Menu_Delete";
						Menu_Delete.innerHTML=Deletes;
						Menu_Delete.onclick=function(){
									encounterDelete(this.id,'match');
									};
					TheDropDownMenu.appendChild(Menu_Delete);

					LoveEachOther_homepages.appendChild(LoveEachOthers);
				}
				document.getElementById("submit_l").value=Moreandmore;
			}else{
				LoveEachOther_homepages.innerHTML="<div class='visit_style'>"+quicklymeet+"</div>";
				document.getElementById("submit_l").style.display="none";
			}	
		}
	});	
}

//我喜欢的 ILikeThe_homepage
var ILikeThePage=function (){	
	b=0;
	Giftpage="ILikeThe";
	close();
	himeDisplay();
	document.getElementById("cloce-ILikeThe-gift").style.display="none";
	document.getElementById("open-nav1").style.display="block";
	document.getElementById("Love_lest").style.display="block";
	document.getElementById("ILikeThe_title").style.borderBottom="2px solid #2995F8";
	document.getElementById("LikeMy_title").style.borderBottom="1px solid #DDDDDD";
	document.getElementById("LoveEachOther_title").style.borderBottom="1px solid #DDDDDD";
	document.getElementById("ILikeThe_homepage").style.display="block";
	document.getElementById("header_top_title").style.display="block";
	document.getElementById("header_top_title").innerHTML=ILikeThes;
	document.getElementById("ILikeThe_lest").innerHTML="";
	ILikeThe();
}
//（改）
var ILikeThe=function (){
	var size =20;
	var ajaxpage="ILikeThemsg";
	var ILikeThe_homepages=document.getElementById("ILikeThe_lest");
	doAjax("index.php?m=Wap&c=Like&a=getLike", {index:b++,size:size,type:'initiative'}, function (ILikeThemsg){
		
		var obj = JSON.parse(ILikeThemsg);
		if(obj.status=="success"){
			if(obj.data.length>0){
				if(obj.data.length<20){
					document.getElementById("ILikeThe_submit").style.display="none";
				}
				for(var i=0; i<obj.data.length; i++){
					if (obj.data[i].headers) {
						var UserIcon=getImgSize(obj.data[i].header,80);
					}else{
						if (obj.data[i].sex == 'male') {
							var UserIcon="Public/Wap/Images/alila/male.png";
						}else{
							var UserIcon="Public/Wap/Images/alila/female.png";
						}
					}
					
					var onerroricon="javascript:this.src='Public/Wap/Images/alila/male.png'";
					
					var actives="";
					if(obj.data[i].is_online==1){
						actives="Public/Wap/Images/line.png";
					}else{
						actives="Public/Wap/Images/noline.png";
					}
					if(gender==2){
						onerroricon="javascript:this.src='Public/Wap/Images/alila/male.png'";	
					}else{
						onerroricon="javascript:this.src='Public/Wap/Images/alila/female.png'";	
					}
					var dateObj = new Date();
            		var year = dateObj.getFullYear();
            		var age = year -  obj.data[i].year;

            		var mood = obj.data[i].mood;
					if (mood != '' && mood != null) {
						mood = cutstr(mood,20);
					}else{
						mood = '';
					}
					var LoveEachOthers=document.createElement("div");
						LoveEachOthers.className='honepage-visiting-list';
						LoveEachOthers.id="encounter_"+obj.data[i].id;
					var visiting_lests=document.createElement("div");
						visiting_lests.className='visiting_lests';
					LoveEachOthers.appendChild(visiting_lests);
					var visiting_user=document.createElement("div");
						visiting_user.className='honepage-user';
					visiting_lests.appendChild(visiting_user);
					
					var visiting_a=document.createElement("a");
						visiting_a.href="index.php?m=Wap&c=Space&a=profile&friendid="+obj.data[i].user_id;
						visiting_a.target='myiframeperfriend';
					visiting_user.appendChild(visiting_a);
					
					var visiting_user_phont_left=document.createElement("div");
						visiting_user_phont_left.className='honepage-user-phont-left';
						visiting_user_phont_left.innerHTML="<img src='"+UserIcon+"' onerror="+onerroricon+" class='homepage-content-img'><div class='honepage-user-zaixin'><img src='"+actives+"' class='homepage-line-img'></div>";
					visiting_a.appendChild(visiting_user_phont_left);
					
					var visiting_content=document.createElement("div");
						visiting_content.className='visiting_content';
						visiting_content.innerHTML="<div class='visiting_style'>"+cutstr(obj.data[i].username,10)+","+age+"</div><div class='visiting_style visiting_style_about'>"+mood+"</div><div class='visiting_style visiting_style_time'>"+datatime(obj.data[i].created)+"</div>";
					visiting_a.appendChild(visiting_content);
					
					var visiting_style_right=document.createElement("div");
						visiting_style_right.className='visiting_style_right';
					visiting_user.appendChild(visiting_style_right);
					var visiting_style_right1=document.createElement("div");
						visiting_style_right1.className='visiting-img1';
						visiting_style_right1.id='ILikeThe_'+obj.data[i].user_id+'-'+obj.data[i].username;
						visiting_style_right1.onclick = function () {
							if (membership == 0 && innerMember != 1) {
								alert(UpgradePrompt);
								Upgradepage();					
							}else{
								var idStr = this.id;
								var chatObj = idStr.split('_')[1];
								Personalfreshchat(chatObj);
															
							}
						}
						visiting_style_right1.innerHTML="<img src='Public/Wap/Images/encounterim.png' class='visiting-img'>";
					visiting_style_right.appendChild(visiting_style_right1);
					var visiting_style_right2=document.createElement("div");
						visiting_style_right2.id="Open4_"+obj.data[i].id;
						visiting_style_right2.className='visiting-img1';
						visiting_style_right2.style.display="block";
						visiting_style_right2.innerHTML="<cite><img src='Public/Wap/Images/more.png' class='visiting-img'></cite>";
						visiting_style_right2.onclick=function(){
									TheDropDownMenuOpen(4,this.id);
									};
					visiting_style_right.appendChild(visiting_style_right2);
					var visiting_style_right3=document.createElement("div");
						visiting_style_right3.id="Close4_"+obj.data[i].id;
						visiting_style_right3.className='visiting-img1';
						visiting_style_right3.style.display="none";
						visiting_style_right3.innerHTML="<cite><img src='Public/Wap/Images/more.png' class='visiting-img'></cite>";
						visiting_style_right3.onclick=function(){
									TheDropDownMenuClose(4,this.id);
									};
					visiting_style_right.appendChild(visiting_style_right3);
					var TheDropDownMenu=document.createElement("div");
						TheDropDownMenu.id="Menu4_"+obj.data[i].id;				
						TheDropDownMenu.className="TheDropDownMenu_style";
						TheDropDownMenu.style.display="none";
					visiting_user.appendChild(TheDropDownMenu);
					var Menu_gift=document.createElement("div");
						Menu_gift.id="gift4_"+obj.data[i].user_id;
						Menu_gift.className="Menu_gift";
						Menu_gift.innerHTML=gifts;
						Menu_gift.onclick=function(){
									SendGiftmenu('virtual',0,'all',this.id);
								};
					TheDropDownMenu.appendChild(Menu_gift);
					var Menu_Delete=document.createElement("div");
						Menu_Delete.id=obj.data[i].id+"-"+obj.data[i].bindId;
						Menu_Delete.className="Menu_Delete";
						Menu_Delete.innerHTML=Deletes;
						Menu_Delete.onclick=function(){
									encounterDelete(this.id,'initiative');
									};
					TheDropDownMenu.appendChild(Menu_Delete);

					ILikeThe_homepages.appendChild(LoveEachOthers);
				}
				document.getElementById("submit_i").value=Moreandmore;
			}else{
				ILikeThe_homepages.innerHTML="<div class='visit_style'>"+quicklymeet+"</div>";
				document.getElementById("submit_i").style.display="none";
			}	
		}
	});	
}
//喜欢我的 LikeMy_homepage
var LikeMyPage=function (){	
	f=0;
	Giftpage="LikeMy";
	close();
	himeDisplay();
	document.getElementById("interaction_passive").innerHTML="";
	InteractPassive=0;
	document.getElementById("cloce-LikeMy-gift").style.display="none";
	document.getElementById("open-nav1").style.display="block";
	document.getElementById("Love_lest").style.display="block";
	document.getElementById("ILikeThe_title").style.borderBottom="1px solid #DDDDDD";
	document.getElementById("LikeMy_title").style.borderBottom="2px solid #2995F8";
	document.getElementById("LoveEachOther_title").style.borderBottom="1px solid #DDDDDD";
	document.getElementById("LikeMy_homepage").style.display="block";
	document.getElementById("header_top_title").style.display="block";
	document.getElementById("header_top_title").innerHTML=LikeMys;
	document.getElementById("LikeMy_lest").innerHTML="";
	LikeMy();
}
//（改）
var LikeMy=function (){
	var size =20;
	var ajaxpage="LikeMymsg";
	var LikeMy_homepages=document.getElementById("LikeMy_lest");
	doAjax("index.php?m=Wap&c=Like&a=getLike", {index:f++,size:size,type:'passive'}, function (LikeMymsg){
		
		var obj = JSON.parse(LikeMymsg);
		if(obj.status=="success"){
			if(obj.data.length>0){
				if(obj.data.length<20){		
					document.getElementById("LikeMy_submit").style.display="none";
				}
				for(var i=0; i<obj.data.length; i++){
					if (obj.data[i].headers) {
						var UserIcon=getImgSize(obj.data[i].header,80);
					}else{
						if (obj.data[i].sex == 'male') {
							var UserIcon="Public/Wap/Images/alila/male.png";
						}else{
							var UserIcon="Public/Wap/Images/alila/female.png";
						}
					}
					
					var onerroricon="javascript:this.src='Public/Wap/Images/alila/male.png'";
					
					var actives="";
					if(obj.data[i].is_online==1){
						actives="Public/Wap/Images/line.png";
					}else{
						actives="Public/Wap/Images/noline.png";
					}
					if(gender=='female'){
						onerroricon="javascript:this.src='Public/Wap/Images/alila/male.png'";	
					}else{
						onerroricon="javascript:this.src='Public/Wap/Images/alila/female.png'";	
					}
					var dateObj = new Date();
            		var year = dateObj.getFullYear();
            		var age = year -  obj.data[i].year;

            		var mood = obj.data[i].mood;
					if (mood != '' && mood != null) {
						mood = cutstr(mood,20);
					}else{
						mood = '';
					}
					var LoveEachOthers=document.createElement("div");
						LoveEachOthers.className='honepage-visiting-list';
						LoveEachOthers.id="encounter_"+obj.data[i].id;
					var visiting_lests=document.createElement("div");
						visiting_lests.className='visiting_lests';
					LoveEachOthers.appendChild(visiting_lests);
					var visiting_user=document.createElement("div");
						visiting_user.className='honepage-user';
					visiting_lests.appendChild(visiting_user);
					
					var visiting_a=document.createElement("a");
						visiting_a.href="index.php?m=Wap&c=Space&a=profile&friendid="+obj.data[i].user_id;
						visiting_a.target='myiframeperfriend';
					visiting_user.appendChild(visiting_a);
					
					var visiting_user_phont_left=document.createElement("div");
						visiting_user_phont_left.className='honepage-user-phont-left';
						visiting_user_phont_left.innerHTML="<img src='"+UserIcon+"' onerror="+onerroricon+" class='homepage-content-img'><div class='honepage-user-zaixin'><img src='"+actives+"' class='homepage-line-img'></div>";
					visiting_a.appendChild(visiting_user_phont_left);
					
					var visiting_content=document.createElement("div");
							visiting_content.className='visiting_content';
							visiting_content.innerHTML="<div class='visiting_style'>"+cutstr(obj.data[i].username,10)+","+age+"</div><div class='visiting_style visiting_style_about'>"+mood+"</div><div class='visiting_style visiting_style_time'>"+datatime(obj.data[i].created)+"</div>";
					visiting_a.appendChild(visiting_content);
					
					var visiting_style_right=document.createElement("div");
						visiting_style_right.className='visiting_style_right';
					visiting_user.appendChild(visiting_style_right);
					var visiting_style_right1=document.createElement("div");
						visiting_style_right1.className='visiting-img1';
						visiting_style_right1.id='LikeMy_'+obj.data[i].user_id+'-'+obj.data[i].username;
						visiting_style_right1.onclick = function () {
							if (membership == 0 && innerMember != 1) {
								alert(UpgradePrompt);
								Upgradepage();					
							}else{
								var idStr = this.id;
								var chatObj = idStr.split('_')[1];
								Personalfreshchat(chatObj);
															
							}
						}
						visiting_style_right1.innerHTML="<img src='Public/Wap/Images/encounterim.png' class='visiting-img'>";
					visiting_style_right.appendChild(visiting_style_right1);
					var visiting_style_right2=document.createElement("div");
						visiting_style_right2.id="Open5_"+obj.data[i].id;
						visiting_style_right2.className='visiting-img1';
						visiting_style_right2.style.display="block";
						visiting_style_right2.innerHTML="<cite><img src='Public/Wap/Images/more.png' class='visiting-img'></cite>";
						visiting_style_right2.onclick=function(){
									TheDropDownMenuOpen(5,this.id);
									};
					visiting_style_right.appendChild(visiting_style_right2);
					var visiting_style_right3=document.createElement("div");
						visiting_style_right3.id="Close5_"+obj.data[i].id;
						visiting_style_right3.className='visiting-img1';
						visiting_style_right3.style.display="none";
						visiting_style_right3.innerHTML="<cite><img src='Public/Wap/Images/more.png' class='visiting-img'></cite>";
						visiting_style_right3.onclick=function(){
									TheDropDownMenuClose(5,this.id);
									};
					visiting_style_right.appendChild(visiting_style_right3);
					var TheDropDownMenu=document.createElement("div");
						TheDropDownMenu.id="Menu5_"+obj.data[i].id;				
						TheDropDownMenu.className="TheDropDownMenu_style";
						TheDropDownMenu.style.display="none";
					visiting_user.appendChild(TheDropDownMenu);
					var Menu_gift=document.createElement("div");
						Menu_gift.id="gift5_"+obj.data[i].user_id;
						Menu_gift.className="Menu_gift";
						Menu_gift.innerHTML=gifts;
						Menu_gift.onclick=function(){
										SendGiftmenu('virtual',0,'all',this.id);
									};
					TheDropDownMenu.appendChild(Menu_gift);
					var Menu_Delete=document.createElement("div");
						Menu_Delete.id=obj.data[i].id+"-"+obj.data[i].bindId;
						Menu_Delete.className="Menu_Delete";
						Menu_Delete.innerHTML=Deletes;
						Menu_Delete.onclick=function(){
									encounterDelete(this.id,'passive');
									};
					TheDropDownMenu.appendChild(Menu_Delete);

					LikeMy_homepages.appendChild(LoveEachOthers);
				}
				document.getElementById("submit_m").value=Moreandmore;
			}else{
				LikeMy_homepages.innerHTML="<div class='visit_style'>"+quicklymeet+"</div>";
				document.getElementById("submit_m").style.display="none";
			}	
		}
	});	
}
//邂逅删除（）
var encounterDelete=function (Deleteid,type){
	var ch = Deleteid.split("-");
	var likeId=ch[0];
	var bindId=ch[1];
	var ajaxpage="encounterDeletemsg";
	doAjax("index.php?m=Wap&c=Like&a=delLike", {likeId:likeId,type:type}, function (encounterDeletemsg){
		var obj = JSON.parse(encounterDeletemsg);
		if(obj.status=="1"){
			alert(successfuls);
			document.getElementById("encounter_"+likeId).style.display="none";
		}else{ 
			alert(failure);
		}
	});
}


//设置
var Setting=function (){
	close();
	himeDisplay();
	document.getElementById("open-nav1").style.display="block";
	document.getElementById("Setting_homepage").style.display="block";
	document.getElementById("header_top_title").innerHTML=settingUp;
	document.getElementById("change_password").innerHTML=ChangePasswords;
	//document.getElementById("About_Us").innerHTML=AboutUs;
	document.getElementById("Dating_Safety").innerHTML=DatingSafetys;
	document.getElementById("Terms_of_use").innerHTML=TermsOfUses;
	document.getElementById("Privacy_policy").innerHTML=PrivacyPolicys;
	document.getElementById("exit_account").innerHTML=WithdrawFromTheAccount;
}
//修改密码
var ChangePasswordpage=function (){
	himeDisplay();

	var ChangePasswordpage=document.getElementById("Settings_page");
		ChangePasswordpage.style.display="block";
		ChangePasswordpage.innerHTML="";
	document.getElementById("open-return").style.display="block";
	document.getElementById("open-return").onclick=function(){
										Setting();
										};
	document.getElementById("header_top_title").innerHTML=ChangePasswords;
	
	var ChangePassworddiv=document.createElement("div");
		ChangePassworddiv.className="ChangePassword_style";
		ChangePassworddiv.innerHTML="<div class='p_r_content_input_1'><div class='font'>"+Password+"：</div><input id='password1' type='password' placeholder='<"+EnterPassword+">'></div><div class='p_r_content_input_1'><div class='font'>"+ConfirmPassword+"：</div><input id='password2' name='passwor' type='password' placeholder='<"+ConfirmPassword+">'></div>";
	ChangePasswordpage.appendChild(ChangePassworddiv);
	var ChangePasswordbotton=document.createElement("div");
		ChangePasswordbotton.className="p_r_button";
		ChangePasswordbotton.onclick=function(){
									ChangePassword();
									};
	ChangePasswordbotton.innerHTML=Determine;
	ChangePasswordpage.appendChild(ChangePasswordbotton);
}
//（ ）
var ChangePassword=function (){
	//var pwd = document.getElementById("password1").value;
	//var qrpass = document.getElementById("password2").value;
	var pwd = $("#password1").val();
	var qrpass = $("#password2").val();
	if(pwd==qrpass){
		doAjax("index.php?m=Wap&c=User&a=editPass", {pwd:pwd}, function (ChangePasswordmsg){
		
			var obj = JSON.parse(ChangePasswordmsg);
			if(obj.status=="success"){
				alert(successfuls);
				ExitAccountcance2();
			}
		});	
	}else{
		alert(TwoPassword);
	}
}
//关于我们
var AboutUspage=function (){
	himeDisplay();
	document.getElementById("open-return").style.display="block";
	var AboutUsspage=document.getElementById("Settings_page");
		AboutUsspage.style.display="block";
		AboutUsspage.innerHTML="";
	document.getElementById("open-return").onclick=function(){
											Setting();
											};
	document.getElementById("header_top_title").innerHTML=AboutUs;
	AboutUsspage.innerHTML="<div class='about_bg'><div class='about' style='padding: 50px 5px;  text-align: center;'><img src='Public/Wap/Images/ABOUT.png' style='width: 105px;  margin: auto;'><p>Hahameet</p></div><div class='about_img'></div></div><div class='footer1'><p>Copyright © 2016 </p><p>vivimeetteam. All Rights Reserved </p><p class='per_a'><?php echo $client;?></span></p></div>";
}
//交友安全
var DatingSafety=function (){
	himeDisplay();
	var DatingSafetypage=document.getElementById("Settings_page");
		DatingSafetypage.style.display="block";
		DatingSafetypage.innerHTML="";
	document.getElementById("open-return").style.display="block";
	document.getElementById("open-return").onclick=function(){
										Setting();
											};
	document.getElementById("header_top_title").innerHTML=DatingSafetys;
	DatingSafetypage.innerHTML="<div class='dating'><p>"+DAtingSafetycontent1+"</p><p>"+DAtingSafetycontent2+"</p><p>"+DAtingSafetycontent3+"</p><p>"+DAtingSafetycontent4+"</p><p>"+DAtingSafetycontent5+"</p><p style='font-size: 16px;font-weight: 700;text-indent: 0;margin:10px 0px 5px'>"+DAtingSafetycontent6+"</p><p>"+DAtingSafetycontent7+"</p><p>"+DAtingSafetycontent8+"</p><p>"+DAtingSafetycontent9+"</p><p>"+DAtingSafetycontent10+"</p><p>"+DAtingSafetycontent11+"</p></div>";
}


//退出
var ExitAccount=function(){
	ChatSendOpt(6,id);
	document.getElementById("ExitAccount_id1").style.display="block";
	document.getElementById("ExitAccount_div").style.display="block";
	document.getElementById("ExitAccount_1").innerHTML=ExitAccount_1;
	document.getElementById("ExitAccount_2").innerHTML=ExitAccount_2;
	document.getElementById("ExitAccount_3").innerHTML=cancel;
	document.getElementById("ExitAccount_4").innerHTML=Determine;
}
var ExitAccountcancel=function(){
	document.getElementById("ExitAccount_id1").style.display="none";
	document.getElementById("ExitAccount_div").style.display="none";
}
var ExitAccountcance2=function(){
	document.getElementById("ExitAccount_id1").style.display="none";
	document.getElementById("ExitAccount_div").style.display="none";
	delCookie("token");
	location.replace('index.php?m=Wap&c=Index&a=index');
}


//搜索最近联系人
var SearchRecent_Open=function(){
	document.getElementById("search_div").style.display="block";
	$("#search_txt").fadeIn();//使用淡入效果来显示一个隐藏的 <..> 元素：
	$("#search_inputString").focus();
	//$('#search_list').html(""); 
}
var SearchRecent_Close=function(){
	document.getElementById("search_div").style.display="none";
	$("#search_txt").fadeOut();//使用淡出效果来隐藏的 一个<..> 元素
	//$('#search_list').html(""); 
}
var SearchRecent=function(SContent){
	if(ChatNewMap){
		for(var SC in ChatNewMap){
			var searchName=ChatNewMap[SC]["username"];
			alert(searchName);
			return false;
		}
	}
}


//右边黑色聊天列表顶部的“搜索框”，
$(function(){    
$('#search_inputString').bind('input propertychange', function() { 
		 var Search_input_content=$(this).val().toLowerCase();
		 if(Search_input_content.length > 0){
			 var chat_Contacts1=document.getElementById("search_list");
			if(ChatNewMap){
				$('#search_list').html("");  
				for(var SC in ChatNewMap){
					//print(json2str(ChatNewMap[SC]));
					var searchid=ChatNewMap[SC]["id"];
					var searchCountry=ChatNewMap[SC]["country"];
					if (!searchCountry) {
						searchCountry = '';
					}
					if (ChatNewMap[SC]["header"]) {
						var UserIconR=getImgSize(ChatNewMap[SC]["header"],80);
					}else{
						if (ChatNewMap[SC]["gender"]=='male') {
							UserIconR='Public/Wap/Images/alila/male.png';
						}else{
							UserIconR='Public/Wap/Images/alila/female.png';
						}
					}
					var onerroricon="javascript:this.src='Public/Wap/Images/alila/male.png'";
					var actives="";
					if(ChatNewMap[SC]["active"]!=false){
						actives="Public/Wap/Images/line.png";
					}else{
						actives="Public/Wap/Images/noline.png";
					}
					var memberships="";
					if(ChatNewMap[SC]["gender"]=='male'){
						onerroricon="javascript:this.src='Public/Wap/Images/alila/female.png'";	
					}else{					
						onerroricon="javascript:this.src='Public/Wap/Images/alila/male.png'";					
					}						
					var searchName=ChatNewMap[SC]["username"];
					var SC=ChatNewMap[SC]["username"].toLowerCase().indexOf(Search_input_content);
					if(SC> -1){
						var search_list=document.createElement("li");
							search_list.id=searchid+"-"+searchName;
							search_list.className="search_list_content";
							search_list.style.display="block";
							search_list.innerHTML="<div class='honepage-user'><div class='honepage-user-phont-left'><img src='"+UserIconR+"' onerror="+onerroricon+" class='homepage-content-img'></div><div class='honepage-user-right'><div class='honepage-user-right-top'><div class='honepage-user-name'>"+searchName+"</div><div class='honepage-user-dizhi'>"+searchCountry+"</div></div></div></div>";
						if(role==0){
							if(membership==0){
								search_list.onclick=function(){
									document.getElementById("content").style.webkitTransform="";
									SearchRecent_Close();
									Upgradepage();
									};
							}else{
								search_list.onclick=function(){
									SearchRecent_Close();
									Personalfreshchat(this.id);
									};
							}
						}else{
							search_list.onclick=function(){
								SearchRecent_Close();
								Personalfreshchat(this.id);
								};
						}
					chat_Contacts1.appendChild(search_list);
					}else{
						//alert("no");
					}
					//return false;
				}
			}
		 }else{
			 $('#search_list').html("");  
		 }
});    
})

//获取对象数组长度的函数
function count(o){
    var t = typeof o;
    if(t == 'string'){
        return o.length;
    }else if(t == 'object'){
    var n = 0;
    for(var i in o){
        n++;
    }
    return n;
    }
    return false;
} 
