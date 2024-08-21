import ky from 'ky'

async function waitForInMs(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

async function waitForServer(leftRetries): Promise<void> {
  try {
    await ky.get('http://localhost:9999')

    return
  } catch {
    await waitForInMs(500)
    if (leftRetries === 0) {
      throw new Error('Server is not running')
    }

    return waitForServer(leftRetries - 1)
  }
}

beforeAll(async () => {
  await waitForServer(10)
}, 15000)
