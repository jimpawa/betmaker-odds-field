/* ══════════════════════════════════════════════════════════════════════
 * betPawa SSOT — shared component layer (React).
 * These render the canonical pawabloX classes from components.css / ssot.css.
 * Edit a component here (or its class there) → it updates on every screen.
 * Exposed on window for the screen + app scripts.
 * ══════════════════════════════════════════════════════════════════════ */
const { useState, useEffect, useRef, useContext, createContext } = React;

/* App-wide context: navigation, theme, auth, betslip, toasts */
const AppCtx = createContext(null);
const useApp = () => useContext(AppCtx);

/* ── Icon — official pawaIconZ sprite (inlined into the document) ── */
function Icon({ name, size, cls, style }) {
  const s = size || 24;
  return (
    <svg className={"p-icon" + (cls ? " " + cls : "")} width={s} height={s}
    style={{ fontSize: s + "px", ...style }} aria-hidden="true"><use href={"#pIcon-" + name} /></svg>);

}

/* ── Flag — simplified circular country flag (stripes) or code monogram ── */
function Flag({ code, size }) {
  const s = size || 24;
  const spec = window.BP.F[code] || { m: code, bg: "#7A8185", fg: "#fff" };
  let inner;
  if (spec.euro) {
    const stars = Array.from({ length: 12 }, (_, i) => {
      const a = (i * 30 - 90) * Math.PI / 180;
      return [12 + 7 * Math.cos(a), 12 + 7 * Math.sin(a)];
    });
    const star = (cx, cy) => {
      let d = "";
      for (let k = 0; k < 5; k++) {
        const a = (k * 72 - 90) * Math.PI / 180;
        d += (k ? "L" : "M") + (cx + 1.15 * Math.cos(a)) + " " + (cy + 1.15 * Math.sin(a));
      }
      return d + "Z";
    };
    inner =
    <svg viewBox="0 0 24 24" width={s} height={s}>
        <rect width="24" height="24" fill="#003399" />
        {stars.map(([cx, cy], i) => <path key={i} d={star(cx, cy)} fill="#FFCC00" />)}
      </svg>;

  } else if (spec.v || spec.h) {
    const horiz = !!spec.h;
    const cols = spec.v || spec.h;
    const w = spec.w || cols.map(() => 1);
    const tot = w.reduce((a, b) => a + b, 0);
    let pos = 0;
    inner =
    <svg viewBox="0 0 24 24" width={s} height={s}>
        {cols.map((c, i) => {
        const len = w[i] / tot * 24,x = pos;pos += len;
        return horiz ?
        <rect key={i} x="0" y={x} width="24" height={len + 0.5} fill={c} /> :
        <rect key={i} x={x} y="0" width={len + 0.5} height="24" fill={c} />;
      })}
      </svg>;

  } else {
    inner =
    <svg viewBox="0 0 24 24" width={s} height={s}>
        <rect width="24" height="24" fill={spec.bg} />
        <text x="12" y="12" dominantBaseline="central" textAnchor="middle"
      fontFamily="Roboto" fontWeight="700" fontSize={spec.m.length > 2 ? 7.5 : 9}
      fill={spec.fg}>{spec.m}</text>
      </svg>;

  }
  return <span className="flagdot" style={{ width: s, height: s, borderRadius: "50%", overflow: "hidden", display: "inline-flex", flex: "none" }}>{inner}</span>;
}

