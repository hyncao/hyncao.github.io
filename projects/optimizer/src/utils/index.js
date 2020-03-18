export const delay = t => new Promise(res => setTimeout(res, t));

export const createUnitArr = max => {
  if (typeof max !== 'number') {
    console.error('argument of createUnitArr is not a Number');
    return;
  }
  if (max < 1) {
    console.error('argument of createUnitArr can not less than 1');
    return;
  }
  const baseArr = [
    {
      value: 'e0',
      text: '< 1000'
    },
    {
      value: 'e3',
      text: 'K'
    },
    {
      value: 'e6',
      text: 'M'
    },
    {
      value: 'e9',
      text: 'B'
    },
    {
      value: 'e12',
      text: 'T'
    },
    {
      value: 'e15',
      text: 'e15/aa'
    }
  ];
  if (max < 16) {
    return baseArr;
  }
  const extraArr = [];
  for (let i = 0; i < max - 15; i++) {
    const value = `e${i + 16}`;
    extraArr.push({ value, text: value });
  }
  return baseArr.concat(extraArr);
};

export const getLS = key => {
  const ls = window.localStorage;
  if (ls.getItem(key)) {
    return ls.getItem(key);
  }
  return '';
};

export const setLS = (key, value) => {
  const ls = window.localStorage;
  ls.setItem(key, value);
};

export const removeLS = key => {
  const ls = window.localStorage;
  ls.removeItem(key);
};
