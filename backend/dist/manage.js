#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const commander_1 = require("commander");
const app_1 = require("./app");
const program = new commander_1.Command();
program
    .name('manage')
    .description('Manage web application')
    .version('0.0.1');
program.command('runserver')
    .description('run application server')
    .action((arg, options) => {
    (0, app_1.appMain)();
});
program.parse();
