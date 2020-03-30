var ltr = 0;
var sp = 0;
var build = '';
var hero = '';
var hero_type = '';
var gold = '';
var active = true;
var notation = true;
var greed = false;
var bospct = 0.00;
var bosunit = 'pct';
var artifact_statuses = {};
var allprob = 0.00;
var crit = 0.00;
var cleaving = 0;
var chesterson = 0.00;
var spoils = 0;
var crafting = 0;
var warcry = 0;
var clone = 0;
var taps = 0;
var patience = 0;
var equipment_statuses = {};
var ip = 0;
var mi = 0;
var ms = 0;
var sp_spent = 0;
var sp_next = '';
var sp_trees = {
  'BranchRed': 0,
  'BranchYellow': 0,
  'BranchBlue': 0,
  'BranchGreen': 0
}
var artifacts_ad = false;
var sp_ad = false;
var changelog_ad = false;
var unit = 'pct';

$(function () {
  /**/ // if I'm not testing new data, just load the cached data
  initClipboard();
  initData();
  loadValues();
  /**/
});

// init clipboard
function initClipboard() {
  $('#exportData').on('click', function () {
    var data = exportOptions();
    $(this).attr('data-clipboard-text', data);
    $('#dataTextarea').val(data);
  })
  $('#importData').on('click', function () {
    var data = $('#dataTextarea').val();
    if (data) {
      if (confirm('导入数据将会覆盖原有数据，且本操作无法撤回，确认导入吗？')) {
        importOptions(data);
      }
    }
  })
  var clipboard = new ClipboardJS('#exportData');
  clipboard.on('success', function (e) {
    alert('复制成功，数据已经在剪贴板中，可直接黏贴');
  });
  clipboard.on('error', function (e) {
    alert('无法直接复制到剪贴板，请手动复制');
    console.log(e);
  });
}

// init data for selects
function initData() {
  initLtr_factor();
  initBosunit();
  initHero();
  initSelect25();
  initMS();
}

// init ltr_factor select
function initLtr_factor() {
  var arr = [
    ['e0', ''],
    ['e3', 'K'],
    ['e6', 'M'],
    ['e9', 'B'],
    ['e12', 'T'],
    ['e15', 'e15/aa'],
  ]
  var dom = [];
  for (var i = 0; i < 190; i++) {
    var val = 'e' + (16 + i);
    arr.push([val, val]);
  }
  $.each(arr, function (k, i) {
    dom.push('<option value="' + i[0] + '">' + i[1] + '</option>');
  })
  $('#ltr_factor').html(dom.join(''));
}

// init bosunit select
function initBosunit() {
  var arr = [
    ['pct', '%'],
    ['e0', '(&lt; 1000)'],
    ['e3', 'K'],
    ['e6', 'M'],
    ['e9', 'B'],
    ['e12', 'T'],
    ['e15', 'e15/aa'],
  ]
  var dom = [];
  for (var i = 1; i < 50; i++) {
    var val = 'e' + (15 + i);
    arr.push([val, val]);
  }
  $.each(arr, function (k, i) {
    dom.push('<option value="' + i[0] + '">' + i[1] + '</option>');
  })
  $('#bosunit').html(dom.join(''));
}

// init heroes select
function initHero() {
  var dom = [];
  $.each(db.heroes, function (k, i) {
    dom.push('<option value="' + i.en + '">' + i.cn + '</option>');
  })
  $('#hero').html(dom.join(''));
}

// init 0-25 select
function initSelect25() {
  var dom = [];
  for (var i = 0; i < 26; i++) {
    dom.push('<option value="' + i + '">' + i + '</option>');
  }
  $('#cleaving, #spoils, #warcry, #clone').html(dom.join(''));
}

// init max stage select
function initMS() {
  var dom = [];
  for (var i = 500; i <= db.maxStage; i += 500) {
    var text = 1 + i - 500 + '-' + i;
    dom.push('<option value="' + i + '">' + text + '</option>');
  }
  $('#ms').html(dom.join(''));
}

function insertArtifacts() { // drop the artifacts into the options tab to mark which you own
  var arts = '';
  $.each(db.artifacts, function (k, a) {
    arts += '<div class="form-group col-12 col-md-6 col-lg-4">';
    arts += '<label for="' + a.id + '" class="' + determineColor(a, true) + '">';
    arts += '<label class="switch">';
    arts += '<input class="artcheck ' + determineColor(a, false) + '" type="checkbox" id="' + a.id + '" ' + (undefined !== artifact_statuses[a.id] && 0 !== artifact_statuses[a.id] ? 'checked="checked"' : '') + ' onchange="storeValues();">';
    arts += '<span class="slider round"></span>';
    arts += '</label>';
    arts += '<img src="' + a.icon + '" height="21px;" alt="' + a.name + '" class="mr-2" />';
    arts += a.name + '</label>';
    if (a.fumoef) {
      arts += '<label class="fumo"><input type="checkbox" onchange="storeValues();" ' + (artifact_statuses[a.id] === 2 ? 'checked' : '') + ' /> <span>附魔</span></label>';
    }
    arts += '</div>';
  })
  $('#artifacts_catalog').empty().html(arts);
}

function determineColor(item, text) {
  if ('Artifact22' == item.id) {
    return (true == text ? build : build + 'bg');
  }
  if ('Artifact88' == item.id || 'Artifact40' == item.id || 'Artifact47' == item.id) {
    return (true == text ? build + 'gold' : build + 'goldbg');
  }
  if ('Artifact78' == item.id && 0 == active) {
    return (true == text ? build + 'gold' : build + 'goldbg');
  }
  if (undefined != item.max && 0 < item.max) {
    return (true == text ? 'text-light' : 'maxbg text-dark');
  }
  if ('gold' == item.type && 0 < item.reductions[gold]) {
    return (true == text ? 'text-success' : 'bg-success');
  }
  if ('gold' != item.type && 0 < item.reductions[build]) {
    return (true == text ? build : build + 'bg');
  }
  return (true == text ? 'text-secondary' : 'bg-secondary')
}

