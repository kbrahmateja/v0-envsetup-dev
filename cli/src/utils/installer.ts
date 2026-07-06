import { execSync, spawnSync } from 'child_process'
import pc from 'picocolors'
import os from 'os'

const isMac = os.platform() === 'darwin'
const isLinux = os.platform() === 'linux'
const isWin = os.platform() === 'win32'

function hasBrew(): boolean {
  try { execSync('brew --version', { stdio: 'pipe' }); return true } catch { return false }
}
function hasApt(): boolean {
  try { execSync('apt --version', { stdio: 'pipe' }); return true } catch { return false }
}

// Install commands per tool per OS
export const INSTALL_COMMANDS: Record<string, {
  mac?: string; linux?: string; win?: string
  notes?: string; requiresSudo?: boolean
}> = {
  // Languages
  'rust': {
    mac: 'curl --proto "=https" --tlsv1.2 -sSf https://sh.rustup.rs | sh -s -- -y',
    linux: 'curl --proto "=https" --tlsv1.2 -sSf https://sh.rustup.rs | sh -s -- -y',
    notes: 'Restart terminal after install'
  },
  'kotlin': {
    mac: 'brew install kotlin',
    linux: 'snap install --classic kotlin',
    notes: 'Requires Java 17+'
  },
  'flutter': {
    mac: 'brew install --cask flutter',
    linux: 'snap install flutter --classic',
    notes: 'Run flutter doctor after install'
  },
  'elixir': {
    mac: 'brew install elixir',
    linux: 'apt-get install -y elixir',
    notes: 'Includes Erlang/OTP'
  },
  'dart': {
    mac: 'brew tap dart-lang/dart && brew install dart',
    linux: 'apt-get install -y dart',
  },
  'scala': {
    mac: 'brew install scala',
    linux: 'apt-get install -y scala',
  },
  'dotnet': {
    mac: 'brew install --cask dotnet',
    linux: 'apt-get install -y dotnet-sdk-8.0',
    notes: '.NET 8 LTS'
  },
  // Package managers / tools
  'composer': {
    mac: 'brew install composer',
    linux: 'apt-get install -y composer',
  },
  'poetry': {
    mac: 'pip3 install poetry',
    linux: 'pip3 install poetry',
  },
  'pyenv': {
    mac: 'brew install pyenv',
    linux: 'curl https://pyenv.run | bash',
    notes: 'Add to ~/.zshrc: eval "$(pyenv init -)"'
  },
  'rbenv': {
    mac: 'brew install rbenv ruby-build',
    linux: 'apt-get install -y rbenv',
    notes: 'Run: rbenv install 3.3.0 && rbenv global 3.3.0'
  },
  'rails': {
    mac: 'gem install rails',
    linux: 'gem install rails',
  },
  'sdkman': {
    mac: 'curl -s "https://get.sdkman.io" | bash',
    linux: 'curl -s "https://get.sdkman.io" | bash',
    notes: 'Manages Java, Kotlin, Gradle versions'
  },
  'golangci': {
    mac: 'brew install golangci-lint',
    linux: 'curl -sSfL https://raw.githubusercontent.com/golangci/golangci-lint/master/install.sh | sh',
  },
  'vapor': {
    mac: 'brew install vapor',
    notes: 'Mac only'
  },
  'laravel': {
    mac: 'composer global require laravel/installer',
    linux: 'composer global require laravel/installer',
    notes: 'Requires Composer'
  },
  'podman': {
    mac: 'brew install podman',
    linux: 'apt-get install -y podman',
  },
  'pnpm': {
    mac: 'npm install -g pnpm',
    linux: 'npm install -g pnpm',
    win: 'npm install -g pnpm',
  },
  'bun': {
    mac: 'curl -fsSL https://bun.sh/install | bash',
    linux: 'curl -fsSL https://bun.sh/install | bash',
  },
  'deno': {
    mac: 'brew install deno',
    linux: 'curl -fsSL https://deno.land/install.sh | sh',
  },
  'react-native': {
    mac: 'npm install -g react-native-cli',
    linux: 'npm install -g react-native-cli',
    win: 'npm install -g react-native-cli',
  },
  'expo': {
    mac: 'npm install -g expo-cli',
    linux: 'npm install -g expo-cli',
    win: 'npm install -g expo-cli',
  },
  'ionic': {
    mac: 'npm install -g @ionic/cli',
    linux: 'npm install -g @ionic/cli',
    win: 'npm install -g @ionic/cli',
  },
  'gh': {
    mac: 'brew install gh',
    linux: 'apt-get install -y gh',
  },
  'jq': {
    mac: 'brew install jq',
    linux: 'apt-get install -y jq',
  },
  'kubectl': {
    mac: 'brew install kubectl',
    linux: 'snap install kubectl --classic',
  },
  'sbt': {
    mac: 'brew install sbt',
    linux: 'apt-get install -y sbt',
  },
}

export function getInstallCommand(toolKey: string): string | null {
  const info = INSTALL_COMMANDS[toolKey]
  if (!info) return null
  if (isMac) return info.mac ?? null
  if (isLinux) return info.linux ?? null
  if (isWin) return info.win ?? null
  return null
}

export function installTool(toolKey: string, label: string): boolean {
  const cmd = getInstallCommand(toolKey)
  if (!cmd) {
    console.log(pc.yellow(`  No auto-install available for ${label} on this OS`))
    return false
  }

  const info = INSTALL_COMMANDS[toolKey]
  console.log(pc.dim(`\n  Running: ${cmd}`))
  if (info?.notes) console.log(pc.dim(`  Note: ${info.notes}`))

  try {
    const result = spawnSync('sh', ['-c', cmd], { stdio: 'inherit' })
    if (result.status === 0) {
      console.log(pc.green(`\n  ✔ ${label} installed successfully!`))
      if (info?.notes) console.log(pc.yellow(`  ⚠️  ${info.notes}`))
      return true
    } else {
      console.log(pc.red(`\n  ✘ Installation failed`))
      return false
    }
  } catch (err) {
    console.log(pc.red(`\n  ✘ Error: ${err}`))
    return false
  }
}
