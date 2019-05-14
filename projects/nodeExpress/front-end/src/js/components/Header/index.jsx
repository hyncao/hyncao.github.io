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
      searchKey: '',
    };
    this.searchIcon = this.searchIcon.bind(this);
    this.changeSearch = this.changeSearch.bind(this);
    this.keyDownSearch = this.keyDownSearch.bind(this);
  }

  searchIcon(){
    const { search } = this.props;
    const { searchKey } = this.state;
    search(searchKey);
  }

  changeSearch(e){
    const val = e.currentTarget.value;
    this.setState({
      searchKey: val,
    });
  }

  keyDownSearch(e){
    // 判断是否是回车
    if (e.keyCode === 13) {
      const val = e.currentTarget.value;
      const { search } = this.props;
      search(val);
    }
  }

  render(){
    const { searchKey } = this.state;
    const { classes } = this.props;
    return (
      <div className={classes.primaryBg}>
        <div className={`widthContent ${scss.height}`}>
          <Grid container justify="space-between" alignItems="center" wrap="nowrap">
            <Grid item spacing={16} container xs={8} alignItems="center">
              <Grid item xs={4}>
                <Icon className={`${classes.primaryColor} ${classes.logoSize}`}>image</Icon>
              </Grid>
              <Grid className={`${scss.searchBox} transition3`} container item xs={6} alignItems="center" wrap="nowrap">
                <SearchIcon onClick={this.searchIcon} nativeColor="#fff" />
                <input
                  placeholder="Search..."
                  className={classes.searchIpt}
                  onChange={this.changeSearch}
                  onKeyDown={this.keyDownSearch}
                  value={searchKey}
                />
              </Grid>
            </Grid>
            <Grid item xs={4} />
          </Grid>
        </div>
      </div>
    );
  }
}

export default withStyles(styles)(Header);
