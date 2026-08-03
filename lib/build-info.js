const getMetaContent = name => {
  if (typeof document === 'undefined') return null;
  const meta = document.querySelector(`meta[name="${name}"]`);
  return meta ? meta.getAttribute('content') : null;
};

export const getBuildInfo = () => {
  const version = getMetaContent('application-version') || '3.0.0-rc.23';
  const rawCommit = getMetaContent('application-build') || '';
  const commit = /^[0-9a-f]{7,40}$/i.test(rawCommit) ? rawCommit : null;
  return {
    version,
    commit,
    label: commit ? `${version}+${commit}` : version
  };
};

export const getReleaseNotes = () => {
  const raw = getMetaContent('application-release-notes');
  if (!raw) return null;
  try {
    const notes = JSON.parse(decodeURIComponent(raw));
    return notes && Array.isArray(notes.sections) ? notes : null;
  } catch (error) {
    console.warn('Unable to read release notes for this build.', error);
    return null;
  }
};
