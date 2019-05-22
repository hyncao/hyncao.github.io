import React, { Component } from 'react';

class EdInputItem extends Component {
  constructor(props) {
    super(props);
    this.setLS = this.setLS.bind(this);
  }

  setLS(e){
    
  }

  render() {
    return (
      <div className="item">
        <p>极限层数</p>
        <input type="tel" id="max" placeholder="请输入极限层数" maxLength={5} onInput="setLS(this)" />
      </div>
    )
  }
}

export default EdInputItem;
