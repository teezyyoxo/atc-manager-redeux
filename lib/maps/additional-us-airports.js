const DEFAULT_OPERATOR_POOL = [1, 2, 3, 4, 5, 33, 34];

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
    region: 'north-america',
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
    operatorWhitelist: [1, 2, 3, 4, 5, 33, 34],
    inboundWaypoints: ['OLAHS', 'BHHIA', 'JEREM', 'ANNEY'],
    outboundWaypoints: ['LIFRR', 'THNDR', 'DOLIE', 'GLADZ'],
    runways: [runway('10L', '28R', 96, 9000, -2.3, 5.6), runway('10R', '28L', 96, 8000, 2.6, -6.3)],
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
    operatorWhitelist: [1, 2, 3, 4, 5, 6, 8, 9, 14, 15, 19, 26, 27, 29, 33, 34],
    inboundWaypoints: ['FLIPR', 'HILEY', 'SSCOT', 'ANNEY'],
    outboundWaypoints: ['GLADZ', 'HITAG', 'DOLIE', 'MNATE'],
    runways: [
      runway('08L', '26R', 92, 8600, 2.2, 8.1), runway('08R', '26L', 92, 10506, 4.8, 5.7, 200),
      runway('09', '27', 92, 13016, -5.3, -8.2), runway('12', '30', 124, 9360, 0, -2.5)
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
    operatorWhitelist: [1, 2, 3, 4, 5, 33, 34],
    blacklist: ['heavy', 'super'],
    inboundWaypoints: ['ROBUC', 'JUDDS', 'VALRE', 'BRISS'],
    outboundWaypoints: ['SAX', 'PUT', 'WOONS', 'COATE'],
    runways: [
      runway('06', '24', 58, 9510, .5, 2.3, 200),
      runway('15', '33', 148, 6847, -.7, -3.2)
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
    operatorWhitelist: [1, 3, 4, 5, 16, 17, 34],
    inboundWaypoints: ['BRBBQ', 'HOBRK', 'DRUZZ', 'BLUZZ'],
    outboundWaypoints: ['ELVIS', 'PLEEE', 'GOETZ', 'NUBLE'],
    runways: [
      runway('09', '27', 93, 8946, 5.2, 16), runway('18C', '36C', 180, 11120, .6, -3.2),
      runway('18L', '36R', 180, 9000, 3.2, -6.1), runway('18R', '36L', 180, 9320, -8.9, -5.7)
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
      runway('04', '22', 41, 7602, .1, .9), runway('13L', '31R', 131, 5148, -.8, 1.9, 100),
      runway('13R', '31L', 131, 7602, .4, -2.1)
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
    operatorWhitelist: [1, 2, 3, 4, 5, 6, 20, 30, 33, 34],
    inboundWaypoints: ['SUNST', 'TYSSN', 'CLARR', 'KEPEC'],
    outboundWaypoints: ['HOOVR', 'GIDGT', 'COWBY', 'TRALR'],
    runways: [
      runway('01L', '19R', 14, 9770, -10.2, 5.4), runway('01R', '19L', 14, 9769, -7.7, 4.8),
      runway('08L', '26R', 79, 14835, 5.8, -3), runway('08R', '26L', 79, 10526, 8.4, -5.3)
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
    operatorWhitelist: [1, 2, 3, 4, 5, 6, 33, 34], blacklist: ['super'],
    inboundWaypoints: ['CHSNE', 'SWFFT', 'GILLE', 'HILPT'],
    outboundWaypoints: ['CHADM', 'KRSTA', 'PREDS', 'TEDDY'],
    runways: [
      runway('02L', '20R', 21, 7704, -3.4, 3.5), runway('02C', '20C', 21, 8001, -5.2, -10.6),
      runway('02R', '20L', 21, 8001, 12, -2), runway('13', '31', 136, 11030, -2.6, 6.7)
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
    operatorWhitelist: [
      0, 1, 2, 3, 4, 5, 6, 8, 9, 12, 14, 15, 16, 17, 18, 19,
      20, 21, 22, 26, 27, 29, 33, 34
    ],
    inboundWaypoints: ['WATSN', 'VEECK', 'BENKY', 'ESSPO'],
    outboundWaypoints: ['MONKZ', 'PEKUE', 'DUFEE', 'MYKIE'],
    runways: [
      runway('04L', '22R', 42, 7500, 2.9, 12.8), runway('04R', '22L', 45, 8075, 13.2, -16.3),
      runway('09L', '27R', 93, 7500, -2.2, 26.5), runway('09C', '27C', 93, 11245, -1.5, 11.7, 200),
      runway('09R', '27L', 93, 11260, -1.7, 7.2), runway('10L', '28R', 93, 13000, 0, -8.1),
      runway('10C', '28C', 93, 10800, -3.3, -11.3, 200), runway('10R', '28L', 93, 7500, -5.5, -19.8)
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
    operatorWhitelist: [1, 3, 5, 6, 8, 9, 14, 15, 19, 29, 30, 33, 34],
    inboundWaypoints: ['FLOSI', 'PHLBO', 'DYLIN', 'MUGZY'],
    outboundWaypoints: ['PORTT', 'ELIOT', 'NEWEL', 'PARKE'],
    runways: [
      runway('04L', '22R', 39, 11000, -2.4, -3.1), runway('04R', '22L', 39, 9999, 1.1, -2.9),
      runway('11', '29', 108, 6725, 2.2, 9.4)
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
    runways: [runway('18', '36', 176, 3100, 0, 0, 75)],
    sids: {}, stars: {}, blacklist: ['medium', 'heavy', 'super'],
    msa: [{ dir: 360, alt: 2500 }]
  },
  {
    id: 'khvn', name: 'Tweed New Haven', elevation: 13,
    ga: .65, commercial: .5, weather: coastalWeather([20, 200]),
    operatorWhitelist: [1, 2, 3, 5], blacklist: ['heavy', 'super'],
    inboundWaypoints: ['ROBUC', 'JUDDS', 'BRISS', 'MAD'],
    outboundWaypoints: ['MAD', 'HFD', 'GON', 'BDR'],
    runways: [runway('02', '20', 16, 5600)],
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
    runways: [runway('18', '36', 185, 5801, 0, 0, 100)],
    sids: {}, stars: {}, blacklist: ['medium', 'heavy', 'super'],
    msa: [{ dir: 360, alt: 3200 }]
  },
  {
    id: 'kgon', name: 'Groton-New London', elevation: 9,
    ga: 1, commercial: 0, weather: coastalWeather([50, 230]),
    operatorWhitelist: [],
    inboundWaypoints: ['GON', 'PUT', 'MAD', 'CCC'],
    outboundWaypoints: ['GON', 'PUT', 'MAD', 'CCC'],
    runways: [runway('05', '23', 48, 5000, 1.8, .3), runway('15', '33', 149, 4000, -2.2, -.3, 96)],
    sids: {}, stars: {}, blacklist: ['medium', 'heavy', 'super'],
    msa: [{ dir: 360, alt: 2500 }]
  }
];

export default Object.assign(
  {},
  ...definitions.map(config => ({ [config.id]: createMap(config) }))
);
