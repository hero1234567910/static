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
            ,url:m_url+'/ceshi/listData'
            ,method:'get'
            ,cols: [[
                {checkbox:true}
                                ,{field:'rowId', width:80, title: '', sort: true}
                                ,{field:'rowGuid', width:80, title: '', sort: true}
                                ,{field:'createTime', width:80, title: '', sort: true}
                                ,{field:'delFlag', width:80, title: '', sort: true}
                                ,{field:'sortSq', width:80, title: '', sort: true}
                                ,{field:'selectedText', width:80, title: '下拉框测试', sort: true}
                                ,{field:'areaT', width:80, title: '文本', sort: true}
                                ,{field:'right',title:'操作',toolbar:'#barDemo',width:150}
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
        $('#infoFind').on('click', function () {
            var type = $(this).data('type');
            active[type] ? active[type].call(this) : '';
        });


        //新增
        $('#infoAdd').on('click', function(){
            var data = 'add';
            layer.open({
                type: 2,
                title: 'iframe父子操作',
                maxmin: true,
                shadeClose: true, //点击遮罩关闭层
                area : ['469px', '300px'],
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
                    url:m_url+'/ceshi/delete',
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
        table.on('tool(toolbar)', function (obj) {
            var value = obj.data;
            if (obj.event === 'edit') {
                //更新
                var data = 'edit';
                layer.open({
                    type: 2,
                    title: 'iframe父子操作',
                    maxmin: true,
                    shadeClose: true, //点击遮罩关闭层
                    area: ['469px', '300px'],
                    content: 'Edit.html',
                    success: function (layero, index) {
                        var body = layer.getChildFrame('body', index);
                        var iframeWin = window[layero.find('iframe')[0]['name']];
                        iframeWin.inputDataHandle(data);
                        body.find("#rowId").val(value.rowId);
                    },
                    end: function () {
                        //刷新页面
                        window.location.reload()
                    }
                });
            }
    });

});
