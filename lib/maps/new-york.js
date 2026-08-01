const waypoint = (x, y, type = 'intersection') => ({ x, y, class: type });

const runway = (name1, name2, heading, length, x = 0, y = 0, width = 150) => ({
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
  elevation1: 13,
  elevation2: 13,
  name1,
  name2
});

export default {
  klga: {
    id: 'klga',
    name: 'New York LaGuardia',
    ta: 18,
    ga: .08,
    commercial: 1,
    weather: {
      windDirectionCenters: [40, 220],
      windDirectionVariation: 42,
      windSpeedRange: [4, 18],
      altimeterRange: [29.3, 30.55]
    },
    outboundWaypoints: ['GREKI', 'MERIT', 'WHITE', 'COATE'],
    inboundWaypoints: ['HAARP', 'PARCH', 'NOBBI', 'PROUD'],
    waypoints: {
      HAARP: waypoint(80, 650),
      PARCH: waypoint(60, 150),
      NOBBI: waypoint(1160, 640),
      PROUD: waypoint(1220, 115),
      GREKI: waypoint(1010, 30),
      MERIT: waypoint(1260, 360),
      WHITE: waypoint(400, 20),
      COATE: waypoint(25, 430),
      GLDMN: waypoint(970, 525),
      LENDY: waypoint(915, 155),
      DIALS: waypoint(400, 565),
      NEION: waypoint(430, 170),
      TANEN: waypoint(760, 525),
      CANDR: waypoint(815, 220),
      LGA04: waypoint(555, 290),
      LGA13: waypoint(565, 420)
    },
    sids: {
      GREKI5: '04->CANDR->LENDY->GREKI',
      MERIT4: '04->CANDR->MERIT',
      WHITESTONE4: '13->NEION->WHITE',
      COATE5: '13->DIALS->COATE',
      GREKI6: '31->CANDR->LENDY->GREKI',
      MERIT5: '22->CANDR->MERIT'
    },
    stars: {
      HAARP3: 'HAARP->DIALS/7000->TANEN/3000->04',
      PARCH3: 'PARCH->NEION/6000->CANDR/3000->13',
      NOBBI5: 'NOBBI->GLDMN/6000->TANEN/3000->22',
      PROUD2: 'PROUD->LENDY/6000->CANDR/3000->31'
    },
    msa: {
      base: [
        { dir: 90, alt: 2500 },
        { dir: 210, alt: 3100 },
        { dir: 360, alt: 2200 }
      ],
      polygons: []
    },
    airport: {
      blacklist: ['heavy'],
      operatorWhitelist: [1, 2, 3, 4, 5],
      elevation: 21,
      rwyusage: [
        { dir: 90, rwys: ['04', '13'] },
        { dir: 180, rwys: ['13', '22'] },
        { dir: 270, rwys: ['22', '31'] },
        { dir: 360, rwys: ['31', '04'] }
      ],
      callsign: 'KLGA',
      x: 0,
      y: 0,
      class: 'airport',
      runways: [
        runway('04', '22', 44, 7001, -22, 0),
        runway('13', '31', 134, 7003, 20, -8)
      ]
    }
  },
  kjfk: {
    id: 'kjfk',
    name: 'John F. Kennedy International',
    ta: 18,
    ga: .03,
    commercial: 1,
    weather: {
      windDirectionCenters: [40, 220],
      windDirectionVariation: 48,
      windSpeedRange: [5, 20],
      altimeterRange: [29.25, 30.55]
    },
    outboundWaypoints: ['BETTE', 'DEEZZ', 'GREKI', 'RBV', 'SHIPP'],
    inboundWaypoints: ['CAMRN', 'ROBER', 'LENDY', 'PARCH', 'CCC'],
    waypoints: {
      CAMRN: waypoint(150, 660),
      ROBER: waypoint(60, 245),
      LENDY: waypoint(900, 25),
      PARCH: waypoint(1180, 115),
      CCC: waypoint(1260, 550, 'vor/dme'),
      BETTE: waypoint(1050, 690),
      DEEZZ: waypoint(1240, 325),
      GREKI: waypoint(820, 10),
      RBV: waypoint(55, 410, 'vor/dme'),
      SHIPP: waypoint(300, 20),
      DPK: waypoint(880, 220, 'vor/dme'),
      CRI: waypoint(525, 405, 'vor/dme'),
      ZACHS: waypoint(980, 490),
      HAPIE: waypoint(360, 565),
      RENUE: waypoint(415, 180),
      WAVEY: waypoint(730, 560),
      SKORR: waypoint(700, 205)
    },
    sids: {
      BETTE3: '04L->CRI->WAVEY->BETTE',
      DEEZZ5: '04R->DPK->ZACHS->DEEZZ',
      GREKI7: '31L->SKORR->DPK->GREKI',
      RBV5: '31R->CRI->HAPIE->RBV',
      SHIPP6: '22R->CRI->RENUE->SHIPP',
      DEEZZ6: '22L->DPK->ZACHS->DEEZZ'
    },
    stars: {
      CAMRN4: 'CAMRN->HAPIE/7000->CRI/3000->04L',
      ROBER3: 'ROBER->RENUE/7000->SKORR/3000->04R',
      LENDY6: 'LENDY->DPK/7000->SKORR/3000->22L',
      PARCH4: 'PARCH->DPK/7000->ZACHS/3000->22R',
      CCC5: 'CCC->ZACHS/7000->WAVEY/3000->31L'
    },
    msa: {
      base: [
        { dir: 80, alt: 2500 },
        { dir: 210, alt: 3200 },
        { dir: 360, alt: 2300 }
      ],
      polygons: []
    },
    airport: {
      blacklist: [],
      operatorWhitelist: [1, 2, 3, 5, 6, 8, 9, 14, 15, 18, 19, 20, 22, 30],
      elevation: 13,
      rwyusage: [
        { dir: 90, rwys: ['04L', '04R'] },
        { dir: 180, rwys: ['13L', '13R'] },
        { dir: 270, rwys: ['22L', '22R'] },
        { dir: 360, rwys: ['31L', '31R'] }
      ],
      callsign: 'KJFK',
      x: 0,
      y: 0,
      class: 'airport',
      runways: [
        runway('04L', '22R', 44, 12079, -27, 15, 200),
        runway('04R', '22L', 44, 8400, 28, -18, 150),
        runway('13L', '31R', 134, 10000, 9, 30, 200),
        runway('13R', '31L', 134, 14511, -14, -28, 200)
      ]
    }
  }
};
