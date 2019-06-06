import React, { Component, KeyboardEvent } from 'react';
import { observable, action, configure, autorun } from 'mobx';
import { observer } from "mobx-react";
import styles from './index.module.scss';
import { hocLogger } from '../../hoc';

configure({ enforceActions: 'observed' });

interface IItem {
  id: number;
  done: boolean;
  text: string;
}

class TodoStore {
  @observable list: Array<IItem> = [];

  @action.bound
  add(text: string) {
    const len = this.list.length;
    const item = { id: len, done: false, text };
    this.list.push(item);
  }

  @action.bound
  doneFn(id: number) {
    const list = this.list.map((i) => {
      const item = i;
      if (item.id === id) {
        item.done = !item.done;
      }
      return item;
    })
    this.list = list;
  }

  constructor() {
    autorun(() => {
      console.log(this.list.length);
    });
  }
}

const todoStore = new TodoStore();

function Item({ item, store }: { item: IItem, store: TodoStore }) {
  const { id, done, text } = item;
  const { doneFn } = store;
  return (
    <div
      className={done ? styles.done : ''}
      onClick={() => doneFn(id)}
    >{text}</div>
  )
}

@observer
class Test extends Component {
  constructor(props: {}) {
    super(props);
    this.handleKeyDown = this.handleKeyDown.bind(this);
  }

  handleKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    const { keyCode } = e;
    const { value } = e.currentTarget;
    const { add } = todoStore;
    if (keyCode === 13) {
      add(value);
      e.currentTarget.value = '';
    }
  }

  render() {
    const { list } = todoStore;
    return (
      <div>
        <input onKeyDown={this.handleKeyDown} placeholder="Enter Todo" />
        {list && list.map((i) => <Item key={i.id} item={i} store={todoStore} />)}
      </div>
    )
  }
}

export default hocLogger(Test);
