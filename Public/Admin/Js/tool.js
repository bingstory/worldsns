/**
 * 点击风格设置的checkbox,页面动态添加text输入框,可以输入想要添加的风格属性
 * @param json
 * @param containerId string 风格设置的checkbox所在的父级DIV的id
 * @param dialogId 动态添加的输入框所在的父级DIV的id
 * @param subDivClass 动态添加的输入框必须被一个DIV包裹,这个DIV的classname,默认是 dialog_container
 */

var setDivHight=function(){
    winH = document.body.clientHeight;
    var H = winH -175;   
    //alert(H);
    var DivH=document.getElementById('table_container')
    DivH.style.height = H +'px'; 
}
function createTextInput(json) {
    var _this = this;
    this.fn = json.fn;
    this.containerId = json.containerId;
    this.dialogId = json.dialogId;
    this.subDivClass = json.subDivClass || 'dialog_container';
    this.container = document.getElementById(this.containerId);
    this.dialog = document.getElementById(this.dialogId);
    this.checkboxes = this.container.getElementsByTagName('input');
    this.labels = this.container.getElementsByTagName('label');
    for (var i = 0; i < this.checkboxes.length; i++) {
        var str = this.checkboxes[i].id;
        for (var j = 0; j < this.labels.length; j++) {
            if (this.labels[j].getAttribute('for') === str) {
                this.checkboxes[i].label = this.labels[j];
            }
        }
        this.checkboxes[i].onclick = function () {
            if (this.checked == true) {
                _this.createDialog(this);
            } else {
                _this.removeDialog(this);
            }
        }
    }
}
createTextInput.prototype.createDialog = function (obj) {
    var _this = this;
    var bExist = false;
    var inputs = this.dialog.getElementsByTagName('input');
    for (var i = 0; i < inputs.length; i++) {
        if (obj.id == inputs[i].id) {
            bExist = true;
        }
    }
    if (!bExist) {
        var subDiv = document.createElement('div');
        var oLabel = document.createElement('label');
        var oInput = document.createElement('input');
        var oButton = document.createElement('input');
        subDiv.className = this.subDivClass;
        subDiv.id = obj.value;
        oInput.name = obj.id;
        oInput.id = obj.id;
        oInput.type = 'text';
        oLabel.setAttribute('for', oInput.id);
        oLabel.innerHTML = obj.label.innerHTML;
        oButton.value = '提交';
        oButton.type='button';
        oButton.input = oInput;
        oButton.label = oLabel;
        oButton.onclick = function () {
            _this.showChosen(this);
            //_this.fn(obj.value, oInput.value);
        }
        subDiv.appendChild(oLabel);
        subDiv.appendChild(oInput);
        subDiv.appendChild(oButton);
        this.dialog.appendChild(subDiv);
    }
}
createTextInput.prototype.showChosen = function (obj) {
    var chosenDiv = obj.parentNode.getElementsByClassName('chosens')[0];
    if (!chosenDiv) {
        chosenDiv = document.createElement('div');
        chosenDiv.className = 'chosens';
        var chosenLabel = document.createElement('label');
        chosenLabel.innerHTML = '已选' + obj.label.innerHTML;
        chosenDiv.appendChild(chosenLabel);
        obj.parentNode.appendChild(chosenDiv);
    }
    //用空格分隔
    var arr = obj.input.value.split(/[\s,，]+/g);
    for (i = 0; i < arr.length; i++) {
        if (arr[i] != '') {
            var chosenSpan = document.createElement('span');
            chosenSpan.innerHTML = arr[i];
            chosenSpan.style.display = 'inline-block';
            chosenSpan.style.padding = '1px 5px';
            chosenSpan.style.margin = '0 3px';
            chosenSpan.style.background = '#f00';
            chosenSpan.style.color = '#fff';
            chosenSpan.style.cursor = 'pointer';
            chosenSpan.style.borderRadius = '3px';
            chosenSpan.style.fontSize = '14px';
            chosenDiv.appendChild(chosenSpan);
            chosenSpan.onclick = function () {
                this.parentNode.removeChild(this);
            }
        }
    }
    obj.input.value = '';
}
createTextInput.prototype.removeDialog = function (obj) {
    var inputs = this.dialog.getElementsByTagName('input');
    for (var i = 0; i < inputs.length; i++) {
        if (inputs[i].id == obj.id) {
            console.log(inputs[i].parent);
            this.dialog.removeChild(inputs[i].parentNode);
        }
    }
}
/**
 * 修改商品属性时,默认显示商品已经具备的属性的方法
 *
 * @param json
 * json.data 商品已具备的属性数据
 * json.inputContainerId 代表所有属性的checkbox的父元素ID
 */
