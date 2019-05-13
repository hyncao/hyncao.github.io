import fetch from 'isomorphic-fetch';
import { handleAjaxResult } from './utils';

/**
 * 将对象转成 a=1&b=2的形式
 * @param obj 对象
 */
const obj2String = (obj) => {
  const arr = [];
  Object.keys(obj).forEach((x) => {
    arr.push(`${x}=${obj[x]}`);
  });
  return arr.join('&');
};

const networkError = (e) => {
  console.log('网络异常: ', e);
  if (window.throttle) {
    if (new Date() - window.throttle < 3000) {
      return false;
    }
  } else {
    window.throttle = new Date();
  }
  return { code: 0, msg: '网络异常' };
};

/**
 * 真正的请求
 * @param url 请求地址
 * @param options 请求参数
 * @param method 请求方式
 */
function commonFetcdh(url, options = {}, method) {
  const searchStr = obj2String(options) ? `&${obj2String(options)}` : '';
  let initObj = {};
  let URL = url;
  if (method === 'get') { // 如果是get请求，拼接url
    URL = `${url}?t=${Math.random()}${searchStr}`;
    initObj = {
      method,
      headers: new Headers({
        Accept: 'application/json',
      }),
      mode: 'cors',
    };
  } else {
    initObj = {
      method,
      headers: new Headers({
        Accept: 'application/json',
        'Content-Type': 'application/x-www-form-urlencoded',
      }),
      body: `t=${Math.random()}${searchStr}`,
      mode: 'cors',
    };
  }
  return fetch(URL, initObj);
}

/**
 * 检查请求状态
 * @param response
 */
function checkStatus(response) {
  if (response.status >= 200 && response.status < 300) {
    return response;
  }
  const error = response.errorMsg;
  return error;
}

/**
 * GET请求
 * @param that this指针
 * @param url 请求地址
 * @param options 请求参数
 */
function requestServer(url, options, method = 'get') {
  return commonFetcdh(url, options, method)
    .then(checkStatus)
    .then(res => res.json())
    .then(res => handleAjaxResult(res))
    .catch(e => networkError(e));
}

export default requestServer;
