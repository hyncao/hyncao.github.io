import React from 'react';
import {
  fade,
  ThemeProvider,
  withStyles,
  createMuiTheme,
} from '@material-ui/core/styles';
import { TextField, MenuItem, Grid } from '@material-ui/core';

class Input extends React.Component {
  render() {
    const CssTextField = withStyles(theme => ({
      width: '100%',
      root: {
        overflow: 'hidden',
        borderRadius: 4,
        backgroundColor: '#fcfcfb',
        transition: theme.transitions.create(['border-color', 'box-shadow']),
        '&:hover': {
          backgroundColor: '#fff',
        },
        '&$focused': {
          backgroundColor: '#fff',
          boxShadow: `${fade(theme.palette.primary.main, 0.25)} 0 0 0 2px`,
          borderColor: theme.palette.primary.main,
        },
      },
      focused: {},
    }))(TextField);
    return (
      <Grid container>
        <Grid item xs={12}>
          <CssTextField
            select
            variant="outlined"
            label="伤害流派"
            helperText="3.8版本中，混用天堂流并不强，不建议使用"
          >
            <MenuItem key={1} value={1}>
              大船
            </MenuItem>
          </CssTextField>
        </Grid>
      </Grid>
    );
  }
}

export default Input;