function showExistAttr(json){
    var options={
        data:json.data,
        inputContainerId:json.inputContainerId
    }
    var oContainer=document.getElementById(options.inputContainerId);
    var aInputs=oContainer.getElementsByTagName('input');
    var i=0;
    for(var k=0;k<options.data.length;k++) {
        var sId = options.data[k].attrname_id;

        for (i = 0; i < aInputs.length; i++) {
            if (aInputs[i].value == sId) {
                aInputs[i].click();
            }
        }
    }
    for(var k=0;k<options.data.length;k++) {
        var aDialog=document.getElementsByClassName('dialog_container');
        for(i=0;i<aDialog.length;i++){
            for( k=0 ;k<options.data.length;k++)
                if(aDialog[i].id==options.data[k].attrname_id){
                    var oInput=aDialog[i].getElementsByTagName('input')[0];
                    var oButton=aDialog[i].getElementsByTagName('input')[1];
                    for(var v=0;v<options.data[k].attrvalue.length;v++){
                        oInput.value+=options.data[k].attrvalue[v].attrvalue+',';
                    }
                    oButton.click();
                };
        }
    }
}
/**
 *显示所有checkbox,当checkbox被选中时,在一个div中显示所有选中的checkbox项的label内容
 * @param json
 * @constructor selectShowId string     The Div to show the brand which are selected
 * @constructor hiddenId string         The input which type is hidden to store the checked values
 * @constructor info                    The data
 * @constructor divId                   The div to contain all the checkboxes whether checcked or not
 * @constructor checkboxname            The name attribute of all the checkboxes
 * @constructor preId                   The prefix of the checkboxes's id
 */
function CreateCheckboxElements(json) {
    var _this = this;
    this.selectShowId = json.selectShowId;
    this.hiddenId = json.hiddenId;
    this.info = json.info;
    this.divId = json.divId;
    this.checkboxname = json.checkboxname;
    this.preId = json.preId;
    this.checked=json.checked||'';
    this.attr=json.attr||'name';
    if(json.checked) this.checked=json.checked.split(',');
    this.hiddenInput = document.getElementById(this.hiddenId);
    this.sHiddenValue = this.hiddenInput.value;
    this.aHiddenValue = this.sHiddenValue.split(',');
    this.arr = [];
    var i = 0;
    for (i = 1; i < this.aHiddenValue.length; i++) {
        var val = this.aHiddenValue[i].split(':');
        this.arr.push(val);
    }
    this.selectShowDiv = document.getElementById(this.selectShowId);
    this.showDiv = document.getElementById(this.selectShowId);
    this.oDiv = document.getElementById(this.divId);
    this.aInput = this.oDiv.getElementsByTagName('input');
    this.oDiv.innerHTML = '';

    for (i = 0; i < this.arr.length; i++) {
        var checkedItem = this.arr[i];
        var checkedInput = document.createElement('input');
        var checkedLabel = document.createElement('label');
        var checkedDiv = document.createElement('div');
        checkedDiv.style.float = 'left';
        checkedInput.id = checkedItem[0];
        checkedInput.value = checkedItem[0];
        checkedInput.type = 'checkbox';
        checkedInput.checked = true;
        checkedInput.name = this.checkboxname;
        checkedLabel.setAttribute('for', checkedInput.id);
        checkedLabel.style.background='#F18500';
        checkedLabel.innerHTML = checkedItem[1];
        checkedInput.label = checkedLabel;
        checkedDiv.appendChild(checkedInput);
        checkedDiv.appendChild(checkedLabel);
        this.oDiv.appendChild(checkedDiv);
    }
    for (i in this.info) {
        var exsit = false;
        var str = this.info[i];
        for (var j = 0; j < this.arr.length; j++) {
            val = this.arr[j][0];
            if (str['id'] == val) {
                exsit = true;
            }
        }
        if (!exsit) {
            var oInput = document.createElement('input');
            oInput.type = 'checkbox';
            oInput.value = str['id'];
            if(this.checked!='') {
                for (var k = 0; k < this.checked.length; k++) {
                    if (this.checked[k] == oInput.value) {
                        oInput.checked = true;
                    }
                }
            }
            oInput.id = this.preId + str['id'];
            oInput.name = this.checkboxname;
            var oLabel = document.createElement('label');
            var oDiv = document.createElement('div');
            oDiv.style.float = 'left';
            oLabel.setAttribute('for', oInput.id);
            oLabel.innerHTML = str[this.attr];
            oInput.label = oLabel;
            oDiv.appendChild(oInput);
            oDiv.appendChild(oLabel);
            this.oDiv.appendChild(oDiv);
        }
        this.allInputs = this.oDiv.getElementsByTagName('input');
        for (i = 0; i < this.allInputs.length; i++) {
            this.allInputs[i].onclick = function () {
                _this.addToDiv();
            }
        }
    }
}
CreateCheckboxElements.prototype.addToDiv = function () {
    var aInputs = this.oDiv.getElementsByTagName('input');
    this.hiddenInput.value = '';
    this.selectShowDiv.innerHTML = '';
    for (var i = 0, len = aInputs.length; i < len; i++) {
        if (aInputs[i].checked == true) {
            aInputs[i].label.style.background='#F18500';
            this.hiddenInput.value += ',' + aInputs[i].value + ':' + aInputs[i].label.innerHTML;
            this.selectShowDiv.innerHTML += '<span style="margin-right:10px;padding:0 3px;border-radius:3px;">' + aInputs[i].label.innerHTML + '</span>'
        }else{
            aInputs[i].label.style.background='#ccc';
        }
    }
}
/**
 * 预览图片功能
 *@param file input[type=file]
 *@param containerId 外部DIV的id
 *@param imgId 图片标签的ID
 */
