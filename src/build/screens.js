/* ══════════════════════════════════════════════════════════════════════
 * BetMaker — four homepage selection-generator directions.
 * Each frame is the REAL homepage (Header · TopNav · quick chips · feed)
 * with the BetMaker section slotted in under the quick chips.
 * ══════════════════════════════════════════════════════════════════════ */
const {
  useState,
  useMemo
} = React;
const BP = window.BP;
function Ic(p) {
  return React.createElement(window.Icon, p);
}
const SectionHeader = window.SectionHeader;

/* ── candidate selection pool, derived from real fixture data ── */
const MKTS_FOOTBALL = [{
  m: "1X2",
  picks: ["Home", "Draw", "Away"]
}, {
  m: "1X2 1UP",
  picks: ["Home", "Away"]
}, {
  m: "1X2 2UP",
  picks: ["Home", "Away"]
}, {
  m: "Total Goals Over/Under",
  picks: ["Over 2.5 Goals", "Under 2.5 Goals"]
}, {
  m: "Home Team Over/Under",
  picks: ["Over 1.5 Goals", "Under 1.5 Goals"]
}, {
  m: "Away Team Over/Under",
  picks: ["Over 1.5 Goals", "Under 1.5 Goals"]
}, {
  m: "Double Chance",
  picks: ["Home or Draw", "Home or Away", "Draw or Away"]
}, {
  m: "Double Chance 1UP",
  picks: ["Home or Draw", "Draw or Away"]
}, {
  m: "Both Teams to Score (GG/NG)",
  picks: ["GG", "NG"]
}, {
  m: "1X2 First Half",
  picks: ["Home", "Draw", "Away"]
}, {
  m: "Over/Under First Half",
  picks: ["Over 1.5 Goals", "Under 1.5 Goals"]
}, {
  m: "1X2 - Interval 10 minutes (00:01-09:59)",
  picks: ["Home", "Draw", "Away"]
}];
const MKTS_BASKETBALL = [{
  m: "Money Line",
  picks: ["Home", "Away"]
}, {
  m: "Total Points",
  picks: ["Over 210.5 Points", "Under 210.5 Points"]
}, {
  m: "Handicap",
  picks: ["Home -4.5", "Away +4.5"]
}];
const MKTS_TENNIS = [{
  m: "Match Winner",
  picks: ["Home", "Away"]
}, {
  m: "Total Games",
  picks: ["Over 22.5 Games", "Under 22.5 Games"]
}, {
  m: "Set Betting",
  picks: ["Home 2-0", "Home 2-1", "Away 2-0", "Away 2-1"]
}];
const MKTS = MKTS_FOOTBALL;

/* Real fixtures grounded in the popular-league list, so a league filter
   genuinely returns that league's matches. Basketball and tennis come from
   the shared fixture data. */
const FIXTURES = [["UEFA Champions League", "Real Madrid", "ESP", "Manchester City", "ENG"], ["UEFA Champions League", "Bayern Munich", "GER", "Paris Saint-Germain", "FRA"], ["UEFA Champions League", "Arsenal", "ENG", "Inter", "ITA"], ["Premier League", "Manchester City", "ENG", "Arsenal", "ENG"], ["Premier League", "Liverpool", "ENG", "Chelsea", "ENG"], ["Premier League", "Tottenham", "ENG", "Manchester United", "ENG"], ["Premier League", "Newcastle", "ENG", "Brighton", "ENG"], ["Serie A", "Inter", "ITA", "Juventus", "ITA"], ["Serie A", "Napoli", "ITA", "Milan", "ITA"], ["Serie A", "Roma", "ITA", "Lazio", "ITA"], ["LaLiga", "Barcelona", "ESP", "Real Madrid", "ESP"], ["LaLiga", "Atlético Madrid", "ESP", "Sevilla", "ESP"], ["LaLiga", "Real Sociedad", "ESP", "Villarreal", "ESP"], ["Ligue 1", "Paris Saint-Germain", "FRA", "Marseille", "FRA"], ["Ligue 1", "Monaco", "FRA", "Lyon", "FRA"], ["Bundesliga", "Bayern Munich", "GER", "Borussia Dortmund", "GER"], ["Bundesliga", "Bayer Leverkusen", "GER", "RB Leipzig", "GER"], ["UEFA Europa League", "Roma", "ITA", "Ajax", "NED"], ["UEFA Europa League", "Rangers", "ENG", "Real Betis", "ESP"], ["UEFA Conference League", "Fiorentina", "ITA", "Club Brugge", "BEL"], ["UEFA Conference League", "Basel", "AUT", "Fenerbahçe", "TUR"], ["EFL Cup", "Manchester United", "ENG", "Newcastle", "ENG"], ["EFL Cup", "Aston Villa", "ENG", "West Ham", "ENG"], ["Copa Libertadores", "Flamengo", "BRT", "River Plate", "ARG"], ["Copa Libertadores", "Palmeiras", "BRT", "Boca Juniors", "ARG"], ["Copa Sudamericana", "Atlético Mineiro", "BRT", "Independiente", "ARG"], ["Premier League", "Arsenal", "ENG", "Everton", "ENG"], ["Premier League", "Aston Villa", "ENG", "Fulham", "ENG"], ["Premier League", "Crystal Palace", "ENG", "Wolves", "ENG"], ["Premier League", "Nottingham Forest", "ENG", "Bournemouth", "ENG"], ["LaLiga", "Athletic Club", "ESP", "Valencia", "ESP"], ["LaLiga", "Girona", "ESP", "Osasuna", "ESP"], ["Serie A", "Atalanta", "ITA", "Bologna", "ITA"], ["Serie A", "Fiorentina", "ITA", "Torino", "ITA"], ["Bundesliga", "Stuttgart", "GER", "Eintracht Frankfurt", "GER"], ["Bundesliga", "Wolfsburg", "GER", "Freiburg", "GER"], ["Ligue 1", "Lille", "FRA", "Nice", "FRA"], ["Ligue 1", "Rennes", "FRA", "Lens", "FRA"], ["UEFA Champions League", "Barcelona", "ESP", "Borussia Dortmund", "GER"], ["UEFA Champions League", "Liverpool", "ENG", "Atlético Madrid", "ESP"], ["UEFA Europa League", "Manchester United", "ENG", "Lyon", "FRA"], ["UEFA Conference League", "Chelsea", "ENG", "Legia Warsaw", "POL"], ["EFL Cup", "Liverpool", "ENG", "Southampton", "ENG"], ["Copa Libertadores", "Fluminense", "BRT", "Peñarol", "URU"]];

/* a realistic spread: roughly a quarter of the board sits in each band, so
   filtering to 1.0–1.2 still leaves enough events to build a long ticket */
const ODDS_LADDER = [1.04, 1.06, 1.08, 1.10, 1.12, 1.14, 1.16, 1.18, 1.22, 1.28, 1.33, 1.38, 1.42, 1.46, 1.52, 1.60, 1.68, 1.75, 1.85, 1.95, 2.05, 2.20, 2.45, 2.70, 3.10, 3.60, 4.20, 5.00, 6.50, 8.00];
const POOL = (() => {
  const out = [];
  const evs = FIXTURES.map(([comp, h, hc, a, ac], i) => ({
    ev: {
      id: "bm-" + i,
      comp,
      teams: [{
        name: h,
        code: hc
      }, {
        name: a,
        code: ac
      }]
    },
    sport: "football"
  }));
  const seen = new Set(evs.map(({
    ev
  }) => ev.teams.map(t => t.name).join("|")));
  const tag = (arr, sport) => (arr || []).map(ev => ({
    ev,
    sport
  }));
  [].concat(tag(BP.basketball, "basketball"), tag(BP.tennis, "tennis")).forEach(e => {
    const k = e.ev.teams.map(t => t.name).join("|");
    if (seen.has(k)) return;
    seen.add(k);
    evs.push(e);
  });
  const setFor = {
    football: MKTS_FOOTBALL,
    basketball: MKTS_BASKETBALL,
    tennis: MKTS_TENNIS
  };
  evs.forEach(({
    ev,
    sport
  }, i) => setFor[sport].forEach((mk, j) => mk.picks.forEach((p, k) => {
    const o = ODDS_LADDER[(i * 13 + j * 29 + k * 41) % ODDS_LADDER.length];
    const home = ev.teams[0].name,
      away = ev.teams[1].name;
    let pick = p;
    if (p === "Home") pick = home;else if (p === "Away") pick = away;else if (p === "Home or Draw") pick = home + " or Draw";else if (p === "Draw or Away") pick = "Draw or " + away;else if (p === "Home or Away") pick = home + " or " + away;else if (p.startsWith("Home ")) pick = home + " " + p.slice(5);else if (p.startsWith("Away ")) pick = away + " " + p.slice(5);else if (p === "GG") pick = "Both Teams to Score";else if (p === "NG") pick = "Not Both to Score";
    if (/^(Home|Away) Team Over\/Under$/.test(mk.m)) pick = (mk.m.startsWith("Home") ? home : away) + " " + p;
    const hrs = (i * 7 + j * 5 + k * 3) % 96;
    const pop = Math.max(5, Math.min(97, Math.round(97 - (o - 1.14) * 16.5 - (i * 17 + j * 7 + k * 23) % 17 * 0.9)));
    out.push({
      id: ev.id + "-" + sport + "-" + j + "-" + k,
      ev: home + "|" + away,
      comp: ev.comp,
      teams: ev.teams,
      sport,
      mkt: mk.m,
      pick,
      odds: o,
      hrs,
      pop
    });
  })));
  return out;
})();
const LEAGUE_FLAGS = {
  "UEFA Champions League": "EUR",
  "Premier League": "ENG",
  "Serie A": "ITA",
  "LaLiga": "ESP",
  "Ligue 1": "FRA",
  "Bundesliga": "GER",
  "UEFA Europa League": "EUR",
  "UEFA Conference League": "EUR",
  "EFL Cup": "ENG",
  "Copa Libertadores": "SAM",
  "Copa Sudamericana": "SAM"
};
const LEAGUES = Object.keys(LEAGUE_FLAGS);
const LEAGUE_COUNT = LEAGUES.reduce((a, k) => {
  a[k] = new Set(POOL.filter(l => l.comp === k).map(l => l.ev)).size;
  return a;
}, {});
const LEAGUE_TOTAL = LEAGUES.reduce((a, k) => a + LEAGUE_COUNT[k], 0);
const rng = seed => {
  let s = seed || 1;
  return () => (s = s * 1103515245 + 12345 & 0x7fffffff) / 0x7fffffff;
};
const prod = ls => ls.reduce((a, l) => a * l.odds, 1);
function build(n, target, seed, leagues) {
  const rand = rng(seed);
  const scoped = leagues && leagues.length ? POOL.filter(l => leagues.includes(l.comp)) : POOL;
  const src = scoped.length >= n * 3 ? scoped : POOL;
  const used = new Set(),
    legs = [];
  for (let i = 0; i < n; i++) {
    const want = Math.pow(Math.max(target / prod(legs), 1.05), 1 / (n - i)) * (0.9 + rand() * 0.2);
    const c = src.filter(l => !used.has(l.ev)).sort((a, b) => Math.abs(a.odds - want) - Math.abs(b.odds - want));
    const p = c[Math.floor(rand() * Math.min(3, c.length))] || c[0];
    if (!p) break;
    used.add(p.ev);
    legs.push(p);
  }
  return legs;
}
const MED = (() => {
  const o = POOL.map(l => l.odds).sort((a, b) => a - b);
  return o[Math.floor(o.length / 2)] || 1.9;
})();
const typicalOdds = n => Math.pow(MED, n);
function rangeBuild(n, lo, hi, seed) {
  const rand = rng(seed);
  const src = POOL.filter(l => l.odds >= lo && l.odds <= hi);
  const used = new Set(),
    legs = [];
  for (const l of src.slice().sort(() => rand() - 0.5)) {
    if (legs.length >= Math.min(n, 60)) break;
    if (used.has(l.ev)) continue;
    used.add(l.ev);
    legs.push(l);
  }
  return legs;
}
function bandRefine(legs, target, band, seed) {
  if (!legs.length || !target || target < 1) return legs;
  let cur = legs.slice();
  for (let pass = 0; pass < 5; pass++) {
    let best = Math.abs(prod(cur) / target - 1);
    if (best < 0.03) break;
    for (let i = 0; i < cur.length; i++) {
      const rest = prod(cur) / cur[i].odds;
      const used = new Set(cur.filter((_, j) => j !== i).map(l => l.ev));
      let pick = null,
        err = best;
      for (const c of POOL) {
        if (used.has(c.ev) || c.odds < band.lo || c.odds > band.hi) continue;
        const e = Math.abs(rest * c.odds / target - 1);
        if (e < err - 1e-6) {
          err = e;
          pick = c;
        }
      }
      if (pick) {
        cur = cur.map((l, j) => j === i ? pick : l);
        best = err;
      }
    }
  }
  return cur;
}
function refine(legs, target, seed) {
  if (!legs.length) return legs;
  const rand = rng(seed || 7);
  let cur = legs.slice();
  for (let pass = 0; pass < 6; pass++) {
    let best = Math.abs(prod(cur) / target - 1);
    if (best < 0.02) break;
    for (let i = 0; i < cur.length; i++) {
      const rest = prod(cur) / cur[i].odds;
      const want = target / rest;
      const used = new Set(cur.filter((_, j) => j !== i).map(l => l.ev));
      const cands = POOL.filter(l => !used.has(l.ev));
      let pick = null,
        pickErr = best;
      for (const c of cands) {
        const err = Math.abs(rest * c.odds / target - 1);
        if (err < pickErr - 1e-6) {
          pickErr = err;
          pick = c;
        }
      }
      if (pick) {
        cur = cur.map((l, j) => j === i ? pick : l);
        best = pickErr;
      }
    }
  }
  return cur;
}
function swap(legs, i, ok) {
  const rand = rng(Date.now() % 9973 + i * 31);
  const used = new Set(legs.map(l => l.ev));
  const want = legs[i].odds;
  const c = POOL.filter(l => !used.has(l.ev) && (!ok || ok(l))).sort((a, b) => Math.abs(a.odds - want) - Math.abs(b.odds - want));
  const p = c[Math.floor(rand() * Math.min(5, c.length))] || c[0];
  return p ? legs.map((l, j) => j === i ? p : l) : legs;
}

