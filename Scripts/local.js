//打印
var LODOP; //声明为全局变量       
	function myPrint(ele) {
		CreatePrintPage(ele);       
		LODOP.PRINT();		       
	};         
//	function myPrintA() {		       
//		CreatePrintPage();       
//		LODOP.PRINTA();		       
//	};  	       
	function myPreview() {		       
		CreatePrintPage();       
		LODOP.PREVIEW();		       
	};		       
//	function mySetup() {		       
//		CreatePrintPage();       
//		LODOP.PRINT_SETUP();		       
//	};	       
//	function myDesign() {		       
//		CreatePrintPage();       
//		LODOP.PRINT_DESIGN();		       
//	};	       
//	function myBlankDesign() {       
//		LODOP=getLodop();         
// 		LODOP.PRINT_INIT("打印控件功能演示_Lodop功能_空白练习");		       
//		LODOP.PRINT_DESIGN();		       
//	};			       
	function CreatePrintPage(ele) {
		LODOP=getLodop();         
		LODOP.PRINT_INIT("打印控件");       
//		LODOP.ADD_PRINT_RECT(10,10,140,250,1,1);       
		LODOP.SET_PRINT_STYLE("FontSize",19);       
		LODOP.ADD_PRINT_TEXT(20,60,130,30,"#订 单#");       
		LODOP.SET_PRINT_STYLE("FontName","宋体");       
		LODOP.SET_PRINT_STYLE("FontSize",10);		       
		LODOP.ADD_PRINT_TEXT(58,5,200,30,"【订单编号】: "+ele.orderNumber);       
		LODOP.ADD_PRINT_TEXT(96,5,200,30,"【创建时间】: "+format(ele.createTime));       
		LODOP.ADD_PRINT_TEXT(134,5,200,30,"【送达时间】: "+ele.reserveTimeSuffix);
		LODOP.SET_PRINT_STYLE("FontSize",12);
		LODOP.ADD_PRINT_TEXT(172,5,200,20,"收货人: "+ele.consigneeName);
		LODOP.ADD_PRINT_TEXT(200,5,200,40,"收货人手机号: "+ele.consigneeMobile);
		LODOP.SET_PRINT_STYLE("FontSize",10);
		LODOP.ADD_PRINT_TEXT(248,5,200,30,"【收货地址】: "+ele.consigneeInpatient+ele.consigneeStorey+ele.consigneeBedNumber);
		LODOP.SET_PRINT_STYLE("FontSize",14);
		LODOP.ADD_PRINT_TEXT(286,5,200,20,"总计:¥"+ele.orderMoney);
		LODOP.SET_PRINT_STYLE("FontSize",10);
		var o=0;
		for(var i=0;i<ele.hosOrderitems.length;i++){
			LODOP.ADD_PRINT_TEXT(286+(i+1)*28,5,200,30,"【"+ele.hosOrderitems[i].hosGoods.goodsName+"】   数量:"+ele.hosOrderitems[i].count);
			o++;
		}
		LODOP.SET_PRINT_STYLE("FontSize",16);
		LODOP.ADD_PRINT_TEXT(286+(o+1)*28,5,200,150,ele.remark);
		LODOP.SET_PRINT_PAGESIZE(3,500+(o+1)*28,25,"")
	};            
//	function myAddHtml() {       
//		LODOP=getLodop();         
// 		LODOP.PRINT_INIT("");		            
//		LODOP.ADD_PRINT_HTM(10,55,"100%","100%",document.getElementById("textarea01").value);	       
//	};
function add0(m){return m<10?'0'+m:m }
function format(shijianchuo)
{
//shijianchuo是整数，否则要parseInt转换
var time = new Date(shijianchuo);
var y = time.getFullYear();
var m = time.getMonth()+1;
var d = time.getDate();
var h = time.getHours();
var mm = time.getMinutes();
var s = time.getSeconds();
return y+'-'+add0(m)+'-'+add0(d)+' '+add0(h)+':'+add0(mm)+':'+add0(s);
}

function needCLodop(){
    try{
	var ua=navigator.userAgent;
	if (ua.match(/Windows\sPhone/i) !=null) return true;
	if (ua.match(/iPhone|iPod/i) != null) return true;
	if (ua.match(/Android/i) != null) return true;
	if (ua.match(/Edge\D?\d+/i) != null) return true;
	if (ua.match(/QQBrowser/i) != null) return false;
	var verTrident=ua.match(/Trident\D?\d+/i);
	var verIE=ua.match(/MSIE\D?\d+/i);
	var verOPR=ua.match(/OPR\D?\d+/i);
	var verFF=ua.match(/Firefox\D?\d+/i);
	var x64=ua.match(/x64/i);
	if ((verTrident==null)&&(verIE==null)&&(x64!==null)) 
		return true; else
	if ( verFF !== null) {
		verFF = verFF[0].match(/\d+/);
		if ( verFF[0] >= 42 ) return true;
	} else 
	if ( verOPR !== null) {
		verOPR = verOPR[0].match(/\d+/);
		if ( verOPR[0] >= 32 ) return true;
	} else 
	if ((verTrident==null)&&(verIE==null)) {
		var verChrome=ua.match(/Chrome\D?\d+/i);		
		if ( verChrome !== null ) {
			verChrome = verChrome[0].match(/\d+/);
			if (verChrome[0]>=42) return true;
		};
	};
        return false;
    } catch(err) {return true;};
};
