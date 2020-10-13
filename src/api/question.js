import request from '@/utils/request'
export function fetchList(params) {
  return request({
    url:'/admin/question/list',
    method:'get',
    params:params
  })
}
export function updateStatus(id,params) {
  return request({
    url:'/admin/question/update/status/'+id,
    method:'post',
    params:params
  })
}
export function deleteQuestion(data) {
  return request({
    url:'/home/advertise/delete',
    method:'post',
    data:data
  })
}
export function createQuestion(data) {
  return request({
    url:'/admin/question/create',
    method:'post',
    data:data
  })
}
export function getQuestionById(id) {
  return request({
    url:'/admin/question/'+id,
    method:'get',
  })
}

export function updateQuestion(id,data) {
  return request({
    url: '/admin/question/update/' + id,
    method: 'post',
    data: data
  })
}

  export function getAnswerList(id) {
    return request({
      url:'/admin/question/answerList/'+id,
      method:'get',
    })
  }