/* ── AI ghost loader: the sheet opens immediately and skeletons the ticket
   while selections are being worked out ── */
function GhostTicket() {
  return /*#__PURE__*/React.createElement("div", {
    className: "ghost"
  }, /*#__PURE__*/React.createElement("div", {
    className: "ghost__hero"
  }, /*#__PURE__*/React.createElement(Ic, {
    name: "Sparkles",
    size: 44
  }), /*#__PURE__*/React.createElement("span", null, "Generating Selections\u2026")), [0, 1, 2, 3].map(i => /*#__PURE__*/React.createElement("div", {
    className: "ghost__row",
    key: i,
    style: {
      animationDelay: i * 90 + "ms"
    }
  }, /*#__PURE__*/React.createElement("span", {
    className: "ghost__dot"
  }), /*#__PURE__*/React.createElement("span", {
    className: "ghost__tx"
  }, /*#__PURE__*/React.createElement("i", {
    style: {
      width: 62 + i % 3 * 14 + "%"
    }
  }), /*#__PURE__*/React.createElement("i", {
    style: {
      width: 38 + i % 2 * 18 + "%"
    }
  })), /*#__PURE__*/React.createElement("span", {
    className: "ghost__od"
  }))), /*#__PURE__*/React.createElement("div", {
    className: "ghost__cta"
  }));
}
function GenSheet(props) {
  const {
    children,
    shuffle,
    ...rest
  } = props;
  const [busy, setBusy] = useState(false);
  const t = React.useRef(0);
  const was = React.useRef(false);
  React.useEffect(() => {
    if (props.open && !was.current) {
      setBusy(true);
      clearTimeout(t.current);
      t.current = setTimeout(() => setBusy(false), 1100);
    }
    was.current = props.open;
    return () => clearTimeout(t.current);
  }, [props.open]);
  let body = busy ? /*#__PURE__*/React.createElement(GhostTicket, null) : children;
  let title = rest.title;
  if (!busy && React.isValidElement(children)) {
    const p = children.props;
    if (p.name || p.note) {
      title = /*#__PURE__*/React.createElement("span", {
        className: "dsheet__ttl"
      }, /*#__PURE__*/React.createElement("span", {
        className: "dsheet__ttlmain"
      }, rest.title), /*#__PURE__*/React.createElement("span", {
        className: "dsheet__cap"
      }, /*#__PURE__*/React.createElement("span", {
        className: "dsheet__capnm"
      }, p.name), p.note ? /*#__PURE__*/React.createElement("em", null, p.note) : null));
    }
    body = React.cloneElement(children, {
      capOutside: true,
      actions: p.actions || (shuffle ? /*#__PURE__*/React.createElement("button", {
        className: "tk__spin tk__spin--sec",
        onClick: shuffle
      }, /*#__PURE__*/React.createElement(Ic, {
        name: "RotateCw",
        size: 16
      }), "Shuffle") : null)
    });
  }
  return React.createElement(window.Sheet, {
    ...rest,
    title
  }, body);
}

/* ── toast (mount → rAF → .show, mirroring the Sheet entrance) ── */
function Toast({
  msg
}) {
  const [vis, setVis] = useState(false);
  React.useEffect(() => {
    const t = setTimeout(() => setVis(true), 20);
    return () => clearTimeout(t);
  }, []);
  return /*#__PURE__*/React.createElement("div", {
    className: "toast" + (vis ? " show" : "")
  }, msg);
}

/* ── real homepage chrome via a working stub app context ── */
function Frame({
  children
}) {
  const [slip, setSlip] = useState([]);
  const [slipOpen, setSlipOpen] = useState(false);
  const [slipStake, setSlipStake] = useState(null);
  const [toast, setToast] = useState(null);
  const tRef = React.useRef(0);
  const notify = m => {
    setToast({
      m,
      n: Date.now()
    });
    clearTimeout(tRef.current);
    tRef.current = setTimeout(() => setToast(null), 1900);
  };
  React.useEffect(() => () => clearTimeout(tRef.current), []);
  const app = useMemo(() => ({
    loggedIn: true,
    balance: 2450,
    betslip: slip,
    nav: () => {},
    back: () => {},
    openDeposit: () => {},
    openAccount: () => {},
    openMenu: () => {},
    openBetslip: () => setSlipOpen(true),
    isSel: k => slip.some(x => x.key === k),
    inSlip: legs => legs.length > 0 && legs.every(l => slip.some(x => x.key === l.id)),
    toggleSel: sel => {
      if (slip.some(x => x.key === sel.key)) {
        setSlip(v => v.filter(x => x.key !== sel.key));
        notify("Selection removed from betslip");
        return;
      }
      const leg = sel.leg || {
        id: sel.key,
        pick: sel.sel || sel.matchLabel || "Selection",
        mkt: sel.mkt || "",
        odds: sel.od || 1,
        teams: [{
          name: (sel.matchLabel || "").split(" v ")[0] || ""
        }, {
          name: (sel.matchLabel || "").split(" v ")[1] || ""
        }]
      };
      setSlip(v => [...v, {
        key: sel.key,
        src: sel.key,
        leg,
        od: sel.od || leg.odds
      }]);
      notify((leg.pick || "Selection") + " added to betslip");
    },
    addOne: (src, leg) => {
      const on = slip.some(x => x.key === leg.id);
      setSlip(v => on ? v.filter(x => x.key !== leg.id) : [...v, {
        key: leg.id,
        src,
        leg,
        od: leg.odds
      }]);
      notify(on ? "Selection removed from betslip" : leg.pick + " added to betslip");
    },
    hasOne: id => slip.some(x => x.key === id),
    addSingles: (src, legs, stake) => {
      if (stake) setSlipStake(String(stake));
      const ids = legs.map(l => l.id);
      const allIn = ids.length > 0 && ids.every(id => slip.some(x => x.key === id));
      if (allIn) {
        setSlip(v => v.filter(x => !ids.includes(x.key)));
        notify("Removed from betslip");
        return;
      }
      const fresh = legs.filter(l => !slip.some(x => x.key === l.id));
      setSlip(v => [...v, ...fresh.map(l => ({
        key: l.id,
        src,
        leg: l,
        od: l.odds
      }))]);
      notify(fresh.length === ids.length ? "All " + fresh.length + " selection" + (fresh.length > 1 ? "s" : "") + " added to betslip" : fresh.length + " more selection" + (fresh.length > 1 ? "s" : "") + " added to betslip");
    },
    addAcca: (src, legs) => {
      setSlip(v => [...v.filter(x => x.acca !== src), ...legs.map(l => ({
        key: src + "-" + l.id,
        acca: src,
        leg: l,
        od: l.odds
      }))]);
      notify(legs.length + " selections added to betslip");
    },
    addLegs: (legs, key) => {
      setSlip(legs.map((l, i) => ({
        key: key + "-" + i,
        od: l.odds
      })));
      notify("Added to betslip");
    }
  }), [slip]);
  return /*#__PURE__*/React.createElement(window.AppCtx.Provider, {
    value: app
  }, /*#__PURE__*/React.createElement("div", {
    className: "phone"
  }, React.createElement(window.Header), React.createElement(window.TopNav, {
    active: "home"
  }), /*#__PURE__*/React.createElement("div", {
    className: "scroll"
  }, /*#__PURE__*/React.createElement(USP, null), /*#__PURE__*/React.createElement(QuickChips, null), children, /*#__PURE__*/React.createElement("div", {
    className: "sec bmcombos"
  }, /*#__PURE__*/React.createElement(SectionHeader, {
    icon: "CirlceInfo",
    title: "Popular Match Combos"
  }), /*#__PURE__*/React.createElement("div", {
    className: "hscroll"
  }, BP.combos.map((c, i) => React.createElement(window.HomeComboCard, {
    key: c.id,
    c,
    index: i
  })))), /*#__PURE__*/React.createElement("div", {
    className: "sec"
  }, /*#__PURE__*/React.createElement(SectionHeader, {
    icon: "FootballBall",
    title: "Football",
    count: 248
  }), React.createElement(window.MatchCard, {
    m: BP.featured[0]
  }))), React.createElement(window.BottomNav, {
    active: "home"
  }), /*#__PURE__*/React.createElement(BetslipSheet, {
    open: slipOpen,
    onClose: () => setSlipOpen(false),
    slip: slip,
    stakeSeed: slipStake,
    onRemove: k => setSlip(v => v.filter(x => x.key !== k)),
    onPlace: () => {
      setSlip([]);
      setSlipOpen(false);
      notify("Bet placed");
    }
  }), toast ? /*#__PURE__*/React.createElement(Toast, {
    key: toast.n,
    msg: toast.m
  }) : null));
}
function USP() {
  const [open, setOpen] = useState(false);
  const rows = [{
    ic: "Percent",
    t: "1250% Win Bonus",
    s: "Win up to 1250% with no minimum stake!"
  }, {
    ic: "Star",
    t: "2up Early Settlement",
    s: "Some great odds on 1x2 & DC including live"
  }, {
    ic: "Aviator",
    t: "Biggest Aviator Wins",
    s: "Play from ₦1 for Nigeria's biggest max win."
  }];
  return /*#__PURE__*/React.createElement("div", {
    className: "usp" + (open ? "" : " collapsed")
  }, /*#__PURE__*/React.createElement("div", {
    className: "usp__hd",
    style: {
      height: 28
    }
  }, /*#__PURE__*/React.createElement("span", {
    className: "t",
    style: {
      fontSize: 14
    }
  }, "Why betPawa?"), /*#__PURE__*/React.createElement("button", {
    className: "c",
    "aria-label": open ? "Collapse" : "Expand",
    "aria-expanded": open,
    onClick: () => setOpen(!open)
  }, /*#__PURE__*/React.createElement(Ic, {
    name: "ChevronUp"
  }))), /*#__PURE__*/React.createElement("div", {
    className: "usp__list"
  }, rows.map(r => /*#__PURE__*/React.createElement("div", {
    className: "usp__row",
    key: r.t
  }, /*#__PURE__*/React.createElement("span", {
    className: "usp__ico"
  }, /*#__PURE__*/React.createElement(Ic, {
    name: r.ic
  })), /*#__PURE__*/React.createElement("span", {
    className: "usp__tx"
  }, /*#__PURE__*/React.createElement("span", {
    className: "t"
  }, r.t), /*#__PURE__*/React.createElement("span", {
    className: "s"
  }, r.s))))));
}
function QuickChips() {
  return /*#__PURE__*/React.createElement("div", {
    className: "pchips"
  }, BP.quickChips.slice(0, 6).map((c, i) => /*#__PURE__*/React.createElement("button", {
    className: "pChip",
    key: i
  }, c.icon ? /*#__PURE__*/React.createElement(Ic, {
    name: c.icon,
    cls: "pChip__icon",
    style: c.accent ? {
      color: "var(--orange)"
    } : null
  }) : /*#__PURE__*/React.createElement("span", {
    className: "pChip__icon"
  }, React.createElement(window.Flag, {
    code: c.flag,
    size: 20
  })), c.label, /*#__PURE__*/React.createElement("span", {
    className: "pChip__n"
  }, c.n))));
}

/* ── multi-select dropdown ── */
function Drop({
  label,
  options,
  value,
  onChange,
  count,
  flags,
  allLabel,
  allCount
}) {
  const [open, setOpen] = useState(false);
  const summary = !value.length ? "All" : value.length === 1 ? value[0] : value.length + " selected";
  return /*#__PURE__*/React.createElement("div", {
    className: "bmdrop" + (open ? " is-open" : "")
  }, /*#__PURE__*/React.createElement("button", {
    className: "bmdrop__b",
    onClick: () => setOpen(!open),
    "aria-expanded": open
  }, /*#__PURE__*/React.createElement("span", {
    className: "bmdrop__stack"
  }, /*#__PURE__*/React.createElement("span", {
    className: "bmdrop__k"
  }, label), /*#__PURE__*/React.createElement("span", {
    className: "bmdrop__v"
  }, summary)), /*#__PURE__*/React.createElement(Ic, {
    name: "ChevronDown",
    size: 16
  })), open ? /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("span", {
    className: "bmdrop__scrim",
    onClick: () => setOpen(false)
  }), /*#__PURE__*/React.createElement("div", {
    className: "bmdrop__panel",
    role: "listbox"
  }, /*#__PURE__*/React.createElement("button", {
    className: "bmdrop__opt",
    onClick: () => onChange([])
  }, /*#__PURE__*/React.createElement("span", {
    className: "bmdrop__box" + (!value.length ? " on" : "")
  }, !value.length ? /*#__PURE__*/React.createElement(Ic, {
    name: "Check",
    size: 12
  }) : null), /*#__PURE__*/React.createElement("span", {
    className: "bmdrop__lb"
  }, allLabel || "All"), allCount ? /*#__PURE__*/React.createElement("em", null, allCount) : null), options.map(o => {
    const on = value.includes(o);
    const fl = flags ? flags(o) : null;
    return /*#__PURE__*/React.createElement("button", {
      className: "bmdrop__opt",
      key: o,
      onClick: () => onChange(on ? value.filter(x => x !== o) : [...value, o])
    }, /*#__PURE__*/React.createElement("span", {
      className: "bmdrop__box" + (on ? " on" : "")
    }, on ? /*#__PURE__*/React.createElement(Ic, {
      name: "Check",
      size: 12
    }) : null), fl ? /*#__PURE__*/React.createElement("span", {
      className: "bmdrop__fl"
    }, React.createElement(window.Flag, {
      code: fl,
      size: 18
    })) : null, /*#__PURE__*/React.createElement("span", {
      className: "bmdrop__lb"
    }, o), count ? /*#__PURE__*/React.createElement("em", null, count(o)) : null);
  }))) : null);
}

