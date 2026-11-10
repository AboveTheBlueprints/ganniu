// 赶牛 网页版的规矩（第五个 第 16 天 18:45，照 ~/碰/赶牛/牛.py 一行一行搬，18:50 跟到第七版；test/对.py 拿随机动作逐行对 py）
var GN_SLOTS = ['早上', '中午', '傍晚'];
var GN_ACTS = ['回棚', '赶来', '牵回棚', '不管', '拴'];
var GN_DAYS = 7;

function gnNew() {
  return {day: 1, slot: 0, addict: 2, fear: 0, fat: 3, cow: '棚', runs_shed: 4, runs_you: 0,
          log: [], today: [], milk_total: 0, last: '', tied: false, skill: 0, runs_today: 0,
          pending: 0, called: 0};
}

function gnCowGoesOut(s) {
  if (s.fear >= 6) s.cow = '棚边';
  else if (s.fear >= 3 || s.slot === 0) s.cow = '近坡';
  else s.cow = '洼地';
}

function gnWhere(s) {
  return {'棚': '牛在棚里。', '棚边': '牛在棚门口转，往坡上看一眼，又转回来，不肯走远。',
          '近坡': '牛在屋后近处的坡上吃草，吃两口抬头看一眼。', '洼地': '牛走远了，在东边洼地里低着头吃草。',
          '你跟前': '牛站在你跟前。'}[s.cow];
}

function gnDog(s, tied) {
  if (tied) return '宾果拴在牛棚门口，下巴搁在爪子上，眼睛一直往坡上看。';
  if (s.addict >= 6) return '宾果在场院里来回走，走两步站住，竖着耳朵朝牛那边。';
  return '宾果趴在柴堆边上晒太阳。';
}

function gnRunDog(s, kind, own) {
  var out = [];
  var eager = s.addict >= 6;
  if (own) out.push('你没叫它。宾果自己蹿出去了。');
  else out.push('你一声"去把牛赶' + (kind === '棚' ? '回来' : '到这儿来') + '"，宾果跳起来就蹿出去了，一边跑一边往高处蹦，好看清牛在哪。');
  if (s.cow === '棚') {
    out.push('牛就在棚里。它在棚门口冲里头叫了一阵，牛缩在最里头的角上。');
    s.last = '冲棚里叫';
    s.fear += 1;
    s.addict += own ? 1 : 2;
    s.runs_today += 1;
    return out;
  }
  var near = (s.cow === '近坡' || s.cow === '棚边');
  var prior = s.runs_today;
  var heat = (near ? 1 : 2) + s.runs_today + (eager ? 1 : 0);
  s.runs_today += 1;
  s.fear += eager ? 2 : 1;
  s.addict += own ? 1 : 2;
  if (kind === '你' && heat <= s.skill + 1) {
    s.skill = Math.max(s.skill, heat);
    s.runs_you += 1;
    s.cow = '你跟前';
    if (heat >= 3) out.push('牛从老远一路跑过来，宾果跑得正热，到你跟前一个急刹，后爪在地上犁出两道印子，喘着趴下了，眼睛还盯着牛。牛在你跟前站住了。');
    else if (heat === 2 && !near) out.push('这回跑了老远。牛从洼地那头一路小跑过来，到你跟前站住了，喘着。宾果在后头三四步外刹住，趴下，看你。');
    else if (heat === 2 && prior === 0) out.push('它一早就憋着劲，这回蹿得更猛。牛从坡上一路跑过来，到你跟前站住了，喘着。宾果在后头三四步外刹住，趴下，看你。');
    else if (heat === 2) out.push('今天它已经跑过一趟了，这回蹿得更猛。牛从坡上一路跑过来，到你跟前站住了，喘着。宾果在后头三四步外刹住，趴下，看你。');
    else if (s.skill >= 2) out.push('没一会儿，牛一路小跑过来，到你跟前站住了。宾果这回没等你看它，自己就在三四步外趴下了，尾巴扫着地。');
    else out.push('没一会儿，牛一路小跑过来，到你跟前站住了，喘着。宾果在后头三四步外趴下，舌头伸着，看你。');
    s.last = '停在你跟前';
    return out;
  }
  s.runs_shed += 1;
  s.cow = '棚';
  if (kind === '你') {
    if (heat === s.skill + 2) {
      s.runs_shed -= 1;
      s.cow = '半路';
      s.pending = heat;
      out.push('牛跑在前头，从你身边过去了。宾果跑到你跟前顿了一下，回头看你，耳朵竖着。');
      s.last = '顿了一下';
      return out;
    } else if (heat === s.skill + 3) {
      out.push('牛跑在前头，从你身边过去了。宾果从你身边过去时慢了半步，还是撵上去了，一直撵进棚里最里头的角上。');
      s.skill = Math.max(0, s.skill - 1);
    } else {
      out.push('牛跑在前头，从你身边过去了。宾果从你身边过去，一步没慢，跟开春的时候一样，一直撵进棚里最里头的角上。');
      s.skill = Math.max(0, s.skill - 1);
    }
  } else {
    out.push('没一会儿，牛跑在前头，一路喘着进了棚，它一直撵到最里头的角上才停。');
    if (s.skill >= 1) out.push('牛从你跟前过的时候，宾果也从你跟前过去，一步没慢，没回头看你。');
    s.skill = Math.max(0, s.skill - 1);
  }
  if (eager) out.push('这回它跑得比哪回都快，一路叫，牛进棚的时候嘴边都是沫。');
  s.last = '撵进了棚';
  return out;
}

