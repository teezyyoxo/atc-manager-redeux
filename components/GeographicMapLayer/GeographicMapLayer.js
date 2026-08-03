import { Component } from 'preact';
import GameStore from '../../stores/GameStore';
import SettingsStore from '../../stores/SettingsStore';
import config from '../../lib/config';
import geographicViewports from '../../lib/maps/geographic-viewports';

const EARTH_CIRCUMFERENCE_METERS = 40075016.686;
const METERS_PER_SCOPE_UNIT = 1609.344 / 5;
const TILE_PIXELS = 256;

const sources = {
  street: {
    url: (z, x, y) => `https://tile.openstreetmap.org/${z}/${x}/${y}.png`,
    attribution: '© OpenStreetMap contributors',
    attributionUrl: 'https://www.openstreetmap.org/copyright',
    tintOpacity: 0.28
  },
  terrain: {
    url: (z, x, y) => `https://tile.opentopomap.org/${z}/${x}/${y}.png`,
    attribution: '© OpenStreetMap contributors · OpenTopoMap (CC-BY-SA)',
    attributionUrl: 'https://opentopomap.org/about',
    tintOpacity: 0.24
  },
  satellite: {
    url: (z, x, y) =>
      `https://server.arcgisonline.com/ArcGIS/rest/services/` +
      `World_Imagery/MapServer/tile/${z}/${y}/${x}`,
    attribution: '© Esri, Maxar, Earthstar Geographics, GIS User Community',
    attributionUrl: 'https://www.arcgis.com/home/item.html?id=10df2279f9684e4a9f6a7f08febac2a9',
    tintOpacity: 0.34
  }
};

const mercatorPixel = (latitude, longitude, zoom) => {
  const worldSize = TILE_PIXELS * Math.pow(2, zoom);
  const sinLatitude = Math.sin(latitude * Math.PI / 180);
  return {
    x: (longitude + 180) / 360 * worldSize,
    y: (.5 - Math.log((1 + sinLatitude) / (1 - sinLatitude)) /
      (4 * Math.PI)) * worldSize
  };
};

class GeographicMapLayer extends Component {
  render() {
    const mode = SettingsStore.mapView;
    const source = sources[mode];
    const viewport = geographicViewports[GameStore.id];
    if (!source || !viewport) return null;

    const zoom = Math.max(1, GameStore.zoom || 1);
    const tileZoom = Math.min(18, 8 + Math.round(Math.log(zoom) / Math.LN2));
    const center = mercatorPixel(
      viewport.latitude,
      viewport.longitude,
      tileZoom
    );
    const tileGroundMeters =
      Math.cos(viewport.latitude * Math.PI / 180) *
      EARTH_CIRCUMFERENCE_METERS / Math.pow(2, tileZoom);
    const tileSize = tileGroundMeters / METERS_PER_SCOPE_UNIT;
    const centerTileX = Math.floor(center.x / TILE_PIXELS);
    const centerTileY = Math.floor(center.y / TILE_PIXELS);
    const tileOffsetX = center.x / TILE_PIXELS - centerTileX;
    const tileOffsetY = center.y / TILE_PIXELS - centerTileY;
    const xRadius = Math.ceil(config.width / (2 * zoom * tileSize)) + 1;
    const yRadius = Math.ceil(config.height / (2 * zoom * tileSize)) + 1;
    const tileLimit = Math.pow(2, tileZoom);
    const tiles = [];

    for (let offsetY = -yRadius; offsetY <= yRadius; offsetY++) {
      const tileY = centerTileY + offsetY;
      if (tileY < 0 || tileY >= tileLimit) continue;
      for (let offsetX = -xRadius; offsetX <= xRadius; offsetX++) {
        const unwrappedX = centerTileX + offsetX;
        const tileX = ((unwrappedX % tileLimit) + tileLimit) % tileLimit;
        const x = config.width / 2 + (offsetX - tileOffsetX) * tileSize;
        const y = config.height / 2 + (offsetY - tileOffsetY) * tileSize;
        const url = source.url(tileZoom, tileX, tileY);
        tiles.push(
          <image
            key={`${tileZoom}-${unwrappedX}-${tileY}`}
            href={url}
            xlinkHref={url}
            x={x}
            y={y}
            width={tileSize + .5}
            height={tileSize + .5}
            preserveAspectRatio="none"
          />
        );
      }
    }

    const transform =
      `translate(${config.width / 2} ${config.height / 2}) ` +
      `scale(${zoom}) ` +
      `translate(-${config.width / 2} -${config.height / 2})`;

    return (
      <g className={`geographic-map-layer geographic-map-${mode}`}>
        <g transform={transform}>{tiles}</g>
        <rect
          className="geographic-map-tint"
          width={config.width}
          height={config.height}
          fill={SettingsStore.radarColor}
          fill-opacity={source.tintOpacity}
          pointer-events="none"
        />
      </g>
    );
  }
}

export class GeographicMapAttribution extends Component {
  render() {
    const source = sources[SettingsStore.mapView];
    if (!source || !geographicViewports[GameStore.id]) return null;
    return (
      <a
        href={source.attributionUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="geographic-map-attribution"
      >
        <rect
          x={config.width - 550}
          y={config.height - 24}
          width="542"
          height="18"
          rx="3"
        />
        <text
          x={config.width - 14}
          y={config.height - 11}
          text-anchor="end"
        >
          {source.attribution}
        </text>
      </a>
    );
  }
}

export default GeographicMapLayer;
