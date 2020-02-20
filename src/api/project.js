import request from '@/utils/request'
import { praseStrEmpty } from "@/utils/teamwork";

// 查询项目列表
export function listProject(query) {
  return request({
    url: '/project/list',
    method: 'get',
    params: query
  })
}

// 查询项目详细
export function getProject(projectId) {
  return request({
    url: '/project/' + praseStrEmpty(projectId),
    method: 'get'
  })
}

// 新增项目
export function addProject(data) {
  return request({
    url: '/project',
    method: 'post',
    data: data
  })
}

// 修改项目信息
export function updateProject(data) {
  return request({
    url: '/project',
    method: 'put',
    data: data
  })
}

// 删除项目
export function delProject(projectId) {
  return request({
    url: '/project/' + projectId,
    method: 'delete'
  })
}
