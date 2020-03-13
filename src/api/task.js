import request from '@/utils/request'
import { praseStrEmpty } from "@/utils/teamwork";
import da from "element-ui/src/locale/lang/da";

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
export function delTask(data) {
  return request({
    url: '/task',
    method: 'delete',
    data: data
  })
}

export function updateUserTaskStatus(data) {
  return request({
    url: '/userTask/updateByStatus',
    method: 'put',
    data: data
  })
}

export function getTaskLog(taskId) {
  return request({
    url: '/taskLog/getTaskLog/' + praseStrEmpty(taskId),
    method: 'get'
  })
}

export function listByTime(query) {
  return request({
    url: '/task/listByTime',
    method: 'get',
    params: query
  })
}

// 新增任务
export function convertMemo(data) {
  return request({
    url: '/task/convertMemo',
    method: 'post',
    data: data
  })
}