function previewImage(file, containerId, imgId, marginLeft, src) {
    var div = document.getElementById(containerId);
    var MAXWIDTH = div.offsetWidth;
    var MAXHEIGHT = div.offsetHeight;
    var img = null;
    if (file.files && file.files[0]) {
        div.innerHTML = '<img id=' + imgId + '>';
        img = document.getElementById(imgId);
        img.onload = function () {
            var rect = clacImgZoomParam(MAXWIDTH, MAXHEIGHT, img.offsetWidth, img.offsetHeight);
            img.width = rect.width;
            img.height = rect.height;
            if (marginLeft!=null) img.style.marginLeft = marginLeft + 'px';
            else img.style.marginLeft = rect.left + 'px';
            img.style.marginTop = rect.top + 'px';
        };
        var reader = new FileReader();
        reader.onload = function (evt) {
            img.src = evt.target.result;
        };
        reader.readAsDataURL(file.files[0]);
    }
    else //兼容IE
    {
        var sFilter = 'filter:progid:DXImageTransform.Microsoft.AlphaImageLoader(sizingMethod=scale,src="';
        file.select();
        var src = document.selection.createRange().text;
        div.innerHTML = '<img id=' + imgId + '>';
        img = document.getElementById(imgId);
        img.filters.item('DXImageTransform.Microsoft.AlphaImageLoader').src = src;
        var rect = clacImgZoomParam(MAXWIDTH, MAXHEIGHT, img.offsetWidth, img.offsetHeight);
        status = ('rect:' + rect.top + ',' + rect.left + ',' + rect.width + ',' + rect.height);
        div.innerHTML = "<div id=divhead style='width:" + rect.width + "px;height:" + rect.height + "px;margin-top:" + rect.top + "px;" + sFilter + src + "\"'></div>";
    }
}
function clacImgZoomParam(maxWidth, maxHeight, width, height) {
    var param = {top: 0, left: 0, width: width, height: height};
    if (width > maxWidth || height > maxHeight) {
        rateWidth = width / maxWidth;
        rateHeight = height / maxHeight;
        if (rateWidth > rateHeight) {
            param.width = maxWidth;
            param.height = Math.round(height / rateWidth);
        } else {
            param.width = Math.round(width / rateHeight);
            param.height = maxHeight;
        }
    }

    param.left = Math.round((maxWidth - param.width) / 2);
    param.top = Math.round((maxHeight - param.height) / 2);
    return param;
}
//example:
//        <input type="file" id="img_input" onchange="previewImage(this,'preview','imghead')"/>
//        <div id="preview">
//            <img id='imghead' />
//        </div>
/**
 * 开关按钮的效果,代替radio
 *@param topId 底层div的ID 必须
 *@param botId 小按钮div的ID 必须
 *@param inputId 要改变值的input的ID 必须
 *@param disableText 按钮上禁用状态显示的文字 默认为'已禁用'
 *@param enableText 按钮上启用状态显示的文字 默认为'已启用'
 *@param disableValue input元素设置为禁用时对应的value值 默认为disable
 *@param enableValue input元素设置为启用时对应的value值  默认为enable
 *@param defaultValue input元素的默认值  只能是disableValue和enableValue中的一个 默认disableValue
 *@param disableColor 禁用状态的背景色 默认灰色
 *@param enableColor 启用状态的背景色 默认红色
 */
function toggleRadio(json) {
    var _this = this;
    this.botId = json.botId || 'toggle_bot';
    this.topId = json.topId || 'toggle_top';
    this.inputId = json.inputId;
    this.disableValue = json.disableValue || 'disable';
    this.enableValue = json.enableValue || 'enable';
    this.defaultValue = json.defaultValue || this.disableValue;
    this.disableColor = json.disableColor || '#ccc';
    this.enableColor = json.enableColor || '#f00';
    this.disableText = json.disableText || '已禁用';
    this.enableText = json.enableText || '已启用';
    this.botDiv = document.getElementById(this.botId);
    this.topDiv = document.getElementById(this.topId);
    this.input = document.getElementById(this.inputId);
    this.input.value = this.defaultValue;

    this.botDiv.style.display = 'inline-block';
    this.botDiv.style.width = '120px';
    this.botDiv.style.height = '32px';
    this.botDiv.style.borderRadius = '16px';
    this.botDiv.style.border = '1px solid #ccc';
    this.botDiv.style.position = 'relative';
    this.botDiv.style.overflow = 'hidden';
    this.botDiv.style.float = 'left';
    this.botDiv.style.boxShadow = '0 1px 0 rgba(255,255,255,1),0 1px 7px rgba(0,0,0,0.8) inset';
    this.topDiv.style.width = '50px';
    this.topDiv.style.height = '32px';
    this.topDiv.style.lineHeight = '32px';
    this.topDiv.style.fontSize = '12px';
    this.topDiv.style.color = '#666';
    this.topDiv.style.textAlign = 'center';
    this.topDiv.style.textShadow = '0 1px 0 #fff';
    this.topDiv.style.position = 'absolute';
    this.topDiv.style.top = '0';
    this.topDiv.style.left = '0';
    this.topDiv.style.borderRadius = '16px';
    this.topDiv.style.border = '1px solid #ccc';
    this.topDiv.style.cursor = 'pointer';
    this.topDiv.style.float = 'left';
    this.topDiv.style.backgroundColor = '#fff';
    if (this.input.value === this.disableValue) {
        this.botDiv.style.backgroundColor = this.disableColor;
        this.topDiv.style.left = '0';
        this.topDiv.style.right = 'auto';
        this.topDiv.innerHTML = this.disableText;
    } else if (this.input.value === this.enableValue) {
        this.botDiv.style.backgroundColor = this.enableColor;
        this.topDiv.style.left = 'auto';
        this.topDiv.style.right = '0';
        this.topDiv.innerHTML = this.enableText;
    } else {
        throw new Error("toggleRadio():value is invalid!");
    }
    this.topDiv.onclick = function () {

        _this.changeStatu();
    };
}
toggleRadio.prototype.changeStatu = function () {
    if (this.input.value === this.disableValue) {
        this.input.value = this.enableValue;
        this.topDiv.style.left = 'auto';
        this.topDiv.style.right = '0';
        this.botDiv.style.backgroundColor = this.enableColor;
        this.topDiv.innerHTML = this.enableText;
    } else if (this.input.value === this.enableValue) {
        this.input.value = this.disableValue;
        this.topDiv.style.left = '0';
        this.topDiv.style.right = 'auto';
        this.botDiv.style.backgroundColor = this.disableColor;
        this.topDiv.innerHTML = this.disableText;
    }
};
//递归分类
/**
 *cateInfo Json data
 * parentDivId string 容器的ID
 * level number 显示的层级数
 * checkboxname string checkbox的name属性
 * cell number 每行显示几个一个分类
 **/
