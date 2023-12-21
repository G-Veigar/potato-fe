<script setup lang="ts">
import { ref, computed, type Ref } from 'vue'
import { useRouter } from 'vue-router'
import TeamModule from '@/components/TeamModule.vue';
import { request, API } from '../request/index.js'
import { showDialog } from 'vant';

const router = useRouter()

enum ACTIVITY_STATUS {
  NOT_BEGIN = 'NOT_BEGIN',
  TEAM_CHOICE = 'TEAM_CHOICE',
  TEAM_BATTLE = 'TEAM_BATTLE',
  BATTLE_END = 'BATTLE_END',
}

const activityStatus:Ref<ACTIVITY_STATUS> = ref(ACTIVITY_STATUS.NOT_BEGIN)

const pageTitle = computed(() => {
  if(activityStatus.value == ACTIVITY_STATUS.TEAM_CHOICE) {
    return '战队选择阶段'
  } else if(activityStatus.value == ACTIVITY_STATUS.TEAM_BATTLE) {
    return '阵营对抗阶段'
  }
  return ''
})

const countInfo:Ref<any>= ref({})

async function getCountInfo() {
  try {
    const data = await request.get(API.teamAssetCount)
    if(data.status === 200) {
      if(data.data?.errno === 0) {
        const innerData = data.data?.data
        if (!innerData) return
        countInfo.value = innerData
      } else {
        showDialog({title: '提示', message: data.data?.errmsg || '服务器错误'})
      }
    }
  } catch(e: any) {
    const errorMsg = e.response?.data?.errmsg || '服务器错误'
    showDialog({title: '提示', message: errorMsg})
  }
}

// const seasonInfo:Ref<any>= ref()

// async function getSeasonInfo() {
//   try {
//     const data = await request.get(API.seasonInfo)
//     if(data.status === 200) {
//       if(data.data?.errno === 0) {
//         const innerData = data.data?.data
//         if (!innerData) return
//         seasonInfo.value = innerData
//         if(innerData.season.status === 1) {
//           activityStatus.value == ACTIVITY_STATUS.TEAM_CHOICE
//         } else if(innerData.season.status === 2) {
//           activityStatus.value == ACTIVITY_STATUS.TEAM_BATTLE
//         } else if(innerData.season.status === 3) {
//           activityStatus.value == ACTIVITY_STATUS.TEAM_BATTLE
//         }
//       } else {
//         showDialog({title: '提示', message: data.data?.errmsg || '服务器错误'})
//       }
//     }
//   } catch(e: any) {
//     const errorMsg = e.response?.data?.errmsg || '服务器错误'
//     showDialog({title: '提示', message: errorMsg})
//   }
//   // seasonInfo.value = {
// 	// 	"season": {
// 	// 		"id": 6,
// 	// 		"name": "",
// 	// 		"champion_unit_id": 0,
// 	// 		"jackpot": 0,
// 	// 		"status": 2,  //赛季状态：1 未开始，2 进行中 3 已经结束
// 	// 		"start_time": "2023-12-02T10:32:55+08:00",
// 	// 		"end_time": "2023-12-07T10:32:55+08:00",
// 	// 		"create_time": "2023-12-02T10:32:55+08:00",
// 	// 		"update_time": "2023-12-02T10:32:55+08:00"
// 	// 	},
// 	// 	"stages": [
// 	// 		{
// 	// 			"id": 10,
// 	// 			"name": "第一阶段",
// 	// 			"no": 1,
// 	// 			"season_id": 6,  //赛季ID
// 	// 			"status": 2, //阶段状态：1 未开始， 2 进行中， 3 已结束
// 	// 			"start_time": "2023-12-03T10:32:55+08:00",
// 	// 			"end_time": "2023-12-04T10:32:55+08:00",
// 	// 			"create_time": "2023-12-02T10:32:55+08:00",
// 	// 			"update_time": "2023-12-02T10:32:55+08:00"
// 	// 		},
// 	// 		{
// 	// 			"id": 11,
// 	// 			"name": "第二阶段",
// 	// 			"no": 2,
// 	// 			"season_id": 6,
// 	// 			"status": 2,
// 	// 			"start_time": "2023-12-04T10:32:55+08:00",
// 	// 			"end_time": "2023-12-05T10:32:55+08:00",
// 	// 			"create_time": "2023-12-02T10:32:55+08:00",
// 	// 			"update_time": "2023-12-02T10:32:55+08:00"
// 	// 		},
// 	// 		{
// 	// 			"id": 12,
// 	// 			"name": "第三阶段",
// 	// 			"no": 3,
// 	// 			"season_id": 6,
// 	// 			"status": 2,
// 	// 			"start_time": "2023-12-05T10:32:55+08:00",
// 	// 			"end_time": "2023-12-06T10:32:55+08:00",
// 	// 			"create_time": "2023-12-02T10:32:55+08:00",
// 	// 			"update_time": "2023-12-02T10:32:55+08:00"
// 	// 		}
// 	// 	]
// 	// }
// }

const jackpot = ref(0)
const countDownTime = ref('')

