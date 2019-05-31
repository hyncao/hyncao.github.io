import React, { Component } from 'react';
import { observable, action, configure, autorun } from 'mobx';
import { hocLogger } from '../../hoc';

configure({ enforceActions: 'observed' });

interface IProps { }

interface IState { }

class Test extends Component<IProps, IState> {

  @observable time: number = 0;
  t:any;

  constructor(props: IProps) {
    super(props);
    this.t = 0;
  }

  @action.bound
  add(){
    this.time ++;
  }
  componentDidMount() {
    this.t = setInterval(this.add, 1000);
    
    autorun(() => {
      console.log(this.time);
    });
  }

  @action.bound
  clear(){
    this.time = 0;
    clearInterval(this.t);
  }

  render() {
    return (
      <div>
        <button onClick={this.clear}>点我</button>
      </div>
    )
  }
}

export default hocLogger(Test);
