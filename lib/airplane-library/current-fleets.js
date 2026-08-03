// Built-in operator fleets represented by the aircraft types available in the
// simulator. Regional affiliates are included only when they normally use the
// parent operator's callsign in this simplified traffic model.
//
// Keep every built-in operator id in this table. An empty fleet intentionally
// retires a historical operator without invalidating old saved traffic.
const currentFleetByOperator = {
  0: [0, 4, 6, 7, 10, 15, 100, 101, 106, 108, 113, 114],
  1: [2, 3, 6, 8, 9, 10, 11, 12, 100, 101, 108, 110, 111, 112, 113, 116, 117],
  2: [9, 10, 108, 111],
  3: [0, 2, 3, 4, 7, 8, 9, 100, 101, 102, 103, 105, 106, 108, 113, 116],
  4: [0, 100, 102],
  5: [4, 7, 8, 9, 10, 100, 102, 105, 108, 112, 113, 116, 117],
  6: [4, 5, 7, 8, 9, 10, 105, 106, 107, 108, 109],
  7: [],
  8: [1, 5, 6, 7, 8, 9, 10, 11, 18, 104, 107, 108, 117],
  9: [4, 6, 7, 8, 9, 10, 11, 105, 111],
  10: [0, 4, 6, 7, 8, 9, 10, 11, 100, 102, 105, 107, 108],
  11: [0, 4, 6, 7, 8, 9, 10, 11, 100, 102, 105, 107, 108],
  12: [3, 4, 5, 7, 9, 10, 100, 105, 106, 107, 108],
  13: [100, 102],
  14: [4, 6, 7, 8, 9, 10, 11, 100, 101, 102, 103, 105, 107, 108],
  15: [4, 5, 11, 105],
  16: [2, 22, 23, 122, 142, 143, 144],
  17: [1, 2, 104, 142, 143],
  18: [1, 6, 11, 105, 108, 109],
  19: [4, 5, 6, 7, 9, 10, 11, 105, 109, 144],
  20: [4, 5, 6, 7, 11, 100, 101, 102, 104, 105, 106, 108, 111],
  21: [1, 104],
  22: [0, 1, 6, 7, 8, 9, 10, 11, 100, 102, 104, 105, 107, 108],
  23: [6, 7, 100, 102, 105, 107, 108],
  24: [],
  25: [100, 102],
  26: [6, 8, 9, 10, 11, 15],
  27: [6, 8, 9, 10, 11, 107, 108],
  28: [6, 8, 9, 18],
  29: [6, 11, 107, 108, 114, 117],
  30: [6, 7, 109],
  31: [2, 22, 23, 100, 142, 143, 144],
  32: [15, 112],
  33: [4, 6, 7, 8, 9, 10, 102, 105, 111, 113, 117, 119, 143],
  34: [9, 10, 107, 108]
};

// When an operator leaves its home region, restrict generation to the part of
// its represented fleet used for long-haul flying. This prevents a valid fleet
// type from appearing on an invalid regional mission (for example, a JetBlue
// A220 at Heathrow or a KLM E175 at JFK).
const longHaulFleetByOperator = {
  0: [4, 6, 7, 105, 106],
  1: [3, 6, 11],
  2: [108],
  3: [2, 3, 4, 7, 105, 106],
  4: [],
  5: [4, 7, 105],
  6: [4, 5, 7, 105, 106, 109],
  8: [1, 5, 6, 7, 11, 18, 104],
  9: [4, 6, 7, 11, 105],
  10: [4, 6, 7, 11, 105],
  11: [4, 6, 7, 11, 105],
  12: [3, 4, 5, 7, 105, 106],
  13: [],
  14: [4, 6, 7, 11, 105],
  15: [4, 5, 11, 105],
  18: [1, 6, 11, 105, 109],
  19: [4, 5, 6, 7, 11, 105, 109, 144],
  20: [4, 5, 6, 7, 11, 104, 105, 106],
  22: [1, 4, 6, 7, 11, 104, 105],
  23: [6, 7, 105],
  25: [],
  26: [6, 11],
  27: [6, 11],
  28: [6, 18],
  29: [6, 11, 108],
  30: [6, 7, 109],
  33: [4, 6, 7, 105],
  34: []
};

export const modelAllowedForOperatorAtRegion = (
  modelId,
  operator,
  airportRegion
) => {
  if (
    !operator ||
    !airportRegion ||
    airportRegion === 'global' ||
    !operator.homeRegion ||
    operator.homeRegion === airportRegion ||
    operator.regions.includes('cargo-global')
  ) return true;

  const longHaulFleet = longHaulFleetByOperator[operator.id] || [];
  return longHaulFleet.includes(modelId);
};

export const applyCurrentFleetAssignments = models => {
  const operatorsByModel = {};
  Object.keys(currentFleetByOperator).forEach(operatorId => {
    currentFleetByOperator[operatorId].forEach(modelId => {
      if (!operatorsByModel[modelId]) operatorsByModel[modelId] = [];
      operatorsByModel[modelId].push(Number(operatorId));
    });
  });

  return models.map(model => Object.assign({}, model, {
    operators: operatorsByModel[model.id] || []
  }));
};

export default currentFleetByOperator;
