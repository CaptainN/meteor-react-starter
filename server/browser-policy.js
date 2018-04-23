import { Meteor } from 'meteor/meteor'
import { BrowserPolicy } from 'meteor/browser-policy'

Meteor.startup(function () {
  // BrowserPolicy.content.allowStyleOrigin('fonts.googleapis.com')
  // BrowserPolicy.content.allowFontOrigin('fonts.gstatic.com')

  // ionic font
  // BrowserPolicy.content.allowStyleOrigin('code.ionicframework.com')
  // BrowserPolicy.content.allowFontOrigin('code.ionicframework.com')

  // font awesome
  // BrowserPolicy.content.allowStyleOrigin('maxcdn.bootstrapcdn.com')
  // BrowserPolicy.content.allowFontOrigin('maxcdn.bootstrapcdn.com')

  // WP Engine CDN
  // BrowserPolicy.content.allowImageOrigin('*.wpengine.netdna-cdn.com')

  // TinyMCE
  // BrowserPolicy.content.allowStyleOrigin('www.tinymce.com')
  // BrowserPolicy.content.allowFontOrigin('www.tinymce.com')
  // BrowserPolicy.content.allowScriptOrigin('cloud.tinymce.com')
  // BrowserPolicy.content.allowScriptOrigin('plugins.tinymce.com')
  // BrowserPolicy.content.allowStyleOrigin('cloud.tinymce.com')
  // BrowserPolicy.content.allowFontOrigin('cloud.tinymce.com')
  // BrowserPolicy.content.allowImageOrigin('sp.tinymce.com')

  // Allow content from blobs (stored in RTB inputs for example)
  // BrowserPolicy.content.allowImageOrigin('blob:')
  // var constructedCsp = BrowserPolicy.content._constructCsp()
  // BrowserPolicy.content.setPolicy(constructedCsp + ' media-src blob:;')

  // Allow iframe content from anywhere
  // BrowserPolicy.content.allowFrameOrigin('*')

  // Allow any site to frame this one
  // BrowserPolicy.framing.allowAll()
})
