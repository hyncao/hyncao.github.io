import React, { Component } from 'react';
import { Vision, ToolItem } from '../../components';
import { homeList } from '../../config';
import { hocLogger } from '../../hoc';
import styles from './index.module.scss';
import bg from '../../../images/bg.png';

interface IProps {
  history: any
}

interface IState {
  list: Array<IItem>
}

interface IItem {
  name: string;
  url: string;
}

class Home extends Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);
    this.state = {
      list: homeList
    }
    this.handleJump = this.handleJump.bind(this);
  }

  handleJump(url: string) {
    if (url.indexOf('http') > -1) {
      window.location.href = url;
      return;
    }
    this.props.history.push(url);
  }

  render() {
    const { list } = this.state;
    return (
      <div className={styles.content} style={{ background: `#ccc url(${bg}) 20% 0% / cover no-repeat`, height: window.innerHeight }}>
        <div className={styles.title}>
          TT2工具集合
        </div>
        <Vision />
        <div className={styles.info}>
          优化器已增加神器附魔，如果有疑问请联系我
          <br />
          qq 277148066，敲门砖：tt2
        </div>
        <div>
          {list.map((i: any) => <ToolItem jump={this.handleJump} key={i.name} {...i} />)}
        </div>
      </div>
    )
  }
}

export default hocLogger(Home);
