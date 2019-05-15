import React, { Component } from 'react';
import { Vision, ToolItem } from '../../components';

interface styles {
  content: object;
  title: object;
  info: object;
}

class Home extends Component {
  state = {
    list: [
      {'name': '神器升级工具', url: 'https://fanwenkui.github.io/tt2-artifacts/'},
      {'name': 'ED等级计算器', url: 'https://hyncao.github.io/ed/'},
    ]
  }

  render(){
    const styles:styles = {
      content: {padding: '20px'},
      title: {fontSize: '20px', fontWeight: 'bold'},
      info: {fontSize: '16px'},
    }
    const { list } = this.state;
    return (
      <div style={ styles.content }>
        <div style={ styles.title }>TT2工具集合</div>
        <Vision />
        <div style={ styles.info }>如果有疑问请联系我<br />qq 277148066，敲门砖：tt2</div>
        <div>
          {list.map((i:any) => <ToolItem key={i.name} {...i} />)}
        </div>
      </div>
    )
  }
}

export default Home;
