const fs = require('fs');
const path = require('path');
const childProcess = require('child_process');

const projectRoot = path.resolve(__dirname, '..');
const sourceTemplatePath = path.join(projectRoot, 'template.html');
const changelogPath = path.join(projectRoot, 'CHANGELOG.md');
const generatedDirectory = path.join(projectRoot, '.cache');
const generatedTemplatePath = path.join(generatedDirectory, 'template.html');

const getCommit = () => {
  if (/^[0-9a-f]{7,40}$/i.test(process.env.BUILD_COMMIT || '')) {
    return process.env.BUILD_COMMIT;
  }
  try {
    const commit = childProcess
      .execFileSync('git', ['rev-parse', '--short', 'HEAD'], {
        cwd: projectRoot,
        encoding: 'utf8',
        stdio: ['ignore', 'pipe', 'ignore']
      })
      .trim();
    return /^[0-9a-f]{7,40}$/i.test(commit) ? commit : 'unknown';
  } catch (error) {
    return 'unknown';
  }
};

const parseSections = releaseBody => {
  const sections = [];
  let section = null;
  releaseBody.split(/\r?\n/).forEach(line => {
    const heading = line.match(/^###\s+(.+)$/);
    if (heading) {
      section = { title: heading[1].trim(), items: [] };
      sections.push(section);
      return;
    }

    const item = line.match(/^-\s+(.+)$/);
    if (item && section) {
      section.items.push(item[1].trim());
      return;
    }

    if (/^\s{2,}\S/.test(line) && section && section.items.length > 0) {
      const lastIndex = section.items.length - 1;
      section.items[lastIndex] += ` ${line.trim()}`;
    }
  });
  return sections.filter(item => item.items.length > 0);
};

const getChangelog = () => {
  const changelog = fs.readFileSync(changelogPath, 'utf8');
  const releasePattern = /^## \[([^\]]+)\](?: - ([^\n]+))?$/gm;
  const matches = Array.from(changelog.matchAll(releasePattern));
  if (matches.length === 0) {
    throw new Error('Unable to find changelog releases.');
  }
  return matches.map((release, index) => {
    const releaseBodyStart = release.index + release[0].length;
    const releaseBodyEnd =
      index + 1 < matches.length ? matches[index + 1].index : changelog.length;
    return {
      version: release[1],
      date: release[2] || null,
      sections: parseSections(
        changelog.slice(releaseBodyStart, releaseBodyEnd)
      )
    };
  });
};

const changelog = getChangelog();
const releaseNotes = changelog[0];
const template = fs
  .readFileSync(sourceTemplatePath, 'utf8')
  .replace('__BUILD_COMMIT__', getCommit())
  .replace(
    '__RELEASE_NOTES__',
    encodeURIComponent(JSON.stringify(releaseNotes))
  );

const templateVersion = template.match(
  /<meta name="application-version" content="([^"]+)"/
);
if (!templateVersion || templateVersion[1] !== releaseNotes.version) {
  throw new Error(
    `Template version and latest changelog release do not match: ` +
    `${templateVersion ? templateVersion[1] : 'missing'} vs ` +
    `${releaseNotes.version}`
  );
}

fs.mkdirSync(generatedDirectory, { recursive: true });
fs.writeFileSync(generatedTemplatePath, template);
