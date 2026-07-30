const getMetaContent = name => {
  if (typeof document === 'undefined') return null;
  const meta = document.querySelector(`meta[name="${name}"]`);
  return meta ? meta.getAttribute('content') : null;
};

export const getBuildInfo = () => {
  const version = getMetaContent('application-version') || '3.0.0-rc.1';
  const rawCommit = getMetaContent('application-build') || '';
  const commit = /^[0-9a-f]{7,40}$/i.test(rawCommit) ? rawCommit : null;
  return {
    version,
    commit,
    label: commit ? `${version}+${commit}` : version
  };
};
