import { createHmac } from 'crypto'
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
 * @param {entity:object, payload: object} message A transmettre, avec entity et message
 * @param {object} fromInstance Instance dont le message vient, à exclure des destinataires
 */
export const sendMessageToInstances = async ({operation, entity, payload}, fromInstance) => {
  const instances = await db.instance.findMany({
    where: { NOT: { id: fromInstance.id }}, 
    select: { id: true, host: true, secret: true, version: true }
  })
  const tasks = instances.map(instance => {
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
    const signature = signPayload("sha256Verifier", { payload: bodyString, secret:instance.secret})
    //{signatureHeader: "X-CTP-Message-Signature", eventTimestamp: payload.timestamp}
    return { body: bodyString, signature, url: `https://${instance.host}/${RECEIVE_ROUTE}` }
  })

  const requests = tasks.map(task => {
    logger.debug({ custom: task }, "Fetch prévu pour task")
    return fetch(
      task.url,
      {
        method: HTTPMETHOD_PER_OPERATION[operation],
        headers: {
          "Cache-Control": "no-cache",
          "Accept": "*/*",
          // "Accept-Encoding": "gzip, deflate, br",
          // "Connection": "keep-alive",
          "Content-Type": "application/json",
          "X-CTP-Message-Signature": task.signature
        },
        body: task.body
      },
    )
      .then(response => {
        if (response.ok)
          response.json()
        throw response.status
      })
      .catch(err => { throw err })
  })
  //TODO : Envoyer à faktory
  //https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Global_Objects/Promise/allSettled
  return Promise.allSettled(requests)
  .then(results => {
    results.forEach(result => {
      if(result.status == "fulfilled")
        logger.debug({ custom: result }, "Fetch OK")
      else
        logger.error({ custom: result }, "Fetch failed")
    })
  })
}