/**
 *系统通知
 * 新收到礼物
 * 新来访用户
 * 相互喜欢
 * 被喜欢
 * 消息轮回
 * 历史聊天记录
 */
//interact:gift(新收到礼物),visitor(新来访用户),match(相互喜欢),passive(被喜欢)} 

var SystemNotification=function(){
	if(id==null || id==undefined || id==''){
		showUserData();
	}
	//alert(id);
	doAjax("phpajax/SystemNotificationmsg.php", {userId:id,token:token}, function (SystemNotificationmsg){
		
		var obj = JSON.parse(SystemNotificationmsg);
		//InteractionMsg=SystemNotificationmsg;
		//alert(SystemNotificationmsg);
		if(obj.status=="1"){
			InteractVisitor=InteractVisitor+obj.interact.visitor;
			if(InteractVisitor!=0){
				document.getElementById("interaction_visit").innerHTML="<div class='interaction_bg'>"+InteractVisitor+"</div>";
			}
			InteractGift=InteractGift+obj.interact.gift;
			if(InteractGift!=0){
				document.getElementById("interaction_gift").innerHTML="<div class='interaction_bg'>"+InteractGift+"</div>";
			}
			InteractMatch=InteractMatch+obj.interact.match;
			if(InteractMatch!=0){
				document.getElementById("interaction_match").innerHTML="<div class='interaction_bg'>"+InteractMatch+"</div>";
			}
			InteractPassive=InteractPassive+obj.interact.passive;
			if(InteractPassive!=0){
				document.getElementById("interaction_passive").innerHTML="<div class='interaction_bg'>"+InteractPassive+"</div>";
			}
		}
	});
}
var MessageHistory=function(){
	if(id==null || id==undefined || id==''){
		showUserData();
	}
	doAjax("phpajax/MessageHistorymsg.php", {userId:id,token:token,historyid: historyId,marks:Marks}, function (MessageHistorymsg){
		var obj = JSON.parse(MessageHistorymsg);
		if(obj.status=="1"){
			Marks=obj.mark;
			if(obj['msg'].length!=0){		
			}
		}	
	});
}
//SystemNotification();