import React, { Component } from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

/*
 * @param title String 弹窗标题
 * @param *content String 弹窗内容
 * @param button String 按钮内容
 * @param callback Function 按钮回调函数
 * @param open Boolean 是否显示弹窗
*/

class Tips extends Component {
  constructor(props){
    super(props);
    this.state = {
      open: false,
    };
    this.handleClose = this.handleClose.bind(this);
    this.btnClick = this.btnClick.bind(this);
  }

  componentWillReceiveProps(nextProps){
    const { state } = this;
    if (JSON.stringify(nextProps) !== JSON.stringify(this.state)) {
      this.setState({ ...state, ...nextProps });
    }
  }

  handleClose(){
    this.setState({ open: false });
  }

  async btnClick(){
    const { callback } = this.props;
    if (callback) {
      await callback();
    }
    this.handleClose();
  }

  render(){
    const { open } = this.state;
    const { title, content, button } = this.props;
    return (
      <Dialog
        open={open}
        onClose={this.handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{title || '温馨提示'}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">{content}</DialogContentText>
        </DialogContent>
        {typeof button !== 'undefined' && (
          <DialogActions>
            <Button onClick={this.btnClick} color="primary" autoFocus>{button}</Button>
          </DialogActions>
        )}
      </Dialog>
    );
  }
}

export default Tips;
