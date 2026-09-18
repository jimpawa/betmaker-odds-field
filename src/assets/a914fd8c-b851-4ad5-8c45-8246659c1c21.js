/* ══════════════════════════════════════════════════════════════════════
 * betPawa SSOT — content data (window.BP)
 * Real fixtures: FIFA World Cup 2026 (kicks off 11 Jun 2026, USA/CAN/MEX).
 * Market context: Nigeria (₦ / NGN). Today in-prototype = Mon 08 Jun 2026.
 * ══════════════════════════════════════════════════════════════════════ */
(function () {
  const CUR = "₦";
  const money = (n, dp) => CUR + " " + Number(n).toLocaleString("en-NG", {
    minimumFractionDigits: dp == null ? 2 : dp, maximumFractionDigits: dp == null ? 2 : dp });

  /* ── Simplified circular flags. Stripe specs render cleanly; complex flags
     fall back to a tidy country-code monogram (betPawa country-circle style). ── */
  const F = {
    MEX:{v:["#006847","#fff","#CE1126"]}, PAR:{h:["#D52B1E","#fff","#0038A8"]},
    GER:{h:["#000","#DD0000","#FFCE00"]}, ECU:{h:["#FFD100","#0072CE","#EF3340"],w:[2,1,1]},
    CIV:{v:["#FF8200","#fff","#009A44"]}, ESP:{h:["#AA151B","#F1BF00","#AA151B"],w:[1,2,1]},
    ARG:{h:["#6CACE4","#fff","#6CACE4"]}, AUT:{h:["#ED2939","#fff","#ED2939"]},
    POR:{v:["#006600","#FF0000"],w:[2,3]}, COL:{h:["#FCD116","#003893","#CE1126"],w:[2,1,1]},
    NED:{h:["#AE1C28","#fff","#21468B"]}, BEL:{v:["#000","#FAE042","#ED2939"]},
    EGY:{h:["#CE1126","#fff","#000"]}, IRN:{h:["#239F40","#fff","#DA0000"]},
    FRA:{v:["#0055A4","#fff","#EF4135"]}, SEN:{v:["#00853F","#FDEF42","#E31B23"]},
    IRQ:{h:["#CE1126","#fff","#000"]}, GHA:{h:["#CE1126","#FCD116","#006B3F"]},
    CRO:{h:["#FF0000","#fff","#171796"]}, PER:{v:["#D91023","#fff","#D91023"]},
    NGA:{v:["#008751","#fff","#008751"]}, EUR:{euro:true},
    CHI:{h:["#fff","#D52B1E"]}, URU:{h:["#fff","#0038A8","#fff","#0038A8","#fff"]},
    JPN:{m:"JPN",bg:"#BC002D",fg:"#fff"}, KOR:{m:"KOR",bg:"#fff",fg:"#0047A0"},
    RSA:{m:"RSA",bg:"#007749",fg:"#fff"}, CZE:{m:"CZE",bg:"#11457E",fg:"#fff"},
    CAN:{m:"CAN",bg:"#FF0000",fg:"#fff"}, BIH:{m:"BIH",bg:"#002395",fg:"#FECB00"},
    USA:{m:"USA",bg:"#3C3B6E",fg:"#fff"}, QAT:{m:"QAT",bg:"#8A1538",fg:"#fff"},
    SUI:{m:"SUI",bg:"#D52B1E",fg:"#fff"}, AUS:{m:"AUS",bg:"#00008B",fg:"#fff"},
    TUR:{m:"TUR",bg:"#E30A17",fg:"#fff"}, CUW:{m:"CUW",bg:"#002B7F",fg:"#F9E814"},
    CPV:{m:"CPV",bg:"#003893",fg:"#fff"}, ALG:{m:"ALG",bg:"#006233",fg:"#fff"},
    JOR:{m:"JOR",bg:"#000",fg:"#CE1126"}, COD:{m:"COD",bg:"#007FFF",fg:"#F7D618"},
    UZB:{m:"UZB",bg:"#1EB53A",fg:"#fff"}, BRA:{m:"BRA",bg:"#009C3B",fg:"#FFDF00"},
    SCO:{m:"SCO",bg:"#0065BF",fg:"#fff"}, MAR:{m:"MAR",bg:"#C1272D",fg:"#006233"},
    HAI:{m:"HAI",bg:"#00209F",fg:"#D21034"}, SWE:{m:"SWE",bg:"#006AA7",fg:"#FECC00"},
    NZL:{m:"NZL",bg:"#00247D",fg:"#fff"}, NOR:{m:"NOR",bg:"#BA0C2F",fg:"#fff"},
    ENG:{m:"ENG",bg:"#fff",fg:"#CE1124"}, PAN:{m:"PAN",bg:"#005293",fg:"#D21034"},
    ITA:{v:["#009246","#fff","#CE2B37"]},
    BRT:{m:"BR",bg:"#1F8A5B",fg:"#fff"}, MTN:{m:"M",bg:"#FFCB05",fg:"#003"},
    SAM:{m:"SA",bg:"#1F8A5B",fg:"#fff"},
  };

  /* World Cup matches (real pairings & venues from the Dec-2025 final draw) */
  const WC = (id, t1, c1, t2, c2, group, day, time, venue, feat) =>
    ({ id, comp:"World Cup 2026", crumb:"Football / FIFA World Cup 2026 / Group "+group, group,
       day, time, venue, teams:[{name:t1,code:c1},{name:t2,code:c2}], status:"pre", feat:!!feat });

  const featured = [
    WC("wc-open","Mexico","MEX","South Africa","RSA","A","Thu 11 Jun","23:00","Estadio Azteca · Mexico City", true),
    WC("wc-arg","Argentina","ARG","Algeria","ALG","J","Tue 16 Jun","20:00","Arrowhead Stadium · Kansas City"),
    WC("wc-eng","England","ENG","Ghana","GHA","L","Sat 13 Jun","21:00","Gillette Stadium · Foxborough"),
    WC("wc-fra","France","FRA","Senegal","SEN","I","Mon 15 Jun","20:00","MetLife Stadium · New Jersey"),
    WC("wc-bra","Brazil","BRA","Haiti","HAI","C","Sun 14 Jun","01:30","Lincoln Financial Field · Philadelphia"),
    WC("wc-por","Portugal","POR","DR Congo","COD","K","Wed 17 Jun","18:00","NRG Stadium · Houston"),
    WC("wc-ger","Germany","GER","Curaçao","CUW","E","Sun 14 Jun","22:00","NRG Stadium · Houston"),
    WC("wc-esp","Spain","ESP","Cape Verde","CPV","H","Mon 15 Jun","17:00","Mercedes-Benz Stadium · Atlanta"),
    WC("wc-usa","United States","USA","Paraguay","PAR","D","Fri 12 Jun","23:00","SoFi Stadium · Los Angeles"),
    WC("wc-ned","Netherlands","NED","Sweden","SWE","F","Sat 13 Jun","18:00","NRG Stadium · Houston"),
  ];
  // attach odds + market counts
  const ODDS = [
    {o:[1.62,3.80,5.50],mv:["up",null,null],mk:248},
    {o:[1.30,5.20,9.00],mv:[null,null,"down"],mk:262},
    {o:[1.46,4.40,6.75],mv:["up",null,null],mk:255},
    {o:[1.50,4.20,6.40],mv:[null,null,null],mk:251},
    {o:[1.12,7.50,17.0],mv:[null,null,"up"],mk:240},
    {o:[1.20,6.40,13.0],mv:["up",null,null],mk:244},
    {o:[1.18,6.80,14.5],mv:[null,null,null],mk:243},
    {o:[1.16,7.00,15.0],mv:[null,"down",null],mk:247},
    {o:[2.05,3.30,3.60],mv:[null,null,"up"],mk:259},
    {o:[1.95,3.40,3.85],mv:["up",null,null],mk:256},
  ];
  featured.forEach((m,i)=>{ const d=ODDS[i%ODDS.length]; m.odds=d.o; m.mv=d.mv; m.mk=d.mk; });

  /* Live now — summer-active leagues (real comps running in June) */
  const live = [
    { id:"lv-1", comp:"Brasileirão", crumb:"Football / Brazil / Série A", min:"67'",
      teams:[{name:"Flamengo",code:"BRT"},{name:"Palmeiras",code:"BRT"}], score:[1,1],
      status:"live", odds:[2.30,3.10,3.05], mv:["up",null,"down"], mk:128 },
    { id:"lv-2", comp:"MLS", crumb:"Football / USA / Major League Soccer", min:"32'",
      teams:[{name:"Inter Miami",code:"USA"},{name:"LA Galaxy",code:"USA"}], score:[2,0],
      status:"live", odds:[1.40,4.60,6.50], mv:[null,null,null], mk:142 },
    { id:"lv-3", comp:"Eliteserien", crumb:"Football / Norway / Eliteserien", min:"HT",
      teams:[{name:"Bodø/Glimt",code:"NOR"},{name:"Molde",code:"NOR"}], score:[0,0],
      status:"live", odds:[1.72,3.90,4.40], mv:["up",null,null], mk:96 },
  ];

  /* Boosted */
  const boosted = [
    { id:"bo-1", comp:"World Cup 2026", crumb:"Football / FIFA World Cup 2026 / Group J", day:"Tue 16 Jun", time:"20:00",
      teams:[{name:"Argentina",code:"ARG"},{name:"Algeria",code:"ALG"}], status:"pre",
      odds:[1.25,5.20,9.00], mv:["flameX"], boost:true, mk:262 },
    { id:"bo-2", comp:"World Cup 2026", crumb:"Football / FIFA World Cup 2026 / Group I", day:"Mon 15 Jun", time:"20:00",
      teams:[{name:"France",code:"FRA"},{name:"Senegal",code:"SEN"}], status:"pre",
      odds:[1.42,4.20,6.40], mv:["flameX"], boost:true, mk:251 },
  ];

  /* Other sports — real fixtures from the live betpawa.ng homepage */
  const efootball = [
    { id:"ef-1", comp:"eFootball", crumb:"eFootball / International / GT Leagues", day:"Wed 15 Jul", time:"9:15 pm",
      teams:[{name:"France (William)",code:"FRA"},{name:"Senegal (Sarafi)",code:"SEN"}], status:"pre", odds:[2.25,3.65,2.30], mk:38 },
    { id:"ef-2", comp:"eFootball", crumb:"eFootball / International / GT Leagues", day:"Wed 15 Jul", time:"9:15 pm",
      teams:[{name:"Netherlands (Snail)",code:"NED"},{name:"Paraguay (Razvan)",code:"PAR"}], status:"pre", odds:[2.08,4.20,2.30], mk:34 },
    { id:"ef-3", comp:"eFootball", crumb:"eFootball / International / eAdriatic League", day:"Wed 15 Jul", time:"9:15 pm",
      teams:[{name:"FC Bayern (Bruno)",code:"GER"},{name:"FC Barcelona (Liam)",code:"ESP"}], status:"pre", odds:[2.50,4.60,1.88], mk:41 },
  ];
  const basketball = [
    { id:"bk-1", comp:"NBA Summer League", crumb:"Basketball / USA / NBA Summer League", day:"Wed 15 Jul", time:"10:30 pm",
      teams:[{name:"Cleveland Cavaliers",code:"USA"},{name:"New Orleans Pelicans",code:"USA"}], status:"pre", odds:[1.76,null,1.98], cols2:true, mk:64 },
    { id:"bk-2", comp:"NBA Summer League", crumb:"Basketball / USA / NBA Summer League", day:"Wed 15 Jul", time:"11:00 pm",
      teams:[{name:"Detroit Pistons",code:"USA"},{name:"Phoenix Suns",code:"USA"}], status:"pre", odds:[1.99,null,1.75], cols2:true, mk:58 },
    { id:"bk-3", comp:"NBA Summer League", crumb:"Basketball / USA / NBA Summer League", day:"Thu 16 Jul", time:"12:30 am",
      teams:[{name:"Charlotte Hornets",code:"USA"},{name:"Milwaukee Bucks",code:"USA"}], status:"pre", odds:[1.56,null,2.30], cols2:true, mk:61 },
  ];
  const tennis = [
    { id:"tn-1", comp:"ATP Challenger", crumb:"Tennis / Pozoblanco, Spain / Men Doubles", day:"Wed 15 Jul", time:"9:10 pm",
      teams:[{name:"Castelnuovo / Lock",code:"ITA"},{name:"Sanchez Q. / Winter L.",code:"ESP"}], status:"pre", odds:[2.10,null,1.68], cols2:true, mk:22 },
    { id:"tn-2", comp:"ATP Umag", crumb:"Tennis / Umag, Croatia / Men Doubles", day:"Wed 15 Jul", time:"9:15 pm",
      teams:[{name:"Gonzalez M. / Gonzalez S.",code:"ARG"},{name:"Burruchaga / Kestelboim",code:"ARG"}], status:"pre", odds:[1.43,null,2.65], cols2:true, mk:18 },
    { id:"tn-3", comp:"ATP Challenger", crumb:"Tennis / Pozoblanco, Spain / Men Doubles", day:"Wed 15 Jul", time:"9:20 pm",
      teams:[{name:"Callejon H. / Tobon M.",code:"ESP"},{name:"Lopez E. / Perez N.",code:"ESP"}], status:"pre", odds:[1.09,null,6.25], cols2:true, mk:15 },
  ];

  /* Combos */
  /* Popular Combos — real production snapshot (GET /api/sportsbook/v1/combo-cards/list) */
  const combos = [
    { id:"cb-1", time:"10:00 pm", day:"Sat 18/07", title1:"France", title2:"England",
      crumb:"Football / International / FIFA World Cup",
      legs:[["1X","Double Chance | Full Time"],["Yes","Both Teams To Score | Full Time"],["Under 3.5","Over/Under | Full Time"]], odds:4.58 },
    { id:"cb-2", time:"8:00 pm", day:"Sun 19/07", title1:"Spain", title2:"Argentina",
      crumb:"Football / International / FIFA World Cup",
      legs:[["1X","Double Chance | Full Time"],["No","Both Teams To Score | Full Time"],["Under 2.5","Over/Under | Full Time"]], odds:3.01, nocash:true },
    { id:"cb-3", time:"10:00 pm", day:"Sat 18/07", title1:"France", title2:"England",
      crumb:"Football / International / FIFA World Cup",
      legs:[["X2","Double Chance | Full Time"],["Yes","Both Teams To Score | Full Time"],["Over 2.5","Over/Under | Full Time"]], odds:3.52, nocash:true },
    { id:"cb-4", time:"8:00 pm", day:"Sun 19/07", title1:"Spain", title2:"Argentina",
      crumb:"Football / International / FIFA World Cup",
      legs:[["X2","Double Chance | Full Time"],["Yes","Both Teams To Score | Full Time"],["Over 2.5","Over/Under | Full Time"]], odds:5.02 },
    { id:"cb-5", time:"10:00 pm", day:"Sat 18/07", title1:"France", title2:"England",
      crumb:"Football / International / FIFA World Cup",
      legs:[["Yes","Both Teams To Score | Full Time"],["Over 2.5","Over/Under | Full Time"],["Kylian Mbappe","Player to Score or Assist"]], odds:2.64 },
    { id:"cb-6", time:"8:00 pm", day:"Sun 19/07", title1:"Spain", title2:"Argentina",
      crumb:"Football / International / FIFA World Cup",
      legs:[["X2","Double Chance | Full Time"],["Over 1.5","Over/Under | Full Time"],["Lionel Messi","Player to Score or Assist"]], odds:3.27, nocash:true },
    { id:"cb-7", time:"10:00 pm", day:"Sat 18/07", title1:"France", title2:"England",
      crumb:"Football / International / FIFA World Cup",
      legs:[["Over 1.5","Over/Under | Full Time"],["Over 1.5","Total Bookings O/U | Full Time"],["Over 7.5","Total Corners O/U | Full Time"]], odds:2.54 },
  ];

  const quickChips = [
    { icon:"Activity", label:"Live", n:"34", accent:true },
    { icon:"Trophy", label:"Outrights", n:"8" },
    { flag:"EUR", label:"UEFA Champions League", n:"104" },
    { flag:"EUR", label:"UEFA Europa League", n:"255" },
    { flag:"EUR", label:"UEFA Conference League", n:"262" },
    { flag:"FRA", label:"France v Senegal", n:"251" },
  ];

  /* Top competitions — real leagues from the live betpawa.ng homepage row */
  const topComps = [
    { id:"wc",  nm:"FIFA World Cup",        cc:"", ico:"Trophy",  n:"104" },
    { id:"ucl", nm:"UEFA Champions League", cc:"", ico:"Trophy",  n:"2" },
    { id:"uel", nm:"UEFA Europa League",    cc:"", ico:"Trophy",  n:"9" },
    { id:"uecl",nm:"UEFA Conference League",cc:"", ico:"Trophy",  n:"32" },
    { id:"epl", nm:"Premier League",        cc:"ENG", n:"10" },
    { id:"sea", nm:"Serie A",               cc:"ITA", n:"10" },
    { id:"bun", nm:"Bundesliga",            cc:"GER", n:"9" },
    { id:"lal", nm:"LaLiga",                cc:"ESP", n:"10" },
    { id:"l1",  nm:"Ligue 1",               cc:"FRA", n:"9" },
    { id:"lib", nm:"Copa Libertadores",     cc:"", ico:"Trophy",  n:"8" },
    { id:"sud", nm:"Copa Sudamericana",     cc:"", ico:"Trophy",  n:"8" },
  ];

  /* Casino */
  const casino = {
    jackpot: 184250600,
    providers: ["All games","Pragmatic Play","Spribe","Smartsoft","Evoplay","Hacksaw","Pjwin"],
    games: [
      { name:"Navigator", grad:"linear-gradient(150deg,#7C2D12,#2A0A0A)", img:"uploads/navigator-1000x1000 (1).jpg", tag:"Hot" },
      { name:"Aviator", grad:"linear-gradient(150deg,#CC371B,#7C2D12)", img:"uploads/Air Ace 200x200.jpg" },
      { name:"Fortune Chests", grad:"linear-gradient(150deg,#F59E0B,#B91C1C)", img:"uploads/FortuneChest.jpg" },
      { name:"JetX", grad:"linear-gradient(150deg,#0EA5E9,#1E3A8A)", img:"uploads/JetXNew.jpg" },
      { name:"Fortune Gems 500", grad:"linear-gradient(150deg,#F59E0B,#065F46)", img:"uploads/FortuneGems500F.jpg" },
      { name:"Wheel of Luck 2", grad:"linear-gradient(150deg,#7C3AED,#DB2777)", img:"uploads/Wheel of Luck 2 200x200.jpg", tag:"New" },
      { name:"Multi Hot 5", grad:"linear-gradient(150deg,#10B981,#065F46)", img:"uploads/smartsoft_MultiHot5_no39.jpg" },
      { name:"Game Art", grad:"linear-gradient(150deg,#334155,#0EA5E9)", img:"uploads/Game_art_120x120.png" },
      { name:"Mines", grad:"linear-gradient(150deg,#334155,#0EA5E9)", tag:"Exclusive" },
    ],
  };

  /* Deposit / withdraw methods (Nigeria) */
  const methods = [
    { id:"opay", nm:"OPay" }, { id:"palmpay", nm:"PalmPay" }, { id:"momo", nm:"MoniePoint" },
    { id:"bank", nm:"Bank Transfer" }, { id:"card", nm:"Card" }, { id:"ussd", nm:"USSD" },
  ];

  /* MyBets — pre-seeded settled + (open filled at runtime from placed bets) */
  const settledBets = [
    { id:"#9358710288", type:"Multi", legs:5, when:"2:10 pm, Sun 31 May", status:"won", bigwin:true,
      odds:124.00, stake:100, returns:12400, legsState:{won:5,lost:0,pending:0},
      selections:[
        { sel:"Manchester City", matchLabel:"Man City v Aston Villa", od:1.55, mkt:"1X2 | Full Time", comp:"Premier League", time:"5:30 pm, Sun 31 May" },
        { sel:"Over 2.5", matchLabel:"Liverpool v Chelsea", od:1.72, mkt:"Over/Under | Full Time", comp:"Premier League", time:"3:00 pm, Sun 31 May" },
        { sel:"Yes", matchLabel:"Arsenal v Tottenham", od:1.80, mkt:"Both Teams To Score | Full Time", comp:"Premier League", time:"1:00 pm, Sun 31 May" },
        { sel:"Real Madrid", matchLabel:"Real Madrid v Girona", od:1.40, mkt:"1X2 | Full Time", comp:"LaLiga", time:"8:00 pm, Sat 30 May" },
        { sel:"Inter", matchLabel:"Inter v Napoli", od:2.05, mkt:"Double Chance | Full Time", comp:"Serie A", time:"7:45 pm, Sat 30 May" }] },
    { id:"#9358690041", type:"Single", legs:1, when:"9:45 pm, Sat 30 May", status:"lost",
      pick:"Real Madrid", mkt:"1X2 | Full Time", odds:1.85, stake:200, returns:0, legsState:{won:0,lost:1,pending:0},
      selections:[{ sel:"Real Madrid", matchLabel:"Real Madrid v Barcelona", od:1.85, mkt:"1X2 | Full Time", comp:"LaLiga", time:"9:00 pm, Sat 30 May" }] },
    { id:"#9357120553", type:"Multi", legs:3, when:"6:20 pm, Fri 29 May", status:"cashout",
      odds:8.40, stake:50, returns:284, legsState:{won:2,lost:0,pending:1},
      selections:[
        { sel:"Bayern Munich", matchLabel:"Bayern v Dortmund", od:1.65, mkt:"1X2 | Full Time", comp:"Bundesliga", time:"6:30 pm, Fri 29 May" },
        { sel:"Over 1.5", matchLabel:"PSG v Marseille", od:1.30, mkt:"Over/Under | Full Time", comp:"Ligue 1", time:"8:00 pm, Fri 29 May" },
        { sel:"Juventus", matchLabel:"Juventus v Roma", od:3.90, mkt:"Double Chance | Full Time", comp:"Serie A", time:"7:45 pm, Fri 29 May" }] },
    { id:"#9356003117", type:"Single", legs:1, when:"4:00 pm, Wed 27 May", status:"void",
      pick:"Brentford", mkt:"Over 2.5 | Full Time", odds:2.10, stake:150, returns:150, legsState:{won:0,lost:0,pending:0},
      selections:[{ sel:"Over 2.5", matchLabel:"Brentford v Fulham", od:2.10, mkt:"Over/Under | Full Time", comp:"Premier League", time:"4:00 pm, Wed 27 May" }] },
  ];

  /* Markets for the single-event page (generated from a match's 1X2 odds) */
  function markets(m) {
    const [h, a] = m.teams.map(t => t.name);
    const [o1, ox, o2] = m.odds || [2.0, 3.3, 3.6];
    const j = (n) => +(n).toFixed(2);
    return [
      { key:"1x2", name:"1X2 — Full Time", pin:true, cols:3, outs:[
        { sel:"1", od:o1, mv:m.mv && m.mv[0] }, { sel:"X", od:ox, mv:m.mv && m.mv[1] }, { sel:"2", od:o2, mv:m.mv && m.mv[2] } ] },
      { key:"dc", name:"Double Chance", cols:3, outs:[
        { sel:"1X", od:j(1/(1/o1+1/ox)*0.92) }, { sel:"12", od:j(1/(1/o1+1/o2)*0.92) }, { sel:"X2", od:j(1/(1/ox+1/o2)*0.92) } ] },
      { key:"ou", name:"Over / Under — Total Goals", cols:2, outs:[
        { sel:"Over 1.5", od:1.30 }, { sel:"Under 1.5", od:3.40 },
        { sel:"Over 2.5", od:1.95 }, { sel:"Under 2.5", od:1.85 },
        { sel:"Over 3.5", od:3.60 }, { sel:"Under 3.5", od:1.28 } ] },
      { key:"btts", name:"Both Teams To Score", cols:2, outs:[
        { sel:"Yes", od:1.90 }, { sel:"No", od:1.88 } ] },
      { key:"dnb", name:"Draw No Bet", cols:2, outs:[
        { sel:h, od:j(o1*0.82) }, { sel:a, od:j(o2*0.82) } ] },
      { key:"ht", name:"Half Time Result", cols:3, outs:[
        { sel:"1", od:j(o1*1.6) }, { sel:"X", od:1.95 }, { sel:"2", od:j(o2*1.6) } ] },
    ];
  }

  function flagSvg(code, size) {
    return { code, spec: F[code] || { m: code.slice(0,3), bg:"#7A8185", fg:"#fff" }, size: size||24 };
  }

  window.BP = { CUR, money, F, flagSvg, featured, live, boosted, combos, quickChips, topComps,
    efootball, basketball, tennis, casino, methods, settledBets, markets, today:"Mon 08 Jun" };
})();
