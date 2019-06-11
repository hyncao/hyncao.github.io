import { observable, action } from 'mobx';

export default class EdStore {
  @observable list = [
    { id: 'max', title: '极限层数', type: 'tel', placeholder: '请输入极限层数', maxlength: 5, value: '' },
    { id: 'arcane', title: '讨价还价等级', type: 'tel', placeholder: '请输入讨价还价等级', maxlength: 4, value: '' },
    { id: 'mystic', title: '神秘冲击等级', type: 'tel', placeholder: '请输入神秘冲击等级', maxlength: 4, value: '' },
    { id: 'presence', title: '威名赫赫等级', type: 'tel', placeholder: '请输入威名赫赫等级', maxlength: 4, value: '' },
    { id: 'platinum', title: '周年白金套装乘数', type: 'number', placeholder: '请输入周年白金套装乘数', maxlength: 4, defaultValue: '1', value: '' },
  ];

  @observable edData = [
    [1, 0, 2, 2], [2, 1, 2, 4], [3, 2, 3, 7], [4, 3, 3, 10], [5, 4, 3, 13],
    [6, 6, 4, 17], [7, 8, 5, 22], [8, 10, 5, 27], [9, 12, 6, 33], [10, 14, 7, 40],
    [11, 16, 8, 48], [12, 18, 9, 57], [13, 20, 11, 68], [14, 23, 12, 80], [15, 26, 14, 94],
    [16, 29, 16, 110], [17, 33, 19, 129], [18, 38, 22, 151], [19, 44, 25, 176], [20, 51, 28, 204],
    [21, 59, 33, 237], [22, 68, 38, 275], [23, 78, 43, 318], [24, 89, 50, 368], [25, 101, 57, 425],
  ];

  @observable totalNum: number = 0;
  @observable slashNum: number = 0;
  @observable halfText: string = '0';
  @observable fullText: string = '0';

  @action.bound
  handleChange(id: string, value: string) {
    const list = this.list.map((i) => {
      if (i.id === id) {
        i.value = value;
      }
      return i;
    })
    this.list = list;
  }

  @action.bound
  validate() {
    const { list } = this;
    let validateFlag = true;
    for (let i in list) {
      const { id, title, value } = list[i];
      if (!value) {
        alert(`${title}不能为空`);
        validateFlag = false;
        break;
      } else {
        let reg = /^[1-9]\d*$/;
        if (id === 'platinum') {
          reg = /(^1\.\d*$)||(^1$)/;
        }
        if (!reg.test(value)) {
          alert(`${title}格式有误`);
          validateFlag = false;
          break;
        }
      }
    }
    if (validateFlag) {
      this.calcResult();
    } else {
      this.handleErrorInput();
    }
  }

  @action.bound
  handleErrorInput() {
    this.totalNum = 0;
    this.slashNum = 0;
    this.halfText = '0';
    this.fullText = '0';
  }

  @action.bound
  calcResult() {
    const { list, edData } = this;
    let valObj: any = {};
    list.forEach((i) => valObj[i.id] = i.value);
    let totalNum = this.calcTotalNum(valObj.max, valObj.arcane, valObj.presence);
    let slashNum = this.calcSlashNum(valObj.arcane, valObj.mystic);
    let halfText: any;
    let fullText: any;
    if (totalNum > 0) {
      let half: any = [];
      let full: any = [];
      edData.forEach((i) => {
        var slash = i[1];
        var finalSlash = (slash + slashNum) * valObj.platinum;
        if (finalSlash > Math.floor(totalNum / 2)) {
          half.push(i);
        }
        if (finalSlash > totalNum) {
          full.push(i);
        }
      })
      if (half.length) {
        halfText = `${half[0][0]}级 溅射数：${half[0][1]} 总技能点：${half[0][3]}`;
      } else {
        halfText = '溅射数远远不够，满级ED也无法提供足够的溅射数，请提高被动技能等级';
      }
      if (full.length) {
        fullText = `${full[0][0]}级 溅射数：${full[0][1]} 总技能点：${full[0][3]}`;
      } else {
        fullText = '溅射数远远不够，满级ED也无法提供足够的溅射数，请提高被动技能等级';
      }
    } else {
      totalNum = 0;
      slashNum = 0;
      halfText = 0;
      fullText = 0;
    }

    this.totalNum = totalNum;
    this.slashNum = slashNum;
    this.halfText = halfText;
    this.fullText = fullText;
  }

  @action.bound
  calcTotalNum(max: string, arcane: string, presence: string) {
    var baseNum = 8; // 基础小怪数量
    var totalNum = Math.floor(parseInt(max) / 500) * 2 + baseNum;
    var result = totalNum - parseInt(arcane) - parseInt(presence);
    return result;
  }

  // 计算总溅射数
  @action.bound
  calcSlashNum(arcane: string, mystic: string) {
    return parseInt(arcane) + parseInt(mystic)
  }
}
