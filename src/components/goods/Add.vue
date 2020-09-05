<!--
 * @Author: your name
 * @Date: 2020-09-04 23:19:26
 * @LastEditTime: 2020-09-05 18:35:46
 * @LastEditors: Please set LastEditors
 * @Description: Steps 步骤条、upload组件、vue-quill-editor(的富文本编辑器)的使用、lodash中的cloneDeep(obj)方法(深拷贝的实践)
 * @FilePath: \vue_shop\src\components\goods\Add.vue
-->
<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>添加商品</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图区域 -->
    <el-card>
      <!-- 提示区域 -->
      <el-alert title="添加商品信息" type="info" show-icon center :closable="false">
      </el-alert>
      <!-- 步骤条区域 -->
      <el-steps :space="200" :active="activeIndex-0" finish-status="success" align-center>
        <el-step title="基本信息"></el-step>
        <el-step title="商品参数"></el-step>
        <el-step title="商品属性"></el-step>
        <el-step title="商品图片"></el-step>
        <el-step title="商品内容"></el-step>
        <el-step title="完成"></el-step>
      </el-steps>
      <!-- tab栏区域，注意：el-tab-pane只能是el-tabs的子节点，所以只能用form包裹tabs，不能用tabs包裹form -->
      <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="100px" label-position="top">
        <el-tabs :tab-position="'left'" v-model="activeIndex" :before-leave="beforeTabLeave" @tab-click="tabClicked">
          <el-tab-pane label="基本信息" name="0">
            <el-form-item label="商品名称" prop="goods_name">
              <el-input v-model="addForm.goods_name"></el-input>
            </el-form-item>
            <el-form-item label="商品价格" prop="goods_price">
              <el-input v-model="addForm.goods_price" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品重量" prop="goods_weight">
              <el-input v-model="addForm.goods_weight" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品数量" prop="goods_number">
              <el-input v-model="addForm.goods_number" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品分类" prop="goods_cat">
              <!-- 选择商品分类的级联选择框 -->
              <el-cascader v-model="addForm.goods_cat" :options="catelist" @change="handleChange" :props="cateProps"
                clearable>
              </el-cascader>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品参数" name="1">
            <!-- 渲染表单的item项 -->
            <el-form-item :label="item.attr_name" v-for="item in manyTableData" :key="item.attr_id">
              <!-- 渲染复选框组 -->
              <el-checkbox-group v-model="item.attr_vals">
                <el-checkbox :label="cb" v-for="(cb,i) in item.attr_vals" :key="i" border></el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品属性" name="2">
            <el-form-item :label="item.attr_name" v-for="item in onlyTableData" :key="item.attr_id">
              <el-input v-model="item.attr_vals"></el-input>
            </el-form-item>
          </el-tab-pane>
          <!-- 1.action 表示图片要上传到的api地址
               2.on-preview 指定预览时的事件处理函数
               3.on-remove 指定关闭图片时候的事件处理函数
               4.file-list 文件列表（这里没用到，删除了）
               5.list-type 指定当前预览图片的呈现方式
               6.headers 设置上传的请求头部
               7.on-success上传成功时的属性
           -->
          <el-tab-pane label="商品图片" name="3">
            <el-upload :action="uploadURL" :on-preview="handlePreview" :on-remove="handleRemove" list-type="picture"
              :headers="headersObj" :on-success="handleSuccess">
              <el-button size="small" type="primary">点击上传</el-button>
              <!-- <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div> -->
            </el-upload>
          </el-tab-pane>
          <el-tab-pane label="商品内容" name="4">
            <!-- 富文本编辑器组件 -->
            <!-- :options="editorOption"
              @blur="onEditorBlur($event)" @focus="onEditorFocus($event)" @ready="onEditorReady($event)" -->
            <quill-editor ref="myQuillEditor" v-model="addForm.goods_introduce" />
            <el-button type="primary" class="btnAdd" @click="add()">添加商品</el-button>
          </el-tab-pane>
        </el-tabs>
      </el-form>
    </el-card>
    <!-- 图片预览 -->
    <el-dialog title="图片预览" :visible.sync="previewVisable" width="50%">
      <img :src="previewPath" alt="" class="previewImg">
    </el-dialog>
  </div>
