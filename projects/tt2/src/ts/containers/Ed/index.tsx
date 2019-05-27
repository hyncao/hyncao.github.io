import React, { Component } from 'react';
import { EdInputItem, Vision } from '../../components';
import { hocLogger } from '../../hoc';
import styles from './index.module.scss';

interface IProps { }

interface IState {
  list: Array<IListItem>;
  edData: Array<[number, number, number, number]>;
  totalNum: number;
  slashNum: number;
  halfText: string;
  fullText: string;
}

interface IListItem {
  id: string;
  title: string;
  type: string;
  placeholder: string;
  maxlength: number;
  defaultValue?: string;
  value?: string;
}

class Ed extends Component<IProps, IState> {
  constructor(props: any) {
    super(props);
    this.state = {
      list: [
        { id: 'max', title: '极限层数', type: 'tel', placeholder: '请输入极限层数', maxlength: 5 },
        { id: 'arcane', title: '讨价还价等级', type: 'tel', placeholder: '请输入讨价还价等级', maxlength: 4 },
        { id: 'mystic', title: '神秘冲击等级', type: 'tel', placeholder: '请输入神秘冲击等级', maxlength: 4 },
        { id: 'presence', title: '威名赫赫等级', type: 'tel', placeholder: '请输入威名赫赫等级', maxlength: 4 },
        { id: 'platinum', title: '周年白金套装乘数', type: 'number', placeholder: '请输入周年白金套装乘数', maxlength: 4, defaultValue: '1' },
      ],
      edData: [
        [1, 0, 2, 2], [2, 1, 2, 4], [3, 2, 3, 7], [4, 3, 3, 10], [5, 4, 3, 13],
        [6, 6, 4, 17], [7, 8, 5, 22], [8, 10, 5, 27], [9, 12, 6, 33], [10, 14, 7, 40],
        [11, 16, 8, 48], [12, 18, 9, 57], [13, 20, 11, 68], [14, 23, 12, 80], [15, 26, 14, 94],
        [16, 29, 16, 110], [17, 33, 19, 129], [18, 38, 22, 151], [19, 44, 25, 176], [20, 51, 28, 204],
        [21, 59, 33, 237], [22, 68, 38, 275], [23, 78, 43, 318], [24, 89, 50, 368], [25, 101, 57, 425],
      ],
      totalNum: 0,
      slashNum: 0,
      halfText: '0',
      fullText: '0',
    }

    this.handleChange = this.handleChange.bind(this);
    this.validate = this.validate.bind(this);
    this.calcResult = this.calcResult.bind(this);
    this.handleErrorInput = this.handleErrorInput.bind(this);
  }

  handleChange(id: string, value: string) {
    let { list } = this.state;
    list = list.map((i) => {
      if (i.id === id) {
        i.value = value;
      }
      return i;
    })
    this.setState({ list });
  }

  validate() {
    const { list } = this.state;
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

  calcResult() {
    const { list, edData } = this.state;
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

    this.setState({ totalNum, slashNum, halfText, fullText });
  }

  // 计算小怪总数
  calcTotalNum = (max: string, arcane: string, presence: string) => {
    var baseNum = 8; // 基础小怪数量
    var totalNum = Math.floor(parseInt(max) / 500) * 2 + baseNum;
    var result = totalNum - parseInt(arcane) - parseInt(presence);
    return result;
  }

  // 计算总溅射数
  calcSlashNum = (arcane: string, mystic: string) => parseInt(arcane) + parseInt(mystic);

  handleErrorInput() {
    this.setState({
      totalNum: 0,
      slashNum: 0,
      halfText: '0',
      fullText: '0',
    })
  }

  render() {
    const { list, edData, totalNum, slashNum, halfText, fullText } = this.state;
    return (
      <div className={styles.content}>
        <div className={styles.title}>我是分身流派，ED到底要加多少级呢？</div>
        <Vision />
        <div className={styles.form}>
          {
            list.length > 0 && list.map((i: IListItem) => (
              <EdInputItem {...i} handleChange={this.handleChange} key={i.id} />
            ))
          }
          <button className={styles.btn} onClick={this.validate}>看看结果</button>
        </div>
        <div className={styles.result}>
          <p>总小怪数量：<span>{totalNum}</span></p>
          <p>被动技能溅射数：<span>{slashNum}</span></p>
          <p>满ED： <span>{fullText}</span></p>
          <p>半ED： <span>{halfText}</span></p>
        </div>

        <div className={styles.text}>
          <h3>一些说明</h3>
          <p>针对分身套来说，ED加多少级困扰了好多人，因为需要的技能点偏多，加多了没用，加少了又不能跳关，特意出了这个工具。</p>
          <p>使用此工具的前提是你有<span className={styles.bold}>分身套</span>，有分身套才能跳关，跳关基础触发率为:<span className={styles.bold}>25%</span></p>
          <p>有无天堂套决定了你跳关的最大关数，没有的话最多跳4层，有则是12层</p>
          <p>有问题可以联系<span className={styles.bold}>qq 277148066</span>，敲门砖：tt2</p>
          <h3>一些备注</h3>
          <p className={styles.bold}>*周年白金乘数: 没有填1，有则填写乘数</p>
          <p>*ED：永恒黑暗技能 即蓝3-3</p>
          <p>*炸弹怪：带有炸弹怪buff，则小怪数量减半</p>
          <p>*满ED：极限层，无需炸弹怪buff，都可以跳关（技能点消耗很大）</p>
          <p>*半ED：极限层，只在有炸弹怪buff时，才可以跳关（技能点消耗一般）</p>
          <h3>ED等级参照表</h3>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>等级</th>
                <th>溅射数</th>
                <th>每级消耗</th>
                <th>总消耗</th>
              </tr>
            </thead>
            <tbody>
              {
                edData.map((i, index) => (
                  <tr key={index}>
                    {i.map((td, eq) => <td key={eq}>{td}</td>)}
                  </tr>
                ))
              }
            </tbody>
          </table>
        </div>
      </div>
    )
  }
}

export default hocLogger(Ed);
