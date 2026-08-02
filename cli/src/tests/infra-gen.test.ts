/**
 * Infrastructure file generation tests
 * Verifies that each infra tool generates the correct files with valid content.
 * Run: npx tsx src/tests/infra-gen.test.ts
 */

import fs from 'fs-extra'
import path from 'path'
import os from 'os'
import { generateInfraFiles } from '../utils/infra-gen.js'

interface TestResult { label: string; ok: boolean; errors: string[] }

async function runTest(
  label: string,
  tools: string[],
  language: string,
  checks: (dir: string) => Promise<string[]>
): Promise<TestResult> {
  const tmpDir = await fs.mkdtemp(path.join(os.tmpdir(), 'envsetup-test-'))
  try {
    await generateInfraFiles(tmpDir, 'myapp', language, tools)
    const errors = await checks(tmpDir)
    return { label, ok: errors.length === 0, errors }
  } finally {
    await fs.remove(tmpDir)
  }
}

async function fileExists(dir: string, rel: string): Promise<boolean> {
  return fs.pathExists(path.join(dir, rel))
}

async function fileContains(dir: string, rel: string, needle: string): Promise<boolean> {
  const content = await fs.readFile(path.join(dir, rel), 'utf-8')
  return content.includes(needle)
}

const tests: Array<() => Promise<TestResult>> = [

  // ── Kubernetes ────────────────────────────────────────────────────────────
  () => runTest('K8s manifests created (Node)', ['kubernetes'], 'typescript', async (dir) => {
    const errors: string[] = []
    for (const f of ['k8s/deployment.yaml','k8s/service.yaml','k8s/ingress.yaml','k8s/hpa.yaml','k8s/secret.yaml']) {
      if (!await fileExists(dir, f)) errors.push(`Missing: ${f}`)
    }
    return errors
  }),

  () => runTest('K8s port = 8000 for Python', ['kubernetes'], 'python', async (dir) => {
    const errors: string[] = []
    if (!await fileContains(dir, 'k8s/deployment.yaml', 'containerPort: 8000'))
      errors.push('Python should use port 8000')
    return errors
  }),

  () => runTest('K8s port = 8080 for Go', ['kubernetes'], 'go', async (dir) => {
    const errors: string[] = []
    if (!await fileContains(dir, 'k8s/deployment.yaml', 'containerPort: 8080'))
      errors.push('Go should use port 8080')
    return errors
  }),

  () => runTest('K8s port = 3000 for TypeScript', ['kubernetes'], 'typescript', async (dir) => {
    const errors: string[] = []
    if (!await fileContains(dir, 'k8s/deployment.yaml', 'containerPort: 3000'))
      errors.push('TypeScript should use port 3000')
    return errors
  }),

  () => runTest('K8s name interpolated correctly', ['kubernetes'], 'typescript', async (dir) => {
    const errors: string[] = []
    if (!await fileContains(dir, 'k8s/deployment.yaml', 'name: myapp'))
      errors.push('deployment.yaml should contain name: myapp')
    if (!await fileContains(dir, 'k8s/ingress.yaml', 'name: myapp-ingress'))
      errors.push('ingress.yaml should contain myapp-ingress')
    if (!await fileContains(dir, 'k8s/hpa.yaml', 'name: myapp-hpa'))
      errors.push('hpa.yaml should contain myapp-hpa')
    return errors
  }),

  () => runTest('K8s HPA has min=2 max=10', ['kubernetes'], 'typescript', async (dir) => {
    const errors: string[] = []
    if (!await fileContains(dir, 'k8s/hpa.yaml', 'minReplicas: 2'))
      errors.push('hpa.yaml missing minReplicas: 2')
    if (!await fileContains(dir, 'k8s/hpa.yaml', 'maxReplicas: 10'))
      errors.push('hpa.yaml missing maxReplicas: 10')
    return errors
  }),

  // ── Nginx ─────────────────────────────────────────────────────────────────
  () => runTest('Nginx conf created', ['nginx'], 'typescript', async (dir) => {
    const errors: string[] = []
    if (!await fileExists(dir, 'nginx/nginx.conf')) errors.push('Missing nginx/nginx.conf')
    return errors
  }),

  () => runTest('Nginx has rate limiting', ['nginx'], 'typescript', async (dir) => {
    const errors: string[] = []
    if (!await fileContains(dir, 'nginx/nginx.conf', 'limit_req_zone'))
      errors.push('nginx.conf missing limit_req_zone')
    if (!await fileContains(dir, 'nginx/nginx.conf', 'limit_conn_zone'))
      errors.push('nginx.conf missing limit_conn_zone')
    return errors
  }),

  () => runTest('Nginx port = 8000 for Python', ['nginx'], 'python', async (dir) => {
    const errors: string[] = []
    if (!await fileContains(dir, 'nginx/nginx.conf', 'server app:8000'))
      errors.push('Python nginx should upstream to port 8000')
    return errors
  }),

  () => runTest('Nginx port = 3000 for Node', ['nginx'], 'typescript', async (dir) => {
    const errors: string[] = []
    if (!await fileContains(dir, 'nginx/nginx.conf', 'server app:3000'))
      errors.push('Node nginx should upstream to port 3000')
    return errors
  }),

  () => runTest('Nginx has TLS config', ['nginx'], 'typescript', async (dir) => {
    const errors: string[] = []
    if (!await fileContains(dir, 'nginx/nginx.conf', 'ssl_protocols'))
      errors.push('nginx.conf missing ssl_protocols')
    if (!await fileContains(dir, 'nginx/nginx.conf', 'listen 443 ssl http2'))
      errors.push('nginx.conf missing HTTPS listener')
    return errors
  }),

  // ── Traefik ───────────────────────────────────────────────────────────────
  () => runTest('Traefik files created', ['traefik'], 'typescript', async (dir) => {
    const errors: string[] = []
    if (!await fileExists(dir, 'traefik/traefik.yml')) errors.push('Missing traefik/traefik.yml')
    if (!await fileExists(dir, 'traefik/dynamic.yml')) errors.push('Missing traefik/dynamic.yml')
    return errors
  }),

  () => runTest('Traefik has HTTPS redirect', ['traefik'], 'typescript', async (dir) => {
    const errors: string[] = []
    if (!await fileContains(dir, 'traefik/traefik.yml', 'scheme: https'))
      errors.push('traefik.yml missing HTTPS redirect')
    return errors
  }),

  () => runTest('Traefik dynamic has rate limit middleware', ['traefik'], 'typescript', async (dir) => {
    const errors: string[] = []
    if (!await fileContains(dir, 'traefik/dynamic.yml', 'rateLimit'))
      errors.push('dynamic.yml missing rateLimit middleware')
    if (!await fileContains(dir, 'traefik/dynamic.yml', 'average: 100'))
      errors.push('dynamic.yml missing average: 100')
    return errors
  }),

  // ── Kafka ─────────────────────────────────────────────────────────────────
  () => runTest('Kafka compose created', ['kafka'], 'typescript', async (dir) => {
    const errors: string[] = []
    if (!await fileExists(dir, 'kafka-compose.yml')) errors.push('Missing kafka-compose.yml')
    return errors
  }),

  () => runTest('Kafka compose has zookeeper + kafka + ui', ['kafka'], 'typescript', async (dir) => {
    const errors: string[] = []
    if (!await fileContains(dir, 'kafka-compose.yml', 'confluentinc/cp-zookeeper:7.5.0'))
      errors.push('kafka-compose.yml missing zookeeper image (7.5.0)')
    if (!await fileContains(dir, 'kafka-compose.yml', 'confluentinc/cp-kafka:7.5.0'))
      errors.push('kafka-compose.yml missing kafka image (7.5.0)')
    if (!await fileContains(dir, 'kafka-compose.yml', 'provectuslabs/kafka-ui'))
      errors.push('kafka-compose.yml missing kafka-ui')
    return errors
  }),

  () => runTest('Kafka port 9092', ['kafka'], 'typescript', async (dir) => {
    const errors: string[] = []
    if (!await fileContains(dir, 'kafka-compose.yml', '"9092:9092"'))
      errors.push('kafka-compose.yml missing port 9092')
    return errors
  }),

  // ── RabbitMQ ──────────────────────────────────────────────────────────────
  () => runTest('RabbitMQ compose created', ['rabbitmq'], 'typescript', async (dir) => {
    const errors: string[] = []
    if (!await fileExists(dir, 'rabbitmq-compose.yml')) errors.push('Missing rabbitmq-compose.yml')
    return errors
  }),

  () => runTest('RabbitMQ image version 3.13-management', ['rabbitmq'], 'typescript', async (dir) => {
    const errors: string[] = []
    if (!await fileContains(dir, 'rabbitmq-compose.yml', 'rabbitmq:3.13-management'))
      errors.push('rabbitmq-compose.yml should use rabbitmq:3.13-management')
    return errors
  }),

  () => runTest('RabbitMQ has management UI port 15672', ['rabbitmq'], 'typescript', async (dir) => {
    const errors: string[] = []
    if (!await fileContains(dir, 'rabbitmq-compose.yml', '"15672:15672"'))
      errors.push('rabbitmq-compose.yml missing management port 15672')
    return errors
  }),

  () => runTest('RabbitMQ has healthcheck', ['rabbitmq'], 'typescript', async (dir) => {
    const errors: string[] = []
    if (!await fileContains(dir, 'rabbitmq-compose.yml', 'rabbitmq-diagnostics'))
      errors.push('rabbitmq-compose.yml missing healthcheck')
    return errors
  }),

  // ── Multi-tool combinations ───────────────────────────────────────────────
  () => runTest('All infra tools together', ['kubernetes','nginx','traefik','kafka','rabbitmq'], 'typescript', async (dir) => {
    const errors: string[] = []
    const expected = [
      'k8s/deployment.yaml', 'k8s/service.yaml', 'k8s/ingress.yaml', 'k8s/hpa.yaml', 'k8s/secret.yaml',
      'nginx/nginx.conf',
      'traefik/traefik.yml', 'traefik/dynamic.yml',
      'kafka-compose.yml',
      'rabbitmq-compose.yml',
    ]
    for (const f of expected) {
      if (!await fileExists(dir, f)) errors.push(`Missing: ${f}`)
    }
    return errors
  }),

  () => runTest('No files when no infra tools selected', [], 'typescript', async (dir) => {
    const errors: string[] = []
    const unexpected = ['k8s', 'nginx', 'traefik', 'kafka-compose.yml', 'rabbitmq-compose.yml']
    for (const f of unexpected) {
      if (await fileExists(dir, f)) errors.push(`Unexpected file/dir created: ${f}`)
    }
    return errors
  }),

  () => runTest('Unrelated tools dont trigger infra files', ['docker', 'terraform', 'sentry'], 'typescript', async (dir) => {
    const errors: string[] = []
    if (await fileExists(dir, 'k8s')) errors.push('k8s/ should not exist without kubernetes tool')
    if (await fileExists(dir, 'nginx')) errors.push('nginx/ should not exist without nginx tool')
    if (await fileExists(dir, 'kafka-compose.yml')) errors.push('kafka-compose.yml should not exist without kafka tool')
    return errors
  }),
]

// ── Runner ───────────────────────────────────────────────────────────────────
async function main() {
  console.log('\n envsetup CLI — Infrastructure Generation Tests')
  console.log(' ' + '─'.repeat(55) + '\n')

  let passed = 0, failed = 0

  for (const t of tests) {
    const result = await t()
    if (result.ok) {
      passed++
      console.log(`  ✅  ${result.label}`)
    } else {
      failed++
      console.log(`  ❌  ${result.label}`)
      result.errors.forEach(e => console.log(`        → ${e}`))
    }
  }

  console.log('\n ' + '─'.repeat(55))
  console.log(`  ✅ ${passed} passed   ❌ ${failed} failed   📊 ${tests.length} total\n`)
  process.exit(failed > 0 ? 1 : 0)
}

main().catch(e => { console.error(e); process.exit(1) })
