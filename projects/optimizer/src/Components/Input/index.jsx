import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import {
  TextField,
  MenuItem,
  Grid,
  FormControl,
  FormHelperText,
  FormControlLabel,
  Switch
} from '@material-ui/core';

class Input extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      switchValue: ''
    };
    this.handleSwitchChange = this.handleSwitchChange.bind(this);
    this.renderInput = this.renderInput.bind(this);
  }

  componentDidMount() {
    const { defaultValue, switchFlag } = this.props;
    if (switchFlag) {
      this.setState({ switchValue: defaultValue });
    }
  }

  handleSwitchChange() {
    const { switchValue } = this.state;
    const {
      name,
      form: { handleChange }
    } = this.props;
    this.setState({ switchValue: !switchValue });
    handleChange(name, { target: { value: !switchValue } });
  }

  renderInput() {
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
      switchFlag,
      extra,
      form: { getFieldProps, getFieldValue }
    } = this.props;
    const mainInput = (
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
            }
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
    const switchInput = (
      <FormControl>
        <FormControlLabel
          label={label}
          control={
            <Switch
              color="primary"
              checked={getFieldValue(name)}
              {...getFieldProps(name, {
                switchFlag,
                defaultValue,
                rules: [
                  {
                    required: true,
                    message: `请填写${label}`
                  }
                ]
              })}
              onChange={this.handleSwitchChange}
            />
          }
        />
        <FormHelperText>{helperText}</FormHelperText>
      </FormControl>
    );

    if (switchFlag) {
      return switchInput;
    }
    if (extra) {
      return (
        <Grid container>
          <Grid item xs={8}>
            {mainInput}
          </Grid>
          <Grid item xs={4}>
            <CssTextField
              select={Boolean(extra.options)}
              variant="outlined"
              defaultValue={extra.defaultValue}
              {...getFieldProps(extra.name, {
                defaultValue: extra.defaultValue,
                rules: [
                  {
                    required: true,
                    message: `请填写`
                  }
                ]
              })}
            >
              {Boolean(extra.options) &&
                extra.options.map(i => (
                  <MenuItem key={i.value} value={i.value}>
                    {i.text}
                  </MenuItem>
                ))}
            </CssTextField>
          </Grid>
        </Grid>
      );
    } else {
      return mainInput;
    }
  }

  render() {
    return this.renderInput();
  }
}

export default Input;
