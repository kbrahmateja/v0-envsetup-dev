#!/usr/bin/env node
import { Command } from 'commander';
import { intro, outro } from '@clack/prompts';
import pc from 'picocolors';
import { initCommand } from './commands/init.js';
import { doctorCommand } from './commands/doctor.js';
const program = new Command();
program
    .name('envsetup')
    .description('Global CLI to standardize development environments')
    .version('1.0.0');
program
    .command('init')
    .description('Initialize a new project environment')
    .option('-a, --ai', 'Use AI to recommend tools and versions')
    .action(async (options) => {
    intro(pc.bgCyan(pc.black(' envsetup.dev ')));
    await initCommand(options);
    outro(pc.green('Setup complete! Happy coding!'));
});
program
    .command('doctor')
    .description('Check system for missing prerequisites')
    .action(async () => {
    await doctorCommand();
});
program.parse(process.argv);
