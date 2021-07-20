
import request from '@/utils/request'

export const authLogin = (params) => {
    return  request({
        url: '/api/sign_in',
        method: 'post',
        data: {...params}
      })
  }

export const generalOCR = (params) => {
  return  request({
      url: '/api/ocr/general',
      method: 'post',
      data: {...params}
    })
}

export const userRegister = (params) => {
  return  request({
      url: '/api/user/register',
      method: 'post',
      data: {...params}
    })
} 

export const getUserRegisterVCode = (params) => {
  return  request({
      url: '/api/user/verify_code',
      method: 'post',
      data: {...params}
    })
} 

export const getOcrRecordList = (params) => {
  return  request({
      url: '/api/user_conversion/record',
      method: 'post',
      data: {...params}
    })
} 

