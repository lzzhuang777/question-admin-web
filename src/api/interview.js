import request from '@/utils/request'

export function fetchList(params) {
  return request({
    url:'/admin/interview/list',
    method:'get',
    params:params
  })
}

export function createInterview(data) {
  return request({
    url:'/admin/interview/create',
    method:'post',
    data:data
  })
}

export function updateInterview(id,data) {
  return request({
    url:'/admin/interview/update/'+id,
    method:'post',
    data:data
  })
}

export function getInterviewById(id) {
  return request({
    url:'/admin/interview/'+id,
    method:'get',
  })
}

export function delInterviews(data) {
  return request({
    url:'/admin/interview/delInterviews',
    method:'post',
    data:data
  })
}

export function updateStatus(id,params) {
  return request({
    url:'/admin/interview/update/status/'+id,
    method:'post',
    params:params
  })
}
