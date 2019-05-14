import React, { Component } from 'react';
import Button from '@material-ui/core/Button';
import AddIcon from '@material-ui/icons/Add';
import Icon from '@material-ui/core/Icon';
import { withStyles } from '@material-ui/core/styles';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as actions from '../actions';
import { Header, Markdown } from '../components';
import { Tips } from '../lib/utils';

const styles = theme => ({
  button: {
    margin: theme.spacing.unit,
  },
});

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      contentHtml: '',
      tipsOptions: {
        open: false,
        title: '',
        content: '',
        button: '',
        callback: '',
      },
    };
    this.search = this.search.bind(this);
    this.tips = this.tips.bind(this);
    this.handleClick = this.handleClick.bind(this);
  }

  search(val){
    console.log(val);
  }

  tips(title, content, button, callback){
    const { tipsOptions } = this.state;
    const tempTipsOptions = {
      ...tipsOptions,
      open: true,
      title,
      content,
      button,
      callback,
    };
    this.setState({
      tipsOptions: tempTipsOptions,
    });
  }

  handleClick(){
    this.tips('温馨提示', '测试一下吧', '好的', () => console.log('测试成功'));
  }

  render(){
    const { classes } = this.props;
    const { tipsOptions, contentHtml } = this.state;
    return (
      <React.Fragment>
        <Tips {...tipsOptions} />
        <Header search={this.search} />
        <div>
          <Icon>edit_icon</Icon>
          <AddIcon />
          <Button className={classes.button} variant="text" onClick={this.handleClick}>Default</Button>
          <Button className={classes.button} variant="text" color="primary">Primary</Button>
          <Button className={classes.button} variant="text" color="secondary">Secondary</Button>
          <Button className={classes.button} variant="text" color="secondary" disabled>Disabled</Button>
        </div>
        <div>
          <Button className={classes.button} variant="outlined">Default</Button>
          <Button className={classes.button} variant="outlined" color="primary">Primary</Button>
          <Button className={classes.button} variant="outlined" color="secondary">Secondary</Button>
          <Button className={classes.button} variant="outlined" color="secondary" disabled>Disabled</Button>
        </div>
        <Markdown id={20181227101530} />
      </React.Fragment>
    );
  }
}

export default withStyles(styles)(Home);
