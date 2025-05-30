// 详情集合部署地址 ： http://192.168.210.57:30018(嵌入报错)   http://192.168.210.57:31588/entweb
// 招商场景  'http://192.168.210.57:32500',
// 详情集合线上地址拼接
const detailsApp = window.location.origin + '/entweb';
const investmentApp = window.location.origin + '/investment';
// 开发环境地址
const config = {
  // riskControl: 'http://localhost:4008',
  // detailsApp: ' http://192.168.210.57:31588/entweb',
  detailsApp: 'http://localhost:8082',
  investmentApp: 'http://192.168.210.57:31588/investment',
}
// 线上环境地址
const configProd = {
  // riskControl: '域名0',
  detailsApp,
  investmentApp,
}
if (process.env.NODE_ENV === 'production') {
  // 基座应用和子应用部署在同一个域名下，这里使用location.origin进行补全
  Object.keys(config).forEach((key) => {
    // config[key] = window.location.origin
    config[key] = configProd[key]
  })
}
export default config
