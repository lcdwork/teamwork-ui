import request from '@/utils/request'
import { praseStrEmpty } from "@/utils/teamwork";

// 查询用户列表
export function listUser(query) {
  return request({
    url: '/system/user/list',
    method: 'get',
    params: query
  })
}

// 查询团队人员列表
export function teamUserList(data) {
  return request({
    url: '/system/user/teamUserList',
    method: 'get',
    params: data
  })
}

// 新增团队用户
export function addTeamUser(data) {
  return request({
    url: '/system/userTeam',
    method: 'post',
    data: data
  })
}

// 删除团队用户
export function delTeamUser(userId) {
  return request({
    url: '/system/userTeam/' + userId,
    method: 'delete'
  })
}

// 查询同一部门下人员列表
export function listUserByUserId(data) {
  return request({
    url: '/system/user/listUserByUserId',
    method: 'get',
    params: data
  })
}

// 查询项目下人员列表
export function listUserByProject(data) {
  return request({
    url: '/system/user/getListByProjectId',
    method: 'get',
    params: data
  })
}

// 查询任务下人员列表
export function listUserByTask(data) {
  return request({
    url: '/system/user/getListByTaskId',
    method: 'get',
    params: data
  })
}

// 查询消息公共已发送人员列表
export function listUserByNotice(data) {
  return request({
    url: '/system/user/getListByNoticeId',
    method: 'get',
    params: data
  })
}

// 查询用户详细
export function getUser(userId) {
  return request({
    url: '/system/user/' + praseStrEmpty(userId),
    method: 'get'
  })
}

// 新增用户
export function addUser(data) {
  return request({
    url: '/system/user',
    method: 'post',
    data: data
  })
}

// 修改用户
export function updateUser(data) {
  return request({
    url: '/system/user',
    method: 'put',
    data: data
  })
}

// 删除用户
export function delUser(userId) {
  return request({
    url: '/system/user/' + userId,
    method: 'delete'
  })
}

// 导出用户
export function exportUser(query) {
  return request({
    url: '/system/user/export',
    method: 'get',
    params: query
  })
}

// 用户密码重置
export function resetUserPwd(userId, password) {
  const data = {
    userId,
    password
  }
  return request({
    url: '/system/user/resetPwd',
    method: 'put',
    data: data
  })
}

// 用户状态修改
export function changeUserStatus(userId, status) {
  const data = {
    userId,
    status
  }
  return request({
    url: '/system/user/changeStatus',
    method: 'put',
    data: data
  })
}

// 查询用户个人信息
export function getUserProfile() {
  return request({
    url: '/system/user/profile',
    method: 'get'
  })
}

// 修改用户个人信息
export function updateUserProfile(data) {
  return request({
    url: '/system/user/profile',
    method: 'put',
    data: data
  })
}

// 用户密码重置
export function updateUserPwd(oldPassword, newPassword) {
  const data = {
    oldPassword,
    newPassword
  }
  return request({
    url: '/system/user/profile/updatePwd',
    method: 'put',
    params: data
  })
}

// 用户头像上传
export function uploadAvatar(data) {
  return request({
    url: '/system/user/profile/avatar',
    method: 'post',
    data: data
  })
}

// 下载用户导入模板
export function importTemplate() {
  return request({
    url: '/system/user/importTemplate',
    method: 'get'
  })
}
