#!/bin/env node

import { program } from 'commander'

import { start } from './server.js'

program.name('fire').description('FirePT').version('0.1.0')

program.command('start').description('Start FirePT to APIfy your current directory.').action(start)

program.parse(process.argv)
