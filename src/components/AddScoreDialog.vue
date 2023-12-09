<script setup lang="ts">
import { ref } from 'vue'
import { request, API } from '../request/index.js'

defineProps<{
  show: boolean,
  manure: number,
}>()

const emits = defineEmits(['update:show', 'refresh'])

const POWER_STATUS = {
  LOADING: '补充体力中...',
  SUCCESS: '补充成功！',
  FAIL: '补充失败！'
}

const powerStatus = ref(POWER_STATUS.LOADING)
const powerStatusShow = ref(false)

const inputScore = ref(1)

async function addScore() {
  powerStatus.value = POWER_STATUS.LOADING
  // request.post
  powerStatusShow.value = true
  try {
    const data = await request.post(API.putFight, {
      count: inputScore.value
    })
    if (data.status === 200) {
      if (data.data?.errno === 0) {
        powerStatus.value = POWER_STATUS.SUCCESS
        emits('update:show', false)
        emits('refresh')
        setTimeout(() => powerStatusShow.value = false, 2000)
      } else {
        powerStatus.value = POWER_STATUS.FAIL
        setTimeout(() => powerStatusShow.value = false, 2000)
      }
    }
  } catch (e: any) {
    // const errorMsg = e.response?.data?.errmsg || '服务器错误'
    powerStatus.value = POWER_STATUS.FAIL
    setTimeout(() => powerStatusShow.value = false, 2000)
  }
}
</script>

<template>
  <div class="add-power-dialog" v-show="show">
    <div class="dialog-box">
      <div class="add-input-wrapper">
        <div class="all-score">
          <div class="title">可投入</div>
          <div class="value">{{ manure }}</div>
        </div>
        <div class="input-score">
          <div class="title">投入</div>
          <input type="number" v-model="inputScore" :max="manure || 1" min="1">
        </div>
      </div>
      <div class="tip">投入后肥料将被销毁</div>
      <div class="btn-wrapper">
        <button class="common-btn confirm-btn" @click="addScore" :disabled="manure===0">投入</button>
        <button class="common-btn cancel-btn" @click="$emit('update:show', false)">取消</button>
      </div>
    </div>
    <div class="status-toast" v-show="powerStatusShow">
      {{ powerStatus }}
    </div>
  </div>
</template>

<style scoped lang="scss">
.add-power-dialog {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  color: #fff;
  z-index: 100;

  .dialog-box {
    display: flex;
    flex-direction: column;
    width: 78%;
    max-width: 400px;
    background-color: #000;
    border-radius: 10px;
    border: 2px solid #ccc;
    box-sizing: border-box;
    padding: 20px 40px 20px;
    align-items: center;

    .tip {
      font-size: 12px;
      margin-bottom: 20px;
    }
  }

  .add-input-wrapper {
    display: flex;
    margin-bottom: 20px;
    .all-score, .input-score {
      display: flex;
      flex-direction: column;
      align-items: center;
      .title {
        margin-bottom: 10px;
      }
      .value {
        height: 20px;
        line-height: 20px;
      }
    }

    .input-score {
      margin-left: 90px;
      display: flex;
      align-items: center;
      input {
        color: #000;
        width: 24px;
        height: 20px;
        text-align: center;
      }
    }
  }

  .btn-wrapper {
    display: flex;
    .confirm-btn {
      width: 70px;
      &[disabled] {
        filter: grayscale(80);
      }
    }
    .cancel-btn {
      width: 70px;
      margin-left: 30px;
    }
  }

  .status-toast {
    position: absolute;
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: rgba(0, 0, 0, 0.5);
    color: #fff;
    font-weight: bold;
    font-size: 20px;
  }
}
</style>
