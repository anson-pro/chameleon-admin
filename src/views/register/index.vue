<template>
  <div class="register-container">
    <el-form class="register-form" :model="registerForm" :rules="registerRules" ref="registerForm"
             label-position="left">
      <h3 class="title">chameleon-admin Register</h3>
      <el-form-item prop="name">
        <span class="svg-container svg-container_register">
          <svg-icon icon-class="user"/>
        </span>
        <el-input
          name="name"
          type="text"
          v-model="registerForm.name"
          placeholder="请输入用户名"
        >
        </el-input>
      </el-form-item>
      <el-form-item prop="email">
        <span class="svg-container svg-container_register">
          <svg-icon icon-class="user"/>
        </span>
        <el-input
          name="email"
          type="text"
          v-model="registerForm.email"
          placeholder="请输入Email"
          @blur="handleCheckRegistered"
        >
        </el-input>
      </el-form-item>
      <el-form-item prop="password">
        <span class="svg-container">
          <svg-icon icon-class="password"></svg-icon>
        </span>
        <el-input name="password"
                  :type="pwdType"
                  v-model="registerForm.password"
                  placeholder="请输入密码"></el-input>
        <span class="icon-button" @click="showPwd"><svg-icon icon-class="eye"/></span>
      </el-form-item>
      <el-form-item prop="code">
        <span class="svg-container">
          <svg-icon icon-class="feedback"></svg-icon>
        </span>
        <el-input name="code"
                  v-model="registerForm.code"
                  placeholder="请点击最后的按钮获取验证码"
        >
        </el-input>
        <span class="icon-button" @click="handleGetCode"><svg-icon icon-class="play"/></span>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" style="width:100%;" :loading="loading" @click="handleRegister">
          注册
        </el-button>
      </el-form-item>
      <router-link class="register-link" to="/login">已有账号，去登录</router-link>
    </el-form>
  </div>
</template>

<script>
  import { validateEmail } from '@/utils/validate'
  import { checkRegistered, getCode, checkCode, register } from '@/api/user'

  export default {
    name: 'register',
    data() {
      const validateUsername = (rule, value, callback) => {
        if (!validateEmail(value)) {
          callback(new Error('请输入正确的Email'))
        } else {
          callback()
        }
      }
      const validatePass = (rule, value, callback) => {
        if (value.length < 5) {
          callback(new Error('密码不能小于5位'))
        } else {
          callback()
        }
      }
      return {
        registerForm: {
          name: '',
          email: '',
          password: '',
          code: ''
        },
        registerRules: {
          email: [{ required: true, trigger: 'blur', validator: validateUsername }],
          password: [{ required: true, trigger: 'blur', validator: validatePass }],
          code: [{ required: true, trigger: 'blur', message: '请输入验证码' }]
        },
        loading: false,
        pwdType: 'password'
      }
    },
    methods: {
      showPwd() {
        if (this.pwdType === 'password') {
          this.pwdType = ''
        } else {
          this.pwdType = 'password'
        }
      },
      /**
       * 验证是否可注册
       */
      handleCheckRegistered() {
        checkRegistered(this.registerForm.email)
          .then(({ data: { status, data, message }}) => {
            if (status === 0) {
              if (data === true) {
                this.$message({
                  message: '恭喜您账号可用！ u2u',
                  type: 'success'
                })
              } else {
                this.$message({
                  type: 'error',
                  message: '账号已被注册！ QwQ'
                })
              }
            } else if (status === 1002) {
              this.$message({
                type: 'error',
                message
              })
            }
          })
      },
      /**
       * 获取验证码
       */
      handleGetCode() {
        if (this.registerForm.email !== '') {
          getCode(this.registerForm.email)
            .then(({ data: { status, message }}) => {
              if (status === 0) {
                this.$message({
                  message: '验证码发送成功，2分钟内不要重复发送哦！ u2u',
                  type: 'success'
                })
              } else {
                this.$message({
                  message,
                  type: 'error'
                })
              }
            })
        } else {
          this.$message({
            message: '邮箱不能为空！ QwQ',
            type: 'error'
          })
        }
      },
      /**
       * 检查验证码是否正确
       */
      handleCheckCode() {
        checkCode(this.registerForm.email, this.registerForm.code)
          .then(({ data: { status, data, message }}) => {
            if (status === 0) {
              if (data === true) {
                this.$message({
                  message: '验证码正确！ u2u',
                  type: 'success'
                })
              } else {
                this.$message({
                  message: '验证码错误了！ QwQ',
                  type: 'error'
                })
              }
            } else {
              this.$message({
                message,
                type: 'error'
              })
            }
          })
      },
      /**
       * 注册
       */
      handleRegister() {
        const info = this.registerForm
        const userinfo = {
          email: info.email,
          password: info.password,
          name: info.name
        }
        this.loading = true
        this.$refs.registerForm.validate(valid => {
          if (valid) {
            register(userinfo, info.code)
              .then(({ data: { status, message }}) => {
                if (status === 0) {
                  this.$message({
                    message: '注册成功！ u2u',
                    type: 'success'
                  })
                } else if (status === 1002) {
                  this.$message({
                    message,
                    type: 'error'
                  })
                } else if (status === 9002) {
                  this.$message({
                    message,
                    type: 'error'
                  })
                }
                this.loading = false
                this.$router.push({ path: '/login' })
              })
              .catch(() => {
                this.loading = false
              })
          } else {
            console.log('error submit!!')
            return false
          }
        })
      }
    }
  }
</script>

<style rel="stylesheet/scss" lang="scss">
  $bg: #2d3a4b;
  $light_gray: #eee;

  /* reset element-ui css */
  .register-container {
    .el-input {
      display: inline-block;
      height: 47px;
      width: 85%;
      input {
        background: transparent;
        border: 0px;
        -webkit-appearance: none;
        border-radius: 0px;
        padding: 12px 5px 12px 15px;
        color: $light_gray;
        height: 47px;
        &:-webkit-autofill {
          -webkit-box-shadow: 0 0 0px 1000px $bg inset !important;
          -webkit-text-fill-color: #fff !important;
        }
      }
    }
    .el-form-item {
      border: 1px solid rgba(255, 255, 255, 0.1);
      background: rgba(0, 0, 0, 0.1);
      border-radius: 5px;
      color: #454545;
    }
  }

</style>

<style rel="stylesheet/scss" lang="scss" scoped>
  $bg: #2d3a4b;
  $dark_gray: #889aa4;
  $light_gray: #eee;
  .register-container {
    position: fixed;
    height: 100%;
    width: 100%;
    background-color: $bg;
    .register-form {
      position: absolute;
      left: 0;
      right: 0;
      width: 520px;
      padding: 35px 35px 15px 35px;
      margin: 120px auto;

      .register-link {
        display: block;
        width: 120px;
        margin: 0 auto;
        font-size: 14px;
        color: #fff;
      }
    }
    .svg-container {
      padding: 6px 5px 6px 15px;
      color: $dark_gray;
      vertical-align: middle;
      width: 30px;
      display: inline-block;
      &_register {
        font-size: 20px;
      }
    }
    .title {
      font-size: 26px;
      font-weight: 400;
      color: $light_gray;
      margin: 0px auto 40px auto;
      text-align: center;
      font-weight: bold;
    }
    .icon-button {
      position: absolute;
      right: 10px;
      top: 7px;
      font-size: 16px;
      color: $dark_gray;
      cursor: pointer;
      user-select: none;
    }
  }
</style>