/* ── betPawa wordmark ── */
function Logo() {
  return (
    <svg viewBox="0 0 250 44" xmlns="http://www.w3.org/2000/svg">
      <path d="M118.479 0.205976H97.1876L89.4724 42.7891H102.51L104.783 28.9137H117.283C131.876 28.9137 132.534 15.0383 132.534 15.0383C133.969 -0.033254 118.479 0.205976 118.479 0.205976ZM120.273 13.902C120.094 18.8062 113.455 18.7464 113.455 18.7464H106.458L107.953 10.1939H115.608C120.513 10.2537 120.273 13.902 120.273 13.902Z" fill="#9CE800" />
      <path className="logo-ink" d="M27.9302 10.0144C27.9302 10.0144 21.1719 9.83499 17.7629 13.7823L20.2748 0.205933H7.47596L0 42.0713H12.5596L13.0381 38.3633C13.0381 38.3633 16.9256 43.0881 22.7269 42.7292C22.7269 42.7292 38.7554 42.9685 38.8152 22.6936C38.7554 22.7535 39.5329 9.95461 27.9302 10.0144ZM26.136 26.2821C25.8369 31.0069 22.6671 33.459 19.6767 33.459C16.6863 33.459 14.6529 30.8275 15.1912 26.641C15.7294 22.0956 18.7198 18.866 22.069 19.1052C27.2723 19.4042 26.136 26.2821 26.136 26.2821Z" />
      <path className="logo-ink" d="M70.2142 20.3013C70.2142 29.2725 57.2957 30.5285 49.5805 30.4686C49.6522 30.8995 49.7726 31.3209 49.9394 31.7246C50.7767 33.3394 52.87 33.8777 54.5446 33.9375C56.7706 33.9837 58.9845 33.5978 61.0636 32.8011C62.1354 32.3636 63.1419 31.7799 64.054 31.0667L67.7023 37.1073C67.8219 37.2867 65.1903 39.0211 65.0707 39.1408C62.9733 40.456 60.6677 41.4064 58.2526 41.9517C53.5876 43.0283 48.0255 43.2675 43.54 41.2938C42.0372 40.6253 40.7036 39.628 39.6374 38.3756C38.5713 37.1231 37.7998 35.6473 37.3798 34.0571C36.8766 32.1652 36.6351 30.2133 36.6621 28.2558C36.6621 19.2846 43.0017 10.6125 56.4584 10.6125C64.7119 10.6723 70.2142 13.7823 70.2142 20.3013ZM55.7407 17.909C51.7934 17.909 49.2217 20.9592 48.9825 25.2056C53.2288 25.0261 58.8507 23.4711 58.8507 20.421C58.7909 18.866 57.6546 17.909 55.7407 17.909Z" />
      <path className="logo-ink" d="M87.379 0.205933H76.9724L75.0586 10.7321H70.2142L68.5994 19.1052H73.5036L71.5299 33.8179C71.5299 33.8179 70.3936 42.6694 79.1255 42.789C87.8574 42.9086 92.4028 38.0044 92.4028 38.0044L88.4555 31.3658C88.4555 31.3658 83.0728 33.2796 83.1924 29.8706C83.3121 26.4615 84.5082 19.1052 84.5082 19.1052L91.6253 19.0454L93.1205 10.6125H85.4651L87.379 0.205933Z" />
      <path d="M178.765 11.0909H165.727L170.153 42.789H181.397L189.77 26.94L191.385 42.789H202.748L218.597 11.0909H204.841L198.98 27.8969L197.066 11.0909H187.437L179.662 28.6146L178.765 11.0909Z" fill="#9CE800" />
      <path d="M154.782 11.091L154.244 14.0216C151.232 11.7229 147.566 10.4448 143.778 10.3733C137.677 10.3733 128.407 15.3373 128.467 29.5118C128.467 37.1671 131.517 43.3273 140.847 42.8489C140.847 42.8489 145.871 42.9087 149.4 39.6193L148.802 42.7293H160.763L166.744 11.091H154.782ZM145.632 33.16C142.701 33.3394 140.608 30.8275 140.369 28.0764C140.07 24.2487 143.18 19.8827 147.187 19.5837C148.227 19.4722 149.279 19.6093 150.257 19.9835C151.234 20.3579 152.109 20.9587 152.809 21.7368L151.134 30.7079C149.617 32.1051 147.685 32.9665 145.632 33.16Z" fill="#9CE800" />
      <path d="M237.855 11.091L237.317 14.0216C234.305 11.7229 230.639 10.4448 226.85 10.3733C220.75 10.3733 211.48 15.3373 211.54 29.5118C211.54 37.1671 214.59 43.3273 223.92 42.8489C223.92 42.8489 228.944 42.9087 232.472 39.6193L231.874 42.7293H243.836L249.817 11.091H237.855ZM228.705 33.16C225.774 33.3394 223.681 30.8275 223.441 28.0764C223.142 24.2487 226.252 19.8827 230.26 19.5837C231.3 19.4722 232.352 19.6093 233.329 19.9835C234.307 20.3579 235.182 20.9587 235.881 21.7368L234.207 30.7079C232.685 32.0963 230.755 32.9563 228.705 33.16Z" fill="#9CE800" />
    </svg>);

}

