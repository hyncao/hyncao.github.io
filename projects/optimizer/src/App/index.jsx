import React from 'react';
import createForm from '../my-form';
import { withStyles } from '@material-ui/core/styles';
import { Grid, Button, Backdrop, CircularProgress } from '@material-ui/core';
import {
  delay,
  getLS,
  setLS,
  tips,
  getFontSize,
  displayTruncated,
} from '../utils';
import { Input, Artifact, Table, SkillTree } from '../Components';
import config from '../config';
import { formList } from './config';
import styles from './index.module.scss';

const ArtifactItem = withStyles(() => ({
  item: {
    marginTop: '20px',
  },
}))(Grid);

const MyBackdrop = withStyles(() => ({
  root: {
    zIndex: 1,
  },
}))(Backdrop);

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      themeType: 'light',
      loading: true,
      tabIndex: 0,
      fieldsValue: {},
      formList: formList,
      artifactsList: Object.values(config.db.artifacts),
      artifactsStateList: [],
      dataSource: [],
      orderBy: 'artifact',
      order: 'asc',
    };

    this.storeData = this.storeData.bind(this);
    this.tabChange = this.tabChange.bind(this);
    this.adjustArtifacts = this.adjustArtifacts.bind(this);
    this.beforeCalc = this.beforeCalc.bind(this);
    this.handleArtifactChange = this.handleArtifactChange.bind(this);
    this.allArtifact = this.allArtifact.bind(this);
    this.allEnchant = this.allEnchant.bind(this);
    this.handleSort = this.handleSort.bind(this);
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
    const artifactsStateList = artifactsList.map((i) => ({
      id: i.id,
      checked: false,
      enchantFlag: false,
    }));
    // TODO 是否显示动画，显示则打开并且添加动画时间
    // await delay(1000);
    this.setState({ artifactsStateList, loading: false }, this.loadData);
  }

  loadData() {
    const { artifactsStateList: state } = this.state;
    let artifactsStateList = getLS('artifactsStateList');
    let fieldsValue = getLS('fieldsValue');
    if (artifactsStateList) {
      try {
        artifactsStateList = JSON.parse(artifactsStateList);
        artifactsStateList = state.map((i) => {
          const target = artifactsStateList.find((item) => item.id === i.id);
          return {
            ...i,
            checked: target ? i.checked : target.checked,
            enchantFlag: target ? i.enchantFlag : target.enchantFlag,
          };
        });
        this.setState({
          artifactsStateList,
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
        let { formList } = this.state;
        formList = formList.map((i) => {
          let { extra, defaultValue } = i;
          if (fieldsValue[i.name] !== undefined) {
            defaultValue = fieldsValue[i.name];
          }
          if (extra) {
            if (fieldsValue[extra.name] !== undefined) {
              extra.defaultValue = fieldsValue[extra.name];
            }
          }
          return {
            ...i,
            extra,
            defaultValue,
          };
        });
        this.setState({
          fieldsValue,
          formList,
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
      form: { getFieldsValue },
    } = this.props;
    const { artifactsStateList } = this.state;
    setLS('artifactsStateList', JSON.stringify(artifactsStateList));
    setLS('fieldsValue', JSON.stringify(getFieldsValue()));
  }

  tabChange(tabIndex) {
    if (tabIndex === 1) {
      this.beforeCalc();
      return;
    }
    this.setState({ tabIndex });
  }

  adjustArtifacts(
    { active, gold, build, hero, ltr, ltrFactor, unit, bospct, bosunit },
    artifactsStateList
  ) {
    const heroObj = config.db.heroes.find((i) => i.en === hero);
    const { faction: heroFaction, type: heroType } = heroObj;
    let { artifactsList } = this.state;
    artifactsList = artifactsList.filter((i) =>
      artifactsStateList.find((owned) => owned.id === i.id && owned.checked)
    );
    const calcBospct = parseFloat(
      bosunit === '%' ? bospct / 100 : bospct + bosunit
    );
    let hero_value = 0;
    let minimum_effect = 999999999;
    let adjustArtifactsArr = []; // 最终的数据
    artifactsList.forEach((i) => {
      const reductions = { ...i.reductions_orig };
      const calcReductionsByHero = () => {
        reductions.cs -= hero_value;
        reductions.sc -= hero_value;
        reductions.pet -= hero_value;
        reductions.hs -= hero_value;
        reductions.hscs -= hero_value;
        reductions.hssc -= hero_value;
      };
      if (0 < i.inactive_adj && active) {
        if (i.type === 'gold') {
          reductions[gold] -= i.inactive_adj;
        } else {
          reductions[build] -= i.inactive_adj;
        }
      }
      if (i.id === 'Artifact35') {
        // 英雄之刃
        hero_value = reductions[build];
      }
      if (i.id === 'Artifact77' || i.id === 'Artifact47') {
        // 仙后法杖 | 入侵者的海姆达尔之角
        if (gold === 'fairy' || gold === 'phom') {
          reductions.cs -= config.db.gold_hom_adj;
          reductions.sc -= config.db.gold_hom_adj;
          reductions.pet -= config.db.gold_hom_adj;
          reductions.hs -= config.db.gold_hom_adj;
          reductions.hscs -= config.db.gold_hom_adj;
          reductions.hssc -= config.db.gold_hom_adj;
        }
      }
      if (i.type === 'hero') {
        switch (i.id) {
          case 'Artifact32':
          case 'Artifact86':
            if (!heroFaction.includes('melee')) {
              calcReductionsByHero();
            }
            break;
          case 'Artifact33':
          case 'Artifact90':
            if (!heroFaction.includes('ranged')) {
              calcReductionsByHero();
            }
            break;
          case 'Artifact34':
          case 'Artifact89':
            if (!heroFaction.includes('spell')) {
              calcReductionsByHero();
            }
            break;
          case 'Artifact61':
          case 'Artifact88':
            if (!heroType.includes('ground')) {
              calcReductionsByHero();
            }
            break;
          case 'Artifact62':
          case 'Artifact87':
            if (!heroType.includes('flying')) {
              calcReductionsByHero();
            }
            break;
          default:
        }
      }
      minimum_effect = Math.min(minimum_effect, i.effect);

      adjustArtifactsArr.push({
        id: i.id,
        name: i.name,
        icon: i.icon,
        type: i.type,
        max: i.max,
        inactive_adj: i.inactive_adj,
        reductions,
      });
    });
    minimum_effect = 1 - minimum_effect;
    let runningWcost = 0;
    const totalArtifactsOwned = artifactsStateList.filter((i) => i.checked)
      .length;
    const totalArtifactsPurchaseCost = Object.values(config.db.artifact_costs)
      .slice(0, totalArtifactsOwned + 1)
      .reduce((prev, next) => prev + next);
    let relics2Spread = parseFloat(ltr + ltrFactor);
    adjustArtifactsArr = adjustArtifactsArr.map((i) => {
      const adjustArtifactsItem = artifactsList.find(
        (item) => item.id === i.id
      );
      const { effect, gpeak, type, texpo, adcalc, max } = adjustArtifactsItem;
      const weffect = Math.pow(
        (effect + minimum_effect) / minimum_effect,
        1 / 3
      );
      const wcost =
        ((weffect *
          gpeak *
          (type === 'gold' ? i.reductions[gold] : i.reductions[build])) /
          texpo +
          adcalc) *
        (0 < max ? 0 : 1);
      runningWcost += wcost;
      // TODO 对有上限神器，需要根据实际消耗等级数计算圣物数量，而不是默认升级满
      // if (0 < a.max && 1 == artifact_statuses[a.id]) { // if it's maxable and they own it
      //   var cost_to_max = a.tcoef * Math.pow(a.max, a.texpo);
      //   totalArtifactsPurchaseCost += cost_to_max; // add the cost to max it
      // }
      return {
        ...i,
        weffect,
        wcost,
      };
    });
    relics2Spread -= totalArtifactsPurchaseCost;
    if (relics2Spread < 0) {
      tips({
        content:
          '神器升级生成失败，请核对你的总圣物数和已拥有的神器，当前总圣物无法支撑当前拥有的神器数。',
      });
      return;
    }
    let leftoverRelics = relics2Spread * 1;
    adjustArtifactsArr = adjustArtifactsArr.map((i) => {
      const adjustArtifactsItem = artifactsList.find(
        (item) => item.id === i.id
      );
      const { tcoef, texpo } = adjustArtifactsItem;
      let costpct = i.wcost / runningWcost;
      let calcrelic;
      let disppct;
      if (i.id === 'Artifact22') {
        // 红书优先级最高，最先计算
        if (bosunit === '%') {
          calcrelic = relics2Spread * calcBospct;
          costpct = calcBospct;
        } else {
          calcrelic = tcoef * Math.pow(calcBospct, texpo);
        }
        disppct = calcrelic / relics2Spread; // repurpose this for display purposes
        leftoverRelics -= calcrelic;
      } else {
        calcrelic = leftoverRelics * costpct;
        disppct = calcrelic / relics2Spread; // repurpose this for display purposes
      }
      const calclevel = Math.pow(calcrelic / tcoef, 1 / texpo);
      return {
        ...i,
        costpct,
        calcrelic,
        disppct,
        calclevel,
      };
    });
    this.setState({
      dataSource: adjustArtifactsArr,
      orderBy: 'artifact',
      order: 'desc',
    });
  }

  beforeCalc() {
    const {
      form: { validateFields },
    } = this.props;
    validateFields((err, values) => {
      if (err) {
        tips({ content: err[0].errorMsg });
        return;
      }
      const { artifactsStateList } = this.state;
      this.adjustArtifacts(values, artifactsStateList);

      this.setState({
        tabIndex: 1,
      });
    });
  }

  handleArtifactChange(id, name) {
    let { artifactsStateList } = this.state;
    artifactsStateList = artifactsStateList.map((i) => {
      if (i.id === id) {
        return {
          ...i,
          [name]: !i[name],
        };
      }
      return i;
    });
    this.setState({ artifactsStateList }, this.storeData);
  }

  allArtifact() {
    const { artifactsStateList } = this.state;
    const temp = artifactsStateList.map((i) => ({
      ...i,
      checked: true,
    }));
    this.setState({ artifactsStateList: temp }, this.storeData);
  }

  allEnchant() {
    const { artifactsStateList } = this.state;
    const temp = artifactsStateList.map((i) => ({
      ...i,
      enchantFlag: true,
    }));
    this.setState({ artifactsStateList: temp }, this.storeData);
  }

  handleSort(name) {
    const { orderBy, order, dataSource, artifactsList } = this.state;
    let positive = 'desc'; // 正序
    if (orderBy === name) {
      positive = order === 'desc' ? 'asc' : 'desc';
    }
    dataSource.sort((j, k) => {
      let prev;
      let next;
      switch (name) {
        case 'artifact':
          prev = artifactsList.findIndex((i) => i.id === j.id);
          next = artifactsList.findIndex((i) => i.id === k.id);
          break;
        case 'level':
          prev = j.calclevel;
          next = k.calclevel;
          break;
        case 'percent':
          prev = j.disppct;
          next = k.disppct;
          break;
        default:
      }
      const delta = prev - next;
      return positive === 'desc' ? delta : -delta;
    });
    this.setState({ dataSource, orderBy: name, order: positive });
  }

  render() {
    const {
      form,
      form: { getFieldValue },
    } = this.props;
    const {
      loading,
      themeType,
      tabIndex,
      formList,
      artifactsList,
      artifactsStateList,
      dataSource,
      orderBy,
      order,
    } = this.state;

    const notation = tabIndex === 1 ? getFieldValue('notation') : 0;

    const columns = [
      {
        id: 'artifact',
        title: '神器',
      },
      {
        id: 'level',
        title: '等级',
      },
      {
        id: 'percent',
        title: '百分比',
      },
    ];

    if (loading) {
      return (
        <div className={styles.loading}>
          <MyBackdrop open={loading}>
            <CircularProgress color="inherit" />
          </MyBackdrop>
        </div>
      );
    }

    const renderDataSource = dataSource.map((i) => {
      const icon = require(`../icons/artifacts/${i.icon}`);
      const renderStyle = (i) => {
        const isMaxable = i.max > 0;
        const isMatchBuild =
          i.type === 'gold'
            ? i.reductions[getFieldValue('gold')] === 0
            : i.reductions[getFieldValue('build')] === 0;
        if (i.id === 'Artifact22') {
          return styles.damage;
        }
        if (isMaxable) {
          return styles.disabled;
        }
        if (isMatchBuild) {
          return styles.disabled;
        }
        return i.type === 'gold' ? styles.gold : styles.damage;
      };
      return {
        id: i.id,
        artifact: (
          <>
            <img src={icon} alt={i.id} className={styles.tableIcon} />
            <span
              style={{ fontSize: getFontSize(i.name) }}
              className={`${styles.tableName} ${renderStyle(i)}`}
            >
              {i.name}
            </span>
          </>
        ),
        level: displayTruncated(i.calclevel, notation),
        percent: (
          <div
            className={`${styles.tablePercent} ${
              i.type === 'gold' ? styles.gold : styles.damage
            }`}
            style={{ width: `${(i.disppct * 100).toFixed(6)}%` }}
          >
            {(i.disppct * 100).toFixed(6)}%
          </div>
        ),
      };
    });
    return (
      <div className={`${styles.container} ${styles[themeType]}`}>
        <div className={styles.header}>
          <div className={styles.tab}>
            <Button
              className={styles.tabBtn}
              variant={tabIndex === 0 ? 'contained' : 'outlined'}
              color="primary"
              onClick={() => this.tabChange(0)}
            >
              配置（优先填写）
            </Button>
            <Button
              className={styles.tabBtn}
              variant={tabIndex === 1 ? 'contained' : 'outlined'}
              color="primary"
              onClick={() => this.tabChange(1)}
            >
              神器升级
            </Button>
            <Button
              className={styles.tabBtn}
              variant={tabIndex === 2 ? 'contained' : 'outlined'}
              color="primary"
              onClick={() => this.tabChange(2)}
            >
              技能树
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
            {formList.map((i) => (
              <Grid key={i.name} item xs={12} sm={4}>
                <Input {...i} form={form} handleChange={this.storeData} />
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
            {artifactsList.map((i) => (
              <ArtifactItem key={i.name} item xs={12} md={3} sm={6}>
                <Artifact
                  id={i.id}
                  name={i.name}
                  enchant={i.enchant}
                  icon={i.icon}
                  checked={
                    artifactsStateList.find((item) => item.id === i.id).checked
                  }
                  enchantFlag={
                    artifactsStateList.find((item) => item.id === i.id)
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
          <p>
            个人使用建议：选择<strong className={styles.bold}> 1% </strong>
            为单位，从上到下，按照建议列表升级神器，数值差不多就行，不用特别精细。这样升级可以节省大量的时间，而且太精细的升级不见得会带来更好的提升。
          </p>
          <Table
            dataSource={renderDataSource}
            columns={columns}
            handleSort={this.handleSort}
            orderBy={orderBy}
            order={order}
          />
        </div>
        <div
          className={`${styles.tabItem} ${tabIndex === 2 ? styles.show : ''} ${
            styles.skillTree
          }`}
        >
          <SkillTree />
        </div>

        {/* <div className={styles.foot}>* HAVE FUN *</div> */}
      </div>
    );
  }
}

export default createForm()(App);
