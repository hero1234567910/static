$.ajaxSetup({
    headers: {
        "Content-Type": "application/json;charset=utf-8",
        "token": window.localStorage.getItem('m_token')
    },
    complete: function (res) {
        if (JSON.parse(res.responseText).code == '401') {
            window.top.location.href = '../../login.html';
        }
    }
});

var m_url = location.protocol + '\\\\' + location.hostname + ':' + (location.port == '' ? 80 : location.port);
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
                    elem: '#deptShu'
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
    var table = layui.table;
    var m_url = location.protocol + '\\\\' + location.hostname + ':' + (location.port == '' ? 80 : location.port);
    table.render({
        elem: '#table'
        , height: 'full-130'
        , even: true
        , url: m_url + '/sys/informationinfo/listData2'
        , method: 'get'
        , cols: [[
            //{checkbox: true},
            {width: 18, title: '', align: 'center', templet: '#indexTpl'}
            , {field: 'title', width: 200, title: '标题', sort: true}
            , {field: 'createUserName', width: 80, title: '创建人', sort: true}
            , {field: 'typeName', width: 80, title: '信息类别', sort: true}
            , {
                field: 'infoDate',
                width: 90,
                title: '信息日期',
                sort: true,
                templet: '<div>{{ layui.laytpl.toDateString(d.infoDate,"yyyy-MM-dd") }}</div>'
            }
            , {field: 'right', title: '操作', toolbar: '#barDemo', width: 80}
        ]]
        , page: true
        , limit: 10 //默认十条数据一页
        , id: 'testReload'
        , parseData: function (res) { //将原始数据解析成 table 组件所规定的数据
            return {
                "code": res.status, //解析接口状态
                "msg": res.message, //解析提示文本
                "count": res.total, //解析数据长度
                "data": res.rows.item //解析数据列表
            };
        },
        // done:function (params) {
        //     params.startTime=$('#start_time').val();
        //     params.endTime=$('#end_time').val();
        //     console.log(params);
        //     return params;
        // }
    });


    //角色关键字搜索
    var $ = layui.$, active = {
        reload: function () {
            var keyword = $('#infoTitleKey');
            var startTime = $('#start_time').val();
            var endTime = $('#end_time').val();
            table.reload('testReload', {
                where: {
                    titleVague: keyword.val(),
                    startTime: startTime,
                    endTime: endTime
                }
            });
        }
    };

    //搜索绑定
    $('#infoFind').on('click', function (data) {
        var type = $(this).data('type');
        active[type] ? active[type].call(this) : '';
    });

    $('#infoFlash').on('click', function (data) {
        table.reload('testReload', {
            where: {
                titleVague: ""
            }
        });
    });

    table.on('tool(toolbar)', function (obj) {
        var value = obj.data;
        if (obj.event === 'find') {
            //查看信息
            var data = 'find';
            if (value.infoUrl != "") {
                layer.open({
                    type: 2,
                    title: '外部链接',
                    shadeClose: true,
                    shade: false,
                    maxmin: true, //开启最大化最小化按钮
                    area: ['1000px', '600px'],
                    content: '//' + value.infoUrl + '/'
                });
            } else if (value.infoUrl == "") {
                layer.open({
                    type: 2,
                    title: '详细信息',
                    maxmin: true,
                    shadeClose: true, //点击遮罩关闭层
                    area: ['1000px', '600px'],
                    content: 'infoDetailCheck.html',
                    success: function (layero, index) {
                        var body = layer.getChildFrame('body', index);
                        //var iframeWin = window[layero.find('iframe')[0]['name']];
                        //console.log(value.rowGuid);
                        //iframeWin.inputDataHandle(data);
                        body.find("#rowId").val(value.rowId);
                        body.find("#rowGuid").val(value.rowGuid);
                        body.find("#title").val(value.title);
                        body.find("#infoDate").val(layui.laytpl.toDateString(value.infoDate, "yyyy-MM-dd"));
                        body.find("#createUserName").val(value.createUserName);
                        body.find("#infoContent").append(value.content);
                        body.find("#attachGuid").val(value.attachGuid);
                        body.find("#status").val(value.status);
                    },
                    end: function () {
                        //刷新页面
                        layui.table.reload('testReload');
                    }
                });
            }
        }
    });
});

layui.use(['laydate'], function () {
    var $ = layui.$;
    var laydate = layui.laydate;
    var nowTime = new Date().valueOf();
    var max = null;

    var start = laydate.render({
        elem: '#start_time',
        type: 'date',
        format: 'yyyy-MM-dd',
        max: nowTime,
        btns: ['clear', 'confirm'],
        done: function (value, date) {
            endMax = end.config.max;
            end.config.min = date; //最大时间为结束时间的开始值
            end.config.min.month = date.month - 1;
        }
    });

    var end = laydate.render({
        elem: '#end_time',
        type: 'date',
        max: 4073558400000,
        format: 'yyyy-MM-dd',
        min: nowTime,
        done: function (value, date) {
            if ($.trim(value) == '') {
                var curDate = new Date();
                date = {'date': curDate.getDate(), 'month': curDate.getMonth() + 1, 'year': curDate.getFullYear()};
            }
            start.config.max = date;//最小时间为开始时间的最大值
            start.config.max.month = date.month - 1;
        }
    })
});


//日期格式
layui.laytpl.toDateString = function (d, format) {
    var date = new Date(d || new Date())
        , ymd = [
        this.digit(date.getFullYear(), 4)
        , this.digit(date.getMonth() + 1)
        , this.digit(date.getDate())
    ]
        , hms = [
        this.digit(date.getHours())
        , this.digit(date.getMinutes())
        , this.digit(date.getSeconds())
    ];

    format = format || 'yyyy-MM-dd HH:mm:ss';

    return format.replace(/yyyy/g, ymd[0])
        .replace(/MM/g, ymd[1])
        .replace(/dd/g, ymd[2])
        .replace(/HH/g, hms[0])
        .replace(/mm/g, hms[1])
        .replace(/ss/g, hms[2]);
};

layui.laytpl.digit = function (num, length, end) {
    var str = '';
    num = String(num);
    length = length || 2;
    for (var i = num.length; i < length; i++) {
        str += '0';
    }
    return num < Math.pow(10, length) ? str + (num | 0) : num;
};