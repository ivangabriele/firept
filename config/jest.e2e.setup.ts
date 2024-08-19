import { spawn } from 'node:child_process'
import { B } from 'bhala'
import tcpPortUsed from 'tcp-port-used'

const { PORT } = process.env

// biome-ignore lint/style/noDefaultExport: <explanation>
export default async () => {
  B.info('[E2E]', 'Starting server...')
  spawn('yarn', ['start'], {
    stdio: 'inherit',
    shell: true,
  })

  B.info('[E2E]', 'Waiting for server to start...')
  await tcpPortUsed.waitUntilUsed(Number(PORT), 250, 5000)
}