function showCategoryList(json) {
    var options = {
        'cateInfo': json.cateInfo,
        'parentDivId': json.parentDivId,
        'level': json.level || 2,
        'checkboxname': json.checkboxname || 'checkbox[]',
        'cell': json.cell || 5
    };
    var oContainer = document.getElementById(options.parentDivId);
    var i = 0;
    var len = options.cateInfo.length;
    var sParentId = null;
    var oCate = null;
    for (; i < len; i++) {
        if (options.cateInfo[i]['deep'] == 1) {
            sParentId = options.cateInfo[i]['id'];
            oCate = document.createElement('div');
            oCate.className = 'cate';
            oCate.id = sParentId;
            if (options.cell) {
                if (i != 0 && i % options.cell === 0) {
                    oCate.style.clear = 'left';
                }
            }
            oContainer.appendChild(oCate);
        } else {
            sParentId = options.parentDivId;
            oCate = document.getElementById(sParentId);
        }
        var oDiv = document.createElement('div');
        oDiv.className = 'cate' + options.cateInfo[i]['deep'];
        if (options.cateInfo[i]['deep'] > options.level) return false;
        var oLabel = document.createElement('label');
        var oInput = document.createElement('input');
        oInput.type = 'checkbox';
        oInput.value = options.cateInfo[i]['id'];
        oInput.id = 'cate_' + oCate.id + '_' + options.cateInfo[i]['deep'] + '_' + oInput.value;
        oInput.name = options.checkboxname;
        oLabel.innerHTML = options.cateInfo[i]['name'];
        oLabel.setAttribute('for', oInput.id);
        oDiv.appendChild(oInput);
        oDiv.appendChild(oLabel);
        //oDiv.appendChild(oBtnDis);
        //oDiv.appendChild(oBtnDel);
        oCate.appendChild(oDiv);
        if (options.cateInfo[i]['sub'].length !== 0) {
            showCategoryList({
                'cateInfo': options.cateInfo[i]['sub'],
                'parentDivId': sParentId,
                'level': options.level,
                'checkboxname': options.checkboxname
            });
        }
    }
}
////向顶部搜索div内添加搜索框 
//格式
//<div class="search_container">
//	<input type="text" name="" id="bbb" value="" placeholder="请输入搜索条件" />
//</div>
function createTopSearch(classname) {
    var oDiv = document.getElementById('search_div_group');
    var aDiv = oDiv.getElementsByClassName(classname);
    var len = aDiv.length;
    var oParent = document.getElementById('search_div');
    var pLen = 0;
    var oSo = document.getElementById('top_search_button');
    while (pLen < len) {
        aDiv[0].style.display = 'block';
        oParent.insertBefore(aDiv[0], oSo);
        pLen++;
    }
}
//获取选中的多选框中的值
function getCheckBoxesValue(name) {
    var aInputs = document.getElementsByName(name);
    var i = 0;
    var arr = [];
    for (i = 0; i < aInputs.length; i++) {
        if (aInputs[i].checked == true) {
            arr.push(aInputs[i].value);
        }
    }
    return arr;
}
/**弹出窗口
 *@param contentId string 传入的DIV的ID
 *@param fn function 点击提交要执行的操作
 *@param json json fn的参数
 *@param bSub number 1表示不显示提交按钮 不传默认为0,显示按钮
 *@param bClose number 1表示不显示关闭按钮 不传默认为0,显示按钮
 **/
