// TODO：可取消
import axios from 'axios'
import { API } from './api'
import { showDialog } from 'vant';
import router from '../router'

const defaultOptions = {
  timeout: 5000,
}

const request = axios.create({
  timeout: defaultOptions.timeout
})

request.interceptors.request.use(function (config) {
  config.headers.token = localStorage.getItem('token')
  return config
})

request.interceptors.response.use(function (response) {
  console.log('response.status', response.status)
  return response
}, function (error) {
  console.log('response.error', error.response?.status)
  // Any status codes that falls outside the range of 2xx cause this function to trigger
  // Do something with response error
  if(error.response?.status === 400 || error.response?.status === 401 || error.response?.status === 456) {
    console.log('login')
    showDialog({title: '提示', message: '请重新登录'}).then(() => {
      console.log('router')
      router.push('/login')
    });
    return Promise.resolve({});
  }
  return Promise.reject(error);
})


export { request, API }
