#!/bin/env node

import { program } from 'commander'

import { start } from './server.js'

program.name('ph').description('PublicHost CLI.').version('0.0.0')

program.command('start').description('Start listening for incoming requests.').action(start)

program.parse(process.argv)
