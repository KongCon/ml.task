<template>
  <view>
    <view>
      <cu-custom bgcolor="bg-gradual-purple" :isBack="true">
        <block slot="backText">返回</block>
        <block slot="content">打卡</block>
      </cu-custom>
    </view>
    <view class="container">
      <navigator
        hover-class="none"
        url="/pages/tools_punch_add/main"
        navigateTo
        class="cu-btn bg-gradual-purple shadow-blur round lg add-btn"
      >
        <text class="cuIcon-add"></text>添加打卡
      </navigator>
      <view
        class="cu-card dynamic"
        :class="{'done-punch-item': item.state===1}"
        v-for="item in punch"
        :key="item._id"
        @longpress="showModal(item)"
      >
        <view class="cu-item shadow boxshadow">
          <view class="cu-list menu-avatar cu-list-header">
            <view class="cu-item cu-list-header">
              <view class="cu-avatar round lg">
                <image :src="logoUrl" class="logo" />
              </view>
              <view class="content flex-sub">
                <view class="text-cut">{{item.name}}</view>
                <view class="text-gray text-sm flex justify-between text-cut">{{item.description}}</view>
              </view>
            </view>
          </view>
          <view class="title-text text-cut">
            起止：
            <span style="font-size:20px">{{item.start_date_format[1]}}</span>
            / {{item.start_date_format[0]}} —
            <span
              style="font-size:20px"
            >{{item.end_date_format[1]}}</span>
            / {{item.end_date_format[0]}}
          </view>
          <view class="title-text text-cut fl" @click="punchDetails(item)">
            进度：
            <span style="font-size:20px">{{item.okDays}}</span>
            <span v-if="item.noOkDays">{{' / '}}</span>
            <span class="ml-danger" v-if="item.noOkDays">{{item.noOkDays}}</span>
            / {{item.allDays}}
            <span class="cuIcon-right text-grey margin-left-sm"></span>
          </view>
          <view class="action-btns">
            <!-- <button class="cu-btn round bg-white" @click="punchDetails(item._id)">详情</button> -->
            <button
              class="cu-btn round bg-gradual-purple"
              v-if="!item.today&&item.state===0"
              @click="donePunch(item._id)"
            >打卡</button>
            <button
              class="cu-btn round bg-white"
              v-else-if="item.today&&item.state===0"
              @click="donePunch(item._id, 1)"
            >今天已打卡</button>
            <button class="cu-btn round bg-white" v-else-if="item.state===1">已结束</button>
          </view>
        </view>
      </view>
      <view class="cu-tabbar-height"></view>
      <view class="cu-modal" :class="isShowModal?'show':''" @tap="hideModal">
        <view class="cu-dialog" @tap.stop>
          <view class="cu-list menu text-left">
            <view
              class="cu-item"
              v-for="(item,index) in longPressItemArr"
              :key="index"
              @click="doSomething(index)"
            >
              <label class="flex justify-between align-center flex-sub">
                <view class="flex-sub">{{item}}</view>
              </label>
            </view>
          </view>
        </view>
      </view>
      <Loading v-if="isShowLoading"></Loading>
      <ReTry v-if="isShowReTry" @click="retryGetData"></ReTry>
    </view>
  </view>
