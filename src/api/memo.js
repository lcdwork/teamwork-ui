import request from '@/utils/request'
import { praseStrEmpty } from "@/utils/teamwork";
import da from "element-ui/src/locale/lang/da";

// 查询任务详细
export function getMemo(query) {
  return request({
    url: '/memo/list',
    method: 'get',
    params: query
  })
}

// 新增任务
export function addMemo(data) {
  return request({
    url: '/memo',
    method: 'post',
    data: data
  })
}

// 修改任务信息
export function updateMemo(data) {
  return request({
    url: '/memo',
    method: 'put',
    data: data
  })
}

// 删除任务
export function delMemo(memoIds) {
  return request({
    url: '/memo/' + memoIds,
    method: 'delete',
  })
}
