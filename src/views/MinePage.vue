<script setup lang="ts">
import { ref, computed, type Ref } from "vue"
import { useRouter } from 'vue-router'
import { request, API } from '../request/index.js'
import TakeOutDialog from '@/components/TakeOutDialog.vue'
import { showDialog } from 'vant';
import CommonDialog from '@/components/CommonDialog.vue'

const router = useRouter()

const tabName:Ref<'record' | 'rank'> = ref('record')

const myRecords:Ref<any> = ref([])

async function getMyRecords() {
  try {
    const data = await request.get(API.myRecords)
    if(data.status === 200) {
      if(data.data?.errno === 0) {
        const innerData = data.data?.data
        if (!innerData) return
        myRecords.value = innerData
      } else {
        showDialog({message: data.data?.errmsg || '服务器错误'})
      }
    }
  } catch(e: any) {
    const errorMsg = e.response?.data?.errmsg || '服务器错误'
    showDialog({message: errorMsg})
  }
}

// const rankList:Ref<any> = ref([])
const rankList:Ref<any> = ref([
  {
    phone: '18722503732',
    total_reward: 12
  },
  {
    phone: '18722502232',
    total_reward: 1
  }
])

async function getRankList() {
  try {
    const data = await request.get(API.fightRank)
    if(data.status === 200) {
      if(data.data?.errno === 0) {
        const innerData = data.data?.data
        if (!innerData) return
        rankList.value = innerData
      } else {
        showDialog({message: data.data?.errmsg || '服务器错误'})
      }
    }
  } catch(e: any) {
    const errorMsg = e.response?.data?.errmsg || '服务器错误'
    showDialog({message: errorMsg})
  }
}

const userInfo:Ref<any> = ref({})
const myCount = computed(() => {
  return userInfo.value.total_reward || 0
})
const canTakeCount = computed(() => {
  return Math.floor(myCount.value)
})

async function getUserInfo() {
  try {
    const data = await request.get(API.useInfo)
    if(data.status === 200) {
      if(data.data?.errno === 0) {
        const innerData = data.data?.data
        if (!innerData) return
        userInfo.value = innerData
      } else {
        showDialog({message: data.data?.errmsg || '服务器错误'})
      }
    }
  } catch(e: any) {
    const errorMsg = e.response?.data?.errmsg || '服务器错误'
    showDialog({message: errorMsg})
  }
}

const takeOutDialogShow = ref(false)
const commonDialogShow = ref(false)

function handleBattle() {
  commonDialogShow.value = true
  // router.push('/team')
}

getUserInfo()
getMyRecords()
getRankList()
</script>

<template>
  <div class="mine-page">
    <div class="inner-wrapper">
      <div class="my-score">
        <div class="title">我赢取的战力：{{ myCount }}</div>
        <button class="common-btn take-out-btn" @click="takeOutDialogShow = true" :disabled="myCount === 0">提取</button>
      </div>
      <div class="record-and-rank">
        <div class="tab-bar">
          <div class="tab-item tab-record" @click="tabName = 'record'" :class="{active: tabName === 'record'}">我的记录</div>
          <div class="tab-item tab-rank" @click="tabName = 'rank'" :class="{active: tabName === 'rank'}">战力排行</div>
        </div>
        <div class="tab-view">
          <div class="record-list" v-show="tabName === 'record'">
            <div class="record-list-row">
              <div class="season">赛季</div>
              <div class="score">投入战力</div>
              <div class="my-win">获得战力</div>
              <div class="leader-award">队长奖励</div>
            </div>
            <div class="record-list-row" v-for="item in myRecords" :key="item.season_id">
              <div class="season">{{item.season_id}}</div>
              <div class="score">{{item.fight}}</div>
              <div class="my-win">{{item.reward}}</div>
              <div class="leader-award">{{item.captain_reward}}</div>
            </div>
          </div>
          <div class="rank-list" v-show="tabName === 'rank'">
            <div class="rank-list-row">
              <div class="rank-index">排名</div>
              <div class="user">用户</div>
              <div class="score">获得战力</div>
            </div>
            <div class="rank-list-row" v-for="(item, index) in rankList" :key="item.id">
              <div class="rank-index">{{index + 1}}</div>
              <div class="user">{{item.phone}}</div>
              <div class="score">{{item.total_reward}}</div>
            </div>
          </div>
        </div>
      </div>
      <div class="btn-group">
        <button class="common-btn mint-btn" @click="router.push('/mint')">去挖矿</button>
        <button class="common-btn battle-btn" @click="handleBattle">参与对抗</button>
      </div>
    </div>
    <TakeOutDialog v-model:show="takeOutDialogShow" :take-out-count="canTakeCount" @refresh="getUserInfo"></TakeOutDialog>
    <CommonDialog v-model:show="commonDialogShow"></CommonDialog>
  </div>
</template>

<style type="text/scss" scoped>
.mine-page {
  background: url('../assets/mine-bg.jpg');
  background-size: cover;
}
.inner-wrapper {
  padding: 24px 20px;
  box-sizing: border-box;
  color: #fff;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  min-height: 100vh;
  background-color: rgba(0, 0, 0, 0.8);
}
.my-score {
  border-bottom: 1px solid #666;
  display: flex;
  justify-content: space-between;
  padding-bottom: 24px;
  align-items: center;
  .take-out-btn {
    width: 60px;
    height: 40px;
    font-size: 12px;
    &[disabled] {
      filter: grayscale(80);
    }
  }
}

.record-and-rank {
  flex: auto;
  margin-top: 18px;
  .tab-bar {
    display: flex;
    margin-bottom: 16px;
    .tab-item.active {
      color: #FFF5CC;
      font-weight: bold;
    }
    .tab-rank {
      margin-left: 14px;
    }
  }
}

.record-list {
  .record-list-row {
    display: flex;
    text-align: center;
    width: 100%;
  }

  .season {
    width: 19%;
    flex: none;
  }

  .score {
    width: 27%;
    flex: none;
  }

  .my-win {
    width: 27%;
    flex: none;
  }

  .leader-award {
    width: 27%;
    flex: none;
  }
}

.rank-list {
  .rank-list-row {
    display: flex;
    text-align: center;
  }

  .rank-index {
    width: 20%;
    flex: none;
  }

  .user {
    width: 55%;
    flex: none;
  }

  .score {
    width: 25%;
    flex: none;
  }
}

.btn-group {
  display: flex;
  justify-content: center;
  padding-bottom: 40px;

  .battle-btn {
    margin-left: 50px;
  }
}
</style>


