import axios from 'axios'
import { success, getToken } from '@/libs/util'

// （非 iview-admin demo 使用的）接口的响应会带有 code 字段
const hasCode = (data) => data.code != null

class HttpRequest {
  constructor (baseUrl) { this.baseUrl = baseUrl }
  getInsideConfig () { return { baseURL: this.baseUrl, headers: { } } }
  interceptors (instance, url) {
    // 请求拦截
    instance.interceptors.request.use(config => {
      /**
       * 如果存在当前用户的 token，则在发送请求时带上 token
       */
      if (getToken()) {
        return {
          ...config,
          headers: {
            ...config.headers,
            Authorization: `Bearer ${getToken()}`
          }
        }
      }
      return config
    }, error => Promise.reject(error))
    // 响应拦截
    instance.interceptors.response.use(res => {
      const { data } = res
      if (hasCode(data) && !success(data.code)) {
        return Promise.reject(new Error(data.message))
      }
      return hasCode(data) ? data.data : data
    }, error => Promise.reject(error))
  }
  /**
   * 发送请求
   * @param {Object} options 请求选项
   * @returns {Promise}
   */
  request (options) {
    const instance = axios.create()
    options = Object.assign(this.getInsideConfig(), options)
    this.interceptors(instance, options.url)
    return instance(options)
  }
  /**
   * 发送 get 请求
   * @param {string} url 请求 url
   * @param {Object} config 请求选项
   * @returns {Promise}
   */
  get (url, config = {}) { return this.request({ ...config, url, method: 'get' }) }
  /**
   * 发送 delete 请求
   * @param {string} url 请求 url
   * @param {Object} config 请求选项
   * @returns {Promise}
   */
  delete (url, config = {}) { return this.request({ ...config, url, method: 'delete' }) }
  /**
   * 发送 post 请求
   * @param {string} url 请求 url
   * @param {Object} data 请求数据
   * @param {Object} config 请求选项
   * @returns {Promise}
   */
  post (url, data = null, config = {}) { return this.request({ ...config, url, data, method: 'post' }) }
  /**
   * 发送 put 请求
   * @param {string} url 请求 url
   * @param {Object} data 请求数据
   * @param {Object} config 请求选项
   * @returns {Promise}
   */
  put (url, data = null, config = {}) { return this.request({ ...config, url, data, method: 'put' }) }
  /**
   * 发送 patch 请求
   * @param {string} url 请求 url
   * @param {Object} data 请求数据
   * @param {Object} config 请求选项
   * @returns {Promise}
   */
  patch (url, data = null, config = {}) { return this.request({ ...config, url, data, method: 'patch' }) }
}
export default HttpRequest
