# Teis Web demo

> A Vue.js project

## Build Setup

``` bash
# 安装依赖
yarn

# 本地启动
yarn start

# 打包
yarn build

# 提交代码
git add .
npm run commit
```

# 分支说明
develop 公共开发分支
develop-huoalong 个人开发分支
main 生产分支（供中经社客户查看，后续非客户需求不再新增内容，仅修复缺陷，修复缺陷后，如main分支存在，请同步修改）
sass 分支 （内部生产，与develop 同步）

For a detailed explanation on how things work, check out the [guide](http://vuejs-templates.github.io/webpack/) and [docs for vue-loader](http://vuejs.github.io/vue-loader).

##  docker 
- docker build -t 39.104.89.112/text-tag-platform/dcumark-web:latest .
- docker push 39.104.89.112/text-tag-platform/dcumark-web:latest


# 注意事项
中经社——注意事项
1、页码处理，不能超过一万条，参考 可检索 realTotal
2、表格 统一 添加class  elTable
3、需显示滚动条，对对应dom添加 class:    trs-scroll
4、页面高度，判断，区分是否嵌入，参考  产业链图谱
5、非特殊需求，除开头部和左侧导航外的，正文部分 高度需计算，可参考产业链图谱
6、列表类页面，都需要 有loading和暂无数据（<el-empty description="暂无数据"></el-empty>）的判断

#写死域名的位置
src/lib/const.js:  dataeliteUrl(嵌入风控的路由)
src/store/state.js:   getImageUrl（项目部署路由）    
src\views\login\loginAuto.vue： 24行，数组第一个域名，https://insight.cnfic.com.cn   判断是否被恒生嵌入

项目中存在其他页面，均包含 恒生地址  https://insight.cnfic.com.cn

# 页签方式打开注意事项
trs-header组件中通过监听路由的方式对页签状态进行控制，需要注意一下几点
一、页签打开对方式
  1、新页签打开
    - 新路由
    - 同一个路由不同的query
  2、当前页签加载（需要query中添加参数isOldTab=true）
    - 同一个路由不同的query
二、页签的名称
  1、默认使用 query中 viewTagName（需要拼接可以加上此参数，比如某详情页）
  2、如果是当前页通用的名称，可以在路由routerNew.js的meta中写上title
三、页签的图标
  1、每个路由都有一个唯一的图标，图标命名和路由的name保持一致，统一放在@/assets/image/navTabs/
四、特殊的页面
  1、含有iframe的页面
    无法保持-需要取消keep-alive
  2、页面头部有tab切换，且每个tab需要新页签打开的页面
    在keep-alive状态下
      一个tab拆分为一个路由
  3、包含图表 echarts antv d3 leader-line等页面 
    在keep-alive状态下，
      需要在mounted中获取dom
      在mounted 中 接口调取前 echarts可以直接进行初始化，只用setOptions是在接口获取后进行调用即可
      antv可以获取dom存储起来，在初始化的时候直接使用存储起来的dom
      d3 同 antv
    取消keep-alive
      line划线需要取消keep-alive，一般在详情中用到line，如果仅仅销毁，在复杂的跳转中还是有问题，直接取消keep-alive即可。
五、watch $route 慎用
  在子页面中使用watch $route 初始化或者调取接口 会导致 页面重载， keep-alive没有作用

# 微前端
  当前平台使用micro-app（借鉴了WebComponent的思想，通过CustomElement结合自定义的ShadowDom，将微前端封装成一个类WebComponent组件，从而实现微前端的组件化渲染。）框架
# 官网
  https://zeroing.jd.com/micro-app/docs.html#/
# 实战案例
  https://github.com/micro-zoe/micro-app-demo
## 主应用（基座）
  ### 安装 (当前实例使用版本@1.0.0-alpha.10，低版本keep-alive有bug)
  ```bash
    yarn add @micro-zoe/micro-app@1.0.0-alpha.10
  ```
  ### 在入口main.js 引入配置 启动 预加载
  ```js
  import microApp from '@micro-zoe/micro-app'
  import config from '../config'
  // 启动微前端
  // disable-memory-router关闭虚拟路由系统 在子应用router跳转时会增加地址栏多余的参数，关闭他 防止参数混乱；
  // disable-patch-request 关闭 对子应用的请求拦截，子应用就会使用主应用的转发，防止跨域的产生
  microApp.start({
    'disable-memory-router': true, // 关闭虚拟路由系统
    'disable-patch-request': true, // 关闭对子应用请求的拦截
  })
  // 预渲染，提高微前端首屏速度
  microApp.preFetch(() => [
    { name: 'risk-control', url: config.riskControl },
    { name: 'details-app', url: config.detailsApp },
  ])
  ```

### 根目录增加配置项config.js
  ```js
// 开发环境地址
const config = {
  riskControl: 'http://localhost:4008',
  detailsApp: 'http://localhost:4009',
}
// 正式环境地址
const configProd = {
  riskControl: '域名0',
  detailsApp: '域名1',
}

// 线上环境地址
if (process.env.NODE_ENV === 'production') {
  // 基座应用和子应用部署在同一个域名下，这里使用location.origin进行补全
  Object.keys(configProd).forEach((key) => {
    config[key] = window.location.origin
  })
}
export default config
  ```

### 主应用 渲染 micro-app

src下新建 child_app菜单
- 以风控场景为例
新建/src/child_app/risk-control.vue文件
```html
<micro-app
  name='risk-control'
  :url='url'
  baseroute='/risk-control'
  :data='microAppData'
  @created='handleCreate'
  @beforemount='handleBeforeMount'
  @mounted='handleMount'
  @error='handleError'
  @afterhidden='afterhidden'
  @beforeshow='beforeshow'
  @aftershow='aftershow'
  @datachange='handleDataChange'
  keep-alive
></micro-app>
```
```js
handleMount() {
  const { search, pathname } = window.location
  const prefix = this.name.length + 1
  setTimeout(() => {
    this.microAppData = { msg: '来自基座的新数据' }
    microApp.setData('risk-control', { path: pathname.slice(prefix) + search })
  }, 100)
},
```
- 直接向子应用传递数据时，可以写在data对象中
- 如果是等渲染完再发送数据 ，写在 mounted中，如果子应用没接受到可以加个延时
- url是子应用的服务地址(部署地址)和路由无关
- baseroute是基础路由，下发到子应用(本案例使用的history)，hash路由可以参考官网
- 这个keep-alive是应用级别的缓存，使用keep-alive，和本主应用页签打开方式结合需要特别的处理，在主应用菜单跳转时，需要在子应用同步路由，因为只要你第一次渲染过子应用，再次访问就会保持上次的页面状态，主应用无法进行页面的重渲染，启用keep-alive，会有afterhidden、beforeshow、aftershow钩子，在子应用中监听appstate-change事件，进行同步路由，具体代码往下看子应用说明

### 路由配置
```js
  /************** 微前端 给子应用分配路由 start************* */
  // 风控场景
  {
    path: '/risk-control/*', // vue-router@4.x path的写法为：'/my-page/:page*'
    name: 'risk-control',
    component: () => import('@/child_apps/risk-control.vue')
  }
  /************** 微前端 给子应用分配路由 end************* */
```
- 菜单中 $router跳转路由时，path里不要带query内容，分开写，方便子应用同步路由 如：
```js
toOtherPage(itemData) {
  if (itemData.microAppName) {
    // good
    this.$router.push({
      path: itemData.microAppName + itemData.routeLink,
      query: itemData.query
    })
  } else {
    // bad
    this.$router.push({
      path: itemData.routeLink
    })
  }
},
```

### 子应用

- 子应用根目录下新建public-path.js 同步基座路由
- 在子应用main.js顶部引入
```js
/* eslint-disable no-undef */
if (window.__MICRO_APP_ENVIRONMENT__) {
  __webpack_public_path__ = window.__MICRO_APP_PUBLIC_PATH__
}
```
- 路由-接受基座下发的基础路由
```js
const router = new VueRouter({
  mode: 'history',
  // __MICRO_APP_BASE_ROUTE__ 为micro-app传入的基础路由
  base: window.__MICRO_APP_BASE_ROUTE__ || process.env.BASE_URL,
  routes,
}) 
```
- loading 子应用默认/可以放个loading，在keep-alive模式下，切换路由会有一个中间状态，有个loading可以很平滑的过渡效果
```js
  {
    path: '/',
    name: 'home',
    component: Loading
  }
```
- 子应用与主应用交互数据，以及挂载与卸载代码
```js
// 与基座进行数据交互
function handleMicroData (app) {
  // 是否是微前端环境
  if (window.__MICRO_APP_ENVIRONMENT__) {
    // 主动获取基座下发的数据
    const globalData = window.microApp.getData()
    Object.entries(globalData).forEach(([key, value]) => {
      app.$store.state[key] = value
    })
    // 监听基座下发的数据变化
    window.microApp.addDataListener((data) => {
      console.log('risk-control addDataListener:', data)
      // 当基座下发path时进行跳转
      if (data.path && data.path !== router.currentRoute.path) {
        router.push(data)
      }
    })
    // 向基座发送数据
    setTimeout(() => {
      window.microApp.dispatch({ myname: 'risk-control' })
    }, 3000)
  }
}

let app = null
// 将渲染操作放入 mount 函数
function mount () {
  app = new Vue({
    store,
    router,
    render: h => h(App),
  }).$mount('#risk-control')

  console.log('微应用risk-control渲染了')

  handleMicroData(app)
  // keep-alive 模式下， 子应用通过appstate-change事件监听主应用的状态
  window.addEventListener('appstate-change', function (e) {
    if (e.detail.appState === 'afterhidden') {
      console.log('已卸载')
    } else if (e.detail.appState === 'beforeshow') {
      console.log('即将重新渲染')
    } else if (e.detail.appState === 'aftershow') {
      console.log('已经重新渲染', app.$route, e)
      setTimeout(() => {
        const lastPathname = sessionStorage.getItem('lastPathname')
        const params = Qs.parse(e.currentTarget.location.search.slice(1)) || {};
        const pathname = e.currentTarget.location.pathname
        sessionStorage.setItem('lastPathname', pathname)
        const path = pathname.slice(13)
        if (!((pathname === lastPathname) && params.tab)) {
          // keep-alive条件下，子应用同步更新路由
          app.$router.push({ path, query: params });
        }
      }, 10)
    }
  })
}

// 将卸载操作放入 unmount 函数
function unmount () {
  app.$destroy()
  app.$el.innerHTML = ''
  app = null
  sessionStorage.removeItem('lastPathname')
  console.log('微应用risk-control卸载了')
}

// 微前端环境下，注册mount和unmount方法
if (window.__MICRO_APP_ENVIRONMENT__) {
  window[`micro-app-${window.__MICRO_APP_NAME__}`] = { mount, unmount }
} else {
  // 非微前端环境直接渲染
  mount()
}
```
### 子应用A 与 子应用B 之前 通信 或跳转
- A如果向B跳转，可以通过A发给基座信息，在基座中控制B的跳转
- 通信同理

# 部署

- 注意子应用的webpack配置, 打包后所有的子应用都放到child下面
```
publicPath: '/child/riskControl',
outputDir: 'riskControl',
```
同时，基座中：url: `${config.riskControl}/child/riskControl`,

项目启动后
静态资源服务地址为 http://localhost:4008/child/riskControl/ 

如果子应用域名不同，可以省略publicPath配置

nginx配置
参考官网：https://zeroing.jd.com/micro-app/docs.html#/zh-cn/deploy

  