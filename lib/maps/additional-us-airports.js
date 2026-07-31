const DEFAULT_OPERATOR_POOL = [1, 2, 3, 4, 5];

const waypoint = (x, y, type = 'intersection') => ({ x, y, class: type });

const angleDelta = (a, b) => Math.abs((((a - b) + 540) % 360) - 180);

const runway = (
  name1,
  name2,
  heading,
  length,
  x = 0,
  y = 0,
  width = 150
) => ({
  x,
  y,
  class: 'intersection',
  length,
  length1: length,
  length2: length,
  surface: 'asphalt',
  size: width,
  hdg1: heading,
  hdg2: (heading + 180) % 360,
  labelSpread1: 1.35,
  labelSpread2: 1.35,
  elevation1: 0,
  elevation2: 0,
  name1,
  name2
});

const edgePositions = [
  [50, 620], [60, 120], [1220, 610], [1215, 110],
  [350, 15], [930, 705], [20, 365], [1260, 365]
];

const hashName = name => name.split('').reduce(
  (hash, character) => ((hash * 31) + character.charCodeAt(0)) >>> 0,
  7
);

const terminalPosition = (name, index) => {
  const hash = hashName(name);
  const angle = ((hash % 360) + index * 47) * Math.PI / 180;
  const radiusX = 175 + (hash % 155);
  const radiusY = 115 + (hash % 105);
  return waypoint(
    640 + Math.cos(angle) * radiusX,
    360 + Math.sin(angle) * radiusY
  );
};

const routeIdentifiers = route => route.split('->').map(
  leg => leg.split('/')[0].split('@')[0]
);

const buildWaypoints = config => {
  const result = {};
  [...config.inboundWaypoints, ...config.outboundWaypoints].forEach(
    (name, index) => {
      const position = edgePositions[index % edgePositions.length];
      result[name] = waypoint(position[0], position[1]);
    }
  );

  const runwayNames = new Set(
    config.runways.reduce((names, item) => names.concat(item.name1, item.name2), [])
  );
  const routeFixes = Object.values(config.sids || {})
    .concat(Object.values(config.stars || {}))
    .reduce((fixes, route) => fixes.concat(routeIdentifiers(route)), [])
    .filter(name => !runwayNames.has(name));

  Array.from(new Set(routeFixes)).forEach((name, index) => {
    if (!result[name]) result[name] = terminalPosition(name, index);
  });
  return result;
};

const runwayNamesNear = (runways, heading) => {
  const ends = runways.reduce((result, item) => result.concat(
    { name: item.name1, heading: item.hdg1 },
    { name: item.name2, heading: item.hdg2 }
  ), []);
  const closest = Math.min(...ends.map(end => angleDelta(end.heading, heading)));
  return ends
    .filter(end => angleDelta(end.heading, heading) <= closest + 12)
    .map(end => end.name);
};

const buildRunwayUsage = runways => [
  { dir: 90, rwys: runwayNamesNear(runways, 135) },
  { dir: 180, rwys: runwayNamesNear(runways, 225) },
  { dir: 270, rwys: runwayNamesNear(runways, 315) },
  { dir: 360, rwys: runwayNamesNear(runways, 45) }
];

const createMap = config => ({
  id: config.id,
  name: config.name,
  ta: 18,
  ga: config.ga,
  commercial: config.commercial,
  weather: config.weather,
  inboundWaypoints: config.inboundWaypoints,
  outboundWaypoints: config.outboundWaypoints,
  waypoints: buildWaypoints(config),
  sids: config.sids || {},
  stars: config.stars || {},
  msa: {
    base: config.msa || [{ dir: 360, alt: 3000 }],
    polygons: []
  },
  airport: {
    blacklist: config.blacklist || [],
    operatorWhitelist: config.operatorWhitelist || DEFAULT_OPERATOR_POOL,
    elevation: config.elevation,
    rwyusage: buildRunwayUsage(config.runways),
    callsign: config.id.toUpperCase(),
    x: 0,
    y: 0,
    class: 'airport',
    runways: config.runways.map(item => Object.assign({}, item, {
      elevation1: config.elevation,
      elevation2: config.elevation
    }))
  }
});

