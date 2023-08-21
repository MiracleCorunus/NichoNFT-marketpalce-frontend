import request from './request'

export function getNFTDetailApi(data) {
    return request({
      url: `/nft/getNFTDetail`,
      method: 'post',
      data
    })
}

export function getOffersApi(data) {
  return request({
    url: `/nft/getOffers`,
    method: 'post',
    data
  })
}

export function getAuctionBidsApi(data) {
  return request({
    url: `/nft/getAuctionBids`,
    method: 'post',
    data
  })
}

export function getItemActivityApi(data) {
  return request({
    url: `/nft/getItemActivity`,
    method: 'post',
    data
  })
}