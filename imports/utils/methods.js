import {Meteor} from 'meteor/meteor'

export const callAsync = (methodName, ...args) => new Promise(
  (resolve, reject) => Meteor.call(methodName, ...args, (error, result) => {
    if (error) reject(error)
    resolve(result)
  })
)

const Methods = new Proxy({}, {
  get: (obj, key) => (...args) => callAsync(key, ...args)
})

export default Methods
