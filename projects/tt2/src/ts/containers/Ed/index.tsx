import React, { Component } from 'react';
import { EdInputItem } from '../../components';

class Ed extends Component {
  constructor(props:any){
    super(props);
  }
  
  state = {
    list: [
      {'id': '神器升级工具', url: 'https://fanwenkui.github.io/tt2-artifacts/'},
      {'name': 'ED等级计算器', url: 'https://hyncao.github.io/ed/'},
    ]
  }

  render(){
    const { list } = this.state;
    return (
      <div className="ed">
        {
          list.length > 0 && list.map((i:object) => (
            <EdInputItem {...i} />
          ))
        }
      </div>
    )
  }
}

export default Ed;
