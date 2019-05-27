import React, { Component } from 'react';

export function hocLogger(WrappedComponent:any) {
  return class HocLogger extends Component {
    start: number = 0;
    componentWillMount() {
      this.start = Date.now();
    }

    componentDidMount() {
      const end = Date.now();
      console.log(`组件名： ${WrappedComponent.displayName || WrappedComponent.name}  渲染时间： ${end - this.start} ms`);
    }

    render() {
      return <WrappedComponent {...this.props} />
    }
  }
}