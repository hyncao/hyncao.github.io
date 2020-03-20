import React from 'react';
import ReactDOM from 'react-dom';
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions
} from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';

export const delay = t => new Promise(res => setTimeout(res, t));

export const createUnitArr = max => {
  if (typeof max !== 'number') {
    console.error('argument of createUnitArr is not a Number');
    return;
  }
  if (max < 1) {
    console.error('argument of createUnitArr can not less than 1');
    return;
  }
  const baseArr = [
    {
      value: 'e0',
      text: '< 1000'
    },
    {
      value: 'e3',
      text: 'K'
    },
    {
      value: 'e6',
      text: 'M'
    },
    {
      value: 'e9',
      text: 'B'
    },
    {
      value: 'e12',
      text: 'T'
    },
    {
      value: 'e15',
      text: 'e15/aa'
    }
  ];
  if (max < 16) {
    return baseArr;
  }
  const extraArr = [];
  for (let i = 0; i < max - 15; i++) {
    const value = `e${i + 16}`;
    extraArr.push({ value, text: value });
  }
  return baseArr.concat(extraArr);
};

export const getLS = key => {
  const ls = window.localStorage;
  if (ls.getItem(key)) {
    return ls.getItem(key);
  }
  return '';
};

export const setLS = (key, value) => {
  const ls = window.localStorage;
  ls.setItem(key, value);
};

export const removeLS = key => {
  const ls = window.localStorage;
  ls.removeItem(key);
};

export const tips = ({ title = '哦豁', content, callback }) => {
  const MyButton = withStyles(() => ({
    containedPrimary: {
      backgroundColor: '#2196f3',
      '&:hover': {
        backgroundColor: '#1769aa'
      }
    }
  }))(Button);

  class DialogComponent extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        open: true
      };
      this.handleClose = this.handleClose.bind(this);
    }

    handleClose() {
      this.setState({ open: false }, () => {
        const { callback } = this.props;
        if (typeof callback === 'function') callback();
        document.getElementById('dialog').remove();
      });
    }

    render() {
      const { title, content } = this.props;
      return (
        <Dialog open={this.state.open} onClose={this.handleClose}>
          <DialogTitle>{title}</DialogTitle>
          <DialogContent>
            <DialogContentText>{content}</DialogContentText>
          </DialogContent>
          <DialogActions>
            <MyButton
              onClick={this.handleClose}
              variant="contained"
              color="primary"
              autoFocus
            >
              好嘞
            </MyButton>
          </DialogActions>
        </Dialog>
      );
    }
  }
  const target = document.createElement('div');
  target.id = 'dialog';
  document.body.appendChild(target);
  ReactDOM.render(
    <DialogComponent title={title} content={content} callback={callback} />,
    target
  );
};

export const getCharNum = string => {
  let length = 0;
  string.split('').forEach(i => {
    if (/[a-zA-Z]/.test(i)) {
      length += 1;
    } else {
      length += 2;
    }
  });
  return length;
};

export const getFontSize = string => {
  const screenWidth = window.innerWidth;
  let fontSize = 12;
  if (screenWidth < 500) {
    const length = getCharNum(string);
    fontSize = 140 / length;
    if (fontSize > 12) {
      fontSize = 12;
    }
  }
  return `${fontSize}px`;
};

export const letters = [
  '_',
  'a',
  'b',
  'c',
  'd',
  'e',
  'f',
  'g',
  'h',
  'i',
  'j',
  'k',
  'l',
  'm',
  'n',
  'o',
  'p',
  'q',
  'r',
  's',
  't',
  'u',
  'v',
  'w',
  'x',
  'y',
  'z'
];

export const displayTruncated = (value, notation) => {
  if (value > 999999999999999) {
    if (notation) {
      value = value.toExponential(2);
      value = value.replace(/\+/, '').replace(/\.?0+e/, 'e');
    } else {
      let letterExpo = '';
      const expo = value.toExponential(3).replace(/\d+\.\d+e\+(\d+)/, '$1');
      const expoAdj = Math.floor(expo / 3) - 4;
      letterExpo += 'a' + letters[expoAdj];
      value = value.toExponential(10).replace(/e\+\d+/, '');
      value *= 0 !== expo % 3 ? Math.pow(10, expo % 3) : 1;
      value = value.toFixed(2);
      value = value + letterExpo;
    }
  } else {
    if (value > 999999999999) {
      value = (value / 1000000000000).toFixed(2).replace(/\.?0+$/, '');
      value += 'T';
    } else if (value > 999999999) {
      value = (value / 1000000000).toFixed(2).replace(/\.?0+$/, '');
      value += 'B';
    } else if (value > 999999) {
      value = (value / 1000000).toFixed(2).replace(/\.?0+$/, '');
      value += 'M';
    } else if (value > 999) {
      value = (value / 1000).toFixed(2).replace(/\.?0+$/, '');
      value += 'K';
    } else {
      value = Math.floor(value);
    }
  }
  return value;
};

export { default as reg } from './reg';
