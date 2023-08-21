import request from './request'

// 
export function getTradeAnalysisDataApi() {
  return request({
    url: `/assets/getTradeAnalysisData`,
    method: 'get',
  })
}

export function getTradeRankApi(weekOfYear, limit) {
  return request({
    url: `/assets/tradeRank/${weekOfYear}/${limit}`,
    method: 'get',
  })
}

export function getMintRankApi(weekOfYear, limit) {
  return request({
    url: `/assets/mintRank/${weekOfYear}/${limit}`,
    method: 'get',
  })
}


