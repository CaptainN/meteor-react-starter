import './service-worker'

import { onPageLoad } from 'meteor/server-render'
import React from 'react'
import Loadable from 'react-loadable'
import { HelmetProvider } from 'react-helmet-async'
import { hydrate } from 'react-dom'
import { BrowserRouter } from 'react-router-dom'

h = React.createElement // eslint-disable-line

onPageLoad(async sink => {
  let { App } = (await import('/imports/App'))

  if (window.__preloadables__) {
    await Loadable.preloadablesReady(window.__preloadables__)
  }

  const helmetContext = {}
  hydrate(
    <HelmetProvider context={helmetContext}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </HelmetProvider>,
    document.getElementById('root')
  )
})
