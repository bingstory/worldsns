/**
 * 
 */
function RangeSlider(){
	$("#range_1").ionRangeSlider({
			min: 18,
			max: 100,
			from:18,
			to: 100,
			type: 'double',//设置类型
			step: 1,
			prefix: "",//设置数值前缀
			postfix: "岁",//设置数值后缀
			prettify: true,
			hasGrid: true
		});	
}
var searchContent= function (){
	parent.searchpage();
	
	document.getElementById("search_name").innerHTML=Username;
	document.getElementById("search_age").innerHTML=searchAge;
	document.getElementById("search_botton").innerHTML=searchBotton;
	document.getElementById("searchpage_div").style.display="block";
	document.getElementById("searchpage_list").style.display="none";
	RangeSlider();
}
var searchsend=function(){
	var searchname=document.getElementById("searchname").value;
	var searchage=document.getElementById("range_1").value;
	var strArry = searchage.split(";");
	var minAge=strArry[0];
	var maxAge=strArry[1];
	doAjax("index.php?m=Wap&c=user&a=searchLike", {key:searchname,minAge:minAge,maxAge:maxAge}, function (searchsendmsg){
		//alert(searchsendmsg);
		print("接收 ( >>>> " + searchsendmsg);
		var obj = JSON.parse(searchsendmsg);		
		if(obj.status=="success"){
			document.getElementById("searchpage_div").style.display="none";
			parent.document.getElementById("open-search-back").style.display="none";
			parent.document.getElementById("search-ok").style.display="none";
			parent.document.getElementById("open-search-two").style.display="block";
			document.getElementById("searchpage_list").style.display="block";
			var searchlist=document.getElementById("searchpage_list");
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
				if (obj.data[i].country == null) {
					var country = '';
				}else{
					var country = obj.data[i].country;
				}		
				var onerroricon="javascript:this.src='public/Wap/Images/alila/male.png'";				
				var actives="";
				var memberships="";
				if(parent.gender=='male'){
					onerroricon="javascript:this.src='public/Wap/Images/alila/female.png'";	
				}else{					
					onerroricon="javascript:this.src='public/Wap/Images/alila/male.png'";					
				}
				var OnlineUsersLists=document.createElement("div");
				OnlineUsersLists.className='honepage-user-list';
				var dateObj = new Date();
            	var year = dateObj.getFullYear();
            	var age = year -  obj.data[i].year;
				OnlineUsersLists.innerHTML="<a href='index.php?m=Wap&c=Space&a=profile&friendid="+obj.data[i].id+"' target='myiframeperfriend'><div class='honepage-user'><div class='honepage-user-phont-left'><img src='"+UserIcon+"' onerror="+onerroricon+" class='homepage-content-img'></div><div class='honepage-user-right'><div class='honepage-user-right-top'><div class='honepage-user-name'>"+obj.data[i].username+","+age+"</div><div class='honepage-user-dizhi'>"+country+"</div></div></div></div></a>";
				searchlist.appendChild(OnlineUsersLists);
			}
		}
		
	});
}
searchContent();