import React, { Component, ChangeEvent } from 'react';
import styles from './index.module.scss';

interface edList {
  id: string;
  title: string;
  type: string;
  placeholder: string;
  maxlength: number;
  defaultValue?: string;
  handleChange: (id: string, value: string) => void;
}

interface IState { }

class EdInputItem extends Component<edList, IState> {
  constructor(props: edList) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
  }

  state = {
    value: this.props.defaultValue || '',
  }

  componentWillMount() {
    this.loadLS();
  }

  loadLS() {
    const { id, handleChange, defaultValue } = this.props;
    const value = localStorage.getItem(`ed:${id}`);
    let tempVal;
    if (value) {
      tempVal = value;
    } else if (defaultValue) {
      tempVal = defaultValue;
    }
    if (tempVal) {
      this.setState({ value: tempVal });
      handleChange(id, tempVal);
    }
  }

  handleChange(e: ChangeEvent<HTMLInputElement>) {
    let { value } = this.state;
    const val = e.currentTarget.value;
    const { id, handleChange } = this.props;
    if (id === 'platinum') {
      value = val.replace(/[^0-9.]/g, '');
    } else {
      value = val.replace(/[^0-9]/g, '');
    }
    this.setState({ value });
    localStorage.setItem('ed:' + id, value);
    handleChange(id, value);
  }

  render() {
    const { title, type, placeholder, maxlength } = this.props;
    const { value } = this.state;
    return (
      <div className={styles.item}>
        <p>{title}</p>
        <input className={styles.input} type={type} placeholder={placeholder} maxLength={maxlength} onChange={this.handleChange} value={value} />
      </div>
    )
  }
}

export default EdInputItem;
