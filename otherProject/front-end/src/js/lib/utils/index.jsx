// 将utils的组件全部导出
export { default as Tips } from './Tips';

export const HTMLEncode = (html) => {
  let temp = document.createElement('div');
  (temp.textContent != null) ? (temp.textContent = html) : (temp.innerText = html);
  const output = temp.innerHTML;
  temp = null;
  return output;
};

export const HTMLDecode = (text) => {
  let temp = document.createElement('div');
  temp.innerHTML = text;
  const output = temp.innerText || temp.textContent;
  temp = null;
  return output;
};

export const handleAjaxResult = (res) => {
  if (res.code !== 200) {
    console.log(res.errMsg);
    return false;
  }
  return res;
};


export const delay = async during => new Promise(resolve => setTimeout(resolve, during));