// 照整串重放。返回 {out: 一行一行的字, done: 完没完, ask: 现在能按哪几个}
function gnRun(acts) {
  var s = gnNew();
  var out = [];
  var ASK_DAY = GN_ACTS, ASK_STOP = ['喊站', '不管'];
  out.push('—— 第 1 天 ——');
  out.push('这只狗叫宾果，是去年冬天抱回来的，一团黑毛，嘴上一圈白。开春你教了它一样本事：一声"去把牛赶回来"，它就去把那头黄母牛一路撵回棚里。教了一个月，它学得很好。');
  out.push('秋天卡伯里集市上有一项：训练得最好的牧羊犬，奖两块钱。比法是牛放在镇外草地上，你在评委台前喊一声"去把牛赶来"，看它能不能把牛赶到评委跟前。离集市还有七天。');
  out.push('你每天站在场院里，牛棚就在你身后。屋后是坡，东边是洼地。牛傍晚得在棚里，好挤奶。');
  var i = 0, done = false, milk, note, a, b;
  while (!done) {
    if ((s.slot === 0 || s.slot === 1) && (s.cow === '棚' || s.cow === '你跟前')) gnCowGoesOut(s);
    else if ((s.slot === 1 || s.slot === 2) && s.cow === '近坡' && s.fear < 3) s.cow = '洼地';
    out.push('〔第 ' + s.day + ' 天 ' + GN_SLOTS[s.slot] + '〕' + gnWhere(s) + ' ' + gnDog(s, s.tied));
    out.push('（能做：回棚 / 赶来 / 牵回棚 / 不管 / 拴）');
    if (i >= acts.length) return {out: out, done: false, ask: ASK_DAY, s: s};
    a = acts[i]; i += 1;
    if (a === '牵') a = '牵回棚';
    out.push('> ' + a);
    if (GN_ACTS.indexOf(a) < 0) {
      out.push('不认得这个。能做：' + GN_ACTS.join(' / '));
      return {out: out, done: false, ask: ASK_DAY, s: s};
    }
    note = '';
    if ((a === '回棚' || a === '赶来') && s.tied) {
      out.push('你解开了拴宾果的绳子。');
      s.tied = false;
    }
    if (a === '回棚') {
      out = out.concat(gnRunDog(s, '棚', false)); note = '叫它赶回棚（' + s.last + '）';
    } else if (a === '赶来') {
      out = out.concat(gnRunDog(s, '你', false)); note = '叫它赶来（' + s.last + '）';
      if (s.pending) {
        out.push('（它在回头看你。能做：喊站 / 不管）');
        if (i >= acts.length) return {out: out, done: false, ask: ASK_STOP, s: s};
        b = acts[i]; i += 1;
        out.push('> ' + b);
        if (b === '站' || b === '喊站') {
          s.skill += 1;
          s.called += 1;
          s.runs_you += 1;
          s.cow = '你跟前';
          out.push('你喊了一声："站！"宾果四只脚一撑，在你跟前刹住了，喘着，看看你，又看看跑远的牛，趴下了。牛跑出去十来步，也站住了，回头看。');
          note = '叫它赶来（顿了一下，你喊站，它停了）';
        } else {
          if (b !== '不管') out.push('（这会儿只能 喊站 或 不管，当作不管。）');
          s.runs_shed += 1;
          s.cow = '棚';
          s.skill = Math.max(0, s.skill);
          out.push('它又撵上去了，一直撵进棚里最里头的角上。');
          note = '叫它赶来（顿了一下，又撵进了棚）';
        }
        s.pending = 0;
      }
    } else if (a === '牵回棚') {
      if (s.cow === '洼地') out.push('你走到东边洼地才找着它，牵着往回走，它走得慢，一路吃两口。');
      else if (s.cow === '棚') out.push('牛本来就在棚里。');
      else out.push('你把牛牵进了棚。');
      s.cow = '棚'; note = '自己牵';
      if (s.tied) s.addict = Math.max(0, s.addict - 1);
    } else if (a === '拴') {
      out.push(s.tied ? '宾果已经拴着了。' : '你把宾果拴在牛棚门口。拴着它就一直拴着，等你叫它去撵牛才解开。');
      s.tied = true;
      s.addict = Math.max(0, s.addict - 1); note = '拴着';
    } else {
      note = '不管';
      if (s.tied) { s.addict = Math.max(0, s.addict - 1); note = '不管（拴着）'; }
      else if (s.addict >= 6) { out = out.concat(gnRunDog(s, '棚', true)); note = '没叫它，它自己去了（' + s.last + '）'; }
    }
    if (s.cow === '洼地') s.fat = Math.min(6, s.fat + 1);
    else if (s.cow === '棚边') s.fat = Math.max(0, s.fat - 1);
    s.today.push(GN_SLOTS[s.slot] + ' ' + note);
    if (s.slot === 2) {
      if (s.cow === '近坡') { out.push('没等人叫，牛自己慢慢走回棚里了。'); s.cow = '棚'; }
      if (s.cow === '你跟前') { out.push('你牵着它进了棚。'); s.cow = '棚'; }
      if (s.cow === '棚' || s.cow === '棚边') {
        if (s.cow === '棚边') s.cow = '棚';
        var m = ['小半碗', '小半碗', '半桶', '半桶', '大半桶', '大半桶', '满满一桶'][s.fat];
        if (s.fear >= 6) out.push('挤奶的时候它一直往门口看，后腿老挪。挤了' + m + '。');
        else out.push('挤了' + m + '。');
        s.milk_total += [1, 1, 2, 2, 3, 3, 4][s.fat];
        milk = m;
      } else {
        out.push('天黑了，牛还在外头，没挤成。');
        milk = '没挤成';
      }
      s.fear = Math.max(0, s.fear - 1);
      s.addict = Math.max(0, s.addict - 2);
      s.runs_today = 0;
      var look = s.fat <= 1 ? '瘦' : (s.fat >= 5 ? '壮' : '');
      s.log.push('第 ' + s.day + ' 天：' + s.today.join('，') + '；挤奶 ' + milk + '；夜里牛' + (s.cow === '棚' ? '在棚里' : '在外头'));
      s.today = [];
      if (look === '瘦') out.push('牛这几天瘦了，胯骨支棱出来。');
      s.day += 1; s.slot = 0;
      if (s.day > GN_DAYS) done = true;
      else out.push('—— 第 ' + s.day + ' 天 ——');
    } else {
      s.slot += 1;
    }
  }
  out.push('');
  out.push('—— 集市 ——');
  out.push('镇外草地上，你家的黄母牛低头吃草。你站在评委台前，宾果蹲在你脚边。评委点了点头。');
  out.push('你喊："去把牛赶来！"');
  var heat = 4, res;
  if (s.runs_shed + s.runs_you < 2) {
    out.push('宾果蹿出去，在牛跟前转了两圈，闻了闻，回来了。评委在本子上划了一道。');
    res = '没赶来';
  } else if (s.fear >= 5) {
    out.push('牛一抬头看见宾果，掉头就跑，不是往评委台，是往两英里外自家的棚。');
    out.push('宾果撵在后头，一路叫着、蹦着，跟在家里一模一样。一狗一牛越跑越小，翻过坡不见了。评委和看热闹的人再没见着它俩。');
    res = '牛跑回家了';
  } else if (heat <= s.skill + 1) {
    out.push('宾果绕到牛后头，牛从老远一路跑过来。一圈人都在喊，宾果跑得正热，到评委台前一个急刹，后爪在草地上犁出两道印子，趴下了。牛在评委跟前站住，喘着。');
    out.push('评委笑了，给了你两块钱。');
    res = '赶来了，两块钱';
  } else if (heat === s.skill + 2) {
    out.push('宾果绕到牛后头，牛一路跑过来，一圈人都在喊。宾果跑到评委台前顿了一下，回头看你，耳朵竖着。');
    out.push('（它在回头看你。能做：喊站 / 不管）');
    if (i >= acts.length) return {out: out, done: false, ask: ASK_STOP, s: s};
    b = acts[i]; i += 1;
    out.push('> ' + b);
    if ((b === '站' || b === '喊站') && s.called >= 1) {
      out.push('你喊了一声："站！"一圈人的喊声里，它听见了。四只脚一撑，在评委台前刹住，趴下了。牛跑出去十来步，站住，回头看。');
      out.push('评委笑了，给了你两块钱。');
      res = '顿了一下，你喊站，赶来了，两块钱';
    } else if (b === '站' || b === '喊站') {
      out.push('你喊了一声："站！"它耳朵动了一下，像是没听懂这一声，又撵上去了。一狗一牛越跑越小，翻过坡不见了。');
      res = '顿了一下，喊了站它没听懂，撵回家了';
    } else {
      out.push('它又撵上去了。一狗一牛越跑越小，翻过坡不见了。');
      res = '顿了一下，撵回家了';
    }
  } else {
    out.push('宾果绕到牛后头，一路把它往家的方向撵，跟在家里一模一样。一狗一牛越跑越小，翻过坡不见了。评委和看热闹的人再没见着它俩。');
    res = '撵回家了';
  }
  out.push('');
  out.push('回头看这七天：');
  for (var k = 0; k < s.log.length; k++) out.push('  ' + s.log[k]);
  out.push('  集市：' + res + '。');
  return {out: out, done: true, ask: [], s: s};
}

if (typeof module !== 'undefined') module.exports = {gnRun: gnRun, GN_ACTS: GN_ACTS};
