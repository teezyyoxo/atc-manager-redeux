const legacyAirplanes = [
  {
    'id': 0,
    'commercial': 1,
    'takeoffMinRunwayLength': 6000,
    'landingMinRunwayLength': 5000,
    'ceiling': 37,
    'name': 'Boeing 737',
    'shortName': 'B737',
    'topSpeed': 320,
    'landingSpeed': 140,
    'climbSpeed': 1,
    'descendSpeed': 1,
    'accelerationSpeed': 1,
    'deAccelerationSpeed': 1,
    'minSpeed': 160,
    'turningRate': [
      5,
      3,
      2
    ],
    'operators': [
      0,
      1,
      5,
      3,
      2,
      7,
      10,
      11,
      12,
      13,
      14,
      22,
      23
    ],
    'descendRatioWhileDecelerating': 0.5,
    'ga': 0,
    'class': 'medium',
    'rarity': 1
  },
  {
    'id': 1,
    'commercial': 1,
    'takeoffMinRunwayLength': 6000,
    'landingMinRunwayLength': 5000,
    'name': 'Boeing 747',
    'shortName': 'B747',
    'topSpeed': 330,
    'landingSpeed': 145,
    'climbSpeed': 1,
    'descendSpeed': 1,
    'accelerationSpeed': 1,
    'deAccelerationSpeed': 1,
    'minSpeed': 180,
    'turningRate': [
      5,
      3,
      2
    ],
    'ceiling': 41,
    'operators': [
      0,
      1,
      2,
      3,
      6,
      8,
      14,
      17,
      18,
      19,
      20,
      21,
      22
    ],
    'descendRatioWhileDecelerating': 0.5,
    'ga': 0,
    'class': 'heavy',
    'rarity': 0.3
  },
  {
    'id': 2,
    'commercial': 1,
    'takeoffMinRunwayLength': 6000,
    'landingMinRunwayLength': 5000,
    'name': 'Boeing 757',
    'shortName': 'B757',
    'topSpeed': 330,
    'landingSpeed': 140,
    'climbSpeed': 1,
    'descendSpeed': 1,
    'minSpeed': 160,
    'accelerationSpeed': 1,
    'deAccelerationSpeed': 1,
    'turningRate': [
      5,
      3,
      2
    ],
    'ceiling': 42,
    'operators': [
      0,
      1,
      5,
      3,
      2,
      7,
      16,
      17
    ],
    'descendRatioWhileDecelerating': 0.5,
    'ga': 0,
    'class': 'medium',
    'rarity': 0.25
  },
  {
    'id': 3,
    'commercial': 1,
    'takeoffMinRunwayLength': 6000,
    'landingMinRunwayLength': 5000,
    'name': 'Boeing 767',
    'shortName': 'B767',
    'topSpeed': 330,
    'landingSpeed': 140,
    'minSpeed': 160,
    'climbSpeed': 1,
    'descendSpeed': 1,
    'accelerationSpeed': 1,
    'deAccelerationSpeed': 1,
    'turningRate': [
      5,
      3,
      2
    ],
    'ceiling': 43,
    'operators': [
      1,
      3,
      5,
      6,
      7,
      12,
      16
    ],
    'descendRatioWhileDecelerating': 0.5,
    'ga': 0,
    'class': 'heavy',
    'rarity': 0.25
  },
  {
    'id': 4,
    'commercial': 1,
    'takeoffMinRunwayLength': 6000,
    'landingMinRunwayLength': 5000,
    'name': 'Boeing 777',
    'shortName': 'B777',
    'topSpeed': 330,
    'landingSpeed': 140,
    'climbSpeed': 1,
    'descendSpeed': 1,
    'accelerationSpeed': 1,
    'deAccelerationSpeed': 1,
    'minSpeed': 160,
    'turningRate': [
      5,
      3,
      2
    ],
    'ceiling': 43,
    'operators': [
      0,
      1,
      6,
      7,
      8,
      9,
      10,
      11,
      12,
      14,
      15,
      16,
      18,
      19,
      20,
      23
    ],
    'descendRatioWhileDecelerating': 0.5,
    'ga': 0,
    'class': 'heavy',
    'rarity': 0.25
  },
  {
    'id': 5,
    'commercial': 1,
    'takeoffMinRunwayLength': 9020,
    'landingMinRunwayLength': 5900,
    'name': 'Airbus A380',
    'shortName': 'A380',
    'topSpeed': 330,
    'landingSpeed': 150,
    'climbSpeed': 1,
    'descendSpeed': 1,
    'accelerationSpeed': 1,
    'deAccelerationSpeed': 1,
    'minSpeed': 160,
    'turningRate': [
      5,
      3,
      2
    ],
    'ceiling': 43,
    'operators': [
      6,
      9,
      10,
      15,
      20
    ],
    'descendRatioWhileDecelerating': 0.5,
    'ga': 0,
    'class': 'super',
    'rarity': 0.1
  },
  {
    'id': 6,
    'commercial': 1,
    'takeoffMinRunwayLength': 6000,
    'landingMinRunwayLength': 5000,
    'name': 'Airbus A330',
    'shortName': 'A330',
    'ceiling': 39,
    'topSpeed': 320,
    'landingSpeed': 140,
    'climbSpeed': 1,
    'descendSpeed': 1,
    'accelerationSpeed': 1,
    'deAccelerationSpeed': 1,
    'minSpeed': 160,
    'turningRate': [
      5,
      3,
      2
    ],
    'operators': [
      0,
      1,
      3,
      5,
      8,
      9,
      11,
      14,
      18,
      19,
      20,
      22,
      23
    ],
    'descendRatioWhileDecelerating': 0.5,
    'ga': 0,
    'class': 'medium',
    'rarity': 0.8
  },
  {
    'id': 7,
    'commercial': 1,
    'takeoffMinRunwayLength': 6000,
    'landingMinRunwayLength': 5000,
    'ceiling': 39,
    'name': 'Boeing 787 Dreamliner',
    'shortName': 'B787',
    'topSpeed': 320,
    'landingSpeed': 140,
    'climbSpeed': 1,
    'descendSpeed': 1,
    'accelerationSpeed': 1,
    'deAccelerationSpeed': 1,
    'minSpeed': 160,
    'turningRate': [
      5,
      3,
      2
    ],
    'operators': [
      0,
      3,
      5,
      6,
      10,
      11,
      12,
      19,
      22,
      23
    ],
    'descendRatioWhileDecelerating': 0.5,
    'ga': 0,
    'class': 'heavy',
    'rarity': 0.15
  },
  {
    'id': 8,
    'commercial': 1,
    'takeoffMinRunwayLength': 6000,
    'landingMinRunwayLength': 5000,
    'ceiling': 37,
    'name': 'Airbus A319',
    'shortName': 'A319',
    'topSpeed': 320,
    'landingSpeed': 140,
    'climbSpeed': 1,
    'descendSpeed': 1,
    'accelerationSpeed': 1,
    'deAccelerationSpeed': 1,
    'minSpeed': 160,
    'turningRate': [
      5,
      3,
      2
    ],
    'operators': [
      1,
      5,
      6,
      8,
      10,
      11,
      14,
      19,
      22
    ],
    'descendRatioWhileDecelerating': 0.5,
    'ga': 0,
    'class': 'medium',
    'rarity': 0.3
  },
  {
    'id': 9,
    'commercial': 1,
    'takeoffMinRunwayLength': 5500,
    'landingMinRunwayLength': 4800,
    'ceiling': 37,
    'name': 'Airbus A320',
    'shortName': 'A320',
    'topSpeed': 320,
    'landingSpeed': 140,
    'climbSpeed': 1,
    'descendSpeed': 1,
    'accelerationSpeed': 1,
    'deAccelerationSpeed': 1,
    'minSpeed': 160,
    'turningRate': [
      5,
      3,
      2
    ],
    'operators': [
      1,
      5,
      3,
      2,
      6,
      8,
      9,
      10,
      11,
      12,
      14,
      19,
      20,
      22,
      23
    ],
    'descendRatioWhileDecelerating': 0.5,
    'ga': 0,
    'class': 'medium',
    'rarity': 0.3
  },
  {
    'id': 10,
    'commercial': 1,
    'takeoffMinRunwayLength': 6000,
    'landingMinRunwayLength': 5000,
    'ceiling': 37,
    'name': 'Airbus A321',
    'shortName': 'A321',
    'topSpeed': 320,
    'landingSpeed': 140,
    'climbSpeed': 1,
    'descendSpeed': 1,
    'accelerationSpeed': 1,
    'deAccelerationSpeed': 1,
    'minSpeed': 160,
    'turningRate': [
      5,
      3,
      2
    ],
    'operators': [
      1,
      5,
      3,
      2,
      6,
      8,
      9,
      10,
      11,
      12,
      14,
      19,
      20,
      23
    ],
    'descendRatioWhileDecelerating': 0.5,
    'ga': 0,
    'class': 'medium',
    'rarity': 0.3
  },
  {
    'id': 11,
    'commercial': 1,
    'takeoffMinRunwayLength': 6000,
    'landingMinRunwayLength': 5000,
    'ceiling': 41,
    'name': 'Airbus A350',
    'shortName': 'A350',
    'topSpeed': 320,
    'landingSpeed': 140,
    'climbSpeed': 1,
    'descendSpeed': 1,
    'accelerationSpeed': 1,
    'deAccelerationSpeed': 1,
    'minSpeed': 160,
    'turningRate': [
      5,
      3,
      2
    ],
    'operators': [
      1,
      8,
      10,
      14,
      18,
      19,
      22
    ],
    'descendRatioWhileDecelerating': 0.5,
    'ga': 0,
    'class': 'heavy',
    'rarity': 0.3
  },
  {
    'id': 12,
    'commercial': 1,
    'takeoffMinRunwayLength': 6000,
    'landingMinRunwayLength': 5000,
    'ceiling': 35,
    'name': 'Boeing 717',
    'shortName': 'B717',
    'topSpeed': 300,
    'landingSpeed': 140,
    'climbSpeed': 1,
    'descendSpeed': 1,
    'accelerationSpeed': 1,
    'deAccelerationSpeed': 1,
    'minSpeed': 150,
    'turningRate': [
      5,
      3,
      2
    ],
    'operators': [
      1
    ],
    'descendRatioWhileDecelerating': 0.5,
    'ga': 0,
    'class': 'medium',
    'rarity': 0.1
  },
  {
    'id': 13,
    'commercial': 1,
    'takeoffMinRunwayLength': 6000,
    'landingMinRunwayLength': 5000,
    'ceiling': 35,
    'name': 'McDonell Douglas MD-88',
    'shortName': 'MD-88',
    'topSpeed': 300,
    'landingSpeed': 140,
    'climbSpeed': 1,
    'descendSpeed': 1,
    'accelerationSpeed': 1,
    'deAccelerationSpeed': 1,
    'minSpeed': 150,
    'turningRate': [
      5,
      3,
      2
    ],
    'operators': [
      1
    ],
    'descendRatioWhileDecelerating': 0.5,
    'ga': 0,
    'class': 'medium',
    'rarity': 0.1
  },
  {
    'id': 14,
    'commercial': 1,
    'takeoffMinRunwayLength': 6000,
    'landingMinRunwayLength': 5000,
    'ceiling': 35,
    'name': 'McDonell Douglas MD-90',
    'shortName': 'MD-90',
    'topSpeed': 300,
    'landingSpeed': 140,
    'climbSpeed': 1,
    'descendSpeed': 1,
    'accelerationSpeed': 1,
    'deAccelerationSpeed': 1,
    'minSpeed': 150,
    'turningRate': [
      5,
      3,
      2
    ],
    'operators': [
      1
    ],
    'descendRatioWhileDecelerating': 0.5,
    'ga': 0,
    'class': 'medium',
    'rarity': 0.1
  },
  {
    'id': 15,
    'commercial': 1,
    'takeoffMinRunwayLength': 6000,
    'landingMinRunwayLength': 5000,
    'ceiling': 38,
    'name': 'Embraer 190',
    'shortName': 'E190',
    'topSpeed': 310,
    'landingSpeed': 140,
    'climbSpeed': 1,
    'descendSpeed': 1,
    'accelerationSpeed': 1,
    'deAccelerationSpeed': 1,
    'minSpeed': 150,
    'turningRate': [
      5,
      3,
      2
    ],
    'operators': [
      2,
      5,
      10
    ],
    'descendRatioWhileDecelerating': 0.5,
    'ga': 0,
    'class': 'medium',
    'rarity': 0.1
  },
  {
    'id': 16,
    'commercial': 1,
    'takeoffMinRunwayLength': 6000,
    'landingMinRunwayLength': 5000,
    'ceiling': 35,
    'name': 'McDonell Douglas MD-82',
    'shortName': 'MD-82',
    'topSpeed': 300,
    'landingSpeed': 140,
    'climbSpeed': 1,
    'descendSpeed': 1,
    'accelerationSpeed': 1,
    'deAccelerationSpeed': 1,
    'minSpeed': 150,
    'turningRate': [
      5,
      3,
      2
    ],
    'operators': [
      5
    ],
    'descendRatioWhileDecelerating': 0.5,
    'ga': 0,
    'class': 'medium',
    'rarity': 0.1
  },
  {
    'id': 17,
    'commercial': 1,
    'takeoffMinRunwayLength': 6000,
    'landingMinRunwayLength': 5000,
    'ceiling': 35,
    'name': 'McDonell Douglas MD-83',
    'shortName': 'MD-83',
    'topSpeed': 300,
    'landingSpeed': 140,
    'climbSpeed': 1,
    'descendSpeed': 1,
    'accelerationSpeed': 1,
    'deAccelerationSpeed': 1,
    'minSpeed': 150,
    'turningRate': [
      5,
      3,
      2
    ],
    'operators': [
      5
    ],
    'descendRatioWhileDecelerating': 0.5,
    'ga': 0,
    'class': 'medium',
    'rarity': 0.1
  },
  {
    'id': 18,
    'commercial': 1,
    'takeoffMinRunwayLength': 6000,
    'landingMinRunwayLength': 5000,
    'name': 'Airbus A340',
    'shortName': 'A340',
    'topSpeed': 330,
    'landingSpeed': 140,
    'climbSpeed': 1,
    'descendSpeed': 1,
    'accelerationSpeed': 1,
    'deAccelerationSpeed': 1,
    'minSpeed': 160,
    'turningRate': [
      5,
      3,
      2
    ],
    'ceiling': 43,
    'operators': [
      8,
      27,
      28,
      9,
      29,
      14,
      30
    ],
    'descendRatioWhileDecelerating': 0.5,
    'ga': 0,
    'class': 'heavy',
    'rarity': 0.1
  },
  {
    'id': 19,
    'takeoffMinRunwayLength': 1200,
    'landingMinRunwayLength': 800,
    'ceiling': 13,
    'name': 'Cessna 172',
    'shortName': 'C172',
    'topSpeed': 120,
    'landingSpeed': 60,
    'climbSpeed': 0.4,
    'descendSpeed': 0.6,
    'accelerationSpeed': 1.4,
    'deAccelerationSpeed': 1.5,
    'minSpeed': 80,
    'turningRate': [
      9,
      7,
      5
    ],
    'operators': [],
    'descendRatioWhileDecelerating': 0.5,
    'commercial': 0,
    'ga': 1,
    'class': 'light',
    'rarity': 0.5
  },
  {
    'id': 20,
    'takeoffMinRunwayLength': 3000,
    'landingMinRunwayLength': 2000,
    'ceiling': 25,
    'name': 'Beechcraft 1900',
    'shortName': 'B1900',
    'topSpeed': 280,
    'landingSpeed': 100,
    'climbSpeed': 0.8,
    'descendSpeed': 1,
    'accelerationSpeed': 1.1,
    'deAccelerationSpeed': 1.3,
    'minSpeed': 120,
    'turningRate': [
      9,
      7,
      5
    ],
    'operators': [],
    'descendRatioWhileDecelerating': 0.5,
    'commercial': 0,
    'ga': 1,
    'class': 'light',
    'rarity': 0.1
  },
  {
    'id': 21,
    'commercial': 1,
    'takeoffMinRunwayLength': 6000,
    'landingMinRunwayLength': 5000,
    'name': 'McDonnell Douglas MD-11',
    'shortName': 'MD-11',
    'topSpeed': 330,
    'landingSpeed': 145,
    'climbSpeed': 1,
    'descendSpeed': 1,
    'accelerationSpeed': 1,
    'deAccelerationSpeed': 1,
    'minSpeed': 160,
    'turningRate': [
      5,
      3,
      2
    ],
    'ceiling': 43,
    'operators': [16, 17, 8],
    'descendRatioWhileDecelerating': 0.5,
    'ga': 0,
    'class': 'heavy',
    'rarity': 0.1
  },
  {
    'id': 22,
    'commercial': 1,
    'takeoffMinRunwayLength': 5000,
    'landingMinRunwayLength': 4000,
    'ceiling': 25,
    'name': 'ATR 42',
    'shortName': 'ATR 42',
    'topSpeed': 270,
    'landingSpeed': 100,
    'climbSpeed': 1,
    'descendSpeed': 1,
    'accelerationSpeed': 1,
    'deAccelerationSpeed': 1,
    'minSpeed': 120,
    'turningRate': [
      5,
      3,
      2
    ],
    'operators': [16, 17, 31, 32],
    'descendRatioWhileDecelerating': 0.5,
    'ga': 0,
    'class': 'medium',
    'rarity': 0.1
  },
  {
    'id': 23,
    'commercial': 1,
    'takeoffMinRunwayLength': 5000,
    'landingMinRunwayLength': 4000,
    'ceiling': 25,
    'name': 'ATR 72',
    'shortName': 'ATR 72',
    'topSpeed': 270,
    'landingSpeed': 100,
    'climbSpeed': 1,
    'descendSpeed': 1,
    'accelerationSpeed': 1,
    'deAccelerationSpeed': 1,
    'minSpeed': 120,
    'turningRate': [
      5,
      3,
      2
    ],
    'operators': [16, 17, 31],
    'descendRatioWhileDecelerating': 0.5,
    'ga': 0,
    'class': 'medium',
    'rarity': 0.1
  },
  {
    'id': 24,
    'takeoffMinRunwayLength': 1200,
    'landingMinRunwayLength': 800,
    'ceiling': 13,
    'name': 'Beechcraft Bonanza',
    'shortName': 'Beechcraft Bonanza',
    'topSpeed': 120,
    'landingSpeed': 60,
    'climbSpeed': 0.4,
    'descendSpeed': 0.6,
    'accelerationSpeed': 1.4,
    'deAccelerationSpeed': 1.5,
    'minSpeed': 80,
    'turningRate': [
      9,
      7,
      5
    ],
    'operators': [],
    'descendRatioWhileDecelerating': 0.5,
    'commercial': 0,
    'ga': 1,
    'class': 'light',
    'rarity': 0.5
  },
  {
    'id': 25,
    'takeoffMinRunwayLength': 2000,
    'landingMinRunwayLength': 1500,
    'ceiling': 25,
    'name': 'de Havilland Canada DHC-6',
    'shortName': 'DHC-6',
    'topSpeed': 160,
    'landingSpeed': 85,
    'climbSpeed': 0.8,
    'descendSpeed': 1,
    'accelerationSpeed': 1.1,
    'deAccelerationSpeed': 1.3,
    'minSpeed': 120,
    'turningRate': [
      9,
      7,
      5
    ],
    'operators': [],
    'descendRatioWhileDecelerating': 0.5,
    'commercial': 0,
    'ga': 1,
    'class': 'light',
    'rarity': 0.1
  },
  {
    'id': 26,
    'takeoffMinRunwayLength': 1200,
    'landingMinRunwayLength': 800,
    'ceiling': 13,
    'name': 'Cirrus SR22',
    'shortName': 'SR22',
    'topSpeed': 120,
    'landingSpeed': 60,
    'climbSpeed': 0.4,
    'descendSpeed': 0.6,
    'accelerationSpeed': 1.4,
    'deAccelerationSpeed': 1.5,
    'minSpeed': 80,
    'turningRate': [
      9,
      7,
      5
    ],
    'operators': [],
    'descendRatioWhileDecelerating': 0.5,
    'commercial': 0,
    'ga': 1,
    'class': 'light',
    'rarity': 0.5
  },
  {
    'id': 27,
    'takeoffMinRunwayLength': 1200,
    'landingMinRunwayLength': 800,
    'ceiling': 13,
    'name': 'Cirrus SR20',
    'shortName': 'SR20',
    'topSpeed': 120,
    'landingSpeed': 60,
    'climbSpeed': 0.4,
    'descendSpeed': 0.6,
    'accelerationSpeed': 1.4,
    'deAccelerationSpeed': 1.5,
    'minSpeed': 80,
    'turningRate': [
      9,
      7,
      5
    ],
    'operators': [],
    'descendRatioWhileDecelerating': 0.5,
    'commercial': 0,
    'ga': 1,
    'class': 'light',
    'rarity': 0.5
  },
  {
    'id': 28,
    'takeoffMinRunwayLength': 1200,
    'landingMinRunwayLength': 800,
    'ceiling': 13,
    'name': 'Diamond DA20 Katana',
    'shortName': 'DA20',
    'topSpeed': 120,
    'landingSpeed': 60,
    'climbSpeed': 0.4,
    'descendSpeed': 0.6,
    'accelerationSpeed': 1.4,
    'deAccelerationSpeed': 1.5,
    'minSpeed': 80,
    'turningRate': [
      9,
      7,
      5
    ],
    'operators': [],
    'descendRatioWhileDecelerating': 0.5,
    'commercial': 0,
    'ga': 1,
    'class': 'light',
    'rarity': 0.5
  },
  {
    'id': 29,
    'takeoffMinRunwayLength': 1200,
    'landingMinRunwayLength': 800,
    'ceiling': 13,
    'name': 'Diamond DA40 Star',
    'shortName': 'DA40',
    'topSpeed': 120,
    'landingSpeed': 60,
    'climbSpeed': 0.4,
    'descendSpeed': 0.6,
    'accelerationSpeed': 1.4,
    'deAccelerationSpeed': 1.5,
    'minSpeed': 80,
    'turningRate': [
      9,
      7,
      5
    ],
    'operators': [],
    'descendRatioWhileDecelerating': 0.5,
    'commercial': 0,
    'ga': 1,
    'class': 'light',
    'rarity': 0.5
  },
  {
    'id': 30,
    'takeoffMinRunwayLength': 1200,
    'landingMinRunwayLength': 800,
    'ceiling': 13,
    'name': 'Mooney M20',
    'shortName': 'M20',
    'topSpeed': 120,
    'landingSpeed': 60,
    'climbSpeed': 0.4,
    'descendSpeed': 0.6,
    'accelerationSpeed': 1.4,
    'deAccelerationSpeed': 1.5,
    'minSpeed': 80,
    'turningRate': [
      9,
      7,
      5
    ],
    'operators': [],
    'descendRatioWhileDecelerating': 0.5,
    'commercial': 0,
    'ga': 1,
    'class': 'light',
    'rarity': 0.2
  },
  {
    'id': 31,
    'takeoffMinRunwayLength': 1200,
    'landingMinRunwayLength': 800,
    'ceiling': 13,
    'name': 'Robin DR400',
    'shortName': 'DR400',
    'topSpeed': 120,
    'landingSpeed': 60,
    'climbSpeed': 0.4,
    'descendSpeed': 0.6,
    'accelerationSpeed': 1.4,
    'deAccelerationSpeed': 1.5,
    'minSpeed': 80,
    'turningRate': [
      9,
      7,
      5
    ],
    'operators': [],
    'descendRatioWhileDecelerating': 0.5,
    'commercial': 0,
    'ga': 1,
    'class': 'light',
    'rarity': 0.5
  },
  {
    'id': 32,
    'takeoffMinRunwayLength': 1200,
    'landingMinRunwayLength': 800,
    'ceiling': 20,
    'name': 'GippsAero GA8 Airvan',
    'shortName': 'GA8',
    'topSpeed': 120,
    'landingSpeed': 65,
    'climbSpeed': 0.4,
    'descendSpeed': 0.6,
    'accelerationSpeed': 1.1,
    'deAccelerationSpeed': 1.3,
    'minSpeed': 80,
    'turningRate': [
      9,
      7,
      5
    ],
    'operators': [],
    'descendRatioWhileDecelerating': 0.5,
    'commercial': 0,
    'ga': 1,
    'class': 'light',
    'rarity': 0.5
  }
];

