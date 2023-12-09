<script setup lang="ts">
import { ref } from 'vue'
import { request, API } from '../request/index.js'
import { showDialog } from 'vant'

defineProps<{
  powerList: any[],
  show: boolean,
}>()

const emits = defineEmits(['update:show', 'refresh'])

const POWER_STATUS = {
  LOADING: '补充体力中...',
  SUCCESS: '补充成功！',
  FAIL: '补充失败！'
}

const powerStatus = ref(POWER_STATUS.LOADING)
const powerStatusShow = ref(false)

// 消耗体力
async function usePower(id: string) {
  try {
    powerStatus.value = POWER_STATUS.LOADING
    powerStatusShow.value = true
    const data = await request.post(API.supplyPower, {
      asset_id: id
    })
    if (data.status === 200) {
      if (data.data?.errno === 0) {
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
  } catch (e: any) {
    const errorMsg = e.response?.data?.errmsg || '服务器错误'
    showDialog({title: '提示', message: errorMsg})
  }
}
</script>

<template>
  <div class="add-power-dialog" v-show="show">
    <div class="dialog-box">
      <div class="dialog-title">消耗医疗包补充体力</div>
      <div class="data-list">
        <div class="data-line" style="marginBottom: 0">
          <div class="data-label"></div>
          <div class="data-value">拥有</div>
          <div class="use-btn" style="visibility: hidden;"></div>
        </div>
        <div class="data-line" v-for="item in powerList" :key="item">
          <div class="data-label">{{ item.label }}</div>
          <div class="data-value">{{ item.value }}</div>
          <button class="common-btn use-btn" @click="usePower(item.id)" :disabled="item.value === 0">消耗1个</button>
        </div>
      </div>
      <button class="common-btn cancel-btn" @click="$emit('update:show', false)">取消</button>
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
      padding: 20px 40px 38px;
      align-items: center;
    }

    .dialog-title {
      font-weight: bold;
      font-size: 20px;
      margin-bottom: 30px;
    }

    .data-list {
      align-self: stretch;
    }

    .data-line {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 36px;

      .data-label {
        width: 90px;
        flex: none;
      }

      .data-value {
        width: 30px;
        flex: none;
        text-align: right;
      }

      .use-btn {
        flex: none;
        width: 70px;
        height: 36px;
        line-height: 36px;
        text-align: center;
        font-size: 12px;
        &[disabled] {
          filter: grayscale(90);
        }
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
