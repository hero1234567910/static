//创建vue实例化对象
var vm = new Vue({
    el: '#vueConfig',
    data: {
        orderCount:{}
    },
    created() {
        this.getRthing();
    },
    methods: {
      //代办事项
      getRthing(){
      	let self = this;
      	$.ajax({
			url:'/sys/hosorder/statistical',
			contentType: 'application/json;charset=utf-8',
			method: 'get',
			dataType: 'JSON',
			success: function(res) {
				if (res.code == '0') {
					self.orderCount = res.data;
				}
				if (res.code == '500') {
					layer.msg(res.msg)
				}
			}
		});
      }
    }
})

//改变接单状态
function changeOrder(ele){
	$.ajax({
		url:'/sys/config/changeAccept',
		contentType: 'application/json;charset=utf-8',
		method: 'post',
		data: ele+'',
		dataType: 'JSON',
		success: function(res) {
			if (res.code == '0') {
				if(ele == 0){
					layer.msg("已关闭接单")
					$('#ms', window.parent.document).text("【已关闭接单】");
				}
				if(ele == 1){
					layer.msg("已开启接单")
					$('#ms', window.parent.document).text("【正在接单中】");
				}
			}
			if (res.code == '500') {
				layer.msg(res.msg)
			}
		}
	});
}
