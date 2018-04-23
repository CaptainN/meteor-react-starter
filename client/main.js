import './service-worker'

import { onPageLoad } from 'meteor/server-render'
import React from 'react'
import Loadable from 'react-loadable'
import { hydrate } from 'react-dom'
import { BrowserRouter } from 'react-router-dom'

h = React.createElement // eslint-disable-line

onPageLoad(async sink => {
  let App = (await import('/imports/App')).default

  if (window.__preloadables__) {
    await Loadable.preloadablesReady(window.__preloadables__)
    delete window.__preloadables__
  }

  hydrate(
    <BrowserRouter><App /></BrowserRouter>,
    document.getElementById('root')
  )
})
