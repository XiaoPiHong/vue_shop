/*
 * @Author: your name
 * @Date: 2020-08-28 16:30:01
 * @LastEditTime: 2020-09-01 21:21:14
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
  Message,
  Container,
  Header,
  Aside,
  Main,
  Menu,
  Submenu,
  MenuItem,
  Breadcrumb,
  BreadcrumbItem,
  Card,
  Row,
  Col,
  Table,
  TableColumn,
  Switch,
  Tooltip,
  Pagination,
  Dialog,
  // MessageBox1：导入消息弹框提示组件
  MessageBox,
  Tag,
  Tree,
  Select,
  Option
} from 'element-ui'
Vue.use(Button)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Input)
// Message2：全局挂载Message在Vue上，$message是自定义属性可以自己更改名字
Vue.prototype.$message = Message
Vue.use(Container)
Vue.use(Header)
Vue.use(Aside)
Vue.use(Main)
Vue.use(Menu)
Vue.use(Submenu)
Vue.use(MenuItem)
Vue.use(Breadcrumb)
Vue.use(BreadcrumbItem)
Vue.use(Card)
Vue.use(Row)
Vue.use(Col)
Vue.use(Table)
Vue.use(TableColumn)
Vue.use(Switch)
Vue.use(Tooltip)
Vue.use(Pagination)
Vue.use(Dialog)
// MessageBox2：全局挂载MessageBox在Vue上，$confirm是自定义属性可以自己更改名字
Vue.prototype.$confirm = MessageBox.confirm
Vue.use(Tag)
Vue.use(Tree)
Vue.use(Select)
Vue.use(Option)
