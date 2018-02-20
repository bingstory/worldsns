// JavaScript Document
function nav_panel(id1,id2){
    //导航菜单样式
    var Lis = [document.getElementById("nav11"),document.getElementById("nav12"),document.getElementById("nav13")];
    for (var i = Lis.length - 1; i >= 0; i--){
        Lis[i].className="nav_link";    
    };
    document.getElementById(id1).className="nav_link nav_focus";
    //导航菜单关联的内容
    var DIVs = ["panel1","panel2","panel3"];
    for (var i = DIVs.length -1; i >= 0; i--) {
        document.getElementById(DIVs[i]).style.display="none";  
    }
    document.getElementById(id2).style.display="block";
}
