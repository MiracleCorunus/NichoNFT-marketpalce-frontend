import axios from 'axios'
import { message } from 'antd';
import { server_url } from "./config";

// create an axios instance
const service = axios.create({
  baseURL: server_url,
  timeout: 30000, // request timeout
})

const pending = {}
const CancelToken = axios.CancelToken
const removePending = (key, isRequest = false) => {
  if (pending[key] && isRequest) {
    pending[key]('取消重复请求')
  }
  delete pending[key]
}

const getRequestIdentify = (config, isReuest = false) => {
  let url = config.url
  if (isReuest) {
    url = config.baseURL + config.url.substring(1, config.url.length)
  }
  return config.method === 'get' ? encodeURIComponent(url + JSON.stringify(config.params)) : encodeURIComponent(config.url + JSON.stringify(config.data))
}

// request interceptor
service.interceptors.request.use(
  (config) => {
    // do something before request is sent
    // if (token()) {
    //   config.headers['Authorization'] = token()
    // } 
    config.baseURL = server_url;
    
    // 拦截重复请求(即当前正在进行的相同请求)
    const requestData = getRequestIdentify(config, true)
    removePending(requestData, true)
    config.cancelToken = new CancelToken((c) => {
      pending[requestData] = c
    })
    return config
  },
  (error) => {
    console.log(error) // for debug
    return Promise.reject(error)
  }
)

// response interceptor
service.interceptors.response.use(
  (response) => {
    // 把已经完成的请求从 pending 中移除
    const requestData = getRequestIdentify(response.config)
    removePending(requestData)

    const res = response.data
    if (res.code === 0) {
      return res.data
    } else {
      message.error(res.message)
      return Promise.reject(res.message)
    }
  },
  (error) => {
    console.log(error, 'eeeeeeeeee')
    if (error && error.response) {
      switch (error.response.status) {
        case 400:
          error.message = 'Error Request'
          break
        case 401:
          error.message = 'Unauthorized, please login again'
          break
        case 403:
          error.message = 'Access denied'
          break
        case 404:
          error.message = 'Request error, the resource was not found'
          break
        case 405:
          error.message = 'Request method not allowed'
          break
        case 408:
          error.message = 'Request timeout'
          break
        case 500:
          error.message = 'Server side error'
          break
        default:
          // error.message = `Unknown error${error.response.status}`
          error.message = `Unknown error`
      }
      message.error(error.message)
    } else {
      error.message = 'Failed to connect to the server'
    }
    return Promise.reject(error)
  }
)

export default service