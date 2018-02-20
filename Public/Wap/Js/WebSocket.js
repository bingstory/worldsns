/**
 * WebSocket API以替代我们过去几年一直在用的Ajax技术.WebSocket API最伟大之处在于服务器和客户端可以在给定的时间范围内的任意时刻，相互推送信息。WebSocket并不限于以Ajax(或XHR)方式通信，因为Ajax技术需要客户端发起请求，而WebSocket服务器和客户端可以彼此相互推送信息；XHR受到域的限制，而WebSocket允许跨域通信。
 * 优秀的第三方API，名为Socket.IO
 * WebSocket API是下一代客户端-服务器的异步通信方法。该通信取代了单个的TCP套接字，使用ws或wss协议，可用于任意的客户端和服务器程序。
 */

 //判断当前浏览器是否支持WebSocket
function replaceAll(str,s1,s2) {
    while( str.indexOf(s1) != -1 ) {
        str = str.replace(s1,s2); 
    } 
    return str;
}
var contactMap={};
var strangerMap={};
var ChatNewMap={};
var contactIdList=[];	
var heartTimer;
var hasInit = 0;
var ChatWebContent="";
var Chatstr=0;
var fid=0;
var TPlang1="";
var TPlang2="";
var TPlang3="";
var TPlang4="";
var transTypeid="";
var Translationid="";
var fnewcontent="";
var chatfid=0;
var ws = {};
var ces=0;
var Expressiondiv=0;
var friendT="";
var newtimes="";
var chatpage=document.getElementById("chat_homepage");
var chats=document.getElementById("open-socials");
var Recent_Contact=document.getElementById("Recent_Contact");
var chatshu=document.getElementById("chat_shu");
var interaction_chat=document.getElementById("interaction_chat");
var friendurl="";
var friendgender="";
var onerroricon="javascript:this.src='Public/Wap/Images/alila/male.png'";
var SEn="stickerface1";
var SEname="sticker_stickerface1";
var gainer='';
//数据处理
var str2json = function (s) {
	try {
		s = eval("(" + s + ")");
	} catch (e) {
		self.print("str2json error:" + s);
	}
	return s;
};
//数据处理
var json2str = function (o) {
	var arr = [];
        for (var p in o) {
            var v = String(o[p]);
            v = v.replace(/(<|>|\?|"|'|,|\:)/g, "\\$1");
            arr.push('"' + p + '":"' + v + '"');
        }
        return '{' + arr.join(',') + '}';
};
//数据处理
var objMerger = function (obj1, obj2){
	for(var r in obj2){
	eval("obj1."+r+"=obj2."+r);
	}
	return obj1;
}
//服务器接口
var getUrl = function () {
	//return url = WebSocketurl+"?token="+token+"&init="+hasInit+"&device=3";
	return url = "ws://211.149.192.145:2345";
}
//WebSocket链接处理
var freshSocket = function () {
	var bindEvent = function () {
		ws.onclose = doClose;
		ws.onopen = doOpen;
		ws.onmessage = doMessages;
	};
   // $.print(getUrl());
	if ('WebSocket' in window) {
		ws = new WebSocket(getUrl());
		bindEvent();
	} else if ('MozWebSocket' in window) {
		ws = new window["MozWebSocket"](getUrl());
		bindEvent();
	} else {
		loadFlashSocket();
	}
	//setTimeout(freshSocket, 1000);
};	
var doOpen = function (event) {
	console.log('链接成功');
    hasInit = 0;
	doHeart();
};
var doHeart = function () {
	ChatSendOpt(100);
	heartTimer = setTimeout(doHeart, 10000);
};
var doClose = function (event) {
	setTimeout(freshSocket, 1000);
	if (heartTimer != null) {
		//alert(1);
		clearTimeout(heartTimer);
		heartTimer = null;
	}else{
		//alert(2);
		doHeart();
	}
};	
//发送处理
var ChatSendOpt=function(opt,addressid,msgtype,txt,time,deleteid,msgid,msgfrom,address,msgtl,msgtxt,transType,url){
	var language=getCookie("lang");
	var req = {};
	if(opt==0){//标记已读某联系人消息
		req["address"]=addressid;
	}else if(opt==1){//发送消息、表情贴
		//alert("opt=1");
		req["address"] = addressid;
		//alert('address='+req["address"]);
		req["type"] = msgtype;
		req["txt"] = replaceAll(txt,'?','？');
		req["txt"] = replaceAll(req["txt"],',','，');
        req["txt"] = replaceAll(req["txt"],"'","’");
		if(url){
			req["url"] = url;	
		}	
		if(transType){
			
			req["transType"] = transType;
			if(transType==2){
				req["sl"] = "zh";
				req["tl"] = msgtl.substring(2,0);
			}else{
				//req["sl"] = ;
				req["tl"] =msgtl;
			}
		}
	}else if(opt==2){//历史记录翻译
		//alert(msgid);
		req["id"] = msgid;
		req["from"] = msgfrom;
		req["address"] = addressid;
		/*if(transType==2){
			req["sl"] = language;
		}*/
		req["content"] = msgtxt;
		req["tl"] = msgtl;
		req["msgType"] = msgtype;
		req["transType"] = transType;
	}else if(opt==3){//历史记录查询
		req["address"] = addressid;
		if(time){
			req["created"] = time;
		}						
	}else if(opt==4){//陌生人查询
		req["address"]=addressid;			
	}else if(opt==5){//删除联系人
		req["address"]=addressid;
	}else if (opt==6) {
		req["address"]=addressid;
	}else if(opt==100){//心跳
		//req["address"]=addressid;
		if (hasInit == 0) {
            req["hasInit"] = 'no';
        }		
	}
	if (opt == 1 && chatState == 0) {
        alert(be_banned);
        return false;
    }
	if (req) {//判断请求是否合法
		req["opt"] = opt;
		req["uid"] = getCookie('id');
		req = json2str(req);
		//print("发送 >>>> " + req);
		ws.send(req);
	}
}
	
//上行消息
var doMessages=function (evt) {

		var rawRes=evt.data;
		var obj=str2json(evt.data);
		var desArray = ["建立链接", "普通消息", "翻译信息", "历史记录", "在线状态", "陌生人信息", "移除联系人"];
		if(obj.status=="success"){
			if(obj.opt==0){//建立链接
				if(hasInit==0){
					hasInit = 1;
					ackContact(obj["contact"]);
				}
				ackMsg(obj["msg"]);
			}else if(obj.opt==1){//普通消息
				//alert('doack');
				ackMsg([obj["msg"]]);
			}else if(obj.opt==2){//翻译信息				
				TranslationText([obj]);
				//ackMsg(obj["msg"]);
			}else if(obj.opt==3){//历史记录
				ackMsg(obj["data"],1);
			}else if(obj.opt==4){//在线状态
				ackLife(obj["data"]);								
			}else if(obj.opt==5){//陌生人信息
				strangerNews(obj["data"]);
			}else if(obj.opt==6){//移除联系人
				CHatdelete(obj["data"]);
			}else if(obj.opt==7){
				alert(Goldfailure);
		    	Goldpage();
		    }else if(obj.opt==8){
		    	alert(UpgradePrompt);
				Upgradepage();
			}else if(obj.opt==100){
				setInteract(obj);
			}
			//print("接收 (" + obj.opt + " : " + (desArray[obj.opt] || "心跳") + ") >>>> " + rawRes);
    }
}
var setInteract=function(data){
	if(data["status"] == 'success'){
		gold=data["user"]["gold"];
		chatState=data["user"]["chat_state"];
		gold=changeTwoDecimal(gold);
		setCookie("gold",gold);
		document.getElementById('user_golds').innerHTML =gold+""+GoldCoin;
		if(data["level"]){
			if(data["level"]!=membership){
				location.replace('index.php?m=Wap&c=Home&a=index');
				return false;
			}
			//print("接收级别 "+ membership);
		}
		
	}
	if(data["interact"]["gift"]!=0){
		document.getElementById("interaction_gift").innerHTML="<div class='interaction_bg'>"+data["interact"]["gift"]+"</div>";
	}else{
		document.getElementById("interaction_gift").innerHTML="";
	}
	if(data["interact"]["visitor"]!=0){
		document.getElementById("interaction_visit").innerHTML="<div class='interaction_bg'>"+data["interact"]["visitor"]+"</div>";
	}else{
		document.getElementById("interaction_visit").innerHTML="";
	}
	if(data["interact"]["passive"]!=0){
		document.getElementById("interaction_passive").innerHTML="<div class='interaction_bg'>"+data["interact"]["passive"]+"</div>";		
	}else{
		document.getElementById("interaction_passive").innerHTML="";
	}
	if(data["interact"]["match"]!=0){
		document.getElementById("interaction_match").innerHTML="<div class='interaction_bg'>"+data["interact"]["match"]+"</div>";		
	}else{
		document.getElementById("interaction_match").innerHTML="";
	}
}
//排序联系人
var ackContact = function (list) {
	var len = list.length;
	for (var j = 0; j < len; j++) {
		for (var m = j + 1; m < len; m++) {
			var c1 = list[j];
			var c2 = list[m];
			if (c1["created"] < c2["created"]) {
				list[j] = c2;
				list[m] = c1;
			}
		}
	}
	for (var j = 0; j < len; j++) {
        for (var m = j + 1; m < len; m++) {
            var c1 = list[j];
            var c2 = list[m];
            if (c1["is_online"] < c2["is_online"]) {
                list[j] = c2;
                list[m] = c1;
            }
        }
    }
    document.getElementById("Recent_Contact").innerHTML = '';
	for (var i = 0; i < len; i++) {
		var c = list[i];
		var cId = c["user_id"];
		if (contactIdList.indexOf(cId) == -1) {
			contactIdList.push(cId);
			ChatNewMap[cId] = c;
		}
		RecentContactList(c,0);
	}
}
//最近联系人window.onload=function(){
var RecentContactList=function(contentfriend,node){
	if (contentfriend.header) {
		var UserIconR=getImgSize(contentfriend.header,80);
	}else{
		if (contentfriend.sex == 'male') {
			var UserIconR="Public/Wap/Images/alila/male.png";
		}else{
			var UserIconR="Public/Wap/Images/alila/female.png";
		}
	}
	var onerroricon="javascript:this.src='Public/Wap/Images/alila/male.png'";
	var actives="";
	if(contentfriend.is_online==1){
		actives="Public/Wap/Images/line.png";
	}else{
		actives="Public/Wap/Images/noline.png";
	}
	var memberships="";
	if(contentfriend.level==1){
		memberships="<img src='Public/Wap/Images/Diamond1.png' class='homepage-user-huiyuan-img'>";
	}else if(contentfriend.level==2){
		memberships="<img src='Public/Wap/Images/crown1.png' class='homepage-user-huiyuan-img'>";
	}
	if(contentfriend.sex=='male'){
		onerroricon="javascript:this.src='Public/Wap/Images/alila/male.png'";	
	}else{
		onerroricon="javascript:this.src='Public/Wap/Images/alila/female.png'";	
	}
	var lastContent=contentfriend.content;
	var lastContents="";
	if(lastContent==null || lastContent==""){
		lastContents="Hi";
	}else{
		//lastContent=JsExpressionContent(lastContent);
		lastContents=cutstr(lastContent,10);
	}
					
	var chat_div_t=document.createElement("div");
	chat_div_t.id="friendchat_"+contentfriend.user_id;
	chat_div_t.className='chat-style';

	//用js创建 右边 黑屏中的每一位 “好友”
	var Recent_Contacts=document.createElement("a");
	Recent_Contacts.href="#";
	Recent_Contacts.className='sidebar-close';
	Recent_Contacts.id=contentfriend.user_id+"-"+contentfriend.username;
	if (contentfriend.count > 0) {
		Recent_Contacts.innerHTML="<div class='honepage-user'><div class='honepage-user-phont-left'><a href='index.php?m=Wap&c=Space&a=profile&friendid="+contentfriend.user_id+"' target='myiframeperfriend'><img src='"+UserIconR+"' onerror="+onerroricon+" class='homepage-content-img'></a><div class='honepage-user-zaixin'><img src='"+actives+"' class='homepage-line-img' id='img_"+contentfriend.user_id+"'></div></div><div class='honepage-user-right' ><div class='honepage-user-right-top'><div class='honepage-user-name1'>"+cutstr(contentfriend.username,6)+"</div><div class='honepage-user-dizhi1'>"+datatime(contentfriend.created)+"</div></div><div class='honepage-user-right-bottom1'>"+lastContents+"</div><div class='Chatnewshu-style' id='"+contentfriend.user_id+"' style='display: block;'>"+contentfriend.count+"</div></div></div>";
	}else{
		Recent_Contacts.innerHTML="<div class='honepage-user'><div class='honepage-user-phont-left'><a href='index.php?m=Wap&c=Space&a=profile&friendid="+contentfriend.user_id+"' target='myiframeperfriend'><img src='"+UserIconR+"' onerror="+onerroricon+" class='homepage-content-img'></a><div class='honepage-user-zaixin'><img src='"+actives+"' class='homepage-line-img' id='img_"+contentfriend.user_id+"'></div></div><div class='honepage-user-right' ><div class='honepage-user-right-top'><div class='honepage-user-name1'>"+cutstr(contentfriend.username,6)+"</div><div class='honepage-user-dizhi1'>"+datatime(contentfriend.created)+"</div></div><div class='honepage-user-right-bottom1'>"+lastContents+"</div><div class='Chatnewshu-style' id='"+contentfriend.user_id+"' style='display: none;'></div></div></div>";
	}
	
	Recent_Contacts.onclick=function(){
		if (membership == 0 && innerMember != 1) {
				document.getElementById("content").style.webkitTransform="";
				alert(UpgradePrompt);
				Upgradepage();	
		}else{
			Personalfreshchat(this.id);
		}
	};

	// “聊天”页面
	var chat_style_right2=document.createElement("div");
	chat_style_right2.id="Openchat_"+contentfriend.user_id;
	chat_style_right2.className='chat-img1';
	chat_style_right2.style.display="block";
	chat_style_right2.innerHTML="<cite><img src='Public/Wap/Images/more.png' class='visiting-img'></cite>";
	chat_style_right2.onclick=function(){
							chatappOpen(this.id);
							};
	var chat_style_right3=document.createElement("div");
	chat_style_right3.id="Closechat_"+contentfriend.user_id
	chat_style_right3.className='chat-img1';
	chat_style_right3.style.display="none";
	chat_style_right3.innerHTML="<cite><img src='Public/Wap/Images/more.png' class='visiting-img'></cite>";
	chat_style_right3.onclick=function(){
							chatappClose(this.id);
							};
							
	var chat_Delete=document.createElement("div");
	chat_Delete.id="Delete_"+contentfriend.user_id;
	chat_Delete.className="chat_Delete";
	chat_Delete.style.display="none";
	chat_Delete.innerHTML=Deletes;
	chat_Delete.onclick=function(){
							RecentDelete(this.id);
							};
	
	chat_div_t.appendChild(chat_style_right2);
	chat_div_t.appendChild(chat_style_right3);
	chat_div_t.appendChild(chat_Delete);
	chat_div_t.appendChild(Recent_Contacts);
		
	if(node==1){
		Recent_Contact.insertBefore(chat_div_t,Recent_Contact.childNodes[0]);
	}else{					
		Recent_Contact.appendChild(chat_div_t);
	}			
}
//删除按钮打开
var chatappOpen=function(Menuid){
	Menuid=Menuid.substr(9);
	document.getElementById("Delete_"+Menuid).style.display="block";
	document.getElementById("Openchat_"+Menuid).style.display="none";
	document.getElementById("Closechat_"+Menuid).style.display="block";
}
//删除按钮关闭
var chatappClose=function(Menuid){
	Menuid=Menuid.substr(10);
	document.getElementById("Delete_"+Menuid).style.display="none";
	document.getElementById("Openchat_"+Menuid).style.display="block";
	document.getElementById("Closechat_"+Menuid).style.display="none";
}
//最近联系人删除发送
var RecentDelete=function(Menuid){
	
	Menuid=Menuid.substr(7);
	var deleteid=Menuid;
	if(deleteid){
		ChatSendOpt(5,deleteid);
	}
}
//消息处理
var ackMsg = function (list, isHistory) {
	for (var i = 0, len = list.length; i < len; i++) {		
		var msg = list[i];
        var fids = decodeFid(msg);
        var contact = ChatNewMap[fids];
		if (contact) {//判断联系人是否存在
			var repeatState = 0;
            for (var k = 0 ; k < contact.list.length ; k++) {
                if ((contact.list[k].id == list[i].id - 1)  && (contact.list[k].content == list[i].content)) {
                    repeatState = 1;
                    break;
                }
            }
            if (repeatState == 1) {
                //alert('重复消息');
                continue;
            }
			if (fids == fid) {//是否是正在聊天的用户								
				ChatSendOpt(0,fids);
				if (msg["sender_id"] == fids) {
					Chatstr=Chatstr-contact["count"];
					if(Chatstr>0){
						chatshu.innerHTML=Chatstr;
					}else{
						Chatstr=0;
						chatshu.style.display="none";
						chatshu.innerHTML="";
					}
					if(friendgender=='male'){
						onerroricon="javascript:this.src='Public/Wap/Images/alila/male.png'";	
					}else{
						onerroricon="javascript:this.src='Public/Wap/Images/alila/female.png'";	
					}
					friendurl=ChatNewMap[fids]["header"];
					if (friendurl != '' && friendurl != null) {
						friendurl = ChatNewMap[fids]["header"];
					    friendurl = getImgSize(friendurl,80);
					}else{
						if(ChatNewMap[fids]['sex']=='male'){
							friendurl="Public/Wap/Images/alila/male.png";	
						}else{
							friendurl="Public/Wap/Images/alila/female.png";	
						}
					}
					
					var chatnewid="chat_"+msg["sender_id"];
					var chat_Contacts1=document.getElementById(chatnewid);
					var msgtime=formatDate(new Date(msg["created"]*1000), "yyyy-MM-dd HH:mm:ss");
					if(isHistory==1){
						newstimes(msgtime,fids,1);
					}else{
						newstimes(msgtime,fids);
					}
					
					var chat_news1=document.createElement("div");
					chat_news1.id="news_"+msg['id'];
					chat_news1.className="chat_news_style";
					if(msg["type"]=='sticker'){
						chat_news1.className="chat_news_style chat_news_msgType";
					}
					//var chat1txt=msg["txt"];
					chat_news1.innerHTML="<div class='chat_news_icon'><img src='"+friendurl+"' onerror="+onerroricon+" class='chat_img_style'></div><div class='chat-im2'><img src='../Public/Wap/Images/im2.png' class='chat-im1-img'></div>";
					var chat_news_text1=document.createElement("div");
					chat_news_text1.id=msg["id"];
					chat_news_text1.onclick=function(){
												divcenteropen(this.id,1);
											};
					chat_news_text1.className="chat_news_text";
					if(msg["content"]){
						chat_news_text1.innerHTML=JsExpressionContent(msg["content"]);
					}
					if(msg["img"]){
						var chat_news_img=document.createElement("div");
						chat_news_img.className="chat_left_img";
						chat_news_img.innerHTML="<img src='"+msg["img"]+"' class='chat-send-img'>";
						chat_news_text1.appendChild(chat_news_img);							
					}
					if(msg["tras"]){
						var trans_content1=document.createElement("div");
						trans_content1.id="TranslationContent_"+msg["id"];
						trans_content1.className="Translation_content";
						trans_content1.style.display="block";
						trans_content1.innerHTML=msg["tras"];
						/*trans_content1.onclick = function() {
							alert(123456);
						}*/
						chat_news_text1.appendChild(trans_content1);
					}else{
						var Translation_content1=document.createElement("div");
							Translation_content1.id="TranslationContent_"+msg["id"];
							Translation_content1.className="Translation_content";
							Translation_content1.style.display="none";
							chat_news_text1.appendChild(Translation_content1);
					}
					if (msg["content"] != '' && msg["content"] != null) {
						var chat_news_fanyi1=document.createElement("div");
						chat_news_fanyi1.className="chat_news_fanyi";
						chat_news_fanyi1.innerHTML="<img src='../Public/Wap/Images/trans.png' class='chat-fanyi-img'><span>Translation</span>";
						chat_news_text1.appendChild(chat_news_fanyi1);
					}
					
					chat_news1.appendChild(chat_news_text1);
					//chat_Contacts1.appendChild(chat_news1);
					if(isHistory==1){
						chat_Contacts1.insertBefore(chat_news1,chat_Contacts1.childNodes[0]);
					}else{
						chat_Contacts1.appendChild(chat_news1);
					}
					chatpage.scrollTop=parseInt(chatpage.scrollHeight);
					msg["opt"]=0;
				}else{
					if (icon == '' || icon == null) {
						if(gender=='female'){
							icon="javascript:this.src='Public/Wap/Images/alila/male.png'";	
						}else{
							icon="javascript:this.src='Public/Wap/Images/alila/female.png'";	
						}
					}
					if(gender=='male'){
						onerroricon="javascript:this.src='Public/Wap/Images/alila/male.png'";	
					}else{
						onerroricon="javascript:this.src='Public/Wap/Images/alila/female.png'";	
					}						
					var chat_send_newid="chat_"+msg["reciver_id"];
					var chat_send_Contacts1=document.getElementById(chat_send_newid);
					var msgtime=formatDate(new Date(msg["created"]*1000), "yyyy-MM-dd HH:mm:ss");
					if(isHistory==1){
						newstimes(msgtime,fids,1);
					}else{
						newstimes(msgtime,fids);
					}
					var chat_send_news1=document.createElement("div");
					chat_send_news1.id="send_"+msg["id"];
					chat_send_news1.className="chat_news_style";
					if(msg["type"]=='sticker'){
						chat_send_news1.className="chat_news_style chat_news_msgType";
					}
					var chatsendtxts=msg["content"];
					var trans="";
					if(msg["tras"]){
						trans=msg["tras"];
					}
					var chatimg="";
					if(msg["img"]){
						chatimg="<img src='"+msg["img"]+"' class='chat-send-img'>";
					}
					chat_send_news1.innerHTML="<div class='chat_left_icon'><img src='"+getImgSize(icon,80)+"' onerror="+onerroricon+" class='chat_img_style'></div><div class='chat-right-im2'><img src='../Public/Wap/Images/im1.png' class='chat-im1-img'></div><div class='chat_right_text'>"+JsExpressionContent(chatsendtxts)+"<div id='TranslationContent_"+msg["id"]+"' class='Translation_content1'>"+trans+"</div><div class='chat_right_img'>"+chatimg+"</div></div>";
					//chat_send_Contacts1.appendChild(chat_send_news1);
					if(isHistory==1){
						chat_send_Contacts1.insertBefore(chat_send_news1,chat_send_Contacts1.childNodes[0]);
					}else{
						chat_send_Contacts1.appendChild(chat_send_news1);
					}
					
					chatpage.scrollTop=parseInt(chatpage.scrollHeight);
					document.getElementById("chat_content").value="";
					msg["opt"]=0;
				}
				contact["count"]=0;
				var newschats=document.getElementById(fids);
				newschats.style.display="none";
				newschats.innerHTML="";
			} else if (msg["sender_id"] == fids) {//添加提醒				
				contact["count"]++;
				var newschats=document.getElementById(fids);
				newschats.style.display="block";
				newschats.innerHTML=contact["count"];
				var div_id="friendchat_"+fids;
				MessageReplace(div_id);
			}
			if (isHistory == 1) {//缓存消息
				contact["list"].unshift(msg);
			} else {
				contact["content"] = msg["content"];
				contact["created"] = msg["created"];
				if (fids == fid) {
					msg["is_read"] = 1;
				}else{
					msg["is_read"] = 0;
				}
				contact["list"].push(msg);//缓存消息
				ChatNewMap[fids] = contact;
		        searchContant();
			}
		} else {
			var stranger = strangerMap[fids];

			if (!stranger) {
				stranger = [];
			}
			stranger.push(msg);
			strangerMap[fids] = stranger;
		}
	}
	Chatstr = 0;
	for(var s in ChatNewMap) {
		Chatstr=Chatstr+ChatNewMap[s]["count"];
	}	
	if(Chatstr>0){
		chatshu.style.display="block";
		chatshu.innerHTML=Chatstr;
	}else{
		Chatstr=0;
		chatshu.style.display="none";
		chatshu.innerHTML="";
	}
	for (var mid in strangerMap) {//查询联系人信息
            //doReq(4, mid);
			ChatSendOpt(4,mid);
    }
}
var MessageReplace = function(id1) {
	var s=document.getElementById("Recent_Contact").getElementsByTagName("div");
	var $div1 = $("#"+s[0].id);
	var $div3 = $("#"+id1);
    var $temobj1 = $("<div></div>");
    $temobj1.insertBefore($div1);
    $div3.insertAfter($temobj1);
    $temobj1.remove();
}
//翻译结果返回处理
var TranslationText=function(list){
	if(list.length!=0){
		for(var i = 0, len = list.length; i < len; i++){		
			if(list[i].status=='success'){

				var msgId="TranslationContent_"+list[i].data.id;
				var transResult=list[i].data.transResult;
				document.getElementById(msgId).style.display="block";
				document.getElementById(msgId).innerHTML=transResult;
				
			}
		}
	}
	
}
//在线状态
var ackLife=function (data){
	var contactUser = ChatNewMap[data["id"]];
    console.log(data["username"] + (data["is_online"] == 1  ? "上线" : "下线"));
    if (contactUser) {
        ChatNewMap[data["id"]]["is_online"] = data["is_online"];
        var list = [];
        for(var item in ChatNewMap){
            list.push(ChatNewMap[item]);
        }
        ackContact(list);
    }
	if (data["id"] != getCookie('id')) {
		var recommendMap = getRecommend();
		if (recommendMap && recommendMap[data["id"]]) {
			//一行一行  排列的 div
			var Onlinelist=document.getElementById("Onlinelist");
			Onlinelist.innerHTML = '';
			//一块一块  排列的 div
			var Onlinebord=document.getElementById("Onlinebord");
			Onlinebord.innerHTML = '';
			recommendMap[data["id"]]['is_online'] = data["is_online"];
            var list = [];
            for(var item in recommendMap){
                list.push(recommendMap[item]);
            }
            for (var i = 0; i < list.length-1 ; i++) {
                for (var j = i + 1; j < list.length ; j++) {
                    if (list[i]['header'] < list[j]['header']) {
                        var temp = list[i];
                        list[i] = list[j];
                        list[j] = temp;
                    }
                }
            }
            for (var i = 0; i < list.length-1 ; i++) {
                for (var j = i + 1; j < list.length ; j++) {
                    if (list[i]['is_online'] < list[j]['is_online']) {
                        var temp = list[i];
                        list[i] = list[j];
                        list[j] = temp;
                    }
                }
            }
            for(var i=0; i<list.length; i++){
				if (list[i].header) {
					var UserIcon=getImgSize(list[i].header,80);
				}else{
					if(gender=='female'){
						oUserIcon='Public/Wap/Images/alila/male.png';	
					}else{
						UserIcon='Public/Wap/Images/alila/female.png';	
					} 
				}
				
				var onerroricon="javascript:this.src='Public/Wap/Images/alila/male.png'";
				
				var actives="";
				if(list[i].is_online==1){
					actives="Public/Wap/Images/line.png";
				}else{
					actives="Public/Wap/Images/noline.png";
				}

				//会员等级
				var memberships="";
				if (list[i].inner_member == 1) {
					
				}else{
					if(list[i].level==1){
						memberships="<img src='Public/Wap/Images/crown1.png' class='homepage-user-huiyuan-img'>";
					}else if(list[i].level==2){
						memberships="<img src='Public/Wap/Images/crown2.png' class='homepage-user-huiyuan-img'>";
					}
				}
				// else if(list[i].level==0){
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
				var mood = list[i].mood;
				if (mood != '' && mood != null) {
					mood = cutstr(mood,20);
				}else{
					mood = '';
				}
				country = list[i].country;
				if (country != '' && country == '') {
					country = cutstr(country,10);
				}else{
					country = '';
				}
				var dateObj = new Date();
            	var year = dateObj.getFullYear();
            	var age = year -  list[i].year;
				OnlineUsersLists.innerHTML="<a href='index.php?m=Wap&c=Space&a=profile&friendid="+list[i].id+"' target='myiframeperfriend'><div class='honepage-user'><div class='honepage-user-phont-left'><img src='"+UserIcon+"' onerror="+onerroricon+" class='homepage-content-img'><div class='honepage-user-zaixin'><img src='"+actives+"' class='homepage-line-img'></div></div><div class='honepage-user-right'><div class='honepage-user-right-top'><div class='honepage-user-huiyuan'>"+memberships+"</div><div class='honepage-user-name'>"+cutstr(list[i].username,10)+","+age+"</div><div class='honepage-user-dizhi'>"+country+"</div></div><div class='honepage-user-right-bottom'>"+mood+"...</div></div></div></a>";
				Onlinelist.appendChild(OnlineUsersLists);
				//一块一块  排列的 div  里面的  每一个人
				var OnlineUsersbords=document.createElement("div");
				OnlineUsersbords.className='honepage-user-phont-left-bord';
				OnlineUsersbords.innerHTML="<a href='index.php?m=Wap&c=Space&a=profile&friendid="+list[i].id+"' target='myiframeperfriend'><img src='"+UserIcon+"' onerror="+onerroricon+" class='homepage-content-img'><div class='honepage-user-name-bord'>"+cutstr(list[i].username,6)+"</div><div class='honepage-user-zaixin1'><img src='"+actives+"' class='homepage-line-img'></div></a>";
				Onlinebord.appendChild(OnlineUsersbords);
			}
		}
	}	
}
//发送者与被发送者的区分
var decodeFid = function (m) {
    return (m["sender_id"] == id) ? m["reciver_id"] : m["sender_id"];
}	
//删除最近联系人	
var CHatdelete=function(dateid){
	//alert(dateid);
	var frienddelete_id="friendchat_"+dateid;
	document.getElementById(frienddelete_id).style.display="none";
	delete ChatNewMap[dateid];
}	
//打开聊天页面
var Personalfreshchat=function(chatcontent){
		if(TPlang1){
			var TPidimg1="img_"+TPlang1;
			var TPidtext1="text_"+TPlang1;
			document.getElementById(TPidimg1).style.display="none";
			document.getElementById(TPidtext1).style.color="#898989";
			//document.getElementById("translation_img").style.display="none";
			TPlang1="";
		}
		if(TPlang2){
			TPlang2="";
		}				
		transTypeid="";
		chatxp=0;
		himeDisplay();
		if(chatfid!=0){
			var divfid="chat_"+chatfid;
			document.getElementById(divfid).style.display="none";
		}
		
		newtimes="";
		var msgcont=chatcontent.split("-");
		fid=msgcont[0];
		chatfid=msgcont[0];
		//alert(fid);
		var fname=msgcont[1];
		
		document.getElementById("content").style.webkitTransform="";
		document.getElementById("open-nav").style.display="block";
		document.getElementById("open-socials").style.display="block";
		document.getElementById("chat_history").style.display="block";
		chatpage.style.display="block";
		document.getElementById("chat_botton").style.display="block";
		document.getElementById("header_top_title").innerHTML=fname;
		document.getElementById("history_div").innerHTML=historys;
		var divfids="chat_"+fid;
		if(document.getElementById(divfids)){
			document.getElementById(divfids).style.display="block";
			var chat_Contacts=document.getElementById(divfids);
		}else{
			//输出当前聊天人的聊天内容
			var chat_Contacts=document.createElement("div");
			chat_Contacts.id="chat_"+fid;
			chat_Contacts.className="chat_content_style";
			chat_Contacts.style.display="block";
			chatpage.appendChild(chat_Contacts);
		}
		if(ChatNewMap[fid]){
			//获取对方的头像
			friendgender=ChatNewMap[fid]["sex"];
			
			Chatstr=Chatstr-ChatNewMap[fid]["count"];
			if(Chatstr>0){
				chatshu.innerHTML=Chatstr;
			}else{
				Chatstr=0;
				chatshu.style.display="none";
				chatshu.innerHTML="";
			}
				
			ChatNewMap[fid]["count"]=0;
			var newschats=document.getElementById(fid);
				newschats.style.display="none";
				newschats.innerHTML="";
			if(friendgender=='male'){
				onerroricon="javascript:this.src='Public/Wap/Images/alila/male.png'";	
			}else{
				onerroricon="javascript:this.src='Public/Wap/Images/alila/female.png'";	
			}
			var chatnews=ChatNewMap[fid]["list"];
			if(chatnews.length!=0){
				for(var v=0;v<chatnews.length; v++){
					if (chatnews[v].is_read != 1) {
						if(chatnews[v].sender_id==id){
							if(gender=='male'){
								onerroricon="javascript:this.src='Public/Wap/Images/alila/male.png'";	
							}else{
								onerroricon="javascript:this.src='Public/Wap/Images/alila/female.png'";	
							}						
							//var msgtime=formatDate(obj.msg["created"], "yyyy-MM-dd HH:mm:ss");
							var chat_send_newid="chat_"+chatnews[v].reciver_id;
							var chat_send_Contacts2=document.getElementById(chat_send_newid);
							//var msgtime=formatDate(new Date(chatnews[v].created), "yyyy-MM-dd HH:mm:ss");
							var msgtime=formatDate(new Date(chatnews[v].created*1000), "yyyy-MM-dd HH:mm:ss");
							newstimes(msgtime,fid);

							var chat_send_news1=document.createElement("div");
							chat_send_news1.id="send_"+chatnews[v].id;
							chat_send_news1.className="chat_news_style";
							if(chatnews[v].type=='sticker'){
								chat_send_news1.className="chat_news_style chat_news_msgType";
							}
							var chatsendtxts=chatnews[v].content;
							var trans="";
							if(chatnews[v].tras){
								trans=chatnews[v].tras;
							}
							var chatimg="";
							if(chatnews[v].img){
								chatimg="<img src='"+chatnews[v].img+"' class='chat-send-img'>";
							}
							if (icon != '' && icon != null) {
								icon = getImgSize(icon,80);
							}else{
								if (gender == 'female') {
									icon  = 'Public/Wap/Images/alila/female.png';
								}else{
									icon = 'Public/Wap/Images/alila/male.png';
								}
							}
							chat_send_news1.innerHTML="<div class='chat_left_icon'><img src='"+icon+"' onerror="+onerroricon+" class='chat_img_style'></div><div class='chat-right-im2'><img src='../Public/Wap/Images/im1.png' class='chat-im1-img'></div><div class='chat_right_text'>"+JsExpressionContent(chatsendtxts)+"<div id='TranslationContent_"+chatnews[v].id+"' class='Translation_content1'>"+trans+"</div><div class='chat_right_img'>"+chatimg+"</div></div>";
							chat_send_Contacts2.appendChild(chat_send_news1);
							
							chatpage.scrollTop=parseInt(chatpage.scrollHeight);
							document.getElementById("chat_content").value="";
						}else{
							var msgtime=formatDate(new Date(chatnews[v].created*1000), "yyyy-MM-dd HH:mm:ss");
							newstimes(msgtime,fid);
							var chat_news=document.createElement("div");
							chat_news.id="news_"+chatnews[v].id;
							chat_news.className="chat_news_style";
							if (friendurl != '' && friendurl != null) {
								friendurl = getImgSize(friendurl,80);
							}else{
								if (gender == 'female') {
									friendurl = 'Public/Wap/Images/alila/male.png';
								}else{
									friendurl = 'Public/Wap/Images/alila/female.png';
								}
							}
							chat_news.innerHTML="<div class='chat_news_icon'><img src='"+friendurl+"' onerror="+onerroricon+" class='chat_img_style'></div><div class='chat-im2'><img src='../Public/Wap/Images/im2.png' class='chat-im1-img'></div>";
							var chat_news_text=document.createElement("div");
							chat_news_text.id=chatnews[v].id;
							chat_news_text.className="chat_news_text";
							if (chatnews[v].content != '' && chatnews[v].content != null) {	
								chat_news_text.onclick=function(){
															divcenteropen(this.id,1);
														};
								chat_news_text.innerHTML=JsExpressionContent(chatnews[v].content);
								if(chatnews[v].tras){
									var Translation_content=document.createElement("div");
									Translation_content.id="TranslationContent_"+chatnews[v].id;
									Translation_content.className="Translation_content";
									Translation_content.style.display="block";
									Translation_content.innerHTML=chatnews[v].tras;
									chat_news_text.appendChild(Translation_content);
								}else{
									var Translation_content=document.createElement("div");
									Translation_content.id="TranslationContent_"+chatnews[v].id;
									Translation_content.className="Translation_content";
									Translation_content.style.display="none";
									chat_news_text.appendChild(Translation_content);
								}
								var chat_news_fanyi=document.createElement("div");
								chat_news_fanyi.className="chat_news_fanyi";
								chat_news_fanyi.innerHTML="<img src='../Public/Wap/Images/trans.png' class='chat-fanyi-img'><span>Translation</span>";
								chat_news_text.appendChild(chat_news_fanyi);
							}else if (chatnews[v].img != '' && chatnews[v].img != null) {
								var chat_news_img=document.createElement("div");
								chat_news_img.className="chat_left_img";
								chat_news_img.innerHTML="<img src='"+chatnews[v].img+"' class='chat-send-img'>";
								chat_news_text.appendChild(chat_news_img);
							}									
						}
						chat_news.appendChild(chat_news_text);
						chat_Contacts.appendChild(chat_news);
						chatpage.scrollTop=parseInt(chatpage.scrollHeight);
						chatnews[v].is_read = 1;
					}
				}
			}
		}
		
		if(Expressiondiv==1){
			var chatheight=document.getElementById("chat_homepage").style.height;
			chatheight=chatheight.replace("px","");
			chatheight=parseInt(chatheight)+147;
			document.getElementById("chat_homepage").style.height=chatheight+"px";
			var sticker_div=document.getElementById("sticker_div");
			sticker_div.style.display="none";
			sticker_div.style.height="";
		
			document.getElementById("chat_img1").style.display="block";
			document.getElementById("chat_img2").style.display="none";
			document.getElementById("sticker_idv_img").style.display="none";
			document.getElementById("chat_d1").style.display="block";
			document.getElementById("chat_d2").style.display="none";
			document.getElementById("sticker_xuanxiang").style.display="none";
			Expressiondiv=0;
		}
		ChatSendOpt(0,fid);
		stickerclose(1);
		
}
var lenFor = function(str){
	return str.replace(/[^\x00-\xff]/g,"*").length; 
}
//发送文本消息
var chatsendtxt=function (){
	var chattxt=document.getElementById("chat_content").value;
	var msgType=document.getElementById("msgType").value;	
	if(chattxt){
	
		var chattxtlength=lenFor(chattxt);
		//alert(chattxtlength);
		if(0<chattxtlength<300){
			var msgtl="";
			var transType="";
			
			if(TPlang2){
				if(transTypeid==1){
					transType=2;
				}else{
					transType=1;
				}
				if (TPlang2 == 'zh') {
					TPlang2 = "zh-cn";
				}else if (TPlang2 == 'en') {
					TPlang2 = "en-us";
				}
				else if (TPlang2 == 'ko') {
					TPlang2 = "ko-kr";
				}
				else if (TPlang2 == 'fr') {
					TPlang2 = "fra";
				}
				msgtl=TPlang2;
				var TrchatLength=chattxtlength*0.01;
				if(innerMember != 1 && membership < 2 && gold < TrchatLength){
					alert(Goldfailure);
					Goldpage();
					return;
				}
				transType = 1;
			}
			ChatSendOpt(1,fid,msgType,chattxt,0,0,0,0,0,msgtl,0,transType);	
		}else{
			document.getElementById("chat_content").value="";
		}
	}else{
		alert(chattxtem);
	}
	//stickerclose(1);
}
var newstimes=function(time,friendfid,h){
	var chatContacts="chat_"+friendfid;
	var time_Contact=document.getElementById(chatContacts);
	if(newtimes){
		var timedate1=new Date(time).getTime();
		var timedate2=new Date(newtimes).getTime();
		var timedate3=timedate1-timedate2;
		var timeMS=120000;
		newtimes=time;
		if(timedate3>timeMS){
			
			var news_time=document.createElement("div");
			news_time.className="classtime";
			news_time.innerHTML=time;
			
			if(h==1){
				time_Contact.insertBefore(news_time,time_Contact.childNodes[0]);
			}else{
				time_Contact.appendChild(news_time);
			}
		}
		
	}else{
		newtimes=time;
		var news_time=document.createElement("div");
		news_time.className="classtime";
		news_time.innerHTML=time;
		if(h==1){
			time_Contact.insertBefore(news_time,time_Contact.childNodes[0]);
		}else{
			time_Contact.appendChild(news_time);
		}			
	}

}
//陌生人处理
var strangerNews=function (s){
	var sid = s["user_id"];
	if (!ChatNewMap[sid]) {
		s["count"] = 0;
		s["list"] = [];
		contactIdList.push(sid);//保存好友id
		ChatNewMap[sid] = s;//保存好友对象
		RecentContactList(s,1);//添加到好友列表里面

		var msgArray = strangerMap[sid];//取出缓存消息
		delete strangerMap[sid];//删除该好友缓存
		ackMsg(msgArray);//封装好友未处理的消息
	} else {
		delete strangerMap[sid];//删除该好友缓存
	}
	
}
//历史记录发送
var loadHistory=function(){
	//fid
	var cList=ChatNewMap[fid]["list"];
	if(cList.length==0){
		ChatSendOpt(3,fid);
	}else{
		var Htime=cList[0]["created"]
		ChatSendOpt(3,fid,0,0,Htime);
	}
}

//表情框关闭
var stickerclose=function(s){
	
	if(Expressiondiv==1){
		var chatheight=document.getElementById("chat_homepage").style.height;
		chatheight=chatheight.replace("px","");
		chatheight=parseInt(chatheight)+147;
		document.getElementById("chat_homepage").style.height=chatheight+"px";
		var sticker_div=document.getElementById("sticker_div");
		sticker_div.style.display="none";
		sticker_div.style.height="";
		if(s==1){
			
			document.getElementById("chat_img1").style.display="block";
			document.getElementById("chat_img2").style.display="none";
			document.getElementById("sticker_idv_img").style.display="none";
			document.getElementById("sticker_Expression_div").style.display="none";
		}else if(s==2){
			document.getElementById("chat_d1").style.display="block";
			document.getElementById("chat_d2").style.display="none";
			document.getElementById("sticker_xuanxiang").style.display="none";	
		}		
		Expressiondiv=0;
	}
}
//切换表情包
var stickerExpressions=function(Ename){
	document.getElementById(SEname).style.display="none";
	document.getElementById(SEn).style.background="#EFEFF0";
	SEname="sticker_"+Ename;
	SEn=Ename;
	document.getElementById(Ename).style.background="#fff";
	document.getElementById(SEname).style.display="block";
}
//生成表情包
var stickeropen=function(s){
	SEn="stickerface1";
	SEname="sticker_stickerface1";
	if(Expressiondiv==0){
		var chatheight=document.getElementById("chat_homepage").style.height;
		chatheight=chatheight.replace("px","");
		document.getElementById("chat_homepage").style.height=chatheight-147+"px";
		var sticker_div=document.getElementById("sticker_div");
		sticker_div.style.display="block";
		sticker_div.style.height=147+"px";
		
		Expressiondiv=1;
			
	}
		if(s==1){
			document.getElementById("chat_img1").style.display="none";
			document.getElementById("chat_img2").style.display="block";
			document.getElementById("chat_d1").style.display="block";
			document.getElementById("chat_d2").style.display="none";
			document.getElementById("sticker_xuanxiang").style.display="none";
			document.getElementById("sticker_Expression_div").style.display="block";
			document.getElementById("sticker_idv_img").style.display="block";
			var sticker_img=document.getElementById("sticker_stickerface1");				
			sticker_img.style.display="block";
			sticker_img.innerHTML="";
			for (var e=0;e<Expressions['Expressionscont'].length;e++) {
				var Expressionsdiv=document.createElement("div");
				Expressionsdiv.className="stickerdiv";
				Expressionsdiv.id=Expressions['Expressionscont'][e];
				Expressionsdiv.onclick=function(){
									Expressionstext(this.id);
									};
				var textsimg="["+Expressions['Expressionscont'][e]+"]";
				Expressionsdiv.innerHTML=InsertExpressionText(textsimg);
				sticker_img.appendChild(Expressionsdiv);
				//alert(Expressions['Expressionscont'][e]);
			}
			var sticker_Expression_img=document.getElementById("sticker_idv_img");
			var sticker_Expression1=document.getElementById("sticker_Expression1");
			//sticker_Expression1.style.display="none";
			sticker_Expression1.innerHTML="";
			var stdivwith=stickerimg.length*45;
			sticker_Expression1.style.width=stdivwith+"px";
			for(var st=0;st<stickerimg.length;st++){
				var sticker_div_bottom=document.createElement("div");
				sticker_div_bottom.id=stickerimg[st].stickername;
				sticker_div_bottom.className="sticker_div_bottom";
				sticker_div_bottom.onclick=function(){
									stickerExpressions(this.id);
									};
				if (stickerimg[st]['detail'].length != 0) {
					sticker_div_bottom.innerHTML="<img src='"+stickerimg[st]['detail'][0]['detail_img']+"' title='Smile' class='sticker_faces'>";
				}else{
					sticker_div_bottom.innerHTML="<img src='./public/Wap/Images/faces/face1.gif' title='Smile' class='sticker_faces'>";
				}
				sticker_Expression1.appendChild(sticker_div_bottom);
				var sticker_Expression_div_width=Math.ceil(stickerimg[st]['detail'].length/2)*70;
				var sticker_Expression_div=document.createElement("div");
				sticker_Expression_div.style.display="none";
				sticker_Expression_div.id="sticker_"+stickerimg[st].stickername;
				sticker_Expression_div.style.width=sticker_Expression_div_width+"px";
				sticker_Expression_div.className="sticker_Expression_div";
				for(var ca=0;ca<stickerimg[st].detail.length;ca++){
					var sticker_Expression_div_img=document.createElement("div");
					sticker_Expression_div_img.className="sticker_div_img";
					sticker_Expression_div_img.id=stickerimg[st]["detail"][ca]['detail_img'];
					sticker_Expression_div_img.onclick=function(){
										ChatSendOpt(1,fid,'sticker','',0,0,0,0,0,0,0,0,this.id);
									};
					sticker_Expression_div_img.innerHTML="<img src='"+stickerimg[st]["detail"][ca]['detail_img']+"' title='Smile' class='sticker_Expression_faces'>";
					sticker_Expression_div.appendChild(sticker_Expression_div_img);
				}
				sticker_Expression_img.appendChild(sticker_Expression_div);
			}
		}else if(s==2){
			document.getElementById("chat_img1").style.display="block";
			document.getElementById("chat_img2").style.display="none";
			document.getElementById("sticker_idv_img").style.display="none";
			document.getElementById("sticker_Expression_div").style.display="none";
			document.getElementById("chat_d1").style.display="none";
			document.getElementById("chat_d2").style.display="block";
			document.getElementById("sticker_xuanxiang").style.display="block";
			document.getElementById("sticker_imgift").innerHTML=gifts;
			document.getElementById("sticker_translation").innerHTML=translation;
			document.getElementById("sticker_impicture").innerHTML=sticker_imphoto;
		}
	
	
	
	
	
}
var progressIndex = 0;
    var resultIndex = 0;
	var uploadHandler = [];
	var extraArgs="token=" +token;
//发送图片
var ChatFile=function(){
	        try {
			var action=uploadurl;
			var file = document.getElementById("filechatimg").files[0];
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
							var transType=0;
							var msgType=0;
							var chattxt="";
							ChatSendOpt(1,fid,msgType,chattxt,0,0,0,0,0,0,0,transType,msg['url']);
						}
                    }, true);
                }
            };
        } catch (e) {
            alert(e)
        }
}
//生成表情文本
var Expressionstext=function(t){
	var text="["+t+"]";
	var textchat=document.getElementById('chat_content');
	textchat.value+=text;
}
var TShow=0;
var textareashow=function(){
	var chatheight=document.getElementById("chat_homepage").style.height;
	chatheight=chatheight.replace("px","");
	if(TShow==0){
		document.getElementById("chat_homepage").style.height=chatheight-187+"px";
		TShow=1;
	}else{			
		chatheight=parseInt(chatheight)+187;
		document.getElementById("chat_homepage").style.height=chatheight+"px";
		TShow=0;			
	}
}
var TP=0;
var divcenteropen=function(Tid,p,newcontent,g){
	gainer = g;
	TP=p;
	if(TP==1){
		Translationid=Tid;
		//document.getElementById("translation_Manual").style.display="block";
		if(TPlang1){
			document.getElementById("fanyi_close").style.color="#898989";
			var TPidimg1="img_"+TPlang1;
			var TPidtext1="text_"+TPlang1;
			document.getElementById(TPidimg1).style.display="block";
			document.getElementById(TPidtext1).style.color="#5DB8F2";
			document.getElementById("translation_img").style.display="none";
		}
	}else if(TP==2){
		Translationid=Tid;
		fnewcontent=newcontent;
		//document.getElementById("translation_Manual").style.display="none";
		if(TPlang3){
			document.getElementById("fanyi_close").style.color="#898989";
			var TPidimg3="img_"+TPlang3;
			var TPidtext3="text_"+TPlang3;
			document.getElementById(TPidimg3).style.display="block";
			document.getElementById(TPidtext3).style.color="#5DB8F2";
			document.getElementById("translation_img").style.display="none";
		}	
	}else if(TP==3){
		Translationid=Tid;
		fnewcontent=newcontent;
		//document.getElementById("translation_Manual").style.display="none";
		if(TPlang4){
			document.getElementById("fanyi_close").style.color="#898989";
			var TPidimg4="img_"+TPlang4;
			var TPidtext4="text_"+TPlang4;
			document.getElementById(TPidimg4).style.display="block";
			document.getElementById(TPidtext4).style.color="#5DB8F2";
			document.getElementById("translation_img").style.display="none";
		}	
	}else if(TP==4){
		Translationid=Tid;
		fnewcontent=newcontent;
	}
	var divId=document.getElementById('chat_fanyi_div');
	divId.style.display="block";
	divId.style.left=(document.body.clientWidth-divId.clientWidth)/2+document.body.scrollLeft+"px";   
	divId.style.top="130px";
	document.getElementById("fanyi_close").innerHTML=fanyi_close;
	document.getElementById("Automatic-translation").innerHTML=Automatic_translation;
	//document.getElementById("Manual-translation").innerHTML=Manual_translation;
}
var Transdivopen=function(lang,type){
	document.getElementById("Trans_bg").style.display="block";
	document.getElementById("Trans_div").style.display="block";	
	//document.getElementById("Trans_wall_content").innerHTML=Transwall_content1+" "+price_google+" "+GoldCoin+","+Transwall_content2+" "+price_human+" "+GoldCoin+"。";
	document.getElementById("Trans_wall_content").innerHTML=Transwall_content1+" "+price_google+" "+GoldCoin+"。";
	document.getElementById("Trans_3").innerHTML=cancel;
	document.getElementById("Trans_4").innerHTML=Determine;
	var Trans_4=document.getElementById("Trans_4");
	Trans_4.onclick=function(){
							divcenterclose(lang,type);
						};
}
var freshNewsAddTrans=function(id) {
	var content = document.getElementById('txt_'+id).value;
	divcenteropen(id,4,content);
}
var Transdivclose=function(){
	document.getElementById("Trans_bg").style.display="none";
	document.getElementById("Trans_div").style.display="none";
}
//选取翻译语言
var divcenterclose=function(lang,type){
	document.getElementById("Trans_bg").style.display="none";
	document.getElementById("Trans_div").style.display="none";
	if(lang){
		if(TP==1){
			if(TPlang1){
				var TPidimg1="img_"+TPlang1;
				var TPidtext1="text_"+TPlang1;
				document.getElementById(TPidimg1).style.display="none";
				document.getElementById(TPidtext1).style.color="#898989";
			}
			TPlang1=lang;
			var TPidimg1="img_"+TPlang1;
			var TPidtext1="text_"+TPlang1;				
			document.getElementById(TPidimg1).style.display="block";
			document.getElementById(TPidtext1).style.color="#5DB8F2";
			if(type==1){
				var transType=2;
			}else{
				var transType=1;
			}
			var t=ChatNewMap[chatfid]["list"];
			for(var a=0;a<t.length;a++){
				if(Translationid==t[a].id){
					var msgid=t[a].id;
					var msgfrom=t[a].sender_id;
					var address=t[a].reciver_id;
					var msgtxt=t[a].content;
					var msgtl=TPlang1;
					ChatSendOpt(2,0,0,0,0,0,msgid,msgfrom,address,msgtl,msgtxt,transType);
				}
			}
		}else if(TP==2){
			if(TPlang3){
				var TPidimg3="img_"+TPlang3;
				var TPidtext3="text_"+TPlang3;
				document.getElementById(TPidimg3).style.display="none";
				document.getElementById(TPidtext3).style.color="#898989";
			}
			TPlang3=lang;
			transTypeid=type;		
			var TPidimg3="img_"+TPlang3;
			var TPidtext3="text_"+TPlang3;				
			document.getElementById(TPidimg3).style.display="block";
			document.getElementById(TPidtext3).style.color="#5DB8F2";
			var to = '';
			if (TPlang3 == 'zh-tw') {
				to = "cht";
			}else if (TPlang3 == 'ja') {
				to = "jp";
			}
			else if (TPlang3 == 'ko') {
				to = "kor";
			}
			else if (TPlang3 == 'fr') {
				to = "fra";
			}
			else if (TPlang3 == 'es') {
				to = "spa";
			}else{
				to = TPlang3
			}

			doAjax("index.php?m=Wap&c=Trans&a=translate", {content:fnewcontent, to:to,'source_id':gainer}, function (PersonalfreshNewstransMsg){
				
				var obj = JSON.parse(PersonalfreshNewstransMsg);
				if(obj.status=="success"){
					var transtxt=obj.data;
					document.getElementById("txt_"+Translationid).innerHTML=JsExpressionContent(transtxt);
					//alert(transtxt);
				}
			});
			
			
		}else if(TP==3){
			if(TPlang4){
				var TPidimg4="img_"+TPlang4;
				var TPidtext4="text_"+TPlang4;
				document.getElementById(TPidimg4).style.display="none";
				document.getElementById(TPidtext4).style.color="#898989";
			}
			TPlang4=lang;
			transTypeid=type;		
			var TPidimg4="img_"+TPlang4;
			var TPidtext4="text_"+TPlang4;				
			document.getElementById(TPidimg4).style.display="block";
			document.getElementById(TPidtext4).style.color="#5DB8F2";
			if (TPlang4 == 'zh-TW') {
				TPlang4 = "cht";
			}else if (TPlang4 == 'ja') {
				TPlang4 = "jp";
			}
			else if (TPlang4 == 'ko') {
				TPlang4 = "kor";
			}
			else if (TPlang4 == 'fr') {
				TPlang4 = "fra";
			}
			else if (TPlang4 == 'es') {
				TPlang4 = "spa";
			}
			doAjax("index.php?m=Wap&c=Trans&a=translate", {content:fnewcontent, to:TPlang4,'source_id':gainer}, function (PersonalfreshNewstransMsg){
				var obj = JSON.parse(PersonalfreshNewstransMsg);
				if(obj.status=="success"){
					var transtxt=obj.data;
					myiframeperfriend.document.getElementById("txt_"+Translationid).innerHTML=JsExpressionContent(transtxt);
					//alert(transtxt);
				}
			});
			
			
		}else if(TP==4){
			transTypeid=type;		
			/*var TPidimg4="img_"+TPlang4;
			var TPidtext4="text_"+TPlang4;				
			document.getElementById(TPidimg4).style.display="block";
			document.getElementById(TPidtext4).style.color="#5DB8F2";*/
			if (lang == 'zh-TW') {
				lang = "cht";
			}else if (lang == 'ja') {
				lang = "jp";
			}
			else if (lang == 'ko') {
				lang = "kor";
			}
			else if (lang == 'fr') {
				lang = "fra";
			}
			else if (lang == 'es') {
				lang = "spa";
			}
			doAjax("index.php?m=Wap&c=Trans&a=translate", {content:fnewcontent, to:lang}, function (PersonalfreshNewstransMsg){
				var obj = JSON.parse(PersonalfreshNewstransMsg);
				if(obj.status=="success"){
					var transtxt=obj.data;
					document.getElementById("txt_"+Translationid).value=transtxt;
				}
			});
		}else{
			if(TPlang2){
				var TPidimg2="img_"+TPlang2;
				var TPidtext2="text_"+TPlang2;
				document.getElementById(TPidimg2).style.display="none";
				document.getElementById(TPidtext2).style.color="#898989";
			}
			TPlang2=lang;
			transTypeid=type;		
			var TPidimg2="img_"+TPlang2;
			var TPidtext2="text_"+TPlang2;				
			document.getElementById(TPidimg2).style.display="block";
			document.getElementById(TPidtext2).style.color="#5DB8F2";
		}
		gainer = '';
		document.getElementById("fanyi_close").style.color="#898989";
		document.getElementById("translation_img").style.display="none";
		stickerclose(2);
	}else{
		TPlang1="";
		TPlang2="";
		TPlang3="";
		transTypeid="";
		var translateImg = document.getElementsByClassName("chat-fanyi2-img");
		var TranslationTag = document.getElementsByClassName("chat-fanyi2-text");
		for (var i = 0 ; i < translateImg.length ; i++) {
			translateImg[i].style.display = 'none';
			TranslationTag[i].style.color = '#898989';
		}
		document.getElementById("translation_img").style.display="block";
		document.getElementById("fanyi_close").style.color="#5DB8F2";
		stickerclose(2);
	}
	document.getElementById('chat_fanyi_div').style.display="none";
}
//
var StickerImp=function(i){
	if(i==1){
		var frid="giftf_"+chatfid;
		SendGiftmenu('virtual',0,'all',frid);
	}else if(i==2){
		divcenteropen();
	}else if(i==3){
		Uploadbutton();
	}
}

var searchContant=function() {
	var key = document.getElementById('search-contant').value;
    document.getElementById('Recent_Contact').innerHTML = '';
    if (key != '') {
    	for(var i = 0;i < contactIdList.length; i ++){
			var f = ChatNewMap[contactIdList[i]];
	        if (f["username"].toLowerCase().indexOf(key) > -1) {
	            RecentContactList(f,0);
	        }
		}
    }else{
    	for(var i = 0;i < contactIdList.length; i ++){
    		var f = ChatNewMap[contactIdList[i]];
			RecentContactList(f,0);
		}
    }
} 