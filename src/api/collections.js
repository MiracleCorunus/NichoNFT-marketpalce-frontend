import request from "./request";

// Get user collections
/**
 * {
 *      "pageNo": 1. "pageSize": 10, "ethAddress": "0x...", "search":""
 * }
 */
 export function getCollectionsApi(data) {
  return request({
    url: `/collections/getCollections`,
    method: 'post',
    data
  })
}

export function getUserCollections(data) {
  return request({
    url: `/collections/getUserCollections`,
    method: "post",
    data,
  });
}

export function getCollectionsDetail(data) {
  return request({
    url: `/collections/getCollectionsDetail`,
    method: "post",
    data,
  });
}

export function getCollectionsItemsApi(data) {
  return request({
    url: `/collections/getCollectionsItems`,
    method: 'post',
    data
  })
}