/* ── section header with explainer ── */
function Info({
  tip
}) {
  const [on, setOn] = useState(false);
  return /*#__PURE__*/React.createElement("span", {
    className: "bminfo"
  }, /*#__PURE__*/React.createElement("button", {
    className: "bminfo__b",
    "aria-label": "How this works",
    "aria-expanded": on,
    onClick: () => setOn(!on)
  }, /*#__PURE__*/React.createElement(Ic, {
    name: "CirlceInfo",
    size: 17
  })), on ? /*#__PURE__*/React.createElement("span", {
    className: "bminfo__tip",
    role: "tooltip"
  }, tip, /*#__PURE__*/React.createElement("button", {
    className: "bminfo__x",
    "aria-label": "Close",
    onClick: () => setOn(false)
  }, /*#__PURE__*/React.createElement(Ic, {
    name: "X",
    size: 13
  }))) : null);
}
function Hd({
  tip,
  sub = true,
  name = "BetMaker AI",
  subTx = "Your AI assistant to build your betslip",
  icon = true
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: "sec__hd bmhd"
  }, icon ? /*#__PURE__*/React.createElement(Ic, {
    name: "Sparkles",
    cls: "ico",
    size: 32
  }) : null, /*#__PURE__*/React.createElement("h3", null, name, sub ? /*#__PURE__*/React.createElement("em", null, subTx) : null), /*#__PURE__*/React.createElement(Info, {
    tip: tip
  }));
}

/* ── betslip bottom sheet ── */
function BetslipSheet({
  open,
  onClose,
  slip,
  onRemove,
  onPlace,
  stakeSeed
}) {
  const [stake, setStake] = useState("100");
  React.useEffect(() => {
    if (stakeSeed) setStake(stakeSeed);
  }, [stakeSeed]);
  const [acceptOdds, setAcceptOdds] = useState(true);
  const val = parseFloat(stake || "0");
  const bets = slip.length;
  const combinedOdds = slip.reduce((x, t) => x * t.od, 1);
  const gross = val * combinedOdds;
  const winnings = Math.max(gross - val, 0);
  const bonus = gross * 0.08;
  const payout = gross + bonus;
  const match = l => l.teams && l.teams[0] && l.teams[0].name ? l.teams[0].name + " - " + l.teams[1].name : "";
  return React.createElement(window.Sheet, {
    open,
    onClose,
    cls: "bsheet"
  }, /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    className: "bs2hdr"
  }, /*#__PURE__*/React.createElement("div", {
    className: "bs2seg"
  }, /*#__PURE__*/React.createElement("button", {
    className: "on"
  }, "Betslip ", /*#__PURE__*/React.createElement("span", {
    className: "b"
  }, bets)), /*#__PURE__*/React.createElement("button", null, "My Bets")), /*#__PURE__*/React.createElement("div", {
    className: "grow"
  }), /*#__PURE__*/React.createElement("span", {
    className: "bal"
  }, BP.money(2450)), /*#__PURE__*/React.createElement("button", {
    className: "x",
    onClick: onClose
  }, /*#__PURE__*/React.createElement(Ic, {
    name: "X"
  }))), /*#__PURE__*/React.createElement("div", {
    className: "bs2body"
  }, !bets ? /*#__PURE__*/React.createElement("div", {
    className: "empty",
    style: {
      padding: "32px 8px"
    }
  }, /*#__PURE__*/React.createElement("span", {
    className: "empty__ic"
  }, /*#__PURE__*/React.createElement(Ic, {
    name: "Betslip",
    size: 32
  })), /*#__PURE__*/React.createElement("span", {
    className: "empty__t"
  }, "Betslip is empty"), /*#__PURE__*/React.createElement("span", {
    className: "empty__s"
  }, "Generate selections above and they will appear here.")) : /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    className: "bs2meta"
  }, /*#__PURE__*/React.createElement("span", {
    className: "l"
  }, /*#__PURE__*/React.createElement(Ic, {
    name: "Share"
  }), "Booking Code"), /*#__PURE__*/React.createElement("button", {
    className: "r",
    onClick: () => slip.forEach(t => onRemove(t.key))
  }, "Clear Betslip")), slip.map(t => /*#__PURE__*/React.createElement("div", {
    className: "bs2sel",
    key: t.key
  }, /*#__PURE__*/React.createElement("button", {
    className: "close",
    onClick: () => onRemove(t.key),
    "aria-label": "Remove selection"
  }, /*#__PURE__*/React.createElement(Ic, {
    name: "X"
  })), /*#__PURE__*/React.createElement("div", {
    className: "card"
  }, /*#__PURE__*/React.createElement("div", {
    className: "row"
  }, /*#__PURE__*/React.createElement(Ic, {
    name: "FootballBall",
    cls: "ic"
  }), /*#__PURE__*/React.createElement("span", {
    className: "teams"
  }, match(t.leg))), /*#__PURE__*/React.createElement("div", {
    className: "row"
  }, /*#__PURE__*/React.createElement("span", {
    className: "market"
  }, t.leg.mkt, " - ", t.leg.pick), /*#__PURE__*/React.createElement("span", {
    className: "odd"
  }, t.od.toFixed(2)))))), /*#__PURE__*/React.createElement("div", {
    className: "bs2foot"
  }, /*#__PURE__*/React.createElement("div", {
    className: "bs2switch"
  }, /*#__PURE__*/React.createElement("button", {
    className: "track" + (acceptOdds ? " on" : ""),
    onClick: () => setAcceptOdds(!acceptOdds),
    "aria-label": "Accept odds change"
  }), /*#__PURE__*/React.createElement("span", {
    className: "lbl"
  }, "Accept odds change. ", /*#__PURE__*/React.createElement("a", {
    href: "#"
  }, "Learn more"))), /*#__PURE__*/React.createElement("div", {
    className: "bs2stake"
  }, /*#__PURE__*/React.createElement("div", {
    className: "input"
  }, /*#__PURE__*/React.createElement("input", {
    inputMode: "decimal",
    value: stake,
    "aria-label": "Stake per bet",
    onChange: e => setStake(e.target.value.replace(/[^\d.]/g, ""))
  })), /*#__PURE__*/React.createElement("div", {
    className: "hint"
  }, /*#__PURE__*/React.createElement("span", null, "Min Stake is ", BP.CUR, " 1.00"))), /*#__PURE__*/React.createElement("div", {
    className: "bs2row bs2row--odds"
  }, /*#__PURE__*/React.createElement("span", {
    className: "k"
  }, "Odds:"), /*#__PURE__*/React.createElement("span", {
    className: "v"
  }, combinedOdds.toFixed(2))), /*#__PURE__*/React.createElement("div", {
    className: "bs2row"
  }, /*#__PURE__*/React.createElement("span", {
    className: "k"
  }, "Potential Winnings:"), /*#__PURE__*/React.createElement("span", {
    className: "v"
  }, BP.money(winnings))), /*#__PURE__*/React.createElement("div", {
    className: "bs2row"
  }, /*#__PURE__*/React.createElement("span", {
    className: "k"
  }, "8% Win Bonus:"), /*#__PURE__*/React.createElement("span", {
    className: "v"
  }, BP.money(bonus))), /*#__PURE__*/React.createElement("div", {
    className: "bs2row bs2row--payout"
  }, /*#__PURE__*/React.createElement("span", {
    className: "k"
  }, "Payout:"), /*#__PURE__*/React.createElement("span", {
    className: "v"
  }, BP.money(payout))), /*#__PURE__*/React.createElement("button", {
    className: "bs2place",
    disabled: !val,
    onClick: onPlace
  }, "Place Bet ", BP.money(val)))))));
}

/* ── ticket card — dark header · connector rail · tear line · payout hero ── */
function Ticket({
  tkKey,
  icon,
  name,
  note,
  legs,
  stake,
  max,
  onSwap,
  locks,
  onLock,
  onRowTap,
  roll,
  hint,
  actions,
  top,
  rail,
  flashAt,
  afterAdd,
  onRemove,
  warn,
  addKey,
  pop,
  capOutside
}) {
  const app = window.useApp();
  const rolling = roll != null;
  const t = prod(legs);
  const added = app.inSlip(legs);
  const [busyAdd, setBusyAdd] = useState(false);
  const doAdd = () => {
    if (busyAdd) return;
    setBusyAdd(true);
    setTimeout(() => {
      app.addSingles(tkKey, legs);
      setBusyAdd(false);
      if (afterAdd) afterAdd();
    }, 520);
  };
  const shown = max ? legs.slice(0, max) : legs;
  const rollOd = i => (1.2 + (roll * 37 + i * 23) % 42 / 10).toFixed(2);
  return /*#__PURE__*/React.createElement("article", {
    className: "tk" + (rail ? " tk--rail" : "")
  }, top, !capOutside && (name || note) ? /*#__PURE__*/React.createElement("div", {
    className: "tk__cap"
  }, /*#__PURE__*/React.createElement("span", {
    className: "tk__capnm"
  }, name), note ? /*#__PURE__*/React.createElement("em", null, note) : null) : null, /*#__PURE__*/React.createElement("div", {
    className: "tk__legs"
  }, shown.map((l, i) => {
    const locked = locks && locks.includes(i);
    const spinMe = rolling && !locked;
    return /*#__PURE__*/React.createElement("div", {
      className: "tkleg" + (locked ? " tkleg--lock" : "") + (onRowTap ? " tkleg--tap" : "") + (spinMe ? " tkleg--roll" : "") + (flashAt === i ? " tkleg--flash" : ""),
      key: l.id + i,
      style: spinMe ? {
        animationDelay: i * 45 + "ms"
      } : null,
      onClick: onRowTap ? () => onRowTap(i) : null
    }, /*#__PURE__*/React.createElement("span", {
      className: "tkleg__rail"
    }, /*#__PURE__*/React.createElement("i", null)), /*#__PURE__*/React.createElement("span", {
      className: "tkleg__tx"
    }, /*#__PURE__*/React.createElement("span", {
      className: "tkleg__pick"
    }, l.pick), /*#__PURE__*/React.createElement("span", {
      className: "tkleg__meta"
    }, l.mkt, " \xB7 ", l.teams[0].name, " v ", l.teams[1].name, pop && l.pop ? " · " + l.pop + "% backed" : "")), locked ? /*#__PURE__*/React.createElement("span", {
      className: "tkleg__kept"
    }, "KEPT") : null, /*#__PURE__*/React.createElement("span", {
      className: "tkleg__od"
    }, spinMe ? rollOd(i) : l.odds.toFixed(2)), /*#__PURE__*/React.createElement("span", {
      className: "tkleg__act"
    }, !addKey && onLock ? /*#__PURE__*/React.createElement("button", {
      className: "tkleg__ic" + (locked ? " on" : ""),
      onClick: e => {
        e.stopPropagation();
        onLock(i);
      },
      "aria-label": "Keep this pick"
    }, /*#__PURE__*/React.createElement(Ic, {
      name: locked ? "Lock" : "LockOpen",
      size: 14
    })) : null, onSwap ? /*#__PURE__*/React.createElement("button", {
      className: "tkleg__ic",
      onClick: e => {
        e.stopPropagation();
        onSwap(i);
      },
      "aria-label": "Replace this pick",
      disabled: locked
    }, /*#__PURE__*/React.createElement(Ic, {
      name: "RotateCw",
      size: 14
    })) : null, onRemove ? /*#__PURE__*/React.createElement("button", {
      className: "tkleg__ic tkleg__ic--del",
      onClick: e => {
        e.stopPropagation();
        onRemove(i);
      },
      "aria-label": "Remove this pick"
    }, /*#__PURE__*/React.createElement(Ic, {
      name: "X",
      size: 14
    })) : null, addKey ? (() => {
      const on = app.hasOne(l.id);
      return /*#__PURE__*/React.createElement("button", {
        className: "tkleg__add" + (on ? " on" : ""),
        onClick: e => {
          e.stopPropagation();
          app.addOne(addKey, l);
        },
        "aria-label": on ? "Remove from betslip" : "Add this pick to betslip"
      }, /*#__PURE__*/React.createElement(Ic, {
        name: on ? "Check" : "Plus",
        size: 15
      }));
    })() : null));
  }), max && legs.length > max ? /*#__PURE__*/React.createElement("div", {
    className: "tk__more"
  }, "+", legs.length - max, " more picks in this ticket") : null), hint ? /*#__PURE__*/React.createElement("div", {
    className: "tk__hint"
  }, /*#__PURE__*/React.createElement(Ic, {
    name: "Lock",
    size: 13
  }), hint) : null, warn ? /*#__PURE__*/React.createElement("div", {
    className: "tk__warn"
  }, /*#__PURE__*/React.createElement(Ic, {
    name: "CirlceInfo",
    size: 15
  }), warn) : null, /*#__PURE__*/React.createElement("div", {
    className: "tk__tear"
  }), /*#__PURE__*/React.createElement("div", {
    className: "tk__pay"
  }, /*#__PURE__*/React.createElement("span", {
    className: "k"
  }, "Stake", /*#__PURE__*/React.createElement("b", null, BP.money(stake, 0))), /*#__PURE__*/React.createElement("span", {
    className: "k tk__pay--od"
  }, "Odds", /*#__PURE__*/React.createElement("b", {
    className: rolling ? "is-roll" : ""
  }, rolling ? (t * (0.7 + roll % 5 / 5)).toFixed(2) : t.toFixed(2))), /*#__PURE__*/React.createElement("span", {
    className: "v"
  }, "Potential payout", /*#__PURE__*/React.createElement("b", null, BP.money(stake * t, 0)))), /*#__PURE__*/React.createElement("div", {
    className: "tk__acts"
  }, actions, /*#__PURE__*/React.createElement("button", {
    className: "tk__cta" + (busyAdd ? " tk__cta--busy" : ""),
    onClick: doAdd,
    disabled: busyAdd
  }, /*#__PURE__*/React.createElement(Ic, {
    name: busyAdd ? "RotateCw" : "Betslip",
    size: 17
  }), busyAdd ? "Adding to Betslip" : "Add to Betslip")));
}

