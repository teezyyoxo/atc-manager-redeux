const toRadians = degrees => (degrees * Math.PI) / 180;

// METAR wind direction is where the wind comes from. Movement needs the
// opposite vector: where that air mass is travelling.
export const windVector = (directionFrom, speed) => {
  const directionTo = (Number(directionFrom) + 180) % 360;
  const magnitude = Math.max(0, Number(speed) || 0);
  const radians = toRadians(directionTo);
  return {
    x: Math.sin(radians) * magnitude,
    y: Math.cos(radians) * magnitude
  };
};

export const groundVelocity = (
  heading,
  airspeed,
  windDirectionFrom,
  windSpeed,
  windEffect = 1
) => {
  const headingRadians = toRadians(Number(heading) || 0);
  const speed = Math.max(0, Number(airspeed) || 0);
  const wind = windVector(windDirectionFrom, windSpeed);
  const effect = Math.max(0, Math.min(1, Number(windEffect) || 0));
  return {
    x: Math.sin(headingRadians) * speed + wind.x * effect,
    y: Math.cos(headingRadians) * speed + wind.y * effect
  };
};

export const runwayWindComponents = (
  runwayHeading,
  directionFrom,
  speed
) => {
  const delta = toRadians(Number(directionFrom) - Number(runwayHeading));
  const magnitude = Math.max(0, Number(speed) || 0);
  const headwind = Math.cos(delta) * magnitude;
  return {
    crosswind: Math.abs(Math.sin(delta) * magnitude),
    headwind: Math.max(0, headwind),
    tailwind: Math.max(0, -headwind)
  };
};