const defaults = {
  commercial: 0,
  ga: 0,
  takeoffMinRunwayLength: 5000,
  landingMinRunwayLength: 4000,
  ceiling: 35,
  topSpeed: 300,
  landingSpeed: 125,
  minSpeed: 140,
  climbSpeed: 1,
  descendSpeed: 1,
  accelerationSpeed: 1,
  deAccelerationSpeed: 1,
  turningRate: [5, 3, 2],
  operators: [],
  descendRatioWhileDecelerating: 0.55,
  class: 'medium',
  rarity: 0.1,
  maxCrosswind: 25,
  maxTailwind: 10
};

const profiles = {
  narrowbody: {
    commercial: 1,
    takeoffMinRunwayLength: 5900,
    landingMinRunwayLength: 5000,
    ceiling: 41,
    topSpeed: 330,
    landingSpeed: 140,
    minSpeed: 155,
    climbSpeed: 1,
    descendSpeed: 1,
    accelerationSpeed: 1,
    deAccelerationSpeed: 1,
    turningRate: [5.5, 3.5, 2.2],
    class: 'medium',
    rarity: 0.25,
    maxCrosswind: 33
  },
  regionalJet: {
    commercial: 1,
    takeoffMinRunwayLength: 5000,
    landingMinRunwayLength: 4400,
    ceiling: 41,
    topSpeed: 315,
    landingSpeed: 128,
    minSpeed: 145,
    climbSpeed: 1.15,
    descendSpeed: 1.05,
    accelerationSpeed: 1.15,
    deAccelerationSpeed: 1.15,
    turningRate: [6.5, 4.2, 2.7],
    class: 'medium',
    rarity: 0.16,
    maxCrosswind: 30
  },
  widebody: {
    commercial: 1,
    takeoffMinRunwayLength: 7400,
    landingMinRunwayLength: 6000,
    ceiling: 43,
    topSpeed: 335,
    landingSpeed: 148,
    minSpeed: 165,
    climbSpeed: 0.82,
    descendSpeed: 0.92,
    accelerationSpeed: 0.7,
    deAccelerationSpeed: 0.78,
    turningRate: [4.5, 2.8, 1.7],
    class: 'heavy',
    rarity: 0.12,
    maxCrosswind: 38
  },
  super: {
    commercial: 1,
    takeoffMinRunwayLength: 9000,
    landingMinRunwayLength: 7000,
    ceiling: 43,
    topSpeed: 330,
    landingSpeed: 152,
    minSpeed: 175,
    climbSpeed: 0.65,
    descendSpeed: 0.82,
    accelerationSpeed: 0.58,
    deAccelerationSpeed: 0.7,
    turningRate: [4, 2.4, 1.4],
    class: 'super',
    rarity: 0.05,
    maxCrosswind: 40
  },
  regionalTurboprop: {
    commercial: 1,
    takeoffMinRunwayLength: 3900,
    landingMinRunwayLength: 3300,
    ceiling: 25,
    topSpeed: 275,
    landingSpeed: 105,
    minSpeed: 120,
    climbSpeed: 0.88,
    descendSpeed: 0.95,
    accelerationSpeed: 0.9,
    deAccelerationSpeed: 1.05,
    turningRate: [7, 5, 3],
    class: 'medium',
    rarity: 0.14,
    maxCrosswind: 30
  },
  businessJet: {
    commercial: 0.25,
    ga: 1,
    takeoffMinRunwayLength: 3900,
    landingMinRunwayLength: 3200,
    ceiling: 45,
    topSpeed: 350,
    landingSpeed: 112,
    minSpeed: 130,
    climbSpeed: 1.3,
    descendSpeed: 1.15,
    accelerationSpeed: 1.35,
    deAccelerationSpeed: 1.25,
    turningRate: [7, 4.5, 2.8],
    class: 'medium',
    rarity: 0.06,
    maxCrosswind: 25
  },
  utilityTurboprop: {
    commercial: 0.2,
    ga: 1,
    takeoffMinRunwayLength: 2600,
    landingMinRunwayLength: 2200,
    ceiling: 30,
    topSpeed: 260,
    landingSpeed: 88,
    minSpeed: 105,
    climbSpeed: 0.9,
    descendSpeed: 0.9,
    accelerationSpeed: 0.9,
    deAccelerationSpeed: 1.05,
    turningRate: [8, 5.5, 3.2],
    class: 'light',
    rarity: 0.08,
    maxCrosswind: 20
  },
  pistonTwin: {
    ga: 1,
    takeoffMinRunwayLength: 2600,
    landingMinRunwayLength: 2200,
    ceiling: 20,
    topSpeed: 190,
    landingSpeed: 82,
    minSpeed: 95,
    climbSpeed: 0.65,
    descendSpeed: 0.72,
    accelerationSpeed: 0.72,
    deAccelerationSpeed: 0.88,
    turningRate: [8, 5.5, 3.5],
    class: 'light',
    rarity: 0.18,
    maxCrosswind: 20,
    maxTailwind: 7
  },
  piston: {
    ga: 1,
    takeoffMinRunwayLength: 1800,
    landingMinRunwayLength: 1500,
    ceiling: 14,
    topSpeed: 125,
    landingSpeed: 62,
    minSpeed: 75,
    climbSpeed: 0.42,
    descendSpeed: 0.58,
    accelerationSpeed: 0.55,
    deAccelerationSpeed: 0.72,
    turningRate: [9, 6, 4],
    class: 'light',
    rarity: 0.35,
    maxCrosswind: 15,
    maxTailwind: 5
  },
  pistonFast: {
    ga: 1,
    takeoffMinRunwayLength: 2200,
    landingMinRunwayLength: 1900,
    ceiling: 20,
    topSpeed: 180,
    landingSpeed: 75,
    minSpeed: 90,
    climbSpeed: 0.58,
    descendSpeed: 0.66,
    accelerationSpeed: 0.68,
    deAccelerationSpeed: 0.82,
    turningRate: [8.5, 5.7, 3.7],
    class: 'light',
    rarity: 0.22,
    maxCrosswind: 20,
    maxTailwind: 7
  }
};

