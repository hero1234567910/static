$.ajaxSetup({
	headers: {
		"Content-Type": "application/json;charset=utf-8",
		"token": window.localStorage.getItem('m_token')
	},
	complete: function(res) {
		if (JSON.parse(res.responseText).code == '401') {
			window.top.location.href = '../../login.html';
		}
	}
});

var m_url = location.protocol + '\\\\' + location.hostname + ':' + (location.port == '' ? 80 : location.port);
$().ready(function() {
	$.ajax({
		url: m_url + '/sys/hosgoodstype/getGoodsTypeTrees',
		contentType: 'application/json;charset=utf-8',
		method: 'post',
		dataType: 'JSON',
		success: function(res) {
			if (res.code = '0') {
				layui.tree({
					elem: '#goodsTypeShu',
					nodes: [{ //节点数据
						name: '菜品类别',
						children: res.data
					}],
					click: function(node) {
						//console.log(node) //node即为当前点击的节点数据
						layui.table.reload('testReload', {
							where: {
								pgoodsTypeCode: node.goodsTypeCode
							}
						});
					}
				});
			} else
				alert(res.msg);
		},
		error: function(jqXHR, textStatus, errorThrown) {

		}
	});
});

$("body").on("mousedown", ".layui-tree a cite", function() {
	$(".layui-tree a cite").css('color', '#000000')
	$(this).css('color', '#5d7bdc')
});

layui.use('table', function() {
	var table = layui.table;
	var m_url = location.protocol + '\\\\' + location.hostname + ':' + (location.port == '' ? 80 : location.port);
	table.render({
		elem: '#table',
		height: 'full-130',
		even: true,
		url: m_url + '/sys/hosgoodstype/listData',
		method: 'get',
		cols: [
			[{
				width: 18,
				title: '',
				align: 'center',
				templet: '#indexTpl'
			}, {
				checkbox: true
			}, {
				field: 'typeName',
				width: 80,
				title: '类型名称',
				sort: true
			}, {
				field: 'sortSq',
				width: 80,
				title: '排序号',
				sort: true
			}, {
				field: 'right',
				title: '操作',
				toolbar: '#barDemo',
				width: 300
			}]
		],
		page: true,
		limit: 10 //默认十条数据一页
			,
		id: 'testReload'
	});


	//角色关键字搜索
	var $ = layui.$,
		active = {
			reload: function() {
				var keyword = $('#typeNameKey');

				table.reload('testReload', {
					where: {
						typeNameVague: keyword.val()
					}
				});
			}
		};
	//搜索绑定
	$('#goodsTypeFind').on('click', function() {
		var type = $(this).data('type');
		active[type] ? active[type].call(this) : '';
	});


	//新增
	$('#goodsTypeAdd').on('click', function() {
		var data = 'add';
		layer.open({
			type: 2,
			title: '新增菜品类型',
			maxmin: true,
			shadeClose: true, //点击遮罩关闭层
			area: ['500px', '300px'],
			content: 'Edit.html',
			success: function(layero, index) {
				var body = layer.getChildFrame('body', index);
				var iframeWin = window[layero.find('iframe')[0]['name']];
				iframeWin.inputDataHandle(data);
			},
			end: function() {
				//刷新页面
				layui.table.reload('testReload');
			}
		});
	});

	//删除
	$('#goodsTypeDel').on('click', function() {
		layer.confirm('你确定删除吗！', function(index) {
			var cache = table.cache;
			var params = new Array;
			$.each(cache.testReload, function(index, value) {
				if (value.LAY_CHECKED != undefined && value.LAY_CHECKED == true) {
					params.push(value.rowGuid);
				}
			});
			if (params.length == 0) {
				layer.msg("请先选择");
				return;
			}
			$.ajax({
				url: m_url + '/sys/hosgoodstype/delete',
				contentType: 'application/json;charset=utf-8',
				method: 'post',
				data: JSON.stringify(params),
				dataType: 'JSON',
				success: function(res) {
					if (res.code == '0') {
						layer.msg('删除成功', {
							icon: 1,
							time: 1000 //2秒关闭（如果不配置，默认是3秒）
						}, function() {
							layui.table.reload('testReload');
						});
					}
					if (res.code == '500') {
						layer.msg(res.msg)
					}
				},
				error: function(jqXHR, textStatus, errorThrown) {

				}
			});
			layer.close(index);
		});
	});



	//编辑
	var m_url = location.protocol + '\\\\' + location.hostname + ':' + (location.port == '' ? 80 : location.port);
	table.on('tool(toolbar)', function(obj) {
		var value = obj.data;
		var GoodsTypeCode = "";
		$.ajax({
			url: m_url + '/sys/hosgoodstype/getByGoodsTypeCode/' + value.pgoodsTypeCode,
			contentType: 'application/json;charset=utf-8',
			method: 'get',
			data: JSON.stringify(value.pgoodsTypeCode),
			dataType: 'JSON',
			success: function(res) {
				if (res.code = '0') {
					if (res.data != null) {
						GoodsTypeCode = res.data;
					} else {
						GoodsTypeCode = "菜品类别";
					}
				}
			},
			error: function(jqXHR, textStatus, errorThrown) {

			}
		});
		if (obj.event === 'edit') {
			//更新
			var data = 'edit';
			layer.open({
				type: 2,
				title: '修改菜品类型',
				maxmin: true,
				shadeClose: true, //点击遮罩关闭层
				area: ['500px', '300px'],
				content: 'Edit.html',
				success: function(layero, index) {
					var body = layer.getChildFrame('body', index);
					var iframeWin = window[layero.find('iframe')[0]['name']];
					iframeWin.inputDataHandle(data, value.goodsTypeCode, value.typeName);
					body.find("#rowId").val(value.rowId);
					body.find("#rowGuid").val(value.rowGuid);
					body.find("#goodsTypeCode").val(value.goodsTypeCode); //要修改的每个td的值存为变量传进去
					body.find("#pgoodsTypeCode").val(value.pgoodsTypeCode);
					body.find("#typeName").val(value.typeName);
					body.find("#sortSq").val(value.sortSq);
					body.find("#pgoodsTypeName").val(GoodsTypeCode);
				},
				end: function() {
					//刷新页面
					layui.table.reload('testReload');
				}
			});
		}
	});

});
