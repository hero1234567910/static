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
$().ready(function () {
    $.ajax({
        url: m_url+'/sys/informationcategory/getCategoryTrees',
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
                    	console.log(node)
                        layui.table.reload('testReload', {
                            where: {
                                pcategoryCode: node.categoryCode
                            }
                        });
                    }
                });
            }
        },
        error: function (jqXHR, textStatus, errorThrown) {

        }
    });
});

layui.use('table', function(){
        var table = layui.table;
        table.render({
            elem: '#table'
            ,height: 'full-130'
            ,even:true
            ,url:m_url+'/sys/informationcategory/listData'
            ,method:'get'
            ,cols: [[
                {checkbox:true}
                ,{field:'categoryCode', width:80, title: '栏目编号'}
                ,{field:'categoryName', width:80, title: '栏目名称'}
                ,{field:'isSingle', width:80, title: '是否单条信息',templet:'#checkSingle'}
                ,{field:'isNeedAudit', width:80, title: '是否需要审核',templet:'#checkAudit'}
                ,{field:'sortSq', width:80, title: '排序',sort:true}
                ,{field:'right',title:'修改',toolbar:'#barDemo',width:70}
            ]]
            , page: true
            , limit:9 //默认十条数据一页
            , id:'testReload'
            ,parseData: function(res){ //将原始数据解析成 table 组件所规定的数据
                return {
                    "code": res.status, //解析接口状态
                    "msg": res.message, //解析提示文本
                    "count": res.total, //解析数据长度
                    "data": res.rows.item //解析数据列表
                };
            }
        });
 
        //新增
        $('#infoAdd').on('click', function(){
            var data = 'add';
            layer.open({
                type: 2,
                title: 'iframe父子操作',
                maxmin: true,
                shadeClose: true, //点击遮罩关闭层
                area : ['480px' , '400px'],
                content: 'Edit.html',
                success: function(layero, index){
                    var body = layer.getChildFrame('body',index);
                    var iframeWin = window[layero.find('iframe')[0]['name']];
                    iframeWin.inputDataHandle(data);
                },
                end: function (){
                    //刷新页面
                    layui.table.reload('testReload');
                }
            });
        });

        //删除
        $('#infoDel').on('click', function(){
            layer.confirm('你确定删除吗！', function(index){
                var cache = table.cache;
                var params = new Array;
                $.each(cache.testReload,function(index,value){
                    if(value.LAY_CHECKED != undefined && value.LAY_CHECKED == true){
                        params.push(value.rowGuid);
                    }
                });
                if(params.length == 0){
                    layer.msg("请先选择");
                    return;
                }
                $.ajax({
                    url:m_url+'/sys/informationcategory/delete',
                    contentType: 'application/json;charset=utf-8',
                    method:'post',
                    data:JSON.stringify(params),
                    dataType:'JSON',
                    success:function(res){
                        if(res.code=='0'){
                            layer.msg('删除成功', {
                                icon: 1,
                                time: 1000 //2秒关闭（如果不配置，默认是3秒）
                            },function(){
                                layui.table.reload('testReload');
                            });
                        }
                        if(res.code=='500'){
                        	layer.msg(res.msg)
                        }
                    },
					error: function (jqXHR, textStatus, errorThrown) {

					}
                });
                layer.close(index);
            });
        });

        //编辑
        table.on('tool(toolbar)', function (obj) {
            var value = obj.data;
            if (obj.event === 'edit') {
                //更新
                var data = 'edit';
                layer.open({
                    type: 2,
                    title: '信息类别修改',
                    maxmin: true,
                    shadeClose: true, //点击遮罩关闭层
                    area: ['480px' , '400px'],
                    content: 'Edit.html',
                    success: function (layero, index) {
                        var body = layer.getChildFrame('body', index);
                        var iframeWin = window[layero.find('iframe')[0]['name']];
                        iframeWin.inputDataHandle(data);
                        body.find("#rowId").val(value.rowId);
                        body.find("#rowGuid").val(value.rowGuid);
                        body.find("#categoryName").val(value.categoryName);
                        body.find("#description").val(value.description);
                        var select = 'dd[lay-value=' + value.isSingle + ']';
                        body.find("#isSingle").siblings("div.layui-form-select").find('dl').find(select).click();
                        var isNeed = 'dd[lay-value=' + value.isNeedAudit + ']';
                        body.find("#isNeedAudit").siblings("div.layui-form-select").find('dl').find(isNeed).click();
                        body.find("#sortSq").val(value.sortSq);
                    },
                    end: function () {
                        //刷新页面
                        layui.table.reload('testReload');
                    }
                });
            }
    });

});
