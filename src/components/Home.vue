<!--
 * @Author: your name
 * @Date: 2020-08-30 11:43:54
 * @LastEditTime: 2020-08-30 12:22:47
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \vue_shop\src\components\Home.vue
-->
<template>
  <div class="home-container">
    <el-button type="info" @click="logout">退出</el-button>
  </div>
</template>
<script>
export default {
  methods: {
    logout () {
      window.sessionStorage.clear()
      this.$router.push('/login')
    }
  }
}
</script>
<style lang="less" scoped>
</style>