/* ══ A · Theme picker ═════════════════════════════════════════════ */
const THEMES = [{
  k: "Popular",
  ic: "TrendingUp",
  test: l => (l.mkt === "1X2" || l.mkt === "Money Line" || l.mkt === "Match Winner") && l.odds <= 2.3
}, {
  k: "High Odds",
  ic: "Rocket",
  test: l => l.odds >= 4.2
}, {
  k: "Goals",
  ic: "FootballBall",
  test: l => l.mkt === "Total Goals Over/Under" && l.pick === "Over 2.5 Goals"
}, {
  k: "Both to Score",
  ic: "Sports",
  test: l => l.mkt === "Both Teams to Score (GG/NG)" && l.pick === "Both Teams to Score"
}, {
  k: "Low Odds",
  ic: "Check",
  test: l => l.odds <= 1.6
}, {
  k: "Draws",
  ic: "CirlceInfo",
  test: l => l.pick === "Draw" && l.mkt === "1X2"
}];
const themeCount = (t, leagues) => {
  const src = leagues && leagues.length ? POOL.filter(l => leagues.includes(l.comp)) : POOL;
  return new Set(src.filter(t.test).map(l => l.ev)).size;
};
function themeBuild(sel, seed, cap, leagues) {
  const rand = rng(seed);
  let scope = POOL.filter(l => sel.some(i => THEMES[i].test(l)));
  if (leagues && leagues.length) scope = scope.filter(l => leagues.includes(l.comp));
  const used = new Set(),
    legs = [];
  const shuffled = scope.slice().sort(() => rand() - 0.5);
  for (const l of shuffled) {
    if (legs.length >= Math.min(cap || 4, 60)) break;
    if (used.has(l.ev)) continue;
    used.add(l.ev);
    legs.push(l);
  }
  return legs;
}
function themeSwap(legs, i, sel) {
  const rand = rng(Date.now() % 9973 + i * 31);
  const used = new Set(legs.map(l => l.ev));
  const want = legs[i].odds;
  const scope = POOL.filter(l => sel.some(t => THEMES[t].test(l)));
  const c = (scope.length ? scope : POOL).filter(l => !used.has(l.ev)).sort((a, b) => Math.abs(a.odds - want) - Math.abs(b.odds - want));
  const p = c[Math.floor(rand() * Math.min(5, c.length))] || c[0];
  return p ? legs.map((l, j) => j === i ? p : l) : legs;
}
function OptA() {
  const [sel, setSel] = useState([0]);
  const [seed, setSeed] = useState(41);
  const [legs, setLegs] = useState(() => themeBuild([0], 41));
  const [flash, setFlash] = useState(-1);
  const [lg, setLg] = useState([]);
  const [n, setN] = useState(4);
  React.useEffect(() => {
    setLegs(sel.length ? themeBuild(sel, seed, n, lg) : []);
  }, [sel, seed, lg, n]);
  const swapOne = i => {
    setLegs(themeSwap(legs, i, sel));
    setFlash(i);
    setTimeout(() => setFlash(-1), 340);
  };
  const removeOne = i => setLegs(v => v.filter((_, j) => j !== i));
  const tog = i => setSel(v => v.includes(i) ? v.filter(x => x !== i) : [...v, i]);
  const names = sel.map(i => THEMES[i].k).join(" + ");
  return /*#__PURE__*/React.createElement("div", {
    className: "bm sec"
  }, /*#__PURE__*/React.createElement("div", {
    className: "sec__hd bmhd"
  }, /*#__PURE__*/React.createElement(Ic, {
    name: "Sparkles",
    cls: "ico",
    size: 32
  }), /*#__PURE__*/React.createElement("h3", null, "BetMaker AI", /*#__PURE__*/React.createElement("em", null, "Your AI assistant to build your betslip")), /*#__PURE__*/React.createElement(Info, {
    tip: "Tap a theme. We find the matches and build the ticket."
  })), /*#__PURE__*/React.createElement("div", {
    className: "bmctl"
  }, /*#__PURE__*/React.createElement("div", {
    className: "bmrow2"
  }, /*#__PURE__*/React.createElement(Drop, {
    label: "Popular Leagues",
    options: LEAGUES,
    value: lg,
    onChange: setLg,
    allLabel: "All Popular Leagues",
    allCount: LEAGUE_TOTAL,
    flags: k => LEAGUE_FLAGS[k],
    count: k => LEAGUE_COUNT[k]
  }), /*#__PURE__*/React.createElement(Drop, {
    label: "Popular Markets",
    options: THEMES.map(t => t.k),
    value: sel.map(i => THEMES[i].k),
    onChange: ks => setSel(ks.map(k => THEMES.findIndex(t => t.k === k)).filter(i => i >= 0)),
    count: k => themeCount(THEMES.find(t => t.k === k), lg)
  })), /*#__PURE__*/React.createElement("div", {
    className: "bmg"
  }, /*#__PURE__*/React.createElement("span", {
    className: "bmk"
  }, "Selections"), /*#__PURE__*/React.createElement("div", {
    className: "bmpick"
  }, /*#__PURE__*/React.createElement("span", {
    className: "bmpick__pre"
  }, [5, 8, 12, 24, 48].map(p => /*#__PURE__*/React.createElement("button", {
    key: p,
    className: n === p ? "on" : "",
    onClick: () => setN(p)
  }, p))), /*#__PURE__*/React.createElement("span", {
    className: "bmpick__step"
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => setN(Math.max(2, n - 1)),
    disabled: n <= 2,
    "aria-label": "Fewer selections"
  }, /*#__PURE__*/React.createElement(Ic, {
    name: "Minus",
    size: 15
  })), /*#__PURE__*/React.createElement("input", {
    inputMode: "numeric",
    value: n,
    "aria-label": "Number of selections",
    onChange: e => setN(Math.min(60, +e.target.value.replace(/\D/g, "") || 0)),
    onBlur: () => {
      if (n < 2) setN(2);
    }
  }), /*#__PURE__*/React.createElement("button", {
    onClick: () => setN(Math.min(60, n + 1)),
    disabled: n >= 60,
    "aria-label": "More selections"
  }, /*#__PURE__*/React.createElement(Ic, {
    name: "Plus",
    size: 15
  })))))), legs.length ? /*#__PURE__*/React.createElement(Ticket, {
    tkKey: "a",
    icon: "Betslip",
    name: names,
    note: legs.length + " selections found",
    legs: legs,
    stake: 100,
    onSwap: swapOne,
    onRemove: removeOne,
    flashAt: flash,
    warn: legs.length < n ? "Only " + legs.length + " selection" + (legs.length > 1 ? "s" : "") + " available for " + names + (lg.length ? " in " + (lg.length === 1 ? lg[0] : lg.length + " leagues") : "") + "." : null,
    actions: /*#__PURE__*/React.createElement("button", {
      className: "tk__spin",
      onClick: () => setSeed(seed + 7)
    }, /*#__PURE__*/React.createElement(Ic, {
      name: "RotateCw",
      size: 17
    }), "Shuffle")
  }) : /*#__PURE__*/React.createElement("div", {
    className: "bmempty"
  }, /*#__PURE__*/React.createElement(Ic, {
    name: "Sparkles",
    size: 18
  }), "Pick a market above to build a ticket."));
}

/* ══ B · Build My Odds ═════════════════════════════════════════════ */
function OptB() {
  const [target, setTarget] = useState(50);
  const [n, setN] = useState(4);
  const [ls, setLs] = useState([]);
  const [legs, setLegs] = useState(null);
  const [seed, setSeed] = useState(5);
  const [open, setOpen] = useState(false);
  const [flash, setFlash] = useState(-1);
  const stake = 100;
  const gen = () => {
    const sd = seed + 1;
    setSeed(sd);
    setLegs(refine(build(n, target, sd * 13, ls), target, sd));
    setOpen(true);
  };
  const regen = () => {
    const sd = seed + 1;
    setSeed(sd);
    setLegs(refine(build(n, target, sd * 13 + 7, ls), target, sd + 3));
  };
  const swapOne = i => {
    setLegs(swap(legs, i));
    setFlash(i);
    setTimeout(() => setFlash(-1), 340);
  };
  const removeOne = i => setLegs(v => v.filter((_, j) => j !== i));
  return /*#__PURE__*/React.createElement("div", {
    className: "bm sec"
  }, /*#__PURE__*/React.createElement(Hd, {
    tip: "Pick the multiplier you're chasing. We fill the picks to match."
  }), /*#__PURE__*/React.createElement("div", {
    className: "bmctl"
  }, /*#__PURE__*/React.createElement("div", {
    className: "bmg"
  }, /*#__PURE__*/React.createElement("span", {
    className: "bmk"
  }, "Target odds"), /*#__PURE__*/React.createElement("div", {
    className: "bmsg"
  }, [10, 25, 50, 100].map(t => /*#__PURE__*/React.createElement("button", {
    key: t,
    className: target === t ? "on" : "",
    onClick: () => setTarget(t)
  }, "\xD7", t)))), /*#__PURE__*/React.createElement("div", {
    className: "bmg"
  }, /*#__PURE__*/React.createElement("span", {
    className: "bmk"
  }, "Selections"), /*#__PURE__*/React.createElement("div", {
    className: "bmstep"
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => setN(Math.max(2, n - 1)),
    disabled: n <= 2,
    "aria-label": "Fewer selections"
  }, /*#__PURE__*/React.createElement(Ic, {
    name: "Minus",
    size: 16
  })), /*#__PURE__*/React.createElement("input", {
    inputMode: "numeric",
    value: n,
    "aria-label": "Number of selections",
    onChange: e => setN(Math.min(60, +e.target.value.replace(/\D/g, "") || 0)),
    onBlur: e => {
      if ((+e.target.value.replace(/\D/g, "") || 0) < 2) setN(2);
    }
  }), /*#__PURE__*/React.createElement("button", {
    onClick: () => setN(Math.min(60, n + 1)),
    disabled: n >= 60,
    "aria-label": "More selections"
  }, /*#__PURE__*/React.createElement(Ic, {
    name: "Plus",
    size: 16
  })))), /*#__PURE__*/React.createElement("button", {
    className: "bmgo",
    onClick: gen
  }, /*#__PURE__*/React.createElement(Ic, {
    name: "Sparkles",
    size: 17
  }), "Generate Selections")), React.createElement(GenSheet, {
    open: open && !!legs,
    onClose: () => setOpen(false),
    title: "BetMaker",
    cls: "dsheet",
    shuffle: regen
  }, legs ? /*#__PURE__*/React.createElement(Ticket, {
    tkKey: "b",
    icon: "TrendingUp",
    name: "Your ticket",
    note: "Aimed at ×" + target + " · odds " + prod(legs).toFixed(2),
    legs: legs,
    stake: stake,
    onSwap: swapOne,
    onRemove: removeOne,
    flashAt: flash,
    afterAdd: () => setOpen(false),
    warn: Math.abs(prod(legs) / target - 1) > 0.1 ? "Closest we can get with " + legs.length + " selections — landed ×" + prod(legs).toFixed(2) + " against ×" + target + "." : null
  }) : null));
}

/* ══ C · Shuffle ══════════════════════════════════════════════════ */
const BANDS = [{
  k: "×2–10",
  t: 5
}, {
  k: "×10–50",
  t: 22
}, {
  k: "×50+",
  t: 90
}];
function OptC() {
  const [n, setN] = useState(4);
  const [band, setBand] = useState(1);
  const [legs, setLegs] = useState(() => build(4, 22, 3));
  const [locks, setLocks] = useState([]);
  const [spins, setSpins] = useState(0);
  const [roll, setRoll] = useState(null);
  const [stale, setStale] = useState(false);
  const reshuffle = (cnt, bd) => {
    const fresh = build(cnt, BANDS[bd].t, Date.now() % 9973);
    const keep = locks.filter(i => i < cnt);
    setLocks(keep);
    setLegs(cur => fresh.map((l, i) => keep.includes(i) && cur[i] ? cur[i] : l));
    setStale(false);
  };
  const spin = () => {
    if (roll != null) return;
    let r = 0;
    const iv = setInterval(() => setRoll(++r), 70);
    setRoll(0);
    setTimeout(() => {
      clearInterval(iv);
      reshuffle(n, band);
      setSpins(spins + 1);
      setRoll(null);
    }, 560);
  };
  const tog = i => setLocks(v => v.includes(i) ? v.filter(x => x !== i) : [...v, i]);
  const [flash, setFlash] = useState(-1);
  const swapOne = i => {
    setLegs(swap(legs, i, l => l.odds >= BANDS[band].lo && l.odds <= BANDS[band].hi));
    setFlash(i);
    setTimeout(() => setFlash(-1), 340);
  };
  const removeOne = i => setLegs(v => v.filter((_, j) => j !== i));
  const busy = roll != null;
  return /*#__PURE__*/React.createElement("div", {
    className: "bm sec"
  }, /*#__PURE__*/React.createElement(Hd, {
    tip: "Set how many picks and the odds range, then shuffle. Tap a pick to keep it."
  }), /*#__PURE__*/React.createElement(Ticket, {
    tkKey: "c",
    icon: "Sparkles",
    name: "Quick Ticket",
    legs: legs,
    stake: 100,
    roll: roll,
    locks: locks,
    addKey: "c",
    onRowTap: busy ? null : tog,
    onSwap: busy ? null : swapOne,
    flashAt: flash,
    hint: stale ? "Settings changed — shuffle to rebuild with " + n + " picks at " + BANDS[band].k : locks.length ? locks.length + " pick" + (locks.length > 1 ? "s" : "") + " kept — the rest reshuffle" : null,
    top: /*#__PURE__*/React.createElement("div", {
      className: "tkctl"
    }, /*#__PURE__*/React.createElement("span", {
      className: "tkctl__k"
    }, "Picks"), /*#__PURE__*/React.createElement("span", {
      className: "tkctl__step"
    }, /*#__PURE__*/React.createElement("button", {
      onClick: () => {
        setN(n - 1);
        setStale(true);
      },
      disabled: n <= 2 || busy,
      "aria-label": "Fewer selections"
    }, /*#__PURE__*/React.createElement(Ic, {
      name: "Minus",
      size: 14
    })), /*#__PURE__*/React.createElement("input", {
      inputMode: "numeric",
      value: n,
      disabled: busy,
      "aria-label": "Number of selections",
      onChange: e => {
        setN(Math.min(60, +e.target.value.replace(/\D/g, "") || 0));
        setStale(true);
      },
      onBlur: () => {
        if (n < 2) setN(2);
      }
    }), /*#__PURE__*/React.createElement("button", {
      onClick: () => {
        setN(n + 1);
        setStale(true);
      },
      disabled: n >= 60 || busy,
      "aria-label": "More selections"
    }, /*#__PURE__*/React.createElement(Ic, {
      name: "Plus",
      size: 14
    }))), /*#__PURE__*/React.createElement("span", {
      className: "tkctl__band"
    }, BANDS.map((b, i) => /*#__PURE__*/React.createElement("button", {
      key: b.k,
      className: band === i ? "on" : "",
      disabled: busy,
      onClick: () => {
        setBand(i);
        setStale(true);
      }
    }, b.k))), /*#__PURE__*/React.createElement("button", {
      className: "tkctl__go" + (busy ? " is-busy" : "") + (stale ? " is-stale" : ""),
      onClick: spin,
      disabled: busy,
      "aria-label": "Shuffle"
    }, /*#__PURE__*/React.createElement(Ic, {
      name: "RotateCw",
      size: 16
    })))
  }));
}

