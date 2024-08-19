import killPort from 'kill-port'
import tcpPortUsed from 'tcp-port-used'

const PORT = process.env.PORT ? Number(process.env.PORT) : 3333

// biome-ignore lint/style/noDefaultExport: <explanation>
export default async () => {
  console.info('[E2E]', 'Stopping server...')
  await killPort(PORT)

  console.info('[E2E]', 'Waiting for server to stop...')
  await tcpPortUsed.waitUntilFree(PORT, 250, 5000)
}
