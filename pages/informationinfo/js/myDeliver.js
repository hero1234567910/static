$.ajaxSetup({
    headers: {
        "Content-Type": "application/json;charset=utf-8",
        "token": window.localStorage.getItem('m_token')
    },
    complete: function (res) {
        //console.log(JSON.parse(res.responseText).code);
        if (JSON.parse(res.responseText).code == '401') {
            window.top.location.href = '../../login.html';
        }
    }
});

//根据对象value获取对象key
function findKey (obj,value, compare = (a, b) => a === b) {
    return Object.keys(obj).find(k => compare(obj[k], value))
}
var m_url = location.protocol + '\\\\' + location.hostname + ':' + (location.port == '' ? 80 : location.port);

//根据代码项名称获取代码项
function getCodeValue(){
    var codeValue;
    var par = {};
    par['codeName'] = '信息类别';
    $.ajax({
        async:false,
        url: '/sys/codeValue/getCodeValueToMap',
        contentType: 'application/json;charset=utf-8',
        method: 'get',
        data: par,
        dataType: 'JSON',
        success: function (res) {
            if (res.code = '0') {
                codeValue = res.data;
            } else
                layer.msg(res.msg);
        },
        error: function (jqXHR, textStatus, errorThrown) {

        }
    });
    return codeValue;
}
var arr = [];
$().ready(function () {
    $.ajax({
        url: m_url + '/sys/informationcategory/getCategoryTrees',
        contentType: 'application/json;charset=utf-8',
        method: 'post',
        dataType: 'JSON',
        success: function (res) {
            if (res.code == '0') {
                layui.tree({
                    elem: '#CategoryTrees'
                    , nodes: [{ //节点数据
                        name: '所有栏目'
                        , children: res.data
                    }]
                    , click: function (node) {
                        $.ajax({
                            async: false,
                            url: m_url + '/sys/informationinfo/getInfoByCateGuid/' + node.rowGuid,
                            contentType: 'application/json;charset=utf-8',
                            method: 'get',
                            data: {},
                            dataType: 'JSON',
                            success: function (res) {
                                arr.splice(0, arr.length);
                                if (res.code == '0') {
                                    for (var i = 0; i < res.data.length; i++) {
                                        arr.push(res.data[i]);
                                    }
                                }
                            },
                            error: function (data) {

                            }
                        });
                        console.log(arr);
                        layui.table.reload('testReload', {
                            where: {
                                'categorys': arr.toString()
                            }
                        });
                    }
                });
            }
            arr.splice(0, arr.length);
        },
        error: function (jqXHR, textStatus, errorThrown) {

        }
    });
});

