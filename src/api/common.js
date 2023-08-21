import request from './request'

// 
export function getCollectionsBannerApi(data) {
  return request({
    url: `/collections/banner`,
    method: 'post',
    data
  })
}