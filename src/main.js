import Vue from 'vue'
import App from './App'
import store from './store'
import '../static/css/main.css'
import '../static/css/icon.css'
import cuCustom from './components/cu-custom.vue'
import Loading from './components/loading.vue'
import ReTry from './components/re-try.vue'
import { jsonRequest } from '@/utils/api'
Vue.component('cu-custom', cuCustom)
Vue.component('Loading', Loading)
Vue.component('ReTry', ReTry)
wx.getSystemInfo({
  success: function(e) {
    Vue.prototype.StatusBar = e.statusBarHeight
    if (e.platform == 'android') {
      Vue.prototype.CustomBar = e.statusBarHeight + 50
    } else {
      Vue.prototype.CustomBar = e.statusBarHeight + 45
    }
  }
})

Vue.prototype.ColorList = [
  {
    title: '嫣红',
    name: 'red',
    color: '#e54d42'
  },
  {
    title: '桔橙',
    name: 'orange',
    color: '#f37b1d'
  },
  {
    title: '明黄',
    name: 'yellow',
    color: '#fbbd08'
  },
  {
    title: '橄榄',
    name: 'olive',
    color: '#8dc63f'
  },
  {
    title: '森绿',
    name: 'green',
    color: '#39b54a'
  },
  {
    title: '天青',
    name: 'cyan',
    color: '#1cbbb4'
  },
  {
    title: '海蓝',
    name: 'blue',
    color: '#0081ff'
  },
  {
    title: '姹紫',
    name: 'purple',
    color: '#6739b6'
  },
  {
    title: '木槿',
    name: 'mauve',
    color: '#9c26b0'
  },
  {
    title: '桃粉',
    name: 'pink',
    color: '#e03997'
  },
  {
    title: '棕褐',
    name: 'brown',
    color: '#a5673f'
  },
  {
    title: '玄灰',
    name: 'grey',
    color: '#8799a3'
  },
  {
    title: '草灰',
    name: 'gray',
    color: '#aaaaaa'
  },
  {
    title: '墨黑',
    name: 'black',
    color: '#333333'
  },
  {
    title: '雅白',
    name: 'white',
    color: '#ffffff'
  }
]
Vue.prototype.showToast = (title, icon) => {
  wx.showToast({
    title,
    icon: icon || 'none',
    duration: 1500
  })
}
Vue.prototype.jsonRequest = jsonRequest
Vue.prototype.$store = store

Vue.config.productionTip = false
App.mpType = 'app'
const app = new Vue({
  ...App,
  store
})
app.$mount()
Vue.prototype.globalData = getApp().globalData
getApp().globalData.isReNeedRequest = false

// const updateManager = wx.getUpdateManager()

// updateManager.onCheckForUpdate(function(res) {
//   // 请求完新版本信息的回调
//   console.log(res.hasUpdate)
// })

// updateManager.onUpdateReady(function() {
//   wx.showModal({
//     title: '更新提示',
//     content: '新版本已经准备好，是否重启应用？',
//     success: function(res) {
//       if (res.confirm) {
//         // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
//         updateManager.applyUpdate()
//       }
//     }
//   })
// })

// updateManager.onUpdateFailed(function() {
//   // 新版本下载失败
// })
