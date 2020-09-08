<!--
 * @Author: your name
 * @Date: 2020-09-07 17:41:33
 * @LastEditTime: 2020-09-08 12:12:44
 * @LastEditors: Please set LastEditors
 * @Description: Timeline 时间线（修改订单地址、查询订单、查看物流进度等后台都没有提供）
 * @FilePath: \vue_shop\src\components\order\Order.vue
-->
<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>订单管理</el-breadcrumb-item>
      <el-breadcrumb-item>订单列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图区域 -->
    <el-card>
      <el-row>
        <el-col :span="8">
          <el-input placeholder="请输入内容" clearable v-model="queryInfo.query" @clear="queryOrderList">
            <el-button slot="append" icon="el-icon-search" @click="queryOrderList"></el-button>
          </el-input>
        </el-col>
      </el-row>
      <!-- 订单列表数据 -->
      <el-table :data="orderList" border scripe>
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column label="订单编号" prop="order_number"></el-table-column>
        <el-table-column label="订单价格" prop="order_price"></el-table-column>
        <el-table-column label="是否付款" prop="pay_status">
          <template slot-scope="scope">
            <el-tag type="success" v-if="scope.row.pay_status === '1'">已付款</el-tag>
            <el-tag type="danger" v-else>未付款</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="是否发货" prop="is_send"></el-table-column>
        <el-table-column label="下单时间" prop="create_time">
          <template slot-scope="scope">
            {{scope.row.create_time | dateFormat}}
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-tooltip effect="dark" content="修改地址" placement="top" :enterable="false">
              <el-button icon="el-icon-edit" type="primary" size="mini" @click="showBox(scope.row.order_id)">
              </el-button>
            </el-tooltip>
            <el-tooltip effect="dark" content="物流进度" placement="top" :enterable="false">
              <el-button icon="el-icon-location" type="success" size="mini"
                @click="showProgressBox(scope.row.order_number)">
              </el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页区域 -->
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum" :page-sizes="[ 5, 10, 15]" :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper" :total="total" background>
      </el-pagination>
    </el-card>
    <!-- 修改地址对话框 -->
    <el-dialog title="修改地址" :visible.sync="addressVisable" width="50%" @close="addressDialogClosed">
      <el-form :model="addressForm" :rules="addressFormRules" ref="addressFormRef" label-width="100px">
        <el-form-item label="省市区/县" prop="address1">
          <el-cascader :options="cityData" v-model="addressForm.address1" :props="addressProps" clearable
            @change="handleChange"></el-cascader>
        </el-form-item>
        <el-form-item label="详细地址" prop="address2">
          <el-input v-model="addressForm.address2"></el-input>
        </el-form-item>
        <el-form-item label="确认地址" prop="address3">
          <el-input v-model="address3" disabled></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addressVisable = false">取 消</el-button>
        <el-button type="primary" @click="changeAddress">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 显示物流进度对话框 -->
    <el-dialog title="物流进度" :visible.sync="progressVisible" width="50%">
      <!-- Timeline时间线 -->
      <el-timeline>
        <el-timeline-item v-for="(activity, index) in progressInfo" :key="index" :timestamp="activity.time">
          {{activity.context}}
        </el-timeline-item>
      </el-timeline>
    </el-dialog>
  </div>
</template>
<script>
import cityData from './citydata.js'

export default {
  data () {
    return {
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 10
      },
      total: 0,
      orderList: [],
      addressVisable: false,
      addressForm: {
        address1: [],
        address2: '',
        address3: ''
      },
      addressFormRules: {
        address1: [{
          required: true, message: '请选择省市区/县', trigger: 'blur'
        }],
        address2: [{
          required: true, message: '请填写详细地址', trigger: 'blur'
        }]
      },
      //   cityData: cityData
      //   上面的写法也可以这样写：
      cityData,
      // 级联选择框的配置对象
      addressProps: {
        checkStrictly: false,
        expandTrigger: 'hover',
        children: 'children'
      },
      progressVisible: false,
      // 物流信息
      progressInfo: []
    }
  },
  created () {
    this.getOrderList()
  },
  methods: {
    async getOrderList () {
      const { data: res } = await this.$http.get('orders', {
        params: this.queryInfo
      })
      if (res.meta.status !== 200) return this.$message.error('获取订单列表失败!')
      // console.log(res)
      this.total = res.data.total
      this.orderList = res.data.goods
    },
    handleSizeChange (newSize) {
      this.queryInfo.pagesize = newSize
      this.getOrderList()
    },
    handleCurrentChange (newPage) {
      this.queryInfo.pagenum = newPage
      this.getOrderList()
    },
    // 查询订单
    queryOrderList () {
      // 解决一开始pagenum不为1时查询到数据为空的bug
      this.queryInfo.pagenum = 1
      this.getOrderList()
    },
    // 展示修改地址的对话框
    async showBox (orderId) {
      const { data: res } = await this.$http.get('orders/' + orderId)
      if (res.meta.status !== 200) return this.$message.error('查看订单详情失败')
      console.log(res)
      const temp = res.data.consignee_addr
      this.addressForm.address1 = temp.substring(0, temp.lastIndexOf('/')).split('/')
      this.addressForm.address2 = temp.substring(temp.lastIndexOf('/') + 1, temp.length)
      this.addressForm.address3 = this.address3
      console.log(this.addressForm.address1)
      this.addressVisable = true
    },
    addressDialogClosed () {
      this.$refs.addressFormRef.resetFields()
    },
    // 显示修改地址对话框
    async showProgressBox (orderNumber) {
      console.log(orderNumber)
      // 这里本身是利用作用域插槽拿到订单编号order_number，再拿到该订单的 物流单号 来查询物流进度的，后台只提供了测试的物流单号，并没有实现真正的物流查询功能，所以这里的请求地址将物流单号写死了
      const { data: res } = await this.$http.get('/kuaidi/1106975712662')
      if (res.meta.status !== 200) {
        return this.$message.error('获取物流进度失败')
      }
      this.progressInfo = res.data
      this.progressVisible = true
      console.log(this.progressInfo)
    },
    // 监听级联选择器改变
    handleChange () {
      this.addressForm.address3 = this.addressForm.address1.join('') + this.addressForm.address2
    },
    // 点击确定按钮后
    changeAddress () {
      this.$refs.addressFormRef.validate(valid => {
        this.addressForm.address3 = this.address3
        console.log(this.addressForm.address3)
        if (!valid) {
          return this.$message.error('请填写必要的表单项')
        }
        this.addressVisable = false
      })
    }
  },
  computed: {
    address3 () {
      return this.addressForm.address1.join('') + this.addressForm.address2
    }
  }
}
</script>
<style lang="less" scoped>
.el-cascader {
  width: 100%;
}
</style>
