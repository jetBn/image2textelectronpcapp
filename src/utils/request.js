/*
 * @Descripttion: 
 * @version: 
 * @Author: WGQ
 * @Date: 2020-05-26 15:02:05
 * @LastEditors: WGQ
 * @LastEditTime: 2020-06-09 16:23:42
 */ 
import axios from 'axios'
import Qs from 'qs'

// 创建axios实例
// axios.defaults.withCredentials = false
let baseUrl
process.env.NODE_ENV === 'development' ? baseUrl = 'http://192.168.1.235:8000' : baseUrl = 'https://i2t.xiyiyi.com'

const request = axios.create({
  baseURL: baseUrl,
  timeout: 5000000 // 请求超时时间
})


// request拦截器
request.interceptors.request.use(
  config => {

    config.data.token = localStorage.getItem('token')
    if(config.method === 'post') {
        config.data = Qs.stringify({ ...config.data })
    }
    return config
  },
  error => {
    // Do something with request error
    console.log(error) // for debug
    Promise.reject(error)
  }
)

// response 拦截器
request.interceptors.response.use(
  response => {
    // let resData = JSON.parse(response.data)
    return Promise.resolve(response.data)
  },
  error => {
    return Promise.reject(error)
  }
)

export default request
