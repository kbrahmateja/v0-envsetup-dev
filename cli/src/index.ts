#!/usr/bin/env node

import { Command } from 'commander'
import { intro, outro } from '@clack/prompts'
import pc from 'picocolors'
import { initCommand } from './commands/init.js'
import { doctorCommand } from './commands/doctor.js'
import { aiCommand } from './commands/ai.js'
import { newCommand } from './commands/new.js'
import { testAllCommand } from './commands/test-all.js'

const program = new Command()

program
  .name('envsetup')
  .description('Generate dev environments for 21+ languages — Dockerfile, docker-compose, .env in seconds')
  .version('0.5.0')

program
  .command('new')
  .description('Complete project wizard — Docker, docs, user stories, tasks, timeline, IDE config')
  .action(async () => {
    intro(pc.bgBlue(pc.white(' envsetup.dev · Project Wizard ')))
    await newCommand()
  })

program
  .command('init')
  .description('Quick setup — template or guided manual config')
  .option('-a, --ai', 'Use AI recommendations')
  .action(async (options) => {
    intro(pc.bgCyan(pc.black(' envsetup.dev ')))
    await initCommand(options)
    outro(pc.green('Setup complete! Happy coding!'))
  })

program
  .command('ai')
  .description('Natural language project setup — describe and generate')
  .action(async () => {
    intro(pc.bgMagenta(pc.white(' envsetup.dev · AI Mode ')))
    await aiCommand()
  })

program
  .command('doctor')
  .description('Check system prerequisites for your stack')
  .option('-s, --stack <stack>', 'Stack to check: ios-swift, flutter, react-native, expo, fastapi, gin, springboot, rails...')
  .action(async (opts: { stack?: string }) => {
    await doctorCommand(opts.stack)
  })

program
  .command('test-env')
  .description('Check all supported stacks — see what is installed on your system')
  .action(async () => {
    await testAllCommand()
  })

program.parse(process.argv)