function createMask(contentId, fn, json, bSub, bClose) {
    var options = {
        'contentId': contentId,
        'fn': fn,
        'json': json,
        'bSub': bSub || 0,
        'bClose': bClose || 0
    }
    var mask = document.getElementById('mask');
    var container = document.getElementById('mini_container');
    var closeButton = document.getElementById('mask_close');
    var topClose = document.getElementById('mask_top_close');
    var okBtn = document.getElementById('mask_add');
    var oDiv = document.getElementById(options.contentId);
    var buttons = document.getElementById('mask_buttons');
    //设置遮罩层高度和宽度
    var h = getBodyHeight();
    var w = getBodyWidth();
    mask.style.width = w + 'px';
    mask.style.minHeight = h + 'px';
    mask.style.height = 'auto';
    mask.style.display = 'block';
    mask.style.overflow = 'hidden';
    if (oDiv) {
        oDiv.style.display = 'block';
        oDiv.style.maxHeight = '600px';
        oDiv.style.height = 'auto';
        oDiv.style.overflowY = 'scroll';
        container.insertBefore(oDiv, buttons);
    }
    topClose.onclick = function () {
        mask.style.display = 'none';
        if (oDiv) {
            oDiv.style.display = 'none';
            document.body.appendChild(oDiv);
        }
    }
    if (!options.bClose) {
        closeButton.onclick = function () {
            mask.style.display = 'none';
            if (oDiv) {
                oDiv.style.display = 'none';
                document.body.appendChild(oDiv);
            }
        }
    } else {
        closeButton.style.display = 'none';
    }
    if (!options.bSub) {
        okBtn.onclick = function () {
            options.fn(options.json);
        }
    } else {
        okBtn.style.display = 'none';
    }

    if (options.bClose && options.bSub) {
        buttons.style.display = 'none';
    }
}

//在IE6下,不支持getElementsByClassName()方法,此方法可以进行兼容处理

function getByClassName(className) {
    if (document.getElementsByClassName) {
        return document.getElementsByClassName(className);
    }
    var nodes = document.getElementsByTagName('*');
    var arr = [];
    for (var i = 0; i < nodes.length; i++) {
        if (hasClass(nodes[i], className)) {
            arr.push(nodes[i]);
        }
    }
    return arr;
}
function getByClass(oParent, sClass) {
    if (document.getElementsByClassName) {
        return document.getElementsByClassName(sClass);
    }
    var re = new RegExp('\\b' + sClass + '\\b');
    var arr = [];
    var childs = oParent.getElementsByTagName('*');
    var i = 0;
    for (i = 0; i < childs.length; i++) {
        if (re.test(childs[i].className)) {
            arr.push(childs[i]);
        }
    }
    return arr;
}
//获取第一个子元素的兼容方法 OK

function getFirstChild(obj) {
    if (obj.firstElementChild) {
        return obj.firstElementChild;
    } else {
        return obj.firstChild;
    }
}
//获取最后一个子元素的兼容方法 OK

function getLastChild(obj) {
    if (obj.lastElementChild) {
        return obj.lastElementChild;
    } else {
        return obj.lastChild;
    }
}
//获取preiousSibling的兼容方法 OK

function getPrevElement(obj) {
    if (obj.previousElementSibling) {
        return obj.previousElementSibling;
    } else {
        return obj.previousSibling;
    }
}
//获取nextSibling的兼容方法 OK

function getNextElement(obj) {
    if (obj.nextElementSibling) {
        return obj.nextElementSibling;
    } else {
        return obj.nextSibling;
    }
}
//获取子元素的方法 OK
function getChildren(obj) {
    var nodes = obj.childNodes;
    var arr = [];
    for (var i = 0; i < nodes.length; i++) {
        if (nodes[i].nodeType == 1) {
            arr.push(nodes[i]);
        }
    }
    return arr;

}
// ajax的get方法

function Ajax(url, fnSuccess, fnFailed) {
    var xhr = null;
    if (window.XMLHttpRequest) {
        xhr = new XMLHttpRequest();
    } else {
        xhr = new ActiveXObject('Microsoft.XMLHTTP');
    }
    xhr.open('GET', url, true);
    xhr.send();
    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4) {
            if (xhr.status == 200) {
                fnSuccess(xhr.responseText);
            } else {
                if (fnFailed) {
                    fnFailed();
                }
            }
        }
    }
}
//获取视窗高度和宽度

function getBodyWidth() {
    if (window.innerWidth) {
        return window.innerWidth;
    } else if (document.body && document.body.clientWidth) {
        return document.body.clientWidth;
    } else {
        return document.documentElement.clientWidth;
    }
}

function getBodyHeight() {
    if (window.innerHeight) {
        return window.innerHeight;
    } else if (document.body && document.body.clientHeight) {
        return document.body.clientHeight;
    } else {
        return document.documentElement.clientHeight;
    }
}
//表格隔行变色,hover变色

function tableColor(id) {
    var _this = this;
    this.otb = document.getElementById(id);
    this.atr = this.otb.tBodies[0].rows;
    for (var i = 0; i < this.atr.length; i++) {
        i % 2 == 0 ? '' : this.atr[i].style.background = '#F5F6FA';
        this.atr[i].onmouseover = function () {
            _this.changeColor(this);
        }
        this.atr[i].onmouseout = function () {
            _this.backColor(this);
        }
    }
}
tableColor.prototype.changeColor = function (obj) {
    obj.oldColor = obj.style.backgroundColor;
    obj.style.backgroundColor = '#ddd';
}
tableColor.prototype.backColor = function (obj) {
    obj.style.backgroundColor = obj.oldColor;
}
//全选 全不选

