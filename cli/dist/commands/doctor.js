import { spinner } from '@clack/prompts';
import { execSync } from 'child_process';
import pc from 'picocolors';
export async function doctorCommand() {
    const s = spinner();
    s.start('Verifying system prerequisites...');
    const results = [];
    // Check Node.js
    checkDependency('node --version', 'Node.js', results);
    // Check Docker
    checkDependency('docker --version', 'Docker', results);
    // Check Docker Compose
    checkDependency('docker compose version', 'Docker Compose (v2)', results);
    // Check Git
    checkDependency('git --version', 'Git', results);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    s.stop('Prerequisite check finished.');
    console.log(pc.cyan('\nSystem Health Summary:'));
    results.forEach((r) => {
        if (r.status === 'ok') {
            console.log(`${pc.green('✔')} ${pc.bold(r.name)}: ${r.version}`);
        }
        else {
            console.log(`${pc.red('✘')} ${pc.bold(r.name)}: ${pc.red('Not found or error')}`);
            if (r.error)
                console.log(pc.dim(`  Error: ${r.error}`));
        }
    });
    const allOk = results.every(r => r.status === 'ok');
    if (allOk) {
        console.log(pc.green('\n✨ Your system is ready for envsetup.dev!'));
    }
    else {
        console.log(pc.yellow('\n⚠️  Some components are missing. Please install them to use the full power of envsetup.'));
    }
}
function checkDependency(command, name, results) {
    try {
        const output = execSync(command, { stdio: 'pipe' }).toString().trim();
        results.push({ name, status: 'ok', version: output });
    }
    catch (error) {
        results.push({ name, status: 'error', error: error.message });
    }
}
