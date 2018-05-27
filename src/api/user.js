import axios from 'axios'

const request = axios.create({
  baseURL: 'http://192.168.1.21:8090', // api的base_url
  timeout: 5000,
  withCredentials: true
})

// 检查是否被注册
const checkRegistered = email => request({
  url: `/index/account?email=${email}`,
  method: 'get'
})

// 获取验证码
const getCode = email => request({
  url: `/index/code?email=${email}`,
  method: 'post'
})

// 检查验证码是否正确
const checkCode = (email, code) => request({
  url: '/index/code',
  method: 'get',
  params: {
    email,
    code
  }
})

// 注册
const register = (userinfo, code) => request({
  url: `/index/user?code=${code}`,
  method: 'post',
  data: userinfo
})

// 更新密码
const updatePassword = (email, password, code) => request({
  url: `/index/password?email=${email}&password=${password}&code=${code}`,
  method: 'put'
})

// 登录
const login = data => request({
  url: '/index/login',
  method: 'post',
  data
})

export {
  checkRegistered,
  getCode,
  checkCode,
  register,
  updatePassword,
  login
}
