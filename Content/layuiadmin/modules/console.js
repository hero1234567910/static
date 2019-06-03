/**

 @Name：layuiAdmin 主页控制台
 @Author：贤心
 @Site：http://www.layui.com/admin/
 @License：GPL-2
    
 */


layui.define(function(exports){
  
  /*
    下面通过 layui.use 分段加载不同的模块，实现不同区域的同时渲染，从而保证视图的快速呈现
  */
  
  
  //区块轮播切换
  layui.use(['admin', 'carousel'], function(){
    var $ = layui.$
    ,admin = layui.admin
    ,carousel = layui.carousel
    ,element = layui.element
    ,device = layui.device();

    //轮播切换
    $('.layadmin-carousel').each(function(){
      var othis = $(this);
      carousel.render({
        elem: this
        ,width: '100%'
        ,arrow: 'none'
        ,interval: othis.data('interval')
        ,autoplay: othis.data('autoplay') === true
        ,trigger: (device.ios || device.android) ? 'click' : 'hover'
        ,anim: othis.data('anim')
      });
    });
    
    element.render('progress');
    
  });

  //数据概览
  layui.use(['carousel', 'echarts'], function(){
    var $ = layui.$
    ,carousel = layui.carousel
    ,echarts = layui.echarts;
    
    var re = [];
    $.ajax({
    	async:false,
        url: '/sys/hosorder/orderStatistical',
        contentType: 'application/json;charset=utf-8',
        method: 'get',
        dataType: 'JSON',
        success: function (res) {
            if (res.code == '0') {
                re = res.data;
            }
        }
    });
	var dateToTime = function(str){
		return str.replace(':',''); //用/替换日期中的-是为了解决Safari的兼容
    }
    for(var i=0; i < re.length; i++){
        re[i].publishTimeNew = parseInt(dateToTime(re[i].time));
    }
    re.sort(function(a, b) {
        return b.publishTimeNew< a.publishTimeNew ? 1 : -1;
    });
    //数据操作
	var timeArray = [];
	var timeCount = [];
	for(var i=0;i<re.length;i++){
		//获取时间点
		timeArray.push(re[i].time); 
		timeCount.push(re[i].Count);
	}

	
    var echartsApp = [], options = [
      //今日流量趋势
      {
        title: {
          text: '昨日订单',
          x: 'center',
          textStyle: {
            fontSize: 14
          }
        },
        tooltip : {
          trigger: 'axis'
        },
        legend: {
          data:['','']
        },
        xAxis : [{
          type : 'category',
          boundaryGap : false,
          data: timeArray
        }],
        yAxis : [{
          type : 'value'
        }],
        series : [{
          name:'下单数量',
          type:'line',
          smooth:true,
          itemStyle: {normal: {areaStyle: {type: 'default'}}},
          data: timeCount
        }
//      {
//        name:'订单完成数量',
//        type:'line',
//        smooth:true,
//        itemStyle: {normal: {areaStyle: {type: 'default'}}},
//        data: [11,22,33,44,55,66,333,3333,5555,12666,3333,333,666,1188,2666,3888,6666,4222,3999,2888,1777,966,655,555,333,222,311,699,588,277,166,99,88,77]
//      }
        ]
    }
//    
//    //新增的用户量
//    {
//      title: {
//        text: '最近一周新增的用户量',
//        x: 'center',
//        textStyle: {
//          fontSize: 14
//        }
//      },
//      tooltip : { //提示框
//        trigger: 'axis',
//        formatter: "{b}<br>新增用户：{c}"
//      },
//      xAxis : [{ //X轴
//        type : 'category',
//        data : ['11-07', '11-08', '11-09', '11-10', '11-11', '11-12', '11-13']
//      }],
//      yAxis : [{  //Y轴
//        type : 'value'
//      }],
//      series : [{ //内容
//        type: 'line',
//        data:[200, 300, 400, 610, 150, 270, 380],
//      }]
//    }
    ]
    ,elemDataView = $('#LAY-index-dataview').children('div')
    ,renderDataView = function(index){
      echartsApp[index] = echarts.init(elemDataView[index], layui.echartsTheme);
      echartsApp[index].setOption(options[index]);
      window.onresize = echartsApp[index].resize;
    };
    
    
    //没找到DOM，终止执行
    if(!elemDataView[0]) return;
    
    
    
    renderDataView(0);
    
    //监听数据概览轮播
    var carouselIndex = 0;
    carousel.on('change(LAY-index-dataview)', function(obj){
      renderDataView(carouselIndex = obj.index);
    });
    
    //监听侧边伸缩
    layui.admin.on('side', function(){
      setTimeout(function(){
        renderDataView(carouselIndex);
      }, 300);
    });
    
    //监听路由
    layui.admin.on('hash(tab)', function(){
      layui.router().path.join('') || renderDataView(carouselIndex);
    });
  });

  //最新订单
  layui.use('table', function(){
    var $ = layui.$
    ,table = layui.table;
    //通告信息
    var m_url = location.protocol + '\\\\' + location.hostname + ':' + (location.port == '' ? 80 : location.port);
    table.render({
        elem: '#LAY-index-topSearch'
//      , height: 'full-130'
        , even: true
        , url: m_url + '/sys/informationinfo/listData'
        , method: 'get'
        , cols: [[
//          {width: 18, title: '',align:'center' ,templet:'#indexTpl'},
            {type: 'numbers', fixed: 'left'}
//          {checkbox: true}
            , {field: 'title', minWidth: 200, title: '标题'}
            , {field: 'createUserName', minWidth: 100, title: '创建人'}
            , {field: 'infoDate', title: '信息日期'}
        ]]
        ,skin: 'line'
        , page: true
        , limit: 10 //默认十条数据一页
        , id: 'testReload'
    });
  });
  
  exports('console', {})
});

