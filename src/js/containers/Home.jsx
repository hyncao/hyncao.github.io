import React, { Component } from 'react';
import Button from '@material-ui/core/Button';
import AddIcon from '@material-ui/icons/Add';
import Icon from '@material-ui/core/Icon';
import { withStyles } from '@material-ui/core/styles';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as actions from '../actions';
import { Header } from '../components';
import utils from '../lib/utils';

// const styles = theme => ({
//   button: {
//     margin: theme.spacing.unit,
//   },
// });
const styles = theme => ({
  button: {
    margin: theme.spacing.unit,
  },
});

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      text: 'Hello World',
    };
  }

  render(){
    const { classes } = this.props;
    return (
      <React.Fragment>
        <Header />
        <div>
          <Icon>edit_icon</Icon>
          <AddIcon />
          <Button className={classes.button} variant="text">Default</Button>
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
      </React.Fragment>
    );
  }
}

export default withStyles(styles)(Home);
