const { execSync } = require('child_process')
const ghpages = require('gh-pages');

execSync("rm -rf ./dist")
execSync("npm run build")
ghpages.publish('dist', { branch: 'deploy' }, () => true);