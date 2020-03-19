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
      switchValue: false
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

  shouldComponentUpdate(nextProps, nextState) {
    if (
      JSON.stringify(nextProps) !== JSON.stringify(this.props) ||
      JSON.stringify(nextState) !== JSON.stringify(this.state)
    ) {
      return true;
    }
    return false;
  }

  handleSwitchChange() {
    const { switchValue } = this.state;
    const {
      name,
      handleChange: appHandleChange,
      form: { handleChange }
    } = this.props;
    this.setState({ switchValue: !switchValue });
    handleChange(name, { target: { value: !switchValue } }, appHandleChange);
  }

  renderInput() {
    const CssTextField = withStyles(theme => ({
      root: {
        width: '100%',
        borderRadius: 4
      }
    }))(TextField);
    const { switchValue } = this.state;
    const {
      name,
      defaultValue,
      options,
      label,
      rules,
      helperText,
      switchFlag,
      handleChange,
      extra,
      form: { getFieldProps, validateField }
    } = this.props;
    let myRules = [
      {
        required: true,
        message: `请填写${label}`
      }
    ];
    if (rules) {
      myRules.concat(rules);
    }
    const mainInput = (
      <CssTextField
        select={Boolean(options)}
        variant="outlined"
        label={label}
        helperText={helperText}
        defaultValue={defaultValue}
        {...getFieldProps(name, {
          defaultValue,
          rules: myRules,
          extraCallback: handleChange
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
              checked={switchValue}
              {...getFieldProps(name, {
                switchFlag,
                defaultValue,
                rules: [
                  {
                    required: true,
                    message: `请填写${label}`
                  }
                ],
                extraCallback: handleChange
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
                ],

                extraCallback: handleChange
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
