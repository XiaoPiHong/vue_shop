<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图区域 -->
    <el-card>
      <el-row>
        <el-col>
          <el-button type="primary">添加分类</el-button>
        </el-col>
      </el-row>

      <!-- 表格区域,用了vue-table-with-tree-grid组件 -->
      <tree-table :data="catelist" :columns="columns" :selection-type="false" :expand-type="false" :show-index="true"
        index-text="#" border :show-row-hover="false">
        <template slot="isok" slot-scope="scope">
          <i class="el-icon-success" v-if="scope.row.cat_delete===false" style="color:lightgreen;"></i>
          <i class="el-icon-error" v-else style="color:lightgreen;"></i>
        </template>
      </tree-table>

      <!-- 分页区域 -->
    </el-card>
  </div>
</template>
<script>
export default {
  data () {
    return {
      queryInfo: {
        type: 3, pagenum: 1, pagesize: 5
      },
      // 商品分类的数据列表,默认为空
      catelist: [],
      //   总数据条数
      total: 0,
      // 为table指定列的定义
      columns: [
        { label: '分类名称', prop: 'cat_name' },
        // 表示将当前列定义为模板列
        { label: '是否有效', type: 'template', template: 'isok' }
      ]
    }
  },
  created () {
    this.getCateList()
  },
  methods: {
    // 获取商品分类数据
    async getCateList () {
      const { data: res } = await this.$http.get('categories', { params: this.queryInfo })
      if (res.meta.status !== 200) return this.$message.error('获取商品分类失败')
      //   console.log(res.data)
      //   把数据列表复制给catelist
      this.catelist = res.data.result
      // 为总数据条数复制
      this.total = res.data.total
    }
  }
}
</script>
<style lang="less" scoped>
</style>