const aircraft = (...parts) => Object.assign({}, defaults, ...parts);

const refinements = {
  0: aircraft(profiles.narrowbody, {
    name: 'Boeing 737-700',
    takeoffMinRunwayLength: 5600,
    landingMinRunwayLength: 4700,
    rarity: 0.45
  }),
  1: aircraft(profiles.widebody, {
    name: 'Boeing 747-400',
    takeoffMinRunwayLength: 8300,
    landingMinRunwayLength: 6800,
    ceiling: 45,
    rarity: 0.08
  }),
  2: aircraft(profiles.narrowbody, {
    name: 'Boeing 757-200',
    topSpeed: 340,
    climbSpeed: 1.15,
    rarity: 0.12
  }),
  3: aircraft(profiles.widebody, {
    name: 'Boeing 767-300',
    takeoffMinRunwayLength: 7000,
    landingMinRunwayLength: 5600,
    rarity: 0.13
  }),
  4: aircraft(profiles.widebody, {
    name: 'Boeing 777-200',
    takeoffMinRunwayLength: 8000,
    landingMinRunwayLength: 6500,
    rarity: 0.14
  }),
  5: aircraft(profiles.super, {
    name: 'Airbus A380-800',
    shortName: 'A380',
    takeoffMinRunwayLength: 9020,
    landingMinRunwayLength: 6900,
    rarity: 0.035
  }),
  6: aircraft(profiles.widebody, {
    name: 'Airbus A330-300',
    ceiling: 41,
    rarity: 0.18
  }),
  7: aircraft(profiles.widebody, {
    name: 'Boeing 787-9 Dreamliner',
    shortName: 'B789',
    takeoffMinRunwayLength: 7600,
    climbSpeed: 0.92,
    rarity: 0.14
  }),
  8: aircraft(profiles.narrowbody, {
    takeoffMinRunwayLength: 5300,
    landingMinRunwayLength: 4500,
    climbSpeed: 1.1,
    rarity: 0.18
  }),
  9: aircraft(profiles.narrowbody, { rarity: 0.5 }),
  10: aircraft(profiles.narrowbody, {
    takeoffMinRunwayLength: 6600,
    landingMinRunwayLength: 5400,
    climbSpeed: 0.92,
    rarity: 0.32
  }),
  11: aircraft(profiles.widebody, {
    name: 'Airbus A350-900',
    shortName: 'A359',
    takeoffMinRunwayLength: 7600,
    climbSpeed: 0.9,
    rarity: 0.12
  }),
  12: aircraft(profiles.regionalJet, {
    takeoffMinRunwayLength: 5200,
    rarity: 0.08
  }),
  13: aircraft(profiles.narrowbody, {
    name: 'McDonnell Douglas MD-88',
    shortName: 'MD88',
    topSpeed: 315,
    climbSpeed: 0.88,
    rarity: 0.06
  }),
  14: aircraft(profiles.narrowbody, {
    name: 'McDonnell Douglas MD-90',
    shortName: 'MD90',
    topSpeed: 315,
    climbSpeed: 0.9,
    rarity: 0.04
  }),
  15: aircraft(profiles.regionalJet, {
    name: 'Embraer E190',
    shortName: 'E190',
    rarity: 0.2
  }),
  16: aircraft(profiles.narrowbody, {
    name: 'McDonnell Douglas MD-82',
    shortName: 'MD82',
    topSpeed: 310,
    climbSpeed: 0.86,
    rarity: 0.05
  }),
  17: aircraft(profiles.narrowbody, {
    name: 'McDonnell Douglas MD-83',
    shortName: 'MD83',
    topSpeed: 310,
    climbSpeed: 0.86,
    rarity: 0.05
  }),
  18: aircraft(profiles.widebody, {
    name: 'Airbus A340-300',
    takeoffMinRunwayLength: 8200,
    climbSpeed: 0.68,
    rarity: 0.045
  }),
  19: aircraft(profiles.piston, {
    name: 'Cessna 172 Skyhawk',
    shortName: 'C172',
    ceiling: 14,
    topSpeed: 124,
    landingSpeed: 61,
    minSpeed: 72,
    rarity: 0.5,
    maxCrosswind: 15
  }),
  20: aircraft(profiles.regionalTurboprop, {
    name: 'Beechcraft 1900D',
    shortName: 'B190',
    commercial: 0.65,
    ga: 0.2,
    takeoffMinRunwayLength: 3700,
    landingMinRunwayLength: 2800,
    topSpeed: 280,
    class: 'light',
    rarity: 0.08
  }),
  21: aircraft(profiles.widebody, {
    name: 'McDonnell Douglas MD-11F',
    takeoffMinRunwayLength: 8200,
    landingMinRunwayLength: 6500,
    climbSpeed: 0.72,
    rarity: 0.04
  }),
  22: aircraft(profiles.regionalTurboprop, {
    name: 'ATR 42-600',
    shortName: 'AT46',
    takeoffMinRunwayLength: 3600,
    landingMinRunwayLength: 3200,
    topSpeed: 265,
    rarity: 0.13
  }),
  23: aircraft(profiles.regionalTurboprop, {
    name: 'ATR 72-600',
    shortName: 'ATR72',
    takeoffMinRunwayLength: 4400,
    landingMinRunwayLength: 3600,
    topSpeed: 275,
    climbSpeed: 0.82,
    rarity: 0.2
  }),
  24: aircraft(profiles.pistonFast, {
    name: 'Beechcraft Bonanza G36',
    shortName: 'BE36',
    topSpeed: 176,
    rarity: 0.22
  }),
  25: aircraft(profiles.utilityTurboprop, {
    name: 'de Havilland Canada DHC-6 Twin Otter',
    shortName: 'DHC6',
    takeoffMinRunwayLength: 1800,
    landingMinRunwayLength: 1600,
    ceiling: 25,
    topSpeed: 170,
    landingSpeed: 80,
    minSpeed: 95,
    rarity: 0.12
  }),
  26: aircraft(profiles.pistonFast, {
    name: 'Cirrus SR22',
    shortName: 'SR22',
    topSpeed: 183,
    ceiling: 18,
    rarity: 0.3
  }),
  27: aircraft(profiles.piston, {
    name: 'Cirrus SR20',
    shortName: 'SR20',
    topSpeed: 155,
    ceiling: 18,
    rarity: 0.24
  }),
  28: aircraft(profiles.piston, {
    name: 'Diamond DA20 Katana',
    shortName: 'DA20',
    topSpeed: 138,
    landingSpeed: 58,
    minSpeed: 70,
    rarity: 0.2
  }),
  29: aircraft(profiles.pistonFast, {
    name: 'Diamond DA40 Star',
    shortName: 'DA40',
    topSpeed: 154,
    landingSpeed: 66,
    minSpeed: 78,
    rarity: 0.25
  }),
  30: aircraft(profiles.pistonFast, {
    name: 'Mooney M20',
    shortName: 'M20P',
    topSpeed: 190,
    rarity: 0.18
  }),
  31: aircraft(profiles.piston, {
    name: 'Robin DR400',
    shortName: 'DR40',
    topSpeed: 140,
    rarity: 0.2
  }),
  32: aircraft(profiles.utilityTurboprop, {
    name: 'GippsAero GA8 Airvan',
    shortName: 'GA8',
    takeoffMinRunwayLength: 1700,
    landingMinRunwayLength: 1500,
    ceiling: 20,
    topSpeed: 135,
    landingSpeed: 65,
    minSpeed: 78,
    rarity: 0.16
  })
};

