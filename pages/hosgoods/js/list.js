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
$().ready(function() {
	var m_url = location.protocol + '\\\\' + location.hostname + ':' + (location.port == '' ? 80 : location.port);
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
						console.log(node) //node即为当前点击的节点数据
						layui.table.reload('testReload', {
							where: {
								goodsTypeGuid: node.rowGuid
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
		url: m_url + '/sys/hosgoods/listData',
		method: 'get',
		cols: [
			[{
					width: 20,
					title: '',
					align: 'center',
					templet: '#indexTpl'
				}, {
					checkbox: true
				}, {
					field: 'goodsName',
					width: 80,
					title: '菜品名称',
					sort: true
				}, {
					field: 'goodsPrice',
					width: 80,
					title: '菜品价格',
					sort: true
				}, {
					field: 'goodsInfo',
					width: 80,
					title: '菜品信息',
					sort: true
				}, 
				{
					field: 'goodsUrl',
					title: '菜品图片',
					sort: true,
					templet: '#showImg'
				},
				 {
					field: 'isShelf',
					width: 70,
					title: '是否上架',
					sort: true,
					templet: '#checkShelf'
				}, {
					field: 'sortSq',
					width: 80,
					title: '排序号',
					sort: true
				}, {
					field: 'right',
					title: '操作',
					toolbar: '#barDemo',
					width: 50
				}
			]
		],
		page: true,
		limit: 10, //默认十条数据一页
		id: 'testReload',
		done: function(res, curr, count) {
			hoverOpenImg(); //显示大图
			$('table tr').on('click', function() {
				$('table tr').css('background', '');
				$(this).css('background', '<%=PropKit.use("config.properties").get("table_color")%>');
			});
		}
	});

	//角色关键字搜索
	var $ = layui.$,
		active = {
			reload: function() {
				var keyword = $('#goodsNamekey');
	
				table.reload('testReload', {
					where: {
						'goodsNameVague': keyword.val()
					}
				});
			}
		};
	//搜索绑定
	$('#goodsFind').on('click', function() {
		var type = $(this).data('type');
		active[type] ? active[type].call(this) : '';
	});

	function hoverOpenImg() {
		var img_show = null; // tips提示
		$('td img').hover(function() {
			var kd = $(this).width();
			kd1 = kd * 3; //图片放大倍数
			kd2 = kd * 3 + 30; //图片放大倍数
			var img = "<img class='img_msg' src='" + $(this).attr('src') + "' style='width:" + kd1 + "px;' />";
			img_show = layer.tips(img, this, {
				tips: [2, 'rgba(41,41,41,.5)'],
				area: [kd2 + 'px']
			});
		}, function() {
			layer.close(img_show);
		});
		$('td img').attr('style', 'max-width:70px;display:block!important');
	}
	//显示大图片

	//新增
	$('#goodsAdd').on('click', function() {
		var data = 'add';
		layer.open({
			type: 2,
			title: '菜品添加',
			maxmin: true,
			shadeClose: true, //点击遮罩关闭层
			area: ['500px', '500px'],
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
	$('#goodsDel').on('click', function() {
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
				url: m_url + '/sys/hosgoods/delete',
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

	$('#goodsOn').on('click', function() {
		layer.confirm('你确定上架吗！', function(index) {
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
				url: m_url + '/sys/hosgoods/goodsUpShelf',
				contentType: 'application/json;charset=utf-8',
				method: 'post',
				data: JSON.stringify(params),
				dataType: 'JSON',
				success: function(res) {
					if (res.code == '0') {
						layer.msg('上架成功', {
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

	$('#goodsOff').on('click', function() {
		layer.confirm('你确定下架吗！', function(index) {
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
				url: m_url + '/sys/hosgoods/goodsDownShelf',
				contentType: 'application/json;charset=utf-8',
				method: 'post',
				data: JSON.stringify(params),
				dataType: 'JSON',
				success: function(res) {
					if (res.code == '0') {
						layer.msg('下架成功', {
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
		var GoodsTypeName = "";
		$.ajax({
			url: m_url + '/sys/hosgoods/getTypeNameByGuid/' + value.goodsTypeGuid,
			contentType: 'application/json;charset=utf-8',
			method: 'get',
			data: JSON.stringify(value.goodsTypeGuid),
			dataType: 'JSON',
			success: function(res) {
				if (res.code = '0') {
					if (res.data != null) {
						GoodsTypeName = res.data;
					} else {
						GoodsTypeName = "菜品类别";
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
				title: '菜品信息修改',
				maxmin: true,
				shadeClose: true, //点击遮罩关闭层
				area: ['500px', '500px'],
				content: 'Edit.html',
				success: function(layero, index) {
					var body = layer.getChildFrame('body', index);
					var iframeWin = window[layero.find('iframe')[0]['name']];
					iframeWin.inputDataHandle(data, value.goodsName, value.isShelf, value.rowGuid);
					body.find("#rowId").val(value.rowId);
					body.find("#rowGuid").val(value.rowGuid);
					body.find("#goodsName").val(value.goodsName);
					body.find("#goodsTypeGuid").val(value.goodsTypeGuid);
					body.find("#goodsTypeName").val(GoodsTypeName);
					body.find("#goodsPrice").val(value.goodsPrice);
					body.find("#goodsImgGuid").val(value.goodsImgGuid);
					body.find("#goodsInfo").val(value.goodsInfo);
					body.find("#sortSq").val(value.sortSq);
					body.find("#isShelf").val(value.isShelf);
				},
				end: function() {
					//刷新页面
					layui.table.reload('testReload');
				}
			});
		}
	});

});
