/** @type {import('eslint').Linter.Config[]} */
const config = [
  {
    ignores: [
      "node_modules/**",
      ".next/**",
      "out/**",
      "dist/**",
      "cli/**",
      "mcp-server/**",
    ],
  },
]

export default config
