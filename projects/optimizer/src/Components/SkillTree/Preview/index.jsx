import React from 'react';
import styles from './index.module.scss';

const SKILL_TYPE_LIST = ['Knight', 'Summoner', 'Warload', 'Sorcerer', 'Rogue'];

export default class extends React.Component {
  constructor(props) {
    super(props);
    this.calcTotal = this.calcTotal.bind(this);
    this.prepareSection = this.prepareSection.bind(this);
  }

  calcTotal(type) {
    const { data } = this.props;
    const list = data.filter((i) => i.type === type && i.level > 0);
    if (list.length) {
      return list
        .map((i) => {
          const cost = i.costs.slice(0, i.level);
          if (cost.length) {
            return cost.reduce((a, b) => a + b);
          }
          return 0;
        })
        .reduce((a, b) => a + b);
    }
    return 0;
  }

  prepareSection(type) {
    const { data } = this.props;
    const list = data.filter((i) => i.type === type);
    const section = [];
    list.forEach((i) => {
      if (!section.includes(i.tier)) {
        section.push(i.tier);
      }
    });
    return section.map((tier) => list.filter((i) => i.tier === tier));
  }

  render() {
    const { data, closeFn } = this.props;
    return (
      <div className={styles.content} tabIndex={-1} onClick={closeFn}>
        {SKILL_TYPE_LIST.map((type) => (
          <div key={type} className={styles.block}>
            <div className={styles.total}>{this.calcTotal(type)}</div>
            <div className={styles.box}>
              {this.prepareSection(type).map((section, index) => (
                <div key={index} className={styles.section}>
                  {section[0] && section[0].id.includes('42') && <div className={styles.item} />}
                  {section.map((item) => (
                    <div key={item.id} className={styles.item}>
                      <img
                        src={require(`../../../icons/skills/${item.icon}`)}
                      />
                      <div>{item.level}</div>
                    </div>
                  ))}
                  {section[section.length-1] && section[section.length-1].id.includes('42') && <div className={styles.item} />}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  }
}
