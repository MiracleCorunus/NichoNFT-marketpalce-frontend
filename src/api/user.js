import request from './request'

// 
export function getUserListApi(data) {
  return request({
    url: `/user/getUserList`,
    method: 'post',
    data
  })
}

export function getUserDetailApi(data) {
  return request({
    url: `/user/getUserDetail`,
    method: 'post',
    data
  })
}

export function addFollowerApi(data) {
  return request({
    url: `/user/addFollowers`,
    method: 'post',
    data
  })
}

export function getUserCollectionApi(data) {
  return request({
    url: `/collections/getUserCollections`,
    method: 'post',
    data
  })
}

export function getFollowerUserApi(data) {
  return request({
    url: `/user/getFollowers`,
    method: 'post',
    data
  })
}

export function getFollowingUserApi(data) {
  return request({
    url: `/user/getFollowings`,
    method: 'post',
    data
  })
}

export function getFavoriteNFTsApi(data) {
  return request({
    url: `/user/getFavoriteNFTs`,
    method: 'post',
    data
  })
}

export function getFavoriteCollections(data) {
  return request({
    url: `/user/getFavoriteCollections`,
    method: 'post',
    data
  })
}

export function getSoldNFTsApi(data) {
  return request({
    url: `/user/getSoldNFTs`,
    method: 'post',
    data
  })
}