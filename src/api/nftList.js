import request from './request'

// 
export function getNFTListApi(data) {
  return request({
    url: `/nft/getNFTList`,
    method: 'post',
    data
  })
}

// 
export function getTokenCollectionApi(data) {
  return request({
    url: `/token/getTokenCollections`,
    method: 'post',
    data
  })
}

export function getCreatedNFTsApi(data) {
  return request({
    url: `/user/getCreatedNFTs`,
    method: 'post',
    data
  })
}

export function getUserRecommendNFTsApi(data) {
  return request({
    url: `/user/getUserRecommendNFTs`,
    method: 'post',
    data
  })
}

export function getOwnedNFTsApi(data) {
  return request({
    url: `/user/getOwnedNFTs`,
    method: 'post',
    data
  })
}