const additionalAirplanes = [
  aircraft(profiles.narrowbody, {
    id: 100,
    name: 'Boeing 737-800',
    shortName: 'B738',
    operators: [0, 1, 3, 4, 5, 6, 9, 10, 11, 13, 14, 22, 23, 25],
    rarity: 0.48
  }),
  aircraft(profiles.narrowbody, {
    id: 101,
    name: 'Boeing 737-900ER',
    shortName: 'B739',
    takeoffMinRunwayLength: 7500,
    landingMinRunwayLength: 5700,
    climbSpeed: 0.9,
    operators: [1, 3, 5, 14],
    rarity: 0.18
  }),
  aircraft(profiles.narrowbody, {
    id: 102,
    name: 'Boeing 737 MAX 8',
    shortName: 'B38M',
    takeoffMinRunwayLength: 6500,
    operators: [1, 3, 4, 13, 14, 25],
    rarity: 0.22
  }),
  aircraft(profiles.narrowbody, {
    id: 103,
    name: 'Boeing 737 MAX 9',
    shortName: 'B39M',
    takeoffMinRunwayLength: 7200,
    landingMinRunwayLength: 5600,
    climbSpeed: 0.92,
    operators: [1, 3, 14],
    rarity: 0.1
  }),
  aircraft(profiles.widebody, {
    id: 104,
    name: 'Boeing 747-8',
    shortName: 'B748',
    takeoffMinRunwayLength: 8600,
    landingMinRunwayLength: 6800,
    ceiling: 43,
    climbSpeed: 0.7,
    operators: [8, 10, 20, 21],
    rarity: 0.035
  }),
  aircraft(profiles.widebody, {
    id: 105,
    name: 'Boeing 777-300ER',
    shortName: 'B77W',
    takeoffMinRunwayLength: 8400,
    landingMinRunwayLength: 6800,
    climbSpeed: 0.75,
    operators: [6, 9, 10, 12, 15, 18, 19, 20, 22],
    rarity: 0.11
  }),
  aircraft(profiles.widebody, {
    id: 106,
    name: 'Boeing 787-10 Dreamliner',
    shortName: 'B78X',
    takeoffMinRunwayLength: 8200,
    landingMinRunwayLength: 6200,
    climbSpeed: 0.85,
    operators: [0, 3, 6, 10, 12, 20],
    rarity: 0.08
  }),
  aircraft(profiles.narrowbody, {
    id: 107,
    name: 'Airbus A320neo',
    shortName: 'A20N',
    takeoffMinRunwayLength: 5700,
    operators: [0, 1, 2, 6, 9, 10, 11, 14, 22, 25, 26, 27],
    rarity: 0.34
  }),
  aircraft(profiles.narrowbody, {
    id: 108,
    name: 'Airbus A321neo',
    shortName: 'A21N',
    takeoffMinRunwayLength: 6800,
    landingMinRunwayLength: 5500,
    climbSpeed: 0.92,
    operators: [0, 1, 5, 6, 9, 14, 22, 25, 26, 27],
    rarity: 0.25
  }),
  aircraft(profiles.widebody, {
    id: 109,
    name: 'Airbus A350-1000',
    shortName: 'A35K',
    takeoffMinRunwayLength: 8200,
    landingMinRunwayLength: 6500,
    climbSpeed: 0.82,
    operators: [6, 18, 19, 30],
    rarity: 0.055
  }),
  aircraft(profiles.regionalJet, {
    id: 110,
    name: 'Airbus A220-100',
    shortName: 'BCS1',
    takeoffMinRunwayLength: 4800,
    landingMinRunwayLength: 4200,
    operators: [1],
    rarity: 0.1
  }),
  aircraft(profiles.regionalJet, {
    id: 111,
    name: 'Airbus A220-300',
    shortName: 'BCS3',
    takeoffMinRunwayLength: 5200,
    operators: [1, 9],
    rarity: 0.16
  }),
  aircraft(profiles.regionalJet, {
    id: 112,
    name: 'Embraer E170',
    shortName: 'E170',
    takeoffMinRunwayLength: 4700,
    operators: [1, 3, 5, 32],
    rarity: 0.12
  }),
  aircraft(profiles.regionalJet, {
    id: 113,
    name: 'Embraer E175',
    shortName: 'E75L',
    takeoffMinRunwayLength: 5000,
    operators: [1, 3, 5],
    rarity: 0.2
  }),
  aircraft(profiles.regionalJet, {
    id: 114,
    name: 'Embraer E195-E2',
    shortName: 'E295',
    takeoffMinRunwayLength: 5900,
    landingMinRunwayLength: 4700,
    topSpeed: 320,
    operators: [0, 9],
    rarity: 0.14
  }),
  aircraft(profiles.regionalJet, {
    id: 115,
    name: 'Bombardier CRJ200',
    shortName: 'CRJ2',
    takeoffMinRunwayLength: 5800,
    topSpeed: 305,
    climbSpeed: 1,
    operators: [1, 3],
    rarity: 0.11
  }),
  aircraft(profiles.regionalJet, {
    id: 116,
    name: 'Bombardier CRJ700',
    shortName: 'CRJ7',
    takeoffMinRunwayLength: 5300,
    operators: [1, 3],
    rarity: 0.14
  }),
  aircraft(profiles.regionalJet, {
    id: 117,
    name: 'Bombardier CRJ900',
    shortName: 'CRJ9',
    takeoffMinRunwayLength: 5800,
    landingMinRunwayLength: 4800,
    operators: [1, 3],
    rarity: 0.16
  }),
  aircraft(profiles.regionalJet, {
    id: 118,
    name: 'Bombardier CRJ1000',
    shortName: 'CRJX',
    takeoffMinRunwayLength: 6400,
    landingMinRunwayLength: 5000,
    climbSpeed: 1,
    operators: [9, 27],
    rarity: 0.07
  }),
  aircraft(profiles.regionalTurboprop, {
    id: 119,
    name: 'De Havilland Canada Dash 8-400',
    shortName: 'DH8D',
    takeoffMinRunwayLength: 4600,
    landingMinRunwayLength: 4200,
    topSpeed: 285,
    operators: [32],
    rarity: 0.16
  }),
  aircraft(profiles.regionalTurboprop, {
    id: 120,
    name: 'Saab 340B',
    shortName: 'SF34',
    takeoffMinRunwayLength: 4300,
    landingMinRunwayLength: 3500,
    ceiling: 25,
    topSpeed: 260,
    class: 'light',
    operators: [32],
    rarity: 0.08
  }),
  aircraft(profiles.regionalTurboprop, {
    id: 121,
    name: 'Fokker 50',
    shortName: 'F50',
    takeoffMinRunwayLength: 4300,
    landingMinRunwayLength: 3600,
    ceiling: 25,
    topSpeed: 270,
    operators: [0, 32],
    rarity: 0.07
  }),
  aircraft(profiles.utilityTurboprop, {
    id: 122,
    name: 'Cessna 208B Grand Caravan',
    shortName: 'C208',
    takeoffMinRunwayLength: 2200,
    landingMinRunwayLength: 1900,
    ceiling: 25,
    topSpeed: 185,
    landingSpeed: 78,
    minSpeed: 92,
    rarity: 0.17
  }),
  aircraft(profiles.utilityTurboprop, {
    id: 123,
    name: 'Pilatus PC-12',
    shortName: 'PC12',
    takeoffMinRunwayLength: 2700,
    landingMinRunwayLength: 2300,
    ceiling: 30,
    topSpeed: 285,
    landingSpeed: 82,
    minSpeed: 100,
    rarity: 0.14
  }),
  aircraft(profiles.utilityTurboprop, {
    id: 124,
    name: 'Beechcraft King Air 200',
    shortName: 'BE20',
    takeoffMinRunwayLength: 3100,
    landingMinRunwayLength: 2800,
    ceiling: 35,
    topSpeed: 290,
    landingSpeed: 96,
    minSpeed: 112,
    rarity: 0.12
  }),
  aircraft(profiles.businessJet, {
    id: 125,
    name: 'Cessna Citation CJ4',
    shortName: 'CJ4',
    takeoffMinRunwayLength: 3410,
    landingMinRunwayLength: 2940,
    topSpeed: 350,
    climbSpeed: 1.45,
    rarity: 0.12
  }),
  aircraft(profiles.businessJet, {
    id: 126,
    name: 'Cessna Citation Latitude',
    shortName: 'C68A',
    takeoffMinRunwayLength: 3900,
    landingMinRunwayLength: 3600,
    ceiling: 45,
    topSpeed: 345,
    rarity: 0.08
  }),
  aircraft(profiles.businessJet, {
    id: 127,
    name: 'Embraer Phenom 300',
    shortName: 'E55P',
    takeoffMinRunwayLength: 3200,
    landingMinRunwayLength: 2700,
    topSpeed: 355,
    climbSpeed: 1.5,
    rarity: 0.11
  }),
  aircraft(profiles.businessJet, {
    id: 128,
    name: 'Gulfstream G650',
    shortName: 'GLF6',
    takeoffMinRunwayLength: 5900,
    landingMinRunwayLength: 4200,
    ceiling: 51,
    topSpeed: 370,
    climbSpeed: 1.25,
    class: 'heavy',
    rarity: 0.035,
    maxCrosswind: 30
  }),
  aircraft(profiles.businessJet, {
    id: 129,
    name: 'Bombardier Challenger 350',
    shortName: 'CL35',
    takeoffMinRunwayLength: 4800,
    landingMinRunwayLength: 3900,
    topSpeed: 350,
    rarity: 0.07
  }),
  aircraft(profiles.businessJet, {
    id: 130,
    name: 'Pilatus PC-24',
    shortName: 'PC24',
    takeoffMinRunwayLength: 3000,
    landingMinRunwayLength: 2700,
    topSpeed: 350,
    rarity: 0.08
  }),
  aircraft(profiles.businessJet, {
    id: 131,
    name: 'Cessna Citation X',
    shortName: 'C750',
    takeoffMinRunwayLength: 5200,
    landingMinRunwayLength: 4300,
    ceiling: 51,
    topSpeed: 380,
    rarity: 0.045
  }),
  aircraft(profiles.businessJet, {
    id: 132,
    name: 'Dassault Falcon 50',
    shortName: 'FA50',
    takeoffMinRunwayLength: 4900,
    landingMinRunwayLength: 3900,
    ceiling: 49,
    topSpeed: 355,
    rarity: 0.045
  }),
  aircraft(profiles.pistonTwin, {
    id: 133,
    name: 'Diamond DA62',
    shortName: 'DA62',
    takeoffMinRunwayLength: 2900,
    landingMinRunwayLength: 2556,
    ceiling: 20,
    topSpeed: 192,
    landingSpeed: 68,
    minSpeed: 82,
    climbSpeed: 0.7,
    rarity: 0.22,
    maxCrosswind: 25
  }),
  aircraft(profiles.piston, {
    id: 134,
    name: 'Cessna 182 Skylane',
    shortName: 'C182',
    takeoffMinRunwayLength: 1800,
    landingMinRunwayLength: 1600,
    ceiling: 18,
    topSpeed: 145,
    landingSpeed: 64,
    minSpeed: 75,
    rarity: 0.24
  }),
  aircraft(profiles.piston, {
    id: 135,
    name: 'Cessna 206 Stationair',
    shortName: 'C206',
    takeoffMinRunwayLength: 2000,
    landingMinRunwayLength: 1800,
    ceiling: 16,
    topSpeed: 142,
    landingSpeed: 65,
    minSpeed: 77,
    rarity: 0.18
  }),
  aircraft(profiles.piston, {
    id: 136,
    name: 'Piper PA-28 Archer',
    shortName: 'P28A',
    takeoffMinRunwayLength: 1900,
    landingMinRunwayLength: 1600,
    ceiling: 14,
    topSpeed: 128,
    landingSpeed: 60,
    minSpeed: 72,
    rarity: 0.28
  }),
  aircraft(profiles.pistonFast, {
    id: 137,
    name: 'Daher TBM 900',
    shortName: 'TBM9',
    takeoffMinRunwayLength: 2400,
    landingMinRunwayLength: 2200,
    ceiling: 31,
    topSpeed: 330,
    landingSpeed: 85,
    minSpeed: 105,
    climbSpeed: 1.05,
    rarity: 0.12,
    maxCrosswind: 20
  }),
  aircraft(profiles.pistonFast, {
    id: 138,
    name: 'Piper M600',
    shortName: 'P46T',
    takeoffMinRunwayLength: 2600,
    landingMinRunwayLength: 2300,
    ceiling: 30,
    topSpeed: 275,
    landingSpeed: 82,
    minSpeed: 100,
    climbSpeed: 0.9,
    rarity: 0.1
  }),
  aircraft(profiles.pistonTwin, {
    id: 139,
    name: 'Beechcraft Baron G58',
    shortName: 'BE58',
    takeoffMinRunwayLength: 2500,
    landingMinRunwayLength: 2200,
    ceiling: 21,
    topSpeed: 202,
    rarity: 0.14
  }),
  aircraft(profiles.pistonFast, {
    id: 140,
    name: 'Columbia 400',
    shortName: 'COL4',
    takeoffMinRunwayLength: 2100,
    landingMinRunwayLength: 1800,
    ceiling: 25,
    topSpeed: 235,
    landingSpeed: 78,
    minSpeed: 92,
    rarity: 0.09
  }),
  aircraft(profiles.pistonFast, {
    id: 141,
    name: 'Van’s RV-10',
    shortName: 'RV10',
    takeoffMinRunwayLength: 1600,
    landingMinRunwayLength: 1400,
    ceiling: 20,
    topSpeed: 175,
    landingSpeed: 65,
    minSpeed: 78,
    rarity: 0.12
  }),
  aircraft(profiles.widebody, {
    id: 142,
    name: 'Airbus A300-600F',
    shortName: 'A306',
    takeoffMinRunwayLength: 7600,
    landingMinRunwayLength: 5900,
    ceiling: 39,
    topSpeed: 325,
    climbSpeed: 0.74,
    operators: [16, 17, 31],
    rarity: 0.04
  }),
  aircraft(profiles.widebody, {
    id: 143,
    name: 'Boeing 767-300F',
    shortName: 'B763',
    takeoffMinRunwayLength: 7500,
    landingMinRunwayLength: 5800,
    operators: [16, 17, 31],
    rarity: 0.08
  }),
  aircraft(profiles.widebody, {
    id: 144,
    name: 'Boeing 777F',
    shortName: 'B77L',
    takeoffMinRunwayLength: 8300,
    landingMinRunwayLength: 6500,
    climbSpeed: 0.76,
    operators: [16, 17, 21],
    rarity: 0.045
  }),
  aircraft(profiles.narrowbody, {
    id: 145,
    name: 'Airbus A318',
    shortName: 'A318',
    takeoffMinRunwayLength: 5600,
    landingMinRunwayLength: 4500,
    climbSpeed: 1.08,
    operators: [9],
    rarity: 0.045
  }),
  aircraft(profiles.narrowbody, {
    id: 146,
    name: 'Boeing 727-200',
    shortName: 'B722',
    takeoffMinRunwayLength: 7200,
    landingMinRunwayLength: 5600,
    ceiling: 42,
    topSpeed: 325,
    climbSpeed: 0.78,
    operators: [16, 17],
    rarity: 0.025
  }),
  aircraft(profiles.regionalJet, {
    id: 147,
    name: 'Fokker 100',
    shortName: 'F100',
    takeoffMinRunwayLength: 5600,
    landingMinRunwayLength: 4800,
    topSpeed: 310,
    climbSpeed: 0.95,
    operators: [9, 32],
    rarity: 0.05
  })
];

