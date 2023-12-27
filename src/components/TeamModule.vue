<script setup lang="ts">
import { ref, computed, unref, type Ref } from "vue"
import AddScoreDialog from "@/components/AddScoreDialog.vue"
import { request, API } from '../request/index.js'
// import { CountDown } from 'vant'
import { showDialog } from 'vant';

const props = defineProps<{
  status: any,
  manure: number,
  jackpot: number,
  countDownTime: any
}>()

const emits = defineEmits(['refresh'])

const teamList:Ref<any> = ref([])
const joinTeamId = ref(0)

async function getTeamList() {
  try {
    const data = await request.get(API.teamInfo)
    if (data.status === 200) {
      if (data.data?.errno === 0) {
        const innerData = data.data?.data
        if (!innerData) return
        teamList.value = innerData.units || []
        joinTeamId.value = innerData.join_unit_id ?? ''
      } else {
        showDialog({title: '提示', message: data.data?.errmsg || '服务器错误'})
      }
    }
  } catch (e: any) {
    const errorMsg = e.response?.data?.errmsg || '服务器错误'
    showDialog({title: '提示', message: errorMsg})
  }
  // teamList.value = [
	// 		{
	// 			"id": 5,
	// 			"season_id": 6,
	// 			"name": "船长一队",
	// 			"type": 1,
	// 			"members": 0,
	// 			"status": 1, //战队状态： 1 进行中， 2 已淘汰
	// 			"stage_no": 1,
	// 			"fight": 0,
	// 			"captain": 0,
	// 			"reward": 0,
	// 			"create_time": "2023-12-02T10:32:55+08:00",
	// 			"update_time": "2023-12-02T10:32:55+08:00"
	// 		},
	// 		{
	// 			"id": 6,
	// 			"season_id": 6,
	// 			"name": "船长二队",
	// 			"type": 1,
	// 			"members": 0,
	// 			"status": 2,
	// 			"stage_no": 1,
	// 			"fight": 0,
	// 			"captain": 0,
	// 			"reward": 0,
	// 			"create_time": "2023-12-02T10:32:55+08:00",
	// 			"update_time": "2023-12-02T10:32:55+08:00"
	// 		},
	// 		{
	// 			"id": 7,
	// 			"season_id": 6,
	// 			"name": "恶龙一队",
	// 			"type": 2,
	// 			"members": 0,
	// 			"status": 2,
	// 			"stage_no": 1,
	// 			"fight": 0,
	// 			"captain": 0,
	// 			"reward": 0,
	// 			"create_time": "2023-12-02T10:32:55+08:00",
	// 			"update_time": "2023-12-02T10:32:55+08:00"
	// 		},
	// 		{
	// 			"id": 8,
	// 			"season_id": 6,
	// 			"name": "恶龙二队",
	// 			"type": 2,
	// 			"members": 0,
	// 			"status": 2,
	// 			"stage_no": 1,
	// 			"fight": 0,
	// 			"captain": 0,
	// 			"reward": 0,
	// 			"create_time": "2023-12-02T10:32:55+08:00",
	// 			"update_time": "2023-12-02T10:32:55+08:00"
	// 		}
	// 	]
  // joinTeamId.value = 5
}

const championTeam = computed(() => {
  let championTeamId = ''
  let outCount = 0
  for(let i = 0; i < teamList.value.length; i++) {
    let teamItem = teamList.value[i]
    if(teamItem.status === 1) {
      championTeamId = teamItem.id
    } else {
      outCount++
    }
  }
  return outCount === teamList.value.length - 1 ? championTeamId : ''
})

async function selectTeam(id: string) {
  try {
    const data = await request.post(API.joinTeam, {
      "unit_id": id
    })
    if (data.status === 200) {
      if (data.data?.errno === 0) {
        getTeamList()
      } else {
        showDialog({title: '提示', message: data.data?.errmsg || '服务器错误'})
      }
    }
  } catch (e: any) {
    const errorMsg = e.response?.data?.errmsg || '服务器错误'
    showDialog({title: '提示', message: errorMsg})
  }
}

const addScoreDialogShow = ref(false)

function addScore(name: string) {
  addScoreDialogShow.value = true
  console.log('addScore', name)
}

const countDownTitle = computed(() => {
  if(props.status === 'TEAM_BATTLE') {
    return '本轮倒计时'
  } else if(props.status === 'TEAM_CHOICE'){
    return '加入战队'
  } else {
    return '下赛季待开始'
  }
})

