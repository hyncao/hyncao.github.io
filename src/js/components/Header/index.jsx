import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import SearchIcon from '@material-ui/icons/Search';
import Icon from '@material-ui/core/Icon';
import Grid from '@material-ui/core/Grid';
import scss from './index.scss';

const styles = theme => ({
  primaryBg: {
    backgroundColor: theme.palette.primary.main,
  },
  primaryColor: {
    color: theme.palette.primary.contrastText,
  },
  logoSize: {
    fontSize: '50px',
  },
});

class Header extends Component {
  constructor(props){
    super(props);
    this.state = {
      pending: true,
    };
  }

  render(){
    const { classes } = this.props;
    return (
      <div className={classes.primaryBg}>
        <div className={`widthContent ${scss.height}`}>
          <Grid container justify="space-between" alignItems="center" wrap="nowrap">
            <Grid item spacing={16} container xs={6} alignItems="center">
              <Grid item xs={4}>
                <Icon className={`${classes.primaryColor} ${classes.logoSize}`}>image</Icon>
              </Grid>
              <Grid className={`${scss.searchBox} transition3`} container item xs={6} alignItems="center" wrap="nowrap">
                <SearchIcon nativeColor="#fff" />
                <input
                  placeholder="Search"
                  className={classes.searchIpt}
                />
              </Grid>
            </Grid>
            <Grid item xs={6}>

            </Grid>
          </Grid>
        </div>
      </div>
    );
  }
}

export default withStyles(styles)(Header);
