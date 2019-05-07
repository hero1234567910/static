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

layui.use('table', function() {
	var table = layui.table;
	var m_url = location.protocol + '\\\\' + location.hostname + ':' + (location.port == '' ? 80 : location.port);
	table.render({
		elem: '#table',
		height: 'full-130',
		even: true,
		url: m_url + '/sys/hosorder/listData?orderStatus='+1,
		method: 'get',
		cols: [
			[{
					width: 20,
					title: '',
					align: 'center',
					templet: '#indexTpl'
				},
				{
					checkbox: true
				}, {
					field: 'orderNumber',
					width: 80,
					title: '订单流水号',
					sort: true
				}, {
					field: 'consigneeName',
					width: 60,
					title: '收货人姓名',
					sort: true
				}, {
					field: 'consigneeMobile',
					width: 60,
					title: '收货人手机号',
					sort: true
				}, {
					field: 'orderStatusText',
					width: 60,
					title: '订单状态',
					sort: true
				}, {
					field: 'createTime',
					width: 80,
					title: '创建时间',
					sort: true
				}, {
					field: 'reserveTime',
					width: 90,
					title: '预定送达时间',
					sort: true
				}, {
					field: 'reserveTimeSuffix',
					width: 60,
					title: '预定时间',
					sort: true
				}, {
					field: 'orderMoney',
					width: 50,
					title: '总金额',
					sort: true
				}, {
					field: 'remark',
					width: 70,
					title: '备注',
					sort: true
				}, {
					field: 'sortSq',
					width: 50,
					title: '排序号',
					sort: true
				}, {
					field: 'right',
					title: '是否接单',
					toolbar: '#barDemo',
					width: 80
				}
			]
		],
		page: true,
		limit: 10 //默认十条数据一页
			,
		id: 'testReload'

	});

});