/* ── Header (logged-in shows balance + deposit; logged-out shows Login / Join) ── */
function Header() {
  const app = useApp();
  const [srch, setSrch] = useState(false);
  const [q, setQ] = useState("");
  const submit = () => { const v = q.trim(); setSrch(false); app.nav("search", v ? { q: v } : undefined); };
  return (
    <>
    <div className="hdr">
      <span className="logo" onClick={() => app.nav("home")} style={{ cursor: "pointer" }}><Logo /></span>
      <div className="grow"></div>
      <button className={"ico-btn" + (srch ? " on" : "")} aria-label="Search" onClick={() => setSrch((v) => !v)}><Icon name="Search" size={20} /></button>
      {app.loggedIn ?
      <>
          <div className="hdr__dep" onClick={() => app.openDeposit()} style={{ cursor: "pointer" }}>
            <Icon name="Eye" cls="eye" />
            <span className="bal">{window.BP.money(app.balance, 2)}</span>
            <Icon name="ChevronDown" cls="chev" />
            <button className="plus" aria-label="Deposit" onClick={(e) => {e.stopPropagation();app.openDeposit();}}><Icon name="Plus" /></button>
          </div>
          <button className="acct" aria-label="Account" onClick={() => app.openAccount()}><Icon name="Account" /></button>
        </> :

      <>
          <button className="btn-login" onClick={() => app.nav("login")}>Login</button>
          <button className="btn-join" onClick={() => app.nav("login", { tab: "register" })}>Join Now</button>
        </>
      }
    </div>
    {srch ?
    <div className="hsearch">
      <div className="hsearch__box">
        <input autoFocus placeholder="Team or league..." value={q} onChange={(e) => setQ(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") submit(); }} />
        {q ? <button className="hsearch__x" aria-label="Clear" onClick={() => setQ("")}><Icon name="X" size={16} /></button> : null}
      </div>
      <button className="hsearch__btn" onClick={submit}>SEARCH</button>
    </div> : null}
    </>);

}

/* ── Top tab nav ── */
const TOP_TABS = [
{ id: "home", label: "Home", icon: "Home" },
{ id: "sports", label: "Sports", icon: "FootballBall" },
{ id: "live", label: "Live", icon: "Activity" },
{ id: "casino", label: "Casino", icon: "Gem" }];

function TopNav({ active }) {
  const app = useApp();
  return (
    <div className="topnav">
      <div className="scrollrow">
        {TOP_TABS.map((t) =>
        <button key={t.id} className={"t" + (active === t.id ? " on" : "")}
        onClick={() => app.nav(t.id === "live" ? "sports" : t.id, t.id === "live" ? { tab: "live" } : undefined)}>
            <Icon name={t.icon} size={20} />{t.id === "home" ? null : t.label}
          </button>
        )}
      </div>
      <button className="more" aria-label="More"><Icon name="ChevronDown" size={18} /></button>
    </div>);

}

/* ── Bottom nav ── */
function BottomNav({ active }) {
  const app = useApp();
  const items = [
  { id: "menu", label: "Menu", icon: "Menu", act: () => app.openMenu() },
  { id: "sports", label: "Sports", icon: "FootballBall", act: () => app.nav("sports") },
  { id: "betslip", label: "Betslip", icon: "Betslip", act: () => app.openBetslip(), ct: app.betslip.length },
  { id: "mybets", label: "My Bets", icon: "MyBets", act: () => app.nav("mybets") },
  { id: "account", label: "Account", icon: "Account", act: () => app.openAccount() }];

  return (
    <div className="botnav">
      {items.map((b) =>
      <button key={b.id} className={"b" + (active === b.id ? " on" : "")} onClick={b.act}>
          {b.ct ? <span className="ct">{b.ct}</span> : null}
          <Icon name={b.icon} size={26} />
          <span className="lab">{b.label}</span>
        </button>
      )}
    </div>);

}

/* ── Sub-page header ── */
function SubHeader({ title, sub, onBack, action }) {
  const app = useApp();
  return (
    <div className="subhead">
      <button className="subhead__back" onClick={onBack || app.back}><Icon name="ChevronLeft" size={22} /></button>
      <div className="subhead__t">{title}{sub ? <span className="sub">{sub}</span> : null}</div>
      {action || <span style={{ width: 40 }}></span>}
    </div>);

}

/* ── Bet button (single 1X2 / outcome cell on a match card) ── */
function BetButton({ sel, od, mv, active, onClick }) {
  const mvCls = mv === "up" ? " pBet--up" : mv === "down" ? " pBet--down" : mv === "flame" ? " pBet--flame" : "";
  const icon = mv === "flame" ? "FlameFilled" : "TrendingUp";
  return (
    <button className={"pBet" + mvCls} onClick={onClick}
    style={active ? { background: "var(--bet-active-bg)", borderColor: "var(--bet-active-border)", color: "var(--bet-active-text)" } : null}>
      <span className="pBet__sel">{sel}</span>
      <span className="pBet__odds">{mv && mv !== "none" ? <Icon name={icon} size={16} cls="pBet__odds-icon" /> : null}{od.toFixed(2)}</span>
    </button>);

}

/* ── Match card (canonical MatchcardDefault) ── */
function MatchCard({ m, extra }) {
  const app = useApp();
  const matchLabel = m.teams[0].name + " v " + m.teams[1].name;
  const twoWay = m.cols2;
  const sels = twoWay ? ["1", "2"] : ["1", "X", "2"];
  const open = () => app.nav("event", { id: m.id, match: m });
  const betline = (mktLabel, oddsMul, showLabel) =>
    <div className="pSC__mktblock" key={mktLabel}>
      {showLabel ? <div className="pSC__mkthd"><span>{mktLabel} | Full Time</span><Icon name="CirlceInfo" cls="pSC__mktinfo" /></div> : null}
      <div className="pSC__betline">
        {sels.map((s) => {
          const oi = twoWay ? s === "1" ? 0 : 2 : s === "1" ? 0 : s === "X" ? 1 : 2;
          const key = m.id + "|" + mktLabel + "|" + s;
          const mv = !oddsMul && m.mv && (m.mv[0] === "flameX" ? s === "X" ? "flame" : null : m.mv[oi]);
          const od = +(m.odds[oi] * (oddsMul || 1)).toFixed(2);
          return <BetButton key={s} sel={s} od={od} mv={mv} active={app.isSel(key)}
          onClick={() => app.toggleSel({ key, matchId: m.id, matchLabel, comp: m.comp, mkt: mktLabel + " | Full Time", sel: s === "1" ? m.teams[0].name : s === "2" ? m.teams[1].name : "Draw", od })} />;
        })}
        <button className="pBet pBet--more" onClick={open}><Icon name="ChevronRight" cls="pBet__chev" /></button>
      </div>
    </div>;
  return (
    <article className="pSC" style={{ border: "1px solid var(--line)" }}>
      <div className="pSC__top">
        {m.status === "live" ?
        <span className="pSC__live"><Icon name="Activity" cls="pulse" /><span className="min">{m.min}</span></span> :
        <div className="pSC__date"><span className="pSC__time">{m.time}</span><span className="pSC__day">{m.day}</span></div>}
        <div className="pSC__tags">
          <button className="pSC__stat" onClick={open} style={{ border: 0, background: "transparent", padding: 0, cursor: "pointer" }}><Icon name="BarChart" /></button>
        </div>
      </div>
      <div className="pSC__teams" onClick={open} style={{ cursor: "pointer" }}>
        {m.teams.map((t, i) =>
        <div className="pSC__team-row" key={i}>
            <span className="pSC__team">{t.name}</span>
            {m.score ? <span className="pSC__score">{m.score[i]}</span> : null}
          </div>
        )}
      </div>
      <div className="pSC__cat" onClick={open} style={{ cursor: "pointer" }}>{m.crumb}</div>
      {extra && !twoWay ?
      <>{betline("1X2", 0, true)}{betline("1X2 1UP", 0.9, true)}{betline("1X2 2UP", 0.98, true)}</> :
      betline(twoWay ? "Winner" : "1X2")}
    </article>);

}

/* ── Section header ── */
function SectionHeader({ icon, title, count, onMore }) {
  return (
    <div className="sec__hd">
      <Icon name={icon} cls="ico" size={22} />
      <h3>{title}</h3>
      {count != null ? <button className="sec__count" onClick={onMore}>{count}<Icon name="ChevronRight" /></button> : null}
    </div>);

}

/* ── Match Combo — single reusable DS component (figma 31863:40083, Combos_hompage/Combo_2).
   Used everywhere combos appear: Homepage "Popular Combos" + Event "Match Combos".
   280w card · time+date + No-Cashout pill · teams · breadcrumb · connected legs
   (dark dot + connector line, bold pick + muted market, optional 2-up badge) ·
   full-width combined-odds button. ── */
function ComboCard({ c, eventId }) {
  const app = useApp();
  const open = () => {
    const BP = window.BP;
    const pool = BP.featured.concat(BP.boosted, BP.live);
    const m = pool.find((x) => x.teams[0].name === c.title1 && x.teams[1].name === c.title2)
      || pool.find((x) => x.teams[0].name === c.title1);
    if (m) app.nav("event", { id: m.id, match: m });
    else app.nav("sports");
  };
  const matchLabel = c.title1 + " v " + c.title2;
  const key = "combo|" + c.id;
  const addCombo = () => app.toggleSel({ key, matchId: eventId || c.id, matchLabel, comp: c.crumb, mkt: "Combo · " + c.legs.length + " picks", sel: c.legs.map((l) => l[0]).join(" & "), od: c.odds,
    selections: c.legs.map((l) => ({ sel: l[0], mkt: l[1], matchLabel, od: 1, comp: c.crumb })) });
  return (
    <article className="combo">
      <div className="top">
        <span className="when"><span className="tm">{c.time}</span><span className="dt">{c.day}</span></span>
        {c.nocash ? <span className="nocash">No In-Play Cashout</span> : null}
      </div>
      <div className="teams" onClick={open} style={{ cursor: "pointer" }}>
        <div className="t">{c.title1}</div><div className="t">{c.title2}</div>
      </div>
      <div className="crumb" onClick={open} style={{ cursor: "pointer" }}>{c.crumb}</div>
      <div className="legs" onClick={open} style={{ cursor: "pointer" }}>
        {c.legs.map((l, i) =>
        <div className="leg" key={i}>
            <span className="dot"></span>
            <span className="pick">{l[0]}</span>
            <span className="sub">{l[1]}</span>
            {l[2] === "2up" ? <span className="twoup">2</span> : null}
          </div>
        )}
      </div>
      <button className={"odds" + (app.isSel(key) ? " on" : "")} onClick={addCombo}>{app.isSel(key) ? <><Icon name="Check" size={16} />Added · {c.odds.toFixed(2)}</> : c.odds.toFixed(2)}</button>
    </article>);

}

const HomeComboCard = ComboCard;

/* ── Bottom sheet shell (mount → rAF → animate, so the entrance reliably fires) ── */
function Sheet({ open, onClose, title, children, footer, full, cls, logo, headAction }) {
  const [render, setRender] = useState(open);
  const [vis, setVis] = useState(false);
  useEffect(() => {
    let t;
    if (open) {
      setRender(true);
      t = setTimeout(() => setVis(true), 30);
    } else {
      setVis(false);
      t = setTimeout(() => setRender(false), 360);
    }
    return () => clearTimeout(t);
  }, [open]);
  if (!render) return null;
  return (
    <>
      <div className={"backdrop" + (vis ? " show" : "")} onClick={onClose}></div>
      <div className={"sheet" + (full ? " sheet--full" : "") + (cls ? " " + cls : "") + (vis ? " show" : "")}>
        {!full ? <div className="sheet__grab"></div> : null}
        {title ? <div className="sheet__head"><span className="t">{title}</span>{headAction}<button className="x" onClick={onClose}><Icon name="X" /></button></div> : null}
        {logo ? <div className="sheet__head sheet__head--logo"><span className="sheet__logo"><Logo /></span><button className="x" onClick={onClose}><Icon name="X" /></button></div> : null}
        <div className="sheet__body">{children}</div>
        {footer}
      </div>
    </>);

}

/* ── Promo bar — dynamic: shows combined odds + win bonus when the betslip
   has selections, else the static win-bonus teaser. ── */
function PromoBar() {
  const app = useApp();
  const money = window.BP.money;
  const sels = app.betslip;
  if (sels.length) {
    const odds = sels.reduce((a, s) => a * s.od, 1);
    const pct = sels.length >= 3 ? Math.min(0.1 + (sels.length - 3) * 0.05, 1.0) : 0;
    const bonus = odds * pct;
    return (
      <div className="promo promo--live">
        <span>Odds: <b>{odds.toFixed(2)}</b></span>
        <span>Win Bonus: <b>{money(bonus)}</b></span>
      </div>);
  }
  return <div className="promo">Add legs for up to a <b>1250% Win Bonus.</b></div>;
}

Object.assign(window, { AppCtx, useApp, Icon, Flag, Logo, Header, TopNav, BottomNav, SubHeader, BetButton, MatchCard, SectionHeader, ComboCard, HomeComboCard, PromoBar, Sheet, TOP_TABS });