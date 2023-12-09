<script setup lang="ts">
import { ref, onMounted, type Ref } from 'vue'
import { useRouter } from 'vue-router'
import AddPowerDialog from '@/components/AddPowerDialog.vue';
import { request, API } from '../request/index.js'
import { showDialog } from 'vant';

const router = useRouter()

const dataList = ref([
  {
    label: '探险家',
    value: '-'
  },
  {
    label: '初始体力',
    value: 0
  },
  {
    label: '昨日持有未寄售小土豆',
    value: 0
  },
  {
    label: '昨日持有未寄售地块',
    value: 0
  },
  {
    label: '昨日最大肥料产量',
    value: 0
  },
  {
    label: '昨日采集次数',
    value: 0
  },
  {
    label: '昨日初始体力',
    value: 0
  },
  {
    label: '昨日补充体力',
    value: 0
  },
  {
    label: '昨日成功采集肥料',
    value: 0
  },
  {
    label: '昨日剩余体力',
    value: 0
  },
  {
    label: '待空投肥料',
    value: 0
  },
  {
    label: '历史已采集肥料',
    value: 0
  },
])

const runStyle = ref({
  left: '-100vw',
  bottom: '240px'
})

const runReverse = ref(false)

function run() {
  setTimeout(() => {
    if (runStyle.value.left === '-150vw') {
      runStyle.value.left = '150vw'
      runReverse.value = false
    } else {
      runStyle.value.left = '-150vw'
      runReverse.value = true
    }
    const randomNum = Math.random() * (200 - 1)
    runStyle.value.bottom = `${200 + randomNum}px`
  }, 500)
}

async function getMintInfo() {
  try {
    const data = await request.get(API.mintInfo)
    console.log('getMintInfo', data)
    if (data.status === 200) {
      if (data.data?.errno === 0) {
        const innerData = data.data?.data
        if (!innerData) return
        dataList.value = [
          {
            label: '探险家',
            value: innerData.phone
          },
          {
            label: '初始体力',
            value: innerData.init_strength
          },
          {
            label: '昨日持有未寄售小土豆',
            value: innerData.last_potato_count
          },
          {
            label: '昨日持有未寄售地块',
            value: innerData.last_soil_count
          },
          {
            label: '昨日最大肥料产量',
            value: innerData.last_max_manure_count
          },
          {
            label: '昨日采集次数',
            value: innerData.last_mint_times
          },
          {
            label: '昨日初始体力',
            value: innerData.last_init_strength
          },
          {
            label: '昨日补充体力',
            value: innerData.last_supply_strength
          },
          {
            label: '昨日成功采集肥料',
            value: innerData.last_mint_manure_count
          },
          {
            label: '昨日剩余体力',
            value: innerData.last_remain_strength
          },
          {
            label: '待空投肥料',
            value: innerData.wait_put_count
          },
          {
            label: '历史已采集肥料',
            value: innerData.total_mint_count
          },
        ]
      } else {
        console.log('else')
        showDialog({
          title: '提示',
          message: data.data?.errmsg || '服务器错误'
        })
      }
    }
  } catch (e: any) {
    console.log('catch')
    const errorMsg = e.response?.data?.errmsg || '服务器错误'
    showDialog({
      title: '提示',
      message: errorMsg
    })
  }
}

getMintInfo()

onMounted(() => {
  run()
})

const powerList: Ref<any[]> = ref([
  {
    id: '',
    label: '小型医疗包',
    value: 0
  },
  {
    id: '',
    label: '中型医疗包',
    value: 0
  },
  {
    id: '',
    label: '大型医疗包',
    value: 0
  }
])

// 获取医疗包详情
async function getPowerList() {
  try {
    const data = await request.get(API.assetCount)
    if (data.status === 200) {
      if (data.data?.errno === 0) {
        const innerData = data.data?.data
        if (!innerData) return
        powerList.value = [
          {
            id: innerData.min_medical_pkg_count?.asset_id,
            label: '小型医疗包',
            value: innerData.min_medical_pkg_count?.count || 0
          },
          {
            id: innerData.middle_medical_pkg?.asset_id,
            label: '中型医疗包',
            value: innerData.middle_medical_pkg?.count || 0
          },
          {
            id: innerData.max_medical_pkg?.asset_id,
            label: '大型医疗包',
            value: innerData.max_medical_pkg?.count || 0
          }
        ]
      } else {
        showDialog({
          title: '提示',
          message: data.data?.errmsg || '服务器错误'
        })
      }
    }
  } catch (e: any) {
    const errorMsg = e.response?.data?.errmsg || '服务器错误'
    showDialog({
      title: '提示',
      message: errorMsg
    })
  }
}

// 补充体力 - 弹框
function addPower() {
  getPowerList()
  addPowerDialogShow.value = true
}

const addPowerDialogShow = ref(false);

// 参与对抗 - 弹框
function openGame() {
  router.push('/team')
}
</script>

<template>
  <div class="detail-page">
    <div class="data-list">
      <div class="data-item" v-for="item in dataList" :key="item.label">
        <div class="data-label">{{ item.label }}</div>
        <div class="data-value">{{ item.value }}</div>
      </div>
    </div>
    <div class="btn-wrapper">
      <button class="common-btn" @click="addPower">补充体力</button>
      <button class="common-btn battle-btn" @click="openGame">参与对抗</button>
    </div>
    <div class="runing-man" :class="{ reverse: runReverse }" :style="runStyle" @transitionend="run">
      <div class="mans"></div>
      <div class="yan"></div>
    </div>

    <!-- 补充体力弹框 -->
    <AddPowerDialog
      :powerList="powerList"
      v-model:show="addPowerDialogShow"
      @refresh="getPowerList"></AddPowerDialog>
  </div>
</template>

<style lang="scss">
.detail-page {
  padding: 20px 30px;
  display: flex;
  flex-direction: column;
  min-height: 100vh;

  .data-list {
    flex: 0 1;

    .data-item {
      font-weight: bold;
      color: #fff;
      display: flex;
      justify-content: space-between;
      margin-bottom: 8px;
    }
  }

  .runing-man {
    flex: none;
    position: fixed;
    transition: left 2.5s linear;
    z-index: 1;

    .mans {
      position: absolute;
      z-index: 2;
      background: url('../assets/tudou.png') no-repeat;
      background-size: 100%;
      width: 140px;
      height: 140px;
      left: 70px;
    }

    .yan {
      top: -4px;
      left: 0;
      position: absolute;
      z-index: 3;
      background: url('../assets/yan.gif') no-repeat;
      background-size: 100%;
      width: 200px;
      height: 200px;
    }

    &.reverse {
      transform: rotateY(180deg);
    }
  }

  .btn-wrapper {
    flex: auto;
    display: flex;
    justify-content: center;
    padding-top: 30px;
    .battle-btn {
      margin-left: 50px;
    }
  }
}</style>