</template>
<script>
import _ from 'lodash'

export default {
  data () {
    return {
      activeIndex: '0',
      // 添加商品的表单数据对象
      addForm: {
        goods_name: '',
        goods_price: 0,
        goods_weight: 0,
        goods_number: 0,
        // 商品所属的分类数组
        goods_cat: [],
        // 图片数组
        pics: [],
        // 商品的详情描述
        goods_introduce: '',
        attrs: []
      },
      addFormRules: {
        goods_name: [
          { required: true, message: '请输入商品名称', trigger: 'blur' }
        ],
        goods_price: [
          { required: true, message: '请输入商品价格', trigger: 'blur' }
        ],
        goods_weight: [
          { required: true, message: '请输入商品重量', trigger: 'blur' }
        ],
        goods_number: [
          { required: true, message: '请输入商品数量', trigger: 'blur' }
        ],
        goods_cat: [
          { required: true, message: '请选择商品分类', trigger: 'blur' }
        ]
      },
      // 商品分类列表
      catelist: [],
      // 级联选择框的配置对象
      cateProps: {
        checkStrictly: false,
        expandTrigger: 'hover',
        value: 'cat_id',
        label: 'cat_name',
        children: 'children'
      },
      // 动态参数列表数据
      manyTableData: [],
      // 静态属性数据
      onlyTableData: [],
      // 上传图片的url地址
      uploadURL: 'http://127.0.0.1:8888/api/private/v1/upload',
      // 图片上传组件的headers请求头对象
      headersObj: { Authorization: window.sessionStorage.getItem('token') },
      // 预览图片的url地址
      previewPath: '',
      // 控制图片预览对话框的显示与隐藏
      previewVisable: false
    }
  },
  created () {
    this.getCateList()
  },
  methods: {
    // 获取所有商品分类数据
    async getCateList () {
      const { data: res } = await this.$http.get('categories')
      if (res.meta.status !== 200) {
        return this.$message.error('获取商品分类数据失败')
      }
      this.catelist = res.data
      // console.log(this.catelist)
    },
    // 级联选择框中项变化，会触发这个函数
    handleChange () {
      if (this.addForm.goods_cat.length !== 3) {
        this.addForm.goods_cat = []
      }
      // console.log(this.addForm.goods_cat)
    },
    beforeTabLeave (activeName, oldActiveName) {
      if (oldActiveName === '0' && this.addForm.goods_cat.length !== 3) {
        this.$message.error('请先选择商品分类')
        return false
      }
    },
    // tab标签页被选中的时候就会触发的事件
    async tabClicked () {
      // console.log(this.activeIndex)
      // 证明访问的是动态参数面板
      if (this.activeIndex === '1') {
        const { data: res } = await this.$http.get(`categories/${this.cateId}/attributes`, { params: { sel: 'many' } })
        if (res.meta.status !== 200) return this.$message.error('获取动态参数列表失败')
        // 将数据中的每一项的attr_vals由字符串变成数组，方便后面渲染使用
        res.data.forEach(item => {
          item.attr_vals = item.attr_vals.length === 0 ? [] : item.attr_vals.split(' ')
        })
        this.manyTableData = res.data
      } else if (this.activeIndex === '2') {
        const { data: res } = await this.$http.get(`categories/${this.cateId}/attributes`, { params: { sel: 'only' } })
        if (res.meta.status !== 200) return this.$message.error('获取静态属性失败')

        this.onlyTableData = res.data
      }
    },
    // 处理图片预览效果
    handlePreview (file) {
      this.previewPath = file.response.data.url
      this.previewVisable = true
    },
    // 处理移除图片的操作
    handleRemove (file) {
      // 1. 获取将要删除的图片的临时路径
      const filePath = file.response.data.tmp_path
      // 2. 从pics数组中，找到这个图片对应的索引值
      const i = this.addForm.pics.findIndex(x =>
        x.pic === filePath
      )
      // 3.调用数组的splice 方法，把图片信息对象，从lics数组中移除
      this.addForm.pics.splice(i, 1)
      // console.log(this.addForm)
    },
    // 监听图片上传成功的事件
    handleSuccess (response) {
      // console.log(response)
      // 1.先拼接得到一个图片信息对象
      const picInfo = {
        pic: response.data.tmp_path
      }
      // 2.将图片信息对象push到pics数组中
      this.addForm.pics.push(picInfo)
      // console.log(this.addForm)
    },
    // 添加商品
    add () {
      // console.log(this.addForm)
      this.$refs.addFormRef.validate(async valid => {
        if (!valid) return this.$message.error('请填写必要的表单项')

        // 执行添加的业务逻辑
        // 注意：下面这种写法会报错，因为我们级联选择器中的内容也是双向绑定addForm.goods_cat的，而且它只能是数组
        // this.addForm.goods_cat = this.addForm.goods_cat.join(',')

        // =========================解决办法1：（深拷贝）==============================
        // 使用lodash这个包  用cloneDeep(obj)方法复制出一个新的对象
        const form = _.cloneDeep(this.addForm)
        form.goods_cat = form.goods_cat.join(',')
        // console.log(form)

        // ========================解决办法2：（深拷贝）=============================
        // 自己封装一个深拷贝方法
        // 通过函数实现,把对象a中的所有的数据深拷贝到对象b中
        /*    function extend (a, b) {
             for (var key in a) {
               // 先获取a对象中每个属性的值
               var item = a[key]
               // 判断这个属性的值是不是数组
               if (item instanceof Array) {
                 // 如果是数组,那么在b对象中添加一个新的属性,并且这个属性值也是数组
                 b[key] = []
                 // 调用这个方法，把a对象中这个数组的属性值一个一个的复制到b对象的这个数组属性中(这里就是递归)
                 extend(item, b[key])
               } else if (item instanceof Object) { // 判断这个值是不是对象类型的
                 // 如果是对象类型的,那么在b对象中添加一个属性,是一个空对象
                 b[key] = {}
                 // 再次调用这个函数,把a对象中的属性对象的值一个一个的复制到b对象的这个属性对象中
                 extend(item, b[key])
               } else {
                 // 如果值是普通的数据,直接复制到b对象的这个属性中
                 b[key] = item
               }
             }
           } */
        // 处理动态参数
        this.manyTableData.forEach(item => {
          const newInfo = { attr_id: item.attr_id, attr_value: item.attr_vals.join(' ') }
          this.addForm.attrs.push(newInfo)
        })
        // 处理静态属性
        this.onlyTableData.forEach(item => {
          const newInfo = { attr_id: item.attr_id, attr_value: item.attr_vals }
          this.addForm.attrs.push(newInfo)
        })
        form.attrs = this.addForm.attrs
        console.log(form)
        // 到这里还有一个bug，不先点击动态参数与静态属性的tabs标签页manyTableData、onlyTableData是没有数据的

        // 发起请求添加商品
        // 商品的名称，必须是唯一的
        const { data: res } = await this.$http.post('goods', form)
        if (res.meta.status !== 201) return this.$message.error('添加商品失败')
        this.$message.success('添加商品成功')
        this.$router.push('/goods')
      })
    }
  },
  computed: {
    cateId () {
      if (this.addForm.goods_cat.length === 3) {
        return this.addForm.goods_cat[2]
      }
      return null
    }
  }
}
</script>
<style lang="less" scoped>
.el-checkbox {
  margin: 0 8px 0 0 !important;
}
.previewImg {
  width: 100%;
}
.btnAdd {
  margin-top: 15px;
}
</style>
