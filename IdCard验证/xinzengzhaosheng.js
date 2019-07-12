//alert(location.href);
//"http://localhost:8087/resources/js/jquery.mousewheel.js"
/*var url = location.href;
var index = url.indexOf("//");
var index2 = url.split("//")[1].indexOf("/");
var resultUrl = url.substring(0,(index + index2+2)) +"/resources/js/jquery.mousewheel.js";
document.write("<script type='text/javascript' src='"+ resultUrl +"'></script>");*/



var $prefix=null;
//滚动缩放比例
var scrollRatio = 100;
//最小滚动缩放比例
var smallScrollRatio = 10;


/**
 * 对Date的扩展，将 Date 转化为指定格式的String
 * 月(M)、日(d)、小时(h)、分(m)、秒(s)、季度(q) 可以用 1-2 个占位符，
 * 年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字)
 * 例子：
 * (new Date()).Format("yyyy-MM-dd hh:mm:ss.S") ==> 2006-07-02 08:09:04.423
 * (new Date()).Format("yyyy-M-d h:m:s.S")      ==> 2006-7-2 8:9:4.18
 */
Date.prototype.Format = function (fmt) {
    var o = {
        "M+": this.getMonth() + 1, //月份
        "d+": this.getDate(), //日
        "h+": this.getHours(), //小时
        "m+": this.getMinutes(), //分
        "s+": this.getSeconds(), //秒
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度
        "S": this.getMilliseconds() //毫秒
    };
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
        if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
}
/**
 * 读取身份证信息
 * */
function read_IDCard() {
    var CVR_IDCard = document.getElementById("CVR_IDCard");
    var strReadResult = CVR_IDCard.ReadCard();
    if (strReadResult == "0") {
        ClearForm();
        document.all['studentName'].value = CVR_IDCard.Name;
        document.all['studentGender'].value = CVR_IDCard.Sex;
        document.all['studentNation.id'].value = CVR_IDCard.Nation;
        document.all['studentBirthday'].value = CVR_IDCard.Born;
        document.all['studentCensusarea'].value = CVR_IDCard.Address;
        document.all['studentIdcard'].value = CVR_IDCard.CardNo;
        document.all['pic'].src = "data:image/png;base64,"
            + CVR_IDCard.Picture;
        document.all['studentPhoto.photoUrl'].value = CVR_IDCard.Picture;
    } else {
        ClearForm();
        alert(strReadResult);
    }
};
function ClearForm() {
    document.all['studentName'].value = "";
    document.all['studentGender'].value = "";
    document.all['studentNation.id'].value = "";
    document.all['studentBirthday'].value = "";
    document.all['studentCensusarea'].value = "";
    document.all['studentIdcard'].value = "";
    document.all['pic'].src = "";
    document.all['studentPhoto.photoUrl'].value = "";
    return true;
};
/**
 * 加载日期控件
 * */
function mountdate(list){
    list = list || [];
    for(var i=0;i<list.length;i++){
        var ele = list[i];
        if (!!ele){
            laydate({
                elem : '#' + ele,
                event : 'focus',
                format : 'YYYY-MM-DD',
                max : '2099-06-16', //最大日期
                festival : true, //显示节日
                choose : function(datas) {}
            });
        }
    }
};
/**
 * 判断是否为函数
 * */
function isFunc(test){
    return typeof test == 'function';
};
/**
 * 身份证号提取出生日期
 * */
function idCardPickBirthDay(s){
    s=s || "";
    var ret="";
    if (s.length>16){
        ret = s.substring(6, 10) + "-" + s.substring(10, 12) + "-" + s.substring(12, 14);

    }else if(s.length=15){

        ret = "19"+s.substring(6, 8) + "-" + s.substring(8, 10) + "-" + s.substring(10, 12);

    }
    return ret;
};
/**
 * 身份证号提取性别
 * */
function idCardPickGender(s){
    var k="";
    if (s.length==15){
        k=s.substr(14,1);
    }
    else if (s.length==18){
        k=s.substr(16,1);
    }
    k=parseInt(k);
    return k%2 ==0?"女":"男";
}
/**
 * 特殊字符验证
 * s 证件号码
 * t 证件类型，如果为null则默认为身份证
 * */
function specialcharactersLegal(s,t) {
    t = t || "身份证";
    var pattern="";
    if (t=="身份证"){
        pattern = new RegExp(
            "[`~!@#$^&*()=+|{}':;',\\[\\].<>/?~！@#￥……&*（）——|{}【】‘；：”“'。，、？]");
    }
    else{
        pattern = new RegExp(
            "[`~!@#$^&*=+|{}':;',\\[\\].<>/?~！@#￥……&*——|{}【】‘；：”“'。，、？]");
    }
    return !pattern.test(s);
};
/**
 * 验证身份证号符合规则
 * */
