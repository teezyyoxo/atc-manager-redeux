import { saveAs } from 'file-saver';

export const isTimelapse = value =>
  !!(
    value &&
    typeof value === 'object' &&
    value.start &&
    typeof value.start === 'object' &&
    typeof value.start.id === 'string' &&
    Array.isArray(value.start.traffic) &&
    Array.isArray(value.patches)
  );

export const parseTimelapse = text => {
  const timelapse = JSON.parse(text);
  if (!isTimelapse(timelapse)) {
    throw new Error('The selected file is not a valid ATC Manager timelapse.');
  }
  return timelapse;
};

const safeFileName = name =>
  (name || 'ATC Manager timelapse')
    .replace(/[<>:"/\\|?*]/g, '-')
    .split('')
    .map(character => (character.charCodeAt(0) < 32 ? '-' : character))
    .join('')
    .trim() || 'ATC Manager timelapse';

export const shareOrDownloadTimelapse = async (timelapse, name) => {
  if (!isTimelapse(timelapse)) throw new Error('No valid timelapse to share.');

  const filename = `${safeFileName(name)}.atc-timelapse.json`;
  const blob = new Blob([JSON.stringify(timelapse)], {
    type: 'application/json'
  });

  if (
    typeof navigator !== 'undefined' &&
    typeof navigator.share === 'function' &&
    typeof navigator.canShare === 'function' &&
    typeof File !== 'undefined'
  ) {
    const file = new File([blob], filename, { type: 'application/json' });
    if (navigator.canShare({ files: [file] })) {
      await navigator.share({
        title: name || 'ATC Manager timelapse',
        text: 'ATC Manager timelapse file',
        files: [file]
      });
      return 'shared';
    }
  }

  saveAs(blob, filename);
  return 'downloaded';
};
