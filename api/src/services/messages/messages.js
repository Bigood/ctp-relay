import { db } from 'src/lib/db'
import { logger } from 'src/lib/logger'

import { createDecipheriv, randomBytes } from 'crypto'
import { sendMessageToInstances } from 'src/lib/relay'



export const messages = () => {
  return db.message.findMany()
}


export const messagesFromInstance = ({ id }) => {
  return db.message.findMany({where: {instanceId : id}})
}

export const message = ({ id }) => {
  return db.message.findUnique({
    where: { id },
  })
}

export const createMessage = ({ input }) => {
  return db.message.create({
    data: input,
  })
}
//https://redwoodjs.com/docs/graphql#redwoods-resolver-args
/** */
export const createMessageFromClient = async ({operation, payload, entity}, gqlArgs ) => {
  // logger.debug({ custom: gqlArgs.context }, "createMessageFromClient")

  //Récupération du token de l'instance, configuré sur l'instance dans l'env RELAY_CLIENT_TOKEN.
  const instanceTokenMatch = gqlArgs.context.event.headers?.authorization?.match(/Bearer (.*)$/);
  if (!instanceTokenMatch){
    logger.error({ custom: gqlArgs.context.event}, "Instance not authorized")
    return null;
  }  
  //Récupérer l'instance appelante
  const instance = await db.instance.findUnique({ where: { token: instanceTokenMatch[1] }, select: { id: true, host: true }})

  if (!instance) {
    logger.error({ custom: instanceTokenMatch }, "Instance not found")
    return null;
  }  
  
  logger.debug({ custom: {instanceTokenMatch, instance} }, "Instance connectée")

  //https://fireship.io/lessons/node-crypto-examples/
  //Encryption also has an initialization vector (IV) to randomize the pattern so a sequence of text won’t produce the same output as a previous sequence.
  // const iv = randomBytes(16);
  // const decipher = createDecipheriv('aes256', Buffer.from(instance.secret, 'hex'), Buffer.from(instance.token, 'hex'));
  // const decryptedMessage = decipher.update(payload, 'hex', 'utf-8') + decipher.final('utf8');

  logger.debug({ custom: { payload } }, "Instance connectée")

  const message = db.message.create({
    data: {
      from: {connect: {id: instance.id}},
      entity: entity,
      payload: payload,
      operation
    },
  })

  const res = await sendMessageToInstances({operation, entity, payload}, instance);
  
  return message;
}

export const updateMessage = ({ id, input }) => {
  return db.message.update({
    data: input,
    where: { id },
  })
}

export const deleteMessage = ({ id }) => {
  return db.message.delete({
    where: { id },
  })
}

export const sendMessage = async ({ id }) => {
  const message = await db.message.findUnique({
    where: { id },
    select: {
      id: true,
      operation: true,
      entity: true,
      payload: true,
      from: true,
      deliveredTo: true,
    }
  })
  return sendMessageToInstances(message, message.from)
}

export const Message = {
  from: (_obj, { root }) => {
    return db.message.findUnique({ where: { id: root?.id } }).from()
  },
  deliveredTo: (_obj, { root }) => {
    return db.message.findUnique({ where: { id: root?.id } }).deliveredTo()
  },
}