/* ══ D · Set your payout ═══════════════════════════════════════════ */
const ODDR = [{
  k: "1.0–1.2",
  lo: 1.0,
  hi: 1.2
}, {
  k: "1.2–1.5",
  lo: 1.2,
  hi: 1.5
}, {
  k: "1.5–2.0",
  lo: 1.5,
  hi: 2.0
}, {
  k: "2.0+",
  lo: 2.0,
  hi: 99
}];
function OptD() {
  const [stake, setStake] = useState(100);
  const [legs, setLegs] = useState(null);
  const [open, setOpen] = useState(false);
  const [seed, setSeed] = useState(9);
  const [flash, setFlash] = useState(-1);
  const [picks, setPicks] = useState(0);
  const [rangeI, setRangeI] = useState(1);
  const [win, setWin] = useState(10000);
  const auto = 5;
  const nLegs = Math.max(2, Math.min(60, picks || 5));
  const gen = () => {
    const sd = seed + 1;
    setSeed(sd);
    setLegs(bandRefine(rangeBuild(nLegs, R.lo, R.hi, sd * 19), win / stake, R, sd));
    setOpen(true);
  };
  const regen = () => {
    const sd = seed + 1;
    setSeed(sd);
    setLegs(bandRefine(rangeBuild(nLegs, R.lo, R.hi, sd * 19 + 7), win / stake, R, sd + 3));
  };
  const swapOne = i => {
    setLegs(swap(legs, i, l => l.odds >= R.lo && l.odds <= R.hi));
    setFlash(i);
    setTimeout(() => setFlash(-1), 340);
  };
  const removeOne = i => setLegs(v => v.filter((_, j) => j !== i));
  const setCount = v => setPicks(v);
  const R = ODDR[rangeI];
  const est = Math.pow((R.lo + Math.min(R.hi, R.lo * 2)) / 2, nLegs);
  const hit = legs ? prod(legs) : 0;
  return /*#__PURE__*/React.createElement("div", {
    className: "bm sec"
  }, /*#__PURE__*/React.createElement(Hd, {
    tip: "Enter your stake and the payout you want. We pick the selections."
  }), /*#__PURE__*/React.createElement("div", {
    className: "bmctl"
  }, /*#__PURE__*/React.createElement("div", {
    className: "bmg"
  }, /*#__PURE__*/React.createElement("span", {
    className: "bmk"
  }, "I want to bet"), /*#__PURE__*/React.createElement("div", {
    className: "bmamt"
  }, /*#__PURE__*/React.createElement("span", null, BP.CUR), /*#__PURE__*/React.createElement("input", {
    inputMode: "numeric",
    value: stake,
    onChange: e => setStake(+e.target.value.replace(/\D/g, "") || 0)
  }), /*#__PURE__*/React.createElement("span", {
    className: "bmpre"
  }, [100, 500, 1000, 5000].map(v => /*#__PURE__*/React.createElement("button", {
    key: v,
    className: stake === v ? "on" : "",
    onClick: () => setStake(v)
  }, v >= 1000 ? v / 1000 + "K" : v))))), /*#__PURE__*/React.createElement("div", {
    className: "bmg"
  }, /*#__PURE__*/React.createElement("span", {
    className: "bmk"
  }, "To win"), /*#__PURE__*/React.createElement("div", {
    className: "bmamt"
  }, /*#__PURE__*/React.createElement("span", null, BP.CUR), /*#__PURE__*/React.createElement("input", {
    inputMode: "numeric",
    value: win,
    onChange: e => setWin(+e.target.value.replace(/\D/g, "") || 0)
  }), /*#__PURE__*/React.createElement("span", {
    className: "bmpre"
  }, [1000, 5000, 10000, 50000].map(w => /*#__PURE__*/React.createElement("button", {
    key: w,
    className: win === w ? "on" : "",
    onClick: () => setWin(w)
  }, w / 1000, "K"))))), /*#__PURE__*/React.createElement("div", {
    className: "bmg"
  }, /*#__PURE__*/React.createElement("span", {
    className: "bmk"
  }, "Selections"), /*#__PURE__*/React.createElement("div", {
    className: "bmpick"
  }, /*#__PURE__*/React.createElement("span", {
    className: "bmpick__pre"
  }, [5, 10, 20, 40].map(p => /*#__PURE__*/React.createElement("button", {
    key: p,
    className: picks === p ? "on" : "",
    onClick: () => setCount(p)
  }, p))), /*#__PURE__*/React.createElement("span", {
    className: "bmpick__step"
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => setCount(Math.max(2, (picks || auto) - 1)),
    disabled: (picks || auto) <= 2,
    "aria-label": "Fewer selections"
  }, /*#__PURE__*/React.createElement(Ic, {
    name: "Minus",
    size: 15
  })), /*#__PURE__*/React.createElement("input", {
    inputMode: "numeric",
    value: picks || auto,
    "aria-label": "Number of selections",
    onChange: e => {
      const v = +e.target.value.replace(/\D/g, "") || 0;
      setCount(Math.min(60, v));
    },
    onBlur: e => {
      const v = +e.target.value.replace(/\D/g, "") || 0;
      if (v && v < 2) setCount(2);
    }
  }), /*#__PURE__*/React.createElement("button", {
    onClick: () => setCount(Math.min(60, (picks || auto) + 1)),
    disabled: (picks || auto) >= 60,
    "aria-label": "More selections"
  }, /*#__PURE__*/React.createElement(Ic, {
    name: "Plus",
    size: 15
  }))))), /*#__PURE__*/React.createElement("div", {
    className: "bmg"
  }, /*#__PURE__*/React.createElement("span", {
    className: "bmk"
  }, "Odds range"), /*#__PURE__*/React.createElement("div", {
    className: "bmsg"
  }, ODDR.map((r, i) => /*#__PURE__*/React.createElement("button", {
    key: r.k,
    className: rangeI === i ? "on" : "",
    onClick: () => setRangeI(i)
  }, r.k)))), /*#__PURE__*/React.createElement("button", {
    className: "bmgo",
    onClick: gen
  }, /*#__PURE__*/React.createElement(Ic, {
    name: "Sparkles",
    size: 17
  }), "Generate Selections")), React.createElement(GenSheet, {
    open: open && !!legs,
    onClose: () => setOpen(false),
    title: "BetMaker",
    cls: "dsheet",
    shuffle: regen
  }, legs ? /*#__PURE__*/React.createElement(Ticket, {
    tkKey: "d",
    icon: "Coins",
    name: "Stake " + BP.money(stake, 0) + " to win " + BP.money(stake * hit, 0),
    note: "Odds " + hit.toFixed(2) + " · " + legs.length + " selections at " + R.k,
    legs: legs,
    stake: stake,
    onSwap: swapOne,
    onRemove: removeOne,
    flashAt: flash,
    afterAdd: () => setOpen(false),
    warn: legs.length < nLegs ? "Only " + legs.length + " selection" + (legs.length > 1 ? "s" : "") + " available at " + R.k + " right now." : Math.abs(stake * hit / win - 1) > 0.08 ? "Pays " + BP.money(stake * hit, 0) + " instead of " + BP.money(win, 0) + " — closest we can get with " + legs.length + " selections at " + R.k + "." : null
  }) : null));
}

/* ══ E · Odds kind · time frame · legs ═══════════════════════════ */
const KINDS = [{
  k: "Low Odds",
  lo: 1,
  hi: 1.6
}, {
  k: "Popular",
  lo: 1,
  hi: 99,
  test: l => (l.mkt === "1X2" || l.mkt === "Money Line" || l.mkt === "Match Winner") && l.odds <= 2.3
}, {
  k: "Any",
  lo: 1,
  hi: 99
}];
const WINDOWS = [{
  k: "Today",
  h: 24
}, {
  k: "48h",
  h: 48
}, {
  k: "72h",
  h: 72
}, {
  k: "Any",
  h: 999
}];
function kindBuild(n, kind, win, seed) {
  const rand = rng(seed);
  const src = POOL.filter(l => l.odds >= kind.lo && l.odds <= kind.hi && l.hrs <= win.h && (!kind.test || kind.test(l)));
  const used = new Set(),
    legs = [];
  for (const l of src.slice().sort(() => rand() - 0.5)) {
    if (legs.length >= Math.min(n, 60)) break;
    if (used.has(l.ev)) continue;
    used.add(l.ev);
    legs.push(l);
  }
  return legs;
}
function OptE() {
  const [kindI, setKindI] = useState(0);
  const [winI, setWinI] = useState(0);
  const [n, setN] = useState(4);
  const [legs, setLegs] = useState(null);
  const [open, setOpen] = useState(false);
  const [seed, setSeed] = useState(17);
  const [flash, setFlash] = useState(-1);
  const K = KINDS[kindI],
    W = WINDOWS[winI];
  const gen = () => {
    const sd = seed + 1;
    setSeed(sd);
    setLegs(kindBuild(n, K, W, sd * 23));
    setOpen(true);
  };
  const regen = () => {
    const sd = seed + 1;
    setSeed(sd);
    setLegs(kindBuild(n, K, W, sd * 23 + 5));
  };
  const swapOne = i => {
    setLegs(swap(legs, i, l => l.odds >= K.lo && l.odds <= K.hi && l.hrs <= W.h && (!K.test || K.test(l))));
    setFlash(i);
    setTimeout(() => setFlash(-1), 340);
  };
  const removeOne = i => setLegs(v => v.filter((_, j) => j !== i));
  const hit = legs ? prod(legs) : 0;
  const avail = new Set(POOL.filter(l => l.odds >= K.lo && l.odds <= K.hi && l.hrs <= W.h).map(l => l.ev)).size;
  return /*#__PURE__*/React.createElement("div", {
    className: "bm sec"
  }, /*#__PURE__*/React.createElement(Hd, {
    tip: "Choose the kind of odds, the time frame and how many legs. We do the rest."
  }), /*#__PURE__*/React.createElement("div", {
    className: "bmctl"
  }, /*#__PURE__*/React.createElement("div", {
    className: "bmg"
  }, /*#__PURE__*/React.createElement("span", {
    className: "bmk"
  }, "Events"), /*#__PURE__*/React.createElement("div", {
    className: "bmsg"
  }, KINDS.map((k, i) => /*#__PURE__*/React.createElement("button", {
    key: k.k,
    className: kindI === i ? "on" : "",
    onClick: () => setKindI(i)
  }, k.k)))), /*#__PURE__*/React.createElement("div", {
    className: "bmg"
  }, /*#__PURE__*/React.createElement("span", {
    className: "bmk"
  }, "Events Happening"), /*#__PURE__*/React.createElement("div", {
    className: "bmsg"
  }, WINDOWS.map((w, i) => /*#__PURE__*/React.createElement("button", {
    key: w.k,
    className: winI === i ? "on" : "",
    onClick: () => setWinI(i)
  }, w.k)))), /*#__PURE__*/React.createElement("div", {
    className: "bmg"
  }, /*#__PURE__*/React.createElement("span", {
    className: "bmk"
  }, "Legs"), /*#__PURE__*/React.createElement("div", {
    className: "bmpick"
  }, /*#__PURE__*/React.createElement("span", {
    className: "bmpick__pre"
  }, [5, 8, 12, 24, 48].map(p => /*#__PURE__*/React.createElement("button", {
    key: p,
    className: n === p ? "on" : "",
    onClick: () => setN(p)
  }, p))), /*#__PURE__*/React.createElement("span", {
    className: "bmpick__step"
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => setN(Math.max(2, n - 1)),
    disabled: n <= 2,
    "aria-label": "Fewer legs"
  }, /*#__PURE__*/React.createElement(Ic, {
    name: "Minus",
    size: 15
  })), /*#__PURE__*/React.createElement("input", {
    inputMode: "numeric",
    value: n,
    "aria-label": "Number of legs",
    onChange: e => setN(Math.min(60, +e.target.value.replace(/\D/g, "") || 0)),
    onBlur: () => {
      if (n < 2) setN(2);
    }
  }), /*#__PURE__*/React.createElement("button", {
    onClick: () => setN(Math.min(60, n + 1)),
    disabled: n >= 60,
    "aria-label": "More legs"
  }, /*#__PURE__*/React.createElement(Ic, {
    name: "Plus",
    size: 15
  }))))), /*#__PURE__*/React.createElement("button", {
    className: "bmgo",
    onClick: gen
  }, /*#__PURE__*/React.createElement(Ic, {
    name: "Sparkles",
    size: 17
  }), "Generate Selections")), React.createElement(GenSheet, {
    open: open && !!legs,
    onClose: () => setOpen(false),
    title: "BetMaker",
    cls: "dsheet",
    shuffle: regen
  }, legs ? /*#__PURE__*/React.createElement(Ticket, {
    tkKey: "e",
    icon: "Sparkles",
    name: K.k + " · " + W.k,
    note: "Odds " + hit.toFixed(2) + " · " + legs.length + " legs",
    legs: legs,
    stake: 100,
    onSwap: swapOne,
    onRemove: removeOne,
    flashAt: flash,
    afterAdd: () => setOpen(false),
    warn: legs.length < n ? "Only " + legs.length + " leg" + (legs.length > 1 ? "s" : "") + " available for " + K.k + " within " + W.k + "." : null
  }) : null));
}

