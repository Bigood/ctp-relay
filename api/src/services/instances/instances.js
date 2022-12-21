import { db } from 'src/lib/db'
import {randomBytes} from 'crypto'

export const instances = () => {
  return db.instance.findMany()
}

export const instance = ({ id }) => {
  return db.instance.findUnique({
    where: { id },
  })
}

export const createInstance = ({ input }) => {
  const token = randomBytes(16).toString('hex');
  const secret = randomBytes(32).toString('hex');

  return db.instance.create({
    data: {
      ...input,
      secret,
      token,
    },
  })
}

export const updateInstance = ({ id, input }) => {
  return db.instance.update({
    data: input,
    where: { id },
  })
}

export const deleteInstance = ({ id }) => {
  return db.instance.delete({
    where: { id },
  })
}

export const Instance = {
  messages: (_obj, { root }) => {
    return db.instance.findUnique({ where: { id: root?.id } }).messages()
  },
  messagesDelivered: (_obj, { root }) => {
    return db.instance
      .findUnique({ where: { id: root?.id } })
      .messagesDelivered()
  },
}
