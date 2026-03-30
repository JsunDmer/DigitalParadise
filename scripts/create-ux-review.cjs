const fs = require('fs');
const path = require('path');

const rootDir = process.cwd();
const templatePath = path.join(rootDir, 'scripts/ux-weekly-metrics-template.json');
const outputDir = path.join(rootDir, 'scripts/ux-reviews');

function getSprintId() {
  const now = new Date();
  const year = now.getFullYear();
  const firstDay = new Date(year, 0, 1);
  const days = Math.floor((now - firstDay) / 86400000);
  const week = Math.ceil((days + firstDay.getDay() + 1) / 7);
  return `${year}-W${String(week).padStart(2, '0')}`;
}

function run() {
  if (!fs.existsSync(templatePath)) {
    throw new Error('Missing template: scripts/ux-weekly-metrics-template.json');
  }

  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const template = JSON.parse(fs.readFileSync(templatePath, 'utf8'));
  template.sprint = getSprintId();

  const fileName = `ux-review-${template.sprint}.json`;
  const outputPath = path.join(outputDir, fileName);
  fs.writeFileSync(outputPath, `${JSON.stringify(template, null, 2)}\n`, 'utf8');

  console.log(`Created ${path.relative(rootDir, outputPath)}`);
}

run();