layui.use('table', function () {
    var m_url = location.protocol + '\\\\' + location.hostname + ':' + (location.port == '' ? 80 : location.port);
    var table = layui.table;
    var loginId = JSON.parse(window.localStorage.getItem('m_loginId'));
    console.log(loginId);
    table.render({
        elem: '#InfoTable'
        , even: true
        , height: 'full-115'
        , url: m_url+'/sys/informationinfo/listData?createUserName=' +loginId
        , toolbar: '#InfoToolbar'
        , method: 'get'
//			,height:'420px'
        , cols: [[
            {width: 25, title: '',align:'center' ,templet:'#indexTpl'} ,
            {checkbox: true}
            , {field: 'title', width: 80, title: '标题'}
            , {field: 'createUserName', width: 80, title: '发布人', sort: true}
            , {field: 'typeName', width: 70, title: '信息类型', sort: true}
            , {field: 'infoDate', width: 90, title: '信息日期', sort: true,templet: '<div>{{ layui.laytpl.toDateString(d.infoDate,"yyyy-MM-dd") }}</div>'}
            , {field: 'status', width: 90, title: '状态', sort: true, templet: '#checkDeliver'}
            , {field: 'sortSq', width: 90, title: '排序', sort: true}
            , {field: 'right', title: '修改', toolbar: '#barDemo', width: 80}
            , {field: 'right', title: '查看', toolbar: '#Demo', width: 80}
        ]]
, page: true
//			,limits:[10,20]
        , limit: 10//默认十条数据一页
        , id: 'testReload'
//		    ,response: {
//		      statusCode: 200 //重新规定成功的状态码为 200，table 组件默认为 0
//		    }
        , parseData: function (res) { //将原始数据解析成 table 组件所规定的数据
        return {
            "code": res.status, //解析接口状态
            "msg": res.message, //解析提示文本
            "count": res.total, //解析数据长度
            "data": res.rows.item //解析数据列表
        };
    }
});



//关键字搜索
var $ = layui.$, active = {
    reload: function () {
        var keyword = $('#infoTitleKey');
        var startTime=$('#start_time').val();
        var endTime=$('#end_time').val();
        table.reload('testReload', {
            where: {
                titleVague: keyword.val(),
                startTime:startTime,
                endTime:endTime
            }
        });
    }
};

//搜索绑定
$('#infoFind').on('click', function (data) {
    var type = $(this).data('type');
    active[type] ? active[type].call(this) : '';
});

//删除功能
$('#InfoDel').on('click', function () {
    layer.confirm('真的删除行么', function (index) {
        var cache = table.cache;
        var params = new Array;
        $.each(cache.testReload, function (index, value) {
            if (value.LAY_CHECKED != undefined && value.LAY_CHECKED == true) {
                params.push(value.rowId);
            }
        });
        if (params.length == 0) {
            layer.msg("请先选择");
            return;
        }
        $.ajax({
            url: m_url+'/sys/informationinfo/deleteInfo/' + params,
            contentType: 'application/json;charset=utf-8',
            method: 'post',
            data: JSON.stringify(params),
            dataType: 'JSON',
            success: function (res) {
                console.log(res)
                if (res.code = '0') {
                    layer.msg('删除成功', {
                        icon: 1,
                        time: 1000 //2秒关闭（如果不配置，默认是3秒）
                    }, function () {
                        window.location.reload();
                    });
                } else
                    alert(res.msg);
            },
            error: function (jqXHR, textStatus, errorThrown) {

            }
        });
        layer.close(index);
    });
});

    table.on('tool(InfoToolbar)',function (obj) {
        var value = obj.data;
        if(obj.event ==='find'){
            //查看信息
            var data ='find';
            if(value.infoUrl!=""){
                layer.open({
                    type: 2,
                    title: '外部链接',
                    shadeClose: true,
                    shade: false,
                    maxmin: true, //开启最大化最小化按钮
                    area: ['1000px', '600px'],
                    content: '//'+value.infoUrl+'/'
                });
            }else if(value.infoUrl=="") {
                layer.open({
                    type: 2,
                    title: '详细信息',
                    maxmin: true,
                    shadeClose: true, //点击遮罩关闭层
                    area: ['1000px', '600px'],
                    content: 'infoDetail.html',
                    success: function (layero, index) {
                        var body = layer.getChildFrame('body', index);
//                      var iframeWin = window[layero.find('iframe')[0]['name']];
                        body.find("#rowId").val(value.rowId);
                        body.find("#rowGuid").val(value.rowGuid);
                        body.find("#title").val(value.title);
                        body.find("#infoDate").val(layui.laytpl.toDateString(value.infoDate, "yyyy-MM-dd"));
                        body.find("#createUserName").val(value.createUserName);
                        body.find("#infoContent").append(value.content);
                        body.find("#attachGuid").val(value.attachGuid);
                    },
                    end: function () {
                    }
                });
            }
        }else if(obj.event ==='edit'){
            var attach= new Array;
            var param = {};
            param['guid'] = value.attachGuid;
            $.ajax({
                async:false,
                url: '/sys/frameAttach/getAttachList',
                contentType: 'application/json;charset=utf-8',
                method: 'get',
                data: param,
                dataType: 'JSON',
                success: function (res) {
                    if (res.code == '0') {
                        attach =res.data;
                    }
                }
            });
            var data='edit';
            layer.open({
                type:2,
                title:'信息修改',
                maxmin: true,
                shadeClose: true, //点击遮罩关闭层
                area: ['800px', '600px'],
                content: 'delivery.html',
                success: function (layero, index) {
                    var body = layer.getChildFrame('body', index);
                    var iframeWin = window[layero.find('iframe')[0]['name']];
                    var rowIds = value.rowId;
                    iframeWin.inputDataHandle(value.infoType,value.content);
                    body.find("#rowId").val(value.rowId);
                    body.find("#attachGuid").val(value.attachGuid);
                    body.find("#categoryGuid").val(value.categoryGuid);
                    body.find("#rowGuid").val(value.rowGuid);
                    body.find("#title").val(value.title);
                    body.find("#infoDate").val(layui.laytpl.toDateString(value.infoDate, "yyyy-MM-dd"));
                    if(findKey(getCodeValue(),value.infoType.toString()) == '链接类型'){
                        body.find("#addurl").css('display','');
                    }
                    body.find("#infoUrl").val(value.infoUrl);
//                  body.find('#editor_id').val(value.content);
                    for(var i=0;i<attach.length;i++){
                        var last = attach[i].contentType.substr('1',attach[i].contentType.length);
                        body.find("#fileName").append("<div style='float:left;margin-right:30px'><a href="+attach[i].url+" download="+attach[i].attachName+"><em><img class='m-img' src='../../Content/images/uploadico/"+last+".png' /></em><em id="+attach[i].rowGuid+" name='fileName'  style='color:#555555'>"+attach[i].attachName+"</em></a><em style='color:red;cursor:pointer;' onclick = 'deleteFile(this)' id="+attach[i].rowGuid+">删除</em></div>");
                    }
                    body.find("#editor_id").val(value.content);
                },
                end:function () {
                    window.location.reload();
                }
            })
        }
    });


    //发布选中事件
    $('#selDeliver').on('click', function () {
        layer.confirm('真的发布该信息么', function (index) {
            var cache = table.cache;
            var params = new Array;
            $.each(cache.testReload, function (index, value) {
                if (value.LAY_CHECKED != undefined && value.LAY_CHECKED == true) {
                    params.push(value.rowId);
                }
            });
            if (params.length == 0) {
                layer.msg("请先选择");
                return;
            }
            $.ajax({
                url:m_url+ '/sys/informationinfo/deliverInfo/' + params,
                contentType: 'application/json;charset=utf-8',
                method: 'post',
                data: JSON.stringify(params),
                dataType: 'JSON',
                success: function (res) {
                    console.log(res)
                    if (res.code = '0') {
                        layer.msg('发布成功')
                        window.location.reload();
                    } else
                        alert(res.msg);
                },
                error: function (jqXHR, textStatus, errorThrown) {

                }
            });
            layer.close(index);
        });
    });

    //停止发布事件
    $('#stopDeliver').on('click', function () {
        layer.confirm('真的停止发布么', function (index) {
//		    	console.log(table.checkStatus('deptTable'))新版本才有
            var cache = table.cache;
            var params = new Array;
            $.each(cache.testReload, function (index, value) {
                if (value.LAY_CHECKED != undefined && value.LAY_CHECKED == true) {
                    params.push(value.rowId);
                }
            });
            if (params.length == 0) {
                layer.msg("请先选择");
                return;
            }
            $.ajax({
                url: m_url+'/sys/informationinfo/stopDeliver/' + params,
                contentType: 'application/json;charset=utf-8',
                method: 'post',
                data: JSON.stringify(params),
                dataType: 'JSON',
                success: function (res) {
                    console.log(res)
                    if (res.code = '0') {
                        layer.msg('停止发布成功')
                        window.location.reload();
                    } else
                        alert(res.msg);
                },
                error: function (jqXHR, textStatus, errorThrown) {

                }
            });
            layer.close(index);
        });
    });

    //点击行选中复选框
    $(document).on("click",".layui-table-body table.layui-table tbody tr",function(){
        var obj = event ? event.target : event.srcElement;
        var tag = obj.tagName;
        var checkbox = $(this).find("td div.laytable-cell-checkbox div.layui-form-checkbox I");
        if(checkbox.length!=0){
            if(tag == 'DIV') {
                checkbox.click();
            }
        }
    });

    $(document).on("click","td div.laytable-cell-checkbox div.layui-form-checkbox",function(e){
        e.stopPropagation();
    });

})
layui.use([ 'laydate'], function(){
    var $ = layui.$;
    var laydate = layui.laydate;
    var nowTime = new Date().valueOf();
    var max = null;
    var start = laydate.render({
        elem: '#start_time',
        type: 'datetime',
        format:'yyyy-MM-dd',
        max: nowTime,
        btns: ['clear', 'confirm'],
        done: function(value, date){
            endMax = end.config.max;
            end.config.min = date; //最大时间为结束时间的开始值
            end.config.min.month = date.month -1;
        }
    });

    var end = laydate.render({
        elem: '#end_time',
        type: 'datetime',
        max:  4073558400000,
        format:'yyyy-MM-dd',
        min:nowTime,
        done: function(value, date){
            if($.trim(value) == ''){
                var curDate = new Date();
                date = {'date': curDate.getDate(), 'month': curDate.getMonth()+1, 'year': curDate.getFullYear()};
            }
            start.config.max = date;//最小时间为开始时间的最大值
            start.config.max.month = date.month -1;
        }
    })
    $('#InfoDeliver').on('click',function () {
        var data = 'add';
        layer.open({
            type: 2,
            title: '添加信息',
            maxmin: true,
            shadeClose: true, //点击遮罩关闭层
            area: ['800px', '600px'],
            content: 'delivery.html',
            success: function (layero, index) {
                var body = layer.getChildFrame('body', index);
                var iframeWin = window[layero.find('iframe')[0]['name']];
                iframeWin.inputDataHandle(data);
            },
            end: function () {
                //刷新页面
                window.location.reload()
            }
        })
    })
});


//日期格式
layui.laytpl.toDateString = function(d, format){
    var date = new Date(d || new Date())
        ,ymd = [
        this.digit(date.getFullYear(), 4)
        ,this.digit(date.getMonth() + 1)
        ,this.digit(date.getDate())
    ]
        ,hms = [
        this.digit(date.getHours())
        ,this.digit(date.getMinutes())
        ,this.digit(date.getSeconds())
    ];

    format = format || 'yyyy-MM-dd HH:mm:ss';

    return format.replace(/yyyy/g, ymd[0])
        .replace(/MM/g, ymd[1])
        .replace(/dd/g, ymd[2])
        .replace(/HH/g, hms[0])
        .replace(/mm/g, hms[1])
        .replace(/ss/g, hms[2]);
};

layui.laytpl.digit = function(num, length, end){
    var str = '';
    num = String(num);
    length = length || 2;
    for(var i = num.length; i < length; i++){
        str += '0';
    }
    return num < Math.pow(10, length) ? str + (num|0) : num;
};


