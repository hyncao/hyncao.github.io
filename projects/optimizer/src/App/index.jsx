import React from 'react';
import { createMuiTheme } from '@material-ui/core/styles';
import { ThemeProvider } from '@material-ui/styles';
import { blue, grey } from '@material-ui/core/colors';
import { TextField, MenuItem, Grid, Button } from '@material-ui/core';
import { Input } from '../Components';
import config from '../config';
import { formList } from './config';
import styles from './index.module.scss';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      themeType: 'light',
      tabIndex: 0
    };

    this.tabChange = this.tabChange.bind(this);
  }

  tabChange(event, tabIndex) {
    this.setState({ tabIndex });
  }

  render() {
    const { themeType, tabIndex } = this.state;

    const theme = createMuiTheme({
      palette: {
        primary: {
          main: blue[500]
        },
        secondary: {
          main: grey[50]
        }
      }
    });

    return (
      <ThemeProvider theme={theme}>
        <div className={`${styles.container} ${styles[themeType]}`}>
          <div className={styles.header}>
            <div className={styles.tab}>
              <Button variant="contained" color="primary" style={{ marginRight: '10px'}}>
                配置（优先填写）
              </Button>
              <Button variant="text" color="primary">
                神器升级
              </Button>
            </div>
            <div className={styles.tt2Title}>
              <div className={styles.title}>TT2 优化器</div>
              <div className={styles.vision}>v {config.vision}</div>
            </div>
          </div>
          <div style={{ height: '90px' }}></div>
          <div hidden={tabIndex !== 0}>
            <p>
              中文翻译由薄荷的猫爬架--Hugo提供，如果有翻译问题，请加QQ群--343443757
              反馈。
            </p>
            <p>如果有技术问题请联系QQ -- 277148066</p>
            <p>
              原作者discord：
              <strong className={styles.bold}>☂ juvia☂#0001</strong>
              ，如果有任何侵权或其他问题，请联系我，我将立即删除相关项目 QQ --
              277148066
            </p>
            <p>
              Author Discord:
              <strong className={styles.bold}> ☂ juvia☂#0001</strong>. If there
              are any infringements or other problems, please contact me in
              time, I will delete related apps immediately. QQ -- 277148066
            </p>
            <Grid container spacing={5}>
              {formList.map(i => (
                <Grid key={i.name} item xs={12} sm={4}>
                  <Input {...i} />
                </Grid>
              ))}
            </Grid>
          </div>
          <div hidden={tabIndex !== 1}>tab2</div>
        </div>
      </ThemeProvider>
    );
  }
}

export default App;
