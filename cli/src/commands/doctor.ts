import { confirm, isCancel } from '@clack/prompts'
import { spinner } from '@clack/prompts'
import { execSync } from 'child_process'
import pc from 'picocolors'
import { getInstallCommand, installTool } from '../utils/installer.js'

interface CheckResult {
  name: string
  status: 'ok' | 'missing' | 'optional'
  version?: string
  installHint?: string
}

function check(cmd: string, name: string, installHint?: string, optional = false): CheckResult {
  try {
    const version = execSync(cmd, { stdio: 'pipe' }).toString().trim().split('\n')[0]
    return { name, status: 'ok', version }
  } catch {
    return { name, status: optional ? 'optional' : 'missing', installHint }
  }
}

function checkDocker(): CheckResult {
  try {
    execSync('docker info', { stdio: 'pipe' })
    const version = execSync('docker --version', { stdio: 'pipe' }).toString().trim()
    return { name: 'Docker (daemon running)', status: 'ok', version }
  } catch {
    try {
      const version = execSync('docker --version', { stdio: 'pipe' }).toString().trim()
      return {
        name: 'Docker (installed but NOT running)',
        status: 'missing',
        version,
        installHint: 'Start Docker Desktop or run: sudo systemctl start docker'
      }
    } catch {
      return {
        name: 'Docker',
        status: 'optional',
        installHint: 'https://docs.docker.com/get-docker/'
      }
    }
  }
}

const stackChecks: Record<string, () => CheckResult[]> = {
  // Mobile — iOS
  'ios-swift': () => [
    check('xcodebuild -version', 'Xcode', 'Install from App Store or xcode-select --install'),
    check('swift --version', 'Swift', 'Install Xcode'),
    check('pod --version', 'CocoaPods', 'sudo gem install cocoapods', true),
    check('swift package --version', 'Swift Package Manager', 'Included with Swift'),
    check('xcrun simctl list', 'iOS Simulator', 'Install Xcode'),
    check('fastlane --version', 'Fastlane', 'gem install fastlane', true),
  ],
  // Mobile — Android
  'android-kt': () => [
    check('java -version 2>&1', 'Java (JDK 17+)', 'https://adoptium.net/'),
    check('kotlin -version', 'Kotlin', 'https://kotlinlang.org/'),
    { name: 'Android Studio', status: 'optional', installHint: 'https://developer.android.com/studio' },
    check('adb --version', 'ADB (Android Debug Bridge)', 'Install Android SDK', true),
    check('gradle --version', 'Gradle', 'https://gradle.org/install/', true),
  ],
  // Mobile — React Native
  'react-native': () => [
    check('node --version', 'Node.js', 'https://nodejs.org/'),
    check('npm --version', 'npm', 'Included with Node.js'),
    check('npx react-native --version', 'React Native CLI', 'npm install -g react-native-cli', true),
    check('java -version 2>&1', 'Java (for Android)', 'https://adoptium.net/', true),
    check('adb --version', 'ADB (Android)', 'Install Android SDK', true),
    check('xcodebuild -version', 'Xcode (for iOS)', 'Install from App Store', true),
  ],
  // Mobile — Expo
  'expo': () => [
    check('node --version', 'Node.js', 'https://nodejs.org/'),
    check('npm --version', 'npm', 'Included with Node.js'),
    check('npx expo --version', 'Expo CLI', 'npm install -g expo-cli'),
    check('eas --version', 'EAS CLI', 'npm install -g eas-cli', true),
  ],
  // Mobile — Flutter
  'flutter': () => [
    check('flutter --version', 'Flutter SDK', 'https://flutter.dev/docs/get-started/install'),
    check('dart --version', 'Dart SDK', 'Included with Flutter'),
    check('xcodebuild -version', 'Xcode (for iOS)', 'Install from App Store', true),
    check('java -version 2>&1', 'Java (for Android)', 'https://adoptium.net/', true),
    check('adb --version', 'ADB (for Android)', 'Install Android SDK', true),
  ],
  // Frontend
  'nextjs': () => [
    check('node --version', 'Node.js 18+', 'https://nodejs.org/'),
    check('npm --version', 'npm', 'Included with Node.js'),
    check('git --version', 'Git', 'https://git-scm.com/'),
    checkDocker(),
  ],
  // Python
  'fastapi': () => [
    check('python3 --version', 'Python 3.10+', 'https://python.org/'),
    check('pip3 --version', 'pip', 'Included with Python'),
    check('git --version', 'Git', 'https://git-scm.com/'),
    checkDocker(),
  ],
  'django': () => [
    check('python3 --version', 'Python 3.10+', 'https://python.org/'),
    check('pip3 --version', 'pip', 'Included with Python'),
    check('git --version', 'Git', 'https://git-scm.com/'),
    checkDocker(),
  ],
  // Java
  'springboot': () => [
    check('java -version 2>&1', 'Java 17+', 'https://adoptium.net/'),
    check('mvn --version', 'Maven', 'https://maven.apache.org/', true),
    check('gradle --version', 'Gradle', 'https://gradle.org/', true),
    check('git --version', 'Git', 'https://git-scm.com/'),
    checkDocker(),
  ],
  // Go
  'gin': () => [
    check('go version', 'Go 1.21+', 'https://go.dev/'),
    check('git --version', 'Git', 'https://git-scm.com/'),
    checkDocker(),
  ],
  'fiber': () => [
    check('go version', 'Go 1.21+', 'https://go.dev/'),
    check('git --version', 'Git', 'https://git-scm.com/'),
    checkDocker(),
  ],
  // Rust
  'actix': () => [
    check('rustc --version', 'Rust', 'curl --proto https --tlsv1.2 -sSf https://sh.rustup.rs | sh'),
    check('cargo --version', 'Cargo', 'Included with Rust'),
    check('git --version', 'Git', 'https://git-scm.com/'),
    checkDocker(),
  ],
  // PHP
  'laravel': () => [
    check('php --version', 'PHP 8.2+', 'https://php.net/'),
    check('composer --version', 'Composer', 'https://getcomposer.org/'),
    check('git --version', 'Git', 'https://git-scm.com/'),
    checkDocker(),
  ],
  // Ruby
  'rails': () => [
    check('ruby --version', 'Ruby 3.1+', 'https://www.ruby-lang.org/'),
    check('bundle --version', 'Bundler', 'gem install bundler'),
    check('git --version', 'Git', 'https://git-scm.com/'),
    checkDocker(),
  ],
}

