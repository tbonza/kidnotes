#!/usr/bin/env node

import { Command } from 'commander';

import { appMain } from './app';


const program = new Command();


program
  .name('manage')
  .description('Manage web application')
  .version('0.0.1');

program.command('runserver')
  .description('run application server')
  .action( (arg, options) => { 
    appMain();
  });

program.parse();
