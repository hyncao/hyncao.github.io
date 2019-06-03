import React, { Component } from 'react';
import { observable, action, configure, autorun, } from 'mobx';
import { observer } from "mobx-react";
import { hocLogger } from '../../hoc';

configure({ enforceActions: 'observed' });

class TestStore {
  @observable num: number = 0;

  @action.bound
  add() {
    this.num++;
  }

  @action.bound
  min() {
    this.num--;
  }

  constructor() {
    autorun(() => console.log(this.num));
  }
}

const testStore = new TestStore();

function Add({ add }: { add: () => void }) {
  return <button onClick={add}>加一</button>;
}

function Min({ min }: { min: () => void }) {
  return <button onClick={min}>减一</button>;
}

interface IProps { }

interface IState { }

@observer
class Test extends Component<IProps, IState> {
  render() {
    const { num, add, min } = testStore;
    return (
      <div>
        <h3>{num}</h3>
        <Add add={add} />
        <Min min={min} />
      </div>
    )
  }
}

export default hocLogger(Test);
