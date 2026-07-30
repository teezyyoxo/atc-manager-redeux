const fs = require('fs');
const path = require('path');
const childProcess = require('child_process');

const projectRoot = path.resolve(__dirname, '..');
const sourceTemplatePath = path.join(projectRoot, 'template.html');
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

const template = fs
  .readFileSync(sourceTemplatePath, 'utf8')
  .replace('__BUILD_COMMIT__', getCommit());

fs.mkdirSync(generatedDirectory, { recursive: true });
fs.writeFileSync(generatedTemplatePath, template);
