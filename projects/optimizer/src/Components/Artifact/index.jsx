import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import { FormControlLabel, Switch, Button, Grid } from '@material-ui/core';
import styles from './index.module.scss';

const newStyle = {
  root: {
    backgroundColor: '#e96a5d',
    '&:hover': {
      backgroundColor: '#bd554a'
    }
  }
};

const MyButton = withStyles(() => newStyle)(Button);

class Artifact extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      icon: require(`../../icons/${props.icon}`)
    };
  }

  shouldComponentUpdate(nextProps) {
    if (JSON.stringify(nextProps) !== JSON.stringify(this.props)) {
      return true;
    }
    return false;
  }

  render() {
    const {
      id,
      name,
      enchant,
      checked,
      enchantFlag,
      handleChange
    } = this.props;
    const { icon } = this.state;
    return (
      <Grid
        container
        alignItems="center"
        className={`${styles.box} ${enchant && enchantFlag ? styles.enchant : ''}`}
        spacing={2}
      >
        <Grid item xs={6}>
          <FormControlLabel
            label={name}
            control={
              <Switch
                color="primary"
                checked={checked}
                onChange={() => handleChange(id, 'checked')}
              />
            }
          />
        </Grid>
        <Grid item xs={2}>
          <img className={styles.img} src={icon} alt="icon" />
        </Grid>
        {enchant && (
          <Grid container item xs={4} justify="center">
            <Grid item>
              <MyButton
                size="small"
                variant="contained"
                color="primary"
                onClick={() => handleChange(id, 'enchantFlag')}
              >
                附魔
              </MyButton>
            </Grid>
          </Grid>
        )}
      </Grid>
    );
  }
}

export default Artifact;