const coastalWeather = centers => ({
  windDirectionCenters: centers,
  windDirectionVariation: 48,
  windSpeedRange: [4, 20],
  altimeterRange: [29.25, 30.55]
});

const inlandWeather = centers => ({
  windDirectionCenters: centers,
  windDirectionVariation: 55,
  windSpeedRange: [3, 18],
  altimeterRange: [29.2, 30.65]
});

const desertWeather = centers => ({
  windDirectionCenters: centers,
  windDirectionVariation: 65,
  windSpeedRange: [2, 22],
  altimeterRange: [29.45, 30.35]
});

const definitions = [
  {
    id: 'kfll', name: 'Fort Lauderdale-Hollywood International', elevation: 65,
    ga: .12, commercial: 1, weather: coastalWeather([95, 275]),
    operatorWhitelist: [1, 2, 3, 4, 5, 14],
    inboundWaypoints: ['OLAHS', 'BHHIA', 'JEREM', 'ANNEY'],
    outboundWaypoints: ['LIFRR', 'THNDR', 'DOLIE', 'GLADZ'],
    runways: [runway('10L', '28R', 95, 9000, 0, 24), runway('10R', '28L', 95, 8000, 0, -24)],
    sids: {
      LIFRR1: '10L->MAYNR->LIFRR', THNDR4: '10R->FOOOO->THNDR',
      DOLIE1: '28R->WORPP->DOLIE', GLADZ3: '28L->HITAG->GLADZ'
    },
    stars: {
      OLAHS3: 'OLAHS->WANAR/7000->FISEL/3000->10L',
      BHHIA3: 'BHHIA->CRNVL/7000->FISEL/3000->10R',
      JEREM2: 'JEREM->WORPP/7000->CRNVL/3000->28R',
      ANNEY4: 'ANNEY->HITAG/7000->WANAR/3000->28L'
    }
  },
  {
    id: 'kmia', name: 'Miami International', elevation: 9,
    ga: .08, commercial: 1, weather: coastalWeather([90, 270]),
    operatorWhitelist: [1, 2, 3, 5, 6, 9, 14, 15, 18, 19, 20, 22],
    inboundWaypoints: ['FLIPR', 'HILEY', 'SSCOT', 'ANNEY'],
    outboundWaypoints: ['GLADZ', 'HITAG', 'DOLIE', 'MNATE'],
    runways: [
      runway('08L', '26R', 87, 8600, 0, 42), runway('08R', '26L', 87, 10506, 0, 14),
      runway('09', '27', 92, 13016, 0, -22, 200), runway('12', '30', 123, 9360, 35, -5)
    ],
    sids: {
      GLADZ3: '08L->ROOOM->GLADZ', HITAG2: '08R->DEKKA->HITAG',
      DOLIE4: '27->WORPP->DOLIE', MNATE2: '30->BAGGS->MNATE'
    },
    stars: {
      FLIPR4: 'FLIPR->HILEY/9000->BAGGS/4000->08L',
      HILEY7: 'HILEY->ROOOM/8000->DEKKA/4000->09',
      SSCOT1: 'SSCOT->WORPP/9000->BAGGS/4000->26R',
      ANNEY3: 'ANNEY->DEKKA/8000->ROOOM/4000->27'
    }
  },
  {
    id: 'kbdl', name: 'Bradley International', elevation: 173,
    ga: .35, commercial: .8, weather: inlandWeather([20, 200]),
    operatorWhitelist: [1, 2, 3, 4, 5], blacklist: ['super'],
    inboundWaypoints: ['ROBUC', 'JUDDS', 'VALRE', 'BRISS'],
    outboundWaypoints: ['SAX', 'PUT', 'WOONS', 'COATE'],
    runways: [
      runway('06', '24', 59, 9510, -10, 8, 200), runway('15', '33', 153, 6847, 20, -12),
      runway('01', '19', 14, 4269, -35, -5, 100)
    ],
    sids: {
      SAX2: '06->HFD->SAX', PUT3: '15->BRADL->PUT',
      WOONS2: '24->HFD->WOONS', COATE4: '33->BRADL->COATE'
    },
    stars: {
      ROBUC3: 'ROBUC->JUDDS/7000->HFD/3000->06',
      JUDDS2: 'JUDDS->BRISS/7000->BRADL/3000->15',
      VALRE4: 'VALRE->HFD/7000->BRADL/3000->24',
      BRISS3: 'BRISS->COATE/7000->HFD/3000->33'
    }
  },
  {
    id: 'kmem', name: 'Memphis International', elevation: 341,
    ga: .08, commercial: 1, weather: inlandWeather([180, 360]),
    operatorWhitelist: [1, 3, 4, 5, 16, 17],
    inboundWaypoints: ['BRBBQ', 'HOBRK', 'DRUZZ', 'BLUZZ'],
    outboundWaypoints: ['ELVIS', 'PLEEE', 'GOETZ', 'NUBLE'],
    runways: [
      runway('09', '27', 91, 8946, 0, 48), runway('18C', '36C', 181, 11120, 0, 0, 200),
      runway('18L', '36R', 181, 9000, -40, 0), runway('18R', '36L', 181, 9320, 40, 0)
    ],
    sids: {
      ELVIS5: '09->ELVIS', PLEEE4: '18C->JAYZE->PLEEE',
      GOETZ3: '27->NINAA->GOETZ', NUBLE3: '36C->JAYZE->NUBLE'
    },
    stars: {
      BRBBQ3: 'BRBBQ->JAYZE/9000->NINAA/4000->18C',
      HOBRK4: 'HOBRK->NINAA/9000->JAYZE/4000->36C',
      DRUZZ2: 'DRUZZ->ELVIS/8000->NINAA/4000->09',
      BLUZZ3: 'BLUZZ->PLEEE/8000->JAYZE/4000->27'
    }
  },
  {
    id: 'khou', name: 'William P. Hobby', elevation: 46,
    ga: .18, commercial: 1, weather: coastalWeather([135, 315]),
    operatorWhitelist: [1, 4, 5], blacklist: ['heavy', 'super'],
    inboundWaypoints: ['KIDDZ', 'BAYYY', 'DOOBI', 'TEJAS'],
    outboundWaypoints: ['BLTWY', 'ELOCO', 'WAPPL', 'INDIE'],
    runways: [
      runway('04', '22', 44, 7602, 12, 8), runway('13L', '31R', 135, 5148, -24, 24, 100),
      runway('13R', '31L', 135, 7602, 20, -15), runway('17', '35', 175, 6000, -20, -15, 100)
    ],
    sids: {
      BLTWY2: '04->SEUSS->BLTWY', ELOCO3: '13R->VILLI->ELOCO',
      WAPPL4: '22->CRSTY->WAPPL', INDIE2: '31L->RJAAY->INDIE'
    },
    stars: {
      KIDDZ4: 'KIDDZ->GLUVR/9000->GEEEO/6000->04',
      BAYYY5: 'BAYYY->CRSTY/9000->VILLI/5000->13R',
      DOOBI3: 'DOOBI->VILLI/9000->RJAAY/5000->22',
      TEJAS4: 'TEJAS->GLUVR/9000->CRSTY/5000->31L'
    }
  },
  {
    id: 'klas', name: 'Harry Reid International', elevation: 2181,
    ga: .08, commercial: 1, weather: desertWeather([20, 210, 270]),
    operatorWhitelist: [1, 2, 3, 4, 5, 14],
    inboundWaypoints: ['SUNST', 'TYSSN', 'CLARR', 'KEPEC'],
    outboundWaypoints: ['HOOVR', 'GIDGT', 'COWBY', 'TRALR'],
    runways: [
      runway('01L', '19R', 14, 8988, -24, 0), runway('01R', '19L', 14, 9771, 24, 0),
      runway('08L', '26R', 89, 14515, 0, 35, 200), runway('08R', '26L', 89, 10526, 0, -32)
    ],
    sids: {
      HOOVR8: '01L->ROPPR->HOOVR', GIDGT3: '01R->MDDOG->GIDGT',
      COWBY6: '26R->JESSS->COWBY', TRALR4: '26L->ROPPR->TRALR'
    },
    stars: {
      SUNST4: 'SUNST->MDDOG/12000->ROPPR/7000->19R',
      TYSSN6: 'TYSSN->JESSS/12000->MDDOG/7000->26L',
      CLARR5: 'CLARR->ROPPR/11000->JESSS/7000->08L',
      KEPEC3: 'KEPEC->JESSS/11000->MDDOG/7000->01R'
    },
    msa: [{ dir: 90, alt: 8500 }, { dir: 210, alt: 10500 }, { dir: 360, alt: 7500 }]
  },
  {
    id: 'kbna', name: 'Nashville International', elevation: 599,
    ga: .22, commercial: 1, weather: inlandWeather([20, 200]),
    operatorWhitelist: [1, 2, 3, 4, 5], blacklist: ['super'],
    inboundWaypoints: ['CHSNE', 'SWFFT', 'GILLE', 'HILPT'],
    outboundWaypoints: ['CHADM', 'KRSTA', 'PREDS', 'TEDDY'],
    runways: [
      runway('02L', '20R', 18, 7704, -42, 0), runway('02C', '20C', 18, 8001, 0, 0),
      runway('02R', '20L', 18, 8001, 42, 0), runway('13', '31', 132, 11030, 0, 12, 200)
    ],
    sids: {
      CHADM3: '02C->DARBY->CHADM', KRSTA4: '02R->GADGE->KRSTA',
      PREDS2: '20C->DARBY->PREDS', TEDDY3: '31->GADGE->TEDDY'
    },
    stars: {
      CHSNE3: 'CHSNE->DARBY/9000->GADGE/4000->20C',
      SWFFT3: 'SWFFT->GADGE/9000->DARBY/4000->02C',
      GILLE4: 'GILLE->DARBY/8000->GADGE/4000->31',
      HILPT2: 'HILPT->GADGE/8000->DARBY/4000->13'
    }
  },
  {
    id: 'kord', name: "Chicago O'Hare International", elevation: 680,
    ga: .03, commercial: 1, weather: inlandWeather([90, 270]),
    operatorWhitelist: [1, 2, 3, 4, 5, 6, 8, 14, 16, 17],
    inboundWaypoints: ['WATSN', 'VEECK', 'BENKY', 'ESSPO'],
    outboundWaypoints: ['MONKZ', 'PEKUE', 'DUFEE', 'MYKIE'],
    runways: [
      runway('04L', '22R', 44, 7500, -60, 45), runway('04R', '22L', 44, 8075, -20, 10),
      runway('09L', '27R', 91, 7500, 0, 72), runway('09C', '27C', 91, 11245, 0, 42, 200),
      runway('09R', '27L', 91, 7967, 0, 15), runway('10L', '28R', 101, 13000, 0, -18, 200),
      runway('10C', '28C', 101, 10801, 0, -48, 200), runway('10R', '28L', 101, 7500, 0, -75)
    ],
    sids: {
      MONKZ5: '09C->DUPAG->MONKZ', PEKUE4: '10L->ELX->PEKUE',
      DUFEE3: '27C->DPA->DUFEE', MYKIE5: '28R->JOT->MYKIE'
    },
    stars: {
      WATSN4: 'WATSN->DUPAG/11000->DPA/5000->27C',
      VEECK6: 'VEECK->JOT/11000->ELX/5000->28R',
      BENKY5: 'BENKY->DPA/11000->DUPAG/5000->09C',
      ESSPO4: 'ESSPO->ELX/11000->JOT/5000->10L'
    }
  },
  {
    id: 'kewr', name: 'Newark Liberty International', elevation: 17,
    ga: .04, commercial: 1, weather: coastalWeather([30, 210]),
    operatorWhitelist: [1, 2, 3, 5, 6, 8, 14, 15, 30],
    inboundWaypoints: ['FLOSI', 'PHLBO', 'DYLIN', 'MUGZY'],
    outboundWaypoints: ['PORTT', 'ELIOT', 'NEWEL', 'PARKE'],
    runways: [
      runway('04L', '22R', 29, 11000, -22, 0, 200), runway('04R', '22L', 29, 10000, 22, 0, 200),
      runway('11', '29', 110, 6726, 8, 20)
    ],
    sids: {
      PORTT4: '04L->TETER->PORTT', ELIOT2: '04R->NEWEL->ELIOT',
      NEWEL5: '22R->TETER->NEWEL', PARKE3: '29->ELIOT->PARKE'
    },
    stars: {
      FLOSI4: 'FLOSI->TETER/9000->DYLIN/4000->22L',
      PHLBO4: 'PHLBO->DYLIN/9000->MUGZY/4000->22R',
      DYLIN5: 'DYLIN->NEWEL/8000->TETER/4000->04R',
      MUGZY3: 'MUGZY->ELIOT/8000->NEWEL/4000->29'
    }
  },
  {
    id: 'kmmk', name: 'Meriden Markham Municipal', elevation: 103,
    ga: 1, commercial: 0, weather: coastalWeather([180, 360]),
    operatorWhitelist: [],
    inboundWaypoints: ['MAD', 'HFD', 'WOONS', 'GON'],
    outboundWaypoints: ['MAD', 'HFD', 'WOONS', 'GON'],
    runways: [runway('18', '36', 183, 3100, 0, 0, 75)],
    sids: {}, stars: {}, blacklist: ['medium', 'heavy', 'super'],
    msa: [{ dir: 360, alt: 2500 }]
  },
  {
    id: 'khvn', name: 'Tweed New Haven', elevation: 13,
    ga: .65, commercial: .5, weather: coastalWeather([20, 200]),
    operatorWhitelist: [1, 2, 3, 5], blacklist: ['heavy', 'super'],
    inboundWaypoints: ['ROBUC', 'JUDDS', 'BRISS', 'MAD'],
    outboundWaypoints: ['MAD', 'HFD', 'GON', 'BDR'],
    runways: [runway('02', '20', 19, 5600, 0, 0), runway('14', '32', 139, 3626, 22, 10, 100)],
    sids: { MAD2: '02->SALLT->MAD', HFD2: '20->SALLT->HFD' },
    stars: {
      ROBUC2: 'ROBUC->SALLT/5000->02', JUDDS2: 'JUDDS->SALLT/5000->20'
    },
    msa: [{ dir: 360, alt: 2800 }]
  },
  {
    id: 'koxc', name: 'Waterbury-Oxford', elevation: 726,
    ga: 1, commercial: 0, weather: inlandWeather([180, 360]),
    operatorWhitelist: [],
    inboundWaypoints: ['MAD', 'HFD', 'JUDDS', 'BRISS'],
    outboundWaypoints: ['MAD', 'HFD', 'JUDDS', 'BRISS'],
    runways: [runway('18', '36', 182, 5800, 0, 0, 100)],
    sids: {}, stars: {}, blacklist: ['medium', 'heavy', 'super'],
    msa: [{ dir: 360, alt: 3200 }]
  },
  {
    id: 'kgon', name: 'Groton-New London', elevation: 9,
    ga: 1, commercial: 0, weather: coastalWeather([50, 230]),
    operatorWhitelist: [],
    inboundWaypoints: ['GON', 'PUT', 'MAD', 'CCC'],
    outboundWaypoints: ['GON', 'PUT', 'MAD', 'CCC'],
    runways: [runway('05', '23', 51, 5000, 0, 0, 100), runway('15', '33', 150, 4000, 20, -10, 100)],
    sids: {}, stars: {}, blacklist: ['medium', 'heavy', 'super'],
    msa: [{ dir: 360, alt: 2500 }]
  }
];

export default Object.assign(
  {},
  ...definitions.map(config => ({ [config.id]: createMap(config) }))
);