// Generic fallback
const genericChecks = (): CheckResult[] => [
  check('git --version', 'Git', 'https://git-scm.com/'),
  check('node --version', 'Node.js', 'https://nodejs.org/', true),
  checkDocker(),
]

export async function doctorCommand(stack?: string) {
  const s = spinner()
  s.start('Checking your system...')

  const checks = stack && stackChecks[stack]
    ? stackChecks[stack]()
    : [
        check('node --version', 'Node.js', 'https://nodejs.org/'),
        check('git --version', 'Git', 'https://git-scm.com/'),
        checkDocker(),
        check('docker compose version', 'Docker Compose v2', 'Included with Docker Desktop', true),
      ]

  await new Promise(r => setTimeout(r, 800))
  s.stop('System check complete')

  console.log()
  const ok = checks.filter(c => c.status === 'ok')
  const missing = checks.filter(c => c.status === 'missing')
  const optional = checks.filter(c => c.status === 'optional')

  ok.forEach(c => console.log(`  ${pc.green('✔')} ${pc.bold(c.name)}: ${pc.dim(c.version ?? '')}`))
  optional.forEach(c => console.log(`  ${pc.yellow('○')} ${pc.bold(c.name)}: ${pc.dim('optional')} ${c.installHint ? pc.dim('→ ' + c.installHint) : ''}`))
  missing.forEach(c => {
    console.log(`  ${pc.red('✘')} ${pc.bold(c.name)}: ${pc.red('not found')}`)
    if (c.installHint) console.log(`    ${pc.dim('Install: ' + c.installHint)}`)
  })

  console.log()
  if (missing.length === 0) {
    console.log(pc.green('  ✨ Your system is ready!'))
    console.log()
    return
  }

  console.log(pc.yellow(`  ⚠️  ${missing.length} required tool(s) missing.`))
  console.log()

  // Offer to auto-install missing tools
  for (const tool of missing) {
    // Find install key from name
    const toolKey = tool.name.toLowerCase()
      .replace(/[^a-z0-9]/g, '-')
      .replace(/-+/g, '-')
    const cmd = getInstallCommand(toolKey)
    if (!cmd) continue

    const doInstall = await confirm({
      message: `Install ${tool.name}? (${pc.dim(cmd.substring(0, 60) + (cmd.length > 60 ? '...' : ''))})`,
    })
    if (isCancel(doInstall)) break
    if (doInstall) {
      installTool(toolKey, tool.name)
    }
  }
  console.log()
}
