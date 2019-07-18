import { Meteor } from 'meteor/meteor'

/**
 * All of this is to get a simple boolean flag for whether the user is logged in on the client or not.
 * If the user is not logged in, we can safely render on the server, otherwise we skip it.
 */

Meteor.startup(() => {
  resetToken()
})

// override Meteor._localStorage methods and resetToken accordingly
const originalSetItem = Meteor._localStorage.setItem
Meteor._localStorage.setItem = (key, value) => {
  if (key === 'Meteor.loginToken') {
    Meteor.defer(resetToken)
  }
  originalSetItem.call(Meteor._localStorage, key, value)
}

const originalRemoveItem = Meteor._localStorage.removeItem
Meteor._localStorage.removeItem = (key) => {
  if (key === 'Meteor.loginToken') {
    Meteor.defer(resetToken)
  }
  originalRemoveItem.call(Meteor._localStorage, key)
}

function resetToken () {
  const loginToken = Meteor._localStorage.getItem('Meteor.loginToken')
  const loginTokenExpires = new Date(Meteor._localStorage.getItem('Meteor.loginTokenExpires'))

  if (loginToken) {
    setCookie('sssr', 1, loginTokenExpires)
  } else {
    setCookie('sssr', '', -1)
  }
}

function setCookie (name, value, date, path = '/') {
  const expires = date === -1
    ? 'expires=Thu, 01 Jan 1970 00:00:01 GMT'
    : 'expires= ' + date.toUTCString()
  document.cookie = name + '=' + value + ';' + expires + ';path=' + path
}
