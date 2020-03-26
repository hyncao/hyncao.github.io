import React from 'react';
import { Grid, Button } from '@material-ui/core';
import SkillBox from './SkillBox';
import config from '../../config';
import styles from './index.module.scss';

const { db } = config;
const skillType = ['Knight', 'Warload', 'Sorcerer', 'Rogue'];
const skills = skillType.map(i => db.skills.filter(item => item.type === i));

class SkillTree extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      // 带有等级的数据
      skillTree: db.skills.map(i => ({
        id: i.id,
        type: i.type,
        level: 0
      })),
      selectedId: 'red11',
      selectedItem: {},
      selectedLevel: 0
    };

    this.select = this.select.bind(this);
    this.upgrade = this.upgrade.bind(this);
    this.reset = this.reset.bind(this);
  }

  componentDidMount() {
    this.updateSelected();
  }

  updateSelected() {
    const { selectedId, skillTree } = this.state;
    const selectedItem = {
      ...db.skills.find(i => i.id === selectedId)
    };
    const selectedLevel = skillTree.find(i => i.id === selectedId).level;
    this.setState({ selectedItem, selectedLevel });
  }

  select(selectedId) {
    this.setState({ selectedId }, this.updateSelected);
  }

  upgrade() {
    const { selectedId, skillTree } = this.state;
    const currentLevel = skillTree.find(i => i.id === selectedId).level;
    if (!this.canUpgrade()) return;
    const temp = skillTree.map(i => ({
      ...i,
      level: i.id === selectedId ? currentLevel + 1 : i.level
    }));
    this.setState({ skillTree: temp }, this.updateSelected);
  }

  reset(type) {
    const { skillTree } = this.state;
    const setLevel = i => {
      if (type) {
        if (i.type !== type) {
          return i.level;
        }
      }
      return 0;
    };
    const temp = skillTree.map(i => ({
      ...i,
      level: setLevel(i)
    }));
    this.setState({ skillTree: temp }, this.updateSelected);
  }

  canUpgrade() {
    const { selectedId, skillTree, selectedItem } = this.state;
    const selectedMax = selectedItem.costs.length;
    const currentLevel = skillTree.find(i => i.id === selectedId).level;
    const { type, need, tier, column, id } = selectedItem;
    let extendFlag = true;
    let total = 0;
    if (column !== 0) {
      // 组装父辈id
      const parentId = `${id.substr(0, id.length - 2)}${tier - 1}${
        tier === 2 ? 1 : column
      }`;
      if (skillTree.find(i => i.id === parentId).level === 0) {
        extendFlag = false;
      }
    }
    db.skills
      .filter(i => i.type === type)
      .forEach(i => {
        const level = skillTree.find(item => item.id === i.id).level;
        const costs = [...i.costs];
        costs.splice(level);
        if (costs.length) {
          total += costs.reduce((a, b) => a + b);
        }
        total += 0;
      });
    if (extendFlag && total >= need && currentLevel !== selectedMax)
      return true;
    return false;
  }

  calcTotal() {
    const { skillTree } = this.state;
    let total = 0;
    db.skills.forEach(i => {
      const level = skillTree.find(item => item.id === i.id).level;
      const costs = [...i.costs];
      costs.splice(level);
      if (costs.length) {
        total += costs.reduce((a, b) => a + b);
      }
    });
    return total;
  }

  render() {
    const { skillTree } = this.state;
    const { selectedItem, selectedLevel } = this.state;
    if (!selectedItem.costs) return null;
    const selectedMax = selectedItem.costs.length;
    const selectedIcon = require(`../../icons/skills/${selectedItem.icon}`);

    return (
      <div className={styles.content}>
        <Grid
          className={styles.totalBox}
          container
          direction="column"
          alignItems="center"
          justify="space-between"
          spacing={3}
        >
          <Grid container item alignContent="center" className={styles.total}>
            {this.calcTotal()}
          </Grid>
          <Grid container item alignContent="center">
            <Button
              className={styles.btn}
              color="primary"
              variant="contained"
              onClick={() => this.reset()}
            >
              重置全部
            </Button>
          </Grid>
        </Grid>
        <Grid container spacing={10}>
          {skills.map((i, k) => (
            <Grid key={k} item xs={12} sm={6}>
              <SkillBox
                select={this.select}
                skills={i}
                skillTree={skillTree}
                reset={this.reset}
              />
            </Grid>
          ))}
        </Grid>

        <div style={{ height: '200px' }} />
        <div className={styles.selectedBox}>
          <div className={styles.iconBox}>
            <img src={selectedIcon} alt="icon" />
            <div
              className={`${styles.upgrade} ${
                this.canUpgrade() ? '' : styles.disabled
              }`}
              onClick={this.upgrade}
            >
              {selectedMax === selectedLevel
                ? '满级'
                : `升级 ${selectedItem.costs[selectedLevel]}`}
            </div>
          </div>
          <div className={styles.detailBox}>
            <div className={styles.current}>{selectedLevel}</div>
            {selectedLevel === 0
              ? selectedItem.effects[selectedLevel].split(';').map(i => (
                  <div key={i} className={styles.current}>
                    {i}
                  </div>
                ))
              : selectedItem.effects[selectedLevel - 1].split(';').map(i => (
                  <div key={i} className={styles.current}>
                    {i}
                  </div>
                ))}
            {selectedLevel !== selectedMax && (
              <>
                <div className={styles.next}>下一等级</div>
                {selectedItem.effects[selectedLevel].split(';').map(i => (
                  <div key={i} className={styles.next}>
                    {i}
                  </div>
                ))}
              </>
            )}
          </div>
        </div>
      </div>
    );
  }
}

export default SkillTree;
