export default {
	name: "share",
	data() {
		return {
 
		}
	},
	onLoad: function() {
		wx.showShareMenu({
			withShareTicket: true,
			menus: ["shareAppMessage", "shareTimeline"]
		})
	},
	//发送给朋友
	onShareAppMessage(res) {
		let that = this;
		if (res.from === 'button') {
			let obj = res.target.dataset.obj // 获取 button 组件 自定义的data-obj值
			//这块需要传参，不然链接地址进去获取不到数据
			// let path = `/` + that.$scope.route + `?item=` + that.$scope.options.item;
			let path = ''
			return {
				title: `${obj.filename}`,
				path: path,
				imageUrl: ''
			};
		}
		// 右上角三点
		if (res.from === 'menu') {
			return {
				title: 'Ai对话人工智能',
				path: '',
				imageUrl: ''
			};
		}
	},
	// 分享到朋友圈
	onShareTimeline() {
		return {
			title: 'Ai对话人工智能',
			path: '',
			imageUrl: ''
		};
	},
	methods: {
 
	}
}