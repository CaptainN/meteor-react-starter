import {Meteor} from 'meteor/meteor'

Meteor.AppCache.config({
  onlineOnly: [
    '/sw.js',
    '/webapp-manifest.json',
    '/favicon.ico'
  ]
})