function selectAll(btnId, parentId) {
    var _this = this;
    this.oBtn = document.getElementById(btnId);
    this.obj = document.getElementById(parentId);
    this.aInputs = this.obj.getElementsByTagName('input');
    this.arr = [];
    var i = 0;
    for (i = 0; i < this.aInputs.length; i++) {
        if (this.aInputs[i].type == 'checkbox') {
            this.arr.push(this.aInputs[i]);
        }
    }
    this.oBtn.onclick = function () {
        _this.toggleSelect(this);
    };
}
selectAll.prototype.toggleSelect = function (obj) {
    if (obj.checked == true) {
        for (i = 0; i < this.arr.length; i++) {
            this.arr[i].checked = true;
        }
    } else {
        for (i = 0; i < this.arr.length; i++) {
            this.arr[i].checked = false;
        }
    }
};

/**
 *
 * @param obj
 * @param cls
 * @returns {Array|{index: number, input: string}}
 */
function hasClass(obj, cls) {
    return obj.className.match(new RegExp('(\\s|^)' + cls + '(\\s|$)'));
}
/*添加class
 * @param ele object 要添加样式的元素
 * @param cls string 要添加的classname
 */
function addClass(ele, cls) {
    if (!hasClass(ele, cls)) ele.className += " " + cls;
}
/*移除样式
 * @param ele 要移除样式的元素
 * @param cls 要移除的classname
 **/
function removeClass(ele, cls) {
    if (hasClass(ele, cls)) {
        var reg = new RegExp('(\\s|^)' + cls + '(\\s|$)');
        ele.className = ele.className.replace(reg, ' ');
    }
}
function getStyle(obj, attr) {
    if (obj.currentStyle) {
        return obj.currentStyle[attr];
    } else {
        return getComputedStyle(obj, false)[attr];
    }
}
/*menuCut更新版
 * @param containerId string 最外围容器
 * @param contentclassname 每一个板块的DIV的classname
 * @param classname1 一级列表的active样式名
 * @param classname2 二级列表的active样式名
 */
function menuCut(json) {
    var _this = this;
    this.containerId = json.containerId;
    this.contentclassname = json.contentclassname;
    this.classname1 = json.classname1 || 'btn_active';
    this.classname2 = json.classname2 || 'list_active';
    this.container = document.getElementById(this.containerId);
    this.aDiv = getByClass(this.container,this.contentclassname);
    this.arr = [];
    var i = 0;
    var j = 0;
    for (i = 0; i < this.aDiv.length; i++) {
        this.aDiv[i].index = i;
        this.aDiv[i].oUl = this.aDiv[i].getElementsByTagName('ul')[0];
        this.aDiv[i].aA = this.aDiv[i].getElementsByTagName('a')[0];
        this.aDiv[i].oUl.aa = this.aDiv[i].oUl.getElementsByTagName('a');
    }
    for (i = 0; i < this.aDiv.length; i++) {
        for (j = 0; j < this.aDiv[i].oUl.aa.length; j++)
            this.arr.push(this.aDiv[i].oUl.aa[j]);
    }
    for (i = 0; i < this.aDiv.length; i++) {
        this.aDiv[i].index = i;
        this.aDiv[i].aA.index = i;
        this.aDiv[i].aA.onclick = function () {
            _this.changeBgHandler(this);
        }
    }
    for (i = 0; i < this.arr.length; i++) {
        this.arr[i].onclick = function () {
            _this.changeBgA(this);
        }
    }
}
menuCut.prototype.changeBgHandler = function (obj) {
    if (this.aDiv[obj.index].oUl.style.display === 'block') {
        this.aDiv[obj.index].oUl.style.display = 'none';
    } else {
        for (j = 0; j < this.aDiv.length; j++) {
            this.aDiv[j].oUl.style.display = 'none';
            removeClass(this.aDiv[j].aA, this.classname1);
        }
        this.aDiv[obj.index].oUl.style.display = 'block';
        addClass(obj, this.classname1);
    }
}
menuCut.prototype.changeBgA = function (obj) {
    for (var j = 0; j < this.arr.length; j++) {
        removeClass(this.arr[j], this.classname2);
    }
    addClass(obj, this.classname2)
}
/**
 * 模态框中的checkbox创建方法
 * @param json
 */
function showCheckBox(json) {
    var options = {
        'data': json.data,
        'divid': json.divid,
        'chbIdPre': json.chbIdPre,
        'chbname': json.chbname
    }
    var oDiv = document.getElementById(options.divid);
    for (var i in options.data) {

        var oInput = document.createElement('input');
        oInput.type = 'checkbox';
        oInput.id = options.chbIdPre + options.data[i]['id'];
        oInput.name = options.chbname;
        oInput.value = options.data[i]['id'];
        var oLabel = document.createElement('label');
        oLabel.setAttribute('for', oInput.id);
        oLabel.innerHTML = options.data[i]['name'];//+"("+options.data[i]['controller']+","+options.data[i]['action']+")";
        oDiv.appendChild(oInput);
        oDiv.appendChild(oLabel);
    }
}
/**
 * 在模态框中显示属性组合和商品组合
 * @param json
 */