function identityCardLegal(s){
    /*var reg=/^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])(\d{3})(\d|x|X)$/;*/
    var reg=/(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
    return reg.test(s);
};
/**
 * 验证身份证号
 * */
function validateStudent(q,callback){
    var callbackisfunc = isFunc(callback || "");
    q = q || {
        'idcard':$("#studentIdcard").val(),
        'mobile':$("#studentMobile").val(),
        'email':$("#studentEmail").val()
    };
    $stid = $("#studentid").val() || undefined;
    if (!!$stid){q.id=$stid;}
    $.ajax({
        url :  $prefix + "zhao-sheng/xin-zeng-zhao-sheng/validate",
        data : q,
        dataType : "json",
        async:false,
        success : function(data) {
            if (callbackisfunc){
                callback(data);
            }
        }
    });
};
/**
 * 验证身份证是否被管理员使用
 * */
function validateStudentIdCard(callback){
    var callbackisfunc = isFunc(callback || "");
    var q = $("#studentIdcard").val();
    var boolaen =false;
    $.ajax({
        url :  $prefix + "zhao-sheng/xin-zeng-zhao-sheng/validateStudentIdCard",
        data : {'idcard':q},
        type : "POST",
        async:false,
        success : function(data) {
            if(data.length > 0){
                boolaen = true;
                if (callbackisfunc){
                    var errormessage = [];
                    errormessage.push(data);
                    callback(errormessage);
                }
            }
        }
    });
    return boolaen;
};
/**
 * 原毕业学校名称验证
 * */
function validateOriginalSchool(){
    var orgsplevelname = $("#spLevel").find("option:selected").text();//原学历层次名称
    var originalSchool = $("#originalSchool").val();//原毕业学校
    var word=undefined;
    if (orgsplevelname=="专科" || orgsplevelname=="大专"){
        if (originalSchool.indexOf("学校")>=0){word ="学校"}
        else if (originalSchool.indexOf("中学")>=0){word ="中学"}
        else if (originalSchool.indexOf("党校")>=0){word ="党校"}
        else if (originalSchool.indexOf("进修")>=0){word ="进修"}
    }
    if (!!word){word="原毕业学校名称中【" + word + "】不符合要求";}
    return word;
};
/**
 * 控件只读控制
 * */
function disabledLabels(v,list){
    list = list || [];
    for(var i=0;i<list.length;i++){
        var ele = list[i];
        if (!!ele){
            var ele = "#" + ele;
            if (!!v){$(ele).attr("disabled","disabled");}else{$(ele).removeAttr("disabled");}
        }
    }
};
/**
 * 控件必填控制
 * */
function requiredLabels(t,f){debugger;
    f = f || $("form");
    $validator = f.data("validator");

    if (!!t){
        $("span[togglerequired]").text("*");
        if (!$validator) return;
        if (!$validator.options) return;
        $validator.options.ignore="";
    }
    else{
        $("span[togglerequired]").text("");
        if (!$validator) return;
        if (!$validator.options) return;
        $validator.options.ignore="input[togglerequired]";
    }
}

/**
 * 控件必填控制
 * */
function requiredLabels2(recruittypeid,studentlevelid){debugger;
    if (!recruittypeid) return;
    if (!studentlevelid) return;
    if (!changeController.Templates) return;
    var f = $("form");
    var $validator = f.data("validator");
    if (!!$validator && !!$validator.options) $validator.options.ignore="";
    for(var i=0;i<changeController.Templates.length;i++){
        var t = changeController.Templates[i];
        if (t.recruitTypeId==parseInt(recruittypeid) && t.studentLevelId==parseInt(studentlevelid)){
            var required={};
            if (t.TemplateType==1){
                required={"spLevel":1,"originalSchool":1,"graduationDate":1,"spKind":0,"spSubject":0,
                    "originalStudytype":1,"originalSpecialty":1,"oldCardId":1,"grNo":1,"originalLevidence":1,"enrollDate":1,
                    "orgverId":1,"originalStudentname":1,"predictGraduationDate":1,"oldStudentIdcard":1};
            }
            else if (t.TemplateType==2){
                required={"spLevel":1,"originalSchool":1,"graduationDate":1,"spKind":0,"spSubject":0,
                    "originalStudytype":0,"originalSpecialty":0,"oldCardId":0,"grNo":0,"originalLevidence":0,"enrollDate":0,
                    "orgverId":0,"originalStudentname":0,"predictGraduationDate":0,"oldStudentIdcard":0};
            }
            for(var key in required){
                var v = required[key];
                if (!v){
                    $("#" + key + "span").text("");
                    $("#" + key).addClass("igronattr");
                }
                else{
                    $("#" + key + "span").text("*");
                    $("#" + key).removeClass("igronattr");
                }
            }
            if (!!$validator && !!$validator.options) $validator.options.ignore=".igronattr";
            break;
        }
    }
}

/**
 * 修改招生保存前验证
 * @param skip 跳过对身份证号，手机号和邮箱的验证
 * */
function validateUpdate(callback,skip){
    debugger;
    var callbackisfunc = isFunc(callback || "");
    var errormessage=[];
    var stuid = $("#studentid").val();//学生id
    var stuidcard =	$("#studentIdcard").val();//证件号
    var idCard =	$("#idCard").val();//证件类型

    var stumobile = $("#studentMobile").val();//移动电话
    var stuemail = $("#studentEmail").val();//邮箱
    var stuidcardtype = $("#idCard option[value='"+$("#idCard").val()+"']").html();//证件类型
    var stuoldidcard = $("#oldStudentIdcard").val();//旧证件号
    var stuoldidcardtype = $("#oldCardId option[value='"+$("#oldCardId").val()+"']").html();//旧证件类型
    var grNo = $("#grNo").val();//毕业证书编号
    var orgverId = $("#orgverId").val();//证明材料编号


    if(!specialcharactersLegal(grNo,"n")){
        errormessage.push("毕业证书编号不能输入特殊字符");
    }
//	if(!specialcharactersLegal(orgverId,"n")){
//		errormessage.push("证明材料编号不能输入特殊字符");
//	}
    if(!!stuoldidcard && !specialcharactersLegal(stuoldidcard,stuidcardtype)){
        errormessage.push("学历证件号码不能输入特殊字符");
    }
    else if(!! stuoldidcard && stuoldidcardtype=="身份证" && !identityCardLegal(stuoldidcard)){

        errormessage.push("请输入正确的学历证件号码");
    }
    /*	if(!!stuidcard && !specialcharactersLegal(stuidcard,stuidcardtype)){
            errormessage.push("证件号码不能输入特殊字符");
        }
        else if(!!stuidcard && stuidcardtype=="身份证" && !identityCardLegal(stuidcard)){
            errormessage.push("请输入正确的证件号码");
        }*/
    var  lastType = stuidcard.substr(stuidcard.length-1,1);
    if(lastType=="x"){
        stuidcard=stuidcard.substr(0,stuidcard.length-1)+"X";
        $("#studentIdcard").val(stuidcard);
    }
    stuidcard = $("#studentIdcard").val();//获取身份证号

    if (stuidcard != null && stuidcard != '') {
        if(idCard=='710' || idCard==710){
            var reamrk =  legitimacy(stuidcard)
            if(reamrk!="ok"){
                errormessage.push(reamrk);
            }
        }
    }else {
        $(this).parent().next("div").text("证件号是必填项");
    }
    var bool = validateStudentIdCard(callback);
    if(bool==true || bool =="true"){
        return;
    }
    var msg = validateOriginalSchool();//原毕业学校名称验证
    if (!!msg){errormessage.push(msg);}
    if (errormessage.length>0){
        if (callbackisfunc){callback(errormessage);}
        return;
    }
    if (!!stuidcard && !skip){
        validateStudent({'idcard':stuidcard,'id':stuid},function(s){
            if (!!s){
                if (!!stuidcard && stuidcard==s.studentIdcard){errormessage.push("证件号码已存在");}
            }
            if (callbackisfunc){callback(errormessage);}
        });
    }
    else{
        if (callbackisfunc){callback([]);}
    }
};
/**
 * 校验身份证件号
 *20180716
 */

//切割出生日期
function cuttingDateOfBirth(str) {
    var s = str.toString().substring(6, 14);

    var s = s.substring(0,4)+"-"+s.substring(4,6)+"-"+s.substring(6,8);

    return s;
}

// 验证身份证号是否合法
function legitimacy(idCard) {
    var reg = RegExp("^(^[1-9]\\d{7}((0\\d)|(1[0-2]))(([0|1|2]\\d)|3[0-1])\\d{3}$)|(^[1-9]\\d{5}[1-9]\\d{3}((0\\d)|(1[0-2]))(([0|1|2]\\d)|3[0-1])((\\d{4})|\\d{3}[Xx])$)$");
    var remark= validation18(idCard.toString());


    if (remark=="ok") {
        if (!reg.test(idCard)) {
            /*	var brithDay = $("input#studentBirthday").val();//获取输入的生日
                //brithDay="1984-02-21"
                var custNbrBirthDay = cuttingDateOfBirth(idCard);//获取身份证上的生日


                if(brithDay!=custNbrBirthDay){
                    return "身份证中出生日期输入格式不正确";
                }*/
            return "身份证输入格式不正确";
        }
    }

    return remark;
};


// 验证18位身份证
function validation18(idcard) {

    if (idcard == null) { // 判断身份证是否为空
        return "身份证号不能为空";
    }

    if (idcard.length != 18) { // 判断身份证位数
        return "身份证输入格式不正确";
    }

    if (!isDigital(idcard.substring(0, 17))) {// 判断前十七位是否为数字
        return "身份证输入格式不正确";
    }
    if( !booleanSex(idcard)){
        return "身份证对应性别与实际性别不符";
    }
    if (!checkPId(idcard.substring(0, 2))) {// 判断前2位是否是省份代码
        return "身份证输入格式不正确";
    }
    if(!biJiaoBirthdayFanWei(idcard)){
        return "身份证日期超出规定范围";
    }
    // 出生日期的判断
    var flag = toExamine(idcard.substring(6, 14));
    if (!flag) {
        return "身份证中出生日期输入格式不正确";
    }

    // 对校验位进行校验
    if (!mod11(idcard)) {
        return "身份证未通过正确性校验";
    }
    return "ok";
};

function   biJiaoBirthdayFanWei(idcard) {
    var nowDate = new Date();
    var year = nowDate.getFullYear();
    var month = nowDate.getMonth() + 1 < 10 ? "0" + (nowDate.getMonth() + 1)
        : nowDate.getMonth() + 1;
    var day = nowDate.getDate() < 10 ? "0" + nowDate.getDate() : nowDate
        .getDate();
    var dateStr = String(year) +  String(month)  + String(day);

    var birthday8 = idcard.substr(6, 8);//YYYYMMDDHHmmSS
    var birthday4 = idcard.substr(6, 4);//YYYYMMDD
    var dateStrInt=parseInt(dateStr);
    var birthday8Int=parseInt(birthday8);
    var birthday4Int=parseInt(birthday4);
    if(birthday4Int <=1000 || birthday8Int>dateStrInt){
        return false;
    }
    return true;
}


//判断性别
function  booleanSex(idcard) {
    var sex =  $("#studentGender").val();
    var num = idcard.substring(15,17);
    var sexStr = "";
    if(num%2==0){
        sexStr="女";
    }else{
        sexStr="男";
    }
    if(sexStr!=sex){
        return false;
    }
    return true;
}
// 验证15位身份证
function validation15(idcard) {
    // 非空验证
    if (idcard == null) {
        return false;
    }
    // 身份证号长度验证
    if (idcard.length != 15) {
        return false;
    }
    // 身份证号是否都为数字
    if (!isDigital(idcard)) {
        return false;
    }
    // 省号验证
    if (!checkPId(idcard.substring(0, 2))) {
        return false;
    }
    // 出生日期验证
    if (!toExamine(idcard.substring(6, 14))) {
        return false;
    }

    return true;

};

// 判断是否为数字
function isDigital(str) {

    var reg = RegExp("^[0-9]{17}$")

    return reg.test(str);
};

// 校验位
function mod11(IdCard) {
    var code = IdCard.split('');// 得到的身份证号码
    // 加权因子
    var factor = [ 7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2 ];
    // 校验位
    var parity = [ 1, 0, 'X', 9, 8, 7, 6, 5, 4, 3, 2 ];
    var sum = 0;
    var ai = 0;
    var wi = 0;
    for (var i = 0; i < 17; i++) {
        ai = code[i];
        wi = factor[i];
        sum += ai * wi;
    }
    if (parity[sum % 11] != code[17].toUpperCase()) {
        return false;
    } else {
        return true;
    }
};

// 判断出生日期
function toExamine(str) {
    var reg = new RegExp(
        "(18|19|20)?\\d{2}(0[1-9]|1[012])(0[1-9]|[12]\\d|3[01])");
    if (reg.test(str)) {
        return true;
    } else {
        return false;
    }
};

// 判断省份代码是否正确
function checkPId(str) {

    /**
     * <pre>
     * 省、直辖市代码表：
     *     11 : 北京  12 : 天津  13 : 河北       14 : 山西  15 : 内蒙古
     *     21 : 辽宁  22 : 吉林  23 : 黑龙江     31 : 上海  32 : 江苏
     *     33 : 浙江  34 : 安徽  35 : 福建       36 : 江西  37 : 山东
     *     41 : 河南  42 : 湖北  43 : 湖南       44 : 广东  45 : 广西      46 : 海南
     *     50 : 重庆  51 : 四川  52 : 贵州       53 : 云南  54 : 西藏
     *     61 : 陕西  62 : 甘肃  63 : 青海       64 : 宁夏  65 : 新疆
     *     71 : 台湾
     *     81 : 香港  82 : 澳门
     *     91 : 国外
     * </pre>
     */

    var cityCode = {
        11 : "北京",
        12 : "天津",
        13 : "河北",
        14 : "山西",
        15 : "内蒙古",
        21 : "辽宁",
        22 : "吉林",
        23 : "黑龙江",
        31 : "上海",
        32 : "江苏",
        33 : "浙江",
        34 : "安徽",
        35 : "福建",
        36 : "江西",
        37 : "山东",
        41 : "河南",
        42 : "湖北",
        43 : "湖南",
        44 : "广东",
        45 : "广西",
        46 : "海南",
        50 : "重庆",
        51 : "四川",
        52 : "贵州",
        53 : "云南",
        54 : "西藏",
        61 : "陕西",
        62 : "甘肃",
        63 : "青海",
        64 : "宁夏",
        65 : "新疆",
        71 : "台湾",
        81 : "香港",
        82 : "澳门",
        91 : "国外"
    };

    if (cityCode[str]) {
        return true;
    } else {
        return false;
    }
};
/**
 * 校验身份证件号
 *20180716
 */
/**
 * 新增招生保存前验证
 * @param skip 跳过对身份证号，手机号和邮箱的验证
 * */
function validateNew2(callback,skip){
    var callbackisfunc = isFunc(callback || "");
    var errormessage=[];
    var stuidcard =	$("#studentIdcard").val();//证件号
    var stumobile = $("#studentMobile").val();//移动电话
    var stuemail = $("#studentEmail").val();//邮箱
    var stuidcardtype = $("#idCard option[value='"+$("#idCard").val()+"']").html();//证件类型
    var stuoldidcard = $("#oldStudentIdcard").val();//旧证件号
    var stuoldidcardtype = $("#oldCardId option[value='"+$("#oldCardId").val()+"']").html();//旧证件类型
    var grNo = $("#grNo").val();//毕业证书编号
    var orgverId = $("#orgverId").val();//证明材料编号


    if(!specialcharactersLegal(grNo,"n")){
        errormessage.push("毕业证书编号不能输入特殊字符");
    }

    if(!!stuoldidcard && !specialcharactersLegal(stuoldidcard,stuidcardtype)){
        errormessage.push("学历证件号码不能输入特殊字符");
    }
    else if(!! stuoldidcard && stuoldidcardtype=="身份证" && !identityCardLegal(stuoldidcard)){
        errormessage.push("请输入正确的学历证件号码");
    }
    if(!!stuidcard && !specialcharactersLegal(stuidcard,stuidcardtype)){
        errormessage.push("证件号码不能输入特殊字符");
    }
    else if(!!stuidcard && stuidcardtype=="身份证" && !identityCardLegal(stuidcard)){
        errormessage.push("请输入正确的证件号码");
    }
    var msg = validateOriginalSchool();//原毕业学校名称验证
    if (!!msg){errormessage.push(msg);}
    if (errormessage.length>0){
        if (callbackisfunc){callback(errormessage);}
        return;
    }
    if (!!stuidcard && !skip){
        validateStudent({'idcard':stuidcard},function(s){
            if (!!s){
                if (!!stuidcard && stuidcard==s.studentIdcard){errormessage.push("证件号码已存在");}
            }
            if (callbackisfunc){callback(errormessage);}
        });
    }
    else{
        if (callbackisfunc){callback([]);}
    }
};

/**
 * 新增招生保存前验证
 * @param skip 跳过对身份证号，手机号和邮箱的验证
 * */
function validateNew(callback,skip){
    var callbackisfunc = isFunc(callback || "");
    var errormessage=[];
    var stuidcard =	$("#studentIdcard").val();//证件号
    var stumobile = $("#studentMobile").val();//移动电话
    var stuemail = $("#studentEmail").val();//邮箱
    var stuidcardtype = $("#idCard option[value='"+$("#idCard").val()+"']").html();//证件类型
    var stuoldidcard = $("#oldStudentIdcard").val();//旧证件号
    var stuoldidcardtype = $("#oldCardId option[value='"+$("#oldCardId").val()+"']").html();//旧证件类型
    var grNo = $("#grNo").val();//毕业证书编号
    var orgverId = $("#orgverId").val();//证明材料编号


    if(!specialcharactersLegal(grNo,"n")){
        errormessage.push("毕业证书编号不能输入特殊字符");
    }
//	if(!specialcharactersLegal(orgverId,"n")){
//		errormessage.push("证明材料编号不能输入特殊字符");
//	}
    if(!!stuoldidcard && !specialcharactersLegal(stuoldidcard,stuidcardtype)){
        errormessage.push("学历证件号码不能输入特殊字符");
    }
    else if(!! stuoldidcard && stuoldidcardtype=="身份证" && !identityCardLegal(stuoldidcard)){
        errormessage.push("请输入正确的学历证件号码");
    }
    if(!!stuidcard && !specialcharactersLegal(stuidcard,stuidcardtype)){
        errormessage.push("证件号码不能输入特殊字符");
    }
    else if(!!stuidcard && stuidcardtype=="身份证" && !identityCardLegal(stuidcard)){
        errormessage.push("请输入正确的证件号码");
    }
    /* if (stuidcard != null && stuidcard != '') {
         var reamrk =  legitimacy(stuidcard)
         if(reamrk!="ok"){
             errormessage.push(reamrk);
         }
     }*/
    var msg = validateOriginalSchool();//原毕业学校名称验证
    if (!!msg){errormessage.push(msg);}
    if (errormessage.length>0){
        if (callbackisfunc){callback(errormessage);}
        return;
    }
    var bool = validateStudentIdCard(callback);
    if(bool==true || bool =="true"){
        return;
    }
    if (!!stuidcard && !skip){
        validateStudent({'idcard':stuidcard},function(s){
            if (!!s){
                if (!!stuidcard && stuidcard==s.studentIdcard){errormessage.push("证件号码在系统内已存在,请使用系统内学生报读功能!");}
            }
            if (callbackisfunc){callback(errormessage);}
        });
    }
    else{
        if (callbackisfunc){callback([]);}
    }
};

/**
 * 下拉框变更事件
 * */
var changeEvent={
    /**
     * 原学历层次变更
     * */
    orgspecialtyLevel:function(){
        $("#spKind").html("");
        $("#spSubject").html("");
        $("#spKind").append("<option value='-1'>请选择</option>");
        $("#spSubject").append("<option value='-1'>请选择</option>");
        $.ajax({
            url: $prefix + "zhao-sheng/xin-zeng-zhao-sheng/getKind?id=" +$("#spLevel").val(),
            dataType: "text",
            success: function(data) {

                data = data.replace('{','');
                data = data.replace('}','');
                data = data.split(",");
                $("#spKind").html("");
                $("#spSubject").html("");
                $("#spKind").append("<option value='-1'>请选择</option>");
                $("#spSubject").append("<option value='-1'>请选择</option>");
                for(var i = 0; i < data.length;i++)
                {
                    var levelId = data[i].substr(0,data[i].indexOf('='));
                    var levelName = data[i].substr(data[i].indexOf('=')+1,data[i].length);
                    $("#spKind").append("<option value='"+$.trim(levelId)+"'>"+levelName+"</option>");
                }
            }
        });
    },
    /**
     * 原专业门类变更
     * */
    orgspecialtyKind:function(){
        $.ajax({
            url: $prefix + "zhao-sheng/xin-zeng-zhao-sheng/getKind?id=" +$("#spKind").val(),
            dataType: "text",
            success: function(data) {
                data = data.replace('{','');
                data = data.replace('}','');
                data = data.split(",");
                $("#spSubject").html("");
                $("#spSubject").append("<option value='-1'>请选择</option>");
                for(var i = 0; i < data.length;i++)
                {
                    var spSubjectId = data[i].substr(0,data[i].indexOf('='));
                    var spSubjectName = data[i].substr(data[i].indexOf('=')+1,data[i].length);
                    $("#spSubject").append("<option value='"+$.trim(spSubjectId)+"'>"+spSubjectName+"</option>");
                }
            }
        });
    },
    /**
     * 省份变更
     * */
    provinces:function(){
        $("#citys").empty();
        $("#citys").append("<option value=''>请选择市</option>");
        $.ajax({
            url : $prefix + "zhao-sheng/xin-zeng-zhao-sheng/getKind?id="
            + $("#provinces").val(),
            dataType : "text",
            success : function(data) {
                data = data.replace('{', '');
                data = data.replace('}', '');
                data = data.split(",");
                for (var i = 0; i < data.length; i++) {
                    var levelId = data[i].substr(0,data[i].indexOf('='));
                    var levelName = data[i].substr(data[i].indexOf('=') + 1,data[i].length);
                    $("#citys").append("<option value='"+levelId+"'>" + levelName + "</option>");

                }
            }
        });
    },
    /**
     * 市变更
     * */
    citys:function(){
        $("#countys").empty();
        $("#countys").append("<option value=''>请选择区（县）</option>");
        $.ajax({
            url : $prefix + "zhao-sheng/xin-zeng-zhao-sheng/getKind?id="
            + $("#citys").val(),
            dataType : "text",
            success : function(data) {
                data = data.replace('{', '');
                data = data.replace('}', '');
                data = data.split(",");
                for (var i = 0; i < data.length; i++) {
                    var levelId = data[i].substr(0,data[i].indexOf('='));
                    var levelName = data[i].substr(data[i].indexOf('=') + 1,data[i].length);
                    $("#countys").append("<option value='"+levelId+"'>" + levelName + "</option>");

                }
            }
        });
    },
    /**
     * 证件号变更
     * */
    studentIdcard:function(){
        var stuIdCard =	$("#studentIdcard").val();
        var optionHtml=$("#idCard option[value='"+$("#idCard").val()+"']").html();
        if(optionHtml=="身份证"){
            if(stuIdCard!=""){
                if(identityCardLegal(stuIdCard)){
                    var b = idCardPickBirthDay(stuIdCard);
                    $("#studentBirthday").val(b);
                    var g = idCardPickGender(stuIdCard);
                    $("#studentGender").val(g);
                }

            }
        }
        $("#oldStudentIdcard").val(stuIdCard);
    }
};
/**
 * 变更控制
 * */
var changeController={
    PlanInfos:null,
    Templates:null,
    /**
     * 清除教学点标签内容
     * */
    clear_teachingName_label:function(a){
        a = a || 0;
        var leiId = $("#leixin").val();
        var pcid = $("#pici").val();
        $("#teachingName").empty();
        if (!a && leiId && pcid){
            $("#teachingName").append("<option value=''>招生计划未通过，不支持招生</option>");
        }
        else{
            $("#teachingName").append("<option value=''>请选择教学点</option>");
        }
    },
    /**
     * 清除专业标签内容
     * */
    clear_specialty_label:function(){
        $("#specialty").empty();
        $("#specialty").append("<option value=''>请选择专业名称</option>");
    },
    /**
     * 清除专业门类标签内容
     * */
    clear_newspecialtyKind_label:function(){
        $("#newspecialtyKind").empty();
        $("#newspecialtyKind").append("<option value=''>请选择专业门类</option>");
    },
    /**
     * 清除专业层次标签内容
     * */
    clear_studleid_label:function(){
        $("#studleid").empty();
        $("#studleid").append("<option value=''>请选择专业层次</option>");
    },
    /**
     * 初始化数据
     * */
    init:function(callback){
        changeController.PlanInfos = [];
        var leiId = $("#leixin").val() || "";
        var pcid = $("#pici").val() || "";
        var id = $("#responsible").val() || "";
        if (pcid!="" && leiId!="" && id!="") {
            $.ajax({
                url : $prefix + "zhao-sheng/xin-zeng-zhao-sheng/getPlanInfoByTypeAndBatch",
                data : {
                    'id':id,
                    'LxId' : leiId,
                    'PcId' : pcid
                },
                dataType : "json",
                success : function(data) {
                    changeController.PlanInfos=data.planInfos;
                    changeController.Templates=data.templates;
                    if (isFunc(callback || "")){callback();}
                }

            })
        }
        else{
            if (isFunc(callback || "")){callback();}
        }
    },
    /**
     * 初始化数据
     * */
    init2:function(callback){
        changeController.PlanInfos = [];
        var leiId = $("#leixin").val() || "";
        var pcid = $("#pici").val() || "";
        if (pcid!="" && leiId!="") {
            $.ajax({
                url : $prefix + "zhao-sheng/xin-zeng-zhao-sheng/getPlanInfoByTypeAndBatch",
                data : {
                    'LxId' : leiId,
                    'PcId' : pcid
                },
                dataType : "json",
                success : function(data) {
                    changeController.PlanInfos=data.planInfos;
                    changeController.Templates=data.templates;
                    if (isFunc(callback || "")){callback(data || []);}
                }

            })
        }
    },
    /**
     * 附加教学点
     * 如果当前登录用户的组织切换到了教学点则
     * 在教学点上默认选择该教学点(如果不存在就添加)
     * @param list 正常逻辑加载的教学点集合(通过loadstudycenter方法加载的教学点集合)
     * */
    appenddefaultstudycenter:function(d){
        var structname = $("#cstructname").val();
        var structid = $("#cstructid").val();
        var structtype = $("#cstructtype").val();
        if (structtype == 3){//当前组织为教学点
            d = d || {};
            if (d[structid]){
                $("#teachingName").val(structid).trigger("change");
            }
            else{
                $("#teachingName").append("<option value='"+structid +"'>" + structname + "</option>");
            }
        }
    },
    /**
     * 设置默认的入学和预计毕业日期
     * */
    setdefaultdate:function(){
        var enrollDate=null;
        var predictGraduationDate=null;
        //加载当前批次和类型的入学日期和预计毕业日期
        if (changeController.PlanInfos.length>0){
            enrollDate = !!changeController.PlanInfos[0].ENROLLDATE && new Date(changeController.PlanInfos[0].ENROLLDATE) || null;
            predictGraduationDate = !!changeController.PlanInfos[0].PREDICTGRADUATIONDATE && new Date(changeController.PlanInfos[0].PREDICTGRADUATIONDATE) || null;
        }
        if (!enrollDate){
            enrollDate = new Date();
            enrollDate = new Date(enrollDate.setFullYear(enrollDate.getFullYear()));
        }
        if (!predictGraduationDate){
            predictGraduationDate=new Date();
            predictGraduationDate = new Date(predictGraduationDate.setFullYear(predictGraduationDate.getFullYear()+1));
        }
        if (!!enrollDate && !!predictGraduationDate){
            $("#enrollDate").val(enrollDate.Format("yyyy-MM-dd"));
            $("#predictGraduationDate").val(predictGraduationDate.Format("yyyy-MM-dd"));
        }
    },
    /**
     * 加载教学点
     * */
    loadstudycenter:function(callback){
        changeController.clear_studleid_label();
        changeController.clear_newspecialtyKind_label();
        changeController.clear_specialty_label();
        changeController.clear_teachingName_label(changeController.PlanInfos.length);
        changeController.PlanInfos = changeController.PlanInfos || [];
        var dic={};
        var ret=[];
        for (var i = 0; i < changeController.PlanInfos.length; i++) {
            var planinfo = changeController.PlanInfos[i];
            var jiaoxuedians = planinfo.BRANCHJIAOXUEDIANS || [];
            for (var j=0;j<jiaoxuedians.length;j++){
                var jxd = jiaoxuedians[j];
                if (!dic[jxd.ID]){
                    dic[jxd.ID]=jxd.NAME;
                    ret.push(jxd);
                }
            }
        }
        //如果当前登录组织为教学点则默认加载改教学点
        for (var i = 0; i < ret.length; i++) {
            $("#teachingName").append("<option value='"+ret[i].ID +"'>" + ret[i].NAME + "</option>");
        }
        changeController.appenddefaultstudycenter(dic);
        //设置默认的入学和预计毕业日期
        changeController.setdefaultdate();

        if (isFunc(callback || "")){callback();}
    },
    /**
     * 加载专业层次
     * */
    loadspecialtylevel:function(){
        changeController.clear_studleid_label();
        changeController.clear_newspecialtyKind_label();
        changeController.clear_specialty_label();
        changeController.PlanInfos = changeController.PlanInfos || [];
        var studycenter = $("#teachingName").val();
        if (!!studycenter){
            var dic={};
            for (var i = 0; i < changeController.PlanInfos.length; i++) {
                var planinfo = changeController.PlanInfos[i];
                var jiaoxuedians = planinfo.BRANCHJIAOXUEDIANS || [];
                for (var j=0;j<jiaoxuedians.length;j++){
                    if (jiaoxuedians[j].ID == studycenter){
                        if (!dic[planinfo.SPECIALTYLEVELID]){
                            dic[planinfo.SPECIALTYLEVELID]=planinfo.SPECIALTYLEVELNAME;
                            $("#studleid").append("<option value='"+planinfo.SPECIALTYLEVELID+"'>" + planinfo.SPECIALTYLEVELNAME + "</option>");
                        }
                    }
                }
            }
        }
    },
    /**
     * 加载专业
     * */
    loadspecialty:function(callback){
        changeController.clear_specialty_label();
        changeController.clear_newspecialtyKind_label();
        changeController.PlanInfos = changeController.PlanInfos || [];
        var studycenter = $("#teachingName").val();
        var specialtylevel = $("#studleid").val();
        if (!!studycenter && !!specialtylevel){
            var dic={};
            for (var i = 0; i < changeController.PlanInfos.length; i++) {
                var planinfo = changeController.PlanInfos[i];
                var jiaoxuedians = planinfo.BRANCHJIAOXUEDIANS || [];
                for (var j=0;j<jiaoxuedians.length;j++){
                    if (jiaoxuedians[j].ID == studycenter && planinfo.SPECIALTYLEVELID==specialtylevel){
                        if (!dic[planinfo.SPECIALTYID]){
                            dic[planinfo.SPECIALTYID]=planinfo.SPECIALTYNAME;
                            var sd=planinfo.SPECIALTYDIRECTION && ("( " + planinfo.SPECIALTYDIRECTION + " )") || "";
                            $("#specialty").append("<option value='"+planinfo.SPECIALTYID+"'>" + planinfo.SPECIALTYNAME  +  " "+sd+"</option>");
                        }
                    }
                }
            }
        }
        if (isFunc(callback || "")){callback();}
    },
    /**
     * 加载并选择专业门类
     * */
    loadandselectspecialtykind:function(){
        changeController.clear_newspecialtyKind_label();
        var specialty = $("#specialty").val();
        if (!!specialty){
            for (var i = 0; i < changeController.PlanInfos.length; i++) {
                var planinfo = changeController.PlanInfos[i];
                if (planinfo.SPECIALTYID==specialty){
                    $("#newspecialtyKind").append("<option value='"+planinfo.SPECIALTYKINDID+"'>" + planinfo.SPECIALTYKINDNAME + "</option>");
                    $("#newspecialtyKind").val(planinfo.SPECIALTYKINDID);
                    break;
                }
            }
        }

    }
};


/**
 * 新增招生页面初始化
 * */
function documentready_zhaoshengtianjiaremote(prefix){
    $prefix = prefix || $prefix;
    majorCascade($prefix,"spLevel","spKind","spSubject");
    changeController.clear_studleid_label();
    changeController.clear_newspecialtyKind_label();
    changeController.clear_specialty_label();
    changeController.clear_teachingName_label(changeController.PlanInfos.length);

    documentready_zhaoshengtianjiaremote.mountspecialty=function(specialtylevel){
        changeController.clear_specialty_label();
        changeController.clear_newspecialtyKind_label();
        changeController.PlanInfos = changeController.PlanInfos || [];
        if (!!specialtylevel){
            var dic={};
            for (var i = 0; i < changeController.PlanInfos.length; i++) {
                var planinfo = changeController.PlanInfos[i];
                if (planinfo.SPECIALTYLEVELID==specialtylevel){
                    if (!dic[planinfo.SPECIALTYID]){
                        dic[planinfo.SPECIALTYID]=planinfo.SPECIALTYNAME;
                        var sd=planinfo.SPECIALTYDIRECTION && ("( " + planinfo.SPECIALTYDIRECTION + " )") || "";
                        $("#specialty").append("<option value='"+planinfo.SPECIALTYID+"'>" + planinfo.SPECIALTYNAME  +  " "+sd+"</option>");
                    }
                }
            }
        }
    };


    //学生批次
    $("#pici").change(function(){changeController.init2(function(){
        documentready_zhaoshengtianjiaremote.mountspecialty(2);
    });});
    //学生类型
    $("#leixin").change(function(){changeController.init2(function(){
        documentready_zhaoshengtianjiaremote.mountspecialty(2);

    });});

    //专业层次
    $("#studleid").change(function(){debugger;
        changeController.loadspecialty();

    });
    //专业
    $("#specialty").change(function(){changeController.loadandselectspecialtykind();});
    //专业门类
    $("#newspecialtyKind").change(function(){});

    //原学历证明材料
    $("#originalLevidence").change(function(){
        var txt = $("#originalLevidence").find("option:selected").text();//原学历证明材料名称
        if (txt=="学历网查"){
            $("#orgverId").val($("#grNo").val());//证明材料编号==原学历毕业证书编号
        }
        else{
            $("#orgverId").val("");
        }
    });
    //原学历毕业证书编号
    $("#grNo").change(function(){
        var txt = $("#originalLevidence").find("option:selected").text();
        if (txt=="学历网查"){
            $("#orgverId").val($("#grNo").val());//证明材料编号==原学历毕业证书编号
        }
    });
    //姓名
    $("#stuName").change(function(){
        $("#originalStudentname").val($(this).val());
    });
    //证件类型
    $("#idCard").change(function(){
        $("#oldCardId").val($(this).val());
    });
    //原专业层次
    $("#spLevel").change(function(){changeEvent.orgspecialtyLevel();});
    //原专业门类
    $("#spKind").change(function(){changeEvent.orgspecialtyKind();});
    //省份
    $("#provinces").change(function(){changeEvent.provinces();});
    //市
    $("#citys").change(function(){changeEvent.citys();});
    //证件号
    $("#studentIdcard").blur(function(){changeEvent.studentIdcard();});
    $("#provinces").trigger("change");
};

/**
 * 报读招生页面初始化
 * */
function documentready_zhaoshengbaodu(prefix){
    $prefix = prefix || $prefix;
    majorCascade($prefix,"spLevel","spKind","spSubject");
    changeController.clear_studleid_label();
    changeController.clear_newspecialtyKind_label();
    changeController.clear_specialty_label();
    changeController.clear_teachingName_label();


    changeController.init(function(){
        //学生批次
        $("#pici").change(function(){changeController.init(changeController.loadstudycenter);});
        //学生类型
        $("#leixin").change(function(){
            changeController.init(changeController.loadstudycenter);
            requiredLabels2($("#leixin").val(),$("#studleid").val());
            var sourcexl=$("#sourcexl").val();
            var currentxl=$("#leixin").find("option:selected").attr("currentxl");
            if (sourcexl==0 && currentxl==1){
                $(".xuelitable").show();
                window.parent.$("#menuFrame").load();//报读添加增加高度
            }
            else{
                $(".xuelitable").hide();
            }
        });
        //负责人
        $("#responsible").change(function(){changeController.init(changeController.loadstudycenter);});
        //教学点
        $("#teachingName").change(function(){changeController.loadspecialtylevel();});
        //专业层次
        $("#studleid").change(function(){changeController.loadspecialty();requiredLabels2($("#leixin").val(),$("#studleid").val());});
        //专业
        $("#specialty").change(function(){changeController.loadandselectspecialtykind();});
        //专业门类
        $("#newspecialtyKind").change(function(){});
        changeController.init(changeController.loadstudycenter);
        //获取专业层次,报读专科不是必填
        requiredLabels2($("#leixin").val(),$("#studleid").val());
        if (sourcexl==0 && currentxl==1){
            $(".xuelitable").show();
            window.parent.$("#menuFrame").load();//报读添加增加高度
        }
        else{
            $(".xuelitable").hide();
        }

    });

    //原学历证明材料
    $("#originalLevidence").change(function(){
        var txt = $("#originalLevidence").find("option:selected").text();//原学历证明材料名称
        if (txt=="学历网查"){
            $("#orgverId").val($("#grNo").val());//证明材料编号==原学历毕业证书编号
        }
        else{
            $("#orgverId").val("");
        }
    });
    //原学历毕业证书编号
    $("#grNo").change(function(){
        var txt = $("#originalLevidence").find("option:selected").text();
        if (txt=="学历网查"){
            $("#orgverId").val($("#grNo").val());//证明材料编号==原学历毕业证书编号
        }
    });
    //姓名
    $("#stuName").change(function(){
        $("#originalStudentname").val($(this).val());
    });
    //证件类型
    $("#idCard").change(function(){
        $("#oldCardId").val($(this).val());
    });
    //原专业层次
    $("#spLevel").change(function(){changeEvent.orgspecialtyLevel();});
    //原专业门类
    $("#spKind").change(function(){changeEvent.orgspecialtyKind();});
    //省份
    $("#provinces").change(function(){changeEvent.provinces();});
    //证件号
    $("#studentIdcard").blur(function(){changeEvent.studentIdcard();});
}

/**
 * 新增招生页面初始化
 * */
function documentready_zhaoshengtianjia(prefix){
    $prefix = prefix || $prefix;
    majorCascade($prefix,"spLevel","spKind","spSubject");
    changeController.clear_studleid_label();
    changeController.clear_newspecialtyKind_label();
    changeController.clear_specialty_label();
    changeController.clear_teachingName_label();
    //学生批次
    $("#pici").change(function(){changeController.init(changeController.loadstudycenter);});
    //学生类型
    $("#leixin").change(function(){changeController.init(changeController.loadstudycenter);});
//	$("#leixin").change(function(){changeController.init(
//			function (){
//				changeController.loadstudycenter(
//						function(){
//							requiredLabels2($("#leixin").val(),$("#studleid").val());
//							})
//			})
//	});
    //负责人
    $("#responsible").change(function(){changeController.init(changeController.loadstudycenter);});
    //教学点
    $("#teachingName").change(function(){
        var isshengxiao=$("#issehngxiao").val();
        if (isshengxiao!='1'){
            var batchname = $("#pici").find("option:selected").text();
            var recruitBatchId=$("#pici").val();
            var typename = $("#leixin").find("option:selected").text();
            var recruitTypeId=$("#leixin").val();
            var teachingName = $("#teachingName").find("option:selected").text();
            var studyCenterId=$("#teachingName").val();
            if(!studyCenterId) return;
            if(!recruitBatchId) return;
            if(!recruitTypeId) return;
            //判断是否在该教学点招生时间范围内
            var allow=false;
            $.ajax({
                url:$prefix + "zhao-sheng-ji-hua/jiaoxuedianallowcheck",
                type:"GET",
                data:{'studyCenterId':studyCenterId,'recruitTypeId':recruitTypeId,'recruitBatchId':recruitBatchId},
                async:false,
                success:function(result){
                    allow=result=='true';
                }
            });
            if (!allow){
                alert("无法录入新生，未在招生时间范围内，请联系省校处理");return;
            }
        }

        changeController.loadspecialtylevel();
    });
    //专业层次
    $("#studleid").change(function(){changeController.loadspecialty(function(){requiredLabels2($("#leixin").val(),$("#studleid").val());});});
    //专业
    $("#specialty").change(function(){
        changeController.loadandselectspecialtykind();
    });
    //专业门类
    $("#newspecialtyKind").change(function(){});

    //原学历证明材料
    $("#originalLevidence").change(function(){
        var txt = $("#originalLevidence").find("option:selected").text();//原学历证明材料名称
        if (txt=="学历网查"){
            $("#orgverId").val($("#grNo").val());//证明材料编号==原学历毕业证书编号
        }
        else{
            $("#orgverId").val("");
        }
    });
    //原学历毕业证书编号
    $("#grNo").change(function(){
        var txt = $("#originalLevidence").find("option:selected").text();
        if (txt=="学历网查"){
            $("#orgverId").val($("#grNo").val());//证明材料编号==原学历毕业证书编号
        }
    });
    //姓名
    $("#stuName").change(function(){
        $("#originalStudentname").val($(this).val());
    });
    //证件类型
    $("#idCard").change(function(){
        $("#oldCardId").val($(this).val());
    });
    //原专业层次
    $("#spLevel").change(function(){changeEvent.orgspecialtyLevel();});
    //原专业门类
    $("#spKind").change(function(){changeEvent.orgspecialtyKind();});
    //省份
    $("#provinces").change(function(){changeEvent.provinces();});
    //证件号
    $("#studentIdcard").blur(function(){changeEvent.studentIdcard();});


};

/**
 * 新增招生修改
 * */
function documentready_zhaoshengxiugai(prefix){
    $prefix = prefix || $prefix;
    majorCascade($prefix,"spLevel","spKind","spSubject");
    changeController.init(function(){
        //学生批次
        $("#pici").change(function(){changeController.init(changeController.loadstudycenter);});
        //学生类型
        $("#leixin").change(function(){changeController.init(changeController.loadstudycenter);requiredLabels2($("#leixin").val(),$("#studleid").val());});
        //负责人
        $("#responsible").change(function(){changeController.init(changeController.loadstudycenter);});
        //教学点
        $("#teachingName").change(function(){changeController.loadspecialtylevel();});
        //专业层次
        $("#studleid").change(function(){changeController.loadspecialty();requiredLabels2($("#leixin").val(),$("#studleid").val());});
        //专业
        $("#specialty").change(function(){changeController.loadandselectspecialtykind();});
        //专业门类
        $("#newspecialtyKind").change(function(){});
        //获取专业层次,报读专科不是必填
        requiredLabels2($("#leixin").val(),$("#studleid").val());
    });


    //原学历证明材料
    $("#originalLevidence").change(function(){
        var txt = $("#originalLevidence").find("option:selected").text();//原学历证明材料名称
        if (txt=="学历网查"){
            $("#orgverId").val($("#grNo").val());//证明材料编号==原学历毕业证书编号
        }
        else{
            $("#orgverId").val("");
        }
    });
    //原学历毕业证书编号
    $("#grNo").change(function(){
        var txt = $("#originalLevidence").find("option:selected").text();
        if (txt=="学历网查"){
            $("#orgverId").val($("#grNo").val());//证明材料编号==原学历毕业证书编号
        }
    });
    //姓名
    $("#stuName").change(function(){
        $("#originalStudentname").val($(this).val());
    });
    //证件类型
    $("#idCard").change(function(){
        $("#oldCardId").val($(this).val());
    });
    //原专业层次
    $("#spLevel").change(function(){changeEvent.orgspecialtyLevel();});
    //原专业门类
    $("#spKind").change(function(){changeEvent.orgspecialtyKind();});
    //省份
    $("#provinces").change(function(){changeEvent.provinces();});
    //证件号
    $("#studentIdcard").blur(function(){changeEvent.studentIdcard();});

};

/**
 *  遮罩层
 *  */
var mask={
    show:function(msg){
        msg = msg || "正在导入,请稍等...";
        mask.hide();
        $('html').append("<div id='mask_FK'><div id='sending' style='filter:alpha(opacity=80); position:absolute; top:40%; left:30%; z-index:10; width: 50%; height: 50%;'><TABLE WIDTH=80% BORDER=0 CELLSPACING=0 CELLPADDING=0><TR><td width=30%></td><TD bgcolor=#104A7B><TABLE WIDTH=100% height=80 BORDER=0 CELLSPACING=2 CELLPADDING=0><TR><td bgcolor=#eeeeee align=center id='jindu'>" + msg + "</td></tr></table></td><td width=30%></td></tr></table></div></div>");
        var maskObject = $("#mask_FK");
        maskObject.css("display","none");
        maskObject.css("position","absolute");
        maskObject.css("top","0%");
        maskObject.css("left","0%");
        maskObject.css("width","100%");
        maskObject.css("height","100%");
        maskObject.css("background-color","#ffffff");
        maskObject.css("z-index","1001");
        maskObject.css("-moz-opacity","0.7");
        maskObject.css("opacity",".70");
        maskObject.css("filter","alpha(opacity=70)");
        maskObject.css("display","block");
    },
    hide:function(){
        $('html').find($("#mask_FK")).remove();
    }
};

/**
 * 文件上传控制器
 * */
var uploader=function(){
    var that = this;
    this._tempfiles=[];
    this._counter=0;
    this._createTempElementId=function(){
        return "tempfile_uploader_" + (++this._counter);
    };
    this._createTempElement=function(id){
        return "<input accept='image/gif,image/jpeg,image/png'  type='file' id='" + id +  "' name='file' class='tempfile-uploader' style='display:none;'/>";
    };
    this._clearUselessElement=function(){
        $(".tempfile-uploader").each(function(){
            var file = $(this).val();
            if (!file){
                $(this).remove();
            }
        });
    };
    this.add=function(callback){
        this._clearUselessElement();
        var id = this._createTempElementId();
        var temp = this._createTempElement(id);
        $('body').append(temp);
        var $temp=$('#' + id);
        $temp.change(function(){
            var file = $(this).val();
            var success = !!file;
            if (success){
                var pos = file.lastIndexOf("\\");
                var filename=file.substring(pos+1);
                that._tempfiles.push(id);
            }
            else{
                setTimout(function(){$temp.remove();},200);
            }
            if (typeof callback == 'function'){callback(success,id,filename);}
        });
        $temp.click();
    };
    this.remove=function(id){
        if (!!id){
            for (var i = 0; i < this._tempfiles.length; i++) {
                if (this._tempfiles[i] == id) {
                    this._tempfiles.splice(i, 1);
                    break;
                }
            }
            $("#" + id).remove();
        }
    };
    this.upload=function(fileid,url,callback){
        if (!url) return;
        $.ajaxFileUpload({
            url : url,
            secureuri : false, //一般设置为false
            fileElementId : fileid,
            type : 'POST',
            dataType : 'json', //返回值类型 一般设置为json
            success : function(data, status) //服务器成功响应处理函数
            {
                if (typeof callback == 'function'){callback(true,data,fileid);}
            },
            error : function(data, status, e)//服务器响应失败处理函数
            {
                if (typeof callback == 'function'){callback(false,data,fileid);}
            }
        });
    };
};
function downloadup (id) {
    debugger;
    console.log(id);
    var regx = /^[0-9]*$/;
    if(!regx.test(id)){
        alert("未保存，无法下载");
        return;
    }else{
        var url = $prefix+"aliOss/download/studentFile?fileId="+id;
        window.location.href=url;
    }
}

var count = 1;
jQuery(function($) {
    //alert("77")

    /*$('#my').bind(
        'mousewheel', function(event, delta) {
            var dir = delta > 0 ? 'Up' : 'Down';
            if (dir == 'Up'){
                count++;
                $("#my").html("向上滚动:"+count);
            } else {
                count--;
                $("#my").html("向下滚动:"+count);
            }
            return false;
        });*/

    $('#my').bind(
        'mousewheel', function(event, delta) {
            console.log("roll");
            var dir = delta > 0 ? 'Up' : 'Down';
            if (dir == 'Up'){
                scrollRatio += 5;
                if(scrollRatio>100){
                    scrollRatio = 100;
                }
                // count++;
                // $("#my").html("向上滚动:"+count);
            } else {
                scrollRatio -= 5;
                if(scrollRatio<smallScrollRatio){
                    scrollRatio = smallScrollRatio;
                }
                // count--;
                // $("#my").html("向下滚动:"+count);
            }
            $("#my").attr("class",scrollRatio +","+ smallScrollRatio);
            return false;
        });

    /*$('#smallImg').bind(
        'mousewheel', function(event, delta) {
        	//console.log("roll");
            var dir = delta > 0 ? 'Up' : 'Down';
            if (dir == 'Up'){
                scrollRatio += 5;
                if(scrollRatio>100){
                    scrollRatio = 100;
				}
                // count++;
                // $("#my").html("向上滚动:"+count);
            } else {
                scrollRatio -= 5;
                if(scrollRatio<smallScrollRatio){
                    scrollRatio = smallScrollRatio;
                }
                // count--;
                // $("#my").html("向下滚动:"+count);
            }
            $("#smallImg").attr("class",scrollRatio +","+ smallScrollRatio);
            return false;
        });*/
});



/**
 * 文件条目
 * */
function uploadviewitem(opts){
    opts = opts || {};
    if (!opts.view) return;
    if (!opts.id) return;
    var fileId=opts.id;
    this.id = opts.id;
    this.view = opts.view;
    this.name = opts.name;
    this._del_id='del_' + this.id;
    this._up_id='up_' + this.id;
    this._dn_id='dn_' + this.id;
    this._img_id='img_' + this.id;
    this.del_element = '<div class="col-sm-3 col-md-3 col-lg-4"><a up="' + this.id + '" id="' + this._del_id + '" href="javascript:void(0)" class="btn btn-default btn-sm"><i class="fa fa-minus-square"></i>删除</a></div>';
    this.up_element= '<div class="col-sm-3 col-md-3 col-lg-4"><a up="' + this.id + '" id="' + this._up_id + '" href="javascript:void(0)" class="btn btn-default btn-sm"><i class="fa fa-plus-square"></i>上传</a></div>';
    this.dn_element = '<div class="col-sm-3 col-md-3 col-lg-4"><a up="' + this.id + '" id="' + this._dn_id + '" href="" class="btn btn-default btn-sm" download="' + this.name + '" onclick="downloadup('+this.id+')"><i class="fa fa-download"></i>下载</a></div>';
    this.img_element='<a class="image-popup-vertical-fit"><img src up="' + this.id + '" id="' + this._img_id + '" width="75" height="75"></a>';
    this.label_element = "<a>" + this.name + "</a>";
    this.tr_element="<tr id='tr_" + this.id + "'><td></td><td>" + this.img_element + "</td><td colspan='4'>" + this.label_element + "</td><td>" +  this.up_element + this.dn_element + "</td><td>" + this.del_element + "</td></tr>";
    $("#" + this.view).append(this.tr_element);
    this.$tr = $('#tr_' + this.id);
    this.$del = $("#" + this._del_id);
    this.$download = $("#" + this._dn_id);
    this.$upload = $("#" + this._up_id);
    this.$img=$("#" + this._img_id);
    this.uploaded=false;
    this.filepath=undefined;
    this.upload_success=function(data){
        if (!data) return;
        // this.$download.attr('code',data.path);
        //this.$download.attr('href',$prefix+"aliOss/download/studentFile?fileId="+this.id);
        this.$download.removeAttr('href');
        this.$download.attr('code',data.code);
        this.$img.attr('src',data.path);
        $(this.$img).closest("a").attr('href',data.path);
        this.downstatus();
        this.uploaded=true;
        this.filepath = data.path;


        //图片查看初始化
        if ($("#uploadPhotoWrap").size()==0) {
            //无内容，初始化
            $("body").append('<style type="text/css">#uploadPhotoWrap .modal-body{position:relative;height:600px;}#uploadPhotoWrap #smallImg{position:absolute;max-width:94%;max-height:94%;}#uploadPhotoWrap .modal-footer{text-align:center;} #uploadPhotoWrap #bigDiv{position:absolute;margin:5px;border: 2px solid red; width:404px; height:404px; left:600px; top:100px; overflow:hidden;}  #bigImgFullDiv{position:relative; left:0px; top:0px; z-index: -9999; /*overflow:hidden;*/} /*#smallImgFullDiv{*//*position:relative; left:0px; top:0px;*/ /*overflow:hidden;*//*}*/ #uploadPhotoWrap #bigImgFullDiv #bigImg{position:absolute;} #moveDiv{ pointer-events: none; border: 2px solid red;position: absolute; z-index: 999; background-color: #fff; filter: Alpha(Opacity=20); opacity:0.2; /*display: none;*/}</style><div id="uploadPhotoWrap" class="modal-dialog mfp-hide"><div class="modal-content"><div class="modal-header"><button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button><h4 class="modal-title">图片预览</h4></div><div class="modal-body"><img src="#" id="smallImg"><div id="moveDiv"></div></div><div class="modal-footer"><button type="button" class="btn btn-primary left">顺时针旋转90度</button><button type="button" class="btn btn-primary right">逆时针旋转90度</button></div></div><div id="bigDiv"><div id="bigImgFullDiv"><img id="bigImg" src="#"></div></div></div>');

            //图片对象
            var $photo  = $("#uploadPhotoWrap").find("img").eq(0);
            var $bigImg  = $("#uploadPhotoWrap").find("img").eq(1);

            $photo.attr("data",0);
            $bigImg.attr("data",0);
            var bigImgWidth = 0;
            var bigImgHeight = 0;
            //大图百分百时的宽度，固定不变
            var bigImgWidthFinal = 0;
            //大图百分百时的高度，固定不变
            var bigImgHeightFinal = 0;
            var maxSize = 0;
            var minSize = 0;

            var smallImgOffsetLeft = 0;
            var smallImgOffsetTop = 0;
            var smallImgOffsetLeftFinal = 0;
            var smallImgOffsetTopFinal = 0;
            var smallImgOffsetTopResult = 0;
            var smallImgOffsetLeftResult = 0;
            var smallImgWidth = 0;
            var smallImgHeight = 0;
            var smallMaxSize = 0;
            //直角偏移尺寸
            var rightAngleSize = 0;
            //大图相对于小图的比例
            var ratio = 1;
            //选取框正方形边长
            var moveDivLengthSide = 400;
            $photo.load(function(){
                var $this = $(this);
                $this.css("top",300 - $this.height()/2);
                $this.css("left", 300 - $this.width()/2);
                $bigImg.css("top",0);
                $bigImg.css("left", 0);
                bigImgWidth = $bigImg.width();
                bigImgHeight = $bigImg.height();

                //大图百分百时的宽度，固定不变
                bigImgWidthFinal = $bigImg.width();
                //大图百分百时的高度，固定不变
                bigImgHeightFinal = $bigImg.height();

                rightAngleSize = (bigImgWidth - bigImgHeight)/2;
                maxSize = bigImgWidth;
                minSize = bigImgHeight;
                if(bigImgWidth<bigImgHeight){
                    maxSize = bigImgHeight;
                    minSize = bigImgWidth;
                }


                smallImgOffsetLeft = $photo[0].offsetLeft;
                smallImgOffsetTop = $photo[0].offsetTop;
                smallImgOffsetLeftFinal = $photo[0].offsetLeft;
                smallImgOffsetTopFinal = $photo[0].offsetTop;
                // alert(smallImgOffsetLeft+"---"+smallImgOffsetTop);
                smallImgWidth = $photo.width();
                smallImgHeight = $photo.height();
                smallMaxSize = smallImgWidth;
                if(smallImgWidth<smallImgHeight){
                    smallMaxSize = smallImgHeight;
                }
                $("#bigImgFullDiv").width(maxSize);
                $("#bigImgFullDiv").height(maxSize);
                $("#bigImgFullDiv").css("top", 0);
                $("#bigImgFullDiv").css("left", 0);
                if(smallImgWidth!=0){
                    ratio = bigImgWidth / smallImgWidth;
                }
                if(ratio!=0){
                    moveDivLengthSide = 400/ratio;
                }

                if(minSize>0){
                    smallScrollRatio = Math.ceil(400/minSize*100);
                }


                $("#moveDiv").width(moveDivLengthSide);
                $("#moveDiv").height(moveDivLengthSide);
                $("#moveDiv").css("top", smallImgOffsetTop);
                $("#moveDiv").css("left", smallImgOffsetLeft);
            });

            //关闭按钮
            $("#uploadPhotoWrap .close").click(function () {
                $.magnificPopup.close();
            });

            $photo[0].onmousemove=t1onmousemove;
            function t1onmousemove(e) {
                // $("#moveDiv").css("display","block");
                var eventResult = e || event;
                //小图纵向偏移量
                var smallImgTopSize = eventResult.offsetY;
                //小图横向偏移量
                var smallImgLeftSize = eventResult.offsetX;
                $("#smallImg").attr("class",smallImgLeftSize +","+ smallImgTopSize);


                //鼠标在图片上移动事件
                smallImgMove();

            }

            //鼠标滚轮放大事件
            jQuery(function($) {
                $('#smallImg').bind(
                    'mousewheel', function(event, delta) {
                        var dir = delta > 0 ? 'Up' : 'Down';
                        if (dir == 'Up'){
                            scrollRatio += 5;
                            if(scrollRatio>100){
                                scrollRatio = 100;
                            }
                        } else {
                            scrollRatio -= 5;
                            if(scrollRatio<smallScrollRatio){
                                scrollRatio = smallScrollRatio;
                            }
                        }

                        bigImgWidth = bigImgWidthFinal * scrollRatio/100;
                        bigImgHeight = bigImgHeightFinal * scrollRatio/100;
                        rightAngleSize = (bigImgWidth - bigImgHeight)/2;
                        maxSize = bigImgWidth;
                        minSize = bigImgHeight;
                        if(bigImgWidth<bigImgHeight){
                            maxSize = bigImgHeight;
                            minSize = bigImgWidth;
                        }

                        smallImgWidth = $photo.width();
                        smallImgHeight = $photo.height();
                        smallMaxSize = smallImgWidth;
                        if(smallImgWidth<smallImgHeight){
                            smallMaxSize = smallImgHeight;
                        }
                        $("#bigImg").width(bigImgWidth);
                        $("#bigImg").height(bigImgHeight);

                        var rDegree = parseInt($photo.attr("data"));

                        //位置居中
                        switch (rDegree % 360) {
                            case 0:
                                $bigImg.css("top",0);
                                $bigImg.css("left", 0);
                                break;
                            case 180:
                            case -180:
                                $bigImg.css("top",0);
                                $bigImg.css("left", 0);
                                break;
                            case 90:
                            case -270:
                                $bigImg.css("top",rightAngleSize);
                                $bigImg.css("left", 0 - rightAngleSize);
                                break;
                            case 270:
                            case -90:
                                $bigImg.css("top",rightAngleSize);
                                $bigImg.css("left", 0 - rightAngleSize);
                                break;
                        }

                        $("#bigImgFullDiv").width(maxSize);
                        $("#bigImgFullDiv").height(maxSize);
                        if(smallImgWidth!=0){
                            ratio = bigImgWidth / smallImgWidth;
                        }
                        if(ratio!=0){
                            moveDivLengthSide = 400/ratio;
                        }

                        $("#moveDiv").width(moveDivLengthSide);
                        $("#moveDiv").height(moveDivLengthSide);

                        smallImgMove();
                        return false;
                    });
            });

            //鼠标在图片上移动事件
            function smallImgMove(){
                //小图纵向偏移量
                var smallImgTopSize = 0;
                //小图横向偏移量
                var smallImgLeftSize = 0;

                var smallImgMoveSize = $("#smallImg").attr("class");
                if((typeof(smallImgMoveSize)!="undefined") && (smallImgMoveSize.trim() !="")){
                    var smallImgMoveSizeArray = smallImgMoveSize.split(",");
                    if(smallImgMoveSizeArray.length==2){
                        smallImgLeftSize = smallImgMoveSizeArray[0]*1;
                        smallImgTopSize = smallImgMoveSizeArray[1]*1;
                    }
                }

                //大图纵向偏移量
                var bigImgTopSize = 0;
                //大图横向偏移量
                var bigImgLeftSize= 0;
                var rDegree = parseInt($photo.attr("data"));

                switch (rDegree % 360) {
                    case 0:
                        //大图纵向偏移量, 为了使得鼠标处文字在放大图中居中,宽高各减去半个放大框尺寸
                        bigImgTopSize = smallImgTopSize * ratio -200;
                        //大图横向偏移量, 为了使得鼠标处文字在放大图中居中,宽高各减去半个放大框尺寸
                        bigImgLeftSize= smallImgLeftSize * ratio -200;

                        //选取框纵向偏移量, 为了使得鼠标处文字在放选取框居中,宽高各减去半个选取框尺寸
                        smallImgOffsetTopResult = smallImgOffsetTop + smallImgTopSize - moveDivLengthSide/2;
                        //选取框横向偏移量, 为了使得鼠标处文字在放选取框居中,宽高各减去半个选取框尺寸
                        smallImgOffsetLeftResult = smallImgOffsetLeft + smallImgLeftSize - moveDivLengthSide/2;
                        //边界处理
                        if(bigImgTopSize<0){
                            bigImgTopSize = 0;
                        }
                        if(bigImgLeftSize<0){
                            bigImgLeftSize = 0;
                        }
                        if(bigImgTopSize + 400 > bigImgHeight){
                            bigImgTopSize = bigImgHeight - 400;
                        }
                        if(bigImgLeftSize + 400 > bigImgWidth){
                            bigImgLeftSize = bigImgWidth - 400;
                        }

                        if(smallImgOffsetTopResult<smallImgOffsetTop){
                            smallImgOffsetTopResult = smallImgOffsetTop;
                        }
                        if(smallImgOffsetLeftResult<smallImgOffsetLeft){
                            smallImgOffsetLeftResult = smallImgOffsetLeft;
                        }
                        if(smallImgOffsetTopResult + moveDivLengthSide + 4 > smallImgOffsetTop + smallImgHeight){
                            smallImgOffsetTopResult = smallImgOffsetTop + smallImgHeight - moveDivLengthSide - 4;
                        }
                        if(smallImgOffsetLeftResult + moveDivLengthSide + 4 > smallImgOffsetLeft + smallImgWidth){
                            smallImgOffsetLeftResult = smallImgOffsetLeft + smallImgWidth - moveDivLengthSide - 4;
                        }
                        bigImgTopSize = 0 - bigImgTopSize;
                        bigImgLeftSize= 0 - bigImgLeftSize;
                        break;
                    case 180:
                    case -180:
                        //小图纵向偏移量
                        smallImgTopSize = smallImgHeight - smallImgTopSize;
                        //小图横向偏移量
                        smallImgLeftSize = smallImgWidth - smallImgLeftSize;

                        //选取框纵向偏移量, 为了使得鼠标处文字在放选取框居中,宽高各减去半个选取框尺寸
                        smallImgOffsetTopResult = smallImgOffsetTop + smallImgTopSize - moveDivLengthSide/2;
                        //选取框横向偏移量, 为了使得鼠标处文字在放选取框居中,宽高各减去半个选取框尺寸
                        smallImgOffsetLeftResult = smallImgOffsetLeft + smallImgLeftSize - moveDivLengthSide/2;

                        //大图纵向偏移量, 为了使得鼠标处文字在放大图中居中,宽高各减去半个放大框尺寸
                        bigImgTopSize = smallImgTopSize * ratio -200;
                        //大图横向偏移量, 为了使得鼠标处文字在放大图中居中,宽高各减去半个放大框尺寸
                        bigImgLeftSize= smallImgLeftSize * ratio -200;

                        //边界处理
                        if(bigImgTopSize<0){
                            bigImgTopSize = 0;
                        }
                        if(bigImgLeftSize<0){
                            bigImgLeftSize = 0;
                        }
                        if(bigImgTopSize + 400 > bigImgHeight){
                            bigImgTopSize = bigImgHeight - 400;
                        }
                        if(bigImgLeftSize + 400 > bigImgWidth){
                            bigImgLeftSize = bigImgWidth - 400;
                        }

                        if(smallImgOffsetTopResult<smallImgOffsetTop){
                            smallImgOffsetTopResult = smallImgOffsetTop;
                        }
                        if(smallImgOffsetLeftResult<smallImgOffsetLeft){
                            smallImgOffsetLeftResult = smallImgOffsetLeft;
                        }
                        if(smallImgOffsetTopResult + moveDivLengthSide + 4 > smallImgOffsetTop + smallImgHeight){
                            smallImgOffsetTopResult = smallImgOffsetTop + smallImgHeight - moveDivLengthSide - 4;
                        }
                        if(smallImgOffsetLeftResult + moveDivLengthSide + 4 > smallImgOffsetLeft + smallImgWidth){
                            smallImgOffsetLeftResult = smallImgOffsetLeft + smallImgWidth - moveDivLengthSide - 4;
                        }

                        bigImgTopSize = 0 - bigImgTopSize;
                        bigImgLeftSize= 0 - bigImgLeftSize;
                        break;
                    case 90:
                    case -270:
                        //小图纵向偏移量
                        smallImgTopSize = smallImgHeight - smallImgTopSize;

                        //选取框纵向偏移量, 为了使得鼠标处文字在放选取框居中,宽高各减去半个选取框尺寸
                        smallImgOffsetTopResult = smallImgOffsetTop + smallImgLeftSize - moveDivLengthSide/2;
                        //选取框横向偏移量, 为了使得鼠标处文字在放选取框居中,宽高各减去半个选取框尺寸
                        smallImgOffsetLeftResult = smallImgOffsetLeft + smallImgTopSize - moveDivLengthSide/2;

                        //大图纵向偏移量, 为了使得鼠标处文字在放大图中居中,宽高各减去半个放大框尺寸
                        bigImgTopSize = smallImgLeftSize * ratio -200;
                        //大图横向偏移量, 为了使得鼠标处文字在放大图中居中,宽高各减去半个放大框尺寸
                        bigImgLeftSize= smallImgTopSize * ratio -200;

                        //边界处理
                        if(bigImgTopSize<0){
                            bigImgTopSize = 0;
                        }
                        if(bigImgLeftSize<0){
                            bigImgLeftSize = 0;
                        }
                        if(bigImgTopSize + 400 > bigImgWidth){
                            bigImgTopSize = bigImgWidth - 400;
                        }
                        if(bigImgLeftSize + 400 > bigImgHeight){
                            bigImgLeftSize = bigImgHeight - 400;
                        }

                        if(smallImgOffsetTopResult<smallImgOffsetTop){
                            smallImgOffsetTopResult = smallImgOffsetTop;
                        }
                        if(smallImgOffsetLeftResult<smallImgOffsetLeft){
                            smallImgOffsetLeftResult = smallImgOffsetLeft;
                        }
                        if(smallImgOffsetTopResult + moveDivLengthSide + 4 > smallImgOffsetTop + smallImgWidth){
                            smallImgOffsetTopResult = smallImgOffsetTop + smallImgWidth - moveDivLengthSide - 4;
                        }
                        if(smallImgOffsetLeftResult + moveDivLengthSide + 4 > smallImgOffsetLeft + smallImgHeight){
                            smallImgOffsetLeftResult = smallImgOffsetLeft + smallImgHeight - moveDivLengthSide - 4;
                        }

                        bigImgTopSize = 0 - bigImgTopSize;
                        bigImgLeftSize= 0 - bigImgLeftSize;

                        break;
                    case 270:
                    case -90:
                        //小图横向偏移量
                        smallImgLeftSize = smallImgWidth - smallImgLeftSize;

                        //选取框纵向偏移量, 为了使得鼠标处文字在放选取框居中,宽高各减去半个选取框尺寸
                        smallImgOffsetTopResult = smallImgOffsetTop + smallImgLeftSize - moveDivLengthSide/2;
                        //选取框横向偏移量, 为了使得鼠标处文字在放选取框居中,宽高各减去半个选取框尺寸
                        smallImgOffsetLeftResult = smallImgOffsetLeft + smallImgTopSize - moveDivLengthSide/2;

                        //大图纵向偏移量, 为了使得鼠标处文字在放大图中居中,宽高各减去半个放大框尺寸
                        bigImgTopSize = smallImgLeftSize * ratio -200;
                        //大图横向偏移量, 为了使得鼠标处文字在放大图中居中,宽高各减去半个放大框尺寸
                        bigImgLeftSize= smallImgTopSize * ratio -200;

                        //边界处理
                        if(bigImgTopSize<0){
                            bigImgTopSize = 0;
                        }
                        if(bigImgLeftSize<0){
                            bigImgLeftSize = 0;
                        }
                        if(bigImgTopSize + 400 > bigImgWidth){
                            bigImgTopSize = bigImgWidth - 400;
                        }
                        if(bigImgLeftSize + 400 > bigImgHeight){
                            bigImgLeftSize = bigImgHeight - 400;
                        }

                        if(smallImgOffsetTopResult<smallImgOffsetTop){
                            smallImgOffsetTopResult = smallImgOffsetTop;
                        }
                        if(smallImgOffsetLeftResult<smallImgOffsetLeft){
                            smallImgOffsetLeftResult = smallImgOffsetLeft;
                        }
                        if(smallImgOffsetTopResult + moveDivLengthSide + 4 > smallImgOffsetTop + smallImgWidth){
                            smallImgOffsetTopResult = smallImgOffsetTop + smallImgWidth - moveDivLengthSide - 4;
                        }
                        if(smallImgOffsetLeftResult + moveDivLengthSide + 4 > smallImgOffsetLeft + smallImgHeight){
                            smallImgOffsetLeftResult = smallImgOffsetLeft + smallImgHeight - moveDivLengthSide - 4;
                        }
                        bigImgTopSize = 0 - bigImgTopSize;
                        bigImgLeftSize= 0 - bigImgLeftSize;
                        break;
                }

                $("#moveDiv").css("top", smallImgOffsetTopResult);
                $("#moveDiv").css("left", smallImgOffsetLeftResult);

                $("#bigImgFullDiv").css("bottom","");
                $("#bigImgFullDiv").css("right","");
                $("#bigImgFullDiv").css("top", bigImgTopSize);
                $("#bigImgFullDiv").css("left", bigImgLeftSize);
            }





            //旋转按钮
            $("#uploadPhotoWrap .modal-footer button").click(function() {
                //旋转角度计算
                var rDegree = parseInt($photo.attr("data"));
                if ($(this).hasClass("left")) {
                    rDegree = rDegree + 90;
                } else {
                    rDegree = rDegree - 90;
                }
                var difference = (maxSize - minSize);
                //旋转
                $photo.attr("style","transform:rotate(" + rDegree + "deg);");
                $photo.attr("data",rDegree);
                $bigImg.attr("style","transform:rotate(" + rDegree + "deg);");
                $bigImg.attr("data",rDegree);

                $("#bigImg").width(bigImgWidth);
                $("#bigImg").height(bigImgHeight);
                $("#smallImg").removeAttr("class");
                var smallImgWidth = $photo.width();
                var bigImgWidth = $bigImg.width();
                //位置居中
                switch (rDegree % 360) {
                    case 0:
                        $photo.css("top",300 - $photo.height()/2);
                        $photo.css("left", 300 - $photo.width()/2);
                        $bigImg.css("top",0);
                        $bigImg.css("left", 0);
                        smallImgOffsetLeft = smallImgOffsetLeftFinal;
                        smallImgOffsetTop = smallImgOffsetTopFinal;
                        $("#moveDiv").css("top", smallImgOffsetTop);
                        $("#moveDiv").css("left", smallImgOffsetLeft);
                        $("#bigImgFullDiv").css("top", 0);
                        $("#bigImgFullDiv").css("left", 0);
                        break;
                    case 180:
                    case -180:
                        $photo.css("top",300 - $photo.height()/2);
                        $photo.css("left", 300 - $photo.width()/2);
                        // $bigImg.css("bottom",difference);
                        // $bigImg.css("left", 0);
                        $bigImg.css("top",0);
                        $bigImg.css("left", 0);
                        $("#bigImgFullDiv").css("top", 0);
                        $("#bigImgFullDiv").css("left", 0);
                        smallImgOffsetLeft = smallImgOffsetLeftFinal;
                        smallImgOffsetTop = smallImgOffsetTopFinal;
                        $("#moveDiv").css("top", smallImgOffsetTop);
                        $("#moveDiv").css("left", smallImgOffsetLeft);
                        break;
                    case 90:
                    case -270:
                        $photo.css("left", 300 - $photo.width()/2);
                        $photo.css("top",300 - $photo.height()/2);
                        // $bigImg.css("right",(maxSize-$bigImg.width())/2);
                        // $bigImg.css("top", (maxSize-$bigImg.height())/2);
                        $bigImg.css("top",rightAngleSize);
                        $bigImg.css("left", 0 - rightAngleSize);
                        $("#bigImgFullDiv").css("top", 0);
                        $("#bigImgFullDiv").css("left", 0);
                        var smallImgOffsetLeftTemp = smallImgOffsetLeftFinal;
                        smallImgOffsetLeft = smallImgOffsetTopFinal;
                        smallImgOffsetTop = smallImgOffsetLeftTemp;
                        $("#moveDiv").css("top", smallImgOffsetTop);
                        $("#moveDiv").css("left", smallImgOffsetLeft);

                        break;
                    case 270:
                    case -90:
                        $photo.css("left", 300 - $photo.width()/2);
                        $photo.css("top",300 - $photo.height()/2);
                        // $bigImg.css("left",0 - (maxSize-$bigImg.width())/2);
                        // $bigImg.css("bottom", (maxSize-$bigImg.height())/2);
                        $bigImg.css("top",rightAngleSize);
                        $bigImg.css("left", 0 - rightAngleSize);
                        $("#bigImgFullDiv").css("top", 0);
                        $("#bigImgFullDiv").css("left", 0);
                        var smallImgOffsetLeftTemp = smallImgOffsetLeftFinal;
                        smallImgOffsetLeft = smallImgOffsetTopFinal;
                        smallImgOffsetTop = smallImgOffsetLeftTemp;
                        $("#moveDiv").css("top", smallImgOffsetTop);
                        $("#moveDiv").css("left", smallImgOffsetLeft);
                        break;
                }

            });
        }

        //弹出事件
        $('.image-popup-vertical-fit').click(function (e) {
            //禁止链接跳转
            e.preventDefault();
            //修改弹出内容
            $("#uploadPhotoWrap").find("img").attr("src", $(this).attr("href"));
            //允许拖动
            $("#uploadPhotoWrap").draggable();
            //立即弹出层
            $.magnificPopup.open({
                items: { src: "#uploadPhotoWrap" },
                type: 'inline',
                mainClass: 'mfp-img-mobile',
                callbacks: {
                    afterClose: function () {
                        $("#uploadPhotoWrap").find("img").attr("src", "").attr("data",0).attr("style","");
                    }
                }
            }, 0);
        });
        //关闭按钮
        $("#uploadPhotoWrap .close").click(function () {
            $.magnificPopup.close();
        });
    };
    this.downstatus=function(){
        this.$upload.closest('div').hide();
        this.$download.closest('div').show();
    };
    this.uploadstatus=function(){
        this.$upload.closest('div').show();
        this.$download.closest('div').hide();
    };

    this.uploadstatus();
};

/**
 * 文件上传前端控制
 * */
function uploadview(opts){
    var thatview = this;
    opts = opts || {};
    this._view = opts.view;
    this._defaulturl=opts.defaulturl;
    this._uploder = new uploader();
    this._items = [];
    this._removeitem=function(item){
        if (!item) return;
        for (var i = 0; i < this._items.length; i++) {
            if (this._items[i] == item) {
                this._items.splice(i, 1);
                break;
            }
        }
    };
    this._additem=function(id,name,url){
        var newItem = new uploadviewitem({view:this._view,id:id,name:name});
        this._items.push(newItem);
        newItem.$del.click(function(){
            thatview._uploder.remove(newItem.id);
            newItem.$tr.remove();
            thatview._removeitem(newItem);
        });
        newItem.$upload.click(function(){
            mask.show("正在上传文件,请耐心等候.");
            thatview._uploder.upload(newItem.id,url,function(success,data){
                mask.hide();
                if (!!success && !!data.success){
                    newItem.upload_success(data);
                }
                else{
                    alert(data.message);
                }
            });
        });
        try{
            var $Iframe = $(window.parent.document.getElementById("menuFrame"));
            var h =$Iframe.height();
            $Iframe.height(h+200);
        }
        catch(err){
            console.log(err);
        }
        return newItem;
    };
    this.newfile=function(url){
        if (!this._view) return;
        url = url || this._defaulturl;
        this._uploder.add(function(success,eleId,filename){
            if (success){
                var newItem = thatview._additem(eleId,filename,url);
                newItem.isNew=true;
            }
        });
    };
    this.addfile=function(filepath){
        thatview._additem(eleId,filename,url);
    };
    this.alluploaded=function(){
        for (var i = 0; i < this._items.length; i++) {
            var item = this._items[i];
            if (!item.uploaded) return false;
        }
        return true;
    };
    this.retrievefiles=function(){
        var files =[];
        for (var i = 0; i < this._items.length; i++) {
            var item = this._items[i];
            if (!!item.filepath) {
                if (item.isNew){
                    files.push({filepath:item.filepath,filename:item.name});
                }
                else{
                    files.push({filepath:item.filepath,filename:item.name});
//	        		files.push({filepath:item.filepath,filename:item.name,id:item.id});
                }
            }
        }
        return JSON.stringify(files);
    };
    this.loadfiles=function(files){
        files = files || [];
        for(i=0;i<files.length;i++){
            var file = files[i];
            if (!!file && !!file.filepath){
                var newItem = thatview._additem(file.id,file.filename,'');
                newItem.upload_success({path:file.filepath});
            }
        }
    };
};

var uv = new uploadview({view:'filelist'});


(function($) {
    var types = ['DOMMouseScroll', 'mousewheel'];
    if ($.event.fixHooks) {
        for ( var i=types.length; i; ) {
            $.event.fixHooks[ types[--i] ] = $.event.mouseHooks;
        }
    }
    $.event.special.mousewheel = {
        setup: function() {
            if ( this.addEventListener ) {
                for ( var i=types.length; i; ) {
                    this.addEventListener( types[--i], handler, false );
                }
            } else {
                this.onmousewheel = handler;
            }
        },

        teardown: function() {
            if ( this.removeEventListener ) {
                for ( var i=types.length; i; ) {
                    this.removeEventListener( types[--i], handler, false );
                }
            } else {
                this.onmousewheel = null;
            }
        }
    };
    $.fn.extend({
        mousewheel: function(fn) {
            return fn ? this.bind("mousewheel", fn) : this.trigger("mousewheel");
        },

        unmousewheel: function(fn) {
            return this.unbind("mousewheel", fn);
        }
    });
    function handler(event) {
        var orgEvent = event || window.event, args = [].slice.call( arguments, 1 ), delta = 0, returnValue = true, deltaX = 0, deltaY = 0;
        event = $.event.fix(orgEvent);
        event.type = "mousewheel";

        // Old school scrollwheel delta
        if ( orgEvent.wheelDelta ) { delta = orgEvent.wheelDelta/120; }
        if ( orgEvent.detail     ) { delta = -orgEvent.detail/3; }

        // New school multidimensional scroll (touchpads) deltas
        deltaY = delta;

        // Gecko
        if ( orgEvent.axis !== undefined && orgEvent.axis === orgEvent.HORIZONTAL_AXIS ) {
            deltaY = 0;
            deltaX = -1*delta;
        }

        // Webkit
        if ( orgEvent.wheelDeltaY !== undefined ) { deltaY = orgEvent.wheelDeltaY/120; }
        if ( orgEvent.wheelDeltaX !== undefined ) { deltaX = -1*orgEvent.wheelDeltaX/120; }

        // Add event and delta to the front of the arguments
        args.unshift(event, delta, deltaX, deltaY);

        return ($.event.dispatch || $.event.handle).apply(this, args);
    }
})(jQuery);

