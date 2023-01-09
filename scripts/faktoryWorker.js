import { sendMessageToInstances, sendRequestToInstance } from '$api/src/lib/relay'
import { logger } from '$api/src/lib/logger'

import faktory from 'faktory-worker'

faktory.register('sendMessageToInstances', async (message, fromInstance) => {
  logger.info("running sendMessageToInstances in background worker")

  await sendMessageToInstances(message, fromInstance)
})

//Appellé pour chaque instance par sendMessageToInstances
faktory.register('sendRequestToInstance', async (request) => {
  logger.info("running sendRequestToInstance in background worker")

  await sendRequestToInstance(request)
})

export default async ({ _args }) => {
  const worker = await faktory
    .work({
      url: process.env.FAKTORY_URL,
      queues: ["relay"]
    })
    .catch((error) => {
      logger.error(`worker failed to start: ${error}`)
      process.exit(1)
    })

  worker.on('fail', ({ _job, error }) => {
    logger.error(`worker failed to start: ${error}`)
  })
}

