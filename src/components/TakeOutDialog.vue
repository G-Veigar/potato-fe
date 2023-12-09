<script setup lang="ts">
import { ref } from 'vue'
import { request, API } from '../request/index.js'
import { showDialog } from 'vant'

const props = defineProps<{
  show: boolean,
  takeOutCount: number,
}>()

const emits = defineEmits(['update:show', 'refresh'])

const POWER_STATUS = {
  LOADING: '提取中...',
  SUCCESS: '已全部提取，请等待空投',
  FAIL: '提取失败！'
}

async function takeOut() {
  powerStatus.value = POWER_STATUS.LOADING
  powerStatusShow.value = true
  try {
    const data = await request.post(API.takeOut, {
      "count": props.takeOutCount
    })
    if(data.status === 200) {
      if(data.data?.errno === 0) {
        setTimeout(() => {
          powerStatus.value = POWER_STATUS.SUCCESS
        }, 1000)
      } else {
        setTimeout(() => {
          powerStatus.value = POWER_STATUS.FAIL
        }, 1000)
      }
      emits('refresh')
      setTimeout(() => {
        powerStatusShow.value = false
      }, 2000)
    }
  } catch(e: any) {
    const errorMsg = e.response?.data?.errmsg || '服务器错误'
    showDialog({title: '提示', message: errorMsg})
  }
}

const powerStatus = ref(POWER_STATUS.LOADING)
const powerStatusShow = ref(false)
</script>

<template>
  <div class="add-power-dialog" v-show="show">
    <div class="dialog-box">
      <div class="dialog-title">可提取</div>
      <div class="take-out-num">{{ takeOutCount }}</div>
      <div class="btn-wrapper">
        <button class="common-btn confirm-btn" @click="takeOut">投入</button>
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
    .dialog-title {
      font-size: 16px;
    }
    .take-out-num {
      margin: 20px 0;
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
      input {
        width: 20px;
        height: 20px;
        text-align: center;
      }
    }
  }

  .btn-wrapper {
    display: flex;
    .confirm-btn {
      width: 80px;
    }
    .cancel-btn {
      width: 80px;
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