/* ══ F · Odds kind · time frame · total odds range ═══════════════ */
const KINDSF = [{
  k: "Popular",
  lo: 1,
  hi: 99,
  test: l => (l.mkt === "1X2" || l.mkt === "Money Line" || l.mkt === "Match Winner") && l.odds <= 2.3
}, {
  k: "Any",
  lo: 1,
  hi: 99
}];
const TOTALS = [{
  k: "×2–5",
  lo: 2,
  hi: 5
}, {
  k: "×5–20",
  lo: 5,
  hi: 20
}, {
  k: "×20–100",
  lo: 20,
  hi: 100
}, {
  k: "×100+",
  lo: 100,
  hi: 1e6
}];

/* grow legs one at a time until the running product lands inside [lo, hi] */
function bandKindBuild(kind, win, band, n, seed) {
  const rand = rng(seed);
  const src = POOL.filter(l => l.odds >= band.lo && l.odds <= band.hi && l.hrs <= win.h && (!kind.test || kind.test(l)));
  const used = new Set(),
    legs = [];
  for (const l of src.slice().sort(() => rand() - 0.5)) {
    if (legs.length >= Math.min(n, 60)) break;
    if (used.has(l.ev)) continue;
    used.add(l.ev);
    legs.push(l);
  }
  return legs;
}
function totalBuild(kind, win, tot, seed) {
  const rand = rng(seed);
  const pool = POOL.filter(l => l.odds >= kind.lo && l.odds <= kind.hi && l.hrs <= win.h && (!kind.test || kind.test(l))).slice().sort(() => rand() - 0.5);
  const used = new Set(),
    legs = [];
  let p = 1;
  for (const l of pool) {
    if (used.has(l.ev)) continue;
    if (p >= tot.lo && p <= tot.hi) break;
    if (legs.length >= 60) break;
    if (p * l.odds > tot.hi && legs.length) continue;
    used.add(l.ev);
    legs.push(l);
    p *= l.odds;
  }
  return legs;
}
function OptF() {
  const [kindI, setKindI] = useState(0);
  const [winI, setWinI] = useState(0);
  const [totI, setTotI] = useState(2);
  const [n, setN] = useState(4);
  const [legs, setLegs] = useState(null);
  const [open, setOpen] = useState(false);
  const [seed, setSeed] = useState(29);
  const [flash, setFlash] = useState(-1);
  const K = KINDSF[kindI],
    W = WINDOWS[winI],
    T = ODDR[totI];
  const gen = () => {
    const sd = seed + 1;
    setSeed(sd);
    setLegs(bandKindBuild(K, W, T, n, sd * 31));
    setOpen(true);
  };
  const regen = () => {
    const sd = seed + 1;
    setSeed(sd);
    setLegs(bandKindBuild(K, W, T, n, sd * 31 + 11));
  };
  const swapOne = i => {
    setLegs(swap(legs, i, l => l.odds >= T.lo && l.odds <= T.hi && l.hrs <= W.h && (!K.test || K.test(l))));
    setFlash(i);
    setTimeout(() => setFlash(-1), 340);
  };
  const removeOne = i => setLegs(v => v.filter((_, j) => j !== i));
  const hit = legs ? prod(legs) : 0;
  return /*#__PURE__*/React.createElement("div", {
    className: "bm sec"
  }, /*#__PURE__*/React.createElement(Hd, {
    tip: "Choose the kind of events, the time frame and the odds range each selection should sit in."
  }), /*#__PURE__*/React.createElement("div", {
    className: "bmctl"
  }, /*#__PURE__*/React.createElement("div", {
    className: "bmg"
  }, /*#__PURE__*/React.createElement("span", {
    className: "bmk"
  }, "Events"), /*#__PURE__*/React.createElement("div", {
    className: "bmsg"
  }, KINDSF.map((k, i) => /*#__PURE__*/React.createElement("button", {
    key: k.k,
    className: kindI === i ? "on" : "",
    onClick: () => setKindI(i)
  }, k.k)))), /*#__PURE__*/React.createElement("div", {
    className: "bmg"
  }, /*#__PURE__*/React.createElement("span", {
    className: "bmk"
  }, "Events Happening"), /*#__PURE__*/React.createElement("div", {
    className: "bmsg"
  }, WINDOWS.map((w, i) => /*#__PURE__*/React.createElement("button", {
    key: w.k,
    className: winI === i ? "on" : "",
    onClick: () => setWinI(i)
  }, w.k)))), /*#__PURE__*/React.createElement("div", {
    className: "bmg"
  }, /*#__PURE__*/React.createElement("span", {
    className: "bmk"
  }, "Odds range"), /*#__PURE__*/React.createElement("div", {
    className: "bmsg"
  }, ODDR.map((t, i) => /*#__PURE__*/React.createElement("button", {
    key: t.k,
    className: totI === i ? "on" : "",
    onClick: () => setTotI(i)
  }, t.k)))), /*#__PURE__*/React.createElement("div", {
    className: "bmg"
  }, /*#__PURE__*/React.createElement("span", {
    className: "bmk"
  }, "Selections"), /*#__PURE__*/React.createElement("div", {
    className: "bmpick"
  }, /*#__PURE__*/React.createElement("span", {
    className: "bmpick__pre"
  }, [5, 8, 12, 24, 48].map(p => /*#__PURE__*/React.createElement("button", {
    key: p,
    className: n === p ? "on" : "",
    onClick: () => setN(p)
  }, p))), /*#__PURE__*/React.createElement("span", {
    className: "bmpick__step"
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => setN(Math.max(2, n - 1)),
    disabled: n <= 2,
    "aria-label": "Fewer selections"
  }, /*#__PURE__*/React.createElement(Ic, {
    name: "Minus",
    size: 15
  })), /*#__PURE__*/React.createElement("input", {
    inputMode: "numeric",
    value: n,
    "aria-label": "Number of selections",
    onChange: e => setN(Math.min(60, +e.target.value.replace(/\D/g, "") || 0)),
    onBlur: () => {
      if (n < 2) setN(2);
    }
  }), /*#__PURE__*/React.createElement("button", {
    onClick: () => setN(Math.min(60, n + 1)),
    disabled: n >= 60,
    "aria-label": "More selections"
  }, /*#__PURE__*/React.createElement(Ic, {
    name: "Plus",
    size: 15
  }))))), /*#__PURE__*/React.createElement("button", {
    className: "bmgo",
    onClick: gen
  }, /*#__PURE__*/React.createElement(Ic, {
    name: "Sparkles",
    size: 17
  }), "Generate Selections")), React.createElement(GenSheet, {
    open: open && !!legs,
    onClose: () => setOpen(false),
    title: "BetMaker",
    cls: "dsheet",
    shuffle: regen
  }, legs ? /*#__PURE__*/React.createElement(Ticket, {
    tkKey: "f",
    icon: "Sparkles",
    name: K.k + " · " + W.k,
    note: "Odds " + hit.toFixed(2) + " · " + legs.length + " legs",
    legs: legs,
    stake: 100,
    onSwap: swapOne,
    onRemove: removeOne,
    flashAt: flash,
    afterAdd: () => setOpen(false),
    warn: legs.length < n ? "Only " + legs.length + " selection" + (legs.length > 1 ? "s" : "") + " available at " + T.k + " for " + K.k + " events inside " + W.k + "." : null
  }) : null));
}

/* ══ G · Popular selections — best-backed picks, filtered by market ═══ */
const GMKT_NAMES = ["1X2", "1X2 1UP", "1X2 2UP", "Total Goals Over/Under", "Home Team Over/Under", "Away Team Over/Under", "Double Chance", "Double Chance 1UP", "Both Teams to Score (GG/NG)", "1X2 First Half", "Over/Under First Half", "1X2 - Interval 10 minutes (00:01-09:59)"];
const GMKTS = GMKT_NAMES.map(m => ({
  k: m,
  test: m === "1X2" ? l => l.mkt === "1X2" || l.mkt === "Money Line" || l.mkt === "Match Winner" : m === "Total Goals Over/Under" ? l => l.mkt === m || l.mkt === "Total Points" || l.mkt === "Total Games" : l => l.mkt === m
}));
const ALLG = GMKTS.map((_, i) => i);
const themeCountO = t => new Set(POOL.filter(t.test).map(l => l.ev)).size;
const gmap = (l, sel) => {
  const m = sel.map(i => GMKTS[i]).find(g => g.map && g.test(l));
  return m ? m.map(l) : l;
};

/* rank by how heavily each selection is backed, with a little seed jitter so
   Shuffle turns up a different cut of the popular board */
function themeBuildO(sel, seed, cap, lg, win) {
  const rand = rng(seed);
  const h = win ? win.h : 999;
  let scope = POOL.filter(l => sel.some(i => GMKTS[i].test(l)) && l.hrs <= h);
  if (lg && lg.length) scope = scope.filter(l => lg.includes(l.comp));
  const ranked = scope.map(l => ({
    l,
    s: l.pop + (rand() - 0.5) * 9
  })).sort((a, b) => b.s - a.s);
  const used = new Set(),
    legs = [];
  for (const {
    l
  } of ranked) {
    if (legs.length >= Math.min(cap || 4, 60)) break;
    if (used.has(l.ev)) continue;
    used.add(l.ev);
    legs.push(gmap(l, sel));
  }
  return legs.sort((a, b) => b.pop - a.pop);
}
function gSwap(legs, i, sel, lg, win) {
  const rand = rng(Date.now() % 9973 + i * 31);
  const used = new Set(legs.map(l => l.ev));
  const h = win ? win.h : 999;
  let scope = POOL.filter(l => sel.some(t => GMKTS[t].test(l)) && l.hrs <= h);
  if (lg && lg.length) scope = scope.filter(l => lg.includes(l.comp));
  const c = (scope.length ? scope : POOL).filter(l => !used.has(l.ev)).sort((a, b) => b.pop - a.pop);
  const p = c[Math.floor(rand() * Math.min(5, c.length))] || c[0];
  return p ? legs.map((l, j) => j === i ? gmap(p, sel) : l) : legs;
}
function OptG() {
  const [sel, setSel] = useState(ALLG);
  const [seed, setSeed] = useState(41);
  const [legs, setLegs] = useState(null);
  const [open, setOpen] = useState(false);
  const [flash, setFlash] = useState(-1);
  const [n, setN] = useState(4);
  const [lg, setLg] = useState([]);
  const [winI, setWinI] = useState(0);
  const W = WINDOWS[winI];
  const gen = () => {
    const sd = seed + 1;
    setSeed(sd);
    setLegs(themeBuildO(sel.length ? sel : ALLG, sd * 17, n, lg, W));
    setOpen(true);
  };
  const regen = () => {
    const sd = seed + 1;
    setSeed(sd);
    setLegs(themeBuildO(sel.length ? sel : ALLG, sd * 17 + 5, n, lg, W));
  };
  const swapOne = i => {
    setLegs(gSwap(legs, i, sel, lg, W));
    setFlash(i);
    setTimeout(() => setFlash(-1), 340);
  };
  const removeOne = i => setLegs(v => v.filter((_, j) => j !== i));
  const names = sel.length === GMKTS.length ? "All markets" : sel.map(i => GMKTS[i].k).join(" + ");
  return /*#__PURE__*/React.createElement("div", {
    className: "bm sec"
  }, /*#__PURE__*/React.createElement("div", {
    className: "sec__hd bmhd"
  }, /*#__PURE__*/React.createElement(Ic, {
    name: "Sparkles",
    cls: "ico",
    size: 32
  }), /*#__PURE__*/React.createElement("h3", null, "BetMaker AI", /*#__PURE__*/React.createElement("em", null, "Your AI assistant to build your betslip")), /*#__PURE__*/React.createElement(Info, {
    tip: "We rank every market by how heavily it is being backed right now and build a ticket from the top. Filter by market, league or time to narrow it down."
  })), /*#__PURE__*/React.createElement("div", {
    className: "bmctl"
  }, /*#__PURE__*/React.createElement("div", {
    className: "bmrow2"
  }, /*#__PURE__*/React.createElement(Drop, {
    label: "Popular Markets",
    options: GMKTS.map(t => t.k),
    value: sel.length === GMKTS.length ? [] : sel.map(i => GMKTS[i].k),
    onChange: ks => setSel(ks.length ? ks.map(k => GMKTS.findIndex(t => t.k === k)).filter(i => i >= 0) : ALLG)
  }), /*#__PURE__*/React.createElement(Drop, {
    label: "Popular Leagues",
    options: LEAGUES,
    value: lg,
    onChange: setLg,
    allLabel: "All Popular Leagues",
    allCount: LEAGUE_TOTAL,
    flags: k => LEAGUE_FLAGS[k],
    count: k => LEAGUE_COUNT[k]
  })), /*#__PURE__*/React.createElement("div", {
    className: "bmg"
  }, /*#__PURE__*/React.createElement("span", {
    className: "bmk"
  }, "Events Happening"), /*#__PURE__*/React.createElement("div", {
    className: "bmsg"
  }, WINDOWS.map((w, i) => /*#__PURE__*/React.createElement("button", {
    key: w.k,
    className: winI === i ? "on" : "",
    onClick: () => setWinI(i)
  }, w.k)))), /*#__PURE__*/React.createElement("div", {
    className: "bmg"
  }, /*#__PURE__*/React.createElement("span", {
    className: "bmk"
  }, "Selections"), /*#__PURE__*/React.createElement("div", {
    className: "bmpick"
  }, /*#__PURE__*/React.createElement("span", {
    className: "bmpick__pre"
  }, [5, 8, 12, 24, 48].map(p => /*#__PURE__*/React.createElement("button", {
    key: p,
    className: n === p ? "on" : "",
    onClick: () => setN(p)
  }, p))), /*#__PURE__*/React.createElement("span", {
    className: "bmpick__step"
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => setN(Math.max(2, n - 1)),
    disabled: n <= 2,
    "aria-label": "Fewer selections"
  }, /*#__PURE__*/React.createElement(Ic, {
    name: "Minus",
    size: 15
  })), /*#__PURE__*/React.createElement("input", {
    inputMode: "numeric",
    value: n,
    "aria-label": "Number of selections",
    onChange: e => setN(Math.min(60, +e.target.value.replace(/\D/g, "") || 0)),
    onBlur: () => {
      if (n < 2) setN(2);
    }
  }), /*#__PURE__*/React.createElement("button", {
    onClick: () => setN(Math.min(60, n + 1)),
    disabled: n >= 60,
    "aria-label": "More selections"
  }, /*#__PURE__*/React.createElement(Ic, {
    name: "Plus",
    size: 15
  }))))), /*#__PURE__*/React.createElement("button", {
    className: "bmgo",
    onClick: gen
  }, /*#__PURE__*/React.createElement(Ic, {
    name: "Sparkles",
    size: 17
  }), "Generate Selections")), React.createElement(GenSheet, {
    open: open && !!legs && !!legs.length,
    onClose: () => setOpen(false),
    title: "BetMaker",
    cls: "dsheet",
    shuffle: regen
  }, legs && legs.length ? /*#__PURE__*/React.createElement(Ticket, {
    tkKey: "g",
    icon: "Flame",
    name: names,
    note: legs.length + " most backed picks · " + W.k,
    legs: legs,
    stake: 100,
    pop: true,
    onSwap: swapOne,
    onRemove: removeOne,
    flashAt: flash,
    afterAdd: () => setOpen(false),
    warn: legs.length < n ? "Only " + legs.length + " selection" + (legs.length > 1 ? "s" : "") + " available for " + names + (lg.length ? " in " + (lg.length === 1 ? lg[0] : lg.length + " leagues") : "") + " inside " + W.k + "." : null
  }) : null));
}

