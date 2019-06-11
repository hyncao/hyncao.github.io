import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { EdInputItem, Vision } from '../../components';
import EdStore from './store';
import { hocLogger } from '../../hoc';
import styles from './index.module.scss';

const edStore = new EdStore();

@hocLogger
@observer
class Ed extends Component {
  render() {
    const { list, edData, totalNum, slashNum, halfText, fullText, handleChange, validate } = edStore;
    return (
      <div className={styles.content}>
        <div className={styles.title}>我是分身流派，ED到底要加多少级呢？</div>
        <Vision />
        <div className={styles.form}>
          {
            list.length > 0 && list.map((i) => (
              <EdInputItem {...i} handleChange={handleChange} key={i.id} />
            ))
          }
          <button className={styles.btn} onClick={validate}>看看结果</button>
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

export default Ed;
