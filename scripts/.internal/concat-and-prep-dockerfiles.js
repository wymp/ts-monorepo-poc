#!/bin/env node
const { readFileSync, existsSync, readdirSync, readdir } = require('fs');

let root;
for (let i = 0, cur = process.cwd(); i < 3; i++) {
  if (existsSync(`${cur}/pnpm-workspace.yaml`)) {
    root = cur;
    break;
  }
  cur = `${cur}/..`;
}

if (!root) {
  throw new Error(`Couldn't find repo root. Current working directory: '${process.cwd()}'`);
}

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

const pkgs = [
  ...readdirSync(`${root}/apps`).map(n => `./apps/${n}`),
  ...readdirSync(`${root}/libs`).map(n => `./libs/${n}`),
];
const mounts = pkgs
  .map(pkg => `--mount=type=bind,source=/${pkg}/package.json,target=${pkg}/package.json \\`)
  .join('\n  ');

process.stdout.write(
  dockerfileTemplate
    .replace(/##PACKAGE_MOUNTS##/g, mounts)
);
