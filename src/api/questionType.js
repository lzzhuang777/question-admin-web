import request from '@/utils/request'

export function listAll() {
  return request({
    url:'/admin/questionType/listAll',
    method:'get',
  })
}

export function fetchList(params) {
  return request({
    url:'/admin/questionType/list',
    method:'get',
    params:params
  })
}

export function createType(data) {
  return request({
    url:'/admin/questionType/listAll',
    method:'post',
    data:data
  })
}

export function getTypeById(id) {
  return request({
    url:'/admin/questionType/'+id,
    method:'get',
  })
}

export function updateType(id,data) {
  return request({
    url: '/admin/questionType/update/' + id,
    method: 'post',
    data: data
  })
}

  export function deleteType(data) {
    return request({
      url:'/admin/questionType/delete',
      method:'post',
      data:data
    })
}

