import React from 'react';
import styles from './index.module.scss';

export default function SkillItem({ level, icon, select, id }) {
  const fixedIcon = require(`../../../icons/skills/${icon}`)
  return (
    <div className={styles.box} onClick={() => select(id)}>
      <div>{level}</div>
      <img src={fixedIcon} alt="skill"/>
    </div>
  );
}