/* ══ H · Set your payout, legs worked out for you ════════════════ */
/* Solver: pick at most one selection per event so the product of the odds
   lands on the target multiplier. Greedy fill in log space, then local search
   (swap / add / drop a leg) until the payout can't get any closer.
   The odds band is a preference — if the target is out of reach inside it we
   widen to the whole book, because hitting the To Win amount comes first. */
const BY_EV = (() => {
  const m = new Map();
  POOL.forEach(l => {
    m.has(l.ev) || m.set(l.ev, []);
    m.get(l.ev).push(l);
  });
  return m;
})();
function solveLegs(target, pref, seed, cap) {
  const MAXLEGS = Math.max(2, Math.min(cap || 60, 60));
  const tlog = Math.log(target);
  const evs = Array.from(BY_EV.keys());
  const opts = new Map();
  evs.forEach(e => {
    const a = BY_EV.get(e).filter(pref);
    if (a.length) opts.set(e, a);
  });
  if (!opts.size) return null;
  const rand = rng(seed || 1);
  const order = Array.from(opts.keys()).sort(() => rand() - 0.5);
  const chosen = new Map();
  let lp = 0;
  for (const ev of order) {
    if (chosen.size >= MAXLEGS) break;
    const rem = tlog - lp;
    if (rem <= 1e-4) break;
    let bst = null,
      bstE = Infinity;
    for (const o of opts.get(ev)) {
      const lo = Math.log(o.odds);
      const e = lo <= rem ? rem - lo : (lo - rem) * 4;
      if (e < bstE) {
        bstE = e;
        bst = o;
      }
    }
    if (bst) {
      chosen.set(ev, bst);
      lp += Math.log(bst.odds);
    }
  }
  if (!chosen.size) {
    const e = order[0];
    chosen.set(e, opts.get(e)[0]);
    lp = Math.log(opts.get(e)[0].odds);
  }
  const err = () => Math.abs(lp - tlog);
  for (let pass = 0; pass < 30; pass++) {
    let moved = false;
    if (err() < 1e-4) break;
    for (const ev of order) {
      const cur = chosen.get(ev);
      const base = cur ? lp - Math.log(cur.odds) : lp;
      let best = err(),
        pick = cur,
        drop = false;
      if (cur && chosen.size > 2 && Math.abs(base - tlog) < best - 1e-9) {
        best = Math.abs(base - tlog);
        pick = null;
        drop = true;
      }
      if (cur || chosen.size < MAXLEGS) {
        for (const o of opts.get(ev)) {
          if (cur && o.id === cur.id) continue;
          const e = Math.abs(base + Math.log(o.odds) - tlog);
          if (e < best - 1e-9) {
            best = e;
            pick = o;
            drop = false;
          }
        }
      }
      if (drop) {
        chosen.delete(ev);
        lp = base;
        moved = true;
      } else if (pick && pick !== cur) {
        chosen.set(ev, pick);
        lp = base + Math.log(pick.odds);
        moved = true;
      }
    }
    if (!moved) break;
  }
  /* pairwise polish — single moves get trapped when one leg must come down
     and another must go up at the same time */
  const keys = Array.from(opts.keys());
  for (let pass = 0; pass < 6; pass++) {
    let moved = false;
    if (err() < 1e-4) break;
    for (let a = 0; a < keys.length; a++) {
      for (let b = a + 1; b < keys.length; b++) {
        const ea = keys[a],
          eb = keys[b],
          ca = chosen.get(ea),
          cb = chosen.get(eb);
        const base = lp - (ca ? Math.log(ca.odds) : 0) - (cb ? Math.log(cb.odds) : 0);
        const nBase = chosen.size - (ca ? 1 : 0) - (cb ? 1 : 0);
        const la = [null].concat(opts.get(ea)),
          lb = [null].concat(opts.get(eb));
        let best = err(),
          pa = ca,
          pb = cb,
          found = false;
        for (const oa of la) {
          for (const ob of lb) {
            const n = nBase + (oa ? 1 : 0) + (ob ? 1 : 0);
            if (n < 2 || n > MAXLEGS) continue;
            const e = Math.abs(base + (oa ? Math.log(oa.odds) : 0) + (ob ? Math.log(ob.odds) : 0) - tlog);
            if (e < best - 1e-9) {
              best = e;
              pa = oa;
              pb = ob;
              found = true;
            }
          }
        }
        if (found) {
          pa ? chosen.set(ea, pa) : chosen.delete(ea);
          pb ? chosen.set(eb, pb) : chosen.delete(eb);
          lp = base + (pa ? Math.log(pa.odds) : 0) + (pb ? Math.log(pb.odds) : 0);
          moved = true;
        }
      }
    }
    if (!moved) break;
  }
  return {
    legs: Array.from(chosen.values()),
    err: Math.abs(Math.exp(lp) / target - 1)
  };
}
function payoutBuild(target, band, seed, win, cap, lowOnly) {
  if (!(target > 1)) return [];
  const w = win || {
    h: 999
  };
  const inWin = l => l.hrs <= w.h;
  const cutoff = band.lo + (Math.min(band.hi, 3) - band.lo) * 0.45;
  const inBand = l => l.odds >= band.lo && l.odds <= band.hi && inWin(l) && (!lowOnly || l.odds <= cutoff);
  let best = null;
  for (let a = 0; a < 24; a++) {
    const r = solveLegs(target, inBand, (seed || 1) + a * 977, cap);
    if (r && (!best || r.err < best.err)) best = r;
    if (best && best.err < 0.005) break;
  }
  /* the only relaxation is dropping the internal "prefer the low end" hint —
     the chosen odds range and time window are never widened */
  if (!best && lowOnly) {
    const full = l => l.odds >= band.lo && l.odds <= band.hi && inWin(l);
    for (let a = 0; a < 12; a++) {
      const r = solveLegs(target, full, (seed || 1) + a * 613, cap);
      if (r && (!best || r.err < best.err)) best = r;
      if (best && best.err < 0.005) break;
    }
  }
  if (!best) return [];
  return best.legs.slice().sort((x, y) => y.odds - x.odds);
}
function OptH() {
  const [stake, setStake] = useState(500);
  const [legs, setLegs] = useState(null);
  const [open, setOpen] = useState(false);
  const [seed, setSeed] = useState(9);
  const [flash, setFlash] = useState(-1);
  const [rangeI, setRangeI] = useState(0);
  const [winI, setWinI] = useState(0);
  const [win, setWin] = useState(10000);
  const R = ODDR[rangeI],
    W = WINDOWS[winI];
  const target = Math.max(win / Math.max(stake, 1), 1.05);
  const [vars, setVars] = useState(null);
  const [vi, setVi] = useState(1);
  const makeVars = sd => {
    const mult = Math.max(1.01, target);
    const need = Math.max(2, Math.ceil(Math.log(mult) / Math.log(R.hi > 1 ? R.hi : 1.2)));
    const mid = Math.min(60, need + Math.max(2, Math.round(need * 0.5)));
    const raw = [{
      k: "Short",
      legs: payoutBuild(target, R, sd, W, Math.min(60, need + 1))
    }, {
      k: "Balanced",
      legs: payoutBuild(target, R, sd + 101, W, mid)
    }, {
      k: "Long",
      legs: payoutBuild(target, R, sd + 211, W, 60, true)
    }];

    /* only offer a variant that actually reaches the payout; if none does,
       keep the single closest so the sheet still shows the best effort */
    const scored = raw.filter(v => v.legs && v.legs.length).map(v => ({
      ...v,
      off: Math.abs(prod(v.legs) / target - 1)
    }));
    const good = scored.filter(v => v.off <= 0.02);
    const list = good.length ? good : scored.sort((a, b) => a.off - b.off).slice(0, 1);
    const out = [],
      seen = new Set();
    for (const v of list) {
      const key = v.legs.map(l => l.id).sort().join("|");
      if (seen.has(key) || seen.has("n" + v.legs.length)) continue;
      seen.add(key);
      seen.add("n" + v.legs.length);
      out.push(v);
    }
    return out.sort((a, b) => a.legs.length - b.legs.length);
  };
  const gen = () => {
    const sd = (seed + 1) * 19;
    setSeed(seed + 1);
    const vs = makeVars(sd);
    setVars(vs);
    setVi(Math.min(1, vs.length - 1));
    setLegs(vs.length ? vs[Math.min(1, vs.length - 1)].legs : []);
    setOpen(true);
  };
  const regen = () => {
    const sd = (seed + 1) * 19 + 7;
    setSeed(seed + 1);
    const vs = makeVars(sd);
    setVars(vs);
    setVi(Math.min(vi, vs.length - 1));
    setLegs(vs.length ? vs[Math.min(vi, vs.length - 1)].legs : []);
  };
  const pickVar = i => {
    setVi(i);
    setLegs(vars[i].legs);
  };
  const swapOne = i => {
    setLegs(swap(legs, i, l => l.odds >= R.lo && l.odds <= R.hi && l.hrs <= W.h));
    setFlash(i);
    setTimeout(() => setFlash(-1), 340);
  };
  const removeOne = i => setLegs(v => v.filter((_, j) => j !== i));
  const hit = legs ? prod(legs) : 0;
  const off = legs ? Math.abs(stake * hit / win - 1) : 0;
  return /*#__PURE__*/React.createElement("div", {
    className: "bm sec"
  }, /*#__PURE__*/React.createElement(Hd, {
    tip: "Enter your stake, the payout you want and when the games should play. We pick the selections."
  }), /*#__PURE__*/React.createElement("div", {
    className: "bmctl"
  }, /*#__PURE__*/React.createElement("div", {
    className: "bmg"
  }, /*#__PURE__*/React.createElement("span", {
    className: "bmk"
  }, "I want to bet"), /*#__PURE__*/React.createElement("div", {
    className: "bmamt"
  }, /*#__PURE__*/React.createElement("span", null, BP.CUR), /*#__PURE__*/React.createElement("input", {
    inputMode: "numeric",
    value: stake,
    onChange: e => setStake(+e.target.value.replace(/\D/g, "") || 0)
  }), /*#__PURE__*/React.createElement("span", {
    className: "bmpre"
  }, [100, 500, 1000, 5000].map(v => /*#__PURE__*/React.createElement("button", {
    key: v,
    className: stake === v ? "on" : "",
    onClick: () => setStake(v)
  }, v >= 1000 ? v / 1000 + "K" : v))))), /*#__PURE__*/React.createElement("div", {
    className: "bmg"
  }, /*#__PURE__*/React.createElement("span", {
    className: "bmk"
  }, "To win"), /*#__PURE__*/React.createElement("div", {
    className: "bmamt"
  }, /*#__PURE__*/React.createElement("span", null, BP.CUR), /*#__PURE__*/React.createElement("input", {
    inputMode: "numeric",
    value: win,
    onChange: e => setWin(+e.target.value.replace(/\D/g, "") || 0)
  }), /*#__PURE__*/React.createElement("span", {
    className: "bmpre"
  }, [1000, 5000, 10000, 50000].map(w => /*#__PURE__*/React.createElement("button", {
    key: w,
    className: win === w ? "on" : "",
    onClick: () => setWin(w)
  }, w / 1000, "K"))))), /*#__PURE__*/React.createElement("div", {
    className: "bmg"
  }, /*#__PURE__*/React.createElement("span", {
    className: "bmk"
  }, "Odds range"), /*#__PURE__*/React.createElement("div", {
    className: "bmsg"
  }, ODDR.map((r, i) => /*#__PURE__*/React.createElement("button", {
    key: r.k,
    className: rangeI === i ? "on" : "",
    onClick: () => setRangeI(i)
  }, r.k)))), /*#__PURE__*/React.createElement("div", {
    className: "bmg"
  }, /*#__PURE__*/React.createElement("span", {
    className: "bmk"
  }, "Events Happening"), /*#__PURE__*/React.createElement("div", {
    className: "bmsg"
  }, WINDOWS.map((w, i) => /*#__PURE__*/React.createElement("button", {
    key: w.k,
    className: winI === i ? "on" : "",
    onClick: () => setWinI(i)
  }, w.k)))), /*#__PURE__*/React.createElement("button", {
    className: "bmgo",
    onClick: gen
  }, /*#__PURE__*/React.createElement(Ic, {
    name: "Sparkles",
    size: 17
  }), "Generate Selections")), React.createElement(GenSheet, {
    open: open && !!legs,
    onClose: () => setOpen(false),
    title: "BetMaker",
    cls: "dsheet dsheet--stack",
    shuffle: regen
  }, legs ? /*#__PURE__*/React.createElement(Ticket, {
    tkKey: "h",
    icon: "Coins",
    name: "Stake " + BP.money(stake, 0) + " to win " + BP.money(stake * hit, 0),
    note: "Odds " + hit.toFixed(2) + " · " + legs.length + " selections · " + W.k,
    legs: legs,
    stake: stake,
    onSwap: swapOne,
    onRemove: removeOne,
    flashAt: flash,
    afterAdd: () => setOpen(false),
    top: vars && vars.length > 1 ? /*#__PURE__*/React.createElement("div", {
      className: "tkctl"
    }, /*#__PURE__*/React.createElement("span", {
      className: "tkctl__k"
    }, "Recommended Legs"), /*#__PURE__*/React.createElement("span", {
      className: "tkctl__band"
    }, vars.map((v, i) => /*#__PURE__*/React.createElement("button", {
      key: v.k,
      className: vi === i ? "on" : "",
      onClick: () => pickVar(i)
    }, v.legs.length, " legs")))) : null,
    warn: off > 0.01 ? "Pays " + BP.money(stake * hit, 0) + " — the closest we can reach to " + BP.money(win, 0) + " using only " + R.k + " odds inside " + W.k + "." : null
  }) : null));
}

