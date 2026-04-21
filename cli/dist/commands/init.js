import { group, text, select, multiselect, confirm, cancel, spinner } from '@clack/prompts';
import pc from 'picocolors';
import { generateTemplates } from '../utils/templates.js';
export async function initCommand(options) {
    if (options.ai) {
        console.log(pc.yellow('\n✨ AI Mode enabled. Our brain is thinking...'));
    }
    const project = await group({
        name: () => text({
            message: 'What is the name of your project?',
            placeholder: 'my-awesome-app',
            validate: (value) => {
                if (!value)
                    return 'Project name is required';
                return;
            },
        }),
        stack: () => select({
            message: 'Pick your tech stack:',
            options: [
                { value: 'nextjs', label: 'Next.js (React)', hint: 'Recommended' },
                { value: 'fastapi', label: 'FastAPI (Python)' },
                { value: 'express', label: 'Express.js (Node)' },
                { value: 'go', label: 'Go (Gin/Fiber)' },
            ],
        }),
        database: () => select({
            message: 'Choose a database:',
            options: [
                { value: 'postgres', label: 'PostgreSQL' },
                { value: 'mongodb', label: 'MongoDB' },
                { value: 'none', label: 'Not needed' },
            ],
        }),
        tools: () => multiselect({
            message: 'Add additional tools:',
            options: [
                { value: 'redis', label: 'Redis Cache' },
                { value: 'minio', label: 'Minio (S3 Compatible Storage)' },
                { value: 'meilisearch', label: 'Meilisearch (Search Engine)' },
            ],
            required: false,
        }),
        proceed: () => confirm({
            message: 'Ready to generate files?',
        }),
    }, {
        onCancel: () => {
            cancel('Operation cancelled.');
            process.exit(0);
        },
    });
    if (!project.proceed) {
        cancel('Operation cancelled.');
        return;
    }
    const s = spinner();
    s.start('Generating configuration files...');
    await new Promise((resolve) => setTimeout(resolve, 1500)); // Simulate work
    const files = await generateTemplates(project);
    s.stop(pc.green(`Generated ${files.length} files successfully!`));
    console.log(pc.cyan('\nFiles created:'));
    files.forEach(f => console.log(pc.dim(` - ${f}`)));
}
