<template>
	<view>
		<scroll-view scroll-with-animation scroll-y="true" style="width: 100%;">
			<!-- 用来获取消息体高度 -->
			<view id="okk" scroll-with-animation>
				<!-- 消息 -->
				<view class="flex-column-start" v-for="(x,i) in msgList" :key="i">
					<!-- 用户消息 头像可选加入-->
					<view v-if="x.my" class="userinfo">
						<view class="flex justify-end" style="display: flex;">
							<view class="usermsg">
								<text
									style="word-break: break-all;border-radius: 35rpx;background-color: #f9f9f9;">{{x.msg}}</text>
							</view>
							<view class="chat-img ">
								<image style="height: 75rpx;width: 75rpx;" src="../../static/user.png" mode="aspectFit">
								</image>
							</view>
						</view>
					</view>
					<!-- 机器人消息 -->
					<view v-if="!x.my" class="aiinfo">
						<view class="chat-img ">
							<image style="height: 75rpx;width: 75rpx;" src="../../static/openai.png" mode="aspectFit">
							</image>
						</view>
						<view class="flex" style="width: 500rpx;">
							<view class="aimsg" style="border-radius: 35rpx;background-color: #f9f9f9;">
								<text style="word-break: break-all;">{{x.msg}}</text>
							</view>
						</view>
					</view>
				</view>
				<view v-if="!msgdis" class="aiinfo">
					<view class="chat-img ">
						<image style="height: 75rpx;width: 75rpx;" src="../../static/openai.png" mode="aspectFit">
						</image>
					</view>
					<view class="flex" style="width: 500rpx;">
						<view class="aimsg" style="border-radius: 35rpx;background-color: #f9f9f9;">
							<text style="word-break: break-all;">我正在输入...</text>
						</view>
					</view>
				</view>
				<!-- 防止消息底部被遮 -->
				<view style="height: 130rpx;">
				</view>
			</view>
		</scroll-view>
		<!-- 底部导航栏 -->
		<view class="flex-column-center">
			<view class="inpubut">
				<uni-row class="demo-uni-row" :gutter="gutter" style="width:100%;">
					<uni-col :span="3">
						<uni-icons type="bars" size="30" @click="open"></uni-icons>
					</uni-col>
					<uni-col :span="15">
						<input v-model="msg" class="dh-input" type="text" @confirm="sendMsg" confirm-type="search"
							placeholder-class="my-neirong-sm" placeholder="描述您的问题" />
					</uni-col>
					<uni-col :span="6">
						<button @click="sendMsg" v-if="msgdis" class="btn ">{{sentext}}</button>
						<button class="btn " v-else>{{sentext}}</button>
					</uni-col>
				</uni-row>
				

				
			</view>
		</view>
		<uni-popup ref="popup" type="left">
			<view class="popcls">
				<button class="session_btn" open-type="contact" bindcontact="handleContact" session-from="sessionFrom">联系客服</button>
			</view>
		</uni-popup>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				apiurl: '请求接口地址',
				apisucc: false,
				apibut: '需要先进行API配置才能使用',
				sentext: '发送',
				api: '',
				msgLoad: true,
				anData: {},
				animationData: {},
				showTow: false,
				// msgList: [{
				// 	my: false,
				// 	msg: "你好呀,想问什么就问吧"
				// }],
				msgList: [],
				msgContent: "",
				msg: "",
				msgdis: true
			}
		},

		onLoad() {
			// uni.request({
			// 	url:this.apiurl,
			// 	method:'GET',
			// 	success: (res) => {
			// 		console.log(res);
			// 		this.apiadj = res.data
			// 	}})
			// wx.showShareMenu({
			// 	withShareTicket: true,
			// 	menus: ["shareAppMessage", "shareTimeline"]
			// })

		},

		methods: {
			handleContact (e) {
			        console.log(e.detail.path)
			        console.log(e.detail.query)
			    },
			setsklocal(apikey) {
				uni.setStorage({
					key: 'sk',
					data: apikey,
					success: function(res) {
						console.log('success', res);
					}
				});
			},
			clopop() {
				// this.$refs.popup.close('center')
			},
			open() {
				this.$refs.popup.open('left')
			},
			apiset() {
				let data = JSON.stringify({
					body: "你好"
				})
				uni.request({
					url: this.apiurl,
					data: data,
					method: 'POST',
					success: (res) => {
						console.log('suc', res, res.data.code)

						// if (res.data.code == 200){

						this.apibut = '连接成功',
							this.apisucc = true
						this.sentext = '发送'
						this.msgLoad = false
						this.setsklocal(this.api)
						// }else{
						// 	this.apibut = '连接失败，请重试'
						// }
					},
				})

			},
			sendMsg() {
				// 消息为空不做任何操作
				if (this.msg == "") {
					return 0;
				}
				// if (this.msgLoad == true) {
				// 	this.$u.toast('请先配置api再进行使用')
				// 	return 0
				// }
				this.sentext = '请求中'
				this.msgList.push({
					"msg": this.msg,
					"my": true
				})
				this.msgdis = false
				this.msgContent += (this.msg + "\n")
				console.log(this.msgContent);
				this.msgLoad = true
				// 清除消息
				this.msg = ""
				let data = JSON.stringify({
					body: this.msgContent
				})
				uni.request({
					url: this.apiurl,
					data: data,
					method: 'POST',
					success: (res) => {
						// if (res.data.code == 200){
						let text = res.data.choices[0].text.replace("openai:", "").replace("openai：", "")
							.replace(/^\n|\n$/g, "")
						console.log(text);
						this.msgList.push({
							"msg": text,
							"my": false
						})
						this.msgContent += (text + "\n")
						this.msgLoad = false
						this.msgdis = true
						this.sentext = '发送'
						// }else{
						// 	this.apibut = '连接失败，请重试'
						// 	this.apisucc = false
						// }
					},
				})
			},
		}
	}
