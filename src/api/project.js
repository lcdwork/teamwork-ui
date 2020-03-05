import request from '@/utils/request'
import { praseStrEmpty } from "@/utils/teamwork";
import da from "element-ui/src/locale/lang/da";

// 查询项目列表
export function listProject(query) {
  return request({
    url: '/project/list',
    method: 'get',
    params: query
  })
}

// 查询用户所在的项目列表
export function listProjectByUser(query) {
  return request({
    url: '/project/listProjectByUser',
    method: 'get',
    params: query
  })
}

// 查询项目任务下拉树结构
export function treeselect(query) {
  return request({
    url: '/project/treeselect',
    method: 'get',
    params: query
  })
}

export function ganttTree(data) {
  return request({
    url: '/project/ganttTree',
    method: 'post',
    data: data
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
export function delProject(data) {
  return request({
    url: '/project',
    method: 'delete',
    data: data
  })
}

export function getProjectLog(query) {
  return request({
    url: '/projectLog/getProjectLog',
    method: 'get',
    params: query
  })
}
