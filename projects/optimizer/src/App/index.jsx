import React from 'react';
import createForm from '../my-form';
import { withStyles } from '@material-ui/core/styles';
import { Grid, Button, Backdrop, CircularProgress } from '@material-ui/core';
import { delay, getLS, setLS } from '../utils';
import { Input, Artifact } from '../Components';
import config from '../config';
import { formList } from './config';
import styles from './index.module.scss';

const ArtifactItem = withStyles(() => ({
  item: {
    marginTop: '20px'
  }
}))(Grid);

const MyBackdrop = withStyles(() => ({
  root: {
    zIndex: 1
  }
}))(Backdrop);

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      themeType: 'light',
      loading: true,
      tabIndex: 0,
      fieldsValue: {},
      artifactsList: Object.values(config.db.artifacts),
      artifactsStateList: []
    };

    this.storeData = this.storeData.bind(this);
    this.tabChange = this.tabChange.bind(this);
    this.calc = this.calc.bind(this);
    this.handleArtifactChange = this.handleArtifactChange.bind(this);
    this.allArtifact = this.allArtifact.bind(this);
    this.allEnchant = this.allEnchant.bind(this);
  }

  UNSAFE_componentWillMount() {
    // 在綁定
    let { form } = this.props;
    const tempFn = form.handleChange;
    form.handleChange = (name, e) => {
      tempFn(name, e);
      this.storeData();
    };
  }

  async componentDidMount() {
    const { artifactsList } = this.state;
    const artifactsStateList = artifactsList.map(i => ({
      id: i.id,
      checked: false,
      enchantFlag: false
    }));
    // 是否显示动画，显示则打开并且添加动画时间
    // await delay(1000);
    this.setState({ artifactsStateList, loading: false });
    this.loadData();
  }

  loadData() {
    let artifactsStateList = getLS('artifactsStateList');
    let fieldsValue = getLS('fieldsValue');
    if (artifactsStateList) {
      try {
        artifactsStateList = JSON.parse(artifactsStateList);
        this.setState({
          artifactsStateList
        });
      } catch (e) {
        console.warn(
          'Local storage load artifactsStateList error, please clear your cache'
        );
      }
    }
    if (fieldsValue) {
      try {
        fieldsValue = JSON.parse(fieldsValue);
        this.setState({
          fieldsValue
        });
      } catch (e) {
        console.warn(
          'Local storage load fieldsValue error, please clear your cache'
        );
      }
    }
  }

  storeData() {
    const {
      form: { getFieldsValue }
    } = this.props;
    const { artifactsStateList } = this.state;
    setLS('artifactsStateList', JSON.stringify(artifactsStateList));
    setLS('fieldsValue', JSON.stringify(getFieldsValue()));
    console.log(getFieldsValue());
  }

  tabChange(tabIndex) {
    this.setState({ tabIndex });
  }

  calc() {
    const {
      form: { validateFields }
    } = this.props;
    validateFields((err, values) => {
      console.log(err);
      console.log(values);
    });
  }

  handleArtifactChange(id, name) {
    let { artifactsStateList } = this.state;
    artifactsStateList = artifactsStateList.map(i => {
      if (i.id === id) {
        return {
          ...i,
          [name]: !i[name]
        };
      }
      return i;
    });
    this.setState({ artifactsStateList }, this.storeData);
  }

  allArtifact() {
    const { artifactsStateList } = this.state;
    const temp = artifactsStateList.map(i => ({
      ...i,
      checked: true
    }));
    this.setState({ artifactsStateList: temp }, this.storeData);
  }

  allEnchant() {
    const { artifactsStateList } = this.state;
    const temp = artifactsStateList.map(i => ({
      ...i,
      enchantFlag: true
    }));
    this.setState({ artifactsStateList: temp }, this.storeData);
  }

  render() {
    const { form } = this.props;
    const {
      loading,
      themeType,
      tabIndex,
      fieldsValue,
      artifactsList,
      artifactsStateList
    } = this.state;

    if (loading) {
      return (
        <div className={styles.loading}>
          <MyBackdrop open={loading}>
            <CircularProgress color="inherit" />
          </MyBackdrop>
        </div>
      );
    }
    return (
      <div className={`${styles.container} ${styles[themeType]}`}>
        <div className={styles.header}>
          <div className={styles.tab}>
            <Button
              variant={tabIndex === 0 ? 'contained' : 'outlined'}
              color="primary"
              style={{ marginRight: '10px' }}
              onClick={() => this.tabChange(0)}
            >
              配置（优先填写）
            </Button>
            <Button
              variant={tabIndex === 1 ? 'contained' : 'outlined'}
              color="primary"
              onClick={() => this.tabChange(1)}
            >
              神器升级
            </Button>
          </div>
          <div className={styles.tt2Title}>
            <div className={styles.title}>TT2 优化器</div>
            <div className={styles.vision}>v {config.vision}</div>
          </div>
        </div>
        <div style={{ height: '90px' }}></div>
        <div
          className={`${styles.tabItem} ${tabIndex === 0 ? styles.show : ''}`}
        >
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
            are any infringements or other problems, please contact me in time,
            I will delete related apps immediately. QQ -- 277148066
          </p>
          <Grid container spacing={3}>
            {formList.map(i => (
              <Grid key={i.name} item xs={12} sm={4}>
                <Input
                  {...i}
                  defaultValue={
                    fieldsValue[i.name] !== undefined
                      ? fieldsValue[i.name]
                      : i.defaultValue
                  }
                  form={form}
                  handleChange={this.storeData}
                />
              </Grid>
            ))}
          </Grid>
          <p className={styles.h2}>你的神器</p>
          <p>
            这里请勾选你已经<strong className={styles.bold}> *拥有* </strong>
            的神器，而不是躺在你的打捞池里的神器。
          </p>
          <div>
            <Button
              variant="contained"
              color="primary"
              style={{ marginRight: '20px' }}
              onClick={this.allArtifact}
            >
              全部神器
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={this.allEnchant}
            >
              全部附魔
            </Button>
          </div>
          <Grid container spacing={3}>
            {artifactsList.map(i => (
              <ArtifactItem key={i.name} item xs={12} md={3} sm={6}>
                <Artifact
                  id={i.id}
                  name={i.name}
                  enchant={i.enchant}
                  icon={i.icon}
                  checked={
                    artifactsStateList.find(item => item.id === i.id).checked
                  }
                  enchantFlag={
                    artifactsStateList.find(item => item.id === i.id)
                      .enchantFlag
                  }
                  handleChange={this.handleArtifactChange}
                />
              </ArtifactItem>
            ))}
          </Grid>
        </div>
        <div
          className={`${styles.tabItem} ${tabIndex === 1 ? styles.show : ''}`}
        >
          tab2
        </div>
        <div className={styles.foot}>* HAVE FUN *</div>
      </div>
    );
  }
}

export default createForm()(App);
