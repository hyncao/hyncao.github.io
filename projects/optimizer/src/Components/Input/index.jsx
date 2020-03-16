import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import { blue, grey } from '@material-ui/core/colors';
import { TextField, MenuItem, Grid } from '@material-ui/core';
import styles from './index.module.scss';

class Input extends React.Component {
  handleChange() {
    const {
      name,
      form: { validateFields }
    } = this.props;
    validateFields(name, (error, values) => {
      console.log(error);
      console.log(values);
    });
  }

  render() {
    const CssTextField = withStyles(theme => ({
      root: {
        width: '100%',
        borderRadius: 4
      }
    }))(TextField);
    const {
      name,
      defaultValue,
      options,
      label,
      helperText,
      form: { getFieldProps }
    } = this.props;
    return (
      <CssTextField
        select={Boolean(options)}
        variant="outlined"
        label={label}
        helperText={helperText}
        defaultValue={defaultValue}
        {...getFieldProps(name, {
          defaultValue,
          rules: [
            {
              required: true,
              message: `请填写${label}`
            },
            // {
            //   pattern: /^1[3-9]\d{9}$/,
            //   message: '请输入正确的手机号'
            // }
          ]
        })}
      >
        {Boolean(options) &&
          options.map(i => (
            <MenuItem key={i.value} value={i.value}>
              {i.text}
            </MenuItem>
          ))}
      </CssTextField>
    );
  }
}

export default Input;
