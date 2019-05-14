import requestServer from './lib/ajax';

const globalApiUrl = 'http://172.16.57.88:3000/';

// 请求地址是相对/src目录的
export const getArticle = data => requestServer(`${globalApiUrl}home/test`, data);
export const getAdd = data => requestServer(`${globalApiUrl}/main/location`, data);
