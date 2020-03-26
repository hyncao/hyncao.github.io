import React from 'react';
import { Grid, Button } from '@material-ui/core';
import SkillItem from '../SkillItem';
import styles from './index.module.scss';

class SkillBox extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      skillType: props.skills[0].type
    };
    this.preFixedSkills = this.preFixedSkills.bind(this);
    this.calcTotal = this.calcTotal.bind(this);
  }

  preFixedSkills() {
    const { skills } = this.props;
    const arr = [1, 2, 3, 4];
    return arr.map(index => skills.filter(i => i.tier === index));
  }

  calcTotal() {
    const { skills, skillTree } = this.props;
    let total = 0;
    skills.forEach(i => {
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
    const { skillTree, reset } = this.props;
    const { skillType } = this.state;
    const skills = this.preFixedSkills();
    return (
      <div className={styles.content}>
        <Grid
          className={styles.btnBox}
          container
          direction="column"
          alignItems="center"
          justify="space-between"
          spacing={3}
        >
          <Grid
            container
            item
            alignContent="center"
            className={styles[skillType]}
          >
            {this.calcTotal()}
          </Grid>
          <Grid container item alignContent="center">
            <Button className={styles.btn} color="primary" variant="contained" onClick={() => reset(skillType)}>
              重置
            </Button>
          </Grid>
        </Grid>
        <Grid container direction="column" justify="space-between" spacing={5}>
          {skills.map((i, k) => (
            <Grid
              key={k}
              container
              item
              justify={k === 0 ? 'center' : 'space-between'}
            >
              {i.map((item, index) => (
                <Grid key={index} item xs={3} sm={2}>
                  <SkillItem
                    id={item.id}
                    select={this.props.select}
                    level={
                      skillTree.find(skillItem => skillItem.id === item.id)
                        .level
                    }
                    icon={item.icon}
                  />
                </Grid>
              ))}
            </Grid>
          ))}
        </Grid>
      </div>
    );
  }
}

export default SkillBox;
