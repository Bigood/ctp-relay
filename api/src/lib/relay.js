import faktory from 'faktory-worker'
import { db } from 'src/lib/db'
import {
  signPayload
} from '@redwoodjs/api/webhooks'
import { logger } from './logger'

import fetch from 'cross-fetch'

const RECEIVE_ROUTE = ".redwood/functions/receiveMessage"

export const HTTPMETHOD_PER_OPERATION = {
  "create" : "PUT",
  "update" : "POST",
  "delete" : "DELETE",
}
/**
 * Envoyer le message aux autres instances, avcec signature dans X-CTP-Message-Signature
 *
 * @param {entity:object, payload: object, entity: string} message A transmettre, avec entity et message
 * @param {object} fromInstance Instance dont le message vient, à exclure des destinataires
 */
export const sendMessageToInstances = async (message, fromInstance) => {
  const instances = await db.instance.findMany({
    where: { NOT: { id: fromInstance.id }},
    select: { id: true, host: true, secret: true, version: true }
  })
  const requestsForInstances = instances.map(instance => prepareRequestForInstance(instance, message, fromInstance))

  // Envoi dans la file de traitement de faktory
  const client = await faktory.connect()

  //https://github.com/jbielick/faktory_worker_node#pushing-bulk-jobs
  const tasks = requestsForInstances.map(request => client.job('sendRequestToInstance', request));
  console.log(tasks);
  let rejected = await client.pushBulk(tasks);

  // rejected is a dictionary of [jid]: { payload, reason } if any failed to enqueue
  for (const [jid, { payload, reason }] of Object.entries(rejected)) {
    console.error(`Failed to push job for instance ${JSON.stringify(payload, null, 2)}; ${JSON.stringify(reason, null, 2)}`);
  }

  await client.close()
}

/**
 * Envoyer le message aux autres instances, avcec signature dans X-CTP-Message-Signature
 *
 * @param {entity:object, payload: object, entity: string} message A transmettre, avec entity et message
 * @param {object} fromInstance Instance dont le message vient, à exclure des destinataires
 */
export const sendMessageToInstancesSync = async (message, fromInstance) => {
  const instances = await db.instance.findMany({
    where: { NOT: { id: fromInstance.id } },
    select: { id: true, host: true, secret: true, version: true }
  })
  const requestsForInstances = instances.map(instance => prepareRequestForInstance(instance, message, fromInstance))

  const requests = requestsForInstances.map(sendRequestToInstance)

  return Promise.allSettled(requests)
    .then(results => {
      results.forEach(result => {
        if (result.status == "fulfilled")
          logger.debug({ custom: result }, "Fetch OK")
        else {
          logger.error({ custom: result }, "Fetch failed")
          throw result
        }
      })
    })
}

export const prepareRequestForInstance = (instance, { operation, entity, payload }, fromInstance) => {
  const body = {
    instance: {
      id: fromInstance.id,
      host: fromInstance.host,
      version: fromInstance.version,
    },
    entity,
    timestamp: Date.now(),
    payload: JSON.parse(payload), //Pour éviter un double stringify
  }
  const bodyString = JSON.stringify(body);
  //Compute de la signature
  const signature = signPayload("sha256Verifier", { payload: bodyString, secret: instance.secret })
  //{signatureHeader: "X-CTP-Message-Signature", eventTimestamp: payload.timestamp}
  return { body: bodyString, signature, url: `https://${instance.host}/${RECEIVE_ROUTE}`, method: HTTPMETHOD_PER_OPERATION[operation] }
}

export const sendRequestToInstance = (data) => {
  logger.debug({ custom: data }, "Fetch prévu pour data")
  return new Promise((resolve, reject) => fetch(
    data.url,
    {
      method: data.method,
      headers: {
        "Cache-Control": "no-cache",
        "Accept": "*/*",
        // "Accept-Encoding": "gzip, deflate, br",
        // "Connection": "keep-alive",
        "Content-Type": "application/json",
        "X-CTP-Message-Signature": data.signature
      },
      body: data.body
    },
  )
    .then(response => {
      if (response.ok)
        resolve(response.json())
      reject(new Error(response.status))
    })
    .catch(err => { reject(new Error(err)) })
  )
}