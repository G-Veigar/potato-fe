<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import router from "../router";
import { request, API } from '../request/index.js'
import { showDialog } from 'vant';

const username = ref('');
const msgCode = ref('');
const codeSendInternal = ref(0);

const phoneReg = /^(?:(?:\+|00)86)?1\d{10}$/

async function sendCode() {
  if(!phoneReg.test(username.value)) {
    showDialog({title: '提示', message: "手机号输入不正确！"})
    return
  }
  if(codeSendInternal.value > 0) {
    return
  }
  try {
    const data = await request.post(API.sendCode, { phone: username.value})
    if(data.status === 200) {
      if(data.data?.errno === 0) {
        codeSendInternal.value = 60
        const timer = setInterval(() => {
          codeSendInternal.value -= 1
          if(codeSendInternal.value === 0) {
            clearInterval(timer)
          }
        }, 1000)
      } else {
        showDialog({title: '提示', message: data.data?.errmsg || '服务器错误'})
      }
    }
  } catch (e: any) {
    const errorMsg = e.response?.data?.errmsg || '服务器错误'
    showDialog({title: '提示', message: errorMsg})
  }
}

const talkList = [
  '这里可查看小土豆们每日的肥料采集情况……',
  '周六日是小土豆的休息日，小土豆不采集肥料……',
  '肥料通过买入来产出，买入N个肥料，才能产出N个肥料……',
  '当体力不足时，将不会再产出肥料，请及时补充体力……',
  '当赛季的矿池额度采集满额后，溢出的采集无效，将不再产出肥料……',
  '输入手机号就能查看探险家的肥料采集情况……',
  '肥料是PieceLand中的硬通货，需要好好囤积……'
]

const talkMsg = ref('')

async function login() {
  if(String(msgCode.value).length !== 6){
    showDialog({title: '提示', message: '验证码输入错误'})
    return
  }
  try {
    const data = await request.post(API.login, {
      phone: username.value,
      code: msgCode.value,
    })
    if(data.status === 200) {
      if(data.data?.errno === 0) {
        localStorage.setItem('token', data.data?.data?.token)
        // localStorage.setItem('token', 'fa2d2ccbe772c48e7f324ef49b0bc1a1')
        router.push('/mint')
      } else {
        showDialog({title: '提示', message: data.data?.errmsg || '服务器错误'})
      }
    }
  } catch(e: any) {
    const errorMsg = e.response?.data?.errmsg || '服务器错误'
    showDialog({title: '提示', message: errorMsg})
  }
}

const talkMsgShow = ref(false)

function startTalk() {
  let talkIndex = 0
  talkMsg.value = talkList[talkIndex]
  talkMsgShow.value = true
  setInterval(() => {
    if(talkIndex === talkList.length - 1) {
      talkIndex = 0
    } else {
      talkIndex++
    }
    talkMsg.value = talkList[talkIndex]
  }, 4000)
}

onMounted(() => {
  setTimeout(startTalk, 1500)
})
</script>

<template>
  <div class="login-page">
    <!-- 对话框 -->
    <div class="lufei-message">
      <div class="lufei-img"></div>
      <Transition>
        <div class="message-box" v-show="talkMsgShow">{{ talkMsg }}</div>
      </Transition>
    </div>
    <!-- 登录 -->
    <div class="login-wrapper">
      <div class="username">
        <div class="input-label username-label">用户名：</div>
        <input type="text" v-model.trim="username" autofocus>
      </div>
      <div class="msgcode">
        <div class="input-label msgcode-label">验证码：</div>
        <input type="number" v-model.trim="msgCode">
        <button class="get-code-btn" @click="sendCode">{{ codeSendInternal > 0 ? `${codeSendInternal}秒` : '获取' }}</button>
      </div>
      <button class="login-btn" @click="login">查询</button>
    </div>
    <!-- logo -->
    <div class="logo"></div>
  </div>
</template>

<style lang="scss">
.v-enter-active,
.v-leave-active {
  transition: all 0.5s ease;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
  transform-origin: 0% 300%;
  transform: scale(0);
}

.login-page {
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 100vh;
  padding: 120px 20vw 50px;
}
.lufei-message {
  align-self: stretch;
  position: relative;
  .lufei-img {
    background: url('../assets/tudou.png') no-repeat;
    background-size: 100%;
    width: 140px;
    height: 140px;
    margin-left: -40px;
  }
  .message-box {
    position: relative;
    width: 200px;
    background-color: #fff;
    position: absolute;
    top: -16px;
    left: 60px;
    border-radius: 2px;
    color: #000000;
    font-size: 12px;
    padding: 6px 10px;
    z-index: 1;

    &::before {
      display: block;
      content: '';
      width: 0;
      height: 0;
      border: 12px solid transparent;
      border-left: 8px solid #fff;
      position: absolute;
      bottom: -12px;
      left: 20px;
      transform: rotate(10deg);
    }
  }
}
.login-wrapper {
  display: flex;
  flex-direction: column;
  flex: auto;
  margin-top: 60px;
  .username, .msgcode {
    display: flex;
    align-items: center;
  }
  .msgcode {
    margin-top: 30px;
    position: relative;
  }
  .input-label {
    color: #fff;
    font-size: 16px;
    width: 80px;
    flex: none;
    font-weight: bold;
  }

  input {
    border: 0;
    border-bottom: 1px solid #494949;
    background: transparent;
    color: #fff;
    height: 40px;
    line-height: 40px;
    outline: none;
  }

  .get-code-btn {
    color: #fff;
    background-color: transparent;
    border: 0;
    position: absolute;
    right: 6px;
    top: 50%;
    transform: translateY(-50%);
    font-weight: bold;
  }

  .login-btn {
    margin-top: 50px;
    background-color: transparent;
    border: 2px solid #fff;
    font-weight: bold;
    color: #fff;
    flex: auto;
    height: 36px;
    font-size: 16px;
    flex: none;
  }
}

.logo {
  width: 160px;
  height: 40px;
  background: url('../assets/logo.jpg') no-repeat;
  background-size: 100%;
}
</style>
