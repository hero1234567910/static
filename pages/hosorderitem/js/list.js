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

layui.use('table', function(){
        var table = layui.table;
         var m_url = location.protocol + '\\\\' + location.hostname + ':' + (location.port == '' ? 80 : location.port);
        table.render({
            elem: '#table'
            ,height: 'full-130'
            ,even:true
            ,url:m_url+'/sys/hosorderitem/listData'
            ,method:'get'
            ,cols: [[
                {width: 20, title: '', align: 'center', templet: '#indexTpl'},
                {checkbox:true}
                                ,{field:'goodsGuid', width:80, title: '商品标识', sort: true}
                                ,{field:'orderGuid', width:80, title: '订单标识', sort: true}
                                ,{field:'itemPrice', width:90, title: '订单商品单价', sort: true}
                                ,{field:'count', width:80, title: '数量', sort: true}
                                ,{field:'totalMoney', width:80, title: '小计', sort: true}
                                ,{field:'createTime', width:150, title: '创建时间', sort: true}
                                ,{field:'sortSq', width:80, title: '排序号', sort: true}
                                ,{field:'right',title:'操作',toolbar:'#barDemo',width:130}
            ]]
            , page: true
            , limit:10 //默认十条数据一页
            , id:'testReload'
        });
 

        //角色关键字搜索
        var $ = layui.$, active = {
            reload: function () {
                var keyword = $('#keyword');

                table.reload('testReload', {
                    where: {
                        'name': keyword.val()
                    }
                });
            }
        };
        //搜索绑定
        $('#OrderItemFind').on('click', function () {
            var type = $(this).data('type');
            active[type] ? active[type].call(this) : '';
        });


        //新增
        $('#OrderItemAdd').on('click', function(){
            var data = 'add';
            layer.open({
                type: 2,
                title: '添加',
                maxmin: true,
                shadeClose: true, //点击遮罩关闭层
                area : ['469px', '350px'],
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
        $('#OrderItemDel').on('click', function(){
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
                    url:m_url+'/sys/hosorderitem/delete',
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
                    title: '修改',
                    maxmin: true,
                    shadeClose: true, //点击遮罩关闭层
                    area: ['469px', '350px'],
                    content: 'Edit.html',
                    success: function (layero, index) {
                        var body = layer.getChildFrame('body', index);
                        var iframeWin = window[layero.find('iframe')[0]['name']];
                        iframeWin.inputDataHandle(data,value.rowGuid);
                        body.find("#rowId").val(value.rowId);
                        body.find("#rowGuid").val(value.rowGuid);
                        body.find("#goodsGuid").val(value.goodsGuid);
                        body.find("#orderGuid").val(value.orderGuid);
                        body.find("#itemPrice").val(value.itemPrice);
                        body.find("#count").val(value.count);
                        body.find("#totalMoney").val(value.totalMoney);
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