const builtInAirplanes = legacyAirplanes
  .map(model =>
    aircraft(model, refinements[model.id], { operators: model.operators })
  )
  .concat(additionalAirplanes);

const validateBuiltInAirplanes = models => {
  const ids = new Set();
  const shortNames = new Set();
  models.forEach(model => {
    const valid =
      Number.isInteger(model.id) &&
      typeof model.name === 'string' &&
      model.name.length > 0 &&
      typeof model.shortName === 'string' &&
      model.shortName.length > 0 &&
      model.topSpeed > model.minSpeed &&
      model.topSpeed > model.landingSpeed &&
      model.takeoffMinRunwayLength > 0 &&
      model.landingMinRunwayLength > 0 &&
      model.ceiling > 0 &&
      model.maxCrosswind > 0 &&
      model.maxTailwind > 0 &&
      model.rarity > 0 &&
      Array.isArray(model.turningRate) &&
      model.turningRate.length === 3 &&
      Array.isArray(model.operators);
    if (!valid || ids.has(model.id) || shortNames.has(model.shortName)) {
      throw new Error(`Invalid built-in aircraft definition: ${model.id}`);
    }
    ids.add(model.id);
    shortNames.add(model.shortName);
  });
  return models;
};

export default validateBuiltInAirplanes(builtInAirplanes);