function adjustArtifacts() {
  var hero_value = 0;
  var minimum_effect = 999999999;
  var counter = 0;
  $.each(db.artifacts, function (k, a) {
    counter++;
    a.reductions = JSON.parse(JSON.stringify(a.reductions_orig));
    if (0 < a.inactive_adj && true == active) {
      if ('gold' == a.type) {
        a.reductions[gold] -= a.inactive_adj;
      } else {
        a.reductions[build] -= a.inactive_adj;
      }
    }
    if ('Artifact35' == a.id) { // if this is the all hero artifact, snapshot the hero value; NOTE: this relies on that artifact coming before all the other hero artifacts
      hero_value = a.reductions[build];
    }
    if ('Artifact77' == a.id || 'Artifact47' == a.id) { // if this is Titania's Sceptre or the Horn
      if ('fairy' == gold || 'phom' == gold) { // and this is a fairy or pHoM build, take out the .4 gold power
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
        case 'Artifact32': // The Sword of Storms
        case 'Artifact86': // The Sword of the Royals
          if (false == hero_type.includes('melee')) {
            a.reductions.cs -= hero_value;
            a.reductions.sc -= hero_value;
            a.reductions.pet -= hero_value;
            a.reductions.hs -= hero_value;
            a.reductions.hscs -= hero_value;
            a.reductions.hssc -= hero_value;
          }
          break;
        case 'Artifact33': // Fairie's Bow
        case 'Artifact90': // Foliage of the Keeper
          if (false == hero_type.includes('ranged')) {
            a.reductions.cs -= hero_value;
            a.reductions.sc -= hero_value;
            a.reductions.pet -= hero_value;
            a.reductions.hs -= hero_value;
            a.reductions.hscs -= hero_value;
            a.reductions.hssc -= hero_value;
          }
          break;
        case 'Artifact34': // Charm of the Ancients
        case 'Artifact89': // Sigils of Judgement
          if (false == hero_type.includes('spell')) {
            a.reductions.cs -= hero_value;
            a.reductions.sc -= hero_value;
            a.reductions.pet -= hero_value;
            a.reductions.hs -= hero_value;
            a.reductions.hscs -= hero_value;
            a.reductions.hssc -= hero_value;
          }
          break;
        case 'Artifact61': // Tiny Titan Tree
        case 'Artifact88': // The Cobalt Plate
          if (false == hero_type.includes('ground')) {
            a.reductions.cs -= hero_value;
            a.reductions.sc -= hero_value;
            a.reductions.pet -= hero_value;
            a.reductions.hs -= hero_value;
            a.reductions.hscs -= hero_value;
            a.reductions.hssc -= hero_value;
          }
          break;
        case 'Artifact62': // Helm of Hermes
        case 'Artifact87': // Spearit's Vigil
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
  $.each(artifact_statuses, function (k, s) {
    total_artifacts_owned += s;
  });
  $('#owned_count').html(total_artifacts_owned);
  $('#total_count').html(counter);
  var total_artifacts_purchase_cost = 0;
  var relics_to_spread = ltr;
  $.each(db.artifact_costs, function (k, c) {
    if (parseInt(k) <= total_artifacts_owned) {
      total_artifacts_purchase_cost += c;
    }
  });
  $.each(db.artifacts, function (k, a) { // unfortunately we have to loop through again to do the final calcs
    var currentEffect = a.effect;
    a.weffect = Math.pow((currentEffect + minimum_effect) / minimum_effect, 1 / 3);
    a.wcost = (a.weffect * a.gpeak * ('gold' == a.type ? a.reductions[gold] : a.reductions[build]) / a.texpo + a.adcalc) * (0 < a.max ? 0 : (artifact_statuses[a.id] == '2' ? 1 : artifact_statuses[a.id]));
    running_wcost += a.wcost;
    // TODO 对有上限神器，需要根据实际消耗等级数计算圣物数量，而不是默认升级满
    // if (0 < a.max && 1 == artifact_statuses[a.id]) { // if it's maxable and they own it
    //   var cost_to_max = a.tcoef * Math.pow(a.max, a.texpo);
    //   total_artifacts_purchase_cost += cost_to_max; // add the cost to max it

    // }
  });
  relics_to_spread -= total_artifacts_purchase_cost;
  if (relics_to_spread < 0) {
    alert('神器升级生成失败，请核对你的总圣物数和已拥有的神器，当前总圣物无法支撑当前拥有的神器数');
  }
  var leftover_relics = relics_to_spread * ('pct' == unit ? .97 : 1);
  $.each(db.artifacts, function (k, a) { // and a third loop to get the running totals
    a.costpct = a.wcost / running_wcost;
    if ('Artifact22' == a.id) { // Note: this relies on BoS being first in the list
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

function adjustSkills() {
  $.each(db.skills, function (k, s) {
    s.reductions = JSON.parse(JSON.stringify(s.reductions_orig));
    if (0 < s.inactive_adj && true == active) {
      if ('gold' == s.type) {
        s.reductions[gold] -= s.inactive_adj;
      } else {
        s.reductions[build] -= s.inactive_adj;
      }
    }
    if (false == active) { // if this is an offline build boost the relevant T3 rogue skill
      switch (s.id) {
        case 'PetOfflineDmg':
          s.reductions.pet += 1;
          break;
        case 'InactiveClanShip':
          s.reductions.cs += 1;
          break;
        case 'OfflineCloneDmg':
          s.reductions.sc += 1;
          break;
      }
    }
    s.level = 0;
    sp_spent = 0;
    sp_trees = {
      'BranchRed': 0,
      'BranchYellow': 0,
      'BranchBlue': 0,
      'BranchGreen': 0
    }
    s.efficiency = 0.00;
  });
  buildSkillTree();
}

function buildSkillTree() {
  var efficiencies = [];
  sp_next = '';
  $.each(db.skills, function (k, s) {
    s.efficiency = determineSkillEfficiency(s);
    efficiencies.push({
      'key': k,
      'name': s.name,
      'efficiency': s.efficiency,
      'branch': s.branch,
      'spreq': s.sp_req,
      'preq': s.skill_req,
      'cost': (s.level < s.max ? s.costs[s.level + 1] : -1)
    });
    //    console.log(s.name, s.efficiency); // NOTE: USEFUL FOR SANITY CHECKING NEW PATCHES
  });
  loop1:
    while (sp_spent <= sp) {
      efficiencies.sort(sortEfficiencies); // sort with winner on top
      var blocks = { // reset block tracker
        'BranchRed': 0,
        'BranchYellow': 0,
        'BranchBlue': 0,
        'BranchGreen': 0
      }
      var sp_left = sp - sp_spent; // determine SP left to spend
      loop2:
        for (var i = 0; i < efficiencies.length; i++) { // loop through the winners
          var winner = efficiencies[i]; // shortcut for the winner
          var broke = false;
          var next = {};
          if (sp_trees[winner.branch] >= winner.spreq) { // if we've unlocked enough points in the tree
            if (-1 == winner.preq || 0 < db.skills[winner.preq].level) { // if there is either no preq or it is already unlocked
              var titans = Math.floor(Math.max(8 + (ms / 500) * 2 - ip, 1)); // number of titans at their ms
              if ('Dimensional Shift' == winner.name && 1 == db.skills[winner.key].level) { // if this is DS and it has 1 level check for QoL force
                if ('sc' == build) { // if this is an SC build
                  var snap_titans = Math.floor(titans / 2); // with snap active
                  if (2222 <= sp) { // if they have ungodly amounts of SP don't worry about snap; calculate for full count
                    snap_titans = titans;
                  }
                  if (1 == equipment_statuses.ruthless && 1 == artifact_statuses['Artifact74']) { // if they have RN and the snap artifact
                    loop3: for (var j = 1; j < 26; j++) {
                      var e = db.skills[db.skill_lookup['CloneSkillBoost']].effects.secondary[j] + mi;
                      if (e * (1 == equipment_statuses['platinum'] ? (1.1 * Math.pow(1.001, crafting - 1)) : 1) >= snap_titans || 25 == j) { // once the one that is as good as snap titans is found
                        if (db.skills[db.skill_lookup['CloneSkillBoost']].level < j) { // check if ED is already at that level and if not
                          if (sp_left >= db.skills[db.skill_lookup['CloneSkillBoost']].costs[db.skills[db.skill_lookup['CloneSkillBoost']].level + 1]) {
                            efficiencies = declareWinner(db.skill_lookup['CloneSkillBoost'], db.skills[db.skill_lookup['CloneSkillBoost']], efficiencies); // level it until it is
                            break loop2;
                          } else {
                            broke = true;
                            next = {
                              'name': db.skills[db.skill_lookup['CloneSkillBoost']].name,
                              'cost': db.skills[db.skill_lookup['CloneSkillBoost']].costs[db.skills[db.skill_lookup['CloneSkillBoost']].level + 1]
                            }
                          }
                        } else {
                          break loop3;
                        }
                      }
                    }
                  }
                  else if (100 <= titans && 1 == equipment_statuses.angelic) { // if they don't have RN but they have 100+ titans and the AG set
                    var j = 9; // force ED of 9 to be better than Ambush 10
                    if (db.skills[db.skill_lookup['CloneSkillBoost']].level < j) { // check if ED is already at that level and if not
                      if (sp_left >= db.skills[db.skill_lookup['CloneSkillBoost']].costs[db.skills[db.skill_lookup['CloneSkillBoost']].level + 1]) {
                        efficiencies = declareWinner(db.skill_lookup['CloneSkillBoost'], db.skills[db.skill_lookup['CloneSkillBoost']], efficiencies); // level it until it is
                        break loop2;
                      } else {
                        broke = true;
                        next = {
                          'name': db.skills[db.skill_lookup['CloneSkillBoost']].name,
                          'cost': db.skills[db.skill_lookup['CloneSkillBoost']].costs[db.skills[db.skill_lookup['CloneSkillBoost']].level + 1],
                          'name2': ''
                        }
                      }
                    }
                  } else { // otherwise just max out Ambush
                    var j = db.skills[db.skill_lookup['MultiMonsters']].max;
                    if (db.skills[db.skill_lookup['MultiMonsters']].level < j) { // check if ED is already at that level and if not
                      if (sp_left >= db.skills[db.skill_lookup['MultiMonsters']].costs[db.skills[db.skill_lookup['MultiMonsters']].level + 1]) {
                        efficiencies = declareWinner(db.skill_lookup['MultiMonsters'], db.skills[db.skill_lookup['MultiMonsters']], efficiencies); // level it until it is
                        break loop2;
                      } else {
                        broke = true;
                        next = {
                          'name': db.skills[db.skill_lookup['MultiMonsters']].name,
                          'cost': db.skills[db.skill_lookup['MultiMonsters']].costs[db.skills[db.skill_lookup['MultiMonsters']].level + 1],
                          'name2': ''
                        }
                      }
                    }
                  }
                } else if (true == build.includes('hs')) { // if this is an HS build do the same
                  loop3: for (var j = 1; j < 26; j++) {
                    var e = db.skills[db.skill_lookup['BurstSkillBoost']].effects.secondary[j] + mi;
                    if ((e * (1.1 * Math.pow(1.001, crafting - 1))) >= titans || 25 == j) { // once the one that is as good as snap titans is found
                      if (db.skills[db.skill_lookup['BurstSkillBoost']].level < j) { // check if ED is already at that level and if not
                        if (sp_left >= db.skills[db.skill_lookup['BurstSkillBoost']].costs[db.skills[db.skill_lookup['BurstSkillBoost']].level + 1]) {
                          efficiencies = declareWinner(db.skill_lookup['BurstSkillBoost'], db.skills[db.skill_lookup['BurstSkillBoost']], efficiencies); // level it until it is
                          break loop2;
                        } else {
                          broke = true;
                          next = {
                            'name': db.skills[db.skill_lookup['BurstSkillBoost']].name,
                            'cost': db.skills[db.skill_lookup['BurstSkillBoost']].costs[db.skills[db.skill_lookup['BurstSkillBoost']].level + 1],
                            'name2': ''
                          }
                        }
                      } else {
                        break loop3;
                      }
                    }
                  }
                }
              }
              if (sp_left >= winner.cost) {
                efficiencies = declareWinner(winner.key, db.skills[winner.key], efficiencies);
                break loop2;
              } else {
                broke = true;
                next = {
                  'name': winner.name,
                  'cost': winner.cost,
                  'name2': ''
                }
              }
            } else { // they need a prereq to keep going
              preq_winner = determinePreq(winner.preq, efficiencies);
              if (sp_left >= db.skills[preq_winner].costs[db.skills[preq_winner].level + 1]) {
                efficiencies = declareWinner(preq_winner, db.skills[preq_winner], efficiencies); // level the prereq
                break loop2;
              } else {
                broke = true;
                next = {
                  'name': db.skills[preq_winner].name,
                  'cost': db.skills[preq_winner].costs[db.skills[preq_winner].level + 1],
                  'name2': winner.name
                }
              }
            }
          } else { // if it is blocked by tier unlocks
            if (3 == winner.spreq && ('BranchBlue' != winner.branch || 'sc' == build || 'phom' != gold)) { // if this is a tier 2 skill that needs tier 1 opened up, open it up unless this is blue
              if (sp_left >= db.skills[winner.preq].costs[db.skills[winner.preq].level + 1]) {
                efficiencies = declareWinner(winner.preq, db.skills[winner.preq], efficiencies); // level the prereq
                break loop2;
              } else {
                broke = true;
                next = {
                  'name': db.skills[winner.preq].name,
                  'cost': db.skills[winner.preq].costs[db.skills[winner.preq].level + 1],
                  'name2': winner.name
                }
              }
            } else {
              blocks[winner.branch] += 1; // update the block tracker
              switch (winner.branch) { // check if the branch is TOO blocked (count varies by branch); if it isn't, move on to the next winner
                case 'BranchGreen':
                  if (2 > blocks[winner.branch] && 500 > sp) {
                    continue;
                  }
                  break;
                case 'BranchRed':
                case 'BranchYellow':
                  if (3 > blocks[winner.branch] && 1000 > sp) {
                    continue;
                  }
                  break;
                case 'BranchBlue':
                  if (4 > blocks[winner.branch] && 1500 > sp) {
                    continue;
                  }
                  break;
              }
              switch (winner.branch) { // check if the start of each tree is open
                case 'BranchGreen':
                  if (1 >= db.skills[db.skill_lookup['OfflineGold']].level) {
                    if (sp_left >= db.skills[db.skill_lookup['OfflineGold']].costs[db.skills[db.skill_lookup['OfflineGold']].level + 1]) {
                      efficiencies = declareWinner(db.skill_lookup['OfflineGold'], db.skills[db.skill_lookup['OfflineGold']], efficiencies); // level it until it is
                      break loop2;
                    } else {
                      broke = true;
                      next = {
                        'name': db.skills[db.skill_lookup['OfflineGold']].name,
                        'cost': db.skills[db.skill_lookup['OfflineGold']].costs[db.skills[db.skill_lookup['OfflineGold']].level + 1],
                        'name2': winner.name
                      }
                    }
                  }
                  break;
                case 'BranchRed':
                  if (1 >= db.skills[db.skill_lookup['TapDmg']].level) {
                    if (sp_left >= db.skills[db.skill_lookup['TapDmg']].costs[db.skills[db.skill_lookup['TapDmg']].level + 1]) {
                      efficiencies = declareWinner(db.skill_lookup['TapDmg'], db.skills[db.skill_lookup['TapDmg']], efficiencies); // level it until it is
                      break loop2;
                    } else {
                      broke = true;
                      next = {
                        'name': db.skills[db.skill_lookup['TapDmg']].name,
                        'cost': db.skills[db.skill_lookup['TapDmg']].costs[db.skills[db.skill_lookup['TapDmg']].level + 1],
                        'name2': winner.name
                      }
                    }
                  }
                  break;
                case 'BranchYellow':
                  if (1 >= db.skills[db.skill_lookup['AllHelperDmg']].level) {
                    if (sp_left >= db.skills[db.skill_lookup['AllHelperDmg']].costs[db.skills[db.skill_lookup['AllHelperDmg']].level + 1]) {
                      efficiencies = declareWinner(db.skill_lookup['AllHelperDmg'], db.skills[db.skill_lookup['AllHelperDmg']], efficiencies); // level it until it is
                      break loop2;
                    } else {
                      broke = true;
                      next = {
                        'name': db.skills[db.skill_lookup['AllHelperDmg']].name,
                        'cost': db.skills[db.skill_lookup['AllHelperDmg']].costs[db.skills[db.skill_lookup['AllHelperDmg']].level + 1],
                        'name2': winner.name
                      }
                    }
                  }
                  break;
                case 'BranchBlue':
                  if (1 >= db.skills[db.skill_lookup['MPCapacityBoost']].level) {
                    if (sp_left >= db.skills[db.skill_lookup['MPCapacityBoost']].costs[db.skills[db.skill_lookup['MPCapacityBoost']].level + 1]) {
                      efficiencies = declareWinner(db.skill_lookup['MPCapacityBoost'], db.skills[db.skill_lookup['MPCapacityBoost']], efficiencies); // level it until it is
                      break loop2;
                    } else {
                      broke = true;
                      next = {
                        'name': db.skills[db.skill_lookup['MPCapacityBoost']].name,
                        'cost': db.skills[db.skill_lookup['MPCapacityBoost']].costs[db.skills[db.skill_lookup['MPCapacityBoost']].level + 1],
                        'name2': winner.name
                      }
                    }
                  }
                  break;
              }
              var candidates = []; // track the candidates for breaking open the intended skill
              for (i++; i < efficiencies.length; i++) { // loop through the remaining winners looking for the next best skill in that tree
                if (winner.branch == efficiencies[i].branch && efficiencies[i].spreq <= sp_trees[winner.branch]) {
                  candidates.push(efficiencies[i]);
                }
              }
              if (candidates[0].efficiency == candidates[1].efficiency) {
                if (candidates[0].cost < candidates[1].cost) {
                  if (-1 == candidates[0].preq || 0 < db.skills[candidates[0].preq].level) { // if there is either no preq or it is already unlocked
                    if (sp_left >= db.skills[candidates[0].key].costs[db.skills[candidates[0].key].level + 1]) {
                      efficiencies = declareWinner(candidates[0].key, db.skills[candidates[0].key], efficiencies); // level it until it is
                      break loop2;
                    } else {
                      broke = true;
                      next = {
                        'name': db.skills[candidates[0].key].name,
                        'cost': db.skills[candidates[0].key].costs[db.skills[candidates[0].key].level + 1],
                        'name2': winner.name
                      }
                    }
                  } else {
                    preq_winner = determinePreq(candidates[0].key, efficiencies);
                    if (sp_left >= db.skills[preq_winner].costs[db.skills[preq_winner].level + 1]) {
                      efficiencies = declareWinner(preq_winner, db.skills[preq_winner], efficiencies); // level the prereq
                      break loop2;
                    } else {
                      broke = true;
                      next = {
                        'name': db.skills[preq_winner].name,
                        'cost': db.skills[preq_winner].costs[db.skills[preq_winner].level + 1],
                        'name2': db.skills[candidates[0].key].name
                      }
                    }
                  }
                } else {
                  if (-1 == candidates[1].preq || 0 < db.skills[candidates[1].preq].level) { // if there is either no preq or it is already unlocked
                    if (sp_left >= db.skills[candidates[1].key].costs[db.skills[candidates[1].key].level + 1]) {
                      efficiencies = declareWinner(candidates[1].key, db.skills[candidates[1].key], efficiencies); // level it until it is
                      break loop2;
                    } else {
                      broke = true;
                      next = {
                        'name': db.skills[candidates[1].key].name,
                        'cost': db.skills[candidates[1].key].costs[db.skills[candidates[1].key].level + 1],
                        'name2': winner.name
                      }
                    }
                  } else {
                    preq_winner = determinePreq(candidates[1].key, efficiencies);
                    if (sp_left >= db.skills[preq_winner].costs[db.skills[preq_winner].level + 1]) {
                      efficiencies = declareWinner(preq_winner, db.skills[preq_winner], efficiencies); // level the prereq
                      break loop2;
                    } else {
                      broke = true;
                      next = {
                        'name': db.skills[preq_winner].name,
                        'cost': db.skills[preq_winner].costs[db.skills[preq_winner].level + 1],
                        'name2': db.skills[candidates[1].key].name
                      }
                    }
                  }
                }
              } else {
                if (-1 == candidates[0].preq || 0 < db.skills[candidates[0].preq].level) { // if there is either no preq or it is already unlocked
                  if (sp_left >= db.skills[candidates[0].key].costs[db.skills[candidates[0].key].level + 1]) {
                    efficiencies = declareWinner(candidates[0].key, db.skills[candidates[0].key], efficiencies); // level it until it is
                    break loop2;
                  } else {
                    broke = true;
                    next = {
                      'name': db.skills[candidates[0].key].name,
                      'cost': db.skills[candidates[0].key].costs[db.skills[candidates[0].key].level + 1],
                      'name2': winner.name
                    }
                  }
                } else {
                  preq_winner = determinePreq(candidates[0].key, efficiencies);
                  if (sp_left >= db.skills[preq_winner].costs[db.skills[preq_winner].level + 1]) {
                    efficiencies = declareWinner(preq_winner, db.skills[preq_winner], efficiencies); // level the prereq
                    break loop2;
                  } else {
                    broke = true;
                    next = {
                      'name': db.skills[preq_winner].name,
                      'cost': db.skills[preq_winner].costs[db.skills[preq_winner].level + 1],
                      'name2': db.skills[candidates[0].key].name
                    }
                  }
                }
              }
            }
          }
          if (true == broke) {
            if (true == greed) {
              for (i++; i < efficiencies.length; i++) { // loop through the remaining winners looking for the next best skill that is already unlocked and not maxed
                if (0 < db.skills[efficiencies[i].key].level && db.skills[efficiencies[i].key].level != db.skills[efficiencies[i].key].max && sp_left >= db.skills[efficiencies[i].key].costs[db.skills[efficiencies[i].key].level + 1]) {
                  efficiencies = declareWinner(efficiencies[i].key, db.skills[efficiencies[i].key], efficiencies);
                  break loop2;
                }
              }
            } else {
              sp_next = next.name + ' (' + next.cost + ' SP)' + ('' != next.name2 ? ' 以解锁 ' + next.name2 : '');
            }
            break loop1;
          }
        }
    }
  updateSkillTree();
}

function checkEquality(a, b) {
  if (a.length !== b.length)
    return false;
  for (var i = 0; i < a.length; i++) {
    if (a[i] !== b[i]) {
      return false;
    }
  }
  return true;
}

function determinePreq(preq_id) {
  var preq = db.skills[preq_id]; // retrieve the preq
  if ('II' == preq.tier) { // if the preq is a Tier II skill, this is easy, just put a point in it
    return (preq_id);
  } else { // if the preq is a Tier III skill, need to check if the preq's preq is unlocked and unlock it first if not
    var prepreq = db.skills[preq.skill_req];
    if (0 < prepreq.level) { // preq's preq is already unlocked
      return (preq_id);
    } else { // unlock the preq's preq first
      return (preq.skill_req);
    }
  }
}

function declareWinner(wkey, winner, efficiencies) {
  //  console.log(winner.name, winner.efficiency, winner.level, winner.costs[winner.level + 1]); // useful for debugging
  sp_spent += winner.costs[winner.level + 1]; // spend the SP
  sp_trees[winner.branch] += winner.costs[winner.level + 1]; // update the tree spend tracker
  db.skills[wkey].level += 1; // mark the skill as chosen
  efficiencies = [];
  $.each(db.skills, function (k, s) {
    s.efficiency = determineSkillEfficiency(s);
    efficiencies.push({
      'key': k,
      'name': s.name,
      'efficiency': s.efficiency,
      'branch': s.branch,
      'spreq': s.sp_req,
      'preq': s.skill_req,
      'cost': (s.level < s.max ? s.costs[s.level + 1] : -1)
    });
  });
  return (efficiencies);
}

function sortEfficiencies(a, b) {
  if (a.efficiency < b.efficiency) {
    return 1;
  } else if (a.efficiency > b.efficiency) {
    return -1;
  } else {
    if (a.spreq > b.spreq) {
      return 1;
    } else if (a.spreq < b.spreq) {
      return -1;
    } else {
      return 0;
    }
  }
}

function determineSkillEfficiency(s) {
  var efficiency = 0.00;
  var current_effect = 0 < s.level ? s.effects.primary[s.level] : 0;
  var next_effect = s.level < s.max ? s.effects.primary[s.level + 1] : -1;
  var secondary_effect = -1;
  var next_secondary_effect = -1;
  if (-1 == next_effect) { // if this skill is maxed; it has no efficiency score
    return (-1);
  }
  var current_coef = -1;
  var current_expo = -1;
  var secondary_coef = -1;
  var secondary_reduction = -1;
  switch (s.id) {
    case 'TapDmgFromHelpers':
      if (0 == artifact_statuses['Artifact49'] && 0 == s.level) { // if they don't have the artifact that gives tap damage from heroes, boost this skill if it has 0 points
        return (1.5);
      }
      current_effect += (1 == artifact_statuses['Artifact49'] ? 0.004 : 0);
      next_effect += (1 == artifact_statuses['Artifact49'] ? 0.004 : 0);
      current_effect += (31000 < ms ? 0.000458 : (4000 < ms ? 0.0002 : (1000 < ms ? 0.0001 : 0)));
      next_effect += (31000 < ms ? 0.000458 : (4000 < ms ? 0.0002 : (1000 < ms ? 0.0001 : 0)));
      break;
    case 'PetGoldQTE':
      secondary_effect = 0 < s.level ? 75 - s.effects.secondary[s.level] : 75;
      next_secondary_effect = 75 - s.effects.secondary[s.level + 1];
      secondary_reduction = s.reductions[gold];
      break;
    case 'HeavyStrikes':
      current_effect += (0 == current_effect ? 1.15 : .15);
      next_effect += .15;
      var crit_chance = (crit / allprob) - (0 < cleaving ? s.effects.secondary[cleaving] : 0); // reverse engineer their unbuffed by skill or allprob crit chance
      secondary_effect = 0 < s.level ? (crit_chance + s.effects.secondary[s.level]) * allprob : crit_chance * allprob; // to reengineer the effect
      next_secondary_effect = (crit_chance + s.effects.secondary[s.level + 1]) * allprob; // to reengineer the next effect
      if (0 >= next_secondary_effect) { // if reducing crit chance any further would drop it below zero, deprioritize this skill
        return (-1);
      }
      secondary_reduction = db.crit_reductions[build];
      break;
    case 'PetQTE':
      if (0 == s.level && 'pet' == build) { // if they don't have at least one in it yet, send it in
        return (1.25);
      }
      var zip_current = (0 < db.skills[db.skill_lookup['BossDmgQTE']].level ? db.skills[db.skill_lookup['BossDmgQTE']].effects.primary[db.skills[db.skill_lookup['BossDmgQTE']].level] : 0);
      var petpersec = (1 == equipment_statuses['ancient'] ? 2 / 3 : 1 / 3) + (taps + zip_current) / 20;
      var cek_value = (1 == equipment_statuses['emerald'] ? .7 * Math.pow(.999, crafting - 1) : 1);
      current_coef = (20 * petpersec * zip_current * cek_value + next_effect) / (20 * petpersec * zip_current * cek_value + current_effect) * 0.5 + (15 * petpersec * zip_current * cek_value + next_effect + 3) / (15 * petpersec * zip_current * cek_value + current_effect + 3) * 0.5;
      break;
    case 'BossDmgQTE':
      secondary_effect = 0 < s.level ? s.effects.secondary[s.level] : 1;
      next_secondary_effect = s.effects.secondary[s.level + 1];
      secondary_reduction = s.reductions[build] + db.skills[db.skill_lookup['PetQTE']].reductions[build] + db.skills[db.skill_lookup['PetGoldQTE']].reductions[gold]; // add together the reductions for all three pet QTE skills
      secondary_coef = secondary_effect / next_secondary_effect;
      break;
    case 'ChestGold':
      var chest_chance = (chesterson / allprob) - (0 < spoils ? s.effects.secondary[spoils] : 0); // reverse engineer their unbuffed by skill or allprob chesterson chance
      secondary_effect = 0 < s.level ? (chest_chance + s.effects.secondary[s.level]) * allprob : chest_chance * allprob; // to reengineer the effect
      next_secondary_effect = (chest_chance + s.effects.secondary[s.level + 1]) * allprob; // to reengineer the next effect
      current_coef = (next_effect / (0 == current_effect ? 1 : current_effect)) * (next_secondary_effect / secondary_effect);
      next_secondary_effect = -1; // ensure we don't fire off the secondary trigger below
      break;
    case 'HelperDmgSkillBoost':
      var searing_current = (0 < db.skills[db.skill_lookup['HelperInspiredWeaken']].level ? db.skills[db.skill_lookup['HelperInspiredWeaken']].effects.primary[db.skills[db.skill_lookup['HelperInspiredWeaken']].level] : 0);
      secondary_effect = 0 < s.level ? s.effects.secondary[s.level] : 1;
      next_secondary_effect = s.effects.secondary[s.level + 1];
      current_coef = (next_effect / (0 == current_effect ? 1 : current_effect)) * (((1 + .5 * searing_current * patience * next_secondary_effect / (2.8 / db.warcry_effects[warcry])) / (1 + .5 * searing_current * patience * secondary_effect / (2.8 / db.warcry_effects[warcry]))));
      next_secondary_effect = -1; // ensure we don't fire off the secondary trigger below
      break;
    case 'HelperBoost':
      current_effect += 1;
      next_effect += 1;
      current_expo = s.reductions[gold] + s.reductions[build];
      break;
    case 'HelperInspiredWeaken':
      var heroic_secondary_current = (0 < db.skills[db.skill_lookup['HelperDmgSkillBoost']].level ? db.skills[db.skill_lookup['HelperDmgSkillBoost']].effects.secondary[db.skills[db.skill_lookup['HelperDmgSkillBoost']].level] : 0);
      current_coef = (1 + .5 * next_effect * patience * heroic_secondary_current / (2.8 / db.warcry_effects[warcry])) / (1 + 0.5 * current_effect * patience * heroic_secondary_current / (2.8 / db.warcry_effects[warcry]));
      break;
    case 'ClanQTE': // this one has a custom efficiency calculation
      secondary_effect = 0 < s.level ? s.effects.secondary[s.level] : 1;
      next_secondary_effect = s.effects.secondary[s.level + 1];
      efficiency = Math.pow((((Math.pow(next_effect, s.reductions[build]) - 1) * Math.min(30 / (45 - next_secondary_effect), 1) + 1) / ((Math.pow((0 == current_effect ? 1 : current_effect), s.reductions[build]) - 1) * Math.min(30 / (45 - secondary_effect), 1) + 1)), 1 / s.costs[s.level + 1]);
      return (efficiency);
      break;
    case 'HelperDmgQTE':
      current_expo = 5 * s.reductions[build];
      break;
    case 'ClanShipStun':
      var co_current = (0 < db.skills[db.skill_lookup['ClanQTE']].level ? db.skills[db.skill_lookup['ClanQTE']].effects.primary[db.skills[db.skill_lookup['ClanQTE']].level] : 1);
      var co_secondary_current = (0 < db.skills[db.skill_lookup['ClanQTE']].level ? db.skills[db.skill_lookup['ClanQTE']].effects.secondary[db.skills[db.skill_lookup['ClanQTE']].level] : 0);
      var shot_freq = 1 == equipment_statuses['ancient'] ? 4 : 8;
      var co_hits_sec = 6;
      secondary_effect = 0 < s.level ? s.effects.secondary[s.level] : 1;
      next_secondary_effect = s.effects.secondary[s.level + 1];
      if ('cs' == build) {
        current_effect = co_current * (0 == current_effect ? 1 : current_effect) + (45 - co_secondary_current) * co_current / shot_freq + (45 - co_secondary_current) * co_current * co_hits_sec / (240 * shot_freq) * (secondary_effect * (0 == current_effect ? 1 : current_effect) + (shot_freq - secondary_effect));
        next_effect = co_current * next_effect + (45 - co_secondary_current) * co_current / shot_freq + (45 - co_secondary_current) * co_current * co_hits_sec / (240 * shot_freq) * (secondary_effect * next_effect + (shot_freq - secondary_effect));
      } else if (0 == s.level) { // for non-CS builds, ASh has a set opening efficiency
        if ('pet' == build || build.includes('hs')) {
          return (1.15);
        } else {
          return (1.12);
        }
      } else {
        current_coef = ((next_effect - 1) * next_secondary_effect / shot_freq + 1) / ((current_effect - 1) * secondary_effect / shot_freq + 1);
      }
      next_secondary_effect = -1; // ensure we don't fire off the secondary trigger below
      break;
    case 'MidasSkillBoost':
      if ('fairy' == gold) {
        secondary_effect = 0 < s.level ? s.effects.secondary[s.level] : 1;
        next_secondary_effect = s.effects.secondary[s.level + 1];
        secondary_reduction = s.reductions.boss; // have to force a full gold reduction because fairy is otherwise clipped for HoM
      }
      break;
    case 'CloneDmg':
      secondary_effect = db.clone_effects[clone] + ((0 < s.level ? s.effects.secondary[s.level] : 0) * (1 == equipment_statuses['ancient'] ? 2 : 1));
      next_secondary_effect = db.clone_effects[clone] + (s.effects.secondary[s.level + 1] * (1 == equipment_statuses['ancient'] ? 2 : 1));
      current_coef = (next_effect / (0 == current_effect ? 1 : current_effect)) * (next_secondary_effect / secondary_effect);
      next_secondary_effect = -1; // ensure we don't fire off the secondary trigger below
      break;
    case 'Fairy':
      current_effect = 120 - (0 < s.level ? s.effects.secondary[s.level] : 0);
      next_effect = 120 - s.effects.secondary[s.level + 1];
      current_coef = current_effect / next_effect;
      break;
    case 'ManaMonster':
      if (true == build.includes('hs') && 0 == s.level) {
        current_coef = 1.5;
        current_expo = 1;
      }
      break;
    case 'CritSkillBoost':
      var barbaric_secondary_current = (0 < db.skills[db.skill_lookup['Frenzy']].level ? db.skills[db.skill_lookup['Frenzy']].effects.secondary[db.skills[db.skill_lookup['Frenzy']].level] : 0);
      var i = 0;
      var j = Math.min(500, parseInt(((taps + barbaric_secondary_current + (db.clone_effects[clone] * (1 == equipment_statuses['chained'] ? 1.5 * Math.pow(1.005, crafting - 1) : 1))) * patience * allprob * .02)));
      current_effect = 1; // reset these because of how the calc works
      next_effect = 1; // reset these because of how the calc works
      while (i < j) {
        current_effect *= (1 - (0 == s.level ? 0 : s.effects.primary[s.level] * Math.pow(s.effects.secondary[s.level], i)));
        next_effect *= 1 - s.effects.primary[s.level + 1] * Math.pow(s.effects.secondary[s.level + 1], i);
        i++;
      }
      current_coef = current_effect / next_effect;
      break;
    case 'BossTimer':
      current_expo = s.reductions[gold] + s.reductions[build];
      break;
    case 'AutoAdvance':
      if (0 == s.level) { // nudge the first level
        current_coef = 1.5;
      }
      break;
    case 'MultiMonsters':
      if (0 == s.level) { // nudge the first level
        current_coef = 1.2;
      }
      break;
    case 'PetOfflineDmg':
      if (0 == s.level) { // nudge the first level
        current_coef = 1.5;
      } else {
        if (0 == active && 'pet' == build) {
          current_expo = 1;
        } else {
          current_expo = 0;
        }
        secondary_effect = 0 < s.level ? s.effects.secondary[s.level] : 1;
        next_secondary_effect = s.effects.secondary[s.level + 1];
        secondary_reduction = s.reductions[build];
      }
      break;
    case 'InactiveClanShip':
      if (0 == s.level) { // nudge the first level
        current_coef = 1.5;
      } else {
        if (0 == active && 'sc' == build) {
          current_expo = 1;
        } else {
          current_expo = 0;
        }
        secondary_effect = 0 < s.level ? s.effects.secondary[s.level] : 1;
        next_secondary_effect = s.effects.secondary[s.level + 1];
        secondary_reduction = s.reductions[build];
      }
      break;
    case 'OfflineCloneDmg':
      if (0 == s.level) { // nudge the first level
        current_coef = 1.5;
      } else {
        if (0 == active && 'sc' == build) {
          current_expo = 1;
        } else {
          current_expo = 0;
        }
        secondary_effect = 0 < s.level ? s.effects.secondary[s.level] : 1;
        next_secondary_effect = s.effects.secondary[s.level + 1];
        secondary_reduction = s.reductions[build];
      }
      break;
  }
  if (-1 == current_coef) { // if no skill set a primary custom coef, set it now
    current_effect = (0 == current_effect ? 1 : current_effect); // catch any current_effect's that are still 0
    current_coef = next_effect / current_effect;
  }
  if (-1 == current_expo) { // if no skill set a primary custom expo, set it now
    current_expo = ('gold' == s.type ? s.reductions[gold] : s.reductions[build]);
  }
  if (-1 != next_secondary_effect && -1 == secondary_coef) { // if no skill set a custom secondary coef, set it now
    secondary_coef = next_secondary_effect / secondary_effect;
  }
  efficiency = Math.pow(current_coef, current_expo / s.costs[s.level + 1]);
  efficiency *= (-1 !== next_secondary_effect ? Math.pow(secondary_coef, secondary_reduction / s.costs[s.level + 1]) : 1);
  if ('CritSkillBoost' == s.id && 3 <= s.level) { // if this is Lightning Strikes, knock it back a bit
    efficiency -= 1;
    efficiency /= 2;
    efficiency += 1;
  }
  return (efficiency);
}

function updateGlobals() {
  ltr = parseFloat($('#ltr').val() + $('#ltr_factor').val());
  sp = parseInt($('#sp').val());
  build = $('#build').val() || '';
  $('.colorlink').removeClass().addClass(build);
  $('#active').removeClass().addClass(build + 'bg');
  $('#notation').removeClass().addClass(build + 'bg');
  $('#greed').removeClass().addClass('maxbg');
  $('#unit').removeClass().addClass('maxbg');
  $('#ancient').removeClass().addClass(build + 'bg');
  $('#chained').removeClass().addClass(build + 'bg');
  $('#angelic').removeClass().addClass(build + 'bg');
  hero = $('#hero').val();
  determineHeroType();
  gold = $('#gold').val();
  active = $('#active').prop('checked');
  if (true == active) {
    $('#active_message').html('在线');
  } else {
    $('#active_message').html('离线');
  }
  notation = $('#notation').prop('checked');
  if (true == notation) {
    $('#notation_message').html('^_^ Scientific Notation ^_^');
  } else {
    $('#notation_message').html('T_T Letter Notation T_T');
  }
  greed = $('#greed').prop('checked');
  if (true == greed) {
    $('#greed_message').html('退而求其次，升级其它可被升级的天赋');
  } else {
    $('#greed_message').html('存够技能点升级它');
  }
  unit = $('#unit').prop('checked');
  if (true == unit) {
    $('#unit_message').html('1%, 5%, or 25% Upgrades');
  } else {
    $('#unit_message').html('1, 10, 100, or 1000 Unit Upgrades');
  }
  bosunit = $('#bosunit').val();
  bospct = parseFloat(('pct' == bosunit ? $('#bospct').val() / 100 : $('#bospct').val() + bosunit));
  $.each($('.artcheck'), function (k, a) {
    var flag = 0; // 0为未选中
    if ($(a).prop('checked')) {
      if ($(a).parents('div:first').find('.fumo').length && $(a).parents('div:first').find('.fumo input').prop('checked')) {
        flag = 2; // 2为附魔
      } else {
        flag = 1; // 1为选中
      }
      $.each(db.artifacts, function (k, item) {
        if (item.id === a.id) {
          item.fumo = flag - 1;
        }
      });
    }
    artifact_statuses[a.id] = flag;
  });
  allprob = parseFloat($('#allprob').val()) + .1;
  crit = parseFloat($('#crit').val()) / 100;
  cleaving = parseInt($('#cleaving').val());
  chesterson = parseFloat($('#chesterson').val()) / 100;
  spoils = parseInt($('#spoils').val());
  crafting = parseInt($('#crafting').val());
  warcry = parseInt($('#warcry').val());
  clone = parseInt($('#clone').val());
  taps = parseInt($('#taps').val());
  patience = parseInt($('#patience').val());
  ip = parseInt($('#ip').val());
  mi = parseInt($('#mi').val());
  ms = parseInt($('#ms').val());
  equipment_statuses = {
    'ancient': true == $('#ancient').prop('checked') ? 1 : 0,
    'ruthless': true == $('#ruthless').prop('checked') ? 1 : 0,
    'angelic': true == $('#angelic').prop('checked') ? 1 : 0,
    'chained': true == $('#chained').prop('checked') ? 1 : 0,
    'platinum': true == $('#platinum').prop('checked') ? 1 : 0,
    'emerald': true == $('#emerald').prop('checked') ? 1 : 0
  }
  if ('sc' == build) {
    $('#platinum').removeClass().addClass(build + 'bg');
    $('#ruthless').removeClass().addClass(build + 'bg');
  } else {
    $('#platinum').removeClass().addClass('maxbg');
    $('#ruthless').removeClass().addClass('maxbg');
  }
  if ('pet' == build && 'phom' == gold) {
    $('#emerald').removeClass().addClass('goldbg');
  } else if ('pet' == build) {
    $('#emerald').removeClass().addClass(build + 'bg');
  } else if ('phom' == gold) {
    $('#emerald').removeClass().addClass('bg-success');
  } else {
    $('#emerald').removeClass().addClass('maxbg');
  }
  adjustArtifacts();
}

function updateArtifactSpread() {
  var arts = [];
  $.each(db.artifacts, function (k, a) {
    if (0 < a.max) { // skip maxable artifacts
      return true;
    }
    var pct = a.disppct * 100;
    arts.push([
      '<span class="d-none">' + (arts.length < 10 ? '0' : '') + arts.length + '</span><img src="' + a.icon + '" height="25px;" class="d-inline-block p-0 m-0" alt="' + a.name + '" /> <span class="d-none d-sm-inline-block ' + (0 == artifact_statuses[a.id] ? ' text-disabled' : determineColor(a, true)) + '">' + a.name + '</span><span class="d-sm-none ' + (0 == artifact_statuses[a.id] ? ' text-disabled' : determineColor(a, true)) + '">' + a.name + '</span>',
      '<span class="' + (0 == artifact_statuses[a.id] ? ' text-disabled' : determineColor(a, true)) + '">' + displayTruncated('Artifact22' == a.id && 0 == artifact_statuses[a.id] ? 0 : a.calclevel) + '</span>',
      '<div class="d-inline-block ' + determineColor(a, false) + ' shadow" style="width: ' + pct + '%;"><span class="' + (0 == artifact_statuses[a.id] ? 'pctart text-disabled' : 'pctart') + '">' + pct.toFixed(5) + '%</span></div>'
    ]);
  });
  $('#artifact_reccs').DataTable({
    'destroy': true,
    'data': arts,
    'columns': [{
        'title': 'Artifact'
      },
      {
        'title': 'Level'
      },
      {
        'title': 'Percent'
      }
    ],
    'columnDefs': [{
        'orderable': false,
        'targets': 1
      },
      {
        'width': '30%',
        'targets': 0
      },
      {
        'width': '20%',
        'targets': 1
      },
      {
        'width': '50%',
        'targets': 2
      },
    ],
    'paging': false,
    'responsive': {
      'details': false
    },
    'searching': false,
    'info': false
  });
}

function updateSkillTree() {
  $.each(db.skills, function (k, s) {
    $('#' + s.branch + '_' + s.slot).html(s.level);
  });
  $('#totalSP').html(sp_spent);
  $('#totalSPred').html(sp_trees.BranchRed);
  $('#totalSPyellow').html(sp_trees.BranchYellow);
  $('#totalSPblue').html(sp_trees.BranchBlue);
  $('#totalSPgreen').html(sp_trees.BranchGreen);
  if ('' != sp_next) {
    $('#sp_next').html('<small><em>接下来应该升级 ' + sp_next + '</em></small>');
  } else {
    $('#sp_next').empty();
  }
}

function storeValues() {
  if (storageAvailable('localStorage')) {
    window.localStorage.setItem('ltr', $('#ltr').val());
    window.localStorage.setItem('ltr_factor', $('#ltr_factor').val());
    window.localStorage.setItem('sp', $('#sp').val());
    window.localStorage.setItem('build', $('#build').val());
    window.localStorage.setItem('hero', $('#hero').val());
    window.localStorage.setItem('gold', $('#gold').val());
    window.localStorage.setItem('active', ($('#active').prop('checked') == true ? 1 : 0));
    window.localStorage.setItem('notation', ($('#notation').prop('checked') == true ? 1 : 0));
    window.localStorage.setItem('unit', ($('#unit').prop('checked') == true ? 1 : 0));
    window.localStorage.setItem('bospct', $('#bospct').val());
    window.localStorage.setItem('bosunit', $('#bosunit').val());
    $.each($('.artcheck'), function (k, a) {
      var flag = 0; // 0为未选中
      if ($(a).prop('checked')) {
        if ($(a).parents('div:first').find('.fumo').length && $(a).parents('div:first').find('.fumo input').prop('checked')) {
          flag = 2; // 2为附魔
        } else {
          flag = 1; // 1为选中
        }
        $.each(db.artifacts, function (k, item) {
          if (item.id === a.id) {
            item.fumo = flag - 1;
          }
        });
      }
      artifact_statuses[a.id] = flag;
    });
    window.localStorage.setItem('artifact_statuses', JSON.stringify(artifact_statuses));
    window.localStorage.setItem('allprob', $('#allprob').val());
    window.localStorage.setItem('crit', $('#crit').val());
    window.localStorage.setItem('cleaving', $('#cleaving').val());
    window.localStorage.setItem('chesterson', $('#chesterson').val());
    window.localStorage.setItem('spoils', $('#spoils').val());
    window.localStorage.setItem('crafting', $('#crafting').val());
    window.localStorage.setItem('warcry', $('#warcry').val());
    window.localStorage.setItem('clone', $('#clone').val());
    window.localStorage.setItem('taps', $('#taps').val());
    window.localStorage.setItem('patience', $('#patience').val());
    window.localStorage.setItem('ip', $('#ip').val());
    window.localStorage.setItem('mi', $('#mi').val());
    window.localStorage.setItem('ms', $('#ms').val());
    window.localStorage.setItem('ancient', (true == $('#ancient').prop('checked') ? 1 : 0));
    window.localStorage.setItem('ruthless', (true == $('#ruthless').prop('checked') ? 1 : 0));
    window.localStorage.setItem('angelic', (true == $('#angelic').prop('checked') ? 1 : 0));
    window.localStorage.setItem('chained', (true == $('#chained').prop('checked') ? 1 : 0));
    window.localStorage.setItem('platinum', (true == $('#platinum').prop('checked') ? 1 : 0));
    window.localStorage.setItem('emerald', (true == $('#emerald').prop('checked') ? 1 : 0));
    window.localStorage.setItem('greed', (true == $('#greed').prop('checked') ? 1 : 0));
    updateGlobals();
  }
}

function exportOptions() {
  var data = {
    'ltr': $('#ltr').val(),
    'ltr_factor': $('#ltr_factor').val(),
    'sp': $('#sp').val(),
    'build': $('#build').val(),
    'hero': $('#hero').val(),
    'gold': $('#gold').val(),
    'active': ($('#active').prop('checked') == true ? 1 : 0),
    'notation': ($('#notation').prop('checked') == true ? 1 : 0),
    'unit': ($('#unit').prop('checked') == true ? 1 : 0),
    'bospct': $('#bospct').val(),
    'bosunit': $('#bosunit').val(),
    'artifact_statuses': artifact_statuses,
    'allprob': $('#allprob').val(),
    'crit': $('#crit').val(),
    'cleaving': $('#cleaving').val(),
    'chesterson': $('#chesterson').val(),
    'spoils': $('#spoils').val(),
    'crafting': $('#crafting').val(),
    'warcry': $('#warcry').val(),
    'clone': $('#clone').val(),
    'taps': $('#taps').val(),
    'patience': $('#patience').val(),
    'ip': $('#ip').val(),
    'mi': $('#mi').val(),
    'ms': $('#ms').val(),
    'equipment_statuses': equipment_statuses,
    'greed': (true == $('#greed').prop('checked') ? 1 : 0)
  }
  return (JSON.stringify(data));
}

function importOptions(datastring) {
  try {
    data = JSON.parse(datastring);
  } catch (e) {
    alert('导入数据格式有误，请检查');
    return;
  }
  $('#ltr').val(data['ltr']);
  $('#ltr_factor').val(data['ltr_factor']);
  $('#sp').val(data['sp']);
  $('#build').val(data['build'] || '');
  $('#hero').val(data['hero']);
  $('#gold').val(data['gold']);
  $('#active').prop('checked', data['active']);
  $('#notation').prop('checked', data['notation']);
  $('#unit').prop('checked', data['unit']);
  $('#bospct').val(data['bospct']);
  $('#bosunit').val(data['bosunit']);
  artifact_statuses = data['artifact_statuses'] || {};
  $.each(data['artifact_statuses'], function (k, a) {
    var fumoEl = $('#' + k).parents('div:first').find('.fumo input');
    fumoEl.prop('checked', a === 2);
    $('#' + k).prop('checked', a);
  });
  $('#allprob').val(data['allprob']);
  $('#crit').val(data['crit']);
  $('#cleaving').val(data['cleaving']);
  $('#chesterson').val(data['chesterson']);
  $('#spoils').val(data['spoils']);
  $('#crafting').val(data['crafting']);
  $('#warcry').val(data['warcry']);
  $('#clone').val(data['clone']);
  $('#taps').val(data['taps']);
  $('#patience').val(data['patience']);
  $('#ip').val(data['ip']);
  $('#mi').val(data['mi']);
  $('#ms').val(data['ms']);
  equipment_statuses = data['equipment_statuses'];
  $.each(data['equipment_statuses'], function (k, e) {
    $('#' + k).prop('checked', e);
  });
  $('#greed').prop('checked', data['greed']);
  storeValues();
  loadValues();
}

function shoppingSpree(own) {
  $.each(db.artifacts, function (k, a) {
    $('#' + a.id).prop('checked', own)
    artifact_statuses[a.id] = own - 0;
  });
  storeValues();
}

function displayTruncated(value) {
  if (value > 999999999999999) {
    if (true == notation) {
      value = value.toExponential(2);
      value = value.replace(/\+/, '').replace(/\.?0+e/, 'e');
    } else {
      var letter_expo = '';
      var expo = value.toExponential(3).replace(/\d+\.\d+e\+(\d+)/, '$1');
      expo_adj = Math.floor(expo / 3) - 4;
      letter_expo += 'a' + letters[expo_adj];
      value = value.toExponential(10).replace(/e\+\d+/, '');
      value *= (0 !== expo % 3 ? Math.pow(10, expo % 3) : 1);
      value = value.toFixed(2)
      value = value + letter_expo;
    }
  } else {
    if (value > 999999999999) {
      value = (value / 1000000000000).toFixed(2).replace(/\.?0+$/, '');
      value += 'T';
    } else if (value > 999999999) {
      value = (value / 1000000000).toFixed(2).replace(/\.?0+$/, '');
      value += 'B';
    } else if (value > 999999) {
      value = (value / 1000000).toFixed(2).replace(/\.?0+$/, '');
      value += 'M';
    } else if (value > 999) {
      value = (value / 1000).toFixed(2).replace(/\.?0+$/, '');
      value += 'K';
    } else {
      value = Math.floor(value)
    }
  }
  return (value);
}

function storageAvailable(type) {
  try {
    var storage = window[type],
      x = '__storage_test__';
    storage.setItem(x, x);
    storage.removeItem(x);
    return true;
  } catch (e) {
    return e instanceof DOMException && (
        // everything except Firefox
        e.code === 22 ||
        // Firefox
        e.code === 1014 ||
        // test name field too, because code might not be present
        // everything except Firefox
        e.name === 'QuotaExceededError' ||
        // Firefox
        e.name === 'NS_ERROR_DOM_QUOTA_REACHED'
      ) &&
      // acknowledge QuotaExceededError only if there's something already stored
      storage.length !== 0;
  }
}

function loadValues() {
  if (storageAvailable('localStorage')) {
    $('#ltr').val(null !== window.localStorage.getItem('ltr') ? window.localStorage.getItem('ltr') : '0.00');
    $('#ltr_factor').val(null !== window.localStorage.getItem('ltr_factor') ? window.localStorage.getItem('ltr_factor') : 'e3');
    $('#sp').val(null !== window.localStorage.getItem('sp') ? window.localStorage.getItem('sp') : '0');
    $('#build').val(null !== window.localStorage.getItem('build') ? window.localStorage.getItem('build') : 'sc');
    $('#hero').val(null !== window.localStorage.getItem('hero') ? window.localStorage.getItem('hero') : 'split');
    $('#gold').val(null !== window.localStorage.getItem('gold') ? window.localStorage.getItem('gold') : 'phom');
    if (window.localStorage.getItem('active') == "1" || null == window.localStorage.getItem('active')) {
      $('#active').prop('checked', true);
    } else {
      $('#active').prop('checked', false);
    }
    if (window.localStorage.getItem('notation') == "1" || null == window.localStorage.getItem('notation')) {
      $('#notation').prop('checked', true);
    } else {
      $('#notation').prop('checked', false);
    }
    if (window.localStorage.getItem('greed') == "1") {
      $('#greed').prop('checked', true);
    } else {
      $('#greed').prop('checked', false);
    }
    if (window.localStorage.getItem('unit') == "1" || null == window.localStorage.getItem('unit')) {
      $('#unit').prop('checked', true);
    } else {
      $('#unit').prop('checked', false);
    }
    $('#active').on('change', storeValues);
    $('#notation').on('change', storeValues);
    $('#greed').on('change', storeValues);
    $('#unit').on('change', storeValues);
    $('#bospct').val(null !== window.localStorage.getItem('bospct') ? window.localStorage.getItem('bospct') : '50.00');
    $('#bosunit').val(null !== window.localStorage.getItem('bosunit') ? window.localStorage.getItem('bosunit') : 'pct');
    if (null != window.localStorage.getItem('artifact_statuses')) {
      artifact_statuses = JSON.parse(window.localStorage.getItem('artifact_statuses'));
    } else {
      $.each(db.artifacts, function (k, a) {
        artifact_statuses[a.id] = 0;
      });
    }
    window.localStorage.setItem('artifact_statuses', JSON.stringify(artifact_statuses));
    $('#allprob').val(null !== window.localStorage.getItem('allprob') ? window.localStorage.getItem('allprob') : '1.00');
    $('#crit').val(null !== window.localStorage.getItem('crit') ? window.localStorage.getItem('crit') : '0.00');
    $('#cleaving').val(null !== window.localStorage.getItem('cleaving') ? window.localStorage.getItem('cleaving') : '0');
    $('#chesterson').val(null !== window.localStorage.getItem('chesterson') ? window.localStorage.getItem('chesterson') : '0.00');
    $('#spoils').val(null !== window.localStorage.getItem('spoils') ? window.localStorage.getItem('spoils') : '0');
    $('#crafting').val(null !== window.localStorage.getItem('crafting') ? window.localStorage.getItem('crafting') : '1');
    $('#warcry').val(null !== window.localStorage.getItem('warcry') ? window.localStorage.getItem('warcry') : '1');
    $('#clone').val(null !== window.localStorage.getItem('clone') ? window.localStorage.getItem('clone') : '1');
    $('#taps').val(null !== window.localStorage.getItem('taps') ? window.localStorage.getItem('taps') : '5');
    $('#patience').val(null !== window.localStorage.getItem('patience') ? window.localStorage.getItem('patience') : '5');
    $('#ip').val(null !== window.localStorage.getItem('ip') ? window.localStorage.getItem('ip') : '0');
    $('#mi').val(null !== window.localStorage.getItem('mi') ? window.localStorage.getItem('mi') : '0');
    $('#ms').val(null !== window.localStorage.getItem('ms') ? window.localStorage.getItem('ms') : '500');
    if (window.localStorage.getItem('ancient') == "1") {
      $('#ancient').prop('checked', true);
    } else {
      $('#ancient').prop('checked', false);
    }
    if (window.localStorage.getItem('ruthless') == "1") {
      $('#ruthless').prop('checked', true);
    } else {
      $('#ruthless').prop('checked', false);
    }
    if (window.localStorage.getItem('angelic') == "1") {
      $('#angelic').prop('checked', true);
    } else {
      $('#angelic').prop('checked', false);
    }
    if (window.localStorage.getItem('chained') == "1") {
      $('#chained').prop('checked', true);
    } else {
      $('#chained').prop('checked', false);
    }
    if (window.localStorage.getItem('platinum') == "1") {
      $('#platinum').prop('checked', true);
    } else {
      $('#platinum').prop('checked', false);
    }
    if (window.localStorage.getItem('emerald') == "1") {
      $('#emerald').prop('checked', true);
    } else {
      $('#emerald').prop('checked', false);
    }
  }
  updateGlobals();
}

$('input[type="tel"]').on('focus', function () {
  $(this).data('fontSize', $(this).css('font-size')).css('font-size', '16px');
}).on('blur', function () {
  $(this).css('font-size', $(this).data('fontSize'));
});
$('input[type="number"]').on('focus', function () {
  $(this).data('fontSize', $(this).css('font-size')).css('font-size', '16px');
}).on('blur', function () {
  $(this).css('font-size', $(this).data('fontSize'));
});

function determineHeroType() {
  switch (hero) {
    case 'split':
      hero_type = 'melee_spell_ranged_ground_flying';
      break;

    case 'maya':
    case 'kronus':
    case 'kiki':
    case 'beany':
    case 'ursa':
    case 'wally':
    case 'pharaoh':
    case 'cass':
    case 'lucy':
    case 'jazz':
    case 'mina':
      hero_type = 'spell_ground';
      break;

    case 'zato':
    case 'sophia':
    case 'lance':
    case 'gulbrand':
    case 'rhys':
    case 'cosette':
    case 'jayce':
    case 'boomoh':
    case 'aya':
    case 'yzafa':
      hero_type = 'melee_ground';
      break;

    case 'pingo':
    case 'rosabella':
    case 'davey':
    case 'maddie':
    case 'sawyer':
    case 'saje':
    case 'dex':
    case 'lala':
    case 'miki':
    case 'finn':
      hero_type = 'ranged_ground';
      break;

    case 'maple':
    case 'nohni':
      hero_type = 'melee_flying';
      break;

    case 'kin':
    case 'zolom':
      hero_type = 'ranged_flying';
      break;

    case 'titania':
    case 'damon':
      hero_type = 'spell_flying';
      break;
  }
  return (hero_type);
}

var letters = ['_', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z']