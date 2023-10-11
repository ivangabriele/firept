import { spawn } from 'child_process'
import tcpPortUsed from 'tcp-port-used'

const PORT = process.env.PORT ? Number(process.env.PORT) : 3333

export default async () => {
  console.info()

  console.info('[E2E]', 'Starting server...')
  spawn('yarn', ['start'], {
    stdio: 'inherit',
    shell: true,
  })

  console.info('[E2E]', 'Waiting for server to start...')
  await tcpPortUsed.waitUntilUsed(PORT, 250, 5000)
}
