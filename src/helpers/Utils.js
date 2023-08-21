import { Modal, message } from "antd";

export function chunks(array, size) {
  return Array.apply(0, new Array(Math.ceil(array.length / size))).map(
    (_, index) => array.slice(index * size, (index + 1) * size)
  );
}

export const truncateHash = (address, startLength = 4, endLength = 4) => {
  if (address === undefined || address === "" || address===null) return "";
  return `${address.substring(0, startLength)}...${address.substring(
    address.length - endLength
  )}`;
};

export const getUTCTimeStamp = (days) => {
  let date = new Date();
  // date.setDate(date.getDate() + parseFloat(days));
  // date.setHours(date.getHours() + parseFloat(days) * 24);
  date.setMinutes(date.getHours() + parseFloat(days) * 24 * 60);
  date = date.toUTCString();

  const utcDate = new Date(date);
  const seconds = utcDate.getTime() / 1000;
  console.log("Seconds:", seconds, days, parseFloat(days) * 24);
  return parseInt(seconds).toString();
};

export const checkExpired = (expireAt) => {
  return (
    parseInt(expireAt) > 0 && parseInt(expireAt) < parseInt(getUTCTimeStamp(0))
  );
};

export const getUTCTime = (timestamp) => {
  const milliseconds = parseInt(timestamp) * 1000;
  return new Date(milliseconds).toUTCString();
};
export const getDateFromTime = (timestamp) => {
  const month = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const milliseconds = parseInt(timestamp) * 1000;
  const date = new Date(milliseconds);
  return `${
    month[date.getMonth()]
  } ${date.getDate()}, ${date.getFullYear()} at ${date.getHours()}:${date.getMinutes()}`;
};

export const openLink = (link) => {
  window.location.href = link;
};

export const getMoralisIpfsURL = (ipfsURL) => {
  const urlObject = new URL(ipfsURL);
  const shortPath = urlObject.pathname;
  const newPath = "https://ipfs.moralis.io:2053" + shortPath;
  return newPath;
};

/**
 * 数字不够x位，前面补0
 * @param {*} num 数字
 * @param {*} len 补零长度
 * @returns  0001
 */
export function formatZero(num, len) {
  if (String(num).length > len) {
    return num;
  }
  return (Array(len).join(0) + num).slice(-len).split("");
}

/**
 * 节流
 * @param func 要执行的回调函数
 * @param wait 延时的时间
 * @param immediate  是否立即执行
 */
let timer, flag;
export function throttle(func, wait = 300, immediate = true) {
  if (immediate) {
    if (!flag) {
      flag = true;
      // 如果是立即执行，则在wait毫秒内开始时执行
      typeof func === "function" && func();
      timer = setTimeout(() => {
        flag = false;
      }, wait);
    }
  } else {
    if (!flag) {
      flag = true;
      // 如果是非立即执行，则在wait毫秒内的结束处执行
      timer = setTimeout(() => {
        flag = false;
        typeof func === "function" && func();
      }, wait);
    }
  }
}

export function getCurrentWeekNumber() {
  let currentDate = new Date().toUTCString();
  const utcDate = new Date(currentDate);
  let oneJan = new Date(utcDate.getFullYear(), 0, 1);
  let numberOfDays = Math.floor((utcDate - oneJan) / (24 * 60 * 60 * 1000));
  let result = Math.ceil((utcDate.getDay() + 1 + numberOfDays) / 7);
  return result;
}

export function getCurrentYear() {
  let currentDate = new Date().toUTCString();
  const utcDate = new Date(currentDate);
  return utcDate.getFullYear();
}

export const showError = (msg) => {
  message.error(msg);
};

export const showSuccess = (msg) => {
  const secondsToGo = 3;
  const modal = Modal.success({
    title: "Success!",
    content: msg,
  });

  setTimeout(() => {
    modal.destroy();
  }, secondsToGo * 1000);
};

export const sleep = (ms) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

export const dateFromTime = (timestamp) => {
  const date = new Date(timestamp.toNumber() * 1000);
  const year = date.getFullYear(),
    month = ("0" + (date.getMonth() + 1)).slice(-2),
    day = ("0" + date.getDate()).slice(-2),
    hour = ("0" + date.getHours()).slice(-2),
    minute = ("0" + date.getMinutes()).slice(-2);
    // second = ("0" + date.getSeconds()).slice(-2);

  return year + "-" + month + "-" + day + " " + hour + ":" + minute;
};

export const floatFixed = (val) => {
  const ival = parseInt(val * 1000000000);
  return ival / 1000000000;
}