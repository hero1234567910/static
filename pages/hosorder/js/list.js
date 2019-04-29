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
            ,url:m_url+'/sys/hosorder/listData'
            ,method:'get'
            ,cols: [[
                {width: 20, title: '', align: 'center', templet: '#indexTpl'},
                {checkbox:true}
                                ,{field:'orderNumber', width:70, title: '订单流水号', sort: true}
                                ,{field:'consigneeName', width:70, title: '收货人姓名', sort: true}
                                ,{field:'consigneeInpatient', width:40, title: '病区', sort: true}
                                ,{field:'consigneeStorey', width:40, title: '楼层', sort: true}
                                ,{field:'consigneeBedNumber', width:50, title: '床位号', sort: true}
                                ,{field:'consigneeMobile', width:60, title: '收货人手机号', sort: true}
                                ,{field:'orderStatus', width:70, title: '订单状态', sort: true, templet: '#checkStatus'}
                                ,{field:'createTime', width:80, title: '创建时间', sort: true}
                                ,{field:'reserveTime', width:80, title: '预定送达时间', sort: true}
                                ,{field:'reserveTimeSuffix', width:60, title: '预定时间', sort: true}
                                ,{field:'orderMoney', width:50, title: '总金额', sort: true}
                                ,{field:'merchantNumber', width:70, title: '商户订单号', sort: true}
                                ,{field:'remark', width:70, title: '备注', sort: true}
                                ,{field:'sortSq', width:60, title: '排序号', sort: true}
                                ,{field:'right',title:'修改',toolbar:'#barDemo',width:70}
            ]]
            , page: true
            , limit:10 //默认十条数据一页
            , id:'testReload'

        });
 

        //角色关键字搜索
        var $ = layui.$, active = {
            reload: function () {
                var keyword = $('#consigneeNameKey');

                table.reload('testReload', {
                    where: {
                        'consigneeNameVague': keyword.val()
                    }
                });
            }
        };
        //搜索绑定
        $('#OrderFind').on('click', function () {
            var type = $(this).data('type');
            active[type] ? active[type].call(this) : '';
        });


        //新增
        $('#OrderAdd').on('click', function(){
            var data = 'add';
            layer.open({
                type: 2,
                title: '添加订单',
                maxmin: true,
                shadeClose: true, //点击遮罩关闭层
                area : ['469px', '500px'],
                content: 'Edit.html',
                success: function(layero, index){
                    var body = layer.getChildFrame('body',index);
                    var iframeWin = window[layero.find('iframe')[0]['name']];
                    iframeWin.inputDataHandle(data);
                },
                end: function (){
                    //刷新页面
                    window.location.reload()
                }
            });
        });

        //删除
        $('#OrderDel').on('click', function(){
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
                    url:m_url+'/sys/hosorder/delete',
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
                                window.location.reload();
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
    var m_url = location.protocol + '\\\\' + location.hostname + ':' + (location.port == '' ? 80 : location.port);
        table.on('tool(toolbar)', function (obj) {
            var value = obj.data;
            if (obj.event === 'edit') {
                //更新
                var data = 'edit';
                layer.open({
                    type: 2,
                    title: '修改订单',
                    maxmin: true,
                    shadeClose: true, //点击遮罩关闭层
                    area: ['469px', '500px'],
                    content: 'Edit.html',
                    success: function (layero, index) {
                        var body = layer.getChildFrame('body', index);
                        var iframeWin = window[layero.find('iframe')[0]['name']];
                        iframeWin.inputDataHandle(data,value.rowGuid);
                        body.find("#rowId").val(value.rowId);
                        body.find("#rowGuid").val(value.rowGuid);
                        body.find("#orderNumber").val(value.orderNumber);
                        body.find("#consigneeName").val(value.consigneeName);
                        body.find("#consigneeInpatient").val(value.consigneeInpatient);
                        body.find("#consigneeStorey").val(value.consigneeStorey);
                        body.find("#consigneeBedNumber").val(value.consigneeBedNumber);
                        body.find("#consigneeMobile").val(value.consigneeMobile);
                        body.find("#reserveTime").val(layui.laytpl.toDateString(value.reserveTime, "yyyy-MM-dd "));
                        body.find("#reserveTimeSuffix").val(value.reserveTimeSuffix);
                        body.find("#orderMoney").val(value.orderMoney);
                        body.find("#remark").val(value.remark);
                    },
                    end: function () {
                        //刷新页面
                        window.location.reload()
                    }
                });
            }
    });

});


