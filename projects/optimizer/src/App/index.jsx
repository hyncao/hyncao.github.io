import React from 'react';
import createForm from '../my-form';
import { withStyles } from '@material-ui/core/styles';
import { Grid, Button, Backdrop, CircularProgress } from '@material-ui/core';
import { delay, getLS, setLS, tips, getFontSize } from '../utils';
import { Input, Artifact, Table } from '../Components';
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
      calcLoading: false,
      tabIndex: 0,
      fieldsValue: {},
      artifactsList: Object.values(config.db.artifacts),
      artifactsStateList: [],
      dataSource: [],
      orderBy: 'artifact',
      order: 'asc'
    };

    this.storeData = this.storeData.bind(this);
    this.tabChange = this.tabChange.bind(this);
    this.calc = this.calc.bind(this);
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
    const artifactsStateList = artifactsList.map(i => ({
      id: i.id,
      checked: false,
      enchantFlag: false
    }));
    // TODO 是否显示动画，显示则打开并且添加动画时间
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
    if (tabIndex === 1) {
      this.calc();
      return;
    }
    this.setState({ tabIndex });
  }

  adjustArtifacts() {
    var hero_value = 0;
    var minimum_effect = 999999999;
    $.each(db.artifacts, function(k, a) {
      a.reductions = JSON.parse(JSON.stringify(a.reductions_orig));
      if (0 < a.inactive_adj && true == active) {
        if ('gold' == a.type) {
          a.reductions[gold] -= a.inactive_adj;
        } else {
          a.reductions[build] -= a.inactive_adj;
        }
      }
      if ('Artifact35' == a.id) {
        // if this is the all hero artifact, snapshot the hero value; NOTE: this relies on that artifact coming before all the other hero artifacts
        hero_value = a.reductions[build];
      }
      if ('Artifact77' == a.id || 'Artifact47' == a.id) {
        // if this is Titania's Sceptre or the Horn
        if ('fairy' == gold || 'phom' == gold) {
          // and this is a fairy or pHoM build, take out the .4 gold power
          a.reductions.cs -= db.gold_hom_adj;
          a.reductions.sc -= db.gold_hom_adj;
          a.reductions.pet -= db.gold_hom_adj;
          a.reductions.hs -= db.gold_hom_adj;
          a.reductions.hscs -= db.gold_hom_adj;
          a.reductions.hssc -= db.gold_hom_adj;
        }
      }
      if ('hero' == a.type) {
        switch (a.id) {
          case 'Artifact32':
          case 'Artifact86':
            if (false == hero_type.includes('melee')) {
              a.reductions.cs -= hero_value;
              a.reductions.sc -= hero_value;
              a.reductions.pet -= hero_value;
              a.reductions.hs -= hero_value;
              a.reductions.hscs -= hero_value;
              a.reductions.hssc -= hero_value;
            }
            break;
          case 'Artifact33':
          case 'Artifact90':
            if (false == hero_type.includes('ranged')) {
              a.reductions.cs -= hero_value;
              a.reductions.sc -= hero_value;
              a.reductions.pet -= hero_value;
              a.reductions.hs -= hero_value;
              a.reductions.hscs -= hero_value;
              a.reductions.hssc -= hero_value;
            }
            break;
          case 'Artifact34':
          case 'Artifact89':
            if (false == hero_type.includes('spell')) {
              a.reductions.cs -= hero_value;
              a.reductions.sc -= hero_value;
              a.reductions.pet -= hero_value;
              a.reductions.hs -= hero_value;
              a.reductions.hscs -= hero_value;
              a.reductions.hssc -= hero_value;
            }
            break;
          case 'Artifact61':
          case 'Artifact88':
            if (false == hero_type.includes('ground')) {
              a.reductions.cs -= hero_value;
              a.reductions.sc -= hero_value;
              a.reductions.pet -= hero_value;
              a.reductions.hs -= hero_value;
              a.reductions.hscs -= hero_value;
              a.reductions.hssc -= hero_value;
            }
            break;
          case 'Artifact62':
          case 'Artifact87':
            if (false == hero_type.includes('flying')) {
              a.reductions.cs -= hero_value;
              a.reductions.sc -= hero_value;
              a.reductions.pet -= hero_value;
              a.reductions.hs -= hero_value;
              a.reductions.hscs -= hero_value;
              a.reductions.hssc -= hero_value;
            }
            break;
        }
      }
      minimum_effect = Math.min(minimum_effect, a.effect); // update the minimum_effect if appropriate
    });
    minimum_effect = 1 - minimum_effect;
    var running_wcost = 0;
    var total_artifacts_owned = 0;
    $.each(artifact_statuses, function(k, s) {
      total_artifacts_owned += s;
    });
    $('#owned_count').html(total_artifacts_owned);
    var total_artifacts_purchase_cost = 0;
    var relics_to_spread = ltr;
    $.each(db.artifact_costs, function(k, c) {
      if (parseInt(k) <= total_artifacts_owned) {
        total_artifacts_purchase_cost += c;
      }
    });
    $.each(db.artifacts, function(k, a) {
      // unfortunately we have to loop through again to do the final calcs
      var currentEffect = a.effect;
      a.weffect = Math.pow(
        (currentEffect + minimum_effect) / minimum_effect,
        1 / 3
      );
      a.wcost =
        ((a.weffect *
          a.gpeak *
          ('gold' == a.type ? a.reductions[gold] : a.reductions[build])) /
          a.texpo +
          a.adcalc) *
        (0 < a.max
          ? 0
          : artifact_statuses[a.id] == '2'
          ? 1
          : artifact_statuses[a.id]);
      running_wcost += a.wcost;
      // TODO 对有上限神器，需要根据实际消耗等级数计算圣物数量，而不是默认升级满
      // if (0 < a.max && 1 == artifact_statuses[a.id]) { // if it's maxable and they own it
      //   var cost_to_max = a.tcoef * Math.pow(a.max, a.texpo);
      //   total_artifacts_purchase_cost += cost_to_max; // add the cost to max it

      // }
    });
    relics_to_spread -= total_artifacts_purchase_cost;
    if (relics_to_spread < 0) {
      alert(
        '神器升级生成失败，请核对你的总圣物数和已拥有的神器，当前总圣物无法支撑当前拥有的神器数'
      );
    }
    var leftover_relics = relics_to_spread * ('pct' == unit ? 0.97 : 1);
    $.each(db.artifacts, function(k, a) {
      // and a third loop to get the running totals
      a.costpct = a.wcost / running_wcost;
      if ('Artifact22' == a.id) {
        // Note: this relies on BoS being first in the list
        if (0 !== artifact_statuses[a.id]) {
          if ('pct' == bosunit) {
            a.calcrelic = relics_to_spread * bospct;
            a.costpct = bospct;
          } else {
            a.calcrelic = a.tcoef * Math.pow(bospct, a.texpo);
          }
          a.disppct = a.calcrelic / relics_to_spread; // repurpose this for display purposes
          leftover_relics -= a.calcrelic;
        } else {
          a.disppct = 0;
        }
      } else {
        a.calcrelic = leftover_relics * a.costpct;
        a.disppct = a.calcrelic / relics_to_spread; // repurpose this for display purposes
      }
      a.calclevel = Math.pow(a.calcrelic / a.tcoef, 1 / a.texpo);
    });
    insertArtifacts();
    updateArtifactSpread();
    // adjustSkills();
  }

  calc() {
    const {
      form: { validateFields }
    } = this.props;
    validateFields((err, values) => {
      if (err) {
        tips({ content: err[0].errorMsg });
        return;
      }

      // 设置初始化table数据
      const { artifactsList } = this.state;
      const dataSource = artifactsList.map(i => {
        const icon = require(`../icons/${i.icon}`);
        return {
          id: i.id,
          artifact: (
            <>
              <img src={icon} alt={i.id} className={styles.tableIcon} />
              <span
                style={{ fontSize: getFontSize(i.name) }}
                className={`${styles.tableName} ${
                  i.type === 'gold' ? styles.gold : styles.damage
                }`}
              >
                {i.name}
              </span>
            </>
          ),
          level: '2.22e11',
          percent: (
            <div
              className={`${styles.tablePercent} ${
                i.type === 'gold' ? styles.gold : styles.damage
              }`}
              style={{ width: '5%' }}
            >
              5%
            </div>
          )
        };
      });

      this.setState({
        calcLoading: true,
        tabIndex: 1,
        dataSource,
        orderBy: 'artifact',
        order: 'asc'
      });
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

  handleSort(name) {
    console.log(name);
  }

  render() {
    const { form } = this.props;
    const {
      loading,
      calcLoading,
      themeType,
      tabIndex,
      fieldsValue,
      artifactsList,
      artifactsStateList,
      dataSource,
      orderBy,
      order
    } = this.state;

    const columns = [
      {
        id: 'artifact',
        title: '神器'
      },
      {
        id: 'level',
        title: '等级'
      },
      {
        id: 'percent',
        title: '百分比'
      }
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
          {calcLoading && (
            <div className={styles.calcLoading}>
              <CircularProgress color="primary" />
            </div>
          )}
          <p>
            个人使用建议：选择<strong className={styles.bold}> 1% </strong>
            为单位，从上到下，按照建议列表升级神器，数值差不多就行，不用特别精细。这样升级可以节省大量的时间，而且太精细的升级不见得会带来更好的提升。
          </p>
          <Table
            dataSource={dataSource}
            columns={columns}
            handleSort={this.handleSort}
            orderBy={orderBy}
            order={order}
          />
        </div>

        {/* <div className={styles.foot}>* HAVE FUN *</div> */}
      </div>
    );
  }
}

export default createForm()(App);
