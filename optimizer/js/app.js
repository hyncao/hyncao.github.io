var db = {};
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
  db = JSON.parse(db);
  loadValues();
  /**/
});

function insertArtifacts() { // drop the artifacts into the options tab to mark which you own
  var arts = '';
  $.each(db.artifacts, function (k, a) {
    arts += '<div class="form-group col-12 col-md-6 col-lg-4">';
    arts += '<label for="' + a.id + '" class="' + determineColor(a, true) + '">';
    arts += '<label class="switch">';
    arts += '<input class="artcheck ' + determineColor(a, false) + '" type="checkbox" id="' + a.id + '" ' + (undefined !== artifact_statuses[a.id] && 1 == artifact_statuses[a.id] ? 'checked="checked"' : '') + ' onchange="storeValues();">';
    arts += '<span class="slider round"></span>';
    arts += '</label>';
    arts += '<img src="' + a.icon + '" height="21px;" alt="' + a.name + '" class="mr-2" />';
    arts += a.name + '</label>';
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
  $('#nanerror').hide();
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
    a.weffect = Math.pow((a.effect + minimum_effect) / minimum_effect, 1 / 3);
    a.wcost = (a.weffect * a.gpeak * ('gold' == a.type ? a.reductions[gold] : a.reductions[build]) / a.texpo + a.adcalc) * (0 < a.max ? 0 : artifact_statuses[a.id]);
    running_wcost += a.wcost;
    if (0 < a.max && 1 == artifact_statuses[a.id]) { // if it's maxable and they own it
      var cost_to_max = a.tcoef * Math.pow(a.max, a.texpo);
      total_artifacts_purchase_cost += cost_to_max; // add the cost to max it

    }
  });
  relics_to_spread -= total_artifacts_purchase_cost;
  var leftover_relics = relics_to_spread * ('pct' == unit ? .97 : 1);
  if (0 > leftover_relics) {
    $('#nanerror').show();
  }
  $.each(db.artifacts, function (k, a) { // and a third loop to get the running totals
    a.costpct = a.wcost / running_wcost;
    if ('Artifact22' == a.id) { // Note: this relies on BoS being first in the list
      if (1 == artifact_statuses[a.id]) {
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
      if (0 > leftover_relics) {
        $('#nanerror').show();
      }
    } else {
      a.calcrelic = leftover_relics * a.costpct;
      a.disppct = a.calcrelic / relics_to_spread; // repurpose this for display purposes
    }
    a.calclevel = Math.pow(a.calcrelic / a.tcoef, 1 / a.texpo);
  });
  insertArtifacts();
  updateArtifactSpread();
  adjustSkills();
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
              sp_next = next.name + ' (' + next.cost + ' SP)' + ('' != next.name2 ? ' to unlock ' + next.name2 : '');
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
  build = $('#build').val();
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
    $('#greed_message').html('将技能点用于当前的最优技能');
  } else {
    $('#greed_message').html('存起来，为了那个收益最高的技能');
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
    artifact_statuses[a.id] = true == $(a).prop('checked') ? 1 : 0;
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
    'emerald': true == $('#platinum').prop('checked') ? 1 : 0
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
      '<span class="d-none">' + (arts.length < 10 ? '0' : '') + arts.length + '</span><img src="' + a.icon + '" height="25px;" class="d-inline-block p-0 m-0" alt="' + a.name + '" /> <span class="d-none d-sm-inline-block ' + (0 == artifact_statuses[a.id] ? ' text-disabled' : determineColor(a, true)) + '">' + a.name + '</span><span class="d-sm-none ' + (0 == artifact_statuses[a.id] ? ' text-disabled' : determineColor(a, true)) + '">' + a.nickname + '</span>',
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
    $('#sp_next').html('<small><em>The next best skill to unlock is ' + sp_next + '</em></small>');
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
      artifact_statuses[a.id] = true == $(a).prop('checked') ? 1 : 0;
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
  data = JSON.parse(datastring.substr(1, datastring.length - 2));
  $('#ltr').val(data['ltr']);
  $('#ltr_factor').val(data['ltr_factor']);
  $('#sp').val(data['sp']);
  $('#build').val(data['build']);
  $('#hero').val(data['hero']);
  $('#gold').val(data['gold']);
  $('#active').prop('checked', data['active']);
  $('#notation').prop('checked', data['notation']);
  $('#unit').prop('checked', data['unit']);
  $('#bospct').val(data['bospct']);
  $('#bosunit').val(data['bosunit']);
  artifact_statuses = data['artifact_statuses'];
  $.each(data['artifact_statuses'], function (k, a) {
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

function shoppingSpree() {
  $.each(db.artifacts, function (k, a) {
    $('#' + a.id).prop('checked', true)
    artifact_statuses[a.id] = 1;
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
        e.name === 'NS_ERROR_DOM_QUOTA_REACHED') &&
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

db = '{"artifacts":{"art1":{"icon":"./images/icons/59.png","type":"damage","inactive_adj":0,"name":"暗影之书","id":"Artifact22","max":0,"effect":0.05,"gmax":0.12,"grate":0.0001,"gexpo":0.5,"ad":0.3,"ccoef":0.7,"cexpo":2.5,"tcoef":0.19999999999999998,"texpo":3.5,"gpeak":1.0862780491200215,"adcalc":0.00006224612021325423,"reductions":{"cs":0,"sc":0,"pet":0,"hs":0,"hscs":0,"hssc":0,"phom":0,"fairy":0,"chest":0,"boss":0},"reductions_orig":{"cs":0,"sc":0,"pet":0,"hs":0,"hscs":0,"hssc":0,"phom":0,"fairy":0,"chest":0,"boss":0},"weffect":0,"wcost":0,"costpct":0,"adpct":0,"calcrelic":0,"calclevel":0,"nickname":"BoS"},"art2":{"icon":"./images/icons/74.png","type":"gold","inactive_adj":0,"name":"瓦如恩之石","id":"Artifact2","max":0,"effect":0.01,"gmax":0.36,"grate":0.00018,"gexpo":0.5,"ad":0.2,"ccoef":0.6,"cexpo":1.8,"tcoef":0.2142857142857143,"texpo":2.8,"gpeak":1.1349008767288886,"adcalc":0.00017197892395895168,"reductions":{"cs":0,"sc":0,"pet":0,"hs":0,"hscs":0,"hssc":0,"phom":3.2,"fairy":3.2,"chest":3.2,"boss":3.2},"reductions_orig":{"cs":0,"sc":0,"pet":0,"hs":0,"hscs":0,"hssc":0,"phom":3.2,"fairy":3.2,"chest":3.2,"boss":3.2},"weffect":0,"wcost":0,"costpct":0,"adpct":0,"calcrelic":0,"calclevel":0,"nickname":"SotV"},"art3":{"icon":"./images/icons/77.png","type":"gold","inactive_adj":0,"name":"满足宝箱","id":"Artifact19","max":0,"effect":0.25,"gmax":0.4,"grate":0.0002,"gexpo":0.5,"ad":0.4,"ccoef":1,"cexpo":1.8,"tcoef":0.35714285714285715,"texpo":2.8,"gpeak":1.1489125293076057,"adcalc":0.007990730189658624,"reductions":{"cs":0,"sc":0,"pet":0,"hs":0,"hscs":0,"hssc":0,"phom":0,"fairy":0.8,"chest":0.8,"boss":0},"reductions_orig":{"cs":0,"sc":0,"pet":0,"hs":0,"hscs":0,"hssc":0,"phom":0,"fairy":0.8,"chest":0.8,"boss":0},"weffect":0,"wcost":0,"costpct":0,"adpct":0,"calcrelic":0,"calclevel":0,"nickname":"CoC"},"art4":{"icon":"./images/icons/84.png","type":"gold","inactive_adj":0,"name":"英勇之盾","id":"Artifact1","max":0,"effect":0.2,"gmax":0.4,"grate":0.0002,"gexpo":0.5,"ad":0.4,"ccoef":0.7,"cexpo":1.8,"tcoef":0.25,"texpo":2.8,"gpeak":1.1489125293076057,"adcalc":0.0029434792514304794,"reductions":{"cs":0,"sc":0,"pet":0,"hs":0,"hscs":0,"hssc":0,"phom":0.8,"fairy":0,"chest":0,"boss":0.8},"reductions_orig":{"cs":0,"sc":0,"pet":0,"hs":0,"hscs":0,"hssc":0,"phom":0.8,"fairy":0,"chest":0,"boss":0.8},"weffect":0,"wcost":0,"costpct":0,"adpct":0,"calcrelic":0,"calclevel":0,"nickname":"HSh"},"art5":{"icon":"./images/icons/52.png","type":"gold","inactive_adj":0,"name":"预言之书","id":"Artifact20","max":0,"effect":0.2,"gmax":0.4,"grate":0.00015,"gexpo":0.5,"ad":0.3,"ccoef":0.7,"cexpo":2.2,"tcoef":0.21874999999999997,"texpo":3.2,"gpeak":1.216552506059644,"adcalc":0.00021491780548291517,"reductions":{"cs":0,"sc":0,"pet":0,"hs":0,"hscs":0,"hssc":0,"phom":0.8,"fairy":0.8,"chest":0.8,"boss":0.8},"reductions_orig":{"cs":0,"sc":0,"pet":0,"hs":0,"hscs":0,"hssc":0,"phom":0.8,"fairy":0.8,"chest":0.8,"boss":0.8},"weffect":0,"wcost":0,"costpct":0,"adpct":0,"calcrelic":0,"calclevel":0,"nickname":"BoP"},"art6":{"icon":"./images/icons/35.png","type":"gold","inactive_adj":0.8,"name":"Khrysos碗","id":"Artifact66","max":0,"effect":0.04,"gmax":0.4,"grate":0.0002,"gexpo":0.5,"ad":0.3,"ccoef":0.7,"cexpo":1.8,"tcoef":0.25,"texpo":2.8,"gpeak":1.1489125293076057,"adcalc":0.0010833251850372824,"reductions":{"cs":0,"sc":0,"pet":0,"hs":0,"hscs":0,"hssc":0,"phom":1.6,"fairy":1.6,"chest":1.6,"boss":1.6},"reductions_orig":{"cs":0,"sc":0,"pet":0,"hs":0,"hscs":0,"hssc":0,"phom":1.6,"fairy":1.6,"chest":1.6,"boss":1.6},"weffect":0,"wcost":0,"costpct":0,"adpct":0,"calcrelic":0,"calclevel":0,"nickname":"KB"},"art7":{"icon":"./images/icons/42.png","type":"gold","inactive_adj":0.8,"name":"扎金索斯银币","id":"Artifact43","max":0,"effect":0.6,"gmax":0.4,"grate":0.0002,"gexpo":0.5,"ad":0.3,"ccoef":0.7,"cexpo":1.8,"tcoef":0.25,"texpo":2.8,"gpeak":1.1489125293076057,"adcalc":0.0010833251850372824,"reductions":{"cs":0,"sc":0,"pet":0,"hs":0,"hscs":0,"hssc":0,"phom":0.8,"fairy":0.8,"chest":0.8,"boss":0.8},"reductions_orig":{"cs":0,"sc":0,"pet":0,"hs":0,"hscs":0,"hssc":0,"phom":0.8,"fairy":0.8,"chest":0.8,"boss":0.8},"weffect":0,"wcost":0,"costpct":0,"adpct":0,"calcrelic":0,"calclevel":0,"nickname":"ZC"},"art8":{"icon":"./images/icons/43.png","type":"gold","inactive_adj":0,"name":"崇高仙子徽章","id":"Artifact44","max":0,"effect":0.3,"gmax":0.4,"grate":0.00018,"gexpo":0.5,"ad":0.4,"ccoef":1,"cexpo":1.8,"tcoef":0.35714285714285715,"texpo":2.8,"gpeak":1.1489125293076057,"adcalc":0.007990730189658624,"reductions":{"cs":0,"sc":0,"pet":0,"hs":0,"hscs":0,"hssc":0,"phom":0,"fairy":0.8,"chest":0,"boss":0},"reductions_orig":{"cs":0,"sc":0,"pet":0,"hs":0,"hscs":0,"hssc":0,"phom":0,"fairy":0.8,"chest":0,"boss":0},"weffect":0,"wcost":0,"costpct":0,"adpct":0,"calcrelic":0,"calclevel":0,"nickname":"GFM"},"art9":{"icon":"./images/icons/44.png","type":"gold","inactive_adj":0,"name":"猫雕塑","id":"Artifact45","max":0,"effect":0.3,"gmax":0.4,"grate":0.0002,"gexpo":0.5,"ad":0.5,"ccoef":0.7,"cexpo":1.8,"tcoef":0.25,"texpo":2.8,"gpeak":1.1489125293076057,"adcalc":0.006391116839799162,"reductions":{"cs":0,"sc":0,"pet":0,"hs":0,"hscs":0,"hssc":0,"phom":0.8,"fairy":0,"chest":0,"boss":0},"reductions_orig":{"cs":0,"sc":0,"pet":0,"hs":0,"hscs":0,"hssc":0,"phom":0.8,"fairy":0,"chest":0,"boss":0},"weffect":0,"wcost":0,"costpct":0,"adpct":0,"calcrelic":0,"calclevel":0,"nickname":"NS"},"art10":{"icon":"./images/icons/17.png","type":"gold","inactive_adj":0,"name":"惠比须神银币","id":"Artifact79","max":0,"effect":0.2,"gmax":0.4,"grate":0.0002,"gexpo":0.5,"ad":0.3,"ccoef":0.7,"cexpo":1.8,"tcoef":0.25,"texpo":2.8,"gpeak":1.1489125293076057,"adcalc":0.0010833251850372824,"reductions":{"cs":0,"sc":0,"pet":0,"hs":0,"hscs":0,"hssc":0,"phom":0,"fairy":0,"chest":0.8,"boss":0},"reductions_orig":{"cs":0,"sc":0,"pet":0,"hs":0,"hscs":0,"hssc":0,"phom":0,"fairy":0,"chest":0.8,"boss":0},"weffect":0,"wcost":0,"costpct":0,"adpct":0,"calcrelic":0,"calclevel":0,"nickname":"CoE"},"art11":{"icon":"./images/icons/28.png","type":"gold","inactive_adj":0,"name":"古铜色的指南针","id":"Artifact82","max":0,"effect":0.04,"gmax":0.32,"grate":0.00015,"gexpo":0.5,"ad":0.3,"ccoef":0.7,"cexpo":1.8,"tcoef":0.25,"texpo":2.8,"gpeak":1.120714058089752,"adcalc":0.0010833251850372824,"reductions":{"cs":0,"sc":0,"pet":0,"hs":0,"hscs":0,"hssc":0,"phom":0.8,"fairy":0.8,"chest":0,"boss":0},"reductions_orig":{"cs":0,"sc":0,"pet":0,"hs":0,"hscs":0,"hssc":0,"phom":0.8,"fairy":0.8,"chest":0,"boss":0},"weffect":0,"wcost":0,"costpct":0,"adpct":0,"calcrelic":0,"calclevel":0,"nickname":"TBC"},"art12":{"icon":"./images/icons/03.png","type":"damage","inactive_adj":0,"name":"独奏者的长笛","id":"Artifact84","max":0,"effect":0.01,"gmax":0.24,"grate":0.0001,"gexpo":0.5,"ad":0.2,"ccoef":0.6,"cexpo":2.2,"tcoef":0.18749999999999997,"texpo":3.2,"gpeak":1.1349008767288886,"adcalc":0.000026230430100569686,"reductions":{"cs":4,"sc":4,"pet":4,"hs":4,"hscs":4,"hssc":4,"phom":0,"fairy":0,"chest":0,"boss":0},"reductions_orig":{"cs":4,"sc":4,"pet":4,"hs":4,"hscs":4,"hssc":4,"phom":0,"fairy":0,"chest":0,"boss":0},"weffect":0,"wcost":0,"costpct":0,"adpct":0,"calcrelic":0,"calclevel":0,"nickname":"FotS"},"art13":{"icon":"./images/icons/73.png","type":"damage","inactive_adj":0,"name":"天堂之剑","id":"Artifact26","max":0,"effect":0.05,"gmax":0.4,"grate":0.00025,"gexpo":0.5,"ad":1,"ccoef":0.7,"cexpo":2.2,"tcoef":0.21874999999999997,"texpo":3.2,"gpeak":1.216552506059644,"adcalc":0.02561893957796599,"reductions":{"cs":1,"sc":1,"pet":1,"hs":1,"hscs":1,"hssc":1,"phom":0,"fairy":0,"chest":0,"boss":0},"reductions_orig":{"cs":1,"sc":1,"pet":1,"hs":1,"hscs":1,"hssc":1,"phom":0,"fairy":0,"chest":0,"boss":0},"weffect":0,"wcost":0,"costpct":0,"adpct":0,"calcrelic":0,"calclevel":0,"nickname":"HSw"},"art14":{"icon":"./images/icons/89.png","type":"damage","inactive_adj":0,"name":"神圣报应","id":"Artifact31","max":0,"effect":0.1,"gmax":0.32,"grate":0.00015,"gexpo":0.5,"ad":1,"ccoef":1,"cexpo":2,"tcoef":0.3333333333333333,"texpo":3,"gpeak":1.1489125293076057,"adcalc":0.125,"reductions":{"cs":1,"sc":1,"pet":1,"hs":1,"hscs":1,"hssc":1,"phom":0,"fairy":0,"chest":0,"boss":0},"reductions_orig":{"cs":1,"sc":1,"pet":1,"hs":1,"hscs":1,"hssc":1,"phom":0,"fairy":0,"chest":0,"boss":0},"weffect":0,"wcost":0,"costpct":0,"adpct":0,"calcrelic":0,"calclevel":0,"nickname":"DR"},"art15":{"icon":"./images/icons/72.png","type":"damage","inactive_adj":0,"name":"醉汉榔头","id":"Artifact29","max":0,"effect":0.1,"gmax":0.4,"grate":0.0002,"gexpo":0.5,"ad":0.3,"ccoef":0.6,"cexpo":1.7,"tcoef":0.2222222222222222,"texpo":2.7,"gpeak":1.131370849898476,"adcalc":0.0010639657644663505,"reductions":{"cs":0,"sc":0.6,"pet":1,"hs":1,"hscs":0.6,"hssc":0.76,"phom":0,"fairy":0,"chest":0,"boss":0},"reductions_orig":{"cs":0,"sc":0.6,"pet":1,"hs":1,"hscs":0.6,"hssc":0.76,"phom":0,"fairy":0,"chest":0,"boss":0},"weffect":0,"wcost":0,"costpct":0,"adpct":0,"calcrelic":0,"calclevel":0,"nickname":"DH"},"art16":{"icon":"./images/icons/37.png","type":"damage","inactive_adj":0,"name":"萨摩赛克之剑","id":"Artifact51","max":0,"effect":0.1,"gmax":0.32,"grate":0.00014,"gexpo":0.5,"ad":0.5,"ccoef":0.7,"cexpo":2,"tcoef":0.2333333333333333,"texpo":3,"gpeak":1.1489125293076057,"adcalc":0.0032475793271738982,"reductions":{"cs":0,"sc":0.6,"pet":0,"hs":0.8,"hscs":0.48,"hssc":0.68,"phom":0,"fairy":0,"chest":0,"boss":0},"reductions_orig":{"cs":0,"sc":0.6,"pet":0,"hs":0.8,"hscs":0.48,"hssc":0.68,"phom":0,"fairy":0,"chest":0,"boss":0},"weffect":0,"wcost":0,"costpct":0,"adpct":0,"calcrelic":0,"calclevel":0,"nickname":"SS"},"art17":{"icon":"./images/icons/11.png","type":"damage","inactive_adj":0,"name":"复仇者","id":"Artifact59","max":0,"effect":0.1,"gmax":0.4,"grate":0.0002,"gexpo":0.5,"ad":0.2,"ccoef":0.6,"cexpo":1.7,"tcoef":0.2222222222222222,"texpo":2.7,"gpeak":1.131370849898476,"adcalc":0.0002734930009810371,"reductions":{"cs":1,"sc":1,"pet":1,"hs":1,"hscs":1,"hssc":1,"phom":0,"fairy":0,"chest":0,"boss":0},"reductions_orig":{"cs":1,"sc":1,"pet":1,"hs":1,"hscs":1,"hssc":1,"phom":0,"fairy":0,"chest":0,"boss":0},"weffect":0,"wcost":0,"costpct":0,"adpct":0,"calcrelic":0,"calclevel":0,"nickname":"Ret"},"art18":{"icon":"./images/icons/06.png","type":"damage","inactive_adj":0,"name":"Stryfe的和平","id":"Artifact83","max":0,"effect":0.04,"gmax":0.32,"grate":0.00015,"gexpo":0.5,"ad":1,"ccoef":1,"cexpo":2,"tcoef":0.3333333333333333,"texpo":3,"gpeak":1.1489125293076057,"adcalc":0.125,"reductions":{"cs":1,"sc":1.2,"pet":1.5,"hs":1.5,"hscs":1.3,"hssc":1.32,"phom":0,"fairy":0,"chest":0,"boss":0},"reductions_orig":{"cs":1,"sc":1.2,"pet":1.5,"hs":1.5,"hscs":1.3,"hssc":1.32,"phom":0,"fairy":0,"chest":0,"boss":0},"weffect":0,"wcost":0,"costpct":0,"adpct":0,"calcrelic":0,"calclevel":0,"nickname":"SP"},"art19":{"icon":"./images/icons/79.png","type":"damage","inactive_adj":0,"name":"英雄之刃","id":"Artifact35","max":0,"effect":0.15,"gmax":0.4,"grate":0.0002,"gexpo":0.5,"ad":0.5,"ccoef":0.7,"cexpo":1.7,"tcoef":0.25925925925925924,"texpo":2.7,"gpeak":1.131370849898476,"adcalc":0.008932493152355395,"reductions":{"cs":1,"sc":0.6,"pet":0.5,"hs":0.5,"hscs":0.7,"hssc":0.56,"phom":0,"fairy":0,"chest":0,"boss":0},"reductions_orig":{"cs":1,"sc":0.6,"pet":0.5,"hs":0.5,"hscs":0.7,"hssc":0.56,"phom":0,"fairy":0,"chest":0,"boss":0},"weffect":0,"wcost":0,"costpct":0,"adpct":0,"calcrelic":0,"calclevel":0,"nickname":"HB"},"art20":{"icon":"./images/icons/80.png","type":"hero","inactive_adj":0,"name":"风暴之剑","id":"Artifact32","max":0,"effect":0.2,"gmax":0.4,"grate":0.0002,"gexpo":0.5,"ad":0.3,"ccoef":0.7,"cexpo":1.7,"tcoef":0.25925925925925924,"texpo":2.7,"gpeak":1.131370849898476,"adcalc":0.0016131842966470114,"reductions":{"cs":1,"sc":0.6,"pet":0.5,"hs":0.5,"hscs":0.7,"hssc":0.56,"phom":0,"fairy":0,"chest":0,"boss":0},"reductions_orig":{"cs":1,"sc":0.6,"pet":0.5,"hs":0.5,"hscs":0.7,"hssc":0.56,"phom":0,"fairy":0,"chest":0,"boss":0},"weffect":0,"wcost":0,"costpct":0,"adpct":0,"calcrelic":0,"calclevel":0,"nickname":"TSS"},"art21":{"icon":"./images/icons/86.png","type":"hero","inactive_adj":0,"name":"复仇女神之弓","id":"Artifact33","max":0,"effect":0.2,"gmax":0.4,"grate":0.0002,"gexpo":0.5,"ad":0.3,"ccoef":0.7,"cexpo":1.7,"tcoef":0.25925925925925924,"texpo":2.7,"gpeak":1.131370849898476,"adcalc":0.0016131842966470114,"reductions":{"cs":1,"sc":0.6,"pet":0.5,"hs":0.5,"hscs":0.7,"hssc":0.56,"phom":0,"fairy":0,"chest":0,"boss":0},"reductions_orig":{"cs":1,"sc":0.6,"pet":0.5,"hs":0.5,"hscs":0.7,"hssc":0.56,"phom":0,"fairy":0,"chest":0,"boss":0},"weffect":0,"wcost":0,"costpct":0,"adpct":0,"calcrelic":0,"calclevel":0,"nickname":"FB"},"art22":{"icon":"./images/icons/75.png","type":"hero","inactive_adj":0,"name":"古代护身符","id":"Artifact34","max":0,"effect":0.2,"gmax":0.4,"grate":0.0002,"gexpo":0.5,"ad":0.3,"ccoef":0.7,"cexpo":1.7,"tcoef":0.25925925925925924,"texpo":2.7,"gpeak":1.131370849898476,"adcalc":0.0016131842966470114,"reductions":{"cs":1,"sc":0.6,"pet":0.5,"hs":0.5,"hscs":0.7,"hssc":0.56,"phom":0,"fairy":0,"chest":0,"boss":0},"reductions_orig":{"cs":1,"sc":0.6,"pet":0.5,"hs":0.5,"hscs":0.7,"hssc":0.56,"phom":0,"fairy":0,"chest":0,"boss":0},"weffect":0,"wcost":0,"costpct":0,"adpct":0,"calcrelic":0,"calclevel":0,"nickname":"CotA"},"art23":{"icon":"./images/icons/04.png","type":"hero","inactive_adj":0,"name":"迷你世界树","id":"Artifact61","max":0,"effect":0.2,"gmax":0.4,"grate":0.0002,"gexpo":0.5,"ad":0.3,"ccoef":0.7,"cexpo":1.7,"tcoef":0.25925925925925924,"texpo":2.7,"gpeak":1.131370849898476,"adcalc":0.0016131842966470114,"reductions":{"cs":1,"sc":0.6,"pet":0.5,"hs":0.5,"hscs":0.7,"hssc":0.56,"phom":0,"fairy":0,"chest":0,"boss":0},"reductions_orig":{"cs":1,"sc":0.6,"pet":0.5,"hs":0.5,"hscs":0.7,"hssc":0.56,"phom":0,"fairy":0,"chest":0,"boss":0},"weffect":0,"wcost":0,"costpct":0,"adpct":0,"calcrelic":0,"calclevel":0,"nickname":"TTT"},"art24":{"icon":"./images/icons/31.png","type":"hero","inactive_adj":0,"name":"埃尔密斯头盔","id":"Artifact62","max":0,"effect":0.2,"gmax":0.4,"grate":0.0002,"gexpo":0.5,"ad":0.3,"ccoef":0.7,"cexpo":1.7,"tcoef":0.25925925925925924,"texpo":2.7,"gpeak":1.131370849898476,"adcalc":0.0016131842966470114,"reductions":{"cs":1,"sc":0.6,"pet":0.5,"hs":0.5,"hscs":0.7,"hssc":0.56,"phom":0,"fairy":0,"chest":0,"boss":0},"reductions_orig":{"cs":1,"sc":0.6,"pet":0.5,"hs":0.5,"hscs":0.7,"hssc":0.56,"phom":0,"fairy":0,"chest":0,"boss":0},"weffect":0,"wcost":0,"costpct":0,"adpct":0,"calcrelic":0,"calclevel":0,"nickname":"HoH"},"art25":{"icon":"./images/icons/49.png","type":"damage","inactive_adj":0,"name":"伊甸之果","id":"Artifact38","max":0,"effect":0.1,"gmax":0.4,"grate":0.00015,"gexpo":0.5,"ad":0.5,"ccoef":0.7,"cexpo":2,"tcoef":0.2333333333333333,"texpo":3,"gpeak":1.1832159566199232,"adcalc":0.0032475793271738982,"reductions":{"cs":0,"sc":0,"pet":1,"hs":0,"hscs":0,"hssc":0,"phom":0,"fairy":0,"chest":0,"boss":0},"reductions_orig":{"cs":0,"sc":0,"pet":1,"hs":0,"hscs":0,"hssc":0,"phom":0,"fairy":0,"chest":0,"boss":0},"weffect":0,"wcost":0,"costpct":0,"adpct":0,"calcrelic":0,"calclevel":0,"nickname":"FoE"},"art26":{"icon":"./images/icons/87.png","type":"damage","inactive_adj":0,"name":"感化灵药","id":"Artifact30","max":0,"effect":0.1,"gmax":0.4,"grate":0.00015,"gexpo":0.5,"ad":0.5,"ccoef":0.7,"cexpo":1.7,"tcoef":0.25925925925925924,"texpo":2.7,"gpeak":1.131370849898476,"adcalc":0.008932493152355395,"reductions":{"cs":1,"sc":0,"pet":0,"hs":0,"hscs":0.4,"hssc":0,"phom":0,"fairy":0,"chest":0,"boss":0},"reductions_orig":{"cs":1,"sc":0,"pet":0,"hs":0,"hscs":0.4,"hssc":0,"phom":0,"fairy":0,"chest":0,"boss":0},"weffect":0,"wcost":0,"costpct":0,"adpct":0,"calcrelic":0,"calclevel":0,"nickname":"IE"},"art27":{"icon":"./images/icons/30.png","type":"damage","inactive_adj":0,"name":"奥莱恩护身符","id":"Artifact64","max":0,"effect":0.1,"gmax":0.4,"grate":0.00015,"gexpo":0.5,"ad":0.5,"ccoef":0.7,"cexpo":1.8,"tcoef":0.25,"texpo":2.8,"gpeak":1.1489125293076057,"adcalc":0.006391116839799162,"reductions":{"cs":1,"sc":1,"pet":1,"hs":0,"hscs":0.4,"hssc":0.6,"phom":0,"fairy":0,"chest":0,"boss":0},"reductions_orig":{"cs":1,"sc":1,"pet":1,"hs":0,"hscs":0.4,"hssc":0.6,"phom":0,"fairy":0,"chest":0,"boss":0},"weffect":0,"wcost":0,"costpct":0,"adpct":0,"calcrelic":0,"calclevel":0,"nickname":"ORC"},"art28":{"icon":"./images/icons/40.png","type":"damage","inactive_adj":0,"name":"风暴之心","id":"Artifact52","max":0,"effect":0.005,"gmax":0.32,"grate":0.00015,"gexpo":0.5,"ad":0.5,"ccoef":0.7,"cexpo":2.2,"tcoef":0.21874999999999997,"texpo":3.2,"gpeak":1.1764352935882194,"adcalc":0.0016338311061244878,"reductions":{"cs":6,"sc":5.6,"pet":6,"hs":6,"hscs":6,"hssc":5.76,"phom":0,"fairy":0,"chest":0,"boss":0},"reductions_orig":{"cs":6,"sc":5.6,"pet":6,"hs":6,"hscs":6,"hssc":5.76,"phom":0,"fairy":0,"chest":0,"boss":0},"weffect":0,"wcost":0,"costpct":0,"adpct":0,"calcrelic":0,"calclevel":0,"nickname":"HoS"},"art29":{"icon":"./images/icons/38.png","type":"gold","inactive_adj":0,"name":"太阳神之石","id":"Artifact53","max":0,"effect":0.02,"gmax":0.32,"grate":0.00015,"gexpo":0.5,"ad":0.5,"ccoef":0.7,"cexpo":2.2,"tcoef":0.21874999999999997,"texpo":3.2,"gpeak":1.1764352935882194,"adcalc":0.0016338311061244878,"reductions":{"cs":0,"sc":0,"pet":0,"hs":0,"hscs":0,"hssc":0,"phom":1.6,"fairy":1.6,"chest":1.6,"boss":1.6},"reductions_orig":{"cs":0,"sc":0,"pet":0,"hs":0,"hscs":0,"hssc":0,"phom":1.6,"fairy":1.6,"chest":1.6,"boss":1.6},"weffect":0,"wcost":0,"costpct":0,"adpct":0,"calcrelic":0,"calclevel":0,"nickname":"AO"},"art30":{"icon":"./images/icons/33.png","type":"damage","inactive_adj":1,"name":"Portara的耳环","id":"Artifact67","max":0,"effect":0.03,"gmax":0.4,"grate":0.0002,"gexpo":0.5,"ad":0.3,"ccoef":0.6,"cexpo":1.7,"tcoef":0.2222222222222222,"texpo":2.7,"gpeak":1.131370849898476,"adcalc":0.0010639657644663505,"reductions":{"cs":2,"sc":2,"pet":2,"hs":2,"hscs":2,"hssc":2,"phom":0,"fairy":0,"chest":0,"boss":0},"reductions_orig":{"cs":2,"sc":2,"pet":2,"hs":2,"hscs":2,"hssc":2,"phom":0,"fairy":0,"chest":0,"boss":0},"weffect":0,"wcost":0,"costpct":0,"adpct":0,"calcrelic":0,"calclevel":0,"nickname":"EoP"},"art31":{"icon":"./images/icons/55.png","type":"damage","inactive_adj":1,"name":"仙鸟之羽","id":"Artifact42","max":0,"effect":0.5,"gmax":0.4,"grate":0.0002,"gexpo":0.5,"ad":0.3,"ccoef":0.6,"cexpo":1.7,"tcoef":0.2222222222222222,"texpo":2.7,"gpeak":1.131370849898476,"adcalc":0.0010639657644663505,"reductions":{"cs":1,"sc":1,"pet":1,"hs":1,"hscs":1,"hssc":1,"phom":0,"fairy":0,"chest":0,"boss":0},"reductions_orig":{"cs":1,"sc":1,"pet":1,"hs":1,"hscs":1,"hssc":1,"phom":0,"fairy":0,"chest":0,"boss":0},"weffect":0,"wcost":0,"costpct":0,"adpct":0,"calcrelic":0,"calclevel":0,"nickname":"AF"},"art32":{"icon":"./images/icons/45.png","type":"damage","inactive_adj":0,"name":"腐败符文之心","id":"Artifact46","max":0,"effect":0.00025,"gmax":0.4,"grate":0.0002,"gexpo":0.5,"ad":0.3,"ccoef":0.6,"cexpo":1.7,"tcoef":0.2222222222222222,"texpo":2.7,"gpeak":1.131370849898476,"adcalc":0.0010639657644663505,"reductions":{"cs":0,"sc":0,"pet":0,"hs":0,"hscs":0,"hssc":0,"phom":0,"fairy":0,"chest":0,"boss":0},"reductions_orig":{"cs":0,"sc":0,"pet":0,"hs":0,"hscs":0,"hssc":0,"phom":0,"fairy":0,"chest":0,"boss":0},"weffect":0,"wcost":0,"costpct":0,"adpct":0,"calcrelic":0,"calclevel":0,"nickname":"CRH"},"art33":{"icon":"./images/icons/15.png","type":"damage","inactive_adj":0,"name":"迪朗达尔之剑","id":"Artifact55","max":0,"effect":0.24,"gmax":0.32,"grate":0.00015,"gexpo":0.5,"ad":1,"ccoef":1,"cexpo":2,"tcoef":0.3333333333333333,"texpo":3,"gpeak":1.1489125293076057,"adcalc":0.125,"reductions":{"cs":0,"sc":0,"pet":0,"hs":0,"hscs":0,"hssc":0,"phom":0,"fairy":0,"chest":0,"boss":0},"reductions_orig":{"cs":0,"sc":0,"pet":0,"hs":0,"hscs":0,"hssc":0,"phom":0,"fairy":0,"chest":0,"boss":0},"weffect":0,"wcost":0,"costpct":0,"adpct":0,"calcrelic":0,"calclevel":0,"nickname":"DSw"},"art34":{"icon":"./images/icons/29.png","type":"damage","inactive_adj":0,"name":"冥界头骨","id":"Artifact56","max":0,"effect":0.12,"gmax":0.32,"grate":0.00015,"gexpo":0.5,"ad":1,"ccoef":1,"cexpo":2,"tcoef":0.3333333333333333,"texpo":3,"gpeak":1.1489125293076057,"adcalc":0.125,"reductions":{"cs":1,"sc":1,"pet":1,"hs":1,"hscs":1,"hssc":1,"phom":0,"fairy":0,"chest":0,"boss":0},"reductions_orig":{"cs":1,"sc":1,"pet":1,"hs":1,"hscs":1,"hssc":1,"phom":0,"fairy":0,"chest":0,"boss":0},"weffect":0,"wcost":0,"costpct":0,"adpct":0,"calcrelic":0,"calclevel":0,"nickname":"HSk"},"art35":{"icon":"./images/icons/26.png","type":"damage","inactive_adj":0,"name":"誓言的负担","id":"Artifact75","max":0,"effect":0.02,"gmax":0.32,"grate":0.00015,"gexpo":0.5,"ad":0.5,"ccoef":0.65,"cexpo":2.2,"tcoef":0.203125,"texpo":3.2,"gpeak":1.1764352935882194,"adcalc":0.001288890947507273,"reductions":{"cs":0,"sc":1.2,"pet":3,"hs":2,"hscs":1.2,"hssc":1.52,"phom":0,"fairy":0,"chest":0,"boss":0},"reductions_orig":{"cs":0,"sc":1.2,"pet":3,"hs":2,"hscs":1.2,"hssc":1.52,"phom":0,"fairy":0,"chest":0,"boss":0},"weffect":0,"wcost":0,"costpct":0,"adpct":0,"calcrelic":0,"calclevel":0,"nickname":"OB"},"art36":{"icon":"./images/icons/25.png","type":"damage","inactive_adj":0,"name":"星座之冠","id":"Artifact76","max":0,"effect":0.02,"gmax":0.32,"grate":0.00015,"gexpo":0.5,"ad":0.5,"ccoef":0.65,"cexpo":2.2,"tcoef":0.203125,"texpo":3.2,"gpeak":1.1764352935882194,"adcalc":0.001288890947507273,"reductions":{"cs":3,"sc":1.2,"pet":1,"hs":1,"hscs":1.8,"hssc":1.12,"phom":0,"fairy":0,"chest":0,"boss":0},"reductions_orig":{"cs":3,"sc":1.2,"pet":1,"hs":1,"hscs":1.8,"hssc":1.12,"phom":0,"fairy":0,"chest":0,"boss":0},"weffect":0,"wcost":0,"costpct":0,"adpct":0,"calcrelic":0,"calclevel":0,"nickname":"CotC"},"art37":{"icon":"./images/icons/27.png","type":"damage","inactive_adj":0,"name":"二氧化钛的权杖","id":"Artifact77","max":0,"effect":0.02,"gmax":0.32,"grate":0.00015,"gexpo":0.5,"ad":0.5,"ccoef":0.65,"cexpo":2.2,"tcoef":0.203125,"texpo":3.2,"gpeak":1.1764352935882194,"adcalc":0.001288890947507273,"reductions":{"cs":0.8,"sc":1.8,"pet":0.8,"hs":1.8,"hscs":1.4,"hssc":1.8,"phom":0,"fairy":0,"chest":0,"boss":0},"reductions_orig":{"cs":0.8,"sc":1.8,"pet":0.8,"hs":1.8,"hscs":1.4,"hssc":1.8,"phom":0,"fairy":0,"chest":0,"boss":0},"weffect":0,"wcost":0,"costpct":0,"adpct":0,"calcrelic":0,"calclevel":0,"nickname":"TSc"},"art38":{"icon":"./images/icons/24.png","type":"damage","inactive_adj":1.8,"name":"费金之握","id":"Artifact78","max":0,"effect":0.02,"gmax":0.32,"grate":0.00015,"gexpo":0.5,"ad":0.5,"ccoef":0.65,"cexpo":2.2,"tcoef":0.203125,"texpo":3.2,"gpeak":1.1764352935882194,"adcalc":0.001288890947507273,"reductions":{"cs":2.3,"sc":2.4000000000000004,"pet":2.4000000000000004,"hs":2.4000000000000004,"hscs":2.3600000000000003,"hssc":2.4000000000000004,"phom":0,"fairy":0,"chest":0,"boss":0},"reductions_orig":{"cs":2.3,"sc":2.4000000000000004,"pet":2.4000000000000004,"hs":2.4000000000000004,"hscs":2.3600000000000003,"hssc":2.4000000000000004,"phom":0,"fairy":0,"chest":0,"boss":0},"weffect":0,"wcost":0,"costpct":0,"adpct":0,"calcrelic":0,"calclevel":0,"nickname":"FG"},"art39":{"icon":"./images/icons/53.png","type":"damage","inactive_adj":0,"name":"卡利斯托之戒","id":"Artifact40","max":0,"effect":0.01,"gmax":0.32,"grate":0.00015,"gexpo":0.5,"ad":0.5,"ccoef":0.65,"cexpo":2.2,"tcoef":0.203125,"texpo":3.2,"gpeak":1.1764352935882194,"adcalc":0.001288890947507273,"reductions":{"cs":4.8,"sc":4.4,"pet":4.3,"hs":3.6,"hscs":4.08,"hssc":4.08,"phom":0,"fairy":0,"chest":0,"boss":0},"reductions_orig":{"cs":4.8,"sc":4.4,"pet":4.3,"hs":3.6,"hscs":4.08,"hssc":4.08,"phom":0,"fairy":0,"chest":0,"boss":0},"weffect":0,"wcost":0,"costpct":0,"adpct":0,"calcrelic":0,"calclevel":0,"nickname":"RoC"},"art40":{"icon":"./images/icons/81.png","type":"damage","inactive_adj":0,"name":"达摩克利斯之剑","id":"Artifact25","max":0,"effect":0.08,"gmax":0.32,"grate":0.00015,"gexpo":0.5,"ad":0.5,"ccoef":0.65,"cexpo":2,"tcoef":0.21666666666666667,"texpo":3,"gpeak":1.1489125293076057,"adcalc":0.002600193798032455,"reductions":{"cs":1,"sc":1,"pet":1,"hs":1,"hscs":1,"hssc":1,"phom":0,"fairy":0,"chest":0,"boss":0},"reductions_orig":{"cs":1,"sc":1,"pet":1,"hs":1,"hscs":1,"hssc":1,"phom":0,"fairy":0,"chest":0,"boss":0},"weffect":0,"wcost":0,"costpct":0,"adpct":0,"calcrelic":0,"calclevel":0,"nickname":"BoD"},"art41":{"icon":"./images/icons/51.png","type":"damage","inactive_adj":0,"name":"疯狂头盔","id":"Artifact17","max":0,"effect":0.08,"gmax":0.32,"grate":0.00015,"gexpo":0.5,"ad":0.5,"ccoef":0.65,"cexpo":2,"tcoef":0.21666666666666667,"texpo":3,"gpeak":1.1489125293076057,"adcalc":0.002600193798032455,"reductions":{"cs":1,"sc":0.6,"pet":0.5,"hs":0.8,"hscs":0.88,"hssc":0.68,"phom":0,"fairy":0,"chest":0,"boss":0},"reductions_orig":{"cs":1,"sc":0.6,"pet":0.5,"hs":0.8,"hscs":0.88,"hssc":0.68,"phom":0,"fairy":0,"chest":0,"boss":0},"weffect":0,"wcost":0,"costpct":0,"adpct":0,"calcrelic":0,"calclevel":0,"nickname":"HoM"},"art42":{"icon":"./images/icons/66.png","type":"gold","inactive_adj":0,"name":"钛钢镀饰","id":"Artifact23","max":0,"effect":0.08,"gmax":0.32,"grate":0.00015,"gexpo":0.5,"ad":0.5,"ccoef":0.65,"cexpo":2,"tcoef":0.21666666666666667,"texpo":3,"gpeak":1.1489125293076057,"adcalc":0.002600193798032455,"reductions":{"cs":0,"sc":0,"pet":0,"hs":0,"hscs":0,"hssc":0,"phom":0.8,"fairy":0.8,"chest":0.8,"boss":0.8},"reductions_orig":{"cs":0,"sc":0,"pet":0,"hs":0,"hscs":0,"hssc":0,"phom":0.8,"fairy":0.8,"chest":0.8,"boss":0.8},"weffect":0,"wcost":0,"costpct":0,"adpct":0,"calcrelic":0,"calclevel":0,"nickname":"TP"},"art43":{"icon":"./images/icons/08.png","type":"damage","inactive_adj":0,"name":"月光手环","id":"Artifact73","max":0,"effect":0.08,"gmax":0.32,"grate":0.00015,"gexpo":0.5,"ad":0.5,"ccoef":0.65,"cexpo":2,"tcoef":0.21666666666666667,"texpo":3,"gpeak":1.1489125293076057,"adcalc":0.002600193798032455,"reductions":{"cs":1,"sc":1,"pet":1,"hs":1,"hscs":1,"hssc":1,"phom":0,"fairy":0,"chest":0,"boss":0},"reductions_orig":{"cs":1,"sc":1,"pet":1,"hs":1,"hscs":1,"hssc":1,"phom":0,"fairy":0,"chest":0,"boss":0},"weffect":0,"wcost":0,"costpct":0,"adpct":0,"calcrelic":0,"calclevel":0,"nickname":"MB"},"art44":{"icon":"./images/icons/82.png","type":"damage","inactive_adj":0,"name":"紫晶之杖","id":"Artifact28","max":0,"effect":0.08,"gmax":0.32,"grate":0.00015,"gexpo":0.5,"ad":0.5,"ccoef":0.65,"cexpo":2,"tcoef":0.21666666666666667,"texpo":3,"gpeak":1.1489125293076057,"adcalc":0.002600193798032455,"reductions":{"cs":1,"sc":1,"pet":1,"hs":0,"hscs":0.4,"hssc":0.6,"phom":0,"fairy":0,"chest":0,"boss":0},"reductions_orig":{"cs":1,"sc":1,"pet":1,"hs":0,"hscs":0.4,"hssc":0.6,"phom":0,"fairy":0,"chest":0,"boss":0},"weffect":0,"wcost":0,"costpct":0,"adpct":0,"calcrelic":0,"calclevel":0,"nickname":"AS"},"art45":{"icon":"./images/icons/20.png","type":"hero","inactive_adj":0,"name":"皇家队之剑","id":"Artifact86","max":0,"effect":0.02,"gmax":0.24,"grate":0.0001,"gexpo":0.5,"ad":0.5,"ccoef":0.7,"cexpo":2.2,"tcoef":0.21874999999999997,"texpo":3.2,"gpeak":1.1349008767288886,"adcalc":0.0016338311061244878,"reductions":{"cs":2,"sc":1.6,"pet":1.5,"hs":1.5,"hscs":1.7,"hssc":1.56,"phom":0,"fairy":0,"chest":0,"boss":0},"reductions_orig":{"cs":2,"sc":1.6,"pet":1.5,"hs":1.5,"hscs":1.7,"hssc":1.56,"phom":0,"fairy":0,"chest":0,"boss":0},"weffect":0,"wcost":0,"costpct":0,"adpct":0,"calcrelic":0,"calclevel":0,"nickname":"SotR"},"art46":{"icon":"./images/icons/19.png","type":"hero","inactive_adj":0,"name":"Spearit的 哨","id":"Artifact87","max":0,"effect":0.02,"gmax":0.24,"grate":0.0001,"gexpo":0.5,"ad":0.5,"ccoef":0.7,"cexpo":2.2,"tcoef":0.21874999999999997,"texpo":3.2,"gpeak":1.1349008767288886,"adcalc":0.0016338311061244878,"reductions":{"cs":2,"sc":1.2,"pet":1,"hs":1.3,"hscs":1.58,"hssc":1.2400000000000002,"phom":0,"fairy":0,"chest":0,"boss":0},"reductions_orig":{"cs":2,"sc":1.2,"pet":1,"hs":1.3,"hscs":1.58,"hssc":1.2400000000000002,"phom":0,"fairy":0,"chest":0,"boss":0},"weffect":0,"wcost":0,"costpct":0,"adpct":0,"calcrelic":0,"calclevel":0,"nickname":"SV"},"art47":{"icon":"./images/icons/21.png","type":"hero","inactive_adj":0,"name":"钴板","id":"Artifact88","max":0,"effect":0.02,"gmax":0.24,"grate":0.0001,"gexpo":0.5,"ad":0.5,"ccoef":0.7,"cexpo":2.2,"tcoef":0.21874999999999997,"texpo":3.2,"gpeak":1.1349008767288886,"adcalc":0.0016338311061244878,"reductions":{"cs":1.8,"sc":1.4,"pet":1.3,"hs":1.3,"hscs":1.5,"hssc":1.36,"phom":0,"fairy":0,"chest":0,"boss":0},"reductions_orig":{"cs":1.8,"sc":1.4,"pet":1.3,"hs":1.3,"hscs":1.5,"hssc":1.36,"phom":0,"fairy":0,"chest":0,"boss":0},"weffect":0,"wcost":0,"costpct":0,"adpct":0,"calcrelic":0,"calclevel":0,"nickname":"TCP"},"art48":{"icon":"./images/icons/14.png","type":"hero","inactive_adj":0,"name":"审判印记","id":"Artifact89","max":0,"effect":0.02,"gmax":0.24,"grate":0.0001,"gexpo":0.5,"ad":0.5,"ccoef":0.7,"cexpo":2.2,"tcoef":0.21874999999999997,"texpo":3.2,"gpeak":1.1349008767288886,"adcalc":0.0016338311061244878,"reductions":{"cs":2,"sc":1.6,"pet":1.5,"hs":1.5,"hscs":1.7,"hssc":1.56,"phom":0,"fairy":0,"chest":0,"boss":0},"reductions_orig":{"cs":2,"sc":1.6,"pet":1.5,"hs":1.5,"hscs":1.7,"hssc":1.56,"phom":0,"fairy":0,"chest":0,"boss":0},"weffect":0,"wcost":0,"costpct":0,"adpct":0,"calcrelic":0,"calclevel":0,"nickname":"SoJ"},"art49":{"icon":"./images/icons/10.png","type":"hero","inactive_adj":0,"name":"守护者的树叶","id":"Artifact90","max":0,"effect":0.02,"gmax":0.24,"grate":0.0001,"gexpo":0.5,"ad":0.5,"ccoef":0.7,"cexpo":2.2,"tcoef":0.21874999999999997,"texpo":3.2,"gpeak":1.1349008767288886,"adcalc":0.0016338311061244878,"reductions":{"cs":2,"sc":1.6,"pet":1.5,"hs":0.5,"hscs":1.1,"hssc":1.1600000000000001,"phom":0,"fairy":0,"chest":0,"boss":0},"reductions_orig":{"cs":2,"sc":1.6,"pet":1.5,"hs":0.5,"hscs":1.1,"hssc":1.1600000000000001,"phom":0,"fairy":0,"chest":0,"boss":0},"weffect":0,"wcost":0,"costpct":0,"adpct":0,"calcrelic":0,"calclevel":0,"nickname":"FotK"},"art50":{"icon":"./images/icons/46.png","type":"damage","inactive_adj":0,"name":"入侵者的海姆达尔之角","id":"Artifact47","max":0,"effect":0.02,"gmax":0.36,"grate":0.00018,"gexpo":0.5,"ad":0.2,"ccoef":0.6,"cexpo":1.8,"tcoef":0.2142857142857143,"texpo":2.8,"gpeak":1.1349008767288886,"adcalc":0.00017197892395895168,"reductions":{"cs":2.3,"sc":3.6,"pet":2.9,"hs":3.9,"hscs":3.26,"hssc":3.72,"phom":0,"fairy":0,"chest":0,"boss":0},"reductions_orig":{"cs":2.3,"sc":3.6,"pet":2.9,"hs":3.9,"hscs":3.26,"hssc":3.72,"phom":0,"fairy":0,"chest":0,"boss":0},"weffect":0,"wcost":0,"costpct":0,"adpct":0,"calcrelic":0,"calclevel":0,"nickname":"IG"},"art51":{"icon":"./images/icons/63.png","type":"damage","inactive_adj":0,"name":"巨人面具","id":"Artifact11","max":0,"effect":0.1,"gmax":0.4,"grate":0.0002,"gexpo":0.5,"ad":0.2,"ccoef":0.6,"cexpo":1.7,"tcoef":0.2222222222222222,"texpo":2.7,"gpeak":1.131370849898476,"adcalc":0.0002734930009810371,"reductions":{"cs":0,"sc":0,"pet":0,"hs":1,"hscs":0.6,"hssc":0.4,"phom":0,"fairy":0,"chest":0,"boss":0},"reductions_orig":{"cs":0,"sc":0,"pet":0,"hs":1,"hscs":0.6,"hssc":0.4,"phom":0,"fairy":0,"chest":0,"boss":0},"weffect":0,"wcost":0,"costpct":0,"adpct":0,"calcrelic":0,"calclevel":0,"nickname":"TM"},"art52":{"icon":"./images/icons/54.png","type":"damage","inactive_adj":0,"name":"皇室毒物","id":"Artifact41","max":0,"effect":0.1,"gmax":0.4,"grate":0.0002,"gexpo":0.5,"ad":0.2,"ccoef":0.6,"cexpo":1.7,"tcoef":0.2222222222222222,"texpo":2.7,"gpeak":1.131370849898476,"adcalc":0.0002734930009810371,"reductions":{"cs":0.5,"sc":0.6,"pet":0.6,"hs":0.6,"hscs":0.56,"hssc":0.6,"phom":0,"fairy":0,"chest":0,"boss":0},"reductions_orig":{"cs":0.5,"sc":0.6,"pet":0.6,"hs":0.6,"hscs":0.56,"hssc":0.6,"phom":0,"fairy":0,"chest":0,"boss":0},"weffect":0,"wcost":0,"costpct":0,"adpct":0,"calcrelic":0,"calclevel":0,"nickname":"RT"},"art53":{"icon":"./images/icons/90.png","type":"gold","inactive_adj":0,"name":"工人垂饰","id":"Artifact9","max":0,"effect":0.1,"gmax":0.4,"grate":0.0002,"gexpo":0.5,"ad":0.2,"ccoef":0.6,"cexpo":1.7,"tcoef":0.2222222222222222,"texpo":2.7,"gpeak":1.131370849898476,"adcalc":0.0002734930009810371,"reductions":{"cs":0,"sc":0,"pet":0,"hs":0,"hscs":0,"hssc":0,"phom":0.48,"fairy":0.48,"chest":0.8,"boss":0.8},"reductions_orig":{"cs":0,"sc":0,"pet":0,"hs":0,"hscs":0,"hssc":0,"phom":0.48,"fairy":0.48,"chest":0.8,"boss":0.8},"weffect":0,"wcost":0,"costpct":0,"adpct":0,"calcrelic":0,"calclevel":0,"nickname":"LP"},"art54":{"icon":"./images/icons/56.png","type":"damage","inactive_adj":0,"name":"诸神黄昏使者","id":"Artifact10","max":0,"effect":0.1,"gmax":0.4,"grate":0.0002,"gexpo":0.5,"ad":0.2,"ccoef":0.6,"cexpo":1.7,"tcoef":0.2222222222222222,"texpo":2.7,"gpeak":1.131370849898476,"adcalc":0.0002734930009810371,"reductions":{"cs":0,"sc":0.6,"pet":1,"hs":1,"hscs":0.6,"hssc":0.76,"phom":0,"fairy":0,"chest":0,"boss":0},"reductions_orig":{"cs":0,"sc":0.6,"pet":1,"hs":1,"hscs":0.6,"hssc":0.76,"phom":0,"fairy":0,"chest":0,"boss":0},"weffect":0,"wcost":0,"costpct":0,"adpct":0,"calcrelic":0,"calclevel":0,"nickname":"BoR"},"art55":{"icon":"./images/icons/68.png","type":"damage","inactive_adj":0,"name":"预知羊皮纸","id":"Artifact7","max":0,"effect":0.1,"gmax":0.4,"grate":0.0002,"gexpo":0.5,"ad":0.2,"ccoef":0.6,"cexpo":1.7,"tcoef":0.2222222222222222,"texpo":2.7,"gpeak":1.131370849898476,"adcalc":0.0002734930009810371,"reductions":{"cs":1,"sc":0.6,"pet":0.5,"hs":0.5,"hscs":0.7,"hssc":0.56,"phom":0,"fairy":0,"chest":0,"boss":0},"reductions_orig":{"cs":1,"sc":0.6,"pet":0.5,"hs":0.5,"hscs":0.7,"hssc":0.56,"phom":0,"fairy":0,"chest":0,"boss":0},"weffect":0,"wcost":0,"costpct":0,"adpct":0,"calcrelic":0,"calclevel":0,"nickname":"PoF"},"art56":{"icon":"./images/icons/60.png","type":"damage","inactive_adj":0,"name":"伊甸灵丹","id":"Artifact6","max":0,"effect":0.1,"gmax":0.4,"grate":0.0002,"gexpo":0.5,"ad":0.2,"ccoef":0.6,"cexpo":1.7,"tcoef":0.2222222222222222,"texpo":2.7,"gpeak":1.131370849898476,"adcalc":0.0002734930009810371,"reductions":{"cs":0,"sc":1,"pet":0,"hs":0,"hscs":0,"hssc":0.6,"phom":0,"fairy":0,"chest":0,"boss":0},"reductions_orig":{"cs":0,"sc":1,"pet":0,"hs":0,"hscs":0,"hssc":0.6,"phom":0,"fairy":0,"chest":0,"boss":0},"weffect":0,"wcost":0,"costpct":0,"adpct":0,"calcrelic":0,"calclevel":0,"nickname":"EoE"},"art57":{"icon":"./images/icons/01.png","type":"damage","inactive_adj":0,"name":"急速沙漏","id":"Artifact65","max":40,"effect":0.02,"gmax":0,"grate":0,"gexpo":1,"ad":0.8,"ccoef":0.5,"cexpo":2.6,"tcoef":0.1388888888888889,"texpo":3.6,"gpeak":1,"adcalc":0.0009760401351785867,"reductions":{"cs":0,"sc":0,"pet":0,"hs":0,"hscs":0,"hssc":0,"phom":0,"fairy":0,"chest":0,"boss":0},"reductions_orig":{"cs":0,"sc":0,"pet":0,"hs":0,"hscs":0,"hssc":0,"phom":0,"fairy":0,"chest":0,"boss":0},"weffect":0,"wcost":0,"costpct":0,"adpct":0,"calcrelic":0,"calclevel":0,"nickname":"HotI"},"art58":{"icon":"./images/icons/47.png","type":"damage","inactive_adj":0,"name":"幻影时钟","id":"Artifact48","max":30,"effect":1,"gmax":0,"grate":0,"gexpo":1,"ad":0.8,"ccoef":1,"cexpo":3,"tcoef":0.25,"texpo":4,"gpeak":1,"adcalc":0.0040784246269494,"reductions":{"cs":0,"sc":0,"pet":0,"hs":0,"hscs":0,"hssc":0,"phom":0,"fairy":0,"chest":0,"boss":0},"reductions_orig":{"cs":0,"sc":0,"pet":0,"hs":0,"hscs":0,"hssc":0,"phom":0,"fairy":0,"chest":0,"boss":0},"weffect":0,"wcost":0,"costpct":0,"adpct":0,"calcrelic":0,"calclevel":0,"nickname":"PT"},"art59":{"icon":"./images/icons/85.png","type":"damage","inactive_adj":0,"name":"禁忌卷轴","id":"Artifact13","max":30,"effect":2,"gmax":0,"grate":0,"gexpo":1,"ad":1.5,"ccoef":0.6,"cexpo":2.4,"tcoef":0.17647058823529413,"texpo":3.4,"gpeak":1,"adcalc":0.04965187083225959,"reductions":{"cs":0,"sc":0,"pet":0,"hs":0,"hscs":0,"hssc":0,"phom":0,"fairy":0,"chest":0,"boss":0},"reductions_orig":{"cs":0,"sc":0,"pet":0,"hs":0,"hscs":0,"hssc":0,"phom":0,"fairy":0,"chest":0,"boss":0},"weffect":0,"wcost":0,"costpct":0,"adpct":0,"calcrelic":0,"calclevel":0,"nickname":"FS"},"art60":{"icon":"./images/icons/58.png","type":"damage","inactive_adj":0,"name":"效忠指环","id":"Artifact15","max":30,"effect":2,"gmax":0,"grate":0,"gexpo":1,"ad":1.5,"ccoef":0.6,"cexpo":2.4,"tcoef":0.17647058823529413,"texpo":3.4,"gpeak":1,"adcalc":0.04965187083225959,"reductions":{"cs":0,"sc":0,"pet":0,"hs":0,"hscs":0,"hssc":0,"phom":0,"fairy":0,"chest":0,"boss":0},"reductions_orig":{"cs":0,"sc":0,"pet":0,"hs":0,"hscs":0,"hssc":0,"phom":0,"fairy":0,"chest":0,"boss":0},"weffect":0,"wcost":0,"costpct":0,"adpct":0,"calcrelic":0,"calclevel":0,"nickname":"RoF"},"art61":{"icon":"./images/icons/70.png","type":"damage","inactive_adj":0,"name":"冰川之斧","id":"Artifact16","max":30,"effect":2,"gmax":0,"grate":0,"gexpo":1,"ad":1.5,"ccoef":0.6,"cexpo":2.4,"tcoef":0.17647058823529413,"texpo":3.4,"gpeak":1,"adcalc":0.04965187083225959,"reductions":{"cs":0,"sc":0,"pet":0,"hs":0,"hscs":0,"hssc":0,"phom":0,"fairy":0,"chest":0,"boss":0},"reductions_orig":{"cs":0,"sc":0,"pet":0,"hs":0,"hscs":0,"hssc":0,"phom":0,"fairy":0,"chest":0,"boss":0},"weffect":0,"wcost":0,"costpct":0,"adpct":0,"calcrelic":0,"calclevel":0,"nickname":"GA"},"art62":{"icon":"./images/icons/88.png","type":"damage","inactive_adj":0,"name":"神盾","id":"Artifact14","max":30,"effect":2,"gmax":0,"grate":0,"gexpo":1,"ad":1.5,"ccoef":0.6,"cexpo":2.4,"tcoef":0.17647058823529413,"texpo":3.4,"gpeak":1,"adcalc":0.04965187083225959,"reductions":{"cs":0,"sc":0,"pet":0,"hs":0,"hscs":0,"hssc":0,"phom":0,"fairy":0,"chest":0,"boss":0},"reductions_orig":{"cs":0,"sc":0,"pet":0,"hs":0,"hscs":0,"hssc":0,"phom":0,"fairy":0,"chest":0,"boss":0},"weffect":0,"wcost":0,"costpct":0,"adpct":0,"calcrelic":0,"calclevel":0,"nickname":"Aeg"},"art63":{"icon":"./images/icons/50.png","type":"damage","inactive_adj":0,"name":"沼泽手套","id":"Artifact12","max":30,"effect":2,"gmax":0,"grate":0,"gexpo":1,"ad":1.5,"ccoef":0.6,"cexpo":2.4,"tcoef":0.17647058823529413,"texpo":3.4,"gpeak":1,"adcalc":0.04965187083225959,"reductions":{"cs":0,"sc":0,"pet":0,"hs":0,"hscs":0,"hssc":0,"phom":0,"fairy":0,"chest":0,"boss":0},"reductions_orig":{"cs":0,"sc":0,"pet":0,"hs":0,"hscs":0,"hssc":0,"phom":0,"fairy":0,"chest":0,"boss":0},"weffect":0,"wcost":0,"costpct":0,"adpct":0,"calcrelic":0,"calclevel":0,"nickname":"SG"},"art64":{"icon":"./images/icons/67.png","type":"damage","inactive_adj":0,"name":"无限锤摆","id":"Artifact36","max":20,"effect":1,"gmax":0,"grate":0,"gexpo":1,"ad":0.9,"ccoef":0.6,"cexpo":3,"tcoef":0.15,"texpo":4,"gpeak":1,"adcalc":0.0009484143195420381,"reductions":{"cs":0,"sc":0,"pet":0,"hs":0,"hscs":0,"hssc":0,"phom":0,"fairy":0,"chest":0,"boss":0},"reductions_orig":{"cs":0,"sc":0,"pet":0,"hs":0,"hscs":0,"hssc":0,"phom":0,"fairy":0,"chest":0,"boss":0},"weffect":0,"wcost":0,"costpct":0,"adpct":0,"calcrelic":0,"calclevel":0,"nickname":"InfP"},"art65":{"icon":"./images/icons/76.png","type":"damage","inactive_adj":0,"name":"大熊手套","id":"Artifact27","max":30,"effect":1,"gmax":0,"grate":0,"gexpo":1,"ad":0.8,"ccoef":0.6,"cexpo":3,"tcoef":0.15,"texpo":4,"gpeak":1,"adcalc":0.0005285638316526422,"reductions":{"cs":0,"sc":0,"pet":0,"hs":0,"hscs":0,"hssc":0,"phom":0,"fairy":0,"chest":0,"boss":0},"reductions_orig":{"cs":0,"sc":0,"pet":0,"hs":0,"hscs":0,"hssc":0,"phom":0,"fairy":0,"chest":0,"boss":0},"weffect":0,"wcost":0,"costpct":0,"adpct":0,"calcrelic":0,"calclevel":0,"nickname":"GoK"},"art66":{"icon":"./images/icons/78.png","type":"damage","inactive_adj":0,"name":"巨人之矛","id":"Artifact39","max":40,"effect":1,"gmax":0,"grate":0,"gexpo":1,"ad":0.8,"ccoef":0.6,"cexpo":3,"tcoef":0.15,"texpo":4,"gpeak":1,"adcalc":0.0005285638316526422,"reductions":{"cs":0,"sc":0,"pet":0,"hs":0,"hscs":0,"hssc":0,"phom":0,"fairy":0,"chest":0,"boss":0},"reductions_orig":{"cs":0,"sc":0,"pet":0,"hs":0,"hscs":0,"hssc":0,"phom":0,"fairy":0,"chest":0,"boss":0},"weffect":0,"wcost":0,"costpct":0,"adpct":0,"calcrelic":0,"calclevel":0,"nickname":"TSp"},"art67":{"icon":"./images/icons/71.png","type":"damage","inactive_adj":0,"name":"橡木杖","id":"Artifact37","max":30,"effect":1,"gmax":0,"grate":0,"gexpo":1,"ad":0.8,"ccoef":0.6,"cexpo":3,"tcoef":0.15,"texpo":4,"gpeak":1,"adcalc":0.0005285638316526422,"reductions":{"cs":0,"sc":0,"pet":0,"hs":0,"hscs":0,"hssc":0,"phom":0,"fairy":0,"chest":0,"boss":0},"reductions_orig":{"cs":0,"sc":0,"pet":0,"hs":0,"hscs":0,"hssc":0,"phom":0,"fairy":0,"chest":0,"boss":0},"weffect":0,"wcost":0,"costpct":0,"adpct":0,"calcrelic":0,"calclevel":0,"nickname":"OS"},"art68":{"icon":"./images/icons/83.png","type":"damage","inactive_adj":0,"name":"奥秘斗篷","id":"Artifact3","max":40,"effect":1,"gmax":0,"grate":0,"gexpo":1,"ad":0.8,"ccoef":0.6,"cexpo":3,"tcoef":0.15,"texpo":4,"gpeak":1,"adcalc":0.0005285638316526422,"reductions":{"cs":0,"sc":0,"pet":0,"hs":0,"hscs":0,"hssc":0,"phom":0,"fairy":0,"chest":0,"boss":0},"reductions_orig":{"cs":0,"sc":0,"pet":0,"hs":0,"hscs":0,"hssc":0,"phom":0,"fairy":0,"chest":0,"boss":0},"weffect":0,"wcost":0,"costpct":0,"adpct":0,"calcrelic":0,"calclevel":0,"nickname":"TAC"},"art69":{"icon":"./images/icons/64.png","type":"damage","inactive_adj":0,"name":"猎人药膏","id":"Artifact8","max":40,"effect":1,"gmax":0,"grate":0,"gexpo":1,"ad":0.8,"ccoef":0.6,"cexpo":3,"tcoef":0.15,"texpo":4,"gpeak":1,"adcalc":0.0005285638316526422,"reductions":{"cs":0,"sc":0,"pet":0,"hs":0,"hscs":0,"hssc":0,"phom":0,"fairy":0,"chest":0,"boss":0},"reductions_orig":{"cs":0,"sc":0,"pet":0,"hs":0,"hscs":0,"hssc":0,"phom":0,"fairy":0,"chest":0,"boss":0},"weffect":0,"wcost":0,"costpct":0,"adpct":0,"calcrelic":0,"calclevel":0,"nickname":"HO"},"art70":{"icon":"./images/icons/36.png","type":"damage","inactive_adj":0,"name":"仙馔密酒","id":"Artifact50","max":40,"effect":2,"gmax":0,"grate":0,"gexpo":1,"ad":0.8,"ccoef":0.6,"cexpo":3,"tcoef":0.15,"texpo":4,"gpeak":1,"adcalc":0.0005285638316526422,"reductions":{"cs":0,"sc":0,"pet":0,"hs":0,"hscs":0,"hssc":0,"phom":0,"fairy":0,"chest":0,"boss":0},"reductions_orig":{"cs":0,"sc":0,"pet":0,"hs":0,"hscs":0,"hssc":0,"phom":0,"fairy":0,"chest":0,"boss":0},"weffect":0,"wcost":0,"costpct":0,"adpct":0,"calcrelic":0,"calclevel":0,"nickname":"AE"},"art71":{"icon":"./images/icons/07.png","type":"damage","inactive_adj":0,"name":"神秘权杖","id":"Artifact58","max":40,"effect":0.075,"gmax":0,"grate":0,"gexpo":1,"ad":2,"ccoef":0.5,"cexpo":2.6,"tcoef":0.1388888888888889,"texpo":3.6,"gpeak":1,"adcalc":0.05850071859000355,"reductions":{"cs":0,"sc":0,"pet":0,"hs":0,"hscs":0,"hssc":0,"phom":0,"fairy":0,"chest":0,"boss":0},"reductions_orig":{"cs":0,"sc":0,"pet":0,"hs":0,"hscs":0,"hssc":0,"phom":0,"fairy":0,"chest":0,"boss":0},"weffect":0,"wcost":0,"costpct":0,"adpct":0,"calcrelic":0,"calclevel":0,"nickname":"MSt"},"art72":{"icon":"./images/icons/34.png","type":"damage","inactive_adj":0,"name":"千头的神秘豆","id":"Artifact68","max":40,"effect":0.0025,"gmax":0,"grate":0,"gexpo":1,"ad":2,"ccoef":0.5,"cexpo":2.6,"tcoef":0.1388888888888889,"texpo":3.6,"gpeak":1,"adcalc":0.05850071859000355,"reductions":{"cs":0,"sc":0,"pet":0,"hs":0,"hscs":0,"hssc":0,"phom":0,"fairy":0,"chest":0,"boss":0},"reductions_orig":{"cs":0,"sc":0,"pet":0,"hs":0,"hscs":0,"hssc":0,"phom":0,"fairy":0,"chest":0,"boss":0},"weffect":0,"wcost":0,"costpct":0,"adpct":0,"calcrelic":0,"calclevel":0,"nickname":"MBoS"},"art73":{"icon":"./images/icons/57.png","type":"damage","inactive_adj":0,"name":"幸运之卵","id":"Artifact18","max":40,"effect":0.005,"gmax":0,"grate":0,"gexpo":1,"ad":2,"ccoef":1.4,"cexpo":3,"tcoef":0.35,"texpo":4,"gpeak":1,"adcalc":1.479856520161661,"reductions":{"cs":0,"sc":0,"pet":0,"hs":0,"hscs":0,"hssc":0,"phom":0,"fairy":0,"chest":0,"boss":0},"reductions_orig":{"cs":0,"sc":0,"pet":0,"hs":0,"hscs":0,"hssc":0,"phom":0,"fairy":0,"chest":0,"boss":0},"weffect":0,"wcost":0,"costpct":0,"adpct":0,"calcrelic":0,"calclevel":0,"nickname":"EoF"},"art74":{"icon":"./images/icons/69.png","type":"damage","inactive_adj":0,"name":"圣杯","id":"Artifact21","max":50,"effect":0.01,"gmax":0,"grate":0,"gexpo":1,"ad":1,"ccoef":0.8,"cexpo":2.6,"tcoef":0.22222222222222224,"texpo":3.6,"gpeak":1,"adcalc":0.014362164624852696,"reductions":{"cs":0,"sc":0,"pet":0,"hs":0,"hscs":0,"hssc":0,"phom":0,"fairy":0,"chest":0,"boss":0},"reductions_orig":{"cs":0,"sc":0,"pet":0,"hs":0,"hscs":0,"hssc":0,"phom":0,"fairy":0,"chest":0,"boss":0},"weffect":0,"wcost":0,"costpct":0,"adpct":0,"calcrelic":0,"calclevel":0,"nickname":"DC"},"art75":{"icon":"./images/icons/61.png","type":"damage","inactive_adj":0,"name":"入侵者之盾","id":"Artifact5","max":50,"effect":0.005,"gmax":0,"grate":0,"gexpo":1,"ad":1.6,"ccoef":0.5,"cexpo":2.1,"tcoef":0.16129032258064516,"texpo":3.1,"gpeak":1,"adcalc":0.07130728609938329,"reductions":{"cs":0,"sc":0,"pet":0,"hs":0,"hscs":0,"hssc":0,"phom":0,"fairy":0,"chest":0,"boss":0},"reductions_orig":{"cs":0,"sc":0,"pet":0,"hs":0,"hscs":0,"hssc":0,"phom":0,"fairy":0,"chest":0,"boss":0},"weffect":0,"wcost":0,"costpct":0,"adpct":0,"calcrelic":0,"calclevel":0,"nickname":"IS"},"art76":{"icon":"./images/icons/65.png","type":"damage","inactive_adj":0,"name":"死亡之斧","id":"Artifact4","max":40,"effect":0.005,"gmax":0,"grate":0,"gexpo":1,"ad":3,"ccoef":0.8,"cexpo":2.5,"tcoef":0.2285714285714286,"texpo":3.5,"gpeak":1,"adcalc":2.1889412301423925,"reductions":{"cs":0,"sc":0,"pet":0,"hs":0,"hscs":0,"hssc":0,"phom":0,"fairy":0,"chest":0,"boss":0},"reductions_orig":{"cs":0,"sc":0,"pet":0,"hs":0,"hscs":0,"hssc":0,"phom":0,"fairy":0,"chest":0,"boss":0},"weffect":0,"wcost":0,"costpct":0,"adpct":0,"calcrelic":0,"calclevel":0,"nickname":"AoM"},"art77":{"icon":"./images/icons/39.png","type":"damage","inactive_adj":0,"name":"狐仙精华","id":"Artifact54","max":40,"effect":0.005,"gmax":0,"grate":0,"gexpo":1,"ad":3,"ccoef":0.8,"cexpo":2.5,"tcoef":0.2285714285714286,"texpo":3.5,"gpeak":1,"adcalc":2.1889412301423925,"reductions":{"cs":0,"sc":0,"pet":0,"hs":0,"hscs":0,"hssc":0,"phom":0,"fairy":0,"chest":0,"boss":0},"reductions_orig":{"cs":0,"sc":0,"pet":0,"hs":0,"hscs":0,"hssc":0,"phom":0,"fairy":0,"chest":0,"boss":0},"weffect":0,"wcost":0,"costpct":0,"adpct":0,"calcrelic":0,"calclevel":0,"nickname":"EotK"},"art78":{"icon":"./images/icons/23.png","type":"damage","inactive_adj":0,"name":"爱马仕之靴","id":"Artifact70","max":40,"effect":0.001,"gmax":0,"grate":0,"gexpo":1,"ad":3,"ccoef":0.8,"cexpo":2.5,"tcoef":0.2285714285714286,"texpo":3.5,"gpeak":1,"adcalc":2.1889412301423925,"reductions":{"cs":0,"sc":0,"pet":0,"hs":0,"hscs":0,"hssc":0,"phom":0,"fairy":0,"chest":0,"boss":0},"reductions_orig":{"cs":0,"sc":0,"pet":0,"hs":0,"hscs":0,"hssc":0,"phom":0,"fairy":0,"chest":0,"boss":0},"weffect":0,"wcost":0,"costpct":0,"adpct":0,"calcrelic":0,"calclevel":0,"nickname":"BoH"},"art79":{"icon":"./images/icons/02.png","type":"damage","inactive_adj":0,"name":"测试管柱1","id":"Artifact74","max":40,"effect":0.001,"gmax":0,"grate":0,"gexpo":1,"ad":3,"ccoef":0.8,"cexpo":2.5,"tcoef":0.2285714285714286,"texpo":3.5,"gpeak":1,"adcalc":2.1889412301423925,"reductions":{"cs":0,"sc":0,"pet":0,"hs":0,"hscs":0,"hssc":0,"phom":0,"fairy":0,"chest":0,"boss":0},"reductions_orig":{"cs":0,"sc":0,"pet":0,"hs":0,"hscs":0,"hssc":0,"phom":0,"fairy":0,"chest":0,"boss":0},"weffect":0,"wcost":0,"costpct":0,"adpct":0,"calcrelic":0,"calclevel":0,"nickname":"UG"},"art80":{"icon":"./images/icons/05.png","type":"damage","inactive_adj":0,"name":"奥伯龙吊坠","id":"Artifact72","max":40,"effect":0.002,"gmax":0,"grate":0,"gexpo":1,"ad":3,"ccoef":0.8,"cexpo":2.5,"tcoef":0.2285714285714286,"texpo":3.5,"gpeak":1,"adcalc":2.1889412301423925,"reductions":{"cs":0,"sc":0,"pet":0,"hs":0,"hscs":0,"hssc":0,"phom":0,"fairy":0,"chest":0,"boss":0},"reductions_orig":{"cs":0,"sc":0,"pet":0,"hs":0,"hscs":0,"hssc":0,"phom":0,"fairy":0,"chest":0,"boss":0},"weffect":0,"wcost":0,"costpct":0,"adpct":0,"calcrelic":0,"calclevel":0,"nickname":"OP"},"art81":{"icon":"./images/icons/16.png","type":"damage","inactive_adj":0,"name":"铝登宵的幸运足","id":"Artifact69","max":40,"effect":0.0025,"gmax":0,"grate":0,"gexpo":1,"ad":2,"ccoef":0.5,"cexpo":2.6,"tcoef":0.1388888888888889,"texpo":3.6,"gpeak":1,"adcalc":0.05850071859000355,"reductions":{"cs":0,"sc":0,"pet":0,"hs":0,"hscs":0,"hssc":0,"phom":0,"fairy":0,"chest":0,"boss":0},"reductions_orig":{"cs":0,"sc":0,"pet":0,"hs":0,"hscs":0,"hssc":0,"phom":0,"fairy":0,"chest":0,"boss":0},"weffect":0,"wcost":0,"costpct":0,"adpct":0,"calcrelic":0,"calclevel":0,"nickname":"LFA"},"art82":{"icon":"./images/icons/32.png","type":"damage","inactive_adj":0,"name":"失落的王者面具","id":"Artifact63","max":40,"effect":0.02,"gmax":0,"grate":0,"gexpo":1,"ad":0.8,"ccoef":0.5,"cexpo":3,"tcoef":0.125,"texpo":4,"gpeak":1,"adcalc":0.0002549015391843375,"reductions":{"cs":0,"sc":0,"pet":0,"hs":0,"hscs":0,"hssc":0,"phom":0,"fairy":0,"chest":0,"boss":0},"reductions_orig":{"cs":0,"sc":0,"pet":0,"hs":0,"hscs":0,"hssc":0,"phom":0,"fairy":0,"chest":0,"boss":0},"weffect":0,"wcost":0,"costpct":0,"adpct":0,"calcrelic":0,"calclevel":0,"nickname":"LKM"},"art83":{"icon":"./images/icons/62.png","type":"damage","inactive_adj":0,"name":"光辉之杖","id":"Artifact24","max":40,"effect":0.02,"gmax":0,"grate":0,"gexpo":1,"ad":0.8,"ccoef":0.5,"cexpo":2.6,"tcoef":0.1388888888888889,"texpo":3.6,"gpeak":1,"adcalc":0.0009760401351785867,"reductions":{"cs":0,"sc":0,"pet":0,"hs":0,"hscs":0,"hssc":0,"phom":0,"fairy":0,"chest":0,"boss":0},"reductions_orig":{"cs":0,"sc":0,"pet":0,"hs":0,"hscs":0,"hssc":0,"phom":0,"fairy":0,"chest":0,"boss":0},"weffect":0,"wcost":0,"costpct":0,"adpct":0,"calcrelic":0,"calclevel":0,"nickname":"SoR"},"art84":{"icon":"./images/icons/12.png","type":"damage","inactive_adj":0,"name":"Morgelai剑","id":"Artifact71","max":50,"effect":0.01,"gmax":0,"grate":0,"gexpo":1,"ad":0.8,"ccoef":0.5,"cexpo":3,"tcoef":0.125,"texpo":4,"gpeak":1,"adcalc":0.0002549015391843375,"reductions":{"cs":0,"sc":0,"pet":0,"hs":0,"hscs":0,"hssc":0,"phom":0,"fairy":0,"chest":0,"boss":0},"reductions_orig":{"cs":0,"sc":0,"pet":0,"hs":0,"hscs":0,"hssc":0,"phom":0,"fairy":0,"chest":0,"boss":0},"weffect":0,"wcost":0,"costpct":0,"adpct":0,"calcrelic":0,"calclevel":0,"nickname":"MSw"},"art85":{"icon":"./images/icons/48.png","type":"damage","inactive_adj":0,"name":"大师之剑","id":"Artifact49","max":40,"effect":0.0001,"gmax":0,"grate":0,"gexpo":1,"ad":2,"ccoef":0.5,"cexpo":2.6,"tcoef":0.1388888888888889,"texpo":3.6,"gpeak":1,"adcalc":0.05850071859000355,"reductions":{"cs":0,"sc":0,"pet":0,"hs":0,"hscs":0,"hssc":0,"phom":0,"fairy":0,"chest":0,"boss":0},"reductions_orig":{"cs":0,"sc":0,"pet":0,"hs":0,"hscs":0,"hssc":0,"phom":0,"fairy":0,"chest":0,"boss":0},"weffect":0,"wcost":0,"costpct":0,"adpct":0,"calcrelic":0,"calclevel":0,"nickname":"TMS"},"art86":{"icon":"./images/icons/13.png","type":"damage","inactive_adj":0,"name":"放大镜","id":"Artifact80","max":40,"effect":0.225,"gmax":0,"grate":0,"gexpo":1,"ad":3,"ccoef":2,"cexpo":3,"tcoef":0.5,"texpo":4,"gpeak":1,"adcalc":46.11837790508771,"reductions":{"cs":0,"sc":0,"pet":0,"hs":0,"hscs":0,"hssc":0,"phom":0,"fairy":0,"chest":0,"boss":0},"reductions_orig":{"cs":0,"sc":0,"pet":0,"hs":0,"hscs":0,"hssc":0,"phom":0,"fairy":0,"chest":0,"boss":0},"weffect":0,"wcost":0,"costpct":0,"adpct":0,"calcrelic":0,"calclevel":0,"nickname":"Mag"},"art87":{"icon":"./images/icons/09.png","type":"damage","inactive_adj":0,"name":"泰的宝藏","id":"Artifact81","max":40,"effect":0.225,"gmax":0,"grate":0,"gexpo":1,"ad":3,"ccoef":2,"cexpo":3,"tcoef":0.5,"texpo":4,"gpeak":1,"adcalc":46.11837790508771,"reductions":{"cs":0,"sc":0,"pet":0,"hs":0,"hscs":0,"hssc":0,"phom":0,"fairy":0,"chest":0,"boss":0},"reductions_orig":{"cs":0,"sc":0,"pet":0,"hs":0,"hscs":0,"hssc":0,"phom":0,"fairy":0,"chest":0,"boss":0},"weffect":0,"wcost":0,"costpct":0,"adpct":0,"calcrelic":0,"calclevel":0,"nickname":"TToF"},"art88":{"icon":"./images/icons/18.png","type":"damage","inactive_adj":0,"name":"白矮星","id":"Artifact85","max":50,"effect":0.005,"gmax":0,"grate":0,"gexpo":1,"ad":3,"ccoef":2,"cexpo":3,"tcoef":0.5,"texpo":4,"gpeak":1,"adcalc":46.11837790508771,"reductions":{"cs":0,"sc":0,"pet":0,"hs":0,"hscs":0,"hssc":0,"phom":0,"fairy":0,"chest":0,"boss":0},"reductions_orig":{"cs":0,"sc":0,"pet":0,"hs":0,"hscs":0,"hssc":0,"phom":0,"fairy":0,"chest":0,"boss":0},"weffect":0,"wcost":0,"costpct":0,"adpct":0,"calcrelic":0,"calclevel":0,"nickname":"TWD"},"art89":{"icon":"./images/icons/22.png","type":"damage","inactive_adj":0,"name":"亚兰之矛","id":"Artifact57","max":40,"effect":0.02,"gmax":0,"grate":0,"gexpo":1,"ad":2,"ccoef":0.5,"cexpo":2.6,"tcoef":0.1388888888888889,"texpo":3.6,"gpeak":1,"adcalc":0.05850071859000355,"reductions":{"cs":0,"sc":0,"pet":0,"hs":0,"hscs":0,"hssc":0,"phom":0,"fairy":0,"chest":0,"boss":0},"reductions_orig":{"cs":0,"sc":0,"pet":0,"hs":0,"hscs":0,"hssc":0,"phom":0,"fairy":0,"chest":0,"boss":0},"weffect":0,"wcost":0,"costpct":0,"adpct":0,"calcrelic":0,"calclevel":0,"nickname":"AS"},"art90":{"icon":"./images/icons/41.png","type":"damage","inactive_adj":0,"name":"暗黑守卫","id":"Artifact60","max":60,"effect":1,"gmax":0,"grate":0,"gexpo":1,"ad":2,"ccoef":0.5,"cexpo":2.6,"tcoef":0.1388888888888889,"texpo":3.6,"gpeak":1,"adcalc":0.05850071859000355,"reductions":{"cs":0,"sc":0,"pet":0,"hs":0,"hscs":0,"hssc":0,"phom":0,"fairy":0,"chest":0,"boss":0},"reductions_orig":{"cs":0,"sc":0,"pet":0,"hs":0,"hscs":0,"hssc":0,"phom":0,"fairy":0,"chest":0,"boss":0},"weffect":0,"wcost":0,"costpct":0,"adpct":0,"calcrelic":0,"calclevel":0,"nickname":"WotD"}},"artifact_count":90,"artifact_costs":{"0":-1,"1":1,"2":3,"3":6,"4":11,"5":19,"6":30,"7":46,"8":69,"9":102,"10":148,"11":214,"12":306,"13":434,"14":613,"15":861,"16":1203,"17":1675,"18":2323,"19":3212,"20":4430,"21":6094,"22":8363,"23":11454,"24":15657,"25":21365,"26":29108,"27":39599,"28":53796,"29":72990,"30":98914,"31":133897,"32":181063,"33":244605,"34":330143,"35":445208,"36":599886,"37":807680,"38":1086657,"39":1460982,"40":1962961,"41":2801512,"42":4271796,"43":6546742,"44":10084102,"45":15611565,"46":24291381,"47":37988598,"48":59710114,"49":94326541,"50":149764436,"51":238984254,"52":383276658,"53":617780678,"54":1000762985,"55":1629292101,"56":2665833882,"57":4383580899,"58":7244059100,"59":12030591779,"60":20078853673,"61":33676929221,"62":56762601881,"63":96144140647,"64":163647145909,"65":279906771691,"66":3840000000000,"67":53170000000000,"68":738330000000000,"69":10300000000000000,"70":144000000000000000,"71":2030000000000000000,"72":28800000000000000000,"73":409000000000000000000,"74":5.85e+21,"75":8.42e+22,"76":1.21e+24,"77":1.76e+25,"78":2.56e+26,"79":3.74e+27,"80":5.5e+28,"81":8.12e+29,"82":1.2e+31,"83":1.78e+32,"84":2.69e+33,"85":4.04e+34,"86":6.11e+35,"87":9.27e+36,"88":1.41e+38,"89":2.17e+39,"90":3.33e+40,"91":-1},"artifact_lookup":{"Artifact22":"art1","Artifact2":"art2","Artifact19":"art3","Artifact1":"art4","Artifact20":"art5","Artifact66":"art6","Artifact43":"art7","Artifact44":"art8","Artifact45":"art9","Artifact79":"art10","Artifact82":"art11","Artifact84":"art12","Artifact26":"art13","Artifact31":"art14","Artifact29":"art15","Artifact51":"art16","Artifact59":"art17","Artifact83":"art18","Artifact35":"art19","Artifact32":"art20","Artifact33":"art21","Artifact34":"art22","Artifact61":"art23","Artifact62":"art24","Artifact38":"art25","Artifact30":"art26","Artifact64":"art27","Artifact52":"art28","Artifact53":"art29","Artifact67":"art30","Artifact42":"art31","Artifact46":"art32","Artifact55":"art33","Artifact56":"art34","Artifact75":"art35","Artifact76":"art36","Artifact77":"art37","Artifact78":"art38","Artifact40":"art39","Artifact25":"art40","Artifact17":"art41","Artifact23":"art42","Artifact73":"art43","Artifact28":"art44","Artifact86":"art45","Artifact87":"art46","Artifact88":"art47","Artifact89":"art48","Artifact90":"art49","Artifact47":"art50","Artifact11":"art51","Artifact41":"art52","Artifact9":"art53","Artifact10":"art54","Artifact7":"art55","Artifact6":"art56","Artifact65":"art57","Artifact48":"art58","Artifact13":"art59","Artifact15":"art60","Artifact16":"art61","Artifact14":"art62","Artifact12":"art63","Artifact36":"art64","Artifact27":"art65","Artifact39":"art66","Artifact37":"art67","Artifact3":"art68","Artifact8":"art69","Artifact50":"art70","Artifact58":"art71","Artifact68":"art72","Artifact18":"art73","Artifact21":"art74","Artifact5":"art75","Artifact4":"art76","Artifact54":"art77","Artifact70":"art78","Artifact74":"art79","Artifact72":"art80","Artifact69":"art81","Artifact63":"art82","Artifact24":"art83","Artifact71":"art84","Artifact49":"art85","Artifact80":"art86","Artifact81":"art87","Artifact85":"art88","Artifact57":"art89","Artifact60":"art90"},"skills":{"skill1":{"id":"TapDmg","branch":"BranchRed","slot":0,"sp_req":0,"skill_req":-1,"tier":"I","name":"骑士之勇","max":25,"level":0,"costs":{"1":1,"2":2,"3":2,"4":3,"5":3,"6":3,"7":4,"8":5,"9":5,"10":6,"11":7,"12":8,"13":9,"14":11,"15":12,"16":14,"17":16,"18":19,"19":22,"20":25,"21":28,"22":33,"23":38,"24":43,"25":50},"effects":{"primary":{"1":1.2,"2":1.71,"3":2.43,"4":3.82,"5":6.02,"6":9.47,"7":16.4,"8":31.4,"9":60.1,"10":126,"11":290,"12":728,"13":2000,"14":6490,"15":22900,"16":94800,"17":459000,"18":2790000,"19":21100000,"20":197000000,"21":2270000000,"22":36500000000,"23":815000000000,"24":25000000000000,"25":1190000000000000},"secondary":{"1":0,"2":0,"3":0,"4":0,"5":0,"6":0,"7":0,"8":0,"9":0,"10":0,"11":0,"12":0,"13":0,"14":0,"15":0,"16":0,"17":0,"18":0,"19":0,"20":0,"21":0,"22":0,"23":0,"24":0,"25":0},"tertiary":{"1":0}},"reductions":{"cs":0,"sc":0.6,"pet":1,"hs":1,"hscs":1,"hssc":1,"phom":0,"fairy":0,"chest":0,"boss":0},"reductions_orig":{"cs":0,"sc":0.6,"pet":1,"hs":1,"hscs":1,"hssc":1,"phom":0,"fairy":0,"chest":0,"boss":0},"efficiency":0,"type":"damage","inactive_adj":0},"skill2":{"id":"TapDmgFromHelpers","branch":"BranchRed","slot":1,"sp_req":3,"skill_req":"skill1","tier":"II","name":"骑士勋章","max":25,"level":0,"costs":{"1":1,"2":2,"3":2,"4":3,"5":3,"6":3,"7":4,"8":5,"9":5,"10":6,"11":7,"12":8,"13":9,"14":11,"15":12,"16":14,"17":16,"18":19,"19":22,"20":25,"21":28,"22":33,"23":38,"24":43,"25":50},"effects":{"primary":{"1":0.0004,"2":0.0006,"3":0.001,"4":0.0017,"5":0.0028,"6":0.0046,"7":0.0082,"8":0.0154,"9":0.0291,"10":0.0582,"11":0.1237,"12":0.2797,"13":0.6728,"14":1.8343,"15":5.33,"16":17.6,"17":66.1,"18":303,"19":1700,"20":11700,"21":99600,"22":1210000,"23":21300000,"24":547000000,"25":24200000000},"secondary":{"1":0,"2":0,"3":0,"4":0,"5":0,"6":0,"7":0,"8":0,"9":0,"10":0,"11":0,"12":0,"13":0,"14":0,"15":0,"16":0,"17":0,"18":0,"19":0,"20":0,"21":0,"22":0,"23":0,"24":0,"25":0},"tertiary":{"1":0}},"reductions":{"cs":0,"sc":1,"pet":1,"hs":1,"hscs":1,"hssc":1,"phom":0,"fairy":0,"chest":0,"boss":0},"reductions_orig":{"cs":0,"sc":1,"pet":1,"hs":1,"hscs":1,"hssc":1,"phom":0,"fairy":0,"chest":0,"boss":0},"efficiency":0,"type":"damage","inactive_adj":0},"skill3":{"id":"PetDmg","branch":"BranchRed","slot":2,"sp_req":3,"skill_req":"skill1","tier":"II","name":"宠物进化","max":25,"level":0,"costs":{"1":1,"2":2,"3":2,"4":3,"5":3,"6":3,"7":4,"8":5,"9":5,"10":6,"11":7,"12":8,"13":9,"14":11,"15":12,"16":14,"17":16,"18":19,"19":22,"20":25,"21":28,"22":33,"23":38,"24":43,"25":50},"effects":{"primary":{"1":1.5,"2":2.21,"3":3.24,"4":5.26,"5":8.52,"6":13.8,"7":24.6,"8":48.3,"9":94.6,"10":203,"11":478,"12":1230,"13":3440,"14":11400,"15":41300,"16":176000,"17":877000,"18":5530000,"19":43800000,"20":433000000,"21":5320000000,"22":93300000000,"23":2310000000000,"24":80700000000000,"25":4500000000000000},"secondary":{"1":0,"2":1,"3":1,"4":2,"5":2,"6":3,"7":3,"8":4,"9":4,"10":5,"11":5,"12":6,"13":6,"14":7,"15":7,"16":8,"17":8,"18":9,"19":9,"20":10,"21":11,"22":12,"23":13,"24":14,"25":15},"tertiary":{"1":0}},"reductions":{"cs":0,"sc":0,"pet":1,"hs":0,"hscs":0,"hssc":0,"phom":0,"fairy":0,"chest":0,"boss":0},"reductions_orig":{"cs":0,"sc":0,"pet":1,"hs":0,"hscs":0,"hssc":0,"phom":0,"fairy":0,"chest":0,"boss":0},"efficiency":0,"type":"damage","inactive_adj":0},"skill4":{"id":"PetGoldQTE","branch":"BranchRed","slot":3,"sp_req":3,"skill_req":"skill1","tier":"II","name":"米达斯之心","max":25,"level":0,"costs":{"1":1,"2":2,"3":2,"4":3,"5":3,"6":3,"7":4,"8":5,"9":5,"10":6,"11":7,"12":8,"13":9,"14":11,"15":12,"16":14,"17":16,"18":19,"19":22,"20":25,"21":28,"22":33,"23":38,"24":43,"25":50},"effects":{"primary":{"1":1.8,"2":2.98,"3":4.93,"4":9.16,"5":17,"6":31.6,"7":65.7,"8":152,"9":353,"10":910,"11":2600,"12":8240,"13":28800,"14":122000,"15":571000,"16":3200000,"17":21500000,"18":186000000,"19":2080000000,"20":29800000000,"21":539000000000,"22":14400000000000,"23":558000000000000,"24":31400000000000000,"25":2920000000000000000},"secondary":{"1":0,"2":1,"3":2,"4":3,"5":4,"6":5,"7":6,"8":7,"9":8,"10":9,"11":10,"12":11,"13":12,"14":13,"15":14,"16":15,"17":16,"18":17,"19":18,"20":20,"21":22,"22":24,"23":26,"24":28,"25":30},"tertiary":{"1":0}},"reductions":{"cs":0,"sc":0,"pet":0,"hs":0,"hscs":0,"hssc":0,"phom":0.8,"fairy":0,"chest":0,"boss":0.8},"reductions_orig":{"cs":0,"sc":0,"pet":0,"hs":0,"hscs":0,"hssc":0,"phom":0.8,"fairy":0,"chest":0,"boss":0.8},"efficiency":0,"type":"gold","inactive_adj":0},"skill5":{"id":"HeavyStrikes","branch":"BranchRed","slot":4,"sp_req":20,"skill_req":"skill2","tier":"III","name":"劈砍","max":25,"level":0,"costs":{"1":2,"2":2,"3":3,"4":3,"5":3,"6":4,"7":5,"8":5,"9":6,"10":7,"11":8,"12":9,"13":11,"14":12,"15":14,"16":16,"17":19,"18":22,"19":25,"20":28,"21":33,"22":38,"23":43,"24":50,"25":57},"effects":{"primary":{"1":1.6,"2":2.38,"3":3.93,"4":6.48,"5":10.7,"6":19.5,"7":39.4,"8":79.4,"9":176,"10":431,"11":1150,"12":3390,"13":11900,"14":45800,"15":209000,"16":1130000,"17":7750000,"18":67700000,"19":745000000,"20":10300000000,"21":205000000000,"22":5870000000000,"23":239000000000000,"24":15700000000000000,"25":1670000000000000000},"secondary":{"1":-0.01,"2":-0.02,"3":-0.03,"4":-0.04,"5":-0.05,"6":-0.06,"7":-0.07,"8":-0.08,"9":-0.09,"10":-0.1,"11":-0.11,"12":-0.12,"13":-0.13,"14":-0.14,"15":-0.15,"16":-0.16,"17":-0.17,"18":-0.18,"19":-0.19,"20":-0.2,"21":-0.21,"22":-0.22,"23":-0.23,"24":-0.24,"25":-0.25},"tertiary":{"1":0}},"reductions":{"cs":1,"sc":1,"pet":1,"hs":1,"hscs":1,"hssc":1,"phom":0,"fairy":0,"chest":0,"boss":0},"reductions_orig":{"cs":1,"sc":1,"pet":1,"hs":1,"hscs":1,"hssc":1,"phom":0,"fairy":0,"chest":0,"boss":0},"efficiency":0,"type":"damage","inactive_adj":0},"skill6":{"id":"FireTapSkillBoost","branch":"BranchRed","slot":5,"sp_req":20,"skill_req":"skill3","tier":"III","name":"召唤地狱火","max":25,"level":0,"costs":{"1":2,"2":2,"3":3,"4":3,"5":3,"6":4,"7":5,"8":5,"9":6,"10":7,"11":8,"12":9,"13":11,"14":12,"15":14,"16":16,"17":19,"18":22,"19":25,"20":28,"21":33,"22":38,"23":43,"24":50,"25":57},"effects":{"primary":{"1":1.6,"2":2.37,"3":3.89,"4":6.38,"5":10.5,"6":19,"7":37.9,"8":75.6,"9":166,"10":401,"11":1060,"12":3060,"13":10600,"14":39800,"15":177000,"16":931000,"17":6230000,"18":52600000,"19":559000000,"20":7420000000,"21":142000000000,"22":3870000000000,"23":149000000000000,"24":9320000000000000,"25":932000000000000000},"secondary":{"1":1,"2":2,"3":4,"4":7,"5":9,"6":12,"7":16,"8":21,"9":26,"10":33,"11":41,"12":51,"13":63,"14":77,"15":95,"16":115,"17":142,"18":173,"19":211,"20":255,"21":310,"22":376,"23":454,"24":550,"25":664},"tertiary":{"1":0}},"reductions":{"cs":0,"sc":0.6,"pet":1,"hs":1,"hscs":1,"hssc":1,"phom":0,"fairy":0,"chest":0,"boss":0},"reductions_orig":{"cs":0,"sc":0.6,"pet":1,"hs":1,"hscs":1,"hssc":1,"phom":0,"fairy":0,"chest":0,"boss":0},"efficiency":0,"type":"damage","inactive_adj":0},"skill7":{"id":"PetQTE","branch":"BranchRed","slot":6,"sp_req":20,"skill_req":"skill4","tier":"III","name":"闪电爆发","max":25,"level":0,"costs":{"1":2,"2":2,"3":3,"4":3,"5":3,"6":4,"7":5,"8":5,"9":6,"10":7,"11":8,"12":9,"13":11,"14":12,"15":14,"16":16,"17":19,"18":22,"19":25,"20":28,"21":33,"22":38,"23":43,"24":50,"25":57},"effects":{"primary":{"1":1.5,"2":2.14,"3":3.39,"4":5.36,"5":8.48,"6":14.8,"7":28.7,"8":55.6,"9":119,"10":279,"11":719,"12":2040,"13":6920,"14":25700,"15":113000,"16":595000,"17":4010000,"18":34400000,"19":375000000,"20":5150000000,"21":104000000000,"22":3040000000000,"23":128000000000000,"24":8990000000000000,"25":1040000000000000000},"secondary":{"1":2,"2":4,"3":6,"4":8,"5":10,"6":12,"7":14,"8":16,"9":18,"10":20,"11":22,"12":24,"13":26,"14":28,"15":30,"16":33,"17":36,"18":39,"19":42,"20":45,"21":48,"22":51,"23":54,"24":57,"25":60},"tertiary":{"1":2}},"reductions":{"cs":0,"sc":0,"pet":1,"hs":0,"hscs":0,"hssc":0,"phom":0,"fairy":0,"chest":0,"boss":0},"reductions_orig":{"cs":0,"sc":0,"pet":1,"hs":0,"hscs":0,"hssc":0,"phom":0,"fairy":0,"chest":0,"boss":0},"efficiency":0,"type":"damage","inactive_adj":0},"skill8":{"id":"Frenzy","branch":"BranchRed","slot":7,"sp_req":50,"skill_req":"skill5","tier":"IV","name":"野蛮之怒","max":15,"level":0,"costs":{"1":3,"2":4,"3":5,"4":7,"5":9,"6":12,"7":16,"8":21,"9":27,"10":35,"11":46,"12":60,"13":78,"14":101,"15":131,"16":-1,"17":-1,"18":-1,"19":-1,"20":-1,"21":-1,"22":-1,"23":-1,"24":-1,"25":-1},"effects":{"primary":{"1":2.5,"2":6.19,"3":17.7,"4":66.6,"5":325,"6":2280,"7":25100,"8":463000,"9":15300000,"10":1040000000,"11":180000000000,"12":96200000000000,"13":209000000000000000,"14":2.63e+21,"15":3.21e+26,"16":-1,"17":-1,"18":-1,"19":-1,"20":-1,"21":-1,"22":-1,"23":-1,"24":-1,"25":-1},"secondary":{"1":1,"2":2,"3":3,"4":4,"5":5,"6":6,"7":8,"8":10,"9":12,"10":15,"11":18,"12":21,"13":24,"14":27,"15":30,"16":-1,"17":-1,"18":-1,"19":-1,"20":-1,"21":-1,"22":-1,"23":-1,"24":-1,"25":-1},"tertiary":{"1":0}},"reductions":{"cs":0,"sc":0.6,"pet":1,"hs":1,"hscs":1,"hssc":1,"phom":0,"fairy":0,"chest":0,"boss":0},"reductions_orig":{"cs":0,"sc":0.6,"pet":1,"hs":1,"hscs":1,"hssc":1,"phom":0,"fairy":0,"chest":0,"boss":0},"efficiency":0,"type":"damage","inactive_adj":0},"skill9":{"id":"BossDmgQTE","branch":"BranchRed","slot":9,"sp_req":50,"skill_req":"skill7","tier":"IV","name":"闪电穿梭","max":15,"level":0,"costs":{"1":3,"2":4,"3":5,"4":7,"5":9,"6":12,"7":16,"8":21,"9":27,"10":35,"11":46,"12":60,"13":78,"14":101,"15":131,"16":-1,"17":-1,"18":-1,"19":-1,"20":-1,"21":-1,"22":-1,"23":-1,"24":-1,"25":-1},"effects":{"primary":{"1":2,"2":5.07,"3":14.9,"4":58.4,"5":298,"6":2220,"7":26300,"8":529000,"9":19400000,"10":1480000000,"11":295000000000,"12":186000000000000,"13":485000000000000000,"14":7.48e+21,"15":1.15e+27,"16":-1,"17":-1,"18":-1,"19":-1,"20":-1,"21":-1,"22":-1,"23":-1,"24":-1,"25":-1},"secondary":{"1":0.965,"2":0.93,"3":0.895,"4":0.86,"5":0.825,"6":0.79,"7":0.755,"8":0.72,"9":0.685,"10":0.65,"11":0.615,"12":0.58,"13":0.545,"14":0.51,"15":0.475,"16":-1,"17":-1,"18":-1,"19":-1,"20":-1,"21":-1,"22":-1,"23":-1,"24":-1,"25":-1},"tertiary":{"1":30}},"reductions":{"cs":0,"sc":0,"pet":1,"hs":0,"hscs":0,"hssc":0,"phom":0,"fairy":0,"chest":0,"boss":0},"reductions_orig":{"cs":0,"sc":0,"pet":1,"hs":0,"hscs":0,"hssc":0,"phom":0,"fairy":0,"chest":0,"boss":0},"efficiency":0,"type":"damage","inactive_adj":0},"skill10":{"id":"AllHelperDmg","branch":"BranchYellow","slot":0,"sp_req":0,"skill_req":-1,"tier":"I","name":"指挥官","max":25,"level":0,"costs":{"1":1,"2":2,"3":2,"4":3,"5":3,"6":3,"7":4,"8":5,"9":5,"10":6,"11":7,"12":8,"13":9,"14":11,"15":12,"16":14,"17":16,"18":19,"19":22,"20":25,"21":28,"22":33,"23":38,"24":43,"25":50},"effects":{"primary":{"1":1.2,"2":1.71,"3":2.43,"4":3.82,"5":6.02,"6":9.47,"7":16.4,"8":31.4,"9":60.1,"10":126,"11":290,"12":728,"13":2000,"14":6490,"15":22900,"16":94800,"17":459000,"18":2790000,"19":21100000,"20":197000000,"21":2270000000,"22":36500000000,"23":815000000000,"24":25000000000000,"25":1190000000000000},"secondary":{"1":0,"2":0,"3":0,"4":0,"5":0,"6":0,"7":0,"8":0,"9":0,"10":0,"11":0,"12":0,"13":0,"14":0,"15":0,"16":0,"17":0,"18":0,"19":0,"20":0,"21":0,"22":0,"23":0,"24":0,"25":0},"tertiary":{"1":0}},"reductions":{"cs":1,"sc":0.6,"pet":0.5,"hs":0.5,"hscs":0.5,"hssc":0.5,"phom":0,"fairy":0,"chest":0,"boss":0},"reductions_orig":{"cs":1,"sc":0.6,"pet":0.5,"hs":0.5,"hscs":0.5,"hssc":0.5,"phom":0,"fairy":0,"chest":0,"boss":0},"efficiency":0,"type":"damage","inactive_adj":0},"skill11":{"id":"ChestGold","branch":"BranchYellow","slot":1,"sp_req":3,"skill_req":"skill10","tier":"II","name":"战利品","max":25,"level":0,"costs":{"1":1,"2":2,"3":2,"4":3,"5":3,"6":3,"7":4,"8":5,"9":5,"10":6,"11":7,"12":8,"13":9,"14":11,"15":12,"16":14,"17":16,"18":19,"19":22,"20":25,"21":28,"22":33,"23":38,"24":43,"25":50},"effects":{"primary":{"1":1.8,"2":2.98,"3":4.93,"4":9.16,"5":17,"6":31.6,"7":65.7,"8":152,"9":353,"10":910,"11":2600,"12":8240,"13":28800,"14":122000,"15":571000,"16":3200000,"17":21500000,"18":186000000,"19":2080000000,"20":29800000000,"21":539000000000,"22":14400000000000,"23":558000000000000,"24":31400000000000000,"25":2920000000000000000},"secondary":{"1":0.01,"2":0.02,"3":0.03,"4":0.04,"5":0.05,"6":0.06,"7":0.07,"8":0.08,"9":0.09,"10":0.1,"11":0.11,"12":0.12,"13":0.13,"14":0.14,"15":0.15,"16":0.16,"17":0.17,"18":0.18,"19":0.19,"20":0.2,"21":0.21,"22":0.22,"23":0.23,"24":0.24,"25":0.25},"tertiary":{"1":0}},"reductions":{"cs":0,"sc":0,"pet":0,"hs":0,"hscs":0,"hssc":0,"phom":0,"fairy":0.8,"chest":0.8,"boss":0},"reductions_orig":{"cs":0,"sc":0,"pet":0,"hs":0,"hscs":0,"hssc":0,"phom":0,"fairy":0.8,"chest":0.8,"boss":0},"efficiency":0,"type":"gold","inactive_adj":0},"skill12":{"id":"HelperDmgSkillBoost","branch":"BranchYellow","slot":2,"sp_req":3,"skill_req":"skill10","tier":"II","name":"英雄王者","max":25,"level":0,"costs":{"1":1,"2":2,"3":2,"4":3,"5":3,"6":3,"7":4,"8":5,"9":5,"10":6,"11":7,"12":8,"13":9,"14":11,"15":12,"16":14,"17":16,"18":19,"19":22,"20":25,"21":28,"22":33,"23":38,"24":43,"25":50},"effects":{"primary":{"1":1.5,"2":2.13,"3":3.04,"4":4.79,"5":7.55,"6":11.9,"7":20.7,"8":39.7,"9":76.1,"10":160,"11":371,"12":939,"13":2600,"14":8550,"15":30700,"16":130000,"17":645000,"18":4060000,"19":32100000,"20":318000000,"21":3920000000,"22":69000000000,"23":1720000000000,"24":60700000000000,"25":3430000000000000},"secondary":{"1":1,"2":2,"3":3,"4":4,"5":5,"6":6,"7":7,"8":8,"9":9,"10":10,"11":11,"12":12,"13":13,"14":14,"15":15,"16":16,"17":17,"18":18,"19":19,"20":20,"21":22,"22":24,"23":26,"24":28,"25":30},"tertiary":{"1":0}},"reductions":{"cs":1,"sc":0.6,"pet":0.5,"hs":0.5,"hscs":0.5,"hssc":0.5,"phom":0,"fairy":0,"chest":0,"boss":0},"reductions_orig":{"cs":1,"sc":0.6,"pet":0.5,"hs":0.5,"hscs":0.5,"hssc":0.5,"phom":0,"fairy":0,"chest":0,"boss":0},"efficiency":0,"type":"damage","inactive_adj":0},"skill13":{"id":"ClanShipDmg","branch":"BranchYellow","slot":3,"sp_req":3,"skill_req":"skill10","tier":"II","name":"空袭","max":25,"level":0,"costs":{"1":1,"2":2,"3":2,"4":3,"5":3,"6":3,"7":4,"8":5,"9":5,"10":6,"11":7,"12":8,"13":9,"14":11,"15":12,"16":14,"17":16,"18":19,"19":22,"20":25,"21":28,"22":33,"23":38,"24":43,"25":50},"effects":{"primary":{"1":1.5,"2":2.11,"3":2.98,"4":4.63,"5":7.19,"6":11.2,"7":19.1,"8":35.8,"9":67.3,"10":138,"11":311,"12":763,"13":2040,"14":6480,"15":22300,"16":90200,"17":427000,"18":2550000,"19":19100000,"20":177000000,"21":2050000000,"22":33600000000,"23":776000000000,"24":25200000000000,"25":1300000000000000},"secondary":{"1":1,"2":2,"3":3,"4":4,"5":5,"6":6,"7":7,"8":8,"9":9,"10":10,"11":11,"12":12,"13":13,"14":14,"15":15,"16":16,"17":18,"18":20,"19":22,"20":24,"21":26,"22":28,"23":30,"24":32,"25":35},"tertiary":{"1":0}},"reductions":{"cs":1,"sc":0,"pet":0,"hs":0,"hscs":0,"hssc":0,"phom":0,"fairy":0,"chest":0,"boss":0},"reductions_orig":{"cs":1,"sc":0,"pet":0,"hs":0,"hscs":0,"hssc":0,"phom":0,"fairy":0,"chest":0,"boss":0},"efficiency":0,"type":"damage","inactive_adj":0},"skill14":{"id":"HelperBoost","branch":"BranchYellow","slot":4,"sp_req":20,"skill_req":"skill11","tier":"III","name":"战略洞悉","max":25,"level":0,"costs":{"1":2,"2":2,"3":3,"4":3,"5":3,"6":4,"7":5,"8":5,"9":6,"10":7,"11":8,"12":9,"13":11,"14":12,"15":14,"16":16,"17":19,"18":22,"19":25,"20":28,"21":33,"22":38,"23":43,"24":50,"25":57},"effects":{"primary":{"1":0.0025,"2":0.0047,"3":0.0076,"4":0.0105,"5":0.0134,"6":0.017,"7":0.0212,"8":0.0254,"9":0.0302,"10":0.0358,"11":0.042,"12":0.0488,"13":0.0568,"14":0.0655,"15":0.0754,"16":0.0866,"17":0.0995,"18":0.1143,"19":0.1309,"20":0.1494,"21":0.1709,"22":0.1955,"23":0.2235,"24":0.256,"25":0.2933},"secondary":{"1":0.02,"2":0.044,"3":0.07,"4":0.095,"5":0.121,"6":0.148,"7":0.176,"8":0.204,"9":0.233,"10":0.263,"11":0.293,"12":0.324,"13":0.356,"14":0.388,"15":0.421,"16":0.456,"17":0.49,"18":0.526,"19":0.563,"20":0.6,"21":0.639,"22":0.678,"23":0.718,"24":0.76,"25":0.802},"tertiary":{"1":0}},"reductions":{"cs":108,"sc":105.2,"pet":111.5,"hs":111.5,"hscs":111.5,"hssc":111.5,"phom":44.800000000000004,"fairy":66.4,"chest":52,"boss":44.800000000000004},"reductions_orig":{"cs":108,"sc":105.2,"pet":111.5,"hs":111.5,"hscs":111.5,"hssc":111.5,"phom":44.800000000000004,"fairy":66.4,"chest":52,"boss":44.800000000000004},"efficiency":0,"type":"damage","inactive_adj":0},"skill15":{"id":"HelperInspiredWeaken","branch":"BranchYellow","slot":5,"sp_req":20,"skill_req":"skill12","tier":"III","name":"灼热之光","max":25,"level":0,"costs":{"1":2,"2":2,"3":3,"4":3,"5":3,"6":4,"7":5,"8":5,"9":6,"10":7,"11":8,"12":9,"13":11,"14":12,"15":14,"16":16,"17":19,"18":22,"19":25,"20":28,"21":33,"22":38,"23":43,"24":50,"25":57},"effects":{"primary":{"1":0.0075,"2":0.00951,"3":0.0135,"4":0.0192,"5":0.0272,"6":0.0432,"7":0.0763,"8":0.135,"9":0.265,"10":0.576,"11":1.39,"12":3.68,"13":11.9,"14":42,"15":179,"16":911,"17":6030,"18":51500,"19":563000,"20":7850000,"21":163000000,"22":4960000000,"23":221000000000,"24":16700000000000,"25":2110000000000000},"secondary":{"1":1,"2":2,"3":4,"4":7,"5":9,"6":12,"7":16,"8":21,"9":26,"10":33,"11":41,"12":51,"13":63,"14":77,"15":95,"16":115,"17":142,"18":173,"19":211,"20":255,"21":310,"22":376,"23":454,"24":550,"25":664},"tertiary":{"1":0}},"reductions":{"cs":1,"sc":0.6,"pet":0.5,"hs":0.5,"hscs":0.5,"hssc":0.5,"phom":0,"fairy":0,"chest":0,"boss":0},"reductions_orig":{"cs":1,"sc":0.6,"pet":0.5,"hs":0.5,"hscs":0.5,"hssc":0.5,"phom":0,"fairy":0,"chest":0,"boss":0},"efficiency":0,"type":"damage","inactive_adj":0},"skill16":{"id":"ClanQTE","branch":"BranchYellow","slot":6,"sp_req":20,"skill_req":"skill13","tier":"III","name":"协同进攻","max":25,"level":0,"costs":{"1":2,"2":2,"3":3,"4":3,"5":3,"6":4,"7":5,"8":5,"9":6,"10":7,"11":8,"12":9,"13":11,"14":12,"15":14,"16":16,"17":19,"18":22,"19":25,"20":28,"21":33,"22":38,"23":43,"24":50,"25":57},"effects":{"primary":{"1":1.8,"2":2.59,"3":4.14,"4":6.62,"5":10.6,"6":18.8,"7":36.9,"8":72.5,"9":157,"10":376,"11":990,"12":2860,"13":9930,"14":37700,"15":170000,"16":914000,"17":6290000,"18":55300000,"19":616000000,"20":8660000000,"21":178000000000,"22":5330000000000,"23":230000000000000,"24":16500000000000000,"25":1960000000000000000},"secondary":{"1":0,"2":1,"3":2,"4":3,"5":4,"6":5,"7":6,"8":7,"9":8,"10":9,"11":10,"12":11,"13":12,"14":13,"15":14,"16":15,"17":16,"18":17,"19":18,"20":20,"21":22,"22":24,"23":26,"24":28,"25":30},"tertiary":{"1":2}},"reductions":{"cs":1,"sc":0.6,"pet":0.5,"hs":0.5,"hscs":0.5,"hssc":0.5,"phom":0,"fairy":0,"chest":0,"boss":0},"reductions_orig":{"cs":1,"sc":0.6,"pet":0.5,"hs":0.5,"hscs":0.5,"hssc":0.5,"phom":0,"fairy":0,"chest":0,"boss":0},"efficiency":0,"type":"damage","inactive_adj":0},"skill17":{"id":"HelperDmgQTE","branch":"BranchYellow","slot":7,"sp_req":50,"skill_req":"skill14","tier":"IV","name":"灵魂觉醒","max":15,"level":0,"costs":{"1":3,"2":4,"3":5,"4":7,"5":9,"6":12,"7":16,"8":21,"9":27,"10":35,"11":46,"12":60,"13":78,"14":101,"15":131,"16":-1,"17":-1,"18":-1,"19":-1,"20":-1,"21":-1,"22":-1,"23":-1,"24":-1,"25":-1},"effects":{"primary":{"1":1.21,"2":1.45,"3":1.8,"4":2.36,"5":3.25,"6":4.84,"7":7.9,"8":14.3,"9":29.2,"10":69.1,"11":198,"12":712,"13":3420,"14":23400,"15":256000,"16":-1,"17":-1,"18":-1,"19":-1,"20":-1,"21":-1,"22":-1,"23":-1,"24":-1,"25":-1},"secondary":{"1":0,"2":0,"3":0,"4":0,"5":0,"6":0,"7":0,"8":0,"9":0,"10":0,"11":0,"12":0,"13":0,"14":0,"15":0,"16":-1,"17":-1,"18":-1,"19":-1,"20":-1,"21":-1,"22":-1,"23":-1,"24":-1,"25":-1},"tertiary":{"1":5}},"reductions":{"cs":1,"sc":0.6,"pet":0.5,"hs":0.5,"hscs":0.5,"hssc":0.5,"phom":0,"fairy":0,"chest":0,"boss":0},"reductions_orig":{"cs":1,"sc":0.6,"pet":0.5,"hs":0.5,"hscs":0.5,"hssc":0.5,"phom":0,"fairy":0,"chest":0,"boss":0},"efficiency":0,"type":"damage","inactive_adj":0},"skill18":{"id":"ClanShipStun","branch":"BranchYellow","slot":9,"sp_req":50,"skill_req":"skill16","tier":"IV","name":"锚定射击","max":15,"level":0,"costs":{"1":3,"2":4,"3":5,"4":7,"5":9,"6":12,"7":16,"8":21,"9":27,"10":35,"11":46,"12":60,"13":78,"14":101,"15":131,"16":-1,"17":-1,"18":-1,"19":-1,"20":-1,"21":-1,"22":-1,"23":-1,"24":-1,"25":-1},"effects":{"primary":{"1":3.5,"2":10,"3":33.6,"4":153,"5":925,"6":8340,"7":123000,"8":3180000,"9":154000000,"10":16100000000,"11":4580000000000,"12":4280000000000000,"13":17300000000000000000,"14":4.34e+23,"15":1.13e+29,"16":-1,"17":-1,"18":-1,"19":-1,"20":-1,"21":-1,"22":-1,"23":-1,"24":-1,"25":-1},"secondary":{"1":0.8,"2":0.9,"3":1,"4":1.1,"5":1.2,"6":1.3,"7":1.4,"8":1.5,"9":1.6,"10":1.7,"11":1.8,"12":1.9,"13":2,"14":2.1,"15":2.2,"16":-1,"17":-1,"18":-1,"19":-1,"20":-1,"21":-1,"22":-1,"23":-1,"24":-1,"25":-1},"tertiary":{"1":0}},"reductions":{"cs":1,"sc":1,"pet":1,"hs":1,"hscs":1,"hssc":1,"phom":0,"fairy":0,"chest":0,"boss":0},"reductions_orig":{"cs":1,"sc":1,"pet":1,"hs":1,"hscs":1,"hssc":1,"phom":0,"fairy":0,"chest":0,"boss":0},"efficiency":0,"type":"damage","inactive_adj":0},"skill19":{"id":"MPCapacityBoost","branch":"BranchBlue","slot":0,"sp_req":0,"skill_req":-1,"tier":"I","name":"极限突破","max":25,"level":0,"costs":{"1":1,"2":2,"3":2,"4":3,"5":3,"6":3,"7":4,"8":5,"9":5,"10":6,"11":7,"12":8,"13":9,"14":11,"15":12,"16":14,"17":16,"18":19,"19":22,"20":25,"21":28,"22":33,"23":38,"24":43,"25":50},"effects":{"primary":{"1":5,"2":8,"3":12,"4":19,"5":26,"6":35,"7":46,"8":62,"9":80,"10":103,"11":132,"12":168,"13":213,"14":269,"15":337,"16":421,"17":524,"18":652,"19":809,"20":1000,"21":1234,"22":1520,"23":1870,"24":2295,"25":2815},"secondary":{"1":0.1,"2":0.228,"3":0.373,"4":0.538,"5":0.727,"6":0.941,"7":1.185,"8":1.463,"9":1.779,"10":2.139,"11":2.549,"12":3.015,"13":3.546,"14":4.151,"15":4.839,"16":5.622,"17":6.514,"18":7.529,"19":8.684,"20":10,"21":11.497,"22":13.201,"23":15.141,"24":17.35,"25":19.864},"tertiary":{"1":0}},"reductions":{"cs":0,"sc":0,"pet":0,"hs":0,"hscs":0,"hssc":0,"phom":0,"fairy":0,"chest":0,"boss":0},"reductions_orig":{"cs":0,"sc":0,"pet":0,"hs":0,"hscs":0,"hssc":0,"phom":0,"fairy":0,"chest":0,"boss":0},"efficiency":0,"type":"damage","inactive_adj":0},"skill20":{"id":"MidasSkillBoost","branch":"BranchBlue","slot":1,"sp_req":3,"skill_req":"skill19","tier":"II","name":"终极米达斯","max":25,"level":0,"costs":{"1":1,"2":2,"3":2,"4":3,"5":3,"6":3,"7":4,"8":5,"9":5,"10":6,"11":7,"12":8,"13":9,"14":11,"15":12,"16":14,"17":16,"18":19,"19":22,"20":25,"21":28,"22":33,"23":38,"24":43,"25":50},"effects":{"primary":{"1":1.8,"2":2.92,"3":4.79,"4":8.78,"5":16.1,"6":29.5,"7":60.2,"8":136,"9":309,"10":776,"11":2150,"12":6590,"13":22200,"14":90200,"15":402000,"16":2140000,"17":13500000,"18":110000000,"19":1140000000,"20":15000000000,"21":249000000000,"22":6020000000000,"23":210000000000000,"24":10500000000000000,"25":864000000000000000},"secondary":{"1":1.2,"2":1.45,"3":1.75,"4":2.22,"5":2.8,"6":3.54,"7":4.69,"8":6.5,"9":8.99,"10":13,"11":19.7,"12":31.1,"13":51.4,"14":92.5,"15":174,"16":356,"17":793,"18":2000,"19":5760,"20":18700,"21":69300,"22":317000,"23":1790000,"24":12500000,"25":119000000},"tertiary":{"1":0}},"reductions":{"cs":0,"sc":0,"pet":0,"hs":0,"hscs":0,"hssc":0,"phom":0.48,"fairy":0.48,"chest":0.8,"boss":0.8},"reductions_orig":{"cs":0,"sc":0,"pet":0,"hs":0,"hscs":0,"hssc":0,"phom":0.48,"fairy":0.48,"chest":0.8,"boss":0.8},"efficiency":0,"type":"gold","inactive_adj":0},"skill21":{"id":"BurstSkillBoost","branch":"BranchBlue","slot":2,"sp_req":3,"skill_req":"skill19","tier":"II","name":"天使光辉","max":25,"level":0,"costs":{"1":1,"2":2,"3":2,"4":3,"5":3,"6":3,"7":4,"8":5,"9":5,"10":6,"11":7,"12":8,"13":9,"14":11,"15":12,"16":14,"17":16,"18":19,"19":22,"20":25,"21":28,"22":33,"23":38,"24":43,"25":50},"effects":{"primary":{"1":2,"2":3,"3":4.5,"4":7.52,"5":12.6,"6":21,"7":38.9,"8":80,"9":164,"10":374,"11":937,"12":2590,"13":7860,"14":28800,"15":115000,"16":553000,"17":3160000,"18":23400000,"19":222000000,"20":2700000000,"21":41800000000,"22":965000000000,"23":33000000000000,"24":1660000000000000,"25":143000000000000000},"secondary":{"1":0,"2":1,"3":1,"4":2,"5":3,"6":4,"7":5,"8":6,"9":7,"10":8,"11":10,"12":12,"13":14,"14":16,"15":18,"16":20,"17":24,"18":29,"19":34,"20":40,"21":46,"22":52,"23":58,"24":64,"25":70},"tertiary":{"1":0}},"reductions":{"cs":0,"sc":0,"pet":0,"hs":1,"hscs":1,"hssc":1,"phom":0,"fairy":0,"chest":0,"boss":0},"reductions_orig":{"cs":0,"sc":0,"pet":0,"hs":1,"hscs":1,"hssc":1,"phom":0,"fairy":0,"chest":0,"boss":0},"efficiency":0,"type":"damage","inactive_adj":0},"skill22":{"id":"CloneDmg","branch":"BranchBlue","slot":3,"sp_req":3,"skill_req":"skill19","tier":"II","name":"幽魂复仇","max":25,"level":0,"costs":{"1":1,"2":2,"3":2,"4":3,"5":3,"6":3,"7":4,"8":5,"9":5,"10":6,"11":7,"12":8,"13":9,"14":11,"15":12,"16":14,"17":16,"18":19,"19":22,"20":25,"21":28,"22":33,"23":38,"24":43,"25":50},"effects":{"primary":{"1":1.5,"2":2.06,"3":2.84,"4":4.34,"5":6.64,"6":10.2,"7":17.2,"8":32.4,"9":60.9,"10":126,"11":289,"12":727,"13":2010,"14":6670,"15":24200,"16":105000,"17":537000,"18":3540000,"19":29700000,"20":317000000,"21":4260000000,"22":83900000000,"23":2400000000000,"24":99100000000000,"25":6810000000000000},"secondary":{"1":0.1,"2":0.21,"3":0.33,"4":0.46,"5":0.59,"6":0.74,"7":0.89,"8":1.05,"9":1.22,"10":1.41,"11":1.6,"12":1.81,"13":2.03,"14":2.26,"15":2.51,"16":2.77,"17":3.05,"18":3.35,"19":3.66,"20":4,"21":4.36,"22":4.74,"23":5.14,"24":5.57,"25":6.02},"tertiary":{"1":0}},"reductions":{"cs":0,"sc":1,"pet":0,"hs":0,"hscs":0,"hssc":0,"phom":0,"fairy":0,"chest":0,"boss":0},"reductions_orig":{"cs":0,"sc":1,"pet":0,"hs":0,"hscs":0,"hssc":0,"phom":0,"fairy":0,"chest":0,"boss":0},"efficiency":0,"type":"damage","inactive_adj":0},"skill23":{"id":"Fairy","branch":"BranchBlue","slot":4,"sp_req":20,"skill_req":"skill20","tier":"III","name":"仙女魔力","max":10,"level":0,"costs":{"1":2,"2":2,"3":3,"4":3,"5":3,"6":4,"7":5,"8":5,"9":6,"10":7,"11":-1,"12":-1,"13":-1,"14":-1,"15":-1,"16":-1,"17":-1,"18":-1,"19":-1,"20":-1,"21":-1,"22":-1,"23":-1,"24":-1,"25":-1},"effects":{"primary":{"1":0.04,"2":0.16,"3":0.35,"4":0.54,"5":0.75,"6":1.03,"7":1.38,"8":1.76,"9":2.21,"10":2.75,"11":-1,"12":-1,"13":-1,"14":-1,"15":-1,"16":-1,"17":-1,"18":-1,"19":-1,"20":-1,"21":-1,"22":-1,"23":-1,"24":-1,"25":-1},"secondary":{"1":4,"2":8.6,"3":13.5,"4":18.8,"5":24.5,"6":30.6,"7":37.2,"8":44.2,"9":51.8,"10":60,"11":-1,"12":-1,"13":-1,"14":-1,"15":-1,"16":-1,"17":-1,"18":-1,"19":-1,"20":-1,"21":-1,"22":-1,"23":-1,"24":-1,"25":-1},"tertiary":{"1":0}},"reductions":{"cs":0,"sc":0,"pet":0,"hs":0,"hscs":0,"hssc":0,"phom":0,"fairy":0.8,"chest":0,"boss":0},"reductions_orig":{"cs":0,"sc":0,"pet":0,"hs":0,"hscs":0,"hssc":0,"phom":0,"fairy":0.8,"chest":0,"boss":0},"efficiency":0,"type":"gold","inactive_adj":0},"skill24":{"id":"ManaStealSkillBoost","branch":"BranchBlue","slot":5,"sp_req":20,"skill_req":"skill21","tier":"III","name":"法力虹吸","max":25,"level":0,"costs":{"1":2,"2":2,"3":3,"4":3,"5":3,"6":4,"7":5,"8":5,"9":6,"10":7,"11":8,"12":9,"13":11,"14":12,"15":14,"16":16,"17":19,"18":22,"19":25,"20":28,"21":33,"22":38,"23":43,"24":50,"25":57},"effects":{"primary":{"1":0.0005,"2":0.0007,"3":0.001,"4":0.0013,"5":0.0016,"6":0.002,"7":0.0025,"8":0.0031,"9":0.0038,"10":0.0047,"11":0.0056,"12":0.0068,"13":0.0081,"14":0.0097,"15":0.0115,"16":0.0137,"17":0.0162,"18":0.0192,"19":0.0226,"20":0.0265,"21":0.0312,"22":0.0366,"23":0.0428,"24":0.0501,"25":0.0584},"secondary":{"1":0,"2":0,"3":0,"4":0,"5":0,"6":0,"7":0,"8":0,"9":0,"10":0,"11":0,"12":0,"13":0,"14":0,"15":0,"16":0,"17":0,"18":0,"19":0,"20":0,"21":0,"22":0,"23":0,"24":0,"25":0},"tertiary":{"1":0.005}},"reductions":{"cs":0,"sc":0,"pet":0,"hs":0,"hscs":0,"hssc":0,"phom":0,"fairy":0,"chest":0,"boss":0},"reductions_orig":{"cs":0,"sc":0,"pet":0,"hs":0,"hscs":0,"hssc":0,"phom":0,"fairy":0,"chest":0,"boss":0},"efficiency":0,"type":"damage","inactive_adj":0},"skill25":{"id":"CloneSkillBoost","branch":"BranchBlue","slot":6,"sp_req":20,"skill_req":"skill22","tier":"III","name":"永恒黑暗","max":25,"level":0,"costs":{"1":2,"2":2,"3":3,"4":3,"5":3,"6":4,"7":5,"8":5,"9":6,"10":7,"11":8,"12":9,"13":11,"14":12,"15":14,"16":16,"17":19,"18":22,"19":25,"20":28,"21":33,"22":38,"23":43,"24":50,"25":57},"effects":{"primary":{"1":2,"2":5,"3":9,"4":13,"5":18,"6":24,"7":33,"8":41,"9":53,"10":66,"11":83,"12":102,"13":127,"14":155,"15":190,"16":231,"17":283,"18":347,"19":422,"20":510,"21":620,"22":752,"23":908,"24":1100,"25":1328},"secondary":{"1":0,"2":1,"3":2,"4":3,"5":4,"6":6,"7":8,"8":10,"9":12,"10":14,"11":16,"12":18,"13":20,"14":23,"15":26,"16":29,"17":33,"18":38,"19":44,"20":51,"21":59,"22":68,"23":78,"24":89,"25":101},"tertiary":{"1":0}},"reductions":{"cs":0,"sc":0,"pet":0,"hs":0,"hscs":0,"hssc":0,"phom":0,"fairy":0,"chest":0,"boss":0},"reductions_orig":{"cs":0,"sc":0,"pet":0,"hs":0,"hscs":0,"hssc":0,"phom":0,"fairy":0,"chest":0,"boss":0},"efficiency":0,"type":"damage","inactive_adj":0},"skill26":{"id":"ManaMonster","branch":"BranchBlue","slot":7,"sp_req":50,"skill_req":"skill23","tier":"IV","name":"曼尼马纳","max":15,"level":0,"costs":{"1":3,"2":4,"3":5,"4":7,"5":9,"6":12,"7":16,"8":21,"9":27,"10":35,"11":46,"12":60,"13":78,"14":101,"15":131,"16":-1,"17":-1,"18":-1,"19":-1,"20":-1,"21":-1,"22":-1,"23":-1,"24":-1,"25":-1},"effects":{"primary":{"1":2,"2":4,"3":6.5,"4":10,"5":14.5,"6":20.5,"7":28.5,"8":39,"9":52.5,"10":70,"11":93,"12":123,"13":162,"14":212.5,"15":278,"16":-1,"17":-1,"18":-1,"19":-1,"20":-1,"21":-1,"22":-1,"23":-1,"24":-1,"25":-1},"secondary":{"1":0,"2":0,"3":0,"4":0,"5":0,"6":0,"7":0,"8":0,"9":0,"10":0,"11":0,"12":0,"13":0,"14":0,"15":0,"16":-1,"17":-1,"18":-1,"19":-1,"20":-1,"21":-1,"22":-1,"23":-1,"24":-1,"25":-1},"tertiary":{"1":0}},"reductions":{"cs":0,"sc":0,"pet":0,"hs":0,"hscs":0,"hssc":0,"phom":0,"fairy":0,"chest":0,"boss":0},"reductions_orig":{"cs":0,"sc":0,"pet":0,"hs":0,"hscs":0,"hssc":0,"phom":0,"fairy":0,"chest":0,"boss":0},"efficiency":0,"type":"damage","inactive_adj":0},"skill27":{"id":"CritSkillBoost","branch":"BranchBlue","slot":8,"sp_req":50,"skill_req":"skill24","tier":"IV","name":"闪电打击","max":15,"level":0,"costs":{"1":3,"2":4,"3":5,"4":7,"5":9,"6":12,"7":16,"8":21,"9":27,"10":35,"11":46,"12":60,"13":78,"14":101,"15":131,"16":-1,"17":-1,"18":-1,"19":-1,"20":-1,"21":-1,"22":-1,"23":-1,"24":-1,"25":-1},"effects":{"primary":{"1":0.1,"2":0.1532,"3":0.2072,"4":0.2671,"5":0.3288,"6":0.3942,"7":0.4627,"8":0.5323,"9":0.6003,"10":0.6659,"11":0.7288,"12":0.7867,"13":0.8379,"14":0.8809,"15":0.9147,"16":-1,"17":-1,"18":-1,"19":-1,"20":-1,"21":-1,"22":-1,"23":-1,"24":-1,"25":-1},"secondary":{"1":0.938,"2":0.941,"3":0.944,"4":0.947,"5":0.95,"6":0.953,"7":0.956,"8":0.959,"9":0.962,"10":0.965,"11":0.968,"12":0.971,"13":0.974,"14":0.977,"15":0.98,"16":-1,"17":-1,"18":-1,"19":-1,"20":-1,"21":-1,"22":-1,"23":-1,"24":-1,"25":-1},"tertiary":{"1":0.02}},"reductions":{"cs":1,"sc":1,"pet":1,"hs":1,"hscs":1,"hssc":1,"phom":0,"fairy":0,"chest":0,"boss":0},"reductions_orig":{"cs":1,"sc":1,"pet":1,"hs":1,"hscs":1,"hssc":1,"phom":0,"fairy":0,"chest":0,"boss":0},"efficiency":0,"type":"damage","inactive_adj":0},"skill28":{"id":"BossTimer","branch":"BranchBlue","slot":9,"sp_req":50,"skill_req":"skill25","tier":"IV","name":"相位转移","max":15,"level":0,"costs":{"1":3,"2":4,"3":5,"4":7,"5":9,"6":12,"7":16,"8":21,"9":27,"10":35,"11":46,"12":60,"13":78,"14":101,"15":131,"16":-1,"17":-1,"18":-1,"19":-1,"20":-1,"21":-1,"22":-1,"23":-1,"24":-1,"25":-1},"effects":{"primary":{"1":1.31,"2":1.7,"3":2.31,"4":3.4,"5":5.4,"6":9.54,"7":19.2,"8":44.9,"9":125,"10":426,"11":1920,"12":12000,"13":113000,"14":1770000,"15":53900000,"16":-1,"17":-1,"18":-1,"19":-1,"20":-1,"21":-1,"22":-1,"23":-1,"24":-1,"25":-1},"secondary":{"1":0.96,"2":0.92,"3":0.88,"4":0.84,"5":0.8,"6":0.76,"7":0.72,"8":0.68,"9":0.64,"10":0.6,"11":0.55,"12":0.5,"13":0.45,"14":0.4,"15":0.35,"16":-1,"17":-1,"18":-1,"19":-1,"20":-1,"21":-1,"22":-1,"23":-1,"24":-1,"25":-1},"tertiary":{"1":0}},"reductions":{"cs":1.5,"sc":2.8,"pet":2.1,"hs":3.1,"hscs":3.1,"hssc":3.1,"phom":0.48,"fairy":0.48,"chest":0.8,"boss":0.8},"reductions_orig":{"cs":1.5,"sc":2.8,"pet":2.1,"hs":3.1,"hscs":3.1,"hssc":3.1,"phom":0.48,"fairy":0.48,"chest":0.8,"boss":0.8},"efficiency":0,"type":"damage","inactive_adj":0},"skill29":{"id":"OfflineGold","branch":"BranchGreen","slot":0,"sp_req":0,"skill_req":-1,"tier":"I","name":"盗圣","max":25,"level":0,"costs":{"1":1,"2":2,"3":2,"4":3,"5":3,"6":3,"7":4,"8":5,"9":5,"10":6,"11":7,"12":8,"13":9,"14":11,"15":12,"16":14,"17":16,"18":19,"19":22,"20":25,"21":28,"22":33,"23":38,"24":43,"25":50},"effects":{"primary":{"1":1.6,"2":2.55,"3":4.06,"4":7.13,"5":12.5,"6":22,"7":42.5,"8":90.2,"9":191,"10":445,"11":1130,"12":3140,"13":9490,"14":34000,"15":132000,"16":605000,"17":3240000,"18":21900000,"19":185000000,"20":1940000000,"21":25400000000,"22":470000000000,"23":12300000000000,"24":450000000000000,"25":26300000000000000},"secondary":{"1":1.2,"2":1.38,"3":1.58,"4":1.94,"5":2.38,"6":2.92,"7":3.81,"8":5.29,"9":7.35,"10":10.8,"11":16.9,"12":27.8,"13":48.4,"14":93.3,"15":189,"16":421,"17":1030,"18":2840,"19":8830,"20":30800,"21":119000,"22":541000,"23":2860000,"24":17300000,"25":125000000},"tertiary":{"1":0}},"reductions":{"cs":0,"sc":0,"pet":0,"hs":0,"hscs":0,"hssc":0,"phom":0.9,"fairy":0.9,"chest":0.9,"boss":0.9},"reductions_orig":{"cs":0,"sc":0,"pet":0,"hs":0,"hscs":0,"hssc":0,"phom":0.9,"fairy":0.9,"chest":0.9,"boss":0.9},"efficiency":0,"type":"gold","inactive_adj":0.1},"skill30":{"id":"CritSkillBoostDmg","branch":"BranchGreen","slot":1,"sp_req":3,"skill_req":"skill29","tier":"II","name":"刺杀","max":25,"level":0,"costs":{"1":1,"2":2,"3":2,"4":3,"5":3,"6":3,"7":4,"8":5,"9":5,"10":6,"11":7,"12":8,"13":9,"14":11,"15":12,"16":14,"17":16,"18":19,"19":22,"20":25,"21":28,"22":33,"23":38,"24":43,"25":50},"effects":{"primary":{"1":1.6,"2":2.52,"3":3.97,"4":7.11,"5":12.8,"6":22.9,"7":46.6,"8":107,"9":248,"10":644,"11":1890,"12":6210,"13":22900,"14":106000,"15":546000,"16":3480000,"17":27400000,"18":293000000,"19":4230000000,"20":81500000000,"21":2100000000000,"22":86000000000000,"23":5600000000000000,"24":573000000000000000,"25":110000000000000000000},"secondary":{"1":2,"2":5,"3":9,"4":13,"5":18,"6":24,"7":33,"8":41,"9":53,"10":66,"11":83,"12":102,"13":127,"14":155,"15":190,"16":231,"17":283,"18":347,"19":422,"20":510,"21":620,"22":752,"23":908,"24":1100,"25":1328},"tertiary":{"1":0}},"reductions":{"cs":0.5,"sc":0.6,"pet":0.6,"hs":0.6,"hscs":0.6,"hssc":0.6,"phom":0,"fairy":0,"chest":0,"boss":0},"reductions_orig":{"cs":0.5,"sc":0.6,"pet":0.6,"hs":0.6,"hscs":0.6,"hssc":0.6,"phom":0,"fairy":0,"chest":0,"boss":0},"efficiency":0,"type":"damage","inactive_adj":0},"skill31":{"id":"AutoAdvance","branch":"BranchGreen","slot":2,"sp_req":3,"skill_req":"skill29","tier":"II","name":"无声行军","max":10,"level":0,"costs":{"1":1,"2":2,"3":2,"4":3,"5":3,"6":3,"7":4,"8":5,"9":5,"10":6,"11":-1,"12":-1,"13":-1,"14":-1,"15":-1,"16":-1,"17":-1,"18":-1,"19":-1,"20":-1,"21":-1,"22":-1,"23":-1,"24":-1,"25":-1},"effects":{"primary":{"1":1,"2":2.25,"3":4.43,"4":9.98,"5":21.9,"6":47.3,"7":123,"8":381,"9":1180,"10":4360,"11":-1,"12":-1,"13":-1,"14":-1,"15":-1,"16":-1,"17":-1,"18":-1,"19":-1,"20":-1,"21":-1,"22":-1,"23":-1,"24":-1,"25":-1},"secondary":{"1":0,"2":0.05,"3":0.1,"4":0.2,"5":0.3,"6":0.42,"7":0.54,"8":0.66,"9":0.78,"10":0.9,"11":-1,"12":-1,"13":-1,"14":-1,"15":-1,"16":-1,"17":-1,"18":-1,"19":-1,"20":-1,"21":-1,"22":-1,"23":-1,"24":-1,"25":-1},"tertiary":{"1":0.99}},"reductions":{"cs":1,"sc":1,"pet":1,"hs":1,"hscs":1,"hssc":1,"phom":0,"fairy":0,"chest":0,"boss":0},"reductions_orig":{"cs":1,"sc":1,"pet":1,"hs":1,"hscs":1,"hssc":1,"phom":0,"fairy":0,"chest":0,"boss":0},"efficiency":0,"type":"damage","inactive_adj":1},"skill32":{"id":"MultiMonsters","branch":"BranchGreen","slot":3,"sp_req":3,"skill_req":"skill29","tier":"II","name":"伏击","max":10,"level":0,"costs":{"1":1,"2":2,"3":2,"4":3,"5":3,"6":3,"7":4,"8":5,"9":5,"10":6,"11":-1,"12":-1,"13":-1,"14":-1,"15":-1,"16":-1,"17":-1,"18":-1,"19":-1,"20":-1,"21":-1,"22":-1,"23":-1,"24":-1,"25":-1},"effects":{"primary":{"1":1,"2":2,"3":4,"4":6,"5":8,"6":10,"7":12,"8":14,"9":16,"10":20,"11":-1,"12":-1,"13":-1,"14":-1,"15":-1,"16":-1,"17":-1,"18":-1,"19":-1,"20":-1,"21":-1,"22":-1,"23":-1,"24":-1,"25":-1},"secondary":{"1":0.01,"2":0.016,"3":0.024,"4":0.036,"5":0.052,"6":0.075,"7":0.107,"8":0.151,"9":0.213,"10":0.3,"11":-1,"12":-1,"13":-1,"14":-1,"15":-1,"16":-1,"17":-1,"18":-1,"19":-1,"20":-1,"21":-1,"22":-1,"23":-1,"24":-1,"25":-1},"tertiary":{"1":0}},"reductions":{"cs":0,"sc":0,"pet":0,"hs":0,"hscs":0,"hssc":0,"phom":0,"fairy":0,"chest":0.8,"boss":0},"reductions_orig":{"cs":0,"sc":0,"pet":0,"hs":0,"hscs":0,"hssc":0,"phom":0,"fairy":0,"chest":0.8,"boss":0},"efficiency":0,"type":"gold","inactive_adj":0},"skill33":{"id":"PetOfflineDmg","branch":"BranchGreen","slot":4,"sp_req":20,"skill_req":"skill30","tier":"III","name":"暮光面纱","max":10,"level":0,"costs":{"1":2,"2":2,"3":3,"4":3,"5":3,"6":4,"7":5,"8":5,"9":6,"10":7,"11":-1,"12":-1,"13":-1,"14":-1,"15":-1,"16":-1,"17":-1,"18":-1,"19":-1,"20":-1,"21":-1,"22":-1,"23":-1,"24":-1,"25":-1},"effects":{"primary":{"1":0.01,"2":0.03,"3":0.128,"4":0.541,"5":2.29,"6":13,"7":96,"8":706,"9":6551,"10":75000,"11":-1,"12":-1,"13":-1,"14":-1,"15":-1,"16":-1,"17":-1,"18":-1,"19":-1,"20":-1,"21":-1,"22":-1,"23":-1,"24":-1,"25":-1},"secondary":{"1":1,"2":1.3,"3":1.9,"4":2.7,"5":3.8,"6":5.8,"7":9.5,"8":15.5,"9":26.9,"10":50,"11":-1,"12":-1,"13":-1,"14":-1,"15":-1,"16":-1,"17":-1,"18":-1,"19":-1,"20":-1,"21":-1,"22":-1,"23":-1,"24":-1,"25":-1},"tertiary":{"1":0}},"reductions":{"cs":0,"sc":0,"pet":1,"hs":0,"hscs":0,"hssc":0,"phom":0,"fairy":0,"chest":0,"boss":0},"reductions_orig":{"cs":0,"sc":0,"pet":1,"hs":0,"hscs":0,"hssc":0,"phom":0,"fairy":0,"chest":0,"boss":0},"efficiency":0,"type":"damage","inactive_adj":0},"skill34":{"id":"InactiveClanShip","branch":"BranchGreen","slot":5,"sp_req":20,"skill_req":"skill31","tier":"III","name":"幽灵战舰","max":10,"level":0,"costs":{"1":2,"2":2,"3":3,"4":3,"5":3,"6":4,"7":5,"8":5,"9":6,"10":7,"11":-1,"12":-1,"13":-1,"14":-1,"15":-1,"16":-1,"17":-1,"18":-1,"19":-1,"20":-1,"21":-1,"22":-1,"23":-1,"24":-1,"25":-1},"effects":{"primary":{"1":0.01,"2":0.03,"3":0.128,"4":0.541,"5":2.29,"6":13,"7":96,"8":706,"9":6551,"10":75000,"11":-1,"12":-1,"13":-1,"14":-1,"15":-1,"16":-1,"17":-1,"18":-1,"19":-1,"20":-1,"21":-1,"22":-1,"23":-1,"24":-1,"25":-1},"secondary":{"1":1,"2":1.3,"3":1.9,"4":2.7,"5":3.8,"6":5.8,"7":9.5,"8":15.5,"9":26.9,"10":50,"11":-1,"12":-1,"13":-1,"14":-1,"15":-1,"16":-1,"17":-1,"18":-1,"19":-1,"20":-1,"21":-1,"22":-1,"23":-1,"24":-1,"25":-1},"tertiary":{"1":0}},"reductions":{"cs":1,"sc":0,"pet":0,"hs":0,"hscs":0,"hssc":0,"phom":0,"fairy":0,"chest":0,"boss":0},"reductions_orig":{"cs":1,"sc":0,"pet":0,"hs":0,"hscs":0,"hssc":0,"phom":0,"fairy":0,"chest":0,"boss":0},"efficiency":0,"type":"damage","inactive_adj":0},"skill35":{"id":"OfflineCloneDmg","branch":"BranchGreen","slot":6,"sp_req":20,"skill_req":"skill32","tier":"III","name":"暗影刺杀","max":10,"level":0,"costs":{"1":2,"2":2,"3":3,"4":3,"5":3,"6":4,"7":5,"8":5,"9":6,"10":7,"11":-1,"12":-1,"13":-1,"14":-1,"15":-1,"16":-1,"17":-1,"18":-1,"19":-1,"20":-1,"21":-1,"22":-1,"23":-1,"24":-1,"25":-1},"effects":{"primary":{"1":0.01,"2":0.03,"3":0.128,"4":0.541,"5":2.29,"6":13,"7":96,"8":706,"9":6551,"10":75000,"11":-1,"12":-1,"13":-1,"14":-1,"15":-1,"16":-1,"17":-1,"18":-1,"19":-1,"20":-1,"21":-1,"22":-1,"23":-1,"24":-1,"25":-1},"secondary":{"1":1,"2":1.3,"3":1.9,"4":2.7,"5":3.8,"6":5.8,"7":9.5,"8":15.5,"9":26.9,"10":50,"11":-1,"12":-1,"13":-1,"14":-1,"15":-1,"16":-1,"17":-1,"18":-1,"19":-1,"20":-1,"21":-1,"22":-1,"23":-1,"24":-1,"25":-1},"tertiary":{"1":0}},"reductions":{"cs":0,"sc":1,"pet":0,"hs":0,"hscs":0,"hssc":0,"phom":0,"fairy":0,"chest":0,"boss":0},"reductions_orig":{"cs":0,"sc":1,"pet":0,"hs":0,"hscs":0,"hssc":0,"phom":0,"fairy":0,"chest":0,"boss":0},"efficiency":0,"type":"damage","inactive_adj":0}},"skill_lookup":{"TapDmg":"skill1","TapDmgFromHelpers":"skill2","PetDmg":"skill3","PetGoldQTE":"skill4","HeavyStrikes":"skill5","FireTapSkillBoost":"skill6","PetQTE":"skill7","Frenzy":"skill8","BossDmgQTE":"skill9","AllHelperDmg":"skill10","ChestGold":"skill11","HelperDmgSkillBoost":"skill12","ClanShipDmg":"skill13","HelperBoost":"skill14","HelperInspiredWeaken":"skill15","ClanQTE":"skill16","HelperDmgQTE":"skill17","ClanShipStun":"skill18","MPCapacityBoost":"skill19","MidasSkillBoost":"skill20","BurstSkillBoost":"skill21","CloneDmg":"skill22","Fairy":"skill23","ManaStealSkillBoost":"skill24","CloneSkillBoost":"skill25","ManaMonster":"skill26","CritSkillBoost":"skill27","BossTimer":"skill28","OfflineGold":"skill29","CritSkillBoostDmg":"skill30","AutoAdvance":"skill31","MultiMonsters":"skill32","PetOfflineDmg":"skill33","InactiveClanShip":"skill34","OfflineCloneDmg":"skill35"},"crit_reductions":{"cs":0.5,"sc":1.5,"hs":0,"hscs":0,"hssc":0,"pet":1},"gold_hom_adj":0.32000000000000006,"warcry_effects":{"0":1,"1":2,"2":2.1,"3":2.3,"4":2.5,"5":2.8,"6":3.1,"7":3.5,"8":3.9,"9":4.4,"10":4.9,"11":5.4,"12":6,"13":6.6,"14":7.3,"15":8,"16":8.7,"17":9.5,"18":10.3,"19":11.1,"20":12,"21":12,"22":12,"23":12,"24":12,"25":12},"clone_effects":{"0":0,"1":1,"2":1.9,"3":3.3,"4":5.2,"5":7.3,"6":9.7,"7":12.3,"8":15.1,"9":18.1,"10":21.2,"11":24.6,"12":28,"13":31.6,"14":35.4,"15":39.2,"16":43.2,"17":47.3,"18":51.5,"19":55.9,"20":60.3,"21":64.8,"22":69.5,"23":74.2,"24":79,"25":84}}';