/* ══ I · Conversational sentence builder ═════════════════════════ */
function Tok({
  options,
  value,
  onChange
}) {
  const [open, setOpen] = useState(false);
  return /*#__PURE__*/React.createElement("span", {
    className: "tok" + (open ? " is-open" : "")
  }, /*#__PURE__*/React.createElement("button", {
    className: "tok__b",
    onClick: () => setOpen(!open),
    "aria-expanded": open
  }, options[value].k, /*#__PURE__*/React.createElement(Ic, {
    name: "ChevronDown",
    size: 14
  })), open ? /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("span", {
    className: "tok__scrim",
    onClick: () => setOpen(false)
  }), /*#__PURE__*/React.createElement("span", {
    className: "tok__menu",
    role: "listbox"
  }, options.map((o, i) => /*#__PURE__*/React.createElement("button", {
    key: o.k,
    className: "tok__opt" + (i === value ? " on" : ""),
    onClick: () => {
      onChange(i);
      setOpen(false);
    }
  }, o.k, i === value ? /*#__PURE__*/React.createElement(Ic, {
    name: "Check",
    size: 13
  }) : null)))) : null);
}
function OptI() {
  const [kindI, setKindI] = useState(0);
  const [winI, setWinI] = useState(0);
  const [totI, setTotI] = useState(0);
  const [legs, setLegs] = useState(null);
  const [open, setOpen] = useState(false);
  const [seed, setSeed] = useState(53);
  const [flash, setFlash] = useState(-1);
  const [thinking, setThinking] = useState(false);
  const K = KINDSF[kindI],
    W = WINDOWS[winI],
    T = ODDR[totI];
  const run = () => {
    if (thinking) return;
    setThinking(true);
    const sd = seed + 1;
    setSeed(sd);
    setTimeout(() => {
      setLegs(bandKindBuild(K, W, T, 10, sd * 37));
      setThinking(false);
      setOpen(true);
    }, 620);
  };
  const regen = () => {
    const sd = seed + 1;
    setSeed(sd);
    setLegs(bandKindBuild(K, W, T, 10, sd * 37 + 13));
  };
  const swapOne = i => {
    setLegs(swap(legs, i, l => l.odds >= T.lo && l.odds <= T.hi && l.hrs <= W.h && (!K.test || K.test(l))));
    setFlash(i);
    setTimeout(() => setFlash(-1), 340);
  };
  const removeOne = i => setLegs(v => v.filter((_, j) => j !== i));
  const hit = legs ? prod(legs) : 0;
  return /*#__PURE__*/React.createElement("div", {
    className: "bm sec"
  }, /*#__PURE__*/React.createElement(Hd, {
    tip: "Fill in the sentence and we find selections that match."
  }), /*#__PURE__*/React.createElement("div", {
    className: "bmctl bmsay"
  }, /*#__PURE__*/React.createElement("p", {
    className: "bmsay__tx"
  }, "Find me ", /*#__PURE__*/React.createElement(Tok, {
    options: KINDSF,
    value: kindI,
    onChange: setKindI
  }), " events playing ", /*#__PURE__*/React.createElement(Tok, {
    options: WINDOWS,
    value: winI,
    onChange: setWinI
  }), " ", "with odds ", /*#__PURE__*/React.createElement(Tok, {
    options: ODDR,
    value: totI,
    onChange: setTotI
  }), "."), /*#__PURE__*/React.createElement("button", {
    className: "bmgo" + (thinking ? " is-busy" : ""),
    onClick: run,
    disabled: thinking
  }, /*#__PURE__*/React.createElement(Ic, {
    name: thinking ? "RotateCw" : "Sparkles",
    size: 17
  }), thinking ? "Finding selections" : "Generate Selections")), React.createElement(GenSheet, {
    open: open && !!legs,
    onClose: () => setOpen(false),
    title: "BetMaker",
    cls: "dsheet",
    shuffle: regen
  }, legs ? /*#__PURE__*/React.createElement(Ticket, {
    tkKey: "i",
    icon: "Sparkles",
    name: K.k + " · " + W.k,
    note: legs.length + " selections at " + T.k,
    legs: legs,
    stake: 100,
    onSwap: swapOne,
    onRemove: removeOne,
    flashAt: flash,
    afterAdd: () => setOpen(false),
    warn: legs.length < 10 ? "Only " + legs.length + " selection" + (legs.length > 1 ? "s" : "") + " available at " + T.k + " for " + K.k + " events inside " + W.k + "." : null
  }) : null));
}

/* ══ Direct · target odds + selections, straight to the betslip ═══ */
function InlineGhost() {
  return /*#__PURE__*/React.createElement("div", {
    className: "bmload"
  }, /*#__PURE__*/React.createElement("div", {
    className: "bmload__hero"
  }, /*#__PURE__*/React.createElement(Ic, {
    name: "Sparkles",
    size: 40
  }), /*#__PURE__*/React.createElement("span", null, "Generating Selections\u2026")), [0, 1, 2].map(i => /*#__PURE__*/React.createElement("div", {
    className: "bmload__row",
    key: i,
    style: {
      animationDelay: i * 90 + "ms"
    }
  }, /*#__PURE__*/React.createElement("i", {
    style: {
      width: 58 + i % 3 * 14 + "%"
    }
  }), /*#__PURE__*/React.createElement("i", {
    style: {
      width: 34 + i % 2 * 16 + "%"
    }
  }))));
}
function OptDirect() {
  const app = window.useApp();
  const [target, setTarget] = useState(50);
  const [n, setN] = useState(4);
  const [seed, setSeed] = useState(9);
  const [busy, setBusy] = useState(false);
  const run = () => {
    if (busy) return;
    setBusy(true);
    const sd = seed + 1;
    setSeed(sd);
    setTimeout(() => {
      const legs = refine(build(n, target, sd * 13), target, sd);
      app.addSingles("betmaker", legs);
      setBusy(false);
      app.openBetslip();
    }, 1150);
  };
  return /*#__PURE__*/React.createElement("div", {
    className: "bm sec"
  }, /*#__PURE__*/React.createElement(Hd, {
    sub: false,
    tip: "Pick the multiplier you're chasing and how many selections to use. We build the ticket and send it straight to your betslip."
  }), /*#__PURE__*/React.createElement("div", {
    className: "bmctl"
  }, /*#__PURE__*/React.createElement("div", {
    className: "bmg"
  }, /*#__PURE__*/React.createElement("span", {
    className: "bmk"
  }, "Target odds"), /*#__PURE__*/React.createElement("div", {
    className: "bmsg"
  }, [10, 25, 50, 100].map(t => /*#__PURE__*/React.createElement("button", {
    key: t,
    className: target === t ? "on" : "",
    onClick: () => setTarget(t)
  }, "\xD7", t)))), /*#__PURE__*/React.createElement("div", {
    className: "bmg"
  }, /*#__PURE__*/React.createElement("span", {
    className: "bmk"
  }, "Selections"), /*#__PURE__*/React.createElement("div", {
    className: "bmstep"
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => setN(Math.max(2, n - 1)),
    disabled: n <= 2,
    "aria-label": "Fewer selections"
  }, /*#__PURE__*/React.createElement(Ic, {
    name: "Minus",
    size: 16
  })), /*#__PURE__*/React.createElement("input", {
    inputMode: "numeric",
    value: n,
    "aria-label": "Number of selections",
    onChange: e => setN(Math.min(60, +e.target.value.replace(/\D/g, "") || 0)),
    onBlur: e => {
      if ((+e.target.value.replace(/\D/g, "") || 0) < 2) setN(2);
    }
  }), /*#__PURE__*/React.createElement("button", {
    onClick: () => setN(Math.min(60, n + 1)),
    disabled: n >= 60,
    "aria-label": "More selections"
  }, /*#__PURE__*/React.createElement(Ic, {
    name: "Plus",
    size: 16
  })))), /*#__PURE__*/React.createElement("button", {
    className: "bmgo" + (busy ? " is-busy" : ""),
    onClick: run,
    disabled: busy
  }, /*#__PURE__*/React.createElement(Ic, {
    name: busy ? "RotateCw" : "Sparkles",
    size: 17
  }), busy ? "Generating Selections…" : "Generate Selections")));
}

/* ══ Direct B · odds field + amount to win ══════════════════════ */
function OddsSlider({
  value,
  onChange,
  min = 2,
  max = 1000
}) {
  const [txt, setTxt] = useState("");
  const commit = s => {
    const n = Math.round(parseFloat(s));
    if (isNaN(n)) {
      setTxt("");
      onChange(null);
      return;
    }
    const c = Math.min(max, Math.max(min, n));
    setTxt(c.toFixed(2));
    onChange(c);
  };
  return /*#__PURE__*/React.createElement("div", {
    className: "bmslider"
  }, /*#__PURE__*/React.createElement("input", {
    className: "bmslider__in",
    type: "number",
    inputMode: "decimal",
    min: min,
    max: max,
    step: 1,
    "aria-label": "Total odds",
    placeholder: "Enter odds",
    value: txt,
    onChange: e => {
      const s = e.target.value.replace(/[^\d.]/g, "");
      setTxt(s);
      const n = parseFloat(s);
      onChange(isNaN(n) ? null : n);
    },
    onBlur: e => commit(e.target.value),
    onKeyDown: e => {
      if (e.key === "Enter") e.currentTarget.blur();
    }
  }));
}
function OptSlider() {
  const app = window.useApp();
  const [target, setTarget] = useState(null);
  const win = 1000;
  const [seed, setSeed] = useState(4);
  const [busy, setBusy] = useState(false);
  const next = useMemo(() => {
    if (!target || target < 2) return [];
    const sd = seed + 1;
    const base = Math.round(Math.log(target) / Math.log(1.55));
    let best = null,
      bestErr = Infinity;
    for (const d of [0, -1, 1, -2, 2]) {
      const n = Math.min(60, Math.max(2, base + d));
      const legs = refine(build(n, target, sd * 13 + d * 7), target, sd + d);
      const err = Math.abs(prod(legs) / target - 1);
      if (err < bestErr) {
        bestErr = err;
        best = legs;
      }
      if (err < 0.01) break;
    }
    return best || [];
  }, [target, seed]);
  const oddsSum = next.reduce((x, l) => x + l.odds, 0);
  const stake = Math.max(1, Math.round(win / oddsSum));
  const run = () => {
    if (busy || !target) return;
    setBusy(true);
    setTimeout(() => {
      app.addSingles("betmaker", next, stake);
      setSeed(v => v + 1);
      setBusy(false);
      app.openBetslip();
    }, 1150);
  };
  return /*#__PURE__*/React.createElement("div", {
    className: "bm sec bm--card"
  }, /*#__PURE__*/React.createElement(Hd, {
    icon: false,
    name: "BetMaker",
    subTx: /*#__PURE__*/React.createElement(React.Fragment, null, "Based on ", /*#__PURE__*/React.createElement("b", null, "users popular bets")),
    tip: "BetMaker takes popular selections that betPawa users are betting on and builds a betslip that matches the total odds you enter. You can regenerate as many times as you want."
  }), /*#__PURE__*/React.createElement("div", {
    className: "bmctl bmctl--row"
  }, /*#__PURE__*/React.createElement(OddsSlider, {
    value: target,
    onChange: setTarget
  }), /*#__PURE__*/React.createElement("button", {
    className: "bmgo" + (busy ? " is-busy" : ""),
    onClick: run,
    disabled: busy || !target
  }, /*#__PURE__*/React.createElement(Ic, {
    name: busy ? "RotateCw" : "Sparkles",
    size: 17
  }), busy ? "Generating Betslip…" : "Generate Betslip")));
}
Promise.resolve(window.__spriteReady).then(() => {
  const el = document.getElementById("app");
  if (el) ReactDOM.createRoot(el).render(/*#__PURE__*/React.createElement(Frame, null, /*#__PURE__*/React.createElement(OptSlider, null)));
});