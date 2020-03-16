import { db } from '../config';

const { heroes } = db;

export const formList = [
  {
    name: 'build',
    label: '伤害流派',
    defaultValue: 'cs',
    helperText: '3.8版本中，混用天堂流并不强，不建议使用',
    options: [
      {
        value: 'cs',
        text: '大船流'
      },
      {
        value: 'hs',
        text: '天堂流'
      },
      {
        value: 'hscs',
        text: '天堂 + 大船'
      },
      {
        value: 'hssc',
        text: '天堂 + 影分身'
      },
      {
        value: 'pet',
        text: '宠物流'
      },
      {
        value: 'sc',
        text: '影分身流'
      }
    ]
  },
  {
    name: 'gold',
    label: '金钱流派',
    defaultValue: 'phom',
    options: [
      {
        value: 'phom',
        text: '米心金'
      },
      {
        value: 'fairy',
        text: '仙女金'
      },
      {
        value: 'chest',
        text: '宝箱金'
      },
      {
        value: 'boss',
        text: '头目金'
      }
    ]
  },
  {
    name: 'ltr',
    label: '你的总圣物数',
    defaultValue: '0',
    helperText:
      'K = e3, M = e6, B = e9, T = e12; 5K 填写 5e3, 8.42T 填写 8.48e12'
  },
  {
    name: 'bospct',
    label: '暗影之书所占比重',
    defaultValue: '0',
    helperText:
      'K = e3, M = e6, B = e9, T = e12; 5K 填写 5e3, 8.42T 填写 8.48e12; 如果你想红书保持在固定百分比，请填写%，没全神器前，不建议超过50%'
  },
  {
    name: 'hero',
    label: '最强英雄是哪一个？',
    defaultValue: '',
    helperText:
      '建议选择: 保持所有类型的英雄均衡发展, 因为有时候你无法确定哪个英雄是最强的，为了避免浪费圣物，就均衡升级',
    options: heroes.map(i => ({
      value: i.en,
      text: i.cn
    }))
  }
];
