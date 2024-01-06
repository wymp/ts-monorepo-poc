#!/bin/env node
const { readFileSync, existsSync, readdirSync, readdir } = require('fs');

const files = [];
for (let i = 2; i < process.argv.length; i++) {
  if (!existsSync(process.argv[i])) {
    console.error(`The dockerfile template you provided ('${file}') does not exist. (PWD: ${process.cwd()})`);
    process.exit(1);
  }
  files.push(process.argv[i]);
}

if (files.length === 0) {
  console.error(`You must provide a dockerfile template as the first argument to this script.`);
  process.exit(1);
}

let dockerfileTemplate = files.map(f => readFileSync(f, 'utf8')).join('\n\n');

const pkgs = [ ...readdirSync('apps').map(n => `./apps/${n}`), ...readdirSync('libs').map(n => `./libs/${n}`) ];
const mounts = pkgs
  .map(pkg => `--mount=type=bind,source=/${pkg}/package.json,target=${pkg}/package.json \\`)
  .join('\n  ');

process.stdout.write(
  dockerfileTemplate
    .replace(/##PACKAGE_MOUNTS##/g, mounts)
);
