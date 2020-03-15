import React from 'react';
import {
  fade,
  ThemeProvider,
  withStyles,
  createMuiTheme
} from '@material-ui/core/styles';
import { blue, grey } from '@material-ui/core/colors';
import { TextField, MenuItem, Grid } from '@material-ui/core';
import styles from './index.module.scss';

class Input extends React.Component {
  render() {
    const CssTextField = withStyles(theme => ({
      root: {
        width: '100%',
        borderRadius: 4
      }
    }))(TextField);
    const { name, options } = this.props;
    return (
      <CssTextField
        select={Boolean(options)}
        name={name}
        variant="outlined"
        label="伤害流派"
        helperText="3.8版本中，混用天堂流并不强，不建议使用"
      >
        {options.map(i => (
          <MenuItem key={i.value} value={i.value}>
            {i.text}
          </MenuItem>
        ))}
      </CssTextField>
    );
  }
}

export default Input;