</template>
<script>
import {
  GET_PUNCH_DATA,
  PUNCH_OPERATION,
  STORE_PUNCH_BY_PUNCH_ID,
  CLEAR_CURRENT_PUNCH,
  IS_NEED_REFRESH_PUNCH,
  DELETE_PUNCH
} from "@/store/mutation-types";
import store from "@/store";
import { formatYMD } from "@/utils";
export default {
  data() {
    return {
      isShowLoading: true,
      isShowReTry: false,
      punch: [],
      isShowModal: false,
      longPressItemArr: ["编辑", "删除"],
      logoUrl: "/static/images/ml-task-logo.png",
      longPressPunch: {}
    };
  },
  onShow() {
    this.$store.commit(`tools/${CLEAR_CURRENT_PUNCH}`);
    const isNeedRefreshPunch = this.$store.state.tools.isNeedRefreshPunch;
    if (isNeedRefreshPunch) {
      this.getData();
    } else {
      this.onSuccess();
    }
  },
  mounted() {},
  methods: {
    getData() {
      this.isShowLoading = true;
      this.isShowReTry = false;
      this.$store.dispatch(`tools/${GET_PUNCH_DATA}`, {
        onSuccess: this.onSuccess,
        onFailed: this.onFailed
      });
    },
    onSuccess() {
      this.punch = this.$store.state.tools.punch;
      this.isShowLoading = false;
      this.isShowReTry = false;
      this.$store.commit(`tools/${IS_NEED_REFRESH_PUNCH}`, false);
    },
    onFailed() {
      this.isShowLoading = false;
      this.isShowReTry = true;
      this.showToast("请求失败，请重试");
    },
    donePunch(punch_id, isDone) {
      if (isDone) {
        this.showToast("今天已经打过卡了");
        return;
      }
      this.clickRequestSubscribeMessage()
      this.isShowLoading = true;
      const today = formatYMD(new Date());
      this.$store.dispatch(`tools/${PUNCH_OPERATION}`, {
        method: "PUT",
        formData: { today, punch_id },
        onSuccess: this.operationSuccess,
        onFailed: this.operationFailed
      });
    },
    operationSuccess(message) {
      this.$store.commit(`tools/${IS_NEED_REFRESH_PUNCH}`, true);
      this.isShowLoading = false;
      this.showToast(message);
      this.getData();
    },
    operationFailed() {
      this.isShowLoading = false;
      this.showToast("请重试");
    },
    punchDetails(punch) {
      this.$store.commit(`tools/${STORE_PUNCH_BY_PUNCH_ID}`, punch);
      wx.navigateTo({
        url: `/pages/tools_punch_details/main`
      });
    },
    delPunch() {
      this.isShowLoading = true;
      this.isShowReTry = false;
      this.$store.dispatch(`tools/${DELETE_PUNCH}`, {
        onSuccess: this.delSuccess,
        onFailed: this.delFailed
      });
    },
    delSuccess(message) {
      this.$store.commit(`tools/${IS_NEED_REFRESH_PUNCH}`, true);
      this.getData();
      this.isShowLoading = false;
      this.isShowReTry = false;
      this.showToast(message);
    },
    delFailed() {
      this.isShowLoading = false;
      this.showToast("删除失败，请重试");
    },
    showModal(punch) {
      this.isShowModal = true;
      this.longPressPunch = punch;
      this.$store.commit(
        `tools/${STORE_PUNCH_BY_PUNCH_ID}`,
        this.longPressPunch
      );
    },
    hideModal() {
      this.isShowModal = false;
    },
    doSomething(index) {
      this.isShowModal = false;
      switch (index) {
        case 0:
          if (this.longPressPunch.state === 1) {
            this.showToast("已结束打卡不支持编辑");
            return;
          }
          wx.navigateTo({
            url: `/pages/tools_punch_add/main`
          });
          break;
        case 1:
          this.delPunch();
          break;
        default:
          break;
      }
    },
    retryGetData() {
      this.isShowReTry = false
      this.isShowLoading = true
      const {retryActionPayload, retryActionType} = this.$store.state.miniapp
      this.$store.dispatch(retryActionType, retryActionPayload);
    },
    clickRequestSubscribeMessage() {
      const that = this
      wx.requestSubscribeMessage({
        tmplIds: that.$store.state.user.userInfo.priTmplId,
        success(res) {
          for (var key in res) {
            if (key !='errMsg') {
              if (res[key] =='reject') {
                wx.showModal({
                  title:'订阅消息',
                  content:'您已拒绝了订阅消息，如需重新订阅请前往设置打开。',
                  confirmText:'去设置',
                  //showCancel: false,
                  success: res => {
                    if (res.confirm) {
                      wx.openSetting({})
                    }
                  }
                })
                return
              }else{
                wx.showToast({
                  title:'订阅成功'
                })
              }
            }
          }
        },
        fail(err) {
          wx.showModal({
            title:'订阅消息',
            content:'您关闭了“接收订阅信息”，请前往设置打开',
            confirmText:'去设置',
            showCancel:false,
            success: res => {
              if (res.confirm) {
                wx.openSetting({})
              }
            }
          })
        }
      });
    }
  }
};
</script>
<style scoped>
.container {
  padding: 15px 5px 5px;
}
.cu-list-header {
  height: 60px !important;
}
.boxshadow {
  box-shadow: 0 0 10px #ddd;
  position: relative;
  padding-bottom: 10px;
}
.boxshadow .title-text:nth-child(2) {
  margin-top: 10px;
}
.logo {
  height: 100%;
}
.title-text {
  height: 30px;
  line-height: 30px;
  padding: 0 15px;
}
.action-btns {
  position: absolute;
  right: 10px;
  bottom: 10px;
  text-align: right;
}
.add-btn {
  margin-bottom: 5px;
}
.done-punch-item {
  opacity: 0.3;
}
</style>