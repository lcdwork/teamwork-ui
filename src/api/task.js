import request from '@/utils/request'
import { praseStrEmpty } from "@/utils/teamwork";

// 查询任务列表
export function listTask(query) {
  return request({
    url: '/task/list',
    method: 'get',
    params: query
  })
}

// 查询任务列表--By用户
export function listTaskByUser(query) {
  return request({
    url: '/task/listByUser',
    method: 'get',
    params: query
  })
}

// 查询任务详细
export function getTask(taskId) {
  return request({
    url: '/task/' + praseStrEmpty(taskId),
    method: 'get'
  })
}

// 新增任务
export function addTask(data) {
  return request({
    url: '/task',
    method: 'post',
    data: data
  })
}

// 修改任务信息
export function updateTask(data) {
  return request({
    url: '/task',
    method: 'put',
    data: data
  })
}

// 删除任务
export function delTask(userId) {
  return request({
    url: '/task/' + userId,
    method: 'delete'
  })
}
