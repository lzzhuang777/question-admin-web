import request from '@/utils/request'

export function fetchList(params) {
  return request({
    url:'/admin/qmsTest/list',
    method:'get',
    params:params
  })
}
export function createTest(data) {
  return request({
    url:'/admin/qmsTest/create',
    method:'post',
    data:data
  })
}

export function updateTest(id,data) {
  return request({
    url:'/admin/qmsTest/update/'+id,
    method:'post',
    data:data
  })
}

export function getTestById(id) {
  return request({
    url:'/admin/qmsTest/'+id,
    method:'get',
  })
}

export function addTestQuestions(id,data) {
  return request({
    url: '/admin/qmsTest/addTestQuestions/' + id,
    method: 'post',
    data: data
  })
}

  export function deleteTest(data) {
    return request({
      url:'/admin/qmsTest/delete',
      method:'post',
      data:data
    })
}

