/*
 * @Author: your name
 * @Date: 2020-08-28 16:30:01
 * @LastEditTime: 2020-08-30 11:32:49
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \vue_shop\src\plugins\element.js
 */
import Vue from 'vue'
import {
  Button,
  Form,
  FormItem,
  Input,
  // Message1：导入弹框提示组件
  Message
} from 'element-ui'
Vue.use(Button)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Input)
// Message2：全局挂载Message在Vue上，$message是自定义属性可以自己更改名字
Vue.prototype.$message = Message