</script>

<style>
	.userinfo {
		animation: oneshow 0.8s ease 1;
		display: flex;
		flex-direction: column;
		align-items: flex-end;
		padding-right: 20rpx;
	}

	.usermsg {
		display: flex;
		margin-left: 20rpx;
		padding: 17rpx 20rpx;
		border-radius: 35rpx;
		flex-direction: column;
		justify-content: center;
		border-radius: 35rpx;
		background-color: #f9f9f9;

	}

	.aiinfo {
		display: flex;
		flex-direction: row;
		align-items: center;
		margin-left: 20rpx;
		margin-top: 20rpx;
		animation: oneshow 0.8s ease 1;
	}

	.chat-img {
		border-radius: 50%;
		width: 100rpx;
		height: 100rpx;
		background-color: #f7f7f7;
		display: flex;
		flex-direction: row;
		justify-content: center;
		align-items: center;
	}

	.aimsg {
		display: flex;
		flex-direction: column;
		justify-content: center;
		margin-left: 20rpx;
		padding: 17rpx 20rpx;
	}

	.flex-column-center {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		position: fixed;
		bottom: 0px;
		width: 100%;
	}

	.inpubut {
		display: flex;
		flex-direction: row;
		justify-content: space-around;
		align-items: center;
		background-color: #f9f9f9;
		width: 100%;
		height: 140rpx;
		font-size: 40rpx;
	}

	.dh-input {
		width: 90%;
		height: 80rpx;
		border-radius: 10rpx;
		padding-left: 40rpx;
		/* margin-left: 20rpx; */
		background-color: #f0f0f0;
	}

	.my-neirong-sm {
		font-size: 23rpx;
		color: #616161;
	}

	.btn {
		height: 80rpx;
		line-height:80rpx;
		width: 90%;
		/* margin-left:40rpx; */
		background-color: cornflowerblue;
		color: #ffffff;
		font-size: 35rpx;
		border-radius: 10rpx;

	}
	
.session_btn{
	margin-top:20vw;
	background-color: cornflowerblue;
	color: #ffffff;
	font-size: 35rpx;
	border-radius: 10rpx;
}
	.popcls {
		width: 50vw;
		height: 100%;
		background: white;
		/* border-radius: 20rpx; */
		display: flex;
		flex-direction: column;
		justify-items: center;
		align-items: center;



	}
</style>