function showMaskInputAttr(json) {
    var options = {
        'data': json.data,
        'containerId': json.containerId,
        'text': json.text,
        'value': json.value
    }
    var oDiv = document.getElementById(options.containerId);
    oDiv.innerHTML = '';
    for (var i = 0; i < options.data.length; i++) {
        var data = options.data[i];
        var oSpan = document.createElement('span');
        if (options.text) {
            oSpan.innerHTML = data[options.text].replace(/[^\u4e00-\u9fa5]/g, ' ');
            oSpan.style.display = 'block';
            oSpan.style.background = '#EB510F';
            oSpan.style.padding = '2px 3px';
            oSpan.style.margin = '6px 3px';
            oSpan.style.borderRadius = '3px';
            oSpan.style.color = '#fff';
            oSpan.style.cursor = 'pointer';
            oSpan.style.fontSize = '18px';
            oSpan.className = 'attr_title';
            oDiv.appendChild(oSpan);
        }
        if (Object.prototype.toString.call(options.value) === '[object String]') {
            var hidDiv = document.createElement('div');
            hidDiv.style.overflow = 'hidden';
            hidDiv.style.display = 'none';
            for (var j = 0; j < data[options.value].length; j++) {
                var oDetailSpan = document.createElement('span');
                oDetailSpan.innerHTML = data[options.value][j][options.value];
                oDetailSpan.style.display = 'block';
                oDetailSpan.style.width = '61.8%';
                oDetailSpan.style.float = 'right';
                oDetailSpan.style.background = '#F19511';
                oDetailSpan.style.padding = '2px 3px';
                oDetailSpan.style.margin = '6px 3px';
                oDetailSpan.style.borderRadius = '3px';
                oDetailSpan.style.color = '#fff';
                hidDiv.appendChild(oDetailSpan);
            }
            oDiv.appendChild(hidDiv);
        } else if (Object.prototype.toString.call(options.value) === '[object Object]') {
            var hidDiv = document.createElement('div');
            hidDiv.style.overflow = 'hidden';
            hidDiv.style.display = 'none';
            for (var j in options.value) {
                var oDetailSpan = document.createElement('span');
                oDetailSpan.innerHTML = j + ':' + data[options.value[j]];
                oDetailSpan.style.display = 'block';
                oDetailSpan.style.width = '61.8%';
                oDetailSpan.style.float = 'right';
                oDetailSpan.style.background = '#F19511';
                oDetailSpan.style.padding = '2px 3px';
                oDetailSpan.style.margin = '6px 3px';
                oDetailSpan.style.borderRadius = '3px';
                oDetailSpan.style.color = '#fff';
                hidDiv.appendChild(oDetailSpan);
            }
            oDiv.appendChild(hidDiv);
        }

    }
    var aTitiles = oDiv.getElementsByClassName('attr_title');
    for (var i = 0; i < aTitiles.length; i++) {
        aTitiles[i].onclick = function () {
            var nextEle = getNextElement(this);
            if (nextEle.style.display == 'none') {
                nextEle.style.display = 'block';
            } else {
                nextEle.style.display = 'none';
            }
        }
    }

}
/**
 * 获取总的左边距
 * @param ele
 * @returns {*}
 */
function getOffsetLeft(ele){
    if(ele.offsetParent==null){
        return ele.offsetLeft;
    }
    var obj=null;
    var l=0;
    for(obj=ele;obj.offsetParent!=null;obj=obj.offsetParent){
        l+=obj.offsetLeft;
    }
    return l;
}
/**
 * 获取总的右边距
 * @param ele
 * @returns {*}
 */
function getOffsetTop(ele){
    if(ele.offsetParent==null){
        return ele.offsetTop;
    }
    var obj=null;
    var t=0;
    for(obj=ele;obj.offsetParent!=null;obj=obj.offsetParent){
        t+=obj.offsetTop;
    }
    return t;
}
/**
 * 预览图鼠标移入显示大图
 * @param containerId
 */
function bigImage(containerId) {
    var oDiv = document.getElementById(containerId);
    var aImages = oDiv.getElementsByTagName('img');
    var i = 0;
    for (i = 0; i < aImages.length; i++) {
        aImages[i].index = i;
        if(aImages[i].getAttribute('src')!='') {
            aImages[i].onmouseover = function () {
                this.oBig = document.createElement('img');
                this.oBig.src = this.getAttribute('src');
                this.oBig.style.position = 'absolute';
                this.oBig.style.height = '225px';
                this.oBig.style.top = getOffsetTop(this) - 10 + 'px';
                this.oBig.style.left = getOffsetLeft(this) + this.parentNode.offsetWidth+12 + 'px';
                this.oBig.style.border = '1px solid #ccc';
                this.oBig.style.borderRadius = '5px';
                this.oBig.style.background = '#fff';
                this.oBig.style.padding = '5px';
                this.oBig.style.zIndex = '2';
                document.body.appendChild(this.oBig);
            }
            aImages[i].onmouseleave = function () {
                document.body.removeChild(this.oBig);
            }
        }

    }
}
/**隐藏checkbox,使用label色彩变换来美化的方法
 *@param containerId string 必须指定要美化的checkbox所属的DIV的id
 *@param disableColor string 当checkbox未选中状态时的背景色 默认 #ccc
 *@param enableColor string 当checkbox选中状态时的背景色 默认#f00
 *@param defaultValue boolean checkbox的默认状态 true或者false
 **/
