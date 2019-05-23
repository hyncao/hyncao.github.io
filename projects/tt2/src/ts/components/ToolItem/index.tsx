import React from 'react';
import styles from './index.module.scss';

interface props {
  url: string;
  name: string;
  jump: (url: string) => void;
}

const ToolItem = ({ url, name, jump }: props) => <div><span className={styles.item} onClick={() => jump(url)}>{name}</span></div>;

export default ToolItem;