async function getSeasonStatus() {
  try {
    const data = await request.get(API.seasonStatus)
    if(data.status === 200) {
      if(data.data?.errno === 0) {
        const innerData = data.data?.data
        if (!innerData) return
        switch(innerData.status) {
          case 1: activityStatus.value = ACTIVITY_STATUS.NOT_BEGIN; break;
          case 2: activityStatus.value = ACTIVITY_STATUS.TEAM_CHOICE; break;
          case 3: activityStatus.value = ACTIVITY_STATUS.TEAM_BATTLE; break;
          case 4: activityStatus.value = ACTIVITY_STATUS.BATTLE_END; break;
        }
        countDownTime.value = innerData.end_time
        jackpot.value = innerData.jackpot
      } else {
        showDialog({title: '提示', message: data.data?.errmsg || '服务器错误'})
      }
    }
  } catch(e: any) {
    const errorMsg = e.response?.data?.errmsg || '服务器错误'
    showDialog({title: '提示', message: errorMsg})
  }
}

function handleRefresh() {
  console.log('refresh')
  // getSeasonInfo()
  getCountInfo()
  getSeasonStatus()
}

// getSeasonInfo()
getCountInfo()
getSeasonStatus()
</script>

<template>
  <div class="team-play" :class="{choice: activityStatus == ACTIVITY_STATUS.TEAM_CHOICE, battle: activityStatus == ACTIVITY_STATUS.TEAM_BATTLE}">
    <div class="inner-wrapper">
      <div class="team-play-header">
        <div class="home-btn" @click="router.push('/mine')"></div>
        <div class="page-title">{{ pageTitle }}</div>
      </div>
      <div class="team-vs">
        <div class="team-item">
          <div class="team-icon captain"></div>
          <div class="team-name">船长阵营</div>
        </div>
        <div class="vs-icon">VS</div>
        <div class="team-item">
          <div class="team-icon dragon"></div>
          <div class="team-name">恶龙阵营</div>
        </div>
      </div>
      <TeamModule
        :status="activityStatus"
        :manure="countInfo?.manure?.count || 0"
        :jackpot="jackpot"
        :countDownTime="countDownTime"
        @refresh="handleRefresh">
      </TeamModule>
      <div class="account-info">
        <div class="info-row">
          <div class="my-feiliao">我的肥料：{{ countInfo?.manure?.count }}</div>
          <div class="my-leader">我的船长：{{ countInfo?.captain?.count }}</div>
        </div>
        <div class="info-row two">
          <!-- <div class="my-ticket">可用票数：{{ countInfo?.captain?.count }}</div> -->
          <div class="my-dragon">我的恶龙：{{ countInfo?.dragon?.count }}</div>
        </div>
      </div>
      <button class="common-btn mint-btn" @click="router.push('/mint')">去挖矿</button>
      <div class="bottom-tip">
        <div class="tip-text">
          投票说明：持有船长或恶龙可参与相应阵营的队长竞选。用户每持有1份肥料藏品，拥有1次投票权。投票时间为3天，前四名将成为四个队伍的队长。若有并列票数，排名将按持有肥料数量进行排序，持有量多靠前，若数量一直，则随机排序。
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.team-play {
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 100vh;
  background-size: cover;
  &.choice {
    background: url('../assets/join-bg.jpg');
  }
  &.battle {
    background: url('../assets/team-bg.jpg');
  }
}

.inner-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 100vh;
  background-color: rgba(0, 0, 0, 0.8);
}
.team-play-header {
  display: flex;
  justify-content: center;
  color: #fff;
  font-weight: bold;
  font-size: 18px;
  padding-top: 20px;
  position: relative;
  align-self: stretch;

  .home-btn {
    width: 60px;
    height: 62px;
    position: absolute;
    left: 0;
    top: 0;
    background-image: url('../assets/tudou.png');
    background-size: 100% 100%;
  }
}

.team-vs {
  display: flex;
  align-items: center;
  display: flex;
  justify-content: space-between;
  width: 200px;
  margin-top: 20px;

  .team-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    color: #FFF5D0;
    .team-icon {
      width: 70px;
      height: 70px;
      background-size: 100% 100%;
      &.captain {
        background-image: url('../assets/team-captain-logo.png');
      }
      &.dragon {
        background-image: url('../assets/team-dragon-logo.png');
        background-size: 85% 85%;
        background-repeat: no-repeat;
        background-position: center center;
      }
    }
    .team-name {
      font-size: 12px;
      margin-top: 2px;
    }
  }
  .vs-icon {
    font-size: 20px;
    position: relative;
    top: -10px;
    color: #fff;
  }
}
.account-info {
  margin-top: 30px;
  margin-bottom: 40px;
  color: #fff;
  .info-row {
    display: flex;
    width: 200px;
    justify-content: space-between;
    margin-bottom: 12px;
    &.two {
      justify-content: flex-end;
    }
  }
}
.bottom-tip {
  color: #fff;
  font-size: 10px;
  flex: 1 0;
  display: flex;
  align-items: flex-end;
  padding: 0 20px 20px;
}
</style>
