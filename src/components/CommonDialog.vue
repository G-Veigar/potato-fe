<script setup lang="ts">
import { ref } from 'vue'
import { request, API } from '../request/index.js'
import { showDialog } from 'vant'

defineProps<{
  show: boolean,
}>()
</script>

<template>
  <div class="common-dialog" v-show="show">
    <div class="dialog-box">
      <div class="dialog-title">敬请期待~!</div>
      <button class="common-btn cancel-btn" @click="$emit('update:show', false)">确定</button>
    </div>
  </div>
</template>

<style scoped lang="scss">
.common-dialog {
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
      margin-bottom: 20px;
      margin-top: 20px;
    }
}
</style>
