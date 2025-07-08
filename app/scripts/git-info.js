const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

try {
    // Get last commit ISO date string
    const lastCommit = execSync('git log -1 --format=%cd --date=iso').toString().trim();
    const outFile = path.join(__dirname, '../renderer/git-info.json');
    fs.writeFileSync(outFile, JSON.stringify({ lastCommit }, null, 2));
    console.log('Wrote git-info.json with last commit date:', lastCommit);
} catch (e) {
    console.error('Could not get last git commit date:', e);
    // Still write a default
    fs.writeFileSync(
        path.join(__dirname, '../renderer/git-info.json'),
        JSON.stringify({ lastCommit: null }, null, 2)
    );
}
