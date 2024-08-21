#!/bin/env node

import { program } from 'commander'

import { server } from './server.js'

program.name('fire').description('FirePT').version('0.3.1')

program.command('start').description('Start FirePT to APIfy your current directory.').action(server.start)

program.parse(process.argv)
