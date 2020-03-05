import request from '@/utils/request'

// 查询公告列表
export function listNotice(query) {
  return request({
    url: '/notice/list',
    method: 'get',
    params: query
  })
}

// 查询公告详细
export function getNotice(noticeId) {
  return request({
    url: '/notice/' + noticeId,
    method: 'get'
  })
}

// 新增公告
export function addNotice(data) {
  return request({
    url: '/notice',
    method: 'post',
    data: data
  })
}

// 修改公告
export function updateNotice(data) {
  return request({
    url: '/notice',
    method: 'put',
    data: data
  })
}

// 消息已读
export function updateRead(data) {
  return request({
    url: '/userNotice',
    method: 'put',
    data: data
  })
}

// 删除公告
export function delNotice(noticeId) {
  return request({
    url: '/notice/' + noticeId,
    method: 'delete'
  })
}

// 批量删除公告
export function delNoticeBatch(noticeIds) {
  return request({
    url: '/notice/removeBatch/' + noticeIds,
    method: 'delete'
  })
}
