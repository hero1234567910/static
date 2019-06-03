//创建vue实例化对象
var vm = new Vue({
    el: '#vueConfig',
    data: {
        // 数据创建
        orderInfo: {},
        rowGuid:'',
        orderItem:{}
    },
    created() {
        
    },
    methods: {
        getOrderInfo() {
            let self = this;
            //根据行标获取
            $.ajax({
                url: '/sys/hosorder/getOrderDetailByGuid',
                contentType: 'application/json;charset=utf-8',
                method: 'post',
                data:self.rowGuid,
                dataType: 'JSON',
                success: function (res) {
                    if (res.code == '0') {
                        self.orderInfo = res.data;
                        console.log(self.orderInfo)
                    }
                }
            });
        }
    }

})

function inputDataHandle(rowGuid){
	vm.rowGuid = rowGuid;
	vm.getOrderInfo();
}