const time = computed(() => {
  if(!props.countDownTime) return
  const end_time = new Date(props.countDownTime)
  const time = end_time.getTime() - Date.now()
  return time
  // // console.log('props.seasonInfo', props.seasonInfo.stages[0])
  // if(!props.seasonInfo) {
  //   return 0
  // }
  // if(props.status === 'TEAM_BATTLE') {
  //   const currentStage = props.seasonInfo.stages.find((item: any) => {
  //     return item.status === 2
  //   })
  //   const end_time = new Date(currentStage.end_time)
  //   const time = Date.now() - end_time.getTime()
  //   return time
  // } else if(props.status === 'TEAM_CHOICE') {
  //   const end_time = new Date(props.seasonInfo?.stages[0]?.end_time)
  //   const time = Date.now() - end_time.getTime()
  //   return time
  // } else {
  //   if(props.seasonInfo?.season?.status === 1) {
  //     const beiginTime = new Date(props.seasonInfo.season.start_time)
  //     const time = Date.now() - beiginTime.getTime()
  //     return time
  //   } else {
  //     return 0
  //   }
  // }
});

function refresh(id?: string) {
  console.log('refresh', id)
  if(time.value===0) return
  getTeamList()
  emits('refresh')
}

getTeamList()
</script>

<template>
  <div class="team-module">
    <div class="top-info">
      <div class="info-left">
        <div class="title">{{ countDownTitle }}</div>
        <van-count-down class="info-data" :time="time" format="HH时mm分ss秒" v-if="time && status !== 'NOT_BEGAIN'" @finish="refresh"/>
      </div>
      <div class="info-right" v-if="status === 'TEAM_BATTLE' || status === 'BATTLE_END'">
        <div class="title">奖池规模</div>
        <div class="info-data">{{ jackpot }} 肥料</div>
      </div>
    </div>
    <div class="team-list">
      <div class="list-header">
        <div class="team-name">战队</div>
        <div class="team-leader">队长</div>
        <div class="team-score" v-if="status === 'TEAM_BATTLE'">战力值</div>
        <div class="team-member">成员</div>
        <div class="team-select">{{ status === 'TEAM_BATTLE' ? '投入战力' : '选择'}}</div>
      </div>
      <div class="list-item" v-for="item in teamList" :key="item.name">
        <div class="team-name">{{item.name}}</div>
        <div class="team-leader">{{item.captain}}</div>
        <div class="team-score" v-if="status === 'TEAM_BATTLE'">{{item.fight}}</div>
        <div class="team-member">{{item.members}}</div>
        <div class="team-select">
          <template v-if="status === 'TEAM_BATTLE'">
            <button v-if="item.id === joinTeamId && !championTeam" class="common-btn add-score-btn" @click="addScore(item.name)">投入</button>
            <span class="status-text" v-if="item.status === 2">淘汰</span>
            <span class="status-text win" v-if="item.id === championTeam">获胜</span>
          </template>
          <template v-else-if="status === 'BATTLE_END'">
            <span class="status-text" v-if="item.status === 2">淘汰</span>
            <span class="status-text win" v-if="item.id === championTeam">获胜</span>
          </template>
          <template v-else>
            <button v-if="joinTeamId === 0" class="common-btn select-btn" @click="selectTeam(item.id)">冲</button>
            <span v-else-if="joinTeamId === item.id">已加入</span>
          </template>
        </div>
      </div>
    </div>
    <AddScoreDialog v-model:show="addScoreDialogShow" :manure="manure" @refresh="refresh('AddScoreDialog')"></AddScoreDialog>
  </div>
</template>

<style type="text/scss" scoped>
.team-module {
  align-self: stretch;
  color: #fff;
  display: flex;
  flex-direction: column;
  align-items: center;

  .top-info {
    display: flex;
    margin-top: 20px;
    .info-right, .info-left {
      text-align: center;
      font-size: 14px;

      .info-data {
        height: 22px;
        line-height: 22px;
        color: #fff;
      }
      .title {
        margin-bottom: 8px;
      }
    }
    .info-right {
      margin-left: 80px;
    }
  }

  .team-list {
    align-self: stretch;
    margin: 0 20px;
    font-size: 14px;
    border-bottom: 1px solid #666;
    padding-bottom: 30px;
    .list-header, .list-item {
      display: flex;
      justify-content: space-between;
      text-align: center;
      .team-name {
        width: 70px;
        flex: none;
      }

      .team-leader {
        width: 90px;
        flex: none;
      }

      .team-score {
        width: 70px;
        flex: auto;
      }

      .team-member {
        width: 50px;
        flex: none;
      }

      .team-select {
        width: 70px;
        flex: none;
      }
      .status-text {
        color: #FF7676;
        font-size: 14px;
        &.win {
          color: #9ADE7B;
        }
      }
      .select-btn {
        width: 50px;
        height: 30px;
        font-size: 12px;
        border: none;
      }

      .add-score-btn {
        width: 60px;
        height: 30px;
        border: none;
        font-size: 12px;
      }
    }

    .list-header {
      margin: 20px 0 15px;
      padding-top: 20px;
      border-top: 1px solid #666;
    }

    .list-item {
      display: flex;
      align-items: center;
      margin-bottom: 10px;
    }
  }
}
</style>