function checkToggle(json) {
    var _this = this;
    this.containerId = json.containerId;
    this.disableColor = json.disableColor || '#ccc';
    this.enableColor = json.enableColor || '#f00';
    this.defaultValue = json.defaultValue || false;
    this.container = document.getElementById(this.containerId);
    this.aLabels = this.container.getElementsByTagName('label');
    for (var i = 0; i < this.aLabels.length; i++) {
        this.aLabels[i].toInput = document.getElementById(this.aLabels[i].getAttribute('for'));
        //this.aLabels[i].toInput.checked=this.defaultValue;
        if (this.aLabels[i].toInput.checked == true) this.aLabels[i].style.backgroundColor = this.enableColor;
        else this.aLabels[i].style.backgroundColor = this.disableColor;
        this.aLabels[i].onclick = function () {
            _this.changeBg(this);

        }
    }
}
checkToggle.prototype.changeBg = function (obj) {
    var str = obj.getAttribute('for');
    var oInput = document.getElementById(str);
    if (oInput.checked == true) {
        obj.style.background = this.disableColor;
    } else {
        obj.style.background = this.enableColor;
    }
}
/**
 * createRadioElements 类似createRadioElements功能
 *
 */
function createRadioElements(json) {
    var _this = this;
    var i = 0;
    var j = 0;
    var ele=null;
    this.info = json.info;                    //数据
    this.selectShowId = json.selectShowId;    //已选项展示DIVid
    this.containerId = json.containerId;      //radio的父级DIV
    this.radioName = json.radioName || '';    //radio的name
    this.preId = json.preId || '';
    this.checked=json.checked;
    this.showTxt=json.showTxt || 'name';
    this.selectShowDiv = document.getElementById(this.selectShowId);

    this.container = document.getElementById(this.containerId);
    this.container.innerHTML = '';
    for (i in this.info) {
        ele = this.info[i];
        var oDiv = document.createElement('div');
        oDiv.style.float = 'left';
        var oInput = document.createElement('input');
        var oLabel = document.createElement('label');
        oInput.type = 'radio';
        oInput.value = ele.id;
        if(oInput.value==this.checked){
            oInput.checked=true;
        }
        oInput.name = this.radioName;
        oInput.id = this.radioName + '_' + ele.id;

        oLabel.innerHTML = ele[this.showTxt];
        oLabel.setAttribute('for', oInput.id);
        oDiv.appendChild(oInput);
        oDiv.appendChild(oLabel);
        this.container.appendChild(oDiv);

    }
    this.radios = this.container.getElementsByTagName('input');
    this.labels = this.container.getElementsByTagName('label');
    for ( var i = 0; i < this.radios.length; i++) {
        for (j = 0; j < this.labels.length; j++) {
            if (this.radios[i].id == this.labels[j].getAttribute('for')) {
                this.radios[i].label = this.labels[j];
            }
        }
        this.radios[i].onclick = function () {
            _this.showSelect(this);
        }
    }
}
createRadioElements.prototype.showSelect = function (obj) {

    this.selectShowDiv.innerHTML = '';
    if (obj.checked == true) {
        var oSpan = document.createElement('span');
        oSpan.innerHTML = obj.label.innerHTML;
        oSpan.style.padding = '1px 3px';
        oSpan.style.borderRadius = '3px';
        oSpan.style.backgroundColor = 'red';
        oSpan.style.marginRight = '3px';
        oSpan.style.color='#fff';
        this.selectShowDiv.appendChild(oSpan);
    }
}


//example:
//window.onload=function(){
//        new createRadioElement({
//            'selectShowId':'selectedshow',
//            'containerId':'container'
//        })
//    }
//html:
//    选择品牌:<div id='selectedshow'></div>
//    <div id='container'>
//    <input type="radio" id='1' name='aaa' /><label for='1'>aaa</label>
//    <input type="radio" id='2' name='aaa' /><label for='2'>aab</label>
//    <input type="radio" id='3' name='aaa' /><label for='3'>aac</label>
//    <input type="radio" id='4' name='aaa' /><label for='4'>aad</label>
//    </div>
//    </body>
//    </html>
/**
 * 获取以选中的元素
 * @param json
 */
function getCheckedItems(json) {
    var options = {
        'containerId': json.containerId,
        'checkboxName': json.checkboxName,
        'checkedValue': json.checkedValue.split(',')
    }
    var oContainer = document.getElementById(options.containerId);
    var aInput = oContainer.getElementsByTagName('input');
    for (var i = 0; i < options.checkedValue.length; i++) {
        for (var j = 0; j < aInput.length; j++) {
            if (aInput[j].value == options.checkedValue[i]) {
                aInput[j].checked = true;
            }
        }
    }
}
    //收起展开切换
    function itemToggle(btnId,itemId,value1,value2){
        var btn=$('#'+btnId);
        var item=$('#'+itemId);
        btn.bind('click',function(){
            item.toggle(300,function(){
                btn.val(btn.val()==value1?value2:value1);
            })
        });
    }
