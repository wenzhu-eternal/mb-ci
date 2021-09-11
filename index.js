#!/usr/bin/env node
const minimist = require("minimist");
const Cli = require("./lib");

const args = minimist(process.argv.slice(2));

new Cli().run(args);